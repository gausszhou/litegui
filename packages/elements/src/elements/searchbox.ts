import { SearchBox } from "@gausszhou/litegui-components/searchbox";
import { LiteGuiElement } from "../base";

/**
 * `<lg-searchbox value="" placeholder="搜索">`
 *
 * 输入框 change（回车 / 失焦）时派发 `litegui-change`，detail 为 `{ value }`。
 */
export class LiteGuiSearchBoxElement extends LiteGuiElement {
  static observedAttributes = ["value", "placeholder"];
  static hostStyles = ":host { display: inline-block; min-width: 120px; }";

  #search: SearchBox | null = null;
  #syncing = false;

  protected render() {
    this.#search = new SearchBox(this.value, {
      placeholder: this.placeholder || "Search",
      callback: value => {
        if (this.#syncing) return;
        this.reflect("value", value);
        this.emit("litegui-change", { value });
      }
    });
    this.setComponent(this.#search);
    this.#search.input.value = this.value;
  }

  protected onAttributeChanged(name: string) {
    if (!this.#search) return;
    if (name === "value") {
      this.#syncing = true;
      this.#search.setValue(this.value);
      this.#syncing = false;
      return;
    }
    if (name === "placeholder") {
      const placeholder = this.placeholder || "Search";
      this.#search.input.placeholder = placeholder;
      this.#search.input.setAttribute("aria-label", placeholder);
    }
  }

  get value(): string {
    return this.stringAttr("value");
  }
  set value(value: string) {
    this.reflect("value", value);
  }

  get placeholder(): string {
    return this.stringAttr("placeholder");
  }
  set placeholder(value: string) {
    this.reflect("placeholder", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-searchbox": LiteGuiSearchBoxElement;
  }
}
