import type { Vec2, VecObject } from "./scene";

export interface SegmentHit {
  index: number;
  point: Vec2;
  distance: number;
}

export function nearestPointIndex(object: VecObject, point: Vec2, maxDistance: number): number {
  if (!object.points) return -1;
  let best = -1;
  let bestDistance = maxDistance;
  object.points.forEach((anchor, index) => {
    const distance = Math.hypot(anchor.x - point.x, anchor.y - point.y);
    if (distance <= bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}

export function nearestSegment(points: Vec2[], point: Vec2, closed: boolean): SegmentHit | null {
  if (points.length < 2) return null;
  let best: SegmentHit | null = null;
  const total = closed ? points.length : points.length - 1;
  for (let index = 0; index < total; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
    const projected = { x: a.x + dx * t, y: a.y + dy * t };
    const distance = Math.hypot(projected.x - point.x, projected.y - point.y);
    if (!best || distance < best.distance) best = { index, point: projected, distance };
  }
  return best;
}

export function pointInPolygon(point: Vec2, polygon: Vec2[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || Number.EPSILON) + a.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

export function smoothPoints(points: Vec2[]): Vec2[] {
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return { ...point };
    const previous = points[index - 1];
    const next = points[index + 1];
    return { x: (previous.x + point.x * 2 + next.x) / 4, y: (previous.y + point.y * 2 + next.y) / 4 };
  });
}

/** Ramer–Douglas–Peucker 简化。 */
export function simplifyPoints(points: Vec2[], tolerance: number): Vec2[] {
  if (points.length < 3) return points.slice();
  const first = points[0];
  const last = points[points.length - 1];
  let index = -1;
  let max = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const point = points[i];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const length = Math.hypot(dx, dy) || 1;
    const distance = Math.abs(dy * point.x - dx * point.y + last.x * first.y - last.y * first.x) / length;
    if (distance > max) {
      max = distance;
      index = i;
    }
  }
  if (max <= tolerance || index < 0) return [first, last];
  return [
    ...simplifyPoints(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplifyPoints(points.slice(index), tolerance)
  ];
}
