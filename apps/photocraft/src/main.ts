import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { ART_HEIGHT, ART_WIDTH, createArtwork, createEffectsOverlay, makeThumbnails } from "./artwork";
import { CurvesPanel, type CurvesPoint } from "./curves";
import { icon } from "./icons";
import { CanvasView, type ArtRect } from "./workspace";

/* ------------------------------------------------------------------ types */

interface Tool {
  id: string;
  name: string;
  key: string;
  icon: string;
  group: number;
}

interface Layer {
  id: string;
  name: string;
  kind: "pixel" | "text" | "adjustment";
  visible: boolean;
  locked: boolean;
  opacity: number;
  thumb: string;
}

interface MenuItem {
  label?: string;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  checked?: boolean;
  action?: () => void;
}

interface MenuSpec {
  label: string;
  items: () => MenuItem[];
}

interface ChannelRow {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

interface PathRow {
  id: string;
  name: string;
  kind: string;
}

interface LayerSnapshot {
  active: string;
  layers: Array<{ id: string; visible: boolean }>;
}

/* ------------------------------------------------------------------ tools */

const TOOLS: Tool[] = [
  { id: "move", name: "Move Tool", key: "V", icon: "move", group: 0 },
  { id: "marquee", name: "Marquee Selection", key: "M", icon: "marquee", group: 1 },
  { id: "lasso", name: "Freehand Selection", key: "L", icon: "lasso", group: 1 },
  { id: "selectionBrush", name: "Selection Brush", key: "W", icon: "selectionBrush", group: 1 },
  { id: "crop", name: "Crop Tool", key: "C", icon: "crop", group: 2 },
  { id: "eyedropper", name: "Colour Picker", key: "I", icon: "eyedropper", group: 3 },
  { id: "brush", name: "Paint Brush", key: "B", icon: "brush", group: 4 },
  { id: "eraser", name: "Erase Brush", key: "E", icon: "eraser", group: 4 },
  { id: "clone", name: "Clone Brush", key: "S", icon: "clone", group: 4 },
  { id: "heal", name: "Healing Brush", key: "J", icon: "heal", group: 4 },
  { id: "gradient", name: "Gradient Tool", key: "G", icon: "gradient", group: 4 },
  { id: "text", name: "Frame Text", key: "T", icon: "text", group: 5 },
  { id: "shape", name: "Rectangle Tool", key: "U", icon: "shape", group: 5 },
  { id: "zoom", name: "Zoom Tool", key: "Z", icon: "zoom", group: 6 },
  { id: "hand", name: "Pan Tool", key: "H", icon: "hand", group: 6 },
];

const TOOL_BY_ID = new Map(TOOLS.map((tool) => [tool.id, tool]));

/* ------------------------------------------------------------------ state */

let activeTool = "move";
let activeLayer = "background";
let inspectorTab: "adjustments" | "properties" = "adjustments";
let layerTab: "layers" | "channels" | "paths" = "layers";
let spaceDown = false;
let persona = "Essentials";
let statusTimer = 0;
let showRulers = false;
let layerCounter = 3;

const undoStack: string[] = [];
const redoStack: string[] = [];

const art = createArtwork();
const effects = createEffectsOverlay();
const thumbs = makeThumbnails(art);

const layers: Layer[] = [
  { id: "effects", name: "Effects", kind: "adjustment", visible: true, locked: false, opacity: 100, thumb: thumbs.effects },
  { id: "caption", name: "Caption", kind: "text", visible: true, locked: false, opacity: 85, thumb: thumbs.caption },
  { id: "background", name: "Background", kind: "pixel", visible: true, locked: true, opacity: 100, thumb: thumbs.background },
];

const channels: ChannelRow[] = [
  { id: "composite", name: "Composite", color: "#b9c4cc", visible: true },
  { id: "red", name: "Red", color: "#c46a63", visible: true },
  { id: "green", name: "Green", color: "#6a9c72", visible: true },
  { id: "blue", name: "Blue", color: "#5f7fb5", visible: true },
  { id: "alpha", name: "Alpha", color: "#8d8d8d", visible: true },
];

const paths: PathRow[] = [
  { id: "wave", name: "Wave Outline", kind: "Curve" },
  { id: "selection", name: "Selection", kind: "Closed" },
  { id: "crest", name: "Crest Highlight", kind: "Curve" },
];

/* ------------------------------------------------------------------ helpers */

function q<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

function defaultHint(): string {
  return "Ready · Wheel to zoom · Space-drag to pan · Right-click canvas for options";
}

function setStatus(text: string, timeout = 0): void {
  const el = document.querySelector<HTMLElement>("#status-hint");
  if (el) el.textContent = text;
  if (statusTimer) window.clearTimeout(statusTimer);
  if (timeout > 0) {
    statusTimer = window.setTimeout(() => {
      const current = document.querySelector<HTMLElement>("#status-hint");
      if (current) current.textContent = defaultHint();
    }, timeout);
  }
}

function updateZoomLabels(percent: number): void {
  for (const id of ["#zoom-label", "#zoom-hud", "#zoom-tab"]) {
    const el = document.querySelector<HTMLElement>(id);
    if (el) el.textContent = `${percent}%`;
  }
}

function updateLayerLabels(): void {
  const label = document.querySelector<HTMLElement>("#layers-label");
  if (label) label.textContent = `${layers.length} layer${layers.length === 1 ? "" : "s"}`;
}

function snapshot(): string {
  const data: LayerSnapshot = {
    active: activeLayer,
    layers: layers.map((layer) => ({ id: layer.id, visible: layer.visible })),
  };
  return JSON.stringify(data);
}

function pushHistory(): void {
  undoStack.push(snapshot());
  if (undoStack.length > 60) undoStack.shift();
  redoStack.length = 0;
}

function restoreSnapshot(raw: string): void {
  const data = JSON.parse(raw) as LayerSnapshot;
  for (const entry of data.layers) {
    const layer = layers.find((candidate) => candidate.id === entry.id);
    if (layer) layer.visible = entry.visible;
  }
  activeLayer = layers.some((layer) => layer.id === data.active) ? data.active : layers[0].id;
  renderLayerPanel();
  syncCanvasLayers();
}

/* --------------------------------------------------------------- popup menus */

let popup: HTMLElement | null = null;

function closePopup(): void {
  popup?.remove();
  popup = null;
  document.querySelectorAll(".pc-menu-btn.active, .pc-persona.active").forEach((el) => el.classList.remove("active"));
}

function openMenuAt(x: number, y: number, items: MenuItem[]): void {
  closePopup();
  const menu = document.createElement("div");
  menu.className = "pc-popup";
  menu.setAttribute("role", "menu");
  for (const item of items) {
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "pc-popup-sep";
      menu.appendChild(separator);
      continue;
    }
    const row = document.createElement("button");
    row.type = "button";
    row.className = `pc-popup-item${item.disabled ? " disabled" : ""}${item.checked ? " checked" : ""}`;
    row.setAttribute("role", "menuitem");
    row.innerHTML = `
      <span class="pc-popup-check">${item.checked ? icon("check", 11) : ""}</span>
      <span class="pc-popup-label">${item.label ?? ""}</span>
      ${item.shortcut ? `<span class="pc-popup-shortcut">${item.shortcut}</span>` : ""}
    `;
    row.addEventListener("click", () => {
      closePopup();
      item.action?.();
    });
    menu.appendChild(row);
  }
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - rect.width - 6))}px`;
  menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - rect.height - 6))}px`;
  popup = menu;
}

