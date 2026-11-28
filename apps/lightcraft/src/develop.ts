/**
 * LightCraft 显影管线（develop pipeline）
 *
 * 设计要点（对齐真实 LightCraft / Lightroom 的非破坏性模型）：
 * - 原始像素只读：所有调整都是参数，渲染时在 CPU 上重算，原图永不修改。
 * - 场景参考的 32-bit 浮点思路在浏览器里用 0..1 的浮点中间值模拟，
 *   顺序为：白平衡 → 曝光 → 黑白场 → 高光/阴影 → 对比度 → 曲线 →
 *   黑白/HSL/自然饱和度/饱和度 → 颜色分级 → 纹理/清晰度/去雾 →
 *   锐化 → 暗角 → 颗粒。
 * - 局部调整（遮罩）把同一管线作用在遮罩 alpha 上，再按 alpha 与全局结果混合，
 *   与 Lightroom「全局 → 蒙版再调整」的顺序一致。
 */
export interface Vec2 {
  x: number;
  y: number;
}

export type HslBand = "red" | "orange" | "yellow" | "green" | "aqua" | "blue" | "purple" | "magenta";

export interface HslAdjust {
  /** 色相偏移，-100..100 */
  hue: number;
  /** 饱和度，-100..100 */
  sat: number;
  /** 明度，-100..100 */
  lum: number;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface GradingZone {
  /** 色相角 0..360 */
  hue: number;
  /** 染色强度 0..100 */
  sat: number;
  /** 明度 -100..100 */
  lum: number;
}

export interface GradingParams {
  shadows: GradingZone;
  midtones: GradingZone;
  highlights: GradingZone;
  /** 阴影/高光分区偏移 -100..100 */
  balance: number;
}

export interface DevelopParams {
  /** 曝光 -5..5 EV */
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  /** 色温 2000..12000 K */
  temperature: number;
  /** 色调 -150..150 */
  tint: number;
  vibrance: number;
  saturation: number;
  texture: number;
  clarity: number;
  dehaze: number;
  /** -100..100，负数压暗四角 */
  vignette: number;
  /** 0..100 */
  grain: number;
  /** 0..100 */
  sharpening: number;
  /** 0..100 */
  noiseReduction: number;
  curves: CurvePoint[];
  hsl: Record<HslBand, HslAdjust>;
  grading: GradingParams;
  monochrome: boolean;
}

export const HSL_BANDS: HslBand[] = ["red", "orange", "yellow", "green", "aqua", "blue", "purple", "magenta"];

export const HSL_BAND_LABELS: Record<HslBand, string> = {
  red: "红色",
  orange: "橙色",
  yellow: "黄色",
  green: "绿色",
  aqua: "青色",
  blue: "蓝色",
  purple: "紫色",
  magenta: "洋红"
};

/** 每个色带在色相环上的中心角度 */
const BAND_HUE: Record<HslBand, number> = {
  red: 0,
  orange: 30,
  yellow: 60,
  green: 120,
  aqua: 180,
  blue: 225,
  purple: 275,
  magenta: 320
};

export const DEFAULT_DEVELOP: DevelopParams = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 5500,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  texture: 0,
  clarity: 0,
  dehaze: 0,
  vignette: 0,
  grain: 0,
  sharpening: 0,
  noiseReduction: 0,
  curves: [
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ],
  hsl: {
    red: { hue: 0, sat: 0, lum: 0 },
    orange: { hue: 0, sat: 0, lum: 0 },
    yellow: { hue: 0, sat: 0, lum: 0 },
    green: { hue: 0, sat: 0, lum: 0 },
    aqua: { hue: 0, sat: 0, lum: 0 },
    blue: { hue: 0, sat: 0, lum: 0 },
    purple: { hue: 0, sat: 0, lum: 0 },
    magenta: { hue: 0, sat: 0, lum: 0 }
  },
  grading: {
    shadows: { hue: 220, sat: 0, lum: 0 },
    midtones: { hue: 40, sat: 0, lum: 0 },
    highlights: { hue: 45, sat: 0, lum: 0 },
    balance: 0
  },
  monochrome: false
};

export function createDevelop(): DevelopParams {
  return cloneDevelop(DEFAULT_DEVELOP);
}

export function cloneDevelop(params: DevelopParams): DevelopParams {
  return {
    ...params,
    curves: params.curves.map((point) => ({ ...point })),
    hsl: Object.fromEntries(HSL_BANDS.map((band) => [band, { ...params.hsl[band] }])) as Record<HslBand, HslAdjust>,
    grading: {
      shadows: { ...params.grading.shadows },
      midtones: { ...params.grading.midtones },
      highlights: { ...params.grading.highlights },
      balance: params.grading.balance
    }
  };
}

