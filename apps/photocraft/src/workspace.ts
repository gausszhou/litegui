import { ART_HEIGHT, ART_WIDTH } from "./artwork";

export interface ArtRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CanvasViewOptions {
  art: HTMLCanvasElement;
  effects: HTMLCanvasElement;
  getTool: () => string;
  isSpaceDown: () => boolean;
  onZoom: (percent: number) => void;
  onArtRect: (rect: ArtRect) => void;
  onContextMenu: (x: number, y: number) => void;
  onStatus: (text: string) => void;
}

const MIN_ZOOM = 0.04;
const MAX_ZOOM = 8;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Interactive artwork viewport: zoom, pan, rotate, marquee and context menu. */
export class CanvasView {
  private readonly wrap: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly options: CanvasViewOptions;

  private width = 1;
  private height = 1;
  private dpr = 1;
  private zoom = 0.3;
  private panX = 0;
  private panY = 0;
  private rotation = 0;
  private flipped = false;
  private showBackground = true;
  private showEffects = true;
  private fitted = false;

  private panning = false;
  private panStart = { x: 0, y: 0, panX: 0, panY: 0 };
  private selectStart: { x: number; y: number } | null = null;
  private selection: { x: number; y: number; w: number; h: number } | null = null;
  private checker: CanvasPattern | null = null;

  constructor(wrap: HTMLElement, canvas: HTMLCanvasElement, options: CanvasViewOptions) {
    this.wrap = wrap;
    this.canvas = canvas;
    this.options = options;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    this.ctx = ctx;

    const checkerCanvas = document.createElement("canvas");
    checkerCanvas.width = 16;
    checkerCanvas.height = 16;
    const checkerCtx = checkerCanvas.getContext("2d");
    if (checkerCtx) {
      checkerCtx.fillStyle = "#d9d9d9";
      checkerCtx.fillRect(0, 0, 16, 16);
      checkerCtx.fillStyle = "#9a9a9a";
      checkerCtx.fillRect(0, 0, 8, 8);
      checkerCtx.fillRect(8, 8, 8, 8);
      this.checker = ctx.createPattern(checkerCanvas, "repeat");
    }

    this.bindEvents();
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(wrap);
  }

  /** Current view scale in percent (100 = document pixels). */
  zoomPercent(): number {
    return Math.round(this.zoom * 100);
  }

  setTool(tool: string): void {
    this.canvas.dataset.tool = tool;
    this.applyCursor();
  }

  setLayerVisibility(background: boolean, effects: boolean): void {
    this.showBackground = background;
    this.showEffects = effects;
    this.draw();
  }

  fit(): void {
    const cos = Math.abs(Math.cos((this.rotation * Math.PI) / 180));
    const sin = Math.abs(Math.sin((this.rotation * Math.PI) / 180));
    const docW = cos * ART_WIDTH + sin * ART_HEIGHT;
    const docH = sin * ART_WIDTH + cos * ART_HEIGHT;
    const inset = 84;
    this.zoom = clamp(
      Math.min((this.width - inset * 2) / docW, (this.height - inset * 2) / docH),
      MIN_ZOOM,
      MAX_ZOOM,
    );
    this.panX = 0;
    this.panY = 0;
    this.draw();
  }

  actualSize(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.draw();
  }

  zoomIn(): void {
    this.zoomAt(1.25, this.width / 2, this.height / 2);
  }

  zoomOut(): void {
    this.zoomAt(1 / 1.25, this.width / 2, this.height / 2);
  }

  rotate(step: number): void {
    this.rotation = (((this.rotation + step) % 360) + 360) % 360;
    this.draw();
  }

  flip(): void {
    this.flipped = !this.flipped;
    this.draw();
  }

  clearSelection(): void {
    this.selection = null;
    this.draw();
  }

  private resize(): void {
    const rect = this.wrap.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (!this.fitted) {
      this.fitted = true;
      this.fit();
      return;
    }
    this.draw();
  }