function openMenuFrom(anchor: HTMLElement, items: MenuItem[]): void {
  const alreadyOpen = anchor.classList.contains("active");
  closePopup();
  if (alreadyOpen) return;
  const rect = anchor.getBoundingClientRect();
  openMenuAt(rect.left, rect.bottom + 1, items);
  anchor.classList.add("active");
}

document.addEventListener("mousedown", (event) => {
  if (popup && !popup.contains(event.target as Node)) closePopup();
});

/* --------------------------------------------------------------- layer logic */

function findLayer(id: string): Layer | undefined {
  return layers.find((layer) => layer.id === id);
}

function kindLabel(layer: Layer): string {
  if (layer.kind === "text") return "Text Layer";
  if (layer.kind === "adjustment") return "Live Adjustment";
  return "Pixel Layer";
}

function syncCaptionVisibility(): void {
  const captionLayer = findLayer("caption");
  const caption = document.querySelector<HTMLElement>("#artwork-caption");
  if (caption) caption.classList.toggle("is-hidden", !captionLayer?.visible);
}

function syncCanvasLayers(): void {
  const background = findLayer("background")?.visible ?? true;
  const effectsVisible = findLayer("effects")?.visible ?? true;
  canvasView.setLayerVisibility(background, effectsVisible);
}

function selectLayer(id: string): void {
  const layer = findLayer(id);
  if (!layer) return;
  activeLayer = id;
  renderLayerPanel();
  setStatus(`${layer.name} layer selected`);
}

function toggleLayerVisibility(id: string): void {
  const layer = findLayer(id);
  if (!layer) return;
  layer.visible = !layer.visible;
  renderLayerPanel();
  syncCaptionVisibility();
  syncCanvasLayers();
  setStatus(`${layer.name} ${layer.visible ? "visible" : "hidden"}`);
}

function addLayer(): void {
  pushHistory();
  layerCounter += 1;
  const id = `layer-${layerCounter}`;
  layers.unshift({
    id,
    name: `Layer ${layerCounter}`,
    kind: "pixel",
    visible: true,
    locked: false,
    opacity: 100,
    thumb: thumbs.background,
  });
  activeLayer = id;
  renderLayerPanel();
  setStatus(`New Layer ${layerCounter} created`);
}

function duplicateLayer(): void {
  const source = findLayer(activeLayer);
  if (!source) return;
  pushHistory();
  layerCounter += 1;
  const id = `layer-${layerCounter}`;
  layers.unshift({ ...source, id, name: `${source.name} copy`, locked: false });
  activeLayer = id;
  renderLayerPanel();
  setStatus(`${source.name} duplicated`);
}

function deleteLayer(): void {
  const layer = findLayer(activeLayer);
  if (!layer) return;
  if (layer.locked) {
    setStatus(`${layer.name} is locked — unlock it to delete`);
    return;
  }
  if (layers.length <= 1) {
    setStatus("At least one layer must remain");
    return;
  }
  pushHistory();
  const index = layers.indexOf(layer);
  layers.splice(index, 1);
  activeLayer = layers[Math.min(index, layers.length - 1)].id;
  renderLayerPanel();
  syncCaptionVisibility();
  syncCanvasLayers();
  setStatus(`${layer.name} deleted`);
}

function undo(): void {
  const entry = undoStack.pop();
  if (!entry) {
    setStatus("Nothing to undo");
    return;
  }
  redoStack.push(snapshot());
  restoreSnapshot(entry);
  setStatus("Undo");
}

function redo(): void {
  const entry = redoStack.pop();
  if (!entry) {
    setStatus("Nothing to redo");
    return;
  }
  undoStack.push(snapshot());
  restoreSnapshot(entry);
  setStatus("Redo");
}

function flattenDocument(): void {
  pushHistory();
  for (const layer of layers) {
    if (layer.id !== "background") layer.visible = false;
  }
  renderLayerPanel();
  syncCaptionVisibility();
  syncCanvasLayers();
  setStatus("Document flattened (mock)");
}

