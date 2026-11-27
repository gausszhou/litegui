import { Toolbar } from "@gausszhou/litegui-components/toolbar";
import { LiteGuiElement } from "../base";

export interface LiteGuiToolbarTool {
  id: string;
  label?: string;
  icon?: string;
  shortcut?: string;
}

/**
 * `<lg-toolbar tools='[{"id":"move","label":"移动"}]' active="move">`
 *
 * 点击工具或切换 active 时派发 `litegui-change`，detail 为 `{ id }`。
 */
export class LiteGuiToolbarElement extends LiteGuiElement {
  static observedAttributes = ["tools", "active"];
  static hostStyles = ":host { display: inline-block; }";

  #toolbar: Toolbar | null = null;

  protected render() {
    this.#toolbar = new Toolbar({
      tools: this.tools,
      active: this.active
    });
    this.#toolbar.on("change", payload => {
      const id = payload === null || payload === undefined ? null : String(payload);
      if (id) this.reflect("active", id);
      this.emit("litegui-change", { id });
    });
    this.setComponent(this.#toolbar);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#toolbar) return;
    if (name === "tools") this.#toolbar.setTools(this.tools);
    if (name === "active") this.#toolbar.setActive(this.active);
  }

  get tools(): LiteGuiToolbarTool[] {
    return this.jsonAttr<LiteGuiToolbarTool[]>("tools", []);
  }
  set tools(value: LiteGuiToolbarTool[]) {
    this.reflect("tools", JSON.stringify(value));
  }

  get active(): string | null {
    return this.hasAttribute("active") ? this.getAttribute("active") : null;
  }
  set active(value: string | null) {
    this.reflect("active", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-toolbar": LiteGuiToolbarElement;
  }
}
