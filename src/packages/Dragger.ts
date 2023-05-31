import LiteGUI from ".";
import EventMitter from "./EventMitter";

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;

/***** DRAGGER **********/

class Dragger extends EventMitter {
  options: any;
  value: number;
  precision: number;

  root: HTMLDivElement;
  wrap: HTMLSpanElement;
  input: HTMLInputElement;
  dragger: HTMLDivElement;

  constructor(value: number, options: any) {
    super();
    if (value === null || value === undefined) value = 0;
    else if (value.constructor === String) value = parseFloat(value);
    else if (value.constructor !== Number) value = 0;
    this.options = options || {};
    this.value = value;
    this.precision = this.options.precision || 3; // num decimals 数字精度
    this.root = this.createRoot();
    this.wrap = this.createWrap();
    this.input = this.createInput();
    this.dragger = this.createDragger();
  }
  createRoot() {
    const options = this.options;
    const root = document.createElement("div");
    root.className = "dragger " + (options.extraclass ? options.extraclass : "");
    return root;
  }
  createWrap() {
    const options = this.options;
    const wrap = document.createElement("span");
    wrap.className = "inputfield " + (options.extraclass ? options.extraclass : "") + (options.full ? " full" : "");
    if (options.disabled) wrap.className += " disabled";
    return wrap;
  }
  createInput() {
    const options = this.options;
    const value = this.value;
    const precision = this.precision;
    const dragger_class = options.dragger_class || "full";
    const input = document.createElement("input");
    input.className = "text number " + (dragger_class ? dragger_class : "");
    input.value = value.toFixed(precision) + (options.units ? options.units : "");
    input.tabIndex = options.tab_index;
    if (options.disabled) input.disabled = true;
    if (options.tab_index) input.tabIndex = options.tab_index;
    return input;
  }

  createDragger() {
    const options = this.options;
    const dragger = document.createElement("div");
    dragger.className = "drag_widget";
    if (options.disabled) dragger.className += " disabled";
    return dragger;
  }
  initDom() {
    this.root.appendChild(this.wrap);
    this.wrap.appendChild(this.input);
    this.wrap.appendChild(this.dragger);
  }
  initEvent() {
    const options = this.options;
    const precision = this.precision;
    let pos: number[] = [];
    let ownerDocument: Document | null = null;

    const inc = (v: number, e: MouseEvent | KeyboardEvent) => {
      if (!options.linear) {
        v = v > 0 ? Math.pow(v, 1.2) : Math.pow(Math.abs(v), 1.2) * -1;
      }

      let scale = options.step ? options.step : 1.0;
      if (e && e.shiftKey) {
        // 按住 shift 粗调
        scale *= 10;
      } else if (e && e.ctrlKey) {
        // 按住 ctrl 微调
        scale *= 0.1;
      }

      let value = parseFloat(this.input.value) + v * scale;
      if (options.max != null && value > options.max) value = options.max;
      if (options.min != null && value < options.min) value = options.min;

      this.input.value = value.toFixed(precision);
      if (options.units) {
        this.input.value += options.units;
      }
      LiteGUI.trigger(this.input, "change");
    };

    const onMouseDown = (e: MouseEvent) => {
      ownerDocument = this.input.ownerDocument;
      ownerDocument.removeEventListener("mousemove", onMouseMove);
      ownerDocument.removeEventListener("mouseup", onMouseUp);

      if (!options.disabled) {
        if (this.root.requestPointerLock) {
          this.root.requestPointerLock();
        }
        ownerDocument.addEventListener("mousemove", onMouseMove);
        ownerDocument.addEventListener("mouseup", onMouseUp);
        pos = [e.screenX, e.screenY];
        LiteGUI.trigger(this.root, "start_dragging");
      }
      e.stopPropagation();
      e.preventDefault();
    };

    const onMouseUp = (e: MouseEvent) => {
      LiteGUI.trigger(this.root, "stop_dragging");
      const doc = ownerDocument || document;
      ownerDocument = null;
      doc.removeEventListener("mousemove", onMouseMove);
      doc.removeEventListener("mouseup", onMouseUp);
      if (doc.exitPointerLock) doc.exitPointerLock();
      LiteGUI.trigger(this.dragger, "blur");
      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const deltax = e.screenX - pos[0];
      const deltay = pos[1] - e.screenY;
      let diff = [deltax, deltay];
      if (e.movementX !== undefined) diff = [e.movementX, -e.movementY];
      pos = [e.screenX, e.screenY];
      const axis = options.horizontal ? 0 : 1;
      inc(diff[axis], e);

      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY ? -e.deltaY / 3 : 0;
      inc(delta > 0 ? 1 : -1, e);
      e.stopPropagation();
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode == KEY_CODE_UP) {
        inc(1, e);
      } else if (e.keyCode == KEY_CODE_DOWN) {
        inc(-1, e);
      } else {
        return false;
      }
      e.stopPropagation();
      e.preventDefault();
      return true;
    }

    this.dragger.addEventListener("mousedown", onMouseDown);
    this.input.addEventListener("wheel", onWheel, false);
    this.input.addEventListener("keydown",onKeyDown );
  }

  setRange(min: number, max: number) {
    this.options.min = min;
    this.options.max = max;
  }

  setValue(v: string | number, skip_event: boolean) {
    const value: number = typeof v === "string" ? parseFloat(v) : v;
    this.value = value;
    if (this.options.precision) v = value.toFixed(this.options.precision);
    if (this.options.units) v += this.options.units;
    this.input.value = v.toString();
    if (!skip_event) LiteGUI.trigger(this.input, "change");
  }
  getValue() {
    return this.value;
  }
}

export default Dragger;
