import { afterEach, describe, expect, it } from "vitest";
import { Checkbox } from "@gausszhou/litegui-components";
import { Dialog } from "@gausszhou/litegui-components";
import { List } from "@gausszhou/litegui-components";
import { Menu } from "@gausszhou/litegui-components";
import { SearchBox } from "@gausszhou/litegui-components";
import { Table } from "@gausszhou/litegui-components";
import { Slider } from "@gausszhou/litegui-components";
import { Tabs } from "@gausszhou/litegui-components";
import { coreState } from "@gausszhou/litegui-core";

afterEach(() => {
  coreState.modalbg = null;
  Dialog.INSTANCE_LIST.length = 0;
  Dialog.minimized.length = 0;
});

describe("accessibility attributes", () => {
  it("exposes checkbox state and supports the keyboard", () => {
    const checkbox = new Checkbox(false, {});

    expect(checkbox.root.getAttribute("role")).toBe("checkbox");
    expect(checkbox.root.getAttribute("aria-checked")).toBe("false");
    expect(checkbox.root.tabIndex).toBe(0);

    checkbox.root.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(checkbox.getValue()).toBe(true);
    expect(checkbox.root.getAttribute("aria-checked")).toBe("true");
  });

  it("marks tabs and panels", () => {
    const tabs = new Tabs();
    tabs.addTab("one", { content: "One" });
    tabs.addTab("two", { content: "Two" });

    expect(tabs.list.getAttribute("role")).toBe("tablist");
    const tabElements = tabs.list.querySelectorAll<HTMLElement>("li.lg-tabs__tab");
    expect(tabElements[0].getAttribute("role")).toBe("tab");
    expect(tabElements[0].getAttribute("aria-selected")).toBe("true");
    expect(tabElements[1].getAttribute("aria-selected")).toBe("false");

    const firstContent = tabs.getTabContent("one");
    const secondContent = tabs.getTabContent("two");
    expect(firstContent?.getAttribute("role")).toBe("tabpanel");
    expect(firstContent?.getAttribute("aria-hidden")).toBe("false");
    expect(secondContent?.getAttribute("aria-hidden")).toBe("true");
  });

  it("marks list options and updates selection", () => {
    const list = new List("list", ["A", "B"]);

    expect(list.root.getAttribute("role")).toBe("listbox");
    const options = list.root.querySelectorAll<HTMLElement>(".lg-list__item");
    expect(options[0].getAttribute("role")).toBe("option");

    options[1].click();
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
  });

  it("exposes slider values and supports arrow keys", () => {
    const slider = new Slider(0.5, { min: 0, max: 1, step: 0.1 });

    expect(slider.root.getAttribute("role")).toBe("slider");
    expect(slider.root.getAttribute("aria-valuenow")).toBe("0.5");

    slider.root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(slider.getValue()).toBeCloseTo(0.6);
    expect(slider.root.getAttribute("aria-valuenow")).toBe("0.6");
  });

  it("marks menus, search and table headers", () => {
    const menu = new Menu("main");
    menu.add("File/New");
    expect(menu.content.getAttribute("role")).toBe("menubar");
    expect(menu.root.querySelector(".lg-menu__item")?.getAttribute("role")).toBe("menuitem");

    const search = new SearchBox("", { placeholder: "Find" });
    expect(search.root.getAttribute("role")).toBe("search");
    expect(search.input.getAttribute("aria-label")).toBe("Find");

    const table = new Table({ columns: ["Name"] });
    expect(table.root.querySelector("th")?.getAttribute("scope")).toBe("col");
  });

  it("marks dialogs and modal state", () => {
    const dialog = new Dialog({ title: "Settings" });

    expect(dialog.root.getAttribute("role")).toBe("dialog");
    expect(dialog.root.getAttribute("aria-labelledby")).toBe(dialog.header.id);
    expect(dialog.header.id).not.toBe("");

    coreState.modalbg = document.createElement("div");
    dialog.makeModal();
    expect(dialog.root.getAttribute("aria-modal")).toBe("true");

    dialog.close();
    expect(dialog.root.getAttribute("aria-modal")).toBeNull();
  });
});
