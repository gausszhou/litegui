// @ts-nocheck
import "@gausszhou/litegui-components/style.css";
import "./editor.css";
import { Viewport, type SceneObject, type Vec3 } from "./viewport";

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
  play: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l9 6-9 6z"/></svg>',
  pause: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h3v12H4zM9 2h3v12H9z"/></svg>',
  start: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h2v12H4zM14 2L6 8l8 6z"/></svg>',
  end: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 2h2v12h-2zM2 2l8 6-8 6z"/></svg>',
  prev: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 2L3 8l8 6z"/></svg>',
  next: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 2l8 6-8 6z"/></svg>',
  magnet: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 2v6a4 4 0 0 0 8 0V2M4 6h4M12 6H8"/></svg>',
  overlay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="5"/><path d="M8 1v14M1 8h14"/></svg>',
  wire: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/><path d="M2 4.5L8 8l6-3.5M8 8v7"/></svg>',
  solid: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l6 3.5v7L8 15 2 11.5v-7z"/></svg>',
  materialShade: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M8 2v12M2 8h12"/></svg>',
  rendered: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="1" y="2" width="14" height="10"/><path d="M1 9l4-3 3 3 2-2 5 4"/></svg>',
  script: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M5 3L1 8l4 5M11 3l4 5-4 5M9 2L7 14"/></svg>'
};