/** 参数是否仍是「相机原始」状态（用于面板上的复位按钮与预设高亮）。 */
export function isNeutral(params: DevelopParams): boolean {
  const base = DEFAULT_DEVELOP;
  for (const key of Object.keys(base) as Array<keyof DevelopParams>) {
    if (key === "curves" || key === "hsl" || key === "grading") continue;
    if (params[key] !== base[key]) return false;
  }
  if (params.curves.length !== 2 || params.curves.some((p, i) => p.x !== base.curves[i].x || p.y !== base.curves[i].y)) {
    return false;
  }
  for (const band of HSL_BANDS) {
    const adjust = params.hsl[band];
    if (adjust.hue || adjust.sat || adjust.lum) return false;
  }
  const grading = params.grading;
  for (const zone of [grading.shadows, grading.midtones, grading.highlights]) {
    if (zone.sat || zone.lum) return false;
  }
  return grading.balance === 0;
}

/** 统计有多少个滑杆离开默认值，面板用来显示「已编辑 · n」。 */
export function editCount(params: DevelopParams): number {
  let count = 0;
  if (params.exposure) count++;
  if (params.contrast) count++;
  if (params.highlights) count++;
  if (params.shadows) count++;
  if (params.whites) count++;
  if (params.blacks) count++;
  if (params.temperature !== DEFAULT_DEVELOP.temperature) count++;
  if (params.tint) count++;
  if (params.vibrance) count++;
  if (params.saturation) count++;
  if (params.texture) count++;
  if (params.clarity) count++;
  if (params.dehaze) count++;
  if (params.vignette) count++;
  if (params.grain) count++;
  if (params.sharpening) count++;
  if (params.noiseReduction) count++;
  if (params.monochrome) count++;
  if (params.curves.length !== 2) count++;
  for (const band of HSL_BANDS) {
    const adjust = params.hsl[band];
    if (adjust.hue || adjust.sat || adjust.lum) count++;
  }
  if (params.grading.shadows.sat || params.grading.midtones.sat || params.grading.highlights.sat) count++;
  return count;
}

/* ------------------------------------------------------------------ 基础数学 */

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Rec.709 亮度 */
function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  if (s === 0) return [l, l, l];
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = hue / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let channels: [number, number, number];
  if (hp < 1) channels = [c, x, 0];
  else if (hp < 2) channels = [x, c, 0];
  else if (hp < 3) channels = [0, c, x];
  else if (hp < 4) channels = [0, x, c];
  else if (hp < 5) channels = [x, 0, c];
  else channels = [c, 0, x];
  const m = l - c / 2;
  return [channels[0] + m, channels[1] + m, channels[2] + m];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta < 1e-6) return [0, 0, l];
  const s = delta / (1 - Math.abs(2 * l - 1) + 1e-6);
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

/* ------------------------------------------------------------------ 色调曲线 */

/**
 * Fritsch–Carlson 单调三次插值生成 0..255 的曲线查找表。
 * 控制点按 x 排序，首尾自动延展到 (0,0)/(1,1) 之外保持不变。
 */
export function curveLut(points: CurvePoint[], size = 256): Uint8ClampedArray {
  const sorted = [...points].sort((a, b) => a.x - b.x);
  const xs = sorted.map((point) => clamp01(point.x));
  const ys = sorted.map((point) => clamp01(point.y));
  const count = xs.length;
  const lut = new Uint8ClampedArray(size);

  if (count < 2) {
    for (let i = 0; i < size; i++) lut[i] = Math.round((i / (size - 1)) * 255);
    return lut;
  }

  const delta: number[] = [];
  const slopes: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const dx = Math.max(1e-5, xs[i + 1] - xs[i]);
    delta.push((ys[i + 1] - ys[i]) / dx);
  }
  slopes.push(delta[0]);
  for (let i = 1; i < count - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) slopes.push(0);
    else slopes.push((delta[i - 1] + delta[i]) / 2);
  }
  slopes.push(delta[count - 2]);

  for (let i = 0; i < count - 1; i++) {
    // Fritsch–Carlson 限制，避免过冲
    if (Math.abs(delta[i]) < 1e-6) {
      slopes[i] = 0;
      slopes[i + 1] = 0;
    } else {
      const alpha = slopes[i] / delta[i];
      const beta = slopes[i + 1] / delta[i];
      const magnitude = alpha * alpha + beta * beta;
      if (magnitude > 9) {
        const tau = 3 / Math.sqrt(magnitude);
        slopes[i] = tau * alpha * delta[i];
        slopes[i + 1] = tau * beta * delta[i];
      }
    }
  }

  for (let i = 0; i < size; i++) {
    const x = i / (size - 1);
    let value: number;
    if (x <= xs[0]) value = ys[0] + (x - xs[0]) * slopes[0];
    else if (x >= xs[count - 1]) value = ys[count - 1] + (x - xs[count - 1]) * slopes[count - 1];
    else {
      let segment = 0;
      while (segment < count - 2 && x > xs[segment + 1]) segment++;
      const h = xs[segment + 1] - xs[segment];
      const t = (x - xs[segment]) / h;
      const t2 = t * t;
      const t3 = t2 * t;
      value =
        (2 * t3 - 3 * t2 + 1) * ys[segment] +
        (t3 - 2 * t2 + t) * h * slopes[segment] +
        (-2 * t3 + 3 * t2) * ys[segment + 1] +
        (t3 - t2) * h * slopes[segment + 1];
    }
    lut[i] = Math.round(clamp01(value) * 255);
  }
  return lut;
}

