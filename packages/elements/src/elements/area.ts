import { Area } from "@gausszhou/litegui-components/area";
import { LiteGuiElement } from "../base";

/**
 * `<lg-area sections="2">默认插槽内容会进入第一个 section</lg-area>`
 *
 * `sections` 大于 1 时按 `direction`（`horizontal` 默认 / `vertical`）递归分割；
 * 拖动分割条或窗口尺寸变化时派发 `litegui-resize`，detail 为 `{ sections }`。
 */
export class LiteGuiAreaElement extends LiteGuiElement {
  static observedAttributes = ["sections", "direction"];
  static hostStyles = ":host { display: block; height: 240px; min-height: 120px; }";

  #area: Area | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#mount();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#area) return;
    if (name === "sections" || name === "direction") {
      this.#mount();
    }
  }

  #mount() {
    const area = new Area({ width: "100%", height: "100%" });
    this.#area = area;
    this.setComponent(area);

    // 默认插槽放进第一个 section（未分割时就是 area 内容区）。
    area.content.appendChild(document.createElement("slot"));

    const notify = () => {
      this.emit("litegui-resize", { sections: this.#area?.sections.length ?? 0 });
    };
    area.addEventListener("split_moved", notify);
    area.root.addEventListener("mouseup", notify);

    this.#split(this.sections);
  }

  /** Area 只支持一次二分，递归分割第二个 section 来得到 N 个区域。 */
  #split(count: number) {
    const area = this.#area;
    if (!area || count < 2) return;
    area.split(this.direction, ["50%", null], true);
    const second = area.sections[1];
    if (second && count > 2) {
      second.split(this.direction, ["50%", null], true);
      let current = second.sections[1];
      for (let i = 3; i < count && current; i += 1) {
        current.split(this.direction, ["50%", null], true);
        current = current.sections[1];
      }
    }
  }

  get sections(): number {
    return Math.max(1, Math.round(this.numberAttr("sections", 1)));
  }
  set sections(value: number) {
    this.reflect("sections", value);
  }

  get direction(): "horizontal" | "vertical" {
    return this.stringAttr("direction", "horizontal") === "vertical" ? "vertical" : "horizontal";
  }
  set direction(value: "horizontal" | "vertical") {
    this.reflect("direction", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-area": LiteGuiAreaElement;
  }
}