/* --------------------------------------------------------------- shell */

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="pc-app">
    <header class="pc-menubar">
      <div class="pc-brand" title="Photocraft">${icon("logo", 18)}</div>
      <nav class="pc-menus" id="menubar" aria-label="Main menu"></nav>
      <div class="pc-doc">
        <span class="pc-doc-dot" title="Unsaved changes"></span>
        <span class="pc-doc-name">great-wave.jpg</span>
        <span class="pc-doc-meta">${ART_WIDTH} × ${ART_HEIGHT} px</span>
      </div>
      <div class="pc-top-right">
        <button type="button" class="pc-persona" id="persona-btn" title="Switch persona">
          <span class="pc-persona-name">Essentials</span>
          ${icon("chevron", 12)}
        </button>
        <button type="button" class="pc-icon-btn" id="help-btn" title="About Photocraft">${icon("info", 14)}</button>
      </div>
    </header>

    <div class="pc-main">
      <aside class="pc-tools" id="tools" aria-label="Tools"></aside>

      <section class="pc-stage">
        <div class="pc-docbar">
          <div class="pc-doc-tab active" id="doc-tab">
            <span class="pc-doc-tab-icon">${icon("adjust", 12)}</span>
            <span>great-wave.jpg</span>
            <button type="button" class="pc-doc-tab-close" id="doc-close" title="Close document">${icon("close", 10)}</button>
          </div>
          <button type="button" class="pc-tab-add" id="tab-add" title="New document">${icon("plus", 12)}</button>
          <span class="pc-docbar-spacer"></span>
          <button type="button" class="pc-icon-btn" id="zoom-out" title="Zoom Out">${icon("minus", 13)}</button>
          <button type="button" class="pc-zoom-readout" id="zoom-tab" title="Actual size">30%</button>
          <button type="button" class="pc-icon-btn" id="zoom-in" title="Zoom In">${icon("plus", 13)}</button>
          <button type="button" class="pc-icon-btn" id="zoom-fit" title="Fit to Window">${icon("fit", 13)}</button>
        </div>

        <div class="pc-canvas-wrap" id="canvas-wrap">
          <canvas class="pc-canvas" id="pc-canvas"></canvas>
          <div class="pc-artwork-caption" id="artwork-caption">
            <span class="pc-caption-title">The Great Wave</span>
            <span class="pc-caption-sub">Katsushika Hokusai · c. 1831</span>
          </div>
          <div class="pc-canvas-hud">
            <span id="zoom-hud">30%</span>
            <span class="pc-hud-sep"></span>
            <span>${ART_WIDTH} × ${ART_HEIGHT} px</span>
            <span class="pc-hud-sep"></span>
            <span>RGB</span>
          </div>
        </div>
      </section>

      <aside class="pc-inspector">
        <div class="pc-insp-tabs" id="insp-tabs">
          <button type="button" class="pc-insp-tab active" data-tab="adjustments">Adjustments</button>
          <button type="button" class="pc-insp-tab" data-tab="properties">Properties</button>
          <span class="pc-insp-spacer"></span>
          <button type="button" class="pc-icon-btn" id="insp-menu" title="Panel menu">${icon("dots", 14)}</button>
        </div>

        <div class="pc-insp-body" id="insp-body"></div>

        <section class="pc-layers" aria-label="Layers">
          <div class="pc-panel-tabs" id="layer-tabs">
            <button type="button" class="pc-panel-tab active" data-ptab="layers">Layers</button>
            <button type="button" class="pc-panel-tab" data-ptab="channels">Channels</button>
            <button type="button" class="pc-panel-tab" data-ptab="paths">Paths</button>
            <span class="pc-insp-spacer"></span>
            <button type="button" class="pc-icon-btn" id="layers-menu" title="Layer options">${icon("dots", 14)}</button>
          </div>
          <div class="pc-layer-list" id="layer-list"></div>
          <div class="pc-layer-tools">
            <button type="button" class="pc-icon-btn" data-layer-action="add" title="New Layer">${icon("plus", 13)}</button>
            <button type="button" class="pc-icon-btn" data-layer-action="group" title="New Group">${icon("group", 13)}</button>
            <button type="button" class="pc-icon-btn" data-layer-action="mask" title="Add Mask">${icon("mask", 13)}</button>
            <button type="button" class="pc-icon-btn" data-layer-action="adjustment" title="New Adjustment">${icon("adjust", 13)}</button>
            <span class="pc-insp-spacer"></span>
            <button type="button" class="pc-icon-btn" data-layer-action="delete" title="Delete Layer">${icon("trash", 13)}</button>
          </div>
        </section>
      </aside>
    </div>

    <footer class="pc-status">
      <span class="pc-status-hint" id="status-hint">Ready</span>
      <span class="pc-status-items">
        <span id="zoom-label">30%</span>
        <span class="pc-status-sep"></span>
        <span>RGB Color 8-bit</span>
        <span class="pc-status-sep"></span>
        <span id="size-label">${ART_WIDTH} × ${ART_HEIGHT} px</span>
        <span class="pc-status-sep"></span>
        <span id="layers-label">${layers.length} layers</span>
        <span class="pc-status-sep"></span>
        <span class="pc-status-file" id="file-label">great-wave.jpg — open</span>
        <span class="pc-status-app">Photocraft 2.1</span>
      </span>
    </footer>
  </div>
`;

/* --------------------------------------------------------------- rendering */

const toolsEl = q<HTMLElement>("#tools");
const menubarEl = q<HTMLElement>("#menubar");
const layerListEl = q<HTMLElement>("#layer-list");
const inspectorBodyEl = q<HTMLElement>("#insp-body");
const canvasWrap = q<HTMLElement>("#canvas-wrap");

function renderTools(): void {
  toolsEl.innerHTML = "";
  let lastGroup = -1;
  for (const tool of TOOLS) {
    if (lastGroup !== -1 && tool.group !== lastGroup) {
      const separator = document.createElement("div");
      separator.className = "pc-tools-sep";
      toolsEl.appendChild(separator);
    }
    lastGroup = tool.group;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pc-tool${tool.id === activeTool ? " active" : ""}`;
    button.dataset.tool = tool.id;
    button.title = `${tool.name} (${tool.key})`;
    button.setAttribute("aria-label", tool.name);
    button.setAttribute("aria-pressed", String(tool.id === activeTool));
    button.innerHTML = icon(tool.icon, 16);
    button.addEventListener("click", () => selectTool(tool.id));
    button.addEventListener("mouseenter", () => scheduleTooltip(button, tool));
    button.addEventListener("mouseleave", hideTooltip);
    toolsEl.appendChild(button);
  }
}

