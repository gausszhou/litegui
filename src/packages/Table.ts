import LiteGUI from ".";
import EventMitter from "./EventMitter";

interface TableColumnOption {
  name: string;
  width: string;
  field: string;
  className: string;
  th?: HTMLTableCellElement;
}

interface TableOptions {
  rows?: Object[] | Array<any>[];
  columns?: TableColumnOption[];
  height?: number;
  scrollable?: boolean;
}

class Table extends EventMitter {
  root: HTMLTableElement;
  header: any;
  data: Object[] | Array<any>[] = [];
  rows: HTMLTableRowElement[] = [];
  columns: TableColumnOption[] = []
  column_fields: string[] = [];
  private _must_update_header = true;
  constructor(options: TableOptions) {
    super();
    this.root = this.createRoot();

    if (options.columns) this.setColumns(options.columns); // must before setRows
    if (options.rows) this.setRows(options.rows, false);
    if (options.scrollable) this.root.style.overflow = "auto";
    if (options.height) this.root.style.height = LiteGUI.sizeToCSS(options.height);
  }
  createRoot() {
    const root = document.createElement("table");
    root.classList.add("litetable");
    return root;
  }
  setRows(data: any[], reuse: boolean) {
    this.data = data;
    this.updateContent(reuse);
  };

  addRow(row: any, skip_add: boolean) {
    const tr = document.createElement("tr");
    // create cells
    for (var j = 0; j < this.column_fields.length; ++j) {
      const td = document.createElement("td");
      // value
      let value = null;
      if (row instanceof Array) {
        value = row[j];
      } else {
        value = row[this.column_fields[j]];
      }
      if (value === undefined) value = "";
      td.innerHTML = value;
      // style
      const column = this.columns[j];
      if (column === undefined) break;
      if (column.className) td.className = column.className;
      if (column.width) td.style.width = column.width;
      tr.appendChild(td);
    }

    this.root.appendChild(tr);
    this.rows.push(tr);
    if (!skip_add) this.data.push(row);

    return tr;
  };

  updateRow(index: number, row: any) {
    this.data[index] = row;

    const tr = this.rows[index];
    if (!tr) return null;

    var cells = tr.querySelectorAll("td");
    for (var j = 0; j < cells.length; ++j) {
      var column = this.columns[j];

      var value = null;

      if (row.constructor === Array) value = row[j];
      else value = row[column.field];

      if (value === undefined) value = "";

      cells[j].innerHTML = value;
    }
    return tr;
  };

  updateCell(rowIndex: number, cellIndex: number, data: string) {
    const tr = this.rows[rowIndex];
    if (!tr) return null;
    const cell = tr.childNodes[cellIndex] as HTMLElement;
    if (!cell) return null;
    cell.innerHTML = data;
    return cell;
  };

  setColumns(columns: TableColumnOption[]) {
    this.columns.length = 0;
    this.column_fields.length = 0;

    var avg_width = Math.floor(100 / columns.length).toFixed(1) + "%";

    var rest = [];

    for (var i = 0; i < columns.length; ++i) {
      const c = columns[i];

      if (c === null || c === undefined) continue;
      const cName = c.name
      //allow to pass just strings or numbers instead of objects
      if (c.constructor === String || c.constructor === Number) {
        cName: String(c)
      }

      const column = {
        name: cName || "",
        width: LiteGUI.sizeToCSS(c.width || avg_width),
        field: (c.field || cName || "").toLowerCase(),
        className: c.className
      };

      //last
      if (i == columns.length - 1) column.width = " calc( 100% - ( " + rest.join(" + ") + " ) )";
      else rest.push(column.width);

      this.columns.push(column);
      this.column_fields.push(column.field);
    }

    this._must_update_header = true;
    this.updateContent();
  };

  updateContent(reuse = false) {
    this.root.innerHTML = "";

    //update header
    if (this._must_update_header) {
      this.header = document.createElement("tr");
      for (var i = 0; i < this.columns.length; ++i) {
        const column = this.columns[i];
        const th = document.createElement("th");
        th.innerHTML = column.name;
        if (column.width) th.style.width = column.width;
        column.th = th;
        this.header.appendChild(th);
      }
      this._must_update_header = false;
    }
    this.root.appendChild(this.header);

    if (!this.data) return false;
    if (this.data.length != this.rows.length) {
      reuse = false;
    }

    if (reuse) {
      for (var i = 0; i < this.rows.length; ++i) {
        const data_row = this.data[i];
        const tr = this.updateRow(i, data_row);
        tr && this.root.appendChild(tr);
      }
    } else {
      this.rows.length = 0;
      //create rows
      for (var i = 0; i < this.data.length; ++i) {
        var row = this.data[i];
        this.addRow(row, true);
      }
    }
    return true;
  };
}


export default Table;
