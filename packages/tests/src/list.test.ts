import { describe, expect, it, vi } from "vitest";
import { List } from "@gausszhou/litegui-components";

describe("List", () => {
  it("renders string items and selects on click", () => {
    const callback = vi.fn();
    const list = new List("files", ["A", "B"], { callback });
    document.body.appendChild(list.root);

    expect(list.root.querySelectorAll(".lg-list__item")).toHaveLength(2);

    list.root.querySelectorAll<HTMLLIElement>(".lg-list__item")[1].click();

    expect(list.getSelectedValue()).toBe("B");
    expect(list.getSelectedItem()?.classList.contains("lg-is-selected")).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("selects an item by value", () => {
    const list = new List("files", [
      { value: "a", label: "A", checked: false },
      { value: "b", label: "B", checked: false }
    ]);

    expect(list.setSelectedItem("a")).toBe(true);
    expect(list.getSelectedValue()).toBe("a");
    expect(list.setSelectedItem("missing")).toBe(false);
  });

  it("clears the list", () => {
    const list = new List("files", ["A"]);
    list.clear();
    expect(list.root.children).toHaveLength(0);
  });
});
