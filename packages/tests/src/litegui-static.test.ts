import { afterEach, describe, expect, it, vi } from "vitest";
import { LiteGUI } from "@gausszhou/litegui";

function container() {
  const element = document.createElement("div");
  element.id = "app";
  document.body.appendChild(element);
  return element;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.body.className = "";
  LiteGUI.modalbg_div = null;
  LiteGUI.container = null;
  LiteGUI.root = document.body;
  LiteGUI.content = document.body;
  LiteGUI.__events.removeAllListeners();
});

describe("LiteGUI helpers", () => {
  it("removes classes and creates buttons", () => {
    const element = document.createElement("div");
    const child = document.createElement("span");
    child.className = "a b";
    element.appendChild(child);
    LiteGUI.removeClass(element, "a");
    expect(child.classList.contains("a")).toBe(false);

    const click = vi.fn();
    const button = LiteGUI.createButton("#go .primary", "Go", click, { color: "red" });
    button.click();

    expect(button.id).toBe("go");
    expect(button.classList.contains("primary")).toBe(true);
    expect(button.style.color).toBe("red");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("clones plain objects and sanitizes names", () => {
    const source = { a: 1, b: "x", fn: () => undefined, nested: { c: true } };
    const clone = LiteGUI.cloneObject(source, {});

    expect(clone.a).toBe(1);
    expect(clone.b).toBe("x");
    expect(clone.fn).toBeUndefined();
    expect(clone.nested).toEqual({ c: true });
    expect(LiteGUI.safeName("a b.c")).toBe("abc");
  });

  it("creates and decodes HTML helpers", () => {
    expect(LiteGUI.htmlEncode("&amp;")).toBe("&");
    expect(LiteGUI.htmlDecode("&")).toBe("&amp;");
  });

  it("reads URL variables", () => {
    window.history.replaceState({}, "", "/?foo=bar&empty=");
    expect(LiteGUI.getUrlVar("foo")).toBe("bar");
    expect(LiteGUI.getUrlVars().foo).toBe("bar");
  });
});

describe("LiteGUI static dialogs", () => {
  it("confirms with a boolean", () => {
    container();
    LiteGUI.init({ container: "#app" });
    const callback = vi.fn();

    const dialog = LiteGUI.confirm("Continue?", callback);
    const buttons = dialog.content.querySelectorAll<HTMLButtonElement>("button");
    buttons[0].click();

    expect(callback).toHaveBeenCalledWith(true);
  });

  it("prompts with an input value", () => {
    container();
    LiteGUI.init({ container: "#app" });
    const callback = vi.fn();

    const dialog = LiteGUI.prompt("Name?", callback);
    const input = dialog.content.querySelector<HTMLInputElement>("input")!;
    input.value = "Alice";
    dialog.content.querySelector<HTMLButtonElement>("button")?.click();

    expect(callback).toHaveBeenCalledWith("Alice");
  });

  it("offers choices", () => {
    container();
    LiteGUI.init({ container: "#app" });
    const callback = vi.fn();

    const dialog = LiteGUI.choice("Pick", ["A", "B"], callback);
    const buttons = dialog.content.querySelectorAll<HTMLButtonElement>("button");
    buttons[1].click();

    expect(callback).toHaveBeenCalledWith("1");
  });

  it("shows alerts and removes previous alerts", () => {
    container();
    LiteGUI.init({ container: "#app" });

    LiteGUI.alert("First");
    LiteGUI.alert("Second");

    expect(document.querySelectorAll(".litedialog.alert").length).toBe(1);
  });
});
