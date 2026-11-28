/**
 * 显影面板用到的自绘控件：滑杆、直方图、色调曲线、色彩混合器、颜色分级色轮。
 * 这些控件需要 Lightroom 式的轨道渐变与实时数值，因此不套用 LiteGUI 的通用 Slider。
 */
import {
  curveLut,
  HSL_BANDS,
  HSL_BAND_LABELS,
  type CurvePoint,
  type DevelopParams,
  type GradingParams,
  type GradingZone,
  type Histogram,
  type HslBand
} from "./develop";
import { el, formatSigned } from "./ui";

/* ------------------------------------------------------------------ 滑杆 */

export interface SliderRowOptions {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  digits?: number;
  /** 轨道渐变（CSS background），用于色温/色调等 */
  track?: string;
  /** 自定义数值显示 */
  format?: (value: number) => string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  onReset?: () => void;
}

export class SliderRow {
  public root: HTMLElement;
  private rail: HTMLElement;
  private thumb: HTMLElement;
  private fill: HTMLElement;
  private valueNode: HTMLElement;
  private options: SliderRowOptions;
  private value: number;

  constructor(options: SliderRowOptions) {
    this.options = options;
    this.value = options.value;

    this.root = el("div", "lc-slider");
    this.root.tabIndex = 0;
    this.root.setAttribute("role", "slider");
    this.root.setAttribute("aria-label", options.label);

    const head = el("div", "lc-slider__head");
    const label = el("span", "lc-slider__label", options.label);
    this.valueNode = el("span", "lc-slider__value");
    head.append(label, this.valueNode);

    this.rail = el("div", "lc-slider__rail");
    if (options.track) this.rail.style.backgroundImage = options.track;
    this.fill = el("div", "lc-slider__fill");
    this.thumb = el("div", "lc-slider__thumb");
    this.rail.append(this.fill, this.thumb);

    this.root.append(head, this.rail);
    this.root.addEventListener("keydown", this.onKeyDown);
    this.rail.addEventListener("pointerdown", this.onPointerDown);
    this.rail.addEventListener("dblclick", () => this.reset());
    label.addEventListener("dblclick", () => this.reset());
    this.paint();
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
    this.paint();
  }

  setBounds(min: number, max: number): void {
    this.options.min = min;
    this.options.max = max;
    this.paint();
  }

  private paint(): void {
    const { min, max, digits = 2, format } = this.options;
    const ratio = max === min ? 0 : (this.value - min) / (max - min);
    const percent = Math.max(0, Math.min(1, ratio)) * 100;
    this.fill.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    this.valueNode.textContent = format ? format(this.value) : formatSigned(this.value, digits);
    this.root.setAttribute("aria-valuemin", String(min));
    this.root.setAttribute("aria-valuemax", String(max));
    this.root.setAttribute("aria-valuenow", String(this.value));
    this.root.classList.toggle("is-modified", this.options.defaultValue !== undefined && this.value !== this.options.defaultValue);
  }

  private valueFromEvent(event: PointerEvent): number {
    const rect = this.rail.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const { min, max, step = 1 } = this.options;
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, Number(snapped.toFixed(6))));
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    this.root.classList.add("is-dragging");
    this.rail.setPointerCapture(event.pointerId);
    this.apply(this.valueFromEvent(event), false);

    const move = (moveEvent: PointerEvent) => {
      const { min, max, step = 1 } = this.options;
      const rect = this.rail.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / Math.max(1, rect.width)));
      // 按住 Shift 用 1/10 步长微调
      const fine = moveEvent.shiftKey ? step / 10 : step;
      const next = Math.max(min, Math.min(max, Math.round((min + ratio * (max - min)) / fine) * fine));
      this.apply(Number(next.toFixed(6)), false);
    };
    const up = () => {
      this.root.classList.remove("is-dragging");
      this.rail.removeEventListener("pointermove", move);
      this.rail.removeEventListener("pointerup", up);
      this.rail.removeEventListener("pointercancel", up);
      this.options.onCommit?.(this.value);
    };
    this.rail.addEventListener("pointermove", move);
    this.rail.addEventListener("pointerup", up);
    this.rail.addEventListener("pointercancel", up);
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    const { min, max, step = 1 } = this.options;
    const fine = event.shiftKey ? step / 10 : step;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = this.value + fine;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = this.value - fine;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    this.apply(Math.max(min, Math.min(max, Number(next.toFixed(6)))), true);
  };

  private apply(value: number, commit: boolean): void {
    if (value === this.value) return;
    this.value = value;
    this.paint();
    this.options.onChange(value);
    if (commit) this.options.onCommit?.(value);
  }

  reset(): void {
    const fallback = this.options.defaultValue ?? this.options.min;
    this.apply(fallback, true);
    this.options.onReset?.();
  }
}

