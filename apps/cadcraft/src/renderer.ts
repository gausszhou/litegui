/**
 * Canvas renderer for CADCraft: model space with an adaptive grid, entity
 * painting (including dimensions, hatches and block inserts), paper space with
 * clipped layouts, and the drafting overlays (crosshair, object snaps, grips).
 */

import {
  boundsCenter,
  distance,
  entityBounds,
  flattenEntity,
  insertBounds,
  sub,
  type Bounds,
  type DimEntity,
  type DrawingDoc,
  type EllipseEntity,
  type Entity,
  type HatchEntity,
  type LeaderEntity,
  type Point,
  type TextEntity,
} from "./model";
import { gripPoints, type SnapResult } from "./picking";

export interface RenderSettings {
  showGrid: boolean;
  showLineweight: boolean;
  showDyn: boolean;
}

export interface Transform {
  a: number;
  d: number;
  e: number;
  f: number;
}

export interface Marquee {
  start: Point;
  end: Point;
  crossing: boolean;
}

const COLORS = {
  bg: "#252a32",
  paperBg: "#1e232a",
  sheet: "#f7f6f1",
  sheetShadow: "rgba(0,0,0,0.45)",
  gridMinor: "rgba(190, 210, 235, 0.05)",
  gridMajor: "rgba(190, 210, 235, 0.11)",
  axis: "rgba(190, 210, 235, 0.2)",
  crosshair: "rgba(190, 210, 235, 0.55)",
  selection: "#4aa3ff",
  hover: "#7cc4ff",
  preview: "#65d5ef",
  grip: "#79b8ff",
  gripFill: "#1b3f66",
  snap: "#c8f26e",
  snapText: "#e6ffc2",
  dim: "#d5dce6",
  sheetLine: "#2b3038",
  compass: "rgba(120, 140, 168, 0.7)",
  overlayBg: "rgba(19, 23, 29, 0.88)",
};

