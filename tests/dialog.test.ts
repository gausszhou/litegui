import { afterEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "../src/packages/Dialog";

afterEach(() => {
  Dialog.INSTANCE_LIST.length = 0;
  Dialog.minimized.length = 0;
});

describe("Dialog", () => {
  it("renders the expected structure and shows in the DOM", () => {
    const dialog = new Dialog({
      title: "Hello",
      content: "<p>Body</p>",
      close: true
    });

    expect(dialog.root.className).toContain("litedialog");
    expect(dialog.header.className).toBe("panel-header");
    expect(dialog.content.className).toBe("content");
    expect(dialog.footer.className).toBe("panel-footer");
    expect(dialog.root.querySelector(".close-button")).not.toBeNull();
    expect(dialog.content.innerHTML).toContain("Body");

    dialog.show();

    expect(document.body.contains(dialog.root)).toBe(true);
    expect(dialog.root.style.display).toBe("");
    expect(Dialog.INSTANCE_LIST).toContain(dialog);
  });

  it("closes, removes the element and emits the closed event", () => {
    const onClose = vi.fn();
    const closed = vi.fn();
    const dialog = new Dialog({ title: "Close me", onClose });
    dialog.on("closed", closed);

    dialog.show();
    dialog.close();

    expect(document.body.contains(dialog.root)).toBe(false);
    expect(closed).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(Dialog.INSTANCE_LIST).not.toContain(dialog);
  });

  it("closes from the header close button", () => {
    const dialog = new Dialog({ title: "Close button", close: true });
    dialog.show();

    dialog.root.querySelector<HTMLButtonElement>(".close-button")?.click();

    expect(document.body.contains(dialog.root)).toBe(false);
  });

  it("runs a footer button callback and closes when requested", () => {
    const clicked = vi.fn();
    const dialog = new Dialog({ title: "Footer" });
    const button = dialog.addButtonToFooter("OK", {
      name: "OK",
      close: true,
      callback: clicked
    });

    dialog.show();
    button.content.click();

    expect(clicked).toHaveBeenCalledTimes(1);
    expect(document.body.contains(dialog.root)).toBe(false);
  });

  it("supports minimize and maximize without losing the instance", () => {
    const dialog = new Dialog({ title: "Minimize", minimize: true });
    dialog.show();

    dialog.minimize();
    expect(dialog.minimized).toBe(true);
    expect(Dialog.minimized).toContain(dialog);

    dialog.maximize();
    expect(dialog.minimized).toBe(false);
    expect(Dialog.minimized).not.toContain(dialog);
  });
});