/* ------------------------------------------------------------------ 直方图 */

export class HistogramView {
  public root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private histogram: Histogram | null = null;
  private channels: "rgb" | "luma" = "rgb";

  constructor() {
    this.root = el("div", "lc-histogram");
    this.canvas = el("canvas", "lc-histogram__canvas");
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("2D context unavailable");
    this.context = context;
    this.root.appendChild(this.canvas);
    this.root.addEventListener("click", () => {
      this.channels = this.channels === "rgb" ? "luma" : "rgb";
      this.draw();
    });
    this.root.title = "点击切换 RGB / 亮度直方图";
  }

  render(histogram: Histogram | null): void {
    this.histogram = histogram;
    this.draw();
  }

  private draw(): void {
    const canvas = this.canvas;
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = this.context;
    ctx.clearRect(0, 0, width, height);

    const histogram = this.histogram;
    if (!histogram) return;

    // 以 99 分位为上限，避免极高单峰把整体压平
    const sorted = Array.from(histogram.red).sort((a, b) => a - b);
    const peak = Math.max(1, sorted[Math.floor(sorted.length * 0.995)]);
    const max = Math.max(peak, histogram.max * 0.35);
    const map = (bins: Uint32Array): number[] => {
      const points: number[] = [];
      for (let i = 0; i < 256; i++) points.push(Math.min(1, bins[i] / max));
      return points;
    };

    const drawChannel = (bins: Uint32Array, color: string) => {
      const points = map(bins);
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const y = height - points[i] * (height - 2);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    if (this.channels === "rgb") {
      ctx.globalCompositeOperation = "lighter";
      drawChannel(histogram.red, "rgba(226, 88, 92, 0.55)");
      drawChannel(histogram.green, "rgba(96, 196, 124, 0.5)");
      drawChannel(histogram.blue, "rgba(92, 140, 232, 0.55)");
      ctx.globalCompositeOperation = "source-over";
    } else {
      drawChannel(histogram.luma, "rgba(224, 228, 236, 0.72)");
    }
  }
}

/* ------------------------------------------------------------------ 色调曲线 */

export class CurveEditor {
  public root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private points: CurvePoint[];
  private onChange: (points: CurvePoint[]) => void;
  private onCommit: () => void;
  private dragging = -1;

  constructor(points: CurvePoint[], onChange: (points: CurvePoint[]) => void, onCommit: () => void) {
    this.points = points.map((point) => ({ ...point }));
    this.onChange = onChange;
    this.onCommit = onCommit;
    this.root = el("div", "lc-curve");
    this.canvas = el("canvas", "lc-curve__canvas");
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("2D context unavailable");
    this.context = context;
    this.root.appendChild(this.canvas);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointerleave", this.onPointerUp);
    this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    this.canvas.addEventListener("dblclick", this.onDoubleClick);
  }

  setPoints(points: CurvePoint[]): void {
    this.points = points.map((point) => ({ ...point }));
    this.draw();
  }

  private geometry(): { rect: DOMRect; width: number; height: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { rect, width: rect.width, height: rect.height };
  }

  private draw(): void {
    const canvas = this.canvas;
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = this.context;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const x = (i / 4) * width;
      const y = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();

    const lut = curveLut(this.points, 256);
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      const y = height - (lut[i] / 255) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#dfe4ec";
    ctx.lineWidth = 1.6 * ratio;
    ctx.stroke();

    for (const point of this.points) {
      const x = point.x * width;
      const y = height - point.y * height;
      ctx.beginPath();
      ctx.arc(x, y, 3.4 * ratio, 0, Math.PI * 2);
      ctx.fillStyle = "#1b1e22";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 3.4 * ratio, 0, Math.PI * 2);
      ctx.strokeStyle = "#f2f5fa";
      ctx.lineWidth = 1.4 * ratio;
      ctx.stroke();
    }
  }