/* ------------------------------------------------------------------ 遮罩 */

export type MaskKind = "linear" | "radial" | "sky" | "subject";

export interface MaskSpec {
  kind: MaskKind;
  /** 线性渐变的起点；径向渐变的圆心；天空/主体的忽略 */
  p1: Vec2;
  /** 线性渐变的终点；径向渐变边界上的点 */
  p2: Vec2;
  /** 羽化 0..100 */
  feather: number;
  invert: boolean;
}

export interface MaskRaster {
  width: number;
  height: number;
  alpha: Float32Array;
}

/**
 * 把遮罩描述栅格化成 0..1 的 alpha。
 * - linear：p1→p2 方向的投影渐变
 * - radial：以 p1 为心、|p2-p1| 为半径的椭圆渐变
 * - sky：画面高度的天空近似（顶部 100%，55% 处为 0）
 * - subject：中央偏下的椭圆近似主体
 */
export function maskAlpha(spec: MaskSpec, width: number, height: number): MaskRaster {
  const alpha = new Float32Array(width * height);
  const feather = clamp01(spec.feather / 100);
  const soft = Math.max(0.015, feather * 0.6);

  if (spec.kind === "linear") {
    const dx = spec.p2.x - spec.p1.x;
    const dy = spec.p2.y - spec.p1.y;
    const lengthSq = Math.max(1e-6, dx * dx + dy * dy);
    for (let y = 0; y < height; y++) {
      const ny = y / height;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const t = ((nx - spec.p1.x) * dx + (ny - spec.p1.y) * dy) / lengthSq;
        alpha[y * width + x] = smoothstep(0.5 - soft - 0.001, 0.5 + soft, t);
      }
    }
  } else if (spec.kind === "radial") {
    const cx = spec.p1.x;
    const cy = spec.p1.y;
    const rx = Math.max(0.02, Math.abs(spec.p2.x - spec.p1.x));
    const ry = Math.max(0.02, Math.abs(spec.p2.y - spec.p1.y));
    const inner = Math.max(0, 1 - feather * 0.85);
    for (let y = 0; y < height; y++) {
      const ny = (y / height - cy) / ry;
      for (let x = 0; x < width; x++) {
        const nx = (x / width - cx) / rx;
        const distance = Math.sqrt(nx * nx + ny * ny);
        alpha[y * width + x] = 1 - smoothstep(inner, 1.02, distance);
      }
    }
  } else if (spec.kind === "sky") {
    const lower = 0.5 + (1 - feather) * 0.12;
    const upper = 0.3 + (1 - feather) * 0.18;
    for (let y = 0; y < height; y++) {
      const value = 1 - smoothstep(upper, lower, y / height);
      for (let x = 0; x < width; x++) alpha[y * width + x] = value;
    }
  } else {
    const cx = 0.5;
    const cy = 0.56;
    const rx = 0.34 + feather * 0.1;
    const ry = 0.42 + feather * 0.1;
    for (let y = 0; y < height; y++) {
      const ny = (y / height - cy) / ry;
      for (let x = 0; x < width; x++) {
        const nx = (x / width - cx) / rx;
        const distance = Math.sqrt(nx * nx + ny * ny);
        alpha[y * width + x] = 1 - smoothstep(0.55, 1.02, distance);
      }
    }
  }

  if (spec.invert) {
    for (let i = 0; i < alpha.length; i++) alpha[i] = 1 - alpha[i];
  }
  return { width, height, alpha };
}

export function maskCenter(spec: MaskSpec): Vec2 {
  if (spec.kind === "linear") {
    return { x: (spec.p1.x + spec.p2.x) / 2, y: (spec.p1.y + spec.p2.y) / 2 };
  }
  return { ...spec.p1 };
}

/* ------------------------------------------------------------------ 渲染管线 */

/**
 * 主渲染入口：输入原始 ImageData，输出显影后的新 ImageData（不修改入参）。
 */