function icon(name: string, size = 14): string {
  return `<span class="be-svg" style="width:${size}px;height:${size}px;display:inline-grid;place-items:center">${icons[name] ?? icons.object}</span>`;
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="be-app lg-theme-blender">
    <header class="be-topbar">
      <div class="be-brand" title="Blender">${icon("blender", 18)}</div>
      <div class="be-menubar" id="menubar"></div>
      <div class="be-workspace-tabs" id="workspaces"></div>
      <div class="be-top-right">
        <button class="be-scene-btn" id="scene-btn"><span class="be-dot"></span>Scene <span>▾</span></button>
        <button class="be-scene-btn" id="viewlayer-btn">ViewLayer <span>▾</span></button>
      </div>
    </header>

    <div class="be-main">
      <div class="be-workspace">
        <div class="be-area">
          <div class="be-area-header" id="viewport-header"></div>
          <div class="be-viewport-slot" id="viewport-slot"></div>
          <div class="be-editor-overlay" id="editor-overlay" hidden></div>
        </div>
      </div>

      <div class="be-resizer" id="right-resizer" title="Resize Areas"></div>

      <div class="be-right">
        <section class="be-outliner">
          <div class="be-panel-header">
            ${icon("layers", 14)}
            <span style="color:#d8d8d8">Outliner</span>
            <select class="be-select" id="outliner-mode" style="width:96px;height:24px;flex:0 0 96px"><option>View Layer</option><option>Scenes</option><option>Data API</option></select>
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

    <div class="be-timeline">
      <div class="be-timeline-header" id="timeline-header"></div>
      <div class="be-timeline-body"><canvas class="be-timeline-canvas" id="timeline-canvas"></canvas></div>
    </div>

    <div class="be-statusbar">
      <div class="be-status-left" id="status-left">Select with Left Mouse</div>
      <div class="be-status-right">
        <span id="status-stats">Objects: 3 | Verts: 8 | Faces: 6</span>
        <span class="accent">LiteGUI 4.5.17</span>
      </div>
    </div>
  </div>
`;

const objects: SceneObject[] = [
  {
    id: "Camera",
    name: "Camera",
    type: "camera",
    loc: [-6.8, -4.6, 4.2],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  },
  {
    id: "Cube",
    name: "Cube",
    type: "mesh",
    loc: [0, 0, 1],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  },
  {
    id: "Light",
    name: "Light",
    type: "light",
    loc: [3.8, -1.5, 5.0],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  }
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
let frameStart = 1;
let frameEnd = 250;
let playing = false;
let playTimer = 0;
let statusTimer = 0;
let statusText = "Select with Left Mouse";
let transformMode: "translate" | "rotate" | "scale" | null = null;
let history: Array<{ id: string; loc: Vec3; rot: Vec3; scale: Vec3 }> = [];
let future: typeof history = [];
let keyframes: number[] = [1, 60, 120];
let viewport: Viewport;
let popup: HTMLElement | null = null;

function selectedObject(): SceneObject | undefined {
  return objects.find((object) => object.id === selectedId);
}

function setStatus(text: string, timeout = 0) {
  statusText = text;
  const el = document.querySelector<HTMLElement>("#status-left");
  if (el) el.textContent = text;
  if (statusTimer) window.clearTimeout(statusTimer);
  if (timeout) {
    statusTimer = window.setTimeout(() => {
      statusText = defaultHint();
      const current = document.querySelector<HTMLElement>("#status-left");
      if (current) current.textContent = statusText;
    }, timeout);
  }
}

function defaultHint(): string {
  if (currentMode === "Edit Mode") return "Tab: Object Mode | 1/2/3: Vertex/Edge/Face";
  return "Select with Left Mouse | G/R/S: Transform | Tab: Edit Mode | N: Sidebar";
}

function updateStats() {
  const stats = document.querySelector<HTMLElement>("#status-stats");
  if (stats) stats.textContent = `Objects: ${objects.length} | Verts: 8 | Faces: 6 | Frame: ${frame}`;
}

function renderAll() {
  viewport?.setObjects(objects);
  renderSidebar();
  renderOutliner();
  renderProperties();
  renderHeader();
  updateStats();
}

function pushHistory() {
  const object = selectedObject();
  if (!object) return;
  history.push({ id: object.id, loc: [...object.loc], rot: [...object.rot], scale: [...object.scale] });
  if (history.length > 40) history.shift();
  future = [];
}

function undo() {
  const entry = history.pop();
  if (!entry) return;
  const object = objects.find((item) => item.id === entry.id);
  if (!object) return;
  future.push({ id: object.id, loc: [...object.loc], rot: [...object.rot], scale: [...object.scale] });
  object.loc = [...entry.loc];
  object.rot = [...entry.rot];
  object.scale = [...entry.scale];
  selectedId = object.id;
  renderAll();
  setStatus("Undo", 1200);
}

function redo() {
  const entry = future.pop();
  if (!entry) return;
  const object = objects.find((item) => item.id === entry.id);
  if (!object) return;
  history.push({ id: object.id, loc: [...object.loc], rot: [...object.rot], scale: [...object.scale] });
  object.loc = [...entry.loc];
  object.rot = [...entry.rot];
  object.scale = [...entry.scale];
  renderAll();
  setStatus("Redo", 1200);
}

/* ---------- popup menus ---------- */

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
  document.querySelectorAll(".be-menu-btn.active").forEach((el) => el.classList.remove("active"));
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
  menu.style.left = `${Math.min(x, window.innerWidth - rect.width - 6)}px`;
  menu.style.top = `${Math.min(y, window.innerHeight - rect.height - 6)}px`;
  popup = menu;
}

function openMenuFrom(anchor: HTMLElement, items: MenuItem[]) {
  const rect = anchor.getBoundingClientRect();
  openMenuAt(rect.left, rect.bottom + 1, items);
  anchor.classList.add("active");
}

document.addEventListener("mousedown", (event) => {
  if (popup && !popup.contains(event.target as Node)) closePopup();
});

/* ---------- topbar ---------- */

const menubar = document.querySelector<HTMLElement>("#menubar")!;
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
      { label: "View Render", shortcut: "F11", action: () => setStatus("Render View（示例）", 1400) }
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
  const button = document.createElement("button");
  button.className = "be-menu-btn";
  button.textContent = menu.label;
  button.addEventListener("click", () => openMenuFrom(button, menu.items));
  menubar.appendChild(button);
}

const workspacesEl = document.querySelector<HTMLElement>("#workspaces")!;
for (const name of workspaces) {
  const button = document.createElement("button");
  button.className = "be-workspace-tab" + (name === currentWorkspace ? " active" : "");
  button.textContent = name;
  button.addEventListener("click", () => switchWorkspace(name));
  workspacesEl.appendChild(button);
}

document.querySelector<HTMLElement>("#scene-btn")?.addEventListener("click", (event) => {
  const button = event.currentTarget as HTMLElement;
  openMenuFrom(button, [
    { label: "Scene", action: () => setStatus("Scene active", 1000) },
    { label: "Scene.001", action: () => setStatus("Scene.001 active", 1000) },
    { separator: true },
    { label: "New Scene", action: () => setStatus("New Scene（示例）", 1200) }
  ]);
});

document.querySelector<HTMLElement>("#viewlayer-btn")?.addEventListener("click", (event) => {
  const button = event.currentTarget as HTMLElement;
  openMenuFrom(button, [
    { label: "ViewLayer", action: () => setStatus("ViewLayer active", 1000) },
    { label: "ViewLayer.001", action: () => setStatus("ViewLayer.001 active", 1000) },
    { separator: true },
    { label: "New View Layer", action: () => setStatus("New View Layer（示例）", 1200) }
  ]);
});

const editorOverlay = document.querySelector<HTMLElement>("#editor-overlay")!;

function hideOverlay() {
  editorOverlay.hidden = true;
  editorOverlay.innerHTML = "";
}

function showScriptingEditor() {
  editorOverlay.hidden = false;
  editorOverlay.innerHTML = `
    <div class="be-script-editor">
      <div class="be-script-header">
        <span class="be-script-tab active">Text</span>
        <span class="be-script-tab">Console</span>
        <span style="margin-left:auto;color:#888">Python · 示例</span>
      </div>
      <div class="be-script-body">
        <div class="be-line-numbers">${Array.from({ length: 18 }, (_, index) => index + 1).join("<br>")}</div>
        <textarea spellcheck="false">import bpy

# LiteGUI Blender-style editor demo
cube = bpy.data.objects.get("Cube")
if cube:
    cube.location = (0, 0, 1)
    cube.rotation_euler = (0, 0, 0.0)

print("Hello from Blender-compatible editor")
</textarea>
      </div>
      <div class="be-script-footer">Ln 1, Col 1 &nbsp;|&nbsp; Python &nbsp;|&nbsp; UTF-8</div>
    </div>
  `;
}

function showRenderResult() {
  editorOverlay.hidden = false;
  const image = viewport.snapshot();
  editorOverlay.innerHTML = `
    <div class="be-image-editor">
      <div class="be-image-header"><span>Render Result</span><span style="margin-left:auto;color:#888">1920 × 1080 · 100%</span></div>
      <div class="be-image-body"><img src="${image}" alt="Render Result" /></div>
    </div>
  `;
}

function switchWorkspace(name: string) {
  currentWorkspace = name;
  document.querySelectorAll(".be-workspace-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.textContent === name);
  });
  const appEl = document.querySelector<HTMLElement>(".be-app");
  if (appEl) appEl.dataset.workspace = name.toLowerCase().replace(/\s+/g, "-");

  if (name === "Scripting") {
    activeProp = "scene";
    renderProperties();
    showScriptingEditor();
    setStatus("Scripting workspace: Text Editor", 1800);
  } else if (name === "Rendering") {
    activeProp = "render";
    renderProperties();
    showRenderResult();
    setStatus("Rendering workspace: Render Result", 1800);
  } else if (name === "Shading") {
    activeProp = "material";
    renderProperties();
    hideOverlay();
    setStatus("Shading workspace: Viewport + Material", 1600);
  } else if (name === "Animation") {
    activeProp = "object";
    renderProperties();
    hideOverlay();
    setStatus("Animation workspace", 1400);
  } else {
    activeProp = "object";
    renderProperties();
    hideOverlay();
    setStatus(`${name} workspace`, 1200);
  }
  renderHeader();
}

/* ---------- viewport ---------- */

const slot = document.querySelector<HTMLElement>("#viewport-slot")!;
viewport = new Viewport(slot, {
  objects,
  getSelected: () => selectedId,
  onSelect: (id) => {
    selectedId = id;
    renderOutliner();
    renderProperties();
    renderHeader();
    setStatus(id ? `${id} selected` : "Nothing selected");
  },
  onStatus: (text) => setStatus(text),
  onContextMenu: (x, y) => openContextMenu(x, y),
  onChange: () => {
    renderOutliner();
    renderProperties();
    viewport.invalidate();
  }
});

const toolbar = document.createElement("div");
toolbar.className = "be-toolbar";
const tools: Array<[string, string, string]> = [
  ["select", "select", "Select Box (W)"],
  ["cursor", "cursor", "Cursor (Shift Space)"],
  ["move", "move", "Move (G)"],
  ["rotate", "rotate", "Rotate (R)"],
  ["scale", "scale", "Scale (S)"],
  ["transform", "transform", "Transform (Shift Space)"],
  ["annotate", "annotate", "Annotate (D)"],
  ["measure", "measure", "Measure (M)"],
  ["add", "add", "Add (Shift A)"]
];
for (const [id, iconName, tip] of tools) {
  const button = document.createElement("button");
  button.className = "be-tool" + (id === currentTool ? " active" : "");
  button.dataset.tool = id;
  button.dataset.tip = tip;
  button.innerHTML = icon(iconName, 15);
  button.title = tip;
  button.addEventListener("click", () => {
    currentTool = id;
    viewport.setTool(id);
    document.querySelectorAll(".be-tool").forEach((tool) => tool.classList.toggle("active", (tool as HTMLElement).dataset.tool === id));
    setStatus(tip, 1400);
    if (id === "move") beginTransform("translate");
    else if (id === "rotate") beginTransform("rotate");
    else if (id === "scale") beginTransform("scale");
    else if (id === "add") openAddMenu(button);
  });
  toolbar.appendChild(button);
}
viewport.root.appendChild(toolbar);

const sidebar = document.createElement("aside");
sidebar.className = "be-sidebar";
sidebar.id = "viewport-sidebar";
viewport.root.appendChild(sidebar);

const sidebarToggle = document.createElement("button");
sidebarToggle.className = "be-icon-btn";
sidebarToggle.innerHTML = icon("layers", 13);
sidebarToggle.title = "Sidebar (N)";
sidebarToggle.style.position = "absolute";
sidebarToggle.style.right = "8px";
sidebarToggle.style.top = "38px";
sidebarToggle.style.zIndex = "4";
sidebarToggle.addEventListener("click", () => toggleSidebar());
viewport.root.appendChild(sidebarToggle);

const shortcuts = document.createElement("div");
shortcuts.className = "be-viewport-shortcuts";
shortcuts.innerHTML = "<kbd>N</kbd> Sidebar &nbsp; <kbd>T</kbd> Toolbar &nbsp; <kbd>Tab</kbd> Edit Mode &nbsp; <kbd>MMB</kbd> Orbit &nbsp; <kbd>Shift+MMB</kbd> Pan &nbsp; <kbd>Wheel</kbd> Zoom";
viewport.root.appendChild(shortcuts);

function renderSidebar() {
  const object = selectedObject();
  sidebar.innerHTML = `
    <div class="be-sidebar-header"><span>Item</span><span>${icon("object", 12)}</span></div>
    <div class="be-sidebar-section">
      <div class="be-sidebar-title">${icon("transform", 12)} Transform</div>
      <div class="be-sidebar-row"><span>Location</span><div class="be-vec">${axisFields("loc")}</div></div>
      <div class="be-sidebar-row"><span>Rotation</span><div class="be-vec">${axisFields("rot")}</div></div>
      <div class="be-sidebar-row"><span>Scale</span><div class="be-vec">${axisFields("scale")}</div></div>
    </div>
    <div class="be-sidebar-section">
      <div class="be-sidebar-title">${icon("camera", 12)} View</div>
      <div class="be-sidebar-row"><span>Local View</span><button class="be-scene-btn">Off</button></div>
      <div class="be-sidebar-row"><span>Camera</span><button class="be-scene-btn">View</button></div>
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
  sidebar.classList.toggle("hidden", !sidebarOpen || !object);
}

