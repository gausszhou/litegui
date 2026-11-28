import "@gausszhou/litegui-components/style.css";
import "./style.css";
import { HeaderBar, Toolbar, type ToolbarTool } from "@gausszhou/litegui-components";
import { icon } from "./icons";
import {
  createNeonDocument,
  createObject,
  cloneObject,
  deserializeDocument,
  uid,
  serializeDocument,
  unionBounds,
  isText,
  paintLabel,
  gradientCss,
  pointsBounds,
  type Paint,
  type Vec2,
  type VecDocument,
  type VecObject
} from "./scene";
import { downloadPng, downloadText, documentSvg, Stage } from "./stage";
import { buildFontCss, textToOutlinePath } from "./display-font";
import { buildMenu, openModal, positionMenu, type MenuItem } from "./overlay";
import { showAboutDialog, showHistoryDialog, showSearchDialog, showShortcutsDialog } from "./dialogs";
import { nearestPointIndex, nearestSegment, pointInPolygon, simplifyPoints, smoothPoints } from "./path-tools";
import { round } from "./number";
import { PanelsController, type AlignMode, type EditorContext, type ScreenRect, type UiState } from "./panels";

interface Snapshot {
  doc: string;
  selection: string[];
}

interface DragOrigin {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DragState {
  mode: "move" | "resize" | "marquee" | "pan" | "rotate" | "create" | "brush" | "lasso" | "anchor" | null;
  startDoc: Vec2;
  startScreen: Vec2;
  lastScreen: Vec2;
  handleIndex?: string;
  objectId?: string;
  origins: DragOrigin[];
  pointIndex?: number;
  lassoPoints?: Vec2[];
  startAngle: number;
  moved: boolean;
  historyPushed: boolean;
}

const TOOL_STATUS: Record<string, string> = {
  select: "选择工具",
  direct: "直接选择工具",
  group: "编组选择工具",
  lasso: "套索工具",
  pen: "钢笔工具",
  penAdd: "添加锚点工具",
  penRemove: "删除锚点工具",
  anchor: "锚点工具",
  type: "文字工具",
  verticalType: "直排文字工具",
  line: "直线段工具",
  rect: "矩形工具",
  ellipse: "椭圆工具",
  polygon: "多边形工具",
  star: "星形工具",
  brush: "画笔工具",
  pencil: "铅笔工具",
  smooth: "平滑工具",
  shaper: "成形工具",
  pathEraser: "路径橡皮擦工具",
  eraser: "橡皮擦工具",
  scissors: "剪刀工具",
  knife: "刻刀工具",
  hand: "抓手工具",
  rotate: "旋转工具",
  zoom: "缩放工具"
};

const TOOLS: ToolbarTool[] = [
  { id: "select", label: "选择", shortcut: "V", icon: icon("select", 17, "vc-tool-svg") },
  { id: "direct", label: "直接选择", shortcut: "A", icon: icon("directSelect", 17) },
  { id: "group", label: "编组选择", icon: icon("groupSelect", 17) },
  { id: "lasso", label: "套索", shortcut: "Q", icon: icon("lasso", 17) },
  { id: "pen", label: "钢笔", shortcut: "P", icon: icon("pen", 17) },
  { id: "penAdd", label: "添加锚点", icon: icon("penAdd", 17) },
  { id: "penRemove", label: "删除锚点", icon: icon("penRemove", 17) },
  { id: "anchor", label: "锚点", shortcut: "Shift+C", icon: icon("anchor", 17) },
  { id: "type", label: "文字", shortcut: "T", icon: icon("type", 17) },
  { id: "verticalType", label: "直排文字", shortcut: "Shift+T", icon: icon("verticalType", 17) },
  { id: "line", label: "直线段", shortcut: "\\", icon: icon("line", 17) },
  { id: "rect", label: "矩形", shortcut: "M", icon: icon("rect", 17) },
  { id: "ellipse", label: "椭圆", shortcut: "L", icon: icon("ellipse", 17) },
  { id: "polygon", label: "多边形", icon: icon("polygon", 17) },
  { id: "star", label: "星形", icon: icon("star", 17) },
  { id: "brush", label: "画笔", shortcut: "B", icon: icon("brush", 17) },
  { id: "pencil", label: "铅笔", shortcut: "N", icon: icon("pencil", 17) },
  { id: "smooth", label: "平滑", icon: icon("smooth", 17) },
  { id: "shaper", label: "成形", shortcut: "Shift+N", icon: icon("shaper", 17) },
  { id: "pathEraser", label: "路径橡皮擦", icon: icon("pathEraser", 17) },
  { id: "eraser", label: "橡皮擦", shortcut: "Shift+E", icon: icon("eraser", 17) },
  { id: "scissors", label: "剪刀", shortcut: "C", icon: icon("scissors", 17) },
  { id: "knife", label: "刻刀", icon: icon("knife", 17) },
  { id: "hand", label: "抓手", shortcut: "H", icon: icon("hand", 17) },
  { id: "rotate", label: "旋转", shortcut: "R", icon: icon("rotate", 17) },
  { id: "zoom", label: "缩放", shortcut: "Z", icon: icon("zoom", 17) }
];

const RAIL_MAIN = [
  { id: "properties", title: "属性", icon: "properties" },
  { id: "layers", title: "图层", icon: "layers" },
  { id: "libraries", title: "库", icon: "libraries" },
  { id: "appearance", title: "外观", icon: "appearance" },
  { id: "color", title: "颜色", icon: "color" },
  { id: "gradient", title: "渐变", icon: "gradient" },
  { id: "opacity", title: "透明度", icon: "opacity" },
  { id: "transform", title: "变换", icon: "transform" },
  { id: "symbols", title: "符号", icon: "symbols" },
  { id: "align", title: "对齐", icon: "align" },
  { id: "pathfinder", title: "路径查找器", icon: "pathfinder" },
  { id: "effects", title: "效果", icon: "effects" },
  { id: "artboard", title: "画板", icon: "artboard" },
  { id: "guides", title: "参考线", icon: "guides" },
  { id: "measure", title: "测量", icon: "measure" },
  { id: "comment", title: "注释", icon: "comment" },
  { id: "history", title: "历史记录", icon: "history" },
  { id: "actions", title: "动作", icon: "actions" },
  { id: "export", title: "导出", icon: "export" }
];

const RAIL_FOOT = [
  { id: "settings", title: "设置", icon: "settings" },
  { id: "help", title: "帮助", icon: "help" },
  { id: "pointer", title: "选择", icon: "pointer" }
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
          <span class="vc-doctab-meta" id="vc-doc-meta">@ 100% (RGB/预览)</span>
          <button class="vc-doctab-close" data-doc-close title="关闭文档">${icon("close", 11)}</button>
        </div>
        <div class="vc-doctabs-fill"></div>
      </div>
      <div class="vc-viewport" id="vc-viewport">
        <div id="vc-stage"></div>
        <div class="vc-float vc-appearance" id="vc-appearance"></div>
        <div class="vc-ctxbar" id="vc-ctxbar" hidden></div>
        <div class="vc-marquee" id="vc-marquee" hidden></div>
        <svg class="vc-lasso" id="vc-lasso"><path id="vc-lasso-path"/></svg>
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
      <span class="vc-status-hint" id="vc-hint">单击以选择对象 | Shift+单击以选择多个对象 | Alt+拖动以复制对象</span>
      <span class="vc-spacer"></span>
      <span class="vc-status-mode">RGB / 预览</span>
    </div>
    <div class="vc-status-row vc-status-row--controls">
      <button class="vc-status-btn vc-zoom-btn" id="vc-zoom" title="缩放比例">100%</button>
      <button class="vc-status-btn" id="vc-rotation" title="旋转">0°</button>
      <span class="vc-status-sep"></span>
      <button class="vc-status-btn vc-icon-only" data-status-action="prev-artboard" title="上一个画板">${icon(
        "navPrev",
        13
      )}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="fit" title="适应画板 (Ctrl+0)">${icon(
        "fit",
        13
      )}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="next-artboard" title="下一个画板">${icon(
        "navNext",
        13
      )}</button>
      <span class="vc-status-sep"></span>
      <span class="vc-artboard-chip" id="vc-artboard">1 Artboard 1</span>
      <button class="vc-status-btn vc-icon-only" data-status-action="prev-artboard" title="上一个画板">${icon(
        "chevronLeft",
        12
      )}</button>
      <button class="vc-status-btn vc-icon-only" data-status-action="next-artboard" title="下一个画板">${icon(
        "chevronRight",
        12
      )}</button>
      <span class="vc-select-state" id="vc-selection-state">选择工具</span>
      <span class="vc-spacer"></span>
      <span class="vc-status-stats" id="vc-stats">渲染 0.0 ms · 界面 0.0 ms · 60 fps</span>
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
    showRulers: false,
    unit: "pt",
    alignToPoint: true,
    alignToGrid: false,
    keyboardIncrement: 1,
    scaleStrokes: true
  };
  selection: string[] = ["neon-title"];
  tool = "select";
  private stage!: Stage;
  private panels!: PanelsController;
  private toolbar!: Toolbar;
  private viewport!: HTMLElement;
  private marquee!: HTMLElement;
  private lasso!: SVGSVGElement;
  private lassoPath!: SVGPathElement;
  private zoomButton!: HTMLButtonElement;
  private hintElement!: HTMLElement;
  private selectionState!: HTMLElement;
  private statsElement!: HTMLElement;
  private rotationButton!: HTMLButtonElement;
  private docMeta!: HTMLElement;
  private history: Snapshot[] = [];
  private future: Snapshot[] = [];
  private clipboard: VecObject[] | null = null;
  private fileInput!: HTMLInputElement;
  private menu: HTMLElement | null = null;
  private menuAnchor: HTMLElement | null = null;
  private drag: DragState | null = null;
  private spaceDown = false;
  private fillPaint: Paint = "#ffffff";
  private strokePaint: Paint = "#000000";
  private penId: string | null = null;
  private renderTime = 0;
  private uiTime = 0;
  private frames = 0;
  private fps = 60;
  private fpsStamp = performance.now();
  private toastTimer = 0;
  private measureMode = false;
  private defaultHint = "单击以选择对象 | Shift+单击以选择多个对象 | Alt+拖动以复制对象";

