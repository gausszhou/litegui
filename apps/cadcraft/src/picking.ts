/**
 * Entity picking, object snap and window selection for CADCraft.
 * Everything works in drawing millimetres; the caller converts pixel tolerance.
 */

import {
  arcContainsAngle,
  arcPoint,
  boundsCenter,
  boundsContainsBounds,
  boundsIntersect,
  distance,
  distanceToEntity,
  entityBounds,
  flattenEntity,
  insertBounds,
  midpoint,
  normalizeAngle,
  pointSegmentDistance,
  polygonContains,
  segmentIntersection,
  type Bounds,
  type DimEntity,
  type DrawingDoc,
  type Entity,
  type Point,
} from "./model";

export type SnapKind = "endpoint" | "midpoint" | "center" | "quadrant" | "intersection" | "nearest" | "node";

export interface SnapResult {
  point: Point;
  kind: SnapKind;
  label: string;
}

const SNAP_LABELS: Record<SnapKind, string> = {
  endpoint: "Endpoint",
  midpoint: "Midpoint",
  center: "Center",
  quadrant: "Quadrant",
  intersection: "Intersection",
  nearest: "Nearest",
  node: "Node",
};

export function snapLabel(kind: SnapKind): string {
  return SNAP_LABELS[kind];
}

export function dimMeasurement(dim: DimEntity): number {
  if (dim.dimType === "radial") return distance(dim.p1, dim.p2);
  if (dim.dimType === "aligned") return distance(dim.p1, dim.p2);
  const dx = Math.abs(dim.p2.x - dim.p1.x);
  const dy = Math.abs(dim.p2.y - dim.p1.y);
  return dx >= dy ? dx : dy;
}