function selectTool(id: string): void {
  const tool = TOOL_BY_ID.get(id);
  if (!tool) return;
  activeTool = id;
  for (const button of toolsEl.querySelectorAll<HTMLElement>(".pc-tool")) {
    const isActive = button.dataset.tool === id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
  canvasView.setTool(id);
  setStatus(`${tool.name} selected`);
  hideTooltip();
}

/* tooltip */

const tooltip = document.createElement("div");
tooltip.className = "pc-tooltip";
tooltip.hidden = true;
document.body.appendChild(tooltip);
let tooltipTimer = 0;

function scheduleTooltip(button: HTMLElement, tool: Tool): void {
  hideTooltip();
  tooltipTimer = window.setTimeout(() => {
    const rect = button.getBoundingClientRect();
    tooltip.innerHTML = `<span>${tool.name}</span><kbd>${tool.key}</kbd>`;
    tooltip.style.left = `${rect.right + 8}px`;
    tooltip.style.top = `${Math.round(rect.top + rect.height / 2 - 11)}px`;
    tooltip.hidden = false;
  }, 260);
}

function hideTooltip(): void {
  if (tooltipTimer) window.clearTimeout(tooltipTimer);
  tooltip.hidden = true;
}

/* layers panel */

function layerRow(layer: Layer): string {
  return `
    <div class="pc-layer-row${layer.id === activeLayer ? " selected" : ""}${layer.visible ? "" : " is-hidden"}" data-layer="${layer.id}">
      <button type="button" class="pc-layer-eye" data-eye="${layer.id}" aria-pressed="${layer.visible}" title="Toggle visibility">
        ${icon(layer.visible ? "eye" : "eyeOff", 13)}
      </button>
      <span class="pc-layer-lock">${layer.locked ? icon("lock", 11) : ""}</span>
      <span class="pc-layer-thumb" style="background-image:url(${layer.thumb})"></span>
      <span class="pc-layer-name">${layer.name}<small>${kindLabel(layer)} · ${layer.opacity}%</small></span>
      <span class="pc-layer-flag">${layer.kind === "adjustment" ? "fx" : ""}</span>
    </div>
  `;
}

function channelRow(row: ChannelRow): string {
  return `
    <div class="pc-channel-row${row.visible ? "" : " is-hidden"}" data-channel-row="${row.id}">
      <button type="button" class="pc-layer-eye" data-channel-eye="${row.id}" aria-pressed="${row.visible}" title="Toggle channel visibility">
        ${icon(row.visible ? "eye" : "eyeOff", 13)}
      </button>
      <span class="pc-channel-swatch" style="background:${row.color}"></span>
      <span class="pc-channel-name">${row.name}</span>
      <span class="pc-channel-meta">${row.id === "composite" ? "RGB" : "8-bit"}</span>
    </div>
  `;
}

function pathRow(row: PathRow): string {
  return `
    <div class="pc-path-row" data-path="${row.id}">
      <span class="pc-path-icon">${icon("paths", 13)}</span>
      <span class="pc-path-name">${row.name}</span>
      <span class="pc-path-meta">${row.kind}</span>
    </div>
  `;
}

function renderLayerPanel(): void {
  for (const tab of document.querySelectorAll<HTMLElement>(".pc-panel-tab")) {
    tab.classList.toggle("active", tab.dataset.ptab === layerTab);
  }

  if (layerTab === "layers") {
    layerListEl.innerHTML = layers.map(layerRow).join("");
    for (const row of layerListEl.querySelectorAll<HTMLElement>(".pc-layer-row")) {
      row.addEventListener("click", () => selectLayer(row.dataset.layer ?? ""));
      row.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        selectLayer(row.dataset.layer ?? "");
        openMenuAt(event.clientX, event.clientY, [
          { label: "New Layer", action: addLayer },
          { label: "Duplicate Layer", action: duplicateLayer },
          { label: "Delete Layer", action: deleteLayer },
          { separator: true },
          { label: "Add Mask", action: () => setStatus("Layer mask added (mock)") },
          { label: "Merge Visible", action: () => setStatus("Merge Visible (mock)") },
        ]);
      });
    }
    for (const eye of layerListEl.querySelectorAll<HTMLElement>("[data-eye]")) {
      eye.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleLayerVisibility(eye.dataset.eye ?? "");
      });
    }
  } else if (layerTab === "channels") {
    layerListEl.innerHTML = channels.map(channelRow).join("");
    for (const eye of layerListEl.querySelectorAll<HTMLElement>("[data-channel-eye]")) {
      eye.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = channels.find((channel) => channel.id === eye.dataset.channelEye);
        if (!row) return;
        row.visible = !row.visible;
        renderLayerPanel();
        setStatus(`${row.name} channel ${row.visible ? "visible" : "hidden"}`);
      });
    }
  } else {
    layerListEl.innerHTML = paths.map(pathRow).join("");
    for (const row of layerListEl.querySelectorAll<HTMLElement>(".pc-path-row")) {
      row.addEventListener("click", () => {
        const path = paths.find((item) => item.id === row.dataset.path);
        if (path) setStatus(`Path "${path.name}" selected`);
      });
    }
  }
  updateLayerLabels();
}

/* inspector */

const LEVELS = { black: 0, gamma: 1, white: 255 };

