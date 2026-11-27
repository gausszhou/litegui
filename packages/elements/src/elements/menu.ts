import { Menu } from "@gausszhou/litegui/menu";
import { HTMLElementBase, LiteGuiElement } from "../base";

let menuId = 0;

/**
 * 菜单项只是声明式数据的载体，不渲染自身：
 *
 * ```html
 * <litegui-menu>
 *   <litegui-menu-item label="文件">
 *     <litegui-menu-item label="新建"></litegui-menu-item>
 *     <litegui-menu-item label="打开"></litegui-menu-item>
 *   </litegui-menu-item>
 * </litegui-menu>
 * ```
 */
export class LiteGuiMenuItemElement extends HTMLElementBase {
  get label(): string {
    return this.getAttribute("label") ?? "";
  }
  set label(value: string) {
    this.setAttribute("label", value);
  }
}

/**
 * `<litegui-menu>`：点击叶子项派发 `litegui-select`，detail 为 `{ label, path }`。
 */
export class LiteGuiMenuElement extends LiteGuiElement {
  static hostStyles = ":host { display: inline-block; }";

  #menu: Menu | null = null;

  protected render() {
    this.#menu = new Menu(`litegui-menu-${++menuId}`, { container: this.mountPoint });
    this.buildItems(this, "");
    this.setComponent(this.#menu);
  }

  private buildItems(parent: Element, prefix: string) {
    for (const child of Array.from(parent.children)) {
      // 用 localName，避免 <litegui-menu> 先于子项升级时 instanceof 失败
      if (child.localName !== "litegui-menu-item") continue;
      const label = child.getAttribute("label") ?? "";
      if (!label) continue;

      const path = prefix ? `${prefix}/${label}` : label;
      this.#menu?.add(path, {
        callback: () => this.emit("litegui-select", { label, path })
      });

      this.buildItems(child, path);
    }
  }

  /** 重新读取 light DOM 里的菜单项（动态修改后可手动调用） */
  refresh() {
    if (!this.#menu) return;
    this.#menu.root.replaceChildren(this.#menu.content);
    this.#menu.menus = [];
    this.buildItems(this, "");
    this.#menu.updateMainMenu();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "litegui-menu": LiteGuiMenuElement;
    "litegui-menu-item": LiteGuiMenuItemElement;
  }
}
