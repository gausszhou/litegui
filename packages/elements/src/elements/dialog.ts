import { Dialog } from "@gausszhou/litegui-components/dialog";
import { LiteGuiElement } from "../base";

/**
 * `<litegui-dialog heading="设置" width="320" height="200" open closable>`
 *
 * `open` 控制显示/隐藏；点关闭按钮时移除 `open` 并派发 `litegui-close`。
 * 默认插槽内容放进对话框内容区。
 */
export class LiteGuiDialogElement extends LiteGuiElement {
  static observedAttributes = ["heading", "width", "height", "open"];
  static hostStyles = ":host { display: block; position: relative; min-height: 260px; }";

  #dialog: Dialog | null = null;

  protected render() {
    // Dialog 用 parent.offsetHeight 居中；百分比高度在 auto 宿主里会算成 0，
    // 因此给挂载点一个确定的像素高度（上下各留 20px）。
    const height = this.numberAttr("height", 200);
    this.mountPoint.style.height = `${height + 40}px`;
    this.#dialog = new Dialog({
      parent: this.mountPoint,
      title: this.heading,
      width: this.numberAttr("width", 320),
      height,
      close: this.boolAttr("closable"),
      draggable: true,
      resizable: true
    });

    const slot = document.createElement("slot");
    this.#dialog.content.appendChild(slot);

    this.#dialog.on("closed", () => {
      this.removeAttribute("open");
      this.emit("litegui-close", {});
    });

    this.setComponent(this.#dialog);
    this.syncOpen();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#dialog) return;
    if (name === "open") this.syncOpen();
    if (name === "width") this.#dialog.root.style.width = `${this.numberAttr("width", 320)}px`;
    if (name === "height") {
      const height = this.numberAttr("height", 200);
      this.#dialog.root.style.height = `${height}px`;
      this.mountPoint.style.height = `${height + 40}px`;
      this.#dialog.center();
    }
  }

  private syncOpen() {
    if (!this.#dialog) return;
    const open = this.boolAttr("open");

    if (open) {
      // close() 会把 root 从 DOM 移除，再次打开需要重建
      if (!this.#dialog.root.isConnected) {
        this.render();
        return;
      }
      this.#dialog.show();
      this.#dialog.center();
      return;
    }

    if (this.#dialog.root.isConnected) this.#dialog.hide();
  }

  get heading(): string {
    return this.stringAttr("heading");
  }
  set heading(value: string) {
    this.reflect("heading", value);
  }

  get open(): boolean {
    return this.boolAttr("open");
  }
  set open(value: boolean) {
    this.reflect("open", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "litegui-dialog": LiteGuiDialogElement;
  }
}
