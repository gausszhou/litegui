import { Tabs } from "@gausszhou/litegui-components/tabs";
import { LiteGuiElement } from "../base";

export interface LiteGuiTab {
  id: string;
  title?: string;
  content?: string;
}

/** 每个 lg-tabs 实例需要唯一 id，避免多个标签组之间 id 冲突 */
let tabsId = 0;

/**
 * `<lg-tabs tabs='[{"id":"a","title":"A","content":"内容"}]'>`
 *
 * 没有 `tabs` attribute 时，把 light DOM 子元素依次变成标签页，
 * 标题取 `label` / `title` attribute，内容就是子元素本身：
 *
 * ```html
 * <lg-tabs>
 *   <section label="文件">...</section>
 *   <section label="设置">...</section>
 * </lg-tabs>
 * ```
 *
 * 切换标签页派发 `litegui-change`，detail 为 `{ id }`。
 */
export class LiteGuiTabsElement extends LiteGuiElement {
  static observedAttributes = ["tabs", "mode"];
  static hostStyles = ":host { display: block; min-height: 140px; }";

  #tabs: Tabs | null = null;

  protected render() {
    const tabs = new Tabs({
      id: `lg-tabs-${++tabsId}`,
      mode: this.mode,
      callback: (id: string) => {
        this.emit("litegui-change", { id });
      }
    });
    this.#tabs = tabs;
    this.setComponent(tabs);
    this.#build();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#tabs) return;
    if (name === "tabs") {
      this.#tabs.clear();
      this.#build();
    } else if (name === "mode") {
      this.#tabs.root.className = `lg-tabs lg-tabs--${this.mode}`;
    }
  }

  #build() {
    const tabs = this.#tabs;
    if (!tabs) return;

    const parsed = this.jsonAttr<LiteGuiTab[] | null>("tabs", null);
    if (Array.isArray(parsed)) {
      parsed.forEach((tab, index) => {
        const id = tab.id || `tab-${index}`;
        tabs.addTab(id, {
          title: tab.title ?? id,
          content: tab.content,
          skip_callbacks: true
        });
      });
      return;
    }

    Array.from(this.children).forEach((child, index) => {
      const id = child.getAttribute("data-id") || child.id || `tab-${index}`;
      const title = child.getAttribute("label") || child.getAttribute("title") || child.textContent?.trim() || id;
      const tab = tabs.addTab(id, { title, skip_callbacks: true });
      tab.content.appendChild(child);
    });
  }

  get tabs(): LiteGuiTab[] {
    return this.jsonAttr<LiteGuiTab[]>("tabs", []);
  }
  set tabs(value: LiteGuiTab[]) {
    this.reflect("tabs", JSON.stringify(value));
  }

  get mode(): string {
    return this.stringAttr("mode", "horizontal") === "vertical" ? "vertical" : "horizontal";
  }
  set mode(value: string) {
    this.reflect("mode", value);
  }

  /** 当前选中的标签页 id */
  get value(): string | null {
    return this.#tabs?.getCurrentTabId() ?? null;
  }

  /** 切换到指定标签页（与原生 selectTab 一致，会派发 litegui-change） */
  selectTab(id: string): this {
    this.#tabs?.selectTab(id);
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-tabs": LiteGuiTabsElement;
  }
}
