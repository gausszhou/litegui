/**
 * 显影画布：缩放/平移/前后对比/遮罩可视化与遮罩几何编辑。
 * 画布本身只负责显示已渲染好的预览像素，渲染调度在 main.ts。
 */
import { maskAlpha } from "./develop";
import { icon } from "./icons";
import { el } from "./ui";
import type { MaskEntry, Photo } from "./types";

export interface ViewerHooks {
  onZoom(percent: number): void;
  /** 遮罩几何变化（拖动中） */
  onMaskGeometry(mask: MaskEntry): void;
  /** 遮罩几何变化结束（写入历史） */
  onMaskCommit(): void;
  onCompareToggle?(): void;
}

type DragMode = "pan" | "mask-move" | "mask-resize" | "linear-start" | "linear-end" | "compare" | null;

export class Viewer {
  public root: HTMLElement;
  private hooks: ViewerHooks;
  private stage: HTMLElement;
  private shell: HTMLElement;
  private photoCanvas: HTMLCanvasElement;
  private beforeCanvas: HTMLCanvasElement;
  private maskCanvas: HTMLCanvasElement;
  private overlay: SVGSVGElement;
  private compareLine: HTMLElement;
  private compareBadge: HTMLElement;
  private loading: HTMLElement;
  private sidebarHint: HTMLElement;
  private mask: MaskEntry | null = null;
  private compare = false;
  private compareSplit = 0.5;
  private zoomMode: "fit" | "fixed" = "fit";
  private scale = 1;
  private fitScale = 1;
  private panX = 0;
  private panY = 0;
  private drag: DragMode = null;
  private dragStart = { x: 0, y: 0, panX: 0, panY: 0 };
  private hasImage = false;

  constructor(hooks: ViewerHooks) {
    this.hooks = hooks;
    this.root = el("div", "lc-viewer");

    this.stage = el("div", "lc-stage");
    this.shell = el("div", "lc-canvas-shell");
    this.photoCanvas = el("canvas", "lc-photo");
    this.beforeCanvas = el("canvas", "lc-photo lc-photo--before");
    this.maskCanvas = el("canvas", "lc-photo lc-mask");
    this.compareLine = el("div", "lc-compare-line");
    this.compareLine.innerHTML = `<span class="lc-compare-line__grip">${icon("compare", 12)}</span>`;
    this.compareLine.hidden = true;
    this.compareBadge = el("div", "lc-compare-badge");
    this.compareBadge.innerHTML = `<span>修改前</span><span>修改后</span>`;
    this.compareBadge.hidden = true;
    this.overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.overlay.setAttribute("class", "lc-mask-overlay");
    this.shell.append(this.beforeCanvas, this.photoCanvas, this.maskCanvas, this.overlay, this.compareLine, this.compareBadge);

    this.loading = el("div", "lc-loading");
    this.loading.hidden = true;
    this.loading.innerHTML = `<span class="lc-loading__spinner"></span><span class="lc-loading__text">正在解码 RAW…</span>`;

    this.sidebarHint = el("div", "lc-stage-hint");
    this.sidebarHint.innerHTML = `<span>按住 <b>\\</b> 查看修改前</span><span>双击画布切换 适合 / 100%</span>`;
    this.stage.append(this.shell, this.loading, this.sidebarHint);
    this.root.append(this.stage);

    this.bindEvents();
    this.applyCompare();

    const observer = new ResizeObserver(() => this.layout());
    observer.observe(this.stage);
  }

  /* ---------------------------------------------------------------- 交互 */

