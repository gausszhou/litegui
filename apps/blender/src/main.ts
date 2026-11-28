// @ts-nocheck
import "@gausszhou/litegui-components/style.css";
import "./editor.css";
import {
  HeaderBar,
  StatusBar,
  Timeline,
  Toolbar,
  NodeEditor,
  TextEditor,
  ImageEditor,
  Viewport,
  type ViewportObject
} from "@gausszhou/litegui-components";

const icons: Record<string, string> = {
  blender: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M7 9h5a3 3 0 0 1 0 6H7z"/><path d="M14 6l4 4"/></svg>',
  select: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l9 6-4 1-2 4z"/></svg>',
  cursor: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="4" stroke-dasharray="2 2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3"/></svg>',
  move: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1v14M1 8h14M8 1l-2 2M8 1l2 2M8 15l-2-2M8 15l2-2M1 8l2-2M1 8l2 2M15 8l-2-2M15 8l-2 2"/></svg>',
  rotate: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M13 8a5 5 0 1 1-1.5-3.5"/><path d="M13 2v4h-4"/></svg>',
  scale: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 14L14 2"/><rect x="2" y="10" width="4" height="4"/><rect x="10" y="2" width="4" height="4"/></svg>',
  transform: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 8h12M8 2v12"/><circle cx="8" cy="8" r="3"/></svg>',
  annotate: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 14l3-1 8-8-2-2-8 8z"/><path d="M10 3l2 2"/></svg>',
  measure: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 5h12v6H2z"/><path d="M4 5v3M6 5v2M8 5v3M10 5v2M12 5v3"/></svg>',
  add: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 2v12M2 8h12"/></svg>',
  cube: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/><path d="M2 4.5L8 8l6-3.5M8 8v7"/></svg>',
  camera: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M1 5h9v6H1z"/><path d="M10 7l5-2v6l-5-2z"/></svg>',
  light: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M13 3l-1.4 1.4M4.4 11.6L3 13"/></svg>',
  eye: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M1 8s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4z"/><circle cx="8" cy="8" r="2"/></svg>',
  eyeOff: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 2l12 12M6.5 4.3A8.4 8.4 0 0 1 8 4c4.5 0 7 4 7 4a12 12 0 0 1-2.1 2.4M4 5.5C2.2 6.8 1 8 1 8s2.5 4 7 4c.8 0 1.5-.1 2.2-.3"/></svg>',
  render: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="1" y="2" width="14" height="10"/><path d="M1 9l4-3 3 3 2-2 5 4"/><circle cx="11.5" cy="5" r="1"/></svg>',
  output: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2" y="2" width="12" height="12"/><path d="M5 10l2-4 2 3 1-2 1 3z"/></svg>',
  layers: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1l7 3.5L8 8 1 4.5z"/><path d="M1 8l7 3.5L15 8M1 11.5L8 15l7-3.5"/></svg>',
  scene: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>',
  world: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M2.5 6h11M2.5 10h11"/></svg>',
  object: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/><path d="M2 4.5L8 8l6-3.5M8 8v7"/></svg>',
  wrench: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M10 2a4 4 0 0 0-3.4 6.1L2 12.7 3.3 14l4.6-4.6A4 4 0 0 0 14 6l-2 2-2-2z"/></svg>',
  particles: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="4" cy="4" r="1"/><circle cx="11" cy="3" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="12" cy="11" r="1"/></svg>',
  physics: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="5" r="3"/><path d="M3 14c0-3 2-5 5-5s5 2 5 5"/></svg>',
  constraint: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 4l8 8M12 4l-8 8"/><circle cx="4" cy="4" r="2"/><circle cx="12" cy="12" r="2"/></svg>',
  data: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 3h10v3H3zM3 8h10v3H3zM3 13h10"/></svg>',
  material: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M5 6c2 1 4 1 6 0M5 10c2-1 4-1 6 0"/></svg>',
  texture: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 2h12v12H2z"/><path d="M2 6c2 0 2-2 4-2s2 2 4 2 2-2 4-2M2 10c2 0 2 2 4 2s2-2 4-2 2 2 4 2"/></svg>',
  magnet: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 2v6a4 4 0 0 0 8 0V2M4 6h4M12 6H8"/></svg>',
  overlay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="5"/><path d="M8 1v14M1 8h14"/></svg>',
  wire: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/><path d="M2 4.5L8 8l6-3.5M8 8v7"/></svg>',
  solid: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/></svg>',
  materialShade: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M8 2v12M2 8h12"/></svg>',
  rendered: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="1" y="2" width="14" height="10"/><path d="M1 9l4-3 3 3 2-2 5 4"/></svg>',
  script: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M5 3L1 8l4 5M11 3l4 5-4 5M9 2L7 14"/></svg>',
  nodes: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="1" y="3" width="5" height="4"/><rect x="10" y="9" width="5" height="4"/><path d="M6 5h2a2 2 0 0 1 2 2v4"/></svg>',
  brush: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M9 2l5 5-7 7H2v-5z"/><path d="M7 4l5 5"/></svg>'
};

