import { ImageEditor } from "@gausszhou/litegui-components/image-editor";
import { LiteGuiElement } from "../base";

/**
 * `<lg-image-editor src="./render.png" title="Render Result" zoom="1">`
 *
 * 滚轮缩放或点击缩放按钮时派发 `litegui-zoom`，detail 为 `{ zoom }`。
 * 注意：`title` 是宿主元素的标准全局 attribute，这里复用它作为图片标题。
 */
export class LiteGuiImageEditorElement extends LiteGuiElement {
  static observedAttributes = ["src", "title", "zoom"];
  static hostStyles = ":host { display: block; height: 300px; min-height: 180px; }";

  #editor: ImageEditor | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    const src = this.getAttribute("src") ?? "";
    this.#editor = new ImageEditor({
      src: src || undefined,
      title: this.title || "Image",
      zoom: this.zoom
    });
    this.#editor.on("zoom", payload => {
      const zoom = Number(payload);
      this.reflect("zoom", zoom);
      this.emit("litegui-zoom", { zoom });
    });
    this.setComponent(this.#editor);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#editor) return;
    switch (name) {
      case "src":
        this.#editor.setSource(this.getAttribute("src") ?? "");
        break;
      case "title":
        this.#editor.setTitle(this.title || "Image");
        break;
      case "zoom":
        this.#editor.setZoom(this.zoom, false);
        break;
    }
  }

  get src(): string {
    return this.stringAttr("src");
  }
  set src(value: string) {
    this.reflect("src", value);
  }

  get zoom(): number {
    return this.numberAttr("zoom", 1);
  }
  set zoom(value: number) {
    this.reflect("zoom", value);
  }

  fit(): this {
    this.#editor?.fit(true);
    return this;
  }

  resetView(): this {
    this.#editor?.resetView(true);
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-image-editor": LiteGuiImageEditorElement;
  }
}