const MIN_SCALE = 0.006;
const MAX_SCALE = 3;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function niceStep(target: number): number {
  const exponent = Math.floor(Math.log10(Math.max(target, 1e-6)));
  const base = Math.pow(10, exponent);
  const ratio = target / base;
  if (ratio < 1.5) return base;
  if (ratio < 3.5) return base * 2;
  if (ratio < 7.5) return base * 5;
  return base * 10;
}

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return color;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export class CadRenderer {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private doc: DrawingDoc;

  readonly view = { center: { x: 6000, y: 3000 }, scale: 0.06 };
  readonly paperView = { center: { x: 420, y: 297 }, scale: 1 };
  mode: "model" | "layout" = "model";
  layoutIndex = 0;

  selection = new Set<string>();
  hoverId: string | null = null;
  preview: Entity[] = [];
  marquee: Marquee | null = null;
  activeSnap: SnapResult | null = null;
  draftFrom: Point | null = null;

  cursorScreen: Point | null = null;
  cursorWorld: Point | null = null;

  width = 1;
  height = 1;
  dpr = 1;

  private transform: Transform = { a: 0.06, d: -0.06, e: 0, f: 0 };
  private currentBackground = COLORS.bg;
  private frame = 0;
  private settings: RenderSettings = { showGrid: true, showLineweight: false, showDyn: true };
  private fitted = false;

  constructor(canvas: HTMLCanvasElement, doc: DrawingDoc) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context unavailable");
    this.ctx = context;
    this.doc = doc;
    this.resize();
  }

  setDocument(doc: DrawingDoc): void {
    this.doc = doc;
    this.selection.clear();
    this.hoverId = null;
    this.fitted = false;
    this.fitExtents();
    this.requestRender();
  }

  setSettings(settings: Partial<RenderSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.requestRender();
  }

  getSettings(): RenderSettings {
    return this.settings;
  }

  setMode(mode: "model" | "layout", layoutIndex = 0): void {
    this.mode = mode;
    this.layoutIndex = layoutIndex;
    this.activeSnap = null;
    this.marquee = null;
    this.preview = [];
    this.draftFrom = null;
    if (mode === "layout") this.fitSheet();
    else this.requestRender();
  }

  setLayout(index: number): void {
    this.mode = "layout";
    this.layoutIndex = index;
    this.fitSheet();
  }

  activeLayout() {
    return this.doc.layouts[this.layoutIndex];
  }

  /* ----------------------------------------------------------- transform */

  worldToScreen(p: Point): Point {
    const t = this.transform;
    return { x: t.e + t.a * p.x, y: t.f + t.d * p.y };
  }

  screenToWorld(p: Point): Point {
    if (this.mode === "layout") {
      const s = this.paperView.scale;
      return {
        x: this.paperView.center.x + (p.x - this.width / 2) / s,
        y: this.paperView.center.y - (p.y - this.height / 2) / s,
      };
    }
    return {
      x: this.view.center.x + (p.x - this.width / 2) / this.view.scale,
      y: this.view.center.y - (p.y - this.height / 2) / this.view.scale,
    };
  }

  pxToWorld(px: number): number {
    const scale = this.mode === "layout" ? this.paperView.scale : this.view.scale;
    return px / scale;
  }

  private setTransform(t: Transform): void {
    this.transform = t;
    this.ctx.setTransform(this.dpr * t.a, 0, 0, this.dpr * t.d, this.dpr * t.e, this.dpr * t.f);
  }

  private updateModelTransform(): void {
    const s = this.view.scale;
    this.setTransform({
      a: s,
      d: -s,
      e: this.width / 2 - s * this.view.center.x,
      f: this.height / 2 + s * this.view.center.y,
    });
  }

  private updatePaperTransform(): void {
    const s = this.paperView.scale;
    this.setTransform({
      a: s,
      d: -s,
      e: this.width / 2 - s * this.paperView.center.x,
      f: this.height / 2 + s * this.paperView.center.y,
    });
  }

  get zoomPercent(): number {
    return Math.round(this.view.scale * 100);
  }

  fitExtents(bounds?: Bounds, pad = 0.08): void {
    const b = bounds ?? this.doc.bounds();
    const width = Math.max(b.maxX - b.minX, 1);
    const height = Math.max(b.maxY - b.minY, 1);
    const scale = Math.min((this.width * (1 - pad)) / width, (this.height * (1 - pad)) / height);
    this.view.scale = clamp(scale, MIN_SCALE, MAX_SCALE);
    this.view.center = boundsCenter(b);
    this.fitted = true;
    this.requestRender();
  }

  fitSheet(): void {
    const layout = this.activeLayout();
    if (!layout) return;
    const scale = Math.min((this.width * 0.92) / layout.paper.width, (this.height * 0.9) / layout.paper.height);
    this.paperView.scale = clamp(scale, 0.15, 12);
    this.paperView.center = { x: layout.paper.width / 2, y: layout.paper.height / 2 };
    this.requestRender();
  }

  zoomAt(screen: Point, factor: number): void {
    if (this.mode === "layout") {
      const before = this.screenToWorld(screen);
      this.paperView.scale = clamp(this.paperView.scale * factor, 0.15, 12);
      const after = this.screenToWorld(screen);
      this.paperView.center.x += before.x - after.x;
      this.paperView.center.y += before.y - after.y;
    } else {
      const before = this.screenToWorld(screen);
      this.view.scale = clamp(this.view.scale * factor, MIN_SCALE, MAX_SCALE);
      const after = this.screenToWorld(screen);
      this.view.center.x += before.x - after.x;
      this.view.center.y += before.y - after.y;
    }
    this.requestRender();
  }

  panBy(dx: number, dy: number): void {
    if (this.mode === "layout") {
      this.paperView.center.x -= dx / this.paperView.scale;
      this.paperView.center.y += dy / this.paperView.scale;
    } else {
      this.view.center.x -= dx / this.view.scale;
      this.view.center.y += dy / this.view.scale;
    }
    this.requestRender();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect?.width ?? this.canvas.clientWidth ?? 1));
    const height = Math.max(1, Math.round(rect?.height ?? this.canvas.clientHeight ?? 1));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (width === this.width && height === this.height && dpr === this.dpr) return;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    if (this.mode === "layout") this.fitSheet();
    else if (!this.fitted) this.fitExtents();
    this.requestRender();
  }

  requestRender(): void {
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  /* -------------------------------------------------------------- render */

  render(): void {
    if (this.width < 2 || this.height < 2) return;
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === "layout") this.renderPaper();
    else this.renderModel();

    this.renderOverlays();
  }

  private renderModel(): void {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    this.updateModelTransform();
    if (this.settings.showGrid) this.paintGrid();
    this.currentBackground = COLORS.bg;

    const cull = this.visibleWorldBounds();
    const visibleLayers = new Set(this.doc.layers.filter(layer => layer.visible && !layer.frozen).map(l => l.id));

    for (const entity of this.doc.entities) {
      if (!visibleLayers.has(entity.layer)) continue;
      const b = entity.kind === "insert" ? insertBounds(entity, this.doc.blocks) : entityBounds(entity);
      if (!this.intersects(b, cull)) continue;
      const selected = this.selection.has(entity.id);
      const hover = this.hoverId === entity.id;
      this.paintEntity(entity, { selected, hover });
    }

    for (const entity of this.preview) this.paintEntity(entity, { preview: true });
    this.paintGrips();
  }

  private renderPaper(): void {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.paperBg;
    ctx.fillRect(0, 0, this.width, this.height);

    const layout = this.activeLayout();
    if (!layout) return;

    this.updatePaperTransform();
    const sheetScreen = {
      w: layout.paper.width * this.paperView.scale,
      h: layout.paper.height * this.paperView.scale,
    };
    const sheetLeft = this.width / 2 - sheetScreen.w / 2;
    const sheetTop = this.height / 2 - sheetScreen.h / 2;

    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.shadowColor = COLORS.sheetShadow;
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = COLORS.sheet;
    ctx.fillRect(sheetLeft, sheetTop, sheetScreen.w, sheetScreen.h);
    ctx.restore();

    this.updatePaperTransform();
    this.currentBackground = COLORS.sheet;

    // Sheet border and title block.
    for (const entity of layout.paperEntities) this.paintPaperEntity(entity);

    // Viewports.
    for (const viewport of layout.viewports) {
      const rect = viewport.rect;
      const corners = [
        this.pxInPaper(rect.minX, rect.minY),
        this.pxInPaper(rect.maxX, rect.maxY),
      ];
      const sx = corners[0].x;
      const sy = corners[0].y;
      const ex = corners[1].x;
      const ey = corners[1].y;

      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.beginPath();
      ctx.rect(sx, sy, ex - sx, ey - sy);
      ctx.clip();
      ctx.fillStyle = COLORS.sheet;
      ctx.fillRect(sx, sy, ex - sx, ey - sy);

      const a = this.paperView.scale * viewport.scale;
      const screenCenter = {
        x: (sx + ex) / 2,
        y: (sy + ey) / 2,
      };
      this.setTransform({
        a,
        d: -a,
        e: screenCenter.x - a * viewport.center.x,
        f: screenCenter.y + a * viewport.center.y,
      });
      this.currentBackground = COLORS.sheet;

      const plotLayers = new Set(
        this.doc.layers.filter(layer => layer.visible && !layer.frozen && layer.plot).map(l => l.id)
      );
      for (const entity of this.doc.entities) {
        if (!plotLayers.has(entity.layer)) continue;
        if (this.selection.has(entity.id)) continue;
        this.paintEntity(entity, { selected: false, hover: false });
      }
      ctx.restore();

      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.strokeStyle = "rgba(43, 48, 56, 0.55)";
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, ex - sx - 1, ey - sy - 1);
      ctx.restore();
    }

    this.updatePaperTransform();
    this.paintSheetCaption(layout.name);
  }

  private pxInPaper(x: number, y: number): Point {
    const s = this.paperView.scale;
    return {
      x: this.width / 2 + (x - this.paperView.center.x) * s,
      y: this.height / 2 - (y - this.paperView.center.y) * s,
    };
  }

  private paintSheetCaption(name: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = "rgba(190, 210, 235, 0.5)";
    ctx.font = "500 11px Inter, 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`PAPER SPACE · ${name}`, 18, this.height - 16);
    ctx.restore();
  }

  private visibleWorldBounds(): Bounds {
    const a = this.screenToWorld({ x: 0, y: 0 });
    const b = this.screenToWorld({ x: this.width, y: this.height });
    return { minX: Math.min(a.x, b.x), minY: Math.min(a.y, b.y), maxX: Math.max(a.x, b.x), maxY: Math.max(a.y, b.y) };
  }

  private intersects(a: Bounds, b: Bounds): boolean {
    return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
  }

  /* ---------------------------------------------------------------- grid */

  private paintGrid(): void {
    const ctx = this.ctx;
    const scale = this.view.scale;
    const step = niceStep(24 / scale);
    const major = step * 5;
    const b = this.visibleWorldBounds();

    ctx.lineWidth = 1 / scale;
    ctx.strokeStyle = COLORS.gridMinor;
    ctx.beginPath();
    const startX = Math.floor(b.minX / step) * step;
    const startY = Math.floor(b.minY / step) * step;
    let index = 0;
    for (let x = startX; x <= b.maxX && index < 600; x += step, index++) {
      if (Math.abs(x % major) < 1e-6) continue;
      ctx.moveTo(x, b.minY);
      ctx.lineTo(x, b.maxY);
    }
    index = 0;
    for (let y = startY; y <= b.maxY && index < 600; y += step, index++) {
      if (Math.abs(y % major) < 1e-6) continue;
      ctx.moveTo(b.minX, y);
      ctx.lineTo(b.maxX, y);
    }
    ctx.stroke();

    ctx.strokeStyle = COLORS.gridMajor;
    ctx.beginPath();
    index = 0;
    for (let x = Math.floor(b.minX / major) * major; x <= b.maxX && index < 300; x += major, index++) {
      ctx.moveTo(x, b.minY);
      ctx.lineTo(x, b.maxY);
    }
    index = 0;
    for (let y = Math.floor(b.minY / major) * major; y <= b.maxY && index < 300; y += major, index++) {
      ctx.moveTo(b.minX, y);
      ctx.lineTo(b.maxX, y);
    }
    ctx.stroke();

    // Origin axes.
    ctx.strokeStyle = COLORS.axis;
    ctx.beginPath();
    ctx.moveTo(0, b.minY);
    ctx.lineTo(0, b.maxY);
    ctx.moveTo(b.minX, 0);
    ctx.lineTo(b.maxX, 0);
    ctx.stroke();
  }

  /* ------------------------------------------------------------ painting */

  private paintEntity(entity: Entity, options: { selected?: boolean; hover?: boolean; preview?: boolean }): void {
    if (entity.kind === "insert") {
      const primitives = flattenEntity(entity, this.doc.blocks);
      for (const primitive of primitives) this.paintPrimitive(primitive, options);
      return;
    }
    this.paintPrimitive(entity, options);
  }

  private paintPrimitive(
    entity: Entity,
    options: { selected?: boolean; hover?: boolean; preview?: boolean }
  ): void {
    if (entity.kind === "insert") {
      for (const primitive of flattenEntity(entity, this.doc.blocks)) this.paintPrimitive(primitive, options);
      return;
    }
    const ctx = this.ctx;
    const layer = this.doc.layer(entity.layer);
    let color = entity.color ?? layer?.color ?? "#e2e7ee";
    if (options.preview) color = COLORS.preview;
    else if (options.selected) color = COLORS.selection;
    else if (options.hover) color = COLORS.hover;

    const lineweight = entity.lineweight ?? layer?.lineweight ?? 0.25;
    let px = lineweight >= 0.35 ? 1.9 : lineweight >= 0.25 ? 1.35 : 1.05;
    if (this.settings.showLineweight) px = clamp(lineweight * 6, 0.8, 4.2);
    if (options.selected) px += 1.1;
    if (options.preview) px = 1.6;

    const scale = this.transform.a;
    ctx.lineWidth = px / scale;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.setLineDash(this.dashFor(entity.linetype ?? layer?.linetype ?? "continuous", Boolean(options.preview)));
    ctx.globalAlpha = options.preview ? 0.95 : 1;

    switch (entity.kind) {
      case "line": {
        ctx.beginPath();
        ctx.moveTo(entity.p1.x, entity.p1.y);
        ctx.lineTo(entity.p2.x, entity.p2.y);
        ctx.stroke();
        break;
      }
      case "polyline": {
        if (entity.points.length === 0) break;
        ctx.beginPath();
        ctx.moveTo(entity.points[0].x, entity.points[0].y);
        for (let i = 1; i < entity.points.length; i++) ctx.lineTo(entity.points[i].x, entity.points[i].y);
        if (entity.closed) ctx.closePath();
        ctx.stroke();
        break;
      }
      case "circle": {
        ctx.beginPath();
        ctx.arc(entity.center.x, entity.center.y, entity.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case "arc": {
        ctx.beginPath();
        ctx.arc(entity.center.x, entity.center.y, entity.radius, entity.startAngle, entity.endAngle, false);
        ctx.stroke();
        break;
      }
      case "ellipse": {
        this.paintEllipse(entity, color);
        break;
      }
      case "text": {
        ctx.setLineDash([]);
        this.paintText(entity, color);
        break;
      }
      case "dim": {
        ctx.setLineDash([]);
        this.paintDimension(entity, color);
        break;
      }
      case "leader": {
        ctx.setLineDash([]);
        this.paintLeader(entity, color);
        break;
      }
      case "hatch": {
        this.paintHatch(entity, color, options);
        break;
      }
      case "point": {
        ctx.setLineDash([]);
        const size = 3 / scale;
        ctx.beginPath();
        ctx.moveTo(entity.p.x - size, entity.p.y);
        ctx.lineTo(entity.p.x + size, entity.p.y);
        ctx.moveTo(entity.p.x, entity.p.y - size);
        ctx.lineTo(entity.p.x, entity.p.y + size);
        ctx.stroke();
        break;
      }
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }

  private dashFor(linetype: string, preview: boolean): number[] {
    if (preview) return [7 / this.transform.a, 4 / this.transform.a];
    const unit = 1 / this.transform.a;
    switch (linetype) {
      case "dashed":
        return [6 * unit, 3.5 * unit];
      case "hidden":
        return [3.5 * unit, 2.5 * unit];
      case "center":
        return [14 * unit, 3 * unit, 2.5 * unit, 3 * unit];
      case "dashdot":
        return [8 * unit, 3 * unit, 2 * unit, 3 * unit];
      default:
        return [];
    }
  }

  private paintEllipse(entity: EllipseEntity, color: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(entity.center.x, entity.center.y);
    ctx.rotate(entity.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(entity.rx), Math.abs(entity.ry), 0, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  private paintText(entity: TextEntity, color: string): void {
    const size = entity.height * this.transform.a;
    if (size < 3.2) return;
    const p = this.worldToScreen(entity.p);
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(-entity.rotation);
    ctx.font = `${size >= 9 ? 600 : 500} ${size}px Inter, 'Segoe UI', 'DejaVu Sans', sans-serif`;
    ctx.textAlign = entity.align === "center" ? "center" : entity.align === "right" ? "right" : "left";
    ctx.textBaseline = "alphabetic";
    if (entity.plate) {
      const metrics = ctx.measureText(entity.text);
      const padding = Math.max(2, size * 0.2);
      const width = metrics.width + padding * 2;
      const left = entity.align === "center" ? -width / 2 : entity.align === "right" ? -width : 0;
      ctx.fillStyle = entity.plate;
      ctx.fillRect(left, -size * 0.95, width, size * 1.25);
    }
    ctx.fillStyle = color;
    ctx.fillText(entity.text, 0, 0);
    ctx.restore();
  }

  private paintDimension(dim: DimEntity, color: string): void {
    const ctx = this.ctx;
    const scale = this.transform.a;
    const px = (value: number) => value / scale;
    const text = dim.textOverride ?? this.measurementText(dim);
    const isRadial = dim.dimType === "radial";
    let textPoint: Point;
    let textAngle = 0;

    if (isRadial) {
      ctx.beginPath();
      ctx.moveTo(dim.p1.x, dim.p1.y);
      ctx.lineTo(dim.p2.x, dim.p2.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dim.p2.x, dim.p2.y);
      ctx.lineTo(dim.pos.x, dim.pos.y);
      ctx.stroke();
      this.paintArrow(dim.p2, dim.p1, 9 / scale, color);
      textPoint = dim.pos;
    } else {
      let p1 = dim.p1;
      let p2 = dim.p2;
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      if (dim.dimType === "linear" && dx >= dy) {
        const y = dim.pos.y;
        p1 = { x: dim.p1.x, y };
        p2 = { x: dim.p2.x, y };
      } else if (dim.dimType === "linear") {
        const x = dim.pos.x;
        p1 = { x, y: dim.p1.y };
        p2 = { x, y: dim.p2.y };
      } else {
        const dir = sub(dim.p2, dim.p1);
        const len = Math.hypot(dir.x, dir.y) || 1;
        const normal = { x: -dir.y / len, y: dir.x / len };
        const offset = (dim.pos.x - dim.p1.x) * normal.x + (dim.pos.y - dim.p1.y) * normal.y;
        p1 = { x: dim.p1.x + normal.x * offset, y: dim.p1.y + normal.y * offset };
        p2 = { x: dim.p2.x + normal.x * offset, y: dim.p2.y + normal.y * offset };
      }

      const gap = px(5);
      const over = px(7);
      // Extension lines.
      ctx.beginPath();
      const d1 = this.unitNormal(dim.p1, p1);
      const d2 = this.unitNormal(dim.p2, p2);
      ctx.moveTo(dim.p1.x + d1.x * gap, dim.p1.y + d1.y * gap);
      ctx.lineTo(p1.x + d1.x * over, p1.y + d1.y * over);
      ctx.moveTo(dim.p2.x + d2.x * gap, dim.p2.y + d2.y * gap);
      ctx.lineTo(p2.x + d2.x * over, p2.y + d2.y * over);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const arrow = Math.max(px(5), 7 / scale);
      this.paintArrow(p1, p2, arrow, color);
      this.paintArrow(p2, p1, arrow, color);

      textPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      textAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      if (textAngle > Math.PI / 2 || textAngle < -Math.PI / 2) textAngle += Math.PI;
    }

    const label = text;
    const screen = this.worldToScreen(textPoint);
    const ctx2 = this.ctx;
    ctx2.save();
    ctx2.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx2.translate(screen.x, screen.y);
    ctx2.rotate(isRadial ? 0 : -textAngle);
    const fontSize = clamp(160 * scale, 9, 22);
    ctx2.font = `500 ${fontSize}px Inter, 'Segoe UI', sans-serif`;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    const metrics = ctx2.measureText(label);
    ctx2.fillStyle = this.currentBackground;
    ctx2.fillRect(-metrics.width / 2 - 3, -fontSize * 0.62, metrics.width + 6, fontSize * 1.24);
    ctx2.fillStyle = color;
    if (isRadial) {
      ctx2.restore();
      ctx2.save();
      ctx2.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx2.translate(screen.x, screen.y - fontSize * 0.8);
      ctx2.font = `500 ${fontSize}px Inter, 'Segoe UI', sans-serif`;
      ctx2.textAlign = "center";
      ctx2.fillText(label, 0, 0);
    } else {
      ctx2.fillText(label, 0, 0);
    }
    ctx2.restore();
  }

  private measurementText(dim: DimEntity): string {
    if (dim.dimType === "radial") return `R${Math.round(distance(dim.p1, dim.p2))}`;
    let value: number;
    if (dim.dimType === "linear") {
      const dx = Math.abs(dim.p2.x - dim.p1.x);
      const dy = Math.abs(dim.p2.y - dim.p1.y);
      value = dx >= dy ? dx : dy;
    } else {
      value = distance(dim.p1, dim.p2);
    }
    return String(Math.round(value));
  }

  private unitNormal(a: Point, b: Point): Point {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  private paintArrow(tip: Point, toward: Point, size: number, color: string): void {
    const angle = Math.atan2(toward.y - tip.y, toward.x - tip.x);
    const spread = 0.32;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(tip.x + Math.cos(angle + spread) * size, tip.y + Math.sin(angle + spread) * size);
    ctx.lineTo(tip.x + Math.cos(angle - spread) * size, tip.y + Math.sin(angle - spread) * size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  private paintLeader(entity: LeaderEntity, color: string): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(entity.points[0].x, entity.points[0].y);
    for (let i = 1; i < entity.points.length; i++) ctx.lineTo(entity.points[i].x, entity.points[i].y);
    ctx.stroke();
    this.paintArrow(entity.points[0], entity.points[1] ?? entity.points[0], 8 / this.transform.a, color);

    const anchor = entity.points[entity.points.length - 1];
    const size = entity.textHeight * this.transform.a;
    if (size < 3.2) return;
    const screen = this.worldToScreen(anchor);
    const ctx2 = this.ctx;
    ctx2.save();
    ctx2.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx2.font = `500 ${size}px Inter, 'Segoe UI', sans-serif`;
    ctx2.textAlign = "left";
    ctx2.textBaseline = "middle";
    ctx2.fillStyle = color;
    ctx2.fillText(entity.text, screen.x + size * 0.4, screen.y);
    ctx2.restore();
  }

  private paintHatch(
    entity: HatchEntity,
    color: string,
    options: { selected?: boolean; hover?: boolean; preview?: boolean }
  ): void {
    const ctx = this.ctx;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(entity.boundary[0].x, entity.boundary[0].y);
    for (let i = 1; i < entity.boundary.length; i++) ctx.lineTo(entity.boundary[i].x, entity.boundary[i].y);
    ctx.closePath();

    if (entity.pattern === "solid") {
      ctx.fillStyle = options.preview
        ? hexToRgba(COLORS.preview, 0.25)
        : options.selected
          ? hexToRgba(COLORS.selection, 0.35)
          : hexToRgba(color, 0.94);
      ctx.fill();
      ctx.strokeStyle = options.preview ? COLORS.preview : options.selected ? COLORS.selection : color;
      ctx.lineWidth = 1 / this.transform.a;
      ctx.stroke();
      return;
    }

    ctx.save();
    ctx.clip();
    ctx.strokeStyle = options.preview ? COLORS.preview : options.selected ? COLORS.selection : color;
    ctx.lineWidth = (options.selected ? 1.2 : 0.9) / this.transform.a;
    ctx.globalAlpha = 0.6;
    const bounds = entityBounds(entity);
    const diagonals: Array<number> = [];
    if (entity.pattern === "cross" || entity.pattern === "grid") diagonals.push(0, Math.PI / 2);
    else diagonals.push(entity.angle);
    const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
    const radius = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    for (const angle of diagonals) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const nx = -sin;
      const ny = cos;
      for (let offset = -radius; offset <= radius; offset += entity.spacing) {
        ctx.beginPath();
        ctx.moveTo(center.x + nx * offset - cos * radius, center.y + ny * offset - sin * radius);
        ctx.lineTo(center.x + nx * offset + cos * radius, center.y + ny * offset + sin * radius);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private paintPaperEntity(entity: Entity): void {
    if (entity.kind === "text") {
      this.paintText(entity, entity.color ?? COLORS.sheetLine);
      return;
    }
    const ctx = this.ctx;
    const scale = this.transform.a;
    ctx.strokeStyle = entity.color ?? COLORS.sheetLine;
    ctx.fillStyle = entity.color ?? COLORS.sheetLine;
    ctx.lineWidth = Math.max(1, (entity.lineweight ?? 0.35) * 3) / scale;
    ctx.setLineDash([]);
    switch (entity.kind) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(entity.p1.x, entity.p1.y);
        ctx.lineTo(entity.p2.x, entity.p2.y);
        ctx.stroke();
        break;
      case "polyline":
        if (!entity.points.length) break;
        ctx.beginPath();
        ctx.moveTo(entity.points[0].x, entity.points[0].y);
        for (let i = 1; i < entity.points.length; i++) ctx.lineTo(entity.points[i].x, entity.points[i].y);
        if (entity.closed) ctx.closePath();
        ctx.stroke();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(entity.center.x, entity.center.y, entity.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      default:
        this.paintEntity(entity, {});
        break;
    }
  }

  /* -------------------------------------------------------------- grips */

  private paintGrips(): void {
    if (this.mode !== "model" || this.selection.size === 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    for (const id of this.selection) {
      const entity = this.doc.byId(id);
      if (!entity) continue;
      let grips = gripPoints(entity);
      if (grips.length > 24) grips = grips.slice(0, 24);
      for (const grip of grips) {
        const p = this.worldToScreen(grip);
        if (p.x < -20 || p.y < -20 || p.x > this.width + 20 || p.y > this.height + 20) continue;
        ctx.fillStyle = COLORS.gripFill;
        ctx.strokeStyle = COLORS.grip;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(p.x - 3.5, p.y - 3.5, 7, 7);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ------------------------------------------------------------ overlays */

  private renderOverlays(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (this.marquee) {
      const a = this.worldToScreen(this.marquee.start);
      const b = this.worldToScreen(this.marquee.end);
      const crossing = this.marquee.crossing;
      ctx.save();
      ctx.setLineDash(crossing ? [5, 4] : []);
      ctx.strokeStyle = crossing ? "#8ee65d" : COLORS.selection;
      ctx.fillStyle = crossing ? "rgba(142, 230, 93, 0.08)" : "rgba(74, 163, 255, 0.08)";
      ctx.lineWidth = 1;
      const x = Math.min(a.x, b.x);
      const y = Math.min(a.y, b.y);
      ctx.fillRect(x, y, Math.abs(b.x - a.x), Math.abs(b.y - a.y));
      ctx.strokeRect(x + 0.5, y + 0.5, Math.abs(b.x - a.x), Math.abs(b.y - a.y));
      ctx.restore();
    }

    if (this.cursorScreen) this.paintCrosshair(this.cursorScreen);
    if (this.mode === "model") {
      this.paintCompass();
      this.paintUcs();
    }
    if (this.activeSnap) this.paintSnapMarker(this.activeSnap);

    if (this.mode === "model" && this.settings.showDyn && this.draftFrom && this.cursorWorld) {
      this.paintDynamicInput(this.cursorScreen!, this.draftFrom, this.cursorWorld);
    }
  }

  private paintCrosshair(screen: Point): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = COLORS.crosshair;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(screen.y) + 0.5);
    ctx.lineTo(this.width, Math.floor(screen.y) + 0.5);
    ctx.moveTo(Math.floor(screen.x) + 0.5, 0);
    ctx.lineTo(Math.floor(screen.x) + 0.5, this.height);
    ctx.stroke();
    ctx.strokeStyle = "rgba(220, 235, 250, 0.8)";
    ctx.strokeRect(Math.round(screen.x) - 4.5, Math.round(screen.y) - 4.5, 9, 9);
    ctx.restore();
  }

  private paintSnapMarker(snap: SnapResult): void {
    const p = this.worldToScreen(snap.point);
    const ctx = this.ctx;
    const size = 6;
    ctx.save();
    ctx.strokeStyle = COLORS.snap;
    ctx.fillStyle = "rgba(20,26,20,0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    switch (snap.kind) {
      case "endpoint":
        ctx.rect(p.x - size, p.y - size, size * 2, size * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case "midpoint":
        ctx.moveTo(p.x, p.y - size);
        ctx.lineTo(p.x + size, p.y + size);
        ctx.lineTo(p.x - size, p.y + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case "center":
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case "quadrant":
        ctx.moveTo(p.x, p.y - size);
        ctx.lineTo(p.x + size, p.y);
        ctx.lineTo(p.x, p.y + size);
        ctx.lineTo(p.x - size, p.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case "intersection":
        ctx.moveTo(p.x - size, p.y - size);
        ctx.lineTo(p.x + size, p.y + size);
        ctx.moveTo(p.x + size, p.y - size);
        ctx.lineTo(p.x - size, p.y + size);
        ctx.stroke();
        break;
      default:
        ctx.rect(p.x - size * 0.8, p.y - size * 0.8, size * 1.6, size * 1.6);
        ctx.stroke();
        break;
    }
    ctx.font = "500 10px Inter, 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    const label = snap.label;
    const metrics = ctx.measureText(label);
    ctx.fillStyle = COLORS.overlayBg;
    ctx.fillRect(p.x + 12, p.y - 20, metrics.width + 8, 15);
    ctx.fillStyle = COLORS.snapText;
    ctx.fillText(label, p.x + 16, p.y - 7);
    ctx.restore();
  }

  private paintDynamicInput(screen: Point, from: Point, to: Point): void {
    const ctx = this.ctx;
    const d = distance(from, to);
    const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
    const angleText = ((angle % 360) + 360) % 360;
    const line1 = `${d.toFixed(d < 100 ? 1 : 0)} mm`;
    const line2 = `${angleText.toFixed(1)}°`;
    ctx.save();
    ctx.font = "500 11px Inter, 'Segoe UI', sans-serif";
    const width = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width) + 14;
    const x = screen.x + 18;
    const y = screen.y + 16;
    ctx.fillStyle = "rgba(19, 23, 29, 0.92)";
    ctx.strokeStyle = "rgba(140, 170, 200, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, width, 38);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#dbe6f2";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(line1, x + 7, y + 11);
    ctx.fillStyle = "#8fa8c2";
    ctx.fillText(line2, x + 7, y + 27);
    ctx.restore();
  }

  private paintCompass(): void {
    const ctx = this.ctx;
    const cx = this.width - 96;
    const cy = this.height - 96;
    const radius = 52;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = COLORS.compass;
    ctx.fillStyle = "rgba(22, 27, 34, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - 12, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120, 140, 168, 0.35)";
    ctx.stroke();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const inner = radius - (i % 4 === 0 ? 10 : 6);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.strokeStyle = i % 4 === 0 ? "rgba(160, 180, 205, 0.8)" : "rgba(120, 140, 168, 0.4)";
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(201, 214, 230, 0.9)";
    ctx.font = "600 11px Inter, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", 0, -radius + 4);
    ctx.fillText("S", 0, radius - 4);
    ctx.fillText("E", radius - 4, 0);
    ctx.fillText("W", -radius + 4, 0);
    ctx.fillStyle = "#2d3744";
    ctx.strokeStyle = "rgba(150, 170, 195, 0.7)";
    ctx.beginPath();
    ctx.roundRect(-20, -13, 40, 26, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#c7d4e3";
    ctx.font = "600 10px Inter, 'Segoe UI', sans-serif";
    ctx.fillText("TOP", 0, 1);
    ctx.restore();
  }

  private paintUcs(): void {
    const ctx = this.ctx;
    const x = 54;
    const y = this.height - 48;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(150, 175, 200, 0.55)";
    ctx.fillStyle = "rgba(150, 175, 200, 0.7)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(42, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(46, 0);
    ctx.lineTo(39, -3.5);
    ctx.lineTo(39, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -46);
    ctx.lineTo(3.5, -39);
    ctx.lineTo(-3.5, -39);
    ctx.closePath();
    ctx.fill();
    ctx.font = "500 10px Inter, 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("X", 50, 3);
    ctx.fillText("Y", -3, -50);
    ctx.restore();
  }

  /* --------------------------------------------------------- hit helpers */

  hitTolerance(): number {
    return 7 / this.view.scale;
  }

  entityBoundsOf(entity: Entity): Bounds {
    return entity.kind === "insert" ? insertBounds(entity, this.doc.blocks) : entityBounds(entity);
  }
}
