import { afterEach, describe, expect, it, vi } from "vitest";
import EventMitter from "../src/packages/EventMitter";
import { createElement, createListItem, remove, sizeToCSS } from "../src/core/dom";
import { bind, trigger, unbind } from "../src/core/events";
import { coreState, showModalBackground } from "../src/core/state";

afterEach(() => {
  coreState.modalbg = null;
});

describe("core/dom", () => {
  it("converts sizes to CSS", () => {
    expect(sizeToCSS(undefined)).toBe("auto");
    expect(sizeToCSS(12)).toBe("12px");
    expect(sizeToCSS(-12)).toBe("calc( 100% - 12px )");
    expect(sizeToCSS("50%")).toBe("50%");
  });

  it("creates elements with id, classes, styles and events", () => {
    const onClick = vi.fn();
    const element = createElement("button", "#save .primary", "Save", { color: "red" }, { click: onClick });

    expect(element.id).toBe("save");
    expect(element.classList.contains("primary")).toBe(true);
    expect(element.textContent).toBe("Save");
    expect(element.style.color).toBe("red");

    element.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("creates list items from a template", () => {
    const element = createListItem("<span class='title'></span>", { ".title": "Hello" });
    expect(element.querySelector(".title")?.textContent).toBe("Hello");
  });

  it("removes elements by selector and by root reference", () => {
    document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
    remove("#a");
    expect(document.querySelector("#a")).toBeNull();

    const widget = { root: document.querySelector("#b") as HTMLElement };
    remove(widget);
    expect(document.querySelector("#b")).toBeNull();
  });
});

describe("core/events", () => {
  it("binds and triggers on an EventMitter target", () => {
    const emitter = new EventMitter();
    const callback = vi.fn();

    bind(emitter, "change", callback);
    trigger(emitter, "change", 1);

    expect(callback).toHaveBeenCalledTimes(1);
    const event = callback.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toBe(1);

    unbind(emitter, "change", callback);
    trigger(emitter, "change", 2);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("binds and triggers on a plain object", () => {
    const target: Record<string, unknown> = {};
    const callback = vi.fn();

    bind(target, "ping", callback);
    trigger(target, "ping", "payload");

    expect(callback).toHaveBeenCalledTimes(1);
    const event = callback.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toBe("payload");
    expect(Object.keys(target)).not.toContain("__events");
  });
});

describe("core/state", () => {
  it("shows and hides the modal background", () => {
    const modal = document.createElement("div");
    coreState.modalbg = modal;

    showModalBackground(true);
    expect(modal.style.display).toBe("block");

    showModalBackground(false);
    expect(modal.style.display).toBe("none");
  });
});