  start() {
    const app = document.querySelector<HTMLElement>("#app");
    if (!app) throw new Error("#app missing");
    app.innerHTML = MOUNT;
    this.viewport = document.querySelector<HTMLElement>("#vc-viewport")!;
    this.marquee = document.querySelector<HTMLElement>("#vc-marquee")!;
    this.lasso = document.querySelector<SVGSVGElement>("#vc-lasso")!;
    this.lassoPath = document.querySelector<SVGPathElement>("#vc-lasso-path")!;
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
    this.stage.element.addEventListener("pointermove", event => {
      if (!this.measureMode) return;
      const point = this.stage.screenToDoc(event.clientX, event.clientY);
      this.hintElement.textContent = `X: ${point.x.toFixed(1)} pt   Y: ${point.y.toFixed(1)} pt`;
    });

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
    const menuLabels: Record<string, string> = {
      File: "文件",
      Edit: "编辑",
      Object: "对象",
      Type: "文字",
      Select: "选择",
      Effect: "效果",
      View: "视图",
      Window: "窗口",
      Help: "帮助"
    };
    for (const name of ["File", "Edit", "Object", "Type", "Select", "Effect", "View", "Window", "Help"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vc-menu-btn";
      button.dataset.menu = name;
      button.textContent = menuLabels[name] ?? name;
      button.addEventListener("click", () => this.openMenu(button, this.menus()[name] ?? []));
      menubar.appendChild(button);
    }
    topbar.left.appendChild(menubar);

    const right = document.createElement("div");
    right.className = "vc-topbar-right";
    right.innerHTML = `
      <button class="vc-discord" data-top-action="discord">${icon("discord", 15)}<span>Discord</span></button>
      <button class="vc-top-icon" data-top-action="search" title="搜索">${icon("search", 16)}</button>
      <button class="vc-workspace" data-top-action="workspace">基本功能 ${icon("chevronDown", 12)}</button>
      <div class="vc-window-controls">
        <button class="vc-window-btn" data-top-action="minimize" title="最小化">${icon("minimize", 13)}</button>
        <button class="vc-window-btn" data-top-action="maximize" title="最大化">${icon("maximize", 12)}</button>
        <button class="vc-window-btn vc-window-btn--close" data-top-action="close" title="关闭">${icon(
          "close",
          12
        )}</button>
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
        this.showSearch();
        break;
      case "workspace":
        this.openMenu(
          anchor,
          [
            ["基本功能", "Essentials"],
            ["布局", "Layout"],
            ["排版", "Typography"],
            ["绘画", "Painting"],
            ["导出", "Export"]
          ].map(([label, key]) => ({
            label,
            checked: key === "Essentials",
            action: () => this.toast(`工作区：${label}`)
          }))
        );
        break;
      case "minimize":
        this.toast("浏览器环境无法最小化窗口");
        break;
      case "maximize":
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => this.toast("浏览器拒绝了全屏请求"));
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
      <div class="vc-colorstack" title="填色">
        <button class="vc-colorstack-fill" data-swatch="fill" aria-label="填色"></button>
        <button class="vc-colorstack-stroke" data-swatch="stroke" aria-label="描边"></button>
      </div>
      <button class="vc-mini-btn vc-swatch-swap" data-swatch="swap" title="交换填色和描边 (Shift+X)">${icon(
        "swap",
        13
      )}</button>
      <button class="vc-mini-btn vc-swatch-default" data-swatch="default" title="默认填色和描边 (D)">${icon(
        "defaultColors",
        13
      )}</button>
      <button class="vc-mini-btn vc-swatch-screen" data-swatch="screen" title="屏幕模式">${icon(
        "screenMode",
        13
      )}</button>
      <div class="vc-swatch-chips">
        <button class="vc-swatch-chip" data-swatch="gradient" title="渐变填色">${icon("gradientSwatch", 12)}</button>
        <button class="vc-swatch-chip" data-swatch="none" title="无填色">${icon("noneSwatch", 12)}</button>
      </div>`;
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
        ${RAIL_MAIN.map(
          item =>
            `<button class="vc-rail-btn" data-rail="${item.id}" title="${item.title}">${icon(item.icon, 18)}</button>`
        ).join("")}
      </div>
      <div class="vc-rail-foot">
        ${RAIL_FOOT.map(
          item =>
            `<button class="vc-rail-btn" data-rail="${item.id}" title="${item.title}">${icon(item.icon, 18)}</button>`
        ).join("")}
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
      case "transform":
        this.focusSidebar("properties");
        this.panels.scrollTo('[data-section="transform"]');
        break;
      case "opacity":
        this.focusSidebar("properties");
        this.panels.scrollTo('[data-section="appearance"]');
        break;
      case "symbols":
        this.focusSidebar("libraries");
        break;
      case "artboard":
        this.focusSidebar("properties");
        this.panels.scrollTo(".vc-section--title");
        break;
      case "guides":
        this.toggleGrid();
        this.toast(`网格已${this.ui.showGrid ? "显示" : "隐藏"}`);
        break;
      case "measure":
        this.toggleMeasure();
        break;
      case "history":
        this.showHistory();
        break;
      case "actions":
        void this.exportSvg();
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
      case "pointer":
        this.setTool("select");
        break;
      case "settings":
        this.toast("设置：当前仅提供深色主题");
        break;
      default:
        this.toast(`${id}：该面板暂未接入`);
        break;
    }
  }

