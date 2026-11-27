import { describe, expect, it } from "vitest";
import { Table } from "@gausszhou/litegui-components";

function textContents(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll(selector)).map((element) => element.textContent);
}

describe("Table", () => {
  it("accepts string columns and maps object rows", () => {
    const table = new Table();
    table.setColumns(["Name", "Age", "Address"]);
    table.setRows([{ name: "Alice", age: 30, address: "X" }]);

    expect(textContents(table.root, "th")).toEqual(["Name", "Age", "Address"]);
    expect(textContents(table.root, "td")).toEqual(["Alice", "30", "X"]);
  });

  it("accepts object columns with explicit fields and widths", () => {
    const table = new Table({
      columns: [{ name: "Person", field: "name", width: 120 }, "Age"],
      rows: [{ name: "Bob", age: 42 }]
    });

    expect(textContents(table.root, "th")).toEqual(["Person", "Age"]);
    expect(textContents(table.root, "td")).toEqual(["Bob", "42"]);
    expect(table.root.querySelector<HTMLTableCellElement>("th")?.style.width).toBe("120px");
  });

  it("updates rows in place when reuse is requested", () => {
    const table = new Table({ columns: ["Name", "Age"] });
    table.setRows([{ name: "Alice", age: 30 }]);

    table.setRows([{ name: "Alice", age: 31 }], true);

    expect(textContents(table.root, "td")).toEqual(["Alice", "31"]);
    expect(table.rows).toHaveLength(1);
  });

  it("supports an empty constructor and appending rows", () => {
    const table = new Table();
    table.setColumns([{ name: "Only", field: "value" }]);
    const row = table.addRow({ value: "A" });

    expect(row.querySelector("td")?.textContent).toBe("A");
    expect(table.data).toHaveLength(1);
  });
});
