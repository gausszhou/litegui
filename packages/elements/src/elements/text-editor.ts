import { TextEditor } from "@gausszhou/litegui-components/text-editor";
import { LiteGuiElement } from "../base";

/**
 * `<lg-text-editor value="const a = 1;" language="TypeScript">`
 *
 * - 文本变化：`litegui-change` → `{ value }`
 * - 光标移动：`litegui-cursor` → `{ line, column }`
 */
export class LiteGuiTextEditorElement extends LiteGuiElement {
  static observedAttributes = ["value", "language", "readonly"];
  static hostStyles = ":host { display: block; height: 280px; min-height: 160px; }";

  #editor: TextEditor | null = null;
  #syncing = false;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#editor = new TextEditor({
      value: this.stringAttr("value"),
      language: this.language,
      readOnly: this.boolAttr("readonly")
    });

    this.#editor.on("change", payload => {
      if (this.#syncing) return;
      const value = (payload as { value?: string } | undefined)?.value ?? this.#editor?.getValue() ?? "";
      this.emit("litegui-change", { value });
    });
    this.#editor.on("cursor", payload => {
      if (this.#syncing) return;
      const cursor = payload as { line?: number; column?: number } | undefined;
      this.emit("litegui-cursor", { line: cursor?.line ?? 1, column: cursor?.column ?? 1 });
    });

    this.setComponent(this.#editor);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#editor) return;

    switch (name) {
      case "value":
        this.#syncing = true;
        this.#editor.setValue(this.stringAttr("value"));
        this.#syncing = false;
        break;
      case "language":
        this.#languageChanged();
        break;
      case "readonly":
        this.#editor.setReadOnly(this.boolAttr("readonly"));
        break;
    }
  }

  #languageChanged() {
    const editor = this.#editor;
    if (!editor) return;
    const previous = editor.language;
    editor.language = this.language;
    // TextEditor 没有暴露 meta 元素引用，按文本替换保持标题栏同步。
    editor.root.querySelectorAll<HTMLElement>(".lg-text-editor__meta").forEach(element => {
      if (element.textContent?.includes(previous)) {
        element.textContent = element.textContent.replace(previous, this.language);
      }
    });
  }

  get value(): string {
    return this.#editor ? this.#editor.getValue() : this.stringAttr("value");
  }
  set value(value: string) {
    this.reflect("value", value);
  }

  get language(): string {
    return this.stringAttr("language", "TypeScript");
  }
  set language(value: string) {
    this.reflect("language", value);
  }

  get readonly(): boolean {
    return this.boolAttr("readonly");
  }
  set readonly(value: boolean) {
    this.reflect("readonly", value);
  }

  focus(): this {
    this.#editor?.focus();
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-text-editor": LiteGuiTextEditorElement;
  }
}