function icon(name: string, size = 14): string {
  return `<span class="be-svg" style="width:${size}px;height:${size}px;display:inline-grid;place-items:center">${icons[name] ?? icons.object}</span>`;
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="be-app lg-theme-blender" data-workspace="layout">
    <div id="topbar-slot"></div>

    <div class="be-main">
      <div class="be-workspace" id="workspace">
        <section class="be-region be-region--viewport" id="viewport-region">
          <div id="viewport-header-slot"></div>
          <div class="be-viewport-slot" id="viewport-slot"></div>
          <div class="be-toolbar-slot" id="toolbar-slot"></div>
          <aside class="be-sidebar hidden" id="viewport-sidebar"></aside>
        </section>

        <section class="be-region be-region--uv" id="uv-region">
          <div class="be-region-fill" id="uv-editor-slot"></div>
        </section>

        <section class="be-region be-region--nodes" id="nodes-region">
          <div id="nodes-header-slot"></div>
          <div class="be-region-fill" id="node-editor-slot"></div>
        </section>

        <section class="be-region be-region--render" id="render-region">
          <div class="be-region-fill" id="render-editor-slot"></div>
        </section>

        <section class="be-region be-region--preview" id="preview-region">
          <div class="be-region-fill" id="preview-editor-slot"></div>
        </section>

        <section class="be-region be-region--script" id="script-region">
          <div class="be-region-fill" id="script-editor-slot"></div>
        </section>
      </div>

      <div class="be-resizer" id="right-resizer" title="Resize Areas"></div>

      <div class="be-right" id="right-column">
        <section class="be-outliner">
          <div class="be-panel-header">
            ${icon("layers", 14)}
            <span class="be-panel-title">Outliner</span>
            <select class="be-select" id="outliner-mode" style="width:92px;height:24px;flex:0 0 92px"><option>View Layer</option><option>Scenes</option><option>Data API</option></select>
            <input class="be-search" id="outliner-search" placeholder="Search" />
            ${icon("eye", 13)}
          </div>
          <div class="be-tree" id="outliner"></div>
        </section>

        <section class="be-properties">
          <div class="be-prop-tabs" id="prop-tabs"></div>
          <div class="be-prop-content" id="prop-content"></div>
        </section>
      </div>
    </div>

    <div class="be-timeline-slot" id="timeline-slot"></div>
    <div id="statusbar-slot"></div>
  </div>
`;

/* ------------------------------------------------------------------ */
/* data + state                                                        */
/* ------------------------------------------------------------------ */

const objects: ViewportObject[] = [
  { id: "Camera", name: "Camera", type: "camera", loc: [-6.8, -4.6, 4.2], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true },
  { id: "Cube", name: "Cube", type: "mesh", loc: [0, 0, 1], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true },
  { id: "Light", name: "Light", type: "light", loc: [3.8, -1.5, 5.0], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true }
];

const workspaces = [
  "Layout",
  "Modeling",
  "Sculpting",
  "UV Editing",
  "Texture Paint",
  "Shading",
  "Animation",
  "Rendering",
  "Compositing",
  "Geometry Nodes",
  "Scripting"
];

const propertyTabs = [
  { id: "render", icon: "render", title: "Render" },
  { id: "output", icon: "output", title: "Output" },
  { id: "viewlayer", icon: "layers", title: "View Layer" },
  { id: "scene", icon: "scene", title: "Scene" },
  { id: "world", icon: "world", title: "World" },
  { id: "object", icon: "object", title: "Object" },
  { id: "modifiers", icon: "wrench", title: "Modifiers" },
  { id: "particles", icon: "particles", title: "Particles" },
  { id: "physics", icon: "physics", title: "Physics" },
  { id: "constraints", icon: "constraint", title: "Constraints" },
  { id: "data", icon: "data", title: "Object Data" },
  { id: "material", icon: "material", title: "Material" },
  { id: "texture", icon: "texture", title: "Texture" }
];

let selectedId: string | null = "Cube";
let currentWorkspace = "Layout";
let currentMode = "Object Mode";
let currentTool = "select";
let activeProp = "object";
let overlays = true;
let sidebarOpen = false;
let toolbarOpen = true;
let snap = false;
let shading: "wireframe" | "solid" | "material" | "rendered" = "solid";
let frame = 1;
let playing = false;
let statusTimer = 0;
let statusText = "Select with Left Mouse";
let popup: HTMLElement | null = null;
let popupAnchor: HTMLElement | null = null;
let viewport: Viewport;
let timeline: Timeline;
let statusBar: StatusBar;
let viewportHeader: HeaderBar;
let nodesHeader: HeaderBar;
let toolbar: Toolbar;
let textEditor: TextEditor;
let uvEditor: ImageEditor;
let renderEditor: ImageEditor;
let previewEditor: ImageEditor;
let shadingEditor: NodeEditor;
let compositingEditor: NodeEditor;
let geometryEditor: NodeEditor;

const appEl = document.querySelector<HTMLElement>(".be-app")!;
const workspaceEl = document.querySelector<HTMLElement>("#workspace")!;
const rightColumn = document.querySelector<HTMLElement>("#right-column")!;
const mainEl = document.querySelector<HTMLElement>(".be-main")!;
const sidebar = document.querySelector<HTMLElement>("#viewport-sidebar")!;

const isNodeWorkspace = () => ["Shading", "Compositing", "Geometry Nodes"].includes(currentWorkspace);
const hasViewport = () => ["Layout", "Modeling", "Sculpting", "UV Editing", "Texture Paint", "Shading", "Animation", "Geometry Nodes"].includes(currentWorkspace);

function selectedObject(): ViewportObject | undefined {
  return objects.find((object) => object.id === selectedId);
}

function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/* ------------------------------------------------------------------ */
/* status + stats                                                      */
/* ------------------------------------------------------------------ */

const statusBarEl = new StatusBar({
  id: "statusbar",
  className: "be-statusbar",
  left: "Select with Left Mouse",
  accent: "LiteGUI 4.5.17"
});
statusBar = statusBarEl;
statusBar.leftElement.id = "status-left";
document.querySelector("#statusbar-slot")!.appendChild(statusBar.root);

const statsEl = document.createElement("span");
statsEl.className = "lg-status-bar__item";
statsEl.id = "status-stats";
statusBar.rightElement.insertBefore(statsEl, statusBar.rightElement.lastElementChild);

function setStatus(text: string, timeout = 0) {
  statusText = text;
  statusBar.setLeft(text);
  if (statusTimer) window.clearTimeout(statusTimer);
  if (timeout) {
    const expected = text;
    statusTimer = window.setTimeout(() => {
      if (statusText !== expected) return;
      statusText = defaultHint();
      statusBar.setLeft(statusText);
    }, timeout);
  }
}

function defaultHint(): string {
  if (currentWorkspace === "Scripting") return "Ctrl+Enter: Run Script · Tab: Indent · Tabs: Text/Console";
  if (isNodeWorkspace()) return "Drag nodes · Drag a port to connect · Delete: remove node · Wheel: N/A";
  if (currentMode === "Edit Mode") return "Tab: Object Mode · 1/2/3: Vertex/Edge/Face · G/R/S: Transform";
  return "Select LMB · G/R/S · F: Frame Selected · Shift+A: Add · Ctrl+Z: Undo · Tab · N · Space";
}

function updateStats() {
  const faceCount = objects.filter((object) => object.type === "mesh").length * 6;
  const vertCount = objects.filter((object) => object.type === "mesh").length * 8;
  if (statsEl) {
    statsEl.textContent = `Objects: ${objects.length} | Verts: ${vertCount} | Faces: ${faceCount} | Frame: ${timeline ? timeline.frame : frame}`;
  }
}

/* ------------------------------------------------------------------ */
/* history                                                             */
/* ------------------------------------------------------------------ */

interface HistoryEntry {
  objects: ViewportObject[];
  selectedId: string | null;
}
let history: HistoryEntry[] = [];
let future: HistoryEntry[] = [];

function cloneObjects() {
  return objects.map((object) => ({ ...object, loc: [...object.loc], rot: [...object.rot], scale: [...object.scale] }));
}
function snapshot(): HistoryEntry {
  return { objects: cloneObjects(), selectedId };
}
function pushHistory() {
  history.push(snapshot());
  if (history.length > 60) history.shift();
  future = [];
}
function applyHistoryEntry(entry: HistoryEntry) {
  objects.splice(0, objects.length, ...entry.objects.map((object) => ({ ...object, loc: [...object.loc], rot: [...object.rot], scale: [...object.scale] })));
  selectedId = entry.selectedId;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
}
function undo() {
  if (!history.length) {
    setStatus("Nothing to undo", 1200);
    return;
  }
  future.push(snapshot());
  const entry = history.pop()!;
  applyHistoryEntry(entry);
  setStatus("Undo", 1400);
}
function redo() {
  if (!future.length) {
    setStatus("Nothing to redo", 1200);
    return;
  }
  history.push(snapshot());
  const entry = future.pop()!;
  applyHistoryEntry(entry);
  setStatus("Redo", 1400);
}

/* ------------------------------------------------------------------ */
/* popup menus                                                         */
/* ------------------------------------------------------------------ */

interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

function closePopup() {
  popup?.remove();
  popup = null;
  if (popupAnchor) popupAnchor.classList.remove("active");
  popupAnchor = null;
}

function openMenuAt(x: number, y: number, items: MenuItem[]) {
  closePopup();
  const menu = document.createElement("div");
  menu.className = "be-popup";
  for (const item of items) {
    if (item.separator) {
      const sep = document.createElement("div");
      sep.className = "be-popup-sep";
      menu.appendChild(sep);
      continue;
    }
    const row = document.createElement("div");
    row.className = "be-popup-item" + (item.disabled ? " disabled" : "");
    row.innerHTML = `<span>${item.label ?? ""}</span>${item.shortcut ? `<span class="be-shortcut">${item.shortcut}</span>` : ""}`;
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

function openMenuFrom(anchor: HTMLElement, items: MenuItem[]) {
  if (popup && popupAnchor === anchor) {
    closePopup();
    return;
  }
  closePopup();
  const rect = anchor.getBoundingClientRect();
  openMenuAt(rect.left, rect.bottom + 1, items);
  popupAnchor = anchor;
  anchor.classList.add("active");
}

document.addEventListener("mousedown", (event) => {
  if (!popup) return;
  const target = event.target as Node;
  if (popup.contains(target)) return;
  if (popupAnchor && popupAnchor.contains(target)) return;
  closePopup();
});

/* ------------------------------------------------------------------ */
/* top bar                                                             */
/* ------------------------------------------------------------------ */

function createTopButton(label: string, className = "lg-header-bar__button", id = ""): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.innerHTML = label;
  if (id) button.id = id;
  return button;
}

const topbar = new HeaderBar({ id: "topbar", className: "be-topbar", variant: "topbar" });
document.querySelector("#topbar-slot")!.appendChild(topbar.root);

const brand = document.createElement("div");
brand.className = "lg-header-bar__brand be-brand";
brand.title = "Blender";
brand.innerHTML = icon("blender", 18);
topbar.left.appendChild(brand);

const menubar = document.createElement("div");
menubar.className = "be-menubar";
menubar.id = "menubar";
topbar.left.appendChild(menubar);

const topMenus: Array<{ label: string; items: MenuItem[] }> = [
  {
    label: "File",
    items: [
      { label: "New", shortcut: "Ctrl N", action: () => resetScene() },
      { label: "Open...", shortcut: "Ctrl O", action: () => setStatus("Open: 示例文件未接入", 1600) },
      { label: "Revert", action: () => resetScene() },
      { separator: true },
      { label: "Save", shortcut: "Ctrl S", action: () => setStatus("已保存（示例）", 1400) },
      { label: "Save As...", shortcut: "Shift Ctrl S", action: () => setStatus("Save As（示例）", 1400) },
      { separator: true },
      { label: "Import", action: () => setStatus("Import（示例）", 1400) },
      { label: "Export", action: () => setStatus("Export（示例）", 1400) },
      { separator: true },
      { label: "Quit", shortcut: "Ctrl Q", action: () => setStatus("浏览器环境不退出；已拦截 Quit", 1600) }
    ]
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "Ctrl Z", action: undo },
      { label: "Redo", shortcut: "Shift Ctrl Z", action: redo },
      { separator: true },
      { label: "Preferences...", action: () => setStatus("Preferences：示例未接入", 1500) }
    ]
  },
  {
    label: "Render",
    items: [
      { label: "Render Image", shortcut: "F12", action: () => renderImage() },
      { label: "Render Animation", shortcut: "Ctrl F12", action: () => renderImage() },
      { separator: true },
      { label: "View Render", shortcut: "F11", action: () => switchWorkspace("Rendering") }
    ]
  },
  {
    label: "Window",
    items: [
      { label: "Toggle Sidebar", shortcut: "N", action: () => toggleSidebar() },
      { label: "Toggle Toolbar", shortcut: "T", action: () => toggleToolbar() },
      { label: "Toggle Fullscreen", action: () => toggleFullscreen() }
    ]
  },
  {
    label: "Help",
    items: [
      { label: "Manual", action: () => setStatus("Blender Manual: docs.blender.org", 1800) },
      { label: "Tutorials", action: () => setStatus("Tutorials（示例）", 1500) },
      { label: "Report a Bug", action: () => setStatus("Report a Bug（示例）", 1500) },
      { separator: true },
      { label: "About Blender", action: () => setStatus("Blender 4.5.17 LTS · LiteGUI editor mock", 2200) }
    ]
  }
];

for (const menu of topMenus) {
  const button = createTopButton(menu.label, "lg-header-bar__button be-menu-btn");
  button.addEventListener("click", () => openMenuFrom(button, menu.items));
  menubar.appendChild(button);
}

const workspaceTabs = document.createElement("div");
workspaceTabs.className = "lg-header-bar__tabs be-workspace-tabs";
workspaceTabs.id = "workspaces";
topbar.center.appendChild(workspaceTabs);
for (const name of workspaces) {
  const button = createTopButton(name, "lg-header-bar__tab be-workspace-tab" + (name === currentWorkspace ? " lg-header-bar__tab--active active" : ""));
  button.dataset.workspace = name;
  button.addEventListener("click", () => switchWorkspace(name));
  workspaceTabs.appendChild(button);
}

const sceneBtn = createTopButton('<span class="lg-header-bar__dot"></span>Scene <span>▾</span>', "lg-header-bar__button be-scene-btn", "scene-btn");
const viewlayerBtn = createTopButton("ViewLayer <span>▾</span>", "lg-header-bar__button be-scene-btn", "viewlayer-btn");
topbar.right.append(sceneBtn, viewlayerBtn);
sceneBtn.addEventListener("click", () => {
  openMenuFrom(sceneBtn, [
    { label: "Scene", action: () => setStatus("Scene active", 1000) },
    { label: "Scene.001", action: () => setStatus("Scene.001 active", 1000) },
    { separator: true },
    { label: "New Scene", action: () => setStatus("New Scene（示例）", 1200) }
  ]);
});
viewlayerBtn.addEventListener("click", () => {
  openMenuFrom(viewlayerBtn, [
    { label: "ViewLayer", action: () => setStatus("ViewLayer active", 1000) },
    { label: "ViewLayer.001", action: () => setStatus("ViewLayer.001 active", 1000) },
    { separator: true },
    { label: "New View Layer", action: () => setStatus("New View Layer（示例）", 1200) }
  ]);
});

/* ------------------------------------------------------------------ */
/* area header (viewport)                                              */
/* ------------------------------------------------------------------ */

viewportHeader = new HeaderBar({ id: "viewport-header", className: "be-area-header", variant: "area" });
document.querySelector("#viewport-header-slot")!.appendChild(viewportHeader.root);

nodesHeader = new HeaderBar({ id: "nodes-header", className: "be-nodes-header", variant: "area" });
document.querySelector("#nodes-header-slot")!.appendChild(nodesHeader.root);

function areaButton(label: string, menu: string, active = false) {
  const button = createTopButton(label, "lg-header-bar__button be-menu-btn be-area-menu" + (active ? " active" : ""));
  button.dataset.menu = menu;
  return button;
}

function areaIcon(name: string, menu: string, tip: string, active = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "lg-header-bar__icon-button be-icon-btn" + (active ? " active" : "");
  button.dataset.menu = menu;
  button.title = tip;
  button.innerHTML = icon(name, 13);
  return button;
}

function renderHeader() {
  const title = document.createElement("div");
  title.className = "lg-header-bar__title";
  title.innerHTML = `${icon("object", 14)}<span class="lg-header-bar__title-text" title="3D Viewport">3D Viewport</span>`;
  const compact = currentWorkspace === "UV Editing";
  const left = [title, areaButton(`${currentMode} ▾`, "mode"), areaButton("View", "view")];
  if (compact) left.push(areaButton("Add", "add"));
  else left.push(areaButton("Select", "select"), areaButton("Add", "add"), areaButton("Object", "object"));
  viewportHeader.setLeft(left);
  const orientation = createTopButton("Global ▾", "lg-header-bar__button be-scene-btn be-area-menu");
  orientation.dataset.menu = "orient";
  const right = [orientation, areaIcon("magnet", "snap", "Snap", snap)];
  if (!compact) {
    right.push(
      areaIcon("wire", "wire", "Wireframe", shading === "wireframe"),
      areaIcon("solid", "solid", "Solid", shading === "solid"),
      areaIcon("materialShade", "material", "Material Preview", shading === "material"),
      areaIcon("rendered", "rendered", "Rendered", shading === "rendered")
    );
  } else {
    right.push(areaIcon("solid", "solid", "Solid", shading === "solid"));
  }
  right.push(areaIcon("overlay", "overlay", "Overlays", overlays), areaIcon("wrench", "options", "Options"));
  viewportHeader.setRight(right);
  viewportHeader.root.querySelectorAll<HTMLElement>("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => handleAreaMenu(button));
  });
}

function handleAreaMenu(button: HTMLElement) {
  const menu = button.dataset.menu;
  if (menu === "mode") openMenuFrom(button, modeMenu());
  else if (menu === "view") openMenuFrom(button, viewMenu());
  else if (menu === "select") openMenuFrom(button, selectMenu());
  else if (menu === "add") openMenuFrom(button, addMenu());
  else if (menu === "object") openMenuFrom(button, objectMenu());
  else if (menu === "orient") openMenuFrom(button, orientationMenu());
  else if (menu === "snap") {
    snap = !snap;
    renderHeader();
    setStatus(`Snap ${snap ? "on" : "off"}`, 1000);
  } else if (menu === "wire" || menu === "solid" || menu === "material" || menu === "rendered") {
    shading = menu === "wire" ? "wireframe" : menu;
    viewport.setShading(shading);
    renderHeader();
    setStatus(`Viewport shading: ${shading}`, 1000);
  } else if (menu === "overlay") {
    overlays = !overlays;
    viewport.setOverlays(overlays);
    renderHeader();
    setStatus(`Overlays ${overlays ? "on" : "off"}`, 1000);
  } else if (menu === "options") {
    openMenuFrom(button, [
      { label: "Show Gizmo", action: () => setStatus("Gizmo: On", 1000) },
      { label: "Show Grid", action: () => setStatus("Grid: On", 1000) },
      { label: "Show Axes", action: () => setStatus("Axes: On", 1000) },
      { separator: true },
      { label: "Toggle Sidebar", shortcut: "N", action: toggleSidebar }
    ]);
  }
}

function modeMenu(): MenuItem[] {
  return ["Object Mode", "Edit Mode", "Sculpt Mode", "Vertex Paint", "Weight Paint", "Texture Paint"].map((mode) => ({
    label: mode,
    action: () => setMode(mode)
  }));
}

function setMode(mode: string) {
  currentMode = mode;
  const edit = mode === "Edit Mode";
  viewport.setEditMode(edit);
  viewport.setShading(edit ? "wireframe" : shading);
  renderHeader();
  if (edit) setStatus("Edit Mode · 1/2/3: Vertex/Edge/Face · Tab: Object Mode", 1800);
  else setStatus(mode, 1400);
}

function viewMenu(): MenuItem[] {
  return [
    { label: "Frame All", shortcut: "Home", action: () => viewport.frameAll() },
    { label: "Frame Selected", shortcut: "F", action: () => focusSelected() },
    { separator: true },
    { label: "Front", shortcut: "Numpad 1", action: () => { viewport.setView(0, 0, 16.5); setStatus("Front Orthographic", 1000); } },
    { label: "Right", shortcut: "Numpad 3", action: () => { viewport.setView(Math.PI / 2, 0, 16.5); setStatus("Right Orthographic", 1000); } },
    { label: "Top", shortcut: "Numpad 7", action: () => { viewport.setView(0, Math.PI / 2 - 0.01, 16.5); setStatus("Top Orthographic", 1000); } },
    { separator: true },
    { label: "Toggle Sidebar", shortcut: "N", action: toggleSidebar },
    { label: "Toggle Toolbar", shortcut: "T", action: toggleToolbar }
  ];
}

function selectMenu(): MenuItem[] {
  return [
    { label: "All", shortcut: "A", action: () => selectAllObjects() },
    { label: "None", shortcut: "Alt A", action: () => { selectedId = null; renderAll(); viewport.invalidate(); setStatus("Deselect All", 1000); } },
    { label: "Invert", shortcut: "Ctrl I", action: () => invertSelection() }
  ];
}

function addMenu(): MenuItem[] {
  return [
    { label: "Mesh / Cube", shortcut: "Shift A", action: () => addObject("mesh") },
    { label: "Camera", action: () => addObject("camera") },
    { label: "Light", action: () => addObject("light") }
  ];
}

function objectMenu(): MenuItem[] {
  return [
    { label: "Duplicate", shortcut: "Shift D", action: duplicateSelected },
    { label: "Delete", shortcut: "X", action: deleteSelected },
    { label: "Rename", shortcut: "F2", action: renameSelected },
    { separator: true },
    { label: "Frame Selected", action: () => focusSelected() }
  ];
}

function orientationMenu(): MenuItem[] {
  return ["Global", "Local", "Normal", "View", "Gimbal"].map((label) => ({
    label,
    action: () => setStatus(`Transform orientation: ${label}`, 1200)
  }));
}

function selectAllObjects() {
  selectedId = objects.find((object) => object.selectable)?.id ?? null;
  renderAll();
  viewport.invalidate();
  setStatus("Select All (single-selection demo)", 1200);
}

function invertSelection() {
  const candidates = objects.filter((object) => object.selectable && object.id !== selectedId);
  selectedId = candidates[0]?.id ?? null;
  renderAll();
  viewport.invalidate();
  setStatus("Invert Selection (single-selection demo)", 1200);
}

/* ------------------------------------------------------------------ */
/* viewport                                                           */
/* ------------------------------------------------------------------ */

const slot = document.querySelector<HTMLElement>("#viewport-slot")!;
viewport = new Viewport({
  className: "be-viewport",
  objects,
  selected: selectedId,
  overlays,
  sidebarOpen,
  shading,
  editMode: currentMode === "Edit Mode"
});
slot.appendChild(viewport.root);

viewport.on("select", (payload) => {
  const id = (payload ?? null) as string | null;
  selectedId = id;
  renderOutliner();
  renderProperties();
  renderSidebar();
  renderHeader();
  syncTransformFields();
  setStatus(id ? `${id} selected` : "Nothing selected", 1200);
});
viewport.on("status", (text) => setStatus(String(text ?? ""), 6000));
viewport.on("context-menu", (payload) => {
  const { x, y } = payload as { x: number; y: number };
  openContextMenu(x, y);
});
viewport.on("change", () => {
  syncTransformFields();
  updateStats();
  viewport.invalidate();
});

const sidebarToggle = document.createElement("button");
sidebarToggle.className = "be-sidebar-toggle";
sidebarToggle.id = "sidebar-toggle";
sidebarToggle.innerHTML = "‹";
sidebarToggle.title = "Sidebar (N)";
sidebarToggle.addEventListener("click", () => toggleSidebar());
workspaceEl.appendChild(sidebarToggle);

const shortcuts = document.createElement("div");
shortcuts.className = "be-viewport-shortcuts";
shortcuts.innerHTML = "<kbd>N</kbd> Sidebar &nbsp; <kbd>T</kbd> Toolbar &nbsp; <kbd>Tab</kbd> Edit Mode &nbsp; <kbd>F</kbd> Frame &nbsp; <kbd>Shift+A</kbd> Add &nbsp; <kbd>MMB</kbd> Orbit &nbsp; <kbd>Shift+MMB</kbd> Pan &nbsp; <kbd>Wheel</kbd> Zoom";
viewport.root.appendChild(shortcuts);

/* ------------------------------------------------------------------ */
/* toolbar                                                            */
/* ------------------------------------------------------------------ */

const defaultTools = [
  { id: "select", label: "Select Box", icon: icons.select, shortcut: "W" },
  { id: "cursor", label: "Cursor", icon: icons.cursor, shortcut: "Shift Space" },
  { id: "move", label: "Move", icon: icons.move, shortcut: "G" },
  { id: "rotate", label: "Rotate", icon: icons.rotate, shortcut: "R" },
  { id: "scale", label: "Scale", icon: icons.scale, shortcut: "S" },
  { id: "transform", label: "Transform", icon: icons.transform, shortcut: "Shift Space" },
  { id: "annotate", label: "Annotate", icon: icons.annotate, shortcut: "D" },
  { id: "measure", label: "Measure", icon: icons.measure, shortcut: "M" },
  { id: "add", label: "Add", icon: icons.add, shortcut: "Shift A" }
];

const sculptTools = [
  { id: "sculpt-draw", label: "Draw", icon: icons.brush },
  { id: "sculpt-clay", label: "Clay Strips", icon: icons.transform },
  { id: "sculpt-smooth", label: "Smooth", icon: icons.cursor },
  { id: "sculpt-grab", label: "Grab", icon: icons.move },
  { id: "sculpt-mask", label: "Mask", icon: icons.eyeOff },
  { id: "sculpt-add", label: "Add", icon: icons.add }
];

const paintTools = [
  { id: "paint-draw", label: "Draw", icon: icons.brush },
  { id: "paint-clone", label: "Clone", icon: icons.cursor },
  { id: "paint-smudge", label: "Smudge", icon: icons.transform },
  { id: "paint-fill", label: "Fill", icon: icons.solid },
  { id: "paint-add", label: "Add", icon: icons.add }
];

const uvTools = [
  { id: "uv-select", label: "Select", icon: icons.select },
  { id: "uv-move", label: "Move", icon: icons.move },
  { id: "uv-rotate", label: "Rotate", icon: icons.rotate },
  { id: "uv-scale", label: "Scale", icon: icons.scale },
  { id: "uv-add", label: "Add", icon: icons.add }
];

function toolsForWorkspace(name: string) {
  if (name === "Sculpting") return sculptTools;
  if (name === "Texture Paint") return paintTools;
  if (name === "UV Editing") return uvTools;
  return defaultTools;
}

function defaultToolFor(name: string) {
  if (name === "Sculpting") return "sculpt-draw";
  if (name === "Texture Paint") return "paint-draw";
  if (name === "UV Editing") return "uv-select";
  return "select";
}

toolbar = new Toolbar({ id: "viewport-toolbar", className: "be-toolbar", tools: defaultTools, active: "select" });
document.querySelector("#toolbar-slot")!.appendChild(toolbar.root);
toolbar.on("change", (id) => selectTool(String(id)));

function isBrushTool(id: string) {
  return id.startsWith("sculpt-") || id.startsWith("paint-");
}

function selectTool(id: string) {
  currentTool = id;
  toolbar.setActive(id);
  viewport.setBrush(isBrushTool(id) ? id : null);
  const tool = toolsForWorkspace(currentWorkspace).find((item) => item.id === id);
  const label = tool?.label ?? id;
  setStatus(`${label}${isBrushTool(id) ? " brush" : " tool"} active`, 1400);
  if (id === "move" || id === "rotate" || id === "scale") {
    beginTransform(id === "move" ? "translate" : id === "rotate" ? "rotate" : "scale");
  } else if (id === "add" || id === "sculpt-add" || id === "paint-add" || id === "uv-add") {
    openAddMenu(viewportHeader.root.querySelector<HTMLElement>('[data-menu="add"]') ?? viewportHeader.root);
  }
}

function activateToolVisual(id: string) {
  currentTool = id;
  toolbar.setActive(id);
  viewport.setBrush(isBrushTool(id) ? id : null);
}

function applyWorkspaceToolbar(name: string) {
  const tools = toolsForWorkspace(name);
  const active = defaultToolFor(name);
  toolbar.setTools(tools);
  toolbar.setActive(active);
  currentTool = active;
  viewport.setBrush(isBrushTool(active) ? active : null);
}

function toggleToolbar() {
  toolbarOpen = !toolbarOpen;
  toolbar.root.style.display = toolbarOpen ? "" : "none";
  setStatus(`Toolbar ${toolbarOpen ? "shown" : "hidden"}`, 1000);
}

/* ------------------------------------------------------------------ */
/* sidebar                                                             */
/* ------------------------------------------------------------------ */

function axisFields(key: "loc" | "rot" | "scale"): string {
  const object = selectedObject();
  const values = object ? object[key] : [0, 0, 0];
  return ["x", "y", "z"].map((axis, index) => `
    <div class="be-field"><span class="be-axis ${axis}">${axis.toUpperCase()}</span><input data-field="${key}" data-axis="${index}" type="number" step="0.1" value="${values[index].toFixed(2)}" /></div>
  `).join("");
}

function renderSidebar() {
  const object = selectedObject();
  if (!object) {
    sidebar.innerHTML = `<div class="be-sidebar-header"><span>Item</span><span>No active object</span></div><div class="be-panel-note">Select an object to edit its transform.</div>`;
    return;
  }
  sidebar.innerHTML = `
    <div class="be-sidebar-header"><span>Item</span><span>${icon("object", 12)} ${object.name}</span></div>
    <div class="be-sidebar-section">
      <div class="be-sidebar-title">${icon("transform", 12)} Transform</div>
      <div class="be-sidebar-row"><span>Location</span><div class="be-vec">${axisFields("loc")}</div></div>
      <div class="be-sidebar-row"><span>Rotation</span><div class="be-vec">${axisFields("rot")}</div></div>
      <div class="be-sidebar-row"><span>Scale</span><div class="be-vec">${axisFields("scale")}</div></div>
    </div>
    <div class="be-sidebar-section">
      <div class="be-sidebar-title">${icon("camera", 12)} View</div>
      <div class="be-sidebar-row"><span>Local View</span><button class="lg-header-bar__button" data-sidebar-action="local-view">Off</button></div>
      <div class="be-sidebar-row"><span>Camera</span><button class="lg-header-bar__button" data-sidebar-action="camera">View</button></div>
      <div class="be-sidebar-row"><span>Clip Start</span><span>0.01m</span></div>
      <div class="be-sidebar-row"><span>Clip End</span><span>1000m</span></div>
    </div>
    <div class="be-sidebar-section">
      <div class="be-sidebar-title">${icon("overlay", 12)} Overlays</div>
      <div class="be-sidebar-row"><span>Grid</span><span>On</span></div>
      <div class="be-sidebar-row"><span>Gizmo</span><span>On</span></div>
    </div>
  `;
  bindNumericFields(sidebar);
  sidebar.querySelectorAll<HTMLElement>("[data-sidebar-action]").forEach((button) => {
    button.addEventListener("click", () => {
      setStatus(`Sidebar: ${button.dataset.sidebarAction} (demo)`, 1200);
    });
  });
}

function updateSidebarVisibility() {
  sidebar.classList.toggle("hidden", !sidebarOpen);
  sidebarToggle.style.display = hasViewport() ? "" : "none";
  sidebarToggle.classList.toggle("be-sidebar-toggle--open", sidebarOpen);
  sidebarToggle.textContent = sidebarOpen ? "›" : "‹";
}

function toggleSidebar() {
  if (!hasViewport()) {
    setStatus("Sidebar unavailable in this workspace", 1200);
    return;
  }
  sidebarOpen = !sidebarOpen;
  updateSidebarVisibility();
  viewport.setSidebarOpen(sidebarOpen);
  renderSidebar();
  setStatus(`Sidebar ${sidebarOpen ? "shown" : "hidden"}`, 1000);
}

/* ------------------------------------------------------------------ */
/* numeric property editing                                            */
/* ------------------------------------------------------------------ */

function syncTransformFields() {
  const object = selectedObject();
  if (!object) return;
  document.querySelectorAll<HTMLInputElement>("input[data-field]").forEach((input) => {
    const key = input.dataset.field as "loc" | "rot" | "scale";
    const axis = Number(input.dataset.axis);
    if (document.activeElement === input) return;
    input.value = object[key][axis].toFixed(2);
  });
}

function bindNumericFields(root: HTMLElement) {
  root.querySelectorAll<HTMLInputElement>("input[data-field]").forEach((input) => {
    const key = input.dataset.field as "loc" | "rot" | "scale";
    const axis = Number(input.dataset.axis);

    const commit = () => {
      const object = selectedObject();
      if (!object) return;
      const value = Number(input.value);
      if (!Number.isFinite(value)) {
        input.value = object[key][axis].toFixed(2);
        return;
      }
      if (object[key][axis] !== value) {
        pushHistory();
        object[key][axis] = value;
        viewport.invalidate();
        updateStats();
      }
      input.value = value.toFixed(2);
      syncTransformFields();
      renderSidebar();
      renderProperties();
      viewport.invalidate();
      const label = key === "loc" ? "Location" : key === "rot" ? "Rotation" : "Scale";
      setStatus(`${object.name} ${label} ${"XYZ"[axis]} = ${value.toFixed(2)}`, 1800);
    };

    input.addEventListener("change", commit);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        commit();
        input.blur();
        event.preventDefault();
      }
    });

    const axisEl = input.parentElement?.querySelector<HTMLElement>(".be-axis");
    if (!axisEl) return;
    axisEl.addEventListener("pointerdown", (event) => {
      const object = selectedObject();
      if (!object) return;
      event.preventDefault();
      pushHistory();
      const startX = event.clientX;
      const start = object[key][axis];
      const move = (moveEvent: PointerEvent) => {
        const next = start + (moveEvent.clientX - startX) * 0.01;
        object[key][axis] = Number(next.toFixed(2));
        input.value = object[key][axis].toFixed(2);
        syncTransformFields();
        viewport.invalidate();
        updateStats();
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        renderSidebar();
        renderProperties();
        viewport.invalidate();
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });
  });
}

/* ------------------------------------------------------------------ */
/* object operations                                                   */
/* ------------------------------------------------------------------ */

function addObject(type: ViewportObject["type"]) {
  pushHistory();
  const index = objects.filter((object) => object.type === type).length + 1;
  const id = `${type === "mesh" ? "Cube" : type === "camera" ? "Camera" : "Light"}.${index}`;
  objects.push({
    id,
    name: id,
    type,
    loc: [index * 1.8 - 1.5, 0.5, 1],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  });
  selectedId = id;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
  setStatus(`Added ${id}`, 1400);
}

function duplicateSelected() {
  const object = selectedObject();
  if (!object) {
    setStatus("Nothing to duplicate", 1000);
    return;
  }
  pushHistory();
  const copy: ViewportObject = { ...object, id: `${object.id}.copy`, name: `${object.name}.copy`, loc: [object.loc[0] + 1, object.loc[1] + 1, object.loc[2]], rot: [...object.rot], scale: [...object.scale] };
  objects.push(copy);
  selectedId = copy.id;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
  setStatus("Duplicated", 1200);
}

function deleteSelected() {
  const index = objects.findIndex((object) => object.id === selectedId);
  if (index < 0) {
    setStatus("Nothing to delete", 1000);
    return;
  }
  pushHistory();
  const [removed] = objects.splice(index, 1);
  selectedId = objects[0]?.id ?? null;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
  setStatus(`Deleted ${removed.name}`, 1200);
}

function renameSelected() {
  const object = selectedObject();
  if (!object) return;
  const name = window.prompt("Object name", object.name);
  if (!name || name === object.name) return;
  pushHistory();
  object.name = name;
  object.id = name;
  selectedId = name;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
  setStatus(`Renamed to ${name}`, 1200);
}

function toggleSelectedVisibility() {
  const object = selectedObject();
  if (!object) return;
  object.visible = !object.visible;
  viewport.setObjects(objects);
  renderAll();
  viewport.invalidate();
  setStatus(`${object.name} ${object.visible ? "visible" : "hidden"}`, 1000);
}

function focusSelected() {
  if (!selectedObject()) {
    setStatus("Nothing selected", 1000);
    return;
  }
  viewport.focusSelection();
  setStatus(`Focused ${selectedId}`, 1200);
}

function openContextMenu(x: number, y: number) {
  openMenuAt(x, y, [
    { label: "Select", action: () => setStatus("Select tool", 1000) },
    { label: "Add Cube", action: () => addObject("mesh") },
    { separator: true },
    { label: "Duplicate", shortcut: "Shift D", action: duplicateSelected },
    { label: "Rename", action: renameSelected },
    { label: "Delete", shortcut: "X", action: deleteSelected },
    { separator: true },
    { label: "Frame Selected", action: focusSelected }
  ]);
}

function openAddMenu(anchor: HTMLElement) {
  openMenuFrom(anchor, addMenu());
}

/* ------------------------------------------------------------------ */
/* outliner                                                           */
/* ------------------------------------------------------------------ */

const outlinerEl = document.querySelector<HTMLElement>("#outliner")!;
const searchEl = document.querySelector<HTMLInputElement>("#outliner-search")!;

function renderOutliner() {
  const query = searchEl.value.trim().toLowerCase();
  const rows = objects.filter((object) => !query || object.name.toLowerCase().includes(query));
  outlinerEl.innerHTML = `
    <div class="be-tree-row be-tree-row--root" style="padding-left:4px">
      <span class="be-tree-toggle">▾</span>${icon("layers", 13)}<span class="be-tree-name">Scene Collection</span>
    </div>
    ${rows.map((object) => `
      <div class="be-tree-row ${object.id === selectedId ? "selected" : ""} ${object.visible ? "" : "hidden-object"}" data-object="${object.id}" style="padding-left:22px">
        <span class="be-tree-toggle"></span>
        <span class="be-object-icon">${icon(object.type === "mesh" ? "cube" : object.type === "camera" ? "camera" : "light", 14)}</span>
        <span class="be-tree-name">${object.name}</span>
        <button class="be-tree-eye ${object.visible ? "" : "off"}" data-eye="${object.id}" title="Show/Hide">${icon(object.visible ? "eye" : "eyeOff", 13)}</button>
        <button class="be-tree-selectable ${object.selectable ? "" : "off"}" data-selectable="${object.id}" title="Selectable">${icon("cursor", 12)}</button>
      </div>
    `).join("")}
  `;
  outlinerEl.querySelectorAll<HTMLElement>("[data-object]").forEach((row) => {
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      selectedId = row.dataset.object!;
      renderAll();
      viewport.invalidate();
      openMenuAt(event.clientX, event.clientY, [
        { label: "Select", action: () => setStatus(`${selectedId} selected`, 1000) },
        { label: "Duplicate", action: duplicateSelected },
        { label: "Rename", action: renameSelected },
        { label: "Delete", action: deleteSelected },
        { separator: true },
        { label: "Hide", action: toggleSelectedVisibility },
        { label: "Frame Selected", action: focusSelected }
      ]);
    });
    row.addEventListener("click", () => {
      selectedId = row.dataset.object!;
      viewport.setSelected(selectedId);
      renderOutliner();
      renderProperties();
      renderSidebar();
      renderHeader();
      viewport.invalidate();
      syncTransformFields();
      setStatus(`${selectedId} selected`, 1000);
    });
    row.addEventListener("dblclick", () => renameSelected());
  });
  outlinerEl.querySelectorAll<HTMLElement>("[data-eye]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const object = objects.find((item) => item.id === button.dataset.eye);
      if (!object) return;
      object.visible = !object.visible;
      viewport.setObjects(objects);
      renderOutliner();
      renderProperties();
      renderSidebar();
      viewport.invalidate();
      setStatus(`${object.name} ${object.visible ? "visible" : "hidden"}`, 1000);
    });
  });
  outlinerEl.querySelectorAll<HTMLElement>("[data-selectable]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const object = objects.find((item) => item.id === button.dataset.selectable);
      if (!object) return;
      object.selectable = !object.selectable;
      viewport.setObjects(objects);
      renderOutliner();
      setStatus(`${object.name} ${object.selectable ? "selectable" : "locked"}`, 1000);
    });
  });
}

searchEl.addEventListener("input", renderOutliner);
document.querySelector<HTMLSelectElement>("#outliner-mode")!.addEventListener("change", (event) => {
  setStatus(`Outliner mode: ${(event.target as HTMLSelectElement).value}`, 1200);
});

/* ------------------------------------------------------------------ */
/* properties                                                          */
/* ------------------------------------------------------------------ */

const propTabs = document.querySelector<HTMLElement>("#prop-tabs")!;
const propContent = document.querySelector<HTMLElement>("#prop-content")!;
const collapsedPanels = new Set<string>(["Delta Transform"]);

function renderPropTabs() {
  propTabs.innerHTML = propertyTabs.map((tab) => `
    <button class="be-prop-tab ${activeProp === tab.id ? "active" : ""}" data-tab="${tab.id}" title="${tab.title}">${icon(tab.icon, 15)}</button>
  `).join("");
  propTabs.querySelectorAll<HTMLElement>("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeProp = button.dataset.tab!;
      renderProperties();
    });
  });
}

function bindPanelToggles(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".be-prop-title").forEach((title) => {
    title.addEventListener("click", () => {
      const body = title.nextElementSibling as HTMLElement | null;
      if (!body) return;
      const key = title.dataset.panel ?? "";
      const collapsed = body.classList.toggle("collapsed");
      if (collapsed) collapsedPanels.add(key);
      else collapsedPanels.delete(key);
      const chev = title.querySelector<HTMLElement>(".be-chev");
      if (chev) chev.textContent = collapsed ? "▸" : "▾";
    });
  });
}

function panel(title: string, body: string): string {
  const open = !collapsedPanels.has(title);
  return `<div class="be-prop-panel">
    <div class="be-prop-title" data-panel="${title}"><span class="be-chev">${open ? "▾" : "▸"}</span>${title}</div>
    <div class="be-prop-body ${open ? "" : "collapsed"}">${body}</div>
  </div>`;
}

function vecRow(label: string, key: "loc" | "rot" | "scale"): string {
  return `<div class="be-prop-row"><label>${label}</label><div class="be-vec">${axisFields(key)}</div></div>`;
}

function renderProperties() {
  renderPropTabs();
  if (activeProp === "object") {
    const object = selectedObject();
    if (!object) {
      propContent.innerHTML = '<div class="be-panel-note">No active object</div>';
      return;
    }
    propContent.innerHTML = [
      panel("Transform", `${vecRow("Location", "loc")}${vecRow("Rotation", "rot")}${vecRow("Scale", "scale")}`),
      panel("Delta Transform", `${vecRow("Delta Location", "loc")}${vecRow("Delta Rotation", "rot")}${vecRow("Delta Scale", "scale")}`),
      panel("Relations", `<div class="be-prop-row"><label>Parent</label><select class="be-select"><option>Scene Collection</option><option>Camera</option></select></div>`),
      panel("Collections", `<div class="be-prop-row"><label>Collection</label><span>Scene Collection</span></div>`),
      panel("Viewport Display", `<div class="be-prop-row"><label>Display As</label><select class="be-select"><option>Textured</option><option>Solid</option><option>Wire</option></select></div><div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#b8b8b8" data-object-color /></div>`),
      panel("Visibility", `<div class="be-prop-row"><label>Show in Viewport</label><input type="checkbox" ${object.visible ? "checked" : ""} data-visibility /></div><div class="be-prop-row"><label>Selectable</label><input type="checkbox" ${object.selectable ? "checked" : ""} data-selectable-prop /></div>`)
    ].join("");
    bindNumericFields(propContent);
    propContent.querySelector<HTMLInputElement>("[data-visibility]")?.addEventListener("change", (event) => {
      object.visible = (event.target as HTMLInputElement).checked;
      viewport.setObjects(objects);
      renderOutliner();
      renderSidebar();
      setStatus(`${object.name} ${object.visible ? "visible" : "hidden"}`, 1000);
    });
    propContent.querySelector<HTMLInputElement>("[data-selectable-prop]")?.addEventListener("change", (event) => {
      object.selectable = (event.target as HTMLInputElement).checked;
      viewport.setObjects(objects);
      renderOutliner();
      setStatus(`${object.name} ${object.selectable ? "selectable" : "locked"}`, 1000);
    });
    propContent.querySelector<HTMLInputElement>("[data-object-color]")?.addEventListener("input", (event) => {
      setStatus(`Viewport color ${(event.target as HTMLInputElement).value}`, 1000);
    });
  } else if (activeProp === "render") {
    propContent.innerHTML = [
      panel("Render Engine", `<div class="be-prop-row"><label>Engine</label><select class="be-select"><option>EEVEE</option><option>Cycles</option><option>Workbench</option></select></div><div class="be-prop-row"><label></label><button class="be-action-btn" data-render-image>Render Image (F12)</button></div>`),
      panel("Sampling", `<div class="be-prop-row"><label>Render</label><div class="be-field"><input type="number" value="64" /></div></div><div class="be-prop-row"><label>Viewport</label><div class="be-field"><input type="number" value="16" /></div></div>`),
      panel("Resolution", `<div class="be-prop-row"><label>Resolution X</label><div class="be-field"><input type="number" value="1920" /></div></div><div class="be-prop-row"><label>Resolution Y</label><div class="be-field"><input type="number" value="1080" /></div></div><div class="be-prop-row"><label>Frame Rate</label><div class="be-field"><input type="number" value="24" data-fps /></div></div>`),
      panel("Film", `<div class="be-prop-row"><label>Transparent</label><input type="checkbox" /></div>`)
    ].join("");
    propContent.querySelector<HTMLElement>("[data-render-image]")?.addEventListener("click", () => renderImage());
    propContent.querySelector<HTMLInputElement>("[data-fps]")?.addEventListener("change", (event) => {
      const fps = Math.max(1, Number((event.target as HTMLInputElement).value) || 24);
      timeline.setFps(fps);
      setStatus(`Frame rate: ${fps} fps`, 1200);
    });
  } else if (activeProp === "output") {
    propContent.innerHTML = [
      panel("Output", `<div class="be-prop-row"><label>Format</label><select class="be-select"><option>PNG</option><option>JPEG</option><option>OpenEXR</option></select></div><div class="be-prop-row"><label>Color</label><select class="be-select"><option>sRGB</option><option>Filmic</option><option>AgX</option></select></div>`),
      panel("Frame Range", `<div class="be-prop-row"><label>Start</label><div class="be-field"><input type="number" value="${timeline.start}" data-frame-start /></div></div><div class="be-prop-row"><label>End</label><div class="be-field"><input type="number" value="${timeline.end}" data-frame-end /></div></div><div class="be-prop-row"><label>Step</label><div class="be-field"><input type="number" value="1" /></div></div>`)
    ].join("");
    propContent.querySelector<HTMLInputElement>("[data-frame-start]")?.addEventListener("change", (event) => {
      timeline.setRange(Number((event.target as HTMLInputElement).value), timeline.end);
      setStatus(`Frame range ${timeline.start}–${timeline.end}`, 1200);
    });
    propContent.querySelector<HTMLInputElement>("[data-frame-end]")?.addEventListener("change", (event) => {
      timeline.setRange(timeline.start, Number((event.target as HTMLInputElement).value));
      setStatus(`Frame range ${timeline.start}–${timeline.end}`, 1200);
    });
  } else if (activeProp === "world") {
    propContent.innerHTML = [
      panel("Surface", `<div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#252525" /></div><div class="be-prop-row"><label>Strength</label><div class="be-field"><input type="number" value="1.0" step="0.1" /></div></div>`),
      panel("Viewport Display", `<div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#303030" /></div>`)
    ].join("");
  } else if (activeProp === "material") {
    propContent.innerHTML = [
      panel("Surface", `<div class="be-prop-row"><label>Base Color</label><input type="color" class="be-color-input" value="#b8b8b8" /></div><div class="be-prop-row"><label>Metallic</label><div class="be-field"><input type="number" value="0.0" step="0.1" /></div></div><div class="be-prop-row"><label>Roughness</label><div class="be-field"><input type="number" value="0.5" step="0.1" /></div></div>`),
      panel("Settings", `<div class="be-prop-row"><label>Blend Mode</label><select class="be-select"><option>Opaque</option><option>Alpha Blend</option></select></div>`),
      panel("Shader Editor", `<div class="be-panel-note">Switch to the Shading workspace to edit the node tree.</div>`)
    ].join("");
  } else if (activeProp === "modifiers") {
    const geometry = currentWorkspace === "Geometry Nodes";
    propContent.innerHTML = `<div class="be-panel-note">${geometry ? "Geometry Nodes modifier:<br><b>LiteGUI Node Group</b><br><br>Switch to Geometry Nodes workspace to edit the node tree." : "No modifiers on this object."}<br><br><button class="be-action-btn" data-add-modifier>Add Modifier</button></div>`;
    propContent.querySelector<HTMLElement>("[data-add-modifier]")?.addEventListener("click", () => setStatus("Add Modifier (demo)", 1200));
  } else if (activeProp === "data") {
    propContent.innerHTML = [
      panel("UV Maps", `<div class="be-prop-row"><label>Active</label><select class="be-select"><option>UVMap</option></select></div><div class="be-prop-row"><label>UV Sync</label><input type="checkbox" checked /></div>`),
      panel("Geometry Data", `<div class="be-prop-row"><label>Vertices</label><span>8</span></div><div class="be-prop-row"><label>Edges</label><span>12</span></div><div class="be-prop-row"><label>Faces</label><span>6</span></div>`)
    ].join("");
  } else if (activeProp === "scene") {
    propContent.innerHTML = [
      panel("Scene", `<div class="be-prop-row"><label>Camera</label><select class="be-select"><option>Camera</option></select></div><div class="be-prop-row"><label>Units</label><select class="be-select"><option>Metric</option><option>Imperial</option></select></div>`),
      panel("Gravity", `<div class="be-prop-row"><label>Gravity</label><div class="be-vec"><div class="be-field"><input value="0" /></div><div class="be-field"><input value="0" /></div><div class="be-field"><input value="-9.81" /></div></div></div>`)
    ].join("");
  } else {
    const tab = propertyTabs.find((item) => item.id === activeProp);
    propContent.innerHTML = `<div class="be-panel-note">${tab?.title ?? "Properties"} 面板：示例中仅实现核心 Object/Render/Output/World/Material/Data。</div>`;
  }
  bindPanelToggles(propContent);
}

