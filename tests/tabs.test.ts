import { describe, expect, it } from "vitest";
import { Tabs } from "../src/packages/Tabs";

describe("Tabs", () => {
  it("mounts tab content and selects the first tab", () => {
    const tabs = new Tabs();

    const first = tabs.addTab("first", { content: "First content" });
    const second = tabs.addTab("second", { content: "Second content" });

    expect(tabs.getCurrentTabId()).toBe("first");
    expect(first.content.textContent).toBe("First content");
    expect(first.content.style.display).toBe("");
    expect(second.content.style.display).toBe("none");
    expect(first.tab?.classList.contains("selected")).toBe(true);
  });

  it("switches tabs by id and by element click", () => {
    const tabs = new Tabs();
    const first = tabs.addTab("first", { content: "First" });
    const second = tabs.addTab("second", { content: "Second" });

    tabs.selectTab("second");
    expect(tabs.getCurrentTabId()).toBe("second");
    expect(first.content.style.display).toBe("none");
    expect(second.content.style.display).toBe("");

    first.tab?.click();
    expect(tabs.getCurrentTabId()).toBe("first");
    expect(first.content.style.display).toBe("");
    expect(second.content.style.display).toBe("none");
  });

  it("returns tab content and indexes", () => {
    const tabs = new Tabs();
    tabs.addTab("one", { content: "One" });
    tabs.addTab("two", { content: "Two" });

    expect(tabs.getTabContent("one")?.textContent).toBe("One");
    expect(tabs.getTabIndex("one")).toBe(0);
    expect(tabs.getTabIndex("two")).toBe(1);
    expect(tabs.getNumOfTabs()).toBe(2);
  });
});

import { describe as describeTabs, expect as expectTabs, it as itTabs, vi as viTabs } from "vitest";

describeTabs("Tabs lifecycle", () => {
  itTabs("removes a tab and its content", () => {
    const tabs = new Tabs();
    const tab = tabs.addTab("one", { content: "One", closable: true });
    tabs.removeTab("one");

    expectTabs(tabs.getNumOfTabs()).toBe(0);
    expectTabs(tab.content.parentElement).toBeNull();
  });

  itTabs("supports plus and button tabs", () => {
    const tabs = new Tabs();
    const onPlus = viTabs.fn();
    const onButton = viTabs.fn();

    tabs.addPlusTab(onPlus);
    tabs.addButtonTab("action", "Action", onButton);

    const buttons = tabs.list.querySelectorAll<HTMLElement>("li.wtab.button");
    expectTabs(buttons.length).toBe(2);
    buttons[0].click();
    buttons[1].click();

    expectTabs(onPlus).toHaveBeenCalledTimes(1);
    expectTabs(onButton).toHaveBeenCalledTimes(1);
  });

  itTabs("shows and hides a tab", () => {
    const tabs = new Tabs();
    tabs.addTab("one", { content: "One" });
    tabs.addTab("two", { content: "Two" });

    tabs.hideTab("two");
    expectTabs(tabs.getTab("two")?.tab?.style.display).toBe("none");

    tabs.showTab("two");
    expectTabs(tabs.getTab("two")?.tab?.style.display).toBe("");
  });
});
