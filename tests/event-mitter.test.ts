import { describe, expect, it, vi } from "vitest";
import EventMitter from "../src/packages/EventMitter";

describe("EventMitter", () => {
  it("isolates events between instances", () => {
    const first = new EventMitter();
    const second = new EventMitter();
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    first.on("change", firstHandler);
    second.on("change", secondHandler);

    first.emit("change", 1);

    expect(firstHandler).toHaveBeenCalledWith(1);
    expect(secondHandler).not.toHaveBeenCalled();
  });

  it("removes a listener with off", () => {
    const emitter = new EventMitter();
    const handler = vi.fn();

    emitter.on("change", handler);
    emitter.off("change", handler);
    emitter.emit("change", 1);

    expect(handler).not.toHaveBeenCalled();
  });

  it("fires a once listener only once", () => {
    const emitter = new EventMitter();
    const handler = vi.fn();

    emitter.once("change", handler);
    emitter.emit("change", 1);
    emitter.emit("change", 2);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("clears all listeners", () => {
    const emitter = new EventMitter();
    const handler = vi.fn();

    emitter.on("change", handler);
    emitter.removeAllListeners();
    emitter.emit("change", 1);

    expect(handler).not.toHaveBeenCalled();
  });
});
