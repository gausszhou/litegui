import { describe, expect, it } from "vitest";
import { escapeHTML } from "@gausszhou/litegui-core";
import { Table } from "@gausszhou/litegui-components";
import { Menu } from "@gausszhou/litegui-components";
import { LiteGUI } from "@gausszhou/litegui-components";

describe("HTML escaping", () => {
  it("escapes the five HTML-sensitive characters", () => {
    expect(escapeHTML('<a href="x">&\'</a>')).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;"
    );
    expect(LiteGUI.escapeHTML("<b>")).toBe("&lt;b&gt;");
  });

  it("renders table cells as text by default", () => {
    const table = new Table({ columns: ["Name"] });
    table.setRows([{ name: "<b>Alice</b>" }]);

    const cell = table.root.querySelector("td") as HTMLTableCellElement;
    expect(cell.textContent).toBe("<b>Alice</b>");
    expect(cell.querySelector("b")).toBeNull();
  });

  it("allows HTML cells only when explicitly enabled", () => {
    const table = new Table({ columns: ["Name"], allowHTML: true });
    table.setRows([{ name: "<b>Alice</b>" }]);

    expect(table.root.querySelector("td b")?.textContent).toBe("Alice");
  });

  it("renders menu labels as text", () => {
    const menu = new Menu("safe");
    menu.add("File/<img src=x onerror=alert(1)>");
    document.body.appendChild(menu.root);

    menu.root.querySelector<HTMLElement>(".lg-menu__item")?.click();

    const label = document.querySelector(".lg-menu__panel-item .lg-menu__name");
    expect(label?.textContent).toBe("<img src=x onerror=alert(1)>");
    expect(document.querySelector("img")).toBeNull();
  });
});
