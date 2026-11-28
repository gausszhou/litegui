/**
 * CADCraft — a CAD-style 2D drafting demo for LiteGUI.
 *
 * The shell mirrors a familiar drafting application: quick access toolbar,
 * file tabs, menu bar, tool sets, model/paper space canvas, Layers and
 * Properties palettes, command line, layout tabs and a drafting status bar.
 */

import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { Console, ContextMenu, Dialog, StatusBar, Tabs } from "@gausszhou/litegui-components";

import { CommandEngine, type CommandHost, type LogKind } from "./commands";
import { downloadDxf, exportCanvasPng } from "./files";
import { icon } from "./icons";
import {
  distance,
  type DrawingDoc,
  type Entity,
  type Layer,
  type Point,
} from "./model";
import {
  dimMeasurement,
  formattedMeasurement,
  lineAngleDeg,
  pickAll,
  pickEntity,
  polylineLength,
} from "./picking";
import { CadRenderer } from "./renderer";
import { BLOCKS, createSampleDrawing } from "./sample";

/* ------------------------------------------------------------------ types */

interface AppState {
  grid: boolean;
  snap: boolean;
  ortho: boolean;
  polar: boolean;
  osnap: boolean;
  otrack: boolean;
  dyn: boolean;
  lwt: boolean;
  gridSize: number;
  currentLayer: string;
  propsTab: "all" | "my";
  space: "MODEL" | "PAPER";
  paletteTab: "drafting" | "modeling";
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

interface ToolDef {
  command?: string;
  icon: string;
  title: string;
  key?: string;
  disabled?: boolean;
}

interface ToolGroup {
  id: string;
  title: string;
  tools: ToolDef[];
}

interface CadcraftDebug {
  doc: () => DrawingDoc;
  engine: CommandEngine;
  renderer: CadRenderer;
  state: AppState;
  entityCount: () => number;
  selectionCount: () => number;
  layout: () => string;
  pickAt: (x: number, y: number) => { id: string; kind: string; layer: string; block?: string } | null;
}

declare global {
  interface Window {
    __CADCRAFT__?: CadcraftDebug;
  }
}

/* ---------------------------------------------------------------- template */

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("#app missing");
app.innerHTML = `<div class="cad-app" id="cad-app">
  <header class="cad-titlebar">
    <div class="cad-titlebar__quick">
      <button class="cad-quick-btn" data-action="new" title="New drawing (Ctrl+N)">${icon("new", 15)}</button>
      <button class="cad-quick-btn" data-action="open" title="Open drawing (Ctrl+O)">${icon("open", 15)}</button>
      <button class="cad-quick-btn" data-action="save" title="Save as DXF (Ctrl+S)">${icon("save", 15)}</button>
      <span class="cad-quick-sep"></span>
      <button class="cad-quick-btn" data-action="undo" title="Undo (Ctrl+Z)">${icon("undo", 15)}</button>
      <button class="cad-quick-btn" data-action="redo" title="Redo (Ctrl+Y)">${icon("redo", 15)}</button>
      <span class="cad-quick-sep"></span>
      <button class="cad-quick-btn" data-action="plot" title="Plot / export">${icon("plot", 15)}</button>
      <button class="cad-quick-btn" data-action="layers" title="Layer Properties Manager">${icon("layerManager", 15)}</button>
      <button class="cad-quick-btn" data-action="props" title="Show Properties">${icon("properties", 15)}</button>
    </div>
    <div class="cad-titlebar__title">
      <span class="cad-logo">${icon("logo", 16)}</span>
      <span class="cad-brand">CADCraft</span>
      <span class="cad-title-sep">·</span>
      <span class="cad-doc-name" id="doc-name">apartment.dxf</span>
      <span class="cad-dirty" id="dirty-dot" hidden>●</span>
    </div>
    <div class="cad-titlebar__right">
      <span class="cad-version">v0.20 · LiteGUI</span>
      <button class="cad-quick-btn" data-action="about" title="About CADCraft">${icon("help", 15)}</button>
    </div>
  </header>

  <div class="cad-filebar">
    <button class="cad-quick-btn cad-filebar__menu" id="toggle-tools" title="Toggle tool sets">${icon("menu", 15)}</button>
    <div class="cad-filetabs">
      <button class="cad-filetab cad-filetab--start" data-action="new">${icon("plus", 12)}<span>Start</span></button>
      <div class="cad-filetab cad-filetab--active" id="drawing-tab">
        <span id="filetab-name">apartment.dxf</span>
        <button class="cad-filetab__close" title="Close drawing">×</button>
      </div>
    </div>
    <div class="cad-filebar__right">
      <button class="cad-workspace-btn" id="workspace-btn">${icon("expand", 13)}<span>Drafting &amp; Annotation</span>${icon("chevronDown", 11)}</button>
    </div>
  </div>

  <nav class="cad-menubar" id="menubar" aria-label="Main menu"></nav>

  <div class="cad-workspace" id="workspace">
    <aside class="cad-toolpalette" id="tool-palette" aria-label="Tool sets">
      <div class="cad-tooltabs">
        <button class="is-active" data-palette-tab="drafting">Drafting</button>
        <button data-palette-tab="modeling">Modeling</button>
        <button class="cad-tooltabs__chev" title="Tool set options">${icon("chevronDown", 11)}</button>
      </div>
      <div class="cad-toolscroll" id="tool-groups"></div>
      <div class="cad-toolpalette__foot">${icon("lock", 12)}<span>Tool Sets</span>${icon("plus", 12)}</div>
    </aside>

    <main class="cad-drawing">
      <div class="cad-viewbar">
        <button class="cad-viewbtn cad-viewbtn--icon" id="view-add" title="New viewport">${icon("plus", 12)}</button>
        <span class="cad-viewbar__sep"></span>
        <button class="cad-viewbtn" id="view-orient">Top ${icon("chevronDown", 11)}</button>
        <span class="cad-viewbar__sep"></span>
        <button class="cad-viewbtn" id="view-style">2D Wireframe ${icon("chevronDown", 11)}</button>
        <span class="cad-viewbar__sep"></span>
        <button class="cad-viewbtn cad-viewbtn--icon" id="view-osnap" title="Object snap (F3)">${icon("osnap", 13)}</button>
        <span class="cad-viewbar__spacer"></span>
        <span class="cad-viewbadge" id="view-badge">MODEL</span>
        <button class="cad-viewbtn cad-viewbtn--icon" id="toggle-grid-btn" title="Grid display (F7)">${icon("grid", 13)}</button>
      </div>
      <div class="cad-canvas-wrap" id="canvas-wrap">
        <canvas id="cad-canvas" tabindex="0" aria-label="CAD drawing canvas"></canvas>
      </div>
    </main>

    <aside class="cad-palettes" id="palettes" aria-label="Palettes">
      <div class="cad-palette-icons">
        <button class="is-active" data-palette-icon="layers" title="Layers">${icon("layers", 16)}</button>
        <button data-palette-icon="properties" title="Properties">${icon("properties", 16)}</button>
        <button data-palette-icon="states" title="Layer states">${icon("saveState", 16)}</button>
        <span class="spacer"></span>
        <button data-palette-icon="settings" title="Palette settings">${icon("settings", 15)}</button>
      </div>

      <section class="cad-palette" id="layers-palette">
        <header class="cad-palette__head">
          <button class="cad-palette__grip" title="Collapse palette">${icon("chevronDown", 12)}</button>
          <span class="cad-palette__title">Layers</span>
          <span class="spacer"></span>
          <button class="cad-palette__more" id="layers-settings" title="Layer Properties Manager">${icon("settings", 13)}</button>
        </header>
        <div class="cad-palette__body">
          <div class="cad-layer-toolbar">
            <button data-layer-action="new" title="New layer">${icon("plus", 14)}</button>
            <button data-layer-action="delete" title="Delete current layer">${icon("erase", 14)}</button>
            <button data-layer-action="manager" title="Layer Properties Manager">${icon("layerManager", 14)}</button>
            <span class="spacer"></span>
            <button data-layer-action="all-on" title="Turn all layers on">${icon("eye", 14)}</button>
            <button data-layer-action="all-thaw" title="Thaw all layers">${icon("sun", 14)}</button>
            <button data-layer-action="all-unlock" title="Unlock all layers">${icon("unlock", 14)}</button>
          </div>
          <select class="cad-layer-select" id="layer-select" title="Current layer" aria-label="Current layer"></select>
          <div class="cad-layer-state"><span class="cad-dot"></span>Unsaved Layer State</div>
          <div class="cad-layer-list" id="layer-list"></div>
          <button class="cad-link" id="show-layer-list">Show Layer List</button>
        </div>
      </section>

      <section class="cad-palette" id="properties-palette">
        <header class="cad-palette__head">
          <button class="cad-palette__grip" title="Collapse palette">${icon("chevronDown", 12)}</button>
          <span class="cad-palette__title">Properties</span>
          <span class="spacer"></span>
          <button class="cad-palette__more" title="Properties settings">${icon("settings", 13)}</button>
        </header>
        <div class="cad-palette__body">
          <div class="cad-props-tabs"><button class="is-active" data-props-tab="all">All</button><button data-props-tab="my">My</button></div>
          <div class="cad-props-title" id="props-title">No selection</div>
          <div class="cad-props" id="props-body"></div>
        </div>
      </section>
    </aside>
  </div>

  <div class="cad-cmdbar">
    <div class="cad-cmdbar__host" id="console-host"></div>
  </div>

  <div class="cad-footer">
    <div class="cad-layouttabs" id="layout-tabs-host"></div>
    <div class="cad-status-host" id="status-host"></div>
  </div>
</div>`;

/* ------------------------------------------------------------------ state */

const state: AppState = {
  grid: true,
  snap: false,
  ortho: false,
  polar: true,
  osnap: true,
  otrack: false,
  dyn: true,
  lwt: false,
  gridSize: 250,
  currentLayer: "0",
  propsTab: "all",
  space: "MODEL",
  paletteTab: "drafting",
};

let doc: DrawingDoc = createSampleDrawing();

const appEl = q<HTMLElement>("#cad-app");
const canvas = q<HTMLCanvasElement>("#cad-canvas");
const canvasWrap = q<HTMLElement>("#canvas-wrap");
const menubar = q<HTMLElement>("#menubar");
const toolGroupsHost = q<HTMLElement>("#tool-groups");
const layerList = q<HTMLElement>("#layer-list");
const layerSelect = q<HTMLSelectElement>("#layer-select");
const propsBody = q<HTMLElement>("#props-body");
const propsTitle = q<HTMLElement>("#props-title");
const docName = q<HTMLElement>("#doc-name");
const filetabName = q<HTMLElement>("#filetab-name");
const dirtyDot = q<HTMLElement>("#dirty-dot");
const viewBadge = q<HTMLElement>("#view-badge");
const palettes = q<HTMLElement>("#palettes");

const renderer = new CadRenderer(canvas, doc);
renderer.setSettings({ showGrid: state.grid, showDyn: state.dyn, showLineweight: state.lwt });

/* --------------------------------------------------------------- console */

const commandConsole = new Console({ prompt: " " });
q<HTMLElement>("#console-host").appendChild(commandConsole.root);
(commandConsole as unknown as { _prompt: string })._prompt = "";
commandConsole.$input.id = "command-input";
commandConsole.$input.classList.add("cad-cmd-input");
commandConsole.$input.placeholder = "Type a command";
commandConsole.$input.spellcheck = false;

const promptLabel = document.createElement("span");
promptLabel.className = "cad-cmd-prompt";
promptLabel.textContent = "Command:";
commandConsole.$footer.insertBefore(promptLabel, commandConsole.$input);

const historyButton = document.createElement("button");
historyButton.type = "button";
historyButton.className = "cad-cmd-history";
historyButton.title = "Recent commands";
historyButton.innerHTML = icon("chevronDown", 12);
commandConsole.$footer.appendChild(historyButton);

/* ------------------------------------------------------------ status bar */

const statusBar = new StatusBar({ className: "cad-status" });
q<HTMLElement>("#status-host").appendChild(statusBar.root);
const coordsEl = document.createElement("span");
coordsEl.className = "cad-status-coords";
coordsEl.textContent = "0.0000, 0.0000, 0.0000";
const hintEl = document.createElement("span");
hintEl.className = "cad-status-hint";
hintEl.id = "status-hint";
hintEl.textContent = "Ready";
statusBar.leftElement.append(coordsEl, hintEl);

interface ToggleDef {
  id: "grid" | "snap" | "ortho" | "polar" | "osnap" | "otrack" | "dyn" | "lwt";
  label: string;
  icon: string;
  key: string;
}

const TOGGLES: ToggleDef[] = [
  { id: "grid", label: "Grid", icon: "grid", key: "F7" },
  { id: "snap", label: "Snap", icon: "snap", key: "F9" },
  { id: "ortho", label: "Ortho", icon: "ortho", key: "F8" },
  { id: "polar", label: "Polar", icon: "polar", key: "F10" },
  { id: "osnap", label: "Object Snap", icon: "osnap", key: "F3" },
  { id: "otrack", label: "Object Snap Tracking", icon: "otrack", key: "F11" },
  { id: "dyn", label: "Dynamic Input", icon: "dyn", key: "F12" },
  { id: "lwt", label: "Lineweight", icon: "lwt", key: "LWT" },
];

const toggleButtons = new Map<string, HTMLButtonElement>();
for (const toggle of TOGGLES) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cad-status-toggle";
  button.dataset.toggle = toggle.id;
  button.title = `${toggle.label} (${toggle.key})`;
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `${icon(toggle.icon, 14)}<span class="cad-sr">${toggle.label}</span>`;
  button.addEventListener("click", () => toggleSetting(toggle.id));
  statusBar.rightElement.appendChild(button);
  toggleButtons.set(toggle.id, button);
}

