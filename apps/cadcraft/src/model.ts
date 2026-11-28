/**
 * CADCraft drawing model.
 *
 * Everything is expressed in millimetres with the Y axis pointing up, the way a
 * CAD drawing is usually authored. Screen-space conversion lives in renderer.ts.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export type LineType = "continuous" | "dashed" | "hidden" | "center" | "dashdot";

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  frozen: boolean;
  locked: boolean;
  lineweight: number;
  linetype: LineType;
  plot: boolean;
}

interface EntityBase {
  id: string;
  layer: string;
  color?: string;
  linetype?: LineType;
  lineweight?: number;
}

export interface LineEntity extends EntityBase {
  kind: "line";
  p1: Point;
  p2: Point;
}

export interface PolylineEntity extends EntityBase {
  kind: "polyline";
  points: Point[];
  closed: boolean;
}

export interface CircleEntity extends EntityBase {
  kind: "circle";
  center: Point;
  radius: number;
}

export interface ArcEntity extends EntityBase {
  kind: "arc";
  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
}

export interface EllipseEntity extends EntityBase {
  kind: "ellipse";
  center: Point;
  rx: number;
  ry: number;
  rotation: number;
}

export interface TextEntity extends EntityBase {
  kind: "text";
  p: Point;
  text: string;
  height: number;
  rotation: number;
  align: "left" | "center" | "right";
  /** Optional opaque plate drawn behind the text, used by dimensions. */
  plate?: string;
}

export interface DimEntity extends EntityBase {
  kind: "dim";
  dimType: "linear" | "aligned" | "radial";
  p1: Point;
  p2: Point;
  /** Position of the dimension line (unused for radial dimensions). */
  pos: Point;
  textOverride?: string;
}

export interface LeaderEntity extends EntityBase {
  kind: "leader";
  points: Point[];
  text: string;
  textHeight: number;
}

export interface HatchEntity extends EntityBase {
  kind: "hatch";
  boundary: Point[];
  pattern: "solid" | "ansi31" | "cross" | "grid";
  spacing: number;
  angle: number;
}

export interface InsertEntity extends EntityBase {
  kind: "insert";
  block: string;
  p: Point;
  scale: number;
  rotation: number;
}

export interface PointEntity extends EntityBase {
  kind: "point";
  p: Point;
}

export type Entity =
  | LineEntity
  | PolylineEntity
  | CircleEntity
  | ArcEntity
  | EllipseEntity
  | TextEntity
  | DimEntity
  | LeaderEntity
  | HatchEntity
  | InsertEntity
  | PointEntity;

export type EntityKind = Entity["kind"];

export interface Block {
  name: string;
  description: string;
  /** Geometry in block-local millimetres, anchored at (0, 0). */
  entities: Entity[];
}

export interface Viewport {
  id: string;
  rect: Bounds;
  center: Point;
  /** Paper millimetres per drawing millimetre, so 0.01 is a 1:100 viewport. */
  scale: number;
  label: string;
}

export interface Layout {
  id: string;
  name: string;
  paper: { width: number; height: number };
  /** Sheet border, title block and sheet notes in paper millimetres. */
  paperEntities: Entity[];
  viewports: Viewport[];
}

export interface DocSnapshot {
  layers: Layer[];
  entities: Entity[];
}

export const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ points */

