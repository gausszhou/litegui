import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/packages/Button";
import { Checkbox } from "../src/packages/Checkbox";
import { Dragger } from "../src/packages/Dragger";

describe("Button", () => {
  it("calls the callback and emits click", () => {
    const callback = vi.fn();
    const clickListener = vi.fn();
    const button = new Button("Save", { callback });
    button.on("click", clickListener);

    button.content.click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(clickListener).toHaveBeenCalledTimes(1);
  });
});

describe("Checkbox", () => {
  it("mounts its inner element and toggles on click", () => {
    const onChange = vi.fn();
    const checkbox = new Checkbox(false, { onChange });

    expect(checkbox.root.querySelector(".checkbox")).not.toBeNull();
    expect(checkbox.root.dataset["value"]).toBe("false");

    checkbox.root.click();

    expect(checkbox.getValue()).toBe(true);
    expect(checkbox.root.dataset["value"]).toBe("true");
    expect(onChange).toHaveBeenCalledWith(true, false);
  });

  it("does not fire when the value is unchanged", () => {
    const onChange = vi.fn();
    const checkbox = new Checkbox(true, { onChange });

    expect(checkbox.setValue(true)).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Dragger", () => {
  it("mounts its input and updates the value", () => {
    const dragger = new Dragger(1.5, { precision: 2, min: 0, max: 10 });

    expect(dragger.root.querySelector(".drag_widget")).not.toBeNull();
    expect(dragger.input.value).toBe("1.50");

    dragger.setValue(2.25);

    expect(dragger.value).toBe(2.25);
    expect(dragger.input.value).toBe("2.25");
  });
});