const modeButton = document.createElement("button");
modeButton.type = "button";
modeButton.className = "cad-status-mode";
modeButton.textContent = "MODEL";
modeButton.title = "Switch between model and paper space";
modeButton.addEventListener("click", () => {
  if (state.space === "MODEL") setSpace("layout", 0);
  else setSpace("model");
});
statusBar.rightElement.appendChild(modeButton);

const zoomEl = document.createElement("span");
zoomEl.className = "cad-status-zoom";
zoomEl.textContent = "100%";
statusBar.rightElement.appendChild(zoomEl);

/* ---------------------------------------------------------------- engine */

const engine = new CommandEngine({
  doc: () => doc,
  renderer: () => renderer,
  settings: () => ({
    ortho: state.ortho,
    polar: state.polar,
    osnap: state.osnap,
    gridSnap: state.snap,
    gridSize: state.gridSize,
  }),
  activeLayer: () => state.currentLayer,
  log,
  setPrompt: prompt => {
    promptLabel.textContent = prompt;
  },
  onChange: () => onChange(),
  onSelectionChange: () => renderProperties(),
  onCommandChange: () => refreshToolState(),
  openDialog: name => {
    if (name === "layers") openLayerManager();
    else if (name === "plot") openPlotDialog();
    else openAboutDialog();
  },
  downloadDxf: () => saveDrawing(),
  toast: text => toast(text),
} satisfies CommandHost);

/* ------------------------------------------------------------- utilities */

function q<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

