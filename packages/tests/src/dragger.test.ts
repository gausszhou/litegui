import { describe, expect, it } from "vitest";
import { Dragger } from "@gausszhou/litegui-components";

function key(code: number, name: string) {
  const event = new KeyboardEvent("keydown", { key: name, bubbles: true });
  Object.defineProperty(event, "keyCode", { value: code });
  return event;
}

describe("Dragger keyboard and wheel", () => {
  it("increments with ArrowUp/ArrowDown", () => {
    const dragger = new Dragger(1, { step: 1, precision: 2 });
    dragger.input.dispatchEvent(key(38, "ArrowUp"));
    expect(dragger.getValue()).toBe(2);
    dragger.input.dispatchEvent(key(40, "ArrowDown"));
    expect(dragger.getValue()).toBe(1);
  });

  it("responds to wheel and setRange", () => {
    const dragger = new Dragger(1, { step: 1, precision: 2 });
    dragger.setRange(0, 5);
    dragger.input.dispatchEvent(new WheelEvent("wheel", { deltaY: -30, bubbles: true }));
    expect(dragger.getValue()).toBe(2);
  });

  it("formats units", () => {
    const dragger = new Dragger(2, { precision: 1, units: "px" });
    dragger.setValue(3);
    expect(dragger.input.value).toBe("3.0px");
  });

  it("commits typed values on change or Enter", () => {
    const dragger = new Dragger(1, { precision: 2, min: 0, max: 10 });
    const changes: number[] = [];
    dragger.input.addEventListener("change", () => changes.push(dragger.getValue()));

    dragger.input.value = "7.25";
    dragger.input.dispatchEvent(new Event("change"));
    expect(dragger.getValue()).toBe(7.25);
    expect(dragger.input.value).toBe("7.25");

    // 超出范围时夹到 min/max
    dragger.input.value = "42";
    dragger.input.dispatchEvent(new Event("change"));
    expect(dragger.getValue()).toBe(10);
    expect(dragger.input.value).toBe("10.00");

    // Enter 不产生原生 change 事件，也要提交
    dragger.input.value = "-3";
    dragger.input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(dragger.getValue()).toBe(0);
    expect(changes).toEqual([7.25, 10, 0]);
  });
});
