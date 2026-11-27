import { Split } from "@gausszhou/litegui-components/split";
import { LiteGuiElement } from "../base";

/**
 * `<lg-split sections="3" vertical>`
 *
 * light DOM 子元素通过命名插槽 `section-0`、`section-1`… 分发到各 section；
 * 没有指定 `slot` 的子元素按顺序轮流分配。
 */
export class LiteGuiSplitElement extends LiteGuiElement {
  static observedAttributes = ["sections", "vertical"];
  static hostStyles = ":host { display: block; height: 160px; min-height: 120px; }";

  #split: Split | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#mount();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#split) return;
    if (name === "sections" || name === "vertical") this.#mount();
  }

  #mount() {
    const count = this.sections;
    const infos = Array.from({ length: count }, () => 100 / count);
    const split = new Split(infos, { vertical: this.vertical });
    this.#split = split;

    const names = new Set<string>();
    split.sections.forEach((section, index) => {
      const name = `section-${index}`;
      names.add(name);
      const slot = document.createElement("slot");
      slot.name = name;
      section.element.appendChild(slot);
    });

    this.setComponent(split);
    this.#distribute(names, count);
  }

  #distribute(names: Set<string>, count: number) {
    let index = 0;
    for (const child of Array.from(this.children)) {
      const target = child.getAttribute("slot");
      if (!target || !names.has(target)) {
        child.setAttribute("slot", `section-${index % count}`);
      }
      index += 1;
    }
  }

  get sections(): number {
    return Math.max(1, Math.round(this.numberAttr("sections", 2)));
  }
  set sections(value: number) {
    this.reflect("sections", value);
  }

  get vertical(): boolean {
    return this.boolAttr("vertical");
  }
  set vertical(value: boolean) {
    this.reflect("vertical", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-split": LiteGuiSplitElement;
  }
}
