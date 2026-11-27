import { List } from "@gausszhou/litegui-components/list";
import { LiteGuiElement } from "../base";

export interface LiteGuiListItem {
  id?: string;
  value?: string;
  label?: string;
  checked?: boolean;
}

let listId = 0;

/**
 * `<lg-list items='["苹果","香蕉"]'>`
 *
 * 也可以直接用 light DOM 子元素提供条目：
 *
 * ```html
 * <lg-list>
 *   <li>苹果</li>
 *   <li>香蕉</li>
 * </lg-list>
 * ```
 *
 * 选中条目时派发 `litegui-select`，detail 为 `{ value }`。
 */
export class LiteGuiListElement extends LiteGuiElement {
  static observedAttributes = ["items"];
  static hostStyles = ":host { display: block; min-width: 100px; }";

  #list: List | null = null;

  protected render() {
    this.#mount();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#list || name !== "items") return;
    this.#mount();
  }

  #mount() {
    // ListItem 的 checked 在原生类型里是必填，这里允许调用方省略。
    const items = this.#items() as Array<string | { id?: string; value?: string; label?: string; checked: boolean }>;
    this.#list = new List(`lg-list-${++listId}`, items, {
      callback: element => {
        const value = (element as HTMLElement).dataset.value ?? "";
        this.emit("litegui-select", { value });
      }
    });
    this.setComponent(this.#list);
  }

  #items(): Array<string | LiteGuiListItem> {
    const parsed = this.jsonAttr<Array<string | LiteGuiListItem> | null>("items", null);
    if (Array.isArray(parsed)) return parsed;

    const items: Array<string | LiteGuiListItem> = [];
    for (const child of Array.from(this.children)) {
      const value = child.getAttribute("value") ?? child.textContent?.trim() ?? "";
      if (!value) continue;
      const id = child.getAttribute("id");
      items.push(id ? { id, value, label: value } : value);
    }
    return items;
  }

  get items(): Array<string | LiteGuiListItem> {
    return this.jsonAttr<Array<string | LiteGuiListItem>>("items", []);
  }
  set items(value: Array<string | LiteGuiListItem>) {
    this.reflect("items", JSON.stringify(value));
  }

  /** 当前选中值（原生 List 的 getSelectedValue） */
  get value(): string | null {
    return this.#list?.getSelectedValue() ?? null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-list": LiteGuiListElement;
  }
}
