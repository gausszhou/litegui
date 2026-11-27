import { beforeAll, describe, expect, it } from "vitest";
import { LineEditor } from "@gausszhou/litegui-components";

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = (() => ({
    setTransform: () => undefined,
    translate: () => undefined,
    scale: () => undefined,
    fillRect: () => undefined,
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    stroke: () => undefined,
    arc: () => undefined,
    fill: () => undefined,
    clearRect: () => undefined,
    strokeRect: () => undefined,
    strokeText: () => undefined,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe("LineEditor", () => {
  it("interpolates values and resamples", () => {
    const editor = new LineEditor([[0, 0], [1, 1]], { xrange: [0, 1], yrange: [0, 1] });

    expect(editor.getValueAt(0)).toBe(0);
    expect(editor.getValueAt(0.5)).toBeCloseTo(0.5);
    expect(editor.getValueAt(1)).toBe(1);
    expect(editor.getValueAt(2)).toBe(editor.defaulty);

    const samples = editor.resample(10);
    expect(samples).toHaveLength(11);
    expect(samples[0]).toBe(0);
  });

  it("adds and sorts values", () => {
    const editor = new LineEditor([[0, 0], [1, 1]], {});
    editor.addValue([0.5, 0.25]);

    expect(editor.value.map(([x]) => x)).toEqual([0, 0.5, 1]);
  });

  it("uses the configured ranges and defaults", () => {
    const editor = new LineEditor([], { xrange: [0, 10], yrange: [0, 100], defaulty: 50 });
    expect(editor.getValueAt(5)).toBe(50);
    expect(editor.getValueAt(20)).toBe(50);
  });
});