function axisFields(key: "loc" | "rot" | "scale"): string {
  const object = selectedObject();
  const values = object ? object[key] : [0, 0, 0];
  return ["x", "y", "z"].map((axis, index) => `
    <div class="be-field"><span class="be-axis ${axis}">${axis.toUpperCase()}</span><input data-field="${key}" data-axis="${index}" type="number" step="0.1" value="${values[index].toFixed(2)}" /></div>
  `).join("");
}

function bindNumericFields(root: HTMLElement) {
  root.querySelectorAll<HTMLInputElement>("input[data-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const object = selectedObject();
      if (!object) return;
      pushHistory();
      const key = input.dataset.field as "loc" | "rot" | "scale";
      const axis = Number(input.dataset.axis);
      const value = Number(input.value);
      if (Number.isFinite(value)) {
        object[key][axis] = value;
        viewport.invalidate();
        updateStats();
        renderProperties();
      }
    });
    const axis = input.parentElement?.querySelector<HTMLElement>(".be-axis");
    if (!axis) return;
    axis.addEventListener("pointerdown", (event) => {
      const object = selectedObject();
      if (!object) return;
      const key = input.dataset.field as "loc" | "rot" | "scale";
      const axisIndex = Number(input.dataset.axis);
      const startX = event.clientX;
      const start = object[key][axisIndex];
      const move = (moveEvent: PointerEvent) => {
        const next = start + (moveEvent.clientX - startX) * 0.01;
        object[key][axisIndex] = Number(next.toFixed(2));
        input.value = object[key][axisIndex].toFixed(2);
        viewport.invalidate();
        renderProperties();
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
      event.preventDefault();
    });
  });
}

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle("hidden", !sidebarOpen);
  viewport.setSidebarOpen(sidebarOpen);
  setStatus(`Sidebar ${sidebarOpen ? "shown" : "hidden"}`, 1000);
}

