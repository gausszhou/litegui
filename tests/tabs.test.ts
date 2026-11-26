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
