import { icon } from "./icons";
import {
  GRADIENTS,
  INK_PALETTE,
  NEON_PALETTE,
  type Paint,
  type VecObject,
  type VecDocument,
  gradientCss,
  gradientOf,
  paintLabel,
  isText
} from "./scene";

export type SidebarTab = "properties" | "layers" | "libraries";
export type AlignMode = "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom";
export type ToolId = string;

export interface FloatingPosition {
  left: number;
  top: number;
}

export interface UiState {
  sidebarTab: SidebarTab;
  railActive: string;
  showAppearance: boolean;
  appearanceCollapsed: boolean;
  showContextBar: boolean;
  appearancePos: FloatingPosition | null;
  outlineMode: boolean;
  showGrid: boolean;
  showRulers: boolean;
}

export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EditorContext {
  doc: VecDocument;
  ui: UiState;
  selectedObjects(): VecObject[];
  primaryObject(): VecObject | null;
  select(ids: string[], additive?: boolean): void;
  update(id: string, patch: Partial<VecObject>, record?: boolean): void;
  updateSelection(patch: Partial<VecObject>, record?: boolean): void;
  refresh(): void;
  toast(message: string): void;
  duplicateSelection(): void;
  deleteSelection(): void;
  bringToFront(): void;
  sendToBack(): void;
  toggleLock(id: string): void;
  toggleVisibility(id: string): void;
  outlineSelection(): void;
  alignSelection(mode: AlignMode): void;
  distributeSelection(axis: "h" | "v"): void;
  zoomFit(): void;
  setZoomPercent(value: number): void;
  selectionScreenRect(): ScreenRect | null;
  openLibraryTab(): void;
  toggleGlow(): void;
  setDefaultPaint(paint: Paint): void;
}

const fmt = (value: number): string => `${Math.round(value * 100) / 100}`;

function swatchMarkup(paint: Paint, extraClass = ""): string {
  const gradient = gradientOf(paint);
  if (paint === "none") {
    return `<span class="vc-swatch vc-swatch--none ${extraClass}" title="None"></span>`;
  }
  if (gradient) {
    return `<span class="vc-swatch vc-swatch--gradient ${extraClass}" style="background:${gradientCss(paint)}" title="${gradient.label}"></span>`;
  }
  return `<span class="vc-swatch ${extraClass}" style="background:${paint}" title="${paint.toUpperCase()}"></span>`;
}

function numberField(label: string, value: number, prop: string, options: { unit?: string; step?: number; id?: string } = {}): string {
  return `<label class="vc-field">
    <span class="vc-field-label">${label}</span>
    <input class="vc-input" type="text" inputmode="decimal" spellcheck="false" value="${fmt(value)}" data-prop="${prop}" ${
      options.id ? `data-id="${options.id}"` : ""
    } data-step="${options.step ?? 1}" />
    ${options.unit ? `<span class="vc-field-unit">${options.unit}</span>` : ""}
  </label>`;
}

function paragraphControls(object: VecObject): string {
  const align = object.align ?? "center";
  const buttons: Array<[string, string, string]> = [
    ["left", "左对齐", '<path d="M4 6h16M4 10h10M4 14h16M4 18h8"/>'],
    ["center", "居中对齐", '<path d="M4 6h16M7 10h10M4 14h16M8 18h8"/>'],
    ["right", "右对齐", '<path d="M4 6h16M10 10h10M4 14h16M12 18h8"/>'],
    ["justify", "两端对齐", '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>'],
    ["justify", "更多", '<path d="M4 6h16M4 10h13M4 14h16M4 18h9"/>']
  ];
  return `<div class="vc-para-row">
    ${buttons
      .map(
        ([mode, title, path], index) =>
          `<button type="button" class="vc-mini-btn${align === mode && index < 4 ? " is-active" : ""}" title="${title}" data-align="${mode}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">${path}</svg>
          </button>`
      )
      .join("")}
  </div>
  <label class="vc-check"><input type="checkbox" data-check="hyphenate" /><span>Hyphenate</span></label>`;
}

const alignButtons: Array<[AlignMode, string, string]> = [
  ["left", "左对齐", '<path d="M4 3v18M7 7h10v4H7zM7 14h6v4H7z"/>'],
  ["hcenter", "水平居中", '<path d="M12 3v18M6 7h12v4H6zM8 14h8v4H8z"/>'],
  ["right", "右对齐", '<path d="M20 3v18M8 7h10v4H8zM11 14h7v4h-7z"/>'],
  ["top", "顶对齐", '<path d="M3 4h18M7 7h4v10H7zM14 7h4v6h-4z"/>'],
  ["vcenter", "垂直居中", '<path d="M3 12h18M7 6h4v12H7zM14 8h4v8h-4z"/>'],
  ["bottom", "底对齐", '<path d="M3 20h18M7 7h4v10H7zM14 11h4v6h-4z"/>']
];