function renderInspector(): void {
  for (const tab of document.querySelectorAll<HTMLElement>(".pc-insp-tab")) {
    tab.classList.toggle("active", tab.dataset.tab === inspectorTab);
  }

  if (inspectorTab === "adjustments") {
    inspectorBodyEl.innerHTML = `
      <section class="pc-section">
        <header class="pc-section-head">
          <span class="pc-section-title">Curves</span>
          <select class="pc-mini-select" id="curves-preset" aria-label="Curve preset">
            <option value="default">Default</option>
            <option value="medium">Medium Contrast</option>
            <option value="strong">Strong Contrast</option>
            <option value="lift">Lift Shadows</option>
            <option value="linear">Linear</option>
          </select>
        </header>
        <div class="pc-section-body">
          <div class="pc-chip-row" id="curves-channels">
            <button type="button" class="pc-chip active" data-channel="Master">Master</button>
            <button type="button" class="pc-chip" data-channel="Red">Red</button>
            <button type="button" class="pc-chip" data-channel="Green">Green</button>
            <button type="button" class="pc-chip" data-channel="Blue">Blue</button>
          </div>
          <canvas class="pc-curves-canvas" id="curves-canvas" aria-label="Tone curve"></canvas>
          <div class="pc-curves-foot">
            <span class="pc-readout" id="curves-readout">In 0 · Out 0</span>
            <button type="button" class="pc-link" id="curves-reset">Reset</button>
          </div>
        </div>
      </section>

      <section class="pc-section">
        <header class="pc-section-head">
          <span class="pc-section-title">Levels</span>
          <span class="pc-section-note">Auto</span>
        </header>
        <div class="pc-section-body">
          <label class="pc-slider"><span>Black</span><input type="range" id="level-black" min="0" max="254" value="0" /><output id="level-black-value">0</output></label>
          <label class="pc-slider"><span>Gamma</span><input type="range" id="level-gamma" min="10" max="300" value="100" /><output id="level-gamma-value">1.00</output></label>
          <label class="pc-slider"><span>White</span><input type="range" id="level-white" min="1" max="255" value="255" /><output id="level-white-value">255</output></label>
          <div class="pc-mode-row">
            <button type="button" class="pc-mode active" data-level-mode="RGB">RGB</button>
            <button type="button" class="pc-mode" data-level-mode="Luminosity">Luminosity</button>
          </div>
        </div>
      </section>

      <section class="pc-section">
        <header class="pc-section-head">
          <span class="pc-section-title">White Balance</span>
          <span class="pc-section-note">As Shot</span>
        </header>
        <div class="pc-section-body">
          <label class="pc-slider"><span>Temperature</span><input type="range" id="wb-temp" min="-100" max="100" value="0" /><output id="wb-temp-value">0</output></label>
          <label class="pc-slider"><span>Tint</span><input type="range" id="wb-tint" min="-100" max="100" value="0" /><output id="wb-tint-value">0</output></label>
        </div>
      </section>
    `;
    bindAdjustments();
  } else {
    inspectorBodyEl.innerHTML = `
      <section class="pc-section">
        <header class="pc-section-head"><span class="pc-section-title">Document</span></header>
        <div class="pc-property-grid">
          <span>Name</span><span>great-wave.jpg</span>
          <span>Format</span><span>JPEG · 8-bit</span>
          <span>Dimensions</span><span>${ART_WIDTH} × ${ART_HEIGHT} px</span>
          <span>Resolution</span><span>300 dpi</span>
          <span>Colour profile</span><span>sRGB IEC61966-2.1</span>
          <span>File size</span><span>4.28 MB</span>
          <span>Status</span><span class="pc-ok">Open</span>
        </div>
      </section>

      <section class="pc-section">
        <header class="pc-section-head"><span class="pc-section-title">Colour</span></header>
        <div class="pc-property-grid">
          <span>Colour space</span><span>RGB / 8-bit</span>
          <span>Rendering intent</span><span>Perceptual</span>
          <span>Black point</span><span>0</span>
          <span>White point</span><span>255</span>
        </div>
        <div class="pc-section-body">
          <div class="pc-swatch-strip">
            <span style="background:#0b2b45"></span>
            <span style="background:#17536f"></span>
            <span style="background:#2f8ba1"></span>
            <span style="background:#8fd0d4"></span>
            <span style="background:#f0e6d2"></span>
          </div>
        </div>
      </section>

      <section class="pc-section">
        <header class="pc-section-head"><span class="pc-section-title">Document Setup</span></header>
        <div class="pc-section-body">
          <label class="pc-field-row"><span>Width</span><input type="number" value="${ART_WIDTH}" readonly /><em>px</em></label>
          <label class="pc-field-row"><span>Height</span><input type="number" value="${ART_HEIGHT}" readonly /><em>px</em></label>
          <label class="pc-field-row"><span>DPI</span><input type="number" id="dpi-input" value="300" /><em>dpi</em></label>
          <label class="pc-field-row"><span>Background</span><select class="pc-mini-select"><option>White</option><option>Transparent</option></select></label>
        </div>
      </section>

      <section class="pc-section">
        <header class="pc-section-head"><span class="pc-section-title">Metadata</span></header>
        <div class="pc-property-grid">
          <span>Title</span><span>The Great Wave</span>
          <span>Creator</span><span>Katsushika Hokusai</span>
          <span>Date</span><span>c. 1831</span>
          <span>Keywords</span><span>ukiyo-e, seascape, wave</span>
        </div>
      </section>
    `;
    const dpi = document.querySelector<HTMLInputElement>("#dpi-input");
    dpi?.addEventListener("change", () => setStatus(`Resolution set to ${dpi.value} dpi (mock)`));
  }
}

function bindAdjustments(): void {
  const preset = document.querySelector<HTMLSelectElement>("#curves-preset");
  const reset = document.querySelector<HTMLButtonElement>("#curves-reset");
  const canvas = document.querySelector<HTMLCanvasElement>("#curves-canvas");
  if (!canvas) return;

  curves = new CurvesPanel(canvas, (readout) => {
    curvesPoints = readout.points.map((point) => ({ ...point }));
    const output = document.querySelector<HTMLElement>("#curves-readout");
    if (output) {
      output.textContent = `In ${Math.round(readout.active.x * 255)} · Out ${Math.round(readout.active.y * 255)}`;
    }
  });
  if (curvesPoints) curves.setPoints(curvesPoints);

  preset?.addEventListener("change", () => {
    const presets: Record<string, CurvesPoint[]> = {
      default: [
        { x: 0, y: 0 },
        { x: 0.25, y: 0.21 },
        { x: 0.58, y: 0.71 },
        { x: 1, y: 1 },
      ],
      medium: [
        { x: 0, y: 0 },
        { x: 0.25, y: 0.2 },
        { x: 0.5, y: 0.52 },
        { x: 0.75, y: 0.82 },
        { x: 1, y: 1 },
      ],
      strong: [
        { x: 0, y: 0 },
        { x: 0.22, y: 0.14 },
        { x: 0.5, y: 0.5 },
        { x: 0.78, y: 0.9 },
        { x: 1, y: 1 },
      ],
      lift: [
        { x: 0, y: 0.09 },
        { x: 0.3, y: 0.32 },
        { x: 0.7, y: 0.78 },
        { x: 1, y: 1 },
      ],
      linear: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    };
    const points = presets[preset.value] ?? presets.default;
    curves?.setPoints(points);
    setStatus(`Curve preset: ${preset.options[preset.selectedIndex].text}`);
  });

  reset?.addEventListener("click", () => {
    curves?.setPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
    setStatus("Curves reset");
  });

  for (const chip of document.querySelectorAll<HTMLElement>(".pc-chip")) {
    chip.addEventListener("click", () => {
      for (const other of document.querySelectorAll<HTMLElement>(".pc-chip")) {
        other.classList.toggle("active", other === chip);
      }
      setStatus(`Curves channel: ${chip.textContent ?? ""}`);
    });
  }

  for (const mode of document.querySelectorAll<HTMLElement>(".pc-mode")) {
    mode.addEventListener("click", () => {
      for (const other of document.querySelectorAll<HTMLElement>(".pc-mode")) {
        other.classList.toggle("active", other === mode);
      }
      setStatus(`Levels mode: ${mode.dataset.levelMode ?? "RGB"}`);
    });
  }

  const bindSlider = (id: string, outputId: string, format: (value: number) => string): void => {
    const input = document.querySelector<HTMLInputElement>(`#${id}`);
    const output = document.querySelector<HTMLElement>(`#${outputId}`);
    input?.addEventListener("input", () => {
      if (output) output.textContent = format(Number(input.value));
      setStatus(`Levels — ${id.replace("level-", "")}: ${format(Number(input.value))}`);
    });
  };
  bindSlider("level-black", "level-black-value", (value) => String(LEVELS.black + value));
  bindSlider("level-gamma", "level-gamma-value", (value) => (value / 100).toFixed(2));
  bindSlider("level-white", "level-white-value", (value) => String(value));
  bindSlider("wb-temp", "wb-temp-value", (value) => String(value));
  bindSlider("wb-tint", "wb-tint-value", (value) => String(value));
}

