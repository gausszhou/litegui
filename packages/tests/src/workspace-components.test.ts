import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  HeaderBar,
  ImageEditor,
  NodeEditor,
  StatusBar,
  TextEditor,
  Timeline,
  Toolbar
} from "@gausszhou/litegui-components";

beforeAll(() => {
  // jsdom does not implement canvas; these widgets only need a truthy 2D context.
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    closePath: vi.fn(),
    measureText: () => ({ width: 10 })
  })) as any;
});

describe("HeaderBar", () => {
  it("renders variants, slots, title and content", () => {
    const bar = new HeaderBar({ variant: "area", id: "hb", height: 30, left: "Left", center: "<b>Mid</b>", right: "Right" });
    expect(bar.root.className).toContain("lg-header-bar--area");
    expect(bar.root.id).toBe("hb");
    expect(bar.root.style.height).toBe("30px");
    expect(bar.left.textContent).toContain("Left");
    expect(bar.center.innerHTML).toContain("<b>Mid</b>");
    bar.setTitle("Title", "<svg></svg>", "tip");
    expect(bar.root.querySelector(".lg-header-bar__title")?.textContent).toContain("Title");
    expect(bar.root.querySelector(".lg-header-bar__title svg")).not.toBeNull();
    bar.addLeft(document.createElement("i"));
    expect(bar.left.querySelector("i")).not.toBeNull();
    bar.clear();
    expect(bar.left.children.length).toBe(0);
    bar.show();
    expect(bar.root.style.display).not.toBe("none");
    bar.hide();
    expect(bar.root.style.display).toBe("none");
  });
});

describe("StatusBar", () => {
  it("sets text and right items", () => {
    const bar = new StatusBar({ left: "Ready", right: ["a", "b"], accent: "v1" });
    expect(bar.getLeft()).toBe("Ready");
    expect(bar.root.querySelectorAll(".lg-status-bar__right > *").length).toBe(3);
    bar.setLeft("Done");
    expect(bar.getLeft()).toBe("Done");
    bar.setRight(["x"]);
    expect(bar.root.querySelector(".lg-status-bar__right")!.children.length).toBe(1);
    bar.setRightText("y");
    bar.addAccent("v2");
    expect(bar.root.textContent).toContain("y");
  });
});

describe("Toolbar", () => {
  it("renders tools, switches active and emits change", () => {
    const bar = new Toolbar({
      orientation: "horizontal",
      title: "Tools",
      tools: [
        { id: "move", icon: "<svg></svg>", label: "Move", shortcut: "G" },
        { id: "rotate", label: "Rotate" }
      ],
      active: "move"
    });
    expect(bar.root.className).toContain("lg-toolbar--horizontal");
    expect(bar.getTools().length).toBe(2);
    expect(bar.getActive()).toBe("move");
    const listener = vi.fn();
    bar.on("change", listener);
    bar.root.querySelectorAll<HTMLButtonElement>(".lg-toolbar__tool")[1].click();
    expect(bar.getActive()).toBe("rotate");
    expect(listener).toHaveBeenCalledWith("rotate");
    bar.setActive("missing");
    expect(bar.getActive()).toBe("rotate");
    bar.setTitle("More");
    expect(bar.root.querySelector(".lg-toolbar__title")?.textContent).toBe("More");
  });
});

describe("Timeline", () => {
  it("handles frame range, keyframes and playback", () => {
    vi.useFakeTimers();
    const frame = vi.fn();
    const play = vi.fn();
    const range = vi.fn();
    const timeline = new Timeline({
      start: 1,
      end: 100,
      frame: 1,
      keyframes: [1, 25],
      onFrameChange: frame,
      onPlayChange: play,
      onRangeChange: range
    });
    timeline.setFrame(30);
    expect(timeline.getFrame()).toBe(30);
    expect(frame).toHaveBeenCalledWith(30);
    timeline.setRange(10, 80);
    expect(timeline.getRange()).toEqual({ start: 10, end: 80 });
    expect(range).toHaveBeenCalledWith(10, 80);
    expect(timeline.getKeyframes()).toContain(25);
    timeline.insertKeyframe(40);
    expect(timeline.getKeyframes()).toContain(40);
    timeline.removeKeyframe(40);
    expect(timeline.getKeyframes()).not.toContain(40);
    timeline.play();
    expect(timeline.isPlaying()).toBe(true);
    expect(play).toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    timeline.pause();
    expect(timeline.isPlaying()).toBe(false);
    timeline.addMenuButton("Playback", () => undefined);
    expect(timeline.root.querySelectorAll(".lg-timeline__menu").length).toBeGreaterThan(0);
    timeline.destroy();
    vi.useRealTimers();
  });
});

