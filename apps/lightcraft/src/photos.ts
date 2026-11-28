/**
 * LightCraft 演示照片生成模块
 *
 * 用 Canvas 2D 绘制扁平矢量插画风格的风景照片：分层山脊、水面倒影、
 * 雾气、光晕、散景与柔和渐变天空。所有画面完全由场景 id 决定：
 * 同一条 SceneSpec 在任何尺寸下都会得到构图一致、细节确定的结果。
 *
 * 约束：
 * - 纯 TypeScript，零依赖，不加载外部图片或字体，不绘制任何文字；
 * - 使用本地 mulberry32 伪随机数，绝不调用 Math.random；
 * - 避免逐像素循环，颗粒与星点数量都有上限。
 */

export type SceneKind =
  | "mountains"
  | "aurora"
  | "flower"
  | "lavender"
  | "beach"
  | "dunes"
  | "forest"
  | "sunsetSea"
  | "moon"
  | "corn"
  | "cliff"
  | "birch"
  | "canyon"
  | "garden";

export interface SceneSpec {
  id: string;
  kind: SceneKind;
  variant: number;
  title: string;
  file: string;
  albums: string[];
  location: string;
  date: string;
  camera: string;
  lens: string;
  iso: number;
  aperture: string;
  shutter: string;
  focal: number;
  keywords: string[];
  /** true 时 renderScene 默认输出 1000×1400 竖幅 */
  portrait?: boolean;
}

/* ============================================================
 * 一、确定性随机与数学工具
 * ============================================================ */

const TAU = Math.PI * 2;

/** mulberry32：小巧、快速、可复现的 32 位种子随机数发生器 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Rng {
  next(): number;
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<T>(items: readonly T[]): T;
}

function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  const range = (min: number, max: number): number => min + next() * (max - min);
  return {
    next,
    range,
    int: (min: number, max: number): number => Math.floor(range(min, max + 1)),
    chance: (probability: number): boolean => next() < probability,
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length) % items.length],
  };
}

/** FNV-1a 字符串散列，把 slug 变成稳定的渲染种子 */
function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 一维平滑值噪声：生成山脊、沙丘与树干轮廓的起伏 */
function createNoise1D(rng: Rng, size = 8): (t: number) => number {
  const values: number[] = [];
  for (let i = 0; i < size; i++) values.push(rng.next());
  return (t: number): number => {
    const wrapped = ((t % 1) + 1) % 1;
    const x = wrapped * size;
    const index = Math.floor(x);
    const fraction = x - index;
    const a = values[index % size];
    const b = values[(index + 1) % size];
    return lerp(a, b, fraction * fraction * (3 - 2 * fraction));
  };
}

function pickPalette<T>(palettes: readonly T[], variant: number): T {
  const index = ((variant % palettes.length) + palettes.length) % palettes.length;
  return palettes[index];
}

/* ============================================================
 * 二、颜色与渐变
 * ============================================================ */

type RGB = readonly [number, number, number];
type GradientStop = readonly [number, string];
type Point = readonly [number, number];

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

