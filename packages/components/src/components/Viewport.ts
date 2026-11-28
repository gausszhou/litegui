import { EventMitter } from "@gausszhou/litegui-core";

export type ViewportVec3 = [number, number, number];

export interface ViewportObject {
  id: string;
  name: string;
  type: "mesh" | "camera" | "light";
  loc: ViewportVec3;
  rot: ViewportVec3;
  scale: ViewportVec3;
  visible: boolean;
  selectable: boolean;
  /** Optional per-object color used by future renderers. */
  color?: string;
}

export type ViewportShading = "wireframe" | "solid" | "material" | "rendered";
export type ViewportEditElement = "vertex" | "edge" | "face";
export type ViewportTransform = "translate" | "rotate" | "scale";

export interface ViewportOptions {
  id?: string;
  className?: string;
  objects?: ViewportObject[];
  selected?: string | null;
  /** Draw the transform gizmo and axis widget. Default: `false`. */
  overlays?: boolean;
  /** Reserve room on the right for a sidebar (axis widget offset). Default: `false`. */
  sidebarOpen?: boolean;
  shading?: ViewportShading;
  editMode?: boolean;
  editElement?: ViewportEditElement;
  /** Active brush id; when set, a brush cursor follows the pointer. */
  brush?: string | null;
}

interface Palette {
  bgSolid: string;
  bgWire: string;
  grid: string;
  gridAxis: string;
  axisX: string;
  axisY: string;
  gizmoX: string;
  gizmoY: string;
  gizmoZ: string;
  selection: string;
  selectionSoft: string;
  camera: string;
  light: string;
  brush: string;
  brushFill: string;
  outline: string;
  edit: string;
  editSoft: string;
  editFill: string;
  face1: string;
  face2: string;
  face3: string;
  face4: string;
  face5: string;
  face6: string;
}

const DEFAULT_PALETTE: Palette = {
  bgSolid: "#484848",
  bgWire: "#2c2c2c",
  grid: "#565656",
  gridAxis: "#666666",
  axisX: "#a04a4a",
  axisY: "#4a8a4a",
  gizmoX: "#c85a5a",
  gizmoY: "#61a861",
  gizmoZ: "#5f8fc8",
  selection: "#f0a030",
  selectionSoft: "rgba(240, 160, 48, 0.55)",
  camera: "#d8d8d8",
  light: "#e0d080",
  brush: "rgba(240, 160, 48, 0.9)",
  brushFill: "rgba(240, 160, 48, 0.10)",
  outline: "#3c3c3c",
  edit: "#ffb84d",
  editSoft: "rgba(255, 184, 77, 0.55)",
  editFill: "rgba(255, 184, 77, 0.18)",
  face1: "#9d9d9d",
  face2: "#c4c4c4",
  face3: "#b4b4b4",
  face4: "#8c8c8c",
  face5: "#a8a8a8",
  face6: "#bdbdbd"
};

const CUBE_FACES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7]
];

const CUBE_CORNERS: ViewportVec3[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1]
];

function add(a: ViewportVec3, b: ViewportVec3): ViewportVec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function rotateZ(p: ViewportVec3, r: ViewportVec3): ViewportVec3 {
  let [x, y, z] = p;
  const cx = Math.cos(r[0]);
  const sx = Math.sin(r[0]);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  const cy = Math.cos(r[1]);
  const sy = Math.sin(r[1]);
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  const cz = Math.cos(r[2]);
  const sz = Math.sin(r[2]);
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return [x, y, z];
}

/**
 * Viewport — 3D scene canvas with orbit / pan / zoom, object picking, transform
 * gizmo and edit-mode overlays. Works on a component-free `ViewportObject[]`
 * model: meshes render as unit cubes, cameras as triangles and lights as discs.
 * Mount with `host.appendChild(viewport.root)`; call `dispose()` to release the
 * window listeners and render loop.
 *
 * BEM:
 *   .lg-viewport
 *   .lg-viewport__canvas | __info | __muted
 *
 * Events:
 *   select       → `string | null`   pointer picked an object (or empty space)
 *   status       → `string`          transform / interaction hint
 *   context-menu → `{ x, y }`        right click on the canvas
 *   change       → `void`            objects were mutated (transform confirmed/cancelled)
 *   transform    → `{ kind, phase }` transform started / confirmed / cancelled
 */
