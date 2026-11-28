import {
  GRADIENTS,
  type Vec2,
  type VecDocument,
  type VecObject,
  pointsBounds,
  rotatedCorners,
  unionBounds,
  UI_FONT
} from "./scene";
import { round } from "./number";

const RULER = 22;
const HANDLE = 7;

interface View {
  zoom: number;
  x: number;
  y: number;
}

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function n(value: number): string {
  return `${round(value, 2)}`;
}

/* ------------------------------------------------------------------ */
/* SVG 片段                                                            */
/* ------------------------------------------------------------------ */

function gradientMarkup(id: string, stops: Array<[number, string]>, horizontal = false): string {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${horizontal ? 1 : 0}" y2="${horizontal ? 0 : 1}">${stops
    .map(([offset, color]) => `<stop offset="${n(offset * 100)}%" stop-color="${color}"/>`)
    .join("")}</linearGradient>`;
}

function glowFilterMarkup(id: string, radius: number, color: string, strength = 1): string {
  const blur = Math.max(0.5, radius / 2.6);
  return `<filter id="${id}" x="-40%" y="-70%" width="180%" height="240%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="0" stdDeviation="${n(blur)}" flood-color="${color}" flood-opacity="${n(0.85 * strength)}"/>
    <feDropShadow dx="0" dy="0" stdDeviation="${n(blur * 2.6)}" flood-color="${color}" flood-opacity="${n(
    0.55 * strength
  )}"/>
  </filter>`;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDefs(doc: VecDocument): string {
  const gradients = Object.values(GRADIENTS)
    .map(gradient => gradientMarkup(gradient.id, gradient.stops))
    .join("");

  const glows = doc.objects
    .filter(object => object.glow > 0)
    .map(object => glowFilterMarkup(`vc-glow-${object.id}`, object.glow, object.glowColor))
    .join("");
  const subGlows = doc.objects
    .filter(object => object.subline && object.subline.glow > 0)
    .map(object => {
      const subline = object.subline;
      return subline ? glowFilterMarkup(`vc-glow-${object.id}-sub`, subline.glow, subline.glowColor) : "";
    })
    .join("");

  const sunMasks = doc.objects
    .filter(object => object.kind === "sun" && object.visible)
    .map(sun => {
      const pad = 40;
      const start = sun.y + sun.height * 0.22;
      const gap = sun.height * 0.065;
      const bar = sun.height * 0.027;
      return `<mask id="vc-sun-mask-${esc(sun.id)}" maskUnits="userSpaceOnUse" x="${n(sun.x - pad)}" y="${n(
        sun.y - pad
      )}" width="${n(sun.width + pad * 2)}" height="${n(sun.height + pad * 2)}">
        <rect x="${n(sun.x - pad)}" y="${n(sun.y - pad)}" width="${n(sun.width + pad * 2)}" height="${n(
        sun.height + pad * 2
      )}" fill="#fff"/>
        ${Array.from({ length: 8 }, (_, index) => {
          const barY = start + index * gap;
          return `<rect x="${n(sun.x - pad)}" y="${n(barY)}" width="${n(sun.width + pad * 2)}" height="${n(
            bar
          )}" fill="#000"/>`;
        }).join("")}
      </mask>`;
    })
    .join("");

  const ground = doc.objects.find(object => object.kind === "grid");
  const groundClip = ground
    ? `<clipPath id="vc-ground-clip"><rect x="${n(ground.x)}" y="${n(ground.y)}" width="${n(ground.width)}" height="${n(
        ground.height
      )}"/></clipPath>`
    : "";

  return `<defs>
    ${gradients}
    <radialGradient id="vc-horizon" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ff4fc8" stop-opacity="0.85"/>
      <stop offset="0.45" stop-color="#ff2f9f" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#7a0f8c" stop-opacity="0"/>
    </radialGradient>
    <filter id="vc-artboard-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <clipPath id="vc-artboard-clip"><rect x="0" y="0" width="${n(doc.width)}" height="${n(doc.height)}"/></clipPath>
    ${sunMasks}
    ${groundClip}
    <filter id="vc-grid-glow" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="3.2"/>
    </filter>
    ${glows}
    ${subGlows}
  </defs>`;
}

