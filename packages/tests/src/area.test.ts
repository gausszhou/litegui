import { afterEach, describe, expect, it, vi } from "vitest";
import { Area } from "@gausszhou/litegui-components";
import { LiteGUI } from "@gausszhou/litegui-components";

describe("Area", () => {
  it("creates the expected root and content", () => {
    const area = new Area({ id: "main", width: 400, height: 300 });

    expect(area.root.id).toBe("main");
    expect(area.root.className).toBe("lg-area");
    expect(area.content.className).toBe("lg-area__content");
    expect(area.root.style.width).toBe("400px");
    expect(area.root.style.height).toBe("300px");
  });

  it("adds HTML and components to its content", () => {
    const area = new Area();

    area.add("<b>hello</b>");
    expect(area.content.innerHTML).toContain("hello");

    const child = document.createElement("div");
    area.add(child);
    expect(area.content.contains(child)).toBe(true);
  });

  it("splits horizontally and creates a splitbar", () => {
    const area = new Area();
    area.split("horizontal", [200, null], true);

    expect(area.sections).toHaveLength(2);
    expect(area.sections[0].root.style.width).toBe("200px");
    expect(area.sections[1].root.style.width).toContain("calc");
    expect(area.splitbar?.className).toContain("lg-area__splitbar");
    expect(area.content.parentElement).toBe(area.sections[0].root);
    expect(area.getSection(0)).toBe(area.sections[0]);
  });

  it("hides and shows a section", () => {
    const area = new Area();
    area.split("horizontal", [200, null], true);

    area.hideSection(1);
    expect(area.sections[1].root.style.display).toBe("none");
    expect(area.sections[0].root.style.width).toBe("100%");

    area.showSection(1);
    expect(area.sections[1].root.style.display).toBe("inline-block");
  });

  it("refuses to split twice", () => {
    const area = new Area();
    area.split("vertical", [null, 100], false);

    expect(() => area.split("horizontal", [100, null], false)).toThrow();
  });
});


afterEach(() => {
  LiteGUI.__events.removeAllListeners();
});

describe("Area autoresize", () => {
  it("responds to the global LiteGUI resized event", () => {
    const area = new Area({ autoresize: true });
    const onResize = vi.spyOn(area, "onResize");

    LiteGUI.trigger(LiteGUI, "resized");

    expect(onResize).toHaveBeenCalledTimes(1);
  });
});

describe("Area merge and helpers", () => {
  it("merges back to a single content area", () => {
    const area = new Area();
    area.split("horizontal", [200, null], true);
    const content = area.content;
    content.innerHTML = "<b>kept</b>";

    area.merge(0);

    expect(area.sections).toHaveLength(0);
    expect(area.content).toBe(content);
    expect(area.root.contains(content)).toBe(true);
    expect(area.root.textContent).toContain("kept");
    expect(area.splitbar).toBeUndefined();
  });

  it("sets section sizes and queries content", () => {
    const area = new Area();
    area.split("vertical", [null, 100], true);
    area.setAreaSize(0, "50%");

    expect(area.sections[0].root.style.width).toContain("calc");
    expect(area.query(".lg-area__content")).toBe(area.content);
  });

  it("hides and shows the whole area", () => {
    const area = new Area();
    area.hide();
    expect(area.root.style.display).toBe("none");
    area.show();
    expect(area.root.style.display).toBe("block");
  });
});