function esc(value: unknown): string {
  return String(value).replace(/[&<>"']/g, character => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function fmt(value: number, decimals = 0): string {
  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

let hintTimer = 0;
function setHint(text: string, timeout = 0): void {
  hintEl.textContent = text;
  if (hintTimer) window.clearTimeout(hintTimer);
  if (timeout > 0) {
    hintTimer = window.setTimeout(() => {
      hintEl.textContent = "Ready · Wheel to zoom · Middle-drag to pan · F1 Help";
    }, timeout);
  }
}

function toast(text: string): void {
  setHint(text, 3200);
}

function log(kind: LogKind, text: string): void {
  commandConsole.addMessage(text, kind, true);
  if (kind !== "command") setHint(text, 5000);
}

function markDirty(): void {
  dirtyDot.hidden = false;
}

let statusTimer = 0;
function onChange(): void {
  renderer.requestRender();
  renderLayerList();
  renderProperties();
  updateStatusBar();
  markDirty();
  if (statusTimer) window.clearTimeout(statusTimer);
}

function updateStatusBar(): void {
  for (const [id, button] of toggleButtons) {
    const active = Boolean(state[id as keyof AppState]);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  modeButton.textContent = state.space;
  modeButton.classList.toggle("is-paper", state.space === "PAPER");
  zoomEl.textContent = renderer.mode === "model" ? `${Math.round(renderer.view.scale * 100)}%` : "1:1";
  viewBadge.textContent = state.space;
  viewBadge.classList.toggle("is-paper", state.space === "PAPER");
  appEl.querySelectorAll<HTMLButtonElement>('[data-action="undo"]').forEach(button => {
    button.disabled = !engine.history.canUndo;
  });
  appEl.querySelectorAll<HTMLButtonElement>('[data-action="redo"]').forEach(button => {
    button.disabled = !engine.history.canRedo;
  });
}

function updateDocLabels(): void {
  docName.textContent = doc.name;
  filetabName.textContent = doc.name;
  dirtyDot.hidden = true;
}

/* --------------------------------------------------------- tool palettes */

const DRAW_TOOLS: ToolGroup[] = [
  {
    id: "draw",
    title: "Draw",
    tools: [
      { command: "line", icon: "line", title: "Line", key: "L" },
      { command: "polyline", icon: "polyline", title: "Polyline", key: "PL" },
      { command: "circle", icon: "circle", title: "Circle", key: "C" },
      { command: "arc", icon: "arc", title: "Arc", key: "A" },
      { command: "rectangle", icon: "rect", title: "Rectangle", key: "REC" },
      { command: "polygon", icon: "polygon", title: "Polygon", key: "POL" },
      { command: "ellipse", icon: "ellipse", title: "Ellipse", key: "EL" },
      { command: "point", icon: "point", title: "Point", key: "PO" },
    ],
  },
  {
    id: "hatch",
    title: "Hatch",
    tools: [
      { command: "hatch", icon: "hatch", title: "Hatch pattern", key: "H" },
      { icon: "gradient", title: "Gradient hatch — not in this demo", disabled: true },
      { icon: "hatch", title: "Solid fill — not in this demo", disabled: true },
    ],
  },
  {
    id: "block",
    title: "Block",
    tools: [
      { command: "insert", icon: "blockInsert", title: "Insert block", key: "I" },
      { icon: "blockCreate", title: "Create block — not in this demo", disabled: true },
      { icon: "blockWrite", title: "Write block — not in this demo", disabled: true },
    ],
  },
  {
    id: "modify",
    title: "Modify",
    tools: [
      { command: "move", icon: "move", title: "Move", key: "M" },
      { command: "copy", icon: "copy", title: "Copy", key: "CO" },
      { command: "rotate", icon: "rotate", title: "Rotate", key: "RO" },
      { command: "scale", icon: "scale", title: "Scale", key: "SC" },
      { command: "mirror", icon: "mirror", title: "Mirror", key: "MI" },
      { command: "offset", icon: "offset", title: "Offset", key: "O" },
      { command: "erase", icon: "erase", title: "Erase", key: "E" },
      { icon: "trim", title: "Trim — not in this demo", disabled: true },
      { icon: "extend", title: "Extend — not in this demo", disabled: true },
      { icon: "fillet", title: "Fillet — not in this demo", disabled: true },
      { icon: "array", title: "Rectangular array — not in this demo", disabled: true },
    ],
  },
  {
    id: "text",
    title: "Text",
    tools: [
      { command: "text", icon: "text", title: "Single line text", key: "T" },
      { icon: "mtext", title: "Multiline text — not in this demo", disabled: true },
      { icon: "textStyle", title: "Text style — not in this demo", disabled: true },
    ],
  },
  {
    id: "dimension",
    title: "Dimension",
    tools: [
      { command: "dimlinear", icon: "dimLinear", title: "Linear dimension", key: "DLI" },
      { command: "dimaligned", icon: "dimAligned", title: "Aligned dimension", key: "DAL" },
      { command: "dimradius", icon: "dimRadius", title: "Radius dimension", key: "DRA" },
      { icon: "dimAngular", title: "Angular dimension — not in this demo", disabled: true },
      { icon: "dimDiameter", title: "Diameter dimension — not in this demo", disabled: true },
    ],
  },
  {
    id: "leader",
    title: "Leader",
    tools: [
      { command: "leader", icon: "leader", title: "Leader", key: "LE" },
      { icon: "multileader", title: "Multileader — not in this demo", disabled: true },
    ],
  },
  {
    id: "table",
    title: "Table",
    tools: [{ icon: "table", title: "Table — not in this demo", disabled: true }],
  },
  {
    id: "parametric",
    title: "Parametric",
    tools: [
      { icon: "parametric", title: "Geometric constraints — not in this demo", disabled: true },
      { icon: "constraint", title: "Dimensional constraints — not in this demo", disabled: true },
    ],
  },
];

const MODELING_TOOLS: ToolGroup[] = [
  {
    id: "solid",
    title: "Solid",
    tools: [
      { icon: "blockCreate", title: "Box — not in this demo", disabled: true },
      { icon: "circle", title: "Cylinder — not in this demo", disabled: true },
      { icon: "polygon", title: "Extrude — not in this demo", disabled: true },
    ],
  },
  {
    id: "surface",
    title: "Surface",
    tools: [
      { icon: "offset", title: "Loft — not in this demo", disabled: true },
      { icon: "gradient", title: "Revolve — not in this demo", disabled: true },
    ],
  },
  {
    id: "mesh",
    title: "Mesh",
    tools: [{ icon: "grid", title: "Mesh primitives — not in this demo", disabled: true }],
  },
];

const collapsedGroups = new Set<string>();

function blockChips(): string {
  const names = ["SOFA", "TABLE", "CHAIR", "BED", "BATHTUB", "WINDOW1800", "DOOR900", "PLANT"];
  return `<div class="cad-blockchips">${names
    .map(name => {
      const block = BLOCKS.find(item => item.name === name);
      return `<button class="cad-blockchip" data-block="${name}" title="${esc(block?.description ?? name)}">${icon(
        "blockInsert",
        13
      )}<span>${name}</span></button>`;
    })
    .join("")}</div>`;
}

function renderToolGroups(): void {
  const groups = state.paletteTab === "drafting" ? DRAW_TOOLS : MODELING_TOOLS;
  toolGroupsHost.innerHTML = groups
    .map(group => {
      const collapsed = collapsedGroups.has(group.id);
      return `<section class="cad-toolgroup${collapsed ? " is-collapsed" : ""}" data-group="${group.id}">
        <header class="cad-toolgroup__head">
          <button class="cad-toolgroup__toggle" data-group-toggle="${group.id}" title="Collapse group">${icon(
            "chevronDown",
            11
          )}</button>
          <span>${group.title}</span>
          <span class="spacer"></span>
          <button class="cad-toolgroup__pin" title="Pin group">${icon("lock", 11)}</button>
        </header>
        <div class="cad-toolgroup__grid">
          ${group.tools
            .map(
              tool =>
                `<button class="cad-tool${tool.disabled ? " is-disabled" : ""}" ${
                  tool.command ? `data-command="${tool.command}"` : ""
                } ${tool.disabled ? 'disabled aria-disabled="true"' : ""} title="${esc(tool.title)}${
                  tool.key ? ` (${tool.key})` : ""
                }">${icon(tool.icon, 19)}</button>`
            )
            .join("")}
        </div>
        ${group.id === "block" ? blockChips() : ""}
      </section>`;
    })
    .join("");
  refreshToolState();
}

function refreshToolState(): void {
  const active = engine.activeCommandId;
  toolGroupsHost.querySelectorAll<HTMLElement>(".cad-tool").forEach(button => {
    button.classList.toggle("is-active", Boolean(active) && button.dataset.command === active);
  });
  toolGroupsHost.querySelectorAll<HTMLElement>(".cad-blockchip").forEach(button => {
    button.classList.toggle(
      "is-active",
      active === "insert" && Boolean(engine.blockToInsert) && button.dataset.block === engine.blockToInsert
    );
  });
  appEl.querySelectorAll<HTMLElement>("[data-command]").forEach(button => {
    button.classList.toggle("is-active", Boolean(active) && button.dataset.command === active);
  });
  canvas.classList.toggle("is-drafting", Boolean(active));
}

/* ---------------------------------------------------------------- layers */

function renderLayerSelect(): void {
  if (!doc.layer(state.currentLayer)) state.currentLayer = doc.layers[0]?.id ?? "0";
  layerSelect.innerHTML = doc.layers
    .map(
      layer =>
        `<option value="${layer.id}"${layer.id === state.currentLayer ? " selected" : ""}>${esc(layer.name)}${
          layer.visible ? "" : " · off"
        }</option>`
    )
    .join("");
}

function renderLayerList(): void {
  layerList.innerHTML = doc.layers
    .map(
      layer => `<div class="cad-layer-row${layer.id === state.currentLayer ? " is-current" : ""}${
        layer.visible ? "" : " is-off"
      }${layer.frozen ? " is-frozen" : ""}" data-layer="${layer.id}" title="${esc(layer.name)}">
        <button class="cad-layer-btn" data-layer-act="visible" title="${layer.visible ? "Turn layer off" : "Turn layer on"}">${icon(
          layer.visible ? "eye" : "eyeOff",
          13
        )}</button>
        <button class="cad-layer-btn" data-layer-act="freeze" title="${layer.frozen ? "Thaw layer" : "Freeze layer"}">${icon(
          layer.frozen ? "snowflake" : "sun",
          13
        )}</button>
        <button class="cad-layer-btn" data-layer-act="lock" title="${layer.locked ? "Unlock layer" : "Lock layer"}">${icon(
          layer.locked ? "lock" : "unlock",
          13
        )}</button>
        <span class="cad-layer-swatch" style="background:${layer.color}"></span>
        <span class="cad-layer-name">${esc(layer.name)}</span>
        <span class="cad-layer-lw">${layer.lineweight.toFixed(2)}</span>
      </div>`
    )
    .join("");
}

function setCurrentLayer(id: string): void {
  const layer = doc.layer(id);
  if (!layer) return;
  state.currentLayer = id;
  renderLayerSelect();
  renderLayerList();
  log("info", `Current layer: ${layer.name}`);
}

function toggleLayerFlag(id: string, flag: "visible" | "freeze" | "lock"): void {
  const layer = doc.layer(id);
  if (!layer) return;
  if (flag === "visible") layer.visible = !layer.visible;
  else if (flag === "freeze") layer.frozen = !layer.frozen;
  else layer.locked = !layer.locked;
  const status =
    flag === "visible"
      ? layer.visible
        ? "turned on"
        : "turned off"
      : flag === "freeze"
        ? layer.frozen
          ? "frozen"
          : "thawed"
        : layer.locked
          ? "locked"
          : "unlocked";
  onChange();
  log("info", `${layer.name} ${status}.`);
}

function createLayer(): Layer {
  let index = doc.layers.length;
  let name = `A-LAYER-${index}`;
  while (doc.layerByName(name)) {
    index += 1;
    name = `A-LAYER-${index}`;
  }
  const layer: Layer = {
    id: `layer-${Date.now().toString(36)}`,
    name,
    color: "#7fd1ae",
    visible: true,
    frozen: false,
    locked: false,
    lineweight: 0.25,
    linetype: "continuous",
    plot: true,
  };
  doc.layers.push(layer);
  state.currentLayer = layer.id;
  renderLayerSelect();
  renderLayerList();
  onChange();
  log("info", `Layer ${layer.name} created.`);
  return layer;
}

function deleteCurrentLayer(): void {
  const layer = doc.layer(state.currentLayer);
  if (!layer) return;
  if (layer.id === "0") {
    toast("Layer 0 cannot be deleted.");
    return;
  }
  const movable = doc.entities.filter(entity => entity.layer === layer.id);
  for (const entity of movable) entity.layer = "0";
  doc.layers = doc.layers.filter(item => item.id !== layer.id);
  state.currentLayer = "0";
  renderLayerSelect();
  renderLayerList();
  onChange();
  log("info", `Layer ${layer.name} deleted${movable.length ? `; ${movable.length} object(s) moved to layer 0` : ""}.`);
}

layerSelect.addEventListener("change", () => setCurrentLayer(layerSelect.value));

layerList.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const row = target.closest<HTMLElement>(".cad-layer-row");
  if (!row) return;
  const id = row.dataset.layer;
  if (!id) return;
  const action = target.closest<HTMLElement>("[data-layer-act]")?.dataset.layerAct;
  if (action === "visible" || action === "freeze" || action === "lock") {
    toggleLayerFlag(id, action);
    return;
  }
  setCurrentLayer(id);
});

appEl.querySelector(".cad-layer-toolbar")?.addEventListener("click", event => {
  const action = (event.target as HTMLElement).closest<HTMLElement>("[data-layer-action]")?.dataset.layerAction;
  if (!action) return;
  if (action === "new") createLayer();
  else if (action === "delete") deleteCurrentLayer();
  else if (action === "manager") openLayerManager();
  else if (action === "all-on") {
    doc.layers.forEach(layer => (layer.visible = true));
    onChange();
    log("info", "All layers turned on.");
  } else if (action === "all-thaw") {
    doc.layers.forEach(layer => (layer.frozen = false));
    onChange();
    log("info", "All layers thawed.");
  } else if (action === "all-unlock") {
    doc.layers.forEach(layer => (layer.locked = false));
    onChange();
    log("info", "All layers unlocked.");
  }
});

q<HTMLElement>("#show-layer-list").addEventListener("click", () => openLayerManager());
q<HTMLElement>("#layers-settings").addEventListener("click", () => openLayerManager());

/* ------------------------------------------------------------ properties */

const CAD_COLORS: Array<{ name: string; value: string }> = [
  { name: "ByLayer", value: "" },
  { name: "White", value: "#e4e9f0" },
  { name: "Red", value: "#ff6b6b" },
  { name: "Yellow", value: "#ffd24d" },
  { name: "Green", value: "#8fd460" },
  { name: "Cyan", value: "#59c8e8" },
  { name: "Blue", value: "#6a9eff" },
  { name: "Magenta", value: "#e07ce0" },
  { name: "Grey", value: "#9aa7b6" },
];

function selectedEntities(): Entity[] {
  return [...engine.selection]
    .map(id => doc.byId(id))
    .filter((entity): entity is Entity => Boolean(entity));
}

function layerOptions(selected: string): string {
  return doc.layers
    .map(
      layer =>
        `<option value="${layer.id}"${layer.id === selected ? " selected" : ""}>${esc(layer.name)}</option>`
    )
    .join("");
}

function colorOptions(selected: string): string {
  return CAD_COLORS.map(
    color => `<option value="${color.value}"${color.value === selected ? " selected" : ""}>${color.name}</option>`
  ).join("");
}

function propRow(label: string, value: string): string {
  return `<div class="cad-prop-row"><span class="cad-prop-label">${label}</span><span class="cad-prop-value">${value}</span></div>`;
}

function propSelect(label: string, prop: string, options: string): string {
  return `<div class="cad-prop-row"><span class="cad-prop-label">${label}</span><select class="cad-prop-select" data-prop="${prop}">${options}</select></div>`;
}

function propSection(title: string, rows: string): string {
  return `<div class="cad-prop-section"><div class="cad-prop-section__title">${title}</div>${rows}</div>`;
}

function entityGeometryRows(entity: Entity): string {
  switch (entity.kind) {
    case "line":
      return [
        propRow("Start X", fmt(entity.p1.x, 2)),
        propRow("Start Y", fmt(entity.p1.y, 2)),
        propRow("End X", fmt(entity.p2.x, 2)),
        propRow("End Y", fmt(entity.p2.y, 2)),
        propRow("Length", fmt(distance(entity.p1, entity.p2), 2)),
        propRow("Angle", `${lineAngleDeg(entity.p1, entity.p2).toFixed(1)}°`),
      ].join("");
    case "polyline":
      return [
        propRow("Vertices", String(entity.points.length)),
        propRow("Closed", entity.closed ? "Yes" : "No"),
        propRow("Length", fmt(polylineLength(entity.points, entity.closed), 2)),
        propRow("Start X", fmt(entity.points[0]?.x ?? 0, 2)),
        propRow("Start Y", fmt(entity.points[0]?.y ?? 0, 2)),
      ].join("");
    case "circle":
      return [
        propRow("Center X", fmt(entity.center.x, 2)),
        propRow("Center Y", fmt(entity.center.y, 2)),
        propRow("Radius", fmt(entity.radius, 2)),
        propRow("Diameter", fmt(entity.radius * 2, 2)),
        propRow("Circumference", fmt(Math.PI * 2 * entity.radius, 2)),
      ].join("");
    case "arc":
      return [
        propRow("Center X", fmt(entity.center.x, 2)),
        propRow("Center Y", fmt(entity.center.y, 2)),
        propRow("Radius", fmt(entity.radius, 2)),
        propRow("Start angle", `${((entity.startAngle * 180) / Math.PI).toFixed(1)}°`),
        propRow("End angle", `${((entity.endAngle * 180) / Math.PI).toFixed(1)}°`),
      ].join("");
    case "ellipse":
      return [
        propRow("Center X", fmt(entity.center.x, 2)),
        propRow("Center Y", fmt(entity.center.y, 2)),
        propRow("Radius X", fmt(entity.rx, 2)),
        propRow("Radius Y", fmt(entity.ry, 2)),
        propRow("Rotation", `${((entity.rotation * 180) / Math.PI).toFixed(1)}°`),
      ].join("");
    case "text":
      return [
        propRow("Contents", esc(entity.text)),
        propRow("Position X", fmt(entity.p.x, 2)),
        propRow("Position Y", fmt(entity.p.y, 2)),
        propRow("Height", fmt(entity.height, 2)),
        propRow("Rotation", `${((entity.rotation * 180) / Math.PI).toFixed(1)}°`),
      ].join("");
    case "dim":
      return [
        propRow("Measurement", entity.textOverride ?? formattedMeasurement(dimMeasurement(entity))),
        propRow("Dimension type", entity.dimType),
        propRow("Extension line 1", `${fmt(entity.p1.x)}, ${fmt(entity.p1.y)}`),
        propRow("Extension line 2", `${fmt(entity.p2.x)}, ${fmt(entity.p2.y)}`),
      ].join("");
    case "hatch":
      return [
        propRow("Pattern", entity.pattern === "solid" ? "Solid" : entity.pattern.toUpperCase()),
        propRow("Spacing", fmt(entity.spacing, 2)),
        propRow("Angle", `${((entity.angle * 180) / Math.PI).toFixed(1)}°`),
        propRow("Vertices", String(entity.boundary.length)),
      ].join("");
    case "leader":
      return [
        propRow("Text", esc(entity.text)),
        propRow("Vertices", String(entity.points.length)),
        propRow("Text height", fmt(entity.textHeight, 2)),
      ].join("");
    case "insert": {
      const block = doc.blocks[entity.block];
      return [
        propRow("Block", esc(entity.block)),
        propRow("Description", esc(block?.description ?? "Block reference")),
        propRow("Position X", fmt(entity.p.x, 2)),
        propRow("Position Y", fmt(entity.p.y, 2)),
        propRow("Scale", String(entity.scale)),
        propRow("Rotation", `${((entity.rotation * 180) / Math.PI).toFixed(1)}°`),
      ].join("");
    }
    case "point":
      return [propRow("Position X", fmt(entity.p.x, 2)), propRow("Position Y", fmt(entity.p.y, 2))].join("");
  }
}

function entityTypeName(entity: Entity): string {
  switch (entity.kind) {
    case "line":
      return "Line";
    case "polyline":
      return entity.closed ? "Polyline (closed)" : "Polyline";
    case "circle":
      return "Circle";
    case "arc":
      return "Arc";
    case "ellipse":
      return "Ellipse";
    case "text":
      return "Text";
    case "dim":
      return entity.dimType === "radial" ? "Radius dimension" : `${entity.dimType} dimension`;
    case "leader":
      return "Leader";
    case "hatch":
      return "Hatch";
    case "insert":
      return "Block reference";
    case "point":
      return "Point";
  }
}

function renderProperties(): void {
  const entities = selectedEntities();
  const count = entities.length;
  propsTitle.textContent = count === 0 ? "No selection" : count === 1 ? `1 ${entityTypeName(entities[0])}` : `${count} objects selected`;

  if (count === 0) {
    propsBody.innerHTML =
      propSection(
        "Drawing",
        [
          propRow("Name", esc(doc.name)),
          propRow("Current layer", esc(doc.layer(state.currentLayer)?.name ?? "0")),
          propRow("Total objects", String(doc.entities.length)),
          propRow("Layouts", String(doc.layouts.length + 1)),
          propRow("Units", "Millimetres"),
          propRow("Annotation scale", "1:100"),
        ].join("")
      ) +
      `<div class="cad-props-note">Select geometry on the canvas to inspect and edit its properties.</div>`;
    return;
  }

  const first = entities[0];
  const uniformLayer = entities.every(entity => entity.layer === first.layer);
  const uniformColor = entities.every(entity => (entity.color ?? "") === (first.color ?? ""));
  const general = [
    propSelect(
      "Layer",
      "layer",
      uniformLayer ? layerOptions(first.layer) : `<option value="" selected>Varies</option>${layerOptions("")}`
    ),
    propSelect("Color", "color", uniformColor ? colorOptions(first.color ?? "") : `<option value="" selected>Varies</option>${colorOptions("")}`),
    propRow("Linetype", esc(first.linetype ?? doc.layer(first.layer)?.linetype ?? "ByLayer")),
    propRow("Lineweight", `${(first.lineweight ?? doc.layer(first.layer)?.lineweight ?? 0.25).toFixed(2)} mm`),
    propRow("Handle", esc(first.id.toUpperCase())),
  ].join("");

  const geometry =
    count === 1
      ? propSection(entityTypeName(first), entityGeometryRows(first))
      : propSection("Geometry", entities.map(entity => propRow(entityTypeName(entity), `#${esc(entity.id.toUpperCase())}`)).join(""));

  propsBody.innerHTML = propSection("General", general) + geometry;

  propsBody.querySelectorAll<HTMLSelectElement>("select[data-prop]").forEach(select => {
    select.addEventListener("change", () => {
      const prop = select.dataset.prop;
      const entitiesToUpdate = selectedEntities();
      if (!prop || entitiesToUpdate.length === 0) return;
      if (select.value === "" && prop === "layer") return;
      engine.history.push(doc);
      for (const entity of entitiesToUpdate) {
        if (prop === "layer" && doc.layer(select.value)) entity.layer = select.value;
        if (prop === "color") {
          if (select.value) entity.color = select.value;
          else delete entity.color;
        }
      }
      onChange();
      renderProperties();
      log("info", `Properties updated for ${entitiesToUpdate.length} object(s).`);
    });
  });
}

/* ----------------------------------------------------------------- menus */

function newDrawing(): void {
  if (!engine.isIdle) engine.escape();
  doc = createSampleDrawing();
  renderer.setDocument(doc);
  engine.history.clear();
  engine.clearSelection(false);
  engine.selection.clear();
  state.currentLayer = "0";
  renderer.fitExtents();
  updateDocLabels();
  renderLayerSelect();
  renderLayerList();
  renderProperties();
  rebuildLayoutTabs();
  log("command", "Command: NEW");
  log("info", "New drawing created from the apartment template.");
  markDirty();
  dirtyDot.hidden = true;
}

function openDrawing(): void {
  newDrawing();
  log("command", "Command: OPEN");
  log("info", `Opened ${doc.name} · ${doc.entities.length} objects · ${doc.layers.length} layers.`);
}

function saveDrawing(): void {
  downloadDxf(doc);
  log("info", `Saved ${doc.name.replace(/\.dxf$/i, "")}.dxf to your downloads.`);
  dirtyDot.hidden = true;
}

function fitExtents(): void {
  if (renderer.mode === "layout") renderer.fitSheet();
  else renderer.fitExtents();
  updateStatusBar();
}

function zoomBy(factor: number): void {
  renderer.zoomAt({ x: renderer.width / 2, y: renderer.height / 2 }, factor);
  updateStatusBar();
}

function toggleSetting(id: ToggleDef["id"] | "grid"): void {
  const key = id as keyof AppState;
  if (typeof state[key] !== "boolean") return;
  (state as unknown as Record<string, boolean>)[key] = !state[key];
  if (key === "grid") renderer.setSettings({ showGrid: state.grid });
  if (key === "dyn") renderer.setSettings({ showDyn: state.dyn });
  if (key === "lwt") renderer.setSettings({ showLineweight: state.lwt });
  updateStatusBar();
  renderer.requestRender();
  const label = TOGGLES.find(toggle => toggle.id === id)?.label ?? id;
  setHint(`${label} ${state[key] ? "on" : "off"}`, 1600);
}

function toggleToolPalette(): void {
  appEl.classList.toggle("cad-tools-hidden");
  closePopup();
}

function togglePalettes(): void {
  appEl.classList.toggle("cad-palettes-hidden");
  closePopup();
}

const MENUS: MenuSpec[] = [
  {
    label: "File",
    items: () => [
      { label: "New", shortcut: "Ctrl+N", action: newDrawing },
      { label: "Open…", shortcut: "Ctrl+O", action: openDrawing },
      { label: "Save", shortcut: "Ctrl+S", action: saveDrawing },
      { separator: true },
      { label: "Plot…", shortcut: "Ctrl+P", action: openPlotDialog },
      { label: "Export PNG…", action: openPlotDialog },
      { separator: true },
      {
        label: "Close",
        action: () => toast("This demo keeps a single drawing open."),
      },
    ],
  },
  {
    label: "Edit",
    items: () => [
      { label: "Undo", shortcut: "Ctrl+Z", disabled: !engine.history.canUndo, action: () => void engine.execute("UNDO") },
      { label: "Redo", shortcut: "Ctrl+Y", disabled: !engine.history.canRedo, action: () => void engine.execute("REDO") },
      { separator: true },
      { label: "Erase", shortcut: "Del", disabled: engine.selection.size === 0, action: () => engine.deleteSelection() },
      { label: "Select All", shortcut: "Ctrl+A", action: () => engine.selectAll() },
      { separator: true },
      { label: "Find…", disabled: true },
    ],
  },
  {
    label: "View",
    items: () => [
      { label: "Zoom Extents", action: fitExtents },
      { label: "Zoom In", action: () => zoomBy(1.25) },
      { label: "Zoom Out", action: () => zoomBy(0.8) },
      { label: "Pan", action: () => void engine.execute("PAN") },
      { separator: true },
      { label: "Grid", checked: state.grid, action: () => toggleSetting("grid") },
      { label: "Lineweight", checked: state.lwt, action: () => toggleSetting("lwt") },
      { separator: true },
      { label: "Model", checked: state.space === "MODEL", action: () => setSpace("model") },
      { label: "Layout1", checked: state.space === "PAPER", action: () => setSpace("layout", 0) },
      { label: "Layout2", action: () => setSpace("layout", 1) },
      { separator: true },
      { label: "Tool Sets", checked: !appEl.classList.contains("cad-tools-hidden"), action: toggleToolPalette },
      { label: "Palettes", checked: !appEl.classList.contains("cad-palettes-hidden"), action: togglePalettes },
    ],
  },
  {
    label: "Insert",
    items: () => [
      { label: "Block Reference…", action: () => engine.execute("INSERT") },
      { separator: true },
      ...BLOCKS.slice(0, 8).map(block => ({
        label: block.name === "WINDOW1800" ? "Window 1800" : block.name === "DOOR900" ? "Door 900" : block.name,
        action: () => engine.startInsert(block.name),
      })),
    ],
  },
  {
    label: "Format",
    items: () => [
      { label: "Layer…", action: openLayerManager },
      { label: "Layer States Manager…", disabled: true },
      { label: "Text Style…", disabled: true },
      { label: "Dimension Style…", disabled: true },
      { label: "Units…", disabled: true },
    ],
  },
  {
    label: "Tools",
    items: () => [
      { label: "Object Snap", shortcut: "F3", checked: state.osnap, action: () => toggleSetting("osnap") },
      { label: "Grid Snap", shortcut: "F9", checked: state.snap, action: () => toggleSetting("snap") },
      { label: "Ortho", shortcut: "F8", checked: state.ortho, action: () => toggleSetting("ortho") },
      { label: "Polar Tracking", shortcut: "F10", checked: state.polar, action: () => toggleSetting("polar") },
      { label: "Dynamic Input", shortcut: "F12", checked: state.dyn, action: () => toggleSetting("dyn") },
      { separator: true },
      { label: "Layer Properties Manager…", action: openLayerManager },
      { label: "Drawing Properties…", action: () => engine.execute("PROPERTIES") },
    ],
  },
  {
    label: "Draw",
    items: () => [
      { label: "Line", shortcut: "L", action: () => engine.execute("LINE") },
      { label: "Polyline", shortcut: "PL", action: () => engine.execute("PLINE") },
      { label: "Rectangle", shortcut: "REC", action: () => engine.execute("RECTANG") },
      { label: "Polygon", shortcut: "POL", action: () => engine.execute("POLYGON") },
      { label: "Circle", shortcut: "C", action: () => engine.execute("CIRCLE") },
      { label: "Arc", shortcut: "A", action: () => engine.execute("ARC") },
      { label: "Ellipse", shortcut: "EL", action: () => engine.execute("ELLIPSE") },
      { label: "Point", shortcut: "PO", action: () => engine.execute("POINT") },
      { separator: true },
      { label: "Hatch", shortcut: "H", action: () => engine.execute("HATCH") },
      { label: "Text", shortcut: "T", action: () => engine.execute("TEXT") },
      { label: "Leader", shortcut: "LE", action: () => engine.execute("LEADER") },
    ],
  },
  {
    label: "Dimension",
    items: () => [
      { label: "Linear", shortcut: "DLI", action: () => engine.execute("DIMLINEAR") },
      { label: "Aligned", shortcut: "DAL", action: () => engine.execute("DIMALIGNED") },
      { label: "Radius", shortcut: "DRA", action: () => engine.execute("DIMRADIUS") },
    ],
  },
  {
    label: "Modify",
    items: () => [
      { label: "Move", shortcut: "M", action: () => engine.execute("MOVE") },
      { label: "Copy", shortcut: "CO", action: () => engine.execute("COPY") },
      { label: "Rotate", shortcut: "RO", action: () => engine.execute("ROTATE") },
      { label: "Scale", shortcut: "SC", action: () => engine.execute("SCALE") },
      { label: "Mirror", shortcut: "MI", action: () => engine.execute("MIRROR") },
      { label: "Offset", shortcut: "O", action: () => engine.execute("OFFSET") },
      { separator: true },
      { label: "Erase", shortcut: "E", action: () => engine.execute("ERASE") },
    ],
  },
  {
    label: "Window",
    items: () => [
      { label: "Tool Sets", checked: !appEl.classList.contains("cad-tools-hidden"), action: toggleToolPalette },
      { label: "Palettes", checked: !appEl.classList.contains("cad-palettes-hidden"), action: togglePalettes },
      { separator: true },
      { label: "Command Line", checked: true, action: () => commandConsole.$input.focus() },
      { label: "Properties", action: () => focusPalette("properties-palette") },
      { label: "Layers", action: () => focusPalette("layers-palette") },
    ],
  },
  {
    label: "Help",
    items: () => [
      { label: "About CADCraft…", action: openAboutDialog },
      { label: "Keyboard Shortcuts…", action: openAboutDialog },
      { separator: true },
      {
        label: "Reference: getartcraft.com/apps/cadcraft",
        action: () => window.open("https://getartcraft.com/apps/cadcraft", "_blank", "noopener"),
      },
    ],
  },
];

let popup: HTMLElement | null = null;
let popupAnchor: HTMLElement | null = null;
let contextMenu: ContextMenu | null = null;

function closeContextMenu(): void {
  contextMenu?.close();
  contextMenu = null;
}

function closePopup(): void {
  if (popup) popup.remove();
  popup = null;
  popupAnchor?.classList.remove("is-open");
  popupAnchor = null;
}

function openPopupAt(x: number, y: number, items: MenuItem[]): void {
  closePopup();
  const element = document.createElement("div");
  element.className = "cad-popup";
  element.setAttribute("role", "menu");
  for (const item of items) {
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "cad-popup__separator";
      element.appendChild(separator);
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = `cad-popup__item${item.disabled ? " is-disabled" : ""}${item.checked ? " is-checked" : ""}`;
    button.disabled = Boolean(item.disabled);
    button.innerHTML = `<span class="cad-popup__check">${item.checked ? "✓" : ""}</span><span class="cad-popup__label">${esc(
      item.label
    )}</span>${item.shortcut ? `<span class="cad-popup__shortcut">${esc(item.shortcut)}</span>` : ""}`;
    button.addEventListener("click", () => {
      closePopup();
      item.action?.();
    });
    element.appendChild(button);
  }
  appEl.appendChild(element);
  const rect = element.getBoundingClientRect();
  const left = Math.min(Math.max(6, x), window.innerWidth - rect.width - 8);
  const top = Math.min(Math.max(6, y), window.innerHeight - rect.height - 8);
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  popup = element;
}

function openMenuFrom(anchor: HTMLElement, items: MenuItem[]): void {
  const rect = anchor.getBoundingClientRect();
  openPopupAt(rect.left, rect.bottom + 2, items);
  popupAnchor = anchor;
  anchor.classList.add("is-open");
}

function renderMenubar(): void {
  menubar.innerHTML = "";
  for (const spec of MENUS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cad-menu-btn";
    button.textContent = spec.label;
    button.addEventListener("click", event => {
      event.stopPropagation();
      const wasOpen = popupAnchor === button;
      closePopup();
      if (!wasOpen) openMenuFrom(button, spec.items());
    });
    menubar.appendChild(button);
  }
}

document.addEventListener("pointerdown", event => {
  if (!popup) return;
  const target = event.target as Node;
  if (popup.contains(target) || popupAnchor?.contains(target)) return;
  closePopup();
});

/* -------------------------------------------------------- shell controls */

async function doAction(action: string): Promise<void> {
  switch (action) {
    case "new":
      newDrawing();
      break;
    case "open":
      openDrawing();
      break;
    case "save":
      saveDrawing();
      break;
    case "undo":
      await engine.execute("UNDO");
      updateStatusBar();
      break;
    case "redo":
      await engine.execute("REDO");
      updateStatusBar();
      break;
    case "plot":
      openPlotDialog();
      break;
    case "layers":
      openLayerManager();
      break;
    case "props":
      focusPalette("properties-palette");
      break;
    case "about":
      openAboutDialog();
      break;
    default:
      break;
  }
}

appEl.addEventListener("click", event => {
  const action = (event.target as HTMLElement).closest<HTMLElement>("[data-action]")?.dataset.action;
  if (action) void doAction(action);
});

q<HTMLElement>("#toggle-tools").addEventListener("click", toggleToolPalette);
q<HTMLElement>("#workspace-btn").addEventListener("click", event => {
  openMenuFrom(event.currentTarget as HTMLElement, [
    { label: "Drafting & Annotation", checked: true, action: () => toast("Drafting & Annotation workspace active.") },
    { label: "3D Modeling", action: () => toast("3D Modeling is not part of this 2D drafting demo.") },
    { label: "Save Current As…", disabled: true },
  ]);
});
q<HTMLElement>("#drawing-tab").querySelector(".cad-filetab__close")?.addEventListener("click", event => {
  event.stopPropagation();
  toast("This demo keeps a single drawing open.");
});

q<HTMLElement>("#view-orient").addEventListener("click", event => {
  openMenuFrom(event.currentTarget as HTMLElement, [
    { label: "Top", checked: true, action: () => toast("Top view is the only 2D view in this demo.") },
    { label: "Front", disabled: true },
    { label: "Right", disabled: true },
    { label: "Isometric", disabled: true },
  ]);
});
q<HTMLElement>("#view-style").addEventListener("click", event => {
  openMenuFrom(event.currentTarget as HTMLElement, [
    { label: "2D Wireframe", checked: true, action: () => toast("2D Wireframe visual style.") },
    { label: "Conceptual", disabled: true },
    { label: "Hidden", disabled: true },
  ]);
});
q<HTMLElement>("#view-add").addEventListener("click", () => toast("Viewport creation is not part of this demo."));
q<HTMLElement>("#view-osnap").addEventListener("click", () => toggleSetting("osnap"));
q<HTMLElement>("#toggle-grid-btn").addEventListener("click", () => toggleSetting("grid"));

const toolTabButtons = document.querySelectorAll<HTMLButtonElement>("[data-palette-tab]");
toolTabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.paletteTab;
    if (tab !== "drafting" && tab !== "modeling") return;
    state.paletteTab = tab;
    toolTabButtons.forEach(item => item.classList.toggle("is-active", item === button));
    renderToolGroups();
  });
});

