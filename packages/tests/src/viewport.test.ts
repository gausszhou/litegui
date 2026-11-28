import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Viewport, type ViewportObject, type ViewportOptions } from "@gausszhou/litegui-components";

beforeAll(() => {
  // jsdom 不实现 canvas；Viewport 只需要一个可调用的 2D context。
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    measureText: () => ({ width: 10 })
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

const canvasRect = {
  width: 400,
  height: 300,
  top: 0,
  left: 0,
  right: 400,
  bottom: 300,
  x: 0,
  y: 0,
  toJSON: () => ({})
} as DOMRect;

function scene(): ViewportObject[] {
  return [
    {
      id: "Cube",
      name: "Cube",
      type: "mesh",
      loc: [0, 0, 1],
      rot: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      selectable: true
    },
    {
      id: "Camera",
      name: "Camera",
      type: "camera",
      loc: [-5, -4, 4],
      rot: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      selectable: true
    },
    {
      id: "Light",
      name: "Light",
      type: "light",
      loc: [4, -2, 5],
      rot: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      selectable: true
    },
    {
      id: "Hidden",
      name: "Hidden",
      type: "mesh",
      loc: [2, 2, 2],
      rot: [0, 0, 0],
      scale: [1, 1, 1],
      visible: false,
      selectable: false
    }
  ];
}

const instances: Viewport[] = [];

function create(options: Partial<ViewportOptions> = {}): Viewport {
  const viewport = new Viewport({ objects: scene(), selected: "Cube", ...options });
  viewport.root.getBoundingClientRect = () => canvasRect;
  viewport.canvas.getBoundingClientRect = () => canvasRect;
  document.body.appendChild(viewport.root);
  viewport.resize();
  instances.push(viewport);
  return viewport;
}

function mouseDownAt(target: HTMLElement, x: number, y: number): void {
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: x,
    clientY: y
  });
  Object.defineProperty(event, "offsetX", { value: x });
  Object.defineProperty(event, "offsetY", { value: y });
  target.dispatchEvent(event);
}

function mouseMoveTo(x: number, y: number): void {
  window.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: x, clientY: y }));
}

async function nextFrame(): Promise<void> {
  await new Promise<void>(resolve => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

afterEach(() => {
  while (instances.length) instances.pop()!.dispose();
});

describe("Viewport", () => {
  it("builds the BEM shell and exposes options", async () => {
    const viewport = create({
      id: "vp",
      className: "extra",
      overlays: true,
      sidebarOpen: true,
      shading: "wireframe",
      editMode: true
    });

    expect(viewport.root.classList.contains("lg-viewport")).toBe(true);
    expect(viewport.root.classList.contains("extra")).toBe(true);
    expect(viewport.root.id).toBe("vp");
    expect(viewport.root.querySelector(".lg-viewport__canvas")).toBe(viewport.canvas);
    await nextFrame();
    await nextFrame();
    expect(viewport.root.querySelector(".lg-viewport__info")?.innerHTML).toContain("Cube");
    expect(viewport.getSelected()).toBe("Cube");
    expect(viewport.getOverlays()).toBe(true);
    expect(viewport.getSidebarOpen()).toBe(true);
    expect(viewport.getShading()).toBe("wireframe");
    expect(viewport.getEditMode()).toBe(true);
    expect(viewport.getEditElementMode()).toBe("vertex");
    expect(viewport.getBrush()).toBeNull();
  });

  it("updates objects, selection and view state", () => {
    const viewport = create();
    const next = [scene()[0]];
    viewport.setObjects(next);
    expect(viewport.getObjects()).toBe(next);

    viewport.setSelected("Camera");
    expect(viewport.getSelected()).toBe("Camera");
    viewport.setSelected(null);
    expect(viewport.getSelected()).toBeNull();

    viewport.setOverlays(true);
    viewport.setSidebarOpen(true);
    viewport.setShading("material");
    viewport.setEditMode(true);
    viewport.setEditElementMode("edge");
    viewport.setBrush("sculpt-draw");
    expect(viewport.getOverlays()).toBe(true);
    expect(viewport.getSidebarOpen()).toBe(true);
    expect(viewport.getShading()).toBe("material");
    expect(viewport.getEditMode()).toBe(true);
    expect(viewport.getEditElementMode()).toBe("edge");
    expect(viewport.getBrush()).toBe("sculpt-draw");

    viewport.setView(0, 0, 10);
    viewport.zoom(200);
    viewport.frameAll();
    viewport.focusSelection();
    viewport.invalidate();
  });

  it("picks objects through canvas pointer input and emits select", () => {
    const viewport = create({ overlays: true });
    const onSelect = vi.fn();
    viewport.on("select", onSelect);

    // Cube 位于视口中心；空白区域应选中 null。
    mouseDownAt(viewport.canvas, 200, 150);
    expect(onSelect).toHaveBeenLastCalledWith("Cube");

    mouseDownAt(viewport.canvas, 5, 5);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("emits context-menu with canvas pointer coordinates", () => {
    const viewport = create();
    const onContextMenu = vi.fn();
    viewport.on("context-menu", onContextMenu);

    viewport.canvas.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 42, clientY: 24 })
    );
    expect(onContextMenu).toHaveBeenLastCalledWith({ x: 42, y: 24 });
  });

  it("transforms the selected object via window pointer events and can cancel", () => {
    const viewport = create({ overlays: true });
    const status = vi.fn();
    const change = vi.fn();
    const transform = vi.fn();
    viewport.on("status", status);
    viewport.on("change", change);
    viewport.on("transform", transform);

    expect(viewport.beginTransform("translate")).toBe(true);
    expect(status).toHaveBeenCalled();
    expect(transform).toHaveBeenLastCalledWith({ kind: "translate", phase: "start" });

    mouseMoveTo(40, 20);
    expect(viewport.getObjects()[0].loc[0]).not.toBe(0);
    expect(change).toHaveBeenCalled();

    viewport.confirmTransform();
    expect(transform).toHaveBeenLastCalledWith({ kind: "translate", phase: "confirm" });

    // 取消：位置回到开始拖拽前。
    const before = [...viewport.getObjects()[0].loc] as [number, number, number];
    viewport.beginTransform("translate");
    mouseMoveTo(80, 30);
    viewport.cancelTransform();
    expect(transform).toHaveBeenLastCalledWith({ kind: "translate", phase: "cancel" });
    expect(viewport.getObjects()[0].loc).toEqual(before);

    viewport.setSelected(null);
    expect(viewport.beginTransform("rotate")).toBe(false);
    expect(status).toHaveBeenLastCalledWith("No active object to transform");
  });

  it("renders every shading and edit mode through the public render loop", async () => {
    const viewport = create({ overlays: true, shading: "wireframe", editMode: true });
    await nextFrame();
    await nextFrame();

    viewport.setShading("solid");
    viewport.setEditElementMode("vertex");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setEditElementMode("edge");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setEditElementMode("face");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setBrush("paint-draw");
    mouseMoveTo(100, 80);
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setEditMode(false);
    viewport.setSelected("Camera");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setSelected("Light");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.setSelected("Hidden");
    viewport.invalidate();
    await nextFrame();
    await nextFrame();

    viewport.canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true }));
    expect(viewport.getSelected()).toBe("Hidden");
  });

  it("disposes listeners and the render loop idempotently", () => {
    const viewport = create();
    viewport.dispose();
    expect(document.body.contains(viewport.root)).toBe(false);
    expect(() => viewport.dispose()).not.toThrow();
  });
});
