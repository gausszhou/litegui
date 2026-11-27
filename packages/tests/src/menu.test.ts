import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu } from "@gausszhou/litegui-components";
import { LiteGUI } from "@gausszhou/litegui-components";

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

import { describe as describeMenuExtra, expect as expectMenuExtra, it as itMenuExtra, vi as viMenuExtra } from "vitest";

describeMenuExtra("Menu extras", () => {
  itMenuExtra("adds separators and removes entries", () => {
    const menu = new Menu("main");
    menu.add("File/New");
    menu.add("File/Open");
    menu.separator("File", 1);

    expectMenuExtra(menu.findMenu("File")?.children).toHaveLength(3);

    menu.remove("File/Open");
    expectMenuExtra(menu.findMenu("File/Open")).toBeNull();
  });

  itMenuExtra("opens submenus and runs callbacks", () => {
    const callback = viMenuExtra.fn();
    const menu = new Menu("main");
    menu.add("File/Export/JSON", { callback });
    document.body.appendChild(menu.root);
    LiteGUI.root = document.body;

    menu.root.querySelector<HTMLElement>(".lite-menu-item")?.click();
    const exportItem = Array.from(document.querySelectorAll<HTMLElement>(".lite-menu-panel-item")).find((item) =>
      item.textContent?.includes("Export")
    );
    exportItem?.click();

    const jsonItem = Array.from(document.querySelectorAll<HTMLElement>(".lite-menu-panel-item")).find((item) =>
      item.textContent?.includes("JSON")
    );
    jsonItem?.click();

    expectMenuExtra(callback).toHaveBeenCalledTimes(1);
  });
});

function domRect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    x,
    y,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("Menu positioning", () => {
  it("aligns a submenu with the clicked parent item", () => {
    const menu = new Menu("main");
    const anchor = document.createElement("p");
    anchor.getBoundingClientRect = () => domRect(100, 150, 200, 24);
    const panel = document.createElement("div");
    panel.getBoundingClientRect = () => domRect(0, 0, 180, 90);

    menu.positionPanel(panel, anchor, true);

    expect(panel.style.left).toBe("299px");
    expect(panel.style.top).toBe("150px");
  });

  it("flips the submenu left and keeps it inside a narrow viewport", () => {
    vi.stubGlobal("innerWidth", 320);
    vi.stubGlobal("innerHeight", 400);

    const menu = new Menu("main");
    const anchor = document.createElement("p");
    anchor.getBoundingClientRect = () => domRect(250, 380, 60, 24);
    const panel = document.createElement("div");
    panel.getBoundingClientRect = () => domRect(0, 0, 180, 90);

    menu.positionPanel(panel, anchor, true);

    expect(panel.style.left).toBe("71px");
    expect(panel.style.top).toBe("306px");

    vi.unstubAllGlobals();
  });

  it("closes panels at the target level and deeper", () => {
    const menu = new Menu("main");
    const panels = [1, 2, 3].map((level) => {
      const panel = document.createElement("div");
      panel.dataset.level = String(level);
      document.body.appendChild(panel);
      return panel;
    });
    menu.panels = panels;

    menu.closePanelsFromLevel(2);

    expect(panels[0].isConnected).toBe(true);
    expect(panels[1].isConnected).toBe(false);
    expect(panels[2].isConnected).toBe(false);
    expect(menu.panels).toHaveLength(1);
  });
});

describe("Menu container", () => {
  it("mounts panels into the provided container", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const menu = new Menu("main", { container: host });
    menu.add("File/New");
    document.body.appendChild(menu.root);

    menu.root.querySelector<HTMLElement>(".lite-menu-item")?.click();

    const panel = host.querySelector(".lite-menu-panel");
    expect(panel).not.toBeNull();
    expect(panel!.parentElement).toBe(host);
  });
});