function toggleToolbar() {
  toolbarOpen = !toolbarOpen;
  toolbar.style.display = toolbarOpen ? "flex" : "none";
  setStatus(`Toolbar ${toolbarOpen ? "shown" : "hidden"}`, 1000);
}

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
  frame = 1;
  history = [];
  future = [];
  renderAll();
  viewport.frameAll();
  setStatus("New scene", 1400);
}

function renderImage() {
  setStatus("Rendering... 0%", 0);
  let progress = 0;
  const timer = window.setInterval(() => {
    progress += 20;
    if (progress >= 100) {
      window.clearInterval(timer);
      setStatus("Render complete: 1920×1080 · EEVEE", 2200);
    } else {
      setStatus(`Rendering... ${progress}%`, 0);
    }
  }, 120);
}

/* ---------- viewport header ---------- */

const viewportHeader = document.querySelector<HTMLElement>("#viewport-header")!;

function renderHeader() {
  viewportHeader.innerHTML = `
    <div class="be-area-title" title="3D Viewport">${icon("object", 14)}</div>
    <button class="be-menu-btn be-area-menu" data-menu="mode">${currentMode} ▾</button>
    <button class="be-menu-btn be-area-menu" data-menu="view">View</button>
    <button class="be-menu-btn be-area-menu" data-menu="select">Select</button>
    <button class="be-menu-btn be-area-menu" data-menu="add">Add</button>
    <button class="be-menu-btn be-area-menu" data-menu="object">Object</button>
    <span class="be-spacer"></span>
    <button class="be-scene-btn" data-menu="orient">Global ▾</button>
    <button class="be-icon-btn ${snap ? "active" : ""}" data-menu="snap" title="Snap">${icon("magnet", 13)}</button>
    <button class="be-icon-btn ${shading === "wireframe" ? "active" : ""}" data-menu="wire" title="Wireframe">${icon("wire", 13)}</button>
    <button class="be-icon-btn ${shading === "solid" ? "active" : ""}" data-menu="solid" title="Solid">${icon("solid", 13)}</button>
    <button class="be-icon-btn ${shading === "material" ? "active" : ""}" data-menu="material" title="Material Preview">${icon("materialShade", 13)}</button>
    <button class="be-icon-btn ${shading === "rendered" ? "active" : ""}" data-menu="rendered" title="Rendered">${icon("rendered", 13)}</button>
    <button class="be-icon-btn ${overlays ? "active" : ""}" data-menu="overlay" title="Overlays">${icon("overlay", 13)}</button>
    <button class="be-icon-btn" data-menu="options" title="Options">${icon("wrench", 13)}</button>
  `;
  viewportHeader.querySelectorAll<HTMLElement>("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => {
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
        shading = menu;
        viewport.setShading(shading);
        renderHeader();
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
    });
  });
}

function modeMenu(): MenuItem[] {
  return ["Object Mode", "Edit Mode", "Sculpt Mode", "Vertex Paint", "Weight Paint", "Texture Paint"].map((mode) => ({
    label: mode,
    action: () => {
      currentMode = mode;
      setStatus(`${mode}`, 1200);
      viewport.setShading(mode === "Edit Mode" ? "wireframe" : shading);
      viewport.setEditMode(mode === "Edit Mode");
      renderHeader();
    }
  }));
}

function viewMenu(): MenuItem[] {
  return [
    { label: "Frame All", shortcut: "Home", action: () => viewport.frameAll() },
    { label: "Frame Selected", shortcut: "Numpad .", action: () => viewport.focusSelection() },
    { separator: true },
    { label: "Front", shortcut: "Numpad 1", action: () => viewport.setView(0, 0, 16.5) },
    { label: "Right", shortcut: "Numpad 3", action: () => viewport.setView(Math.PI / 2, 0, 16.5) },
    { label: "Top", shortcut: "Numpad 7", action: () => viewport.setView(0, Math.PI / 2 - 0.01, 16.5) },
    { separator: true },
    { label: "Toggle Sidebar", shortcut: "N", action: toggleSidebar },
    { label: "Toggle Toolbar", shortcut: "T", action: toggleToolbar }
  ];
}