toolGroupsHost.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const groupToggle = target.closest<HTMLElement>("[data-group-toggle]");
  if (groupToggle) {
    const group = groupToggle.closest<HTMLElement>(".cad-toolgroup");
    const id = groupToggle.dataset.groupToggle;
    if (group && id) {
      group.classList.toggle("is-collapsed");
      if (group.classList.contains("is-collapsed")) collapsedGroups.add(id);
      else collapsedGroups.delete(id);
    }
    return;
  }
  const blockButton = target.closest<HTMLElement>("[data-block]");
  if (blockButton?.dataset.block) {
    engine.startInsert(blockButton.dataset.block);
    return;
  }
  const tool = target.closest<HTMLElement>("[data-command]");
  if (tool?.dataset.command) engine.execute(tool.dataset.command);
});

function focusPalette(id: string): void {
  const palette = document.getElementById(id);
  if (!palette) return;
  appEl.classList.remove("cad-palettes-hidden");
  palette.classList.remove("is-collapsed");
  palette.scrollIntoView({ block: "nearest", behavior: "smooth" });
  palette.classList.add("is-flash");
  window.setTimeout(() => palette.classList.remove("is-flash"), 600);
}

palettes.querySelectorAll<HTMLElement>(".cad-palette__head").forEach(head => {
  head.addEventListener("click", event => {
    if ((event.target as HTMLElement).closest(".cad-palette__more")) return;
    head.closest(".cad-palette")?.classList.toggle("is-collapsed");
  });
});

