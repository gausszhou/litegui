/**
 * Generative artwork for the Photocraft demo canvas.
 *
 * The picture is an original, stylised woodblock-inspired seascape
 * ("The Great Wave" placeholder). Everything is drawn procedurally so the
 * demo ships without any external or copyrighted image asset.
 */

type Ctx = CanvasRenderingContext2D;

interface Point {
  x: number;
  y: number;
}

interface Cubic {
  p0: Point;
  c1: Point;
  c2: Point;
  p3: Point;
}

export const ART_WIDTH = 3000;
export const ART_HEIGHT = 2000;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom style cubic evaluation. */
function cubicAt(cubic: Cubic, t: number): Point {
  const it = 1 - t;
  const a = it * it * it;
  const b = 3 * it * it * t;
  const c = 3 * it * t * t;
  const d = t * t * t;
  return {
    x: a * cubic.p0.x + b * cubic.c1.x + c * cubic.c2.x + d * cubic.p3.x,
    y: a * cubic.p0.y + b * cubic.c1.y + c * cubic.c2.y + d * cubic.p3.y,
  };
}

function chainAt(chain: Cubic[], t: number): Point {
  const wrapped = clamp01(t) * chain.length;
  const index = Math.min(chain.length - 1, Math.floor(wrapped));
  return cubicAt(chain[index], wrapped - index);
}

/**
 * Silhouette of one breaking wave in unit space (x -0.06..0.78, y 0.08..1.05):
 * long back swell, high crest, overhanging lip and a steep front face.
 */
function curlBody(ctx: Ctx): void {
  ctx.moveTo(-0.06, 1.05);
  ctx.bezierCurveTo(-0.03, 0.74, 0.01, 0.43, 0.13, 0.26);
  ctx.bezierCurveTo(0.24, 0.08, 0.4, 0.02, 0.54, 0.08);
  ctx.bezierCurveTo(0.67, 0.14, 0.75, 0.25, 0.77, 0.4);
  ctx.bezierCurveTo(0.74, 0.47, 0.68, 0.5, 0.63, 0.49);
  ctx.bezierCurveTo(0.58, 0.48, 0.55, 0.52, 0.53, 0.58);
  ctx.bezierCurveTo(0.49, 0.7, 0.42, 0.84, 0.25, 0.96);
  ctx.bezierCurveTo(0.16, 1.01, 0.06, 1.04, 0.02, 1.05);
  ctx.closePath();
}

/** Shadowed underside of the overhanging lip, plus the tube opening. */
function lipShadow(ctx: Ctx): void {
  ctx.moveTo(0.77, 0.4);
  ctx.bezierCurveTo(0.74, 0.47, 0.68, 0.5, 0.63, 0.49);
  ctx.bezierCurveTo(0.58, 0.48, 0.55, 0.52, 0.53, 0.58);
  ctx.bezierCurveTo(0.58, 0.63, 0.66, 0.59, 0.72, 0.51);
  ctx.bezierCurveTo(0.76, 0.46, 0.78, 0.42, 0.77, 0.4);
  ctx.closePath();
}

/** Outer edge of the crest, used for the foam line and spray sampling. */
const CREST_CHAIN: Cubic[] = [
  { p0: { x: -0.06, y: 1.03 }, c1: { x: -0.03, y: 0.73 }, c2: { x: 0.03, y: 0.42 }, p3: { x: 0.13, y: 0.26 } },
  { p0: { x: 0.13, y: 0.26 }, c1: { x: 0.24, y: 0.08 }, c2: { x: 0.4, y: 0.02 }, p3: { x: 0.54, y: 0.08 } },
  { p0: { x: 0.54, y: 0.08 }, c1: { x: 0.67, y: 0.14 }, c2: { x: 0.75, y: 0.25 }, p3: { x: 0.77, y: 0.4 } },
];