function selectMenu(): MenuItem[] {
  return [
    { label: "All", shortcut: "A", action: () => setStatus("Select All（示例）", 1000) },
    { label: "None", shortcut: "Alt A", action: () => { selectedId = null; renderAll(); viewport.invalidate(); } },
    { label: "Invert", shortcut: "Ctrl I", action: () => setStatus("Invert Selection（示例）", 1000) }
  ];
}

function addMenu(): MenuItem[] {
  return [
    { label: "Mesh / Cube", action: () => addObject("mesh") },
    { label: "Camera", action: () => addObject("camera") },
    { label: "Light", action: () => addObject("light") }
  ];
}

function objectMenu(): MenuItem[] {
  return [
    { label: "Duplicate", shortcut: "Shift D", action: duplicateSelected },
    { label: "Delete", shortcut: "X", action: deleteSelected },
    { separator: true },
    { label: "Frame Selected", action: () => viewport.focusSelection() }
  ];
}

function orientationMenu(): MenuItem[] {
  return ["Global", "Local", "Normal", "View", "Gimbal"].map((label) => ({
    label,
    action: () => setStatus(`Transform orientation: ${label}`, 1200)
  }));
}

function addObject(type: SceneObject["type"]) {
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
  setStatus(`Added ${id}`, 1400);
}

function duplicateSelected() {
  const object = selectedObject();
  if (!object) return;
  const copy: SceneObject = { ...object, id: `${object.id}.copy`, name: `${object.name}.copy`, loc: [object.loc[0] + 1, object.loc[1] + 1, object.loc[2]], rot: [...object.rot], scale: [...object.scale] };
  objects.push(copy);
  selectedId = copy.id;
  viewport.setObjects(objects);
  renderAll();
  setStatus("Duplicated", 1200);
}

function deleteSelected() {
  const index = objects.findIndex((object) => object.id === selectedId);
  if (index < 0) return;
  const [removed] = objects.splice(index, 1);
  selectedId = objects[0]?.id ?? null;
  viewport.setObjects(objects);
  renderAll();
  setStatus(`Deleted ${removed.name}`, 1200);
}

function openAddMenu(anchor: HTMLElement) {
  openMenuFrom(anchor, addMenu());
}

function openContextMenu(x: number, y: number) {
  openMenuAt(x, y, [
    { label: "Select", action: () => setStatus("Select tool", 1000) },
    { label: "Add Cube", action: () => addObject("mesh") },
    { separator: true },
    { label: "Duplicate", shortcut: "Shift D", action: duplicateSelected },
    { label: "Delete", shortcut: "X", action: deleteSelected },
    { separator: true },
    { label: "Frame Selected", action: () => viewport.focusSelection() }
  ]);
}

function renameSelected() {
  const object = selectedObject();
  if (!object) return;
  const name = window.prompt("Object name", object.name);
  if (!name) return;
  object.name = name;
  object.id = name;
  selectedId = name;
  viewport.setObjects(objects);
  renderAll();
  setStatus(`Renamed to ${name}`, 1200);
}

function toggleSelectedVisibility() {
  const object = selectedObject();
  if (!object) return;
  object.visible = !object.visible;
  viewport.setObjects(objects);
  renderAll();
  setStatus(`${object.name} ${object.visible ? "visible" : "hidden"}`, 1000);
}

/* ---------- outliner ---------- */

const outlinerEl = document.querySelector<HTMLElement>("#outliner")!;
const searchEl = document.querySelector<HTMLInputElement>("#outliner-search")!;

