import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  document.body.innerHTML = '<div id="app"></div>';
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    strokeText: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    setTransform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    lineWidth: 1,
    strokeStyle: "",
    fillStyle: "",
    font: ""
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe("editor page", () => {
  it("loads the comprehensive example", async () => {
    // @ts-expect-error editor is a plain JavaScript entry, not part of the library types
    await import("../editor/index.js");
    window.onload?.call(window, new Event("load"));

    expect(document.querySelector(".litearea")).not.toBeNull();
    expect(document.querySelector(".lite-menu")).not.toBeNull();
    expect(document.querySelectorAll(".litedialog").length).toBeGreaterThan(0);
  });
});