  private bindEvents(): void {
    this.stage.addEventListener("wheel", this.onWheel, { passive: false });
    this.stage.addEventListener("pointerdown", this.onPointerDown);
    this.stage.addEventListener("pointermove", this.onPointerMove);
    this.stage.addEventListener("pointerup", this.onPointerUp);
    this.stage.addEventListener("pointercancel", this.onPointerUp);
    this.stage.addEventListener("dblclick", (event) => {
      if ((event.target as HTMLElement).closest(".lc-mask-handle, .lc-compare-line")) return;
      this.setZoom(this.zoomMode === "fit" ? "100" : "fit");
    });
    this.compareLine.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      this.drag = "compare";
      this.stage.setPointerCapture(event.pointerId);
    });
    this.overlay.addEventListener("pointerdown", this.onOverlayPointerDown);
  }

  private onWheel = (event: WheelEvent): void => {
    if (!this.hasImage) return;
    event.preventDefault();
    const rect = this.stage.getBoundingClientRect();
    const anchorX = event.clientX - rect.left;
    const anchorY = event.clientY - rect.top;
    const factor = Math.pow(1.0016, -event.deltaY);
    const next = Math.max(this.fitScale * 0.4, Math.min(6, this.scale * factor));
    const ratio = next / this.scale;
    this.panX = anchorX - (anchorX - this.panX) * ratio;
    this.panY = anchorY - (anchorY - this.panY) * ratio;
    this.scale = next;
    this.zoomMode = "fixed";
    this.applyTransform();
    this.hooks.onZoom(this.percent());
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.hasImage) return;
    const target = event.target as HTMLElement;
    if (target.closest(".lc-mask-handle")) return;
    if (target.closest(".lc-compare-line")) return;
    const isMiddle = event.button === 1;
    const wantPan = isMiddle || event.button === 2 || this.scale > this.fitScale * 1.01;
    if (!wantPan) return;
    event.preventDefault();
    this.drag = "pan";
    this.dragStart = { x: event.clientX, y: event.clientY, panX: this.panX, panY: this.panY };
    this.stage.setPointerCapture(event.pointerId);
    this.stage.classList.add("is-panning");
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.drag) return;
    if (this.drag === "pan") {
      this.panX = this.dragStart.panX + (event.clientX - this.dragStart.x);
      this.panY = this.dragStart.panY + (event.clientY - this.dragStart.y);
      this.applyTransform();
      return;
    }
    if (this.drag === "compare") {
      const rect = this.stage.getBoundingClientRect();
      this.compareSplit = Math.max(0.02, Math.min(0.98, (event.clientX - rect.left) / rect.width));
      this.applyCompare();
      return;
    }
    this.dragMask(event);
  };

  private onPointerUp = (): void => {
    if (!this.drag) return;
    const wasMask = this.drag.startsWith("mask") || this.drag.startsWith("linear");
    this.drag = null;
    this.stage.classList.remove("is-panning");
    if (wasMask) this.hooks.onMaskCommit();
  };

  private onOverlayPointerDown = (event: PointerEvent): void => {
    const target = event.target as HTMLElement;
    const handle = target.closest<SVGElement>("[data-handle]");
    if (!handle || !this.mask) return;
    event.preventDefault();
    event.stopPropagation();
    const mode = handle.dataset["handle"];
    this.drag =
      mode === "move" ? "mask-move" : mode === "resize" ? "mask-resize" : mode === "start" ? "linear-start" : "linear-end";
    this.stage.setPointerCapture(event.pointerId);
  };

  private dragMask(event: PointerEvent): void {
    const mask = this.mask;
    if (!mask) return;
    const rect = this.photoCanvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
    const spec = { ...mask.spec, p1: { ...mask.spec.p1 }, p2: { ...mask.spec.p2 } };

    if (this.drag === "mask-move") {
      const dx = x - spec.p1.x;
      const dy = y - spec.p1.y;
      spec.p1 = { x, y };
      spec.p2 = { x: spec.p2.x + dx, y: spec.p2.y + dy };
    } else if (this.drag === "mask-resize") {
      // 径向渐变的单个手柄同时控制两个半径：横向取 |x - cx|，纵向镜像取 |y - cy|
      spec.p2 =
        spec.kind === "radial"
          ? { x: spec.p1.x + (x - spec.p1.x), y: spec.p1.y + (spec.p1.y - y) }
          : { x, y };
    } else if (this.drag === "linear-start") {
      spec.p1 = { x, y };
    } else if (this.drag === "linear-end") {
      spec.p2 = { x, y };
    }
    this.mask = { ...mask, spec };
    this.hooks.onMaskGeometry(this.mask);
  }

  /* ---------------------------------------------------------------- 渲染 */

  setPhoto(photo: Photo | null): void {
    if (!photo) {
      this.hasImage = false;
      return;
    }
    const { width, height } = this.intrinsic(photo);
    if (this.photoCanvas.width !== width || this.photoCanvas.height !== height) {
      this.photoCanvas.width = width;
      this.photoCanvas.height = height;
      this.beforeCanvas.width = width;
      this.beforeCanvas.height = height;
      this.maskCanvas.width = width;
      this.maskCanvas.height = height;
    }
    this.hasImage = true;
    this.layout();
  }

  private intrinsic(photo: Photo): { width: number; height: number } {
    if (photo.preview) return { width: photo.preview.width, height: photo.preview.height };
    return { width: photo.width, height: photo.height };
  }

  setImage(developed: ImageData, original: ImageData): void {
    // 预览分辨率可能与 setPhoto 时的尺寸不同（首次进入显影才会生成预览）
    if (this.photoCanvas.width !== developed.width || this.photoCanvas.height !== developed.height) {
      for (const canvas of [this.photoCanvas, this.beforeCanvas, this.maskCanvas]) {
        canvas.width = developed.width;
        canvas.height = developed.height;
      }
    }
    const ctx = this.photoCanvas.getContext("2d");
    const beforeCtx = this.beforeCanvas.getContext("2d");
    if (!ctx || !beforeCtx) return;
    ctx.putImageData(developed, 0, 0);
    beforeCtx.putImageData(original, 0, 0);
    this.layout();
  }

  setMask(mask: MaskEntry | null): void {
    this.mask = mask;
    if (!mask) {
      this.maskCanvas.getContext("2d")?.clearRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
      this.overlay.innerHTML = "";
      return;
    }
    const raster = maskAlpha(mask.spec, this.maskCanvas.width, this.maskCanvas.height);
    const context = this.maskCanvas.getContext("2d");
    if (!context) return;
    const image = context.createImageData(raster.width, raster.height);
    for (let i = 0; i < raster.alpha.length; i++) {
      const value = raster.alpha[i];
      image.data[i * 4] = 232;
      image.data[i * 4 + 1] = 74;
      image.data[i * 4 + 2] = 74;
      image.data[i * 4 + 3] = value * 78;
    }
    context.putImageData(image, 0, 0);
    this.drawMaskHandles();
  }

  clearMask(): void {
    this.setMask(null);
  }

  private drawMaskHandles(): void {
    const mask = this.mask;
    this.overlay.innerHTML = "";
    if (!mask) return;
    const spec = mask.spec;
    const ns = "http://www.w3.org/2000/svg";
    this.overlay.setAttribute("viewBox", `0 0 ${this.photoCanvas.width} ${this.photoCanvas.height}`);
    this.overlay.setAttribute("preserveAspectRatio", "none");

    if (spec.kind === "radial") {
      const cx = spec.p1.x * this.photoCanvas.width;
      const cy = spec.p1.y * this.photoCanvas.height;
      const rx = Math.abs(spec.p2.x - spec.p1.x) * this.photoCanvas.width;
      const ry = Math.abs(spec.p2.y - spec.p1.y) * this.photoCanvas.height;
      const ellipse = document.createElementNS(ns, "ellipse");
      ellipse.setAttribute("cx", String(cx));
      ellipse.setAttribute("cy", String(cy));
      ellipse.setAttribute("rx", String(rx));
      ellipse.setAttribute("ry", String(ry));
      ellipse.setAttribute("class", "lc-mask-shape");
      this.overlay.appendChild(ellipse);
      this.overlay.appendChild(this.handle(cx, cy, "move"));
      this.overlay.appendChild(this.handle(cx + rx, cy, "resize"));
    } else if (spec.kind === "linear") {
      const x1 = spec.p1.x * this.photoCanvas.width;
      const y1 = spec.p1.y * this.photoCanvas.height;
      const x2 = spec.p2.x * this.photoCanvas.width;
      const y2 = spec.p2.y * this.photoCanvas.height;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("class", "lc-mask-line");
      this.overlay.appendChild(line);
      this.overlay.appendChild(this.handle(x1, y1, "start"));
      this.overlay.appendChild(this.handle(x2, y2, "end"));
    } else {
      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", String(this.photoCanvas.width - 16));
      text.setAttribute("y", "28");
      text.setAttribute("text-anchor", "end");
      text.setAttribute("class", "lc-mask-label");
      text.textContent = spec.kind === "sky" ? "天空遮罩" : "主体遮罩";
      this.overlay.appendChild(text);
    }
  }

  private handle(x: number, y: number, kind: string): SVGCircleElement {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "7");
    circle.setAttribute("class", "lc-mask-handle");
    circle.dataset["handle"] = kind;
    return circle;
  }

  setCompare(on: boolean): void {
    this.compare = on;
    this.applyCompare();
  }

  isComparing(): boolean {
    return this.compare;
  }

  private applyCompare(): void {
    // 对比时隐藏遮罩着色，避免红色蒙层干扰“修改前/修改后”的判断
    this.maskCanvas.style.visibility = this.compare ? "hidden" : "";
    this.overlay.style.visibility = this.compare ? "hidden" : "";
    this.compareLine.hidden = !this.compare;
    this.compareBadge.hidden = !this.compare;
    this.beforeCanvas.style.display = this.compare ? "" : "none";
    this.beforeCanvas.style.clipPath = `inset(0 ${(1 - this.compareSplit) * 100}% 0 0)`;
    this.compareLine.style.left = `${this.compareSplit * 100}%`;
    this.shell.classList.toggle("is-comparing", this.compare);
  }

  setZoom(mode: "fit" | "100" | "200" | number): void {
    if (mode === "fit") {
      this.zoomMode = "fit";
      this.scale = this.fitScale;
    } else {
      this.zoomMode = "fixed";
      this.scale = typeof mode === "number" ? Math.max(0.05, Math.min(8, mode)) : mode === "100" ? 1 : 2;
    }
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.hooks.onZoom(this.percent());
  }

  zoomBy(factor: number): void {
    this.scale = Math.max(this.fitScale * 0.4, Math.min(6, this.scale * factor));
    this.zoomMode = "fixed";
    this.applyTransform();
    this.hooks.onZoom(this.percent());
  }

  percent(): number {
    return Math.round(this.scale * 100);
  }

  layout(): void {
    if (!this.hasImage) return;
    const rect = this.stage.getBoundingClientRect();
    // 视图被隐藏时（display:none）不重算，否则会把「适合」算成 5%
    if (rect.width < 24 || rect.height < 24) return;
    const width = this.photoCanvas.width;
    const height = this.photoCanvas.height;
    const availableW = Math.max(80, rect.width - 56);
    const availableH = Math.max(80, rect.height - 56);
    this.fitScale = Math.min(availableW / width, availableH / height);
    if (this.zoomMode === "fit") this.scale = this.fitScale;
    this.applyTransform();
    this.hooks.onZoom(this.percent());
  }

  private applyTransform(): void {
    const width = this.photoCanvas.width * this.scale;
    const height = this.photoCanvas.height * this.scale;
    this.shell.style.width = `${width}px`;
    this.shell.style.height = `${height}px`;
    this.shell.style.left = `calc(50% + ${this.panX}px)`;
    this.shell.style.top = `calc(50% + ${this.panY}px)`;
    this.sidebarHint.classList.toggle("is-hidden", this.scale > this.fitScale * 1.02);
  }

  showLoading(text: string | null): void {
    this.loading.hidden = !text;
    if (text) {
      const node = this.loading.querySelector(".lc-loading__text");
      if (node) node.textContent = text;
    }
  }
}