function paintAttribute(paint: string): string {
  return paint === "none" ? "none" : esc(paint);
}

function objectBody(object: VecObject): string {
  const filter = object.glow > 0 ? ` filter="url(#vc-glow-${object.id})"` : "";
  const fill = paintAttribute(object.fill);
  const stroke = paintAttribute(object.stroke);
  const strokeAttrs =
    object.stroke !== "none" && object.strokeWidth > 0
      ? ` stroke="${stroke}" stroke-width="${n(object.strokeWidth)}"`
      : "";

  switch (object.kind) {
    case "rect":
      return `<rect x="${n(object.x)}" y="${n(object.y)}" width="${n(object.width)}" height="${n(
        object.height
      )}" fill="${fill}"${strokeAttrs}${filter}/>`;

    case "ellipse":
    case "sun": {
      const cx = object.x + object.width / 2;
      const cy = object.y + object.height / 2;
      const mask = object.kind === "sun" ? ` mask="url(#vc-sun-mask-${esc(object.id)})"` : "";
      return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(object.width / 2)}" ry="${n(
        object.height / 2
      )}" fill="${fill}"${strokeAttrs}${mask}${filter}/>`;
    }

    case "polygon":
    case "star": {
      const sides = Math.max(3, object.sides ?? (object.kind === "star" ? 5 : 6));
      const cx = object.x + object.width / 2;
      const cy = object.y + object.height / 2;
      const points: string[] = [];
      const total = object.kind === "star" ? sides * 2 : sides;
      for (let index = 0; index < total; index += 1) {
        const outer = object.kind === "star" ? index % 2 === 0 : true;
        const ratio = outer ? 1 : object.innerRatio ?? 0.45;
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        points.push(
          `${n(cx + Math.cos(angle) * (object.width / 2) * ratio)} ${n(
            cy + Math.sin(angle) * (object.height / 2) * ratio
          )}`
        );
      }
      return `<polygon points="${points.join(" ")}" fill="${fill}"${strokeAttrs}${filter}/>`;
    }

    case "path": {
      if (object.pathData) {
        return `<path d="${object.pathData}" fill="${fill}"${strokeAttrs} stroke-linecap="round" stroke-linejoin="round"${filter}/>`;
      }
      const points = object.points ?? [];
      if (points.length < 2) return "";
      const d = points.map((point, index) => `${index === 0 ? "M" : "L"}${n(point.x)} ${n(point.y)}`).join(" ");
      return `<path d="${d}${object.closed ? " Z" : ""}" fill="${
        object.closed ? fill : "none"
      }"${strokeAttrs} stroke-linecap="round" stroke-linejoin="round"${filter}/>`;
    }

    case "text": {
      const fontSize = object.fontSize ?? 48;
      const letterSpacing = object.letterSpacing ?? 0;
      const align = object.align ?? "center";
      const anchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
      const x = align === "left" ? object.x : align === "right" ? object.x + object.width : object.x + object.width / 2;
      const baseline = object.y + fontSize * 0.72;
      const textFill = fill;
      const textStroke = "";
      const length =
        object.textLength !== undefined ? ` textLength="${n(object.textLength)}" lengthAdjust="spacingAndGlyphs"` : "";
      let markup: string;
      if (object.vertical) {
        const lineHeight = fontSize * 1.05;
        const chars = [...(object.text ?? "")];
        const centerX = object.x + object.width / 2;
        markup = `<text x="${n(centerX)}" text-anchor="middle" font-family="${esc(
          object.fontFamily ?? UI_FONT
        )}" font-size="${n(fontSize)}" font-weight="${object.fontWeight ?? 400}" fill="${textFill}"${filter}>${chars
          .map(
            (char, index) =>
              `<tspan x="${n(centerX)}" y="${n(baseline + index * lineHeight)}">${esc(
                char === " " ? "\u00a0" : char
              )}</tspan>`
          )
          .join("")}</text>`;
      } else {
        markup = `<text x="${n(x)}" y="${n(baseline)}" text-anchor="${anchor}" font-family="${esc(
          object.fontFamily ?? UI_FONT
        )}" font-size="${n(fontSize)}" font-weight="${object.fontWeight ?? 400}" letter-spacing="${n(
          letterSpacing
        )}" fill="${textFill}"${length}${textStroke}${filter}>${esc(object.text ?? "")}</text>`;
      }
      const subline = object.subline;
      if (subline) {
        const subLength =
          subline.textLength !== undefined
            ? ` textLength="${n(subline.textLength)}" lengthAdjust="spacingAndGlyphs"`
            : "";
        const subFilter = subline.glow > 0 ? ` filter="url(#vc-glow-${object.id}-sub)"` : "";
        markup += `<text x="${n(x)}" y="${n(baseline + subline.offset)}" text-anchor="${anchor}" font-family="${esc(
          object.fontFamily ?? UI_FONT
        )}" font-size="${n(subline.fontSize)}" font-weight="${subline.weight ?? 400}" letter-spacing="${n(
          subline.letterSpacing
        )}" fill="${esc(subline.fill)}"${subLength}${subFilter}>${esc(subline.text)}</text>`;
      }
      return markup;
    }

    case "stars": {
      const random = mulberry32(object.seed ?? 1);
      const span = object.width;
      const height = object.height;
      const count = object.count ?? 80;
      const dots: string[] = [];
      for (let index = 0; index < count; index += 1) {
        const x = object.x + random() * span;
        const y = object.y + random() * height;
        const radius = 0.5 + random() * 1.6;
        const opacity = 0.25 + random() * 0.75;
        dots.push(
          `<circle cx="${n(x)}" cy="${n(y)}" r="${n(radius)}" fill="${esc(object.fill)}" opacity="${n(opacity)}"/>`
        );
      }
      for (let index = 0; index < 6; index += 1) {
        const x = object.x + random() * span;
        const y = object.y + random() * height * 0.9;
        dots.push(
          `<path d="M${n(x)} ${n(y - 5)} L${n(x + 1.2)} ${n(y - 1.2)} L${n(x + 5)} ${n(y)} L${n(x + 1.2)} ${n(
            y + 1.2
          )} L${n(x)} ${n(y + 5)} L${n(x - 1.2)} ${n(y + 1.2)} L${n(x - 5)} ${n(y)} L${n(x - 1.2)} ${n(
            y - 1.2
          )} Z" fill="#ffffff" opacity="0.9"/>`
        );
      }
      return `<g${filter}>${dots.join("")}</g>`;
    }

    case "mountains": {
      const points = object.points ?? [];
      if (points.length < 3) return "";
      const base = object.base ?? pointsBounds(points);
      const mid = base.x + base.width / 2;
      const baseline = base.y + base.height;
      const left = points.filter(point => point.x <= mid);
      const right = points.filter(point => point.x >= mid);
      const shape = (list: Vec2[]) => {
        if (list.length < 2) return "";
        const first = list[0];
        const last = list[list.length - 1];
        return `<path d="${list
          .map((point, index) => `${index === 0 ? "M" : "L"}${n(point.x)} ${n(point.y)}`)
          .join(" ")} L${n(last.x)} ${n(baseline)} L${n(first.x)} ${n(baseline)} Z" fill="${fill}"${
          strokeAttrs ? ` ${strokeAttrs.trim()}` : ""
        }${filter}/>`;
      };
      return `<g>${shape(left)}${shape(right)}</g>`;
    }

    case "grid": {
      const horizon = object.y;
      const bottom = object.y + object.height;
      const vanishX = object.x + object.width / 2;
      const vertical: string[] = [];
      for (let index = -12; index <= 12; index += 1) {
        if (index === 0) continue;
        const targetX = vanishX + index * 92;
        vertical.push(`M${n(vanishX)} ${n(horizon)} L${n(targetX)} ${n(horizon + object.height * 1.9)}`);
      }
      const horizontal: string[] = [];
      const rows = 14;
      for (let index = 1; index <= rows; index += 1) {
        const t = index / rows;
        const y = horizon + (bottom - horizon) * Math.pow(t, 1.35);
        horizontal.push(`M${n(object.x - 80)} ${n(y)} L${n(object.x + object.width + 80)} ${n(y)}`);
      }
      const lineData = [...vertical, ...horizontal].join(" ");
      const neon = object.stroke === "none" ? "#ff2fa8" : object.stroke;
      return `<g>
        <rect x="${n(object.x)}" y="${n(object.y)}" width="${n(object.width)}" height="${n(
        object.height
      )}" fill="${fill}"/>
        <g clip-path="url(#vc-ground-clip)">
          <ellipse cx="${n(vanishX)}" cy="${n(horizon + 14)}" rx="${n(object.width * 0.55)}" ry="${n(
        object.height * 0.24
      )}" fill="url(#vc-horizon)" opacity="0.2"/>
          <g stroke="${esc(neon)}" stroke-width="2.4" opacity="0.24" filter="url(#vc-grid-glow)" fill="none">
            <path d="${lineData}"/>
          </g>
          <g stroke="${esc(neon)}" stroke-width="1.2" opacity="0.9" fill="none">
            <path d="${lineData}"/>
          </g>
          <path d="M${n(object.x)} ${n(horizon)} H${n(
        object.x + object.width
      )}" stroke="#ff8fe0" stroke-width="1.4" opacity="0.9"/>
        </g>
      </g>`;
    }

    default:
      return "";
  }
}