function drawSpray(ctx: Ctx, x: number, y: number, angle: number, size: number, alpha: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#eaf4f4";
  const puffs = 3;
  for (let i = 0; i < puffs; i += 1) {
    const reach = size * (0.55 + i * 0.55);
    const radius = size * (0.36 - i * 0.09);
    ctx.beginPath();
    ctx.arc(reach, Math.sin(i * 2.1) * size * 0.28, Math.max(0.0016, radius), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawClaw(ctx: Ctx, x: number, y: number, angle: number, length: number, alpha: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#eef7f7";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.55, -length * 0.42, length, length * 0.05);
  ctx.quadraticCurveTo(length * 0.62, -length * 0.02, 0, length * 0.26);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws one curling wave.
 * `cx` is the horizontal centre of the crest, `baseline` the y of the water line,
 * `sx`/`sy` the size in pixels of the unit shape.
 */
function drawCurl(
  ctx: Ctx,
  cx: number,
  baseline: number,
  sx: number,
  sy: number,
  painter: (target: Ctx) => void,
  foam: number,
  foamAlpha: number,
): void {
  ctx.save();
  ctx.translate(cx - 0.5 * sx, baseline - 1.05 * sy);
  ctx.scale(sx, sy);
  painter(ctx);

  if (foam > 0) {
    const unitScale = (sx + sy) / 2;
    // Foam line along the crest.
    ctx.beginPath();
    ctx.moveTo(CREST_CHAIN[0].p0.x, CREST_CHAIN[0].p0.y);
    for (const cubic of CREST_CHAIN) {
      ctx.bezierCurveTo(cubic.c1.x, cubic.c1.y, cubic.c2.x, cubic.c2.y, cubic.p3.x, cubic.p3.y);
    }
    ctx.strokeStyle = `rgba(231, 244, 244, ${0.72 * foamAlpha})`;
    ctx.lineWidth = 3.2 / unitScale;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Foam claws and spray along the crest.
    const steps = 22;
    for (let i = 0; i < steps; i += 1) {
      const t = 0.2 + (i / steps) * 0.76;
      const point = chainAt(CREST_CHAIN, t);
      const ahead = chainAt(CREST_CHAIN, Math.min(1, t + 0.012));
      const behind = chainAt(CREST_CHAIN, Math.max(0, t - 0.012));
      let nx = -(ahead.y - behind.y);
      let ny = ahead.x - behind.x;
      const norm = Math.hypot(nx, ny) || 1;
      nx /= norm;
      ny /= norm;
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }
      const angle = Math.atan2(ny, nx);
      const clawLength = (0.022 + ((i * 7) % 5) * 0.004) * (0.6 + t * 0.8);
      drawClaw(
        ctx,
        point.x + nx * 0.004,
        point.y + ny * 0.004,
        angle,
        clawLength,
        foamAlpha * (0.55 + 0.45 * Math.sin(i * 1.7) ** 2),
      );
      if (i % 2 === 0) {
        drawSpray(
          ctx,
          point.x + nx * 0.022,
          point.y + ny * 0.022,
          angle,
          clawLength * 1.5,
          foamAlpha * 0.5,
        );
      }
    }

    // A thick, soft foam band along the leading edge.
    ctx.beginPath();
    ctx.moveTo(CREST_CHAIN[0].p0.x, CREST_CHAIN[0].p0.y);
    for (const cubic of CREST_CHAIN) {
      ctx.bezierCurveTo(cubic.c1.x, cubic.c1.y, cubic.c2.x, cubic.c2.y, cubic.p3.x, cubic.p3.y);
    }
    ctx.strokeStyle = `rgba(246, 251, 251, ${0.28 * foamAlpha})`;
    ctx.lineWidth = 9 / unitScale;
    ctx.stroke();
  }
  ctx.restore();
}

function drawFuji(ctx: Ctx, w: number, h: number): void {
  const peakX = 0.735 * w;
  const peakY = 0.575 * h;
  const baseY = 0.705 * h;
  const halfBase = 0.135 * w;

  const body = ctx.createLinearGradient(peakX, peakY, peakX, baseY);
  body.addColorStop(0, "#2c4257");
  body.addColorStop(0.55, "#203346");
  body.addColorStop(1, "#172736");

  ctx.beginPath();
  ctx.moveTo(peakX - halfBase, baseY);
  ctx.bezierCurveTo(peakX - halfBase * 0.5, baseY - (baseY - peakY) * 0.45, peakX - 0.035 * w, peakY + 0.012 * h, peakX, peakY);
  ctx.bezierCurveTo(peakX + 0.035 * w, peakY + 0.012 * h, peakX + halfBase * 0.5, baseY - (baseY - peakY) * 0.45, peakX + halfBase, baseY);
  ctx.closePath();
  ctx.fillStyle = body;
  ctx.fill();

  // Snow cap with a ragged lower edge.
  const capHeight = (baseY - peakY) * 0.34;
  ctx.beginPath();
  ctx.moveTo(peakX - 0.033 * w, peakY + capHeight);
  ctx.lineTo(peakX - 0.022 * w, peakY + capHeight * 0.72);
  ctx.lineTo(peakX - 0.015 * w, peakY + capHeight * 0.92);
  ctx.lineTo(peakX - 0.007 * w, peakY + capHeight * 0.62);
  ctx.lineTo(peakX, peakY + capHeight * 0.84);
  ctx.lineTo(peakX + 0.008 * w, peakY + capHeight * 0.6);
  ctx.lineTo(peakX + 0.016 * w, peakY + capHeight * 0.9);
  ctx.lineTo(peakX + 0.023 * w, peakY + capHeight * 0.66);
  ctx.lineTo(peakX + 0.033 * w, peakY + capHeight);
  ctx.bezierCurveTo(peakX + 0.018 * w, peakY + capHeight * 0.2, peakX - 0.018 * w, peakY + capHeight * 0.2, peakX - 0.033 * w, peakY + capHeight);
  ctx.closePath();
  ctx.fillStyle = "rgba(226, 237, 238, 0.92)";
  ctx.fill();
}

function drawSky(ctx: Ctx, w: number, h: number): void {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, "#071a2c");
  sky.addColorStop(0.42, "#0f3a55");
  sky.addColorStop(0.72, "#2b7189");
  sky.addColorStop(1, "#9dc9cf");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Low sun.
  const sunX = 0.735 * w;
  const sunY = 0.215 * h;
  const sunR = 0.05 * w;
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3.4);
  glow.addColorStop(0, "rgba(255, 236, 205, 0.55)");
  glow.addColorStop(0.45, "rgba(255, 219, 170, 0.14)");
  glow.addColorStop(1, "rgba(255, 210, 150, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - sunR * 3.4, sunY - sunR * 3.4, sunR * 6.8, sunR * 6.8);

  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(248, 238, 214, 0.9)";
  ctx.fill();

  // Soft horizontal cloud streaks.
  const streak = ctx.createLinearGradient(0, 0, w, 0);
  streak.addColorStop(0, "rgba(220, 236, 240, 0)");
  streak.addColorStop(0.45, "rgba(220, 236, 240, 0.16)");
  streak.addColorStop(1, "rgba(220, 236, 240, 0)");
  ctx.strokeStyle = streak;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    const y = h * (0.12 + i * 0.045);
    const x0 = w * (0.04 + i * 0.06);
    const x1 = w * (0.55 + i * 0.07);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.bezierCurveTo(x0 + (x1 - x0) * 0.35, y - 14, x0 + (x1 - x0) * 0.7, y + 10, x1, y - 2);
    ctx.lineWidth = 10 - i * 1.4;
    ctx.stroke();
  }
}

function drawSea(ctx: Ctx, w: number, h: number): void {
  const sea = ctx.createLinearGradient(0, h * 0.66, 0, h);
  sea.addColorStop(0, "#3f8ba0");
  sea.addColorStop(0.28, "#1d5f7d");
  sea.addColorStop(0.7, "#0e3550");
  sea.addColorStop(1, "#071c2d");
  ctx.fillStyle = sea;
  ctx.fillRect(0, h * 0.665, w, h * 0.335);

  // Distant horizon line and glints.
  ctx.fillStyle = "rgba(214, 236, 238, 0.22)";
  ctx.fillRect(0, h * 0.664, w, 2);
  ctx.strokeStyle = "rgba(214, 238, 240, 0.22)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i += 1) {
    const x = w * (0.02 + i * 0.07);
    const y = h * (0.675 + (i % 4) * 0.012);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w * 0.035, y - 2);
    ctx.stroke();
  }
}