  private nearest(event: PointerEvent | MouseEvent): number {
    const { rect, width, height } = this.geometry();
    const x = (event.clientX - rect.left) / Math.max(1, width);
    const y = 1 - (event.clientY - rect.top) / Math.max(1, height);
    let best = -1;
    let bestDistance = 0.06;
    this.points.forEach((point, index) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    return best;
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    this.canvas.setPointerCapture(event.pointerId);
    const { rect, width, height } = this.geometry();
    const x = (event.clientX - rect.left) / Math.max(1, width);
    const y = 1 - (event.clientY - rect.top) / Math.max(1, height);
    let index = this.nearest(event);
    if (index === -1) {
      const point = { x: Math.max(0.02, Math.min(0.98, x)), y: Math.max(0, Math.min(1, y)) };
      this.points.push(point);
      this.points.sort((a, b) => a.x - b.x);
      index = this.points.indexOf(point);
      this.emit(false);
      this.draw();
    }
    this.dragging = index;
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (this.dragging === -1) return;
    const { rect, width, height } = this.geometry();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, width)));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / Math.max(1, height)));
    const point = this.points[this.dragging];
    if (!point) return;
    const isFirst = this.dragging === 0;
    const isLast = this.dragging === this.points.length - 1;
    if (!isFirst && !isLast) {
      const prev = this.points[this.dragging - 1];
      const next = this.points[this.dragging + 1];
      point.x = Math.max(prev.x + 0.01, Math.min(next.x - 0.01, x));
    }
    point.y = isFirst ? 0 : isLast ? 1 : y;
    this.emit(false);
    this.draw();
  };

  private onPointerUp = (): void => {
    if (this.dragging === -1) return;
    this.dragging = -1;
    this.emit(true);
  };

  private onDoubleClick = (event: MouseEvent): void => {
    const index = this.nearest(event);
    if (index <= 0 || index >= this.points.length - 1) return;
    this.points.splice(index, 1);
    this.emit(true);
    this.draw();
  };

  private emit(commit: boolean): void {
    const points = this.points.map((point) => ({ ...point }));
    this.onChange(points);
    if (commit) this.onCommit();
  }

  resize(): void {
    this.draw();
  }
}

/* ------------------------------------------------------------------ 色彩混合器 */

export class ColorMixer {
  public root: HTMLElement;
  private band: HslBand = "red";
  private tab: "hue" | "sat" | "lum" = "hue";
  private params: DevelopParams;
  private onLive: () => void;
  private onCommit: () => void;
  private sliderHost: HTMLElement;
  private swatchRow: HTMLElement;
  private tabRow: HTMLElement;

  constructor(params: DevelopParams, onLive: () => void, onCommit: () => void) {
    this.params = params;
    this.onLive = onLive;
    this.onCommit = onCommit;
    this.root = el("div", "lc-mixer");

    this.swatchRow = el("div", "lc-mixer__bands");
    const hues: Record<HslBand, number> = {
      red: 0,
      orange: 30,
      yellow: 58,
      green: 118,
      aqua: 178,
      blue: 222,
      purple: 274,
      magenta: 320
    };
    for (const band of HSL_BANDS) {
      const button = el("button", "lc-mixer__band");
      button.type = "button";
      button.title = HSL_BAND_LABELS[band];
      button.style.background = `hsl(${hues[band]} 62% 52%)`;
      button.dataset["band"] = band;
      button.addEventListener("click", () => {
        this.band = band;
        this.render();
      });
      this.swatchRow.appendChild(button);
    }

    this.tabRow = el("div", "lc-mixer__tabs");
    const tabs: Array<["hue" | "sat" | "lum", string]> = [
      ["hue", "色相"],
      ["sat", "饱和度"],
      ["lum", "明度"]
    ];
    for (const [tab, label] of tabs) {
      const button = el("button", "lc-mixer__tab", label);
      button.type = "button";
      button.dataset["tab"] = tab;
      button.addEventListener("click", () => {
        this.tab = tab;
        this.render();
      });
      this.tabRow.appendChild(button);
    }

    this.sliderHost = el("div", "lc-mixer__sliders");
    this.root.append(this.swatchRow, this.tabRow, this.sliderHost);
    this.render();
  }

  setParams(params: DevelopParams): void {
    this.params = params;
  }

  private render(): void {
    for (const node of Array.from(this.swatchRow.children)) {
      const band = (node as HTMLElement).dataset["band"];
      node.classList.toggle("is-active", band === this.band);
    }
    for (const node of Array.from(this.tabRow.children)) {
      const tab = (node as HTMLElement).dataset["tab"];
      node.classList.toggle("is-active", tab === this.tab);
    }
    this.sliderHost.innerHTML = "";

    const bands: HslBand[] = [this.band];
    for (const band of bands) {
      const adjust = this.params.hsl[band];
      const value = adjust[this.tab];
      const slider = new SliderRow({
        label: `${HSL_BAND_LABELS[band]} · ${this.tab === "hue" ? "色相" : this.tab === "sat" ? "饱和度" : "明度"}`,
        value,
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        onChange: (next) => {
          adjust[this.tab] = next;
          this.onLive();
        },
        onCommit: () => this.onCommit()
      });
      this.sliderHost.appendChild(slider.root);
    }
  }
}

/* ------------------------------------------------------------------ 颜色分级色轮 */

interface WheelOptions {
  label: string;
  zone: GradingZone;
  onLive: (zone: GradingZone) => void;
  onCommit: () => void;
}

class Wheel {
  public root: HTMLElement;
  private zone: GradingZone;
  private puck: HTMLElement;
  private options: WheelOptions;

