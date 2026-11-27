import { describe, expect, it, vi } from "vitest";
import { ComplexList } from "@gausszhou/litegui";

describe("ComplexList", () => {
  it("adds titles and items with callbacks", () => {
    const list = new ComplexList();
    const onSelected = vi.fn();
    const onToggled = vi.fn();
    list.onItemSelected = onSelected;
    list.onItemToggled = onToggled;

    list.addTitle("Group");
    const item = list.addItem({ value: "a" }, "Alpha", true, true);

    expect(list.root.querySelector(".listtitle")?.textContent).toBe("Group");
    expect(item.querySelector(".title")?.textContent).toBe("Alpha");

    item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(list.getSelected()).toBe(item.item);
    expect(item.classList.contains("selected")).toBe(true);

    item.querySelector<HTMLElement>(".tick")?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(onToggled).toHaveBeenCalled();
  });

  it("removes items and clears the list", () => {
    const list = new ComplexList();
    const onRemoved = vi.fn();
    list.onItemRemoved = onRemoved;

    const item = list.addItem({ value: "a" }, "Alpha", true, true);
    item.querySelector<HTMLElement>(".trash")?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(onRemoved).toHaveBeenCalledTimes(1);

    list.clear();
    expect(list.root.children).toHaveLength(0);
  });
});

import { describe as describeComplexExtra, expect as expectComplexExtra, it as itComplexExtra } from "vitest";

describeComplexExtra("ComplexList extras", () => {
  itComplexExtra("updates content, toggles and hides items", () => {
    const list = new ComplexList();
    const item = list.addItem({}, "Old", true, true);

    item.setContent?.("New");
    expectComplexExtra(item.querySelector(".title")?.textContent).toBe("New");

    item.toggleEnabled?.();
    expectComplexExtra(item.classList.contains("enabled")).toBe(false);

    item.hide?.();
    expectComplexExtra(item.style.display).toBe("none");
    item.show?.();
    expectComplexExtra(item.style.display).toBe("");
  });

  itComplexExtra("adds HTML and clears", () => {
    const list = new ComplexList();
    list.addHTML("<b>hello</b>");
    expectComplexExtra(list.root.textContent).toContain("hello");

    list.clear();
    expectComplexExtra(list.root.children).toHaveLength(0);
  });
});