function renderOutliner() {
  const query = searchEl.value.trim().toLowerCase();
  const rows = objects.filter((object) => !query || object.name.toLowerCase().includes(query));
  outlinerEl.innerHTML = `
    <div class="be-tree-row" style="padding-left:4px;color:#ccc">
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
      openMenuAt(event.clientX, event.clientY, [
        { label: "Select", action: () => setStatus(`${selectedId} selected`, 1000) },
        { label: "Duplicate", action: duplicateSelected },
        { label: "Rename", action: () => renameSelected() },
        { label: "Delete", action: deleteSelected },
        { separator: true },
        { label: "Hide", action: () => toggleSelectedVisibility() }
      ]);
    });
    row.addEventListener("click", () => {
      selectedId = row.dataset.object!;
      renderAll();
      viewport.invalidate();
      setStatus(`${selectedId} selected`, 1000);
    });
  });
  outlinerEl.querySelectorAll<HTMLElement>("[data-eye]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const object = objects.find((item) => item.id === button.dataset.eye);
      if (!object) return;
      object.visible = !object.visible;
      viewport.setObjects(objects);
      renderOutliner();
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

/* ---------- properties ---------- */

const propTabs = document.querySelector<HTMLElement>("#prop-tabs")!;
const propContent = document.querySelector<HTMLElement>("#prop-content")!;

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
      body.classList.toggle("collapsed");
      const chev = title.querySelector<HTMLElement>(".be-chev");
      if (chev) chev.textContent = body.classList.contains("collapsed") ? "▸" : "▾";
    });
  });
}

function panel(title: string, body: string, open = true): string {
  return `<div class="be-prop-panel">
    <div class="be-prop-title"><span class="be-chev">${open ? "▾" : "▸"}</span>${title}</div>
    <div class="be-prop-body ${open ? "" : "collapsed"}">${body}</div>
  </div>`;
}

function vecRow(label: string, key: "loc" | "rot" | "scale", step = 0.1): string {
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
      panel("Delta Transform", `${vecRow("Delta Location", "loc")}${vecRow("Delta Rotation", "rot")}${vecRow("Delta Scale", "scale")}`, false),
      panel("Relations", `<div class="be-prop-row"><label>Parent</label><select class="be-select"><option>Scene Collection</option><option>Camera</option></select></div>`),
      panel("Collections", `<div class="be-prop-row"><label>Collection</label><span>Scene Collection</span></div>`),
      panel("Viewport Display", `<div class="be-prop-row"><label>Display As</label><select class="be-select"><option>Textured</option><option>Solid</option><option>Wire</option></select></div><div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#b8b8b8" /></div>`),
      panel("Visibility", `<div class="be-prop-row"><label>Show in Viewport</label><input type="checkbox" ${object.visible ? "checked" : ""} data-visibility /></div>`)
    ].join("");
    bindNumericFields(propContent);
    propContent.querySelector<HTMLInputElement>("[data-visibility]")?.addEventListener("change", (event) => {
      object.visible = (event.target as HTMLInputElement).checked;
      viewport.setObjects(objects);
      renderOutliner();
      setStatus(`${object.name} ${object.visible ? "visible" : "hidden"}`, 1000);
    });
  } else if (activeProp === "render") {
    propContent.innerHTML = [
      panel("Render Engine", `<div class="be-prop-row"><label>Engine</label><select class="be-select"><option>EEVEE</option><option>Cycles</option><option>Workbench</option></select></div>`),
      panel("Sampling", `<div class="be-prop-row"><label>Render</label><div class="be-field"><input type="number" value="64" /></div></div><div class="be-prop-row"><label>Viewport</label><div class="be-field"><input type="number" value="16" /></div></div>`),
      panel("Resolution", `<div class="be-prop-row"><label>Resolution X</label><div class="be-field"><input type="number" value="1920" /></div></div><div class="be-prop-row"><label>Resolution Y</label><div class="be-field"><input type="number" value="1080" /></div></div><div class="be-prop-row"><label>Frame Rate</label><div class="be-field"><input type="number" value="24" /></div></div>`),
      panel("Film", `<div class="be-prop-row"><label>Transparent</label><input type="checkbox" /></div>`)
    ].join("");
  } else if (activeProp === "output") {
    propContent.innerHTML = [
      panel("Output", `<div class="be-prop-row"><label>Format</label><select class="be-select"><option>PNG</option><option>JPEG</option><option>OpenEXR</option></select></div><div class="be-prop-row"><label>Color</label><select class="be-select"><option>sRGB</option><option>Filmic</option><option>AgX</option></select></div>`),
      panel("Frame Range", `<div class="be-prop-row"><label>Start</label><div class="be-field"><input type="number" value="${frameStart}" /></div></div><div class="be-prop-row"><label>End</label><div class="be-field"><input type="number" value="${frameEnd}" /></div></div><div class="be-prop-row"><label>Step</label><div class="be-field"><input type="number" value="1" /></div></div>`)
    ].join("");
  } else if (activeProp === "world") {
    propContent.innerHTML = [
      panel("Surface", `<div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#252525" /></div><div class="be-prop-row"><label>Strength</label><div class="be-field"><input type="number" value="1.0" step="0.1" /></div></div>`),
      panel("Viewport Display", `<div class="be-prop-row"><label>Color</label><input type="color" class="be-color-input" value="#303030" /></div>`)
    ].join("");
  } else if (activeProp === "material") {
    propContent.innerHTML = [
      panel("Surface", `<div class="be-prop-row"><label>Base Color</label><input type="color" class="be-color-input" value="#b8b8b8" /></div><div class="be-prop-row"><label>Metallic</label><div class="be-field"><input type="number" value="0.0" step="0.1" /></div></div><div class="be-prop-row"><label>Roughness</label><div class="be-field"><input type="number" value="0.5" step="0.1" /></div></div>`),
      panel("Settings", `<div class="be-prop-row"><label>Blend Mode</label><select class="be-select"><option>Opaque</option><option>Alpha Blend</option></select></div>`)
    ].join("");
  } else if (activeProp === "modifiers") {
    propContent.innerHTML = `<div class="be-panel-note">No modifiers on this object.<br><br><button class="be-scene-btn">Add Modifier</button></div>`;
  } else if (activeProp === "scene") {
    propContent.innerHTML = [
      panel("Scene", `<div class="be-prop-row"><label>Camera</label><select class="be-select"><option>Camera</option></select></div><div class="be-prop-row"><label>Units</label><select class="be-select"><option>Metric</option><option>Imperial</option></select></div>`),
      panel("Gravity", `<div class="be-prop-row"><label>Gravity</label><div class="be-vec"><div class="be-field"><input value="0" /></div><div class="be-field"><input value="0" /></div><div class="be-field"><input value="-9.81" /></div></div></div>`)
    ].join("");
  } else {
    const tab = propertyTabs.find((item) => item.id === activeProp);
    propContent.innerHTML = `<div class="be-panel-note">${tab?.title ?? "Properties"} 面板：示例中仅实现核心 Object/Render/Output/World/Material。</div>`;
  }
  bindPanelToggles(propContent);
}

/* ---------- timeline ---------- */

const timelineHeader = document.querySelector<HTMLElement>("#timeline-header")!;
const timelineCanvas = document.querySelector<HTMLCanvasElement>("#timeline-canvas")!;
let timelineDragging = false;

