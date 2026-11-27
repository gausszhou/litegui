import { EventMitter } from "@gausszhou/litegui-core";

export interface ImageEditorOptions {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  src?: string;
  /** Show a checkerboard pattern behind the image (transparency). */
  checkerboard?: boolean;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Automatically fit the image when it loads. */
  autoFit?: boolean;
  emptyText?: string;
}

/**
 * ImageEditor — image canvas with pan, wheel zoom, fit / 1:1 controls.
 * Shared by UV Editing (UV grid) and Rendering (Render Result).
 *
 * BEM:
 *   .lg-image-editor
 *   .lg-image-editor__header | __title | __subtitle | __spacer | __zoom
 *   .lg-image-editor__btn | __viewport | __stage | __image | __empty
 */
export class ImageEditor extends EventMitter {
  public root: HTMLElement;
  public header: HTMLElement;
  public titleElement: HTMLElement;
  public subtitleElement: HTMLElement;
  public zoomElement: HTMLElement;
  public viewport: HTMLElement;
  public stage: HTMLElement;
  public image: HTMLImageElement;
  public empty: HTMLElement;

  public zoom: number;
  public minZoom: number;
  public maxZoom: number;

  private panX = 0;
  private panY = 0;
  private dragging = false;
  private dragX = 0;
  private dragY = 0;
  private autoFit: boolean;
  private naturalWidth = 0;
  private naturalHeight = 0;

  constructor(options: ImageEditorOptions = {}) {
    super();
    this.zoom = options.zoom ?? 1;
    this.minZoom = options.minZoom ?? 0.1;
    this.maxZoom = options.maxZoom ?? 8;
    this.autoFit = options.autoFit !== false;

    this.root = document.createElement("div");
    this.root.className = ["lg-image-editor", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;
    if (options.checkerboard) this.root.classList.add("lg-image-editor--checkerboard");

    this.header = document.createElement("div");
    this.header.className = "lg-image-editor__header";
    this.titleElement = document.createElement("span");
    this.titleElement.className = "lg-image-editor__title";
    this.subtitleElement = document.createElement("span");
    this.subtitleElement.className = "lg-image-editor__subtitle";
    this.header.append(this.titleElement, this.subtitleElement);
    const spacer = document.createElement("span");
    spacer.className = "lg-image-editor__spacer";
    this.header.appendChild(spacer);

    this.header.appendChild(this.createButton("−", "Zoom Out", () => this.setZoom(this.zoom / 1.25, true)));
    this.zoomElement = document.createElement("span");
    this.zoomElement.className = "lg-image-editor__zoom";
    this.header.appendChild(this.zoomElement);
    this.header.appendChild(this.createButton("+", "Zoom In", () => this.setZoom(this.zoom * 1.25, true)));
    this.header.appendChild(this.createButton("Fit", "Fit Image", () => this.fit(true)));
    this.header.appendChild(this.createButton("1:1", "Zoom 1:1", () => this.resetView(true)));
    this.root.appendChild(this.header);

    this.viewport = document.createElement("div");
    this.viewport.className = "lg-image-editor__viewport";
    this.stage = document.createElement("div");
    this.stage.className = "lg-image-editor__stage";
    this.image = document.createElement("img");
    this.image.className = "lg-image-editor__image";
    this.image.draggable = false;
    this.image.alt = options.title || "Image";
    this.empty = document.createElement("div");
    this.empty.className = "lg-image-editor__empty";
    this.empty.textContent = options.emptyText || "No image";
    this.stage.append(this.image, this.empty);
    this.viewport.appendChild(this.stage);
    this.root.appendChild(this.viewport);

    this.setTitle(options.title || "Image", options.subtitle || "");
    if (options.src) this.setSource(options.src);
    this.bindEvents();
    this.applyTransform();
    this.updateZoomLabel();
  }

  private createButton(label: string, title: string, onClick: () => void) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lg-image-editor__btn";
    button.textContent = label;
    button.title = title;
    button.setAttribute("aria-label", title);
    button.addEventListener("click", onClick);
    return button;
  }

  private bindEvents() {
    this.image.addEventListener("load", () => {
      this.naturalWidth = this.image.naturalWidth;
      this.naturalHeight = this.image.naturalHeight;
      this.image.classList.add("lg-image-editor__image--loaded");
      this.empty.style.display = "none";
      if (this.autoFit) this.fit(false);
      this.updateSubtitle();
    });
    this.image.addEventListener("error", () => {
      this.image.classList.remove("lg-image-editor__image--loaded");
      this.empty.style.display = "";
    });

    this.viewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      this.dragging = true;
      this.dragX = event.clientX - this.panX;
      this.dragY = event.clientY - this.panY;
      this.viewport.classList.add("lg-image-editor__viewport--dragging");
    });
    window.addEventListener("pointermove", (event) => {
      if (!this.dragging) return;
      this.panX = event.clientX - this.dragX;
      this.panY = event.clientY - this.dragY;
      this.applyTransform();
    });
    window.addEventListener("pointerup", () => {
      this.dragging = false;
      this.viewport.classList.remove("lg-image-editor__viewport--dragging");
    });
    this.viewport.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
        this.setZoom(this.zoom * factor, true);
      },
      { passive: false }
    );
    this.viewport.addEventListener("dblclick", () => this.resetView(true));
  }

  setTitle(title: string, subtitle?: string) {
    this.titleElement.textContent = title;
    this.image.alt = title;
    if (subtitle !== undefined) {
      this.subtitleElement.textContent = subtitle;
    } else {
      this.updateSubtitle();
    }
    return this;
  }

  private updateSubtitle() {
    if (this.naturalWidth && this.naturalHeight) {
      this.subtitleElement.textContent = `${this.naturalWidth} × ${this.naturalHeight} · ${Math.round(this.zoom * 100)}%`;
    }
  }

  setSource(src: string) {
    this.autoFit = true;
    this.panX = 0;
    this.panY = 0;
    this.image.classList.remove("lg-image-editor__image--loaded");
    this.empty.style.display = "";
    this.image.src = src;
    this.applyTransform();
    this.emit("source", src);
    return this;
  }

  getSource() {
    return this.image.getAttribute("src") || "";
  }

  setZoom(value: number, emit = false) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value));
    this.applyTransform();
    this.updateZoomLabel();
    this.updateSubtitle();
    if (emit) this.emit("zoom", this.zoom);
    return this;
  }

  getZoom() {
    return this.zoom;
  }

  fit(emit = false) {
    const viewport = this.viewport.getBoundingClientRect();
    if (!this.naturalWidth || !this.naturalHeight || !viewport.width || !viewport.height) return this;
    const scale = Math.min(viewport.width / this.naturalWidth, viewport.height / this.naturalHeight) * 0.92;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, scale));
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.updateZoomLabel();
    this.updateSubtitle();
    if (emit) this.emit("zoom", this.zoom);
    return this;
  }

  resetView(emit = false) {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.updateZoomLabel();
    this.updateSubtitle();
    if (emit) this.emit("zoom", this.zoom);
    return this;
  }

  private applyTransform() {
    this.stage.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  private updateZoomLabel() {
    this.zoomElement.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default ImageEditor;