export function formattedMeasurement(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** A flattened "real" primitive plus the top-level entity it belongs to. */
interface Primitive {
  entity: Entity;
  owner: Entity;
}

function primitives(doc: DrawingDoc): Primitive[] {
  const visible = new Set(doc.layers.filter(layer => layer.visible && !layer.frozen).map(layer => layer.id));
  const list: Primitive[] = [];
  for (const entity of doc.entities) {
    if (!visible.has(entity.layer)) continue;
    if (entity.kind === "insert") {
      for (const flat of flattenEntity(entity, doc.blocks)) {
        if (visible.has(flat.layer)) list.push({ entity: flat, owner: entity });
      }
    } else {
      list.push({ entity, owner: entity });
    }
  }
  return list;
}

export function pickEntity(doc: DrawingDoc, p: Point, tolerance: number): Entity | null {
  const list = primitives(doc);
  let best: Primitive | null = null;
  let bestDistance = tolerance;
  for (const primitive of list) {
    const d = distanceToEntity(primitive.entity, p);
    if (d <= bestDistance) {
      bestDistance = d;
      best = primitive;
    }
  }
  return best?.owner ?? null;
}

export function pickAll(doc: DrawingDoc, bounds: Bounds, crossing: boolean): Entity[] {
  const visible = new Set(doc.layers.filter(layer => layer.visible && !layer.frozen).map(layer => layer.id));
  const result: Entity[] = [];
  for (const entity of doc.entities) {
    if (!visible.has(entity.layer)) continue;
    const eb = entity.kind === "insert" ? insertBounds(entity, doc.blocks) : entityBounds(entity);
    if (crossing ? boundsIntersect(eb, bounds) : boundsContainsBounds(bounds, eb)) result.push(entity);
  }
  return result;
}

export function entityAtBounds(doc: DrawingDoc, entity: Entity): Bounds {
  return entity.kind === "insert" ? insertBounds(entity, doc.blocks) : entityBounds(entity);
}

/* ------------------------------------------------------------------- snaps */

interface Candidate {
  point: Point;
  kind: SnapKind;
  distance: number;
}

function addCandidate(list: Candidate[], point: Point, kind: SnapKind, cursor: Point): void {
  list.push({ point, kind, distance: distance(point, cursor) });
}

interface Segment {
  a: Point;
  b: Point;
}

function collectSegments(doc: DrawingDoc): Segment[] {
  const segments: Segment[] = [];
  for (const primitive of primitives(doc)) {
    const entity = primitive.entity;
    if (entity.kind === "line") segments.push({ a: entity.p1, b: entity.p2 });
    else if (entity.kind === "polyline") {
      for (let i = 0; i < entity.points.length - 1; i++) segments.push({ a: entity.points[i], b: entity.points[i + 1] });
      if (entity.closed && entity.points.length > 2) {
        segments.push({ a: entity.points[entity.points.length - 1], b: entity.points[0] });
      }
    } else if (entity.kind === "hatch") {
      for (let i = 0, j = entity.boundary.length - 1; i < entity.boundary.length; j = i++) {
        segments.push({ a: entity.boundary[j], b: entity.boundary[i] });
      }
    }
  }
  return segments;
}

export interface SnapOptions {
  endpoint?: boolean;
  midpoint?: boolean;
  center?: boolean;
  quadrant?: boolean;
  intersection?: boolean;
  nearest?: boolean;
}

export function findSnap(doc: DrawingDoc, cursor: Point, tolerance: number, options: SnapOptions = {}): SnapResult | null {
  const candidates: Candidate[] = [];
  const list = primitives(doc);

  for (const primitive of list) {
    const entity = primitive.entity;
    switch (entity.kind) {
      case "line": {
        if (options.endpoint) {
          addCandidate(candidates, entity.p1, "endpoint", cursor);
          addCandidate(candidates, entity.p2, "endpoint", cursor);
        }
        if (options.midpoint) addCandidate(candidates, midpoint(entity.p1, entity.p2), "midpoint", cursor);
        break;
      }
      case "polyline": {
        if (options.endpoint) for (const p of entity.points) addCandidate(candidates, p, "endpoint", cursor);
        if (options.midpoint) {
          for (let i = 0; i < entity.points.length - 1; i++) {
            addCandidate(candidates, midpoint(entity.points[i], entity.points[i + 1]), "midpoint", cursor);
          }
        }
        break;
      }
      case "circle": {
        if (options.center) addCandidate(candidates, entity.center, "center", cursor);
        if (options.quadrant) {
          for (const angle of [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2]) {
            addCandidate(candidates, arcPoint(entity.center, entity.radius, angle), "quadrant", cursor);
          }
        }
        break;
      }
      case "arc": {
        if (options.center) addCandidate(candidates, entity.center, "center", cursor);
        if (options.endpoint) {
          addCandidate(candidates, arcPoint(entity.center, entity.radius, entity.startAngle), "endpoint", cursor);
          addCandidate(candidates, arcPoint(entity.center, entity.radius, entity.endAngle), "endpoint", cursor);
        }
        if (options.midpoint) {
          const start = normalizeAngle(entity.startAngle);
          const sweep =
            normalizeAngle(entity.endAngle - entity.startAngle) || Math.PI * 2;
          addCandidate(candidates, arcPoint(entity.center, entity.radius, start + sweep / 2), "midpoint", cursor);
        }
        break;
      }
      case "ellipse": {
        if (options.center) addCandidate(candidates, entity.center, "center", cursor);
        if (options.quadrant) {
          const cos = Math.cos(entity.rotation);
          const sin = Math.sin(entity.rotation);
          for (const [x, y] of [
            [entity.rx, 0],
            [-entity.rx, 0],
            [0, entity.ry],
            [0, -entity.ry],
          ]) {
            addCandidate(candidates, { x: entity.center.x + x * cos - y * sin, y: entity.center.y + x * sin + y * cos }, "quadrant", cursor);
          }
        }
        break;
      }
      case "text":
      case "insert":
      case "point": {
        if (options.endpoint) addCandidate(candidates, entity.p, entity.kind === "point" ? "node" : "endpoint", cursor);
        break;
      }
      case "leader": {
        if (options.endpoint) for (const p of entity.points) addCandidate(candidates, p, "endpoint", cursor);
        break;
      }
      case "dim": {
        if (options.endpoint) {
          addCandidate(candidates, entity.p1, "endpoint", cursor);
          addCandidate(candidates, entity.p2, "endpoint", cursor);
        }
        break;
      }
      case "hatch": {
        if (options.endpoint) for (const p of entity.boundary) addCandidate(candidates, p, "endpoint", cursor);
        break;
      }
    }

    if (options.nearest) {
      const nearest = nearestPointOnEntity(primitive.entity, cursor);
      if (nearest) addCandidate(candidates, nearest, "nearest", cursor);
    }
  }

  if (options.intersection) {
    const segments = collectSegments(doc);
    const near = segments.filter(segment => {
      const b = {
        minX: Math.min(segment.a.x, segment.b.x) - tolerance * 6,
        minY: Math.min(segment.a.y, segment.b.y) - tolerance * 6,
        maxX: Math.max(segment.a.x, segment.b.x) + tolerance * 6,
        maxY: Math.max(segment.a.y, segment.b.y) + tolerance * 6,
      };
      return cursor.x >= b.minX && cursor.x <= b.maxX && cursor.y >= b.minY && cursor.y <= b.maxY;
    });
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const hit = segmentIntersection(near[i].a, near[i].b, near[j].a, near[j].b);
        if (hit && distance(hit, cursor) <= tolerance * 1.5) addCandidate(candidates, hit, "intersection", cursor);
      }
    }
  }

  let best: Candidate | null = null;
  for (const candidate of candidates) {
    if (candidate.distance > tolerance) continue;
    if (!best || candidate.distance < best.distance - 1e-6) best = candidate;
  }
  if (!best) return null;
  return { point: best.point, kind: best.kind, label: snapLabel(best.kind) };
}

