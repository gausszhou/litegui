import { ComplexList } from "@gausszhou/litegui-components/complex-list";
import { LiteGuiElement } from "../base";

export interface LiteGuiComplexListItem {
  id?: string;
  name?: string;
  content?: string;
  enabled?: boolean;
  removable?: boolean;
  [key: string]: unknown;
}

/**
 * `<lg-complex-list items='[{"id":"a","name":"Alpha","enabled":true}]'>`
 *
 * - 选中条目：`litegui-select` → `{ value, item }`
 * - 勾选/取消勾选：`litegui-toggle` → `{ value, enabled, item }`
 * - 点击删除按钮：`litegui-remove` → `{ value, item }`（不自动删除数据，由使用方处理）
 */
export class LiteGuiComplexListElement extends LiteGuiElement {
  static observedAttributes = ["items", "height"];
  static hostStyles = ":host { display: block; min-height: 80px; }";

  #list: ComplexList | null = null;

  protected render() {
    this.#list = new ComplexList({ height: this.optionalNumberAttr("height") });
    this.#list.onItemSelected = item => {
      this.emit("litegui-select", { value: this.#valueOf(item), item });
    };
    this.#list.onItemToggled = (item, element) => {
      const enabled = element.classList.contains("lg-is-enabled");
      this.emit("litegui-toggle", { value: this.#valueOf(item), enabled, item });
    };
    this.#list.onItemRemoved = item => {
      this.emit("litegui-remove", { value: this.#valueOf(item), item });
    };
    this.setComponent(this.#list);
    this.#syncItems();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#list) return;
    if (name === "items") this.#syncItems();
    if (name === "height") {
      const height = this.optionalNumberAttr("height");
      this.#list.root.style.height = height === undefined ? "" : `${height}px`;
    }
  }

  #syncItems() {
    if (!this.#list) return;
    this.#list.clear();
    for (const item of this.items) {
      const text = item.name ?? item.content ?? item.id ?? "";
      this.#list.addItem(item, text, item.enabled, item.removable !== false);
    }
  }

  #valueOf(item: LiteGuiComplexListItem | undefined): string {
    if (!item) return "";
    return String(item.id ?? item.name ?? item.content ?? "");
  }

  get items(): LiteGuiComplexListItem[] {
    return this.jsonAttr<LiteGuiComplexListItem[]>("items", []);
  }
  set items(value: LiteGuiComplexListItem[]) {
    this.reflect("items", JSON.stringify(value));
  }

  get height(): number | undefined {
    return this.optionalNumberAttr("height");
  }
  set height(value: number | undefined) {
    this.reflect("height", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-complex-list": LiteGuiComplexListElement;
  }
}
