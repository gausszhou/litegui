import { afterEach, describe, expect, it, vi } from "vitest";
import { LiteGUI } from "@gausszhou/litegui";

function createContainer() {
  const container = document.createElement("div");
  container.id = "app";
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.body.className = "";
  LiteGUI.__events.removeAllListeners();
  LiteGUI.menubar = null;
  LiteGUI.container = null;
  LiteGUI.root = document.body;
  LiteGUI.content = document.body;
  LiteGUI.modalbg_div = null;
});

describe("LiteGUI", () => {
  it("initializes a container and creates a menubar", () => {
    const container = createContainer();
    LiteGUI.init({ container: "#app" });

    expect(LiteGUI.container).toBe(container);
    expect(LiteGUI.root).toBe(container);
    expect(LiteGUI.content).toBe(container);
    expect(container.querySelector(".litemodalbg")).not.toBeNull();

    const menubar = LiteGUI.createMenu();
    expect(LiteGUI.menubar).toBe(menubar);
    expect(menubar.root.parentElement).toBe(container);
  });

  it("binds and triggers DOM events", () => {
    const element = document.createElement("div");
    const callback = vi.fn();

    LiteGUI.bind(element, "ping", callback);
    LiteGUI.trigger(element, "ping", { value: 1 });

    expect(callback).toHaveBeenCalledTimes(1);
    const event = callback.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ value: 1 });
  });

  it("binds and triggers events on plain objects", () => {
    const target: Record<string, unknown> = {};
    const callback = vi.fn();

    LiteGUI.bind(target, "ping", callback);
    LiteGUI.trigger(target, "ping", { value: 2 });

    expect(callback).toHaveBeenCalledTimes(1);
    const event = callback.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ value: 2 });
    expect(Object.keys(target)).not.toContain("__events");
  });

  it("binds and triggers events on LiteGUI itself", () => {
    const callback = vi.fn();

    LiteGUI.bind(LiteGUI, "resized", callback);
    LiteGUI.trigger(LiteGUI, "resized");
    expect(callback).toHaveBeenCalledTimes(1);

    LiteGUI.unbind(LiteGUI, "resized", callback);
    LiteGUI.trigger(LiteGUI, "resized");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("shows and closes a modal message", () => {
    createContainer();
    LiteGUI.init({ container: "#app" });

    const dialog = LiteGUI.showMessage("hello");
    expect(dialog.content.textContent).toContain("hello");
    expect(LiteGUI.modalbg_div?.style.display).toBe("block");
    expect(LiteGUI.modalbg_div?.contains(dialog.root)).toBe(true);

    dialog.close();
    expect(LiteGUI.modalbg_div?.style.display).toBe("none");
  });

  it("shows a popup in the main content", () => {
    const container = createContainer();
    LiteGUI.init({ container: "#app" });

    const dialog = LiteGUI.popup("hello popup");
    expect(container.contains(dialog.root)).toBe(true);
    expect(dialog.root.style.display).toBe("");

    dialog.close();
    expect(container.contains(dialog.root)).toBe(false);
  });
});