  constructor(options: WheelOptions) {
    this.options = options;
    this.zone = { ...options.zone };
    this.root = el("div", "lc-wheel-wrap");
    const wheel = el("div", "lc-wheel");
    wheel.style.background = [
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.72) 18%, rgba(255,255,255,0) 62%)",
      "conic-gradient(from 90deg, #ff5f5f, #ffd25f, #a6f36a, #5ff0d0, #5fb8ff, #a06bff, #ff6bd6, #ff5f5f)"
    ].join(", ");
    this.puck = el("div", "lc-wheel__puck");
    wheel.appendChild(this.puck);
    const label = el("span", "lc-wheel__label", options.label);
    this.root.append(wheel, label);

    wheel.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      wheel.setPointerCapture(event.pointerId);
      const update = (pointer: PointerEvent) => {
        const rect = wheel.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.clientX - cx;
        const dy = pointer.clientY - cy;
        const radius = Math.min(rect.width, rect.height) / 2;
        const distance = Math.min(1, Math.hypot(dx, dy) / radius);
        let hue = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (hue < 0) hue += 360;
        this.zone = { ...this.zone, hue, sat: Math.round(distance * 100) };
        this.paint();
        this.options.onLive({ ...this.zone });
      };
      update(event);
      const move = (moveEvent: PointerEvent) => update(moveEvent);
      const up = () => {
        wheel.removeEventListener("pointermove", move);
        wheel.removeEventListener("pointerup", up);
        this.options.onCommit();
      };
      wheel.addEventListener("pointermove", move);
      wheel.addEventListener("pointerup", up);
    });

    wheel.addEventListener("dblclick", () => {
      this.zone = { ...this.zone, sat: 0 };
      this.paint();
      this.options.onLive({ ...this.zone });
      this.options.onCommit();
    });

    this.paint();
  }

  setZone(zone: GradingZone): void {
    this.zone = { ...zone };
    this.paint();
  }

  private paint(): void {
    const angle = ((this.zone.hue - 90) * Math.PI) / 180;
    const distance = (this.zone.sat / 100) * 42;
    this.puck.style.left = `${50 + Math.cos(angle) * distance}%`;
    this.puck.style.top = `${50 + Math.sin(angle) * distance}%`;
    this.puck.style.background = `hsl(${this.zone.hue} 78% 58%)`;
  }
}

export class GradingWheels {
  public root: HTMLElement;
  private params: GradingParams;
  private onLive: () => void;
  private onCommit: () => void;
  private wheels: { shadows: Wheel; midtones: Wheel; highlights: Wheel };
  private lumHost: HTMLElement;
  private zoneForLabel: Record<string, string> = {
    shadows: "阴影",
    midtones: "中间调",
    highlights: "高光"
  };

  constructor(params: GradingParams, onLive: () => void, onCommit: () => void) {
    this.params = params;
    this.onLive = onLive;
    this.onCommit = onCommit;
    this.root = el("div", "lc-grading");

    const wheelRow = el("div", "lc-grading__wheels");
    this.wheels = {
      midtones: new Wheel({
        label: "中间调",
        zone: params.midtones,
        onLive: (zone) => {
          this.params.midtones = zone;
          this.onLive();
        },
        onCommit: () => this.onCommit()
      }),
      shadows: new Wheel({
        label: "阴影",
        zone: params.shadows,
        onLive: (zone) => {
          this.params.shadows = zone;
          this.onLive();
        },
        onCommit: () => this.onCommit()
      }),
      highlights: new Wheel({
        label: "高光",
        zone: params.highlights,
        onLive: (zone) => {
          this.params.highlights = zone;
          this.onLive();
        },
        onCommit: () => this.onCommit()
      })
    };
    const midRow = el("div", "lc-grading__row lc-grading__row--single");
    midRow.appendChild(this.wheels.midtones.root);
    const pairRow = el("div", "lc-grading__row");
    pairRow.append(this.wheels.shadows.root, this.wheels.highlights.root);
    wheelRow.append(midRow, pairRow);

    this.lumHost = el("div", "lc-grading__lums");
    this.root.append(wheelRow, this.lumHost);
    this.renderLums();
  }

  setParams(params: GradingParams): void {
    this.params = params;
    this.wheels.shadows.setZone(params.shadows);
    this.wheels.midtones.setZone(params.midtones);
    this.wheels.highlights.setZone(params.highlights);
    this.renderLums();
  }

  private renderLums(): void {
    this.lumHost.innerHTML = "";
    const zones: Array<"shadows" | "midtones" | "highlights"> = ["shadows", "midtones", "highlights"];
    for (const key of zones) {
      const slider = new SliderRow({
        label: `${this.zoneForLabel[key]}明度`,
        value: this.params[key].lum,
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        onChange: (next) => {
          this.params[key].lum = next;
          this.onLive();
        },
        onCommit: () => this.onCommit()
      });
      this.lumHost.appendChild(slider.root);
    }
  }
}
