import { sizeToCSS } from "../core/dom";
import EventMitter from "./EventMitter";

export interface TableColumnOption {
  name?: string;
  width?: string | number;
  field?: string;
  className?: string;
  th?: HTMLTableCellElement;
}

export type TableColumn = TableColumnOption | string | number;

export interface TableOptions {
  rows?: any[];
  columns?: TableColumn[];
  height?: number | string;
  scrollable?: boolean;
  /** 默认 false：单元格按纯文本渲染；显式开启后才允许 HTML。 */
  allowHTML?: boolean;
}

export class Table extends EventMitter {
  root: HTMLTableElement;
  header: HTMLTableRowElement;
  data: any[] = [];
  rows: HTMLTableRowElement[] = [];
  columns: TableColumnOption[] = [];
  column_fields: string[] = [];
  private _must_update_header = true;
  private allowHTML = false;

  constructor(options: TableOptions = {}) {
    super();
    this.allowHTML = Boolean(options.allowHTML);
    this.root = this.createRoot();
    this.header = document.createElement("tr");

    if (options.columns) this.setColumns(options.columns); // must before setRows
    if (options.rows) this.setRows(options.rows, false);
    if (options.scrollable) this.root.style.overflow = "auto";
    if (options.height) this.root.style.height = sizeToCSS(options.height);
  }

  createRoot() {
    const root = document.createElement("table");
    root.classList.add("litetable");
    return root;
  }

  setRows(data: any[], reuse: boolean = false) {
    this.data = data;
    this.updateContent(reuse);
  }

  addRow(row: any, skip_add: boolean = false) {
    const tr = document.createElement("tr");
    for (let j = 0; j < this.column_fields.length; ++j) {
      const td = document.createElement("td");
      const value = Array.isArray(row) ? row[j] : row[this.column_fields[j]];
      this.setCellValue(td, value);

      const column = this.columns[j];
      if (!column) break;
      if (column.className) td.className = column.className;
      if (column.width) td.style.width = String(column.width);
      tr.appendChild(td);
    }

    this.root.appendChild(tr);
    this.rows.push(tr);
    if (!skip_add) this.data.push(row);

    return tr;
  }

  updateRow(index: number, row: any) {
    this.data[index] = row;

    const tr = this.rows[index];
    if (!tr) return null;

    const cells = tr.querySelectorAll("td");
    for (let j = 0; j < cells.length; ++j) {
      const column = this.columns[j];
      if (!column) continue;
      const value = Array.isArray(row) ? row[j] : row[column.field as string];
      this.setCellValue(cells[j] as HTMLElement, value);
    }
    return tr;
  }

  updateCell(rowIndex: number, cellIndex: number, data: string) {
    const tr = this.rows[rowIndex];
    if (!tr) return null;
    const cell = tr.children[cellIndex] as HTMLElement | undefined;
    if (!cell) return null;
    this.setCellValue(cell, data);
    return cell;
  }

  private setCellValue(cell: HTMLElement, value: unknown) {
    const text = value === undefined || value === null ? "" : String(value);
    if (this.allowHTML) cell.innerHTML = text;
    else cell.textContent = text;
  }

  setColumns(columns: TableColumn[]) {
    this.columns.length = 0;
    this.column_fields.length = 0;

    const avgWidth = Math.floor(100 / columns.length).toFixed(1) + "%";
    const usedWidths: string[] = [];

    for (let i = 0; i < columns.length; ++i) {
      const c = columns[i];
      if (c === null || c === undefined) continue;

      const isPrimitive = typeof c === "string" || typeof c === "number";
      const name = isPrimitive ? String(c) : c.name ?? "";
      const field = isPrimitive ? String(c).toLowerCase() : (c.field ?? name).toLowerCase();
      const widthValue = isPrimitive ? undefined : c.width;
      const className = isPrimitive ? undefined : c.className;

      const column: TableColumnOption = {
        name,
        width: sizeToCSS(widthValue === undefined ? avgWidth : widthValue),
        field,
        className
      };

      // Last column fills the remaining width.
      if (i === columns.length - 1) {
        column.width = usedWidths.length
          ? `calc(100% - (${usedWidths.join(" + ")}))`
          : "100%";
      } else {
        usedWidths.push(String(column.width));
      }

      this.columns.push(column);
      this.column_fields.push(field);
    }

    this._must_update_header = true;
    this.updateContent();
  }

  updateContent(reuse: boolean = false) {
    this.root.innerHTML = "";

    if (this._must_update_header) {
      this.header = document.createElement("tr");
      for (let i = 0; i < this.columns.length; ++i) {
        const column = this.columns[i];
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = column.name ?? "";
        if (column.width) th.style.width = String(column.width);
        column.th = th;
        this.header.appendChild(th);
      }
      this._must_update_header = false;
    }
    this.root.appendChild(this.header);

    if (!this.data) return false;
    if (this.data.length !== this.rows.length) {
      reuse = false;
    }

    if (reuse) {
      for (let i = 0; i < this.rows.length; ++i) {
        const tr = this.updateRow(i, this.data[i]);
        if (tr) this.root.appendChild(tr);
      }
    } else {
      this.rows.length = 0;
      for (let i = 0; i < this.data.length; ++i) {
        this.addRow(this.data[i], true);
      }
    }
    return true;
  }
}

export default Table;