palettes.querySelectorAll<HTMLElement>("[data-palette-icon]").forEach(button => {
  button.addEventListener("click", () => {
    const which = button.dataset.paletteIcon;
    if (which === "properties") focusPalette("properties-palette");
    else if (which === "layers") focusPalette("layers-palette");
    else if (which === "states") toast("Layer states are not part of this demo.");
    else toast("Palette settings are not part of this demo.");
  });
});

propsBody.addEventListener("click", () => undefined);
appEl.querySelectorAll<HTMLButtonElement>("[data-props-tab]").forEach(button => {
  button.addEventListener("click", () => {
    state.propsTab = button.dataset.propsTab === "my" ? "my" : "all";
    appEl.querySelectorAll("[data-props-tab]").forEach(item => item.classList.toggle("is-active", item === button));
    renderProperties();
  });
});

/* ------------------------------------------------------------- layout tabs */

let layoutTabs: Tabs | null = null;

function rebuildLayoutTabs(): void {
  if (layoutTabs) {
    const root = layoutTabs.root;
    root.remove();
  }
  layoutTabs = new Tabs({ id: "cad-layout-tabs" });
  layoutTabs.addTab("model", { title: "Model", callback: () => setSpace("model") });
  doc.layouts.forEach((layout, index) => {
    layoutTabs!.addTab(layout.id, { title: layout.name, callback: () => setSpace("layout", index) });
  });
  layoutTabs.addButtonTab("new-layout", "+", () => toast("Additional layouts are read-only in this demo."));
  q<HTMLElement>("#layout-tabs-host").appendChild(layoutTabs.root);
  layoutTabs.selectTab("model");
}