/* ------------------------------------------------------------------ */
/* timeline                                                            */
/* ------------------------------------------------------------------ */

timeline = new Timeline({
  id: "timeline",
  className: "be-timeline",
  start: 1,
  end: 250,
  frame: 1,
  fps: 24,
  keyframes: [1, 60, 120],
  height: "100%",
  canvasId: "timeline-canvas",
  frameInputId: "frame-input",
  startInputId: "start-input",
  endInputId: "end-input",
  onFrameChange: (next) => handleFrame(next)
});
document.querySelector("#timeline-slot")!.appendChild(timeline.root);

timeline.addMenuButton("Playback", (button) => {
  openMenuFrom(button, [
    { label: "Play / Pause", shortcut: "Space", action: () => timeline.togglePlay() },
    { label: "Jump to Start", action: () => timeline.setFrame(timeline.start) },
    { label: "Jump to End", action: () => timeline.setFrame(timeline.end) },
    { separator: true },
    { label: "Insert Keyframe", action: insertKeyframe }
  ]);
});
timeline.addMenuButton("Keying", (button) => {
  openMenuFrom(button, [
    { label: "Insert Keyframe", shortcut: "K", action: insertKeyframe },
    { label: "Delete Keyframe", action: () => { timeline.removeKeyframe(timeline.frame); setStatus(`Deleted keyframe at ${timeline.frame}`, 1200); } }
  ]);
});
timeline.addMenuButton("View", (button) => {
  openMenuFrom(button, [
    { label: "Frame All", shortcut: "Home", action: () => timeline.setRange(1, 250) },
    { label: "Frame Current", action: () => setStatus(`Frame ${timeline.frame}`, 1000) }
  ]);
});
timeline.addMenuButton("Marker", (button) => {
  openMenuFrom(button, [
    { label: "Add Marker", action: () => setStatus(`Marker added at frame ${timeline.frame}`, 1200) },
    { label: "Clear Markers", action: () => setStatus("Markers cleared (demo)", 1200) }
  ]);
});
timeline.on("play", (value) => {
  playing = Boolean(value);
  if (playing) setStatus("Playing", 0);
  else {
    setStatus("Paused", 1200);
    renderProperties();
    updateStats();
  }
});
timeline.on("keyframe", (value) => setStatus(`Keyframe inserted at frame ${value}`, 1200));
timeline.on("range", () => {
  if (activeProp === "output") renderProperties();
  updateStats();
});

