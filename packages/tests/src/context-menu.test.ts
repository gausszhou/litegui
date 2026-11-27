import { describe, expect, it, vi } from "vitest";
import { ContextMenu } from "@gausszhou/litegui";

describe("ContextMenu", () => {
  it("renders items and invokes the item callback", () => {
    const callback = vi.fn();
    const menu = new ContextMenu([{ title: "Rename", callback }], { left: 10, top: 20 });

    expect(menu.root.parentElement).toBe(document.body);
    const entry = menu.root.querySelector<HTMLElement>(".litemenu-entry");
    expect(entry?.textContent).toContain("Rename");

    entry?.click();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("supports object values and closes manually", () => {
    const menu = new ContextMenu({ Delete: { title: "Delete" } });
    expect(menu.root.querySelector(".litemenu-entry")?.textContent).toContain("Delete");

    menu.close();
    expect(menu.root.parentElement).toBeNull();
  });

  it("returns the top-level menu", () => {
    const menu = new ContextMenu(["One"]);
    expect(menu.getTopMenu()).toBe(menu);
    menu.close();
  });
});

import { describe as describeSubmenu, expect as expectSubmenu, it as itSubmenu, vi as viSubmenu } from "vitest";

describeSubmenu("ContextMenu submenu", () => {
  itSubmenu("opens a submenu and runs its callback", () => {
    const childCallback = viSubmenu.fn();
    const menu = new ContextMenu([
      {
        title: "More",
        submenu: {
          options: [{ title: "Child", callback: childCallback }]
        }
      }
    ]);

    menu.root.querySelector<HTMLElement>(".litemenu-entry")?.click();

    expectSubmenu(menu.current_submenu).toBeDefined();
    const child = menu.current_submenu?.root.querySelector<HTMLElement>(".litemenu-entry");
    expectSubmenu(child?.textContent).toContain("Child");

    child?.click();
    expectSubmenu(childCallback).toHaveBeenCalledTimes(1);
  });
});

describe("ContextMenu container", () => {
  it("mounts into the provided container", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const menu = new ContextMenu([{ title: "Rename" }], { left: 10, top: 10, container: host });

    const menuRoot = host.querySelector(".litecontextmenu");
    expect(menuRoot).not.toBeNull();
    expect(menuRoot!.parentElement).toBe(host);
    menu.close();
  });
});
