import { ContextMenu } from "@gausszhou/litegui-components/context-menu";
import { LiteGuiElement } from "../base";

export interface LiteGuiContextMenuItem {
  title?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  separator?: boolean;
}

/**
 * `<lg-context-menu items='[{"title":"复制","value":"copy"}]' open>`
 *
 * `open` 控制菜单显示；点击菜单项派发 `litegui-select`
 * （detail 为 `{ value, item }`），并自动移除 `open`。
 */
export class LiteGuiContextMenuElement extends LiteGuiElement {
  static observedAttributes = ["items", "open"];
  static hostStyles = ":host { display: block; position: relative; min-height: 40px; }";

  #menu: ContextMenu | null = null;

  protected render() {
    this.mountPoint.style.position = "relative";
    this.mountPoint.style.minHeight = "100px";
    this.syncOpen();
  }

  protected onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null) {
    // 未挂载时交给 render() 处理，避免在游离的 shadow root 里创建浮层。
    if (!this.isConnected) return;
    if (name === "items") {
      if (this.#menu) {
        this.destroyMenu();
        this.syncOpen();
      }
      return;
    }
    if (name === "open") {
      if (newValue === null) this.destroyMenu();
      else this.syncOpen();
    }
  }

  /** 打开菜单（等价于设置 `open` attribute） */
  show(): this {
    this.setAttribute("open", "");
    return this;
  }

  /** 关闭并移除菜单 */
  hide(): this {
    this.removeAttribute("open");
    return this;
  }

  private syncOpen() {
    if (!this.hasAttribute("open") || this.#menu) return;

    // null 表示分隔线；ContextMenu 用 value === null 区分。
    const values = this.items.map(item => {
      if (item.separator) return null;
      return {
        title: item.title ?? item.label ?? item.value ?? "",
        value: item.value ?? item.title ?? item.label ?? "",
        disabled: Boolean(item.disabled)
      };
    });

    this.#menu = new ContextMenu(values, {
      container: this.mountPoint,
      left: 0,
      top: 0,
      callback: (item: { title?: string; value?: string } | null) => {
        this.removeAttribute("open");
        if (!item) return;
        this.emit("litegui-select", {
          value: item.value ?? item.title ?? "",
          item
        });
      }
    });
    // 相对宿主定位，避免 position:fixed 在 Shadow DOM 中被祖先 transform 影响。
    this.#menu.root.style.position = "absolute";
  }

  private destroyMenu() {
    if (!this.#menu) return;
    this.#menu.close();
    this.#menu = null;
  }

  get items(): LiteGuiContextMenuItem[] {
    return this.jsonAttr<LiteGuiContextMenuItem[]>("items", []);
  }
  set items(value: LiteGuiContextMenuItem[]) {
    this.reflect("items", JSON.stringify(value));
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }
  set open(value: boolean) {
    this.reflect("open", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-context-menu": LiteGuiContextMenuElement;
  }
}
