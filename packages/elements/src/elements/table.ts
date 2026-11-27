import { Table } from "@gausszhou/litegui-components/table";
import type { TableColumn } from "@gausszhou/litegui-components/table";
import { LiteGuiElement } from "../base";

export type LiteGuiTableColumn = TableColumn;

/**
 * `<lg-table columns='["Name","Age"]' rows='[{"name":"A","age":1}]' height="200" scrollable>`
 *
 * `columns` 支持字符串或 `{ name, field, width, className }`。
 * light DOM 插槽会追加到表格下方，可用于空状态或说明文字。
 */
export class LiteGuiTableElement extends LiteGuiElement {
  static observedAttributes = ["columns", "rows", "height", "scrollable"];
  static hostStyles = ":host { display: block; min-height: 80px; }";

  #table: Table | null = null;

  protected render() {
    this.#table = new Table({
      columns: this.columns,
      rows: this.rows,
      height: this.optionalNumberAttr("height"),
      scrollable: this.boolAttr("scrollable")
    });
    this.setComponent(this.#table);

    // 表格下方仍可使用默认插槽放自定义内容
    this.mountPoint.appendChild(document.createElement("slot"));
  }

  protected onAttributeChanged(name: string) {
    if (!this.#table) return;
    switch (name) {
      case "columns":
        this.#table.setColumns(this.columns);
        break;
      case "rows":
        this.#table.setRows(this.rows);
        break;
      case "height": {
        const height = this.optionalNumberAttr("height");
        this.#table.root.style.height = height === undefined ? "" : `${height}px`;
        break;
      }
      case "scrollable":
        this.#table.root.style.overflow = this.boolAttr("scrollable") ? "auto" : "";
        break;
    }
  }

  get columns(): LiteGuiTableColumn[] {
    return this.jsonAttr<LiteGuiTableColumn[]>("columns", []);
  }
  set columns(value: LiteGuiTableColumn[]) {
    this.reflect("columns", JSON.stringify(value));
  }

  get rows(): unknown[] {
    return this.jsonAttr<unknown[]>("rows", []);
  }
  set rows(value: unknown[]) {
    this.reflect("rows", JSON.stringify(value));
  }

  get height(): number | undefined {
    return this.optionalNumberAttr("height");
  }
  set height(value: number | undefined) {
    this.reflect("height", value);
  }

  get scrollable(): boolean {
    return this.boolAttr("scrollable");
  }
  set scrollable(value: boolean) {
    this.reflect("scrollable", value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-table": LiteGuiTableElement;
  }
}
