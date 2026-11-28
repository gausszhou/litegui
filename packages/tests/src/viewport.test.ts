import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Viewport, type ViewportObject } from "@gausszhou/litegui-components";

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

function create(options: Partial<ConstructorParameters<typeof Viewport>[0]> = {}) {
  const viewport = new Viewport({ objects: scene(), selected: "Cube", ...options });
  viewport.root.getBoundingClientRect = () =>
    ({ width: 400, height: 300, top: 0, left: 0, right: 400, bottom: 300, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
  viewport.resize();
  document.body.appendChild(viewport.root);
  (viewport as unknown as { draw: () => void }).draw();
  instances.push(viewport);
  return viewport;
}

afterEach(() => {
  while (instances.length) instances.pop()!.dispose();
});

describe("Viewport", () => {
  it("builds the BEM shell and exposes options", () => {
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

  it("picks objects and emits select", () => {
    const viewport = create({ overlays: true });
    const onSelect = vi.fn();
    viewport.on("select", onSelect);

    // Cube 位于视口中心附近；空区域应选中 null。
    (viewport as unknown as { selectAt: (x: number, y: number) => void }).selectAt(200, 150);
    expect(onSelect).toHaveBeenLastCalledWith("Cube");

    (viewport as unknown as { selectAt: (x: number, y: number) => void }).selectAt(5, 5);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("transforms the selected object and can cancel", () => {
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

    const move = (viewport as unknown as { onMouseMove: (event: MouseEvent) => void }).onMouseMove;
    move(new MouseEvent("mousemove", { clientX: 40, clientY: 20 }));
    expect(viewport.getObjects()[0].loc[0]).not.toBe(0);
    expect(change).toHaveBeenCalled();

    viewport.confirmTransform();
    expect(transform).toHaveBeenLastCalledWith({ kind: "translate", phase: "confirm" });

    // 取消：位置回到开始拖拽前。
    const before = [...viewport.getObjects()[0].loc] as [number, number, number];
    viewport.beginTransform("translate");
    move(new MouseEvent("mousemove", { clientX: 80, clientY: 30 }));
    viewport.cancelTransform();
    expect(transform).toHaveBeenLastCalledWith({ kind: "translate", phase: "cancel" });
    expect(viewport.getObjects()[0].loc).toEqual(before);

    viewport.setSelected(null);
    expect(viewport.beginTransform("rotate")).toBe(false);
    expect(status).toHaveBeenLastCalledWith("No active object to transform");
  });

  it("draws every shading and edit mode without throwing", () => {
    const viewport = create({ overlays: true, shading: "wireframe", editMode: true });
    const draw = () => (viewport as unknown as { draw: () => void }).draw();

    draw();
    viewport.setShading("solid");
    viewport.setEditElementMode("vertex");
    draw();
    viewport.setEditElementMode("edge");
    draw();
    viewport.setEditElementMode("face");
    draw();

    viewport.setBrush("paint-draw");
    Object.assign(viewport as unknown as Record<string, unknown>, { hasPointer: true, pointerX: 100, pointerY: 80 });
    draw();

    viewport.setEditMode(false);
    viewport.setSelected("Camera");
    draw();
    viewport.setSelected("Light");
    draw();
    viewport.setSelected("Hidden");
    draw();
  });

  it("disposes listeners and the render loop idempotently", () => {
    const viewport = create();
    viewport.dispose();
    expect(document.body.contains(viewport.root)).toBe(false);
    expect(() => viewport.dispose()).not.toThrow();
  });
});
