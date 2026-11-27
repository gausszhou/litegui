import { Tree } from "@gausszhou/litegui-components/tree";
import { LiteGuiElement } from "../base";

export interface LiteGuiTreeNode {
  id?: string;
  content?: string;
  children?: LiteGuiTreeNode[];
  [key: string]: unknown;
}

const EMPTY_TREE: LiteGuiTreeNode = { id: "root", content: "" };

/**
 * `<lg-tree data='{"id":"root","content":"场景","children":[...]}' height="240" allow-rename>`
 *
 * 选中节点派发 `litegui-select`，detail 为 `{ id }`。
 * 双击重命名由原生 Tree 处理（需要 `allow-rename`）。
 */
export class LiteGuiTreeElement extends LiteGuiElement {
  static observedAttributes = ["data", "height", "allow-rename"];
  static hostStyles = ":host { display: block; min-height: 120px; }";

  #tree: Tree | null = null;

  protected render() {
    this.#tree = new Tree(this.#data(), {
      height: this.optionalNumberAttr("height"),
      allow_rename: this.boolAttr("allow-rename")
    });

    // Tree 在节点点击时向 root 派发 item_selected，直接监听 DOM 事件即可。
    this.#tree.root.addEventListener("item_selected", (event: Event) => {
      const detail = (event as CustomEvent<{ data?: LiteGuiTreeNode }>).detail;
      const id = detail?.data?.id ?? "";
      this.emit("litegui-select", { id });
    });

    this.setComponent(this.#tree);
    this.#applyHeight();
  }

  protected onAttributeChanged(name: string) {
    if (!this.#tree) return;
    if (name === "data") {
      this.#tree.updateTree(this.#data());
    } else if (name === "height") {
      this.#applyHeight();
    } else if (name === "allow-rename") {
      this.#tree.options.allow_rename = this.boolAttr("allow-rename");
    }
  }

  #data(): LiteGuiTreeNode {
    const parsed = this.jsonAttr<LiteGuiTreeNode | LiteGuiTreeNode[] | null>("data", null);
    if (Array.isArray(parsed)) return { id: "root", content: "", children: parsed };
    return parsed ?? EMPTY_TREE;
  }

  #applyHeight() {
    if (!this.#tree) return;
    const height = this.optionalNumberAttr("height");
    this.#tree.root.style.height = height === undefined ? "" : `${height}px`;
  }

  get data(): LiteGuiTreeNode {
    return this.#data();
  }
  set data(value: LiteGuiTreeNode) {
    this.reflect("data", JSON.stringify(value));
  }

  get height(): number | undefined {
    return this.optionalNumberAttr("height");
  }
  set height(value: number | undefined) {
    this.reflect("height", value);
  }

  get allowRename(): boolean {
    return this.boolAttr("allow-rename");
  }
  set allowRename(value: boolean) {
    this.reflect("allow-rename", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-tree": LiteGuiTreeElement;
  }
}