function alignControls(): string {
  return `<div class="vc-align-row">
    ${alignButtons
      .map(
        ([mode, title, path]) =>
          `<button type="button" class="vc-mini-btn" title="${title}" data-align="${mode}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">${path}</svg></button>`
      )
      .join("")}
    <button type="button" class="vc-mini-btn" title="水平分布" data-action="distribute-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3v18M21 3v18M9 7h6v10H9z"/></svg></button>
    <button type="button" class="vc-mini-btn" title="垂直分布" data-action="distribute-v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3h18M3 21h18M7 9h10v6H7z"/></svg></button>
    <button type="button" class="vc-mini-btn" title="更多" data-action="align-more">${icon("more", 14)}</button>
  </div>`;
}

function transformSection(object: VecObject | null): string {
  if (!object) {
    return `<div class="vc-empty">未选择对象。点击画布中的对象，或在图层面板中选择。</div>`;
  }
  return `<div class="vc-section">
    <div class="vc-section-head"><span>Transform</span><div class="vc-section-tools">
      <button class="vc-mini-btn" data-action="toggle-constrain" title="锁定比例">${icon("link", 13)}</button>
    </div></div>
    <div class="vc-transform">
      <div class="vc-gizmo">${icon("transform", 30)}</div>
      <div class="vc-transform-fields">
        <div class="vc-field-line">
          ${numberField("X:", object.x, "x", { unit: "pt" })}
          ${numberField("W:", object.width, "width", { unit: "pt" })}
          <button class="vc-mini-btn" data-action="reset-rotation" title="重置旋转">${icon("rotate", 13)}</button>
        </div>
        <div class="vc-field-line">
          ${numberField("Y:", object.y, "y", { unit: "pt" })}
          ${numberField("H:", object.height, "height", { unit: "pt" })}
          <button class="vc-mini-btn" data-action="flip" title="翻转">${icon("transform", 13)}</button>
        </div>
        <div class="vc-field-line vc-field-line--short">
          ${numberField("∠", object.rotation, "rotation", { unit: "°" })}
          <span class="vc-transform-spacer"></span>
          <button class="vc-mini-btn" data-action="more-transform" title="更多变换">${icon("more", 14)}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function characterSection(object: VecObject | null): string {
  if (!object || !isText(object)) return "";
  const families: Array<[string, string]> = [
    ["Michroma (Extended)", '"Michroma", "Orbitron", "Bank Gothic", "Eurostile", "Arial Black", "Segoe UI", sans-serif'],
    ["Arial Black", '"Arial Black", "Arial Bold", sans-serif'],
    ["Inter", '"Inter", "Segoe UI", Arial, sans-serif'],
    ["Georgia", 'Georgia, "Times New Roman", serif'],
    ["Courier", '"Courier New", monospace']
  ];
  const weights: Array<[number, string]> = [
    [300, "Light"],
    [400, "Regular"],
    [500, "Medium"],
    [600, "Semibold"],
    [700, "Bold"],
    [800, "Extra Bold"],
    [900, "Black"]
  ];
  return `<div class="vc-section">
    <div class="vc-section-head"><span>Character</span><button class="vc-mini-btn" data-action="character-options" title="更多">${icon("more", 14)}</button></div>
    <select class="vc-select" data-prop="fontFamily" data-id="${object.id}">
      ${families
        .map(
          ([label, stack]) =>
            `<option value="${stack.replace(/"/g, "&quot;")}" ${object.fontFamily === stack ? "selected" : ""}>${label}</option>`
        )
        .join("")}
    </select>
    <select class="vc-select" data-prop="fontWeight" data-id="${object.id}">
      ${weights.map(([value, label]) => `<option value="${value}" ${object.fontWeight === value ? "selected" : ""}>${label}</option>`).join("")}
    </select>
    <div class="vc-field-line vc-field-line--two">
      ${numberField("T", object.fontSize ?? 48, "fontSize", { unit: "pt" })}
      ${numberField("A", object.lineHeight ?? Math.round((object.fontSize ?? 48) * 1.2), "lineHeight", { unit: "pt" })}
    </div>
    <div class="vc-field-line vc-field-line--two">
      ${numberField("VA", object.letterSpacing ?? 0, "letterSpacing", {})}
      ${numberField("VA", 0, "kerning", {})}
    </div>
  </div>`;
}

function appearanceSection(object: VecObject | null): string {
  if (!object) return "";
  return `<div class="vc-section">
    <div class="vc-section-head"><span>Appearance</span></div>
    <div class="vc-appearance-row">
      ${swatchMarkup(object.fill)}<span class="vc-app-label">Fill</span>
      <button class="vc-mini-btn" data-action="toggle-fill" title="切换填充">${icon("chevronDown", 12)}</button>
    </div>
    <div class="vc-appearance-row">
      ${swatchMarkup(object.stroke === "none" ? "none" : object.stroke)}<span class="vc-app-label">Stroke</span>
      <span class="vc-stroke-value">${fmt(object.strokeWidth)} pt</span>
      <button class="vc-mini-btn" data-action="toggle-stroke" title="切换描边">${icon("chevronDown", 12)}</button>
    </div>
    <div class="vc-appearance-row">
      <span class="vc-app-label vc-app-label--wide">Opacity</span>
      <input class="vc-input vc-input--tiny" type="text" inputmode="decimal" value="${Math.round(object.opacity * 100)}" data-prop="opacity" data-id="${object.id}" />%
      <span class="vc-spacer"></span>
      <button class="vc-mini-btn" data-action="opacity-more" title="更多">${icon("more", 14)}</button>
    </div>
    <button class="vc-fx-btn${object.glow > 0 ? " is-active" : ""}" data-action="toggle-glow" title="外发光">fx</button>
  </div>`;
}

function quickActionsSection(): string {
  return `<div class="vc-section">
    <div class="vc-section-head"><span>Quick Actions</span></div>
    <div class="vc-quick-grid">
      <button class="vc-quick-btn" data-action="offset-path">Offset Path</button>
      <button class="vc-quick-btn" data-action="simplify">Simplify</button>
      <button class="vc-quick-btn" data-action="bring-front">Arrange: Bring to Front</button>
      <button class="vc-quick-btn" data-action="lock-object">Lock</button>
    </div>
  </div>`;
}

function propertiesBody(ctx: EditorContext): string {
  const object = ctx.primaryObject();
  const isType = object ? isText(object) : false;
  return `
    <div class="vc-section vc-section--title">
      <div class="vc-section-head"><span>${isType ? "Type" : object ? "Object" : "Artboard"}</span>
        <div class="vc-section-tools">
          <button class="vc-mini-btn" data-action="doc-setup" title="文档设置">${icon("artboard", 13)}</button>
          <button class="vc-mini-btn" data-action="properties-menu" title="面板菜单">${icon("more", 14)}</button>
        </div>
      </div>
    </div>
    ${transformSection(object)}
    ${characterSection(object)}
    ${isType ? `<div class="vc-section"><div class="vc-section-head"><span>Paragraph</span></div>${paragraphControls(object as VecObject)}</div>` : ""}
    ${appearanceSection(object)}
    ${object ? `<div class="vc-section"><div class="vc-section-head"><span>Align</span></div>${alignControls()}</div>` : ""}
    ${quickActionsSection()}
  `;
}

function layersBody(ctx: EditorContext): string {
  const objects = ctx.doc.objects.slice().reverse();
  const selected = new Set(ctx.selectedObjects().map(object => object.id));
  return `<div class="vc-layer-head">
      <span class="vc-layer-head-title">${icon("artboard", 13)} Layer 1</span>
      <div class="vc-section-tools">
        <button class="vc-mini-btn" data-action="layer-search" title="搜索">${icon("search", 13)}</button>
        <button class="vc-mini-btn" data-action="new-layer" title="新建图层">${icon("plus", 13)}</button>
      </div>
    </div>
    <div class="vc-layer-list">
      ${objects
        .map(
          object => `<div class="vc-layer-row${selected.has(object.id) ? " is-selected" : ""}${object.visible ? "" : " is-hidden"}" data-layer-id="${object.id}">
          <button class="vc-layer-icon" data-layer-action="visible" data-id="${object.id}" title="${object.visible ? "隐藏" : "显示"}">${icon(
            object.visible ? "eye" : "eyeOff",
            13
          )}</button>
          <button class="vc-layer-icon${object.locked ? " is-on" : ""}" data-layer-action="lock" data-id="${object.id}" title="${
            object.locked ? "解锁" : "锁定"
          }">${icon(object.locked ? "lock" : "unlock", 12)}</button>
          <span class="vc-layer-glyph">${object.kind === "text" ? "T" : object.kind === "grid" ? "▦" : object.kind === "stars" ? "✳" : "▭"}</span>
          <span class="vc-layer-name" title="${object.name}">${object.name}</span>
          <span class="vc-layer-kind">${object.kind === "text" ? "Type" : object.kind === "stars" ? "Symbol" : "Path"}</span>
        </div>`
        )
        .join("")}
    </div>
    <div class="vc-layer-foot">
      <button class="vc-mini-btn" data-action="layers-menu" title="面板菜单">${icon("hamburger", 14)}</button>
      <span class="vc-spacer"></span>
      <span class="vc-layer-count">${ctx.doc.objects.length} objects</span>
    </div>`;
}

function librariesBody(_ctx: EditorContext): string {
  const gradients = Object.values(GRADIENTS).slice(0, 6);
  return `<div class="vc-lib-section">
      <div class="vc-section-head"><span>Swatches</span><button class="vc-mini-btn" data-action="lib-menu">${icon("more", 14)}</button></div>
      <div class="vc-lib-grid">
        ${NEON_PALETTE.map(color => `<button class="vc-lib-swatch" style="background:${color}" data-swatch="${color}" title="${color.toUpperCase()}"></button>`).join("")}
      </div>
    </div>
    <div class="vc-lib-section">
      <div class="vc-section-head"><span>Ink &amp; Paper</span></div>
      <div class="vc-lib-grid">
        ${INK_PALETTE.map(color => `<button class="vc-lib-swatch" style="background:${color}" data-swatch="${color}" title="${color.toUpperCase()}"></button>`).join("")}
      </div>
    </div>
    <div class="vc-lib-section">
      <div class="vc-section-head"><span>Gradients</span></div>
      <div class="vc-lib-gradients">
        ${gradients
          .map(
            gradient =>
              `<button class="vc-lib-gradient" style="background:${gradientCss(`url(#${gradient.id})`)}" data-gradient="url(#${gradient.id})" title="${gradient.label}"><span>${gradient.label}</span></button>`
          )
          .join("")}
      </div>
    </div>
    <div class="vc-lib-section">
      <div class="vc-section-head"><span>Type Styles</span></div>
      <div class="vc-lib-styles">
        <button class="vc-lib-style" data-style="display"><b>NEON DRIVE</b><span>Display · 104 pt</span></button>
        <button class="vc-lib-style" data-style="caption"><b>made with VectorCraft</b><span>Caption · 15 pt</span></button>
      </div>
    </div>
    <p class="vc-lib-hint">${icon("info", 13)} 点击色板应用到当前选中对象，未选中时应用到新建图形。</p>`;
}

/* ------------------------------------------------------------------ */
/* 面板控制器                                                          */
/* ------------------------------------------------------------------ */

export class PanelsController {
  private sidebar: HTMLElement;
  private appearance: HTMLElement;
  private contextBar: HTMLElement;
  private viewport: HTMLElement;
  private ctx: EditorContext;
  private popover: HTMLElement | null = null;
  private drag: { pointerId: number; offsetX: number; offsetY: number } | null = null;

  constructor(hosts: { sidebar: HTMLElement; appearance: HTMLElement; contextBar: HTMLElement; viewport: HTMLElement }, ctx: EditorContext) {
    this.sidebar = hosts.sidebar;
    this.appearance = hosts.appearance;
    this.contextBar = hosts.contextBar;
    this.viewport = hosts.viewport;
    this.ctx = ctx;

    this.sidebar.addEventListener("click", this.onSidebarClick);
    this.sidebar.addEventListener("change", this.onSidebarChange);
    this.sidebar.addEventListener("keydown", this.onFieldKeyDown);
    this.appearance.addEventListener("click", this.onAppearanceClick);
    this.appearance.addEventListener("change", this.onAppearanceChange);
    this.appearance.addEventListener("keydown", this.onFieldKeyDown);
    this.appearance.addEventListener("pointerdown", this.onAppearancePointerDown);
    this.contextBar.addEventListener("click", this.onContextBarClick);
    document.addEventListener("pointerdown", this.onDocumentPointerDown, true);
    document.addEventListener("keydown", this.onDocumentKeyDown);
  }

  renderAll() {
    this.renderSidebar();
    this.renderAppearance();
    this.renderContextBar();
  }

  setRailActive(id: string) {
    this.ctx.ui.railActive = id;
    this.renderSidebar();
  }

  renderSidebar() {
    const ctx = this.ctx;
    this.sidebar.innerHTML = `
      <div class="vc-panel-head">
        <div class="vc-tabs" role="tablist">
          <button class="vc-tab${ctx.ui.sidebarTab === "properties" ? " is-active" : ""}" data-tab="properties" role="tab">Properties</button>
          <button class="vc-tab${ctx.ui.sidebarTab === "layers" ? " is-active" : ""}" data-tab="layers" role="tab">Layers</button>
          <button class="vc-tab${ctx.ui.sidebarTab === "libraries" ? " is-active" : ""}" data-tab="libraries" role="tab">Libraries</button>
        </div>
        <button class="vc-icon-btn vc-panel-menu" data-action="panel-menu" title="面板菜单">${icon("hamburger", 15)}</button>
      </div>
      <div class="vc-panel-scroll">
        ${ctx.ui.sidebarTab === "layers" ? layersBody(ctx) : ctx.ui.sidebarTab === "libraries" ? librariesBody(ctx) : propertiesBody(ctx)}
      </div>`;
  }

  renderAppearance() {
    const ctx = this.ctx;
    const object = ctx.primaryObject();
    if (!ctx.ui.showAppearance) {
      this.appearance.hidden = true;
      return;
    }
    this.appearance.hidden = false;
    const position = ctx.ui.appearancePos;
    this.appearance.style.left = position ? `${position.left}px` : "";
    this.appearance.style.top = position ? `${position.top}px` : "";
    if (ctx.ui.appearanceCollapsed) {
      this.appearance.classList.add("is-collapsed");
    } else {
      this.appearance.classList.remove("is-collapsed");
    }

    const rows = object
      ? isText(object)
        ? `
        <div class="vc-app-row">
          ${swatchMarkup(object.fill)}<span class="vc-app-name">Type</span>
          <span class="vc-app-trail">${swatchMarkup(object.fill, "vc-swatch--mini")}${swatchMarkup(object.stroke, "vc-swatch--mini")}</span>
        </div>
        <div class="vc-app-row">
          <button class="vc-app-eye" data-action="fill-eye" title="切换填充">${icon(object.fill === "none" ? "eyeOff" : "eye", 13)}</button>
          <span class="vc-app-name vc-app-name--sub">Characters</span>
          <span class="vc-app-trail">${swatchMarkup(object.fill, "vc-swatch--mini")}${swatchMarkup(
            object.stroke,
            "vc-swatch--mini"
          )}</span>
        </div>`
        : `
        <div class="vc-app-row">${swatchMarkup(object.fill)}<span class="vc-app-name">Path</span>
          <span class="vc-app-trail">${swatchMarkup(object.fill, "vc-swatch--mini")}${swatchMarkup(object.stroke, "vc-swatch--mini")}</span></div>`
      : `<div class="vc-app-row vc-app-row--empty">未选择对象</div>`;

    const glowRow = object
      ? `<div class="vc-app-row vc-app-row--effect">
          <button class="vc-app-eye" data-action="glow-eye" title="切换外发光">${icon(object.glow > 0 ? "eye" : "eyeOff", 13)}</button>
          <span class="vc-app-chevron">${icon("chevronRight", 11)}</span>
          <span class="vc-app-name vc-app-name--sub">Outer Glow</span>
          <span class="vc-app-trail vc-app-trail--fx">${icon("fx", 12)}</span>
        </div>`
      : "";

    this.appearance.innerHTML = `
      <header class="vc-float-head" data-drag="appearance">
        <span class="vc-float-title">Appearance</span>
        <div class="vc-float-actions">
          <button class="vc-mini-btn" data-action="appearance-menu" title="面板菜单">${icon("hamburger", 14)}</button>
          <button class="vc-mini-btn" data-action="appearance-collapse" title="折叠">${icon("chevronRight", 13)}</button>
        </div>
      </header>
      <div class="vc-float-body">
        ${rows}
        ${glowRow}
        <div class="vc-app-row vc-app-row--opacity">
          <span class="vc-app-name">Opacity:</span>
          <input class="vc-app-opacity" type="text" inputmode="decimal" value="${object ? Math.round(object.opacity * 100) : 100}" data-prop="opacity" data-id="${
            object ? object.id : ""
          }" />%
          <span class="vc-app-default">Default</span>
        </div>
      </div>
      <footer class="vc-float-foot">
        <button class="vc-mini-btn" data-action="add-fill" title="添加填充">${icon("rect", 13)}</button>
        <button class="vc-mini-btn" data-action="add-stroke" title="添加描边">${icon("rect", 13)}</button>
        <button class="vc-mini-btn" data-action="toggle-glow" title="添加效果">fx</button>
        <span class="vc-spacer"></span>
        <button class="vc-mini-btn" data-action="appearance-options" title="效果设置">${icon("settings", 13)}</button>
        <button class="vc-mini-btn" data-action="duplicate-effect" title="复制外观">${icon("plus", 13)}</button>
        <button class="vc-mini-btn" data-action="clear-appearance" title="清除外观">${icon("trash", 13)}</button>
      </footer>`;
  }

  renderContextBar() {
    const ctx = this.ctx;
    const object = ctx.primaryObject();
    const rect = ctx.selectionScreenRect();
    if (!object || !rect || !ctx.ui.showContextBar || ctx.ui.outlineMode) {
      this.contextBar.hidden = true;
      return;
    }
    this.contextBar.hidden = false;
    this.contextBar.innerHTML = `
      <button class="vc-ctx-btn" data-action="outline" title="Create Outlines">${icon("type", 15)}<span>Create Outlines</span></button>
      <button class="vc-ctx-btn" data-action="duplicate" title="Duplicate (Ctrl+D)">${icon("duplicate", 15)}<span>Duplicate</span></button>
      <span class="vc-ctx-sep"></span>
      <button class="vc-ctx-swatch" data-action="fill" title="Fill">${swatchMarkup(object.fill)}</button>
      <button class="vc-ctx-swatch" data-action="stroke" title="Stroke">${swatchMarkup(object.stroke)}</button>
      <button class="vc-ctx-icon" data-action="palette" title="Color Picker">${icon("color", 16)}</button>
      <button class="vc-ctx-icon" data-action="hide" title="隐藏">${icon(object.visible ? "eye" : "eyeOff", 15)}</button>
      <button class="vc-ctx-icon" data-action="lock" title="锁定">${icon(object.locked ? "lock" : "unlock", 15)}</button>
      <button class="vc-ctx-icon" data-action="more" title="更多">${icon("more", 15)}</button>`;

    const width = this.contextBar.offsetWidth || 380;
    const height = this.contextBar.offsetHeight || 40;
    const viewWidth = this.viewport.clientWidth;
    const viewHeight = this.viewport.clientHeight;
    const left = Math.min(Math.max(10, rect.left + rect.width / 2 - width / 2), viewWidth - width - 10);
    const below = rect.top + rect.height + 14;
    const top = below + height > viewHeight - 10 ? Math.max(10, rect.top - height - 14) : below;
    this.contextBar.style.left = `${left}px`;
    this.contextBar.style.top = `${top}px`;
  }

  /* ------------------------- 事件 ------------------------- */

  private onSidebarClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const tab = target.closest<HTMLElement>("[data-tab]");
    if (tab?.dataset.tab) {
      this.ctx.ui.sidebarTab = tab.dataset.tab as SidebarTab;
      this.ctx.ui.railActive = tab.dataset.tab;
      this.renderSidebar();
      return;
    }

    const layerRow = target.closest<HTMLElement>("[data-layer-id]");
    const layerAction = target.closest<HTMLElement>("[data-layer-action]");
    if (layerAction && layerRow) {
      const id = layerRow.dataset.layerId as string;
      if (layerAction.dataset.layerAction === "visible") this.ctx.toggleVisibility(id);
      else this.ctx.toggleLock(id);
      return;
    }

    const align = target.closest<HTMLElement>("[data-align]");
    if (align?.dataset.align) {
      this.ctx.alignSelection(align.dataset.align as AlignMode);
      return;
    }

    const swatch = target.closest<HTMLElement>("[data-swatch]");
    if (swatch?.dataset.swatch) {
      this.applyPaint("#" + swatch.dataset.swatch.replace("#", ""));
      return;
    }
    const gradient = target.closest<HTMLElement>("[data-gradient]");
    if (gradient?.dataset.gradient) {
      this.applyPaint(gradient.dataset.gradient);
      return;
    }
    const style = target.closest<HTMLElement>("[data-style]");
    if (style?.dataset.style) {
      this.applyTextStyle(style.dataset.style);
      return;
    }

    if (layerRow?.dataset.layerId) {
      this.ctx.select([layerRow.dataset.layerId], event.shiftKey);
      return;
    }

    const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (!action) return;
    this.runSidebarAction(action);
  };

  private runSidebarAction(action: string) {
    const ctx = this.ctx;
    const object = ctx.primaryObject();
    switch (action) {
      case "toggle-glow":
        ctx.toggleGlow();
        break;
      case "toggle-fill":
      case "fill-eye":
        if (object) ctx.updateSelection({ fill: object.fill === "none" ? "#ffffff" : "none" }, true);
        break;
      case "toggle-stroke":
      case "add-stroke":
        if (object) ctx.updateSelection({ stroke: object.stroke === "none" ? "#ffffff" : "none", strokeWidth: object.stroke === "none" ? 2 : 0 }, true);
        break;
      case "add-fill":
        if (object) ctx.updateSelection({ fill: object.fill === "none" ? "#ffffff" : object.fill }, true);
        break;
      case "bring-front":
        ctx.bringToFront();
        break;
      case "lock-object":
        if (object) ctx.toggleLock(object.id);
        break;
      case "distribute-h":
        ctx.distributeSelection("h");
        break;
      case "distribute-v":
        ctx.distributeSelection("v");
        break;
      case "duplicate-effect":
        ctx.duplicateSelection();
        break;
      case "offset-path":
        ctx.toast("Offset Path：示例未接入");
        break;
      case "simplify":
        ctx.toast("Simplify：示例未接入");
        break;
      case "doc-setup":
        ctx.toast("Document Setup：800 × 1000 pt · RGB");
        break;
      case "reset-rotation":
        ctx.updateSelection({ rotation: 0 }, true);
        break;
      case "flip":
        ctx.toast("Flip：示例未接入");
        break;
      case "more-transform":
      case "properties-menu":
      case "panel-menu":
      case "character-options":
      case "opacity-more":
      case "align-more":
      case "layer-search":
      case "new-layer":
      case "layers-menu":
      case "lib-menu":
        ctx.toast("面板菜单：示例未接入");
        break;
      default:
        break;
    }
  }

  private onSidebarChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const prop = target.dataset.prop;
    if (!prop) return;
    const id = target.dataset.id || this.ctx.primaryObject()?.id;
    if (!id) return;
    this.commitField(id, prop, target.value);
  };

  private onFieldKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement) {
      target.blur();
      event.preventDefault();
    }
  };

  private commitField(id: string, prop: string, raw: string) {
    if (prop === "fontFamily") {
      this.ctx.update(id, { fontFamily: raw }, true);
      return;
    }
    if (prop === "fontWeight") {
      this.ctx.update(id, { fontWeight: Number(raw) }, true);
      return;
    }
    const value = Number.parseFloat(raw.replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(value)) {
      this.ctx.refresh();
      return;
    }
    if (prop === "kerning") {
      this.ctx.toast("Kerning：示例未接入");
      return;
    }
    if (prop === "opacity") {
      this.ctx.update(id, { opacity: Math.min(1, Math.max(0, value / 100)) }, true);
      return;
    }
    if (prop === "width" || prop === "height") {
      this.ctx.update(id, this.numericPatch(prop, Math.max(1, value)), true);
      return;
    }
    this.ctx.update(id, this.numericPatch(prop, value), true);
  }

  private numericPatch(prop: string, value: number): Partial<VecObject> {
    const patch: Record<string, unknown> = {};
    patch[prop] = value;
    return patch as Partial<VecObject>;
  }

  private paintPatch(target: "fill" | "stroke", value: Paint): Partial<VecObject> {
    return target === "fill" ? { fill: value } : { stroke: value };
  }

  private applyPaint(paint: Paint) {
    const ctx = this.ctx;
    const object = ctx.primaryObject();
    if (!object) {
      ctx.setDefaultPaint(paint);
      return;
    }
    ctx.updateSelection({ fill: paint }, true);
    ctx.toast(`已应用 ${paintLabel(paint)}`);
  }

  private applyTextStyle(style: string) {
    const ctx = this.ctx;
    const object = ctx.primaryObject();
    if (!object || !isText(object)) {
      ctx.toast("请先选中文本对象");
      return;
    }
    if (style === "display") {
      ctx.updateSelection({ fontSize: 104, letterSpacing: 5, fontWeight: 700, glow: 22 }, true);
    } else {
      ctx.updateSelection({ fontSize: 15, letterSpacing: 1.6, fontWeight: 500, glow: 0 }, true);
    }
  }

  private onAppearanceClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
    const object = this.ctx.primaryObject();
    if (!action) return;
    switch (action) {
      case "appearance-collapse":
        this.ctx.ui.appearanceCollapsed = !this.ctx.ui.appearanceCollapsed;
        this.renderAppearance();
        break;
      case "glow-eye":
        this.ctx.toggleGlow();
        break;
      case "fill-eye":
        if (object) this.ctx.updateSelection({ fill: object.fill === "none" ? "#ffffff" : "none" }, true);
        break;
      case "add-fill":
        if (object) this.ctx.updateSelection({ fill: object.fill === "none" ? "#ffffff" : object.fill }, true);
        break;
      case "add-stroke":
        if (object) this.ctx.updateSelection({ stroke: object.stroke === "none" ? "#ffffff" : object.stroke, strokeWidth: object.strokeWidth || 2 }, true);
        break;
      case "clear-appearance":
        this.ctx.updateSelection({ glow: 0, stroke: "none", strokeWidth: 0 }, true);
        break;
      default:
        this.ctx.toast(`${action}：示例未接入`);
        break;
    }
  };

  private onAppearanceChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const prop = target.dataset.prop;
    if (!prop) return;
    const id = target.dataset.id || this.ctx.primaryObject()?.id;
    if (!id) return;
    this.commitField(id, prop, target.value);
  };

  private onAppearancePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const header = target.closest<HTMLElement>("[data-drag]");
    if (!header) return;
    const rect = this.appearance.getBoundingClientRect();
    const viewRect = this.viewport.getBoundingClientRect();
    this.drag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    this.ctx.ui.appearancePos = { left: rect.left - viewRect.left, top: rect.top - viewRect.top };
    header.setPointerCapture(event.pointerId);
    event.preventDefault();

    const move = (moveEvent: PointerEvent) => {
      if (!this.drag) return;
      const left = Math.min(
        Math.max(6, moveEvent.clientX - viewRect.left - this.drag.offsetX),
        viewRect.width - this.appearance.offsetWidth - 6
      );
      const top = Math.min(
        Math.max(6, moveEvent.clientY - viewRect.top - this.drag.offsetY),
        viewRect.height - this.appearance.offsetHeight - 6
      );
      this.ctx.ui.appearancePos = { left, top };
      this.appearance.style.left = `${left}px`;
      this.appearance.style.top = `${top}px`;
    };
    const up = () => {
      this.drag = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  private onContextBarClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (!action) return;
    const object = this.ctx.primaryObject();
    switch (action) {
      case "outline":
        this.ctx.outlineSelection();
        break;
      case "duplicate":
        this.ctx.duplicateSelection();
        break;
      case "fill":
        if (object) this.openColorPopover(target.closest<HTMLElement>("[data-action]") as HTMLElement, "fill");
        break;
      case "stroke":
        if (object) this.openColorPopover(target.closest<HTMLElement>("[data-action]") as HTMLElement, "stroke");
        break;
      case "palette":
        if (object) this.openColorPopover(target.closest<HTMLElement>("[data-action]") as HTMLElement, "fill");
        break;
      case "hide":
        if (object) this.ctx.toggleVisibility(object.id);
        break;
      case "lock":
        if (object) this.ctx.toggleLock(object.id);
        break;
      case "more":
        this.ctx.toast("Arrange / Align / Delete：使用右键或对象菜单");
        break;
      default:
        break;
    }
  };

  /* ------------------------- 颜色弹层 ------------------------- */

  private openColorPopover(anchor: HTMLElement, target: "fill" | "stroke") {
    this.closePopover();
    const object = this.ctx.primaryObject();
    if (!object) return;
    const current = target === "fill" ? object.fill : object.stroke;
    const popover = document.createElement("div");
    popover.className = "vc-popover vc-color-popover";
    popover.innerHTML = `
      <div class="vc-popover-head"><span>${target === "fill" ? "Fill" : "Stroke"}</span><button class="vc-mini-btn" data-action="close">${icon(
        "close",
        12
      )}</button></div>
      <div class="vc-popover-body">
        <div class="vc-color-current">${swatchMarkup(current)}<input class="vc-input" data-color-hex value="${
          current.startsWith("#") ? current.toUpperCase() : ""
        }" placeholder="#FF3FAE" />${target === "stroke" ? '<input class="vc-input vc-input--tiny" data-stroke-width value="' + object.strokeWidth + '" />' : ""}</div>
        <div class="vc-lib-grid vc-lib-grid--popover">
          ${[...NEON_PALETTE, ...INK_PALETTE].map(color => `<button class="vc-lib-swatch" style="background:${color}" data-swatch="${color}"></button>`).join("")}
        </div>
        <div class="vc-gradient-list">
          ${Object.values(GRADIENTS)
            .map(
              gradient =>
                `<button class="vc-lib-gradient" style="background:${gradientCss(`url(#${gradient.id})`)}" data-gradient="url(#${gradient.id})" title="${gradient.label}"></button>`
            )
            .join("")}
        </div>
        <div class="vc-popover-actions">
          <button class="vc-quick-btn" data-action="remove">None</button>
          <button class="vc-quick-btn" data-action="default">Default</button>
        </div>
      </div>`;
    document.body.appendChild(popover);
    const rect = anchor.getBoundingClientRect();
    popover.style.left = `${Math.min(rect.left, window.innerWidth - 262)}px`;
    popover.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - 380)}px`;
    this.popover = popover;

    popover.addEventListener("click", event => {
      const element = event.target as HTMLElement;
      const close = element.closest<HTMLElement>('[data-action="close"]');
      if (close) {
        this.closePopover();
        return;
      }
      const action = element.closest<HTMLElement>("[data-action]")?.dataset.action;
      if (action === "remove") {
        this.ctx.updateSelection(this.paintPatch(target, "none"), true);
        this.closePopover();
        return;
      }
      if (action === "default") {
        this.ctx.updateSelection(this.paintPatch(target, "#ffffff"), true);
        this.closePopover();
        return;
      }
      const swatch = element.closest<HTMLElement>("[data-swatch]");
      if (swatch?.dataset.swatch) {
        this.ctx.updateSelection(this.paintPatch(target, swatch.dataset.swatch), true);
        this.closePopover();
        return;
      }
      const gradient = element.closest<HTMLElement>("[data-gradient]");
      if (gradient?.dataset.gradient) {
        this.ctx.updateSelection(this.paintPatch(target, gradient.dataset.gradient), true);
        this.closePopover();
      }
    });

    popover.addEventListener("change", event => {
      const input = event.target as HTMLInputElement;
      if (input.hasAttribute("data-color-hex")) {
        const value = input.value.trim();
        const normalized = value.startsWith("#") ? value : `#${value}`;
        if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
          this.ctx.updateSelection(this.paintPatch(target, normalized.toLowerCase()), true);
          this.closePopover();
        }
      }
      if (input.hasAttribute("data-stroke-width")) {
        const width = Number.parseFloat(input.value);
        if (Number.isFinite(width)) this.ctx.updateSelection({ strokeWidth: Math.max(0, width) }, true);
      }
    });
  }

  openColorPicker(kind: "fill" | "stroke", anchor?: HTMLElement) {
    if (!this.ctx.primaryObject()) {
      this.ctx.toast("请先选择对象");
      return;
    }
    this.openColorPopover(anchor ?? this.contextBar, kind);
  }

  scrollToAlign() {
    const row = this.sidebar.querySelector<HTMLElement>(".vc-align-row");
    row?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  private closePopover() {
    this.popover?.remove();
    this.popover = null;
  }

  private onDocumentPointerDown = (event: PointerEvent) => {
    if (!this.popover) return;
    if (this.popover.contains(event.target as Node)) return;
    this.closePopover();
  };

  private onDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.popover) this.closePopover();
  };
}
