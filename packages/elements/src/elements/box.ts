import { LiteBox } from "@gausszhou/litegui-components/box";
import { LiteGuiElement } from "../base";

/**
 * `<lg-box>默认插槽内容</lg-box>` —— 最小的通用容器，等价于一个带 LiteGUI 语义的 `<div>`。
 */
export class LiteGuiBoxElement extends LiteGuiElement {
  static hostStyles = ":host { display: block; min-height: 20px; }";

  #box: LiteBox | null = null;

  protected render() {
    this.#box = new LiteBox();
    this.#box.root.appendChild(document.createElement("slot"));
    this.setComponent(this.#box);
  }

  get stopPropagation(): boolean {
    return this.#box?.stopPropagation ?? false;
  }
  set stopPropagation(value: boolean) {
    if (this.#box) this.#box.stopPropagation = value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-box": LiteGuiBoxElement;
  }
}