export class Viewport extends EventMitter {
  public root: HTMLElement;
  public canvas: HTMLCanvasElement;
  public info: HTMLElement;

  private ctx: CanvasRenderingContext2D;
  private objects: ViewportObject[];
  private selectedId: string | null;

  private dirty = true;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private yaw = -0.72;
  private pitch = 0.5;
  private distance = 16.5;
  private target: ViewportVec3 = [0, 0, 0.9];
  private orbiting = false;
  private panning = false;
  private lastX = 0;
  private lastY = 0;
  private transform: ViewportTransform | null = null;
  private transformStart: { loc: ViewportVec3; rot: ViewportVec3; scale: ViewportVec3; x: number; y: number } | null =
    null;
  private overlays: boolean;
  private sidebarOpen: boolean;
  private shading: ViewportShading;
  private editMode: boolean;
  private editElement: ViewportEditElement;
  private brush: string | null;
  private pointerX = 0;
  private pointerY = 0;
  private hasPointer = false;
  private palette: Palette = { ...DEFAULT_PALETTE };
  private resizeObserver: ResizeObserver | null = null;
  private raf = 0;
  private disposed = false;

  constructor(options: ViewportOptions = {}) {
    super();
    this.objects = options.objects ?? [];
    this.selectedId = options.selected ?? null;
    this.overlays = options.overlays ?? false;
    this.sidebarOpen = options.sidebarOpen ?? false;
    this.shading = options.shading ?? "solid";
    this.editMode = options.editMode ?? false;
    this.editElement = options.editElement ?? "vertex";
    this.brush = options.brush ?? null;

    this.root = document.createElement("div");
    this.root.className = ["lg-viewport", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;
    this.root.tabIndex = -1;

    this.canvas = document.createElement("canvas");
    this.canvas.className = "lg-viewport__canvas";
    this.canvas.tabIndex = 0;
    this.root.appendChild(this.canvas);

    this.info = document.createElement("div");
    this.info.className = "lg-viewport__info";
    this.root.appendChild(this.info);

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d unavailable");
    this.ctx = ctx;

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.root);
    }
    this.resize();

    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
    this.canvas.addEventListener("click", this.onClick);
    window.addEventListener("mousemove", this.onWindowMove);
    window.addEventListener("mouseup", this.onWindowUp);

