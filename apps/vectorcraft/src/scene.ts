/**
 * VectorCraft 文档模型。
 *
 * 所有几何量都以「文档单位（pt）」表示，原点在画板左上角：
 *   x 向右，y 向下，画板尺寸见 ARTBOARD。
 * 对象按绘制顺序保存在 `objects` 中（先画的在前，即 z=0 在最底层）。
 */

export interface Vec2 {
  x: number;
  y: number;
}

export type ShapeKind =
  | "rect"
  | "ellipse"
  | "polygon"
  | "star"
  | "path"
  | "text"
  | "grid"
  | "sun"
  | "stars"
  | "mountains";

export type Paint = string;

export interface VecObject {
  id: string;
  name: string;
  kind: ShapeKind;
  /** 未旋转包围盒（文档单位）。 */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 绕包围盒中心旋转的角度（度，顺时针）。 */
  rotation: number;
  fill: Paint;
  stroke: Paint;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  /** 外发光半径（文档单位），0 表示关闭。 */
  glow: number;
  glowColor: string;

  /* 文本 */
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  /** 强制文本排布宽度（对应 SVG textLength），用于复刻窄体大标题。 */
  textLength?: number;
  /** 标题下方的副行（与标题同属一个文本对象，类似 Illustrator 的多行文本框架）。 */
  subline?: SubLine;
  align?: "left" | "center" | "right";
  /** 竖排文本。 */
  vertical?: boolean;

  /* 路径 / 折线 */
  points?: Vec2[];
  closed?: boolean;
  /** 完整 SVG path 数据（用于 Create Outlines 生成的真实字形轮廓）。 */
  pathData?: string;
  /** 点集所在的原始包围盒；渲染时映射到 x/y/width/height，使 Transform 可移动与缩放路径。 */
  base?: { x: number; y: number; width: number; height: number };

  /* 多边形 / 星形 */
  sides?: number;
  innerRatio?: number;

  /* 星点 */
  seed?: number;
  count?: number;

  /** 编组 id：同一组对象在选择/移动时作为一个整体。 */
  groupId?: string;
}

export interface SubLine {
  text: string;
  fontSize: number;
  letterSpacing: number;
  textLength?: number;
  fill: string;
  glow: number;
  glowColor: string;
  /** 相对主行基线的纵向偏移（文档单位）。 */
  offset: number;
  weight?: number;
}

export interface VecDocument {
  name: string;
  width: number;
  height: number;
  objects: VecObject[];
}

export const ARTBOARD = { width: 800, height: 1000, horizon: 568 } as const;

export const TECHNO_FONT = '"VectorCraft", "Chakra Petch", "Segoe UI", sans-serif';
export const UI_FONT = '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

export interface GradientDef {
  id: string;
  label: string;
  /** [offset, color]，offset 0–1。 */
  stops: Array<[number, string]>;
}

export const GRADIENTS: Record<string, GradientDef> = {
  "vc-sky": {
    id: "vc-sky",
    label: "Dusk Sky",
    stops: [
      [0, "#0e0339"],
      [0.06, "#1b0759"],
      [0.11, "#29097a"],
      [0.16, "#370b9e"],
      [0.21, "#4e10ad"],
      [0.26, "#6814b9"],
      [0.31, "#8a19cf"],
      [0.36, "#a721d6"],
      [0.41, "#c02ac8"],
      [0.46, "#d63cc4"],
      [0.52, "#e953c9"],
      [0.568, "#ff7ada"],
      [1, "#ff7ada"]
    ]
  },
  "vc-sun": {
    id: "vc-sun",
    label: "Sunset Sun",
    stops: [
      [0, "#ffdd9a"],
      [0.35, "#ffb35f"],
      [0.62, "#ff8a58"],
      [1, "#ff4f74"]
    ]
  },
  "vc-ground": {
    id: "vc-ground",
    label: "Grid Floor",
    stops: [
      [0, "#2a0648"],
      [0.5, "#12012a"],
      [1, "#07010f"]
    ]
  },
  "vc-mountain": {
    id: "vc-mountain",
    label: "Mountain Dusk",
    stops: [
      [0, "#54127f"],
      [0.6, "#32094f"],
      [1, "#230538"]
    ]
  },
  "vc-sunset-1": {
    id: "vc-sunset-1",
    label: "Sunset",
    stops: [
      [0, "#ffd27a"],
      [1, "#ff4f7a"]
    ]
  },
  "vc-sunset-2": {
    id: "vc-sunset-2",
    label: "Hot Pink",
    stops: [
      [0, "#ff9f43"],
      [1, "#ff3f8e"]
    ]
  },
  "vc-cyber": {
    id: "vc-cyber",
    label: "Cyber Dusk",
    stops: [
      [0, "#2a0768"],
      [1, "#ff63d6"]
    ]
  },
  "vc-mint": {
    id: "vc-mint",
    label: "Mint Glow",
    stops: [
      [0, "#29e7ff"],
      [1, "#6effc8"]
    ]
  }
};

