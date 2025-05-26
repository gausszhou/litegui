import LiteGUI from ".";

interface SliderOptions {
    min?: number;
    max?: number;
}

/**
* Slider 
*
* @class Slider
* @constructor
* @param {Number} value
* @param {Object} options
*/
export class Slider {
    private root: HTMLDivElement;
    private value: number;
    private docBinded: Document | null = null;
    public onChange?: (value: number) => void;

    constructor(value: number, private options: SliderOptions = {}) {
        this.root = document.createElement("div");
        this.value = value;
        this.root.className = "liteslider";

        this.initializeEventListeners();
        this.setValue(value);
    }

    private initializeEventListeners(): void {
        this.root.addEventListener("mousedown", this.handleMouseDown.bind(this));
    }

    private handleMouseDown(e: MouseEvent): void {
        const mouseX = e.offsetX || e.layerX;
        this.setFromX(mouseX);
        
        this.docBinded = this.root.ownerDocument;
        this.docBinded.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.docBinded.addEventListener("mouseup", this.handleMouseUp.bind(this));
        
        e.preventDefault();
        e.stopPropagation();
    }

    private handleMouseMove(e: MouseEvent): boolean {
        const rect = this.root.getBoundingClientRect();
        if (!rect) return false;

        const x = e.x === undefined ? e.pageX : e.x;
        const mouseX = x - rect.left;
        this.setFromX(mouseX);
        
        e.preventDefault();
        return false;
    }

    private handleMouseUp(e: MouseEvent): boolean {
        const doc = this.docBinded || document;
        this.docBinded = null;
        
        doc.removeEventListener("mousemove", this.handleMouseMove.bind(this));
        doc.removeEventListener("mouseup", this.handleMouseUp.bind(this));
        
        e.preventDefault();
        return false;
    }

    private setFromX(x: number): void {
        const rect = this.root.getBoundingClientRect();
        if (!rect) return;

        const width = rect.width;
        const norm = x / width;
        const min = this.options.min || 0.0;
        const max = this.options.max || 1.0;
        const range = max - min;
        this.setValue(range * norm + min);
    }

    public setValue(value: number, skipEvent: boolean = false): void {
        const min = this.options.min || 0.0;
        const max = this.options.max || 1.0;
        
        value = Math.max(min, Math.min(max, value));
        
        const range = max - min;
        const norm = (value - min) / range;
        const percentage = `${(norm * 100).toFixed(1)}%`;
        const percentage2 = `${(norm * 100 + 2).toFixed(1)}%`;
        
        this.root.style.background = `linear-gradient(to right, #999 ${percentage}, #FC0 ${percentage2}, #333 ${percentage2})`;

        if (value !== this.value) {
            this.value = value;
            if (!skipEvent) {
                LiteGUI.trigger(this.root, "change", value);
                this.onChange?.(value);
            }
        }
    }
}