export function developImage(base: ImageData, params: DevelopParams): ImageData {
  const width = base.width;
  const height = base.height;
  const count = width * height;
  const src = base.data;
  const out = new Uint8ClampedArray(src.length);

  const lut = curveLut(params.curves);
  const useCurve = params.curves.length > 2;
  const useHsl = HSL_BANDS.some((band) => {
    const adjust = params.hsl[band];
    return adjust.hue !== 0 || adjust.sat !== 0 || adjust.lum !== 0;
  });
  const grading = params.grading;
  const useGrading =
    grading.shadows.sat > 0 || grading.midtones.sat > 0 || grading.highlights.sat > 0 || grading.balance !== 0;

  const exposureGain = Math.pow(2, params.exposure);
  const warmth = (params.temperature - 5500) / 5500;
  const wbR = Math.max(0.2, 1 + warmth * 0.46);
  const wbB = Math.max(0.2, 1 - warmth * 0.42);
  const wbG = Math.max(0.2, 1 - params.tint / 420);
  const wbMagenta = Math.max(0.2, 1 + params.tint / 520);

  const contrast = 1 + params.contrast / 100;
  const blackPoint = Math.max(-0.25, Math.min(0.25, params.blacks / 100 * 0.16));
  const whitePoint = Math.max(-0.2, Math.min(0.25, params.whites / 100 * 0.14));
  const highlightGain = params.highlights / 100;
  const shadowGain = params.shadows / 100;
  const satGain = 1 + params.saturation / 100;
  const vibAmount = params.vibrance / 100;
  const dehazeAmount = params.dehaze / 100;
  const textureAmount = params.texture / 100;
  const clarityAmount = params.clarity / 100;

  const gradeR: [number, number, number] = hslToRgb(grading.highlights.hue, 1, 0.5);
  const gradeG: [number, number, number] = hslToRgb(grading.midtones.hue, 1, 0.5);
  const gradeB: [number, number, number] = hslToRgb(grading.shadows.hue, 1, 0.5);

  const hslColor: Array<{ hue: number; sat: number; lum: number }> = HSL_BANDS.map((band) => params.hsl[band]);
  const hslAngle: number[] = HSL_BANDS.map((band) => BAND_HUE[band]);

  // 曲线 LUT 以 0..1 的浮点形式复用，避免每像素做整数索引转换
  const curveFloat = new Float32Array(256);
  for (let i = 0; i < 256; i++) curveFloat[i] = lut[i] / 255;

  const work = new Float32Array(count * 4);

  for (let i = 0, p = 0; i < count; i++, p += 4) {
    let r = src[p] / 255;
    let g = src[p + 1] / 255;
    let b = src[p + 2] / 255;

    // 白平衡
    r *= wbR * wbMagenta;
    g *= wbG;
    b *= wbB;

    // 曝光
    r *= exposureGain;
    g *= exposureGain;
    b *= exposureGain;

    // 黑白场
    const span = 1 + whitePoint - blackPoint;
    r = (r - blackPoint) / span;
    g = (g - blackPoint) / span;
    b = (b - blackPoint) / span;
    r = clamp01(r);
    g = clamp01(g);
    b = clamp01(b);

    // 高光 / 阴影：按亮度权重做 stop 级增益
    const l0 = luma(r, g, b);
    const hWeight = smoothstep(0.42, 1, l0);
    const sWeight = 1 - smoothstep(0, 0.6, l0);
    if (highlightGain !== 0 || shadowGain !== 0) {
      const gain = Math.pow(2, highlightGain * 0.85 * hWeight + shadowGain * 0.95 * sWeight);
      r *= gain;
      g *= gain;
      b *= gain;
    }

    // 对比度（围绕中灰）
    if (params.contrast !== 0) {
      r = (r - 0.5) * contrast + 0.5;
      g = (g - 0.5) * contrast + 0.5;
      b = (b - 0.5) * contrast + 0.5;
    }

    // 去雾：收黑场 + 提对比 + 补饱和（线性光近似）
    if (dehazeAmount !== 0) {
      const d = dehazeAmount;
      r = (r - 0.035 * d) / (1 - 0.05 * d);
      g = (g - 0.035 * d) / (1 - 0.05 * d);
      b = (b - 0.035 * d) / (1 - 0.05 * d);
    }

    r = clamp01(r);
    g = clamp01(g);
    b = clamp01(b);

    // 曲线
    if (useCurve) {
      r = curveFloat[(r * 255) | 0];
      g = curveFloat[(g * 255) | 0];
      b = curveFloat[(b * 255) | 0];
    }

    // 黑白
    if (params.monochrome) {
      const l = luma(r, g, b);
      r = l;
      g = l;
      b = l;
    }

    // 色彩混合器（8 色带 HSL）
    if (useHsl && !params.monochrome) {
      let [h, s, l] = rgbToHsl(r, g, b);
      if (s > 0.02) {
        let hueShift = 0;
        let satScale = 1;
        let lumShift = 0;
        for (let band = 0; band < 8; band++) {
          const adjust = hslColor[band];
          if (adjust.hue === 0 && adjust.sat === 0 && adjust.lum === 0) continue;
          let delta = Math.abs(h - hslAngle[band]);
          if (delta > 180) delta = 360 - delta;
          const weight = Math.pow(Math.max(0, 1 - delta / 55), 1.4);
          if (weight <= 0) continue;
          hueShift += adjust.hue * weight * 0.35;
          satScale += (adjust.sat / 100) * weight;
          lumShift += (adjust.lum / 100) * weight * 0.35;
        }
        h = (h + hueShift) % 360;
        s = clamp01(s * Math.max(0, satScale));
        l = clamp01(l + lumShift);
        [r, g, b] = hslToRgb(h, s, l);
      }
    }

    // 自然饱和度 / 饱和度
    if (!params.monochrome && (vibAmount !== 0 || params.saturation !== 0)) {
      const l = luma(r, g, b);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max <= 0 ? 0 : (max - min) / max;
      const vibrance = vibAmount * (1 - saturation);
      const gain = Math.max(0, 1 + vibrance + (satGain - 1));
      r = l + (r - l) * gain;
      g = l + (g - l) * gain;
      b = l + (b - l) * gain;
    }

    // 颜色分级：三区染色 + 明度
    if (useGrading && !params.monochrome) {
      const l = luma(r, g, b);
      const balance = grading.balance / 200;
      const wShadow = clamp01(1 - (l + balance) / 0.55);
      const wHigh = clamp01((l - 0.45 + balance) / 0.55);
      const wMid = Math.max(0, 1 - wShadow - wHigh);
      const zones: Array<[{ hue: number; sat: number; lum: number }, [number, number, number], number]> = [
        [grading.shadows, gradeB, wShadow],
        [grading.midtones, gradeG, wMid],
        [grading.highlights, gradeR, wHigh]
      ];
      for (const [zone, tint, weight] of zones) {
        if (weight <= 0) continue;
        const amount = (zone.sat / 100) * weight * 0.55;
        if (amount > 0) {
          r += (tint[0] * 0.9 - r + r * tint[0] * 0.4) * amount;
          g += (tint[1] * 0.9 - g + g * tint[1] * 0.4) * amount;
          b += (tint[2] * 0.9 - b + b * tint[2] * 0.4) * amount;
        }
        const lum = (zone.lum / 100) * weight * 0.45;
        if (lum !== 0) {
          r *= 1 + lum;
          g *= 1 + lum;
          b *= 1 + lum;
        }
      }
    }

    work[p] = clamp01(r);
    work[p + 1] = clamp01(g);
    work[p + 2] = clamp01(b);
    work[p + 3] = src[p + 3] / 255;
  }

  // 邻域算子：纹理 / 清晰度 / 锐化 / 降噪在亮度域做，避免逐像素重算整条管线
  const needsNeighborhood =
    textureAmount !== 0 || clarityAmount !== 0 || params.sharpening > 0 || params.noiseReduction > 0;

  if (needsNeighborhood) {
    const lumaBuf = new Float32Array(count);
    for (let i = 0, p = 0; i < count; i++, p += 4) {
      lumaBuf[i] = luma(work[p], work[p + 1], work[p + 2]);
    }
    const fineBlur = boxBlur(lumaBuf, width, height, 1);
    const midBlur = boxBlur(lumaBuf, width, height, Math.max(2, Math.round(width / 90)));
    const coarseBlur = boxBlur(lumaBuf, width, height, Math.max(4, Math.round(width / 28)));

    for (let i = 0, p = 0; i < count; i++, p += 4) {
      let delta = 0;
      if (textureAmount !== 0) delta += (lumaBuf[i] - fineBlur[i]) * textureAmount * 1.1;
      if (clarityAmount !== 0) delta += (lumaBuf[i] - coarseBlur[i]) * clarityAmount * 0.9;
      if (params.sharpening > 0) delta += (lumaBuf[i] - fineBlur[i]) * (params.sharpening / 100) * 1.8;
      if (params.noiseReduction > 0) delta -= (lumaBuf[i] - midBlur[i]) * (params.noiseReduction / 100) * 0.5;
      if (delta !== 0) {
        work[p] = clamp01(work[p] + delta);
        work[p + 1] = clamp01(work[p + 1] + delta);
        work[p + 2] = clamp01(work[p + 2] + delta);
      }
    }
  }

  const vignetteAmount = -params.vignette / 100;
  const grainAmount = params.grain / 100;
  const cx = 0.5;
  const cy = 0.5;

  for (let y = 0; y < height; y++) {
    const ny = (y / height - cy) * 2;
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4;
      let r = work[p];
      let g = work[p + 1];
      let b = work[p + 2];

      if (vignetteAmount !== 0) {
        const nx = (x / width - cx) * 2 * 0.75;
        const distance = Math.sqrt(nx * nx + ny * ny * 0.7);
        const falloff = smoothstep(0.55, 1.5, distance);
        const scale = 1 - vignetteAmount * falloff * 0.75;
        r *= scale;
        g *= scale;
        b *= scale;
      }

      if (grainAmount > 0) {
        let h = (x * 374761393 + y * 668265263) | 0;
        h = (h ^ (h >> 13)) * 1274126177;
        const noise = (((h ^ (h >> 16)) >>> 0) / 4294967295 - 0.5) * grainAmount * 0.13;
        r += noise;
        g += noise;
        b += noise;
      }

      out[p] = r * 255;
      out[p + 1] = g * 255;
      out[p + 2] = b * 255;
      out[p + 3] = work[p + 3] * 255;
    }
  }

  return new ImageData(out, width, height);
}

