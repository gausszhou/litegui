import { Viewport } from "@gausszhou/litegui-components/viewport";
import type { ViewportEditElement, ViewportObject, ViewportShading } from "@gausszhou/litegui-components/viewport";
import { LiteGuiElement } from "../base";

/**
 * `<lg-viewport objects='[...]' shading="solid" overlays>`
 *
 * - 指针点选对象：`litegui-select` → `{ id }`
 * - 变换/操作提示：`litegui-status` → `{ text }`
 * - 右键画布：`litegui-contextmenu` → `{ x, y }`
 * - 对象被变换：`litegui-change` → `{ objects }`
 *
 * 方法：`frameAll()`、`focusSelection()`、`setView(yaw, pitch, distance)`、`zoom(delta)`。
 */
export class LiteGuiViewportElement extends LiteGuiElement {
  static observedAttributes = [
    "objects",
    "selected",
    "overlays",
    "sidebar-open",
    "shading",
    "edit-mode",
    "edit-element",
    "brush"
  ];
  static hostStyles = ":host { display: block; position: relative; height: 320px; min-height: 200px; }";

  #viewport: Viewport | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#viewport = new Viewport({
      objects: this.objects,
      selected: this.getAttribute("selected"),
      overlays: this.boolAttr("overlays"),
      sidebarOpen: this.boolAttr("sidebar-open"),
      shading: this.shading,
      editMode: this.boolAttr("edit-mode"),
      editElement: this.editElement,
      brush: this.getAttribute("brush")
    });

    this.#viewport.on("select", payload => {
      const id = payload === null || payload === undefined ? null : String(payload);
      this.reflect("selected", id);
      this.emit("litegui-select", { id });
    });
    this.#viewport.on("status", payload => {
      this.emit("litegui-status", { text: String(payload ?? "") });
    });
    this.#viewport.on("context-menu", payload => {
      this.emit("litegui-contextmenu", payload as { x: number; y: number });
    });
    this.#viewport.on("change", () => {
      this.emit("litegui-change", { objects: this.#viewport?.getObjects() ?? [] });
    });
    this.#viewport.on("transform", payload => {
      this.emit("litegui-transform", payload);
    });

    this.setComponent(this.#viewport);
  }

  protected onDisconnect() {
    this.#viewport?.dispose();
    this.#viewport = null;
  }

  protected onReconnect() {
    this.render();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#viewport) return;
    switch (name) {
      case "objects":
        this.#viewport.setObjects(this.objects);
        break;
      case "selected":
        this.#viewport.setSelected(this.getAttribute("selected"));
        break;
      case "overlays":
        this.#viewport.setOverlays(this.boolAttr("overlays"));
        break;
      case "sidebar-open":
        this.#viewport.setSidebarOpen(this.boolAttr("sidebar-open"));
        break;
      case "shading":
        this.#viewport.setShading(this.shading);
        break;
      case "edit-mode":
        this.#viewport.setEditMode(this.boolAttr("edit-mode"));
        break;
      case "edit-element":
        this.#viewport.setEditElementMode(this.editElement);
        break;
      case "brush": {
        const brush = this.getAttribute("brush");
        this.#viewport.setBrush(brush);
        break;
      }
    }
  }

  get objects(): ViewportObject[] {
    return this.jsonAttr<ViewportObject[]>("objects", []);
  }
  set objects(value: ViewportObject[]) {
    this.reflect("objects", JSON.stringify(value));
  }

  get selected(): string | null {
    return this.getAttribute("selected");
  }
  set selected(value: string | null) {
    this.reflect("selected", value);
  }

  get overlays(): boolean {
    return this.boolAttr("overlays");
  }
  set overlays(value: boolean) {
    this.reflect("overlays", value);
  }

  get sidebarOpen(): boolean {
    return this.boolAttr("sidebar-open");
  }
  set sidebarOpen(value: boolean) {
    this.reflect("sidebar-open", value);
  }

  get shading(): ViewportShading {
    return (this.getAttribute("shading") as ViewportShading) || "solid";
  }
  set shading(value: ViewportShading) {
    this.reflect("shading", value);
  }

  get editMode(): boolean {
    return this.boolAttr("edit-mode");
  }
  set editMode(value: boolean) {
    this.reflect("edit-mode", value);
  }

  get editElement(): ViewportEditElement {
    return (this.getAttribute("edit-element") as ViewportEditElement) || "vertex";
  }
  set editElement(value: ViewportEditElement) {
    this.reflect("edit-element", value);
  }

  /** 程序化选中，不会派发 `litegui-select`。 */
  select(id: string | null): this {
    this.reflect("selected", id);
    this.#viewport?.setSelected(id);
    return this;
  }

  frameAll(): this {
    this.#viewport?.frameAll();
    return this;
  }

  focusSelection(): this {
    this.#viewport?.focusSelection();
    return this;
  }

  setView(yaw: number, pitch: number, distance?: number): this {
    this.#viewport?.setView(yaw, pitch, distance);
    return this;
  }

  zoom(delta: number): this {
    this.#viewport?.zoom(delta);
    return this;
  }

  snapshot(): string {
    return this.#viewport?.snapshot() ?? "";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-viewport": LiteGuiViewportElement;
  }
}
