import { Inspector } from "@gausszhou/litegui-components/inspector";
import { LiteGuiElement } from "../base";

export type LiteGuiInspectorItemType =
  | "string"
  | "number"
  | "slider"
  | "checkbox"
  | "color"
  | "vector3"
  | "separator"
  | "title"
  | "info";

export interface LiteGuiInspectorItem {
  type: LiteGuiInspectorItemType;
  name?: string;
  value?: unknown;
  /** 传给原生 widget 的额外选项（min/max/step/...），不含函数 */
  options?: Record<string, unknown>;
}

/** Inspector 仍使用 prototype 风格 API（源码 @ts-nocheck），这里补一份用到的签名。 */
interface InspectorLike {
  add(type: string, name?: string, value?: unknown, options?: Record<string, unknown>): HTMLElement | null;
  addSeparator(): HTMLElement;
  addTitle(title: string, options?: Record<string, unknown>): HTMLElement;
  clear(): void;
}

/**
 * `<lg-inspector items='[{"type":"slider","name":"Opacity","value":0.5,"options":{"min":0,"max":1}}]'>`
 *
 * 支持 string / number / slider / checkbox / color / vector3（以及 separator / title / info）。
 * 任一 widget 变化时派发 `litegui-change`，detail 为 `{ name, value }`。
 */
export class LiteGuiInspectorElement extends LiteGuiElement {
  static observedAttributes = ["items"];
  static hostStyles = ":host { display: block; min-width: 220px; min-height: 80px; }";

  #inspector: Inspector | null = null;

  protected render() {
    this.#inspector = new Inspector({
      full: true,
      onchange: (name: string, value: unknown) => {
        this.emit("litegui-change", { name, value });
      }
    });
    this.setComponent(this.#inspector as unknown as { root: HTMLElement });
    this.#build();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#inspector || name !== "items") return;
    this.#build();
  }

  #build() {
    const inspector = this.#inspector as unknown as InspectorLike | null;
    if (!inspector) return;
    inspector.clear();

    for (const item of this.items) {
      if (item.type === "separator") {
        inspector.addSeparator();
        continue;
      }
      if (item.type === "title") {
        inspector.addTitle(item.name ?? "");
        continue;
      }
      inspector.add(item.type, item.name ?? "", item.value, item.options);
    }
  }

  get items(): LiteGuiInspectorItem[] {
    return this.jsonAttr<LiteGuiInspectorItem[]>("items", []);
  }
  set items(value: LiteGuiInspectorItem[]) {
    this.reflect("items", JSON.stringify(value));
  }

  /** 读取所有 widget 的当前值 */
  getValues(): Record<string, unknown> {
    return (this.#inspector as unknown as { getValues?: () => Record<string, unknown> })?.getValues?.() ?? {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-inspector": LiteGuiInspectorElement;
  }
}
