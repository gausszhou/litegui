import { EventMitter } from "@gausszhou/litegui-core";

export interface TimelineOptions {
  id?: string;
  className?: string;
  start?: number;
  end?: number;
  frame?: number;
  fps?: number;
  keyframes?: number[];
  /** Height of the whole widget, header included. */
  height?: number | string;
  showHeader?: boolean;
  canvasId?: string;
  frameInputId?: string;
  startInputId?: string;
  endInputId?: string;
  onFrameChange?: (frame: number) => void;
  onPlayChange?: (playing: boolean) => void;
  onRangeChange?: (start: number, end: number) => void;
}

const ICONS = {
  start: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h2v12H4zM14 2L6 8l8 6z"/></svg>',
  prev: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 2L3 8l8 6z"/></svg>',
  play: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l9 6-9 6z"/></svg>',
  pause: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h3v12H4zM9 2h3v12H9z"/></svg>',
  next: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 2l8 6-8 6z"/></svg>',
  end: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 2h2v12h-2zM2 2l8 6-8 6z"/></svg>'
};

/**
 * Timeline — frame ruler, playhead, keyframe markers, playback controls and
 * frame-range fields.
 *
 * BEM:
 *   .lg-timeline
 *   .lg-timeline__header | __menus | __spacer | __controls | __icon-btn
 *   .lg-timeline__frame-box | __label | __body | __canvas | __menu
 */
export class Timeline extends EventMitter {
  public root: HTMLElement;
  public header: HTMLElement;
  public menus: HTMLElement;
  public controls: HTMLElement;
  public body: HTMLElement;
  public canvas: HTMLCanvasElement;
  public frameInput: HTMLInputElement;
  public startInput: HTMLInputElement;
  public endInput: HTMLInputElement;

  public start: number;
  public end: number;
  public frame: number;
  public fps: number;
  public playing = false;

  private keyframes = new Set<number>();
  private playButton!: HTMLButtonElement;
  private playTimer = 0;
  private dragging = false;
  private resizeObserver: ResizeObserver | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private onFrameChange?: (frame: number) => void;
  private onPlayChange?: (playing: boolean) => void;
  private onRangeChange?: (start: number, end: number) => void;