/** 可分离盒式模糊（两次单边滑动平均近似高斯）。 */
function boxBlur(input: Float32Array, width: number, height: number, radius: number): Float32Array {
  const temp = new Float32Array(input.length);
  const output = new Float32Array(input.length);
  const window = radius * 2 + 1;

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    for (let x = -radius; x <= radius; x++) {
      sum += input[row + Math.min(width - 1, Math.max(0, x))];
    }
    for (let x = 0; x < width; x++) {
      temp[row + x] = sum / window;
      sum -= input[row + Math.min(width - 1, Math.max(0, x - radius))];
      sum += input[row + Math.min(width - 1, Math.max(0, x + radius + 1))];
    }
  }

  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = -radius; y <= radius; y++) {
      sum += temp[Math.min(height - 1, Math.max(0, y)) * width + x];
    }
    for (let y = 0; y < height; y++) {
      output[y * width + x] = sum / window;
      sum -= temp[Math.min(height - 1, Math.max(0, y - radius)) * width + x];
      sum += temp[Math.min(height - 1, Math.max(0, y + radius + 1)) * width + x];
    }
  }
  return output;
}

/** 局部调整：把 maskParams 再跑一遍管线，并用 alpha 与全局结果混合。 */
export function applyMaskedAdjust(
  developed: ImageData,
  alpha: Float32Array,
  maskParams: DevelopParams
): ImageData {
  const adjusted = developImage(developed, maskParams);
  const out = new Uint8ClampedArray(developed.data.length);
  const base = developed.data;
  const mask = adjusted.data;
  for (let i = 0, p = 0; i < alpha.length; i++, p += 4) {
    const a = alpha[i];
    if (a <= 0.001) {
      out[p] = base[p];
      out[p + 1] = base[p + 1];
      out[p + 2] = base[p + 2];
      out[p + 3] = base[p + 3];
    } else if (a >= 0.999) {
      out[p] = mask[p];
      out[p + 1] = mask[p + 1];
      out[p + 2] = mask[p + 2];
      out[p + 3] = mask[p + 3];
    } else {
      out[p] = base[p] + (mask[p] - base[p]) * a;
      out[p + 1] = base[p + 1] + (mask[p + 1] - base[p + 1]) * a;
      out[p + 2] = base[p + 2] + (mask[p + 2] - base[p + 2]) * a;
      out[p + 3] = base[p + 3] + (mask[p + 3] - base[p + 3]) * a;
    }
  }
  return new ImageData(out, developed.width, developed.height);
}