function renderTimeline() {
  timelineHeader.innerHTML = `
    <button class="be-menu-btn be-area-menu" data-tl="playback">Playback</button>
    <button class="be-menu-btn be-area-menu" data-tl="keying">Keying</button>
    <button class="be-menu-btn be-area-menu" data-tl="view">View</button>
    <button class="be-menu-btn be-area-menu" data-tl="marker">Marker</button>
    <span class="be-spacer"></span>
    <button class="be-icon-btn" data-tl="start" title="Jump to Start">${icon("start", 12)}</button>
    <button class="be-icon-btn" data-tl="prev" title="Previous Keyframe">${icon("prev", 12)}</button>
    <button class="be-icon-btn" data-tl="play" title="Play (Space)">${icon(playing ? "pause" : "play", 12)}</button>
    <button class="be-icon-btn" data-tl="next" title="Next Keyframe">${icon("next", 12)}</button>
    <button class="be-icon-btn" data-tl="end" title="Jump to End">${icon("end", 12)}</button>
    <div class="be-frame-box"><input id="frame-input" type="number" value="${frame}" /><span>FPS 24</span></div>
    <div class="be-frame-box"><input id="start-input" type="number" value="${frameStart}" /><span>Start</span></div>
    <div class="be-frame-box"><input id="end-input" type="number" value="${frameEnd}" /><span>End</span></div>
  `;
  timelineHeader.querySelectorAll<HTMLElement>("[data-tl]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.tl;
      if (action === "play") togglePlay();
      else if (action === "start") setFrame(frameStart);
      else if (action === "end") setFrame(frameEnd);
      else if (action === "prev") setFrame(Math.max(frameStart, frame - 10));
      else if (action === "next") setFrame(Math.min(frameEnd, frame + 10));
      else if (action === "playback") openMenuFrom(button, [
        { label: "Play", shortcut: "Space", action: togglePlay },
        { label: "Set Start Frame", action: () => setFrame(frameStart) },
        { label: "Set End Frame", action: () => setFrame(frameEnd) }
      ]);
      else if (action === "keying") openMenuFrom(button, [{ label: "Insert Keyframe", action: insertKeyframe }]);
      else if (action === "view") openMenuFrom(button, [{ label: "Frame All", action: () => setFrame(frameStart) }]);
      else if (action === "marker") openMenuFrom(button, [{ label: "Add Marker", action: () => setStatus("Marker added", 1000) }]);
    });
  });
  timelineHeader.querySelector<HTMLInputElement>("#frame-input")?.addEventListener("change", (event) => {
    setFrame(Number((event.target as HTMLInputElement).value));
  });
  timelineHeader.querySelector<HTMLInputElement>("#start-input")?.addEventListener("change", (event) => {
    frameStart = Math.max(1, Number((event.target as HTMLInputElement).value) || 1);
    frame = Math.max(frameStart, frame);
    renderTimeline();
    drawTimeline();
  });
  timelineHeader.querySelector<HTMLInputElement>("#end-input")?.addEventListener("change", (event) => {
    frameEnd = Math.max(frameStart + 1, Number((event.target as HTMLInputElement).value) || 250);
    frame = Math.min(frameEnd, frame);
    renderTimeline();
    drawTimeline();
  });
}

function setFrame(next: number) {
  frame = Math.max(frameStart, Math.min(frameEnd, Math.round(next)));
  const frameInput = document.querySelector<HTMLInputElement>("#frame-input");
  if (frameInput) frameInput.value = String(frame);
  const object = selectedObject();
  if (object && object.id === "Cube") {
    object.rot[2] = ((frame - frameStart) / Math.max(1, frameEnd - frameStart)) * Math.PI * 2;
    viewport.invalidate();
  }
  updateStats();
  renderProperties();
  drawTimeline();
}

function togglePlay() {
  playing = !playing;
  renderTimeline();
  if (playing) {
    playTimer = window.setInterval(() => {
      let next = frame + 1;
      if (next > frameEnd) next = frameStart;
      setFrame(next);
    }, 40);
    setStatus("Playing", 0);
  } else {
    window.clearInterval(playTimer);
    setStatus("Paused", 1200);
  }
}

function insertKeyframe() {
  if (!keyframes.includes(frame)) keyframes.push(frame);
  keyframes.sort((a, b) => a - b);
  setStatus(`Keyframe inserted at frame ${frame}`, 1400);
  drawTimeline();
}