function setSpace(kind: "model" | "layout", index = 0): void {
  if (!engine.isIdle) engine.escape();
  if (kind === "model") {
    renderer.setMode("model");
    state.space = "MODEL";
  } else {
    renderer.setMode("layout", index);
    state.space = "PAPER";
  }
  engine.clearSelection(true);
  viewBadge.textContent = state.space;
  updateStatusBar();
  renderer.requestRender();
  fitExtents();
  log("info", kind === "model" ? "Switched to model space." : `Switched to paper space · ${doc.layouts[index]?.name ?? "Layout"}.`);
}

/* ------------------------------------------------------------ dialogs */

let layerDialog: Dialog | null = null;

function openLayerManager(): void {
  if (layerDialog) {
    layerDialog.show();
    return;
  }
  const dialog = new Dialog({
    id: "layer-manager",
    className: "cad-dialog cad-layer-manager",
    title: "Layer Properties Manager",
    width: 780,
    height: 440,
    closable: true,
    draggable: true,
    parent: appEl,
    onClose: () => {
      layerDialog = null;
    },
  });
  layerDialog = dialog;
  dialog.footer.classList.add("cad-dialog__footer");
  dialog.footer.innerHTML = `<button type="button" class="cad-btn" data-lm="new">New Layer</button><button type="button" class="cad-btn" data-lm="delete">Delete Layer</button><span class="spacer"></span><button type="button" class="cad-btn cad-btn--primary" data-lm="close">Close</button>`;

  const render = () => {
    const rows = doc.layers
      .map(
        layer => `<tr data-layer="${layer.id}" class="${layer.id === state.currentLayer ? "is-current" : ""}">
          <td><span class="cad-layer-swatch" style="background:${layer.color}"></span></td>
          <td><input class="cad-lm-name" data-lm-name="${layer.id}" value="${esc(layer.name)}" /></td>
          <td><input type="checkbox" data-lm-flag="visible" data-id="${layer.id}" ${layer.visible ? "checked" : ""} /></td>
          <td><input type="checkbox" data-lm-flag="freeze" data-id="${layer.id}" ${layer.frozen ? "checked" : ""} /></td>
          <td><input type="checkbox" data-lm-flag="lock" data-id="${layer.id}" ${layer.locked ? "checked" : ""} /></td>
          <td><input type="color" data-lm-color="${layer.id}" value="${layer.color}" /></td>
          <td>
            <select data-lm-linetype="${layer.id}">
              ${["continuous", "dashed", "hidden", "center", "dashdot"]
                .map(type => `<option value="${type}"${type === layer.linetype ? " selected" : ""}>${type}</option>`)
                .join("")}
            </select>
          </td>
          <td>
            <select data-lm-lineweight="${layer.id}">
              ${[0.13, 0.18, 0.25, 0.35, 0.5, 0.7]
                .map(
                  weight =>
                    `<option value="${weight}"${weight === layer.lineweight ? " selected" : ""}>${weight.toFixed(2)} mm</option>`
                )
                .join("")}
            </select>
          </td>
          <td><input type="checkbox" data-lm-flag="plot" data-id="${layer.id}" ${layer.plot ? "checked" : ""} /></td>
        </tr>`
      )
      .join("");
    dialog.content.innerHTML = `<div class="cad-lm">
      <table class="cad-lm-table">
        <thead><tr><th></th><th>Name</th><th>On</th><th>Freeze</th><th>Lock</th><th>Color</th><th>Linetype</th><th>Lineweight</th><th>Plot</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="cad-lm-note">Click a row to make it current. Toggles apply to the drawing immediately.</p>
    </div>`;

    dialog.content.querySelectorAll<HTMLElement>("tr[data-layer]").forEach(row => {
      row.addEventListener("click", event => {
        if ((event.target as HTMLElement).closest("input,select")) return;
        const id = row.dataset.layer;
        if (id) setCurrentLayer(id);
        render();
      });
    });
    dialog.content.querySelectorAll<HTMLInputElement>("[data-lm-flag]").forEach(input => {
      input.addEventListener("change", () => {
        const id = input.dataset.id;
        const flag = input.dataset.lmFlag as "visible" | "freeze" | "lock" | "plot" | undefined;
        const layer = id ? doc.layer(id) : undefined;
        if (!layer || !flag) return;
        if (flag === "visible") layer.visible = input.checked;
        else if (flag === "freeze") layer.frozen = input.checked;
        else if (flag === "lock") layer.locked = input.checked;
        else layer.plot = input.checked;
        renderLayerList();
        onChange();
      });
    });
    dialog.content.querySelectorAll<HTMLInputElement>("[data-lm-name]").forEach(input => {
      input.addEventListener("change", () => {
        const id = input.dataset.lmName;
        const layer = id ? doc.layer(id) : undefined;
        if (!layer) return;
        const next = input.value.trim() || layer.name;
        if (doc.layers.some(item => item !== layer && item.name === next)) {
          input.value = layer.name;
          toast("Layer names must be unique.");
          return;
        }
        layer.name = next;
        renderLayerSelect();
        renderLayerList();
        onChange();
        render();
      });
    });
    dialog.content.querySelectorAll<HTMLInputElement>("[data-lm-color]").forEach(input => {
      input.addEventListener("input", () => {
        const id = input.dataset.lmColor;
        const layer = id ? doc.layer(id) : undefined;
        if (!layer) return;
        layer.color = input.value;
        renderLayerList();
        renderer.requestRender();
      });
    });
    dialog.content.querySelectorAll<HTMLSelectElement>("[data-lm-linetype]").forEach(select => {
      select.addEventListener("change", () => {
        const layer = doc.layer(select.dataset.lmLinetype ?? "");
        if (!layer) return;
        layer.linetype = select.value as Layer["linetype"];
        renderer.requestRender();
      });
    });
    dialog.content.querySelectorAll<HTMLSelectElement>("[data-lm-lineweight]").forEach(select => {
      select.addEventListener("change", () => {
        const layer = doc.layer(select.dataset.lmLineweight ?? "");
        if (!layer) return;
        layer.lineweight = Number(select.value);
        renderer.requestRender();
      });
    });
  };

  dialog.footer.addEventListener("click", event => {
    const action = (event.target as HTMLElement).closest<HTMLElement>("[data-lm]")?.dataset.lm;
    if (action === "new") {
      createLayer();
      render();
    } else if (action === "delete") {
      deleteCurrentLayer();
      render();
    } else if (action === "close") {
      dialog.close();
    }
  });

  render();
}

