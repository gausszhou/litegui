import "@gausszhou/litegui-components/style.css";
import "./style.css";
import { HeaderBar, Toolbar, type ToolbarTool } from "@gausszhou/litegui-components";
import { icon } from "./icons";
import {
  createNeonDocument,
  createObject,
  cloneObject,
  deserializeDocument,
  serializeDocument,
  unionBounds,
  isText,
  paintLabel,
  gradientCss,
  type Paint,
  type Vec2,
  type VecDocument,
  type VecObject
} from "./scene";
import { downloadPng, downloadText, documentSvg, Stage } from "./stage";
import { PanelsController, type AlignMode, type EditorContext, type ScreenRect, type UiState } from "./panels";

interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  checked?: boolean;
}

interface DragState {
  mode: "move" | "resize" | "marquee" | "pan" | "rotate" | "create" | "brush" | null;
  startDoc: Vec2;
  startScreen: Vec2;
  lastScreen: Vec2;
  handleIndex?: string;
  objectId?: string;
  origins: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  startAngle: number;
  moved: boolean;
  historyPushed: boolean;
}

const TOOLS: ToolbarTool[] = [
  { id: "select", label: "Selection", shortcut: "V", icon: icon("select", 17, "vc-tool-svg") },
  { id: "direct", label: "Direct Selection", shortcut: "A", icon: icon("directSelect", 17) },
  { id: "group", label: "Group Selection", icon: icon("groupSelect", 17) },
  { id: "lasso", label: "Lasso", shortcut: "Q", icon: icon("lasso", 17) },
  { id: "pen", label: "Pen", shortcut: "P", icon: icon("pen", 17) },
  { id: "penAdd", label: "Add Anchor Point", icon: icon("penAdd", 17) },
  { id: "penRemove", label: "Delete Anchor Point", icon: icon("penRemove", 17) },
  { id: "anchor", label: "Anchor Point", shortcut: "Shift+C", icon: icon("anchor", 17) },
  { id: "type", label: "Type", shortcut: "T", icon: icon("type", 17) },
  { id: "verticalType", label: "Vertical Type", shortcut: "Shift+T", icon: icon("verticalType", 17) },
  { id: "line", label: "Line Segment", shortcut: "\\", icon: icon("line", 17) },
  { id: "rect", label: "Rectangle", shortcut: "M", icon: icon("rect", 17) },
  { id: "ellipse", label: "Ellipse", shortcut: "L", icon: icon("ellipse", 17) },
  { id: "polygon", label: "Polygon", icon: icon("polygon", 17) },
  { id: "star", label: "Star", icon: icon("star", 17) },
  { id: "brush", label: "Paintbrush", shortcut: "B", icon: icon("brush", 17) },
  { id: "pencil", label: "Pencil", shortcut: "N", icon: icon("pencil", 17) },
  { id: "smooth", label: "Smooth", icon: icon("smooth", 17) },
  { id: "shaper", label: "Shaper", shortcut: "Shift+N", icon: icon("shaper", 17) },
  { id: "pathEraser", label: "Path Eraser", icon: icon("pathEraser", 17) },
  { id: "eraser", label: "Eraser", shortcut: "Shift+E", icon: icon("eraser", 17) },
  { id: "scissors", label: "Scissors", shortcut: "C", icon: icon("scissors", 17) },
  { id: "knife", label: "Knife", icon: icon("knife", 17) },
  { id: "hand", label: "Hand", shortcut: "H", icon: icon("hand", 17) },
  { id: "rotate", label: "Rotate", shortcut: "R", icon: icon("rotate", 17) },
  { id: "zoom", label: "Zoom", shortcut: "Z", icon: icon("zoom", 17) }
];

const RAIL = [
  { id: "properties", title: "Properties", icon: "properties" },
  { id: "layers", title: "Layers", icon: "layers" },
  { id: "libraries", title: "Libraries", icon: "libraries" },
  { id: "appearance", title: "Appearance", icon: "appearance" },
  { id: "color", title: "Color", icon: "color" },
  { id: "gradient", title: "Gradient", icon: "gradient" },
  { id: "opacity", title: "Transparency", icon: "opacity" },
  { id: "transform", title: "Transform", icon: "transform" },
  { id: "symbols", title: "Symbols", icon: "symbols" },
  { id: "align", title: "Align", icon: "align" },
  { id: "pathfinder", title: "Pathfinder", icon: "pathfinder" },
  { id: "effects", title: "Effects", icon: "effects" },
  { id: "artboard", title: "Artboards", icon: "artboard" },
  { id: "guides", title: "Guides", icon: "guides" },
  { id: "measure", title: "Measure", icon: "measure" },
  { id: "comment", title: "Comments", icon: "comment" },
  { id: "history", title: "History", icon: "history" },
  { id: "actions", title: "Actions", icon: "actions" },
  { id: "export", title: "Export", icon: "export" },
  { id: "settings", title: "Settings", icon: "settings" }
];

const TOOL_SHORTCUTS: Record<string, string> = {
  v: "select",
  a: "direct",
  q: "lasso",
  p: "pen",
  t: "type",
  m: "rect",
  l: "ellipse",
  b: "brush",
  n: "pencil",
  c: "scissors",
  h: "hand",
  r: "rotate",
  z: "zoom"
};

const MOUNT = `<div class="vc-app">
  <div class="vc-topbar-slot" id="vc-topbar"></div>
  <div class="vc-body">
    <div class="vc-toolrail-slot" id="vc-toolrail"></div>
    <main class="vc-editor">
      <div class="vc-doctabs">
        <div class="vc-doctab is-active" id="vc-doctab">
          <span class="vc-doctab-icon">${icon("logo", 14)}</span>
          <span class="vc-doctab-title" id="vc-doc-title">neon-drive.vectorcraft</span>
          <span class="vc-doctab-meta" id="vc-doc-meta">@ 100% (RGB/Preview)</span>
          <button class="vc-doctab-close" data-doc-close title="Close document">${icon("close", 11)}</button>
        </div>
        <div class="vc-doctabs-fill"></div>
      </div>
      <div class="vc-viewport" id="vc-viewport">
        <div id="vc-stage"></div>
        <div class="vc-float vc-appearance" id="vc-appearance"></div>
        <div class="vc-ctxbar" id="vc-ctxbar" hidden></div>
        <div class="vc-marquee" id="vc-marquee" hidden></div>
      </div>
    </main>
    <div class="vc-sidebar-wrap">
      <div class="vc-rail" id="vc-rail"></div>
      <aside class="vc-sidebar" id="vc-sidebar"></aside>
    </div>
  </div>
  <footer class="vc-status">
    <div class="vc-status-row vc-status-row--hints">
      <button class="vc-status-info" title="快捷键帮助" data-help>${icon("info", 13)}</button>
      <span class="vc-status-hint" id="vc-hint">Click the object to select</span>
      <span class="vc-spacer"></span>
      <span class="vc-status-mode">RGB / Preview</span>
    </div>
    <div class="vc-status-row vc-status-row--controls">
      <button class="vc-status-btn vc-zoom-btn" id="vc-zoom" title="Zoom level">100%</button>
      <button class="vc-status-btn" id="vc-rotation" title="Rotation">0°</button>
      <span class="vc-status-sep"></span>
      <button class="vc-status-btn vc-icon-only" data-status-action="prev-artboard" title="Previous artboard">${icon("navPrev", 13)}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="fit" title="Fit artboard (Ctrl+0)">${icon("fit", 13)}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="next-artboard" title="Next artboard">${icon("navNext", 13)}</button>
      <span class="vc-status-sep"></span>
      <span class="vc-artboard-chip" id="vc-artboard">1 Artboard 1</span>
      <button class="vc-status-btn vc-icon-only" data-status-action="prev-artboard" title="Previous artboard">${icon("chevronLeft", 12)}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="next-artboard" title="Next artboard">${icon("chevronRight", 12)}</button>
      <span class="vc-select-state" id="vc-selection-state">No Selection</span>
      <span class="vc-spacer"></span>
      <span class="vc-status-stats" id="vc-stats">render 0.0 ms · ul 0.0 ms · 60 fps</span>
    </div>
  </footer>
</div>`;

