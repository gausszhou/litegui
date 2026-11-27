import { bench, describe } from "vitest";
import { Table } from "@gausszhou/litegui-components";

const rows = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  name: `Row ${index}`,
  value: index * 2
}));

describe("Table", () => {
  bench("render 1000 rows", () => {
    const table = new Table({ columns: ["id", "name", "value"] });
    table.setRows(rows);
  });

  bench("update 1000 rows in place", () => {
    const table = new Table({ columns: ["id", "name", "value"], rows });
    table.setRows(rows.map((row) => ({ ...row, value: row.value + 1 })), true);
  });
});
