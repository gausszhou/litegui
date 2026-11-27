import { NodeEditor } from "@gausszhou/litegui-components/node-editor";
import { LiteGuiElement } from "../base";

export interface LiteGuiNodePort {
  id: string;
  name: string;
}

export interface LiteGuiNodeEditorNode {
  id: string;
  title: string;
  x: number;
  y: number;
  width?: number;
  color?: string;
  inputs?: LiteGuiNodePort[];
  outputs?: LiteGuiNodePort[];
}

export interface LiteGuiNodeEditorLink {
  from: string;
  fromPort: string;
  to: string;
  toPort: string;
}

/**
 * `<lg-node-editor nodes='[...]' links='[...]'>`
 *
 * - 节点被拖动/删除、连线变化：`litegui-change` → `{ nodes, links }`
 * - 选中节点：`litegui-select` → `{ id }`
 */
export class LiteGuiNodeEditorElement extends LiteGuiElement {
  static observedAttributes = ["nodes", "links", "readonly"];
  static hostStyles = ":host { display: block; height: 320px; min-height: 200px; }";

  #editor: NodeEditor | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#editor = new NodeEditor({
      nodes: this.nodes,
      links: this.links,
      readOnly: this.boolAttr("readonly")
    });

    this.#editor.on("change", payload => {
      this.emit("litegui-change", payload);
    });
    this.#editor.on("select", payload => {
      this.emit("litegui-select", { id: payload === null || payload === undefined ? null : String(payload) });
    });

    this.setComponent(this.#editor);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#editor) return;
    if (name === "nodes" || name === "links") {
      this.#editor.setGraph(this.nodes, this.links);
    } else if (name === "readonly") {
      // NodeEditor 的 readOnly 是私有字段，运行时同步即可。
      (this.#editor as unknown as { readOnly: boolean }).readOnly = this.boolAttr("readonly");
    }
  }

  get nodes(): LiteGuiNodeEditorNode[] {
    return this.jsonAttr<LiteGuiNodeEditorNode[]>("nodes", []);
  }
  set nodes(value: LiteGuiNodeEditorNode[]) {
    this.reflect("nodes", JSON.stringify(value));
  }

  get links(): LiteGuiNodeEditorLink[] {
    return this.jsonAttr<LiteGuiNodeEditorLink[]>("links", []);
  }
  set links(value: LiteGuiNodeEditorLink[]) {
    this.reflect("links", JSON.stringify(value));
  }

  get selected(): string | null {
    return this.#editor?.getSelected() ?? null;
  }

  /** 选择节点（不会派发 litegui-select，与原生 select() 一致） */
  select(id: string | null): this {
    this.#editor?.select(id);
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-node-editor": LiteGuiNodeEditorElement;
  }
}