function formatZoom(zoom: number): string {
  const percent = zoom * 100;
  const rounded = Math.round(percent * 100) / 100;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, "")}%`;
}

class Editor implements EditorContext {
  doc: VecDocument = createNeonDocument();
  ui: UiState = {
    sidebarTab: "properties",
    railActive: "properties",
    showAppearance: true,
    appearanceCollapsed: false,
    showContextBar: true,
    appearancePos: null,
    outlineMode: false,
    showGrid: false,
    showRulers: false
  };
  selection: string[] = ["neon-title"];
  tool = "select";
  private stage!: Stage;
  private panels!: PanelsController;
  private toolbar!: Toolbar;
  private viewport!: HTMLElement;
  private marquee!: HTMLElement;
  private zoomButton!: HTMLButtonElement;
  private hintElement!: HTMLElement;
  private selectionState!: HTMLElement;
  private statsElement!: HTMLElement;
  private rotationButton!: HTMLButtonElement;
  private docMeta!: HTMLElement;
  private history: Array<{ doc: string; selection: string[] }> = [];
  private future: Array<{ doc: string; selection: string[] }> = [];
  private clipboard: VecObject[] | null = null;
  private fileInput!: HTMLInputElement;
  private menu: HTMLElement | null = null;
  private menuAnchor: HTMLElement | null = null;
  private drag: DragState | null = null;
  private spaceDown = false;
  private fillPaint: Paint = "#ffffff";
  private strokePaint: Paint = "#ff3fae";
  private penId: string | null = null;
  private renderTime = 0;
  private uiTime = 0;
  private frames = 0;
  private fps = 60;
  private fpsStamp = performance.now();
  private toastTimer = 0;
  private defaultHint = "Click the object to select | Shift+Click to select multiple objects | Alt+Drag the object to duplicate";

  start() {
    const app = document.querySelector<HTMLElement>("#app");
    if (!app) throw new Error("#app missing");
    app.innerHTML = MOUNT;
    this.viewport = document.querySelector<HTMLElement>("#vc-viewport")!;
    this.marquee = document.querySelector<HTMLElement>("#vc-marquee")!;
    this.zoomButton = document.querySelector<HTMLButtonElement>("#vc-zoom")!;
    this.rotationButton = document.querySelector<HTMLButtonElement>("#vc-rotation")!;
    this.hintElement = document.querySelector<HTMLElement>("#vc-hint")!;
    this.selectionState = document.querySelector<HTMLElement>("#vc-selection-state")!;
    this.statsElement = document.querySelector<HTMLElement>("#vc-stats")!;
    this.docMeta = document.querySelector<HTMLElement>("#vc-doc-meta")!;

    this.buildTopbar();
    this.buildToolRail();
    this.buildRail();
    this.buildStatus();
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.accept = ".vectorcraft,.json,application/json";
    this.fileInput.hidden = true;
    document.body.appendChild(this.fileInput);
    this.fileInput.addEventListener("change", () => this.openFile());

    this.stage = new Stage(this.doc, () => this.onViewChange());
    this.stage.mount(document.querySelector<HTMLElement>("#vc-stage")!);
    this.stage.element.addEventListener("pointerdown", this.onPointerDown);
    this.stage.element.addEventListener("wheel", this.onWheel, { passive: false });
    this.stage.element.addEventListener("dblclick", this.onDoubleClick);
    this.stage.element.addEventListener("contextmenu", this.onContextMenu);

    this.panels = new PanelsController(
      {
        sidebar: document.querySelector<HTMLElement>("#vc-sidebar")!,
        appearance: document.querySelector<HTMLElement>("#vc-appearance")!,
        contextBar: document.querySelector<HTMLElement>("#vc-ctxbar")!,
        viewport: this.viewport
      },
      this
    );

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener(
      "pointerdown",
      event => {
        if (!this.menu) return;
        const target = event.target as Node;
        if (this.menu.contains(target)) return;
        if (this.menuAnchor && this.menuAnchor.contains(target)) return;
        this.closeMenu();
      },
      true
    );
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("resize", () => {
      this.stage.fit(28);
      this.refresh();
    });
    this.hintElement.textContent = this.defaultHint;
    requestAnimationFrame(() => {
      this.stage.fit(28);
      this.refresh();
      this.tickFps();
    });
  }

  /* ------------------------- 外壳 ------------------------- */

  private buildTopbar() {
    const topbar = new HeaderBar({ id: "vc-topbar", className: "vc-topbar", variant: "topbar" });
    topbar.appendTo(document.querySelector<HTMLElement>("#vc-topbar")!);

    const brand = document.createElement("div");
    brand.className = "vc-brand";
    brand.title = "VectorCraft";
    brand.innerHTML = icon("logo", 22);
    topbar.left.appendChild(brand);

    const menubar = document.createElement("nav");
    menubar.className = "vc-menubar";
    menubar.id = "vc-menubar";
    for (const name of ["File", "Edit", "Object", "Type", "Select", "Effect", "View", "Window", "Help"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vc-menu-btn";
      button.dataset.menu = name;
      button.textContent = name;
      button.addEventListener("click", () => this.openMenu(button, this.menus()[name] ?? []));
      menubar.appendChild(button);
    }
    topbar.left.appendChild(menubar);

    const right = document.createElement("div");
    right.className = "vc-topbar-right";
    right.innerHTML = `
      <button class="vc-discord" data-top-action="discord">${icon("discord", 15)}<span>Discord</span></button>
      <button class="vc-top-icon" data-top-action="search" title="Search">${icon("search", 16)}</button>
      <button class="vc-workspace" data-top-action="workspace">Essentials ${icon("chevronDown", 12)}</button>
      <div class="vc-window-controls">
        <button class="vc-window-btn" data-top-action="minimize" title="Minimize">${icon("minimize", 13)}</button>
        <button class="vc-window-btn" data-top-action="maximize" title="Maximize">${icon("maximize", 12)}</button>
        <button class="vc-window-btn vc-window-btn--close" data-top-action="close" title="Close">${icon("close", 12)}</button>
      </div>`;
    right.addEventListener("click", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-top-action]");
      if (!target) return;
      this.runTopAction(target.dataset.topAction ?? "", target);
    });
    topbar.right.appendChild(right);
  }

  private runTopAction(action: string, anchor: HTMLElement) {
    switch (action) {
      case "discord":
        this.toast("Discord 社区：示例未接入");
        break;
      case "search":
        this.toast("搜索命令：示例未接入");
        break;
      case "workspace":
        this.openMenu(
          anchor,
          ["Essentials", "Layout", "Typography", "Painting", "Export"].map(name => ({
            label: name,
            checked: name === "Essentials",
            action: () => this.toast(`Workspace：${name}`)
          }))
        );
        break;
      case "minimize":
        this.toast("浏览器环境无法最小化窗口");
        break;
      case "maximize":
        this.toast("VectorCraft 已全屏显示");
        break;
      case "close":
        this.toast("浏览器环境不关闭标签页");
        break;
      default:
        break;
    }
  }

  private buildToolRail() {
    const host = document.querySelector<HTMLElement>("#vc-toolrail")!;
    this.toolbar = new Toolbar({
      id: "vc-toolrailbar",
      className: "vc-toolrail",
      orientation: "vertical",
      tools: TOOLS,
      active: "select"
    });
    this.toolbar.appendTo(host);
    this.toolbar.on("change", payload => this.setTool(String(payload)));

    const swatches = document.createElement("div");
    swatches.className = "vc-swatches";
    swatches.innerHTML = `
      <div class="vc-colorstack" title="Fill">
        <button class="vc-colorstack-fill" data-swatch="fill" aria-label="Fill"></button>
        <button class="vc-colorstack-stroke" data-swatch="stroke" aria-label="Stroke"></button>
      </div>
      <button class="vc-mini-btn vc-swatch-swap" data-swatch="swap" title="Swap Fill and Stroke (Shift+X)">${icon("transform", 12)}</button>
      <button class="vc-mini-btn vc-swatch-default" data-swatch="default" title="Default Fill and Stroke (D)">${icon("rect", 12)}</button>
      <button class="vc-mini-btn vc-swatch-screen" data-swatch="screen" title="Screen Mode">${icon("target", 13)}</button>`;
    swatches.addEventListener("click", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-swatch]");
      if (!target) return;
      this.onSwatchAction(target.dataset.swatch ?? "");
    });
    this.toolbar.root.appendChild(swatches);
  }

  private buildRail() {
    const rail = document.querySelector<HTMLElement>("#vc-rail")!;
    rail.innerHTML = `
      <div class="vc-rail-group">
        ${RAIL.slice(0, 19)
          .map(
            item =>
              `<button class="vc-rail-btn" data-rail="${item.id}" title="${item.title}">${icon(item.icon, 18)}</button>`
          )
          .join("")}
      </div>
      <div class="vc-rail-foot">
        <button class="vc-rail-btn" data-rail="settings" title="Settings">${icon("settings", 18)}</button>
        <button class="vc-rail-btn" data-rail="help" title="Help">${icon("help", 18)}</button>
        <button class="vc-rail-btn" data-rail="pointer" title="Selection">${icon("pointer", 18)}</button>
      </div>`;
    rail.addEventListener("click", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-rail]");
      if (target?.dataset.rail) this.onRailAction(target.dataset.rail, target);
    });
    this.syncRail();
  }

  private syncRail() {
    const rail = document.querySelector<HTMLElement>("#vc-rail")!;
    rail.querySelectorAll<HTMLElement>("[data-rail]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.rail === this.ui.railActive);
    });
  }

  private onRailAction(id: string, anchor: HTMLElement) {
    if (id === "properties" || id === "layers" || id === "libraries") {
      this.ui.sidebarTab = id;
      this.ui.railActive = id;
      this.panels.renderSidebar();
      this.syncRail();
      return;
    }
    switch (id) {
      case "appearance":
        this.ui.showAppearance = !this.ui.showAppearance;
        this.ui.railActive = id;
        this.panels.renderAppearance();
        this.syncRail();
        break;
      case "color":
      case "gradient":
        this.ui.railActive = id;
        this.syncRail();
        this.panels.openColorPicker("fill", anchor);
        break;
      case "align":
        this.ui.sidebarTab = "properties";
        this.ui.railActive = "properties";
        this.panels.renderSidebar();
        this.syncRail();
        this.panels.scrollToAlign();
        break;
      case "effects":
        this.toggleGlow();
        break;
      case "export":
        void this.exportPng();
        break;
      case "help":
        this.showShortcuts();
        break;
      case "history":
        this.toast(`History：${this.history.length} 步可撤销`);
        break;
      case "settings":
        this.toast("Settings：示例未接入");
        break;
      default:
        this.toast(`${id}：面板示例未接入`);
        break;
    }
  }

  private buildStatus() {
    document.querySelector(".vc-status")!.addEventListener("click", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-status-action]");
      if (!target) return;
      const action = target.dataset.statusAction;
      if (action === "fit") this.zoomFit();
      else if (action === "prev-artboard" || action === "next-artboard") this.toast("只有一个画板");
    });
    document.querySelector("[data-help]")?.addEventListener("click", () => this.showShortcuts());
    this.zoomButton.addEventListener("click", () => {
      this.openMenu(this.zoomButton, [
        { label: "Zoom In", shortcut: "Ctrl++", action: () => this.zoomBy(1.25) },
        { label: "Zoom Out", shortcut: "Ctrl+-", action: () => this.zoomBy(0.8) },
        { separator: true },
        { label: "Fit Artboard", shortcut: "Ctrl+0", action: () => this.zoomFit() },
        { label: "Actual Size", shortcut: "Ctrl+1", action: () => this.setZoomPercent(100) },
        { separator: true },
        ...[400, 200, 100, 66.67, 50, 25].map(value => ({
          label: `${value}%`,
          checked: Math.abs(this.stage.zoomLevel * 100 - value) < 0.01,
          action: () => this.setZoomPercent(value)
        }))
      ]);
    });
  }

  /* ------------------------- 菜单 ------------------------- */

  private menus(): Record<string, MenuItem[]> {
    return {
      File: [
        { label: "New", shortcut: "Ctrl N", action: () => this.newDocument() },
        { label: "Open…", shortcut: "Ctrl O", action: () => this.fileInput.click() },
        { label: "Revert", action: () => this.newDocument() },
        { separator: true },
        { label: "Save", shortcut: "Ctrl S", action: () => this.saveDocument() },
        { label: "Save As…", action: () => this.saveDocument() },
        { separator: true },
        { label: "Export SVG…", action: () => this.exportSvg() },
        { label: "Export PNG…", shortcut: "Alt Shift P", action: () => void this.exportPng() },
        { separator: true },
        { label: "Document Setup…", action: () => this.toast("Document Setup：800 × 1000 pt · 72 ppi · RGB") },
        { label: "Print…", shortcut: "Ctrl P", action: () => this.toast("Print：示例未接入") }
      ],
      Edit: [
        { label: "Undo", shortcut: "Ctrl Z", action: () => this.undo() },
        { label: "Redo", shortcut: "Shift Ctrl Z", action: () => this.redo() },
        { separator: true },
        { label: "Cut", shortcut: "Ctrl X", action: () => this.cutSelection() },
        { label: "Copy", shortcut: "Ctrl C", action: () => this.copySelection() },
        { label: "Paste", shortcut: "Ctrl V", action: () => this.pasteSelection() },
        { separator: true },
        { label: "Delete", shortcut: "Del", action: () => this.deleteSelection() },
        { label: "Duplicate", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
        { separator: true },
        { label: "Keyboard Shortcuts…", action: () => this.showShortcuts() }
      ],
      Object: [
        { label: "Transform Again", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
        { label: "Rotate 90° CW", action: () => this.rotateSelection(90) },
        { label: "Rotate 90° CCW", action: () => this.rotateSelection(-90) },
        { separator: true },
        { label: "Arrange: Bring to Front", shortcut: "Shift Ctrl ]", action: () => this.bringToFront() },
        { label: "Arrange: Send to Back", shortcut: "Shift Ctrl [", action: () => this.sendToBack() },
        { separator: true },
        { label: "Lock", shortcut: "Ctrl 2", action: () => this.selection.forEach(id => this.toggleLock(id)) },
        { label: "Unlock All", shortcut: "Alt Ctrl 2", action: () => this.doc.objects.forEach(object => (object.locked = false)) },
        { label: "Hide", shortcut: "Ctrl 3", action: () => this.selection.forEach(id => this.toggleVisibility(id)) },
        { separator: true },
        { label: "Group", shortcut: "Ctrl G", action: () => this.toast("Group：示例未接入（对象已按图层顺序绘制）") },
        { label: "Ungroup", shortcut: "Shift Ctrl G", action: () => this.toast("Ungroup：示例未接入") }
      ],
      Type: [
        { label: "Create Outlines", shortcut: "Shift Ctrl O", action: () => this.outlineSelection() },
        { label: "Font Size Increase", shortcut: "Ctrl Shift >", action: () => this.stepFontSize(4) },
        { label: "Font Size Decrease", shortcut: "Ctrl Shift <", action: () => this.stepFontSize(-4) },
        { separator: true },
        { label: "Align Center", action: () => this.updateSelection({ align: "center" }, true) },
        { label: "Reset Tracking", action: () => this.updateSelection({ letterSpacing: 0 }, true) },
        { separator: true },
        { label: "Edit Text…", action: () => this.editPrimaryText() }
      ],
      Select: [
        { label: "All", shortcut: "Ctrl A", action: () => this.selectAll() },
        { label: "Deselect", shortcut: "Ctrl Shift A", action: () => this.select([]) },
        { separator: true },
        { label: "Same: Fill Color", action: () => this.selectSameFill() },
        { label: "Inverse", action: () => this.selectInverse() },
        { label: "Next Object Below", shortcut: "Ctrl Alt ]", action: () => this.selectNextObject(1) },
        { label: "Next Object Above", shortcut: "Ctrl Alt [", action: () => this.selectNextObject(-1) }
      ],
      Effect: [
        { label: "Outer Glow", checked: (this.primaryObject()?.glow ?? 0) > 0, action: () => this.toggleGlow() },
        { label: "Remove All Effects", action: () => this.updateSelection({ glow: 0 }, true) },
        { separator: true },
        { label: "Drop Shadow…", action: () => this.toast("Drop Shadow：示例未接入") },
        { label: "Gaussian Blur…", action: () => this.toast("Gaussian Blur：示例未接入") }
      ],
      View: [
        { label: "Zoom In", shortcut: "Ctrl +", action: () => this.zoomBy(1.25) },
        { label: "Zoom Out", shortcut: "Ctrl -", action: () => this.zoomBy(0.8) },
        { label: "Fit Artboard", shortcut: "Ctrl 0", action: () => this.zoomFit() },
        { label: "Actual Size", shortcut: "Ctrl 1", action: () => this.setZoomPercent(100) },
        { label: "Zoom to Selection", shortcut: "Ctrl 2", action: () => this.zoomToSelection() },
        { separator: true },
        { label: "Show Rulers", shortcut: "Ctrl R", checked: this.ui.showRulers, action: () => this.toggleRulers() },
        { label: "Show Grid", shortcut: "Ctrl '", checked: this.ui.showGrid, action: () => this.toggleGrid() },
        { label: "Outline Mode", shortcut: "Ctrl Y", checked: this.ui.outlineMode, action: () => this.toggleOutlineMode() }
      ],
      Window: [
        { label: "Properties", action: () => this.focusSidebar("properties") },
        { label: "Layers", action: () => this.focusSidebar("layers") },
        { label: "Libraries", action: () => this.focusSidebar("libraries") },
        { separator: true },
        { label: "Appearance", checked: this.ui.showAppearance, action: () => this.toggleAppearance() },
        { label: "Context Bar", checked: this.ui.showContextBar, action: () => this.toggleContextBar() },
        { separator: true },
        { label: "Reset Workspace", action: () => this.resetWorkspace() }
      ],
      Help: [
        { label: "Keyboard Shortcuts", action: () => this.showShortcuts() },
        { label: "About VectorCraft", action: () => this.showAbout() },
        { label: "LiteGUI Documentation", action: () => window.open("https://gausszhou.github.io/litegui/docs/", "_blank") }
      ]
    };
  }

  openMenu(anchor: HTMLElement, items: MenuItem[]) {
    if (this.menu && this.menuAnchor === anchor) {
      this.closeMenu();
      return;
    }
    this.closeMenu();
    const menu = document.createElement("div");
    menu.className = "vc-menu";
    for (const item of items) {
      if (item.separator) {
        const separator = document.createElement("div");
        separator.className = "vc-menu-sep";
        menu.appendChild(separator);
        continue;
      }
      const row = document.createElement("button");
      row.type = "button";
      row.className = `vc-menu-item${item.disabled ? " is-disabled" : ""}`;
      row.innerHTML = `<span class="vc-menu-check">${item.checked ? "✓" : ""}</span><span class="vc-menu-label">${
        item.label ?? ""
      }</span><span class="vc-menu-shortcut">${item.shortcut ?? ""}</span>`;
      row.addEventListener("click", () => {
        this.closeMenu();
        if (!item.disabled) item.action?.();
      });
      menu.appendChild(row);
    }
    document.body.appendChild(menu);
    const rect = anchor.getBoundingClientRect();
    const width = menu.offsetWidth;
    menu.style.left = `${Math.max(6, Math.min(rect.left, window.innerWidth - width - 8))}px`;
    menu.style.top = `${Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8)}px`;
    this.menu = menu;
    this.menuAnchor = anchor;
    anchor.classList.add("is-open");
  }

  private closeMenu() {
    this.menu?.remove();
    this.menu = null;
    this.menuAnchor?.classList.remove("is-open");
    this.menuAnchor = null;
    document.querySelectorAll(".vc-menu-btn.is-open").forEach(button => button.classList.remove("is-open"));
  }

  /* ------------------------- 选择 / 数据 ------------------------- */

  selectedObjects(): VecObject[] {
    return this.doc.objects.filter(object => this.selection.includes(object.id));
  }

  primaryObject(): VecObject | null {
    const objects = this.selectedObjects();
    return objects.length ? objects[objects.length - 1] : null;
  }

  select(ids: string[], additive = false) {
    if (additive) {
      const next = new Set(this.selection);
      for (const id of ids) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      this.selection = [...next];
    } else {
      this.selection = [...ids];
    }
    this.stage.setSelection(this.selection);
    this.stage.render();
    this.panels.renderAll();
    this.updateChrome();
  }

  update(id: string, patch: Partial<VecObject>, record = true) {
    const object = this.doc.objects.find(item => item.id === id);
    if (!object) return;
    if (record) this.pushHistory();
    Object.assign(object, patch);
    this.refresh();
  }

  updateSelection(patch: Partial<VecObject>, record = true) {
    if (!this.selection.length) return;
    if (record) this.pushHistory();
    for (const object of this.selectedObjects()) Object.assign(object, patch);
    this.refresh();
  }

  refresh() {
    this.stage.setDocument(this.doc);
    this.stage.setSelection(this.selection);
    this.stage.showGrid = this.ui.showGrid;
    this.stage.element.classList.toggle("is-outline", this.ui.outlineMode);
    this.stage.element.classList.toggle("no-rulers", !this.ui.showRulers);
    const renderStart = performance.now();
    this.stage.render();
    this.renderTime = performance.now() - renderStart;
    this.panels.renderAll();
    const uiStart = performance.now();
    this.panels.renderContextBar();
    this.updateChrome();
    this.uiTime = performance.now() - uiStart;
  }

  private renderStageOnly() {
    this.stage.setDocument(this.doc);
    this.stage.setSelection(this.selection);
    this.stage.render();
    this.panels.renderContextBar();
    this.updateChrome();
  }

  private onViewChange() {
    this.updateChrome();
    this.panels?.renderContextBar();
  }

  private updateChrome() {
    if (!this.stage) return;
    const zoomText = formatZoom(this.stage.zoomLevel);
    this.zoomButton.textContent = zoomText;
    this.docMeta.textContent = `@ ${zoomText} (RGB/Preview)`;
    const docTitle = document.querySelector<HTMLElement>("#vc-doc-title");
    if (docTitle) docTitle.textContent = this.doc.name;
    const primary = this.primaryObject();
    this.rotationButton.textContent = `${Math.round(primary?.rotation ?? 0)}°`;
    const count = this.selection.length;
    this.selectionState.textContent = count === 0 ? "No Selection" : count === 1 ? "Selection" : `${count} Objects`;
    this.hintElement.textContent = this.hintForTool();
    const fillSwatch = document.querySelector<HTMLElement>(".vc-colorstack-fill");
    const strokeSwatch = document.querySelector<HTMLElement>(".vc-colorstack-stroke");
    if (fillSwatch) {
      fillSwatch.style.background = primary ? (primary.fill === "none" ? "" : this.cssPaint(primary.fill)) : this.fillPaint;
      fillSwatch.classList.toggle("is-none", primary?.fill === "none");
    }
    if (strokeSwatch) {
      strokeSwatch.style.borderColor = primary && primary.stroke !== "none" ? this.cssPaint(primary.stroke) : this.strokePaint;
      strokeSwatch.classList.toggle("is-none", primary ? primary.stroke === "none" : false);
    }
    this.syncRail();
    this.updateStats();
  }

  setDefaultPaint(paint: Paint) {
    this.fillPaint = paint;
    this.updateChrome();
    this.toast(`默认填充：${paintLabel(paint)}`);
  }

  private cssPaint(paint: Paint): string {
    return paint.startsWith("url(") ? gradientCss(paint) : paint;
  }

  private hintForTool(): string {
    switch (this.tool) {
      case "rect":
        return "Drag to draw a rectangle | Shift+Drag to constrain proportions | Alt+Drag from center";
      case "ellipse":
        return "Drag to draw an ellipse | Shift+Drag to draw a circle";
      case "polygon":
        return "Drag to draw a polygon | 3–10 sides via panel";
      case "star":
        return "Drag to draw a star | Drag further from center for sharper points";
      case "line":
        return "Drag to draw a line segment | Shift+Drag to constrain to 45°";
      case "type":
        return "Click to place type | Double-click an existing text object to edit";
      case "pen":
        return "Click to add anchor points | Enter or double-click to finish | Esc to cancel";
      case "brush":
      case "pencil":
        return "Drag to paint a path | Release to finish the stroke";
      case "hand":
        return "Drag to pan the canvas | Space+Drag works with any tool";
      case "zoom":
        return "Click to zoom in | Alt+Click to zoom out | Ctrl+0 to fit artboard";
      case "rotate":
        return "Drag to rotate the selection around its centre";
      case "eraser":
        return "Click an object to erase it (demo)";
      case "scissors":
      case "knife":
      case "smooth":
      case "shaper":
      case "pathEraser":
      case "lasso":
      case "group":
      case "penAdd":
      case "penRemove":
      case "anchor":
      case "verticalType":
        return "该工具为视觉示例，交互请使用 Selection / Pen / Type";
      default:
        return this.defaultHint;
    }
  }

  toast(message: string) {
    let element = document.querySelector<HTMLElement>(".vc-toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "vc-toast";
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("is-visible");
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => element?.classList.remove("is-visible"), 2000);
  }

  private tickFps() {
    const loop = () => {
      this.frames += 1;
      const now = performance.now();
      if (now - this.fpsStamp >= 500) {
        this.fps = Math.round((this.frames * 1000) / (now - this.fpsStamp));
        this.frames = 0;
        this.fpsStamp = now;
        this.updateStats();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private updateStats() {
    this.statsElement.textContent = `render ${this.renderTime.toFixed(1)} ms · ul ${this.uiTime.toFixed(1)} ms · ${this.fps} fps`;
  }

  /* ------------------------- 历史 ------------------------- */

  private pushHistory() {
    this.history.push({ doc: JSON.stringify(this.doc), selection: [...this.selection] });
    if (this.history.length > 80) this.history.shift();
    this.future = [];
  }

  private undo() {
    const entry = this.history.pop();
    if (!entry) {
      this.toast("Nothing to undo");
      return;
    }
    this.future.push({ doc: JSON.stringify(this.doc), selection: [...this.selection] });
    this.restore(entry);
    this.toast("Undo");
  }

  private redo() {
    const entry = this.future.pop();
    if (!entry) {
      this.toast("Nothing to redo");
      return;
    }
    this.history.push({ doc: JSON.stringify(this.doc), selection: [...this.selection] });
    this.restore(entry);
    this.toast("Redo");
  }

  private restore(entry: { doc: string; selection: string[] }) {
    const parsed = deserializeDocument(entry.doc);
    if (!parsed) return;
    this.doc = parsed;
    this.selection = entry.selection.filter(id => this.doc.objects.some(object => object.id === id));
    this.refresh();
  }

  /* ------------------------- 编辑操作 ------------------------- */

  deleteSelection() {
    if (!this.selection.length) return;
    this.pushHistory();
    this.doc.objects = this.doc.objects.filter(object => !this.selection.includes(object.id));
    this.selection = [];
    this.refresh();
    this.toast("Deleted");
  }

  duplicateSelection() {
    if (!this.selection.length) {
      this.toast("Select an object first");
      return;
    }
    this.pushHistory();
    const clones = this.selectedObjects().map(object => {
      const clone = cloneObject(object);
      clone.id = `${object.id}-copy-${Math.random().toString(36).slice(2, 6)}`;
      clone.x += 16;
      clone.y += 16;
      clone.name = object.name;
      this.doc.objects.push(clone);
      return clone.id;
    });
    this.selection = clones;
    this.refresh();
    this.toast("Duplicated");
  }

  copySelection() {
    if (!this.selection.length) return;
    this.clipboard = this.selectedObjects().map(cloneObject);
    this.toast(`Copied ${this.clipboard.length} object(s)`);
  }

  cutSelection() {
    if (!this.selection.length) return;
    this.copySelection();
    this.deleteSelection();
  }

  pasteSelection() {
    if (!this.clipboard?.length) {
      this.toast("Clipboard is empty");
      return;
    }
    this.pushHistory();
    const ids = this.clipboard.map(object => {
      const clone = cloneObject(object);
      clone.id = `${object.id}-paste-${Math.random().toString(36).slice(2, 6)}`;
      clone.x += 24;
      clone.y += 24;
      this.doc.objects.push(clone);
      return clone.id;
    });
    this.selection = ids;
    this.refresh();
    this.toast("Pasted");
  }

  selectAll() {
    this.select(this.doc.objects.filter(object => !object.locked && object.visible).map(object => object.id));
  }

  selectInverse() {
    this.select(this.doc.objects.filter(object => !this.selection.includes(object.id) && !object.locked).map(object => object.id));
  }

  selectSameFill() {
    const primary = this.primaryObject();
    if (!primary) return;
    this.select(this.doc.objects.filter(object => object.fill === primary.fill).map(object => object.id));
  }

  selectNextObject(direction: number) {
    const objects = this.doc.objects.filter(object => object.visible);
    if (!objects.length) return;
    const primary = this.primaryObject();
    const index = primary ? objects.findIndex(object => object.id === primary.id) : -1;
    const next = objects[(index + direction + objects.length) % objects.length];
    this.select([next.id]);
  }

  bringToFront() {
    if (!this.selection.length) return;
    this.pushHistory();
    const moving = this.selectedObjects();
    this.doc.objects = [...this.doc.objects.filter(object => !this.selection.includes(object.id)), ...moving];
    this.refresh();
    this.toast("Brought to Front");
  }

  sendToBack() {
    if (!this.selection.length) return;
    this.pushHistory();
    const moving = this.selectedObjects();
    this.doc.objects = [...moving, ...this.doc.objects.filter(object => !this.selection.includes(object.id))];
    this.refresh();
    this.toast("Sent to Back");
  }

  unlockAll() {
    if (!this.doc.objects.some(object => object.locked)) {
      this.toast("没有锁定的对象");
      return;
    }
    this.pushHistory();
    for (const object of this.doc.objects) object.locked = false;
    this.refresh();
    this.toast("已解锁全部对象");
  }

  toggleLock(id: string) {
    const object = this.doc.objects.find(item => item.id === id);
    if (!object) return;
    this.pushHistory();
    object.locked = !object.locked;
    this.refresh();
  }

  toggleVisibility(id: string) {
    const object = this.doc.objects.find(item => item.id === id);
    if (!object) return;
    this.pushHistory();
    object.visible = !object.visible;
    if (!object.visible) this.selection = this.selection.filter(item => item !== id);
    this.refresh();
  }

  toggleGlow() {
    const primary = this.primaryObject();
    if (!primary) {
      this.toast("Select an object to add Outer Glow");
      return;
    }
    this.updateSelection({ glow: primary.glow > 0 ? 0 : 22, glowColor: primary.glowColor || "#8f6bff" }, true);
    this.toast(primary.glow > 0 ? "Outer Glow added" : "Outer Glow removed");
  }

  outlineSelection() {
    const texts = this.selectedObjects().filter(object => isText(object));
    if (!texts.length) {
      this.toast("Create Outlines 需要选中文本对象");
      return;
    }
    this.pushHistory();
    for (const object of texts) {
      object.outlined = true;
      object.glow = 0;
      object.name = object.name.includes("(Outlines)") ? object.name : `${object.name} (Outlines)`;
    }
    this.refresh();
    this.toast("已创建轮廓（演示：以描边方式渲染）");
  }

  alignSelection(mode: AlignMode) {
    const objects = this.selectedObjects();
    if (!objects.length) return;
    this.pushHistory();
    const union = unionBounds(objects);
    if (!union) return;
    const artboard = { x: 0, y: 0, width: this.doc.width, height: this.doc.height };
    const target = objects.length > 1 && union ? union : artboard;
    for (const object of objects) {
      switch (mode) {
        case "left":
          object.x = target.x;
          break;
        case "hcenter":
          object.x = target.x + (target.width - object.width) / 2;
          break;
        case "right":
          object.x = target.x + target.width - object.width;
          break;
        case "top":
          object.y = target.y;
          break;
        case "vcenter":
          object.y = target.y + (target.height - object.height) / 2;
          break;
        case "bottom":
          object.y = target.y + target.height - object.height;
          break;
        default:
          break;
      }
    }
    this.refresh();
  }

  distributeSelection(axis: "h" | "v") {
    const objects = this.selectedObjects();
    if (objects.length < 3) {
      this.toast("分布需要至少 3 个对象");
      return;
    }
    this.pushHistory();
    const sorted = objects.slice().sort((a, b) => (axis === "h" ? a.x - b.x : a.y - b.y));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const total = axis === "h" ? last.x + last.width - first.x : last.y + last.height - first.y;
    const used = sorted.reduce((sum, object) => sum + (axis === "h" ? object.width : object.height), 0);
    const gap = (total - used) / (sorted.length - 1);
    let cursor = axis === "h" ? first.x : first.y;
    for (const object of sorted) {
      if (axis === "h") {
        object.x = cursor;
        cursor += object.width + gap;
      } else {
        object.y = cursor;
        cursor += object.height + gap;
      }
    }
    this.refresh();
  }

  rotateSelection(degrees: number) {
    const primary = this.primaryObject();
    if (!primary) {
      this.toast("Select an object first");
      return;
    }
    this.pushHistory();
    for (const object of this.selectedObjects()) object.rotation = (object.rotation + degrees + 360) % 360;
    this.refresh();
  }

  stepFontSize(delta: number) {
    const primary = this.primaryObject();
    if (!primary || !isText(primary)) return;
    this.pushHistory();
    for (const object of this.selectedObjects()) {
      if (isText(object)) object.fontSize = Math.max(4, (object.fontSize ?? 24) + delta);
    }
    this.refresh();
  }

  editPrimaryText() {
    const primary = this.primaryObject();
    if (primary && isText(primary)) this.editText(primary);
    else this.toast("Select a text object first");
  }

  /* ------------------------- 视图 ------------------------- */

  setZoomPercent(value: number) {
    this.stage.setZoom(value / 100);
    this.panels.renderContextBar();
  }

  zoomBy(factor: number) {
    this.stage.setZoom(this.stage.zoomLevel * factor);
    this.panels.renderContextBar();
  }

  zoomFit() {
    this.stage.fit(28);
    this.panels.renderContextBar();
  }

  zoomToSelection() {
    const union = unionBounds(this.selectedObjects());
    if (!union) {
      this.zoomFit();
      return;
    }
    const { width, height } = this.stage.size;
    const zoom = Math.min((width - 160) / union.width, (height - 160) / union.height);
    this.stage.setZoom(zoom);
    this.stage.centerOn({ x: union.x + union.width / 2, y: union.y + union.height / 2 });
  }

  toggleRulers() {
    this.ui.showRulers = !this.ui.showRulers;
    this.refresh();
  }

  toggleGrid() {
    this.ui.showGrid = !this.ui.showGrid;
    this.refresh();
  }

  toggleOutlineMode() {
    this.ui.outlineMode = !this.ui.outlineMode;
    this.refresh();
  }

  toggleAppearance() {
    this.ui.showAppearance = !this.ui.showAppearance;
    this.panels.renderAppearance();
  }

  toggleContextBar() {
    this.ui.showContextBar = !this.ui.showContextBar;
    this.panels.renderContextBar();
  }

  focusSidebar(tab: "properties" | "layers" | "libraries") {
    this.ui.sidebarTab = tab;
    this.ui.railActive = tab;
    this.panels.renderSidebar();
    this.syncRail();
  }

  resetWorkspace() {
    this.ui.sidebarTab = "properties";
    this.ui.railActive = "properties";
    this.ui.showAppearance = true;
    this.ui.showContextBar = true;
    this.ui.appearancePos = null;
    this.panels.renderAll();
    this.syncRail();
    this.toast("Workspace reset");
  }

  selectionScreenRect(): ScreenRect | null {
    const union = unionBounds(this.selectedObjects());
    if (!union) return null;
    const rect = this.viewport.getBoundingClientRect();
    const topLeft = this.stage.docToScreen({ x: union.x, y: union.y });
    return {
      left: topLeft.x - rect.left,
      top: topLeft.y - rect.top,
      width: union.width * this.stage.zoomLevel,
      height: union.height * this.stage.zoomLevel
    };
  }

  /* ------------------------- 文件 ------------------------- */

  private newDocument() {
    const background = createObject({
      kind: "rect",
      name: "Artboard",
      x: 0,
      y: 0,
      width: 800,
      height: 1000,
      fill: "#ffffff",
      locked: true
    });
    this.doc = { name: "untitled.vectorcraft", width: 800, height: 1000, objects: [background] };
    this.selection = [];
    this.history = [];
    this.future = [];
    document.querySelector<HTMLElement>("#vc-doc-title")!.textContent = this.doc.name;
    this.stage.setDocument(this.doc);
    this.stage.fit(28);
    this.refresh();
    this.toast("New document");
  }

  private saveDocument() {
    const name = this.doc.name.replace(/\.(vectorcraft|json)$/i, "");
    downloadText(`${name}.vectorcraft`, serializeDocument(this.doc), "application/json");
    this.toast("已保存为 .vectorcraft");
  }

  private openFile() {
    const file = this.fileInput.files?.[0];
    if (!file) return;
    void file.text().then(raw => {
      const parsed = deserializeDocument(raw);
      if (!parsed) {
        this.toast("无法解析该文件");
        return;
      }
      this.doc = parsed;
      this.selection = [];
      this.history = [];
      this.future = [];
      document.querySelector<HTMLElement>("#vc-doc-title")!.textContent = this.doc.name;
      this.stage.setDocument(this.doc);
      this.stage.fit(28);
      this.refresh();
      this.toast(`已打开 ${this.doc.name}`);
    });
    this.fileInput.value = "";
  }

  private exportSvg() {
    const name = this.doc.name.replace(/\.(vectorcraft|json)$/i, "");
    downloadText(`${name}.svg`, documentSvg(this.doc));
    this.toast("已导出 SVG");
  }

  private async exportPng() {
    const name = this.doc.name.replace(/\.(vectorcraft|json)$/i, "");
    try {
      await downloadPng(this.doc, `${name}.png`, 2);
      this.toast("已导出 PNG（2×）");
    } catch {
      this.toast("PNG 导出失败");
    }
  }

  /* ------------------------- 工具 ------------------------- */

  setTool(id: string) {
    this.tool = id;
    this.toolbar?.setActive(id);
    this.stage.element.dataset.tool = id;
    this.hintElement.textContent = this.hintForTool();
    if (id !== "pen") this.finishPen(false);
    this.panels.renderContextBar();
  }

  private onSwatchAction(action: string) {
    switch (action) {
      case "fill":
        this.panels.openColorPicker("fill", document.querySelector<HTMLElement>('[data-swatch="fill"]')!);
        break;
      case "stroke":
        this.panels.openColorPicker("stroke", document.querySelector<HTMLElement>('[data-swatch="stroke"]')!);
        break;
      case "swap": {
        const primary = this.primaryObject();
        if (primary) {
          this.updateSelection({ fill: primary.stroke === "none" ? "#ffffff" : primary.stroke, stroke: primary.fill }, true);
        } else {
          const swap = this.fillPaint;
          this.fillPaint = this.strokePaint;
          this.strokePaint = swap;
        }
        this.updateChrome();
        break;
      }
      case "default":
        this.fillPaint = "#ffffff";
        this.strokePaint = "#000000";
        this.updateSelection({ fill: "#ffffff", stroke: "#000000", strokeWidth: 2 }, true);
        break;
      case "screen":
        this.toast("Screen Mode：示例未接入");
        break;
      default:
        break;
    }
  }

  /* ------------------------- 指针交互 ------------------------- */

  private onPointerDown = (event: PointerEvent) => {
    if (event.button === 2) return;
    this.closeMenu();
    const target = event.target as Element;
    const docPoint = this.stage.screenToDoc(event.clientX, event.clientY);
    const screen = { x: event.clientX, y: event.clientY };

    if (event.button === 1 || this.spaceDown || this.tool === "hand") {
      this.beginDrag({
        mode: "pan",
        startDoc: docPoint,
        startScreen: screen,
        lastScreen: screen,
        origins: [],
        startAngle: 0,
        moved: false,
        historyPushed: false
      });
      event.preventDefault();
      return;
    }

    if (this.tool === "zoom") {
      this.stage.zoomAround(event.altKey ? 0.8 : 1.25, this.localX(event), this.localY(event));
      this.panels.renderContextBar();
      event.preventDefault();
      return;
    }

    const handle = target.closest<HTMLElement>("[data-handle]");
    if (handle && this.selection.length) {
      this.beginDrag({
        mode: "resize",
        startDoc: docPoint,
        startScreen: screen,
        lastScreen: screen,
        handleIndex: handle.dataset.handle ?? "0",
        objectId: handle.dataset.objId,
        origins: this.selectedObjects().map(object => ({ id: object.id, x: object.x, y: object.y, width: object.width, height: object.height })),
        startAngle: 0,
        moved: false,
        historyPushed: false
      });
      event.preventDefault();
      return;
    }

    const objectElement = target.closest<Element>("[data-obj]");
    const objectId = objectElement?.getAttribute("data-obj") ?? null;
    const object = objectId ? this.doc.objects.find(item => item.id === objectId) ?? null : null;

    if (this.tool === "type") {
      this.createText(docPoint);
      event.preventDefault();
      return;
    }

    if (["rect", "ellipse", "polygon", "star", "line", "brush", "pencil"].includes(this.tool)) {
      this.beginCreate(docPoint, screen);
      event.preventDefault();
      return;
    }

    if (this.tool === "pen") {
      this.addPenPoint(docPoint);
      event.preventDefault();
      return;
    }

    if (this.tool === "eraser") {
      if (object && !object.locked) {
        this.selection = [object.id];
        this.deleteSelection();
      }
      return;
    }

    if (this.tool === "rotate" && object) {
      this.select([object.id]);
      this.beginDrag({
        mode: "rotate",
        startDoc: docPoint,
        startScreen: screen,
        lastScreen: screen,
        origins: this.selectedObjects().map(item => ({ id: item.id, x: item.x, y: item.y, width: item.width, height: item.height })),
        startAngle: Math.atan2(docPoint.y - this.selectionCenter().y, docPoint.x - this.selectionCenter().x),
        moved: false,
        historyPushed: false
      });
      event.preventDefault();
      return;
    }

    if (object) {
      if (object.locked) {
        if (!event.shiftKey) this.select([]);
        this.startMarquee(docPoint, screen);
        event.preventDefault();
        return;
      }
      if (event.shiftKey) {
        this.select([object.id], true);
        return;
      }
      if (!this.selection.includes(object.id)) this.select([object.id]);
      if (event.altKey) this.duplicateSelection();
      this.beginDrag({
        mode: "move",
        startDoc: docPoint,
        startScreen: screen,
        lastScreen: screen,
        origins: this.selectedObjects().map(item => ({ id: item.id, x: item.x, y: item.y, width: item.width, height: item.height })),
        startAngle: 0,
        moved: false,
        historyPushed: false
      });
      event.preventDefault();
      return;
    }

    if (!event.shiftKey) this.select([]);
    this.startMarquee(docPoint, screen);
    event.preventDefault();
  };

  private startMarquee(docPoint: Vec2, screen: Vec2) {
    this.beginDrag({
      mode: "marquee",
      startDoc: docPoint,
      startScreen: screen,
      lastScreen: screen,
      origins: [],
      startAngle: 0,
      moved: false,
      historyPushed: false
    });
    this.marquee.hidden = false;
    this.marquee.style.left = `${screen.x - this.viewport.getBoundingClientRect().left}px`;
    this.marquee.style.top = `${screen.y - this.viewport.getBoundingClientRect().top}px`;
    this.marquee.style.width = "0px";
    this.marquee.style.height = "0px";
  }

  private beginDrag(drag: DragState) {
    this.drag = drag;
  }

  private localX(event: { clientX: number }): number {
    const rect = this.viewport.getBoundingClientRect();
    return event.clientX - rect.left;
  }

  private localY(event: { clientY: number }): number {
    const rect = this.viewport.getBoundingClientRect();
    return event.clientY - rect.top;
  }

  private selectionCenter(): Vec2 {
    const union = unionBounds(this.selectedObjects());
    if (!union) return { x: 0, y: 0 };
    return { x: union.x + union.width / 2, y: union.y + union.height / 2 };
  }

  private onPointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag) return;
    const docPoint = this.stage.screenToDoc(event.clientX, event.clientY);

    if (drag.mode === "pan") {
      this.stage.panBy(event.clientX - drag.lastScreen.x, event.clientY - drag.lastScreen.y);
      drag.lastScreen = { x: event.clientX, y: event.clientY };
      return;
    }

    const delta = { x: docPoint.x - drag.startDoc.x, y: docPoint.y - drag.startDoc.y };

    if (drag.mode === "marquee") {
      const left = Math.min(drag.startScreen.x, event.clientX);
      const top = Math.min(drag.startScreen.y, event.clientY);
      this.marquee.style.left = `${left - this.viewport.getBoundingClientRect().left}px`;
      this.marquee.style.top = `${top - this.viewport.getBoundingClientRect().top}px`;
      this.marquee.style.width = `${Math.abs(event.clientX - drag.startScreen.x)}px`;
      this.marquee.style.height = `${Math.abs(event.clientY - drag.startScreen.y)}px`;
      drag.moved = true;
      return;
    }

    if (drag.mode === "move") {
      if (!drag.moved) {
        if (Math.abs(delta.x) < 0.5 && Math.abs(delta.y) < 0.5) return;
        this.pushHistory();
        drag.moved = true;
        drag.historyPushed = true;
      }
      for (const origin of drag.origins) {
        const object = this.doc.objects.find(item => item.id === origin.id);
        if (!object) continue;
        object.x = Math.round((origin.x + delta.x) * 10) / 10;
        object.y = Math.round((origin.y + delta.y) * 10) / 10;
      }
      this.renderStageOnly();
      return;
    }

    if (drag.mode === "resize") {
      if (!drag.moved) {
        this.pushHistory();
        drag.moved = true;
        drag.historyPushed = true;
      }
      this.applyResize(drag, delta);
      this.renderStageOnly();
      return;
    }

    if (drag.mode === "rotate") {
      if (!drag.moved) {
        this.pushHistory();
        drag.moved = true;
        drag.historyPushed = true;
      }
      const centre = this.selectionCenter();
      const angle = Math.atan2(docPoint.y - centre.y, docPoint.x - centre.x);
      const degrees = ((angle - drag.startAngle) * 180) / Math.PI;
      for (const origin of drag.origins) {
        const object = this.doc.objects.find(item => item.id === origin.id);
        if (!object) continue;
        object.rotation = Math.round((((object.rotation + degrees) % 360) + 360) % 360);
        drag.startAngle = angle;
      }
      this.renderStageOnly();
      return;
    }

    if (drag.mode === "create") {
      const object = this.doc.objects.find(item => item.id === drag.objectId);
      if (!object) return;
      drag.moved = true;
      this.applyCreateRect(object, drag.startDoc, docPoint, event.shiftKey);
      this.renderStageOnly();
      return;
    }

    if (drag.mode === "brush") {
      const object = this.doc.objects.find(item => item.id === drag.objectId);
      if (!object || !object.points) return;
      const last = object.points[object.points.length - 1];
      const distance = Math.hypot(docPoint.x - last.x, docPoint.y - last.y);
      if (distance < 2 / this.stage.zoomLevel) return;
      object.points.push({ x: Math.round(docPoint.x * 10) / 10, y: Math.round(docPoint.y * 10) / 10 });
      const xs = object.points.map(point => point.x);
      const ys = object.points.map(point => point.y);
      object.x = Math.min(...xs);
      object.y = Math.min(...ys);
      object.width = Math.max(1, Math.max(...xs) - object.x);
      object.height = Math.max(1, Math.max(...ys) - object.y);
      this.renderStageOnly();
    }
  };

  private applyResize(drag: DragState, delta: Vec2) {
    const handle = drag.handleIndex ?? "2";
    const origin = drag.origins[0];
    if (!origin) return;
    const object = this.doc.objects.find(item => item.id === origin.id);
    if (!object) return;
    let { x, y, width, height } = origin;
    if (handle.startsWith("m")) {
      const index = Number.parseInt(handle.slice(1), 10);
      if (index === 0) {
        y += delta.y;
        height -= delta.y;
      } else if (index === 1) {
        width += delta.x;
      } else if (index === 2) {
        height += delta.y;
      } else {
        x += delta.x;
        width -= delta.x;
      }
    } else {
      const index = Number.parseInt(handle, 10);
      switch (index) {
        case 0:
          x += delta.x;
          y += delta.y;
          width -= delta.x;
          height -= delta.y;
          break;
        case 1:
          y += delta.y;
          width += delta.x;
          height -= delta.y;
          break;
        case 2:
          width += delta.x;
          height += delta.y;
          break;
        case 3:
          x += delta.x;
          width -= delta.x;
          height += delta.y;
          break;
        default:
          break;
      }
    }
    object.x = Math.round(Math.min(x, x + width) * 10) / 10;
    object.y = Math.round(Math.min(y, y + height) * 10) / 10;
    object.width = Math.max(1, Math.round(Math.abs(width) * 10) / 10);
    object.height = Math.max(1, Math.round(Math.abs(height) * 10) / 10);
  }

  private onPointerUp = () => {
    const drag = this.drag;
    if (!drag) return;
    this.drag = null;

    if (drag.mode === "marquee") {
      this.marquee.hidden = true;
      const rect = this.marquee.getBoundingClientRect();
      if (drag.moved && rect.width > 3 && rect.height > 3) {
        const topLeft = this.stage.screenToDoc(rect.left, rect.top);
        const bottomRight = this.stage.screenToDoc(rect.right, rect.bottom);
        const hits = this.doc.objects.filter(object => {
          if (!object.visible || object.locked) return false;
          return (
            object.x + object.width >= topLeft.x &&
            object.x <= bottomRight.x &&
            object.y + object.height >= topLeft.y &&
            object.y <= bottomRight.y
          );
        });
        this.select(hits.map(object => object.id));
      }
      return;
    }

    if (drag.mode === "create") {
      const object = this.doc.objects.find(item => item.id === drag.objectId);
      const degenerate = object ? !drag.moved || (object.width < 2 && object.height < 2) : false;
      if (object && degenerate) {
        this.doc.objects = this.doc.objects.filter(item => item.id !== object.id);
        this.selection = this.selection.filter(id => id !== object.id);
      }
      this.refresh();
      return;
    }

    if (drag.mode === "brush") {
      const object = this.doc.objects.find(item => item.id === drag.objectId);
      if (object?.points && object.points.length < 2) {
        this.doc.objects = this.doc.objects.filter(item => item.id !== object.id);
      }
      this.refresh();
      return;
    }

    if (drag.moved) this.refresh();
    else this.panels.renderAll();
  };

  private applyCreateRect(object: VecObject, start: Vec2, current: Vec2, constrain: boolean) {
    let dx = current.x - start.x;
    let dy = current.y - start.y;
    if (constrain && this.tool !== "line") {
      const size = Math.max(Math.abs(dx), Math.abs(dy));
      dx = Math.sign(dx || 1) * size;
      dy = Math.sign(dy || 1) * size;
    }
    object.x = Math.round(Math.min(start.x, start.x + dx) * 10) / 10;
    object.y = Math.round(Math.min(start.y, start.y + dy) * 10) / 10;
    object.width = Math.max(1, Math.round(Math.abs(dx) * 10) / 10);
    object.height = Math.max(1, Math.round(Math.abs(dy) * 10) / 10);
    if (this.tool === "line" && object.points) {
      object.points = [
        { x: Math.round(start.x * 10) / 10, y: Math.round(start.y * 10) / 10 },
        { x: Math.round(current.x * 10) / 10, y: Math.round(current.y * 10) / 10 }
      ];
    }
  }

  private beginCreate(point: Vec2, screen: Vec2) {
    this.pushHistory();
    const kind = this.tool === "line" || this.tool === "brush" || this.tool === "pencil" ? "path" : (this.tool as VecObject["kind"]);
    const stroke = this.strokePaint === "none" ? "#ff3fae" : this.strokePaint;
    const object = createObject({
      kind,
      x: point.x,
      y: point.y,
      width: 1,
      height: 1,
      name:
        this.tool === "rect"
          ? "Rectangle"
          : this.tool === "ellipse"
            ? "Ellipse"
            : this.tool === "polygon"
              ? "Polygon"
              : this.tool === "star"
                ? "Star"
                : this.tool === "line"
                  ? "Line"
                  : "Brush Path",
      fill: this.tool === "line" || this.tool === "brush" || this.tool === "pencil" ? "none" : this.fillPaint,
      stroke: this.tool === "line" || this.tool === "brush" || this.tool === "pencil" ? stroke : "none",
      strokeWidth: this.tool === "line" ? 3 : this.tool === "brush" ? 5 : 0,
      points: kind === "path" ? [{ x: point.x, y: point.y }] : undefined,
      closed: false,
      sides: this.tool === "polygon" ? 6 : this.tool === "star" ? 5 : undefined,
      innerRatio: this.tool === "star" ? 0.45 : undefined
    });
    this.doc.objects.push(object);
    this.selection = [object.id];
    this.stage.setSelection(this.selection);
    this.beginDrag({
      mode: this.tool === "brush" || this.tool === "pencil" ? "brush" : "create",
      startDoc: point,
      startScreen: screen,
      lastScreen: screen,
      objectId: object.id,
      origins: [],
      startAngle: 0,
      moved: false,
      historyPushed: true
    });
    this.refresh();
  }

  private createText(point: Vec2) {
    this.pushHistory();
    const object = createObject({
      kind: "text",
      x: Math.round(point.x),
      y: Math.round(point.y - 30),
      width: 280,
      height: 60,
      name: "Type",
      text: "Type something",
      fontSize: 36,
      fontWeight: 500,
      letterSpacing: 0,
      align: "center",
      fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
      fill: this.fillPaint === "none" ? "#ffffff" : this.fillPaint
    });
    this.doc.objects.push(object);
    this.selection = [object.id];
    this.refresh();
    this.editText(object);
  }

  private addPenPoint(point: Vec2) {
    if (!this.penId) {
      this.pushHistory();
      const object = createObject({
        kind: "path",
        x: point.x,
        y: point.y,
        width: 1,
        height: 1,
        name: "Pen Path",
        fill: "none",
        stroke: this.strokePaint === "none" ? "#ff3fae" : this.strokePaint,
        strokeWidth: 2,
        points: [{ x: point.x, y: point.y }],
        closed: false
      });
      this.doc.objects.push(object);
      this.penId = object.id;
      this.selection = [object.id];
      this.refresh();
      return;
    }
    const object = this.doc.objects.find(item => item.id === this.penId);
    if (!object?.points) return;
    const first = object.points[0];
    if (object.points.length > 2 && Math.hypot(point.x - first.x, point.y - first.y) < 8 / this.stage.zoomLevel) {
      this.finishPen(true);
      return;
    }
    object.points.push({ x: point.x, y: point.y });
    this.refresh();
  }

  private finishPen(close: boolean) {
    if (!this.penId) return;
    const object = this.doc.objects.find(item => item.id === this.penId);
    if (object) {
      if (object.points && object.points.length < 2) {
        this.doc.objects = this.doc.objects.filter(item => item.id !== this.penId);
      } else {
        object.closed = close;
        if (close) object.fill = this.fillPaint;
      }
    }
    this.penId = null;
    this.refresh();
  }

  /* ------------------------- 其他事件 ------------------------- */

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const factor = Math.exp(-event.deltaY * 0.0015);
      this.stage.zoomAround(factor, this.localX(event), this.localY(event));
      this.panels.renderContextBar();
      return;
    }
    if (event.shiftKey) this.stage.panBy(-event.deltaY, 0);
    else this.stage.panBy(-event.deltaX, -event.deltaY);
    this.panels.renderContextBar();
  };

  private onDoubleClick = (event: MouseEvent) => {
    if (this.penId) {
      this.finishPen(true);
      return;
    }
    const target = event.target as Element;
    const objectElement = target.closest<Element>("[data-obj]");
    const objectId = objectElement?.getAttribute("data-obj");
    const object = objectId ? this.doc.objects.find(item => item.id === objectId) : null;
    if (object && isText(object)) this.editText(object);
  };

  private editText(object: VecObject) {
    const backdrop = document.createElement("div");
    backdrop.className = "vc-modal-backdrop";
    backdrop.innerHTML = `<div class="vc-modal vc-modal--text">
      <header class="vc-modal-head"><span>${icon("type", 14)} Edit Text</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
      <div class="vc-modal-body">
        <textarea class="vc-textarea" spellcheck="false"></textarea>
        <p class="vc-modal-hint">Enter 换行 · Ctrl+Enter 应用 · Esc 取消</p>
      </div>
      <footer class="vc-modal-foot"><button class="vc-quick-btn" data-modal="cancel">Cancel</button><button class="vc-quick-btn vc-quick-btn--primary" data-modal="apply">Apply</button></footer>
    </div>`;
    document.body.appendChild(backdrop);
    const textarea = backdrop.querySelector<HTMLTextAreaElement>(".vc-textarea")!;
    textarea.value = object.text ?? "";
    textarea.focus();
    textarea.select();

    const apply = () => {
      const value = textarea.value;
      this.pushHistory();
      object.text = value;
      if (object.name === "Type") object.name = value.slice(0, 24) || "Type";
      backdrop.remove();
      this.refresh();
    };
    const cancel = () => backdrop.remove();

    backdrop.addEventListener("click", event => {
      const action = (event.target as HTMLElement).closest<HTMLElement>("[data-modal]")?.dataset.modal;
      if (action === "apply") apply();
      else if (action === "cancel" || action === "close") cancel();
    });
    textarea.addEventListener("keydown", event => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        apply();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    });
  }

  private showShortcuts() {
    const shortcuts: Array<[string, string]> = [
      ["V", "Selection"],
      ["A", "Direct Selection"],
      ["P", "Pen"],
      ["M", "Rectangle"],
      ["L", "Ellipse"],
      ["T", "Type"],
      ["B", "Paintbrush"],
      ["H", "Hand"],
      ["Z", "Zoom"],
      ["Space + Drag", "Pan"],
      ["Ctrl + Wheel", "Zoom"],
      ["Ctrl + 0", "Fit Artboard"],
      ["Ctrl + 1", "Actual Size"],
      ["Ctrl + Z / Shift + Ctrl + Z", "Undo / Redo"],
      ["Ctrl + D", "Duplicate"],
      ["Ctrl + G", "Group（示例）"],
      ["Ctrl + A", "Select All"],
      ["Delete", "Delete selection"],
      ["Arrows", "Nudge 1 pt（Shift 10 pt）"],
      ["Shift + Ctrl + O", "Create Outlines"]
    ];
    const backdrop = document.createElement("div");
    backdrop.className = "vc-modal-backdrop";
    backdrop.innerHTML = `<div class="vc-modal">
      <header class="vc-modal-head"><span>${icon("help", 14)} Keyboard Shortcuts</span><button class="vc-mini-btn" data-modal="close">${icon(
        "close",
        12
      )}</button></header>
      <div class="vc-modal-body">
        <div class="vc-shortcut-grid">${shortcuts
          .map(([key, label]) => `<kbd>${key}</kbd><span>${label}</span>`)
          .join("")}</div>
      </div>
      <footer class="vc-modal-foot"><span class="vc-modal-hint">LiteGUI VectorCraft demo</span></footer>
    </div>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", event => {
      const element = event.target as HTMLElement;
      if (element === backdrop || element.closest("[data-modal]")) close();
    });
    backdrop.addEventListener("keydown", event => {
      if (event.key === "Escape") close();
    });
    backdrop.tabIndex = -1;
    backdrop.focus();
  }

  private showAbout() {
    const backdrop = document.createElement("div");
    backdrop.className = "vc-modal-backdrop";
    backdrop.innerHTML = `<div class="vc-modal vc-modal--about">
      <header class="vc-modal-head"><span>${icon("logo", 18)} VectorCraft</span><button class="vc-mini-btn" data-modal="close">${icon(
        "close",
        12
      )}</button></header>
      <div class="vc-modal-body">
        <p><b>VectorCraft</b> 是一个参考 Adobe Illustrator 工作台的矢量设计示例，使用 LiteGUI 组件与原生 DOM/SVG 构建。</p>
        <p>特性：SVG 矢量渲染 · 画板/标尺 · 选择/拖拽/缩放/旋转 · 文本与外发光 · 图层面板 · 属性面板 · SVG/PNG 导出。</p>
        <p class="vc-modal-hint">LiteGUI monorepo · apps/vectorcraft</p>
      </div>
      <footer class="vc-modal-foot"><button class="vc-quick-btn vc-quick-btn--primary" data-modal="close">Close</button></footer>
    </div>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", event => {
      const element = event.target as HTMLElement;
      if (element === backdrop || element.closest("[data-modal]")) close();
    });
    backdrop.addEventListener("keydown", event => {
      if (event.key === "Escape") close();
    });
    backdrop.tabIndex = -1;
    backdrop.focus();
  }

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as Element;
    const objectElement = target.closest<Element>("[data-obj]");
    const objectId = objectElement?.getAttribute("data-obj");
    if (objectId && !this.selection.includes(objectId)) this.select([objectId]);
    const primary = this.primaryObject();
    const items: MenuItem[] = primary
      ? [
          { label: "Cut", shortcut: "Ctrl X", action: () => this.cutSelection() },
          { label: "Copy", shortcut: "Ctrl C", action: () => this.copySelection() },
          { label: "Paste", shortcut: "Ctrl V", action: () => this.pasteSelection() },
          { label: "Duplicate", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
          { separator: true },
          { label: "Bring to Front", action: () => this.bringToFront() },
          { label: "Send to Back", action: () => this.sendToBack() },
          { separator: true },
          { label: "Create Outlines", action: () => this.outlineSelection() },
          { label: "Lock", action: () => this.toggleLock(primary.id) },
          { label: "Hide", action: () => this.toggleVisibility(primary.id) },
          { separator: true },
          { label: "Delete", shortcut: "Del", action: () => this.deleteSelection() }
        ]
      : [
          { label: "Paste", shortcut: "Ctrl V", action: () => this.pasteSelection() },
          { label: "Select All", shortcut: "Ctrl A", action: () => this.selectAll() },
          { label: "Fit Artboard", shortcut: "Ctrl 0", action: () => this.zoomFit() }
        ];
    this.openMenuAt(event.clientX, event.clientY, items);
  };

  private openMenuAt(x: number, y: number, items: MenuItem[]) {
    this.closeMenu();
    const menu = document.createElement("div");
    menu.className = "vc-menu";
    for (const item of items) {
      if (item.separator) {
        const separator = document.createElement("div");
        separator.className = "vc-menu-sep";
        menu.appendChild(separator);
        continue;
      }
      const row = document.createElement("button");
      row.type = "button";
      row.className = "vc-menu-item";
      row.innerHTML = `<span class="vc-menu-check"></span><span class="vc-menu-label">${item.label ?? ""}</span><span class="vc-menu-shortcut">${
        item.shortcut ?? ""
      }</span>`;
      row.addEventListener("click", () => {
        this.closeMenu();
        item.action?.();
      });
      menu.appendChild(row);
    }
    document.body.appendChild(menu);
    menu.style.left = `${Math.max(6, Math.min(x, window.innerWidth - menu.offsetWidth - 8))}px`;
    menu.style.top = `${Math.max(6, Math.min(y, window.innerHeight - menu.offsetHeight - 8))}px`;
    this.menu = menu;
  }

  /* ------------------------- 键盘 ------------------------- */

  private onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key;

    if (key === "Escape") {
      this.closeMenu();
      if (this.penId) this.finishPen(false);
      else if (this.selection.length) this.select([]);
      return;
    }

    if (key === " ") {
      if (target.tagName === "BUTTON") return;
      this.spaceDown = true;
      this.stage.element.classList.add("is-panning");
      event.preventDefault();
      return;
    }

    if (mod) {
      switch (key.toLowerCase()) {
        case "z":
          event.preventDefault();
          if (event.shiftKey) this.redo();
          else this.undo();
          return;
        case "y":
          event.preventDefault();
          this.redo();
          return;
        case "d":
          event.preventDefault();
          this.duplicateSelection();
          return;
        case "a":
          event.preventDefault();
          if (event.shiftKey) this.select([]);
          else this.selectAll();
          return;
        case "c":
          event.preventDefault();
          this.copySelection();
          return;
        case "x":
          event.preventDefault();
          this.cutSelection();
          return;
        case "v":
          event.preventDefault();
          this.pasteSelection();
          return;
        case "s":
          event.preventDefault();
          this.saveDocument();
          return;
        case "o":
          event.preventDefault();
          if (event.shiftKey) this.outlineSelection();
          else this.fileInput.click();
          return;
        case "0":
          event.preventDefault();
          this.zoomFit();
          return;
        case "1":
          event.preventDefault();
          this.setZoomPercent(100);
          return;
        case "2":
          event.preventDefault();
          this.zoomToSelection();
          return;
        case "r":
          event.preventDefault();
          if (event.shiftKey) this.toast("Show Rulers 使用 View 菜单");
          else this.toggleRulers();
          return;
        case "=":
        case "+":
          event.preventDefault();
          this.zoomBy(1.25);
          return;
        case "-":
          event.preventDefault();
          this.zoomBy(0.8);
          return;
        case "g":
          event.preventDefault();
          this.toast("Group：示例未接入");
          return;
        default:
          break;
      }
    }

    if (key === "Delete" || key === "Backspace") {
      event.preventDefault();
      this.deleteSelection();
      return;
    }

    if (key === "Enter" && this.penId) {
      event.preventDefault();
      this.finishPen(true);
      return;
    }

    if (key.startsWith("Arrow")) {
      if (!this.selection.length) return;
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      const dx = key === "ArrowLeft" ? -step : key === "ArrowRight" ? step : 0;
      const dy = key === "ArrowUp" ? -step : key === "ArrowDown" ? step : 0;
      this.pushHistory();
      for (const object of this.selectedObjects()) {
        object.x += dx;
        object.y += dy;
      }
      this.refresh();
      return;
    }

    const tool = TOOL_SHORTCUTS[key.toLowerCase()];
    if (tool && !mod && !event.altKey) {
      this.setTool(tool);
      this.toolbar.setActive(tool);
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.key === " ") {
      this.spaceDown = false;
      this.stage.element.classList.remove("is-panning");
    }
  };

  /* ------------------------- 供 panels 使用 ------------------------- */

  openLibraryTab() {
    this.focusSidebar("libraries");
  }
}

const editor = new Editor();
editor.start();