  private bindEvents(): void {
    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0016);
      const rect = this.canvas.getBoundingClientRect();
      this.zoomAt(factor, event.clientX - rect.left, event.clientY - rect.top);
    }, { passive: false });

    this.canvas.addEventListener("pointerdown", (event) => {
      this.canvas.setPointerCapture(event.pointerId);
      const tool = this.options.getTool();
      const wantsPan = event.button === 1 || this.options.isSpaceDown() || tool === "hand";
      if (wantsPan) {
        this.panning = true;
        this.panStart = { x: event.clientX, y: event.clientY, panX: this.panX, panY: this.panY };
        this.canvas.classList.add("is-panning");
        return;
      }
      if (event.button !== 0) return;
      if (tool === "zoom") {
        const rect = this.canvas.getBoundingClientRect();
        this.zoomAt(event.altKey ? 1 / 1.35 : 1.35, event.clientX - rect.left, event.clientY - rect.top);
        return;
      }
      if (tool === "marquee" || tool === "lasso" || tool === "crop" || tool === "selectionBrush") {
        const rect = this.canvas.getBoundingClientRect();
        this.selectStart = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        this.selection = null;
      }
    });

    this.canvas.addEventListener("pointermove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.panning) {
        this.panX = this.panStart.panX + (event.clientX - this.panStart.x);
        this.panY = this.panStart.panY + (event.clientY - this.panStart.y);
        this.draw();
        return;
      }
      if (this.selectStart) {
        const x = clamp(event.clientX - rect.left, 0, this.width);
        const y = clamp(event.clientY - rect.top, 0, this.height);
        this.selection = {
          x: Math.min(x, this.selectStart.x),
          y: Math.min(y, this.selectStart.y),
          w: Math.abs(x - this.selectStart.x),
          h: Math.abs(y - this.selectStart.y),
        };
        this.draw();
      }
    });

    const endPointer = (): void => {
      if (this.panning) {
        this.panning = false;
        this.canvas.classList.remove("is-panning");
      }
      if (this.selectStart) {
        this.selectStart = null;
        if (this.selection && (this.selection.w < 4 || this.selection.h < 4)) {
          this.selection = null;
        } else if (this.selection) {
          this.options.onStatus(
            `Selection ${Math.round(this.selection.w)} × ${Math.round(this.selection.h)} px`,
          );
        }
        this.draw();
      }
    };
    this.canvas.addEventListener("pointerup", endPointer);
    this.canvas.addEventListener("pointercancel", endPointer);

    this.canvas.addEventListener("dblclick", () => {
      this.fit();
      this.options.onStatus("Fit to window");
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.options.onContextMenu(event.clientX, event.clientY);
    });
  }

  private zoomAt(factor: number, x: number, y: number): void {
    const oldZoom = this.zoom;
    const next = clamp(oldZoom * factor, MIN_ZOOM, MAX_ZOOM);
    if (next === oldZoom) return;
    const px = x - this.width / 2;
    const py = y - this.height / 2;
    const ratio = next / oldZoom;
    this.panX = px - (px - this.panX) * ratio;
    this.panY = py - (py - this.panY) * ratio;
    this.zoom = next;
    this.draw();
    this.options.onZoom(this.zoomPercent());
  }

  private applyCursor(): void {
    const tool = this.options.getTool();
    const cursors: Record<string, string> = {
      hand: "grab",
      zoom: "zoom-in",
      brush: "crosshair",
      eraser: "crosshair",
      clone: "crosshair",
      heal: "crosshair",
      marquee: "crosshair",
      lasso: "crosshair",
      selectionBrush: "crosshair",
      crop: "crosshair",
      eyedropper: "crosshair",
      gradient: "crosshair",
      text: "text",
    };
    this.canvas.style.cursor = this.panning || this.options.isSpaceDown() ? "grabbing" : cursors[tool] ?? "default";
  }

  private artRect(): ArtRect {
    const angle = (this.rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    const boundW = (cos * ART_WIDTH + sin * ART_HEIGHT) * this.zoom;
    const boundH = (sin * ART_WIDTH + cos * ART_HEIGHT) * this.zoom;
    return {
      left: this.width / 2 + this.panX - boundW / 2,
      top: this.height / 2 + this.panY - boundH / 2,
      width: boundW,
      height: boundH,
    };
  }

  private draw(): void {
    this.applyCursor();
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    // Pasteboard.
    const board = ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.46,
      40,
      this.width * 0.5,
      this.height * 0.46,
      Math.max(this.width, this.height) * 0.78,
    );
    board.addColorStop(0, "#2b2b2b");
    board.addColorStop(1, "#202020");
    ctx.fillStyle = board;
    ctx.fillRect(0, 0, this.width, this.height);

    const angle = (this.rotation * Math.PI) / 180;
    const aw = ART_WIDTH * this.zoom;
    const ah = ART_HEIGHT * this.zoom;

    ctx.save();
    ctx.translate(this.width / 2 + this.panX, this.height / 2 + this.panY);
    ctx.rotate(angle);
    if (this.flipped) ctx.scale(-1, 1);

    // Drop shadow under the artboard.
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#000";
    ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
    ctx.restore();

    if (this.showBackground) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.options.art, -aw / 2, -ah / 2, aw, ah);
      if (this.showEffects) {
        ctx.drawImage(this.options.effects, -aw / 2, -ah / 2, aw, ah);
      }
    } else if (this.checker) {
      ctx.fillStyle = this.checker;
      ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
    } else {
      ctx.fillStyle = "#8a8a8a";
      ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
    }

    // Hairline artboard border.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1 / this.zoom;
    ctx.strokeRect(-aw / 2, -ah / 2, aw, ah);
    ctx.restore();

    if (this.selection) {
      const { x, y, w, h } = this.selection;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x + 0.5, y + 0.5, w, h);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineDashOffset = 4;
      ctx.strokeRect(x + 0.5, y + 0.5, w, h);
      ctx.restore();
    }

    this.options.onArtRect(this.artRect());
    this.options.onZoom(this.zoomPercent());
  }
}
