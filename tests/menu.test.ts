import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu } from "../src/packages/Menu";
import { LiteGUI } from "../src/packages/index";

afterEach(() => {
  LiteGUI.root = document.body;
});

describe("Menu", () => {
  it("builds a path tree and only attaches data to the leaf", () => {
    const onNew = vi.fn();
    const onOpen = vi.fn();
    const menu = new Menu("main");

    menu.add("File/New", { callback: onNew });
    menu.add("File/Open", { callback: onOpen });

    expect(menu.root.id).toBe("main");
    expect(menu.menus).toHaveLength(1);
    expect(menu.menus[0].name).toBe("File");
    expect(menu.menus[0].data).toBeNull();
    expect(menu.menus[0].children).toHaveLength(2);
    expect(menu.findMenu("File/Open")?.data?.callback).toBe(onOpen);
  });

  it("opens a panel and invokes the leaf callback", () => {
    LiteGUI.root = document.body;
    const onNew = vi.fn();
    const menu = new Menu("main");
    menu.add("File/New", { callback: onNew });
    document.body.appendChild(menu.root);

    menu.root.querySelector<HTMLElement>(".lite-menu-item")?.click();

    const entries = document.querySelectorAll<HTMLElement>(".lite-menu-panel-item");
    expect(entries.length).toBe(1);
    entries[0].click();

    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("finds, removes and clears entries", () => {
    const menu = new Menu("main");
    menu.add("Edit/Copy");
    menu.add("Edit/Paste");

    expect(menu.findMenu("Edit/Copy")?.name).toBe("Copy");

    menu.remove("Edit/Copy");
    expect(menu.findMenu("Edit/Copy")).toBeNull();

    menu.clear();
    expect(menu.menus).toHaveLength(0);
  });
});
