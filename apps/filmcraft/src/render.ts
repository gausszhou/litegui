import {
  activePictureClips,
  activeTitleClips,
  keyframeValue,
  type Clip,
  type ColorGrade,
  type MediaItem,
  type Preset,
  type Project
} from "./project";

export const FRAME_WIDTH = 800;
export const FRAME_HEIGHT = 450;

export interface MediaSources {
  [id: string]: HTMLImageElement | HTMLVideoElement;
}

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Preset footage                                                      */
/* ------------------------------------------------------------------ */

function drawNight(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const rnd = seeded(1968);
  const sway = Math.sin(time * 0.55) * 1.5;
  ctx.save();
  ctx.translate(sway, Math.cos(time * 0.7) * 1.2);

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, "#050505");
  sky.addColorStop(0.55, "#171717");
  sky.addColorStop(1, "#343434");
  ctx.fillStyle = sky;
  ctx.fillRect(-4, -4, w + 8, h + 8);

  const moon = ctx.createRadialGradient(w * 0.22, h * 0.17, 2, w * 0.22, h * 0.17, h * 0.3);
  moon.addColorStop(0, "rgba(235,235,235,0.75)");
  moon.addColorStop(0.12, "rgba(190,190,190,0.28)");
  moon.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = moon;
  ctx.fillRect(0, 0, w, h * 0.8);
  ctx.fillStyle = "#d6d6d6";
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.17, h * 0.048, 0, Math.PI * 2);
  ctx.fill();

  // Tree line
  ctx.fillStyle = "#0b0b0b";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.63);
  for (let x = 0; x <= w; x += 18) {
    const y = h * (0.57 + Math.sin(x * 0.028 + 2.4) * 0.025 + rnd() * 0.03);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.72);
  ctx.lineTo(0, h * 0.72);
  ctx.closePath();
  ctx.fill();

  const tree = (x: number, scale: number) => {
    ctx.strokeStyle = "#090909";
    ctx.lineCap = "round";
    ctx.lineWidth = 7 * scale;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.68);
    ctx.lineTo(x - 3 * scale, h * 0.4);
    ctx.stroke();
    ctx.lineWidth = 3.5 * scale;
    for (let i = 0; i < 4; i += 1) {
      const yy = h * (0.42 + i * 0.06);
      ctx.beginPath();
      ctx.moveTo(x - 2 * scale, yy);
      ctx.lineTo(x + (i % 2 === 0 ? 24 : -26) * scale, yy - 16 * scale);
      ctx.stroke();
    }
  };
  tree(w * 0.06, 1.1);
  tree(w * 0.93, 1.0);
  tree(w * 0.8, 0.6);

  // Field
  const field = ctx.createLinearGradient(0, h * 0.62, 0, h);
  field.addColorStop(0, "#262626");
  field.addColorStop(1, "#050505");
  ctx.fillStyle = field;
  ctx.fillRect(0, h * 0.64, w, h * 0.36);
  ctx.strokeStyle = "rgba(150,150,150,0.14)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 180; i += 1) {
    const x = rnd() * w;
    const y = h * (0.66 + rnd() * 0.32);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 8, y - 4 - rnd() * 8);
    ctx.stroke();
  }

  const zombie = (x: number, y: number, scale: number, coat: string, skin: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = coat;
    ctx.beginPath();
    ctx.moveTo(-9, -58);
    ctx.lineTo(8, -58);
    ctx.lineTo(13, -24);
    ctx.lineTo(8, -4);
    ctx.lineTo(-7, -4);
    ctx.lineTo(-12, -24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(0, -69, 6.5, 8, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = coat;
    ctx.fillRect(-7, -56, 3, 24);
    ctx.fillRect(4, -56, 3, 24);
    ctx.strokeStyle = coat;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8, -50);
    ctx.lineTo(-19, -34);
    ctx.moveTo(8, -50);
    ctx.lineTo(18, -38);
    ctx.stroke();
    ctx.restore();
  };

  zombie(w * 0.2, h * 0.82, 1.2, "#303030", "#8d8d8d");
  zombie(w * 0.29, h * 0.8, 1.05, "#3b3b3b", "#8f8f8f");
  zombie(w * 0.38, h * 0.79, 0.95, "#a3a3a3", "#a9a9a9");
  zombie(w * 0.48, h * 0.81, 1.15, "#444444", "#a3a3a3");

  // Foreground draped figure
  ctx.save();
  ctx.translate(w * 0.79, h * 0.92);
  ctx.rotate(-0.08);
  ctx.fillStyle = "#d9d9d9";
  ctx.beginPath();
  ctx.moveTo(-38, 20);
  ctx.bezierCurveTo(-32, -110, 18, -150, 58, -70);
  ctx.bezierCurveTo(72, -34, 64, 2, 48, 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#efefef";
  ctx.beginPath();
  ctx.ellipse(18, -134, 22, 30, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,60,60,0.5)";
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-18 + i * 13, -100 + i * 8);
    ctx.bezierCurveTo(4 + i * 6, -60, 20 + i * 4, -24, 24 + i * 3, 8);
    ctx.stroke();
  }
  ctx.restore();

  // Light haze and vignette are added globally.
  ctx.fillStyle = "rgba(160,160,160,0.045)";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawCharade(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const rnd = seeded(1963);
  const light = ctx.createLinearGradient(0, 0, w, h);
  light.addColorStop(0, "#1a2b18");
  light.addColorStop(0.45, "#35502a");
  light.addColorStop(1, "#7d7b45");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  // Soft garden bokeh.
  for (let i = 0; i < 95; i += 1) {
    const x = rnd() * w;
    const y = rnd() * h * 0.82;
    const r = 10 + rnd() * 48;
    const green = 38 + Math.floor(rnd() * 58);
    ctx.fillStyle = `rgba(${20 + green * 0.35},${green + 28},${18 + green * 0.3},${0.18 + rnd() * 0.26})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const sun = ctx.createRadialGradient(w * 0.82, h * 0.22, 6, w * 0.82, h * 0.22, h * 0.72);
  sun.addColorStop(0, "rgba(255,239,185,0.5)");
  sun.addColorStop(1, "rgba(255,239,185,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  // Stone path, out of focus.
  ctx.fillStyle = "rgba(94,86,66,0.55)";
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h);
  ctx.lineTo(w * 0.52, h * 0.62);
  ctx.lineTo(w * 0.78, h * 0.62);
  ctx.lineTo(w * 0.96, h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(220,210,175,0.1)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.moveTo(w * (0.18 + i * 0.1), h);
    ctx.lineTo(w * (0.5 + i * 0.035), h * 0.64);
    ctx.stroke();
  }

  const manX = w * 0.43;
  const womanX = w * 0.59;
  const baseY = h * 0.61;

  // Man in a charcoal suit, three-quarter profile.
  ctx.save();
  ctx.translate(manX, baseY);
  const suit = ctx.createLinearGradient(-120, -80, 100, h * 0.4);
  suit.addColorStop(0, "#4b4a4b");
  suit.addColorStop(0.55, "#333234");
  suit.addColorStop(1, "#232225");
  ctx.fillStyle = suit;
  ctx.beginPath();
  ctx.moveTo(-150, h * 0.42);
  ctx.quadraticCurveTo(-115, 20, -56, -6);
  ctx.lineTo(-15, -24);
  ctx.lineTo(28, -18);
  ctx.quadraticCurveTo(92, 6, 118, h * 0.42);
  ctx.closePath();
  ctx.fill();
  // Shirt and tie.
  ctx.fillStyle = "#ddd9cf";
  ctx.beginPath();
  ctx.moveTo(-28, -18);
  ctx.lineTo(8, -18);
  ctx.lineTo(2, 92);
  ctx.lineTo(-26, 72);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#25242a";
  ctx.beginPath();
  ctx.moveTo(-10, -18);
  ctx.lineTo(0, -7);
  ctx.lineTo(-7, 88);
  ctx.lineTo(-17, 70);
  ctx.closePath();
  ctx.fill();
  // Neck and head.
  ctx.fillStyle = "#c69c7a";
  ctx.fillRect(-18, -64, 38, 48);
  const skin = ctx.createLinearGradient(-55, -140, 60, -30);
  skin.addColorStop(0, "#d9b28f");
  skin.addColorStop(0.55, "#c79a77");
  skin.addColorStop(1, "#9d6f50");
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(-6, -102, 44, 55, -0.06, 0, Math.PI * 2);
  ctx.fill();
  // Hair.
  ctx.fillStyle = "#26211f";
  ctx.beginPath();
  ctx.ellipse(-12, -128, 46, 30, -0.12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-47, -108, 12, 26, 0.08, 0, Math.PI * 2);
  ctx.fill();
  // Profile features.
  ctx.fillStyle = "#6d4c39";
  ctx.beginPath();
  ctx.ellipse(30, -103, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(90,56,38,0.8)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(36, -94);
  ctx.quadraticCurveTo(44, -87, 34, -80);
  ctx.stroke();
  ctx.strokeStyle = "rgba(80,45,35,0.65)";
  ctx.beginPath();
  ctx.moveTo(6, -78);
  ctx.quadraticCurveTo(22, -75, 30, -80);
  ctx.stroke();
  // Rim light.
  ctx.strokeStyle = "rgba(255,235,190,0.22)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(-6, -102, 44, 55, -0.06, -1.3, 0.6);
  ctx.stroke();
  ctx.restore();

  // Woman in a red coat, short dark hair, facing the man.
  ctx.save();
  ctx.translate(womanX, baseY);
  const coat = ctx.createLinearGradient(-90, -40, 90, h * 0.4);
  coat.addColorStop(0, "#d0373e");
  coat.addColorStop(0.55, "#a51f2b");
  coat.addColorStop(1, "#76141e");
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(-118, h * 0.42);
  ctx.quadraticCurveTo(-88, 6, -30, -16);
  ctx.lineTo(24, -22);
  ctx.quadraticCurveTo(92, 2, 120, h * 0.42);
  ctx.closePath();
  ctx.fill();
  // Coat lapels and shadow.
  ctx.fillStyle = "rgba(70,8,18,0.32)";
  ctx.beginPath();
  ctx.moveTo(-52, -12);
  ctx.lineTo(-4, 22);
  ctx.lineTo(-18, h * 0.4);
  ctx.lineTo(-88, h * 0.4);
  ctx.closePath();
  ctx.fill();
  // Neck and face.
  ctx.fillStyle = "#d9aa8b";
  ctx.fillRect(-20, -66, 36, 46);
  const wskin = ctx.createLinearGradient(-50, -140, 55, -30);
  wskin.addColorStop(0, "#ecc7a8");
  wskin.addColorStop(0.6, "#d6a888");
  wskin.addColorStop(1, "#a9795f");
  ctx.fillStyle = wskin;
  ctx.beginPath();
  ctx.ellipse(0, -102, 42, 54, 0.05, 0, Math.PI * 2);
  ctx.fill();
  // Bob hair.
  ctx.fillStyle = "#1d1917";
  ctx.beginPath();
  ctx.ellipse(-4, -128, 48, 34, 0.02, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-44, -108, 13, 34, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(30, -96, 8, 28, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Features.
  ctx.fillStyle = "#5f3c31";
  ctx.beginPath();
  ctx.ellipse(-30, -104, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(110,60,55,0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-36, -94);
  ctx.quadraticCurveTo(-45, -87, -35, -80);
  ctx.stroke();
  ctx.fillStyle = "#a72b36";
  ctx.beginPath();
  ctx.ellipse(-24, -76, 9, 3.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Earring.
  ctx.fillStyle = "#e7d7b8";
  ctx.beginPath();
  ctx.arc(-46, -58, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,220,180,0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -102, 42, 54, 0.05, -0.6, 1.2);
  ctx.stroke();
  ctx.restore();

  // Foreground leaves for depth.
  ctx.fillStyle = "rgba(10,25,10,0.55)";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(i * w * 0.23 - 20, h * 0.97, 80, 34, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,220,150,0.05)";
  ctx.fillRect(0, 0, w, h);
  void time;
}

function drawCarnival(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const rnd = seeded(1962);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#050505");
  sky.addColorStop(0.6, "#1d1d1d");
  sky.addColorStop(1, "#333333");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(220,220,220,0.8)";
  ctx.beginPath();
  ctx.arc(w * 0.72, h * 0.17, h * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#080808";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  for (let x = 0; x <= w; x += 14) {
    ctx.lineTo(x, h * (0.68 + Math.sin(x * 0.04) * 0.02 + rnd() * 0.02));
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Ferris wheel
  ctx.strokeStyle = "#9a9a9a";
  ctx.lineWidth = 2;
  const cx = w * 0.2;
  const cy = h * 0.48;
  const r = h * 0.22;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2 + time * 0.03;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#c4c4c4";
    ctx.fill();
  }
  ctx.strokeStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, h * 0.72);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + r * 0.5, h * 0.72);
  ctx.stroke();

  // Tent
  ctx.fillStyle = "#101010";
  ctx.beginPath();
  ctx.moveTo(w * 0.56, h * 0.66);
  ctx.lineTo(w * 0.69, h * 0.34);
  ctx.lineTo(w * 0.84, h * 0.66);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(210,210,210,0.55)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(w * (0.57 + i * 0.055), h * 0.66);
    ctx.lineTo(w * 0.69, h * (0.36 + i * 0.05));
    ctx.stroke();
  }

  // Silhouette figure
  ctx.fillStyle = "#070707";
  ctx.beginPath();
  ctx.ellipse(w * 0.72, h * 0.79, 8, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.714, h * 0.79, 12, 38);
  ctx.strokeStyle = "#070707";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(w * 0.715, h * 0.82);
  ctx.lineTo(w * 0.69, h * 0.9);
  ctx.moveTo(w * 0.726, h * 0.82);
  ctx.lineTo(w * 0.75, h * 0.9);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.035)";
  ctx.fillRect(0, 0, w, h);
}

function drawEarth(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const rnd = seeded(1972);
  ctx.fillStyle = "#020307";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 110; i += 1) {
    const x = rnd() * w;
    const y = rnd() * h;
    ctx.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.7})`;
    ctx.fillRect(x, y, rnd() > 0.9 ? 2 : 1, rnd() > 0.9 ? 2 : 1);
  }
  const cx = w * 0.48;
  const cy = h * 0.54;
  const r = h * 0.34;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.35);
  glow.addColorStop(0, "rgba(55,120,190,0.28)");
  glow.addColorStop(1, "rgba(10,30,80,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
  const globe = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r);
  globe.addColorStop(0, "#4f9fd8");
  globe.addColorStop(0.55, "#1f5b9c");
  globe.addColorStop(1, "#071a3a");
  ctx.fillStyle = globe;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#4f7d3c";
  const blobs: Array<[number, number, number, number]> = [
    [0.35, 0.32, 0.55, 0.22],
    [0.55, 0.55, 0.5, 0.3],
    [0.18, 0.66, 0.3, 0.18],
    [0.76, 0.4, 0.22, 0.4]
  ];
  for (const [x, y, sx, sy] of blobs) {
    ctx.beginPath();
    ctx.ellipse(cx - r + x * r * 2, cy - r + y * r * 2, r * sx * 0.42, r * sy * 0.42, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.6, cy - r * 0.5 + i * r * 0.3, r * 0.7, r * 0.12, 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(160,210,255,0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -0.7, 1.4);
  ctx.stroke();
  void time;
}

function drawTrailer(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  ctx.fillStyle = "#030303";
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 4, w * 0.5, h * 0.45, h * 0.7);
  glow.addColorStop(0, "rgba(120,120,120,0.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(220,220,220,0.82)";
  ctx.font = `700 ${Math.round(h * 0.055)}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.fillText("THE DEAD WALK", w / 2, h * 0.46);
  ctx.fillStyle = "rgba(170,170,170,0.55)";
  ctx.font = `400 ${Math.round(h * 0.022)}px "Inter", "Segoe UI", sans-serif`;
  ctx.fillText("COMING SOON", w / 2, h * 0.55);
  void time;
}

export function drawPreset(ctx: CanvasRenderingContext2D, w: number, h: number, preset: Preset, time: number) {
  switch (preset) {
    case "night":
      drawNight(ctx, w, h, time);
      break;
    case "charade":
      drawCharade(ctx, w, h, time);
      break;
    case "carnival":
      drawCarnival(ctx, w, h, time);
      break;
    case "earth":
      drawEarth(ctx, w, h, time);
      break;
    case "trailer":
      drawTrailer(ctx, w, h, time);
      break;
    default:
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
  }
}

/* ------------------------------------------------------------------ */
/* Frame composition                                                   */
/* ------------------------------------------------------------------ */

function titleFont(h: number): string {
  return `700 ${Math.round(h * 0.108)}px Georgia, "Times New Roman", serif`;
}

function drawTitleClip(ctx: CanvasRenderingContext2D, clip: Clip, time: number, w: number, h: number) {
  const opacity = keyframeValue(clip, "opacity", time, clip.transform.opacity) / 100;
  const scale = keyframeValue(clip, "scale", time, clip.transform.scale) / 100;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.translate(w / 2, h * 0.48);
  ctx.scale(scale, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = titleFont(h);
  const lines = (clip.title ?? clip.name).split("\n");
  const lineHeight = h * 0.12;
  lines.forEach((line, index) => {
    const y = (index - (lines.length - 1) / 2) * lineHeight;
    ctx.lineWidth = Math.max(4, h * 0.012);
    ctx.strokeStyle = "rgba(0,0,0,0.82)";
    ctx.strokeText(line, 0, y);
    ctx.fillStyle = "#f2f0ea";
    ctx.fillText(line, 0, y);
    ctx.fillStyle = "rgba(220,220,220,0.35)";
    ctx.fillText(line, 0, y);
  });
  if (clip.subtitle) {
    ctx.font = `600 ${Math.round(h * 0.022)}px "Inter", "Segoe UI", sans-serif`;
    ctx.fillStyle = "rgba(225,225,225,0.78)";
    ctx.fillText(clip.subtitle, 0, h * 0.19);
  }
  ctx.restore();
}

function drawMedia(
  ctx: CanvasRenderingContext2D,
  project: Project,
  clip: Clip,
  time: number,
  w: number,
  h: number,
  sources: MediaSources
) {
  const source = sources[clip.mediaId];
  const media = project.media.find(item => item.id === clip.mediaId);
  if (source instanceof HTMLImageElement && source.complete) {
    drawCover(ctx, source, w, h);
    return;
  }
  if (source instanceof HTMLVideoElement && source.readyState >= 2) {
    const local = Math.max(0, time - clip.start) * (clip.speed / 100);
    const target = clip.inPoint + local;
    if (Math.abs(source.currentTime - target) > 0.08) source.currentTime = target;
    drawCover(ctx, source, w, h);
    return;
  }
  if (media?.preset) {
    drawPreset(ctx, w, h, media.preset, clip.inPoint + (time - clip.start) * (clip.speed / 100));
  } else {
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, w, h);
  }
}

function drawCover(ctx: CanvasRenderingContext2D, source: HTMLImageElement | HTMLVideoElement, w: number, h: number) {
  const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!sw || !sh) return;
  const scale = Math.max(w / sw, h / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(source, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function applyClipTransform(
  ctx: CanvasRenderingContext2D,
  project: Project,
  clip: Clip,
  time: number,
  w: number,
  h: number,
  sources: MediaSources
) {
  const x = keyframeValue(clip, "x", time, clip.transform.x);
  const y = keyframeValue(clip, "y", time, clip.transform.y);
  const scale = keyframeValue(clip, "scale", time, clip.transform.scale) / 100;
  const rotation = keyframeValue(clip, "rotation", time, clip.transform.rotation);
  const opacity = keyframeValue(clip, "opacity", time, clip.transform.opacity) / 100;
  const offsetX = ((x - project.width / 2) / project.width) * w;
  const offsetY = ((y - project.height / 2) / project.height) * h;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.translate(-w / 2, -h / 2);
  const cropW = 1 - (clip.crop.left + clip.crop.right) / 100;
  const cropH = 1 - (clip.crop.top + clip.crop.bottom) / 100;
  if (cropW < 0.999 || cropH < 0.999) {
    ctx.scale(1 / Math.max(0.1, cropW), 1 / Math.max(0.1, cropH));
    ctx.translate((-clip.crop.left / 100) * w, (-clip.crop.top / 100) * h);
  }
  drawMedia(ctx, project, clip, time, w, h, sources);
  ctx.restore();
}

const grainCanvas = (() => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 102;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const data = ctx.createImageData(canvas.width, canvas.height);
  const rnd = seeded(42);
  for (let index = 0; index < data.data.length; index += 4) {
    const value = Math.floor(rnd() * 255);
    data.data[index] = value;
    data.data[index + 1] = value;
    data.data[index + 2] = value;
    data.data[index + 3] = Math.floor(rnd() * 40);
  }
  ctx.putImageData(data, 0, 0);
  return canvas;
})();

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  if (!grainCanvas) return;
  const rnd = seeded(Math.floor(time * 24) + 7);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.42;
  const ox = -rnd() * 60;
  const oy = -rnd() * 40;
  ctx.drawImage(grainCanvas, ox, oy, w + 60, h + 40);
  ctx.restore();
  ctx.save();
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.76);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function renderProgram(
  canvas: HTMLCanvasElement,
  project: Project,
  time: number,
  grade: ColorGrade,
  sources: MediaSources = {}
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (canvas.width !== FRAME_WIDTH) canvas.width = FRAME_WIDTH;
  if (canvas.height !== FRAME_HEIGHT) canvas.height = FRAME_HEIGHT;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const weave = Math.sin(time * 7.3) * 0.8;
  ctx.save();
  ctx.translate(weave, Math.cos(time * 8.1) * 0.6);

  const pictures = activePictureClips(project, time);
  if (!pictures.length) {
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(180,180,180,0.5)";
    ctx.font = '500 16px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("无画面 · No Video", w / 2, h / 2);
  } else {
    for (const clip of pictures) {
      applyClipTransform(ctx, project, clip, time, w, h, sources);
    }
  }
  for (const title of activeTitleClips(project, time)) {
    drawTitleClip(ctx, title, time, w, h);
  }
  addGrain(ctx, w, h, time);
  ctx.restore();
  applyGrade(canvas, grade);
}

export function applyGrade(canvas: HTMLCanvasElement, grade: ColorGrade): void {
  const values = Object.values(grade);
  if (values.every(value => Math.abs(value) < 0.001)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const image = ctx.getImageData(0, 0, w, h);
  const data = image.data;
  const exposure = 2 ** (grade.exposure / 50);
  const contrast = 1 + grade.contrast / 100;
  const saturation = 1 + grade.saturation / 100;
  const temp = grade.temperature / 100;
  const tint = grade.tint / 100;
  const vignette = grade.vignette / 100;
  const fade = grade.fadedFilm / 100;
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.hypot(cx, cy);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const index = (y * w + x) * 4;
      let r = data[index];
      let g = data[index + 1];
      let b = data[index + 2];
      r *= exposure * (1 + temp * 0.16);
      g *= exposure * (1 - tint * 0.1);
      b *= exposure * (1 - temp * 0.16);
      r = (r - 128) * contrast + 128;
      g = (g - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;
      const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
      r = luma + (r - luma) * saturation;
      g = luma + (g - luma) * saturation;
      b = luma + (b - luma) * saturation;
      if (grade.highlights) {
        const weight = Math.max(0, (luma - 128) / 127) * (grade.highlights / 100);
        r += weight * 55;
        g += weight * 55;
        b += weight * 55;
      }
      if (grade.shadows) {
        const weight = Math.max(0, (128 - luma) / 128) * (grade.shadows / 100);
        r += weight * 40;
        g += weight * 40;
        b += weight * 40;
      }
      if (fade) {
        r = r + (255 - r) * fade * 0.18;
        g = g + (255 - g) * fade * 0.18;
        b = b + (255 - b) * fade * 0.18;
        r *= 1 - fade * 0.05;
        g *= 1 - fade * 0.05;
        b *= 1 - fade * 0.05;
      }
      if (vignette > 0) {
        const distance = Math.hypot(x - cx, y - cy) / maxDist;
        const factor = 1 - Math.max(0, distance - 0.35) * vignette * 1.6;
        r *= factor;
        g *= factor;
        b *= factor;
      }
      data[index] = Math.max(0, Math.min(255, r));
      data[index + 1] = Math.max(0, Math.min(255, g));
      data[index + 2] = Math.max(0, Math.min(255, b));
    }
  }
  ctx.putImageData(image, 0, 0);
}

/* ------------------------------------------------------------------ */
/* Thumbnails and waveforms                                            */
/* ------------------------------------------------------------------ */

const thumbCache = new Map<string, string>();
const waveformCache = new Map<string, string>();

export function presetThumbnail(preset: Preset, width = 240, height = 135): string {
  const key = `${preset}-${width}-${height}`;
  const cached = thumbCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    drawPreset(ctx, width, height, preset, 1.2);
    const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.8);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }
  const url = canvas.toDataURL("image/jpeg", 0.78);
  thumbCache.set(key, url);
  return url;
}

export function mediaThumbnail(media: MediaItem): string {
  if (media.thumbnail) return media.thumbnail;
  if (media.preset) return presetThumbnail(media.preset);
  return "";
}

export function waveformDataUrl(seed: number, color = "#79c4fa", width = 500, height = 54): string {
  const key = `${seed}-${color}-${width}-${height}`;
  const cached = waveformCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const rnd = seeded(seed);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 2) {
      const env =
        0.25 +
        0.45 * Math.abs(Math.sin(x * 0.045 + seed)) +
        0.3 * Math.abs(Math.sin(x * 0.012 + seed * 2)) +
        rnd() * 0.18;
      const half = Math.min(height / 2 - 2, env * (height / 2 - 2));
      ctx.beginPath();
      ctx.moveTo(x + 0.5, height / 2 - half);
      ctx.lineTo(x + 0.5, height / 2 + half);
      ctx.stroke();
    }
  }
  const url = canvas.toDataURL("image/png");
  waveformCache.set(key, url);
  return url;
}

export function frameDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
