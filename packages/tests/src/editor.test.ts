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
    await import("../../../apps/editor/src/main.ts");
    window.onload?.call(window, new Event("load"));

    expect(document.querySelector(".lg-area")).not.toBeNull();
    expect(document.querySelector(".lg-menu")).not.toBeNull();
    expect(document.querySelectorAll(".lg-dialog").length).toBeGreaterThan(0);
  });
});