export function nearestPointOnEntity(entity: Entity, p: Point): Point | null {
  switch (entity.kind) {
    case "line":
      return closestOnSegment(p, entity.p1, entity.p2);
    case "polyline": {
      let best: Point | null = null;
      let bestDistance = Infinity;
      for (let i = 0; i < entity.points.length - 1; i++) {
        const candidate = closestOnSegment(p, entity.points[i], entity.points[i + 1]);
        const d = distance(candidate, p);
        if (d < bestDistance) {
          best = candidate;
          bestDistance = d;
        }
      }
      if (entity.closed && entity.points.length > 2) {
        const candidate = closestOnSegment(p, entity.points[entity.points.length - 1], entity.points[0]);
        const d = distance(candidate, p);
        if (d < bestDistance) best = candidate;
      }
      return best;
    }
    case "circle": {
      const angle = Math.atan2(p.y - entity.center.y, p.x - entity.center.x);
      return arcPoint(entity.center, entity.radius, angle);
    }
    case "arc": {
      const angle = Math.atan2(p.y - entity.center.y, p.x - entity.center.x);
      if (arcContainsAngle(entity, angle)) return arcPoint(entity.center, entity.radius, angle);
      return null;
    }
    case "ellipse": {
      const angle = Math.atan2(p.y - entity.center.y, p.x - entity.center.x);
      return {
        x: entity.center.x + Math.cos(angle) * entity.rx * Math.cos(entity.rotation) - Math.sin(angle) * entity.ry * Math.sin(entity.rotation),
        y: entity.center.y + Math.cos(angle) * entity.rx * Math.sin(entity.rotation) + Math.sin(angle) * entity.ry * Math.cos(entity.rotation),
      };
    }
    case "hatch": {
      if (!polygonContains(entity.boundary, p)) return null;
      return p;
    }
    default:
      return null;
  }
}

function closestOnSegment(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return a;
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

/* ------------------------------------------------------------------- grips */

export function gripPoints(entity: Entity): Point[] {
  switch (entity.kind) {
    case "line":
      return [entity.p1, midpoint(entity.p1, entity.p2), entity.p2];
    case "polyline":
      return entity.points;
    case "circle":
      return [entity.center, arcPoint(entity.center, entity.radius, 0), arcPoint(entity.center, entity.radius, Math.PI), arcPoint(entity.center, entity.radius, Math.PI / 2), arcPoint(entity.center, entity.radius, -Math.PI / 2)];
    case "arc":
      return [entity.center, arcPoint(entity.center, entity.radius, entity.startAngle), arcPoint(entity.center, entity.radius, entity.endAngle)];
    case "ellipse":
      return [entity.center, boundsCenter(entityBounds(entity))];
    case "text":
      return [entity.p];
    case "dim":
      return [entity.p1, entity.p2, entity.pos];
    case "leader":
      return entity.points;
    case "hatch":
      return entity.boundary;
    case "insert":
      return [entity.p];
    case "point":
      return [entity.p];
  }
}

/** Total drawing + variance helper used by the properties palette. */
export function entityDescription(entity: Entity): string {
  switch (entity.kind) {
    case "line":
      return "Line";
    case "polyline":
      return entity.closed ? "Polyline (closed)" : "Polyline";
    case "circle":
      return "Circle";
    case "arc":
      return "Arc";
    case "ellipse":
      return "Ellipse";
    case "text":
      return "Text";
    case "dim":
      return entity.dimType === "radial" ? "Radius dimension" : `${entity.dimType} dimension`;
    case "leader":
      return "Multileader";
    case "hatch":
      return "Hatch";
    case "insert":
      return "Block reference";
    case "point":
      return "Point";
  }
}

export function polylineLength(points: Point[], closed: boolean): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) total += distance(points[i], points[i + 1]);
  if (closed && points.length > 2) total += distance(points[points.length - 1], points[0]);
  return total;
}

export function lineAngleDeg(reference: Point, target: Point): number {
  const degrees = (Math.atan2(target.y - reference.y, target.x - reference.x) * 180) / Math.PI;
  return Math.round(((degrees % 360) + 360) % 360 * 10) / 10;
}

export { pointSegmentDistance };