export const NEON_PALETTE = ["#ff3fae", "#ff74d8", "#b14cff", "#6f5cff", "#29e7ff", "#ffd166", "#ff6b6b", "#1b0b3a"];

export const INK_PALETTE = ["#ffffff", "#f2f0ff", "#c9c6e0", "#6b6b7a", "#22202e", "#101018"];

let objectCounter = 0;

export function uid(prefix = "obj"): string {
  objectCounter += 1;
  return `${prefix}-${objectCounter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function gradientOf(paint: Paint): GradientDef | null {
  const match = /^url\(#([^)]+)\)$/.exec(paint);
  if (!match) return null;
  return GRADIENTS[match[1]] ?? null;
}

export function paintLabel(paint: Paint): string {
  if (paint === "none") return "None";
  const gradient = gradientOf(paint);
  if (gradient) return gradient.label;
  return paint.toUpperCase();
}

export function gradientCss(paint: Paint): string {
  const gradient = gradientOf(paint);
  const stops: Array<[number, string]> = gradient ? gradient.stops : [[0, paint]];
  return `linear-gradient(180deg, ${stops.map(([offset, color]) => `${color} ${offset * 100}%`).join(", ")})`;
}

export function isText(object: VecObject): boolean {
  return object.kind === "text";
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function pointsBounds(points: Vec2[]): Bounds {
  if (!points.length) return { x: 0, y: 0, width: 1, height: 1 };
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const point of points) {
    left = Math.min(left, point.x);
    top = Math.min(top, point.y);
    right = Math.max(right, point.x);
    bottom = Math.max(bottom, point.y);
  }
  return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
}

export function unionBounds(objects: VecObject[]): Bounds | null {
  if (!objects.length) return null;
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const object of objects) {
    for (const corner of rotatedCorners(object)) {
      left = Math.min(left, corner.x);
      top = Math.min(top, corner.y);
      right = Math.max(right, corner.x);
      bottom = Math.max(bottom, corner.y);
    }
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function rotatedCorners(object: VecObject): Vec2[] {
  const cx = object.x + object.width / 2;
  const cy = object.y + object.height / 2;
  const angle = (object.rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const local: Vec2[] = [
    { x: object.x, y: object.y },
    { x: object.x + object.width, y: object.y },
    { x: object.x + object.width, y: object.y + object.height },
    { x: object.x, y: object.y + object.height }
  ];
  return local.map(point => {
    const dx = point.x - cx;
    const dy = point.y - cy;
    return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
  });
}

export function cloneObject(object: VecObject): VecObject {
  return {
    ...object,
    points: object.points?.map(point => ({ ...point })),
    base: object.base ? { ...object.base } : undefined,
    subline: object.subline ? { ...object.subline } : undefined
  };
}

/* ------------------------------------------------------------------ */
/* 对象工厂                                                            */
/* ------------------------------------------------------------------ */

export interface ObjectInit extends Partial<VecObject> {
  kind: ShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createObject(init: ObjectInit): VecObject {
  const base: VecObject = {
    id: uid(init.kind),
    name: init.name ?? defaultName(init.kind),
    kind: init.kind,
    x: init.x,
    y: init.y,
    width: init.width,
    height: init.height,
    rotation: 0,
    fill: "#ffffff",
    stroke: "none",
    strokeWidth: 0,
    opacity: 1,
    visible: true,
    locked: false,
    glow: 0,
    glowColor: "#ff5ad8"
  };
  return { ...base, ...init, id: init.id ?? base.id, name: init.name ?? base.name };
}

export function defaultName(kind: ShapeKind): string {
  switch (kind) {
    case "text":
      return "Type";
    case "path":
      return "Path";
    case "rect":
      return "Rectangle";
    case "ellipse":
      return "Ellipse";
    case "polygon":
      return "Polygon";
    case "star":
      return "Star";
    case "grid":
      return "Grid";
    case "sun":
      return "Sun";
    case "stars":
      return "Stars";
    case "mountains":
      return "Mountains";
    default:
      return "Object";
  }
}

export function kindLabel(kind: ShapeKind): string {
  switch (kind) {
    case "text":
      return "Type";
    case "stars":
      return "Symbol";
    case "grid":
      return "Group";
    case "sun":
      return "Shape";
    case "mountains":
      return "Path";
    case "path":
      return "Path";
    case "rect":
      return "Rect";
    case "ellipse":
      return "Ellipse";
    case "polygon":
      return "Polygon";
    case "star":
      return "Star";
    default:
      return "Object";
  }
}

export function shapeGlyph(kind: ShapeKind): string {
  switch (kind) {
    case "text":
      return "T";
    case "path":
    case "grid":
    case "mountains":
      return "～";
    case "ellipse":
    case "sun":
      return "◯";
    case "stars":
      return "✳";
    default:
      return "▭";
  }
}

/* ------------------------------------------------------------------ */
/* 演示文档：Neon Drive 海报                                            */
/* ------------------------------------------------------------------ */

export function createNeonDocument(): VecDocument {
  const { width, height, horizon } = ARTBOARD;

  const sky = createObject({
    id: "neon-sky",
    name: "Sky · Dusk Gradient",
    kind: "rect",
    x: 0,
    y: 0,
    width,
    height,
    fill: "url(#vc-sky)",
    locked: true
  });

  const stars = createObject({
    id: "neon-stars",
    name: "Stars",
    kind: "stars",
    x: 0,
    y: 0,
    width,
    height: horizon - 90,
    fill: "#ffe6ff",
    seed: 20260214,
    count: 78,
    locked: true
  });

  const sun = createObject({
    id: "neon-sun",
    name: "Sun",
    kind: "sun",
    x: 214,
    y: 334,
    width: 364,
    height: 364,
    fill: "url(#vc-sun)",
    glow: 26,
    glowColor: "#ff4f9a"
  });

  const mountains = createObject({
    id: "neon-mountains",
    name: "Mountains",
    kind: "mountains",
    x: 0,
    y: 400,
    width,
    height: 220,
    base: { x: 0, y: 400, width, height: 220 },
    fill: "url(#vc-mountain)",
    stroke: "rgba(255, 120, 220, 0.22)",
    strokeWidth: 1,
    points: [
      { x: 0, y: 505 },
      { x: 70, y: 468 },
      { x: 130, y: 512 },
      { x: 196, y: 472 },
      { x: 256, y: 428 },
      { x: 305, y: 500 },
      { x: 318, y: horizon + 2 },
      { x: 482, y: horizon + 2 },
      { x: 505, y: 455 },
      { x: 580, y: 418 },
      { x: 632, y: 505 },
      { x: 672, y: 452 },
      { x: 720, y: 505 },
      { x: 760, y: 470 },
      { x: width, y: 505 }
    ],
    locked: true
  });

  const grid = createObject({
    id: "neon-grid",
    name: "Neon Grid",
    kind: "grid",
    x: 0,
    y: horizon,
    width,
    height: height - horizon,
    fill: "url(#vc-ground)",
    stroke: "#ff3fae",
    strokeWidth: 2,
    glow: 8,
    glowColor: "#ff2fa8",
    locked: true
  });

  const title = createObject({
    id: "neon-title",
    name: "NEON DRIVE",
    kind: "text",
    x: 80,
    y: 83,
    width: 590,
    height: 153,
    text: "NEON DRIVE",
    fontFamily: TECHNO_FONT,
    fontSize: 149,
    fontWeight: 700,
    letterSpacing: 4,
    textLength: 590,
    align: "center",
    fill: "#fff1fb",
    glow: 24,
    glowColor: "#b45bff",
    subline: {
      text: "VECTOR  —  PURE RUST  —  60 FPS",
      fontSize: 21,
      letterSpacing: 6,
      textLength: 470,
      weight: 400,
      fill: "#9bd8ff",
      glow: 12,
      glowColor: "#3aa8ff",
      offset: 33
    }
  });

  const credit = createObject({
    id: "neon-credit",
    name: "made with VectorCraft",
    kind: "text",
    x: 200,
    y: 946,
    width: 400,
    height: 24,
    text: "made with VectorCraft",
    fontFamily: TECHNO_FONT,
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 2,
    textLength: 225,
    align: "center",
    fill: "#ff9bd8",
    glow: 6,
    glowColor: "#ff5fc4",
    opacity: 0.95
  });

  return {
    name: "neon-drive.vectorcraft",
    width,
    height,
    objects: [sky, stars, sun, mountains, grid, title, credit]
  };
}

/* ------------------------------------------------------------------ */
/* 序列化                                                              */
/* ------------------------------------------------------------------ */

export function serializeDocument(doc: VecDocument): string {
  return JSON.stringify({ format: "vectorcraft/1", ...doc }, null, 2);
}

export function deserializeDocument(raw: string): VecDocument | null {
  try {
    const data = JSON.parse(raw) as Partial<VecDocument>;
    if (!data || !Array.isArray(data.objects)) return null;
    const objects = data.objects.filter(item => item && typeof item === "object") as VecObject[];
    return {
      name: typeof data.name === "string" ? data.name : "untitled.vectorcraft",
      width: typeof data.width === "number" ? data.width : ARTBOARD.width,
      height: typeof data.height === "number" ? data.height : ARTBOARD.height,
      objects: objects.map(object =>
        createObject({
          ...object,
          kind: object.kind ?? "rect",
          x: object.x ?? 0,
          y: object.y ?? 0,
          width: object.width ?? 10,
          height: object.height ?? 10
        })
      )
    };
  } catch {
    return null;
  }
}
