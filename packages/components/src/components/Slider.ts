import { trigger } from "@gausszhou/litegui-core";

interface SliderOptions {
  min?: number;
  max?: number;
  step?: number;
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
  public root: HTMLDivElement;
  private value: number;
  private docBinded: Document | null = null;
  public onChange?: (value: number) => void;

  constructor(value: number, private options: SliderOptions = {}) {
    this.root = document.createElement("div");
    this.value = value;
    this.root.className = "lg-slider";
    this.root.setAttribute("role", "slider");
    this.root.tabIndex = 0;

    this.root.addEventListener("mousedown", this.handleMouseDown);
    this.root.addEventListener("keydown", this.handleKeyDown);
    this.setValue(value, true);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    this.setFromX(e.offsetX || e.layerX);

    this.docBinded = this.root.ownerDocument;
    this.docBinded.addEventListener("mousemove", this.handleMouseMove);
    this.docBinded.addEventListener("mouseup", this.handleMouseUp);

    e.preventDefault();
    e.stopPropagation();
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const rect = this.root.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX === undefined ? e.pageX : e.clientX;
    this.setFromX(x - rect.left);

    e.preventDefault();
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    const min = this.options.min ?? 0;
    const max = this.options.max ?? 1;
    const step = this.options.step ?? (max - min) / 100;
    let next: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = this.value + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = this.value - step;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;

    if (next === null) return;
    this.setValue(next);
    e.preventDefault();
    e.stopPropagation();
  };

  private handleMouseUp = (e: MouseEvent): void => {
    const doc = this.docBinded || document;
    this.docBinded = null;

    doc.removeEventListener("mousemove", this.handleMouseMove);
    doc.removeEventListener("mouseup", this.handleMouseUp);

    e.preventDefault();
  };

  private setFromX(x: number): void {
    const rect = this.root.getBoundingClientRect();
    if (!rect || !rect.width) return;

    const norm = Math.max(0, Math.min(1, x / rect.width));
    const min = this.options.min ?? 0;
    const max = this.options.max ?? 1;
    this.setValue(min + (max - min) * norm);
  }

  public setValue(value: number, skipEvent: boolean = false): void {
    const min = this.options.min ?? 0;
    const max = this.options.max ?? 1;

    value = Math.max(min, Math.min(max, value));

    const range = max - min;
    const norm = range === 0 ? 0 : (value - min) / range;
    const percentage = `${(norm * 100).toFixed(1)}%`;
    const percentage2 = `${(norm * 100 + 2).toFixed(1)}%`;

    this.root.style.background = `linear-gradient(to right, #999 ${percentage}, #FC0 ${percentage2}, #333 ${percentage2})`;
    this.root.setAttribute("aria-valuemin", String(min));
    this.root.setAttribute("aria-valuemax", String(max));
    this.root.setAttribute("aria-valuenow", String(value));

    if (value !== this.value) {
      this.value = value;
      if (!skipEvent) {
        trigger(this.root, "change", value);
        this.onChange?.(value);
      }
    }
  }

  public getValue(): number {
    return this.value;
  }

  public setRange(min: number, max: number): this {
    this.options.min = min;
    this.options.max = max;
    this.setValue(this.value, true);
    return this;
  }

  public focus(): this {
    this.root.focus();
    return this;
  }
}
