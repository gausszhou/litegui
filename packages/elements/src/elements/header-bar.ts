import { HeaderBar } from "@gausszhou/litegui-components/header-bar";
import { LiteGuiElement } from "../base";

// 子路径入口没有 re-export 该类型，这里按原生组件签名声明一份。
type HeaderBarContent = string | HTMLElement | Array<string | HTMLElement>;

type Region = "left" | "center" | "right";

/**
 * `<lg-header-bar variant="area" title="着色器">`
 *
 * 三个区域都可以用命名插槽填充：
 *
 * ```html
 * <lg-header-bar title="编辑器">
 *   <span slot="left">左侧</span>
 *   <span slot="center">中间</span>
 *   <span slot="right">右侧</span>
 * </lg-header-bar>
 * ```
 *
 * 也可以用 `left` / `center` / `right` attribute 传入文本或 JSON 字符串数组。
 */
export class LiteGuiHeaderBarElement extends LiteGuiElement {
  static observedAttributes = ["variant", "title", "height", "left", "center", "right"];
  static hostStyles = ":host { display: block; }";

  #bar: HeaderBar | null = null;
  #slots: Partial<Record<Region, HTMLSlotElement>> = {};

  protected render() {
    this.#bar = new HeaderBar({
      variant: this.variant,
      title: this.title || undefined,
      height: this.optionalNumberAttr("height")
    });
    this.setComponent(this.#bar);

    (["left", "center", "right"] as const).forEach(region => this.#syncRegion(region));
  }

  protected onAttributeChanged(name: string) {
    if (!this.#bar) return;
    switch (name) {
      case "variant":
        this.#bar.root.classList.toggle("lg-header-bar--area", this.variant === "area");
        this.#bar.root.classList.toggle("lg-header-bar--topbar", this.variant !== "area");
        break;
      case "title":
        if (this.title) {
          this.#bar.setTitle(this.title);
        } else if (this.#bar.titleElement) {
          this.#bar.titleElement.remove();
          this.#bar.titleElement = null;
        }
        break;
      case "height": {
        const height = this.optionalNumberAttr("height");
        this.#bar.root.style.height = height === undefined ? "" : `${height}px`;
        break;
      }
      case "left":
      case "center":
      case "right":
        this.#syncRegion(name);
        break;
    }
  }

  #regionTarget(region: Region): HTMLElement | null {
    if (!this.#bar) return null;
    if (region === "left") return this.#bar.left;
    if (region === "center") return this.#bar.center;
    return this.#bar.right;
  }

  #syncRegion(region: Region) {
    const target = this.#regionTarget(region);
    if (!target) return;

    const content = this.#content(region);
    if (content !== null) {
      if (region === "left") this.#bar!.setLeft(content);
      else if (region === "center") this.#bar!.setCenter(content);
      else this.#bar!.setRight(content);
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

  #content(region: Region): HeaderBarContent | null {
    if (!this.hasAttribute(region)) return null;
    return this.#parseContent(this.getAttribute(region) ?? "");
  }

  #parseContent(raw: string): HeaderBarContent {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
    } catch {
      // 普通文本走下面的分支
    }
    return raw;
  }

  get variant(): "topbar" | "area" {
    return this.stringAttr("variant", "topbar") === "area" ? "area" : "topbar";
  }
  set variant(value: "topbar" | "area") {
    this.reflect("variant", value);
  }

  get height(): number | undefined {
    return this.optionalNumberAttr("height");
  }
  set height(value: number | undefined) {
    this.reflect("height", value);
  }

  get left(): string {
    return this.stringAttr("left");
  }
  set left(value: string) {
    this.reflect("left", value);
  }

  get center(): string {
    return this.stringAttr("center");
  }
  set center(value: string) {
    this.reflect("center", value);
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
    "lg-header-bar": LiteGuiHeaderBarElement;
  }
}