export function pt(x: number, y: number): Point {
  return { x, y };
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scalePt(a: Point, s: number): Point {
  return { x: a.x * s, y: a.y * s };
}

export function length(a: Point): number {
  return Math.hypot(a.x, a.y);
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function angleOf(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

export function polar(origin: Point, angle: number, radius: number): Point {
  return { x: origin.x + Math.cos(angle) * radius, y: origin.y + Math.sin(angle) * radius };
}

export function rotatePoint(p: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos };
}

export function normalizeAngle(angle: number): number {
  let a = angle % TAU;
  if (a < 0) a += TAU;
  return a;
}

export function angleBetween(start: number, end: number): number {
  return normalizeAngle(end - start);
}

/* ------------------------------------------------------------------ bounds */

export function emptyBounds(): Bounds {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

export function boundsFromPoints(points: Point[]): Bounds {
  const b = emptyBounds();
  for (const p of points) {
    b.minX = Math.min(b.minX, p.x);
    b.minY = Math.min(b.minY, p.y);
    b.maxX = Math.max(b.maxX, p.x);
    b.maxY = Math.max(b.maxY, p.y);
  }
  return b;
}

export function mergeBounds(a: Bounds, b: Bounds): Bounds {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export function boundsCenter(b: Bounds): Point {
  return { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
}

export function expandBounds(b: Bounds, margin: number): Bounds {
  return { minX: b.minX - margin, minY: b.minY - margin, maxX: b.maxX + margin, maxY: b.maxY + margin };
}

export function boundsContains(b: Bounds, p: Point): boolean {
  return p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY;
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

export function boundsContainsBounds(outer: Bounds, inner: Bounds): boolean {
  return (
    inner.minX >= outer.minX &&
    inner.maxX <= outer.maxX &&
    inner.minY >= outer.minY &&
    inner.maxY <= outer.maxY
  );
}

/* -------------------------------------------------------------- primitives */

export function pointSegmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return distance(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function segmentIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-9) return null;
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
  if (t < -1e-6 || t > 1 + 1e-6 || u < -1e-6 || u > 1 + 1e-6) return null;
  return { x: a1.x + t * d1x, y: a1.y + t * d1y };
}

export function polygonContains(polygon: Point[], p: Point): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

export function distanceToRect(b: Bounds, p: Point): number {
  const dx = Math.max(b.minX - p.x, 0, p.x - b.maxX);
  const dy = Math.max(b.minY - p.y, 0, p.y - b.maxY);
  return Math.hypot(dx, dy);
}

export function arcPoint(center: Point, radius: number, angle: number): Point {
  return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
}

export function arcContainsAngle(arc: ArcEntity, angle: number): boolean {
  const start = normalizeAngle(arc.startAngle);
  const sweep = angleBetween(start, arc.endAngle);
  return angleBetween(start, angle) <= sweep + 1e-9;
}

/* ---------------------------------------------------------------- entities */

let entitySeed = 0;

export function newEntityId(prefix = "e"): string {
  entitySeed += 1;
  return `${prefix}${entitySeed.toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
}

export function line(layer: string, p1: Point, p2: Point, extra: Partial<LineEntity> = {}): LineEntity {
  return { id: newEntityId("ln"), kind: "line", layer, p1, p2, ...extra };
}

export function polyline(
  layer: string,
  points: Point[],
  closed = false,
  extra: Partial<PolylineEntity> = {}
): PolylineEntity {
  return { id: newEntityId("pl"), kind: "polyline", layer, points, closed, ...extra };
}

export function circle(layer: string, center: Point, radius: number, extra: Partial<CircleEntity> = {}): CircleEntity {
  return { id: newEntityId("ci"), kind: "circle", layer, center, radius, ...extra };
}

export function arc(
  layer: string,
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
  extra: Partial<ArcEntity> = {}
): ArcEntity {
  return { id: newEntityId("ar"), kind: "arc", layer, center, radius, startAngle, endAngle, ...extra };
}

export function ellipse(
  layer: string,
  center: Point,
  rx: number,
  ry: number,
  rotation = 0,
  extra: Partial<EllipseEntity> = {}
): EllipseEntity {
  return { id: newEntityId("el"), kind: "ellipse", layer, center, rx, ry, rotation, ...extra };
}

export function text(
  layer: string,
  p: Point,
  content: string,
  height: number,
  extra: Partial<TextEntity> = {}
): TextEntity {
  return { id: newEntityId("tx"), kind: "text", layer, p, text: content, height, rotation: 0, align: "left", ...extra };
}

export function dimension(
  layer: string,
  dimType: DimEntity["dimType"],
  p1: Point,
  p2: Point,
  pos: Point,
  textOverride?: string
): DimEntity {
  return { id: newEntityId("dm"), kind: "dim", layer, dimType, p1, p2, pos, textOverride };
}

export function hatch(
  layer: string,
  boundary: Point[],
  pattern: HatchEntity["pattern"] = "solid",
  spacing = 150,
  angle = Math.PI / 4,
  extra: Partial<HatchEntity> = {}
): HatchEntity {
  return { id: newEntityId("ha"), kind: "hatch", layer, boundary, pattern, spacing, angle, ...extra };
}

export function leader(
  layer: string,
  points: Point[],
  content: string,
  textHeight = 200,
  extra: Partial<LeaderEntity> = {}
): LeaderEntity {
  return { id: newEntityId("ld"), kind: "leader", layer, points, text: content, textHeight, ...extra };
}

export function insertBlock(
  layer: string,
  block: string,
  p: Point,
  scale = 1,
  rotation = 0,
  extra: Partial<InsertEntity> = {}
): InsertEntity {
  return { id: newEntityId("in"), kind: "insert", layer, block, p, scale, rotation, ...extra };
}

export function pointEntity(layer: string, p: Point): PointEntity {
  return { id: newEntityId("pt"), kind: "point", layer, p };
}

export function entityBounds(entity: Entity): Bounds {
  switch (entity.kind) {
    case "line":
      return boundsFromPoints([entity.p1, entity.p2]);
    case "polyline":
      return boundsFromPoints(entity.points);
    case "circle": {
      const { x, y } = entity.center;
      return { minX: x - entity.radius, minY: y - entity.radius, maxX: x + entity.radius, maxY: y + entity.radius };
    }
    case "arc": {
      const points = [arcPoint(entity.center, entity.radius, entity.startAngle), arcPoint(entity.center, entity.radius, entity.endAngle)];
      for (const angle of [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2]) {
        if (arcContainsAngle(entity, angle)) points.push(arcPoint(entity.center, entity.radius, angle));
      }
      return boundsFromPoints(points);
    }
    case "ellipse": {
      const rx = Math.abs(entity.rx);
      const ry = Math.abs(entity.ry);
      const cos = Math.cos(entity.rotation);
      const sin = Math.sin(entity.rotation);
      const x = Math.sqrt(rx * rx * cos * cos + ry * ry * sin * sin);
      const y = Math.sqrt(rx * rx * sin * sin + ry * ry * cos * cos);
      return { minX: entity.center.x - x, minY: entity.center.y - y, maxX: entity.center.x + x, maxY: entity.center.y + y };
    }
    case "text": {
      const h = entity.height;
      const w = entity.text.length * h * 0.62;
      const left = entity.align === "center" ? -w / 2 : entity.align === "right" ? -w : 0;
      const cos = Math.cos(entity.rotation);
      const sin = Math.sin(entity.rotation);
      const corners = [
        { x: left, y: -h * 0.24 },
        { x: left + w, y: -h * 0.24 },
        { x: left + w, y: h * 1.02 },
        { x: left, y: h * 1.02 },
      ].map(c => ({
        x: entity.p.x + c.x * cos - c.y * sin,
        y: entity.p.y + c.x * sin + c.y * cos,
      }));
      return boundsFromPoints(corners);
    }
    case "dim": {
      if (entity.dimType === "radial") {
        return boundsFromPoints([entity.p1, entity.p2, entity.pos]);
      }
      const b = boundsFromPoints([entity.p1, entity.p2, entity.pos]);
      return expandBounds(b, Math.min(300, Math.max(50, (b.maxX - b.minX + b.maxY - b.minY) * 0.12)));
    }
    case "leader":
      return expandBounds(boundsFromPoints([...entity.points, { x: entity.points[0].x + 1, y: entity.points[0].y }]), 10);
    case "hatch":
      return boundsFromPoints(entity.boundary);
    case "insert":
      return boundsFromPoints([entity.p]);
    case "point":
      return boundsFromPoints([entity.p]);
  }
}

export function distanceToEntity(entity: Entity, p: Point): number {
  switch (entity.kind) {
    case "line":
      return pointSegmentDistance(p, entity.p1, entity.p2);
    case "polyline": {
      let best = Infinity;
      for (let i = 0; i < entity.points.length - 1; i++) {
        best = Math.min(best, pointSegmentDistance(p, entity.points[i], entity.points[i + 1]));
      }
      if (entity.closed && entity.points.length > 2) {
        best = Math.min(best, pointSegmentDistance(p, entity.points[entity.points.length - 1], entity.points[0]));
      }
      if (entity.points.length === 1) best = distance(p, entity.points[0]);
      return best;
    }
    case "circle":
      return Math.abs(distance(p, entity.center) - entity.radius);
    case "arc": {
      const angle = Math.atan2(p.y - entity.center.y, p.x - entity.center.x);
      if (arcContainsAngle(entity, angle)) return Math.abs(distance(p, entity.center) - entity.radius);
      return Math.min(distance(p, arcPoint(entity.center, entity.radius, entity.startAngle)), distance(p, arcPoint(entity.center, entity.radius, entity.endAngle)));
    }
    case "ellipse": {
      const local = rotatePoint(sub(p, entity.center), -entity.rotation);
      const k = Math.hypot(local.x / Math.max(entity.rx, 1e-6), local.y / Math.max(entity.ry, 1e-6));
      return Math.abs(k - 1) * Math.min(entity.rx, entity.ry);
    }
    case "text":
      return distanceToRect(entityBounds(entity), p);
    case "dim": {
      const b = entityBounds(entity);
      return distanceToRect(b, p);
    }
    case "leader": {
      let best = Math.hypot(p.x - entity.points[0].x, p.y - (entity.points[0].y + entity.textHeight * 0.5));
      for (let i = 0; i < entity.points.length - 1; i++) {
        best = Math.min(best, pointSegmentDistance(p, entity.points[i], entity.points[i + 1]));
      }
      return best;
    }
    case "hatch": {
      if (polygonContains(entity.boundary, p)) return 0;
      let best = Infinity;
      for (let i = 0, j = entity.boundary.length - 1; i < entity.boundary.length; j = i++) {
        best = Math.min(best, pointSegmentDistance(p, entity.boundary[j], entity.boundary[i]));
      }
      return best;
    }
    case "insert":
      return distance(p, entity.p);
    case "point":
      return distance(p, entity.p);
  }
}

/* ----------------------------------------------------------------- blocks */

export function transformEntity(entity: Entity, origin: Point, scale: number, rotation: number): Entity {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const map = (p: Point): Point => ({
    x: origin.x + (p.x * cos - p.y * sin) * scale,
    y: origin.y + (p.x * sin + p.y * cos) * scale,
  });
  switch (entity.kind) {
    case "line":
      return { ...entity, p1: map(entity.p1), p2: map(entity.p2) };
    case "polyline":
      return { ...entity, points: entity.points.map(map) };
    case "circle":
      return { ...entity, center: map(entity.center), radius: entity.radius * scale };
    case "arc":
      return {
        ...entity,
        center: map(entity.center),
        radius: entity.radius * scale,
        startAngle: entity.startAngle + rotation,
        endAngle: entity.endAngle + rotation,
      };
    case "ellipse":
      return { ...entity, center: map(entity.center), rx: entity.rx * scale, ry: entity.ry * scale, rotation: entity.rotation + rotation };
    case "text":
      return { ...entity, p: map(entity.p), height: entity.height * scale, rotation: entity.rotation + rotation };
    case "hatch":
      return { ...entity, boundary: entity.boundary.map(map), spacing: entity.spacing * scale, angle: entity.angle + rotation };
    case "point":
      return { ...entity, p: map(entity.p) };
    case "leader":
      return { ...entity, points: entity.points.map(map), textHeight: entity.textHeight * scale, text: entity.text };
    case "dim":
      return { ...entity, p1: map(entity.p1), p2: map(entity.p2), pos: map(entity.pos) };
    case "insert":
      return {
        ...entity,
        p: map(entity.p),
        scale: entity.scale * scale,
        rotation: entity.rotation + rotation,
      };
  }
}

/** Expands block inserts into drawable primitives, resolving layer `0` to the insert layer. */
export function flattenEntity(entity: Entity, blocks: Record<string, Block>, depth = 0): Entity[] {
  if (entity.kind !== "insert" || depth > 4) return [entity];
  const block = blocks[entity.block];
  if (!block) return [entity];
  const result: Entity[] = [];
  for (const child of block.entities) {
    const transformed = transformEntity(child, entity.p, entity.scale, entity.rotation);
    if (child.layer === "0" || child.layer === "") transformed.layer = entity.layer;
    result.push(...flattenEntity(transformed, blocks, depth + 1));
  }
  return result;
}

export function insertBounds(entity: InsertEntity, blocks: Record<string, Block>): Bounds {
  const primitives = flattenEntity(entity, blocks);
  if (primitives.length === 0) return boundsFromPoints([entity.p]);
  let b = emptyBounds();
  for (const primitive of primitives) b = mergeBounds(b, entityBounds(primitive));
  return b;
}

/* ---------------------------------------------------------------- drawing */

export class DrawingDoc {
  name: string;
  layers: Layer[];
  entities: Entity[];
  blocks: Record<string, Block>;
  layouts: Layout[];

  constructor(name = "apartment.dxf") {
    this.name = name;
    this.layers = [];
    this.entities = [];
    this.blocks = {};
    this.layouts = [];
  }

  layer(id: string): Layer | undefined {
    return this.layers.find(layer => layer.id === id);
  }

  layerByName(name: string): Layer | undefined {
    return this.layers.find(layer => layer.name === name);
  }

  layerColor(id: string): string {
    return this.layer(id)?.color ?? "#d8dee9";
  }

  isLayerVisible(id: string): boolean {
    const layer = this.layer(id);
    return Boolean(layer && layer.visible && !layer.frozen && layer.plot);
  }

  visibleEntities(): Entity[] {
    const visible = new Set(this.layers.filter(l => l.visible && !l.frozen).map(l => l.id));
    return this.entities.filter(entity => visible.has(entity.layer));
  }

  entityColor(entity: Entity): string {
    return entity.color ?? this.layerColor(entity.layer);
  }

  add(entity: Entity): Entity {
    this.entities.push(entity);
    return entity;
  }

  addAll(entities: Entity[]): void {
    this.entities.push(...entities);
  }

  removeIds(ids: Iterable<string>): number {
    const set = new Set(ids);
    const before = this.entities.length;
    this.entities = this.entities.filter(entity => !set.has(entity.id));
    return before - this.entities.length;
  }

  byId(id: string): Entity | undefined {
    return this.entities.find(entity => entity.id === id);
  }

  bounds(): Bounds {
    let b = emptyBounds();
    for (const entity of this.entities) {
      if (entity.kind === "insert") b = mergeBounds(b, insertBounds(entity, this.blocks));
      else b = mergeBounds(b, entityBounds(entity));
    }
    if (!Number.isFinite(b.minX)) return { minX: 0, minY: 0, maxX: 12000, maxY: 8000 };
    return b;
  }

  snapshot(): DocSnapshot {
    return {
      layers: this.layers.map(layer => ({ ...layer })),
      entities: this.entities.map(entity => ({ ...entity })),
    };
  }

  restore(snapshot: DocSnapshot): void {
    this.layers = snapshot.layers.map(layer => ({ ...layer }));
    this.entities = snapshot.entities.map(entity => ({ ...entity }));
  }

  clone(): DrawingDoc {
    const doc = new DrawingDoc(this.name);
    doc.layers = this.layers.map(layer => ({ ...layer }));
    doc.entities = this.entities.map(entity => ({ ...entity }));
    doc.blocks = this.blocks;
    doc.layouts = this.layouts;
    return doc;
  }
}

export function defaultLayers(): Layer[] {
  return [
    { id: "0", name: "0", color: "#e4e9f0", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "wall", name: "A-WALL", color: "#cfd5dd", visible: true, frozen: false, locked: false, lineweight: 0.35, linetype: "continuous", plot: true },
    { id: "door", name: "A-DOOR", color: "#8fd460", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "glaz", name: "A-GLAZ", color: "#59c8e8", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "furn", name: "A-FURN", color: "#9aa7b6", visible: true, frozen: false, locked: false, lineweight: 0.18, linetype: "continuous", plot: true },
    { id: "text", name: "A-ANNO-TEXT", color: "#ffd24d", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "dim", name: "A-DIM", color: "#4fd6e6", visible: true, frozen: false, locked: false, lineweight: 0.18, linetype: "continuous", plot: true },
    { id: "hatch", name: "A-HATCH", color: "#79828e", visible: true, frozen: false, locked: false, lineweight: 0.13, linetype: "continuous", plot: true },
    { id: "sheet", name: "S-SHEET", color: "#20242b", visible: true, frozen: false, locked: false, lineweight: 0.35, linetype: "continuous", plot: true },
  ];
}

/* -------------------------------------------------------------- transforms */

/** Returns a copy of the entity translated by `delta` millimetres. */
export function translateEntity(entity: Entity, delta: Point): Entity {
  const move = (p: Point): Point => ({ x: p.x + delta.x, y: p.y + delta.y });
  switch (entity.kind) {
    case "line":
      return { ...entity, p1: move(entity.p1), p2: move(entity.p2) };
    case "polyline":
      return { ...entity, points: entity.points.map(move) };
    case "circle":
    case "arc":
      return { ...entity, center: move(entity.center) };
    case "ellipse":
      return { ...entity, center: move(entity.center) };
    case "text":
      return { ...entity, p: move(entity.p) };
    case "dim":
      return { ...entity, p1: move(entity.p1), p2: move(entity.p2), pos: move(entity.pos) };
    case "leader":
      return { ...entity, points: entity.points.map(move) };
    case "hatch":
      return { ...entity, boundary: entity.boundary.map(move) };
    case "insert":
      return { ...entity, p: move(entity.p) };
    case "point":
      return { ...entity, p: move(entity.p) };
  }
}

export function rotateEntity(entity: Entity, center: Point, angle: number): Entity {
  const pivot = (p: Point): Point => {
    const local = rotatePoint({ x: p.x - center.x, y: p.y - center.y }, angle);
    return { x: center.x + local.x, y: center.y + local.y };
  };
  switch (entity.kind) {
    case "line":
      return { ...entity, p1: pivot(entity.p1), p2: pivot(entity.p2) };
    case "polyline":
      return { ...entity, points: entity.points.map(pivot) };
    case "circle":
      return { ...entity, center: pivot(entity.center) };
    case "arc":
      return { ...entity, center: pivot(entity.center), startAngle: entity.startAngle + angle, endAngle: entity.endAngle + angle };
    case "ellipse":
      return { ...entity, center: pivot(entity.center), rotation: entity.rotation + angle };
    case "text":
      return { ...entity, p: pivot(entity.p), rotation: entity.rotation + angle };
    case "dim":
      return { ...entity, p1: pivot(entity.p1), p2: pivot(entity.p2), pos: pivot(entity.pos) };
    case "leader":
      return { ...entity, points: entity.points.map(pivot) };
    case "hatch":
      return { ...entity, boundary: entity.boundary.map(pivot), angle: entity.angle + angle };
    case "insert":
      return { ...entity, p: pivot(entity.p), rotation: entity.rotation + angle };
    case "point":
      return { ...entity, p: pivot(entity.p) };
  }
}

export function scaleEntity(entity: Entity, center: Point, factor: number): Entity {
  const shrink = (p: Point): Point => ({
    x: center.x + (p.x - center.x) * factor,
    y: center.y + (p.y - center.y) * factor,
  });
  switch (entity.kind) {
    case "line":
      return { ...entity, p1: shrink(entity.p1), p2: shrink(entity.p2) };
    case "polyline":
      return { ...entity, points: entity.points.map(shrink) };
    case "circle":
      return { ...entity, center: shrink(entity.center), radius: entity.radius * Math.abs(factor) };
    case "arc":
      return { ...entity, center: shrink(entity.center), radius: entity.radius * Math.abs(factor) };
    case "ellipse":
      return { ...entity, center: shrink(entity.center), rx: entity.rx * Math.abs(factor), ry: entity.ry * Math.abs(factor) };
    case "text":
      return { ...entity, p: shrink(entity.p), height: entity.height * Math.abs(factor) };
    case "dim":
      return { ...entity, p1: shrink(entity.p1), p2: shrink(entity.p2), pos: shrink(entity.pos) };
    case "leader":
      return { ...entity, points: entity.points.map(shrink), textHeight: entity.textHeight * Math.abs(factor) };
    case "hatch":
      return { ...entity, boundary: entity.boundary.map(shrink), spacing: entity.spacing * Math.abs(factor) };
    case "insert":
      return { ...entity, p: shrink(entity.p), scale: entity.scale * Math.abs(factor) };
    case "point":
      return { ...entity, p: shrink(entity.p) };
  }
}

export function mirrorEntity(entity: Entity, a: Point, b: Point): Entity {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const theta = Math.atan2(dy, dx);
  const reflect = (p: Point): Point => {
    const vx = p.x - a.x;
    const vy = p.y - a.y;
    const projection = vx * nx + vy * ny;
    return { x: a.x + nx * projection * 2 - vx, y: a.y + ny * projection * 2 - vy };
  };
  switch (entity.kind) {
    case "line":
      return { ...entity, p1: reflect(entity.p1), p2: reflect(entity.p2) };
    case "polyline":
      return { ...entity, points: entity.points.map(reflect) };
    case "circle":
      return { ...entity, center: reflect(entity.center) };
    case "arc":
      return {
        ...entity,
        center: reflect(entity.center),
        startAngle: theta * 2 - entity.endAngle,
        endAngle: theta * 2 - entity.startAngle,
      };
    case "ellipse":
      return { ...entity, center: reflect(entity.center), rotation: theta * 2 - entity.rotation };
    case "text":
      return { ...entity, p: reflect(entity.p), rotation: theta * 2 - entity.rotation };
    case "dim":
      return { ...entity, p1: reflect(entity.p1), p2: reflect(entity.p2), pos: reflect(entity.pos) };
    case "leader":
      return { ...entity, points: entity.points.map(reflect) };
    case "hatch":
      return { ...entity, boundary: entity.boundary.map(reflect), angle: theta * 2 - entity.angle };
    case "insert":
      return { ...entity, p: reflect(entity.p), rotation: theta * 2 - entity.rotation };
    case "point":
      return { ...entity, p: reflect(entity.p) };
  }
}

/** Clones an entity with a fresh id (deep enough for the drawing model). */
export function cloneEntity(entity: Entity): Entity {
  const copy = JSON.parse(JSON.stringify(entity)) as Entity;
  copy.id = newEntityId("cp");
  return copy;
}