describe("NodeEditor", () => {
  it("renders nodes/links, selects and removes nodes", () => {
    const editor = new NodeEditor({
      nodes: [
        { id: "a", title: "A", x: 10, y: 20, color: "#5b7d5b", outputs: [{ id: "out", name: "Out" }] },
        { id: "b", title: "B", x: 200, y: 30, inputs: [{ id: "in", name: "In" }], outputs: [{ id: "out", name: "Out" }] }
      ],
      links: [{ from: "a", fromPort: "out", to: "b", toPort: "in" }]
    });
    expect(editor.getNodes().length).toBe(2);
    expect(editor.getLinks().length).toBe(1);
    expect(editor.root.querySelectorAll(".lg-node-editor__node").length).toBe(2);
    const select = vi.fn();
    editor.on("select", select);
    const first = editor.root.querySelector<HTMLElement>(".lg-node-editor__node")!;
    first.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 10, clientY: 20 }));
    expect(editor.getSelected()).toBe("a");
    expect(select).toHaveBeenCalled();
    editor.addNode({ id: "c", title: "C", x: 40, y: 40, inputs: [{ id: "in", name: "In" }], outputs: [{ id: "out", name: "Out" }] });
    editor.addLink({ from: "b", fromPort: "out", to: "c", toPort: "in" });
    expect(editor.getNodes().length).toBe(3);
    expect(editor.getLinks().length).toBe(2);
    editor.removeNode("c");
    expect(editor.getNodes().length).toBe(2);
    editor.removeLink({ from: "a", fromPort: "out", to: "b", toPort: "in" });
    expect(editor.getLinks().length).toBe(0);
    editor.setGraph([], []);
    expect(editor.getNodes().length).toBe(0);
    editor.refresh();
  });
});

describe("TextEditor", () => {
  it("edits values, switches tabs and reports cursor", () => {
    const change = vi.fn();
    const tab = vi.fn();
    const cursor = vi.fn();
    const editor = new TextEditor({
      title: "Script",
      value: "print(1)",
      tabs: [
        { id: "text", label: "Text", value: "print(1)" },
        { id: "console", label: "Console", value: "" }
      ],
    });
    editor.on("change", change);
    editor.on("cursor", cursor);
    editor.on("tab", tab);
    expect(editor.getValue()).toBe("print(1)");
    editor.setValue("print(2)");
    expect(editor.getValue()).toBe("print(2)");
    editor.setTab("console");
    expect(editor.getActiveTab()).toBe("console");
    expect(tab).toHaveBeenCalledWith("console");
    editor.setTabValue("console", "log");
    expect(editor.getTabValue("console")).toBe("log");
    editor.appendTabLine("console", "next");
    expect(editor.getTabValue("console")).toContain("next");
    const textarea = editor.root.querySelector<HTMLTextAreaElement>(".lg-text-editor__textarea")!;
    textarea.value = "x";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    expect(change).toHaveBeenCalled();
    textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
    expect(cursor).toHaveBeenCalled();
    editor.setReadOnly(true);
    expect(textarea.readOnly).toBe(true);
    editor.focus();
  });
});

describe("ImageEditor", () => {
  it("sets source, zoom and title", () => {
    const editor = new ImageEditor({ title: "Render", subtitle: "42%", checkerboard: true, zoom: 1 });
    expect(editor.getZoom()).toBe(1);
    expect(editor.root.className).toContain("lg-image-editor--checkerboard");
    editor.setZoom(2);
    expect(editor.getZoom()).toBe(2);
    editor.setZoom(100);
    expect(editor.getZoom()).toBeLessThanOrEqual(8);
    editor.setSource("data:image/png;base64,AA==");
    expect(editor.getSource()).toContain("data:image/png");
    editor.setTitle("Result", "100%");
    expect(editor.titleElement.textContent).toContain("Result");
    editor.fit();
    editor.resetView();
    expect(editor.getZoom()).toBe(1);
  });
});