  private buildStatus() {
    document.querySelector(".vc-status")!.addEventListener("click", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-status-action]");
      if (!target) return;
      const action = target.dataset.statusAction;
      if (action === "fit") this.zoomFit();
      else if (action === "prev-artboard" || action === "next-artboard") this.toast("当前只有一个画板");
    });
    document.querySelector("[data-help]")?.addEventListener("click", () => this.showShortcuts());
    this.zoomButton.addEventListener("click", () => {
      this.openMenu(this.zoomButton, [
        { label: "放大", shortcut: "Ctrl++", action: () => this.zoomBy(1.25) },
        { label: "缩小", shortcut: "Ctrl+-", action: () => this.zoomBy(0.8) },
        { separator: true },
        { label: "适应画板", shortcut: "Ctrl+0", action: () => this.zoomFit() },
        { label: "实际大小", shortcut: "Ctrl+1", action: () => this.setZoomPercent(100) },
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
        { label: "新建", shortcut: "Ctrl N", action: () => this.newDocument() },
        { label: "打开…", shortcut: "Ctrl O", action: () => this.fileInput.click() },
        { label: "恢复", action: () => this.newDocument() },
        { separator: true },
        { label: "保存", shortcut: "Ctrl S", action: () => this.saveDocument() },
        { label: "另存为…", action: () => this.saveDocument() },
        { separator: true },
        { label: "导出 SVG…", action: () => void this.exportSvg() },
        { label: "导出 PNG…", shortcut: "Alt Shift P", action: () => void this.exportPng() },
        { separator: true },
        { label: "文档设置…", action: () => this.showDocumentSetup() },
        { label: "打印…", shortcut: "Ctrl P", action: () => this.toast("打印：示例未接入") }
      ],
      Edit: [
        { label: "撤销", shortcut: "Ctrl Z", disabled: this.history.length === 0, action: () => this.undo() },
        { label: "重做", shortcut: "Shift Ctrl Z", disabled: this.future.length === 0, action: () => this.redo() },
        { separator: true },
        { label: "剪切", shortcut: "Ctrl X", action: () => this.cutSelection() },
        { label: "复制", shortcut: "Ctrl C", action: () => this.copySelection() },
        { label: "粘贴", shortcut: "Ctrl V", action: () => this.pasteSelection() },
        { separator: true },
        { label: "删除", shortcut: "Del", action: () => this.deleteSelection() },
        { label: "重复", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
        { separator: true },
        { label: "键盘快捷键…", action: () => this.showShortcuts() }
      ],
      Object: [
        { label: "再次变换", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
        { label: "顺时针旋转 90°", action: () => this.rotateSelection(90) },
        { label: "逆时针旋转 90°", action: () => this.rotateSelection(-90) },
        { separator: true },
        { label: "排列：置于顶层", shortcut: "Shift Ctrl ]", action: () => this.bringToFront() },
        { label: "排列：置于底层", shortcut: "Shift Ctrl [", action: () => this.sendToBack() },
        { separator: true },
        { label: "锁定", shortcut: "Ctrl 2", action: () => this.selection.forEach(id => this.toggleLock(id)) },
        {
          label: "全部解锁",
          shortcut: "Alt Ctrl 2",
          action: () => this.doc.objects.forEach(object => (object.locked = false))
        },
        { label: "隐藏", shortcut: "Ctrl 3", action: () => this.selection.forEach(id => this.toggleVisibility(id)) },
        { separator: true },
        { label: "编组", shortcut: "Ctrl G", action: () => this.groupSelection() },
        { label: "取消编组", shortcut: "Shift Ctrl G", action: () => this.ungroupSelection() }
      ],
      Type: [
        { label: "创建轮廓", shortcut: "Shift Ctrl O", action: () => void this.outlineSelection() },
        { label: "增大字号", shortcut: "Ctrl Shift >", action: () => this.stepFontSize(4) },
        { label: "减小字号", shortcut: "Ctrl Shift <", action: () => this.stepFontSize(-4) },
        { separator: true },
        { label: "居中对齐", action: () => this.updateSelection({ align: "center" }, true) },
        { label: "重置字距", action: () => this.updateSelection({ letterSpacing: 0 }, true) },
        { separator: true },
        { label: "编辑文字…", action: () => this.editPrimaryText() }
      ],
      Select: [
        { label: "全部", shortcut: "Ctrl A", action: () => this.selectAll() },
        { label: "取消选择", shortcut: "Ctrl Shift A", action: () => this.select([]) },
        { separator: true },
        { label: "相同：填色", action: () => this.selectSameFill() },
        { label: "反向", action: () => this.selectInverse() },
        { label: "下一个对象（下层）", shortcut: "Ctrl Alt ]", action: () => this.selectNextObject(1) },
        { label: "上一个对象（上层）", shortcut: "Ctrl Alt [", action: () => this.selectNextObject(-1) }
      ],
      Effect: [
        { label: "外发光", checked: (this.primaryObject()?.glow ?? 0) > 0, action: () => this.toggleGlow() },
        { label: "移除所有效果", action: () => this.updateSelection({ glow: 0 }, true) },
        { separator: true },
        { label: "投影…", action: () => this.toast("投影：示例未接入") },
        { label: "高斯模糊…", action: () => this.toast("高斯模糊：示例未接入") }
      ],
      View: [
        { label: "放大", shortcut: "Ctrl +", action: () => this.zoomBy(1.25) },
        { label: "缩小", shortcut: "Ctrl -", action: () => this.zoomBy(0.8) },
        { label: "适应画板", shortcut: "Ctrl 0", action: () => this.zoomFit() },
        { label: "实际大小", shortcut: "Ctrl 1", action: () => this.setZoomPercent(100) },
        { label: "缩放到选中对象", shortcut: "Ctrl 2", action: () => this.zoomToSelection() },
        { separator: true },
        {
          label: "显示标尺",
          shortcut: "Ctrl R",
          checked: this.ui.showRulers,
          command: "show-rulers",
          action: () => this.toggleRulers()
        },
        {
          label: "显示网格",
          shortcut: "Ctrl '",
          checked: this.ui.showGrid,
          command: "show-grid",
          action: () => this.toggleGrid()
        },
        {
          label: "轮廓模式",
          shortcut: "Ctrl Y",
          checked: this.ui.outlineMode,
          command: "outline-mode",
          action: () => this.toggleOutlineMode()
        }
      ],
      Window: [
        { label: "属性", action: () => this.focusSidebar("properties") },
        { label: "图层", action: () => this.focusSidebar("layers") },
        { label: "库", action: () => this.focusSidebar("libraries") },
        { separator: true },
        { label: "外观", checked: this.ui.showAppearance, action: () => this.toggleAppearance() },
        { label: "上下文栏", checked: this.ui.showContextBar, action: () => this.toggleContextBar() },
        { separator: true },
        { label: "重置工作区", action: () => this.resetWorkspace() }
      ],
      Help: [
        { label: "键盘快捷键", action: () => this.showShortcuts() },
        { label: "关于 VectorCraft", action: () => this.showAbout() },
        {
          label: "LiteGUI 文档",
          action: () => window.open("https://gausszhou.github.io/litegui/docs/", "_blank")
        }
      ]
    };
  }

  openMenu(anchor: HTMLElement, items: MenuItem[]) {
    if (this.menu && this.menuAnchor === anchor) {
      this.closeMenu();
      return;
    }
    this.closeMenu();
    const menu = buildMenu(items, () => this.closeMenu());
    document.body.appendChild(menu);
    const rect = anchor.getBoundingClientRect();
    positionMenu(menu, rect.left, rect.bottom + 4);
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

  private editableSelection(): VecObject[] {
    return this.selectedObjects().filter(object => !object.locked);
  }

  /** 点集对象（钢笔/画笔/山体）的包围盒与 base 同步，保证 Transform 与画面一致。 */
  private syncPointBounds(object: VecObject) {
    if (!object.points?.length) return;
    const bounds = pointsBounds(object.points);
    object.x = round(bounds.x);
    object.y = round(bounds.y);
    object.width = round(bounds.width);
    object.height = round(bounds.height);
    object.base = { ...bounds };
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
    if (object.locked) {
      this.toast("对象已锁定，请先在图层面板中解锁");
      this.refresh();
      return;
    }
    if (record) this.pushHistory();
    Object.assign(object, patch);
    this.refresh();
  }

  updateSelection(patch: Partial<VecObject>, record = true) {
    const objects = this.editableSelection();
    if (!objects.length) {
      if (this.selection.length) this.toast("对象已锁定，请先在图层面板中解锁");
      return;
    }
    if (record) this.pushHistory();
    for (const object of objects) Object.assign(object, patch);
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
    this.docMeta.textContent = `@ ${zoomText} (RGB/预览)`;
    const docTitle = document.querySelector<HTMLElement>("#vc-doc-title");
    if (docTitle) docTitle.textContent = this.doc.name;
    const primary = this.primaryObject();
    this.rotationButton.textContent = `${Math.round(primary?.rotation ?? 0)}°`;
    this.selectionState.textContent = TOOL_STATUS[this.tool] ?? "选择工具";
    this.hintElement.textContent = this.hintForTool();
    const fillSwatch = document.querySelector<HTMLElement>(".vc-colorstack-fill");
    const strokeSwatch = document.querySelector<HTMLElement>(".vc-colorstack-stroke");
    if (fillSwatch) {
      fillSwatch.style.background = primary
        ? primary.fill === "none"
          ? ""
          : this.cssPaint(primary.fill)
        : this.fillPaint;
      fillSwatch.classList.toggle("is-none", primary?.fill === "none");
    }
    if (strokeSwatch) {
      strokeSwatch.style.borderColor =
        primary && primary.stroke !== "none" ? this.cssPaint(primary.stroke) : this.strokePaint;
      strokeSwatch.classList.toggle("is-none", primary ? primary.stroke === "none" : false);
    }
    this.syncRail();
    this.updateStats();
  }

  setDefaultPaint(paint: Paint) {
    this.fillPaint = paint;
    this.updateChrome();
    this.toast(`默认填色：${paintLabel(paint)}`);
  }

  defaultPaint(): { fill: Paint; stroke: Paint } {
    return { fill: this.fillPaint, stroke: this.strokePaint };
  }

  setUi(patch: Partial<UiState>) {
    Object.assign(this.ui, patch);
    this.refresh();
  }

  private cssPaint(paint: Paint): string {
    return paint.startsWith("url(") ? gradientCss(paint) : paint;
  }

  private hintForTool(): string {
    switch (this.tool) {
      case "rect":
        return "拖动绘制矩形 | Shift+拖动保持比例 | Alt+从中心绘制";
      case "ellipse":
        return "拖动绘制椭圆 | Shift+拖动绘制正圆";
      case "polygon":
        return "拖动绘制多边形 | 边数可在属性面板调整";
      case "star":
        return "拖动绘制星形 | 离中心越远星角越尖";
      case "line":
        return "拖动绘制直线段 | Shift+拖动限制为 45°";
      case "type":
        return "单击放置文字 | 双击已有文字进行编辑";
      case "pen":
        return "单击添加锚点 | Enter 或双击结束 | Esc 取消";
      case "brush":
      case "pencil":
        return "拖动绘制路径 | 松开结束笔画";
      case "hand":
        return "拖动平移画布 | 任意工具下按住空格拖动";
      case "zoom":
        return "单击放大 | Alt+单击缩小 | Ctrl+0 适应画板";
      case "rotate":
        return "拖动围绕中心旋转选中对象";
      case "eraser":
        return "单击对象将其擦除";
      case "lasso":
        return "拖动圈选对象 · Esc 取消";
      case "group":
        return "点击编组对象以选中整组";
      case "anchor":
        return "拖动路径锚点 · 需先选中路径";
      case "penAdd":
        return "在选中的路径上点击以添加锚点";
      case "penRemove":
        return "点击锚点删除 · 至少保留 2 个";
      case "pathEraser":
        return "点击路径锚点删除该点";
      case "scissors":
      case "knife":
        return "点击开放路径在落点处切开";
      case "smooth":
        return "平滑选中路径的锚点";
      case "shaper":
        return "拖动创建形状";
      case "verticalType":
        return "点击画布创建竖排文字";
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
    this.statsElement.textContent = `渲染 ${this.renderTime.toFixed(1)} ms · 界面 ${this.uiTime.toFixed(1)} ms · ${
      this.fps
    } fps`;
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
      this.toast("没有可撤销的操作");
      return;
    }
    this.future.push({ doc: JSON.stringify(this.doc), selection: [...this.selection] });
    this.restore(entry);
    this.toast("已撤销");
  }

  private redo() {
    const entry = this.future.pop();
    if (!entry) {
      this.toast("没有可重做的操作");
      return;
    }
    this.history.push({ doc: JSON.stringify(this.doc), selection: [...this.selection] });
    this.restore(entry);
    this.toast("已重做");
  }

  private restore(entry: Snapshot) {
    const parsed = deserializeDocument(entry.doc);
    if (!parsed) return;
    this.doc = parsed;
    this.selection = entry.selection.filter(id => this.doc.objects.some(object => object.id === id));
    this.refresh();
  }

  /* ------------------------- 编辑操作 ------------------------- */

  deleteSelection() {
    const removable = this.editableSelection();
    if (!removable.length) {
      if (this.selection.length) this.toast("对象已锁定，无法删除");
      return;
    }
    this.pushHistory();
    const ids = new Set(removable.map(object => object.id));
    this.doc.objects = this.doc.objects.filter(object => !ids.has(object.id));
    this.selection = this.selection.filter(id => !ids.has(id));
    this.refresh();
    this.toast(`Deleted ${removable.length} object(s)`);
  }

  duplicateSelection() {
    const objects = this.editableSelection();
    if (!objects.length) {
      this.toast("请先选择对象");
      return;
    }
    this.pushHistory();
    this.selection = this.insertClones(objects, 16, 16, "copy");
    this.refresh();
    this.toast("已重复");
  }

  private insertClones(objects: VecObject[], dx: number, dy: number, prefix: string): string[] {
    const groupMap = new Map<string, string>();
    return objects.map(object => {
      const clone = cloneObject(object);
      clone.id = `${object.id}-${prefix}-${Math.random().toString(36).slice(2, 6)}`;
      clone.x += dx;
      clone.y += dy;
      if (object.groupId) {
        if (!groupMap.has(object.groupId)) groupMap.set(object.groupId, uid("group"));
        clone.groupId = groupMap.get(object.groupId);
      }
      this.doc.objects.push(clone);
      return clone.id;
    });
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
      this.toast("剪贴板为空");
      return;
    }
    this.pushHistory();
    this.selection = this.insertClones(this.clipboard, 24, 24, "paste");
    this.refresh();
    this.toast("已粘贴");
  }

  selectAll() {
    this.select(this.doc.objects.filter(object => !object.locked && object.visible).map(object => object.id));
  }

  selectInverse() {
    this.select(
      this.doc.objects.filter(object => !this.selection.includes(object.id) && !object.locked).map(object => object.id)
    );
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
    const moving = this.editableSelection();
    if (!moving.length) return;
    this.pushHistory();
    const ids = new Set(moving.map(object => object.id));
    this.doc.objects = [...this.doc.objects.filter(object => !ids.has(object.id)), ...moving];
    this.refresh();
    this.toast("已置于顶层");
  }

  sendToBack() {
    const moving = this.editableSelection();
    if (!moving.length) return;
    this.pushHistory();
    const ids = new Set(moving.map(object => object.id));
    this.doc.objects = [...moving, ...this.doc.objects.filter(object => !ids.has(object.id))];
    this.refresh();
    this.toast("已置于底层");
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
      this.toast("请先选择对象再添加外发光");
      return;
    }
    this.updateSelection({ glow: primary.glow > 0 ? 0 : 22, glowColor: primary.glowColor || "#8f6bff" }, true);
    this.toast(primary.glow > 0 ? "Outer Glow added" : "Outer Glow removed");
  }

  async outlineSelection() {
    const texts = this.editableSelection().filter(object => isText(object));
    if (!texts.length) {
      this.toast("创建轮廓需要选中文本对象");
      return;
    }
    if (texts.some(object => object.vertical)) {
      this.toast("竖排文字暂不支持创建轮廓");
      return;
    }
    try {
      const outlines = await Promise.all(texts.map(async object => ({ object, d: await textToOutlinePath(object) })));
      this.pushHistory();
      for (const { object, d } of outlines) {
        if (!d) continue;
        object.kind = "path";
        object.pathData = d;
        object.points = undefined;
        object.closed = true;
        object.base = { x: object.x, y: object.y, width: object.width, height: object.height };
        object.text = undefined;
        object.subline = undefined;
        object.textLength = undefined;
        object.letterSpacing = undefined;
        object.stroke = "none";
        object.strokeWidth = 0;
        object.name = object.name.includes("(Outlines)") ? object.name : `${object.name} (Outlines)`;
      }
      this.refresh();
      this.toast("已转换为真实字形轮廓（锚点可继续编辑）");
    } catch {
      this.toast("字体加载失败，无法创建轮廓");
    }
  }

  alignSelection(mode: AlignMode) {
    const objects = this.editableSelection();
    if (!objects.length) {
      this.toast("请选择未锁定的对象");
      return;
    }
    this.pushHistory();
    const union = unionBounds(objects);
    if (!union) return;
    const artboard = { x: 0, y: 0, width: this.doc.width, height: this.doc.height };
    const target = objects.length > 1 ? union : artboard;
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
    const objects = this.editableSelection();
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
    const objects = this.editableSelection();
    if (!objects.length) {
      this.toast("请先选择对象");
      return;
    }
    this.pushHistory();
    for (const object of objects) object.rotation = (object.rotation + degrees + 360) % 360;
    this.refresh();
  }

  stepFontSize(delta: number) {
    const primary = this.primaryObject();
    if (!primary || !isText(primary)) return;
    this.pushHistory();
    for (const object of this.editableSelection()) {
      if (isText(object)) object.fontSize = Math.max(4, (object.fontSize ?? 24) + delta);
    }
    this.refresh();
  }

  private updateLassoPath(points: Vec2[]) {
    const d = points
      .map((point, index) => {
        const local = this.stage.docToLocal(point);
        return `${index === 0 ? "M" : "L"}${Math.round(local.x)} ${Math.round(local.y)}`;
      })
      .join(" ");
    this.lassoPath.setAttribute("d", d);
  }

  private insertPoint(object: VecObject, docPoint: Vec2) {
    if (nearestPointIndex(object, docPoint, 4 / this.stage.zoomLevel) >= 0) {
      this.toast("该位置已有锚点");
      return;
    }
    const hit = nearestSegment(object.points ?? [], docPoint, object.closed ?? false);
    if (!hit || hit.distance > 16 / this.stage.zoomLevel) {
      this.toast("请靠近路径添加锚点");
      return;
    }
    this.pushHistory();
    object.points?.splice(hit.index + 1, 0, { x: round(hit.point.x), y: round(hit.point.y) });
    this.syncPointBounds(object);
    this.refresh();
    this.toast("已添加锚点");
  }

  private removePointNear(object: VecObject, docPoint: Vec2, threshold: number) {
    const index = nearestPointIndex(object, docPoint, threshold);
    if (index < 0) {
      this.toast("请点击路径上的锚点");
      return;
    }
    this.pushHistory();
    object.points?.splice(index, 1);
    if (!object.points || object.points.length < 2) {
      this.doc.objects = this.doc.objects.filter(item => item.id !== object.id);
      this.selection = this.selection.filter(id => id !== object.id);
      this.refresh();
      this.toast("路径点不足，已删除路径");
      return;
    }
    this.syncPointBounds(object);
    this.refresh();
    this.toast("已删除锚点");
  }

  private splitPathAt(object: VecObject, docPoint: Vec2) {
    if (!object.points || object.points.length < 3 || object.closed) {
      this.toast("仅支持切开开放路径");
      return;
    }
    const hit = nearestSegment(object.points, docPoint, false);
    if (!hit) return;
    const first = [...object.points.slice(0, hit.index + 1), { x: round(hit.point.x), y: round(hit.point.y) }];
    const second = [{ x: round(hit.point.x), y: round(hit.point.y) }, ...object.points.slice(hit.index + 1)];
    if (first.length < 2 || second.length < 2) {
      this.toast("切口太靠近端点");
      return;
    }
    this.pushHistory();
    const make = (points: Vec2[], suffix: string) => {
      const clone = cloneObject(object);
      clone.id = uid("path");
      clone.points = points;
      clone.pathData = undefined;
      clone.closed = false;
      clone.base = pointsBounds(points);
      clone.x = round(clone.base.x);
      clone.y = round(clone.base.y);
      clone.width = round(clone.base.width);
      clone.height = round(clone.base.height);
      clone.name = `${object.name} ${suffix}`;
      return clone;
    };
    const left = make(first, "A");
    const right = make(second, "B");
    const index = this.doc.objects.findIndex(item => item.id === object.id);
    this.doc.objects.splice(index, 1, left, right);
    this.selection = [left.id, right.id];
    this.refresh();
    this.toast("已切开路径");
  }

  private smoothSelection() {
    const paths = this.editableSelection().filter(
      object => object.points && object.points.length > 2 && !object.pathData
    );
    if (!paths.length) {
      this.toast("请先选中一条路径");
      return;
    }
    this.pushHistory();
    for (const object of paths) {
      object.points = smoothPoints(object.points ?? []).map(point => ({ x: round(point.x), y: round(point.y) }));
      this.syncPointBounds(object);
    }
    this.refresh();
    this.toast("已平滑路径");
  }

  groupSelection() {
    const objects = this.editableSelection();
    if (objects.length < 2) {
      this.toast("请选择至少两个对象再编组");
      return;
    }
    this.pushHistory();
    const groupId = uid("group");
    for (const object of objects) object.groupId = groupId;
    this.refresh();
    this.toast(`已编组 ${objects.length} 个对象`);
  }

  ungroupSelection() {
    const objects = this.editableSelection().filter(object => object.groupId);
    if (!objects.length) {
      this.toast("选中的对象不在编组中");
      return;
    }
    this.pushHistory();
    for (const object of objects) object.groupId = undefined;
    this.refresh();
    this.toast("已取消编组");
  }

  offsetPath() {
    const objects = this.editableSelection();
    if (!objects.length) {
      this.toast("请先选择对象");
      return;
    }
    this.pushHistory();
    const copies = objects.map(object => {
      const clone = cloneObject(object);
      clone.id = uid("offset");
      clone.name = `${object.name} Offset`;
      clone.fill = "none";
      clone.stroke = object.fill === "none" ? "#ffffff" : object.fill;
      clone.strokeWidth = Math.max(2, (object.strokeWidth || 0) + 10);
      clone.pathData = object.pathData;
      this.doc.objects.push(clone);
      return clone.id;
    });
    this.selection = copies;
    this.refresh();
    this.toast("已创建 Offset Path（以描边近似）");
  }

  simplifySelection() {
    const paths = this.editableSelection().filter(
      object => object.points && object.points.length > 2 && !object.pathData
    );
    if (!paths.length) {
      this.toast("请先选中一条点集路径");
      return;
    }
    this.pushHistory();
    for (const object of paths) {
      object.points = simplifyPoints(object.points ?? [], 2.5);
      object.base = pointsBounds(object.points);
      object.x = round(object.base.x);
      object.y = round(object.base.y);
      object.width = round(object.base.width);
      object.height = round(object.base.height);
    }
    this.refresh();
    this.toast("已简化路径");
  }

  editPrimaryText() {
    const primary = this.primaryObject();
    if (primary && isText(primary)) this.editText(primary);
    else this.toast("请先选中文本对象");
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
    this.toast("工作区已重置");
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
      name: "画板",
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
    this.toast("已新建文档");
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

  private async exportSvg() {
    const name = this.doc.name.replace(/\.(vectorcraft|json)$/i, "");
    downloadText(`${name}.svg`, documentSvg(this.doc, await buildFontCss()));
    this.toast("已导出 SVG");
  }

  private async exportPng() {
    const name = this.doc.name.replace(/\.(vectorcraft|json)$/i, "");
    try {
      await downloadPng(this.doc, `${name}.png`, 2, await buildFontCss());
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
          this.updateSelection(
            { fill: primary.stroke === "none" ? "#ffffff" : primary.stroke, stroke: primary.fill },
            true
          );
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
        this.toast("屏幕模式：示例未接入");
        break;
      case "gradient":
        this.updateSelection({ fill: "url(#vc-sunset-1)" }, true);
        break;
      case "none":
        this.updateSelection({ fill: "none" }, true);
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
      this.startDrag("pan", docPoint, screen);
      event.preventDefault();
      return;
    }

    if (this.tool === "zoom") {
      this.stage.zoomAround(event.altKey ? 0.8 : 1.25, this.localX(event), this.localY(event));
      this.panels.renderContextBar();
      event.preventDefault();
      return;
    }

    if (this.tool === "lasso") {
      this.startDrag("lasso", docPoint, screen, { lassoPoints: [docPoint] });
      this.lasso.style.display = "block";
      this.updateLassoPath([docPoint]);
      event.preventDefault();
      return;
    }

    const handle = target.closest<HTMLElement>("[data-handle]");
    const handleObject = handle?.dataset.objId ? this.doc.objects.find(item => item.id === handle.dataset.objId) : null;
    const canResize = this.tool === "select" || this.tool === "direct" || this.tool === "group";
    if (handle && canResize && this.selection.length && handleObject && !handleObject.locked) {
      this.startDrag("resize", docPoint, screen, {
        handleIndex: handle.dataset.handle ?? "0",
        objectId: handleObject.id,
        origins: this.selectedObjects().map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          rotation: item.rotation
        }))
      });
      event.preventDefault();
      return;
    }

    const objectElement = target.closest<Element>("[data-obj]");
    const objectId = objectElement?.getAttribute("data-obj") ?? null;
    const object = objectId ? this.doc.objects.find(item => item.id === objectId) ?? null : null;

    if (this.tool === "type") {
      this.createText(docPoint, false);
      event.preventDefault();
      return;
    }

    if (this.tool === "verticalType") {
      this.createText(docPoint, true);
      event.preventDefault();
      return;
    }

    if (["rect", "ellipse", "polygon", "star", "line", "brush", "pencil", "shaper"].includes(this.tool)) {
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

    if (this.tool === "anchor") {
      const path = object?.points ? object : this.editableSelection().find(item => item.points && !item.pathData);
      const index = path ? nearestPointIndex(path, docPoint, 16 / this.stage.zoomLevel) : -1;
      if (path && index >= 0) {
        this.select([path.id]);
        this.startDrag("anchor", docPoint, screen, { objectId: path.id, pointIndex: index });
      } else {
        this.toast("点击路径上的锚点进行拖动");
      }
      event.preventDefault();
      return;
    }

    if (this.tool === "penAdd" || this.tool === "penRemove" || this.tool === "pathEraser") {
      const path = object?.points ? object : this.editableSelection().find(item => item.points && !item.pathData);
      if (!path || path.locked) {
        this.toast("请先选中一条路径");
        return;
      }
      if (this.tool === "penAdd") this.insertPoint(path, docPoint);
      else
        this.removePointNear(
          path,
          docPoint,
          this.tool === "penRemove" ? 18 / this.stage.zoomLevel : 14 / this.stage.zoomLevel
        );
      event.preventDefault();
      return;
    }

    if (this.tool === "scissors" || this.tool === "knife") {
      const path = object?.points ? object : this.editableSelection().find(item => item.points && !item.pathData);
      if (path && !path.locked) this.splitPathAt(path, docPoint);
      else this.toast("剪刀/刻刀需要点击一条开放路径");
      event.preventDefault();
      return;
    }

    if (this.tool === "smooth") {
      this.smoothSelection();
      event.preventDefault();
      return;
    }

    if (this.tool === "rotate" && object) {
      if (!this.selection.includes(object.id)) this.select([object.id]);
      this.startDrag("rotate", docPoint, screen, {
        origins: this.selectedObjects().map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          rotation: item.rotation
        }))
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
      if (object.groupId) {
        this.select(this.doc.objects.filter(item => item.groupId === object.groupId).map(item => item.id));
      } else if (!this.selection.includes(object.id)) {
        this.select([object.id]);
      }
      if (event.altKey) this.duplicateSelection();
      this.startDrag("move", docPoint, screen, {
        origins: this.selectedObjects().map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          rotation: item.rotation
        }))
      });
      event.preventDefault();
      return;
    }

    if (!event.shiftKey) this.select([]);
    this.startMarquee(docPoint, screen);
    event.preventDefault();
  };

  private startMarquee(docPoint: Vec2, screen: Vec2) {
    this.startDrag("marquee", docPoint, screen);
    this.marquee.hidden = false;
    this.marquee.style.left = `${screen.x - this.viewport.getBoundingClientRect().left}px`;
    this.marquee.style.top = `${screen.y - this.viewport.getBoundingClientRect().top}px`;
    this.marquee.style.width = "0px";
    this.marquee.style.height = "0px";
  }

  private startDrag(mode: DragState["mode"], startDoc: Vec2, startScreen: Vec2, extra: Partial<DragState> = {}) {
    this.drag = {
      mode,
      startDoc,
      startScreen,
      lastScreen: startScreen,
      origins: [],
      startAngle: 0,
      moved: false,
      historyPushed: false,
      ...extra
    };
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

    if (drag.mode === "lasso") {
      const points = drag.lassoPoints ?? [];
      const last = points[points.length - 1];
      if (Math.hypot(docPoint.x - last.x, docPoint.y - last.y) > 2 / this.stage.zoomLevel) {
        points.push(docPoint);
        drag.lassoPoints = points;
        this.updateLassoPath(points);
      }
      drag.moved = true;
      return;
    }

    if (drag.mode === "anchor") {
      const object = this.doc.objects.find(item => item.id === drag.objectId);
      if (!object?.points || object.locked || drag.pointIndex === undefined) return;
      if (!drag.moved) {
        this.pushHistory();
        drag.moved = true;
        drag.historyPushed = true;
      }
      object.points[drag.pointIndex] = { x: round(docPoint.x), y: round(docPoint.y) };
      this.syncPointBounds(object);
      this.renderStageOnly();
      return;
    }

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
        if (!object || object.locked) continue;
        object.x = round(origin.x + delta.x);
        object.y = round(origin.y + delta.y);
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
        if (!object || object.locked) continue;
        object.rotation = Math.round((((origin.rotation + degrees) % 360) + 360) % 360);
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
      object.points.push({ x: round(docPoint.x), y: round(docPoint.y) });
      this.syncPointBounds(object);
      this.renderStageOnly();
    }
  };

  private applyResize(drag: DragState, delta: Vec2) {
    const handle = drag.handleIndex ?? "2";
    const object = this.doc.objects.find(item => item.id === drag.objectId);
    const origin = drag.origins.find(item => item.id === drag.objectId);
    if (!origin || !object || object.locked) return;
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
    object.x = round(Math.min(x, x + width));
    object.y = round(Math.min(y, y + height));
    object.width = Math.max(1, round(Math.abs(width)));
    object.height = Math.max(1, round(Math.abs(height)));
  }

  private onPointerUp = () => {
    const drag = this.drag;
    if (!drag) return;
    this.drag = null;

    if (drag.mode === "lasso") {
      this.lasso.style.display = "none";
      const polygon = drag.lassoPoints ?? [];
      if (polygon.length > 2) {
        const hits = this.doc.objects.filter(object => {
          if (!object.visible || object.locked) return false;
          const center = { x: object.x + object.width / 2, y: object.y + object.height / 2 };
          return pointInPolygon(center, polygon);
        });
        this.select(hits.map(object => object.id));
      }
      return;
    }

    if (drag.mode === "anchor") {
      this.refresh();
      return;
    }

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
        { x: round(start.x), y: round(start.y) },
        { x: round(current.x), y: round(current.y) }
      ];
      this.syncPointBounds(object);
    }
  }

  private beginCreate(point: Vec2, screen: Vec2) {
    this.pushHistory();
    const kind =
      this.tool === "line" || this.tool === "brush" || this.tool === "pencil"
        ? "path"
        : this.tool === "shaper"
        ? "polygon"
        : (this.tool as VecObject["kind"]);
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
          : this.tool === "shaper"
          ? "Shaper Shape"
          : "Brush Path",
      fill: this.tool === "line" || this.tool === "brush" || this.tool === "pencil" ? "none" : this.fillPaint,
      stroke: this.tool === "line" || this.tool === "brush" || this.tool === "pencil" ? stroke : "none",
      strokeWidth: this.tool === "line" ? 3 : this.tool === "brush" ? 5 : 0,
      points: kind === "path" ? [{ x: point.x, y: point.y }] : undefined,
      closed: false,
      sides: this.tool === "polygon" || this.tool === "shaper" ? 6 : this.tool === "star" ? 5 : undefined,
      innerRatio: this.tool === "star" ? 0.45 : undefined
    });
    if (object.points?.length) this.syncPointBounds(object);
    this.doc.objects.push(object);
    this.selection = [object.id];
    this.stage.setSelection(this.selection);
    this.startDrag(this.tool === "brush" || this.tool === "pencil" ? "brush" : "create", point, screen, {
      objectId: object.id,
      historyPushed: true
    });
    this.refresh();
  }

  private createText(point: Vec2, vertical: boolean) {
    this.pushHistory();
    const fontSize = 36;
    const object = createObject({
      kind: "text",
      x: Math.round(point.x - (vertical ? fontSize : 0)),
      y: Math.round(point.y - 30),
      width: vertical ? fontSize * 1.15 : 280,
      height: vertical ? fontSize * 1.05 * 4 : 60,
      name: vertical ? "直排文字" : "文字",
      text: "输入文字",
      fontSize,
      fontWeight: 700,
      letterSpacing: 0,
      align: "center",
      vertical,
      fontFamily: '"VectorCraft", "Chakra Petch", "Segoe UI", sans-serif',
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
        name: "钢笔路径",
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
    object.points.push({ x: round(point.x), y: round(point.y) });
    this.syncPointBounds(object);
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
      this.finishPen(false);
      return;
    }
    const target = event.target as Element;
    const objectElement = target.closest<Element>("[data-obj]");
    const objectId = objectElement?.getAttribute("data-obj");
    const object = objectId ? this.doc.objects.find(item => item.id === objectId) : null;
    if (object && isText(object)) this.editText(object);
  };

  private editText(object: VecObject) {
    openModal(
      `<div class="vc-modal vc-modal--text">
        <header class="vc-modal-head"><span>${icon(
          "type",
          14
        )} 编辑文字</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
        <div class="vc-modal-body">
          <textarea class="vc-textarea" spellcheck="false"></textarea>
          <p class="vc-modal-hint">Enter 换行 · Ctrl+Enter 应用 · Esc 取消</p>
        </div>
        <footer class="vc-modal-foot"><button class="vc-quick-btn" data-text="cancel">取消</button><button class="vc-quick-btn vc-quick-btn--primary" data-text="apply">应用</button></footer>
      </div>`,
      ({ root, close }) => {
        const textarea = root.querySelector<HTMLTextAreaElement>(".vc-textarea")!;
        textarea.value = object.text ?? "";
        textarea.focus();
        textarea.select();
        const apply = () => {
          const value = textarea.value;
          this.pushHistory();
          object.text = value;
          if (object.vertical) {
            const lines = Math.max(1, [...value].length);
            object.height = round(Math.max(object.fontSize ?? 36, lines * (object.fontSize ?? 36) * 1.05));
          }
          if (object.name === "文字" || object.name === "直排文字") object.name = value.slice(0, 24) || object.name;
          close();
          this.refresh();
        };
        root.addEventListener("click", event => {
          const action = (event.target as HTMLElement).closest<HTMLElement>("[data-text]")?.dataset.text;
          if (action === "apply") apply();
          else if (action === "cancel") close();
        });
        textarea.addEventListener("keydown", event => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            apply();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        });
      }
    );
  }

  showDocumentSetup() {
    openModal(
      `<div class="vc-modal vc-doc-modal">
        <header class="vc-modal-head"><span>${icon(
          "artboard",
          14
        )} 文档设置</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
        <div class="vc-modal-body vc-doc-form">
          <label><span>名称</span><input class="vc-input" data-doc="name" value="${this.doc.name.replace(
            /"/g,
            "&quot;"
          )}" /></label>
          <label><span>宽度</span><input class="vc-input" data-doc="width" value="${this.doc.width}" /></label>
          <label><span>高度</span><input class="vc-input" data-doc="height" value="${this.doc.height}" /></label>
          <p class="vc-modal-hint">尺寸单位为 pt，修改后画板按新尺寸裁剪。</p>
        </div>
        <footer class="vc-modal-foot"><button class="vc-quick-btn" data-doc="cancel">取消</button><button class="vc-quick-btn vc-quick-btn--primary" data-doc="apply">应用</button></footer>
      </div>`,
      ({ root, close }) => {
        const field = (name: string) => root.querySelector<HTMLInputElement>(`[data-doc="${name}"]`)!;
        root.addEventListener("click", event => {
          const action = (event.target as HTMLElement).closest<HTMLElement>("[data-doc]")?.dataset.doc;
          if (action === "cancel") close();
          if (action === "apply") {
            const width = Number.parseFloat(field("width").value);
            const height = Number.parseFloat(field("height").value);
            const name = field("name").value.trim();
            if (!Number.isFinite(width) || !Number.isFinite(height) || width < 10 || height < 10) {
              this.toast("请输入有效的画板尺寸");
              return;
            }
            this.pushHistory();
            this.doc.name = name || this.doc.name;
            this.doc.width = round(width);
            this.doc.height = round(height);
            close();
            this.stage.setDocument(this.doc);
            this.refresh();
            this.toast("文档已更新");
          }
        });
      }
    );
  }

  private toggleMeasure() {
    this.measureMode = !this.measureMode;
    this.stage.element.classList.toggle("is-measuring", this.measureMode);
    this.toast(this.measureMode ? "测量模式：移动鼠标查看坐标" : "已退出测量模式");
    if (!this.measureMode) this.hintElement.textContent = this.hintForTool();
  }

  private showHistory() {
    showHistoryDialog({
      undoCount: this.history.length,
      redoCount: this.future.length,
      undo: () => this.undo(),
      redo: () => this.redo()
    });
  }

  private showSearch() {
    showSearchDialog([
      { label: "适应画板", run: () => this.zoomFit() },
      { label: "实际大小", run: () => this.setZoomPercent(100) },
      { label: "缩放到选中对象", run: () => this.zoomToSelection() },
      { label: "导出 SVG", run: () => void this.exportSvg() },
      { label: "导出 PNG", run: () => void this.exportPng() },
      { label: "创建轮廓", run: () => void this.outlineSelection() },
      { label: "重复选中对象", run: () => this.duplicateSelection() },
      { label: "删除选中对象", run: () => this.deleteSelection() },
      { label: "编组", run: () => this.groupSelection() },
      { label: "取消编组", run: () => this.ungroupSelection() },
      { label: "切换标尺", run: () => this.toggleRulers() },
      { label: "切换网格", run: () => this.toggleGrid() },
      { label: "轮廓模式", run: () => this.toggleOutlineMode() },
      { label: "重置工作区", run: () => this.resetWorkspace() },
      { label: "键盘快捷键", run: () => this.showShortcuts() },
      { label: "关于 VectorCraft", run: () => this.showAbout() }
    ]);
  }

  private showShortcuts() {
    showShortcutsDialog();
  }

  private showAbout() {
    showAboutDialog();
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
          { label: "剪切", shortcut: "Ctrl X", action: () => this.cutSelection() },
          { label: "复制", shortcut: "Ctrl C", action: () => this.copySelection() },
          { label: "粘贴", shortcut: "Ctrl V", action: () => this.pasteSelection() },
          { label: "重复", shortcut: "Ctrl D", action: () => this.duplicateSelection() },
          { separator: true },
          { label: "置于顶层", action: () => this.bringToFront() },
          { label: "置于底层", action: () => this.sendToBack() },
          { separator: true },
          { label: "创建轮廓", action: () => this.outlineSelection() },
          { label: "锁定", action: () => this.toggleLock(primary.id) },
          { label: "隐藏", action: () => this.toggleVisibility(primary.id) },
          { separator: true },
          { label: "删除", shortcut: "Del", action: () => this.deleteSelection() }
        ]
      : [
          { label: "粘贴", shortcut: "Ctrl V", action: () => this.pasteSelection() },
          { label: "全选", shortcut: "Ctrl A", action: () => this.selectAll() },
          { label: "适应画板", shortcut: "Ctrl 0", action: () => this.zoomFit() }
        ];
    this.openMenuAt(event.clientX, event.clientY, items);
  };

  private openMenuAt(x: number, y: number, items: MenuItem[]) {
    this.closeMenu();
    const menu = buildMenu(items, () => this.closeMenu());
    document.body.appendChild(menu);
    positionMenu(menu, x, y);
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
          if (event.shiftKey) void this.outlineSelection();
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
          if (event.shiftKey) this.toast("请在“视图”菜单中切换标尺");
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
          if (event.shiftKey) this.ungroupSelection();
          else this.groupSelection();
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
      this.finishPen(false);
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