function handleFrame(next: number) {
  frame = next;
  const cube = objects.find((object) => object.id === "Cube");
  if (cube) {
    cube.rot[2] = ((frame - timeline.start) / Math.max(1, timeline.end - timeline.start)) * Math.PI * 2;
    viewport.invalidate();
  }
  if (!timeline.playing) setStatus(`Frame ${frame}`, 700);
  updateStats();
}

function setFrame(next: number) {
  timeline.setFrame(next);
}

function togglePlay() {
  timeline.togglePlay();
}

function insertKeyframe() {
  timeline.insertKeyframe(timeline.frame);
}

/* ------------------------------------------------------------------ */
/* node editors                                                        */
/* ------------------------------------------------------------------ */

const nodeGraphs: Record<string, () => { nodes: any[]; links: any[] }> = {
  shading: () => ({
    nodes: [
      { id: "output", title: "Material Output", x: 620, y: 40, color: "#7a4a4a", inputs: [{ id: "surface", name: "Surface" }, { id: "volume", name: "Volume" }] },
      { id: "principled", title: "Principled BSDF", x: 380, y: 30, color: "#5b7d5b", inputs: [{ id: "base", name: "Base Color" }, { id: "rough", name: "Roughness" }], outputs: [{ id: "bsdf", name: "BSDF" }] },
      { id: "ramp", title: "Color Ramp", x: 190, y: 40, color: "#7a6a3a", inputs: [{ id: "fac", name: "Fac" }], outputs: [{ id: "color", name: "Color" }] },
      { id: "noise", title: "Noise Texture", x: 20, y: 40, color: "#5b6a7d", outputs: [{ id: "fac", name: "Fac" }, { id: "color", name: "Color" }] }
    ],
    links: [
      { from: "noise", fromPort: "fac", to: "ramp", toPort: "fac" },
      { from: "ramp", fromPort: "color", to: "principled", toPort: "base" },
      { from: "principled", fromPort: "bsdf", to: "output", toPort: "surface" }
    ]
  }),
  compositing: () => ({
    nodes: [
      { id: "layers", title: "Render Layers", x: 20, y: 40, color: "#4a6a7a", outputs: [{ id: "image", name: "Image" }, { id: "alpha", name: "Alpha" }] },
      { id: "glare", title: "Glare", x: 250, y: 40, color: "#7a6a3a", inputs: [{ id: "image", name: "Image" }], outputs: [{ id: "image", name: "Image" }] },
      { id: "composite", title: "Composite", x: 480, y: 40, color: "#7a4a4a", inputs: [{ id: "image", name: "Image" }] }
    ],
    links: [
      { from: "layers", fromPort: "image", to: "glare", toPort: "image" },
      { from: "glare", fromPort: "image", to: "composite", toPort: "image" }
    ]
  }),
  geometry: () => ({
    nodes: [
      { id: "input", title: "Group Input", x: 20, y: 40, color: "#4a6a7a", outputs: [{ id: "geometry", name: "Geometry" }] },
      { id: "distribute", title: "Distribute Points", x: 230, y: 30, color: "#6a5b7a", inputs: [{ id: "geometry", name: "Geometry" }], outputs: [{ id: "points", name: "Points" }] },
      { id: "instance", title: "Instance on Points", x: 460, y: 30, color: "#6a5b7a", inputs: [{ id: "points", name: "Points" }, { id: "instance", name: "Instance" }], outputs: [{ id: "geometry", name: "Geometry" }] },
      { id: "output", title: "Group Output", x: 690, y: 40, color: "#4a6a5a", inputs: [{ id: "geometry", name: "Geometry" }] }
    ],
    links: [
      { from: "input", fromPort: "geometry", to: "distribute", toPort: "geometry" },
      { from: "distribute", fromPort: "points", to: "instance", toPort: "points" },
      { from: "instance", fromPort: "geometry", to: "output", toPort: "geometry" }
    ]
  })
};