/* ------------------------------------------------------------------ 直方图 */

export interface Histogram {
  red: Uint32Array;
  green: Uint32Array;
  blue: Uint32Array;
  luma: Uint32Array;
  max: number;
}

export function computeHistogram(image: ImageData): Histogram {
  const red = new Uint32Array(256);
  const green = new Uint32Array(256);
  const blue = new Uint32Array(256);
  const lumaBins = new Uint32Array(256);
  const data = image.data;
  // 大图抽样，直方图形状足够稳定，滚动滑杆时更跟手
  const step = Math.max(1, Math.floor(Math.sqrt((image.width * image.height) / 120000)));
  for (let y = 0; y < image.height; y += step) {
    for (let x = 0; x < image.width; x += step) {
      const p = (y * image.width + x) * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      red[r]++;
      green[g]++;
      blue[b]++;
      lumaBins[(0.2126 * r + 0.7152 * g + 0.0722 * b) | 0]++;
    }
  }
  let max = 1;
  for (let i = 1; i < 255; i++) {
    max = Math.max(max, red[i], green[i], blue[i]);
  }
  return { red, green, blue, luma: lumaBins, max };
}

/* ------------------------------------------------------------------ 自动 / 预设 */

/** 「自动」按钮：用亮度分布的百分位给出一组保守的色调参数。 */
export function autoTone(image: ImageData): Partial<DevelopParams> {
  const histogram = computeHistogram(image);
  const total = histogram.luma.reduce((sum, value) => sum + value, 0) || 1;
  const percentile = (fraction: number): number => {
    let acc = 0;
    for (let i = 0; i < 256; i++) {
      acc += histogram.luma[i];
      if (acc / total >= fraction) return i / 255;
    }
    return 1;
  };
  const low = percentile(0.01);
  const high = percentile(0.99);
  const median = percentile(0.5);
  const exposure = Math.max(-1.2, Math.min(1.2, Math.log2(0.44 / Math.max(0.08, median))));
  const shadows = Math.round(Math.max(-40, Math.min(40, (0.18 - low) * 260)));
  const highlights = Math.round(Math.max(-55, Math.min(20, (0.86 - high) * 220)));
  return {
    exposure: Math.round(exposure * 100) / 100,
    contrast: median > 0.5 ? -6 : 8,
    shadows,
    highlights,
    whites: Math.round(Math.max(-15, Math.min(25, (0.96 - high) * 120))),
    blacks: Math.round(Math.max(-25, Math.min(15, (0.04 - low) * 160)))
  };
}

