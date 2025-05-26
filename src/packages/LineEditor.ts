import LiteGUI from ".";
import EventMitter from "./EventMitter";

interface LineEditorOptions {
    extraclass?: string;
    width?: number | string;
    height?: number;
    bgcolor?: string;
    pointscolor?: string;
    linecolor?: string;
    xrange?: [number, number];
    yrange?: [number, number];
    defaulty?: number;
    no_trespassing?: boolean;
    show_samples?: number;
    callback?: (value: number[][]) => void;
}

export class LineEditor extends EventMitter  {
    private canvas: HTMLCanvasElement;
    private selected: number = -1;
    private last_mouse: [number, number] = [0, 0];
    
    public value: number[][];
    public xrange: [number, number];
    public yrange: [number, number];
    public defaulty: number;
    public no_trespassing: boolean;
    public show_samples: number;
    public bgcolor: string;
    public pointscolor: string;
    public linecolor: string;
    private options: LineEditorOptions;
    root: HTMLDivElement;

    constructor(value: number[][] = [], options: LineEditorOptions = {}) {
        super();
        this.root = document.createElement("div");
        
        this.root.className = "curve " + (options.extraclass || "");
        this.root.style.minHeight = "50px";
        this.root.style.width = options.width?.toString() || "100%";
        this.root.style.minWidth = "50px";
        this.root.style.minHeight = "20px";

        this.bgcolor = options.bgcolor || "#222";
        this.pointscolor = options.pointscolor || "#5AF";
        this.linecolor = options.linecolor || "#444";

        this.value = value;
        this.xrange = options.xrange || [0, 1];
        this.yrange = options.yrange || [0, 1];
        this.defaulty = options.defaulty ?? 0.5;
        this.no_trespassing = options.no_trespassing || false;
        this.show_samples = options.show_samples || 0;
        this.options = options;

        this.canvas = document.createElement("canvas");
        this.canvas.width = options.width as number || 200;
        this.canvas.height = options.height || 50;
        this.root.appendChild(this.canvas);

        this.root.addEventListener("mousedown", this.onmousedown.bind(this));
        this.redraw();
    }

    private convert(v: number[]): number[] {
        return [
            this.canvas.width * ((this.xrange[1] - this.xrange[0]) * v[0] + this.xrange[0]),
            this.canvas.height * ((this.yrange[1] - this.yrange[0]) * v[1] + this.yrange[0])
        ];
    }

    private unconvert(v: number[]): number[] {
        return [
            (v[0] / this.canvas.width - this.xrange[0]) / (this.xrange[1] - this.xrange[0]),
            (v[1] / this.canvas.height - this.yrange[0]) / (this.yrange[1] - this.yrange[0])
        ];
    }

    public getValueAt(x: number): number {
        if (x < this.xrange[0] || x > this.xrange[1]) {
            return this.defaulty;
        }

        let last: number[] = [this.xrange[0], this.defaulty];
        let f = 0;
        
        for (const v of this.value) {
            if (x === v[0]) return v[1];
            if (x < v[0]) {
                f = (x - last[0]) / (v[0] - last[0]);
                return last[1] * (1 - f) + v[1] * f;
            }
            last = v;
        }

        const v: number[] = [this.xrange[1], this.defaulty];
        f = (x - last[0]) / (v[0] - last[0]);
        return last[1] * (1 - f) + v[1] * f;
    }

    public resample(samples: number): number[] {
        const r: number[] = [];
        const dx = (this.xrange[1] - this.xrange[0]) / samples;
        for (let i = this.xrange[0]; i <= this.xrange[1]; i += dx) {
            r.push(this.getValueAt(i));
        }
        return r;
    }

    public addValue(v: number[]): void {
        for (let i = 0; i < this.value.length; i++) {
            const value = this.value[i];
            if (value[0] < v[0]) continue;
            this.value.splice(i, 0, v);
            this.redraw();
            return;
        }

        this.value.push(v);
        this.redraw();
    }

