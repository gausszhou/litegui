import { Menu } from "@gausszhou/litegui-components/menu";
import { HTMLElementBase, LiteGuiElement } from "../base";

let menuId = 0;

/**
 * 菜单项只是声明式数据的载体，不渲染自身：
 *
 * ```html
 * <lg-menu>
 *   <lg-menu-item label="文件">
 *     <lg-menu-item label="新建"></lg-menu-item>
 *     <lg-menu-item label="打开"></lg-menu-item>
 *   </lg-menu-item>
 * </lg-menu>
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
 * `<lg-menu>`：点击叶子项派发 `litegui-select`，detail 为 `{ label, path }`。
 */
export class LiteGuiMenuElement extends LiteGuiElement {
  static hostStyles = ":host { display: inline-block; }";

  #menu: Menu | null = null;

  protected render() {
    this.#menu = new Menu(`lg-menu-${++menuId}`, { container: this.mountPoint });
    this.buildItems(this, "");
    this.setComponent(this.#menu);
  }

  private buildItems(parent: Element, prefix: string) {
    for (const child of Array.from(parent.children)) {
      // 用 localName，避免 <lg-menu> 先于子项升级时 instanceof 失败
      if (child.localName !== "lg-menu-item") continue;
      const label = child.getAttribute("label") ?? "";
      if (!label) continue;

      const path = prefix ? `${prefix}/${label}` : label;
      const hasChildren = Array.from(child.children).some(element => element.localName === "lg-menu-item");
      this.#menu?.add(path, {
        callback: hasChildren ? undefined : () => this.emit("litegui-select", { label, path })
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
    "lg-menu": LiteGuiMenuElement;
    "lg-menu-item": LiteGuiMenuItemElement;
  }
}