function objectMarkup(object: VecObject): string {
  if (!object.visible) return "";
  const body = objectBody(object);
  if (!body) return "";
  const base = object.base ?? (object.points?.length ? pointsBounds(object.points) : undefined);
  const geometry =
    base && (object.kind === "path" || object.kind === "mountains")
      ? ` transform="translate(${n(object.x)} ${n(object.y)}) scale(${n(object.width / base.width)} ${n(
          object.height / base.height
        )}) translate(${n(-base.x)} ${n(-base.y)})"`
      : "";
  const centreX = object.x + object.width / 2;
  const centreY = object.y + object.height / 2;
  const transform = object.rotation ? ` transform="rotate(${n(object.rotation)} ${n(centreX)} ${n(centreY)})"` : "";
  return `<g data-obj="${esc(object.id)}" opacity="${n(object.opacity)}"${transform}>${
    geometry ? `<g${geometry}>${body}</g>` : body
  }</g>`;
}

export function artworkMarkup(doc: VecDocument): string {
  return doc.objects.map(object => objectMarkup(object)).join("");
}

export function documentSvg(doc: VecDocument, fontCss = ""): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${doc.width}" height="${doc.height}" viewBox="0 0 ${
    doc.width
  } ${doc.height}">
    ${fontCss}
    ${buildDefs(doc)}
    <g clip-path="url(#vc-artboard-clip)">${artworkMarkup(doc)}</g>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* 舞台                                                                */