function openAboutDialog(): void {
  const dialog = new Dialog({
    id: "cad-about",
    className: "cad-dialog cad-about",
    title: "About CADCraft",
    width: 560,
    height: 430,
    closable: true,
    draggable: true,
    parent: appEl,
  });
  dialog.content.innerHTML = `<div class="cad-about-body">
    <div class="cad-about-brand">${icon("logo", 34)}<div><h2>CADCraft</h2><p>Computer-aided design &amp; drafting · LiteGUI edition</p></div></div>
    <p class="cad-about-copy">A framework-free 2D drafting demo built with LiteGUI's Console, StatusBar, Tabs, Dialog and ContextMenu components. The drawing, rendering and command engine are plain TypeScript on a canvas.</p>
    <h3>Try it</h3>
    <ul class="cad-about-list">
      <li><kbd>L</kbd> then click points to draw lines · <kbd>REC</kbd> for a rectangle · <kbd>C</kbd> for a circle</li>
      <li>Type <kbd>@900&lt;45</kbd> or a distance for direct distance entry</li>
      <li><kbd>Esc</kbd> cancels · <kbd>Enter</kbd> finishes · <kbd>F3</kbd> object snaps · <kbd>F8</kbd> ortho</li>
      <li>Wheel to zoom · middle-drag to pan · click the compass-side tabs to switch to paper space</li>
    </ul>
    <p class="cad-about-meta">Reference app: <a href="https://getartcraft.com/apps/cadcraft" target="_blank" rel="noopener">CADCraft by ArtCraft</a> · Built with <a href="https://github.com/gausszhou/litegui" target="_blank" rel="noopener">LiteGUI</a></p>
    <div class="cad-about-actions"><button type="button" class="cad-btn cad-btn--primary" data-about-close>Close</button></div>
  </div>`;
  dialog.footer.style.display = "none";
  dialog.content.querySelector("[data-about-close]")?.addEventListener("click", () => dialog.close());
}

function openPlotDialog(): void {
  const dialog = new Dialog({
    id: "cad-plot",
    className: "cad-dialog cad-plot",
    title: "Plot",
    width: 430,
    height: 390,
    closable: true,
    draggable: true,
    parent: appEl,
  });
  dialog.content.innerHTML = `<div class="cad-plot-form">
    <label>Plot style<select id="plot-style"><option>Monochrome.ctb</option><option>ByColor.ctb</option><option>None</option></select></label>
    <label>Paper size<select id="plot-paper"><option>A1 · 841 × 594 mm</option><option>A3 · 420 × 297 mm</option><option>Current view</option></select></label>
    <label>Plot scale<select id="plot-scale"><option>1:100</option><option>Fit to paper</option><option>1:50</option></select></label>
    <label>Plot area<select id="plot-area"><option>Drawing extents</option><option>Current view</option><option>Model space</option></select></label>
    <label>Format<select id="plot-format"><option value="png">PNG image</option><option value="dxf">DXF drawing</option></select></label>
    <label class="cad-check"><input type="checkbox" id="plot-lwt" /> Plot lineweights</label>
    <p class="cad-plot-note">PNG plots render the current canvas at screen resolution. DXF writes the complete drawing with layers and geometry.</p>
  </div>`;
  dialog.footer.classList.add("cad-dialog__footer");
  dialog.footer.innerHTML = `<span class="spacer"></span><button type="button" class="cad-btn" data-plot-cancel>Cancel</button><button type="button" class="cad-btn cad-btn--primary" data-plot-go>Plot</button>`;
  dialog.footer.addEventListener("click", event => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-plot-cancel]")) {
      dialog.close();
      return;
    }
    if (!target.closest("[data-plot-go]")) return;
    const format = dialog.content.querySelector<HTMLSelectElement>("#plot-format")?.value ?? "png";
    const lineweights = dialog.content.querySelector<HTMLInputElement>("#plot-lwt")?.checked ?? state.lwt;
    if (format === "dxf") {
      downloadDxf(doc);
      log("info", "Plotted DXF to downloads.");
    } else {
      const previous = renderer.getSettings().showLineweight;
      const previousCursor = renderer.cursorScreen;
      const previousSnap = renderer.activeSnap;
      const previousHover = renderer.hoverId;
      renderer.cursorScreen = null;
      renderer.activeSnap = null;
      renderer.hoverId = null;
      renderer.setSettings({ showLineweight: lineweights });
      renderer.render();
      exportCanvasPng(canvas, doc.name);
      renderer.setSettings({ showLineweight: previous });
      renderer.cursorScreen = previousCursor;
      renderer.activeSnap = previousSnap;
      renderer.hoverId = previousHover;
      renderer.render();
      log("info", "Plotted PNG to downloads.");
    }
    dialog.close();
  });
}

/* ------------------------------------------------------------- canvas I/O */

let press: { screen: Point; additive: boolean; moved: boolean } | null = null;
let panning = false;
let panLast: Point = { x: 0, y: 0 };

