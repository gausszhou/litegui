import { describe, expect, it, vi } from "vitest";
import { Slider } from "../src/packages/Slider";

describe("Slider", () => {
  it("clamps values and reports changes", () => {
    const slider = new Slider(0.5, { min: 0, max: 1 });
    const onChange = vi.fn();
    slider.onChange = onChange;

    slider.setValue(0.75);
    expect(slider.getValue()).toBe(0.75);
    expect(onChange).toHaveBeenCalledWith(0.75);

    slider.setValue(2);
    expect(slider.getValue()).toBe(1);

    slider.setValue(-1);
    expect(slider.getValue()).toBe(0);
  });

  it("stops tracking the mouse after mouseup", () => {
    const slider = new Slider(0.5, { min: 0, max: 1 });
    Object.defineProperty(slider.root, "getBoundingClientRect", {
      value: () => ({ width: 100, left: 0, top: 0, right: 100, bottom: 10, height: 10, x: 0, y: 0 })
    });
    document.body.appendChild(slider.root);

    const down = new MouseEvent("mousedown", { bubbles: true, clientX: 50 });
    Object.defineProperty(down, "offsetX", { value: 50 });
    slider.root.dispatchEvent(down);
    expect(slider.getValue()).toBeCloseTo(0.5);

    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 80 }));
    expect(slider.getValue()).toBeCloseTo(0.8);

    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 10 }));
    expect(slider.getValue()).toBeCloseTo(0.8);
  });
});