/* ------------------------------------------------------------------ */

export class Stage {
  public readonly element: HTMLDivElement;
  public readonly onViewChange: (() => void) | null;
  private doc: VecDocument;
  private selection: string[] = [];
  private view: View = { zoom: 1, x: 0, y: 0 };
  public showGrid = false;

  constructor(doc: VecDocument, onViewChange?: () => void) {
    this.doc = doc;
    this.onViewChange = onViewChange ?? null;
    this.element = document.createElement("div");
    this.element.className = "vc-stage";
  }

  mount(host: HTMLElement) {
    host.appendChild(this.element);
  }

  get zoomLevel(): number {
    return this.view.zoom;
  }

  get size(): { width: number; height: number } {
    return { width: this.element.clientWidth, height: this.element.clientHeight };
  }

  setDocument(doc: VecDocument) {
    this.doc = doc;
  }

  setSelection(ids: string[]) {
    this.selection = ids;
  }

  fit(padding = 74) {
    const { width, height } = this.size;
    const doc = this.doc;
    const zoom = Math.min(
      Math.max(0.05, (width - padding * 2) / doc.width),
      Math.max(0.05, (height - padding * 2 - RULER) / doc.height)
    );
    this.view = {
      zoom,
      x: (width - doc.width * zoom) / 2,
      y: (height - doc.height * zoom) / 2 + RULER / 4
    };
    this.emitViewChange();
  }

  zoomAround(factor: number, screenX: number, screenY: number) {
    const next = Math.min(16, Math.max(0.05, this.view.zoom * factor));
    const applied = next / this.view.zoom;
    this.view = {
      zoom: next,
      x: screenX - (screenX - this.view.x) * applied,
      y: screenY - (screenY - this.view.y) * applied
    };
    this.emitViewChange();
  }

