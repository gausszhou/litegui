import { Button } from "@gausszhou/litegui/button";
import { LiteGuiElement } from "../base";

export type LiteGuiButtonSize = "default" | "small" | "mini";

/**
 * `<litegui-button label="Save" size="small" disabled>`。
 * 点击派发 `litegui-click`，detail 为 `{ label }`。
 */
export class LiteGuiButtonElement extends LiteGuiElement {
  static observedAttributes = ["label", "size", "disabled"];
  static hostStyles = ":host { display: inline-block; }";

  #button: Button | null = null;

  protected render() {
    this.#button = new Button(this.label, {
      size: this.size,
      callback: () => {
        if (this.disabled) return;
        this.emit("litegui-click", { label: this.label });
      }
    });
    this.#button.content.disabled = this.disabled;
    this.setComponent(this.#button);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#button) return;
    if (name === "label") this.#button.content.textContent = this.label;
    if (name === "size") {
      this.#button.root.classList.remove("small", "mini");
      if (this.size !== "default") this.#button.root.classList.add(this.size);
    }
    if (name === "disabled") this.#button.content.disabled = this.disabled;
  }

  get label(): string {
    return this.stringAttr("label");
  }
  set label(value: string) {
    this.reflect("label", value);
  }

  get size(): LiteGuiButtonSize {
    const value = this.stringAttr("size", "default");
    return value === "small" || value === "mini" ? value : "default";
  }
  set size(value: LiteGuiButtonSize) {
    this.reflect("size", value);
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
    "litegui-button": LiteGuiButtonElement;
  }
}