let curves: CurvesPanel | null = null;
let curvesPoints: CurvesPoint[] | null = null;

/* --------------------------------------------------------------- canvas */

const canvasEl = q<HTMLCanvasElement>("#pc-canvas");
const canvasView = new CanvasView(canvasWrap, canvasEl, {
  art,
  effects,
  getTool: () => activeTool,
  isSpaceDown: () => spaceDown,
  onZoom: (percent) => updateZoomLabels(percent),
  onArtRect: (rect) => positionCaption(rect),
  onContextMenu: (x, y) => openCanvasMenu(x, y),
  onStatus: (text) => setStatus(text, 1600),
});

function positionCaption(rect: ArtRect): void {
  const caption = document.querySelector<HTMLElement>("#artwork-caption");
  if (!caption) return;
  let top = rect.top + rect.height + 10;
  if (top > canvasWrap.clientHeight - 46) top = rect.top + rect.height - 46;
  const left = Math.max(8, Math.min(canvasWrap.clientWidth - 300, rect.left + 2));
  caption.style.left = `${Math.round(left)}px`;
  caption.style.top = `${Math.round(top)}px`;
}

function openCanvasMenu(x: number, y: number): void {
  openMenuAt(x, y, [
    { label: "Fit to Window", shortcut: "Ctrl 0", action: () => viewFit() },
    { label: "Actual Size (100%)", shortcut: "Ctrl 1", action: () => viewActual() },
    { label: "Zoom In", shortcut: "Ctrl +", action: () => canvasView.zoomIn() },
    { label: "Zoom Out", shortcut: "Ctrl -", action: () => canvasView.zoomOut() },
    { separator: true },
    { label: "Deselect", action: () => canvasView.clearSelection() },
    { label: "Rotate 90° CW", action: () => rotateDocument(90) },
    { label: "Flip Horizontal", action: () => flipDocument() },
    { separator: true },
    { label: "Copy Merged", action: () => setStatus("Copy Merged (mock)") },
    { label: "Paste", action: () => setStatus("Paste is not available in this mock") },
  ]);
}

function viewFit(): void {
  canvasView.fit();
  setStatus("Fit to window");
}

function viewActual(): void {
  canvasView.actualSize();
  setStatus("Zoom 100%");
}

function rotateDocument(step: number): void {
  canvasView.rotate(step);
  setStatus(`Rotated ${step > 0 ? "90° clockwise" : "90° counter-clockwise"}`);
}

function flipDocument(): void {
  canvasView.flip();
  setStatus("Flipped horizontally");
}

/* --------------------------------------------------------------- menus */

function toggleTools(): void {
  const app = q<HTMLElement>(".pc-app");
  const hidden = app.classList.toggle("tools-hidden");
  setStatus(hidden ? "Tools panel hidden" : "Tools panel shown");
}

function toggleInspector(): void {
  const app = q<HTMLElement>(".pc-app");
  const hidden = app.classList.toggle("inspector-hidden");
  setStatus(hidden ? "Inspector hidden" : "Inspector shown");
}

function switchInspectorTab(tab: "adjustments" | "properties"): void {
  inspectorTab = tab;
  renderInspector();
  setStatus(tab === "adjustments" ? "Adjustments panel" : "Properties panel");
}

function switchLayerTab(tab: "layers" | "channels" | "paths"): void {
  layerTab = tab;
  renderLayerPanel();
  setStatus(`${tab.charAt(0).toUpperCase()}${tab.slice(1)} panel`);
}

function toggleCaptionLayer(): void {
  const layer = findLayer("caption");
  if (!layer) return;
  toggleLayerVisibility(layer.id);
}

function aboutPhotocraft(): void {
  setStatus("Photocraft 2.1 — Affinity Photo-style mock built with LiteGUI components", 5000);
}