export interface Preset {
  id: string;
  name: string;
  group: "黑白" | "彩色" | "风景" | "人像";
  params: Partial<DevelopParams>;
}

const sCurve = (strength: number): CurvePoint[] => [
  { x: 0, y: 0 },
  { x: 0.25, y: 0.25 - strength * 0.06 },
  { x: 0.75, y: 0.75 + strength * 0.06 },
  { x: 1, y: 1 }
];

const fadeCurve: CurvePoint[] = [
  { x: 0, y: 0.06 },
  { x: 0.3, y: 0.32 },
  { x: 0.7, y: 0.72 },
  { x: 1, y: 0.96 }
];

export const PRESETS: Preset[] = [
  { id: "original", name: "原图", group: "彩色", params: {} },
  {
    id: "mono-film",
    name: "黑白胶片",
    group: "黑白",
    params: { monochrome: true, contrast: 12, grain: 22, vignette: -18, curves: sCurve(1) }
  },
  {
    id: "mono-high",
    name: "高反差黑白",
    group: "黑白",
    params: { monochrome: true, contrast: 42, clarity: 26, blacks: -18, whites: 16, curves: sCurve(1.6) }
  },
  {
    id: "mono-soft",
    name: "柔调黑白",
    group: "黑白",
    params: { monochrome: true, contrast: -12, highlights: -20, shadows: 24, grain: 12 }
  },
  {
    id: "warm-sunset",
    name: "暖色日落",
    group: "风景",
    params: { temperature: 6400, tint: 8, exposure: 0.15, contrast: 16, highlights: -28, shadows: 22, vibrance: 24, clarity: 14 }
  },
  {
    id: "teal-orange",
    name: "青橙电影",
    group: "彩色",
    params: {
      contrast: 18,
      highlights: -18,
      shadows: 14,
      vibrance: 12,
      grading: {
        shadows: { hue: 195, sat: 34, lum: -6 },
        midtones: { hue: 30, sat: 16, lum: 0 },
        highlights: { hue: 38, sat: 30, lum: 4 },
        balance: 0
      }
    }
  },
  {
    id: "faded",
    name: "褪色胶片",
    group: "彩色",
    params: { contrast: -14, highlights: -10, shadows: 18, blacks: 12, saturation: -12, grain: 26, curves: fadeCurve }
  },
  {
    id: "cool-morning",
    name: "冷调清晨",
    group: "风景",
    params: { temperature: 4700, tint: -6, exposure: 0.2, highlights: -18, shadows: 26, vibrance: 10, saturation: -6 }
  },
  {
    id: "pastel",
    name: "淡彩",
    group: "彩色",
    params: { contrast: -18, highlights: -22, shadows: 30, whites: 10, saturation: -16, vibrance: 8, clarity: -10 }
  },
  {
    id: "sepia",
    name: "复古棕褐",
    group: "彩色",
    params: {
      saturation: -30,
      temperature: 7000,
      tint: 14,
      contrast: 10,
      grain: 18,
      grading: {
        shadows: { hue: 32, sat: 46, lum: 0 },
        midtones: { hue: 36, sat: 40, lum: 0 },
        highlights: { hue: 44, sat: 32, lum: 0 },
        balance: 0
      }
    }
  },
  {
    id: "forest-mist",
    name: "森林晨雾",
    group: "风景",
    params: { temperature: 5100, tint: 4, contrast: -8, highlights: -30, shadows: 18, dehaze: -14, clarity: 8, vibrance: 6 }
  },
  {
    id: "night-blue",
    name: "夜景蓝调",
    group: "风景",
    params: {
      exposure: 0.25,
      contrast: 20,
      blacks: -16,
      vibrance: 18,
      grading: {
        shadows: { hue: 215, sat: 40, lum: -8 },
        midtones: { hue: 220, sat: 12, lum: 0 },
        highlights: { hue: 205, sat: 10, lum: 0 },
        balance: -12
      }
    }
  },
  {
    id: "portrait-soft",
    name: "人像柔和",
    group: "人像",
    params: { exposure: 0.2, contrast: -8, highlights: -18, shadows: 24, clarity: -16, texture: -12, vibrance: 8 }
  },
  {
    id: "dramatic",
    name: "戏剧对比",
    group: "风景",
    params: { contrast: 32, highlights: -40, shadows: 20, blacks: -20, clarity: 30, dehaze: 18, curves: sCurve(1.8) }
  },
  {
    id: "metal",
    name: "金属质感",
    group: "彩色",
    params: { contrast: 26, clarity: 36, texture: 22, blacks: -14, saturation: -14, vibrance: 16 }
  },
  {
    id: "cyber",
    name: "赛博霓虹",
    group: "彩色",
    params: {
      contrast: 24,
      saturation: 18,
      vibrance: 12,
      grading: {
        shadows: { hue: 275, sat: 42, lum: 0 },
        midtones: { hue: 300, sat: 18, lum: 0 },
        highlights: { hue: 185, sat: 38, lum: 6 },
        balance: 0
      }
    }
  },
  {
    id: "clean",
    name: "干净通透",
    group: "风景",
    params: { exposure: 0.12, contrast: 8, highlights: -18, shadows: 16, whites: 10, vibrance: 12, clarity: 10 }
  },
  {
    id: "autumn",
    name: "深秋",
    group: "彩色",
    params: {
      temperature: 6200,
      contrast: 12,
      vibrance: 20,
      hsl: {
        red: { hue: -6, sat: 12, lum: 0 },
        orange: { hue: 4, sat: 18, lum: 4 },
        yellow: { hue: -8, sat: 16, lum: 0 },
        green: { hue: -18, sat: -18, lum: -6 },
        aqua: { hue: 0, sat: -10, lum: 0 },
        blue: { hue: 0, sat: -14, lum: 0 },
        purple: { hue: 0, sat: 0, lum: 0 },
        magenta: { hue: 0, sat: 0, lum: 0 }
      }
    }
  },
  {
    id: "noir",
    name: "夜色黑白",
    group: "黑白",
    params: { monochrome: true, exposure: -0.2, contrast: 30, blacks: -24, highlights: 10, clarity: 20, vignette: -34, curves: sCurve(1.4) }
  }
];