shadingEditor = new NodeEditor({ id: "shading-node-editor", className: "be-node-editor" });
compositingEditor = new NodeEditor({ id: "compositing-node-editor", className: "be-node-editor" });
geometryEditor = new NodeEditor({ id: "geometry-node-editor", className: "be-node-editor" });
for (const editor of [shadingEditor, compositingEditor, geometryEditor]) {
  editor.on("change", () => {
    updateNodeHeader();
    const graph = editor.getGraph();
    setStatus(`Node graph updated · ${graph.nodes.length} nodes · ${graph.links.length} links`, 1200);
  });
  editor.on("select", (id) => {
    if (id) setStatus(`Node selected: ${id}`, 900);
  });
}

function mountNodeEditor() {
  const slot = document.querySelector<HTMLElement>("#node-editor-slot");
  if (!slot) return;
  slot.innerHTML = "";
  const editor = currentNodesEditor();
  if (!editor) return;
  slot.appendChild(editor.root);
  requestAnimationFrame(() => editor.refresh());
}

function currentNodesEditor(): NodeEditor | null {
  if (currentWorkspace === "Shading") return shadingEditor;
  if (currentWorkspace === "Compositing") return compositingEditor;
  if (currentWorkspace === "Geometry Nodes") return geometryEditor;
  return null;
}