function buildMenus(): MenuSpec[] {
  return [
    {
      label: "File",
      items: () => [
        { label: "New…", shortcut: "Ctrl N", action: () => setStatus("New document created (mock)") },
        { label: "Open…", shortcut: "Ctrl O", action: () => setStatus("Open File dialog is not implemented in this mock") },
        { label: "Open Recent", action: () => setStatus("No recent documents") },
        { label: "Place…", action: () => setStatus("Place image is not available in this mock") },
        { separator: true },
        { label: "Save", shortcut: "Ctrl S", action: () => setStatus("great-wave.jpg saved (mock)") },
        { label: "Save As…", shortcut: "Shift Ctrl S", action: () => setStatus("Save As is not implemented in this mock") },
        { label: "Export…", shortcut: "Ctrl Alt S", action: () => setStatus("Export Persona is not available in this mock") },
        { separator: true },
        { label: "Document Setup…", action: () => setStatus(`Document Setup — ${ART_WIDTH} × ${ART_HEIGHT} px · 300 dpi · sRGB`) },
        { label: "Print…", shortcut: "Ctrl P", action: () => setStatus("Print is not available in this mock") },
        { separator: true },
        { label: "Close", shortcut: "Ctrl W", action: () => setStatus("great-wave.jpg stays open in this demo") },
      ],
    },
    {
      label: "Edit",
      items: () => [
        { label: "Undo", shortcut: "Ctrl Z", action: undo },
        { label: "Redo", shortcut: "Shift Ctrl Z", action: redo },
        { separator: true },
        { label: "Cut", shortcut: "Ctrl X", action: () => setStatus("Cut (mock)") },
        { label: "Copy", shortcut: "Ctrl C", action: () => setStatus("Copy (mock)") },
        { label: "Paste", shortcut: "Ctrl V", action: () => setStatus("Paste is not available in this mock") },
        { separator: true },
        { label: "Select All", shortcut: "Ctrl A", action: () => setStatus("Select All (mock)") },
        { label: "Deselect", shortcut: "Ctrl D", action: () => { canvasView.clearSelection(); setStatus("Deselected"); } },
        { separator: true },
        { label: "Preferences…", action: () => setStatus("Preferences is not implemented in this mock") },
      ],
    },
    {
      label: "Image",
      items: () => [
        { label: "Resize Document…", action: () => setStatus("Resize Document — locked in this mock") },
        { label: "Canvas Size…", action: () => setStatus("Canvas Size — locked in this mock") },
        { label: "Crop to Selection", action: () => setStatus("Crop to Selection (mock)") },
        { separator: true },
        { label: "Rotate 90° CW", action: () => rotateDocument(90) },
        { label: "Rotate 90° CCW", action: () => rotateDocument(-90) },
        { label: "Flip Horizontal", action: () => flipDocument() },
        { separator: true },
        { label: "Flatten Document", action: flattenDocument },
        { label: "Trim Transparent Edges", action: () => setStatus("Trim performed (mock)") },
      ],
    },
    {
      label: "Layer",
      items: () => [
        { label: "New Layer", shortcut: "Shift Ctrl N", action: addLayer },
        { label: "New Group", action: () => setStatus("New Group created (mock)") },
        { label: "Duplicate Layer", shortcut: "Ctrl J", action: duplicateLayer },
        { label: "Delete Layer", action: deleteLayer },
        { separator: true },
        { label: "Add Mask", action: () => setStatus("Layer mask added (mock)") },
        { label: "Merge Down", action: () => setStatus("Merge Down (mock)") },
        { label: "Merge Visible", shortcut: "Shift Ctrl E", action: () => setStatus("Merge Visible (mock)") },
        { separator: true },
        { label: "New Curves Adjustment", action: () => { switchInspectorTab("adjustments"); setStatus("Curves adjustment selected"); } },
      ],
    },
    {
      label: "Type",
      items: () => [
        { label: "Fonts…", action: () => setStatus("Typography is not implemented in this mock") },
        { label: "Insert Character", action: () => setStatus("Glyph browser is not implemented in this mock") },
        { label: "Insert Placeholder Text", action: () => setStatus("Placeholder text inserted (mock)") },
        { separator: true },
        { label: "Text Styles…", action: () => setStatus("Text Styles is not implemented in this mock") },
      ],
    },
    {
      label: "Select",
      items: () => [
        { label: "Select All", shortcut: "Ctrl A", action: () => setStatus("Select All (mock)") },
        { label: "Deselect", shortcut: "Ctrl D", action: () => { canvasView.clearSelection(); setStatus("Deselected"); } },
        { label: "Invert Selection", shortcut: "Shift Ctrl I", action: () => setStatus("Inverted selection (mock)") },
        { separator: true },
        { label: "Grow", action: () => setStatus("Grow selection (mock)") },
        { label: "Shrink", action: () => setStatus("Shrink selection (mock)") },
        { label: "Feather…", action: () => setStatus("Feather (mock)") },
        { separator: true },
        { label: "Refine Edges…", action: () => setStatus("Refine Edges is not implemented in this mock") },
      ],
    },
    {
      label: "Filter",
      items: () => [
        { label: "Gaussian Blur…", action: () => setStatus("Gaussian Blur is not applied in this mock") },
        { label: "Sharpen…", action: () => setStatus("Sharpen is not applied in this mock") },
        { label: "Add Noise…", action: () => setStatus("Noise filter is not applied in this mock") },
        { label: "Distort…", action: () => setStatus("Distort filter is not applied in this mock") },
        { separator: true },
        { label: "Liquify…", action: () => setStatus("Liquify Persona is not available in this mock") },
        { label: "Develop…", action: () => setStatus("Develop Persona is not available in this mock") },
      ],
    },
    {
      label: "View",
      items: () => [
        { label: "Fit to Window", shortcut: "Ctrl 0", action: viewFit },
        { label: "Actual Size (100%)", shortcut: "Ctrl 1", action: viewActual },
        { label: "Zoom In", shortcut: "Ctrl +", action: () => { canvasView.zoomIn(); setStatus("Zoom in"); } },
        { label: "Zoom Out", shortcut: "Ctrl -", action: () => { canvasView.zoomOut(); setStatus("Zoom out"); } },
        { separator: true },
        { label: "Show Rulers", checked: showRulers, action: () => { showRulers = !showRulers; setStatus(showRulers ? "Rulers shown" : "Rulers hidden"); } },
        { label: "Show Caption", checked: findLayer("caption")?.visible ?? false, action: toggleCaptionLayer },
        { separator: true },
        { label: "Enter Full Screen", action: () => setStatus("Full screen is not available in this mock") },
      ],
    },
    {
      label: "Window",
      items: () => [
        { label: "Toggle Tools", shortcut: "Tab", action: toggleTools },
        { label: "Toggle Inspector", shortcut: "Ctrl Tab", action: toggleInspector },
        { label: "Reset Panels", action: () => { q<HTMLElement>(".pc-app").classList.remove("tools-hidden", "inspector-hidden"); setStatus("Panels reset"); } },
        { separator: true },
        { label: "Adjustments", checked: inspectorTab === "adjustments", action: () => switchInspectorTab("adjustments") },
        { label: "Properties", checked: inspectorTab === "properties", action: () => switchInspectorTab("properties") },
        { separator: true },
        { label: "Layers", checked: layerTab === "layers", action: () => switchLayerTab("layers") },
        { label: "Channels", checked: layerTab === "channels", action: () => switchLayerTab("channels") },
        { label: "Paths", checked: layerTab === "paths", action: () => switchLayerTab("paths") },
      ],
    },
    {
      label: "Help",
      items: () => [
        { label: "Help Topics", action: () => setStatus("Help topics are not implemented in this mock") },
        { label: "Keyboard Shortcuts", action: () => setStatus("Tools: V M L W C I B E S J G T U Z H · Ctrl 0 fit · Space pan") },
        { label: "Report an Issue", action: () => setStatus("Report an Issue (mock)") },
        { separator: true },
        { label: "About Photocraft", action: aboutPhotocraft },
      ],
    },
  ];
}

