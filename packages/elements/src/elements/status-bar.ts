import { StatusBar } from "@gausszhou/litegui-components/status-bar";
import { LiteGuiElement } from "../base";

type Region = "left" | "right";

/**
 * `<lg-status-bar left="就绪" right='["Ln 1","UTF-8"]'>`
 *
 * `left` / `right` 可以传普通文本或 JSON 字符串数组；也支持命名插槽：
 *
 * ```html
 * <lg-status-bar>
 *   <span slot="left">就绪</span>
 *   <span slot="right">v1.0</span>
 * </lg-status-bar>
 * ```
 */
export class LiteGuiStatusBarElement extends LiteGuiElement {
  static observedAttributes = ["left", "right"];
  static hostStyles = ":host { display: block; }";

  #bar: StatusBar | null = null;
  #slots: Partial<Record<Region, HTMLSlotElement>> = {};

  protected render() {
    this.#bar = new StatusBar();
    this.setComponent(this.#bar);
    this.#syncRegion("left");
    this.#syncRegion("right");
  }

  protected onAttributeChanged(name: string) {
    if (!this.#bar) return;
    if (name === "left" || name === "right") this.#syncRegion(name);
  }

  #syncRegion(region: Region) {
    const bar = this.#bar;
    if (!bar) return;
    const target = region === "left" ? bar.leftElement : bar.rightElement;

    if (this.hasAttribute(region)) {
      const raw = this.getAttribute(region) ?? "";
      if (region === "left") bar.setLeft(raw);
      else bar.setRight(this.#items(raw));
      return;
    }

    let slot = this.#slots[region];
    if (!slot) {
      slot = document.createElement("slot");
      slot.name = region;
      this.#slots[region] = slot;
    }
    if (!target.contains(slot)) target.appendChild(slot);
  }

  #items(raw: string): string[] {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(item => (typeof item === "string" ? item : String(item)));
      }
    } catch {
      // 逗号分隔的普通文本
    }
    return raw
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }

  get left(): string {
    return this.stringAttr("left");
  }
  set left(value: string) {
    this.reflect("left", value);
  }

  get right(): string {
    return this.stringAttr("right");
  }
  set right(value: string) {
    this.reflect("right", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-status-bar": LiteGuiStatusBarElement;
  }
}
