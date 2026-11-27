import { describe, expect, it, vi } from "vitest";
import { Panel } from "@gausszhou/litegui-components";
import { Button } from "@gausszhou/litegui-components";

describe("Panel", () => {
  it("constructs from an options object", () => {
    const panel = new Panel({ id: "side", title: "Side", content: "<b>Hello</b>" });

    expect(panel.root.id).toBe("side");
    expect(panel.root.className).toContain("litepanel");
    expect(panel.header.className).toBe("panel-header");
    expect(panel.content.className).toBe("content");
    expect(panel.footer.className).toBe("panel-footer");
    expect(panel.content.innerHTML).toBe("<b>Hello</b>");
  });

  it("supports the legacy id + options signature", () => {
    const panel = new Panel("legacy", { title: "Legacy" });

    expect(panel.id).toBe("legacy");
    expect(panel.root.id).toBe("legacy");
    expect(panel.titleElement.textContent).toBe("Legacy");
  });

  it("adds components and clears content", () => {
    const panel = new Panel({ title: "Add" });
    panel.add(new Button("One", {}));

    expect(panel.content.querySelector("button")?.textContent).toBe("One");

    panel.clear();
    expect(panel.content.children).toHaveLength(0);
  });

  it("closes from the header button and emits closed", () => {
    const panel = new Panel({ title: "Close", close: true });
    const closed = vi.fn();
    panel.on("closed", closed);

    document.body.appendChild(panel.root);
    panel.root.querySelector<HTMLButtonElement>(".panel-close")?.click();

    expect(closed).toHaveBeenCalledTimes(1);
    expect(document.body.contains(panel.root)).toBe(false);
  });

  it("does not throw without arguments", () => {
    const panel = new Panel();
    expect(panel.root).toBeInstanceOf(HTMLElement);
    expect(panel.options).toEqual({});
  });
});
