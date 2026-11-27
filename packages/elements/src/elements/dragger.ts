import { Dragger } from "@gausszhou/litegui-components/dragger";
import { LiteGuiElement } from "../base";

/**
 * `<lg-dragger value="1" min="-10" max="10" step="0.1" precision="2">`
 *
 * 拖动、滚轮或上下方向键改变数值时派发 `litegui-change`，detail 为 `{ value }`。
 * 未设置的 `min` / `max` 不传给组件，因此可以自由取负值。
 */
export class LiteGuiDraggerElement extends LiteGuiElement {
  static observedAttributes = ["value", "min", "max", "step", "precision", "linear"];
  static hostStyles = ":host { display: inline-block; min-width: 90px; }";

  #dragger: Dragger | null = null;
  #syncing = false;

  protected render() {
    this.#dragger = new Dragger(this.value, {
      min: this.optionalNumberAttr("min"),
      max: this.optionalNumberAttr("max"),
      step: this.optionalNumberAttr("step"),
      precision: this.optionalNumberAttr("precision"),
      linear: this.boolAttr("linear")
    });

    this.#dragger.input.addEventListener("change", () => {
      if (!this.#dragger || this.#syncing) return;
      const parsed = Number.parseFloat(this.#dragger.input.value);
      const value = Number.isFinite(parsed) ? parsed : this.#dragger.getValue();
      this.reflect("value", value);
      this.emit("litegui-change", { value });
    });

    this.setComponent(this.#dragger);
    this.#dragger.setValue(this.value, true);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#dragger) return;
    const options = this.#dragger.options as {
      min?: number;
      max?: number;
      step?: number;
      precision?: number;
      linear?: boolean;
    };

    switch (name) {
      case "value":
        this.#syncing = true;
        this.#dragger.setValue(this.value, true);
        this.#syncing = false;
        break;
      case "min":
      case "max":
        options.min = this.optionalNumberAttr("min");
        options.max = this.optionalNumberAttr("max");
        break;
      case "step":
        options.step = this.optionalNumberAttr("step");
        break;
      case "precision": {
        const precision = this.optionalNumberAttr("precision");
        options.precision = precision;
        this.#dragger.precision = precision ?? 3;
        break;
      }
      case "linear":
        options.linear = this.boolAttr("linear");
        break;
    }
  }

  get value(): number {
    return this.numberAttr("value", 0);
  }
  set value(value: number) {
    this.reflect("value", value);
  }

  get min(): number | undefined {
    return this.optionalNumberAttr("min");
  }
  set min(value: number | undefined) {
    this.reflect("min", value);
  }

  get max(): number | undefined {
    return this.optionalNumberAttr("max");
  }
  set max(value: number | undefined) {
    this.reflect("max", value);
  }

  get step(): number | undefined {
    return this.optionalNumberAttr("step");
  }
  set step(value: number | undefined) {
    this.reflect("step", value);
  }

  get precision(): number | undefined {
    return this.optionalNumberAttr("precision");
  }
  set precision(value: number | undefined) {
    this.reflect("precision", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-dragger": LiteGuiDraggerElement;
  }
}
