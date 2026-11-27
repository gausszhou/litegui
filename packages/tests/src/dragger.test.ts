import { describe, expect, it } from "vitest";
import { Dragger } from "@gausszhou/litegui";

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
});