function rgba(color: RGB, alpha: number): string {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${clamp01(alpha)})`;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
  ];
}

function lighten(color: RGB, amount: number): RGB {
  return mix(color, WHITE, clamp01(amount));
}

function darken(color: RGB, amount: number): RGB {
  return mix(color, BLACK, clamp01(amount));
}

function linearGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: readonly GradientStop[],
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const stop of stops) gradient.addColorStop(clamp01(stop[0]), stop[1]);
  return gradient;
}

/* ============================================================
 * 三、画布基础图元
 * ============================================================ */

interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

function createLayer(width: number, height: number): Layer {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(width));
  canvas.height = Math.max(2, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建 2D 画布上下文");
  return { canvas, ctx };
}

function paintSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stops: readonly GradientStop[],
): void {
  ctx.fillStyle = linearGradient(ctx, 0, 0, 0, height, stops);
  ctx.fillRect(0, 0, width, height);
}

/** 一团柔和的云带：若干拉长的径向渐变斑块 */
function softCloudBand(
  ctx: CanvasRenderingContext2D,
  width: number,
  centerY: number,
  spread: number,
  rng: Rng,
  color: RGB,
  alpha: number,
  blobs = 7,
): void {
  for (let i = 0; i < blobs; i++) {
    const cx = rng.range(-0.08, 1.08) * width;
    const cy = centerY + rng.range(-0.3, 0.3) * spread;
    const rx = rng.range(0.1, 0.3) * width;
    const ry = rng.range(0.16, 0.5) * spread;
    const a = alpha * rng.range(0.6, 1);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gradient.addColorStop(0, rgba(color, a));
    gradient.addColorStop(0.55, rgba(color, a * 0.5));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

/** 柔光：径向渐变光晕 */
function glow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: RGB,
  alpha: number,
): void {
  if (radius <= 0 || alpha <= 0) return;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, rgba(color, alpha));
  gradient.addColorStop(0.35, rgba(color, alpha * 0.45));
  gradient.addColorStop(0.75, rgba(color, alpha * 0.12));
  gradient.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

/** 太阳：双层光晕 + 明亮圆盘 */
function paintSun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  core: RGB,
  halo: RGB,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, x, y, radius * 9, halo, 0.3);
  glow(ctx, x, y, radius * 3.6, halo, 0.45);
  ctx.restore();
  const gradient = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.25, 0, x, y, radius);
  gradient.addColorStop(0, rgba(WHITE, 1));
  gradient.addColorStop(0.45, rgba(lighten(core, 0.55), 0.96));
  gradient.addColorStop(0.78, rgba(core, 0.55));
  gradient.addColorStop(1, rgba(core, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function paintStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
  rng: Rng,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < count; i++) {
    const x = rng.range(0, width);
    const y = Math.pow(rng.next(), 1.5) * height * 0.96;
    const bright = rng.chance(0.08);
    const radius = bright ? rng.range(1.1, 2) : rng.range(0.35, 1);
    ctx.fillStyle = rgba(WHITE, rng.range(0.2, bright ? 0.95 : 0.7));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/** 一层横向雾带，用于山脊之间与林间的大气透视 */
function paintMistBand(
  ctx: CanvasRenderingContext2D,
  width: number,
  centerY: number,
  thickness: number,
  color: RGB,
  alpha: number,
): void {
  const gradient = linearGradient(
    ctx,
    0,
    centerY - thickness / 2,
    0,
    centerY + thickness / 2,
    [
      [0, rgba(color, 0)],
      [0.5, rgba(color, alpha)],
      [1, rgba(color, 0)],
    ],
  );
  ctx.fillStyle = gradient;
  ctx.fillRect(0, centerY - thickness / 2, width, thickness);
}

/* ---------------- 山脊 / 沙丘 ---------------- */

interface RidgeOptions {
  baseY: number;
  bottom: number;
  peak: number;
  colors: readonly [RGB, RGB];
  rim?: RGB;
  snow?: RGB;
  steps?: number;
  roughness?: number;
}

/**
 * 一条起伏的山脊剪影：平滑噪声 + 高频细节 + 峰顶雪帽 + 受光轮廓线。
 * 越靠前的层用更深的颜色、更大的 amplitude 来制造层次。
 */
function drawRidge(
  ctx: CanvasRenderingContext2D,
  width: number,
  rng: Rng,
  options: RidgeOptions,
): void {
  const steps = Math.max(16, Math.round(options.steps ?? width / 40));
  const broadNoise = createNoise1D(rng, 7);
  const detailNoise = createNoise1D(rng, 13);
  const phase = rng.range(0, TAU);
  const roughness = options.roughness ?? 0.7;
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const broad = Math.pow(broadNoise(t), 1.35);
    const ridged = 1 - Math.abs(detailNoise(t) * 2 - 1);
    const micro = (ridged - 0.5) * 0.12;
    const wave = 0.06 * Math.sin(t * Math.PI * 2.6 + phase) + 0.03 * Math.sin(t * Math.PI * 7.3 + phase * 1.7);
    const rise = clamp01(0.1 + roughness * (0.8 * broad + 0.2 * Math.pow(ridged, 2.5) + micro + wave));
    const y = clamp(options.baseY - options.peak * rise, options.baseY - options.peak, options.baseY);
    points.push([t * width, y]);
  }
  const tracePath = (): void => {
    ctx.beginPath();
    ctx.moveTo(-2, options.bottom);
    for (const point of points) ctx.lineTo(point[0], point[1]);
    ctx.lineTo(width + 2, options.bottom);
    ctx.closePath();
  };
  tracePath();
  ctx.fillStyle = linearGradient(
    ctx,
    0,
    options.baseY - options.peak,
    0,
    options.baseY,
    [
      [0, rgba(options.colors[0], 1)],
      [1, rgba(options.colors[1], 1)],
    ],
  );
  ctx.fill();

  if (options.snow) {
    const snowNoise = createNoise1D(rng, 11);
    const ridge = points;
    ctx.save();
    tracePath();
    ctx.clip();
    const snowDepth = options.peak * 0.3;
    const bottomPoints: Point[] = ridge.map(([x, y], index) => {
      const t = index / steps;
      const elevation = clamp01((options.baseY - y) / options.peak);
      const coverage = clamp01((elevation - 0.48) / 0.5);
      const wobble = 0.35 + 0.65 * snowNoise(t * 1.9 + 0.17);
      return [x, y + 3 + snowDepth * coverage * wobble];
    });
    ctx.beginPath();
    ctx.moveTo(ridge[0][0], ridge[0][1]);
    for (const point of ridge) ctx.lineTo(point[0], point[1]);
    for (let i = bottomPoints.length - 1; i >= 0; i--) ctx.lineTo(bottomPoints[i][0], bottomPoints[i][1]);
    ctx.closePath();
    ctx.fillStyle = rgba(options.snow, 0.48);
    ctx.fill();
    ctx.restore();
  }

  if (options.rim) {
    ctx.save();
    ctx.strokeStyle = rgba(options.rim, 0.13);
    ctx.lineWidth = Math.max(1, options.peak * 0.007);
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const point of points) ctx.lineTo(point[0], point[1]);
    ctx.stroke();
    ctx.restore();
  }
}

/** 一层平滑的沙丘：柔和的起伏、斜向受光渐变与脊线高光 */
function drawDuneLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: Rng,
  baseY: number,
  amplitude: number,
  top: RGB,
  bottom: RGB,
  rim: RGB,
): void {
  const noise = createNoise1D(rng, 6);
  const phase = rng.range(0, TAU);
  const points: Point[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y =
      baseY +
      (noise(t) - 0.5) * amplitude * 1.6 +
      Math.sin(t * Math.PI * 2.3 + phase) * amplitude * 0.5 +
      Math.sin(t * Math.PI * 5.1 + phase * 2) * amplitude * 0.12;
    points.push([t * width, y]);
  }
  ctx.beginPath();
  ctx.moveTo(-2, height + 2);
  for (const point of points) ctx.lineTo(point[0], point[1]);
  ctx.lineTo(width + 2, height + 2);
  ctx.closePath();
  ctx.fillStyle = linearGradient(ctx, 0, baseY - amplitude, width * 0.9, baseY + amplitude * 1.5, [
    [0, rgba(top, 1)],
    [0.5, rgba(mix(top, bottom, 0.45), 1)],
    [1, rgba(bottom, 1)],
  ]);
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = rgba(rim, 0.45);
  ctx.lineWidth = Math.max(1.5, height * 0.0025);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points) ctx.lineTo(point[0], point[1]);
  ctx.stroke();
  ctx.restore();
}

/* ---------------- 松树 / 芦苇 / 鸟 ---------------- */

function drawPine(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  color: string,
): void {
  const half = Math.max(1.2, height * 0.26);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, baseY - height);
  ctx.lineTo(x + half * 0.55, baseY - height * 0.63);
  ctx.lineTo(x + half * 0.26, baseY - height * 0.63);
  ctx.lineTo(x + half * 1.02, baseY - height * 0.34);
  ctx.lineTo(x + half * 0.5, baseY - height * 0.34);
  ctx.lineTo(x + half * 1.55, baseY - height * 0.03);
  ctx.lineTo(x + half * 0.17, baseY - height * 0.03);
  ctx.lineTo(x + half * 0.17, baseY);
  ctx.lineTo(x - half * 0.17, baseY);
  ctx.lineTo(x - half * 0.17, baseY - height * 0.03);
  ctx.lineTo(x - half * 1.55, baseY - height * 0.03);
  ctx.lineTo(x - half * 0.5, baseY - height * 0.34);
  ctx.lineTo(x - half * 1.02, baseY - height * 0.34);
  ctx.lineTo(x - half * 0.26, baseY - height * 0.63);
  ctx.lineTo(x - half * 0.55, baseY - height * 0.63);
  ctx.closePath();
  ctx.fill();
}

function drawPineRow(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  count: number,
  minHeight: number,
  maxHeight: number,
  color: string,
  rng: Rng,
  spreadY = 0,
): void {
  for (let i = 0; i < count; i++) {
    const x = ((i + rng.range(0.1, 0.9)) / count) * width;
    const height = rng.range(minHeight, maxHeight);
    drawPine(ctx, x, baseY + rng.range(-spreadY, spreadY), height, color);
  }
}

function drawReeds(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  count: number,
  color: string,
  rng: Rng,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const x = rng.range(-0.01, 1.01) * width;
    const height = rng.range(0.016, 0.062) * baseY;
    const bend = rng.range(-0.03, 0.03) * width;
    ctx.lineWidth = rng.range(0.8, 1.8);
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + bend * 0.4, baseY - height * 0.55, x + bend, baseY - height);
    ctx.stroke();
    if (height > 0.04 * baseY) {
      ctx.beginPath();
      ctx.ellipse(x + bend, baseY - height, Math.max(1, height * 0.045), Math.max(2.5, height * 0.16), 0, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawBirds(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  count: number,
  color: string,
  rng: Rng,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.14);
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const bx = x + rng.range(-1, 1) * size * 3;
    const by = y + rng.range(-1, 1) * size * 1.5;
    const s = size * rng.range(0.6, 1.1);
    ctx.beginPath();
    ctx.moveTo(bx - s, by);
    ctx.quadraticCurveTo(bx - s * 0.4, by - s * 0.55, bx, by - s * 0.1);
    ctx.quadraticCurveTo(bx + s * 0.4, by - s * 0.55, bx + s, by);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- 散景 / 花 / 叶 / 棕榈 ---------------- */

function paintBokeh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
  palette: readonly RGB[],
  rng: Rng,
  minRadius: number,
  maxRadius: number,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < count; i++) {
    const x = rng.range(0, width);
    const y = rng.range(0, height);
    const radius = rng.range(minRadius, maxRadius);
    const color = rng.pick(palette);
    const alpha = rng.range(0.05, 0.18);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(0.66, rgba(color, alpha * 0.75));
    gradient.addColorStop(0.9, rgba(color, alpha * 0.95));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

interface FlowerStyle {
  petalInner: RGB;
  petalOuter: RGB;
  center: RGB;
  centerDark: RGB;
  petals: number;
  alpha?: number;
  stamens?: number;
}

/** 一朵正面朝向的花：椭圆花瓣 + 径向渐变 + 黄色花心与花蕊 */
function drawFlowerHead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  style: FlowerStyle,
  rotation: number,
): void {
  const alpha = style.alpha ?? 1;
  for (let i = 0; i < style.petals; i++) {
    const angle = rotation + (i / style.petals) * TAU;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const gradient = ctx.createLinearGradient(0, 0, 0, -radius);
    gradient.addColorStop(0, rgba(style.petalInner, alpha));
    gradient.addColorStop(0.55, rgba(mix(style.petalInner, style.petalOuter, 0.55), alpha));
    gradient.addColorStop(1, rgba(style.petalOuter, alpha));
    const petalWidth = radius * 0.37;
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.05);
    ctx.bezierCurveTo(-petalWidth * 1.12, -radius * 0.24, -petalWidth * 0.98, -radius * 0.82, -radius * 0.07, -radius * 0.97);
    ctx.quadraticCurveTo(0, -radius * 1.02, radius * 0.07, -radius * 0.97);
    ctx.bezierCurveTo(petalWidth * 0.98, -radius * 0.82, petalWidth * 1.12, -radius * 0.24, 0, -radius * 0.05);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = rgba(lighten(style.petalInner, 0.5), alpha * 0.22);
    ctx.lineWidth = Math.max(0.6, radius * 0.012);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.12);
    ctx.quadraticCurveTo(0, -radius * 0.5, 0, -radius * 0.86);
    ctx.stroke();
    ctx.restore();
  }
  const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.26);
  centerGradient.addColorStop(0, rgba(lighten(style.center, 0.55), alpha));
  centerGradient.addColorStop(0.6, rgba(style.center, alpha));
  centerGradient.addColorStop(1, rgba(style.centerDark, alpha));
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.24, 0, TAU);
  ctx.fill();
  for (let i = 0; i < (style.stamens ?? 10); i++) {
    const angle = (i / (style.stamens ?? 10)) * TAU + rotation * 0.5;
    const distance = radius * 0.15 + (i % 3) * radius * 0.02;
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    ctx.fillStyle = rgba(style.centerDark, alpha * 0.9);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, radius * 0.014), 0, TAU);
    ctx.fill();
    ctx.fillStyle = rgba(lighten(style.center, 0.7), alpha * 0.9);
    ctx.beginPath();
    ctx.arc(x - radius * 0.004, y - radius * 0.004, Math.max(0.6, radius * 0.007), 0, TAU);
    ctx.fill();
  }
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  width: number,
  angle: number,
  color: RGB,
  alpha = 1,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = rgba(color, alpha);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(width, -length * 0.45, 0, -length);
  ctx.quadraticCurveTo(-width, -length * 0.45, 0, 0);
  ctx.fill();
  ctx.strokeStyle = rgba(lighten(color, 0.35), alpha * 0.6);
  ctx.lineWidth = Math.max(1, width * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, -length * 0.08);
  ctx.quadraticCurveTo(width * 0.15, -length * 0.5, 0, -length * 0.9);
  ctx.stroke();
  ctx.restore();
}

/** 一棵远处的孤树，树冠用几团重叠椭圆构成 */
function drawLoneTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  crown: RGB,
  trunk: RGB,
  rng: Rng,
): void {
  ctx.save();
  ctx.strokeStyle = rgba(trunk, 1);
  ctx.lineWidth = Math.max(1, height * 0.045);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + height * 0.025, baseY - height * 0.5, x, baseY - height * 0.72);
  ctx.stroke();
  const crownY = baseY - height * 0.72;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * TAU + rng.range(-0.25, 0.25);
    const distance = height * rng.range(0.04, 0.17);
    const radiusX = height * rng.range(0.08, 0.15);
    const radiusY = height * rng.range(0.055, 0.1);
    ctx.fillStyle = rgba(crown, rng.range(0.8, 1));
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * distance,
      crownY + Math.sin(angle) * distance * 0.62,
      radiusX,
      radiusY,
      rng.range(-0.4, 0.4),
      0,
      TAU,
    );
    ctx.fill();
  }
  ctx.restore();
}

/** 棕榈剪影：弯曲树干 + 羽状叶片，用于海滩场景 */
function drawPalm(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  color: string,
): void {
  const topX = x + height * 0.09;
  const topY = baseY - height;
  const trunkWidth = height * 0.032;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";

  // 由粗到细、略带 S 形的树干
  ctx.beginPath();
  ctx.moveTo(x - trunkWidth * 0.95, baseY);
  ctx.bezierCurveTo(
    x + height * 0.09 - trunkWidth * 0.55,
    baseY - height * 0.34,
    x + height * 0.02 - trunkWidth * 0.35,
    baseY - height * 0.7,
    topX - trunkWidth * 0.3,
    topY,
  );
  ctx.lineTo(topX + trunkWidth * 0.3, topY);
  ctx.bezierCurveTo(
    x + height * 0.04 + trunkWidth * 0.4,
    baseY - height * 0.7,
    x + height * 0.11 + trunkWidth * 0.6,
    baseY - height * 0.34,
    x + trunkWidth * 0.95,
    baseY,
  );
  ctx.closePath();
  ctx.fill();

  // 树干的环状纹理
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
  for (let i = 0; i < 7; i++) {
    const t = 0.12 + i * 0.11;
    const bandY = lerp(baseY, topY, t);
    const bandX = lerp(x, topX, Math.pow(t, 0.7));
    const bandWidth = trunkWidth * (1 - t * 0.55);
    ctx.lineWidth = Math.max(1, trunkWidth * 0.1);
    ctx.beginPath();
    ctx.moveTo(bandX - bandWidth * 0.85, bandY);
    ctx.quadraticCurveTo(bandX, bandY + trunkWidth * 0.14, bandX + bandWidth * 0.85, bandY);
    ctx.stroke();
  }
  ctx.restore();

  // 羽状叶片：修长的弧形叶 + 锯齿边缘，前后两层拉开空间
  const drawFrond = (angle: number, length: number, widthScale: number): void => {
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const controlX = topX + dirX * length * 0.56;
    const controlY = topY + dirY * length * 0.48 - length * 0.2;
    const tipX = topX + dirX * length;
    const tipY = topY + dirY * length + length * 0.34;
    const halfWidth = height * 0.027 * widthScale;
    const leftSide: Point[] = [];
    const rightSide: Point[] = [];
    const samples = 10;
    for (let j = 0; j <= samples; j++) {
      const t = j / samples;
      const inv = 1 - t;
      const px = inv * inv * topX + 2 * inv * t * controlX + t * t * tipX;
      const py = inv * inv * topY + 2 * inv * t * controlY + t * t * tipY;
      const dx = 2 * inv * (controlX - topX) + 2 * t * (tipX - controlX);
      const dy = 2 * inv * (controlY - topY) + 2 * t * (tipY - controlY);
      const normalLength = Math.hypot(dx, dy) || 1;
      const nx = -dy / normalLength;
      const ny = dx / normalLength;
      const widthAt = halfWidth * Math.pow(1 - t, 0.55) * (t < 0.06 ? 0.45 : 1);
      const notch = t > 0.14 && t < 0.92 && j % 2 === 1 ? 0.68 : 1;
      leftSide.push([px + nx * widthAt * notch, py + ny * widthAt * notch]);
      rightSide.push([px - nx * widthAt, py - ny * widthAt]);
    }
    ctx.beginPath();
    ctx.moveTo(leftSide[0][0], leftSide[0][1]);
    for (let j = 1; j < leftSide.length; j++) ctx.lineTo(leftSide[j][0], leftSide[j][1]);
    for (let j = rightSide.length - 1; j >= 0; j--) ctx.lineTo(rightSide[j][0], rightSide[j][1]);
    ctx.closePath();
    ctx.fill();
  };

  ctx.save();
  ctx.globalAlpha = 0.82;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI * 1.02 + (i / 4) * Math.PI * 0.94;
    drawFrond(angle, height * (0.28 + 0.04 * Math.sin(i * 2.1)), 0.9);
  }
  ctx.restore();

  for (let i = 0; i < 8; i++) {
    const angle = -Math.PI * 0.98 + (i / 7) * Math.PI * 0.9;
    drawFrond(angle, height * (0.36 + 0.06 * Math.sin(i * 1.9 + 0.8)), 1);
  }

  // 椰果
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const angle = -0.6 + i * 0.6;
    ctx.beginPath();
    ctx.arc(
      topX + Math.cos(angle) * height * 0.02,
      topY + Math.abs(Math.sin(angle)) * height * 0.03 + height * 0.012,
      height * 0.014,
      0,
      TAU,
    );
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- 水面倒影 ---------------- */

interface WaterOptions {
  horizon: number;
  /** 倒影整体透明度 */
  reflectionAlpha?: number;
  /** 水体色调 */
  tint?: RGB;
  /** 水平切片数量：越多越碎 */
  strips?: number;
  /** 涟漪高光颜色 */
  ripple?: RGB;
  /** 太阳/月亮在水面的高光带强度 0 表示不画 */
  shimmer?: number;
  shimmerX?: number;
  shimmerColor?: RGB;
}

/**
 * 先在离屏画布上绘制地平线以上的所有内容，再把它整体镜像到水面：
 * 垂直翻转、压暗、降低 alpha，并按水平切片错位模拟涟漪。
 * 返回后调用方可以继续在地平线以下叠前景（芦苇、浪花等）。
 */
function drawWaterScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: Rng,
  options: WaterOptions,
  drawAbove: (above: CanvasRenderingContext2D) => void,
): void {
  const layer = createLayer(width, Math.max(2, options.horizon));
  drawAbove(layer.ctx);
  ctx.drawImage(layer.canvas, 0, 0);

  const horizon = options.horizon;
  const waterHeight = height - horizon;
  if (waterHeight <= 2) return;
  const tint = options.tint ?? [34, 56, 78];

  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(lighten(tint, 0.2), 0.98)],
    [0.45, rgba(tint, 0.98)],
    [1, rgba(darken(tint, 0.55), 1)],
  ]);
  ctx.fillRect(0, horizon, width, waterHeight);

  const strips = Math.max(6, options.strips ?? 8);
  const sourceStrip = horizon / strips;
  const targetStrip = waterHeight / strips;
  const phase = (options.shimmerX ?? width * 0.5) * 0.01;
  ctx.save();
  for (let i = 0; i < strips; i++) {
    const sourceY = horizon - (i + 1) * sourceStrip;
    const targetY = horizon + i * targetStrip;
    const sway = Math.sin(i * 1.55 + phase) * (1.5 + (i / strips) * 5);
    ctx.globalAlpha = (options.reflectionAlpha ?? 0.5) * (0.82 + 0.18 * Math.sin(i * 2.3 + phase));
    ctx.save();
    ctx.translate(sway, targetY + targetStrip);
    ctx.scale(1, -1);
    ctx.drawImage(layer.canvas, 0, sourceY, width, sourceStrip, 0, 0, width, targetStrip);
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(lighten(tint, 0.1), 0.12)],
    [0.55, rgba(tint, 0.34)],
    [1, rgba(darken(tint, 0.3), 0.52)],
  ]);
  ctx.fillRect(0, horizon, width, waterHeight);

  const ripple = options.ripple ?? WHITE;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i++) {
    const progress = (i + 0.5) / 12;
    const y = horizon + progress * waterHeight * 0.94 + rng.range(-2, 2);
    const amplitude = 1 + progress * 4;
    const x = rng.range(-0.2, 0.8) * width;
    const length = rng.range(0.07, 0.3) * width;
    ctx.strokeStyle = rgba(ripple, rng.range(0.025, 0.09));
    ctx.lineWidth = rng.range(0.8, 2.2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + length * 0.3, y - amplitude, x + length * 0.6, y + amplitude, x + length, y);
    ctx.stroke();
  }
  ctx.restore();

  const shimmer = options.shimmer ?? 0;
  if (shimmer > 0) {
    const shimmerX = options.shimmerX ?? width * 0.5;
    const shimmerColor = options.shimmerColor ?? WHITE;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 24; i++) {
      const progress = i / 23;
      const y = horizon + 2 + progress * waterHeight * 0.9 + rng.range(-3, 3);
      const halfWidth = width * (0.008 + 0.07 * progress) * (0.55 + 0.45 * Math.sin(progress * 21 + 1));
      const alpha = shimmer * (0.55 - 0.32 * progress) * (0.6 + 0.4 * Math.sin(progress * 29 + 2));
      if (halfWidth <= 0 || alpha <= 0) continue;
      ctx.fillStyle = rgba(shimmerColor, alpha);
      ctx.beginPath();
      ctx.ellipse(
        shimmerX + (rng.next() - 0.5) * halfWidth * 0.25,
        y,
        halfWidth,
        Math.max(1, 1.2 + progress * 2.2),
        0,
        0,
        TAU,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.fillStyle = rgba(ripple, 0.16);
  ctx.fillRect(0, horizon - 1, width, 2);
}

/* ---------------- 光柱 / 海面闪光 / 前景草 ---------------- */

/** 太阳或月亮在水面拉出的金色反光路径 */
function paintLightPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  startY: number,
  endY: number,
  startHalf: number,
  endHalf: number,
  color: RGB,
  rng: Rng,
  alpha: number,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 45; i++) {
    const progress = rng.next();
    const y = lerp(startY, endY, progress) + rng.range(-4, 4);
    const halfWidth = lerp(startHalf, endHalf, Math.pow(progress, 1.25)) * rng.range(0.5, 1.1);
    const jitter = (rng.next() - 0.5) * halfWidth * 0.45;
    const a = alpha * (1 - progress * 0.5) * rng.range(0.08, 0.32);
    if (a <= 0.002) continue;
    ctx.fillStyle = rgba(color, a);
    ctx.beginPath();
    ctx.ellipse(
      x + jitter,
      y,
      halfWidth,
      Math.max(1.5, 1.8 + progress * 4.5),
      rng.range(-0.02, 0.02),
      0,
      TAU,
    );
    ctx.fill();
  }
  ctx.restore();
}

/** 从光源向下的丁达尔光柱 */
function paintLightRays(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  count: number,
  color: RGB,
  rng: Rng,
  maxAlpha: number,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < count; i++) {
    const angle = rng.range(Math.PI * 0.12, Math.PI * 0.88);
    const spread = rng.range(0.018, 0.06);
    ctx.fillStyle = rgba(color, rng.range(0.015, maxAlpha));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle - spread) * length, y + Math.sin(angle - spread) * length);
    ctx.lineTo(x + Math.cos(angle + spread) * length, y + Math.sin(angle + spread) * length);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** 海面细碎的横向反光 */
function paintSeaSparkles(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizon: number,
  height: number,
  color: RGB,
  rng: Rng,
  count: number,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < count; i++) {
    const progress = Math.pow(rng.next(), 0.7);
    const y = horizon + progress * (height - horizon) * 0.95;
    const length = width * rng.range(0.004, 0.026) * (0.5 + progress);
    const x = rng.range(0.02, 0.98) * width;
    ctx.fillStyle = rgba(color, rng.range(0.03, 0.14));
    ctx.fillRect(x - length / 2, y, length, Math.max(1, 1 + progress * 2));
  }
  ctx.restore();
}

/** 画面底部的黑色草叶剪影 */
function drawForegroundGrass(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: RGB,
  rng: Rng,
  count = 54,
): void {
  ctx.save();
  ctx.strokeStyle = rgba(color, 0.9);
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const x = rng.range(-0.03, 1.03) * width;
    const baseY = height + rng.range(0, 0.025) * height;
    const blade = rng.range(0.045, 0.16) * height;
    ctx.lineWidth = rng.range(1, 3.4);
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(
      x + rng.range(-0.03, 0.03) * width,
      baseY - blade * 0.55,
      x + rng.range(-0.06, 0.06) * width,
      baseY - blade,
    );
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- 透视花田 / 岩层 ---------------- */

interface FieldOptions {
  horizon: number;
  colors: readonly [RGB, RGB, RGB];
  /** 垄沟之间的土地底色 */
  base: RGB;
  sunlit: RGB;
  haze: RGB;
  rows: number;
  /** 底部行间距（相对画面宽度） */
  rowSpacing: number;
  /** 底部行宽（相对画面宽度） */
  rowWidth: number;
  texture: RGB;
  textureCount: number;
  /** 花纹高度（相对画面高度） */
  textureHeight: number;
  /** 花穗（dot）或玉米秆（line） */
  textureShape?: "dot" | "line";
  vanishingX?: number;
}

/** 用向消失点汇聚的彩色条带模拟薰衣草田、玉米田的垄沟 */
function paintPerspectiveField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: Rng,
  options: FieldOptions,
): void {
  const horizon = options.horizon;
  const vanishingX = options.vanishingX ?? width * 0.5;
  const half = Math.floor(options.rows / 2);
  const colors = options.colors;
  const topSpread = width * 0.012;

  // 先铺满田地的底色，避免垄沟之间露出透明画布
  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(mix(options.base, options.haze, 0.55), 1)],
    [0.35, rgba(options.base, 1)],
    [1, rgba(darken(options.base, 0.18), 1)],
  ]);
  ctx.fillRect(0, horizon, width, height - horizon);

  for (let k = -half; k <= half; k++) {
    const bottomX = vanishingX + k * width * options.rowSpacing;
    const bottomWidth = width * options.rowWidth;
    const topX = vanishingX + k * topSpread;
    const rowColor = colors[(k + half) % colors.length];
    ctx.fillStyle = rgba(rowColor, 1);
    ctx.beginPath();
    ctx.moveTo(topX - 2, horizon);
    ctx.lineTo(topX + 2, horizon);
    ctx.lineTo(bottomX + bottomWidth * 0.5, height);
    ctx.lineTo(bottomX - bottomWidth * 0.5, height);
    ctx.closePath();
    ctx.fill();
    if ((k + half) % 2 === 0) {
      ctx.strokeStyle = rgba(options.sunlit, 0.07);
      ctx.lineWidth = Math.max(1, width * 0.0012);
      ctx.beginPath();
      ctx.moveTo(topX + 2, horizon);
      ctx.lineTo(bottomX + bottomWidth * 0.5, height);
      ctx.stroke();
    }
  }

  // 沿垄沟分布的花穗 / 玉米秆，近大远小
  for (let i = 0; i < options.textureCount; i++) {
    const progress = Math.pow(rng.next(), 0.55);
    const y = horizon + progress * (height - horizon);
    const rowIndex = rng.int(-half, half);
    const rowCenter = lerp(vanishingX + rowIndex * topSpread, vanishingX + rowIndex * width * options.rowSpacing, progress);
    const halfRowWidth = lerp(2, (width * options.rowWidth) / 2, progress);
    const x = rowCenter + rng.range(-0.9, 0.9) * halfRowWidth;
    const size =
      (0.002 + progress * 0.0035) * height + options.textureHeight * height * progress * rng.range(0.4, 1);
    if (options.textureShape === "line") {
      ctx.fillStyle = rgba(options.texture, rng.range(0.14, 0.42));
      const stalkWidth = Math.max(1, width * 0.0013);
      ctx.fillRect(x, y - size * 0.5, stalkWidth, size);
      ctx.beginPath();
      ctx.ellipse(x + stalkWidth / 2, y - size * 0.5, Math.max(1, size * 0.12), Math.max(1.5, size * 0.24), 0, 0, TAU);
      ctx.fill();
    } else {
      ctx.fillStyle = rgba(options.texture, rng.range(0.08, 0.28));
      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(1, size * 0.4), Math.max(2, size * 1.5), 0, 0, TAU);
      ctx.fill();
      if (rng.chance(0.5)) {
        ctx.beginPath();
        ctx.ellipse(x + size * 0.8, y + size * 0.5, Math.max(0.8, size * 0.3), Math.max(1.5, size * 1.1), 0, 0, TAU);
        ctx.fill();
      }
    }
  }

  // 地平线处的雾化过渡
  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, horizon + (height - horizon) * 0.26, [
    [0, rgba(options.haze, 0.9)],
    [0.5, rgba(options.haze, 0.45)],
    [1, rgba(options.haze, 0)],
  ]);
  ctx.fillRect(0, horizon, width, (height - horizon) * 0.26);
}

/** 在裁剪路径内绘制岩壁底色与倾斜层理，用于峡谷两侧 */
function paintStrata(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: Rng,
  path: () => void,
  topY: number,
  bottomY: number,
  colors: readonly [RGB, RGB],
  slant: number,
): void {
  ctx.save();
  path();
  ctx.clip();
  ctx.fillStyle = linearGradient(ctx, 0, topY, 0, bottomY, [
    [0, rgba(colors[0], 1)],
    [1, rgba(colors[1], 1)],
  ]);
  ctx.fillRect(0, 0, width, height);
  const bands = 7;
  const bandHeight = (bottomY - topY) / bands;
  for (let i = 0; i < bands; i++) {
    const y = topY + i * bandHeight + rng.range(-0.1, 0.1) * bandHeight;
    const light = i % 2 === 0;
    ctx.strokeStyle = rgba(light ? lighten(colors[0], 0.16) : darken(colors[1], 0.22), rng.range(0.18, 0.34));
    ctx.lineWidth = bandHeight * rng.range(0.55, 0.95);
    ctx.beginPath();
    ctx.moveTo(-width * 0.1, y);
    ctx.lineTo(width * 1.1, y + slant);
    ctx.stroke();
  }
  ctx.restore();
}

/* ============================================================
 * 四、场景渲染器
 * ============================================================ */

/* ---------------- 群山：四层山脊 + 湖面倒影 ---------------- */

interface MountainPalette {
  sky: readonly GradientStop[];
  cloud: RGB;
  haze: RGB;
  sunCore: RGB;
  sunHalo: RGB;
  ridges: readonly [
    readonly [RGB, RGB],
    readonly [RGB, RGB],
    readonly [RGB, RGB],
    readonly [RGB, RGB],
  ];
  rim: RGB;
  snow: RGB;
  pine: RGB;
  reed: RGB;
  water: RGB;
}

const MOUNTAIN_PALETTES: readonly MountainPalette[] = [
  {
    sky: [
      [0, "#3b4a7a"],
      [0.4, "#776c9d"],
      [0.73, "#c397b5"],
      [1, "#f3c9b3"],
    ],
    cloud: [243, 217, 214],
    haze: [220, 188, 195],
    sunCore: [255, 233, 207],
    sunHalo: [255, 180, 137],
    ridges: [
      [
        [154, 163, 196],
        [124, 133, 170],
      ],
      [
        [116, 124, 158],
        [88, 97, 132],
      ],
      [
        [70, 80, 108],
        [52, 60, 86],
      ],
      [
        [38, 45, 68],
        [24, 29, 47],
      ],
    ],
    rim: [245, 226, 218],
    snow: [244, 236, 232],
    pine: [27, 35, 56],
    reed: [30, 41, 52],
    water: [43, 53, 82],
  },
  {
    sky: [
      [0, "#463d6b"],
      [0.42, "#8a5f87"],
      [0.76, "#d58f99"],
      [1, "#ffc29b"],
    ],
    cloud: [246, 207, 199],
    haze: [227, 179, 181],
    sunCore: [255, 220, 184],
    sunHalo: [255, 157, 125],
    ridges: [
      [
        [176, 142, 166],
        [144, 112, 143],
      ],
      [
        [128, 95, 126],
        [103, 74, 105],
      ],
      [
        [78, 58, 90],
        [58, 42, 71],
      ],
      [
        [42, 32, 56],
        [26, 20, 38],
      ],
    ],
    rim: [255, 228, 211],
    snow: [247, 230, 223],
    pine: [29, 26, 43],
    reed: [36, 28, 41],
    water: [56, 43, 72],
  },
  {
    sky: [
      [0, "#1f3d61"],
      [0.45, "#5f86a8"],
      [0.78, "#aec9d9"],
      [1, "#eae3d6"],
    ],
    cloud: [242, 245, 242],
    haze: [195, 214, 222],
    sunCore: [255, 246, 224],
    sunHalo: [215, 234, 245],
    ridges: [
      [
        [164, 186, 204],
        [131, 157, 181],
      ],
      [
        [114, 140, 166],
        [88, 115, 143],
      ],
      [
        [67, 91, 118],
        [50, 71, 96],
      ],
      [
        [34, 52, 72],
        [22, 35, 52],
      ],
    ],
    rim: [242, 246, 245],
    snow: [244, 247, 247],
    pine: [24, 37, 49],
    reed: [27, 40, 48],
    water: [34, 56, 75],
  },
  {
    sky: [
      [0, "#3b3768"],
      [0.4, "#795986"],
      [0.72, "#cf8a84"],
      [1, "#ffd09a"],
    ],
    cloud: [246, 211, 195],
    haze: [229, 181, 169],
    sunCore: [255, 232, 194],
    sunHalo: [255, 178, 111],
    ridges: [
      [
        [172, 146, 178],
        [142, 116, 151],
      ],
      [
        [124, 98, 133],
        [100, 78, 109],
      ],
      [
        [76, 59, 88],
        [57, 44, 68],
      ],
      [
        [42, 33, 53],
        [27, 21, 35],
      ],
    ],
    rim: [255, 230, 205],
    snow: [248, 233, 222],
    pine: [32, 26, 43],
    reed: [38, 29, 38],
    water: [52, 43, 68],
  },
];

function renderMountains(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(MOUNTAIN_PALETTES, spec.variant);
  const horizon = height * (0.615 + (spec.variant % 3) * 0.012);
  const sunX = width * (0.64 - (spec.variant % 2) * 0.26 + (spec.variant === 2 ? 0.06 : 0));
  const sunY = horizon - height * (0.28 - (spec.variant % 3) * 0.03);
  const peakScale = [0.44, 0.35, 0.26, 0.16];

  drawWaterScene(
    ctx,
    width,
    height,
    rng,
    {
      horizon,
      reflectionAlpha: 0.56,
      tint: palette.water,
      strips: 8,
      ripple: palette.rim,
      shimmer: 0.12,
      shimmerX: sunX,
      shimmerColor: palette.sunCore,
    },
    (above) => {
      paintSky(above, width, horizon, palette.sky);
      above.save();
      above.globalCompositeOperation = "lighter";
      glow(above, sunX, sunY, height * 0.3, palette.sunHalo, 0.32);
      above.restore();
      paintSun(above, sunX, sunY, height * 0.042, palette.sunCore, palette.sunHalo);
      softCloudBand(above, width, horizon * 0.32, height * 0.1, rng, palette.cloud, 0.16, 4);
      softCloudBand(above, width, horizon * 0.55, height * 0.07, rng, palette.cloud, 0.12, 3);

      for (let i = 0; i < 4; i++) {
        const layer = palette.ridges[i];
        drawRidge(above, width, rng, {
          baseY: horizon,
          bottom: horizon + height * 0.03,
          peak: height * peakScale[i],
          colors: layer,
          rim: i < 2 ? palette.rim : undefined,
          snow: i >= 1 ? palette.snow : undefined,
          steps: 38 + i * 8,
          roughness: 0.74 - i * 0.07,
        });
        if (i < 3) {
          paintMistBand(
            above,
            width,
            horizon - height * (0.1 + i * 0.02),
            height * 0.16,
            palette.haze,
            0.2 - i * 0.03,
          );
        }
      }

      drawPineRow(above, width, horizon + height * 0.004, 26, height * 0.024, height * 0.06, rgba(palette.pine, 0.92), rng, height * 0.004);
      drawPineRow(above, width, horizon + height * 0.008, 10, height * 0.055, height * 0.12, rgba(palette.pine, 0.96), rng, height * 0.008);
      drawPineRow(above, width, horizon + height * 0.012, 4, height * 0.11, height * 0.19, rgba(palette.pine, 0.98), rng, height * 0.012);
      drawReeds(above, width, horizon, 30, rgba(palette.reed, 0.75), rng);
    },
  );

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    glow(ctx, sunX + rng.range(-0.05, 0.05) * width, horizon + height * (0.16 + i * 0.14), width * 0.16, palette.sunCore, 0.035);
  }
  ctx.restore();
}

/* ---------------- 极光：竖向光幕 + 湖面倒影 ---------------- */

interface AuroraPalette {
  skyTop: RGB;
  skyMid: RGB;
  skyBottom: RGB;
  aurora: readonly [RGB, RGB, RGB];
  ridge: readonly [RGB, RGB];
  water: RGB;
  mist: RGB;
}

const AURORA_PALETTES: readonly AuroraPalette[] = [
  {
    skyTop: [3, 6, 14],
    skyMid: [6, 15, 28],
    skyBottom: [10, 32, 42],
    aurora: [
      [86, 242, 164],
      [72, 220, 214],
      [138, 112, 255],
    ],
    ridge: [
      [14, 22, 38],
      [6, 10, 20],
    ],
    water: [9, 23, 36],
    mist: [60, 120, 130],
  },
  {
    skyTop: [4, 4, 16],
    skyMid: [8, 10, 30],
    skyBottom: [14, 24, 48],
    aurora: [
      [120, 255, 170],
      [110, 150, 255],
      [190, 120, 255],
    ],
    ridge: [
      [16, 16, 34],
      [6, 6, 16],
    ],
    water: [12, 18, 38],
    mist: [82, 94, 166],
  },
];

function renderAurora(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(AURORA_PALETTES, spec.variant);
  const horizon = height * 0.63;
  const bandCount = 60;

  drawWaterScene(
    ctx,
    width,
    height,
    rng,
    {
      horizon,
      reflectionAlpha: 0.5,
      tint: palette.water,
      strips: 8,
      ripple: palette.aurora[1],
      shimmer: 0.34,
      shimmerX: width * 0.5,
      shimmerColor: palette.aurora[0],
    },
    (above) => {
      paintSky(above, width, horizon, [
        [0, rgba(palette.skyTop, 1)],
        [0.62, rgba(palette.skyMid, 1)],
        [1, rgba(palette.skyBottom, 1)],
      ]);

      above.save();
      above.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        glow(above, width * (0.14 + i * 0.22), horizon * 0.52, height * 0.26, palette.aurora[i % 3], 0.1);
      }
      above.lineCap = "round";
      for (let i = 0; i < bandCount; i++) {
        const progress = i / (bandCount - 1);
        const x = width * (0.03 + progress * 0.94) + rng.range(-9, 9);
        const topY = height * (0.03 + 0.13 * (0.5 + 0.5 * Math.sin(progress * Math.PI * 2 + 0.8))) + rng.range(-10, 18);
        const lowY = horizon - height * rng.range(0.01, 0.07);
        const lineWidth = rng.range(3, 12);
        const color = i % 9 === 0 ? palette.aurora[2] : i % 4 === 0 ? palette.aurora[1] : palette.aurora[0];
        const alpha = rng.range(0.06, 0.24);
        above.strokeStyle = rgba(color, alpha);
        above.lineWidth = lineWidth;
        above.beginPath();
        above.moveTo(x, topY);
        above.bezierCurveTo(
          x + rng.range(-40, 40),
          topY + (lowY - topY) * 0.3,
          x + rng.range(-55, 55),
          topY + (lowY - topY) * 0.66,
          x + rng.range(-38, 38),
          lowY,
        );
        above.stroke();
      }
      // 地平线附近更亮的绿色帘幕下缘
      for (let i = 0; i < 22; i++) {
        const x = width * rng.range(0.03, 0.97);
        const alpha = rng.range(0.05, 0.16);
        above.strokeStyle = rgba(palette.aurora[0], alpha);
        above.lineWidth = rng.range(3, 12);
        above.beginPath();
        above.moveTo(x, horizon - height * rng.range(0.02, 0.16));
        above.lineTo(x + rng.range(-4, 4), horizon + 1);
        above.stroke();
      }
      above.restore();

      // 用天空色把光带顶端柔化，替代逐条渐变的开销
      above.fillStyle = linearGradient(above, 0, 0, 0, horizon * 0.62, [
        [0, rgba(palette.skyTop, 0.9)],
        [0.45, rgba(palette.skyTop, 0.42)],
        [1, rgba(palette.skyTop, 0)],
      ]);
      above.fillRect(0, 0, width, horizon * 0.62);
      paintStars(above, width, horizon * 0.96, 150, rng);

      // 贴近山脊的绿色低空辉光
      above.save();
      above.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        glow(above, width * (0.2 + i * 0.3), horizon - height * 0.05, width * 0.3, palette.aurora[0], 0.14);
      }
      above.restore();

      drawRidge(above, width, rng, {
        baseY: horizon + height * 0.005,
        bottom: horizon + height * 0.05,
        peak: height * 0.19,
        colors: palette.ridge,
        rim: palette.mist,
        steps: 30,
        roughness: 0.82,
      });
      drawRidge(above, width, rng, {
        baseY: horizon + height * 0.014,
        bottom: horizon + height * 0.035,
        peak: height * 0.1,
        colors: [darken(palette.ridge[0], 0.25), palette.ridge[1]],
        steps: 34,
        roughness: 0.95,
      });
      drawPineRow(above, width, horizon + height * 0.02, 14, height * 0.02, height * 0.055, "rgba(4, 8, 14, 0.95)", rng, height * 0.004);
    },
  );
}

/* ---------------- 花：竖幅微距 + 绿色散景 ---------------- */

interface FlowerPalette {
  bgTop: RGB;
  bgMid: RGB;
  bgBottom: RGB;
  bokeh: readonly RGB[];
  petalInner: RGB;
  petalOuter: RGB;
  center: RGB;
  centerDark: RGB;
  stem: RGB;
  leaf: RGB;
  light: RGB;
}

const FLOWER_PALETTES: readonly FlowerPalette[] = [
  {
    bgTop: [22, 45, 28],
    bgMid: [44, 79, 42],
    bgBottom: [92, 124, 60],
    bokeh: [
      [214, 235, 150],
      [150, 200, 120],
      [240, 225, 170],
    ],
    petalInner: [224, 202, 250],
    petalOuter: [116, 82, 180],
    center: [250, 210, 92],
    centerDark: [176, 120, 38],
    stem: [58, 92, 48],
    leaf: [74, 112, 52],
    light: [255, 238, 180],
  },
  {
    bgTop: [34, 42, 26],
    bgMid: [66, 84, 44],
    bgBottom: [120, 138, 74],
    bokeh: [
      [236, 226, 156],
      [198, 218, 138],
      [246, 208, 196],
    ],
    petalInner: [252, 206, 236],
    petalOuter: [178, 76, 140],
    center: [250, 206, 96],
    centerDark: [172, 112, 40],
    stem: [62, 94, 50],
    leaf: [82, 116, 56],
    light: [255, 232, 190],
  },
  {
    bgTop: [18, 34, 42],
    bgMid: [40, 68, 58],
    bgBottom: [96, 118, 74],
    bokeh: [
      [200, 226, 220],
      [154, 200, 180],
      [236, 226, 178],
    ],
    petalInner: [212, 228, 255],
    petalOuter: [86, 110, 190],
    center: [248, 212, 104],
    centerDark: [166, 118, 44],
    stem: [54, 88, 54],
    leaf: [70, 110, 62],
    light: [230, 240, 250],
  },
];

function renderFlower(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(FLOWER_PALETTES, spec.variant);
  paintSky(ctx, width, height, [
    [0, rgba(palette.bgTop, 1)],
    [0.52, rgba(palette.bgMid, 1)],
    [1, rgba(palette.bgBottom, 1)],
  ]);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, width * 0.74, height * 0.12, width * 0.55, palette.light, 0.18);
  ctx.restore();

  paintBokeh(ctx, width, height, 20, palette.bokeh, rng, width * 0.045, width * 0.16);
  paintBokeh(ctx, width, height, 6, palette.bokeh, rng, width * 0.18, width * 0.3);

  // 背景中失焦的叶片
  for (let i = 0; i < 3; i++) {
    const x = rng.range(0, 1) * width;
    const y = rng.range(0.55, 1) * height;
    const radius = width * rng.range(0.16, 0.3);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(darken(palette.leaf, 0.35), 0.22));
    gradient.addColorStop(1, rgba(darken(palette.leaf, 0.35), 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }

  const flowerX = width * 0.5;
  const flowerY = height * 0.4;
  const flowerRadius = height * 0.155;
  const stemTop = flowerY + flowerRadius * 0.28;

  // 主茎
  ctx.save();
  ctx.strokeStyle = rgba(palette.stem, 1);
  ctx.lineCap = "round";
  ctx.lineWidth = width * 0.012;
  ctx.beginPath();
  ctx.moveTo(width * 0.54, height * 1.02);
  ctx.bezierCurveTo(width * 0.46, height * 0.78, width * 0.56, height * 0.58, flowerX, stemTop);
  ctx.stroke();
  ctx.strokeStyle = rgba(lighten(palette.leaf, 0.2), 0.4);
  ctx.lineWidth = width * 0.003;
  ctx.beginPath();
  ctx.moveTo(width * 0.545, height * 1.01);
  ctx.bezierCurveTo(width * 0.468, height * 0.78, width * 0.566, height * 0.58, flowerX + width * 0.004, stemTop);
  ctx.stroke();
  ctx.restore();

  drawLeaf(ctx, width * 0.49, height * 0.75, height * 0.22, width * 0.055, -0.55, palette.leaf);
  drawLeaf(ctx, width * 0.53, height * 0.62, height * 0.17, width * 0.045, 0.7, lighten(palette.leaf, 0.08));

  drawFlowerHead(
    ctx,
    flowerX,
    flowerY,
    flowerRadius,
    {
      petalInner: palette.petalInner,
      petalOuter: palette.petalOuter,
      center: palette.center,
      centerDark: palette.centerDark,
      petals: 7,
    },
    0.32,
  );

  // 侧边的小花苞
  const budX = width * 0.76;
  const budY = height * 0.63;
  const budRadius = height * 0.05;
  ctx.strokeStyle = rgba(palette.stem, 0.95);
  ctx.lineWidth = width * 0.004;
  ctx.beginPath();
  ctx.moveTo(width * 0.58, height * 0.93);
  ctx.quadraticCurveTo(budX - width * 0.04, height * 0.8, budX, budY + budRadius * 0.3);
  ctx.stroke();
  drawFlowerHead(
    ctx,
    budX,
    budY,
    budRadius,
    {
      petalInner: palette.petalInner,
      petalOuter: darken(palette.petalOuter, 0.08),
      center: palette.center,
      centerDark: palette.centerDark,
      petals: 6,
      alpha: 0.92,
    },
    0.9,
  );

  paintBokeh(ctx, width, height, 8, palette.bokeh, rng, width * 0.1, width * 0.24);
}

/* ---------------- 薰衣草田 / 玉米田：透视垄沟 ---------------- */

interface FieldPalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  /** 垄沟的三种颜色 */
  rows: readonly [RGB, RGB, RGB];
  /** 垄沟之间的土地底色 */
  base: RGB;
  sunlit: RGB;
  haze: RGB;
  texture: RGB;
  crown: RGB;
  trunk: RGB;
  stalk: RGB;
}

const LAVENDER_PALETTES: readonly FieldPalette[] = [
  {
    sky: [
      [0, "#8b8fc4"],
      [0.55, "#e7b9c4"],
      [1, "#ffd29a"],
    ],
    sunCore: [255, 240, 204],
    sunHalo: [255, 186, 131],
    rows: [
      [86, 66, 118],
      [96, 74, 128],
      [108, 84, 142],
    ],
    base: [82, 62, 112],
    sunlit: [190, 166, 214],
    haze: [244, 198, 190],
    texture: [178, 144, 212],
    crown: [72, 58, 82],
    trunk: [52, 42, 60],
    stalk: [84, 62, 118],
  },
  {
    sky: [
      [0, "#4c4a80"],
      [0.5, "#a9749a"],
      [1, "#f7b98d"],
    ],
    sunCore: [255, 224, 184],
    sunHalo: [255, 156, 112],
    rows: [
      [68, 52, 102],
      [78, 60, 114],
      [90, 70, 126],
    ],
    base: [64, 50, 94],
    sunlit: [178, 146, 196],
    haze: [222, 160, 150],
    texture: [160, 124, 188],
    crown: [56, 44, 66],
    trunk: [40, 32, 48],
    stalk: [66, 48, 92],
  },
];

function renderLavender(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(LAVENDER_PALETTES, spec.variant);
  const horizon = height * (0.47 + (spec.variant % 2) * 0.02);
  paintSky(ctx, width, horizon + 1, palette.sky);
  glow(ctx, width * 0.64, horizon - height * 0.03, height * 0.36, palette.sunHalo, 0.3);
  paintSun(ctx, width * 0.64, horizon - height * 0.04, height * 0.026, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, horizon * 0.36, height * 0.08, rng, lighten(palette.haze, 0.3), 0.16, 6);

  // 远处的丘陵与树线
  drawRidge(ctx, width, rng, {
    baseY: horizon + 2,
    bottom: horizon + height * 0.05,
    peak: height * 0.06,
    colors: [mix(palette.rows[0], palette.haze, 0.62), mix(palette.rows[0], palette.haze, 0.3)],
    steps: 26,
    roughness: 0.45,
  });
  drawRidge(ctx, width, rng, {
    baseY: horizon + 3,
    bottom: horizon + height * 0.04,
    peak: height * 0.032,
    colors: [mix(palette.rows[1], palette.haze, 0.45), mix(palette.rows[1], palette.haze, 0.18)],
    steps: 28,
    roughness: 0.6,
  });

  paintPerspectiveField(ctx, width, height, rng, {
    horizon,
    colors: palette.rows,
    base: palette.base,
    sunlit: palette.sunlit,
    haze: palette.haze,
    rows: 18,
    rowSpacing: 0.1,
    rowWidth: 0.12,
    texture: palette.texture,
    textureCount: 420,
    textureHeight: 0.005,
    textureShape: "dot",
  });

  drawLoneTree(
    ctx,
    width * (spec.variant === 0 ? 0.27 : 0.72),
    horizon + height * 0.004,
    height * 0.155,
    palette.crown,
    palette.trunk,
    rng,
  );

  // 近景花穗纹理
  for (let i = 0; i < 80; i++) {
    const x = rng.range(0, 1) * width;
    const y = height * rng.range(0.86, 1.02);
    const size = height * rng.range(0.004, 0.012);
    ctx.fillStyle = rgba(lighten(palette.rows[2], rng.range(0, 0.25)), rng.range(0.15, 0.42));
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.5, size, 0, 0, TAU);
    ctx.fill();
  }

  // 前景虚化的花穗
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 18; i++) {
    const x = rng.range(0, 1) * width;
    const y = rng.range(0.9, 1.02) * height;
    const radius = height * rng.range(0.015, 0.04);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(lighten(palette.rows[2], 0.25), rng.range(0.08, 0.18)));
    gradient.addColorStop(1, rgba(palette.rows[2], 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  // 前景压暗，拉开层次
  ctx.fillStyle = linearGradient(ctx, 0, height * 0.9, 0, height, [
    [0, rgba(darken(palette.base, 0.2), 0)],
    [1, rgba(darken(palette.base, 0.45), 0.48)],
  ]);
  ctx.fillRect(0, height * 0.9, width, height * 0.1);
}

const CORN_PALETTES: readonly FieldPalette[] = [
  {
    sky: [
      [0, "#5c3f63"],
      [0.48, "#b5655f"],
      [1, "#f6b36a"],
    ],
    sunCore: [255, 230, 176],
    sunHalo: [255, 158, 92],
    rows: [
      [146, 100, 50],
      [152, 106, 54],
      [158, 112, 58],
    ],
    base: [142, 96, 48],
    sunlit: [220, 180, 116],
    haze: [232, 158, 110],
    texture: [170, 132, 70],
    crown: [66, 46, 42],
    trunk: [48, 34, 32],
    stalk: [120, 84, 38],
  },
  {
    sky: [
      [0, "#4c4a6e"],
      [0.46, "#a06f70"],
      [1, "#f0c078"],
    ],
    sunCore: [255, 244, 202],
    sunHalo: [255, 188, 110],
    rows: [
      [150, 106, 48],
      [162, 118, 56],
      [176, 130, 66],
    ],
    base: [156, 112, 54],
    sunlit: [226, 188, 122],
    haze: [238, 186, 126],
    texture: [186, 146, 80],
    crown: [62, 50, 44],
    trunk: [46, 36, 30],
    stalk: [132, 94, 44],
  },
];

function renderCorn(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(CORN_PALETTES, spec.variant);
  const horizon = height * (0.46 + (spec.variant % 2) * 0.015);
  paintSky(ctx, width, horizon + 1, palette.sky);
  glow(ctx, width * 0.5, horizon - height * 0.04, height * 0.34, palette.sunHalo, 0.34);
  paintSun(ctx, width * 0.5, horizon - height * 0.055, height * 0.03, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, horizon * 0.4, height * 0.09, rng, lighten(palette.haze, 0.35), 0.18, 7);

  // 远处的丘陵
  drawRidge(ctx, width, rng, {
    baseY: horizon + 2,
    bottom: horizon + height * 0.06,
    peak: height * 0.05,
    colors: [mix(palette.base, palette.haze, 0.5), mix(palette.base, palette.haze, 0.2)],
    steps: 24,
    roughness: 0.4,
  });

  paintPerspectiveField(ctx, width, height, rng, {
    horizon,
    colors: palette.rows,
    base: palette.base,
    sunlit: palette.sunlit,
    haze: palette.haze,
    rows: 28,
    rowSpacing: 0.038,
    rowWidth: 0.037,
    texture: palette.texture,
    textureCount: 300,
    textureHeight: 0.03,
    textureShape: "line",
  });

  drawLoneTree(ctx, width * 0.3, horizon + height * 0.004, height * 0.145, palette.crown, palette.trunk, rng);

  // 近景玉米秆
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < 34; i++) {
    const x = rng.range(-0.02, 1.02) * width;
    const baseY = height * rng.range(0.95, 1.04);
    const stalk = height * rng.range(0.1, 0.28);
    ctx.strokeStyle = rgba(palette.stalk, rng.range(0.5, 0.85));
    ctx.lineWidth = Math.max(1, width * 0.002);
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(
      x + rng.range(-0.01, 0.01) * width,
      baseY - stalk * 0.6,
      x + rng.range(-0.02, 0.02) * width,
      baseY - stalk,
    );
    ctx.stroke();
    drawLeaf(ctx, x, baseY - stalk * 0.55, height * 0.065, width * 0.013, rng.range(-1.3, 1.3), darken(palette.rows[2], 0.25), 0.6);
  }
  ctx.restore();

  ctx.fillStyle = linearGradient(ctx, 0, height * 0.92, 0, height, [
    [0, rgba(darken(palette.base, 0.2), 0)],
    [1, rgba(darken(palette.base, 0.4), 0.35)],
  ]);
  ctx.fillRect(0, height * 0.92, width, height * 0.08);
}

/* ---------------- 海滩：青绿海水 + 棕榈剪影 ---------------- */

interface BeachPalette {
  sky: readonly GradientStop[];
  cloud: RGB;
  seaTop: RGB;
  seaMid: RGB;
  seaDeep: RGB;
  foam: RGB;
  sandTop: RGB;
  sandBottom: RGB;
  speck: RGB;
  palm: string;
  haze: RGB;
}

const BEACH_PALETTES: readonly BeachPalette[] = [
  {
    sky: [
      [0, "#8fc8e8"],
      [0.6, "#d8ecf4"],
      [1, "#f7f0dd"],
    ],
    cloud: [255, 255, 255],
    seaTop: [95, 214, 207],
    seaMid: [23, 117, 168],
    seaDeep: [11, 79, 125],
    foam: [248, 253, 251],
    sandTop: [238, 218, 180],
    sandBottom: [216, 189, 147],
    speck: [150, 120, 82],
    palm: "#173b3c",
    haze: [230, 244, 241],
  },
  {
    sky: [
      [0, "#6d6fa4"],
      [0.55, "#e6aab0"],
      [1, "#ffd7a8"],
    ],
    cloud: [255, 226, 210],
    seaTop: [120, 198, 198],
    seaMid: [48, 105, 158],
    seaDeep: [28, 56, 104],
    foam: [255, 244, 229],
    sandTop: [230, 198, 162],
    sandBottom: [198, 158, 122],
    speck: [126, 92, 66],
    palm: "#2b2436",
    haze: [246, 206, 186],
  },
];

function renderBeach(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(BEACH_PALETTES, spec.variant);
  const skyBottom = height * 0.29;
  const seaBottom = height * 0.71;
  const wetBottom = height * 0.79;
  const seaHeight = seaBottom - skyBottom;

  paintSky(ctx, width, skyBottom, palette.sky);
  glow(ctx, width * 0.78, skyBottom * 0.32, width * 0.34, lighten(palette.cloud, 0.2), 0.28);
  softCloudBand(ctx, width, skyBottom * 0.5, height * 0.09, rng, palette.cloud, 0.2, 5);

  // 海：远处深蓝，靠近岸边逐渐变为青绿
  ctx.fillStyle = linearGradient(ctx, 0, skyBottom, 0, seaBottom, [
    [0, rgba(palette.seaDeep, 1)],
    [0.4, rgba(palette.seaMid, 1)],
    [0.78, rgba(mix(palette.seaMid, palette.seaTop, 0.75), 1)],
    [1, rgba(palette.seaTop, 1)],
  ]);
  ctx.fillRect(0, skyBottom, width, seaHeight);

  // 远处海平线
  ctx.fillStyle = rgba(lighten(palette.seaTop, 0.45), 0.5);
  ctx.fillRect(0, skyBottom - 1, width, 2);

  // 远处小岛
  ctx.fillStyle = rgba(darken(palette.seaMid, 0.42), 0.26);
  ctx.beginPath();
  ctx.ellipse(width * 0.17, skyBottom + height * 0.004, width * 0.04, height * 0.009, 0, 0, TAU);
  ctx.fill();

  // 细碎浪花：断续的柔和曲线
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let wave = 0; wave < 7; wave++) {
    const progress = (wave + 1) / 7;
    const y = skyBottom + seaHeight * (0.3 + progress * 0.62);
    const thickness = 1 + progress * 3.5;
    const alpha = 0.05 + progress * 0.22;
    ctx.strokeStyle = rgba(palette.foam, alpha);
    ctx.lineWidth = thickness;
    let x = -width * rng.range(0.05, 0.25);
    const segments = 2 + rng.int(0, 2);
    for (let s = 0; s < segments; s++) {
      const segmentLength = width * rng.range(0.18, 0.38);
      const yOffset = rng.range(-0.012, 0.012) * height;
      const amplitude = height * (0.003 + progress * 0.007);
      const phase = rng.range(0, TAU);
      ctx.beginPath();
      ctx.moveTo(x, y + yOffset);
      for (let step = 1; step <= 12; step++) {
        const t = step / 12;
        ctx.lineTo(
          x + segmentLength * t,
          y + yOffset + Math.sin(t * Math.PI * 1.1 + phase) * amplitude * Math.sin(t * Math.PI),
        );
      }
      ctx.stroke();
      x += segmentLength + width * rng.range(0.02, 0.09);
      if (x > width + width * 0.1) break;
    }
  }
  ctx.restore();

  // 湿沙
  ctx.fillStyle = linearGradient(ctx, 0, seaBottom, 0, wetBottom, [
    [0, rgba(darken(palette.sandBottom, 0.32), 1)],
    [0.55, rgba(mix(palette.sandTop, palette.sandBottom, 0.6), 1)],
    [1, rgba(palette.sandTop, 1)],
  ]);
  ctx.fillRect(0, seaBottom, width, wetBottom - seaBottom);

  // 干沙
  ctx.fillStyle = linearGradient(ctx, 0, wetBottom, 0, height, [
    [0, rgba(palette.sandTop, 1)],
    [0.6, rgba(mix(palette.sandTop, palette.sandBottom, 0.35), 1)],
    [1, rgba(palette.sandBottom, 1)],
  ]);
  ctx.fillRect(0, wetBottom, width, height - wetBottom);

  // 沙滩颗粒
  for (let i = 0; i < 240; i++) {
    const y = rng.range(seaBottom + height * 0.01, height);
    const progress = (y - seaBottom) / (height - seaBottom);
    const x = rng.range(0, width);
    const radius = (0.5 + rng.next() * 1.5) * (0.7 + progress * 0.9);
    ctx.fillStyle = rng.chance(0.58)
      ? rgba(palette.speck, rng.range(0.06, 0.24) * (0.5 + progress * 0.5))
      : rgba(lighten(palette.sandTop, 0.5), rng.range(0.12, 0.4));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  // 潮线
  ctx.strokeStyle = rgba(palette.speck, 0.1);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let x = 0; x <= width; x += width * 0.05) {
    const y = height * 0.86 + Math.sin((x / width) * Math.PI * 2.3 + 0.6) * height * 0.012;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 拍岸泡沫：沿水线散布的椭圆斑块 + 一道亮白浪沿
  ctx.save();
  const shoreY = (t: number): number =>
    seaBottom +
    Math.sin(t * Math.PI * 3.1 + 1.4) * height * 0.013 +
    Math.sin(t * Math.PI * 7.3) * height * 0.005;

  // 泡沫下缘的湿沙阴影
  ctx.fillStyle = rgba(darken(palette.sandBottom, 0.28), 0.22);
  ctx.beginPath();
  ctx.moveTo(0, shoreY(0) + height * 0.012);
  for (let i = 1; i <= 40; i++) {
    const t = i / 40;
    ctx.lineTo(t * width, shoreY(t) + height * 0.018);
  }
  ctx.lineTo(width, height * 0.8);
  ctx.lineTo(0, height * 0.8);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 48; i++) {
    const t = rng.next();
    if (rng.chance(0.18)) continue;
    const x = t * width + rng.range(-0.015, 0.015) * width;
    const y = shoreY(t) + rng.range(-0.014, 0.006) * height;
    const rx = width * rng.range(0.02, 0.055);
    const ry = height * rng.range(0.003, 0.009);
    ctx.fillStyle = rgba(palette.foam, rng.range(0.22, 0.5));
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rng.range(-0.06, 0.06), 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = rgba(lighten(palette.foam, 0.3), 0.6);
  ctx.lineWidth = Math.max(1, height * 0.0024);
  ctx.beginPath();
  for (let i = 0; i <= 44; i++) {
    const t = i / 44;
    const x = t * width;
    const y = shoreY(t) - height * 0.008;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // 水线后方零散的泡沫
  for (let i = 0; i < 18; i++) {
    const x = rng.range(0, 1) * width;
    const y = seaBottom - rng.range(0.02, 0.09) * height;
    ctx.fillStyle = rgba(palette.foam, rng.range(0.12, 0.3));
    ctx.beginPath();
    ctx.ellipse(x, y, width * rng.range(0.005, 0.018), height * rng.range(0.0015, 0.0035), 0, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  // 湿沙上的天空反光
  ctx.fillStyle = rgba(lighten(palette.foam, 0.1), 0.12);
  ctx.beginPath();
  ctx.ellipse(width * 0.42, seaBottom + height * 0.025, width * 0.28, height * 0.007, 0, 0, TAU);
  ctx.fill();

  // 棕榈剪影
  const palmX = width * (0.79 + (spec.variant % 2) * 0.02);
  const palmBase = wetBottom + height * 0.03;
  const palmHeight = height * 0.64;
  ctx.fillStyle = rgba(BLACK, 0.14);
  ctx.beginPath();
  ctx.ellipse(palmX + palmHeight * 0.04, palmBase + height * 0.008, palmHeight * 0.16, height * 0.011, -0.08, 0, TAU);
  ctx.fill();
  drawPalm(ctx, palmX, palmBase, palmHeight, palette.palm);
}

/* ---------------- 沙丘：多层平滑曲线 + 单向受光 ---------------- */

interface DunePalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  haze: RGB;
  layers: readonly (readonly [RGB, RGB, RGB])[];
}

const DUNE_PALETTES: readonly DunePalette[] = [
  {
    sky: [
      [0, "#a9bcd6"],
      [0.55, "#efd3c3"],
      [1, "#fbe4c9"],
    ],
    sunCore: [255, 241, 210],
    sunHalo: [255, 196, 140],
    haze: [240, 200, 172],
    layers: [
      [
        [224, 170, 128],
        [190, 130, 96],
        [250, 214, 180],
      ],
      [
        [214, 150, 104],
        [170, 106, 74],
        [246, 200, 160],
      ],
      [
        [198, 128, 84],
        [144, 82, 56],
        [240, 184, 142],
      ],
      [
        [176, 106, 68],
        [116, 62, 44],
        [232, 166, 122],
      ],
      [
        [146, 82, 54],
        [88, 44, 34],
        [220, 146, 106],
      ],
    ],
  },
  {
    sky: [
      [0, "#b7c9dc"],
      [0.6, "#f3decb"],
      [1, "#fdf0d8"],
    ],
    sunCore: [255, 249, 228],
    sunHalo: [255, 226, 178],
    haze: [246, 218, 190],
    layers: [
      [
        [226, 188, 146],
        [198, 156, 118],
        [252, 230, 196],
      ],
      [
        [214, 170, 126],
        [180, 136, 98],
        [250, 220, 184],
      ],
      [
        [198, 150, 108],
        [158, 112, 80],
        [246, 210, 170],
      ],
      [
        [176, 126, 88],
        [134, 90, 64],
        [238, 194, 152],
      ],
      [
        [148, 100, 70],
        [104, 66, 46],
        [226, 172, 130],
      ],
    ],
  },
];

function renderDunes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(DUNE_PALETTES, spec.variant);
  const horizon = height * 0.44;
  paintSky(ctx, width, horizon + height * 0.02, palette.sky);
  ctx.fillStyle = rgba(palette.layers[0][1], 1);
  ctx.fillRect(0, horizon, width, height - horizon);
  const sunX = width * (0.3 + (spec.variant % 2) * 0.4);
  glow(ctx, sunX, horizon - height * 0.12, height * 0.34, palette.sunHalo, 0.3);
  paintSun(ctx, sunX, horizon - height * 0.14, height * 0.024, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, horizon * 0.45, height * 0.08, rng, lighten(palette.haze, 0.4), 0.14, 5);

  for (let i = 0; i < palette.layers.length; i++) {
    const layer = palette.layers[i];
    const baseY = height * (0.46 + i * 0.115);
    const amplitude = height * (0.03 + i * 0.008);
    drawDuneLayer(ctx, width, height, rng, baseY, amplitude, layer[0], layer[1], layer[2]);
    if (i === palette.layers.length - 2) {
      paintMistBand(ctx, width, baseY - height * 0.03, height * 0.1, palette.haze, 0.18);
    }
  }
  paintMistBand(ctx, width, horizon + height * 0.02, height * 0.09, palette.haze, 0.26);

  // 前景风痕
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < 24; i++) {
    const t = rng.next();
    const y = height * (0.62 + t * 0.36);
    const x = rng.range(-0.05, 0.9) * width;
    const length = width * rng.range(0.06, 0.24);
    ctx.strokeStyle = rgba(palette.layers[4][2], rng.range(0.06, 0.16));
    ctx.lineWidth = Math.max(0.8, height * rng.range(0.0012, 0.003));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + length * 0.5, y - height * 0.008, x + length, y);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- 森林：多层松树 + 丁达尔光柱 ---------------- */

interface ForestPalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  fog: RGB;
  trees: readonly [RGB, RGB, RGB, RGB];
  groundTop: RGB;
  groundBottom: RGB;
  rays: RGB;
}

const FOREST_PALETTES: readonly ForestPalette[] = [
  {
    sky: [
      [0, "#dfe8de"],
      [0.5, "#c6d7c6"],
      [1, "#f2eed8"],
    ],
    sunCore: [255, 252, 224],
    sunHalo: [252, 240, 178],
    fog: [231, 239, 224],
    trees: [
      [142, 160, 142],
      [106, 128, 110],
      [72, 94, 78],
      [38, 56, 46],
    ],
    groundTop: [74, 88, 62],
    groundBottom: [30, 40, 30],
    rays: [255, 248, 206],
  },
  {
    sky: [
      [0, "#e8dcc2"],
      [0.48, "#ddc9a6"],
      [1, "#f8e6bf"],
    ],
    sunCore: [255, 244, 205],
    sunHalo: [255, 210, 132],
    fog: [241, 227, 197],
    trees: [
      [156, 146, 118],
      [122, 112, 88],
      [84, 76, 58],
      [44, 40, 32],
    ],
    groundTop: [92, 78, 52],
    groundBottom: [34, 30, 22],
    rays: [255, 238, 184],
  },
];

function renderForest(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(FOREST_PALETTES, spec.variant);
  paintSky(ctx, width, height, palette.sky);
  const sunX = width * 0.5;
  const sunY = height * 0.3;
  glow(ctx, sunX, sunY, height * 0.42, palette.sunHalo, 0.42);
  paintSun(ctx, sunX, sunY, height * 0.022, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, height * 0.2, height * 0.12, rng, lighten(palette.fog, 0.2), 0.18, 6);

  const rows = [
    { baseY: height * 0.53, minH: height * 0.1, maxH: height * 0.17, count: 23, index: 0 },
    { baseY: height * 0.57, minH: height * 0.14, maxH: height * 0.23, count: 20, index: 1 },
    { baseY: height * 0.61, minH: height * 0.18, maxH: height * 0.28, count: 17, index: 2 },
    { baseY: height * 0.67, minH: height * 0.22, maxH: height * 0.36, count: 13, index: 3 },
  ];
  for (const row of rows) {
    drawPineRow(
      ctx,
      width,
      row.baseY,
      row.count,
      row.minH,
      row.maxH,
      rgba(palette.trees[row.index], 0.92),
      rng,
      height * 0.004,
    );
    paintMistBand(ctx, width, row.baseY - height * 0.05, height * 0.22, palette.fog, 0.2);
  }

  ctx.fillStyle = linearGradient(ctx, 0, height * 0.66, 0, height, [
    [0, rgba(palette.groundTop, 1)],
    [1, rgba(palette.groundBottom, 1)],
  ]);
  ctx.fillRect(0, height * 0.66, width, height * 0.34);
  ctx.fillStyle = rgba(lighten(palette.groundTop, 0.16), 0.35);
  ctx.fillRect(0, height * 0.66, width, height * 0.008);

  paintLightRays(ctx, sunX, sunY + height * 0.02, height * 1.1, 7, palette.rays, rng, 0.07);
  paintMistBand(ctx, width, height * 0.72, height * 0.20, palette.fog, 0.12);
}

/* ---------------- 日落海面：太阳光柱 + 暗色岬角 ---------------- */

interface SunsetPalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  seaTop: RGB;
  seaDeep: RGB;
  cloud: RGB;
  headland: RGB;
  rim: RGB;
  haze: RGB;
}

const SUNSET_PALETTES: readonly SunsetPalette[] = [
  {
    sky: [
      [0, "#514a70"],
      [0.34, "#8a5f7a"],
      [0.63, "#c9807a"],
      [0.82, "#eba078"],
      [1, "#f9cba0"],
    ],
    sunCore: [255, 240, 216],
    sunHalo: [255, 170, 118],
    seaTop: [92, 66, 82],
    seaDeep: [26, 22, 36],
    cloud: [244, 176, 150],
    headland: [36, 28, 42],
    rim: [226, 146, 128],
    haze: [255, 196, 150],
  },
  {
    sky: [
      [0, "#3f4568"],
      [0.38, "#7d5c80"],
      [0.68, "#c7898c"],
      [1, "#f6c3a0"],
    ],
    sunCore: [255, 233, 208],
    sunHalo: [255, 176, 140],
    seaTop: [94, 90, 120],
    seaDeep: [30, 32, 51],
    cloud: [246, 196, 178],
    headland: [42, 36, 54],
    rim: [220, 158, 152],
    haze: [255, 205, 172],
  },
];

/** 岬角 / 悬崖剪影：从画面外侧向水面探出，顶缘带一道受光 */
function paintHeadland(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizon: number,
  side: -1 | 1,
  innerX: number,
  topY: number,
  rng: Rng,
  color: RGB,
  rim: RGB,
): void {
  const outerX = side < 0 ? -4 : width + 4;
  const noise = createNoise1D(rng, 5);
  const points: Point[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(outerX, innerX, t);
    const y =
      topY +
      (horizon - topY) * Math.pow(t, 1.45) +
      (noise(t) - 0.5) * height * 0.045 * (1 - t * 0.4);
    points.push([x, y]);
  }
  const traceTop = (): void => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const point of points) ctx.lineTo(point[0], point[1]);
  };
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points) ctx.lineTo(point[0], point[1]);
  ctx.lineTo(innerX, horizon + height * 0.015);
  ctx.lineTo(outerX, horizon + height * 0.035);
  ctx.closePath();
  ctx.fillStyle = rgba(color, 1);
  ctx.fill();
  ctx.save();
  traceTop();
  ctx.strokeStyle = rgba(rim, 0.3);
  ctx.lineWidth = Math.max(1, height * 0.002);
  ctx.stroke();
  ctx.restore();
}

function renderSunsetSea(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(SUNSET_PALETTES, spec.variant);
  const horizon = height * 0.57;
  const sunX = width * (0.52 + (spec.variant % 2) * 0.06);
  const sunY = horizon - height * 0.06;

  paintSky(ctx, width, horizon + height * 0.01, palette.sky);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, sunX, sunY, width * 0.42, palette.sunHalo, 0.35);
  ctx.restore();
  paintSun(ctx, sunX, sunY, height * 0.037, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, horizon * 0.32, height * 0.07, rng, palette.cloud, 0.2, 7);
  softCloudBand(ctx, width, horizon * 0.52, height * 0.05, rng, palette.cloud, 0.16, 6);

  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(palette.seaTop, 1)],
    [0.45, rgba(darken(palette.seaTop, 0.2), 1)],
    [1, rgba(palette.seaDeep, 1)],
  ]);
  ctx.fillRect(0, horizon, width, height - horizon);
  paintLightPath(ctx, sunX, horizon + 1, height * 0.99, width * 0.018, width * 0.17, palette.haze, rng, 0.5);
  paintSeaSparkles(ctx, width, horizon, height, palette.haze, rng, 60);

  paintHeadland(ctx, width, height, horizon, -1, width * 0.33, height * 0.46, rng, palette.headland, palette.rim);

  ctx.fillStyle = rgba(palette.haze, 0.28);
  ctx.fillRect(0, horizon - 1, width, 2);
}

/* ---------------- 月亮：深蓝夜空 + 湖面月影 ---------------- */

interface MoonPalette {
  skyTop: RGB;
  skyMid: RGB;
  skyBottom: RGB;
  moon: RGB;
  halo: RGB;
  ridges: readonly [RGB, RGB, RGB];
  water: RGB;
  shimmer: RGB;
  snow: RGB;
  mist: RGB;
}

const MOON_PALETTES: readonly MoonPalette[] = [
  {
    skyTop: [5, 9, 24],
    skyMid: [11, 23, 48],
    skyBottom: [24, 47, 74],
    moon: [244, 242, 224],
    halo: [160, 196, 232],
    ridges: [
      [24, 38, 64],
      [14, 24, 44],
      [7, 12, 24],
    ],
    water: [12, 24, 42],
    shimmer: [226, 236, 236],
    snow: [178, 196, 214],
    mist: [90, 122, 150],
  },
  {
    skyTop: [6, 8, 28],
    skyMid: [14, 18, 48],
    skyBottom: [34, 40, 74],
    moon: [246, 238, 214],
    halo: [186, 176, 236],
    ridges: [
      [30, 34, 68],
      [18, 20, 46],
      [8, 10, 26],
    ],
    water: [15, 20, 44],
    shimmer: [238, 230, 214],
    snow: [184, 186, 224],
    mist: [110, 116, 164],
  },
];

function renderMoon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(MOON_PALETTES, spec.variant);
  const horizon = height * 0.65;
  const moonX = width * (0.63 - (spec.variant % 2) * 0.14);
  const moonY = height * 0.22;
  const moonRadius = height * 0.034;

  drawWaterScene(
    ctx,
    width,
    height,
    rng,
    {
      horizon,
      reflectionAlpha: 0.5,
      tint: palette.water,
      strips: 8,
      ripple: palette.mist,
      shimmer: 0.3,
      shimmerX: moonX,
      shimmerColor: palette.shimmer,
    },
    (above) => {
      paintSky(above, width, horizon, [
        [0, rgba(palette.skyTop, 1)],
        [0.58, rgba(palette.skyMid, 1)],
        [1, rgba(palette.skyBottom, 1)],
      ]);
      paintStars(above, width, horizon * 0.94, 160, rng);
      above.save();
      above.globalCompositeOperation = "lighter";
      glow(above, moonX, moonY, moonRadius * 9, palette.halo, 0.28);
      glow(above, moonX, moonY, moonRadius * 3.2, palette.halo, 0.25);
      above.restore();

      const moonGradient = above.createRadialGradient(
        moonX - moonRadius * 0.3,
        moonY - moonRadius * 0.3,
        moonRadius * 0.1,
        moonX,
        moonY,
        moonRadius,
      );
      moonGradient.addColorStop(0, rgba(WHITE, 1));
      moonGradient.addColorStop(0.7, rgba(palette.moon, 1));
      moonGradient.addColorStop(1, rgba(darken(palette.moon, 0.12), 1));
      above.fillStyle = moonGradient;
      above.beginPath();
      above.arc(moonX, moonY, moonRadius, 0, TAU);
      above.fill();
      for (let i = 0; i < 5; i++) {
        above.fillStyle = rgba(darken(palette.moon, 0.16), rng.range(0.08, 0.18));
        above.beginPath();
        above.arc(
          moonX + rng.range(-0.55, 0.55) * moonRadius,
          moonY + rng.range(-0.5, 0.5) * moonRadius,
          moonRadius * rng.range(0.08, 0.19),
          0,
          TAU,
        );
        above.fill();
      }

      softCloudBand(above, width, horizon * 0.35, height * 0.06, rng, palette.mist, 0.12, 5);
      drawRidge(above, width, rng, {
        baseY: horizon,
        bottom: horizon + height * 0.03,
        peak: height * 0.23,
        colors: [palette.ridges[0], palette.ridges[1]],
        rim: palette.snow,
        snow: palette.snow,
        steps: 34,
        roughness: 0.8,
      });
      drawRidge(above, width, rng, {
        baseY: horizon + height * 0.006,
        bottom: horizon + height * 0.03,
        peak: height * 0.15,
        colors: [palette.ridges[1], palette.ridges[2]],
        steps: 38,
        roughness: 0.9,
      });
      drawRidge(above, width, rng, {
        baseY: horizon + height * 0.012,
        bottom: horizon + height * 0.02,
        peak: height * 0.09,
        colors: [palette.ridges[2], darken(palette.ridges[2], 0.35)],
        steps: 40,
        roughness: 1,
      });
      paintMistBand(above, width, horizon - height * 0.05, height * 0.12, palette.mist, 0.14);
      drawPineRow(above, width, horizon + height * 0.012, 16, height * 0.022, height * 0.06, "rgba(3, 6, 12, 0.95)", rng, height * 0.004);
      drawReeds(above, width, horizon + height * 0.002, 14, "rgba(4, 8, 14, 0.7)", rng);
    },
  );
}

/* ---------------- 悬崖海岸：黄昏紫粉 + 海面反光 ---------------- */

interface CliffPalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  seaTop: RGB;
  seaDeep: RGB;
  cliffFar: RGB;
  cliffNear: RGB;
  rim: RGB;
  haze: RGB;
}

const CLIFF_PALETTES: readonly CliffPalette[] = [
  {
    sky: [
      [0, "#3d3a63"],
      [0.4, "#7f5878"],
      [0.72, "#d98c86"],
      [1, "#f6c5a0"],
    ],
    sunCore: [255, 233, 202],
    sunHalo: [255, 160, 118],
    seaTop: [78, 66, 92],
    seaDeep: [20, 20, 34],
    cliffFar: [72, 58, 76],
    cliffNear: [24, 20, 30],
    rim: [246, 178, 158],
    haze: [255, 210, 178],
  },
  {
    sky: [
      [0, "#30445f"],
      [0.42, "#6d647f"],
      [0.74, "#c99a91"],
      [1, "#f2d2b2"],
    ],
    sunCore: [255, 242, 218],
    sunHalo: [255, 186, 146],
    seaTop: [72, 84, 102],
    seaDeep: [18, 28, 38],
    cliffFar: [66, 68, 82],
    cliffNear: [22, 25, 32],
    rim: [240, 206, 180],
    haze: [255, 224, 198],
  },
];

function renderCliff(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(CLIFF_PALETTES, spec.variant);
  const horizon = height * 0.56;
  const sunX = width * (0.68 - (spec.variant % 2) * 0.12);
  const sunY = horizon - height * 0.02;

  paintSky(ctx, width, horizon + height * 0.01, palette.sky);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, sunX, sunY, width * 0.35, palette.sunHalo, 0.32);
  ctx.restore();
  paintSun(ctx, sunX, sunY, height * 0.03, palette.sunCore, palette.sunHalo);
  softCloudBand(ctx, width, horizon * 0.3, height * 0.06, rng, palette.haze, 0.16, 6);

  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(palette.seaTop, 1)],
    [0.5, rgba(darken(palette.seaTop, 0.22), 1)],
    [1, rgba(palette.seaDeep, 1)],
  ]);
  ctx.fillRect(0, horizon, width, height - horizon);
  paintLightPath(ctx, sunX, horizon + 1, height, width * 0.012, width * 0.1, palette.haze, rng, 0.4);
  paintSeaSparkles(ctx, width, horizon, height, palette.haze, rng, 50);

  const bigLeft = spec.variant % 2 === 0;
  paintHeadland(
    ctx,
    width,
    height,
    horizon,
    bigLeft ? -1 : 1,
    width * (bigLeft ? 0.36 : 0.64),
    height * 0.18,
    rng,
    palette.cliffNear,
    palette.rim,
  );
  paintHeadland(
    ctx,
    width,
    height,
    horizon,
    bigLeft ? 1 : -1,
    width * (bigLeft ? 0.83 : 0.17),
    height * 0.38,
    rng,
    palette.cliffFar,
    palette.rim,
  );
  drawBirds(ctx, width * 0.58, height * 0.26, height * 0.008, 4, "rgba(48, 38, 52, 0.65)", rng);

  ctx.fillStyle = rgba(palette.haze, 0.22);
  ctx.fillRect(0, horizon - 1, width, 2);
}

/* ---------------- 白桦林：雾 + 金色树冠 ---------------- */

interface BirchPalette {
  sky: readonly GradientStop[];
  sunCore: RGB;
  sunHalo: RGB;
  fog: RGB;
  farTrees: RGB;
  groundTop: RGB;
  groundBottom: RGB;
  trunkLight: RGB;
  trunkShade: RGB;
  mark: RGB;
  crown: RGB;
  leaf: RGB;
  grass: RGB;
}

const BIRCH_PALETTES: readonly BirchPalette[] = [
  {
    sky: [
      [0, "#dde4da"],
      [0.55, "#e9e7d6"],
      [1, "#f8efd9"],
    ],
    sunCore: [255, 248, 218],
    sunHalo: [255, 224, 166],
    fog: [238, 240, 226],
    farTrees: [154, 164, 134],
    groundTop: [148, 152, 104],
    groundBottom: [68, 82, 52],
    trunkLight: [244, 240, 226],
    trunkShade: [198, 194, 172],
    mark: [52, 56, 46],
    crown: [226, 172, 76],
    leaf: [246, 206, 122],
    grass: [52, 64, 42],
  },
  {
    sky: [
      [0, "#dfe3e6"],
      [0.55, "#ece8dc"],
      [1, "#f6efdc"],
    ],
    sunCore: [255, 250, 228],
    sunHalo: [255, 232, 186],
    fog: [240, 242, 236],
    farTrees: [142, 156, 144],
    groundTop: [138, 148, 116],
    groundBottom: [62, 76, 56],
    trunkLight: [240, 242, 234],
    trunkShade: [194, 200, 182],
    mark: [48, 56, 50],
    crown: [214, 176, 88],
    leaf: [242, 214, 138],
    grass: [48, 62, 46],
  },
];

/** 白桦的金色树冠：柔光底 + 大量小椭圆叶团，叠出蓬松的体积感 */
function drawGoldenCrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  palette: BirchPalette,
  rng: Rng,
  alpha: number,
): void {
  // 深色底层，增加树冠体积
  for (let i = 0; i < 3; i++) {
    const angle = rng.range(0, TAU);
    const distance = Math.sqrt(rng.next()) * radius * 0.8;
    ctx.fillStyle = rgba(darken(palette.crown, 0.22), alpha * rng.range(0.12, 0.26));
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance * 0.7,
      radius * rng.range(0.22, 0.4),
      radius * rng.range(0.15, 0.3),
      rng.range(-0.6, 0.6),
      0,
      TAU,
    );
    ctx.fill();
  }

  const blobs = 12;
  for (let i = 0; i < blobs; i++) {
    const angle = rng.range(0, TAU);
    const distance = Math.sqrt(rng.next()) * radius;
    const bx = x + Math.cos(angle) * distance;
    const by = y + Math.sin(angle) * distance * 0.72;
    const rx = radius * rng.range(0.09, 0.22);
    const ry = rx * rng.range(0.55, 0.95);
    ctx.fillStyle = rgba(rng.chance(0.5) ? palette.crown : palette.leaf, alpha * rng.range(0.45, 0.95));
    ctx.beginPath();
    ctx.ellipse(bx, by, rx, ry, rng.range(-0.6, 0.6), 0, TAU);
    ctx.fill();
  }
}

function renderBirch(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(BIRCH_PALETTES, spec.variant);
  paintSky(ctx, width, height, palette.sky);
  glow(ctx, width * 0.68, height * 0.2, width * 0.45, palette.sunHalo, 0.3);
  paintSun(ctx, width * 0.68, height * 0.17, height * 0.018, palette.sunCore, palette.sunHalo);

  // 远处的林线
  drawRidge(ctx, width, rng, {
    baseY: height * 0.62,
    bottom: height * 0.7,
    peak: height * 0.09,
    colors: [mix(palette.farTrees, palette.fog, 0.45), mix(palette.farTrees, palette.fog, 0.15)],
    steps: 26,
    roughness: 0.5,
  });
  drawRidge(ctx, width, rng, {
    baseY: height * 0.645,
    bottom: height * 0.7,
    peak: height * 0.055,
    colors: [mix(palette.farTrees, palette.fog, 0.25), mix(palette.farTrees, palette.fog, 0.02)],
    steps: 28,
    roughness: 0.65,
  });
  paintMistBand(ctx, width, height * 0.6, height * 0.16, palette.fog, 0.6);

  // 地面
  ctx.fillStyle = linearGradient(ctx, 0, height * 0.63, 0, height, [
    [0, rgba(lighten(palette.groundTop, 0.12), 1)],
    [0.5, rgba(palette.groundTop, 1)],
    [1, rgba(palette.groundBottom, 1)],
  ]);
  ctx.fillRect(0, height * 0.63, width, height * 0.37);
  paintMistBand(ctx, width, height * 0.66, height * 0.1, palette.fog, 0.42);

  // 背景树冠（在树干之后）
  for (let i = 0; i < 6; i++) {
    drawGoldenCrown(
      ctx,
      width * (0.03 + i * 0.1) + rng.range(-0.04, 0.04) * width,
      height * (0.05 + rng.range(0, 0.14)),
      width * rng.range(0.07, 0.12),
      palette,
      rng,
      0.6,
    );
  }

  // 白桦树干
  const trunkCount = 9;
  const trunkTops: { x: number; topY: number; depth: number }[] = [];
  for (let i = 0; i < trunkCount; i++) {
    const depth = i / (trunkCount - 1);
    const x = ((i + rng.range(0.15, 0.85)) / trunkCount) * width;
    const baseY = height * (0.7 + depth * 0.28) + rng.range(-0.01, 0.01) * height;
    const topY = height * (0.03 + (1 - depth) * 0.14);
    const trunkWidth = width * (0.006 + depth * 0.015);
    const lean = rng.range(-0.018, 0.018) * width;
    const trunk = ctx.createLinearGradient(x - trunkWidth, 0, x + trunkWidth, 0);
    trunk.addColorStop(0, rgba(darken(palette.trunkShade, 0.1), 0.96));
    trunk.addColorStop(0.35, rgba(palette.trunkLight, 0.98));
    trunk.addColorStop(0.78, rgba(palette.trunkLight, 0.92));
    trunk.addColorStop(1, rgba(palette.trunkShade, 0.94));
    ctx.fillStyle = trunk;
    ctx.beginPath();
    ctx.moveTo(x - trunkWidth * 0.8, baseY);
    ctx.quadraticCurveTo(
      x - trunkWidth * 0.8 + lean,
      baseY - (baseY - topY) * 0.5,
      x - trunkWidth * 0.32 + lean,
      topY,
    );
    ctx.lineTo(x + trunkWidth * 0.32 + lean, topY);
    ctx.quadraticCurveTo(
      x + trunkWidth * 0.8 + lean,
      baseY - (baseY - topY) * 0.5,
      x + trunkWidth * 0.8,
      baseY,
    );
    ctx.closePath();
    ctx.fill();
    trunkTops.push({ x: x + lean * 0.8, topY, depth });

    // 深色横纹与枝痕
    ctx.save();
    ctx.strokeStyle = rgba(palette.mark, 0.52);
    const marks = Math.round(6 + depth * 9);
    for (let m = 0; m < marks; m++) {
      const markY = rng.range(topY + (baseY - topY) * 0.08, baseY - (baseY - topY) * 0.04);
      const markWidth = trunkWidth * rng.range(0.4, 1.05);
      const markX = x + lean * rng.range(0.2, 1);
      ctx.lineWidth = Math.max(1, trunkWidth * rng.range(0.08, 0.18));
      ctx.beginPath();
      ctx.moveTo(markX - markWidth / 2, markY);
      ctx.quadraticCurveTo(markX, markY + rng.range(-1, 1), markX + markWidth / 2, markY);
      ctx.stroke();
    }
    // 伸向树冠的枝条
    ctx.strokeStyle = rgba(palette.trunkShade, 0.55);
    for (let b = 0; b < 2; b++) {
      const startY = topY + (baseY - topY) * rng.range(0.04, 0.22);
      const direction = b === 0 ? -1 : 1;
      const endX = x + lean + direction * width * rng.range(0.025, 0.06);
      const endY = topY - height * rng.range(0.01, 0.045);
      ctx.lineWidth = Math.max(1, trunkWidth * 0.2);
      ctx.beginPath();
      ctx.moveTo(x + lean * 0.7, startY);
      ctx.quadraticCurveTo(
        x + lean + (endX - x - lean) * 0.35,
        startY - (startY - endY) * 0.55,
        endX,
        endY,
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // 让近处树冠与树干相接
  for (const top of trunkTops) {
    if (top.depth < 0.4) continue;
    drawGoldenCrown(
      ctx,
      top.x,
      top.topY + height * 0.005,
      width * (0.05 + top.depth * 0.025),
      palette,
      rng,
      0.55,
    );
  }

  // 前景树冠（盖住部分树干顶部）
  for (let i = 0; i < 4; i++) {
    drawGoldenCrown(
      ctx,
      width * (0.08 + i * 0.14) + rng.range(-0.03, 0.03) * width,
      height * (0.12 + rng.range(0, 0.13)),
      width * rng.range(0.05, 0.085),
      palette,
      rng,
      0.5,
    );
  }

  // 飘落的叶子
  for (let i = 0; i < 28; i++) {
    ctx.fillStyle = rgba(rng.chance(0.6) ? palette.leaf : palette.crown, rng.range(0.25, 0.65));
    ctx.beginPath();
    ctx.ellipse(
      rng.range(0, 1) * width,
      rng.range(0.3, 0.85) * height,
      width * rng.range(0.0015, 0.0035),
      width * rng.range(0.004, 0.008),
      rng.range(0, Math.PI),
      0,
      TAU,
    );
    ctx.fill();
  }

  // 地面上的落叶与雾
  for (let i = 0; i < 32; i++) {
    ctx.fillStyle = rgba(palette.leaf, rng.range(0.1, 0.3));
    ctx.beginPath();
    ctx.ellipse(
      rng.range(0, 1) * width,
      rng.range(0.78, 1) * height,
      width * rng.range(0.003, 0.006),
      width * rng.range(0.0015, 0.003),
      rng.range(0, Math.PI),
      0,
      TAU,
    );
    ctx.fill();
  }
  paintMistBand(ctx, width, height * 0.82, height * 0.18, palette.fog, 0.26);
  drawForegroundGrass(ctx, width, height, palette.grass, rng, 66);
}

/* ---------------- 峡谷：两侧岩壁 + 中央河流 ---------------- */

interface CanyonPalette {
  sky: readonly GradientStop[];
  farMesa: RGB;
  leftRock: readonly [RGB, RGB];
  rightRock: readonly [RGB, RGB];
  rim: RGB;
  riverTop: RGB;
  riverBottom: RGB;
  haze: RGB;
  tree: RGB;
}

const CANYON_PALETTES: readonly CanyonPalette[] = [
  {
    sky: [
      [0, "#c8dce6"],
      [0.55, "#e8e0cf"],
      [1, "#f4dcc2"],
    ],
    farMesa: [178, 132, 116],
    leftRock: [
      [192, 118, 84],
      [112, 58, 44],
    ],
    rightRock: [
      [180, 106, 76],
      [98, 50, 40],
    ],
    rim: [246, 198, 160],
    riverTop: [150, 186, 178],
    riverBottom: [36, 94, 92],
    haze: [236, 186, 152],
    tree: [58, 58, 42],
  },
  {
    sky: [
      [0, "#b9d2e0"],
      [0.55, "#e6dfd2"],
      [1, "#f6e0c4"],
    ],
    farMesa: [186, 146, 126],
    leftRock: [
      [204, 136, 94],
      [122, 68, 48],
    ],
    rightRock: [
      [190, 120, 82],
      [108, 58, 42],
    ],
    rim: [250, 210, 172],
    riverTop: [168, 196, 184],
    riverBottom: [44, 104, 100],
    haze: [242, 198, 164],
    tree: [64, 62, 44],
  },
];

function renderCanyon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(CANYON_PALETTES, spec.variant);
  const gapY = height * 0.46;
  const gapHalf = width * 0.045;
  paintSky(ctx, width, height, palette.sky);
  glow(ctx, width * 0.5, gapY - height * 0.02, width * 0.3, palette.haze, 0.3);
  softCloudBand(ctx, width, height * 0.12, height * 0.08, rng, lighten(palette.haze, 0.35), 0.1, 4);

  // 远处台地
  ctx.fillStyle = rgba(palette.farMesa, 0.65);
  ctx.beginPath();
  ctx.moveTo(width * 0.38, gapY);
  ctx.lineTo(width * 0.42, gapY - height * 0.11);
  ctx.lineTo(width * 0.48, gapY - height * 0.13);
  ctx.lineTo(width * 0.53, gapY - height * 0.1);
  ctx.lineTo(width * 0.57, gapY - height * 0.12);
  ctx.lineTo(width * 0.62, gapY);
  ctx.closePath();
  ctx.fill();

  const topNoiseLeft = createNoise1D(rng, 9);
  const topNoiseRight = createNoise1D(rng, 9);
  const steps = 26;

  const leftTop: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * (width * 0.5 - gapHalf);
    const y =
      height * 0.04 +
      Math.pow(t, 0.82) * (gapY - height * 0.04) +
      (topNoiseLeft(t) - 0.5) * height * 0.075 * (1 - t * 0.35) +
      Math.sin(t * 17.3) * height * 0.006;
    leftTop.push([x, y]);
  }
  const leftInner: Point[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    leftInner.push([
      lerp(width * 0.5 - gapHalf, width * 0.29, t) + Math.sin(t * Math.PI * 2) * width * 0.012,
      lerp(gapY, height, t),
    ]);
  }
  const leftPath = (): void => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (const point of leftTop) ctx.lineTo(point[0], point[1]);
    for (const point of leftInner) ctx.lineTo(point[0], point[1]);
    ctx.lineTo(0, height);
    ctx.closePath();
  };
  paintStrata(ctx, width, height, rng, leftPath, height * 0.04, height * 0.98, palette.leftRock, height * 0.05);

  const rightTop: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = width - t * (width * 0.5 - gapHalf);
    const y =
      height * 0.04 +
      Math.pow(t, 0.82) * (gapY - height * 0.04) +
      (topNoiseRight(t) - 0.5) * height * 0.075 * (1 - t * 0.35) +
      Math.sin(t * 19.1 + 1.7) * height * 0.006;
    rightTop.push([x, y]);
  }
  const rightInner: Point[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    rightInner.push([
      lerp(width * 0.5 + gapHalf, width * 0.71, t) + Math.sin(t * Math.PI * 2) * width * 0.012,
      lerp(gapY, height, t),
    ]);
  }
  const rightPath = (): void => {
    ctx.beginPath();
    ctx.moveTo(width, 0);
    for (const point of rightTop) ctx.lineTo(point[0], point[1]);
    for (const point of rightInner) ctx.lineTo(point[0], point[1]);
    ctx.lineTo(width, height);
    ctx.closePath();
  };
  paintStrata(ctx, width, height, rng, rightPath, height * 0.04, height * 0.98, palette.rightRock, -height * 0.05);

  // 岩壁的体积阴影与竖向裂隙
  ctx.save();
  leftPath();
  ctx.clip();
  ctx.fillStyle = linearGradient(ctx, width * 0.16, 0, width * 0.47, 0, [
    [0, rgba(darken(palette.leftRock[1], 0.25), 0)],
    [0.55, rgba(darken(palette.leftRock[1], 0.25), 0.16)],
    [1, rgba(darken(palette.leftRock[1], 0.3), 0.5)],
  ]);
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = rgba(darken(palette.leftRock[1], 0.35), 0.28);
  for (let i = 0; i < 4; i++) {
    const crackX = width * rng.range(0.04, 0.44);
    const crackY = height * rng.range(0.02, 0.25);
    ctx.lineWidth = Math.max(1, height * rng.range(0.001, 0.003));
    ctx.beginPath();
    ctx.moveTo(crackX, crackY);
    ctx.quadraticCurveTo(crackX + width * 0.02, crackY + height * 0.22, crackX - width * 0.015, crackY + height * 0.5);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  rightPath();
  ctx.clip();
  ctx.fillStyle = linearGradient(ctx, width * 0.84, 0, width * 0.53, 0, [
    [0, rgba(darken(palette.rightRock[1], 0.25), 0)],
    [0.55, rgba(darken(palette.rightRock[1], 0.25), 0.16)],
    [1, rgba(darken(palette.rightRock[1], 0.3), 0.5)],
  ]);
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = rgba(darken(palette.rightRock[1], 0.35), 0.28);
  for (let i = 0; i < 4; i++) {
    const crackX = width * rng.range(0.56, 0.96);
    const crackY = height * rng.range(0.02, 0.25);
    ctx.lineWidth = Math.max(1, height * rng.range(0.001, 0.003));
    ctx.beginPath();
    ctx.moveTo(crackX, crackY);
    ctx.quadraticCurveTo(crackX - width * 0.02, crackY + height * 0.22, crackX + width * 0.015, crackY + height * 0.5);
    ctx.stroke();
  }
  ctx.restore();

  // 岩壁受光边缘
  ctx.save();
  ctx.strokeStyle = rgba(palette.rim, 0.35);
  ctx.lineWidth = Math.max(1.5, height * 0.0025);
  ctx.beginPath();
  ctx.moveTo(leftTop[0][0], leftTop[0][1]);
  for (const point of leftTop) ctx.lineTo(point[0], point[1]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rightTop[0][0], rightTop[0][1]);
  for (const point of rightTop) ctx.lineTo(point[0], point[1]);
  ctx.stroke();
  ctx.restore();

  // 河流
  const riverPath = (): void => {
    ctx.beginPath();
    ctx.moveTo(leftInner[0][0], leftInner[0][1]);
    for (const point of leftInner) ctx.lineTo(point[0], point[1]);
    ctx.lineTo(width * 0.29, height);
    ctx.lineTo(width * 0.71, height);
    for (let i = rightInner.length - 1; i >= 0; i--) ctx.lineTo(rightInner[i][0], rightInner[i][1]);
    ctx.closePath();
  };
  riverPath();
  ctx.fillStyle = linearGradient(ctx, 0, gapY, 0, height, [
    [0, rgba(palette.riverTop, 1)],
    [0.4, rgba(mix(palette.riverTop, palette.riverBottom, 0.6), 1)],
    [1, rgba(palette.riverBottom, 1)],
  ]);
  ctx.fill();

  ctx.save();
  riverPath();
  ctx.clip();
  // 河岸阴影
  ctx.fillStyle = linearGradient(ctx, width * 0.28, 0, width * 0.47, 0, [
    [0, rgba(darken(palette.riverBottom, 0.35), 0.55)],
    [1, rgba(darken(palette.riverBottom, 0.35), 0)],
  ]);
  ctx.fillRect(width * 0.27, gapY, width * 0.21, height - gapY);
  ctx.fillStyle = linearGradient(ctx, width * 0.72, 0, width * 0.53, 0, [
    [0, rgba(darken(palette.riverBottom, 0.35), 0.55)],
    [1, rgba(darken(palette.riverBottom, 0.35), 0)],
  ]);
  ctx.fillRect(width * 0.52, gapY, width * 0.21, height - gapY);
  // 水面反光与波纹
  ctx.globalCompositeOperation = "lighter";
  paintLightPath(ctx, width * 0.5, gapY + 2, height * 0.98, width * 0.012, width * 0.075, palette.rim, rng, 0.3);
  for (let i = 0; i < 30; i++) {
    const t = rng.next();
    const y = gapY + Math.pow(t, 0.6) * (height - gapY);
    const x = width * 0.5 + rng.range(-1, 1) * (width * (0.03 + t * 0.17));
    ctx.fillStyle = rgba(palette.rim, rng.range(0.04, 0.16));
    ctx.fillRect(x, y, width * rng.range(0.01, 0.04), Math.max(1, 1 + t * 2));
  }
  ctx.restore();

  // 水与岩壁的交界
  ctx.strokeStyle = rgba(darken(palette.riverBottom, 0.2), 0.4);
  ctx.lineWidth = Math.max(1.5, width * 0.003);
  ctx.beginPath();
  ctx.moveTo(leftInner[0][0], leftInner[0][1]);
  for (const point of leftInner) ctx.lineTo(point[0], point[1]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rightInner[0][0], rightInner[0][1]);
  for (const point of rightInner) ctx.lineTo(point[0], point[1]);
  ctx.stroke();

  paintMistBand(ctx, width, gapY + height * 0.03, height * 0.16, palette.haze, 0.24);
}

/* ---------------- 花园：散景 + 花丛 ---------------- */

interface GardenPalette {
  sky: readonly GradientStop[];
  bokeh: readonly RGB[];
  hedge: RGB;
  hedgeLight: RGB;
  groundTop: RGB;
  groundBottom: RGB;
  petals: readonly RGB[];
  petalInner: RGB;
  center: RGB;
  centerDark: RGB;
  stem: RGB;
  leaf: RGB;
  light: RGB;
  grass: RGB;
}

const GARDEN_PALETTES: readonly GardenPalette[] = [
  {
    sky: [
      [0, "#334a34"],
      [0.5, "#68804a"],
      [1, "#b0bc78"],
    ],
    bokeh: [
      [244, 232, 160],
      [200, 224, 140],
      [246, 198, 206],
    ],
    hedge: [58, 84, 52],
    hedgeLight: [96, 122, 66],
    groundTop: [92, 112, 62],
    groundBottom: [44, 58, 36],
    petals: [
      [246, 170, 196],
      [250, 214, 226],
      [214, 160, 232],
    ],
    petalInner: [252, 236, 240],
    center: [248, 204, 98],
    centerDark: [170, 116, 42],
    stem: [64, 92, 52],
    leaf: [78, 108, 56],
    light: [255, 244, 196],
    grass: [42, 56, 34],
  },
  {
    sky: [
      [0, "#2b4048"],
      [0.5, "#4f6d5c"],
      [1, "#9aa876"],
    ],
    bokeh: [
      [208, 226, 244],
      [172, 204, 224],
      [236, 236, 218],
    ],
    hedge: [48, 74, 62],
    hedgeLight: [84, 112, 86],
    groundTop: [80, 104, 70],
    groundBottom: [38, 54, 42],
    petals: [
      [150, 176, 238],
      [190, 206, 250],
      [236, 238, 250],
    ],
    petalInner: [236, 240, 252],
    center: [250, 210, 104],
    centerDark: [166, 118, 44],
    stem: [58, 88, 58],
    leaf: [70, 102, 60],
    light: [232, 240, 250],
    grass: [38, 52, 38],
  },
];

function renderGarden(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
): void {
  const palette = pickPalette(GARDEN_PALETTES, spec.variant);
  const horizon = height * 0.62;
  paintSky(ctx, width, height, palette.sky);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, width * 0.22, height * 0.14, width * 0.4, palette.light, 0.24);
  ctx.restore();
  paintBokeh(ctx, width, height, 14, palette.bokeh, rng, width * 0.03, width * 0.12);

  // 中景树篱
  const hedgeNoise = createNoise1D(rng, 6);
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, horizon - height * 0.04);
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    ctx.lineTo(
      t * width,
      horizon - height * (0.04 + hedgeNoise(t) * 0.08 + Math.sin(t * Math.PI * 3) * 0.015),
    );
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = linearGradient(ctx, 0, horizon - height * 0.12, 0, horizon + height * 0.1, [
    [0, rgba(palette.hedgeLight, 0.9)],
    [1, rgba(palette.hedge, 1)],
  ]);
  ctx.fill();

  ctx.fillStyle = linearGradient(ctx, 0, horizon, 0, height, [
    [0, rgba(palette.groundTop, 1)],
    [1, rgba(palette.groundBottom, 1)],
  ]);
  ctx.fillRect(0, horizon, width, height - horizon);
  paintMistBand(ctx, width, horizon, height * 0.08, palette.light, 0.14);

  // 花丛：按底端 y 从远到近绘制
  const flowers: { x: number; headY: number; baseY: number; radius: number; colorIndex: number }[] = [];
  for (let i = 0; i < 15; i++) {
    const depth = Math.pow(rng.next(), 0.8);
    const baseY = height * (0.68 + depth * 0.32);
    const headY = baseY - height * (0.09 + depth * 0.2);
    flowers.push({
      x: width * rng.range(0.05, 0.95),
      headY,
      baseY,
      radius: height * (0.018 + depth * 0.026),
      colorIndex: rng.int(0, palette.petals.length - 1),
    });
  }
  flowers.sort((a, b) => a.baseY - b.baseY);

  for (const flower of flowers) {
    ctx.strokeStyle = rgba(palette.stem, rng.range(0.55, 0.9));
    ctx.lineWidth = Math.max(1, width * 0.0022);
    ctx.beginPath();
    ctx.moveTo(flower.x, flower.baseY);
    ctx.quadraticCurveTo(
      flower.x + rng.range(-0.02, 0.02) * width,
      lerp(flower.baseY, flower.headY, 0.5),
      flower.x,
      flower.headY,
    );
    ctx.stroke();
    drawLeaf(
      ctx,
      flower.x,
      lerp(flower.baseY, flower.headY, 0.55),
      height * 0.05,
      width * 0.012,
      rng.range(-1.3, 1.3),
      palette.leaf,
      0.8,
    );
    drawFlowerHead(
      ctx,
      flower.x,
      flower.headY,
      flower.radius,
      {
        petalInner: palette.petalInner,
        petalOuter: palette.petals[flower.colorIndex],
        center: palette.center,
        centerDark: palette.centerDark,
        petals: 6,
        alpha: 0.96,
        stamens: 6,
      },
      rng.range(0, TAU),
    );
  }

  paintBokeh(ctx, width, height, 5, palette.bokeh, rng, width * 0.08, width * 0.18);
  drawForegroundGrass(ctx, width, height, palette.grass, rng, 46);
}

/* ============================================================
 * 五、收尾：暗角与颗粒
 * ============================================================ */

function paintVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    Math.min(width, height) * 0.22,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.78,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.62, "rgba(4, 6, 10, 0.08)");
  gradient.addColorStop(1, "rgba(4, 6, 10, 0.32)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function paintGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: Rng,
): void {
  const dots = Math.min(1100, Math.max(220, Math.round((width * height) / 1450)));
  ctx.save();
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass === 0 ? "rgba(255, 255, 255, 0.055)" : "rgba(0, 0, 0, 0.05)";
    ctx.beginPath();
    for (let i = 0; i < dots / 2; i++) {
      const size = rng.chance(0.22) ? 2 : 1;
      ctx.rect(rng.range(0, width), rng.range(0, height), size, size);
    }
    ctx.fill();
  }
  ctx.restore();
}

/* ============================================================
 * 六、场景数据（24 张，覆盖 14 种场景）
 * ============================================================ */

export const SCENES: SceneSpec[] = [
  {
    id: "mountains-lake-dawn",
    kind: "mountains",
    variant: 0,
    title: "提顿山与蛇河",
    file: "IMG_2841.CR3",
    albums: ["群山", "作品集"],
    location: "怀俄明州 大提顿",
    date: "2026-05-18 06:12",
    camera: "Canon EOS R5",
    lens: "RF 24-70mm F2.8 L IS USM",
    iso: 100,
    aperture: "f/11",
    shutter: "1/60s",
    focal: 35,
    keywords: ["大提顿", "湖面倒影", "晨雾", "雪山", "松林"],
  },
  {
    id: "mountains-snowline",
    kind: "mountains",
    variant: 1,
    title: "雪线之上",
    file: "DSC_4821.NEF",
    albums: ["群山"],
    location: "科罗拉多州 落基山",
    date: "2026-02-07 09:45",
    camera: "Nikon Z8",
    lens: "NIKKOR Z 24-120mm f/4 S",
    iso: 200,
    aperture: "f/8",
    shutter: "1/250s",
    focal: 50,
    keywords: ["雪山", "高山", "晨光", "层峦"],
  },
  {
    id: "mountains-sawtooth-dusk",
    kind: "mountains",
    variant: 2,
    title: "锯齿山黄昏",
    file: "DSC05177.ARW",
    albums: ["群山"],
    location: "爱达荷州 锯齿山",
    date: "2026-09-02 18:20",
    camera: "Sony α7R V",
    lens: "FE 24-70mm F2.8 GM II",
    iso: 320,
    aperture: "f/5.6",
    shutter: "1/160s",
    focal: 70,
    keywords: ["黄昏", "山峰", "云层", "松林"],
  },
  {
    id: "aurora-mirror-lake",
    kind: "aurora",
    variant: 0,
    title: "极光下的镜湖",
    file: "DSC_0912.ARW",
    albums: ["群山"],
    location: "冰岛 南岸",
    date: "2026-03-14 23:40",
    camera: "Sony α7 III",
    lens: "FE 16-35mm F2.8 GM",
    iso: 3200,
    aperture: "f/2.8",
    shutter: "1.6s",
    focal: 16,
    keywords: ["极光", "夜空", "湖面", "倒影", "星空"],
  },
  {
    id: "moonrise-valley",
    kind: "moon",
    variant: 0,
    title: "月升山谷",
    file: "IMG_7719.CR3",
    albums: ["群山"],
    location: "蒙大拿州 冰川国家公园",
    date: "2026-08-30 21:15",
    camera: "Canon EOS R6 Mark II",
    lens: "RF 70-200mm F2.8 L IS USM",
    iso: 800,
    aperture: "f/4",
    shutter: "1/125s",
    focal: 135,
    keywords: ["月亮", "夜色", "山谷", "松林", "蓝调"],
  },
  {
    id: "palm-cove-noon",
    kind: "beach",
    variant: 0,
    title: "棕榈湾正午",
    file: "IMG_3345.CR3",
    albums: ["海岸线"],
    location: "夏威夷 瓦胡岛",
    date: "2026-06-03 12:18",
    camera: "Canon EOS R5",
    lens: "RF 15-35mm F2.8 L IS USM",
    iso: 100,
    aperture: "f/11",
    shutter: "1/500s",
    focal: 24,
    keywords: ["海滩", "棕榈", "海浪", "青绿海水", "夏日"],
  },
  {
    id: "turquoise-shore",
    kind: "beach",
    variant: 1,
    title: "青绿浅滩",
    file: "DSC_6630.ARW",
    albums: ["海岸线"],
    location: "佛罗里达 那不勒斯",
    date: "2026-04-25 15:40",
    camera: "Sony α7C II",
    lens: "FE 28-60mm F4-5.6",
    iso: 100,
    aperture: "f/8",
    shutter: "1/800s",
    focal: 28,
    keywords: ["沙滩", "海岸", "浪花", "贝壳", "暖沙"],
  },
  {
    id: "sunset-sea-big-sur",
    kind: "sunsetSea",
    variant: 0,
    title: "落日坠入海面",
    file: "IMG_5120.CR3",
    albums: ["海岸线"],
    location: "加州 大苏尔",
    date: "2026-07-19 19:52",
    camera: "Canon EOS R5",
    lens: "RF 24-105mm F4 L IS USM",
    iso: 200,
    aperture: "f/8",
    shutter: "1/320s",
    focal: 70,
    keywords: ["日落", "海面", "金光", "太平洋", "晚霞"],
  },
  {
    id: "cliff-cannon-beach",
    kind: "cliff",
    variant: 0,
    title: "悬崖上的黄昏",
    file: "DSC_9083.NEF",
    albums: ["海岸线"],
    location: "俄勒冈 坎农海滩",
    date: "2026-11-06 17:28",
    camera: "Nikon Z7 II",
    lens: "NIKKOR Z 14-30mm f/4 S",
    iso: 400,
    aperture: "f/9",
    shutter: "1/125s",
    focal: 18,
    keywords: ["悬崖", "海岸", "黄昏", "海蚀柱", "紫霞"],
  },
  {
    id: "birch-acadia-fog",
    kind: "birch",
    variant: 0,
    title: "雾中的白桦",
    file: "DSCF4410.RAF",
    albums: ["海岸线"],
    location: "缅因州 阿卡迪亚",
    date: "2026-10-28 08:05",
    camera: "Fujifilm X-T5",
    lens: "XF 16-55mm F2.8 R LM WR",
    iso: 500,
    aperture: "f/4",
    shutter: "1/200s",
    focal: 35,
    keywords: ["白桦", "晨雾", "秋色", "林间", "柔光"],
  },
  {
    id: "dunes-great-sand",
    kind: "dunes",
    variant: 0,
    title: "沙丘的褶皱",
    file: "IMG_9034.CR3",
    albums: ["沙漠"],
    location: "科罗拉多州 大沙丘",
    date: "2026-03-02 16:30",
    camera: "Canon EOS R5",
    lens: "RF 70-200mm F2.8 L IS USM",
    iso: 100,
    aperture: "f/16",
    shutter: "1/200s",
    focal: 200,
    keywords: ["沙丘", "曲线", "赤陶色", "风痕", "沙漠"],
  },
  {
    id: "dunes-death-valley",
    kind: "dunes",
    variant: 1,
    title: "落日沙脊",
    file: "DSC_2201.ARW",
    albums: ["沙漠"],
    location: "加州 死亡谷",
    date: "2026-02-22 17:10",
    camera: "Sony α1",
    lens: "FE 70-200mm F2.8 GM OSS II",
    iso: 200,
    aperture: "f/11",
    shutter: "1/500s",
    focal: 150,
    keywords: ["沙脊", "落日", "荒原", "光影", "远山"],
  },
  {
    id: "canyon-river-light",
    kind: "canyon",
    variant: 0,
    title: "峡谷里的河",
    file: "DSC_5560.NEF",
    albums: ["沙漠"],
    location: "亚利桑那州 大峡谷",
    date: "2026-05-29 10:22",
    camera: "Nikon Z8",
    lens: "NIKKOR Z 24-70mm f/2.8 S",
    iso: 100,
    aperture: "f/10",
    shutter: "1/160s",
    focal: 28,
    keywords: ["峡谷", "河流", "岩壁", "层理", "科罗拉多"],
  },
  {
    id: "flower-aster-macro",
    kind: "flower",
    variant: 0,
    title: "紫菀微距",
    file: "IMG_6188.CR3",
    albums: ["花园", "作品集"],
    location: "俄勒冈州 波特兰",
    date: "2026-08-09 10:35",
    camera: "Canon EOS R5",
    lens: "RF 100mm F2.8 L MACRO IS USM",
    iso: 400,
    aperture: "f/4.5",
    shutter: "1/320s",
    focal: 100,
    keywords: ["紫花", "微距", "散景", "花蕊", "花园"],
    portrait: true,
  },
  {
    id: "garden-cotswolds-afternoon",
    kind: "garden",
    variant: 0,
    title: "花园里的午后",
    file: "DSC_7788.ARW",
    albums: ["花园"],
    location: "英国 科茨沃尔德",
    date: "2026-06-21 14:12",
    camera: "Sony α7 IV",
    lens: "FE 35mm F1.4 GM",
    iso: 200,
    aperture: "f/2.8",
    shutter: "1/1000s",
    focal: 35,
    keywords: ["花园", "花丛", "散景", "午后", "绿色"],
  },
  {
    id: "garden-giverny-dusk",
    kind: "garden",
    variant: 1,
    title: "暮色花园",
    file: "DSCF3301.RAF",
    albums: ["花园"],
    location: "法国 吉维尼",
    date: "2026-07-05 20:10",
    camera: "Fujifilm X100VI",
    lens: "23mm F2 固定镜头",
    iso: 320,
    aperture: "f/2.8",
    shutter: "1/250s",
    focal: 23,
    keywords: ["花园", "暮色", "蓝紫", "绣球", "柔光"],
  },
  {
    id: "aurora-lofoten-green",
    kind: "aurora",
    variant: 1,
    title: "北纬六十六度的绿光",
    file: "DSC_1187.NEF",
    albums: ["夜空"],
    location: "挪威 罗弗敦群岛",
    date: "2026-01-21 22:05",
    camera: "Nikon Z6 III",
    lens: "NIKKOR Z 20mm f/1.8 S",
    iso: 2500,
    aperture: "f/1.8",
    shutter: "1.3s",
    focal: 20,
    keywords: ["极光", "北极圈", "夜空", "绿光", "雪山"],
  },
  {
    id: "moon-over-bwca",
    kind: "moon",
    variant: 1,
    title: "湖心月影",
    file: "DSCF2278.RAF",
    albums: ["夜空"],
    location: "明尼苏达州 边界水域",
    date: "2026-10-11 20:40",
    camera: "Fujifilm GFX 100 II",
    lens: "GF 45-100mm F4 R LM OIS WR",
    iso: 1600,
    aperture: "f/4",
    shutter: "1/60s",
    focal: 60,
    keywords: ["月亮", "湖面", "月影", "夜空", "静谧"],
  },
  {
    id: "lavender-valensole-dawn",
    kind: "lavender",
    variant: 0,
    title: "薰衣草田的日出",
    file: "L1004210.DNG",
    albums: ["作品集"],
    location: "法国 瓦朗索勒",
    date: "2026-06-14 06:25",
    camera: "Leica Q3",
    lens: "Summilux 28mm f/1.7 ASPH",
    iso: 100,
    aperture: "f/8",
    shutter: "1/500s",
    focal: 28,
    keywords: ["薰衣草", "日出", "花田", "孤树", "普罗旺斯"],
  },
  {
    id: "lavender-somerset-dusk",
    kind: "lavender",
    variant: 1,
    title: "紫色花垄",
    file: "X2D_02813.3FR",
    albums: ["作品集"],
    location: "英国 萨默塞特",
    date: "2026-07-02 19:05",
    camera: "Hasselblad X2D 100C",
    lens: "XCD 45mm f/3.5",
    iso: 100,
    aperture: "f/8",
    shutter: "1/400s",
    focal: 45,
    keywords: ["薰衣草", "花垄", "黄昏", "紫色", "田园"],
  },
  {
    id: "forest-rainier-mist",
    kind: "forest",
    variant: 0,
    title: "松林晨雾",
    file: "DSC_3144.NEF",
    albums: ["作品集"],
    location: "华盛顿州 雷尼尔山",
    date: "2026-09-27 07:15",
    camera: "Nikon Zf",
    lens: "NIKKOR Z 40mm f/2",
    iso: 640,
    aperture: "f/2.8",
    shutter: "1/250s",
    focal: 40,
    keywords: ["松林", "晨雾", "光束", "远山", "静谧"],
  },
  {
    id: "forest-tyrol-rays",
    kind: "forest",
    variant: 1,
    title: "林间光柱",
    file: "IMG_8802.CR3",
    albums: ["作品集"],
    location: "奥地利 蒂罗尔",
    date: "2026-11-19 09:20",
    camera: "Canon EOS R5",
    lens: "RF 24-70mm F2.8 L IS USM",
    iso: 320,
    aperture: "f/5.6",
    shutter: "1/400s",
    focal: 50,
    keywords: ["松林", "丁达尔光", "雾气", "晨光", "山谷"],
  },
  {
    id: "corn-iowa-dusk",
    kind: "corn",
    variant: 0,
    title: "玉米田暮色",
    file: "DSC06420.ARW",
    albums: ["作品集"],
    location: "爱荷华州 得梅因",
    date: "2026-09-12 18:55",
    camera: "Sony α7R V",
    lens: "FE 24-70mm F2.8 GM II",
    iso: 160,
    aperture: "f/8",
    shutter: "1/200s",
    focal: 40,
    keywords: ["玉米田", "暮色", "田垄", "孤树", "金色"],
  },
  {
    id: "corn-illinois-gold",
    kind: "corn",
    variant: 1,
    title: "金色田垄",
    file: "IMG_9207.CR3",
    albums: ["作品集"],
    location: "伊利诺伊州 香槟",
    date: "2026-10-03 17:40",
    camera: "Canon EOS R6 Mark II",
    lens: "RF 50mm F1.8 STM",
    iso: 100,
    aperture: "f/4",
    shutter: "1/640s",
    focal: 50,
    keywords: ["玉米田", "金色", "夕阳", "远景", "田园"],
  },
];

/* ============================================================
 * 七、对外入口
 * ============================================================ */

type SceneRenderer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: SceneSpec,
  rng: Rng,
) => void;

const RENDERERS: Record<SceneKind, SceneRenderer> = {
  mountains: renderMountains,
  aurora: renderAurora,
  flower: renderFlower,
  lavender: renderLavender,
  beach: renderBeach,
  dunes: renderDunes,
  forest: renderForest,
  sunsetSea: renderSunsetSea,
  moon: renderMoon,
  corn: renderCorn,
  cliff: renderCliff,
  birch: renderBirch,
  canyon: renderCanyon,
  garden: renderGarden,
};

export function renderScene(
  spec: SceneSpec,
  width = spec.portrait ? 1000 : 1600,
  height = spec.portrait ? 1400 : 1000,
): HTMLCanvasElement {
  const layer = createLayer(width, height);
  const ctx = layer.ctx;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const seed = (hashString(spec.id) + Math.imul(spec.variant + 1, 0x9e3779b1)) >>> 0;
  const rng = createRng(seed);
  RENDERERS[spec.kind](ctx, layer.canvas.width, layer.canvas.height, spec, rng);
  paintVignette(ctx, layer.canvas.width, layer.canvas.height);
  paintGrain(ctx, layer.canvas.width, layer.canvas.height, rng);
  return layer.canvas;
}

export function renderThumb(spec: SceneSpec, width = 480): string {
  const thumbWidth = Math.max(16, Math.round(width));
  const thumbHeight = Math.round(thumbWidth * (spec.portrait ? 1.4 : 0.625));
  return renderScene(spec, thumbWidth, thumbHeight).toDataURL("image/jpeg", 0.82);
}