function drawTimeline() {
  const rect = timelineCanvas.parentElement?.getBoundingClientRect();
  if (!rect) return;
  const dpr = window.devicePixelRatio || 1;
  const w = rect.width;
  const h = rect.height;
  timelineCanvas.width = Math.floor(w * dpr);
  timelineCanvas.height = Math.floor(h * dpr);
  timelineCanvas.style.width = `${w}px`;
  timelineCanvas.style.height = `${h}px`;
  const ctx = timelineCanvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#282828";
  ctx.fillRect(0, 0, w, h);

  const left = 0;
  const right = w;
  const top = 0;
  const rulerHeight = 20;
  const usable = right - left;
  const frameToX = (value: number) => left + ((value - frameStart) / Math.max(1, frameEnd - frameStart)) * usable;

  ctx.fillStyle = "#1d1d1d";
  ctx.fillRect(0, 0, w, rulerHeight);
  ctx.strokeStyle = "#3d3d3d";
  ctx.beginPath();
  ctx.moveTo(0, rulerHeight);
  ctx.lineTo(w, rulerHeight);
  ctx.stroke();

  ctx.font = "10px Inter, sans-serif";
  ctx.fillStyle = "#9a9a9a";
  const step = 10;
  for (let value = frameStart; value <= frameEnd; value += step) {
    const x = frameToX(value);
    ctx.strokeStyle = "#3d3d3d";
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.fillText(String(value), x + 3, 13);
  }

  const keyframes = [frameStart, 60, 120, frameEnd].filter((value, index, list) => list.indexOf(value) === index && value >= frameStart && value <= frameEnd);
  for (const value of keyframes) {
    const x = frameToX(value);
    ctx.fillStyle = "#d8b04a";
    ctx.beginPath();
    ctx.moveTo(x, 54);
    ctx.lineTo(x + 5, 59);
    ctx.lineTo(x, 64);
    ctx.lineTo(x - 5, 59);
    ctx.closePath();
    ctx.fill();
  }

  const x = frameToX(frame);
  ctx.strokeStyle = "#4772b3";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, h);
  ctx.stroke();
  ctx.fillStyle = "#4772b3";
  ctx.beginPath();
  ctx.moveTo(x - 5, 0);
  ctx.lineTo(x + 5, 0);
  ctx.lineTo(x, 7);
  ctx.closePath();
  ctx.fill();
}

timelineCanvas.addEventListener("mousedown", (event) => {
  timelineDragging = true;
  updateFrameFromTimeline(event);
});
window.addEventListener("mousemove", (event) => {
  if (timelineDragging) updateFrameFromTimeline(event);
});
window.addEventListener("mouseup", () => { timelineDragging = false; });

function updateFrameFromTimeline(event: MouseEvent) {
  const rect = timelineCanvas.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  setFrame(frameStart + ratio * (frameEnd - frameStart));
}

/* ---------- keyboard ---------- */

window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;
  const key = event.key.toLowerCase();
  if (key === "g") { beginTransform("translate"); event.preventDefault(); }
  else if (key === "r") { beginTransform("rotate"); event.preventDefault(); }
  else if (key === "s") { beginTransform("scale"); event.preventDefault(); }
  else if (key === "tab") {
    currentMode = currentMode === "Edit Mode" ? "Object Mode" : "Edit Mode";
    viewport.setShading(currentMode === "Edit Mode" ? "wireframe" : shading);
    viewport.setEditMode(currentMode === "Edit Mode");
    renderHeader();
    setStatus(`${currentMode}`, 1200);
    event.preventDefault();
  } else if (key === "n") { toggleSidebar(); event.preventDefault(); }
  else if (key === "t") { toggleToolbar(); event.preventDefault(); }
  else if (key === " ") { togglePlay(); event.preventDefault(); }
  else if (key === "escape") { viewport.cancelTransform(); closePopup(); event.preventDefault(); }
  else if (key === "enter") { viewport.confirmTransform(); event.preventDefault(); }
  else if (key === "delete" || key === "x") { deleteSelected(); event.preventDefault(); }
  else if (key === "d" && event.shiftKey) { duplicateSelected(); event.preventDefault(); }
  else if (key === "a" && event.shiftKey) { openAddMenuFromShortcut(); event.preventDefault(); }
  else if (key === "home") { viewport.frameAll(); event.preventDefault(); }
  else if (key === "f3") { openSearchMenu(); event.preventDefault(); }
  else if (event.code === "Numpad1") { viewport.setView(0, 0, 16.5); event.preventDefault(); }
  else if (event.code === "Numpad3") { viewport.setView(Math.PI / 2, 0, 16.5); event.preventDefault(); }
  else if (event.code === "Numpad7") { viewport.setView(0, Math.PI / 2 - 0.01, 16.5); event.preventDefault(); }
});

function beginTransform(kind: "translate" | "rotate" | "scale") {
  transformMode = kind;
  pushHistory();
  viewport.beginTransform(kind);
}

function openAddMenuFromShortcut() {
  const anchor = document.querySelector<HTMLElement>("#viewport-header");
  if (anchor) openMenuFrom(anchor, addMenu());
}

function openSearchMenu() {
  const anchor = document.querySelector<HTMLElement>("#viewport-header");
  if (anchor) {
    openMenuFrom(anchor, [
      { label: "Add Cube", action: () => addObject("mesh") },
      { label: "Add Camera", action: () => addObject("camera") },
      { label: "Add Light", action: () => addObject("light") },
      { separator: true },
      { label: "Toggle Sidebar", action: toggleSidebar },
      { label: "Frame All", action: () => viewport.frameAll() }
    ]);
  }
}

/* ---------- area resizer ---------- */

const rightResizer = document.querySelector<HTMLElement>("#right-resizer");
const mainEl = document.querySelector<HTMLElement>(".be-main");
if (rightResizer && mainEl) {
  rightResizer.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = mainEl.getBoundingClientRect().width - document.querySelector(".be-workspace")!.getBoundingClientRect().width;
    const move = (moveEvent: PointerEvent) => {
      const width = Math.max(250, Math.min(520, startWidth - (moveEvent.clientX - startX)));
      mainEl.style.setProperty("--right-width", `${width}px`);
      drawTimeline();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  });
}

/* ---------- init ---------- */

renderHeader();
renderTimeline();
renderProperties();
renderOutliner();
renderSidebar();
viewport.setObjects(objects);
viewport.setSidebarOpen(sidebarOpen);
sidebar.classList.add("hidden");
setStatus(defaultHint());
updateStats();
drawTimeline();
window.addEventListener("resize", () => drawTimeline());
