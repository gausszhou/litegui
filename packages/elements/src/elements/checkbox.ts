import { Checkbox } from "@gausszhou/litegui-components/checkbox";
import { LiteGuiElement } from "../base";

/**
 * `<lg-checkbox checked disabled>`。
 * 切换派发 `litegui-change`，detail 为 `{ checked }`；同时反射 `checked` attribute。
 */
export class LiteGuiCheckboxElement extends LiteGuiElement {
  static observedAttributes = ["checked", "disabled"];
  static hostStyles = ":host { display: inline-block; }";

  #checkbox: Checkbox | null = null;

  protected render() {
    this.#checkbox = new Checkbox(this.checked, {
      onChange: (value: boolean) => {
        this.toggleAttribute("checked", value);
        this.emit("litegui-change", { checked: value });
      }
    });
    this.setComponent(this.#checkbox);
    this.applyDisabled();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#checkbox) return;
    if (name === "checked") this.#checkbox.setValue(this.checked);
    if (name === "disabled") this.applyDisabled();
  }

  private applyDisabled() {
    if (!this.#checkbox) return;
    const disabled = this.disabled;
    this.#checkbox.root.setAttribute("aria-disabled", String(disabled));
    this.#checkbox.root.style.pointerEvents = disabled ? "none" : "";
  }

  get checked(): boolean {
    return this.boolAttr("checked");
  }
  set checked(value: boolean) {
    this.reflect("checked", value);
  }

  get disabled(): boolean {
    return this.boolAttr("disabled");
  }
  set disabled(value: boolean) {
    this.reflect("disabled", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-checkbox": LiteGuiCheckboxElement;
  }
}