    public redraw(): void {
        const rect = this.root.getBoundingClientRect();
        if (rect && this.canvas.width !== rect.width && rect.width && rect.width < 1000) {
            this.canvas.width = rect.width;
        }
        if (rect && this.canvas.height !== rect.height && rect.height && rect.height < 1000) {
            this.canvas.height = rect.height;
        }

        const ctx = this.canvas.getContext("2d")!;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(0, this.canvas.height);
        ctx.scale(1, -1);

        // 绘制背景
        ctx.fillStyle = this.bgcolor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制线条
        ctx.strokeStyle = this.linecolor;
        ctx.beginPath();

        let pos = this.convert([this.xrange[0], this.defaulty]);
        ctx.moveTo(pos[0], pos[1]);

        for (const value of this.value) {
            pos = this.convert(value);
            ctx.lineTo(pos[0], pos[1]);
        }

        pos = this.convert([this.xrange[1], this.defaulty]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.stroke();

        // 绘制点
        for (let i = 0; i < this.value.length; i++) {
            const value = this.value[i];
            pos = this.convert(value);
            ctx.fillStyle = this.selected === i ? "white" : this.pointscolor;
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], this.selected === i ? 4 : 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制采样点
        if (this.show_samples) {
            const samples = this.resample(this.show_samples);
            ctx.fillStyle = "#888";
            for (let i = 0; i < samples.length; i++) {
                const value = [
                    i * ((this.xrange[1] - this.xrange[0]) / this.show_samples) + this.xrange[0],
                    samples[i]
                ];
                pos = this.convert(value);
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    private distance(a: number[], b: number[]): number {
        return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
    }

    private computeSelected(x: number, y: number): number {
        const max_dist = 8;
        let min_dist = 100000;
        let selected = -1;

        for (let i = 0; i < this.value.length; i++) {
            const value = this.value[i];
            const pos = this.convert(value);
            const dist = this.distance([x, y], pos);
            if (dist < min_dist && dist < max_dist) {
                min_dist = dist;
                selected = i;
            }
        }
        return selected;
    }

    private sortValues(): void {
        let v = null;
        if (this.selected !== -1) {
            v = this.value[this.selected];
        }
        this.value.sort((a, b) => a[0] - b[0]);
        if (v) {
            this.selected = this.value.indexOf(v);
        }
    }

    private onchange(): void {
        if (this.options.callback) {
            this.options.callback.call(this, this.value);
        } else {
            LiteGUI.trigger(this, "change");
        }
    }

    private onmousedown(evt: MouseEvent): void {
        document.addEventListener("mousemove", this.onmousemove.bind(this));
        document.addEventListener("mouseup", this.onmouseup.bind(this));

        const rect = this.canvas.getBoundingClientRect();
        const mousex = evt.clientX - rect.left;
        const mousey = evt.clientY - rect.top;

        this.selected = this.computeSelected(mousex, this.canvas.height - mousey);

        if (this.selected === -1) {
            const v = this.unconvert([mousex, this.canvas.height - mousey]);
            this.value.push(v);
            this.sortValues();
            this.selected = this.value.indexOf(v);
        }

        this.last_mouse = [mousex, mousey];
        this.redraw();
        evt.preventDefault();
        evt.stopPropagation();
    }

    private onmousemove(evt: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        let mousex = evt.clientX - rect.left;
        let mousey = evt.clientY - rect.top;

        mousex = Math.max(0, Math.min(mousex, this.canvas.width));
        mousey = Math.max(0, Math.min(mousey, this.canvas.height));

        if (this.selected !== -1 && 
            this.distance([evt.clientX - rect.left, evt.clientY - rect.top], [mousex, mousey]) > this.canvas.height * 0.5) {
            this.value.splice(this.selected, 1);
            this.onmouseup(evt);
            return;
        }

        const dx = this.last_mouse[0] - mousex;
        const dy = this.last_mouse[1] - mousey;
        const delta = this.unconvert([-dx, dy]);

        if (this.selected !== -1) {
            let minx = this.xrange[0];
            let maxx = this.xrange[1];

            if (this.no_trespassing) {
                if (this.selected > 0) minx = this.value[this.selected - 1][0];
                if (this.selected < (this.value.length - 1)) maxx = this.value[this.selected + 1][0];
            }

            const v = this.value[this.selected];
            v[0] = Math.max(minx, Math.min(maxx, v[0] + delta[0]));
            v[1] = Math.max(this.yrange[0], Math.min(this.yrange[1], v[1] + delta[1]));
        }

        this.sortValues();
        this.redraw();
        this.last_mouse = [mousex, mousey];
        this.onchange();

        evt.preventDefault();
        evt.stopPropagation();
    }

    private onmouseup(evt: MouseEvent): void {
        this.selected = -1;
        this.redraw();
        document.removeEventListener("mousemove", this.onmousemove.bind(this));
        document.removeEventListener("mouseup", this.onmouseup.bind(this));
        this.onchange();
        evt.preventDefault();
        evt.stopPropagation();
    }
}