/** 把预设合并进当前参数（曲线/HSL/分级做深合并）。 */
export function applyPreset(params: DevelopParams, preset: Preset): DevelopParams {
  const next = cloneDevelop(params);
  const source = preset.params;
  if (preset.id === "original") {
    return createDevelop();
  }
  for (const key of Object.keys(source) as Array<keyof DevelopParams>) {
    const value = source[key];
    if (value === undefined) continue;
    if (key === "hsl") {
      const hsl = value as Record<HslBand, HslAdjust>;
      for (const band of HSL_BANDS) next.hsl[band] = { ...next.hsl[band], ...hsl[band] };
    } else if (key === "grading") {
      const grading = value as GradingParams;
      next.grading = {
        ...next.grading,
        ...grading,
        shadows: { ...next.grading.shadows, ...grading.shadows },
        midtones: { ...next.grading.midtones, ...grading.midtones },
        highlights: { ...next.grading.highlights, ...grading.highlights }
      };
    } else if (key === "curves") {
      next.curves = (value as CurvePoint[]).map((point) => ({ ...point }));
    } else {
      (next as unknown as Record<string, unknown>)[key] = value;
    }
  }
  return next;
}

/* ------------------------------------------------------------------ 导出 */

export interface DevelopTarget {
  /** 原始（或已缩放）画布 */
  canvas: HTMLCanvasElement;
  params: DevelopParams;
  /** 可选的遮罩再调整 */
  mask?: { alpha: Float32Array; params: DevelopParams };
}

/** 在给定画布上完成一次完整显影，返回新画布（不修改入参）。 */
export function renderDeveloped(target: DevelopTarget): HTMLCanvasElement {
  const { canvas, params, mask } = target;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("2D context unavailable");
  const base = context.getImageData(0, 0, canvas.width, canvas.height);
  let developed = developImage(base, params);
  if (mask) developed = applyMaskedAdjust(developed, mask.alpha, mask.params);
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const outContext = out.getContext("2d");
  if (!outContext) throw new Error("2D context unavailable");
  outContext.putImageData(developed, 0, 0);
  return out;
}

/** 导出 dataURL（PNG / JPEG）。 */
export function exportDataUrl(canvas: HTMLCanvasElement, format: "png" | "jpeg", quality = 0.92): string {
  if (format === "jpeg") {
    const flattened = document.createElement("canvas");
    flattened.width = canvas.width;
    flattened.height = canvas.height;
    const context = flattened.getContext("2d");
    if (!context) throw new Error("2D context unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvas, 0, 0);
    return flattened.toDataURL("image/jpeg", quality);
  }
  return canvas.toDataURL("image/png");
}
