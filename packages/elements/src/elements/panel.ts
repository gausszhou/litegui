import { Panel } from "@gausszhou/litegui/panel";
import { LiteGuiElement } from "../base";

/**
 * `<litegui-panel heading="属性" height="200" closable>`
 * 默认插槽内容会被放进面板内容区；关闭时派发 `litegui-close` 并隐藏宿主。
 */
export class LiteGuiPanelElement extends LiteGuiElement {
  static observedAttributes = ["heading", "height"];
  static hostStyles = ":host { display: block; min-height: 120px; }";

  #panel: Panel | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#panel = new Panel({
      title: this.heading,
      height: this.numberAttr("height", 180),
      close: this.boolAttr("closable")
    });

    const slot = document.createElement("slot");
    this.#panel.content.appendChild(slot);

    this.#panel.on("closed", () => {
      this.hidden = true;
      this.emit("litegui-close", {});
    });

    this.setComponent(this.#panel);
    this.hidden = false;
  }

  protected onAttributeChanged(name: string) {
    if (!this.#panel) return;
    if (name === "heading") this.#panel.setTitle(this.heading);
    if (name === "height") this.#panel.root.style.height = `${this.numberAttr("height", 180)}px`;
  }

  get heading(): string {
    return this.stringAttr("heading");
  }
  set heading(value: string) {
    this.reflect("heading", value);
  }

  get height(): number {
    return this.numberAttr("height", 180);
  }
  set height(value: number) {
    this.reflect("height", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "litegui-panel": LiteGuiPanelElement;
  }
}
