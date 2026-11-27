import { describe, expect, it, vi } from "vitest";
import { defineElements, LiteGuiButtonElement, LiteGuiCheckboxElement } from "@gausszhou/litegui-elements";

defineElements();

function mount<T extends HTMLElement>(tag: string, attrs: Record<string, string> = {}): T {
  const element = document.createElement(tag) as T;
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  document.body.appendChild(element);
  return element;
}

describe("LiteGUI custom elements", () => {
  it("registers the tags and falls back to a <style> when adoptedStyleSheets is unavailable", () => {
    expect(customElements.get("lg-button")).toBeDefined();
    expect(customElements.get("lg-checkbox")).toBeDefined();
    expect(customElements.get("lg-panel")).toBeDefined();
    expect(customElements.get("lg-dialog")).toBeDefined();

    const button = mount("lg-button", { label: "Save" });
    const style = button.shadowRoot?.querySelector("style");
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain(":host { display: inline-block; }");
  });

  it("lg-button renders, reflects label and emits litegui-click", () => {
    const button = mount<LiteGuiButtonElement>("lg-button", { label: "Save" });
    const inner = button.shadowRoot?.querySelector<HTMLButtonElement>("button.litebutton");
    expect(inner?.textContent).toBe("Save");

    const onClick = vi.fn();
    button.addEventListener("litegui-click", onClick);
    inner?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect((onClick.mock.calls[0][0] as CustomEvent).detail).toEqual({ label: "Save" });

    button.label = "Run";
    expect(button.getAttribute("label")).toBe("Run");
    expect(inner?.textContent).toBe("Run");
  });

  it("lg-button does not emit when disabled", () => {
    const button = mount<LiteGuiButtonElement>("lg-button", {
      label: "Save",
      disabled: ""
    });
    const onClick = vi.fn();
    button.addEventListener("litegui-click", onClick);

    button.shadowRoot?.querySelector<HTMLButtonElement>("button.litebutton")?.click();

    expect(button.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lg-checkbox reflects checked and emits litegui-change", () => {
    const checkbox = mount<LiteGuiCheckboxElement>("lg-checkbox", { checked: "" });
    expect(checkbox.checked).toBe(true);

    const onChange = vi.fn();
    checkbox.addEventListener("litegui-change", onChange);

    checkbox.shadowRoot?.querySelector<HTMLElement>(".litecheckbox")?.click();

    expect(checkbox.checked).toBe(false);
    expect(checkbox.hasAttribute("checked")).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ checked: false });
  });

  it("lg-panel projects slot content and emits close", () => {
    const panel = document.createElement("lg-panel");
    panel.setAttribute("heading", "属性");
    panel.setAttribute("height", "160");
    panel.setAttribute("closable", "");
    panel.appendChild(document.createElement("span")).textContent = "内容";

    document.body.appendChild(panel);

    expect(panel.shadowRoot?.querySelector(".panel-title")?.textContent).toBe("属性");
    expect(panel.shadowRoot?.querySelector("slot")).not.toBeNull();
    expect(panel.querySelector("span")?.textContent).toBe("内容");

    const onClose = vi.fn();
    panel.addEventListener("litegui-close", onClose);
    panel.shadowRoot?.querySelector<HTMLElement>(".panel-close")?.click();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(panel.hidden).toBe(true);
  });

  it("lg-dialog follows the open attribute and reopens after close", () => {
    const dialog = mount("lg-dialog", { heading: "设置", open: "", closable: "" });

    const findDialog = () => dialog.shadowRoot?.querySelector<HTMLElement>(".litedialog");
    expect(findDialog()).not.toBeNull();
    expect(findDialog()?.style.display).not.toBe("none");

    const onClose = vi.fn();
    dialog.addEventListener("litegui-close", onClose);

    findDialog()?.querySelector<HTMLElement>(".close-button")?.click();

    expect(dialog.hasAttribute("open")).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);

    dialog.setAttribute("open", "");
    const reopened = findDialog();
    expect(reopened).not.toBeNull();
    expect(reopened?.style.display).not.toBe("none");
  });

  it("lg-menu builds nested items from light DOM", () => {
    const menu = document.createElement("lg-menu");
    menu.innerHTML = `
      <lg-menu-item label="文件">
        <lg-menu-item label="新建"></lg-menu-item>
        <lg-menu-item label="打开"></lg-menu-item>
      </lg-menu-item>
    `;
    document.body.appendChild(menu);

    const top = menu.shadowRoot?.querySelector<HTMLElement>(".lite-menu-item");
    expect(top?.textContent).toContain("文件");

    top?.click();
    const leaves = [...(menu.shadowRoot?.querySelectorAll<HTMLElement>(".lite-menu-panel-item") ?? [])];
    const leaf = leaves.find(element => element.textContent?.includes("新建"));
    expect(leaf).toBeDefined();

    const onSelect = vi.fn();
    menu.addEventListener("litegui-select", onSelect);
    leaf?.click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toEqual({
      label: "新建",
      path: "文件/新建"
    });
  });

  it("does not duplicate content when the element is moved", () => {
    const button = mount("lg-button", { label: "Move" });
    const other = document.createElement("div");
    document.body.appendChild(other);

    other.appendChild(button);

    expect(button.shadowRoot?.querySelectorAll("button.litebutton")).toHaveLength(1);
  });
});