function drawForeground(ctx: Ctx, w: number, h: number): void {
  // Bottom swell.
  const swell = ctx.createLinearGradient(0, h * 0.8, 0, h);
  swell.addColorStop(0, "rgba(11, 46, 68, 0.2)");
  swell.addColorStop(1, "#05131f");
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.88);
  ctx.bezierCurveTo(w * 0.18, h * 0.82, w * 0.34, h * 0.93, w * 0.52, h * 0.9);
  ctx.bezierCurveTo(w * 0.7, h * 0.87, w * 0.84, h * 0.8, w, h * 0.86);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = swell;
  ctx.fill();

  // Foam streaks across the foreground.
  const rand = mulberry32(1831);
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i += 1) {
    const y = h * (0.86 + i * 0.014);
    const x0 = w * rand() * 0.5;
    const len = w * (0.08 + rand() * 0.16);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.quadraticCurveTo(x0 + len * 0.5, y - h * 0.012, x0 + len, y + h * 0.004);
    ctx.strokeStyle = `rgba(226, 242, 242, ${0.1 + rand() * 0.16})`;
    ctx.lineWidth = 2 + rand() * 4;
    ctx.stroke();
  }
}

function drawWaves(ctx: Ctx, w: number, h: number): void {
  // Back swell behind the main crest.
  drawCurl(
    ctx,
    0.12 * w,
    0.8 * h,
    0.36 * w,
    0.32 * h,
    (target) => {
      const back = target.createLinearGradient(0, 0.15, 0, 1.1);
      back.addColorStop(0, "#4b9bb0");
      back.addColorStop(0.55, "#1c6182");
      back.addColorStop(1, "#0b2f49");
      target.beginPath();
      curlBody(target);
      target.fillStyle = back;
      target.fill();
      target.beginPath();
      lipShadow(target);
      target.fillStyle = "rgba(5, 22, 34, 0.5)";
      target.fill();
    },
    0.5,
    0.3,
  );

  // Secondary crest on the right.
  drawCurl(
    ctx,
    0.9 * w,
    0.99 * h,
    0.3 * w,
    0.34 * h,
    (target) => {
      const right = target.createLinearGradient(0, 0.35, 0, 1.1);
      right.addColorStop(0, "#57a7b8");
      right.addColorStop(0.5, "#20708f");
      right.addColorStop(1, "#0a2b43");
      target.beginPath();
      curlBody(target);
      target.fillStyle = right;
      target.fill();

      target.beginPath();
      lipShadow(target);
      const hollow = target.createLinearGradient(0, 0.45, 0, 0.75);
      hollow.addColorStop(0, "rgba(3, 16, 27, 0.6)");
      hollow.addColorStop(1, "rgba(3, 16, 27, 0.1)");
      target.fillStyle = hollow;
      target.fill();
    },
    0.6,
    0.45,
  );

  // The Great Wave.
  drawCurl(
    ctx,
    0.34 * w,
    1.03 * h,
    0.64 * w,
    0.96 * h,
    (target) => {
      const body = target.createLinearGradient(0.0, 1.0, 0.56, 0.09);
      body.addColorStop(0, "#061625");
      body.addColorStop(0.32, "#0c3550");
      body.addColorStop(0.6, "#186a8b");
      body.addColorStop(0.82, "#3d9aae");
      body.addColorStop(1, "#a8dde0");
      target.beginPath();
      curlBody(target);
      target.fillStyle = body;
      target.fill();

      // Shadow under the overhanging lip.
      target.beginPath();
      lipShadow(target);
      const shadow = target.createLinearGradient(0, 0.42, 0, 0.62);
      shadow.addColorStop(0, "rgba(2, 10, 18, 0.72)");
      shadow.addColorStop(1, "rgba(2, 12, 20, 0.28)");
      target.fillStyle = shadow;
      target.fill();

      // Soft sheen along the crest mass.
      target.globalAlpha = 0.1;
      target.strokeStyle = "#cfeeef";
      target.lineWidth = 0.012;
      target.beginPath();
      target.moveTo(-0.05, 0.9);
      target.bezierCurveTo(0.0, 0.66, 0.03, 0.44, 0.14, 0.28);
      target.stroke();
      target.globalAlpha = 1;
    },
    1,
    1,
  );

  // Spray drifting off the crest.
  const rand = mulberry32(9173);
  for (let i = 0; i < 90; i += 1) {
    const point = chainAt(CREST_CHAIN, 0.22 + rand() * 0.74);
    const x = (0.02 + point.x * 0.64 + (rand() - 0.2) * 0.06) * w;
    const y = (0.02 + point.y * 0.96 - rand() * 0.075) * h;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + rand() * 2.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 248, 248, ${0.12 + rand() * 0.4})`;
    ctx.fill();
  }
}

/** Paints the full artwork into the given 2D context. */
export function drawArtwork(ctx: Ctx, w: number, h: number): void {
  ctx.save();
  drawSky(ctx, w, h);
  drawFuji(ctx, w, h);
  drawSea(ctx, w, h);
  drawWaves(ctx, w, h);
  drawForeground(ctx, w, h);
  ctx.restore();
}

/** Renders the artwork once into an offscreen canvas. */
export function createArtwork(width = ART_WIDTH, height = ART_HEIGHT): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  drawArtwork(ctx, width, height);
  return canvas;
}

/** Transparent vignette/grain overlay used by the "Effects" layer. */
export function createEffectsOverlay(width = ART_WIDTH, height = ART_HEIGHT): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.44, Math.min(width, height) * 0.2, width * 0.5, height * 0.44, Math.max(width, height) * 0.78);
  vignette.addColorStop(0, "rgba(4, 10, 18, 0)");
  vignette.addColorStop(0.62, "rgba(4, 10, 18, 0.16)");
  vignette.addColorStop(1, "rgba(2, 6, 12, 0.58)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  const warm = ctx.createRadialGradient(width * 0.78, height * 0.16, 0, width * 0.78, height * 0.16, width * 0.4);
  warm.addColorStop(0, "rgba(255, 214, 160, 0.16)");
  warm.addColorStop(1, "rgba(255, 214, 160, 0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, width, height);

  const rand = mulberry32(4242);
  for (let i = 0; i < 11000; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    const light = rand() > 0.5;
    ctx.fillStyle = light ? `rgba(255,255,255,${0.02 + rand() * 0.035})` : `rgba(0,0,0,${0.02 + rand() * 0.04})`;
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  return canvas;
}

export type ThumbnailKind = "background" | "caption" | "effects" | "adjustment";

/** Builds data-URL thumbnails for the layers panel. */
export function makeThumbnails(art: HTMLCanvasElement): Record<ThumbnailKind, string> {
  const make = (kind: ThumbnailKind): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 76;
    canvas.height = 52;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    ctx.drawImage(art, 0, 0, canvas.width, canvas.height);
    if (kind === "caption") {
      ctx.fillStyle = "rgba(6, 14, 20, 0.62)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(238, 244, 244, 0.9)";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillText("THE GREAT WAVE", 4, 30);
      ctx.fillStyle = "rgba(238, 244, 244, 0.6)";
      ctx.font = "7px Inter, sans-serif";
      ctx.fillText("Katsushika Hokusai", 4, 40);
    } else if (kind === "effects") {
      const warm = ctx.createRadialGradient(58, 10, 2, 58, 10, 48);
      warm.addColorStop(0, "rgba(255, 206, 150, 0.55)");
      warm.addColorStop(1, "rgba(255, 206, 150, 0)");
      ctx.fillStyle = warm;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const dark = ctx.createRadialGradient(38, 24, 8, 38, 24, 52);
      dark.addColorStop(0, "rgba(0,0,0,0)");
      dark.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = dark;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (kind === "adjustment") {
      ctx.fillStyle = "rgba(8, 18, 28, 0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(233, 238, 240, 0.85)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(8, 44);
      ctx.bezierCurveTo(26, 40, 40, 22, 64, 10);
      ctx.stroke();
    }
    return canvas.toDataURL("image/png");
  };
  return {
    background: make("background"),
    caption: make("caption"),
    effects: make("effects"),
    adjustment: make("adjustment"),
  };
}