    this.startLoop();
  }

  /* ------------------------------------------------------------------ */
  /* public state                                                        */
  /* ------------------------------------------------------------------ */

  getObjects(): ViewportObject[] {
    return this.objects;
  }

  setObjects(objects: ViewportObject[]) {
    this.objects = objects;
    this.invalidate();
  }

  getSelected(): string | null {
    return this.selectedId;
  }

  /** Programmatic selection; does not emit `select` (only pointer picking does). */
  setSelected(id: string | null) {
    if (this.selectedId === id) return;
    this.selectedId = id;
    this.invalidate();
  }

  setOverlays(value: boolean) {
    this.overlays = value;
    this.invalidate();
  }

  getOverlays(): boolean {
    return this.overlays;
  }

  setSidebarOpen(value: boolean) {
    this.sidebarOpen = value;
    this.invalidate();
  }

  getSidebarOpen(): boolean {
    return this.sidebarOpen;
  }

  setShading(value: ViewportShading) {
    this.shading = value;
    this.invalidate();
  }

  getShading(): ViewportShading {
    return this.shading;
  }

  setEditMode(value: boolean) {
    this.editMode = value;
    this.invalidate();
  }

  getEditMode(): boolean {
    return this.editMode;
  }

  setEditElementMode(value: ViewportEditElement) {
    this.editElement = value;
    this.invalidate();
  }

  getEditElementMode(): ViewportEditElement {
    return this.editElement;
  }

  setBrush(value: string | null) {
    this.brush = value;
    this.invalidate();
  }

  getBrush(): string | null {
    return this.brush;
  }

  setView(yaw: number, pitch: number, distance = this.distance) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.distance = distance;
    this.invalidate();
  }

  snapshot(): string {
    return this.canvas.toDataURL("image/png");
  }

  /** Re-measure the canvas; safe to call after layout changes (e.g. sidebar toggle). */
  resize() {
    const rect = this.root.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.invalidate();
  }

  invalidate() {
    this.dirty = true;
  }

  focusSelection() {
    const object = this.objects.find(item => item.id === this.selectedId);
    if (object) {
      this.target = [...object.loc];
      this.distance = 10;
      this.invalidate();
    }
  }

  frameAll() {
    this.target = [0, 0, 0.9];
    this.distance = 16.5;
    this.yaw = -0.72;
    this.pitch = 0.5;
    this.invalidate();
  }

  zoom(delta: number) {
    this.distance = Math.max(2.5, Math.min(60, this.distance * Math.exp(delta * 0.0015)));
    this.invalidate();
  }

  /* ------------------------------------------------------------------ */
  /* transforms                                                          */
  /* ------------------------------------------------------------------ */

  beginTransform(kind: ViewportTransform): boolean {
    const rect = this.canvas.getBoundingClientRect();
    if (this.hasPointer) {
      this.lastX = this.pointerX;
      this.lastY = this.pointerY;
    } else if (!this.lastX) {
      this.lastX = rect.left + rect.width / 2;
      this.lastY = rect.top + rect.height / 2;
    }
    const object = this.objects.find(item => item.id === this.selectedId);
    if (!object) {
      this.emit("status", "No active object to transform");
      return false;
    }
    this.transform = kind;
    this.transformStart = {
      loc: [...object.loc] as ViewportVec3,
      rot: [...object.rot] as ViewportVec3,
      scale: [...object.scale] as ViewportVec3,
      x: this.lastX,
      y: this.lastY
    };
    this.emit("transform", { kind, phase: "start" });
    this.emit(
      "status",
      kind === "translate"
        ? "Move: 移动鼠标，左键/Enter 确认，右键/Esc 取消"
        : kind === "rotate"
        ? "Rotate: 移动鼠标，左键/Enter 确认，右键/Esc 取消"
        : "Scale: 移动鼠标，左键/Enter 确认，右键/Esc 取消"
    );
    return true;
  }

  confirmTransform() {
    if (!this.transform) return;
    const kind = this.transform;
    this.transform = null;
    this.transformStart = null;
    this.emit("transform", { kind, phase: "confirm" });
    this.emit("status", "Transform applied");
    this.emit("change");
    this.invalidate();
  }

  cancelTransform() {
    if (!this.transform || !this.transformStart) return;
    const kind = this.transform;
    const object = this.objects.find(item => item.id === this.selectedId);
    if (object) {
      object.loc = [...this.transformStart.loc];
      object.rot = [...this.transformStart.rot];
      object.scale = [...this.transformStart.scale];
    }
    this.transform = null;
    this.transformStart = null;
    this.emit("transform", { kind, phase: "cancel" });
    this.emit("status", "Transform cancelled");
    this.emit("change");
    this.invalidate();
  }

  /* ------------------------------------------------------------------ */
  /* teardown                                                            */
  /* ------------------------------------------------------------------ */

  /** Remove global listeners and the render loop. Safe to call more than once. */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("mousemove", this.onWindowMove);
    window.removeEventListener("mouseup", this.onWindowUp);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("contextmenu", this.onContextMenu);
    this.canvas.removeEventListener("click", this.onClick);
    this.root.remove();
    this.removeAllListeners();
  }

  /* ------------------------------------------------------------------ */
  /* pointer input                                                       */
  /* ------------------------------------------------------------------ */

  private onMouseDown = (event: MouseEvent) => {
    this.canvas.focus();
    if (event.button === 1) {
      event.preventDefault();
      if (event.shiftKey) this.panning = true;
      else this.orbiting = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      return;
    }
    if (event.button === 0 && !this.transform) {
      this.selectAt(event.offsetX, event.offsetY);
    }
  };

  private onWindowMove = (event: MouseEvent) => {
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.hasPointer = true;
    if (this.brush) this.invalidate();
    if (!this.orbiting && !this.panning && !this.transform) {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
    this.onMouseMove(event);
  };

  private onMouseMove = (event: MouseEvent) => {
    if (this.transform && this.transformStart) {
      const dx = event.clientX - this.transformStart.x;
      const dy = event.clientY - this.transformStart.y;
      const object = this.objects.find(item => item.id === this.selectedId);
      if (!object) return;
      if (this.transform === "translate") {
        object.loc = [
          this.transformStart.loc[0] + dx * 0.018,
          this.transformStart.loc[1] - dy * 0.018,
          this.transformStart.loc[2]
        ];
      } else if (this.transform === "rotate") {
        object.rot = [this.transformStart.rot[0], this.transformStart.rot[1], this.transformStart.rot[2] + dx * 0.012];
      } else {
        const factor = Math.max(0.05, 1 + dx * 0.006);
        object.scale = [
          this.transformStart.scale[0] * factor,
          this.transformStart.scale[1] * factor,
          this.transformStart.scale[2] * factor
        ];
      }
      this.emit("change");
      this.invalidate();
      return;
    }
    if (this.orbiting) {
      this.yaw += (event.clientX - this.lastX) * 0.008;
      this.pitch = Math.max(-0.2, Math.min(1.35, this.pitch + (event.clientY - this.lastY) * 0.006));
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.invalidate();
    } else if (this.panning) {
      const scale = this.distance * 0.0016;
      this.target = [
        this.target[0] - (event.clientX - this.lastX) * scale * Math.cos(this.yaw),
        this.target[1] - (event.clientX - this.lastX) * scale * Math.sin(this.yaw),
        this.target[2] + (event.clientY - this.lastY) * scale
      ];
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.invalidate();
    }
  };

  private onWindowUp = () => {
    this.orbiting = false;
    this.panning = false;
  };

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    this.zoom(event.deltaY);
  };

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    if (this.transform) {
      this.cancelTransform();
      return;
    }
    this.emit("context-menu", { x: event.clientX, y: event.clientY });
  };

  private onClick = () => {
    if (this.transform) this.confirmTransform();
    else this.canvas.focus();
  };

  /* ------------------------------------------------------------------ */
  /* picking                                                             */
  /* ------------------------------------------------------------------ */

  private selectAt(x: number, y: number) {
    let best: string | null = null;
    let bestDepth = Infinity;
    for (const object of this.objects) {
      if (!object.visible || !object.selectable) continue;
      const p = this.project(object.loc);
      let hit = Math.hypot(p[0] - x, p[1] - y) < 22;
      if (object.type === "mesh") {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const corner of CUBE_CORNERS) {
          const projected = this.project(this.worldPoint(object, corner));
          minX = Math.min(minX, projected[0]);
          maxX = Math.max(maxX, projected[0]);
          minY = Math.min(minY, projected[1]);
          maxY = Math.max(maxY, projected[1]);
        }
        hit = x >= minX - 4 && x <= maxX + 4 && y >= minY - 4 && y <= maxY + 4;
      }
      if (hit && p[2] < bestDepth) {
        best = object.id;
        bestDepth = p[2];
      }
    }
    this.selectedId = best;
    this.emit("select", best);
    this.invalidate();
  }

  /* ------------------------------------------------------------------ */
  /* projection                                                          */
  /* ------------------------------------------------------------------ */

  private startLoop() {
    const tick = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(tick);
      if (!this.dirty) return;
      this.dirty = false;
      this.draw();
    };
    this.raf = requestAnimationFrame(tick);
  }

  private project(point: ViewportVec3): [number, number, number] {
    const p: ViewportVec3 = [point[0] - this.target[0], point[1] - this.target[1], point[2] - this.target[2]];
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);
    const x1 = p[0] * cy - p[1] * sy;
    const y1 = p[0] * sy + p[1] * cy;
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const y2 = y1 * cp - p[2] * sp;
    const z2 = y1 * sp + p[2] * cp;
    const depth = Math.max(0.1, z2 + this.distance);
    const focal = Math.min(this.width, this.height) * 1.15;
    return [this.width / 2 + (x1 * focal) / depth, this.height / 2 - (y2 * focal) / depth, depth];
  }

  private worldPoint(object: ViewportObject, local: ViewportVec3): ViewportVec3 {
    const scaled: ViewportVec3 = [local[0] * object.scale[0], local[1] * object.scale[1], local[2] * object.scale[2]];
    return add(rotateZ(scaled, object.rot), object.loc);
  }

  /* ------------------------------------------------------------------ */
  /* drawing                                                             */
  /* ------------------------------------------------------------------ */

  private color(name: string, fallback: string): string {
    if (typeof getComputedStyle !== "function") return fallback;
    const value = getComputedStyle(this.root).getPropertyValue(name).trim();
    return value || fallback;
  }

  private refreshPalette() {
    const d = DEFAULT_PALETTE;
    this.palette = {
      bgSolid: this.color("--lg-viewport-bg", d.bgSolid),
      bgWire: this.color("--lg-viewport-bg-wire", d.bgWire),
      grid: this.color("--lg-viewport-grid", d.grid),
      gridAxis: this.color("--lg-viewport-grid-axis", d.gridAxis),
      axisX: this.color("--lg-viewport-axis-x", d.axisX),
      axisY: this.color("--lg-viewport-axis-y", d.axisY),
      gizmoX: this.color("--lg-viewport-gizmo-x", d.gizmoX),
      gizmoY: this.color("--lg-viewport-gizmo-y", d.gizmoY),
      gizmoZ: this.color("--lg-viewport-gizmo-z", d.gizmoZ),
      selection: this.color("--lg-viewport-selection", d.selection),
      selectionSoft: this.color("--lg-viewport-selection-soft", d.selectionSoft),
      camera: this.color("--lg-viewport-camera", d.camera),
      light: this.color("--lg-viewport-light", d.light),
      brush: this.color("--lg-viewport-brush", d.brush),
      brushFill: this.color("--lg-viewport-brush-fill", d.brushFill),
      outline: this.color("--lg-viewport-outline", d.outline),
      edit: this.color("--lg-viewport-edit", d.edit),
      editSoft: this.color("--lg-viewport-edit-soft", d.editSoft),
      editFill: this.color("--lg-viewport-edit-fill", d.editFill),
      face1: this.color("--lg-viewport-face-1", d.face1),
      face2: this.color("--lg-viewport-face-2", d.face2),
      face3: this.color("--lg-viewport-face-3", d.face3),
      face4: this.color("--lg-viewport-face-4", d.face4),
      face5: this.color("--lg-viewport-face-5", d.face5),
      face6: this.color("--lg-viewport-face-6", d.face6)
    };
  }

  private updateInfo() {
    const muted = document.createElement("span");
    muted.className = "lg-viewport__muted";
    muted.textContent = `(1) Collection | ${this.selectedId ?? "Scene"}`;
    this.info.replaceChildren("User Perspective", document.createElement("br"), muted);
  }

  private draw() {
    this.refreshPalette();
    this.updateInfo();
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = this.shading === "wireframe" ? this.palette.bgWire : this.palette.bgSolid;
    ctx.fillRect(0, 0, w, h);

    this.drawGrid();
    this.drawObjects();
    if (this.overlays) {
      this.drawGizmo();
      this.drawAxisWidget();
    }
    this.drawBrushCursor();
  }

  private drawBrushCursor() {
    if (!this.brush || !this.hasPointer) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = this.pointerX - rect.left;
    const y = this.pointerY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.palette.brush;
    ctx.fillStyle = this.palette.brushFill;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.brush;
    ctx.fill();
    ctx.restore();
  }

  private drawGrid() {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i += 1) {
      ctx.strokeStyle = i === 0 ? this.palette.gridAxis : this.palette.grid;
      ctx.beginPath();
      const a = this.project([i, -10, 0]);
      const b = this.project([i, 10, 0]);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
      ctx.beginPath();
      const c = this.project([-10, i, 0]);
      const d = this.project([10, i, 0]);
      ctx.moveTo(c[0], c[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.stroke();
    }
    const x = this.project([0, 0, 0]);
    const xa = this.project([10, 0, 0]);
    const ya = this.project([0, 10, 0]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = this.palette.axisX;
    ctx.beginPath();
    ctx.moveTo(x[0], x[1]);
    ctx.lineTo(xa[0], xa[1]);
    ctx.stroke();
    ctx.strokeStyle = this.palette.axisY;
    ctx.beginPath();
    ctx.moveTo(x[0], x[1]);
    ctx.lineTo(ya[0], ya[1]);
    ctx.stroke();
  }

  private drawObjects() {
    const visible = this.objects.filter(object => object.visible);
    visible.sort((a, b) => this.project(b.loc)[2] - this.project(a.loc)[2]);
    for (const object of visible) {
      if (object.type === "mesh") this.drawCube(object);
      else if (object.type === "camera") this.drawCamera(object);
      else this.drawLight(object);
    }
  }

  private drawCube(object: ViewportObject) {
    const ctx = this.ctx;
    const selected = object.id === this.selectedId;
    const projected = CUBE_CORNERS.map(corner => this.project(this.worldPoint(object, corner)));
    const faces = CUBE_FACES.map(face => ({
      points: face.map(index => projected[index]),
      depth: face.reduce((sum, index) => sum + projected[index][2], 0) / face.length
    })).sort((a, b) => b.depth - a.depth);

    const shades =
      this.shading === "wireframe"
        ? [
            "rgba(40,40,40,0.35)",
            "rgba(60,60,60,0.35)",
            "rgba(50,50,50,0.35)",
            "rgba(70,70,70,0.35)",
            "rgba(55,55,55,0.35)",
            "rgba(65,65,65,0.35)"
          ]
        : [
            this.palette.face1,
            this.palette.face2,
            this.palette.face3,
            this.palette.face4,
            this.palette.face5,
            this.palette.face6
          ];

    faces.forEach((face, index) => {
      ctx.beginPath();
      face.points.forEach((point, pointIndex) => {
        if (pointIndex === 0) ctx.moveTo(point[0], point[1]);
        else ctx.lineTo(point[0], point[1]);
      });
      ctx.closePath();
      ctx.fillStyle = shades[index % shades.length];
      ctx.fill();
      ctx.strokeStyle = selected ? this.palette.selection : this.palette.outline;
      ctx.lineWidth = selected ? 1.4 : 1;
      ctx.stroke();
    });

    if (selected) {
      const center = this.project(object.loc);
      ctx.strokeStyle = this.palette.selectionSoft;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center[0], center[1], 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.editMode && selected) {
      ctx.strokeStyle = this.editElement === "edge" ? this.palette.edit : this.palette.editSoft;
      ctx.lineWidth = this.editElement === "edge" ? 2 : 1.2;
      for (const face of CUBE_FACES) {
        ctx.beginPath();
        face.forEach((index, pointIndex) => {
          const p = projected[index];
          if (pointIndex === 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        });
        ctx.closePath();
        if (this.editElement === "face") {
          ctx.fillStyle = this.palette.editFill;
          ctx.fill();
        }
        ctx.stroke();
      }
      const showVertices = this.editElement === "vertex" || this.editElement === "edge";
      if (showVertices) {
        ctx.fillStyle = this.palette.edit;
        for (const p of projected) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], this.editElement === "vertex" ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  private drawCamera(object: ViewportObject) {
    const ctx = this.ctx;
    const p = this.project(object.loc);
    const selected = object.id === this.selectedId;
    ctx.strokeStyle = selected ? this.palette.selection : this.palette.camera;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1] - 9);
    ctx.lineTo(p[0] + 8, p[1] + 6);
    ctx.lineTo(p[0] - 8, p[1] + 6);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(40,40,40,0.7)";
    ctx.fill();
  }

  private drawLight(object: ViewportObject) {
    const ctx = this.ctx;
    const p = this.project(object.loc);
    const selected = object.id === this.selectedId;
    ctx.strokeStyle = selected ? this.palette.selection : this.palette.light;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(p[0], p[1], 6, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(p[0] + Math.cos(angle) * 9, p[1] + Math.sin(angle) * 9);
      ctx.lineTo(p[0] + Math.cos(angle) * 13, p[1] + Math.sin(angle) * 13);
      ctx.stroke();
    }
  }

  private drawGizmo() {
    const object = this.objects.find(item => item.id === this.selectedId);
    if (!object) return;
    const origin = object.loc;
    const axes: Array<{ end: ViewportVec3; color: string; label: string }> = [
      { end: [origin[0] + 1.7, origin[1], origin[2]], color: this.palette.gizmoX, label: "X" },
      { end: [origin[0], origin[1] + 1.7, origin[2]], color: this.palette.gizmoY, label: "Y" },
      { end: [origin[0], origin[1], origin[2] + 1.7], color: this.palette.gizmoZ, label: "Z" }
    ];
    const ctx = this.ctx;
    const center = this.project(origin);
    for (const axis of axes) {
      const end = this.project(axis.end);
      ctx.strokeStyle = axis.color;
      ctx.fillStyle = axis.color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(center[0], center[1]);
      ctx.lineTo(end[0], end[1]);
      ctx.stroke();
      const angle = Math.atan2(end[1] - center[1], end[0] - center[0]);
      ctx.beginPath();
      ctx.moveTo(end[0], end[1]);
      ctx.lineTo(end[0] - Math.cos(angle - 0.4) * 8, end[1] - Math.sin(angle - 0.4) * 8);
      ctx.lineTo(end[0] - Math.cos(angle + 0.4) * 8, end[1] - Math.sin(angle + 0.4) * 8);
      ctx.closePath();
      ctx.fill();
      ctx.font = `11px ${getComputedStyle(this.root).fontFamily || "sans-serif"}`;
      ctx.fillText(axis.label, end[0] + 5, end[1] - 5);
    }
    ctx.fillStyle = this.palette.selection;
    ctx.beginPath();
    ctx.arc(center[0], center[1], 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawAxisWidget() {
    const ctx = this.ctx;
    const cx = this.width - (this.sidebarOpen ? 264 : 46);
    const cy = 44;
    const radius = 26;
    const axes: Array<{ dir: ViewportVec3; color: string; label: string }> = [
      { dir: [1, 0, 0], color: this.palette.gizmoX, label: "X" },
      { dir: [0, 1, 0], color: this.palette.gizmoY, label: "Y" },
      { dir: [0, 0, 1], color: this.palette.gizmoZ, label: "Z" }
    ];
    ctx.lineWidth = 1.4;
    for (const axis of axes) {
      const p = this.project([axis.dir[0] * 3, axis.dir[1] * 3, axis.dir[2] * 3]);
      const dx = p[0] - this.width / 2;
      const dy = p[1] - this.height / 2;
      const length = Math.hypot(dx, dy) || 1;
      const x = cx + (dx / length) * radius;
      const y = cy + (dy / length) * radius;
      ctx.strokeStyle = axis.color;
      ctx.fillStyle = axis.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.font = `11px ${getComputedStyle(this.root).fontFamily || "sans-serif"}`;
      ctx.fillText(axis.label, x + (dx / length) * 6 - 3, y + (dy / length) * 6 + 3);
    }
    ctx.strokeStyle = this.palette.gridAxis;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}