function renderMenubar(): void {
  menubarEl.innerHTML = "";
  for (const spec of buildMenus()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pc-menu-btn";
    button.textContent = spec.label;
    button.addEventListener("click", () => openMenuFrom(button, spec.items()));
    menubarEl.appendChild(button);
  }
}

/* --------------------------------------------------------------- chrome events */

renderTools();
renderMenubar();
renderInspector();
renderLayerPanel();
syncCaptionVisibility();
setStatus(defaultHint());

for (const tab of document.querySelectorAll<HTMLElement>(".pc-insp-tab")) {
  tab.addEventListener("click", () => switchInspectorTab(tab.dataset.tab === "properties" ? "properties" : "adjustments"));
}

for (const tab of document.querySelectorAll<HTMLElement>(".pc-panel-tab")) {
  tab.addEventListener("click", () => {
    const value = tab.dataset.ptab;
    switchLayerTab(value === "channels" ? "channels" : value === "paths" ? "paths" : "layers");
  });
}

for (const button of document.querySelectorAll<HTMLElement>("[data-layer-action]")) {
  button.addEventListener("click", () => {
    const action = button.dataset.layerAction;
    if (action === "add") addLayer();
    else if (action === "group") setStatus("New Group created (mock)");
    else if (action === "mask") setStatus("Layer mask added (mock)");
    else if (action === "adjustment") {
      switchInspectorTab("adjustments");
      setStatus("New Curves adjustment selected");
    } else if (action === "delete") deleteLayer();
  });
}

q<HTMLElement>("#zoom-in").addEventListener("click", () => { canvasView.zoomIn(); setStatus("Zoom in"); });
q<HTMLElement>("#zoom-out").addEventListener("click", () => { canvasView.zoomOut(); setStatus("Zoom out"); });
q<HTMLElement>("#zoom-fit").addEventListener("click", viewFit);
q<HTMLElement>("#zoom-tab").addEventListener("click", viewActual);
q<HTMLElement>("#doc-close").addEventListener("click", () => setStatus("great-wave.jpg stays open in this demo"));
q<HTMLElement>("#tab-add").addEventListener("click", () => setStatus("New document created (mock)"));
q<HTMLElement>("#help-btn").addEventListener("click", aboutPhotocraft);

const personaButton = q<HTMLElement>("#persona-btn");
personaButton.addEventListener("click", () => {
  const personas = ["Essentials", "Photo Persona", "Develop Persona", "Tone Mapping", "Liquify", "Export"];
  openMenuFrom(personaButton, personas.map((name) => ({
    label: name,
    checked: name === persona,
    action: () => {
      persona = name;
      const label = personaButton.querySelector<HTMLElement>(".pc-persona-name");
      if (label) label.textContent = name;
      setStatus(`Persona: ${name}`);
    },
  })));
});

q<HTMLElement>("#insp-menu").addEventListener("click", (event) => {
  const anchor = event.currentTarget as HTMLElement;
  openMenuFrom(anchor, [
    { label: "Expand All", action: () => setStatus("Panels expanded") },
    { label: "Collapse All", action: () => setStatus("Panels collapsed") },
    { separator: true },
    { label: "Reset Studio", action: () => setStatus("Studio layout reset") },
  ]);
});

q<HTMLElement>("#layers-menu").addEventListener("click", (event) => {
  const anchor = event.currentTarget as HTMLElement;
  openMenuFrom(anchor, [
    { label: "New Layer", action: addLayer },
    { label: "Duplicate Layer", action: duplicateLayer },
    { label: "Delete Layer", action: deleteLayer },
    { separator: true },
    { label: "Merge Visible", action: () => setStatus("Merge Visible (mock)") },
  ]);
});

/* --------------------------------------------------------------- keyboard */

const TOOL_KEYS = new Map(TOOLS.map((tool) => [tool.key.toLowerCase(), tool.id]));

window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement | null;
  if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) return;

  if (event.code === "Space") {
    spaceDown = true;
    canvasView.setTool(activeTool);
    event.preventDefault();
    return;
  }
  if (event.ctrlKey || event.metaKey) {
    if (event.key === "0") { viewFit(); event.preventDefault(); }
    else if (event.key === "1") { viewActual(); event.preventDefault(); }
    else if (event.key === "z") { if (event.shiftKey) redo(); else undo(); event.preventDefault(); }
    else if (event.key === "j") { duplicateLayer(); event.preventDefault(); }
    else return;
    return;
  }
  if (event.key === "Escape") {
    closePopup();
    canvasView.clearSelection();
    hideTooltip();
    setStatus(defaultHint());
    return;
  }
  if (event.key === "+" || event.key === "=") { canvasView.zoomIn(); setStatus("Zoom in"); return; }
  if (event.key === "-" || event.key === "_") { canvasView.zoomOut(); setStatus("Zoom out"); return; }
  if (event.key === "Delete" || event.key === "Backspace") { deleteLayer(); event.preventDefault(); return; }

  const toolId = TOOL_KEYS.get(event.key.toLowerCase());
  if (toolId) {
    selectTool(toolId);
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    spaceDown = false;
    canvasView.setTool(activeTool);
  }
});

window.addEventListener("blur", () => {
  spaceDown = false;
});

window.addEventListener("resize", () => {
  const caption = document.querySelector<HTMLElement>("#artwork-caption");
  if (caption) caption.style.display = "";
});
