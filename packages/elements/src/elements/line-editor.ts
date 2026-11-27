import { LineEditor } from "@gausszhou/litegui-components/line-editor";
import { LiteGuiElement } from "../base";

/**
 * `<lg-line-editor value='[[0,0.5],[1,0.5]]' width="220" height="80">`
 *
 * 在曲线上拖动/添加控制点后派发 `litegui-change`，detail 为 `{ value }`，
 * 其中 value 是归一化的 `[x, y]` 数组。
 */
export class LiteGuiLineEditorElement extends LiteGuiElement {
  static observedAttributes = ["value", "width", "height"];
  static hostStyles = ":host { display: block; min-height: 60px; }";

  #editor: LineEditor | null = null;
  #syncing = false;

  protected render() {
    this.#editor = new LineEditor(this.value, {
      width: this.numberAttr("width", 200),
      height: this.numberAttr("height", 80),
      callback: value => {
        if (this.#syncing) return;
        this.reflect("value", JSON.stringify(value));
        this.emit("litegui-change", { value });
      }
    });
    this.setComponent(this.#editor);
    this.#applySize();
    this.#editor.redraw();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#editor) return;
    if (name === "value") {
      this.#syncing = true;
      this.#editor.value = this.value;
      this.#editor.redraw();
      this.#syncing = false;
    } else if (name === "width" || name === "height") {
      this.#applySize();
      this.#editor.redraw();
    }
  }

  #applySize() {
    if (!this.#editor) return;
    const width = this.numberAttr("width", 200);
    const height = this.numberAttr("height", 80);
    // canvas 在原生 LineEditor 里是 private，这里通过结构化类型访问。
    const editor = this.#editor as unknown as { canvas: HTMLCanvasElement };
    this.#editor.root.style.width = `${width}px`;
    editor.canvas.width = width;
    editor.canvas.height = height;
    this.#editor.redraw();
  }

  get value(): number[][] {
    return this.jsonAttr<number[][]>("value", []);
  }
  set value(value: number[][]) {
    this.reflect("value", JSON.stringify(value));
  }

  get width(): number {
    return this.numberAttr("width", 200);
  }
  set width(value: number) {
    this.reflect("width", value);
  }

  get height(): number {
    return this.numberAttr("height", 80);
  }
  set height(value: number) {
    this.reflect("height", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-line-editor": LiteGuiLineEditorElement;
  }
}