  constructor(options: TimelineOptions = {}) {
    super();
    this.start = Math.round(options.start ?? 1);
    this.end = Math.max(this.start + 1, Math.round(options.end ?? 250));
    this.frame = Math.min(this.end, Math.max(this.start, Math.round(options.frame ?? 1)));
    this.fps = options.fps ?? 24;
    this.onFrameChange = options.onFrameChange;
    this.onPlayChange = options.onPlayChange;
    this.onRangeChange = options.onRangeChange;
    (options.keyframes || []).forEach((frame) => this.keyframes.add(frame));

    this.root = document.createElement("section");
    this.root.className = ["lg-timeline", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;
    if (options.height !== undefined) {
      this.root.style.height = typeof options.height === "number" ? `${options.height}px` : options.height;
    }

    this.header = document.createElement("div");
    this.header.className = "lg-timeline__header";
    this.menus = document.createElement("div");
    this.menus.className = "lg-timeline__menus";
    this.header.appendChild(this.menus);

    const spacer = document.createElement("div");
    spacer.className = "lg-timeline__spacer";
    this.header.appendChild(spacer);

    this.controls = document.createElement("div");
    this.controls.className = "lg-timeline__controls";
    this.header.appendChild(this.controls);

    this.playButton = this.createIconButton("play", "Play (Space)", () => this.togglePlay());
    this.controls.appendChild(this.createIconButton("start", "Jump to Start", () => this.setFrame(this.start)));
    this.controls.appendChild(this.createIconButton("prev", "Previous Keyframe", () => this.stepKeyframe(-1)));
    this.controls.appendChild(this.playButton);
    this.controls.appendChild(this.createIconButton("next", "Next Keyframe", () => this.stepKeyframe(1)));
    this.controls.appendChild(this.createIconButton("end", "Jump to End", () => this.setFrame(this.end)));

    this.frameInput = this.createNumberField("frame", options.frameInputId, String(this.frame));
    this.controls.appendChild(this.wrapFrameBox(this.frameInput, "Frame"));
    this.startInput = this.createNumberField("start", options.startInputId, String(this.start));
    this.controls.appendChild(this.wrapFrameBox(this.startInput, "Start"));
    this.endInput = this.createNumberField("end", options.endInputId, String(this.end));
    this.controls.appendChild(this.wrapFrameBox(this.endInput, "End"));

    if (options.showHeader === false) this.header.style.display = "none";
    this.root.appendChild(this.header);

    this.body = document.createElement("div");
    this.body.className = "lg-timeline__body";
    this.canvas = document.createElement("canvas");
    this.canvas.className = "lg-timeline__canvas";
    if (options.canvasId) this.canvas.id = options.canvasId;
    this.body.appendChild(this.canvas);
    this.root.appendChild(this.body);

    this.ctx = this.canvas.getContext("2d");
    this.bindEvents();
    this.updatePlayButton();

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.scheduleDraw());
      this.resizeObserver.observe(this.body);
    }
    this.scheduleDraw();
  }

  private createIconButton(icon: keyof typeof ICONS, label: string, onClick: () => void) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lg-timeline__icon-btn";
    button.dataset.action = icon;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.innerHTML = ICONS[icon];
    button.addEventListener("click", onClick);
    return button;
  }

  private createNumberField(role: string, id: string | undefined, value: string) {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "lg-timeline__number";
    input.dataset.role = role;
    if (id) input.id = id;
    input.value = value;
    return input;
  }

  private wrapFrameBox(input: HTMLInputElement, label: string) {
    const box = document.createElement("div");
    box.className = "lg-timeline__frame-box";
    box.appendChild(input);
    const span = document.createElement("span");
    span.className = "lg-timeline__label";
    span.textContent = label;
    box.appendChild(span);
    return box;
  }

  /** Add an app/menu button to the left side of the timeline header. */
  addMenuButton(label: string, onClick: (button: HTMLButtonElement) => void) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lg-timeline__menu";
    button.textContent = label;
    button.addEventListener("click", () => onClick(button));
    this.menus.appendChild(button);
    return button;
  }

  private bindEvents() {
    this.frameInput.addEventListener("change", () => this.setFrame(Number(this.frameInput.value)));
    this.frameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") this.setFrame(Number(this.frameInput.value));
    });
    this.startInput.addEventListener("change", () => this.setRange(Number(this.startInput.value), this.end));
    this.endInput.addEventListener("change", () => this.setRange(this.start, Number(this.endInput.value)));

    this.canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      this.dragging = true;
      this.setFrameFromEvent(event);
    });
    this.canvas.addEventListener("dblclick", (event) => {
      const frame = this.frameFromEvent(event);
      this.insertKeyframe(frame);
    });
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.dragging) return;
    this.setFrameFromEvent(event);
  };

  private onPointerUp = () => {
    this.dragging = false;
  };

  private frameFromEvent(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    return Math.round(this.start + ratio * (this.end - this.start));
  }

  private setFrameFromEvent(event: MouseEvent) {
    this.setFrame(this.frameFromEvent(event));
  }

  setFrame(next: number, emit = true) {
    if (!Number.isFinite(next)) return this;
    this.frame = Math.max(this.start, Math.min(this.end, Math.round(next)));
    if (document.activeElement !== this.frameInput) this.frameInput.value = String(this.frame);
    this.scheduleDraw();
    if (emit) {
      this.onFrameChange?.(this.frame);
      this.emit("frame", this.frame);
    }
    return this;
  }

  getFrame() {
    return this.frame;
  }

  setRange(start: number, end: number, emit = true) {
    let nextStart = Math.round(Number.isFinite(start) ? start : this.start);
    let nextEnd = Math.round(Number.isFinite(end) ? end : this.end);
    nextStart = Math.max(1, nextStart);
    nextEnd = Math.max(nextStart + 1, nextEnd);
    this.start = nextStart;
    this.end = nextEnd;
    this.startInput.value = String(nextStart);
    this.endInput.value = String(nextEnd);
    this.setFrame(this.frame, false);
    this.scheduleDraw();
    if (emit) {
      this.onRangeChange?.(this.start, this.end);
      this.emit("range", { start: this.start, end: this.end });
    }
    return this;
  }

  getRange() {
    return { start: this.start, end: this.end };
  }

  setFps(fps: number) {
    this.fps = Math.max(1, Math.round(fps));
    return this;
  }

  getFps() {
    return this.fps;
  }

  setKeyframes(frames: number[]) {
    this.keyframes = new Set(frames);
    this.scheduleDraw();
    return this;
  }

  getKeyframes() {
    return Array.from(this.keyframes).sort((a, b) => a - b);
  }

  insertKeyframe(frame = this.frame) {
    this.keyframes.add(Math.round(frame));
    this.scheduleDraw();
    this.emit("keyframe", frame);
    return this;
  }

  removeKeyframe(frame = this.frame) {
    this.keyframes.delete(Math.round(frame));
    this.scheduleDraw();
    return this;
  }

  private stepKeyframe(direction: 1 | -1) {
    const sorted = this.getKeyframes();
    if (!sorted.length) {
      this.setFrame(this.frame + direction * 10);
      return;
    }
    const target =
      direction > 0
        ? sorted.find((frame) => frame > this.frame) ?? sorted[0]
        : [...sorted].reverse().find((frame) => frame < this.frame) ?? sorted[sorted.length - 1];
    this.setFrame(target);
  }

  togglePlay() {
    if (this.playing) this.pause();
    else this.play();
    return this;
  }

  play() {
    if (this.playing) return this;
    this.playing = true;
    this.updatePlayButton();
    this.onPlayChange?.(true);
    this.emit("play", true);
    this.playTimer = window.setInterval(() => {
      const next = this.frame >= this.end ? this.start : this.frame + 1;
      this.setFrame(next);
    }, Math.max(10, Math.round(1000 / this.fps)));
    return this;
  }

  pause() {
    if (!this.playing) return this;
    this.playing = false;
    window.clearInterval(this.playTimer);
    this.playTimer = 0;
    this.updatePlayButton();
    this.onPlayChange?.(false);
    this.emit("play", false);
    return this;
  }

  setPlaying(value: boolean) {
    if (value) this.play();
    else this.pause();
    return this;
  }

  isPlaying() {
    return this.playing;
  }

  private updatePlayButton() {
    this.playButton.innerHTML = this.playing ? ICONS.pause : ICONS.play;
    this.playButton.title = this.playing ? "Pause (Space)" : "Play (Space)";
    this.playButton.classList.toggle("lg-timeline__icon-btn--active", this.playing);
  }

  setHeight(height: number | string) {
    this.root.style.height = typeof height === "number" ? `${height}px` : height;
    this.scheduleDraw();
    return this;
  }

  scheduleDraw() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const rect = this.body.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const styles = getComputedStyle(this.root);
    const bg = styles.getPropertyValue("--lg-timeline-bg").trim() || "#282828";
    const ruler = styles.getPropertyValue("--lg-timeline-ruler").trim() || "#1d1d1d";
    const line = styles.getPropertyValue("--lg-timeline-line").trim() || "#3d3d3d";
    const text = styles.getPropertyValue("--lg-timeline-text").trim() || "#9a9a9a";
    const accent = styles.getPropertyValue("--lg-color-accent").trim() || "#4772b3";
    const key = styles.getPropertyValue("--lg-timeline-key").trim() || "#d8b04a";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const rulerHeight = 20;
    ctx.fillStyle = ruler;
    ctx.fillRect(0, 0, w, rulerHeight);
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(0, rulerHeight + 0.5);
    ctx.lineTo(w, rulerHeight + 0.5);
    ctx.stroke();

    const frameToX = (value: number) => ((value - this.start) / Math.max(1, this.end - this.start)) * w;
    const step = this.pickStep(w);
    ctx.font = "10px Inter, sans-serif";
    ctx.textBaseline = "alphabetic";
    for (let value = Math.ceil(this.start / step) * step; value <= this.end; value += step) {
      const x = Math.round(frameToX(value)) + 0.5;
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(x, 12);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.fillStyle = text;
      ctx.fillText(String(value), x + 3, 13);
    }

    const keySize = Math.max(4, Math.min(6, Math.round(h / 10)));
    const keyY = Math.max(rulerHeight + 12, h - 12);
    for (const value of this.getKeyframes()) {
      if (value < this.start || value > this.end) continue;
      const x = frameToX(value);
      ctx.fillStyle = key;
      ctx.beginPath();
      ctx.moveTo(x, keyY - keySize);
      ctx.lineTo(x + keySize, keyY);
      ctx.lineTo(x, keyY + keySize);
      ctx.lineTo(x - keySize, keyY);
      ctx.closePath();
      ctx.fill();
    }

    const x = Math.round(frameToX(this.frame)) + 0.5;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x - 5, 0);
    ctx.lineTo(x + 5, 0);
    ctx.lineTo(x, 7);
    ctx.closePath();
    ctx.fill();
  }

  private pickStep(width: number) {
    const frames = Math.max(1, this.end - this.start);
    const targetPx = 82;
    const wanted = Math.max(1, Math.floor((frames * targetPx) / Math.max(1, width)));
    const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000, 2000, 5000];
    return steps.find((step) => step >= wanted) ?? steps[steps.length - 1];
  }

  destroy() {
    this.pause();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.root.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default Timeline;
