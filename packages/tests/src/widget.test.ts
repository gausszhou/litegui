import { describe, expect, it, vi } from "vitest";
import { Widget } from "@gausszhou/litegui-core";

describe("Widget", () => {
  it("supports chained style, size, class and id helpers", () => {
    const widget = new Widget();

    widget
      .style("color", "red")
      .style("length", "ignored" as never)
      .width(120)
      .height("50%")
      .class("my-widget")
      .id("widget-1");

    expect(widget.root.style.color).toBe("red");
    expect(widget.root.style.width).toBe("120px");
    expect(widget.root.style.height).toBe("50%");
    expect(widget.root.className).toBe("my-widget");
    expect(widget.root.id).toBe("widget-1");
  });

  it("inherits the instance event emitter", () => {
    const widget = new Widget();
    const handler = vi.fn();

    widget.on("change", handler);
    widget.emit("change", 1);

    expect(handler).toHaveBeenCalledWith(1);
  });
});