function nodeGraphForWorkspace() {
  if (currentWorkspace === "Shading") return nodeGraphs.shading();
  if (currentWorkspace === "Compositing") return nodeGraphs.compositing();
  return nodeGraphs.geometry();
}

function initNodeEditors() {
  shadingEditor.setGraph(nodeGraphs.shading().nodes, nodeGraphs.shading().links);
  compositingEditor.setGraph(nodeGraphs.compositing().nodes, nodeGraphs.compositing().links);
  geometryEditor.setGraph(nodeGraphs.geometry().nodes, nodeGraphs.geometry().links);
  updateNodeHeader();
}

function updateNodeHeader() {
  const editor = currentNodesEditor();
  if (!editor) return;
  const graph = editor.getGraph();
  const title = currentWorkspace === "Shading" ? "Shader Editor" : currentWorkspace === "Compositing" ? "Compositor" : "Geometry Node Editor";
  nodesHeader.setLeft([
    areaButton("View", "node-view"),
    areaButton("Select", "node-select"),
    areaButton("Add", "node-add"),
    areaButton("Node", "node-node")
  ]);
  nodesHeader.setTitle(title, icon("nodes", 14), title);
  const count = document.createElement("span");
  count.className = "lg-header-bar__text";
  count.style.color = "#9a9a9a";
  count.style.padding = "0 6px";
  count.textContent = `${graph.nodes.length} nodes · ${graph.links.length} links`;
  const addButton = createTopButton("Add Node", "lg-header-bar__button");
  addButton.addEventListener("click", () => openNodeAddMenu(editor, addButton));
  nodesHeader.setRight([count, addButton]);
  nodesHeader.root.querySelectorAll<HTMLElement>("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => handleNodeMenu(button, editor));
  });
}

