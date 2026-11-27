import { Slider } from "@gausszhou/litegui-components/slider";
import { LiteGuiElement } from "../base";

/**
 * `<lg-slider value="0.4" min="0" max="1" step="0.01">`
 *
 * 拖拽、滚轮（由原生 Slider 处理）或方向键改变数值时派发
 * `litegui-change`，detail 为 `{ value }`，并把 `value` 反射回 attribute。
 */
export class LiteGuiSliderElement extends LiteGuiElement {
  static observedAttributes = ["value", "min", "max", "step"];
  static hostStyles = ":host { display: block; min-width: 80px; padding: 2px 0; }";

  #slider: Slider | null = null;
  #options: { min: number; max: number; step?: number } | null = null;
  #syncing = false;

  protected render() {
    const options = { min: this.min, max: this.max, step: this.optionalNumberAttr("step") };
    this.#options = options;
    this.#slider = new Slider(this.value, options);
    this.#slider.onChange = value => {
      if (this.#syncing) return;
      this.reflect("value", value);
      this.emit("litegui-change", { value });
    };
    this.setComponent(this.#slider);
    this.#slider.setValue(this.value, true);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#slider || !this.#options) return;

    if (name === "value") {
      this.#syncing = true;
      this.#slider.setValue(this.value, true);
      this.#syncing = false;
      return;
    }

    if (name === "min" || name === "max") {
      this.#options.min = this.min;
      this.#options.max = this.max;
      this.#syncing = true;
      this.#slider.setRange(this.min, this.max);
      this.#syncing = false;
      return;
    }

    if (name === "step") {
      // Slider 没有 setStep：构造时传入的 options 对象是同一个引用，直接改即可。
      this.#options.step = this.optionalNumberAttr("step");
    }
  }

  get value(): number {
    return this.numberAttr("value", 0);
  }
  set value(value: number) {
    this.reflect("value", value);
  }

  get min(): number {
    return this.numberAttr("min", 0);
  }
  set min(value: number) {
    this.reflect("min", value);
  }

  get max(): number {
    return this.numberAttr("max", 1);
  }
  set max(value: number) {
    this.reflect("max", value);
  }

  get step(): number | undefined {
    return this.optionalNumberAttr("step");
  }
  set step(value: number | undefined) {
    this.reflect("step", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-slider": LiteGuiSliderElement;
  }
}
