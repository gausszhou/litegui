export type Vec3 = [number, number, number];

export interface SceneObject {
  id: string;
  name: string;
  type: "mesh" | "camera" | "light";
  loc: Vec3;
  rot: Vec3;
  scale: Vec3;
  visible: boolean;
  selectable: boolean;
  color?: string;
}

interface ViewportOptions {
  objects: SceneObject[];
  getSelected: () => string | null;
  onSelect: (id: string | null) => void;
  onStatus: (text: string) => void;
  onContextMenu: (x: number, y: number) => void;
  onChange: () => void;
}

const CUBE_FACES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7]
];

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function rotateZ(p: Vec3, r: Vec3): Vec3 {
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

export class Viewport {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private info: HTMLElement;
  private ctx: CanvasRenderingContext2D;
  private options: ViewportOptions;
  private dirty = true;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private yaw = -0.72;
  private pitch = 0.5;
  private distance = 16.5;
  private target: Vec3 = [0, 0, 0.9];
  private orbiting = false;
  private panning = false;
  private lastX = 0;
  private lastY = 0;
  private transform: "translate" | "rotate" | "scale" | null = null;
  private transformStart: { loc: Vec3; rot: Vec3; scale: Vec3; x: number; y: number } | null = null;
  private overlays = true;
  private sidebarOpen = true;
  private shading: "wireframe" | "solid" | "material" | "rendered" = "solid";
  private editMode = false;

  constructor(parent: HTMLElement, options: ViewportOptions) {
    this.options = options;
    this.root = document.createElement("div");
    this.root.className = "be-viewport";
    this.canvas = document.createElement("canvas");
    this.canvas.className = "be-canvas";
    this.canvas.tabIndex = 0;
    this.root.appendChild(this.canvas);
    this.info = document.createElement("div");
    this.info.className = "be-viewport-info";
    this.root.appendChild(this.info);
    parent.appendChild(this.root);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d unavailable");
    this.ctx = ctx;

    const resize = () => {
      const rect = this.root.getBoundingClientRect();
      this.dpr = window.devicePixelRatio || 1;
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.dirty = true;
      this.requestRender();
    };
    new ResizeObserver(resize).observe(this.root);
    resize();

    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (this.transform) this.cancelTransform();
      else this.options.onContextMenu(event.clientX, event.clientY);
    });
    this.canvas.addEventListener("click", () => {
      if (this.transform) this.confirmTransform();
      else this.canvas.focus();
    });
    this.canvas.addEventListener("mousemove", (event) => {
      if (!this.orbiting && !this.panning && !this.transform) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;
      }
    });
    this.startLoop();
  }

  setObjects(objects: SceneObject[]) {
    this.options.objects = objects;
    this.invalidate();
  }

  setTool(_tool: string) {
    this.invalidate();
  }

  setOverlays(value: boolean) {
    this.overlays = value;
    this.invalidate();
  }

  setSidebarOpen(value: boolean) {
    this.sidebarOpen = value;
    this.invalidate();
  }

  setShading(value: Viewport["shading"]) {
    this.shading = value;
    this.invalidate();
  }

  setEditMode(value: boolean) {
    this.editMode = value;
    this.invalidate();
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

  getSidebarOpen() {
    return this.sidebarOpen;
  }

  invalidate() {
    this.dirty = true;
    this.requestRender();
  }

  beginTransform(kind: "translate" | "rotate" | "scale") {
    if (!this.lastX) {
      const rect = this.canvas.getBoundingClientRect();
      this.lastX = rect.left + rect.width / 2;
      this.lastY = rect.top + rect.height / 2;
    }
    const id = this.options.getSelected();
    const object = this.options.objects.find((item) => item.id === id);
    if (!object) return;
    this.transform = kind;
    this.transformStart = {
      loc: [...object.loc] as Vec3,
      rot: [...object.rot] as Vec3,
      scale: [...object.scale] as Vec3,
      x: this.lastX,
      y: this.lastY
    };
    this.options.onStatus(
      kind === "translate" ? "Move: 移动鼠标，左键/Enter 确认，右键/Esc 取消" :
      kind === "rotate" ? "Rotate: 移动鼠标，左键/Enter 确认，右键/Esc 取消" :
      "Scale: 移动鼠标，左键/Enter 确认，右键/Esc 取消"
    );
  }

  confirmTransform() {
    if (!this.transform) return;
    this.transform = null;
    this.transformStart = null;
    this.options.onStatus("Transform applied");
    this.options.onChange();
    this.invalidate();
  }

  cancelTransform() {
    if (!this.transform || !this.transformStart) return;
    const object = this.options.objects.find((item) => item.id === this.options.getSelected());
    if (object) {
      object.loc = [...this.transformStart.loc];
      object.rot = [...this.transformStart.rot];
      object.scale = [...this.transformStart.scale];
    }
    this.transform = null;
    this.transformStart = null;
    this.options.onStatus("Transform cancelled");
    this.options.onChange();
    this.invalidate();
  }

  focusSelection() {
    const object = this.options.objects.find((item) => item.id === this.options.getSelected());
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

  private onMouseMove = (event: MouseEvent) => {
    if (this.transform && this.transformStart) {
      const dx = event.clientX - this.transformStart.x;
      const dy = event.clientY - this.transformStart.y;
      const object = this.options.objects.find((item) => item.id === this.options.getSelected());
      if (!object) return;
      if (this.transform === "translate") {
        object.loc = [
          this.transformStart.loc[0] + dx * 0.018,
          this.transformStart.loc[1] - dy * 0.018,
          this.transformStart.loc[2]
        ];
      } else if (this.transform === "rotate") {
        object.rot = [
          this.transformStart.rot[0],
          this.transformStart.rot[1],
          this.transformStart.rot[2] + dx * 0.012
        ];
      } else {
        const factor = Math.max(0.05, 1 + dx * 0.006);
        object.scale = [
          this.transformStart.scale[0] * factor,
          this.transformStart.scale[1] * factor,
          this.transformStart.scale[2] * factor
        ];
      }
      this.options.onChange();
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

  private onMouseUp = () => {
    this.orbiting = false;
    this.panning = false;
  };

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    this.zoom(event.deltaY);
  };

  private selectAt(x: number, y: number) {
    let best: string | null = null;
    let bestDepth = Infinity;
    for (const object of this.options.objects) {
      if (!object.visible || !object.selectable) continue;
      const p = this.project(object.loc);
      const distance = Math.hypot(p[0] - x, p[1] - y);
      if (distance < 34 && p[2] < bestDepth) {
        best = object.id;
        bestDepth = p[2];
      }
    }
    this.options.onSelect(best);
    this.invalidate();
  }

  private startLoop() {
    const tick = () => {
      requestAnimationFrame(tick);
      if (!this.dirty) return;
      this.dirty = false;
      this.draw();
    };
    requestAnimationFrame(tick);
  }

  private requestRender() {
    this.dirty = true;
  }

  private project(point: Vec3): [number, number, number] {
    const p: Vec3 = [point[0] - this.target[0], point[1] - this.target[1], point[2] - this.target[2]];
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
    return [
      this.width / 2 + (x1 * focal) / depth,
      this.height / 2 - (y2 * focal) / depth,
      depth
    ];
  }

  private worldPoint(object: SceneObject, local: Vec3): Vec3 {
    const scaled: Vec3 = [local[0] * object.scale[0], local[1] * object.scale[1], local[2] * object.scale[2]];
    return add(rotateZ(scaled, object.rot), object.loc);
  }

  private updateInfo() {
    const id = this.options.getSelected();
    this.info.innerHTML = `User Perspective<br><span class="muted">(1) Collection | ${id ?? "Scene"}</span>`;
  }

  private draw() {
    this.updateInfo();
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = this.shading === "wireframe" ? "#2c2c2c" : "#484848";
    ctx.fillRect(0, 0, w, h);

    this.drawGrid();
    this.drawObjects();
    if (this.overlays) {
      this.drawGizmo();
      this.drawAxisWidget();
    }
  }

  private drawGrid() {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i += 1) {
      const color = i === 0 ? "#666" : "#565656";
      ctx.strokeStyle = color;
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
    ctx.strokeStyle = "#a04a4a";
    ctx.beginPath(); ctx.moveTo(x[0], x[1]); ctx.lineTo(xa[0], xa[1]); ctx.stroke();
    ctx.strokeStyle = "#4a8a4a";
    ctx.beginPath(); ctx.moveTo(x[0], x[1]); ctx.lineTo(ya[0], ya[1]); ctx.stroke();
  }

  private drawObjects() {
    const visible = this.options.objects.filter((object) => object.visible);
    visible.sort((a, b) => this.project(b.loc)[2] - this.project(a.loc)[2]);
    for (const object of visible) {
      if (object.type === "mesh") this.drawCube(object);
      else if (object.type === "camera") this.drawCamera(object);
      else this.drawLight(object);
    }
  }

  private drawCube(object: SceneObject) {
    const ctx = this.ctx;
    const selected = object.id === this.options.getSelected();
    const corners: Vec3[] = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    const projected = corners.map((corner) => this.project(this.worldPoint(object, corner)));
    const faces = CUBE_FACES.map((face) => ({
      points: face.map((index) => projected[index]),
      depth: face.reduce((sum, index) => sum + projected[index][2], 0) / face.length
    })).sort((a, b) => b.depth - a.depth);

    const shades = this.shading === "wireframe"
      ? ["rgba(40,40,40,0.35)", "rgba(60,60,60,0.35)", "rgba(50,50,50,0.35)", "rgba(70,70,70,0.35)", "rgba(55,55,55,0.35)", "rgba(65,65,65,0.35)"]
      : ["#9d9d9d", "#c4c4c4", "#b4b4b4", "#8c8c8c", "#a8a8a8", "#bdbdbd"];

    faces.forEach((face, index) => {
      ctx.beginPath();
      face.points.forEach((point, pointIndex) => {
        if (pointIndex === 0) ctx.moveTo(point[0], point[1]);
        else ctx.lineTo(point[0], point[1]);
      });
      ctx.closePath();
      ctx.fillStyle = shades[index % shades.length];
      ctx.fill();
      ctx.strokeStyle = selected ? "#f0a030" : "#3c3c3c";
      ctx.lineWidth = selected ? 1.4 : 1;
      ctx.stroke();
    });

    if (selected) {
      const center = this.project(object.loc);
      ctx.strokeStyle = "rgba(240,160,48,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center[0], center[1], 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.editMode && selected) {
      ctx.strokeStyle = "#ffb84d";
      ctx.lineWidth = 1.5;
      for (const face of CUBE_FACES) {
        ctx.beginPath();
        face.forEach((index, pointIndex) => {
          const p = projected[index];
          if (pointIndex === 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        });
        ctx.closePath();
        ctx.stroke();
      }
      ctx.fillStyle = "#ffb84d";
      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawCamera(object: SceneObject) {
    const ctx = this.ctx;
    const p = this.project(object.loc);
    const selected = object.id === this.options.getSelected();
    ctx.strokeStyle = selected ? "#f0a030" : "#d8d8d8";
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

  private drawLight(object: SceneObject) {
    const ctx = this.ctx;
    const p = this.project(object.loc);
    const selected = object.id === this.options.getSelected();
    ctx.strokeStyle = selected ? "#f0a030" : "#e0d080";
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
    const id = this.options.getSelected();
    const object = this.options.objects.find((item) => item.id === id);
    if (!object) return;
    const origin = object.loc;
    const axes: Array<{ end: Vec3; color: string; label: string }> = [
      { end: [origin[0] + 1.7, origin[1], origin[2]], color: "#c85a5a", label: "X" },
      { end: [origin[0], origin[1] + 1.7, origin[2]], color: "#61a861", label: "Y" },
      { end: [origin[0], origin[1], origin[2] + 1.7], color: "#5f8fc8", label: "Z" }
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
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(axis.label, end[0] + 5, end[1] - 5);
    }
    ctx.fillStyle = "#f0a030";
    ctx.beginPath();
    ctx.arc(center[0], center[1], 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawAxisWidget() {
    const ctx = this.ctx;
    const cx = this.width - (this.sidebarOpen ? 264 : 46);
    const cy = 44;
    const radius = 26;
    const axes: Array<{ dir: Vec3; color: string; label: string }> = [
      { dir: [1, 0, 0], color: "#c85a5a", label: "X" },
      { dir: [0, 1, 0], color: "#61a861", label: "Y" },
      { dir: [0, 0, 1], color: "#5f8fc8", label: "Z" }
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
      ctx.font = "9px Inter, sans-serif";
      ctx.fillText(axis.label, x + (dx / length) * 6 - 3, y + (dy / length) * 6 + 3);
    }
    ctx.strokeStyle = "#777";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}