function handleNodeMenu(button: HTMLElement, editor: NodeEditor) {
  const menu = button.dataset.menu;
  if (menu === "node-add") openNodeAddMenu(editor, button);
  else if (menu === "node-select") openMenuFrom(button, [
    { label: "Select All", action: () => setStatus("Select All nodes (demo)", 1000) },
    { label: "Deselect", action: () => { editor.select(null); setStatus("Deselected", 800); } }
  ]);
  else if (menu === "node-node") openMenuFrom(button, [
    { label: "Delete Selected", shortcut: "Delete", action: () => { if (editor.getSelected()) editor.removeNode(editor.getSelected()!); else setStatus("No node selected", 900); } },
    { label: "Duplicate (demo)", action: () => setStatus("Duplicate node (demo)", 900) }
  ]);
  else if (menu === "node-view") openMenuFrom(button, [
    { label: "Frame All", action: () => { editor.refresh(); setStatus("Node graph refreshed", 900); } },
    { label: "Recalculate Links", action: () => { editor.refresh(); setStatus("Links recalculated", 900); } }
  ]);
}

function openNodeAddMenu(editor: NodeEditor, anchor: HTMLElement) {
  const labels = currentWorkspace === "Shading"
    ? ["Noise Texture", "Color Ramp", "Principled BSDF", "Material Output"]
    : currentWorkspace === "Compositing"
      ? ["Render Layers", "Glare", "Color Balance", "Composite"]
      : ["Group Input", "Distribute Points", "Instance on Points", "Join Geometry", "Group Output"];
  openMenuFrom(anchor, labels.map((label) => ({
    label,
    action: () => {
      const count = editor.getNodes().length;
      const id = `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
      editor.addNode({
        id,
        title: label,
        x: 24 + (count % 4) * 190,
        y: 24 + Math.floor(count / 4) * 120,
        color: "#5b6a7d",
        inputs: label.includes("Output") ? [{ id: "in", name: "Input" }] : [{ id: "in", name: "Input" }],
        outputs: label.includes("Output") ? [] : [{ id: "out", name: "Output" }]
      });
      setStatus(`Added node: ${label}`, 1000);
    }
  })));
}

/* ------------------------------------------------------------------ */
/* text editor (Scripting)                                             */
/* ------------------------------------------------------------------ */

const scriptSample = `import bpy

# LiteGUI Blender-style editor demo
cube = bpy.data.objects.get("Cube")
if cube:
    cube.location = (0, 0, 1)
    cube.rotation_euler = (0, 0, 0.0)

print("Hello from Blender-compatible editor")
`;
const consoleSample = `Python 3.11.9 (main, Blender 4.5.17)
>>> import bpy
>>> bpy.context.scene.frame_current
1
>>> # Ctrl+Enter runs the Text tab
`;

textEditor = new TextEditor({
  id: "script-editor",
  className: "be-script-editor",
  language: "Python",
  tabs: [
    { id: "text", label: "Text", value: scriptSample },
    { id: "console", label: "Console", value: consoleSample, readOnly: true }
  ],
  activeTab: "text"
});
document.querySelector("#script-editor-slot")!.appendChild(textEditor.root);
textEditor.on("tab", (id) => {
  setStatus(id === "console" ? "Console tab" : "Text tab", 900);
});
textEditor.on("run", (value: unknown) => {
  const lines = String(value).split("\n").length;
  textEditor.appendTabLine("console", `>>> Run Text (${lines} lines)`);
  textEditor.appendTabLine("console", "Hello from Blender-compatible editor");
  setStatus("Script executed · 0 errors", 2000);
});

/* ------------------------------------------------------------------ */
/* image editors (UV / Rendering / Compositing preview)                */
/* ------------------------------------------------------------------ */

function makeUvImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#1d1d1d";
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    for (let x = 0; x < 512; x += 32) {
      ctx.fillStyle = (x / 32 + y / 32) % 2 === 0 ? "#3a3a3a" : "#303030";
      ctx.fillRect(x, y, 32, 32);
    }
  }
  ctx.strokeStyle = "#4a4a4a";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  const islands = [
    [[34, 470], [160, 470], [160, 360], [34, 360]],
    [[190, 470], [330, 470], [330, 350], [190, 350]],
    [[360, 470], [478, 470], [478, 390], [360, 390]],
    [[34, 330], [150, 330], [150, 240], [34, 240]]
  ];
  for (const island of islands) {
    ctx.beginPath();
    island.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = "rgba(71, 114, 179, 0.22)";
    ctx.fill();
    ctx.strokeStyle = "#7fa7d8";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.fillStyle = "#c8c8c8";
  ctx.font = "14px Inter, sans-serif";
  ctx.fillText("UVMap", 18, 24);
  return canvas.toDataURL("image/png");
}

function makeCompositePreview() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 640, 360);
  gradient.addColorStop(0, "#26354a");
  gradient.addColorStop(0.55, "#6a4a6a");
  gradient.addColorStop(1, "#c07a4a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 640, 360);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.arc(100 + i * 72, 150 + Math.sin(i) * 40, 18 + i * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(20,20,20,0.75)";
  ctx.fillRect(0, 320, 640, 40);
  ctx.fillStyle = "#e8e8e8";
  ctx.font = "14px Inter, sans-serif";
  ctx.fillText("Viewer Node · Composite", 14, 345);
  return canvas.toDataURL("image/png");
}

uvEditor = new ImageEditor({
  id: "uv-editor",
  className: "be-image-editor",
  title: "UV Editor",
  subtitle: "UVMap · 512 × 512",
  src: makeUvImage(),
  checkerboard: true
});
document.querySelector("#uv-editor-slot")!.appendChild(uvEditor.root);

renderEditor = new ImageEditor({
  id: "render-editor",
  className: "be-image-editor",
  title: "Render Result",
  subtitle: "1920 × 1080 · 100%",
  checkerboard: false,
  emptyText: "Press F12 to render"
});
document.querySelector("#render-editor-slot")!.appendChild(renderEditor.root);

previewEditor = new ImageEditor({
  id: "preview-editor",
  className: "be-image-editor",
  title: "Composite Preview",
  subtitle: "Viewer Node",
  src: makeCompositePreview(),
  checkerboard: true
});
document.querySelector("#preview-editor-slot")!.appendChild(previewEditor.root);

for (const editor of [uvEditor, renderEditor, previewEditor]) {
  editor.on("zoom", () => setStatus(`Zoom: ${Math.round(editor.getZoom() * 100)}%`, 1000));
}

/* ------------------------------------------------------------------ */
/* workspaces                                                          */
/* ------------------------------------------------------------------ */

const workspaceProps: Record<string, string> = {
  Layout: "object",
  Modeling: "object",
  Sculpting: "modifiers",
  "UV Editing": "data",
  "Texture Paint": "material",
  Shading: "material",
  Animation: "object",
  Rendering: "render",
  Compositing: "render",
  "Geometry Nodes": "modifiers",
  Scripting: "scene"
};

function switchWorkspace(name: string) {
  if (!workspaces.includes(name)) return;
  currentWorkspace = name;
  closePopup();
  appEl.dataset.workspace = slug(name);
  document.querySelectorAll<HTMLElement>(".be-workspace-tab").forEach((tab) => {
    const active = tab.dataset.workspace === name;
    tab.classList.toggle("active", active);
    tab.classList.toggle("lg-header-bar__tab--active", active);
  });

  activeProp = workspaceProps[name] ?? "object";
  applyWorkspaceToolbar(name);
  renderHeader();
  updateNodeHeader();
  mountNodeEditor();
  renderProperties();
  renderSidebar();
  updateSidebarVisibility();
  updateStats();

  if (name !== "Animation" && timeline.playing) timeline.pause();
  if (name === "Rendering") ensureRenderResult();
  if (name === "Compositing" && !previewEditor.getSource()) previewEditor.setSource(makeCompositePreview());

  requestAnimationFrame(() => {
    timeline.scheduleDraw();
    viewport.invalidate();
    if (name === "UV Editing") uvEditor.fit();
    if (name === "Rendering") renderEditor.fit();
    if (name === "Compositing") previewEditor.fit();
    const editor = currentNodesEditor();
    if (editor) editor.refresh();
  });

  const hints: Record<string, string> = {
    Layout: "Layout workspace",
    Modeling: "Modeling workspace",
    Sculpting: "Sculpting workspace · brush tools in the toolbar",
    "UV Editing": "UV Editing workspace · UV grid + 3D viewport",
    "Texture Paint": "Texture Paint workspace · paint tools",
    Shading: "Shading workspace · Shader Editor",
    Animation: "Animation workspace · timeline expanded",
    Rendering: "Rendering workspace · Render Result",
    Compositing: "Compositing workspace · Compositor + Viewer",
    "Geometry Nodes": "Geometry Nodes workspace · node graph + 3D preview",
    Scripting: "Scripting workspace · Text Editor"
  };
  setStatus(hints[name] ?? name, 1600);
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

let renderingTimer = 0;

function captureViewport(): string {
  const canvas = viewport.canvas;
  if (!canvas || canvas.width <= 32 || canvas.height <= 32) return "";
  return viewport.snapshot();
}

function renderImage() {
  if (renderingTimer) window.clearInterval(renderingTimer);
  let progress = 0;
  setStatus("Rendering... 0%", 0);
  renderingTimer = window.setInterval(() => {
    progress += 20;
    if (progress >= 100) {
      window.clearInterval(renderingTimer);
      renderingTimer = 0;
      viewport.invalidate();
      window.setTimeout(() => {
        const image = captureViewport();
        if (image) renderEditor.setSource(image);
        renderEditor.setTitle("Render Result", "1920 × 1080 · EEVEE");
        setStatus("Render complete: 1920×1080 · EEVEE", 5000);
        if (currentWorkspace === "Rendering") {
          requestAnimationFrame(() => renderEditor.fit());
        }
      }, 60);
    } else {
      setStatus(`Rendering... ${progress}%`, 0);
    }
  }, 120);
}

function ensureRenderResult() {
  if (renderEditor.getSource()) return;
  viewport.invalidate();
  window.setTimeout(() => {
    if (!renderEditor.getSource()) {
      const image = captureViewport();
      if (image) renderEditor.setSource(image);
      renderEditor.setTitle("Render Result", "1920 × 1080 · 100%");
    }
  }, 120);
}

/* ------------------------------------------------------------------ */
/* misc actions                                                        */
/* ------------------------------------------------------------------ */

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function resetScene() {
  objects.splice(0, objects.length,
    { id: "Camera", name: "Camera", type: "camera", loc: [-6.8, -4.6, 4.2], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true },
    { id: "Cube", name: "Cube", type: "mesh", loc: [0, 0, 1], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true },
    { id: "Light", name: "Light", type: "light", loc: [3.8, -1.5, 5.0], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true }
  );
  selectedId = "Cube";
  history = [];
  future = [];
  timeline.setRange(1, 250);
  timeline.setFrame(1);
  viewport.setObjects(objects);
  renderAll();
  viewport.frameAll();
  viewport.invalidate();
  setStatus("New scene", 1400);
}

function beginTransform(kind: "translate" | "rotate" | "scale") {
  if (!selectedObject()) {
    setStatus("No active object to transform", 1200);
    return;
  }
  pushHistory();
  const started = viewport.beginTransform(kind);
  if (!started) history.pop();
}

/* ------------------------------------------------------------------ */
/* keyboard                                                            */
/* ------------------------------------------------------------------ */

function openSearchMenu() {
  const anchor = viewportHeader.root.querySelector<HTMLElement>('[data-menu="add"]') ?? viewportHeader.root;
  openMenuFrom(anchor, [
    { label: "Add Cube", action: () => addObject("mesh") },
    { label: "Add Camera", action: () => addObject("camera") },
    { label: "Add Light", action: () => addObject("light") },
    { separator: true },
    { label: "Frame Selected", action: focusSelected },
    { label: "Frame All", action: () => viewport.frameAll() },
    { label: "Toggle Sidebar", action: toggleSidebar },
    { label: "Render Image", shortcut: "F12", action: () => renderImage() }
  ]);
}

function openAddMenuFromShortcut() {
  const anchor = viewportHeader.root.querySelector<HTMLElement>('[data-menu="add"]') ?? viewportHeader.root;
  openMenuFrom(anchor, addMenu());
}

window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  const inField = target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA";
  const inNodeEditor = Boolean(target.closest(".lg-node-editor"));
  const key = event.key.toLowerCase();
  const mod = event.ctrlKey || event.metaKey;

  if (inField) return;
  if (key === "escape") {
    if (popup) closePopup();
    else viewport.cancelTransform();
    event.preventDefault();
    return;
  }
  if (mod && key === "z") {
    if (event.shiftKey) redo();
    else undo();
    event.preventDefault();
    return;
  }
  if (mod && key === "y") {
    redo();
    event.preventDefault();
    return;
  }
  if (event.key === "F12") {
    renderImage();
    event.preventDefault();
    return;
  }
  if (mod) return;

  if (key === "g") {
    if (inNodeEditor) return;
    activateToolVisual("move");
    beginTransform("translate");
    event.preventDefault();
  } else if (key === "r") {
    if (inNodeEditor) return;
    activateToolVisual("rotate");
    beginTransform("rotate");
    event.preventDefault();
  } else if (key === "s") {
    if (inNodeEditor) return;
    activateToolVisual("scale");
    beginTransform("scale");
    event.preventDefault();
  } else if (key === "tab") {
    if (hasViewport()) {
      setMode(currentMode === "Edit Mode" ? "Object Mode" : "Edit Mode");
    }
    event.preventDefault();
  } else if (key === "n") {
    toggleSidebar();
    event.preventDefault();
  } else if (key === "t") {
    toggleToolbar();
    event.preventDefault();
  } else if (key === "f") {
    if (hasViewport() && !inNodeEditor) focusSelected();
    event.preventDefault();
  } else if (key === " ") {
    if (popup) closePopup();
    if (!timeline.root.offsetParent) {
      setStatus("Timeline hidden in this workspace", 1200);
      event.preventDefault();
      return;
    }
    togglePlay();
    event.preventDefault();
  } else if (key === "enter") {
    viewport.confirmTransform();
    event.preventDefault();
  } else if (key === "delete" || key === "backspace") {
    if (inNodeEditor) return;
    deleteSelected();
    event.preventDefault();
  } else if (key === "x") {
    if (inNodeEditor) return;
    deleteSelected();
    event.preventDefault();
  } else if (event.shiftKey && key === "d") {
    duplicateSelected();
    event.preventDefault();
  } else if (event.shiftKey && key === "a") {
    openAddMenuFromShortcut();
    event.preventDefault();
  } else if (key === "home") {
    viewport.frameAll();
    setStatus("Frame All", 900);
    event.preventDefault();
  } else if (key === "f3") {
    openSearchMenu();
    event.preventDefault();
  } else if (event.code === "Numpad1") {
    viewport.setView(0, 0, 16.5);
    setStatus("Front Orthographic", 1000);
    event.preventDefault();
  } else if (event.code === "Numpad3") {
    viewport.setView(Math.PI / 2, 0, 16.5);
    setStatus("Right Orthographic", 1000);
    event.preventDefault();
  } else if (event.code === "Numpad7") {
    viewport.setView(0, Math.PI / 2 - 0.01, 16.5);
    setStatus("Top Orthographic", 1000);
    event.preventDefault();
  } else if (currentMode === "Edit Mode" && (key === "1" || key === "2" || key === "3")) {
    const element = key === "1" ? "vertex" : key === "2" ? "edge" : "face";
    viewport.setEditElementMode(element);
    setStatus(`Edit select mode: ${element}`, 1000);
    event.preventDefault();
  }
});

/* ------------------------------------------------------------------ */
/* area resizer                                                        */
/* ------------------------------------------------------------------ */

const rightResizer = document.querySelector<HTMLElement>("#right-resizer");
if (rightResizer) {
  rightResizer.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = rightColumn.getBoundingClientRect().width;
    const move = (moveEvent: PointerEvent) => {
      const width = Math.max(250, Math.min(520, startWidth - (moveEvent.clientX - startX)));
      mainEl.style.setProperty("--right-width", `${width}px`);
      timeline.scheduleDraw();
      viewport.invalidate();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      timeline.scheduleDraw();
      viewport.invalidate();
      if (currentWorkspace === "UV Editing") uvEditor.fit();
      if (currentWorkspace === "Rendering") renderEditor.fit();
      if (currentWorkspace === "Compositing") previewEditor.fit();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  });
}

/* ------------------------------------------------------------------ */
/* render glue                                                         */
/* ------------------------------------------------------------------ */

function renderAll() {
  viewport?.setObjects(objects);
  viewport?.setSelected(selectedId);
  renderSidebar();
  renderOutliner();
  renderProperties();
  renderHeader();
  updateNodeHeader();
  updateStats();
  syncTransformFields();
}

/* ------------------------------------------------------------------ */
/* init                                                                */
/* ------------------------------------------------------------------ */

appEl.dataset.workspace = "layout";
initNodeEditors();
applyWorkspaceToolbar(currentWorkspace);
renderHeader();
renderProperties();
renderOutliner();
renderSidebar();
updateSidebarVisibility();
viewport.setObjects(objects);
viewport.setSidebarOpen(sidebarOpen);
setStatus(defaultHint());
updateStats();
timeline.scheduleDraw();
window.addEventListener("resize", () => {
  timeline.scheduleDraw();
  viewport.invalidate();
});
window.setTimeout(() => {
  ensureRenderResult();
  uvEditor.fit();
  previewEditor.fit();
}, 150);