  setZoom(zoom: number, anchor?: Vec2) {
    const { width, height } = this.size;
    const point = anchor ?? { x: width / 2, y: height / 2 };
    const next = Math.min(16, Math.max(0.05, zoom));
    const applied = next / this.view.zoom;
    this.view = {
      zoom: next,
      x: point.x - (point.x - this.view.x) * applied,
      y: point.y - (point.y - this.view.y) * applied
    };
    this.emitViewChange();
  }

  centerOn(point: Vec2) {
    const { width, height } = this.size;
    this.view = {
      ...this.view,
      x: width / 2 - point.x * this.view.zoom,
      y: height / 2 - point.y * this.view.zoom
    };
    this.emitViewChange();
  }

  panBy(dx: number, dy: number) {
    this.view = { ...this.view, x: this.view.x + dx, y: this.view.y + dy };
    this.emitViewChange();
  }

  screenToDoc(clientX: number, clientY: number): Vec2 {
    const rect = this.element.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.view.x) / this.view.zoom,
      y: (clientY - rect.top - this.view.y) / this.view.zoom
    };
  }

  docToScreen(point: Vec2): Vec2 {
    const rect = this.element.getBoundingClientRect();
    return {
      x: point.x * this.view.zoom + this.view.x + rect.left,
      y: point.y * this.view.zoom + this.view.y + rect.top
    };
  }

  docToLocal(point: Vec2): Vec2 {
    return { x: point.x * this.view.zoom + this.view.x, y: point.y * this.view.zoom + this.view.y };
  }

  private emitViewChange() {
    this.render();
    this.onViewChange?.();
  }

  render() {
    const doc = this.doc;
    const { width, height } = this.size;
    if (!width || !height) return;
    const world = `translate(${n(this.view.x)} ${n(this.view.y)}) scale(${n(this.view.zoom)})`;

    this.element.innerHTML = `<svg class="vc-canvas" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${buildDefs(doc)}
      <rect class="vc-canvas-hit" x="0" y="0" width="${width}" height="${height}" fill="transparent"/>
      <g class="vc-world" transform="${world}">
        <rect class="vc-artboard-shadow" x="6" y="14" width="${doc.width}" height="${
      doc.height
    }" fill="rgba(0,0,0,0.55)" filter="url(#vc-artboard-shadow)"/>
        <g clip-path="url(#vc-artboard-clip)">${artworkMarkup(doc)}</g>
        <rect class="vc-artboard-frame" x="0" y="0" width="${doc.width}" height="${doc.height}"/>
      </g>
      ${this.showGrid ? this.gridMarkup() : ""}
      <g class="vc-overlay" pointer-events="none">${this.selectionMarkup()}</g>
      <g class="vc-rulers" pointer-events="none">${this.rulersMarkup(width, height)}</g>
    </svg>`;
  }

  private selectionMarkup(): string {
    const objects = this.doc.objects.filter(object => this.selection.includes(object.id) && object.visible);
    if (!objects.length) return "";
    const parts: string[] = [];
    for (const object of objects) {
      const corners = rotatedCorners(object).map(corner => this.docToLocal(corner));
      const points = corners.map(corner => `${n(corner.x)},${n(corner.y)}`).join(" ");
      parts.push(`<polygon class="vc-select-box" points="${points}"/>`);
      corners.forEach((corner, index) => {
        parts.push(
          `<rect class="vc-handle" data-handle="${index}" data-obj-id="${esc(object.id)}" x="${n(
            corner.x - HANDLE / 2
          )}" y="${n(corner.y - HANDLE / 2)}" width="${HANDLE}" height="${HANDLE}" rx="0.8"/>`
        );
      });
      for (let index = 0; index < 4; index += 1) {
        const a = corners[index];
        const b = corners[(index + 1) % 4];
        parts.push(
          `<circle class="vc-handle-mid" data-handle="m${index}" data-obj-id="${esc(object.id)}" cx="${n(
            (a.x + b.x) / 2
          )}" cy="${n((a.y + b.y) / 2)}" r="2.1"/>`
        );
      }
    }
    const union = unionBounds(objects);
    if (union && objects.length > 1) {
      const screen = {
        x: union.x * this.view.zoom + this.view.x,
        y: union.y * this.view.zoom + this.view.y
      };
      parts.push(
        `<rect class="vc-select-union" x="${n(screen.x)}" y="${n(screen.y)}" width="${n(
          union.width * this.view.zoom
        )}" height="${n(union.height * this.view.zoom)}"/>`
      );
    }
    return parts.join("");
  }

  private gridMarkup(): string {
    const doc = this.doc;
    const step = 50;
    const lines: string[] = [];
    for (let x = step; x < doc.width; x += step) {
      lines.push(`<path d="M${x} 0 V${doc.height}" class="vc-artboard-grid-line"/>`);
    }
    for (let y = step; y < doc.height; y += step) {
      lines.push(`<path d="M0 ${y} H${doc.width}" class="vc-artboard-grid-line"/>`);
    }
    return `<g class="vc-artboard-grid" pointer-events="none" transform="translate(${n(this.view.x)} ${n(
      this.view.y
    )}) scale(${n(this.view.zoom)})">${lines.join("")}</g>`;
  }

  private rulersMarkup(width: number, height: number): string {
    const zoom = this.view.zoom;
    const originX = this.view.x;
    const originY = this.view.y;
    const targets = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
    const step = targets.find(candidate => candidate * zoom >= 82) ?? 5000;
    const minor = step / 5;

    const topTicks: string[] = [];
    const leftTicks: string[] = [];

    const startDocX = Math.floor(-originX / zoom / step) * step;
    const endDocX = (width - originX) / zoom;
    for (let value = startDocX; value <= endDocX; value += minor) {
      const x = originX + value * zoom;
      if (x < RULER || x > width) continue;
      const major = Math.abs(value % step) < 0.001;
      topTicks.push(
        `<path d="M${n(x)} ${n(RULER - (major ? 8 : 4))} V${RULER}" class="vc-ruler-tick${major ? " is-major" : ""}"/>`
      );
      if (major) {
        topTicks.push(`<text x="${n(x + 3)}" y="${RULER - 9}" class="vc-ruler-label">${Math.round(value)}</text>`);
      }
    }

    const startDocY = Math.floor(-originY / zoom / step) * step;
    const endDocY = (height - originY) / zoom;
    for (let value = startDocY; value <= endDocY; value += minor) {
      const y = originY + value * zoom;
      if (y < RULER || y > height) continue;
      const major = Math.abs(value % step) < 0.001;
      leftTicks.push(
        `<path d="M${RULER - (major ? 8 : 4)} ${n(y)} H${RULER}" class="vc-ruler-tick${major ? " is-major" : ""}"/>`
      );
      if (major) {
        leftTicks.push(
          `<text x="${RULER - 11}" y="${n(y + 3)}" class="vc-ruler-label" transform="rotate(-90 ${RULER - 11} ${n(
            y + 3
          )})">${Math.round(value)}</text>`
        );
      }
    }

    const artboardRectX = originX;
    const artboardRectY = originY;

    return `
      <rect class="vc-ruler-bg" x="0" y="0" width="${width}" height="${RULER}"/>
      <rect class="vc-ruler-bg" x="0" y="0" width="${RULER}" height="${height}"/>
      <rect class="vc-ruler-artboard" x="${n(artboardRectX)}" y="${RULER - 2}" width="${n(
      this.doc.width * zoom
    )}" height="2"/>
      <rect class="vc-ruler-artboard" x="${RULER - 2}" y="${n(artboardRectY)}" width="2" height="${n(
      this.doc.height * zoom
    )}"/>
      ${topTicks.join("")}
      ${leftTicks.join("")}
      <rect class="vc-ruler-corner" x="0" y="0" width="${RULER}" height="${RULER}"/>
      <path d="M${n(RULER)} 0 V${height} M0 ${n(RULER)} H${width}" class="vc-ruler-edge"/>
    `;
  }
}

/* ------------------------------------------------------------------ */
/* 导出与几何辅助                                                      */
/* ------------------------------------------------------------------ */

export function downloadText(filename: string, content: string, type = "image/svg+xml") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadPng(doc: VecDocument, filename: string, scale = 2, fontCss = ""): Promise<void> {
  const svg = documentSvg(doc, fontCss);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("无法栅格化 SVG"));
      element.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(doc.width * scale);
    canvas.height = Math.round(doc.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D 不可用");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pngUrl = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = pngUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