function canvasPoint(event: PointerEvent | WheelEvent | MouseEvent): Point {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function updateCoordinates(point: Point): void {
  coordsEl.textContent = `${point.x.toFixed(2)}, ${point.y.toFixed(2)}, 0.0000`;
}

function updateZoomLabel(): void {
  updateStatusBar();
}

canvas.addEventListener("pointerdown", event => {
  canvas.focus({ preventScroll: true });
  const screen = canvasPoint(event);
  if (event.button === 1) {
    panning = true;
    panLast = screen;
    event.preventDefault();
    return;
  }
  if (event.button !== 0) return;
  press = { screen, additive: event.shiftKey, moved: false };
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();
});

canvas.addEventListener("pointermove", event => {
  const screen = canvasPoint(event);
  renderer.cursorScreen = screen;
  const world = renderer.screenToWorld(screen);
  renderer.cursorWorld = world;
  const snapped = renderer.mode === "model" ? engine.updateCursor(world) : world;
  updateCoordinates(snapped);
  renderer.requestRender();

  if (panning) {
    renderer.panBy(panLast.x - screen.x, panLast.y - screen.y);
    panLast = screen;
    updateZoomLabel();
    return;
  }
  if (!press && !panning && renderer.mode === "model") {
    const hovered = pickEntity(doc, world, renderer.hitTolerance());
    renderer.hoverId = hovered?.id ?? null;
  } else if (renderer.mode === "layout") {
    renderer.hoverId = null;
  }
  if (press) {
    const dx = screen.x - press.screen.x;
    const dy = screen.y - press.screen.y;
    if (Math.hypot(dx, dy) > 4 && !engine.isAwaitingPoint) {
      press.moved = true;
      const startWorld = renderer.screenToWorld(press.screen);
      renderer.marquee = {
        start: startWorld,
        end: world,
        crossing: screen.x < press.screen.x,
      };
    } else if (press.moved && renderer.marquee) {
      renderer.marquee.end = world;
      renderer.marquee.crossing = screen.x < press.screen.x;
    }
  }
});

function endPointer(event: PointerEvent): void {
  if (panning) {
    panning = false;
    return;
  }
  const current = press;
  press = null;
  if (!current) return;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);

  const screen = canvasPoint(event);
  const world = renderer.screenToWorld(screen);
  if (renderer.mode === "layout") {
    renderer.marquee = null;
    renderer.requestRender();
    return;
  }
  if (current.moved && renderer.marquee) {
    const entities = pickAll(doc, boundsOf(renderer.marquee.start, renderer.marquee.end), renderer.marquee.crossing);
    if (engine.isAwaitingSelection) engine.handleWindowSelection(entities, current.additive);
    else engine.selectMany(entities, current.additive);
    renderer.marquee = null;
    renderer.requestRender();
    return;
  }
  renderer.marquee = null;
  const snapped = engine.updateCursor(world);
  if (engine.isAwaitingPoint || engine.isAwaitingSelection) engine.handleCanvasClick(snapped);
  else engine.selectAt(snapped, current.additive);
  renderer.requestRender();
  updateCoordinates(snapped);
}

canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", event => {
  panning = false;
  press = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointerleave", () => {
  if (panning || press) return;
  renderer.cursorScreen = null;
  renderer.cursorWorld = null;
  renderer.requestRender();
});

canvas.addEventListener("wheel", event => {
  event.preventDefault();
  const screen = canvasPoint(event);
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  renderer.zoomAt(screen, factor);
  const world = renderer.screenToWorld(screen);
  const snapped = renderer.mode === "model" ? engine.updateCursor(world) : world;
  updateCoordinates(snapped);
  updateZoomLabel();
}, { passive: false });

canvas.addEventListener("contextmenu", event => {
  event.preventDefault();
  closePopup();
  closeContextMenu();
  const screen = canvasPoint(event);
  const world = renderer.screenToWorld(screen);
  engine.updateCursor(world);
  const withClose = (callback: () => void) => () => {
    closeContextMenu();
    callback();
  };
  const items: Array<Record<string, unknown> | null> = [
    { title: `Repeat ${engine.commandName(engine.activeCommandId) || "last command"}`, callback: withClose(() => engine.repeatLast()) },
    { title: "Enter", callback: withClose(() => engine.enter()) },
    null,
    { title: "Zoom Extents", callback: withClose(() => fitExtents()) },
    { title: "Pan", callback: withClose(() => void engine.execute("PAN")) },
    { title: "Select All", callback: withClose(() => engine.selectAll()) },
    { title: "Erase", disabled: engine.selection.size === 0, callback: withClose(() => engine.deleteSelection()) },
    null,
    { title: "Layer Properties Manager…", callback: withClose(() => openLayerManager()) },
    { title: "Plot…", callback: withClose(() => openPlotDialog()) },
  ];
  contextMenu = new ContextMenu(items as never, { event, container: appEl, title: "Quick Actions" });
});

document.addEventListener(
  "pointerdown",
  event => {
    if (!contextMenu) return;
    if (contextMenu.root.contains(event.target as Node)) return;
    closeContextMenu();
  },
  true
);

function boundsOf(a: Point, b: Point) {
  return {
    minX: Math.min(a.x, b.x),
    minY: Math.min(a.y, b.y),
    maxX: Math.max(a.x, b.x),
    maxY: Math.max(a.y, b.y),
  };
}

/* ------------------------------------------------------------- keyboard */

function handleEscape(): void {
  const openDialog = appEl.querySelector<HTMLElement>(".lg-dialog");
  const dialogClose = openDialog?.querySelector<HTMLButtonElement>(".lg-dialog__button--close");
  if (dialogClose) {
    dialogClose.click();
    return;
  }
  closePopup();
  closeContextMenu();
  engine.escape();
  renderer.marquee = null;
  renderer.requestRender();
}

window.addEventListener("keydown", event => {
  const target = event.target as HTMLElement | null;
  const typing =
    Boolean(target) &&
    (target!.tagName === "INPUT" || target!.tagName === "SELECT" || target!.tagName === "TEXTAREA" || target!.isContentEditable);

  if (event.key === "Escape") {
    handleEscape();
    return;
  }

  if (event.ctrlKey || event.metaKey) {
    const key = event.key.toLowerCase();
    if (key === "z") {
      event.preventDefault();
      if (event.shiftKey) void engine.execute("REDO");
      else void engine.execute("UNDO");
      return;
    }
    if (key === "y") {
      event.preventDefault();
      void engine.execute("REDO");
      return;
    }
    if (key === "s") {
      event.preventDefault();
      saveDrawing();
      return;
    }
    if (key === "a") {
      event.preventDefault();
      engine.selectAll();
      return;
    }
    if (key === "p") {
      event.preventDefault();
      openPlotDialog();
      return;
    }
    return;
  }

  const functionKeys: Record<string, ToggleDef["id"]> = {
    F3: "osnap",
    F7: "grid",
    F8: "ortho",
    F9: "snap",
    F10: "polar",
    F11: "otrack",
    F12: "dyn",
  };
  if (functionKeys[event.key]) {
    event.preventDefault();
    toggleSetting(functionKeys[event.key]);
    return;
  }

  if (typing) return;

  if (event.key === "Delete") {
    event.preventDefault();
    if (engine.isIdle) engine.deleteSelection();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    engine.enter();
    return;
  }
  if (event.key.length === 1 && !event.altKey) {
    if (appEl.querySelector(".lg-dialog")) return;
    event.preventDefault();
    commandConsole.$input.focus();
    commandConsole.$input.value += event.key;
  }
});

/* -------------------------------------------------------- console wiring */

function submitCommand(value: string): void {
  const trimmed = value.trim();
  commandConsole.history.push(value);
  if (commandConsole.history.length > 50) commandConsole.history.shift();
  engine.submit(trimmed);
}

commandConsole.$input.addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopImmediatePropagation();
      const value = commandConsole.$input.value;
      commandConsole.$input.value = "";
      submitCommand(value);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      commandConsole.$input.value = "";
      handleEscape();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopImmediatePropagation();
      const value = commandConsole.$input.value.trim().toUpperCase();
      if (!value) return;
      const match = engine.commandList
        .map(command => command.name)
        .find(name => name.startsWith(value) && name !== value);
      if (match) commandConsole.$input.value = match;
      return;
    }
  },
  true
);

historyButton.addEventListener("click", event => {
  event.stopPropagation();
  const recent = ["LINE", "PLINE", "CIRCLE", "RECTANG", "MOVE", "COPY", "DIMLINEAR", "HATCH", "TEXT", "LAYER", "ZOOM", "PLOT"];
  const items = recent.map(name => ({
    label: name,
    action: () => {
      commandConsole.$input.value = name;
      submitCommand(name);
    },
  }));
  openMenuFrom(historyButton, items);
});

/* ------------------------------------------------------------- responsive */

const resizeObserver = new ResizeObserver(() => {
  renderer.resize();
  updateZoomLabel();
});
resizeObserver.observe(canvasWrap);

window.addEventListener("resize", () => {
  renderer.resize();
  updateZoomLabel();
});

/* ------------------------------------------------------------- bootstrap */

renderMenubar();
renderToolGroups();
renderLayerSelect();
renderLayerList();
renderProperties();
updateStatusBar();
updateDocLabels();
rebuildLayoutTabs();
commandConsole.$input.focus({ preventScroll: true });

log("command", "Command: _OPEN");
log("info", `Loaded ${doc.name} · 12 000 × 8 000 mm · ${doc.layers.length} layers · ${doc.entities.length} objects.`);
log("command", "Command: ZOOM");
log("info", "Zoomed to drawing extents.");

window.requestAnimationFrame(() => {
  renderer.resize();
  renderer.fitExtents();
  updateStatusBar();
  setHint("Ready · Wheel to zoom · Middle-drag to pan · F1 Help");
});

window.__CADCRAFT__ = {
  doc: () => doc,
  engine,
  renderer,
  state,
  entityCount: () => doc.entities.length,
  selectionCount: () => engine.selection.size,
  layout: () => (renderer.mode === "layout" ? doc.layouts[renderer.layoutIndex]?.name ?? "Layout" : "Model"),
  pickAt: (x: number, y: number) => {
    const hit = pickEntity(doc, { x, y }, renderer.hitTolerance());
    return hit ? { id: hit.id, kind: hit.kind, layer: hit.layer, block: hit.kind === "insert" ? hit.block : undefined } : null;
  },
};
