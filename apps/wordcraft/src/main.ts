import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { HeaderBar, StatusBar } from "@gausszhou/litegui-components";
import { CITATIONS, COMMENTS, DOC_THEMES, DOC_TITLE, PAGE_COLORS, PAGE_ONE, PAGE_TWO, STYLE_PRESETS } from "./content";
import {
  acceptChange,
  applyBlockStyle,
  applyInlineStyle,
  buildOutline,
  closestBlock,
  ensureFootnoteList,
  execInEditor,
  flashElement,
  insertHtml,
  pageOf,
  q,
  qa,
  rejectChange,
  replaceAllText,
  replaceRange,
  selectRange,
  selectionInEditor,
  textRanges,
  wordStats
} from "./editor";
import { icon } from "./icons";
import {
  fontPopupEntries,
  renderRibbon,
  RIBBON_TABS,
  sizePopupEntries,
  type RibbonState,
  type RibbonTab
} from "./ribbon";

/* ------------------------------------------------------------------ types */

type NavTab = "headings" | "pages" | "results";
type EditingMode = "Editing" | "Viewing" | "Suggesting";

interface CommentItem {
  id: string;
  author: string;
  initials: string;
  timestamp: string;
  text: string;
  anchor: string;
  resolved?: boolean;
}

interface MenuEntry {
  label?: string;
  icon?: string;
  shortcut?: string;
  checked?: boolean;
  separator?: boolean;
  swatch?: string;
  command?: string;
  value?: string;
  disabled?: boolean;
  hint?: string;
}

interface CommandItem {
  label: string;
  hint?: string;
  shortcut?: string;
  command: string;
  value?: string;
}

interface AppState {
  tab: RibbonTab;
  navTab: NavTab;
  navQuery: string;
  navOpen: boolean;
  ruler: boolean;
  commentsOpen: boolean;
  comments: CommentItem[];
  activeComment: string | null;
  composerAnchor: HTMLElement | null;
  tracking: boolean;
  markup: boolean;
  editing: EditingMode;
  citationStyle: string;
  theme: string;
  pageColor: string;
  margins: string;
  orientation: "portrait" | "landscape";
  pageSize: "letter" | "a4" | "legal";
  columns: number;
  lineNumbers: boolean;
  hyphenation: boolean;
  gridlines: boolean;
  marks: boolean;
  dark: boolean;
  readingMode: boolean;
  focusMode: boolean;
  outlineMode: boolean;
  webLayout: boolean;
  draftView: boolean;
  selectionPane: boolean;
  headerFooter: boolean;
  footnotesVisible: boolean;
  watermark: string;
  pageBorders: boolean;
  mergeFields: boolean;
  protectedView: boolean;
  autosave: boolean;
  dirty: boolean;
  everEdited: boolean;
  zoom: number;
  drawTool: string | null;
  painterActive: boolean;
  painterStyle: Partial<CSSStyleDeclaration> | null;
  currentPage: number;
  pageCount: number;
  findQuery: string;
  findIndex: number;
  findMode: "find" | "replace";
}

/* ------------------------------------------------------------------ state */

const state: AppState = {
  tab: "home",
  navTab: "headings",
  navQuery: "",
  navOpen: true,
  ruler: true,
  commentsOpen: false,
  comments: COMMENTS.map(comment => ({ ...comment })),
  activeComment: null,
  composerAnchor: null,
  tracking: false,
  markup: true,
  editing: "Editing",
  citationStyle: "APA",
  theme: "studio",
  pageColor: "white",
  margins: "normal",
  orientation: "portrait",
  pageSize: "letter",
  columns: 1,
  lineNumbers: false,
  hyphenation: false,
  gridlines: false,
  marks: false,
  dark: false,
  readingMode: false,
  focusMode: false,
  outlineMode: false,
  webLayout: false,
  draftView: false,
  selectionPane: false,
  headerFooter: true,
  footnotesVisible: true,
  watermark: "",
  pageBorders: false,
  mergeFields: false,
  protectedView: false,
  autosave: false,
  dirty: true,
  everEdited: false,
  zoom: 100,
  drawTool: null,
  painterActive: false,
  painterStyle: null,
  currentPage: 1,
  pageCount: 2,
  findQuery: "",
  findIndex: 0,
  findMode: "find"
};

const MARGINS: Record<string, [number, number]> = {
  normal: [58, 54],
  narrow: [30, 28],
  moderate: [42, 40],
  wide: [72, 66]
};

const THEME_FONTS: Record<string, string> = {
  studio: '"Aptos", "Calibri", "Segoe UI", sans-serif',
  editorial: '"Cambria", Georgia, serif',
  slate: '"Segoe UI", "Helvetica Neue", sans-serif',
  contrast: 'Arial, "Helvetica Neue", sans-serif'
};

const THEME_ACCENTS: Record<string, string> = {
  blue: "#215c78",
  teal: "#1f6f63",
  plum: "#6b3f6e",
  forest: "#3c5f3a",
  ember: "#8a4b2a",
  ink: "#333333"
};

/* ------------------------------------------------------------------ shell */

const app = q<HTMLDivElement>(document, "#app");

app.innerHTML = `
  <div class="wc-app" id="wc-app">
    <div class="wc-titlebar-slot" id="titlebar-slot"></div>

    <div class="wc-ribbon" id="ribbon">
      <div class="wc-tabstrip" id="tabstrip" role="tablist" aria-label="Ribbon tabs">
        <button type="button" class="wc-tab wc-tab--file" data-command="file-backstage">File</button>
        ${RIBBON_TABS.map(
          tab =>
            `<button type="button" class="wc-tab" role="tab" data-tab="${tab.id}" aria-selected="false">${tab.label}</button>`
        ).join("")}
        <div class="wc-tabstrip__spacer"></div>
        <button type="button" class="wc-strip-btn" data-command="show-comments" id="strip-comments" title="Show or hide comments">
          ${icon("comment", 15)}<span>Comments</span>
        </button>
        <button type="button" class="wc-strip-btn" data-popup="editing-mode" title="Editing mode">
          ${icon("check", 14)}<span id="editing-label">Editing</span>${icon("chevron", 9)}
        </button>
        <button type="button" class="wc-share" data-command="share">${icon("share", 14)}<span>Share</span></button>
      </div>
      <div class="wc-ribbon-body" id="ribbon-body"></div>
    </div>

    <div class="wc-main" id="main">
      <aside class="wc-nav" id="nav-pane" aria-label="Navigation pane">
        <div class="wc-nav__header">
          <span>Navigation</span>
          <button type="button" class="wc-iconbtn" data-command="navigation-pane" title="Close Navigation Pane">
            ${icon("close", 14)}
          </button>
        </div>
        <label class="wc-nav__search">
          ${icon("search", 14)}
          <input type="search" id="nav-search" placeholder="Search document" autocomplete="off" />
        </label>
        <div class="wc-nav__tabs" role="tablist">
          <button type="button" class="wc-nav__tab is-active" data-nav-tab="headings" role="tab">Headings</button>
          <button type="button" class="wc-nav__tab" data-nav-tab="pages" role="tab">Pages</button>
          <button type="button" class="wc-nav__tab" data-nav-tab="results" role="tab">Results</button>
        </div>
        <div class="wc-nav__body" id="nav-body"></div>
      </aside>

      <section class="wc-doc" id="doc-area">
        <div class="wc-scroll" id="doc-scroll" tabindex="-1">
          <div class="wc-canvas" id="canvas">
            <div class="wc-pages-col">
              <div class="wc-ruler-row" id="ruler-row">
                <div class="wc-ruler" id="ruler">
                  <div class="wc-ruler__margin wc-ruler__margin--left" id="ruler-margin-left"></div>
                  <div class="wc-ruler__margin wc-ruler__margin--right" id="ruler-margin-right"></div>
                  <div class="wc-ruler__ticks" id="ruler-ticks"></div>
                </div>
              </div>
              <div class="wc-pages" id="pages"></div>
            </div>
            <aside class="wc-comments" id="comments-rail" aria-label="Comments"></aside>
          </div>
        </div>

        <div class="wc-find" id="find-panel" hidden>
          <div class="wc-find__row">
            <input type="text" id="find-input" placeholder="Find in document" autocomplete="off" />
            <span class="wc-find__count" id="find-count">0 of 0</span>
            <button type="button" class="wc-iconbtn" data-find-action="prev" title="Previous match">${icon(
              "arrowLeft",
              14
            )}</button>
            <button type="button" class="wc-iconbtn wc-find__next" data-find-action="next" title="Next match">${icon(
              "arrowLeft",
              14
            )}</button>
            <button type="button" class="wc-iconbtn" data-find-action="close" title="Close">${icon(
              "close",
              14
            )}</button>
          </div>
          <div class="wc-find__row" id="find-replace-row" hidden>
            <input type="text" id="replace-input" placeholder="Replace with" autocomplete="off" />
            <button type="button" class="wc-find__button" data-find-action="replace">Replace</button>
            <button type="button" class="wc-find__button" data-find-action="replace-all">All</button>
          </div>
          <div class="wc-find__hint" id="find-hint">Type to highlight matches · Esc to close</div>
        </div>

        <div class="wc-selection-pane" id="selection-pane" hidden>
          <div class="wc-selection-pane__header">Selection Pane <button type="button" class="wc-iconbtn" data-command="selection-pane">${icon(
            "close",
            12
          )}</button></div>
          <div id="selection-list"></div>
        </div>

        <button type="button" class="wc-read-exit" id="read-exit" data-command="read-mode" hidden>${icon(
          "close",
          14
        )} Close Read Mode</button>
      </section>

      <div class="wc-toast" id="toast" hidden></div>
    </div>

    <div class="wc-statusbar-slot" id="status-slot"></div>

    <div class="wc-backstage" id="backstage" hidden>
      <div class="wc-backstage__nav" id="backstage-nav"></div>
      <div class="wc-backstage__panel" id="backstage-panel"></div>
    </div>

    <div class="wc-palette" id="palette" hidden>
      <div class="wc-palette__head">${icon(
        "search",
        14
      )}<input type="text" id="palette-input" placeholder="Search commands and help" autocomplete="off" /></div>
      <div class="wc-palette__list" id="palette-list"></div>
      <div class="wc-palette__foot"><span>Enter to run</span><span>Esc to dismiss</span></div>
    </div>
  </div>
  <div id="overlay-root"></div>`;

const appEl = q<HTMLElement>(app, "#wc-app");
const ribbonBody = q<HTMLElement>(app, "#ribbon-body");
const tabstrip = q<HTMLElement>(app, "#tabstrip");
const pagesEl = q<HTMLElement>(app, "#pages");
const canvasEl = q<HTMLElement>(app, "#canvas");
const docScroll = q<HTMLElement>(app, "#doc-scroll");
const navBody = q<HTMLElement>(app, "#nav-body");
const navSearch = q<HTMLInputElement>(app, "#nav-search");
const commentsRail = q<HTMLElement>(app, "#comments-rail");
const findPanel = q<HTMLElement>(app, "#find-panel");
const findInput = q<HTMLInputElement>(app, "#find-input");
const replaceInput = q<HTMLInputElement>(app, "#replace-input");
const findCount = q<HTMLElement>(app, "#find-count");
const findReplaceRow = q<HTMLElement>(app, "#find-replace-row");
const findHint = q<HTMLElement>(app, "#find-hint");
const rulerRow = q<HTMLElement>(app, "#ruler-row");
const rulerTicks = q<HTMLElement>(app, "#ruler-ticks");
const rulerMarginLeft = q<HTMLElement>(app, "#ruler-margin-left");
const rulerMarginRight = q<HTMLElement>(app, "#ruler-margin-right");
const selectionPane = q<HTMLElement>(app, "#selection-pane");
const readExit = q<HTMLElement>(app, "#read-exit");
const backstage = q<HTMLElement>(app, "#backstage");
const backstageNav = q<HTMLElement>(app, "#backstage-nav");
const backstagePanel = q<HTMLElement>(app, "#backstage-panel");
const palette = q<HTMLElement>(app, "#palette");
const paletteInput = q<HTMLInputElement>(app, "#palette-input");
const paletteList = q<HTMLElement>(app, "#palette-list");
const toastEl = q<HTMLElement>(app, "#toast");
const overlayRoot = q<HTMLElement>(document, "#overlay-root");

/* ------------------------------------------------------------------ titlebar */

const titlebar = new HeaderBar({ id: "wc-titlebar", className: "wc-titlebar", variant: "topbar", height: 48 });
q<HTMLElement>(app, "#titlebar-slot").appendChild(titlebar.root);

titlebar.setLeft(`
  <button type="button" class="wc-autosave" data-command="toggle-autosave" aria-pressed="false" title="AutoSave">
    <span class="wc-switch"><span class="wc-switch__knob"></span></span><span>AutoSave</span>
  </button>
  <span class="wc-titlebar__divider"></span>
  <button type="button" class="wc-tb-icon" data-command="file-save" title="Save (Ctrl+S)">${icon("save", 17)}</button>
  <button type="button" class="wc-tb-icon" data-command="undo" title="Undo (Ctrl+Z)">${icon("undo", 17)}</button>
  <button type="button" class="wc-tb-icon" data-command="redo" title="Redo (Ctrl+Y)">${icon("redo", 17)}</button>
  <button type="button" class="wc-tb-icon" data-popup="titlebar-more" title="More">${icon("more", 17)}</button>`);

titlebar.setCenter(`<div class="wc-doc-title" id="doc-title">${DOC_TITLE} — Edited</div>`);

titlebar.setRight(`
  <label class="wc-command-search">
    ${icon("search", 15)}
    <input type="text" id="command-search" placeholder="Search commands and help" autocomplete="off" />
  </label>
  <button type="button" class="wc-discord" data-command="discord" title="Join the ArtCraft Discord">
    ${icon("discord", 16)}<span>Discord</span>
  </button>
  <button type="button" class="wc-avatar" data-command="account" title="WordCraft User">WU</button>`);

const commandSearch = q<HTMLInputElement>(app, "#command-search");

/* ------------------------------------------------------------------ status bar */

const statusBar = new StatusBar({ id: "wc-status", className: "wc-status" });
q<HTMLElement>(app, "#status-slot").appendChild(statusBar.root);

statusBar.leftElement.innerHTML = `
  <button type="button" class="wc-status__item wc-status__button" id="status-page" data-popup="page-nav">Page 1 of 2</button>
  <span class="wc-status__sep"></span>
  <span class="wc-status__item" id="status-words">0 words</span>
  <span class="wc-status__sep"></span>
  <span class="wc-status__item">English (United States)</span>
  <span class="wc-status__sep"></span>
  <span class="wc-status__item wc-status__track" id="status-track" hidden>Track Changes: On</span>
  <span class="wc-status__item wc-status__protected" id="status-protected" hidden>Protected View</span>`;

statusBar.rightElement.innerHTML = `
  <button type="button" class="wc-status__item wc-status__button" data-command="focus-mode" title="Focus">${icon(
    "focus",
    13
  )}<span>Focus</span></button>
  <span class="wc-status__views">
    <button type="button" class="wc-status__view" data-command="read-mode" title="Read Mode">${icon(
      "reading",
      15
    )}</button>
    <button type="button" class="wc-status__view is-active" data-command="print-layout" title="Print Layout">${icon(
      "printLayout",
      15
    )}</button>
    <button type="button" class="wc-status__view" data-command="web-layout" title="Web Layout">${icon(
      "webLayout",
      15
    )}</button>
  </span>
  <span class="wc-status__zoom">
    <button type="button" class="wc-status__view" data-command="zoom-out" title="Zoom Out">${icon("minus", 14)}</button>
    <input type="range" id="zoom-slider" min="50" max="200" step="10" value="100" aria-label="Zoom" />
    <button type="button" class="wc-status__view" data-command="zoom-in" title="Zoom In">${icon("plus", 14)}</button>
    <button type="button" class="wc-status__item wc-status__button" id="status-zoom" data-command="zoom-dialog">100%</button>
  </span>`;

const statusPage = q<HTMLElement>(app, "#status-page");
const statusWords = q<HTMLElement>(app, "#status-words");
const statusTrack = q<HTMLElement>(app, "#status-track");
const statusProtected = q<HTMLElement>(app, "#status-protected");
const statusZoom = q<HTMLElement>(app, "#status-zoom");
const zoomSlider = q<HTMLInputElement>(app, "#zoom-slider");

/* ------------------------------------------------------------------ pages */

function pageMarkup(index: number, body: string): string {
  return `<section class="wc-page" id="wc-page-${index}" data-page="${index}" aria-label="Page ${index}">
    <div class="wc-page-body" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true">${body}</div>
    <div class="wc-page-footer"><span>${index}</span></div>
  </section>`;
}

function buildDocument(): void {
  pagesEl.innerHTML = pageMarkup(1, PAGE_ONE) + pageMarkup(2, PAGE_TWO);
  state.pageCount = 2;
  state.currentPage = 1;
  applyPageColor();
  applyMarginsToDom();
  updatePageNumbers();
  requestAnimationFrame(() => {
    positionComments();
    updateStatus();
  });
}

function addPage(): HTMLElement {
  const index = qa<HTMLElement>(pagesEl, ".wc-page").length + 1;
  const section = document.createElement("section");
  section.className = "wc-page";
  section.id = `wc-page-${index}`;
  section.dataset.page = String(index);
  section.setAttribute("aria-label", `Page ${index}`);
  section.innerHTML = `<div class="wc-page-body" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true"><p><br /></p></div><div class="wc-page-footer"><span>${index}</span></div>`;
  pagesEl.appendChild(section);
  state.pageCount = index;
  updatePageNumbers();
  updateStatus();
  renderNav();
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  markDirty();
  return section;
}

function updatePageNumbers(): void {
  qa<HTMLElement>(pagesEl, ".wc-page").forEach((page, index) => {
    page.dataset.page = String(index + 1);
    page.id = `wc-page-${index + 1}`;
    const footer = page.querySelector(".wc-page-footer span");
    if (footer) footer.textContent = String(index + 1);
    const label = page.getAttribute("aria-label");
    if (label) page.setAttribute("aria-label", `Page ${index + 1}`);
  });
  state.pageCount = qa<HTMLElement>(pagesEl, ".wc-page").length;
}

function firstEditor(): HTMLElement {
  return q<HTMLElement>(pagesEl, ".wc-page-body");
}

function editorForNode(node: Node | null): HTMLElement | null {
  const page = node?.parentElement?.closest<HTMLElement>(".wc-page");
  return page?.querySelector<HTMLElement>(".wc-page-body") ?? null;
}

function currentEditor(): HTMLElement {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const editor = editorForNode(selection.getRangeAt(0).commonAncestorContainer);
    if (editor) return editor;
  }
  const page =
    pagesEl.querySelector<HTMLElement>(`#wc-page-${state.currentPage}`) ??
    pagesEl.querySelector<HTMLElement>(".wc-page");
  return page?.querySelector<HTMLElement>(".wc-page-body") ?? firstEditor();
}

function currentBlock(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const editor = editorForNode(selection.getRangeAt(0).commonAncestorContainer);
  if (!editor) return null;
  return closestBlock(selection.getRangeAt(0).startContainer, editor);
}

/* ------------------------------------------------------------------ ribbon */

function ribbonState(): RibbonState {
  return {
    tracking: state.tracking,
    commentsOpen: state.commentsOpen,
    navOpen: state.navOpen,
    ruler: state.ruler,
    dark: state.dark,
    readingMode: state.readingMode,
    editing: state.editing,
    citationStyle: state.citationStyle,
    theme: state.theme,
    pageColor: state.pageColor,
    margins: state.margins,
    orientation: state.orientation,
    size: state.pageSize,
    columns: state.columns > 1,
    lineNumbers: state.lineNumbers,
    gridlines: state.gridlines,
    marks: state.marks
  };
}

function renderRibbonBody(): void {
  ribbonBody.innerHTML = renderRibbon(state.tab, ribbonState());
  updateTabstrip();
  requestAnimationFrame(() => syncSelectionState());
}

function updateTabstrip(): void {
  qa<HTMLElement>(tabstrip, "[data-tab]").forEach(tab => {
    const active = tab.dataset.tab === state.tab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  qa<HTMLElement>(tabstrip, ".wc-strip-btn").forEach(button => {
    if (button.id === "strip-comments") button.classList.toggle("is-active", state.commentsOpen);
  });
  q<HTMLElement>(app, "#editing-label").textContent = state.editing;
}

function switchTab(tab: RibbonTab): void {
  state.tab = tab;
  closePopup();
  renderRibbonBody();
}

/* ------------------------------------------------------------------ popup menus */

let activePopup: HTMLElement | null = null;
let activePopupAnchor: HTMLElement | null = null;

function closePopup(): void {
  activePopup?.remove();
  activePopup = null;
  activePopupAnchor?.classList.remove("is-open");
  activePopupAnchor = null;
}

function popupAnchorFor(element: HTMLElement): HTMLElement {
  return element.closest<HTMLElement>("[data-popup]") ?? element;
}

function openPopup(
  anchor: HTMLElement,
  entries: MenuEntry[],
  options: { className?: string; width?: number } = {}
): void {
  if (activePopupAnchor === anchor) {
    closePopup();
    return;
  }
  closePopup();
  const popup = document.createElement("div");
  popup.className = ["wc-popup", options.className ?? ""].filter(Boolean).join(" ");
  popup.setAttribute("role", "menu");
  if (options.width) popup.style.width = `${options.width}px`;

  for (const entry of entries) {
    if (entry.separator) {
      const separator = document.createElement("div");
      separator.className = "wc-popup__separator";
      popup.appendChild(separator);
      continue;
    }
    const item = document.createElement("button");
    item.type = "button";
    item.className = `wc-popup__item${entry.checked ? " is-checked" : ""}${entry.disabled ? " is-disabled" : ""}`;
    item.setAttribute("role", "menuitem");
    if (entry.command) item.dataset.command = entry.command;
    if (entry.value !== undefined) item.dataset.value = entry.value;
    if (entry.disabled) item.disabled = true;
    const swatch = entry.swatch ? `<span class="wc-popup__swatch" style="background:${entry.swatch}"></span>` : "";
    const iconHtml = entry.icon ? `<span class="wc-popup__icon">${icon(entry.icon, 14)}</span>` : "";
    const check = entry.checked ? icon("check", 13) : "";
    item.innerHTML = `${iconHtml}${swatch}<span class="wc-popup__label">${entry.label ?? ""}</span>${
      entry.shortcut ? `<span class="wc-popup__shortcut">${entry.shortcut}</span>` : ""
    }<span class="wc-popup__check">${check}</span>`;
    popup.appendChild(item);
  }

  document.body.appendChild(popup);
  const rect = anchor.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const left = Math.max(6, Math.min(rect.left, window.innerWidth - popupRect.width - 8));
  let top = rect.bottom + 4;
  if (top + popupRect.height > window.innerHeight - 8) top = Math.max(6, rect.top - popupRect.height - 4);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  activePopup = popup;
  activePopupAnchor = anchor;
  anchor.classList.add("is-open");
}

function entriesForPopup(name: string): MenuEntry[] {
  const fontLabel = app.querySelector<HTMLElement>("#font-family-label")?.textContent ?? "";
  const sizeLabel = app.querySelector<HTMLElement>("#font-size-label")?.textContent ?? "";
  switch (name) {
    case "font-family":
      return fontPopupEntries(fontLabel) as MenuEntry[];
    case "font-size":
      return sizePopupEntries(sizeLabel) as MenuEntry[];
    case "font-color":
      return [
        { label: "Automatic", swatch: "#1f1f1f", command: "set-color", value: "#1f1f1f" },
        { label: "Word Blue", swatch: "#2b579a", command: "set-color", value: "#2b579a" },
        { label: "Studio Teal", swatch: "#215c78", command: "set-color", value: "#215c78" },
        { label: "Crimson", swatch: "#b02418", command: "set-color", value: "#b02418" },
        { label: "Forest", swatch: "#3c6b3a", command: "set-color", value: "#3c6b3a" },
        { label: "Amber", swatch: "#9a6a00", command: "set-color", value: "#9a6a00" },
        { label: "Graphite", swatch: "#555555", command: "set-color", value: "#555555" },
        { separator: true },
        { label: "More Colors…", icon: "colors", command: "more-colors" }
      ];
    case "highlight-color":
      return [
        { label: "No Color", swatch: "#ffffff", command: "set-highlight", value: "transparent" },
        { label: "Yellow", swatch: "#fff2a8", command: "set-highlight", value: "#fff2a8" },
        { label: "Bright Green", swatch: "#b7f0b1", command: "set-highlight", value: "#b7f0b1" },
        { label: "Turquoise", swatch: "#b3ecec", command: "set-highlight", value: "#b3ecec" },
        { label: "Pink", swatch: "#f7c8d8", command: "set-highlight", value: "#f7c8d8" },
        { label: "Blue", swatch: "#c9ddf7", command: "set-highlight", value: "#c9ddf7" },
        { label: "Green", swatch: "#d5e8c8", command: "set-highlight", value: "#d5e8c8" },
        { label: "Red", swatch: "#f4c7c3", command: "set-highlight", value: "#f4c7c3" }
      ];
    case "styles-more":
      return [
        ...STYLE_PRESETS.map(preset => ({
          label: preset.label,
          icon: "addText",
          command: "apply-style",
          value: preset.id
        })),
        { separator: true },
        { label: "Clear Formatting", icon: "clearFormat", command: "clear-format" },
        { label: "New Style…", icon: "plus", command: "new-style" }
      ];
    case "line-spacing":
      return [
        { label: "1.0", command: "set-line-spacing", value: "1.0" },
        { label: "1.15", command: "set-line-spacing", value: "1.15" },
        { label: "1.5", command: "set-line-spacing", value: "1.5" },
        { label: "2.0", command: "set-line-spacing", value: "2.0" },
        { label: "2.5", command: "set-line-spacing", value: "2.5" },
        { label: "3.0", command: "set-line-spacing", value: "3.0" },
        { separator: true },
        { label: "Add Space Before Paragraph", command: "space-before" },
        { label: "Add Space After Paragraph", command: "space-after" },
        { label: "Remove Space After Paragraph", command: "space-none" }
      ];
    case "shading":
      return [
        { label: "No Color", swatch: "#ffffff", command: "set-shading", value: "transparent" },
        { label: "Light Gray", swatch: "#f2f2f2", command: "set-shading", value: "#f2f2f2" },
        { label: "Blue", swatch: "#deebf7", command: "set-shading", value: "#deebf7" },
        { label: "Green", swatch: "#e2efda", command: "set-shading", value: "#e2efda" },
        { label: "Yellow", swatch: "#fff2cc", command: "set-shading", value: "#fff2cc" },
        { label: "Orange", swatch: "#fce4d6", command: "set-shading", value: "#fce4d6" }
      ];
    case "borders":
      return [
        { label: "Bottom Border", command: "border-bottom" },
        { label: "Top Border", command: "border-top" },
        { label: "Left Border", command: "border-left" },
        { label: "Right Border", command: "border-right" },
        { label: "All Borders", command: "border-all" },
        { separator: true },
        { label: "No Border", command: "border-none" }
      ];
    case "margins":
      return [
        {
          label: "Normal",
          checked: state.margins === "normal",
          command: "set-margins",
          value: "normal",
          hint: '1.0" all around'
        },
        {
          label: "Narrow",
          checked: state.margins === "narrow",
          command: "set-margins",
          value: "narrow",
          hint: '0.5" all around'
        },
        {
          label: "Moderate",
          checked: state.margins === "moderate",
          command: "set-margins",
          value: "moderate",
          hint: "Mixed"
        },
        {
          label: "Wide",
          checked: state.margins === "wide",
          command: "set-margins",
          value: "wide",
          hint: '1.0" top/bottom'
        },
        { separator: true },
        { label: "Custom Margins…", icon: "settings", command: "custom-margins" }
      ];
    case "orientation":
      return [
        { label: "Portrait", checked: state.orientation === "portrait", command: "set-orientation", value: "portrait" },
        {
          label: "Landscape",
          checked: state.orientation === "landscape",
          command: "set-orientation",
          value: "landscape"
        }
      ];
    case "page-size":
      return [
        {
          label: 'Letter (8.5" × 11")',
          checked: state.pageSize === "letter",
          command: "set-page-size",
          value: "letter"
        },
        { label: "A4 (210 × 297 mm)", checked: state.pageSize === "a4", command: "set-page-size", value: "a4" },
        { label: 'Legal (8.5" × 14")', checked: state.pageSize === "legal", command: "set-page-size", value: "legal" },
        { separator: true },
        { label: "More Paper Sizes…", command: "custom-page-size" }
      ];
    case "columns":
      return [
        { label: "One", checked: state.columns === 1, command: "set-columns", value: "1" },
        { label: "Two", checked: state.columns === 2, command: "set-columns", value: "2" },
        { label: "Three", checked: state.columns === 3, command: "set-columns", value: "3" },
        { separator: true },
        { label: "More Columns…", command: "custom-columns" }
      ];
    case "breaks":
      return [
        { label: "Page", command: "insert-page-break" },
        { label: "Column", command: "insert-column-break" },
        { label: "Text Wrapping", command: "insert-text-wrapping" },
        { separator: true },
        { label: "Next Page", command: "insert-section-break" },
        { label: "Continuous", command: "insert-continuous-break" }
      ];
    case "themes":
      return DOC_THEMES.map(theme => ({
        label: theme.label,
        hint: theme.hint,
        checked: state.theme === theme.id,
        command: "set-theme",
        value: theme.id
      }));
    case "theme-colors":
      return Object.entries(THEME_ACCENTS).map(([label, color]) => ({
        label: label[0].toUpperCase() + label.slice(1),
        swatch: color,
        command: "set-accent",
        value: label
      }));
    case "theme-fonts":
      return [
        { label: "Calibri / Aptos", command: "set-theme-font", value: "studio" },
        { label: "Cambria / Georgia", command: "set-theme-font", value: "editorial" },
        { label: "Segoe UI", command: "set-theme-font", value: "slate" },
        { label: "Arial", command: "set-theme-font", value: "contrast" }
      ];
    case "page-color":
      return PAGE_COLORS.map(color => ({
        label: color.label,
        swatch: color.value,
        checked: state.pageColor === color.id,
        command: "set-page-color",
        value: color.id
      }));
    case "watermark":
      return [
        { label: "DRAFT", checked: state.watermark === "DRAFT", command: "set-watermark", value: "DRAFT" },
        {
          label: "CONFIDENTIAL",
          checked: state.watermark === "CONFIDENTIAL",
          command: "set-watermark",
          value: "CONFIDENTIAL"
        },
        {
          label: "DO NOT COPY",
          checked: state.watermark === "DO NOT COPY",
          command: "set-watermark",
          value: "DO NOT COPY"
        },
        { separator: true },
        { label: "Remove Watermark", command: "set-watermark", value: "" }
      ];
    case "citation-style":
      return ["APA", "MLA", "Chicago", "IEEE"].map(styleName => ({
        label: styleName,
        checked: state.citationStyle === styleName,
        command: "set-citation-style",
        value: styleName
      }));
    case "insert-citation":
      return [
        ...CITATIONS.map((citation, index) => ({
          label: citation,
          icon: "citation",
          command: "cite",
          value: String(index)
        })),
        { separator: true },
        { label: "Add New Source…", icon: "plus", command: "manage-sources" }
      ];
    case "toc":
      return [
        { label: "Insert Table of Contents", command: "insert-toc" },
        { label: "Update Table", command: "update-toc" },
        { separator: true },
        { label: "Remove Table of Contents", command: "remove-toc" }
      ];
    case "editing-mode":
      return (["Editing", "Viewing", "Suggesting"] as EditingMode[]).map(mode => ({
        label: mode,
        checked: state.editing === mode,
        command: "set-editing",
        value: mode,
        icon: mode === "Editing" ? "check" : mode === "Viewing" ? "reading" : "trackChanges"
      }));
    case "zoom":
      return [
        { label: "50%", command: "zoom-set", value: "50" },
        { label: "75%", command: "zoom-set", value: "75" },
        { label: "100%", command: "zoom-set", value: "100" },
        { label: "125%", command: "zoom-set", value: "125" },
        { label: "150%", command: "zoom-set", value: "150" },
        { label: "200%", command: "zoom-set", value: "200" },
        { separator: true },
        { label: "Page Width", command: "zoom-page-width" },
        { label: "Whole Page", command: "zoom-one-page" }
      ];
    case "accept":
      return [
        { label: "Accept This Change", icon: "check", command: "accept-change" },
        { label: "Accept All Changes", command: "accept-all" }
      ];
    case "reject":
      return [
        { label: "Reject This Change", icon: "close", command: "reject-change" },
        { label: "Reject All Changes", command: "reject-all" }
      ];
    case "page-nav":
      return qa<HTMLElement>(pagesEl, ".wc-page").map((_page, index) => ({
        label: `Page ${index + 1}`,
        checked: state.currentPage === index + 1,
        command: "go-page",
        value: String(index + 1)
      }));
    case "titlebar-more":
      return [
        { label: "New", icon: "file", shortcut: "Ctrl+N", command: "file-new" },
        { label: "Open…", icon: "file", shortcut: "Ctrl+O", command: "file-open" },
        { label: "Save", icon: "save", shortcut: "Ctrl+S", command: "file-save" },
        { label: "Save As…", icon: "save", command: "file-save-as" },
        { separator: true },
        { label: "Export as PDF", icon: "external", command: "file-export" },
        { label: "Print…", icon: "print", shortcut: "Ctrl+P", command: "file-print" },
        { separator: true },
        { label: "Word Count…", icon: "wordCount", command: "word-count" },
        { label: "About WordCraft", icon: "info", command: "about" }
      ];
    case "header":
      return [
        { label: "Edit Header", command: "insert-header" },
        { label: "Remove Header", command: "remove-header" }
      ];
    case "page-number":
      return [
        { label: "Bottom of Page", command: "insert-page-number" },
        { label: "Top of Page", command: "insert-page-number-top" },
        { label: "Remove Page Numbers", command: "remove-page-numbers" }
      ];
    case "position":
      return [
        { label: "In Line with Text", command: "position-inline" },
        { label: "Float Left", command: "position-left" },
        { label: "Float Right", command: "position-right" },
        { separator: true },
        { label: "More Layout Options…", command: "position-more" }
      ];
    case "paragraph-indent":
      return [
        { label: "Increase Indent", command: "indent-increase" },
        { label: "Decrease Indent", command: "indent-decrease" },
        { separator: true },
        { label: "First Line Indent", command: "first-line-indent" },
        { label: "Hanging Indent", command: "hanging-indent" }
      ];
    case "paragraph-spacing":
      return [
        { label: "Tight", command: "para-spacing-tight" },
        { label: "Normal", command: "para-spacing-normal" },
        { label: "Relaxed", command: "para-spacing-relaxed" }
      ];
    case "start-mail-merge":
      return [
        { label: "Letters", command: "mail-letters" },
        { label: "Email Messages", command: "mail-email" },
        { label: "Envelopes", command: "mail-envelopes" },
        { label: "Labels", command: "mail-labels" },
        { separator: true },
        { label: "Use an Existing List…", command: "select-recipients" }
      ];
    case "insert-merge-field":
      return ["First Name", "Last Name", "Company", "City", "Booking Date"].map(field => ({
        label: field,
        command: "insert-field",
        value: field
      }));
    case "finish-merge":
      return [
        { label: "Print Documents…", icon: "print", command: "finish-print" },
        { label: "Send Email Messages…", icon: "share", command: "finish-email" },
        { label: "Edit Individual Documents…", icon: "file", command: "finish-edit" }
      ];
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ toast & status */

let toastTimer = 0;

function toast(message: string, tone: "info" | "success" | "warn" = "info"): void {
  toastEl.textContent = message;
  toastEl.dataset.tone = tone;
  toastEl.hidden = false;
  toastEl.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    window.setTimeout(() => {
      toastEl.hidden = true;
    }, 180);
  }, 2600);
}

function updateDocTitle(): void {
  const title = q<HTMLElement>(app, "#doc-title");
  const suffix = !state.dirty ? "Saved" : state.everEdited ? "Edited" : "Not saved";
  title.textContent = `${DOC_TITLE} — ${suffix}`;
  document.title = `${DOC_TITLE} — WordCraft`;
}

function markDirty(): void {
  state.everEdited = true;
  state.dirty = true;
  updateDocTitle();
}

function markSaved(): void {
  state.dirty = false;
  state.everEdited = true;
  updateDocTitle();
}

function documentStats(): { words: number; characters: number; paragraphs: number } {
  return qa<HTMLElement>(pagesEl, ".wc-page-body").reduce(
    (total, editor) => {
      const stats = wordStats(editor);
      total.words += stats.words;
      total.characters += stats.characters;
      total.paragraphs += stats.paragraphs;
      return total;
    },
    { words: 0, characters: 0, paragraphs: 0 }
  );
}

function updateStatus(): void {
  const stats = documentStats();
  statusWords.textContent = `${stats.words} words`;
  statusPage.textContent = `Page ${state.currentPage} of ${state.pageCount}`;
  statusTrack.hidden = !state.tracking;
  statusProtected.hidden = !state.protectedView;
  statusZoom.textContent = `${state.zoom}%`;
  zoomSlider.value = String(state.zoom);
  q<HTMLElement>(app, "#status-track").classList.toggle("is-active", state.tracking);
  updateDocTitle();
}

/* ------------------------------------------------------------------ navigation */

function renderRuler(): void {
  const width = pagesEl.querySelector<HTMLElement>(".wc-page")?.offsetWidth ?? 850;
  const ticks: string[] = [];
  for (let x = 0; x <= width; x += 12) {
    const major = x % 96 === 0;
    ticks.push(`<span class="wc-ruler__tick${major ? " is-major" : ""}" style="left:${x}px"></span>`);
    if (major && x > 0) ticks.push(`<span class="wc-ruler__label" style="left:${x + 3}px">${x / 96}</span>`);
  }
  rulerTicks.innerHTML = ticks.join("");
  rulerMarginLeft.style.width = "var(--page-pad-x)";
  rulerMarginRight.style.width = "var(--page-pad-x)";
}

function renderNav(): void {
  if (state.navTab === "pages") {
    navBody.innerHTML = qa<HTMLElement>(pagesEl, ".wc-page")
      .map((page, index) => {
        const preview =
          page.querySelector<HTMLElement>(".wc-page-body")?.innerText.replace(/\s+/g, " ").trim().slice(0, 120) ?? "";
        return `<button type="button" class="wc-nav-page" data-go-page="${index + 1}">
          <span class="wc-nav-page__thumb">${index + 1}</span>
          <span class="wc-nav-page__meta"><span class="wc-nav-page__title">Page ${
            index + 1
          }</span><span class="wc-nav-page__preview">${escapeHtml(preview)}</span></span>
        </button>`;
      })
      .join("");
    return;
  }

  if (state.navTab === "results" || state.navQuery.trim()) {
    const query = state.navQuery.trim();
    if (!query) {
      navBody.innerHTML = `<p class="wc-nav__empty">Type in the search box to find text in this document.</p>`;
      return;
    }
    const matches = textRanges(pagesEl, query).slice(0, 40);
    if (matches.length === 0) {
      navBody.innerHTML = `<p class="wc-nav__empty">No results for “${escapeHtml(query)}”.</p>`;
      return;
    }
    navBody.innerHTML = matches
      .map((range, index) => {
        const editor = editorForNode(range.startContainer) ?? firstEditor();
        const block = closestBlock(range.startContainer, editor);
        const text = block?.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const position = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
        const snippet = escapeHtml(text.slice(Math.max(0, position - 30), position + query.length + 50));
        return `<button type="button" class="wc-nav-result" data-result-index="${index}">
          <span class="wc-nav-result__title">${escapeHtml(block?.textContent?.slice(0, 40) ?? "Match")}</span>
          <span class="wc-nav-result__snippet">${snippet}</span>
        </button>`;
      })
      .join("");
    qa<HTMLElement>(navBody, "[data-result-index]").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.resultIndex);
        const range = textRanges(pagesEl, query)[index];
        if (!range) return;
        selectRange(range);
        scrollRangeIntoView(range);
        const editor = editorForNode(range.startContainer) ?? firstEditor();
        if (range.startContainer.parentElement) flashElement(closestBlock(range.startContainer, editor) ?? editor);
      });
    });
    return;
  }

  const outline = buildOutline(pagesEl);
  outline.forEach((entry, index) => {
    if (!entry.element.id) entry.element.id = `wc-heading-${index}`;
  });
  const query = state.navQuery.trim().toLocaleLowerCase();
  const filtered = query ? outline.filter(entry => entry.text.toLocaleLowerCase().includes(query)) : outline;
  if (filtered.length === 0) {
    navBody.innerHTML = `<p class="wc-nav__empty">No headings match “${escapeHtml(state.navQuery)}”.</p>`;
    return;
  }
  navBody.innerHTML = filtered
    .map(
      entry =>
        `<button type="button" class="wc-nav-heading" data-target="${entry.element.id}" style="--level:${entry.level}">
          <span class="wc-nav-heading__mark"></span><span class="wc-nav-heading__text">${escapeHtml(entry.text)}</span>
        </button>`
    )
    .join("");
  qa<HTMLElement>(navBody, "[data-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target ?? "");
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      flashElement(target);
    });
  });
}

function scrollRangeIntoView(range: Range): void {
  const rect = range.getBoundingClientRect();
  const scrollRect = docScroll.getBoundingClientRect();
  if (rect.top < scrollRect.top + 70 || rect.bottom > scrollRect.bottom - 40) {
    docScroll.scrollBy({ top: rect.top - scrollRect.top - docScroll.clientHeight / 2, behavior: "smooth" });
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => {
    switch (char) {
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

/* ------------------------------------------------------------------ comments */

function renderComments(): void {
  commentsRail.innerHTML = "";

  if (state.composerAnchor) {
    const composer = document.createElement("div");
    composer.className = "wc-comment wc-comment--composer";
    composer.style.top = "38px";
    composer.innerHTML = `
      <div class="wc-comment__meta"><span class="wc-comment__avatar">WU</span><strong>WordCraft User</strong><span class="wc-comment__time">now</span></div>
      <textarea class="wc-comment__input" id="comment-input" rows="3" placeholder="Write a comment…"></textarea>
      <div class="wc-comment__actions"><button type="button" class="wc-comment__post" data-comment-action="post">Post</button><button type="button" data-comment-action="cancel">Cancel</button></div>`;
    commentsRail.appendChild(composer);
    requestAnimationFrame(() => q<HTMLTextAreaElement>(commentsRail, "#comment-input").focus());
  }

  for (const comment of state.comments) {
    const card = document.createElement("article");
    card.className = `wc-comment${comment.resolved ? " is-resolved" : ""}${
      state.activeComment === comment.id ? " is-active" : ""
    }`;
    card.dataset.commentId = comment.id;
    card.innerHTML = `
      <div class="wc-comment__meta">
        <span class="wc-comment__avatar">${comment.initials}</span>
        <strong>${escapeHtml(comment.author)}</strong>
        <span class="wc-comment__time">${escapeHtml(comment.timestamp)}</span>
        <button type="button" class="wc-comment__close" data-comment-action="delete" title="Delete comment">${icon(
          "close",
          12
        )}</button>
      </div>
      <div class="wc-comment__text">${escapeHtml(comment.text)}</div>
      <div class="wc-comment__actions">
        <button type="button" data-comment-action="reply">Reply</button>
        <button type="button" data-comment-action="resolve">${icon("check", 11)} ${
      comment.resolved ? "Reopen" : "Resolve"
    }</button>
      </div>`;
    card.addEventListener("click", event => {
      if ((event.target as HTMLElement).closest("[data-comment-action]")) return;
      selectComment(comment.id);
    });
    commentsRail.appendChild(card);
  }

  if (state.comments.length === 0 && !state.composerAnchor) {
    commentsRail.innerHTML = `<p class="wc-comments__empty">No comments yet. Select text and choose <strong>New Comment</strong>.</p>`;
  }

  applyCommentAnchors();
  positionComments();
}

function applyCommentAnchors(): void {
  qa<HTMLElement>(pagesEl, "[data-comment]").forEach(anchor => {
    const id = anchor.dataset.comment ?? "";
    const comment = state.comments.find(item => item.id === id);
    anchor.classList.toggle("wc-comment-anchor", state.commentsOpen && Boolean(comment) && !comment?.resolved);
    anchor.classList.toggle("wc-comment-anchor--active", state.commentsOpen && state.activeComment === id);
  });
}

function positionComments(): void {
  if (!state.commentsOpen) return;
  const cards = qa<HTMLElement>(commentsRail, ".wc-comment:not(.wc-comment--composer)");
  const composer = commentsRail.querySelector<HTMLElement>(".wc-comment--composer");
  const zoom = state.zoom / 100;
  const canvasRect = canvasEl.getBoundingClientRect();
  let lastBottom = composer ? 38 + composer.offsetHeight + 12 : 6;

  const positioned = cards
    .map(card => {
      const comment = state.comments.find(item => item.id === card.dataset.commentId);
      const anchor = comment ? pagesEl.querySelector<HTMLElement>(comment.anchor) : null;
      if (!anchor) return { card, top: lastBottom };
      const rect = anchor.getBoundingClientRect();
      return { card, top: Math.max(4, (rect.top - canvasRect.top) / zoom) };
    })
    .sort((a, b) => a.top - b.top);

  for (const item of positioned) {
    const top = Math.max(item.top, lastBottom);
    item.card.style.top = `${top}px`;
    lastBottom = top + item.card.offsetHeight + 16;
  }

  if (composer) composer.style.top = "38px";
}

function selectComment(id: string): void {
  state.activeComment = id;
  applyCommentAnchors();
  qa<HTMLElement>(commentsRail, ".wc-comment").forEach(card => {
    card.classList.toggle("is-active", card.dataset.commentId === id);
  });
  const comment = state.comments.find(item => item.id === id);
  const anchor = comment ? pagesEl.querySelector<HTMLElement>(comment.anchor) : null;
  if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
}

function startComment(): void {
  const block = currentBlock() ?? q<HTMLElement>(pagesEl, ".wc-page-body p");
  if (!block) {
    toast("Place the cursor in the document first", "warn");
    return;
  }
  state.composerAnchor = block;
  state.commentsOpen = true;
  appEl.classList.add("wc-comments-open");
  renderRibbonBody();
  renderComments();
}

function postComment(): void {
  if (!state.composerAnchor) return;
  const input = q<HTMLTextAreaElement>(commentsRail, "#comment-input");
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const id = `c${Date.now()}`;
  state.composerAnchor.dataset.comment = id;
  state.comments.push({
    id,
    author: "WordCraft User",
    initials: "WU",
    timestamp: "Just now",
    text,
    anchor: `[data-comment="${id}"]`
  });
  state.composerAnchor = null;
  state.activeComment = id;
  renderComments();
  markDirty();
  toast("Comment posted", "success");
}

function deleteComment(id: string): void {
  const comment = state.comments.find(item => item.id === id);
  const anchor = comment ? pagesEl.querySelector<HTMLElement>(comment.anchor) : null;
  if (anchor) {
    anchor.removeAttribute("data-comment");
    anchor.classList.remove("wc-comment-anchor", "wc-comment-anchor--active");
  }
  state.comments = state.comments.filter(item => item.id !== id);
  if (state.activeComment === id) state.activeComment = null;
  renderComments();
  markDirty();
  toast("Comment deleted");
}

function toggleComments(force?: boolean): void {
  state.commentsOpen = force ?? !state.commentsOpen;
  appEl.classList.toggle("wc-comments-open", state.commentsOpen);
  applyCommentAnchors();
  renderRibbonBody();
  if (state.commentsOpen) {
    renderComments();
    requestAnimationFrame(positionComments);
    toast("Comments pane shown");
  }
}

/* ------------------------------------------------------------------ find & replace */

let findRanges: Range[] = [];

function refreshFind(selectActive = true): void {
  findRanges = textRanges(pagesEl, findInput.value);
  if (state.findIndex >= findRanges.length) state.findIndex = 0;
  findCount.textContent = findRanges.length ? `${state.findIndex + 1} of ${findRanges.length}` : "0 of 0";
  findHint.textContent = findRanges.length ? "Enter / Shift+Enter to move · Esc to close" : "No matches";
  if (selectActive && findRanges.length) {
    const range = findRanges[state.findIndex];
    selectRange(range);
    scrollRangeIntoView(range);
  }
}

function stepFind(direction: 1 | -1): void {
  findRanges = textRanges(pagesEl, findInput.value);
  if (findRanges.length === 0) {
    refreshFind();
    return;
  }
  state.findIndex = (state.findIndex + direction + findRanges.length) % findRanges.length;
  findCount.textContent = `${state.findIndex + 1} of ${findRanges.length}`;
  const range = findRanges[state.findIndex];
  selectRange(range);
  scrollRangeIntoView(range);
}

function openFind(mode: "find" | "replace"): void {
  state.findMode = mode;
  findPanel.hidden = false;
  findReplaceRow.hidden = mode !== "replace";
  findInput.value = state.findQuery;
  refreshFind(false);
  findInput.focus();
  findInput.select();
  if (mode === "replace") replaceInput.focus();
}

function closeFind(): void {
  findPanel.hidden = true;
  findInput.blur();
  replaceInput.blur();
}

function replaceCurrent(): void {
  findRanges = textRanges(pagesEl, findInput.value);
  if (findRanges.length === 0) return;
  const range = findRanges[state.findIndex] ?? findRanges[0];
  replaceRange(range, replaceInput.value);
  markDirty();
  refreshFind(false);
  scheduleContentRefresh();
}

function replaceAll(): void {
  const count = replaceAllText(pagesEl, findInput.value, replaceInput.value);
  markDirty();
  refreshFind(false);
  scheduleContentRefresh();
  toast(`${count} replacement${count === 1 ? "" : "s"} made`, "success");
}

/* ------------------------------------------------------------------ zoom, modes, views */

function applyZoom(percent: number): void {
  state.zoom = Math.max(50, Math.min(200, Math.round(percent)));
  canvasEl.style.setProperty("--wc-zoom", String(state.zoom / 100));
  statusZoom.textContent = `${state.zoom}%`;
  zoomSlider.value = String(state.zoom);
  requestAnimationFrame(positionComments);
}

function zoomFitWidth(): void {
  const page = pagesEl.querySelector<HTMLElement>(".wc-page");
  if (!page) return;
  const available = docScroll.clientWidth - (state.commentsOpen ? 340 : 80) - 40;
  applyZoom((available / page.offsetWidth) * 100);
}

function toggleReadMode(): void {
  state.readingMode = !state.readingMode;
  appEl.classList.toggle("wc-read-mode", state.readingMode);
  readExit.hidden = !state.readingMode;
  renderRibbonBody();
  updateStatus();
  if (state.readingMode) toast("Read Mode · Esc to exit");
}

function toggleFocusMode(): void {
  state.focusMode = !state.focusMode;
  appEl.classList.toggle("wc-focus-mode", state.focusMode);
  requestAnimationFrame(positionComments);
  toast(state.focusMode ? "Focus mode — press Esc to restore" : "Full ribbon restored");
}

function setNavOpen(open: boolean): void {
  state.navOpen = open;
  appEl.classList.toggle("wc-nav-closed", !open);
  renderRibbonBody();
  requestAnimationFrame(positionComments);
}

function setRuler(visible: boolean): void {
  state.ruler = visible;
  rulerRow.hidden = !visible;
  renderRibbonBody();
}

function applyPageColor(): void {
  const color = PAGE_COLORS.find(entry => entry.id === state.pageColor) ?? PAGE_COLORS[0];
  appEl.style.setProperty("--wc-page-bg", color.value);
}

function applyMarginsToDom(): void {
  const [x, y] = MARGINS[state.margins] ?? MARGINS.normal;
  appEl.style.setProperty("--page-pad-x", `${x}px`);
  appEl.style.setProperty("--page-pad-y", `${y}px`);
  requestAnimationFrame(() => {
    renderRuler();
    positionComments();
  });
}

/* ------------------------------------------------------------------ palette */

const PALETTE_COMMANDS: CommandItem[] = [
  { label: "Bold", shortcut: "Ctrl+B", command: "bold", hint: "Font" },
  { label: "Italic", shortcut: "Ctrl+I", command: "italic", hint: "Font" },
  { label: "Underline", shortcut: "Ctrl+U", command: "underline", hint: "Font" },
  { label: "Find in document", shortcut: "Ctrl+F", command: "find", hint: "Editing" },
  { label: "Replace", shortcut: "Ctrl+H", command: "replace", hint: "Editing" },
  { label: "Word Count", command: "word-count", hint: "Proofing" },
  { label: "Spelling & Grammar", shortcut: "F7", command: "spelling", hint: "Proofing" },
  { label: "Track Changes", command: "track-changes", hint: "Review" },
  { label: "New Comment", command: "insert-comment", hint: "Review" },
  { label: "Show Comments", command: "show-comments", hint: "Review" },
  { label: "Read Mode", command: "read-mode", hint: "View" },
  { label: "Focus Mode", command: "focus-mode", hint: "View" },
  { label: "Navigation Pane", command: "navigation-pane", hint: "View" },
  { label: "Ruler", command: "ruler", hint: "View" },
  { label: "Dark Mode", command: "dark-mode", hint: "View" },
  { label: "Zoom 100%", command: "zoom-set", value: "100", hint: "View" },
  { label: "Page Width", command: "zoom-page-width", hint: "View" },
  { label: "Insert Table", command: "insert-table", hint: "Insert" },
  { label: "Insert Picture", command: "insert-picture", hint: "Insert" },
  { label: "Insert Footnote", command: "insert-footnote", hint: "References" },
  { label: "Insert Table of Contents", command: "insert-toc", hint: "References" },
  { label: "Insert Bibliography", command: "insert-bibliography", hint: "References" },
  { label: "Margins: Normal", command: "set-margins", value: "normal", hint: "Layout" },
  { label: "Switch to Landscape", command: "set-orientation", value: "landscape", hint: "Layout" },
  { label: "Two Columns", command: "set-columns", value: "2", hint: "Layout" },
  { label: "Theme: Editorial", command: "set-theme", value: "editorial", hint: "Design" },
  { label: "Page Color: Cream", command: "set-page-color", value: "cream", hint: "Design" },
  { label: "Add Watermark", command: "set-watermark", value: "DRAFT", hint: "Design" },
  { label: "Keyboard Shortcuts", command: "shortcuts", hint: "Help" },
  { label: "About WordCraft", command: "about", hint: "Help" },
  { label: "Save", shortcut: "Ctrl+S", command: "file-save", hint: "File" },
  { label: "Export as PDF", command: "file-export", hint: "File" }
];

let paletteIndex = 0;

function openPalette(query = ""): void {
  palette.hidden = false;
  paletteInput.value = query;
  renderPalette(query);
  const rect = commandSearch.getBoundingClientRect();
  palette.style.left = `${Math.max(8, Math.min(rect.left - 220, window.innerWidth - 446))}px`;
  palette.style.top = `${rect.bottom + 6}px`;
  paletteInput.focus();
  if (query) paletteInput.setSelectionRange(query.length, query.length);
}

function closePalette(): void {
  palette.hidden = true;
}

function renderPalette(query: string): void {
  const needle = query.trim().toLocaleLowerCase();
  const matches = PALETTE_COMMANDS.filter(
    command =>
      !needle ||
      command.label.toLocaleLowerCase().includes(needle) ||
      (command.hint ?? "").toLocaleLowerCase().includes(needle)
  ).slice(0, 9);
  paletteIndex = Math.min(paletteIndex, Math.max(0, matches.length - 1));
  if (matches.length === 0) {
    paletteList.innerHTML = `<p class="wc-palette__empty">No commands match “${escapeHtml(query)}”.</p>`;
    return;
  }
  paletteList.innerHTML = matches
    .map(
      (command, index) =>
        `<button type="button" class="wc-palette__item${
          index === paletteIndex ? " is-active" : ""
        }" data-palette-index="${index}">
          <span class="wc-palette__icon">${icon("search", 13)}</span>
          <span class="wc-palette__label">${escapeHtml(command.label)}</span>
          <span class="wc-palette__hint">${escapeHtml(command.hint ?? "")}</span>
          <span class="wc-palette__shortcut">${escapeHtml(command.shortcut ?? "")}</span>
        </button>`
    )
    .join("");
  qa<HTMLElement>(paletteList, "[data-palette-index]").forEach(button => {
    button.addEventListener("click", () => {
      const command = matches[Number(button.dataset.paletteIndex)];
      closePalette();
      runCommand(command.command, command.value);
    });
  });
}

function runPaletteSelection(): void {
  const active = paletteList.querySelector<HTMLElement>(".wc-palette__item.is-active");
  if (!active) return;
  const items = qa<HTMLElement>(paletteList, "[data-palette-index]");
  const index = items.indexOf(active);
  const needle = paletteInput.value.trim().toLocaleLowerCase();
  const matches = PALETTE_COMMANDS.filter(
    command =>
      !needle ||
      command.label.toLocaleLowerCase().includes(needle) ||
      (command.hint ?? "").toLocaleLowerCase().includes(needle)
  ).slice(0, 9);
  const command = matches[index];
  if (!command) return;
  closePalette();
  runCommand(command.command, command.value);
}

/* ------------------------------------------------------------------ backstage */

type BackstageSection = "home" | "new" | "open" | "info" | "save" | "print" | "share" | "export" | "options" | "close";

let backstageSection: BackstageSection = "home";

const BACKSTAGE_NAV: Array<{ id: BackstageSection; label: string }> = [
  { id: "home", label: "Home" },
  { id: "new", label: "New" },
  { id: "open", label: "Open" },
  { id: "info", label: "Info" },
  { id: "save", label: "Save As" },
  { id: "print", label: "Print" },
  { id: "share", label: "Share" },
  { id: "export", label: "Export" },
  { id: "options", label: "Options" },
  { id: "close", label: "Close" }
];

function openBackstage(section: BackstageSection = "home"): void {
  backstageSection = section;
  backstage.hidden = false;
  appEl.classList.add("wc-backstage-open");
  qa<HTMLElement>(tabstrip, ".wc-tab").forEach(tab => tab.classList.remove("is-active"));
  q<HTMLElement>(tabstrip, ".wc-tab--file").classList.add("is-active");
  renderBackstage();
}

function closeBackstage(): void {
  backstage.hidden = true;
  appEl.classList.remove("wc-backstage-open");
  updateTabstrip();
}

function renderBackstage(): void {
  backstageNav.innerHTML = `
    <button type="button" class="wc-backstage__back" data-command="backstage-close">${icon(
      "arrowLeft",
      15
    )} Back</button>
    ${BACKSTAGE_NAV.filter(item => item.id !== "close")
      .map(
        item =>
          `<button type="button" class="wc-backstage__nav-item${
            item.id === backstageSection ? " is-active" : ""
          }" data-backstage="${item.id}">${item.label}</button>`
      )
      .join("")}
    <div class="wc-backstage__nav-foot"><button type="button" class="wc-backstage__nav-item" data-command="backstage-close">Close</button></div>`;

  const stats = documentStats();
  const panels: Record<BackstageSection, string> = {
    home: `<h2>Good afternoon</h2>
      <p class="wc-backstage__lead">Pick up where you left off, or start something new.</p>
      <div class="wc-templates">
        <button type="button" class="wc-template" data-command="template-blank"><span class="wc-template__paper"></span><strong>Blank document</strong><span>Start from a clean page</span></button>
        <button type="button" class="wc-template" data-command="template-handbook"><span class="wc-template__paper wc-template__paper--handbook"></span><strong>Studio handbook</strong><span>This demo document</span></button>
        <button type="button" class="wc-template" data-command="template-letter"><span class="wc-template__paper wc-template__paper--letter"></span><strong>Letter</strong><span>Formal correspondence</span></button>
      </div>
      <h3>Recent</h3>
      <div class="wc-recent"><span class="wc-recent__icon">${icon(
        "file",
        18
      )}</span><div><strong>${DOC_TITLE}</strong><span>Documents · Just now</span></div><button type="button" class="wc-backstage__link" data-command="backstage-close">Open</button></div>`,
    new: `<h2>New</h2><p class="wc-backstage__lead">Choose a template or start blank.</p>
      <div class="wc-templates">
        <button type="button" class="wc-template" data-command="template-blank"><span class="wc-template__paper"></span><strong>Blank document</strong><span>Clean A4 page</span></button>
        <button type="button" class="wc-template" data-command="template-handbook"><span class="wc-template__paper wc-template__paper--handbook"></span><strong>Studio handbook</strong><span>Sample content</span></button>
      </div>`,
    open: `<h2>Open</h2><p class="wc-backstage__lead">Recent documents on this device.</p>
      <div class="wc-recent"><span class="wc-recent__icon">${icon(
        "file",
        18
      )}</span><div><strong>${DOC_TITLE}.docx</strong><span>Documents · Just now</span></div><button type="button" class="wc-backstage__link" data-command="file-open-doc">Open</button></div>
      <div class="wc-recent"><span class="wc-recent__icon">${icon(
        "file",
        18
      )}</span><div><strong>Membership agreement.docx</strong><span>Documents · Yesterday</span></div><button type="button" class="wc-backstage__link" data-command="file-open-doc">Open</button></div>`,
    info: `<h2>Info</h2><h3>${DOC_TITLE}</h3>
      <div class="wc-info-grid"><span>Location</span><strong>This PC › Documents</strong><span>Pages</span><strong>${state.pageCount}</strong><span>Words</span><strong>${stats.words}</strong><span>Size</span><strong>28 KB</strong><span>Modified</span><strong>Just now</strong><span>Author</span><strong>WordCraft User</strong></div>
      <div class="wc-info-actions"><button type="button" class="wc-backstage__link" data-command="file-save">Save a Copy</button><button type="button" class="wc-backstage__link" data-command="word-count">Word Count</button></div>`,
    save: `<h2>Save As</h2><p class="wc-backstage__lead">Save a copy of this document.</p>
      <div class="wc-field"><label>File name</label><input type="text" value="${DOC_TITLE}.docx" readonly /></div>
      <div class="wc-field"><label>Format</label><input type="text" value="Word Document (*.docx)" readonly /></div>
      <button type="button" class="wc-primary" data-command="file-save-as">Save a Copy</button>`,
    print: `<h2>Print</h2><p class="wc-backstage__lead">Print the whole document or a page range.</p>
      <div class="wc-field"><label>Copies</label><input type="number" value="1" min="1" /></div>
      <div class="wc-field"><label>Pages</label><input type="text" value="1-${state.pageCount}" /></div>
      <button type="button" class="wc-primary" data-command="file-print">Print</button>`,
    share: `<h2>Share</h2><p class="wc-backstage__lead">Send a link or invite people to review.</p>
      <div class="wc-field"><label>Invite people</label><input type="text" placeholder="name@studio.org" /></div>
      <button type="button" class="wc-primary" data-command="share-copy">Copy sharing link</button>
      <p class="wc-backstage__note">Reviewers can comment and suggest changes. Track Changes is currently ${
        state.tracking ? "on" : "off"
      }.</p>`,
    export: `<h2>Export</h2><p class="wc-backstage__lead">Create a copy that works everywhere.</p>
      <button type="button" class="wc-backstage__row" data-command="file-export"><span>${icon(
        "file",
        20
      )}</span><div><strong>Export as PDF</strong><span>Preserve layout and selectable text</span></div></button>
      <button type="button" class="wc-backstage__row" data-command="file-export"><span>${icon(
        "external",
        20
      )}</span><div><strong>Export as HTML</strong><span>Ready for the web</span></div></button>`,
    options: `<h2>Options</h2><div class="wc-field"><label>AutoSave</label><span>${
      state.autosave ? "On" : "Off"
    }</span></div>
      <div class="wc-field"><label>Default language</label><span>English (United States)</span></div>
      <div class="wc-field"><label>Theme</label><span>${state.theme}</span></div>`,
    close: ""
  };
  backstagePanel.innerHTML = panels[backstageSection] ?? panels.home;
}

/* ------------------------------------------------------------------ content refresh */

let refreshTimer = 0;

function scheduleContentRefresh(): void {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    renderNav();
    updateStatus();
    positionComments();
    if (state.columns > 1) applyColumns();
  }, 180);
}

function updateCurrentPage(): void {
  const scrollRect = docScroll.getBoundingClientRect();
  const pages = qa<HTMLElement>(pagesEl, ".wc-page");
  let current = 1;
  pages.forEach((page, index) => {
    const rect = page.getBoundingClientRect();
    if (rect.top <= scrollRect.top + scrollRect.height * 0.4) current = index + 1;
  });
  if (current !== state.currentPage) {
    state.currentPage = current;
    statusPage.textContent = `Page ${current} of ${state.pageCount}`;
  }
}

/* ------------------------------------------------------------------ theme, margins, columns */

function applyTheme(theme: string): void {
  state.theme = theme;
  pagesEl.dataset.theme = theme;
  pagesEl.style.setProperty("--doc-font", THEME_FONTS[theme] ?? THEME_FONTS.studio);
  const accent =
    theme === "editorial" ? "#8a4b2a" : theme === "slate" ? "#3a3a3a" : theme === "contrast" ? "#111111" : "#215c78";
  appEl.style.setProperty("--doc-accent", accent);
  renderRibbonBody();
}

function applyColumns(): void {
  qa<HTMLElement>(pagesEl, ".wc-page").forEach((page, index) => {
    const body = page.querySelector<HTMLElement>(".wc-page-body");
    if (!body) return;
    body.classList.toggle("wc-columns", state.columns > 1 && index === 0);
    body.style.columnCount = state.columns > 1 && index === 0 ? String(state.columns) : "";
  });
}

function applyLineNumbers(): void {
  pagesEl.classList.toggle("wc-line-numbers", state.lineNumbers);
}

function paintWatermark(): void {
  qa<HTMLElement>(pagesEl, ".wc-watermark").forEach(element => element.remove());
  if (!state.watermark) return;
  qa<HTMLElement>(pagesEl, ".wc-page").forEach(page => {
    const mark = document.createElement("div");
    mark.className = "wc-watermark";
    mark.textContent = state.watermark;
    page.appendChild(mark);
  });
}

function applyHeaderFooter(): void {
  qa<HTMLElement>(pagesEl, ".wc-page").forEach(page => {
    page.classList.toggle("wc-no-header", !state.headerFooter);
    page.classList.toggle("wc-no-footer", !state.headerFooter);
  });
}

/* ------------------------------------------------------------------ draw layer */

let inkLayer: SVGSVGElement | null = null;
let inkPath: SVGPathElement | null = null;
let inkPoints: string[] = [];

function inkSvg(): SVGSVGElement {
  if (inkLayer) return inkLayer;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "ink-layer";
  svg.classList.add("wc-ink");
  pagesEl.appendChild(svg);
  inkLayer = svg;
  svg.addEventListener("pointerdown", beginInk);
  svg.addEventListener("pointermove", moveInk);
  svg.addEventListener("pointerup", endInk);
  svg.addEventListener("pointerleave", endInk);
  return svg;
}

function sizeInkLayer(): void {
  const svg = inkSvg();
  const rect = pagesEl.getBoundingClientRect();
  const zoom = state.zoom / 100;
  svg.setAttribute("viewBox", `0 0 ${rect.width / zoom} ${rect.height / zoom}`);
  svg.setAttribute("width", String(rect.width / zoom));
  svg.setAttribute("height", String(rect.height / zoom));
}

function beginInk(event: PointerEvent): void {
  if (!state.drawTool) return;
  if (state.drawTool === "eraser") {
    const paths = qa<SVGPathElement>(inkSvg(), "path");
    paths[paths.length - 1]?.remove();
    toast("Last stroke erased");
    return;
  }
  if (state.drawTool === "lasso") {
    toast("Lasso select — drag around ink to move it (demo)");
    return;
  }
  const rect = pagesEl.getBoundingClientRect();
  const zoom = state.zoom / 100;
  const x = (event.clientX - rect.left) / zoom;
  const y = (event.clientY - rect.top) / zoom;
  inkPoints = [`M ${x.toFixed(2)} ${y.toFixed(2)}`];
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", state.drawTool === "highlighter" ? "#f4c542" : "#1a4d8f");
  path.setAttribute("stroke-width", state.drawTool === "highlighter" ? "16" : "2.4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("opacity", state.drawTool === "highlighter" ? "0.36" : "1");
  path.setAttribute("d", inkPoints[0]);
  inkSvg().appendChild(path);
  inkPath = path;
  inkSvg().setPointerCapture(event.pointerId);
}

function moveInk(event: PointerEvent): void {
  if (!inkPath) return;
  const rect = pagesEl.getBoundingClientRect();
  const zoom = state.zoom / 100;
  const x = (event.clientX - rect.left) / zoom;
  const y = (event.clientY - rect.top) / zoom;
  inkPoints.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
  inkPath.setAttribute("d", inkPoints.join(" "));
}

function endInk(): void {
  if (inkPath) {
    inkPath = null;
    toast("Ink stroke added", "success");
  }
}

/* ------------------------------------------------------------------ init */

buildDocument();
applyTheme(state.theme);
renderRibbonBody();
renderNav();
renderRuler();
applyHeaderFooter();
appEl.classList.toggle("wc-nav-closed", !state.navOpen);
updateStatus();
requestAnimationFrame(() => {
  renderRuler();
  positionComments();
});

/* ------------------------------------------------------------------ events */

tabstrip.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const tab = target.closest<HTMLElement>("[data-tab]");
  if (tab?.dataset.tab) {
    switchTab(tab.dataset.tab as RibbonTab);
    return;
  }
  if (target.closest('[data-command="file-backstage"]')) openBackstage("home");
});

navSearch.addEventListener("input", () => {
  state.navQuery = navSearch.value;
  if (state.navQuery.trim() && state.navTab === "headings") state.navTab = "results";
  renderNav();
  qa<HTMLElement>(app, "[data-nav-tab]").forEach(tab => {
    tab.classList.toggle("is-active", tab.dataset.navTab === state.navTab);
  });
});

qa<HTMLElement>(app, "[data-nav-tab]").forEach(tab => {
  tab.addEventListener("click", () => {
    state.navTab = tab.dataset.navTab as NavTab;
    qa<HTMLElement>(app, "[data-nav-tab]").forEach(item => item.classList.toggle("is-active", item === tab));
    renderNav();
  });
});

pagesEl.addEventListener("input", () => {
  markDirty();
  scheduleContentRefresh();
});

pagesEl.addEventListener("mouseup", () => {
  if (state.painterActive && state.painterStyle) {
    applyInlineStyle(currentEditor(), state.painterStyle);
    state.painterActive = false;
    state.painterStyle = null;
    appEl.classList.remove("wc-painter");
    toast("Formatting applied", "success");
  }
});

let selectionTimer = 0;

document.addEventListener("selectionchange", () => {
  window.clearTimeout(selectionTimer);
  selectionTimer = window.setTimeout(() => {
    syncSelectionState();
    updateCurrentPage();
  }, 40);
});

docScroll.addEventListener("scroll", () => {
  updateCurrentPage();
  closePopup();
});

window.addEventListener("resize", () => {
  renderRuler();
  positionComments();
  sizeInkLayer();
});

document.addEventListener("mousedown", event => {
  const target = event.target as HTMLElement;
  if (activePopup && !activePopup.contains(target) && !target.closest("[data-popup]")) closePopup();
  if (!palette.hidden && !palette.contains(target) && target !== commandSearch) closePalette();
});

findInput.addEventListener("input", () => {
  state.findQuery = findInput.value;
  state.findIndex = 0;
  refreshFind(false);
});
findInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    stepFind(event.shiftKey ? -1 : 1);
  }
});
replaceInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    replaceCurrent();
  }
});
findPanel.addEventListener("click", event => {
  const action = (event.target as HTMLElement).closest<HTMLElement>("[data-find-action]")?.dataset.findAction;
  if (action === "prev") stepFind(-1);
  else if (action === "next") stepFind(1);
  else if (action === "close") closeFind();
  else if (action === "replace") replaceCurrent();
  else if (action === "replace-all") replaceAll();
});

commentsRail.addEventListener("click", event => {
  const action = (event.target as HTMLElement).closest<HTMLElement>("[data-comment-action]")?.dataset.commentAction;
  const card = (event.target as HTMLElement).closest<HTMLElement>("[data-comment-id]");
  if (!action) return;
  if (action === "post") postComment();
  else if (action === "cancel") {
    state.composerAnchor = null;
    renderComments();
  } else if (card?.dataset.commentId) {
    if (action === "delete") deleteComment(card.dataset.commentId);
    else if (action === "resolve") {
      const comment = state.comments.find(item => item.id === card.dataset.commentId);
      if (comment) {
        comment.resolved = !comment.resolved;
        renderComments();
        markDirty();
        toast(comment.resolved ? "Comment resolved" : "Comment reopened");
      }
    } else if (action === "reply") {
      commentActionReply(card.dataset.commentId);
    }
  }
});

function commentActionReply(id: string): void {
  const comment = state.comments.find(item => item.id === id);
  if (!comment) return;
  comment.text += "\n\n↳ WordCraft User: Thanks — noted for the next studio meeting.";
  renderComments();
  markDirty();
}

zoomSlider.addEventListener("input", () => applyZoom(Number(zoomSlider.value)));

docScroll.addEventListener("dblclick", () => {
  currentEditor().focus();
});

commandSearch.addEventListener("focus", () => openPalette(commandSearch.value));
commandSearch.addEventListener("input", () => {
  palette.hidden = false;
  paletteInput.value = commandSearch.value;
  renderPalette(commandSearch.value);
});
paletteInput.addEventListener("input", () => {
  paletteIndex = 0;
  renderPalette(paletteInput.value);
});
paletteInput.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    movePalette(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    movePalette(-1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    runPaletteSelection();
  } else if (event.key === "Escape") {
    closePalette();
  }
});

function movePalette(direction: 1 | -1): void {
  const items = qa<HTMLElement>(paletteList, "[data-palette-index]");
  if (items.length === 0) return;
  paletteIndex = (paletteIndex + direction + items.length) % items.length;
  items.forEach((item, index) => item.classList.toggle("is-active", index === paletteIndex));
  items[paletteIndex]?.scrollIntoView({ block: "nearest" });
}

document.addEventListener("keydown", event => {
  const mod = event.ctrlKey || event.metaKey;
  const key = event.key.toLocaleLowerCase();

  if (event.key === "Escape") {
    if (overlayRoot.childElementCount > 0) return;
    if (activePopup) {
      closePopup();
      return;
    }
    if (!palette.hidden) {
      closePalette();
      return;
    }
    if (!backstage.hidden) {
      closeBackstage();
      return;
    }
    if (!findPanel.hidden) {
      closeFind();
      return;
    }
    if (state.focusMode) toggleFocusMode();
    if (state.readingMode) toggleReadMode();
    return;
  }

  if (mod && key === "f") {
    event.preventDefault();
    openFind("find");
    return;
  }
  if (mod && key === "h") {
    event.preventDefault();
    openFind("replace");
    return;
  }
  if (mod && key === "s") {
    event.preventDefault();
    runCommand("file-save");
    return;
  }
  if (mod && key === "p") {
    event.preventDefault();
    runCommand("file-print");
    return;
  }
  if (mod && key === "k") {
    event.preventDefault();
    openPalette("");
    return;
  }
  if (mod && event.altKey && key === "m") {
    event.preventDefault();
    startComment();
    return;
  }
  if (event.key === "F7") {
    event.preventDefault();
    runCommand("spelling");
    return;
  }
  if (mod && (key === "b" || key === "i" || key === "u")) {
    if (selectionInEditor(pagesEl)) {
      event.preventDefault();
      execInEditor(currentEditor(), key === "b" ? "bold" : key === "i" ? "italic" : "underline");
      syncSelectionState();
    }
  }
  if (mod && key === "z") {
    if (selectionInEditor(pagesEl.querySelector<HTMLElement>(".wc-page-body") ?? pagesEl)) return;
  }
});

document.addEventListener("click", event => {
  const target = event.target as HTMLElement;

  const backstageTab = target.closest<HTMLElement>("[data-backstage]");
  if (backstageTab?.dataset.backstage) {
    backstageSection = backstageTab.dataset.backstage as BackstageSection;
    renderBackstage();
    return;
  }

  const popupItem = target.closest<HTMLElement>(".wc-popup__item");
  if (popupItem && activePopup?.contains(popupItem)) {
    const command = popupItem.dataset.command;
    closePopup();
    if (command) runCommand(command, popupItem.dataset.value);
    else {
      const value = popupItem.dataset.value;
      if (value) runCommand(command ?? "", value);
    }
    return;
  }

  const commandEl = target.closest<HTMLElement>("[data-command]");
  if (commandEl) {
    runCommand(commandEl.dataset.command ?? "", commandEl.dataset.value);
    return;
  }

  const popupEl = target.closest<HTMLElement>("[data-popup]");
  if (popupEl) {
    event.preventDefault();
    const anchor = popupAnchorFor(popupEl);
    openPopup(anchor, entriesForPopup(popupEl.dataset.popup ?? ""));
  }
});

document.addEventListener("mousedown", event => {
  const target = event.target as HTMLElement;
  if (target.closest("input, textarea, select")) return;
  if (
    target.closest(
      ".wc-rbtn, .wc-combo, .wc-style-card, .wc-strip-btn, .wc-tab, .wc-tb-icon, .wc-popup, .wc-status__view, .wc-status__button, .wc-avatar, .wc-discord"
    )
  ) {
    event.preventDefault();
  }
});

document.addEventListener("keydown", event => {
  if (!backstage.hidden) return;
  const target = event.target as HTMLElement;
  if (target.closest("input, textarea")) return;
  if (event.key === "Tab" && selectionInEditor(pagesEl)) {
    event.preventDefault();
    execInEditor(currentEditor(), "indent");
  }
});

/* selection state */

function syncSelectionState(): void {
  const editor = currentEditor();
  const inside = selectionInEditor(editor);
  const checks: Array<[string, string]> = [
    ["bold", "bold"],
    ["italic", "italic"],
    ["underline", "underline"],
    ["strikeThrough", "strike"],
    ["subscript", "subscript"],
    ["superscript", "superscript"],
    ["justifyLeft", "align-left"],
    ["justifyCenter", "align-center"],
    ["justifyRight", "align-right"],
    ["justifyFull", "align-justify"],
    ["insertUnorderedList", "bullets"],
    ["insertOrderedList", "numbering"]
  ];
  for (const [command, name] of checks) {
    const button = qa<HTMLElement>(ribbonBody, `[data-command="${name}"]`)[0];
    if (!button) continue;
    let active = false;
    if (inside) {
      try {
        active = document.queryCommandState(command);
      } catch {
        active = false;
      }
    }
    button.classList.toggle("is-active", active);
  }

  const selection = window.getSelection();
  if (inside && selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    if (element) {
      const computed = window.getComputedStyle(element);
      const family = computed.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      const size = Math.round(parseFloat(computed.fontSize) / (4 / 3));
      const familyLabel = app.querySelector<HTMLElement>("#font-family-label");
      const sizeLabel = app.querySelector<HTMLElement>("#font-size-label");
      if (familyLabel && family) familyLabel.textContent = family;
      if (sizeLabel && Number.isFinite(size)) sizeLabel.textContent = String(size);
    }
  }
}

/* command execution lives below so every UI entry point shares one switch */

/* ------------------------------------------------------------------ modals */

function openModal(
  title: string,
  body: string,
  options: { width?: number; footer?: string; onMount?: (modal: HTMLElement, close: () => void) => void } = {}
): void {
  const backdrop = document.createElement("div");
  backdrop.className = "wc-modal-backdrop";
  backdrop.innerHTML = `<div class="wc-modal" role="dialog" aria-modal="true" style="width:${options.width ?? 520}px">
    <div class="wc-modal__header"><span>${title}</span><button type="button" class="wc-iconbtn" data-modal-close>${icon(
    "close",
    14
  )}</button></div>
    <div class="wc-modal__body">${body}</div>
    <div class="wc-modal__footer">${options.footer ?? '<button type="button" data-modal-close>Close</button>'}</div>
  </div>`;
  const modal = q<HTMLElement>(backdrop, ".wc-modal");
  const close = () => {
    backdrop.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  };
  backdrop.addEventListener("click", event => {
    const target = event.target as HTMLElement;
    if (target === backdrop || target.closest("[data-modal-close]")) close();
  });
  document.addEventListener("keydown", onKey);
  overlayRoot.appendChild(backdrop);
  options.onMount?.(modal, close);
}

function insertAtCursor(html: string): void {
  const editor = currentEditor();
  if (!insertHtml(editor, html)) {
    const block = editor.querySelector<HTMLElement>("p, li, h2, h1") ?? editor;
    block.insertAdjacentHTML("beforeend", html);
  }
  markDirty();
  scheduleContentRefresh();
}

function insertBlock(html: string): void {
  const block = currentBlock();
  if (block) block.insertAdjacentHTML("afterend", html);
  else {
    const editor = currentEditor();
    const last = editor.lastElementChild;
    if (last) last.insertAdjacentHTML("afterend", html);
    else editor.insertAdjacentHTML("beforeend", html);
  }
  markDirty();
  scheduleContentRefresh();
}

function selectionText(): string {
  const selection = window.getSelection();
  return selection?.toString().trim() ?? "";
}

function applyPageGeometry(): void {
  const sizes: Record<string, [number, number]> = {
    letter: [850, 1100],
    a4: [800, 1131],
    legal: [850, 1400]
  };
  let [width, height] = sizes[state.pageSize] ?? sizes.letter;
  if (state.orientation === "landscape") [width, height] = [height, width];
  appEl.style.setProperty("--page-w", `${width}px`);
  appEl.style.setProperty("--page-h", `${height}px`);
  requestAnimationFrame(() => {
    renderRuler();
    positionComments();
    applyColumns();
  });
}

function applyMargins(name: string): void {
  state.margins = name;
  applyMarginsToDom();
  renderRibbonBody();
  toast(`Margins: ${name[0].toUpperCase()}${name.slice(1)}`);
}

function applyTableOfContents(): void {
  const outline = buildOutline(pagesEl);
  const rows = outline
    .filter(entry => entry.text !== DOC_TITLE)
    .map(entry => {
      const page = entry.element.closest<HTMLElement>(".wc-page");
      const pageNumber = page?.dataset.page ?? "1";
      return `<div class="wc-toc__row wc-toc__row--${Math.min(3, entry.level)}"><span>${escapeHtml(
        entry.text
      )}</span><span class="wc-toc__dots"></span><span>${pageNumber}</span></div>`;
    })
    .join("");
  const html = `<div class="wc-toc" data-toc><div class="wc-toc__title">Contents</div>${rows}</div>`;
  const existing = pagesEl.querySelector<HTMLElement>("[data-toc]");
  if (existing) {
    existing.outerHTML = html;
  } else {
    const subtitle = pagesEl.querySelector<HTMLElement>(".wc-page-body [data-style='subtitle']");
    const target = subtitle ?? pagesEl.querySelector<HTMLElement>(".wc-page-body p");
    target?.insertAdjacentHTML("afterend", html);
  }
  markDirty();
  scheduleContentRefresh();
  toast("Table of contents updated", "success");
}

function insertBibliography(): void {
  if (pagesEl.querySelector("[data-bibliography]")) {
    toast("Bibliography already inserted");
    return;
  }
  const page = pagesEl.querySelector<HTMLElement>("#wc-page-2");
  const body = page?.querySelector<HTMLElement>(".wc-page-body");
  if (!body) return;
  const html = `<div data-bibliography><h2 data-style="heading1">References</h2>${CITATIONS.map(
    citation => `<p class="wc-reference">${escapeHtml(citation)}</p>`
  ).join("")}</div>`;
  const footnotes = body.querySelector(".wc-footnotes");
  if (footnotes) footnotes.insertAdjacentHTML("beforebegin", html);
  else body.insertAdjacentHTML("beforeend", html);
  markDirty();
  scheduleContentRefresh();
  toast("Bibliography inserted", "success");
}

function insertFootnote(): void {
  const editor = currentEditor();
  const page = pageOf(editor, pagesEl);
  if (!page) return;
  const number = qa<HTMLElement>(pagesEl, ".wc-footnote-ref").length + 1;
  insertAtCursor(`<sup class="wc-footnote-ref">${number}</sup>`);
  const list = ensureFootnoteList(page);
  list.insertAdjacentHTML(
    "beforeend",
    `<div class="wc-footnote"><span class="wc-footnote__number">${number}</span><span>Add the source or note here.</span></div>`
  );
  toast(`Footnote ${number} inserted`, "success");
}

function setTracking(on: boolean): void {
  state.tracking = on;
  appEl.classList.toggle("wc-tracking", on);
  if (on && state.editing === "Editing") state.editing = "Suggesting";
  if (!on && state.editing === "Suggesting") state.editing = "Editing";
  renderRibbonBody();
  updateStatus();
  toast(`Track Changes ${on ? "on" : "off"}`);
}

function setEditing(mode: EditingMode): void {
  state.editing = mode;
  state.tracking = mode === "Suggesting";
  appEl.classList.toggle("wc-tracking", state.tracking);
  renderRibbonBody();
  updateStatus();
  toast(`Editing mode: ${mode}`);
}

function applyPageColorById(id: string): void {
  state.pageColor = id;
  applyPageColor();
  renderRibbonBody();
  toast(`Page color: ${id}`);
}

function applyWatermark(text: string): void {
  state.watermark = text;
  paintWatermark();
  renderRibbonBody();
  toast(text ? `Watermark “${text}” applied` : "Watermark removed");
}

function applyStyleByName(styleId: string): void {
  const editor = currentEditor();
  if (!selectionInEditor(editor)) {
    toast("Select text to apply a style", "warn");
    return;
  }
  applyBlockStyle(editor, styleId);
  markDirty();
  scheduleContentRefresh();
  const preset = STYLE_PRESETS.find(item => item.id === styleId);
  toast(`Style: ${preset?.label ?? styleId}`);
  syncSelectionState();
  qa<HTMLElement>(ribbonBody, ".wc-style-card").forEach(card => {
    card.classList.toggle("is-active", card.dataset.value === styleId);
  });
}

function toggleSelectionPane(): void {
  state.selectionPane = !state.selectionPane;
  selectionPane.hidden = !state.selectionPane;
  if (!state.selectionPane) return;
  const list = q<HTMLElement>(selectionPane, "#selection-list");
  const blocks = qa<HTMLElement>(
    pagesEl,
    ".wc-page-body > p, .wc-page-body > h1, .wc-page-body > h2, .wc-page-body > ul, .wc-page-body > table"
  );
  list.innerHTML = blocks
    .map((block, index) => {
      const tag = block.tagName.toLowerCase();
      const text = block.textContent?.replace(/\s+/g, " ").trim().slice(0, 42) || tag;
      return `<div class="wc-selection-row" data-select-block="${index}">${icon(
        "viewMode",
        13
      )}<span class="wc-selection-row__text">${escapeHtml(text)}</span></div>`;
    })
    .join("");
  qa<HTMLElement>(list, "[data-select-block]").forEach(row => {
    row.addEventListener("click", () => {
      const block = blocks[Number(row.dataset.selectBlock)];
      block?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (block) flashElement(block);
    });
  });
}

function applyGridlines(on: boolean): void {
  state.gridlines = on;
  pagesEl.classList.toggle("wc-gridlines", on);
  renderRibbonBody();
}

function applyMarks(on: boolean): void {
  state.marks = on;
  appEl.classList.toggle("wc-marks", on);
  renderRibbonBody();
}

function toggleRead(): void {
  toggleReadMode();
}

function goToPage(pageNumber: number): void {
  const page = pagesEl.querySelector<HTMLElement>(`#wc-page-${pageNumber}`);
  page?.scrollIntoView({ behavior: "smooth", block: "start" });
  state.currentPage = pageNumber;
  statusPage.textContent = `Page ${pageNumber} of ${state.pageCount}`;
}

function resetDocument(kind: "blank" | "handbook" | "letter"): void {
  if (kind === "handbook") {
    state.comments = COMMENTS.map(comment => ({ ...comment }));
    state.activeComment = null;
    buildDocument();
  } else {
    state.comments = [];
    state.activeComment = null;
    pagesEl.innerHTML = pageMarkup(
      1,
      `<div class="wc-page-header"><span>${kind === "letter" ? "Alder Street Studio" : "Document1"}</span><span>${
        kind === "letter"
          ? new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : ""
      }</span></div><h1 class="wc-title" data-style="title">${
        kind === "letter" ? "Letter" : "Untitled document"
      }</h1><p>${kind === "letter" ? "Dear friend of the studio," : "Start typing your story here."}</p>`
    );
    state.pageCount = 1;
  }
  state.dirty = false;
  state.everEdited = false;
  state.tracking = false;
  appEl.classList.remove("wc-tracking");
  state.commentsOpen = false;
  appEl.classList.remove("wc-comments-open");
  state.theme = "studio";
  applyTheme("studio");
  state.zoom = 100;
  applyZoom(100);
  applyPageGeometry();
  renderRibbonBody();
  renderComments();
  renderNav();
  updateStatus();
  markSaved();
  toast(kind === "handbook" ? "Sample handbook opened" : "New document created", "success");
}

function fileSave(asCopy = false): void {
  markSaved();
  toast(asCopy ? "A copy was saved to Documents" : "Document saved to this PC", "success");
}

function copyText(text: string, message: string): void {
  if (!text) {
    toast("Nothing selected", "warn");
    return;
  }
  navigator.clipboard
    ?.writeText(text)
    .then(() => toast(message, "success"))
    .catch(() => toast("Clipboard access is blocked in this browser", "warn"));
}

function pasteText(): void {
  navigator.clipboard
    ?.readText()
    .then(text => {
      if (!text) {
        toast("Clipboard is empty", "warn");
        return;
      }
      insertAtCursor(escapeHtml(text).replace(/\n/g, "<br />"));
    })
    .catch(() => toast("Paste is blocked by the browser — use Ctrl+V", "warn"));
}

function acceptAllChanges(): void {
  qa<HTMLElement>(pagesEl, ".wc-ins").forEach(node => {
    const text = document.createTextNode(node.textContent ?? "");
    node.replaceWith(text);
  });
  qa<HTMLElement>(pagesEl, ".wc-del").forEach(node => node.remove());
  markDirty();
  scheduleContentRefresh();
  toast("All changes accepted", "success");
}

function rejectAllChanges(): void {
  qa<HTMLElement>(pagesEl, ".wc-del").forEach(node => {
    const text = document.createTextNode(node.textContent ?? "");
    node.replaceWith(text);
  });
  qa<HTMLElement>(pagesEl, ".wc-ins").forEach(node => node.remove());
  markDirty();
  scheduleContentRefresh();
  toast("All changes rejected", "success");
}

function cycleComment(direction: 1 | -1): void {
  if (state.comments.length === 0) {
    toast("No comments in this document", "warn");
    return;
  }
  if (!state.commentsOpen) toggleComments(true);
  const currentIndex = state.comments.findIndex(comment => comment.id === state.activeComment);
  const nextIndex = (currentIndex + direction + state.comments.length) % state.comments.length;
  selectComment(state.comments[Math.max(0, nextIndex)].id);
}

function currentParagraphText(): string {
  return currentBlock()?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function insertPageNumber(): void {
  state.headerFooter = true;
  applyHeaderFooter();
  qa<HTMLElement>(pagesEl, ".wc-page-footer span").forEach((span, index) => {
    span.textContent = String(index + 1);
  });
  toast("Page numbers are shown in the footer");
}

/* ------------------------------------------------------------------ commands */

function openCommandPopup(name: string, entries = name): void {
  const anchor =
    qa<HTMLElement>(app, `[data-command="${name}"]`).find(element => !element.closest(".wc-popup")) ?? ribbonBody;
  openPopup(anchor, entriesForPopup(entries));
}

function runCommand(command: string, value?: string): void {
  switch (command) {
    /* file & shell */
    case "file-backstage":
      openBackstage("home");
      break;
    case "backstage-close":
      closeBackstage();
      break;
    case "file-new":
      resetDocument("blank");
      closeBackstage();
      break;
    case "file-open":
      openBackstage("open");
      break;
    case "file-open-doc":
      closeBackstage();
      resetDocument("handbook");
      break;
    case "file-save":
      fileSave();
      break;
    case "file-save-as":
      fileSave(true);
      break;
    case "file-export":
      markSaved();
      toast("Exported “The Open Studio Handbook.pdf”", "success");
      break;
    case "file-print":
      window.print();
      break;
    case "share":
      openBackstage("share");
      break;
    case "share-copy": {
      copyText(window.location.href, "Sharing link copied");
      break;
    }
    case "toggle-autosave": {
      state.autosave = !state.autosave;
      const button = q<HTMLElement>(titlebar.root, '[data-command="toggle-autosave"]');
      button.setAttribute("aria-pressed", String(state.autosave));
      toast(`AutoSave ${state.autosave ? "on" : "off"}`);
      break;
    }
    case "undo":
      execInEditor(currentEditor(), "undo");
      markDirty();
      break;
    case "redo":
      execInEditor(currentEditor(), "redo");
      markDirty();
      break;
    case "discord":
      window.open("https://discord.gg/artcraft", "_blank", "noopener");
      break;
    case "account":
      openModal(
        "Account",
        `<div class="wc-about-hero"><div class="wc-about-logo">WU</div><div><strong>WordCraft User</strong><span>Free · Open source · Offline</span></div></div>
        <p>Signed in locally. Documents never leave this device in the demo build.</p>
        <div class="wc-stat-grid"><span>Plan</span><strong>Open source</strong><span>Sync</span><strong>Off</strong><span>Version</span><strong>0.19.1-demo</strong></div>`
      );
      break;

    /* formatting */
    case "bold":
      editorCommand("bold");
      break;
    case "italic":
      editorCommand("italic");
      break;
    case "underline":
      editorCommand("underline");
      break;
    case "strike":
      editorCommand("strikeThrough");
      break;
    case "subscript":
      editorCommand("subscript");
      break;
    case "superscript":
      editorCommand("superscript");
      break;
    case "bullets":
      editorCommand("insertUnorderedList");
      break;
    case "numbering":
      editorCommand("insertOrderedList");
      break;
    case "multilevel":
      editorCommand("insertUnorderedList");
      toast("Multilevel list applied");
      break;
    case "indent-increase":
      editorCommand("indent");
      break;
    case "indent-decrease":
      editorCommand("outdent");
      break;
    case "align-left":
      editorCommand("justifyLeft");
      break;
    case "align-center":
      editorCommand("justifyCenter");
      break;
    case "align-right":
      editorCommand("justifyRight");
      break;
    case "align-justify":
      editorCommand("justifyFull");
      break;
    case "set-line-spacing": {
      for (const block of selectedBlocksList()) block.style.lineHeight = value ?? "1.15";
      markDirty();
      toast(`Line spacing ${value ?? "1.15"}`);
      break;
    }
    case "space-before":
      for (const block of selectedBlocksList()) block.style.marginTop = "18px";
      markDirty();
      break;
    case "space-after":
      for (const block of selectedBlocksList()) block.style.marginBottom = "18px";
      markDirty();
      break;
    case "space-none":
      for (const block of selectedBlocksList()) block.style.marginBottom = "0";
      markDirty();
      break;
    case "set-shading":
      for (const block of selectedBlocksList()) {
        block.style.backgroundColor = value === "transparent" ? "" : value ?? "";
        block.style.padding = value === "transparent" ? "" : "3px 6px";
      }
      markDirty();
      break;
    case "set-color":
      if (applyInlineStyle(currentEditor(), { color: value ?? "" })) markDirty();
      break;
    case "set-highlight":
      if (applyInlineStyle(currentEditor(), { backgroundColor: value === "transparent" ? "transparent" : value ?? "" }))
        markDirty();
      break;
    case "more-colors":
      toast("Pick any color from the document palette (demo)");
      break;
    case "border-bottom":
      toggleBorder("Bottom");
      break;
    case "border-top":
      toggleBorder("Top");
      break;
    case "border-left":
      toggleBorder("Left");
      break;
    case "border-right":
      toggleBorder("Right");
      break;
    case "border-all":
      for (const block of selectedBlocksList()) block.classList.add("wc-bordered");
      markDirty();
      break;
    case "border-none":
      for (const block of selectedBlocksList()) {
        block.style.border = "";
        block.classList.remove("wc-bordered");
      }
      markDirty();
      break;
    case "sort": {
      const list = currentBlock()?.closest("ul, ol");
      if (!list) {
        toast("Place the cursor in a list first", "warn");
        break;
      }
      const items = Array.from(list.querySelectorAll("li")).sort((a, b) =>
        (a.textContent ?? "").localeCompare(b.textContent ?? "")
      );
      items.forEach(item => list.appendChild(item));
      markDirty();
      toast("List sorted A–Z");
      break;
    }
    case "cut": {
      const editor = currentEditor();
      copyText(selectionText(), "Cut to clipboard");
      if (selectionInEditor(editor)) {
        document.execCommand("delete");
        markDirty();
      }
      break;
    }
    case "copy":
      copyText(selectionText(), "Copied to clipboard");
      break;
    case "paste":
      pasteText();
      break;
    case "format-painter": {
      const block = currentBlock();
      if (!block) {
        toast("Place the cursor in text first", "warn");
        break;
      }
      const style = window.getComputedStyle(block);
      state.painterStyle = {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        color: style.color,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle
      };
      state.painterActive = true;
      appEl.classList.add("wc-painter");
      toast("Format Painter armed — select text to apply");
      break;
    }
    case "change-case": {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        toast("Select text to change case", "warn");
        break;
      }
      const range = selection.getRangeAt(0);
      const text = range.toString();
      const next =
        text === text.toUpperCase()
          ? text.toLowerCase()
          : text === text.toLowerCase()
          ? toTitleCase(text)
          : text.toUpperCase();
      range.deleteContents();
      const node = document.createTextNode(next);
      range.insertNode(node);
      selectRange(range);
      markDirty();
      break;
    }
    case "clear-format": {
      const editor = currentEditor();
      execInEditor(editor, "removeFormat");
      for (const block of selectedBlocksList()) {
        block.removeAttribute("data-style");
        block.removeAttribute("style");
      }
      markDirty();
      toast("Formatting cleared");
      break;
    }
    case "font-color":
      openCommandPopup("font-color");
      break;
    case "highlight-color":
      openCommandPopup("highlight-color");
      break;
    case "line-spacing":
      openCommandPopup("line-spacing");
      break;
    case "shading":
      openCommandPopup("shading");
      break;
    case "borders":
      openCommandPopup("borders");
      break;
    case "themes":
      openCommandPopup("themes");
      break;
    case "theme-colors":
      openCommandPopup("theme-colors");
      break;
    case "theme-fonts":
      openCommandPopup("theme-fonts");
      break;
    case "theme-spacing":
      openCommandPopup("paragraph-spacing");
      break;
    case "margins":
      openCommandPopup("margins");
      break;
    case "orientation":
      openCommandPopup("orientation");
      break;
    case "page-size":
      openCommandPopup("page-size");
      break;
    case "columns":
      openCommandPopup("columns");
      break;
    case "breaks":
      openCommandPopup("breaks");
      break;
    case "watermark":
      openCommandPopup("watermark");
      break;
    case "page-color":
      openCommandPopup("page-color");
      break;
    case "header":
      openCommandPopup("header");
      break;
    case "page-number":
      openCommandPopup("page-number");
      break;
    case "position":
      openCommandPopup("position");
      break;
    case "paragraph-indent":
      openCommandPopup("paragraph-indent");
      break;
    case "paragraph-spacing":
      openCommandPopup("paragraph-spacing");
      break;
    case "font-grow":
    case "font-shrink": {
      const node = window.getSelection()?.anchorNode ?? null;
      const element = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement;
      const current = element ? parseFloat(window.getComputedStyle(element).fontSize) : 15.2;
      const next = command === "font-grow" ? current * 1.12 : current / 1.12;
      if (applyInlineStyle(currentEditor(), { fontSize: `${Math.round(next * 10) / 10}px` })) markDirty();
      break;
    }
    case "set-font":
      if (value && applyInlineStyle(currentEditor(), { fontFamily: value })) {
        const label = q<HTMLElement>(app, "#font-family-label");
        label.textContent = value;
        markDirty();
      }
      break;
    case "set-font-size":
      if (value) {
        if (applyInlineStyle(currentEditor(), { fontSize: `${(Number(value) * 4) / 3}px` })) {
          q<HTMLElement>(app, "#font-size-label").textContent = value;
          markDirty();
        }
      }
      break;
    case "apply-style":
      applyStyleByName(value ?? "normal");
      break;
    case "select-all": {
      const editor = currentEditor();
      editor.focus();
      const range = document.createRange();
      range.selectNodeContents(editor);
      selectRange(range);
      break;
    }
    case "find":
      openFind("find");
      break;
    case "replace":
      openFind("replace");
      break;

    /* insert */
    case "insert-cover": {
      const existing = pagesEl.querySelector(".wc-cover");
      if (existing) {
        existing.remove();
        toast("Cover page removed");
        break;
      }
      const header = pagesEl.querySelector(".wc-page-body .wc-page-header");
      header?.insertAdjacentHTML(
        "afterend",
        `<div class="wc-cover"><p>${DOC_TITLE}</p><h2>Open Studio Handbook</h2><p>Spring edition · Alder Street Collective</p><hr /><p>Compiled by the membership, 2026</p></div>`
      );
      markDirty();
      toast("Cover page added", "success");
      break;
    }
    case "insert-blank-page":
    case "insert-page-break":
      addPage();
      toast("Page added");
      break;
    case "insert-table":
      insertBlock(
        `<table class="wc-table"><thead><tr><th>Item</th><th>Owner</th><th>Notes</th></tr></thead><tbody><tr><td>Example equipment</td><td>Studio</td><td>Add details</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>`
      );
      toast("Table inserted");
      break;
    case "insert-picture":
      insertBlock(
        `<figure class="wc-figure"><div class="wc-figure__art"></div><figcaption>Plate 1 — North window, Thursday evening.</figcaption></figure>`
      );
      toast("Picture inserted", "success");
      break;
    case "insert-shape":
      insertBlock(`<div class="wc-shape">Rounded Rectangle</div>`);
      break;
    case "insert-smartart":
      insertBlock(
        `<div class="wc-shape" style="width:100%;height:120px;background:#eef3f7;border-color:#b9c6ce;color:#215c78;display:flex;gap:12px;align-items:center;justify-content:center"><span>Plan</span><span>→</span><span>Make</span><span>→</span><span>Share</span></div>`
      );
      break;
    case "insert-chart":
      insertBlock(
        `<figure class="wc-figure"><svg viewBox="0 0 320 140" width="100%" height="140" role="img" aria-label="Bar chart"><line x1="24" y1="120" x2="300" y2="120" stroke="#b9b6b2"/><rect x="48" y="66" width="36" height="54" fill="#215c78"/><rect x="112" y="40" width="36" height="80" fill="#4d87a3"/><rect x="176" y="82" width="36" height="38" fill="#7aa8bd"/><rect x="240" y="24" width="36" height="96" fill="#215c78"/><text x="66" y="134" font-size="9" text-anchor="middle" fill="#777">Q1</text><text x="130" y="134" font-size="9" text-anchor="middle" fill="#777">Q2</text><text x="194" y="134" font-size="9" text-anchor="middle" fill="#777">Q3</text><text x="258" y="134" font-size="9" text-anchor="middle" fill="#777">Q4</text></svg><figcaption>Membership by quarter</figcaption></figure>`
      );
      break;
    case "insert-link":
      insertAtCursor(`<a href="#" data-link="studio-notes">studio notes</a>`);
      toast("Link inserted");
      break;
    case "insert-bookmark":
      insertAtCursor(`<span class="wc-bookmark">alder-street</span>`);
      toast("Bookmark added");
      break;
    case "insert-crossref":
      insertAtCursor(`<span class="wc-crossref">see “Shared equipment”</span>`);
      break;
    case "insert-comment":
      startComment();
      break;
    case "insert-header":
      state.headerFooter = true;
      applyHeaderFooter();
      toast("Header shown — double-click to edit (demo)");
      break;
    case "insert-footer":
      state.headerFooter = true;
      applyHeaderFooter();
      toast("Footer shown");
      break;
    case "insert-page-number":
      insertPageNumber();
      break;
    case "insert-page-number-top":
      toast("Page number added to header");
      break;
    case "remove-page-numbers":
      state.headerFooter = false;
      applyHeaderFooter();
      break;
    case "insert-text-box":
      insertBlock(
        `<div class="wc-textbox" contenteditable="false">“A shared room puts your work next to work you would never have seen otherwise.”</div>`
      );
      toast("Text box inserted");
      break;
    case "quick-parts":
      insertBlock(`<p><strong>Signed off — Studio committee</strong><br />Approved at the March meeting.</p>`);
      break;
    case "word-art":
      insertAtCursor(`<span class="wc-wordart">Open Studio</span>`);
      break;
    case "drop-cap": {
      const block = currentBlock();
      block?.classList.toggle("wc-dropcap");
      markDirty();
      break;
    }
    case "insert-equation":
      insertAtCursor(`<span class="wc-equation">E = mc²</span>`);
      break;
    case "insert-symbol":
      insertAtCursor("€");
      break;

    /* draw */
    case "draw-pen":
    case "draw-highlighter":
    case "draw-eraser":
    case "draw-lasso": {
      const tool = command.replace("draw-", "");
      state.drawTool = state.drawTool === tool ? null : tool;
      appEl.classList.toggle("wc-drawing", Boolean(state.drawTool));
      sizeInkLayer();
      qa<HTMLElement>(ribbonBody, '[data-command^="draw-"]').forEach(button => {
        button.classList.toggle("is-active", button.dataset.command === `draw-${state.drawTool}`);
      });
      toast(
        state.drawTool ? `${tool[0].toUpperCase()}${tool.slice(1)} tool active — draw on the page` : "Ink tool closed"
      );
      break;
    }
    case "draw-shape":
      toast("Ink to Shape: strokes are converted to a shape (demo)");
      break;
    case "draw-math":
      toast("Ink to Math: handwriting is converted to an equation (demo)");
      break;
    case "draw-replay":
      qa<SVGPathElement>(inkSvg(), "path").forEach(path => {
        path.style.transition = "opacity .4s ease";
        path.style.opacity = "0";
        window.setTimeout(() => (path.style.opacity = ""), 500);
      });
      toast("Ink replay");
      break;
    case "draw-close":
      state.drawTool = null;
      appEl.classList.remove("wc-drawing");
      renderRibbonBody();
      break;

    /* design */
    case "set-theme":
      applyTheme(value ?? "studio");
      toast(`Theme: ${DOC_THEMES.find(theme => theme.id === value)?.label ?? value}`);
      break;
    case "set-accent":
      appEl.style.setProperty("--doc-accent", THEME_ACCENTS[value ?? "blue"] ?? THEME_ACCENTS.blue);
      toast("Theme colors updated");
      break;
    case "set-theme-font":
      applyTheme(value ?? "studio");
      break;
    case "theme-effects":
      toast("Theme effects applied (demo)");
      break;
    case "set-watermark":
      applyWatermark(value ?? "");
      break;
    case "set-page-color": {
      applyPageColorById(value ?? "white");
      break;
    }
    case "page-borders":
      state.pageBorders = !state.pageBorders;
      pagesEl.classList.toggle("wc-page-borders", state.pageBorders);
      toast(`Page borders ${state.pageBorders ? "on" : "off"}`);
      break;
    case "close-header-footer":
      toast("Header and footer closed");
      break;

    /* layout */
    case "set-margins":
      applyMargins(value ?? "normal");
      break;
    case "custom-margins":
      openModal(
        "Custom Margins",
        `<div class="wc-field"><label>Top (px)</label><input id="margin-top" type="number" value="76" /></div>
         <div class="wc-field"><label>Left (px)</label><input id="margin-left" type="number" value="88" /></div>`,
        {
          footer:
            '<button type="button" data-modal-close>Cancel</button><button type="button" class="wc-primary" data-apply-margins>Apply</button>',
          onMount: (modal, close) => {
            q<HTMLElement>(modal, "[data-apply-margins]").addEventListener("click", () => {
              const top = Number(q<HTMLInputElement>(modal, "#margin-top").value) || 76;
              const left = Number(q<HTMLInputElement>(modal, "#margin-left").value) || 88;
              appEl.style.setProperty("--page-pad-y", `${top}px`);
              appEl.style.setProperty("--page-pad-x", `${left}px`);
              renderRuler();
              positionComments();
              close();
              toast("Custom margins applied");
            });
          }
        }
      );
      break;
    case "set-orientation":
      state.orientation = value === "landscape" ? "landscape" : "portrait";
      applyPageGeometry();
      renderRibbonBody();
      toast(`Orientation: ${state.orientation}`);
      break;
    case "set-page-size":
      state.pageSize = (value as "letter" | "a4" | "legal") ?? "letter";
      applyPageGeometry();
      renderRibbonBody();
      toast(`Paper size: ${state.pageSize.toUpperCase()}`);
      break;
    case "custom-page-size":
      toast("Page size applied: Letter");
      break;
    case "set-columns":
      state.columns = Number(value ?? "1");
      applyColumns();
      renderRibbonBody();
      toast(`${state.columns} column${state.columns === 1 ? "" : "s"}`);
      break;
    case "custom-columns":
      toast("Custom columns are not available in this demo");
      break;
    case "line-numbers":
      state.lineNumbers = !state.lineNumbers;
      applyLineNumbers();
      renderRibbonBody();
      toast(`Line numbers ${state.lineNumbers ? "on" : "off"}`);
      break;
    case "hyphenation":
      state.hyphenation = !state.hyphenation;
      pagesEl.classList.toggle("wc-hyphenation", state.hyphenation);
      toast(`Hyphenation ${state.hyphenation ? "on" : "off"}`);
      break;
    case "insert-column-break":
      toast("Column break inserted");
      break;
    case "insert-text-wrapping":
      toast("Text wrapping break inserted");
      break;
    case "insert-section-break":
      addPage();
      toast("Section break (next page)");
      break;
    case "insert-continuous-break": {
      const block = currentBlock();
      block?.insertAdjacentHTML("afterend", "<hr />");
      markDirty();
      break;
    }
    case "first-line-indent":
      for (const block of selectedBlocksList()) block.style.textIndent = "2em";
      markDirty();
      break;
    case "hanging-indent":
      for (const block of selectedBlocksList()) block.style.textIndent = "-2em";
      markDirty();
      break;
    case "para-spacing-tight":
      appEl.style.setProperty("--doc-para-space", "6px");
      toast("Paragraph spacing: Tight");
      break;
    case "para-spacing-normal":
      appEl.style.setProperty("--doc-para-space", "12px");
      toast("Paragraph spacing: Normal");
      break;
    case "para-spacing-relaxed":
      appEl.style.setProperty("--doc-para-space", "20px");
      toast("Paragraph spacing: Relaxed");
      break;
    case "position-inline":
      for (const block of selectedBlocksList()) block.style.float = "";
      toast("Position: In line with text");
      break;
    case "position-left":
      for (const block of selectedBlocksList()) block.style.float = "left";
      toast("Position: Float left");
      break;
    case "position-right":
      for (const block of selectedBlocksList()) block.style.float = "right";
      toast("Position: Float right");
      break;
    case "position-more":
      toast("More layout options (demo)");
      break;
    case "wrap-text":
      toast("Wrap text: Square");
      break;
    case "selection-pane":
      toggleSelectionPane();
      break;
    case "ruler":
      setRuler(!state.ruler);
      toast(`Ruler ${state.ruler ? "shown" : "hidden"}`);
      break;

    /* references */
    case "insert-toc":
      applyTableOfContents();
      break;
    case "update-toc":
      applyTableOfContents();
      break;
    case "remove-toc":
      pagesEl.querySelector("[data-toc]")?.remove();
      markDirty();
      toast("Table of contents removed");
      break;
    case "add-toc-text":
      applyStyleByName("heading1");
      break;
    case "insert-table-of-figures":
      insertBlock(
        `<div class="wc-toc" data-toc><div class="wc-toc__title">Figures</div><div class="wc-toc__row"><span>Plate 1 — North window, Thursday evening.</span><span class="wc-toc__dots"></span><span>2</span></div><div class="wc-toc__row"><span>Membership by quarter</span><span class="wc-toc__dots"></span><span>2</span></div></div>`
      );
      break;
    case "insert-footnote":
      insertFootnote();
      break;
    case "next-footnote": {
      const footnotes = qa<HTMLElement>(pagesEl, ".wc-footnote");
      if (footnotes.length === 0) {
        toast("No footnotes yet — choose Insert Footnote", "warn");
        break;
      }
      footnotes[0].scrollIntoView({ behavior: "smooth", block: "center" });
      flashElement(footnotes[0]);
      break;
    }
    case "show-notes":
      state.footnotesVisible = !state.footnotesVisible;
      pagesEl.classList.toggle("wc-footnotes-hidden", !state.footnotesVisible);
      toast(`Footnotes ${state.footnotesVisible ? "shown" : "hidden"}`);
      break;
    case "researcher":
      openModal(
        "Researcher",
        `<div class="wc-field"><label>Search</label><input id="research-query" type="text" value="shared studio membership models" /></div>
         <ul class="wc-review-list"><li>${icon(
           "file",
           14
         )}<div><strong>Shared studios and the tools we keep</strong><span>Okafor, 2026 · Alder Street Press</span></div></li>
         <li>${icon(
           "file",
           14
         )}<div><strong>The membership model</strong><span>Patel, 2025 · Open Studio Review</span></div></li>
         <li>${icon(
           "file",
           14
         )}<div><strong>Notes on collective equipment</strong><span>Reyes, 2024 · Making Together</span></div></li></ul>`,
        {
          footer: '<button type="button" class="wc-primary" data-research-insert>Insert citation</button>',
          onMount: (modal, close) => {
            q<HTMLElement>(modal, "[data-research-insert]").addEventListener("click", () => {
              insertAtCursor("(Okafor, 2026)");
              close();
              toast("Citation inserted", "success");
            });
          }
        }
      );
      break;
    case "insert-citation":
      openPopup(
        popupAnchorFor(q<HTMLElement>(ribbonBody, '[data-command="insert-citation"]') ?? ribbonBody),
        entriesForPopup("insert-citation")
      );
      break;
    case "cite": {
      const index = Number(value ?? "0");
      const short = ["(Okafor, 2026)", "(Patel, 2025)", "(Reyes, 2024)"][index] ?? "(Okafor, 2026)";
      insertAtCursor(short);
      toast("Citation inserted", "success");
      break;
    }
    case "manage-sources":
      openModal(
        "Manage Sources",
        `<ul class="wc-review-list">${CITATIONS.map(
          citation =>
            `<li>${icon("citation", 14)}<div><strong>${escapeHtml(
              citation
            )}</strong><span>Bibliography source</span></div></li>`
        ).join("")}</ul>`
      );
      break;
    case "citation-style":
      openPopup(
        popupAnchorFor(q<HTMLElement>(ribbonBody, '[data-command="citation-style"]') ?? ribbonBody),
        entriesForPopup("citation-style")
      );
      break;
    case "set-editing":
      setEditing((value as EditingMode) ?? "Editing");
      break;
    case "set-citation-style":
      state.citationStyle = value ?? "APA";
      renderRibbonBody();
      toast(`Citation style: ${state.citationStyle}`);
      break;
    case "insert-bibliography":
      insertBibliography();
      break;
    case "insert-caption": {
      const count = qa<HTMLElement>(pagesEl, ".wc-caption").length + 1;
      insertBlock(`<p class="wc-caption"><strong>Figure ${count}.</strong> Add a short description.</p>`);
      toast("Caption inserted");
      break;
    }
    case "mark-index":
      toast("Index entry marked");
      break;
    case "update-index":
      toast("Index updated");
      break;
    case "mark-authority":
      toast("Citation marked for the table of authorities");
      break;
    case "update-authorities":
      toast("Table of authorities updated");
      break;

    /* mailings */
    case "mail-envelopes":
      openModal(
        "Envelopes",
        `<div class="wc-field"><label>Delivery address</label><input type="text" value="Alder Street Collective, 14 Alder Street" /></div>
         <div class="wc-field"><label>Return address</label><input type="text" value="The Open Studio Handbook" /></div>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Print envelope</button>' }
      );
      break;
    case "mail-labels":
      openModal(
        "Labels",
        `<p>Full page of the same label · 30 per page · Letter</p><div class="wc-field"><label>Address</label><input type="text" value="Alder Street Collective" /></div>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Print labels</button>' }
      );
      break;
    case "start-mail-merge":
      openPopup(
        popupAnchorFor(q<HTMLElement>(ribbonBody, '[data-command="start-mail-merge"]') ?? ribbonBody),
        entriesForPopup("start-mail-merge")
      );
      break;
    case "mail-letters":
    case "mail-email":
      state.mergeFields = true;
      toast(`Mail merge started: ${command === "mail-email" ? "Email messages" : "Letters"}`);
      break;
    case "select-recipients":
      openModal(
        "Select Recipients",
        `<p>Use an existing list of studio members. 4 recipients found.</p>
         <table class="wc-recipient-table"><thead><tr><th>Name</th><th>Email</th><th>Booked</th></tr></thead><tbody>
         <tr><td>Mara Okafor</td><td>mara@alder.studio</td><td>Etching press</td></tr>
         <tr><td>Theo Patel</td><td>theo@alder.studio</td><td>Kiln</td></tr>
         <tr><td>Ines Reyes</td><td>ines@alder.studio</td><td>Large-format printer</td></tr>
         <tr><td>Jonah Bell</td><td>jonah@alder.studio</td><td>Light table</td></tr>
         </tbody></table>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Use list</button>' }
      );
      break;
    case "edit-recipients":
      openModal(
        "Edit Recipient List",
        `<table class="wc-recipient-table"><thead><tr><th>☑</th><th>Name</th><th>Company</th><th>City</th></tr></thead><tbody>
         <tr><td>☑</td><td>Mara Okafor</td><td>Alder Street</td><td>North window</td></tr>
         <tr><td>☑</td><td>Theo Patel</td><td>Yard shed</td><td>Back room</td></tr>
         <tr><td>☐</td><td>Ines Reyes</td><td>Office</td><td>Upstairs</td></tr>
         </tbody></table>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>OK</button>' }
      );
      break;
    case "highlight-merge-fields":
      state.mergeFields = !state.mergeFields;
      appEl.classList.toggle("wc-merge-highlight", state.mergeFields);
      toast(`Merge fields ${state.mergeFields ? "highlighted" : "normal"}`);
      break;
    case "insert-merge-field":
      openPopup(
        popupAnchorFor(q<HTMLElement>(ribbonBody, '[data-command="insert-merge-field"]') ?? ribbonBody),
        entriesForPopup("insert-merge-field")
      );
      break;
    case "insert-field":
      insertAtCursor(`<span class="wc-field-highlight">«${escapeHtml(value ?? "Field")}»</span>`);
      break;
    case "address-block":
      insertAtCursor(`<span class="wc-field-highlight">«Address Block»</span>`);
      break;
    case "greeting-line":
      insertAtCursor(`<span class="wc-field-highlight">«Greeting Line»</span>`);
      break;
    case "preview-results":
      qa<HTMLElement>(pagesEl, ".wc-field-highlight").forEach(field => {
        if (field.dataset.preview === undefined) {
          field.dataset.preview = field.textContent ?? "";
          field.textContent = (field.textContent ?? "").replace(/«|»/g, "");
          field.textContent = `Mara Okafor${field.textContent ? ` · ${field.textContent}` : ""}`;
        } else {
          field.textContent = field.dataset.preview;
          delete field.dataset.preview;
        }
      });
      toast("Preview results toggled");
      break;
    case "finish-merge":
      openPopup(
        popupAnchorFor(q<HTMLElement>(ribbonBody, '[data-command="finish-merge"]') ?? ribbonBody),
        entriesForPopup("finish-merge")
      );
      break;
    case "finish-print":
      toast("4 letters sent to the printer", "success");
      break;
    case "finish-email":
      toast("4 email messages sent", "success");
      break;
    case "finish-edit":
      toast("Merged document created");
      break;

    /* review */
    case "spelling":
      openModal(
        "Spelling & Grammar",
        `<p>3 suggestions found in this document.</p>
         <ul class="wc-review-list">
           <li>${icon(
             "spelling",
             14
           )}<div><strong>“letterpress regulars”</strong><span>Consider “letterpress operators” — studio glossary.</span></div></li>
           <li>${icon(
             "spelling",
             14
           )}<div><strong>“cross-talk”</strong><span>Hyphenation is consistent with the style guide.</span></div></li>
           <li>${icon(
             "spelling",
             14
           )}<div><strong>“unlabelled”</strong><span>US English prefers “unlabeled”.</span></div></li>
         </ul>`,
        {
          footer:
            '<button type="button" class="wc-primary" data-modal-close>Ignore All</button><button type="button" data-modal-close>Review</button>'
        }
      );
      break;
    case "thesaurus": {
      const word = selectionText() || "studio";
      openModal(
        "Thesaurus",
        `<div class="wc-comment-quote">${escapeHtml(word)}</div>
         <h3>Synonyms</h3><p>workshop · atelier · collective · makerspace · workroom</p>
         <h3>Related</h3><p>shared practice, community studio, open workshop</p>`
      );
      break;
    }
    case "word-count": {
      const stats = documentStats();
      openModal(
        "Word Count",
        `<div class="wc-stat-grid"><span>Pages</span><strong>${state.pageCount}</strong><span>Words</span><strong>${
          stats.words
        }</strong><span>Characters (no spaces)</span><strong>${
          stats.characters
        }</strong><span>Paragraphs</span><strong>${stats.paragraphs}</strong><span>Lines</span><strong>${Math.round(
          stats.words / 9
        )}</strong></div>
         <p class="wc-comment-quote">Include textboxes, footnotes and endnotes.</p>`
      );
      break;
    }
    case "read-aloud": {
      const text = selectionText() || currentParagraphText();
      if (!text) {
        toast("Select text to read aloud", "warn");
        break;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        toast("Reading aloud…");
      } else {
        toast("Read Aloud is unavailable in this browser", "warn");
      }
      break;
    }
    case "accessibility":
      openModal(
        "Accessibility Checker",
        `<ul class="wc-review-list">
          <li>${icon(
            "check",
            14
          )}<div><strong>All pictures have alt text</strong><span>1 decorative image marked.</span></div></li>
          <li>${icon(
            "check",
            14
          )}<div><strong>Contrast is sufficient</strong><span>Body text 12.4:1 on paper.</span></div></li>
          <li>${icon(
            "info",
            14
          )}<div><strong>Table header row repeats</strong><span>Set the header row to repeat on page breaks.</span></div></li>
         </ul>`
      );
      break;
    case "delete-comment": {
      const id = state.activeComment ?? state.comments[state.comments.length - 1]?.id;
      if (!id) {
        toast("No comment selected", "warn");
        break;
      }
      deleteComment(id);
      break;
    }
    case "prev-comment":
      cycleComment(-1);
      break;
    case "next-comment":
      cycleComment(1);
      break;
    case "show-comments":
      toggleComments();
      break;
    case "focus-mode":
      toggleFocusMode();
      break;
    case "track-changes":
      setTracking(!state.tracking);
      break;
    case "markup":
      state.markup = !state.markup;
      appEl.classList.toggle("wc-markup-off", !state.markup);
      toast(`Markup ${state.markup ? "shown" : "hidden"}`);
      break;
    case "reviewing-pane":
      toggleComments(true);
      break;
    case "accept-change": {
      const result = acceptChange(pagesEl);
      if (result) {
        markDirty();
        toast(result, "success");
      } else toast("No tracked change to accept", "warn");
      break;
    }
    case "reject-change": {
      const result = rejectChange(pagesEl);
      if (result) {
        markDirty();
        toast(result);
      } else toast("No tracked change to reject", "warn");
      break;
    }
    case "accept-all":
      acceptAllChanges();
      break;
    case "reject-all":
      rejectAllChanges();
      break;
    case "compare-documents":
      openModal(
        "Compare Documents",
        `<p>Compare this document with <strong>Membership agreement.docx</strong>.</p>
         <ul class="wc-review-list"><li>${icon(
           "addText",
           14
         )}<div><strong>2 insertions</strong><span>“forty”, “quiet hours”</span></div></li><li>${icon(
          "close",
          14
        )}<div><strong>1 deletion</strong><span>“thirty”</span></div></li></ul>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Compare</button>' }
      );
      break;
    case "block-authors":
      state.protectedView = !state.protectedView;
      updateStatus();
      toast(state.protectedView ? "Authors are blocked from editing" : "Block authors removed");
      break;
    case "restrict-editing":
      state.protectedView = !state.protectedView;
      updateStatus();
      toast(state.protectedView ? "Editing restricted to comments" : "Editing restriction removed");
      break;

    /* view */
    case "read-mode":
      toggleRead();
      break;
    case "print-layout":
      state.webLayout = false;
      state.outlineMode = false;
      state.draftView = false;
      appEl.classList.remove("wc-web-layout", "wc-outline-mode", "wc-draft-view");
      if (state.readingMode) toggleRead();
      renderRibbonBody();
      toast("Print Layout");
      break;
    case "web-layout":
      state.webLayout = !state.webLayout;
      appEl.classList.toggle("wc-web-layout", state.webLayout);
      toast(state.webLayout ? "Web Layout" : "Print Layout");
      break;
    case "outline-view":
      state.outlineMode = !state.outlineMode;
      appEl.classList.toggle("wc-outline-mode", state.outlineMode);
      if (state.outlineMode) setNavOpen(true);
      toast(state.outlineMode ? "Outline view" : "Print Layout");
      break;
    case "draft-view":
      state.draftView = !state.draftView;
      appEl.classList.toggle("wc-draft-view", state.draftView);
      toast(state.draftView ? "Draft view" : "Print Layout");
      break;
    case "navigation-pane":
      setNavOpen(!state.navOpen);
      break;
    case "gridlines":
      applyGridlines(!state.gridlines);
      break;
    case "formatting-marks":
      applyMarks(!state.marks);
      break;
    case "dark-mode":
      state.dark = !state.dark;
      appEl.classList.toggle("wc-dark", state.dark);
      document.documentElement.classList.toggle("wc-dark", state.dark);
      renderRibbonBody();
      toast(state.dark ? "Dark mode" : "Light mode");
      break;
    case "zoom-in":
      applyZoom(state.zoom + 10);
      break;
    case "zoom-out":
      applyZoom(state.zoom - 10);
      break;
    case "zoom-set":
      applyZoom(Number(value ?? "100"));
      break;
    case "zoom-one-page":
      applyZoom(78);
      break;
    case "zoom-multiple-pages":
      applyZoom(62);
      break;
    case "zoom-page-width":
      zoomFitWidth();
      break;
    case "zoom-dialog":
      openPopup(popupAnchorFor(statusZoom), entriesForPopup("zoom"));
      break;
    case "new-window":
      window.open(window.location.href, "_blank", "noopener");
      break;
    case "arrange-all":
      toast("Windows arranged side by side (demo)");
      break;
    case "split-window":
      toast("Split view toggled (demo)");
      break;
    case "macros":
      openModal(
        "Macros",
        `<p>Recorded commands for this document.</p><div class="wc-field"><label>Macro name</label><input type="text" value="ApplyStudioStyle" /></div><p class="wc-comment-quote">Applies Heading 1, studio teal, 1.15 line spacing.</p>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Run</button>' }
      );
      break;

    /* help */
    case "help-topics":
      openModal(
        "WordCraft Help",
        `<h3>Getting started</h3><p>Use the ribbon to format text, insert tables and references, and review changes. Everything runs offline in this demo.</p>
         <h3>Popular topics</h3><ul class="wc-review-list"><li>${icon(
           "file",
           14
         )}<div><strong>Track changes and comments</strong><span>Review tab</span></div></li><li>${icon(
          "file",
          14
        )}<div><strong>Table of contents</strong><span>References tab</span></div></li><li>${icon(
          "file",
          14
        )}<div><strong>Mail merge</strong><span>Mailings tab</span></div></li></ul>`
      );
      break;
    case "search-help":
      openPalette("help");
      break;
    case "contact-support":
      openModal(
        "Contact Support",
        `<p>The studio help desk answers within one working day.</p><div class="wc-field"><label>Subject</label><input type="text" value="Question about references" /></div><div class="wc-field"><label>Message</label><textarea rows="3" style="border:1px solid var(--wc-border-strong);border-radius:3px;padding:6px">How do I update a bibliography?</textarea></div>`,
        { footer: '<button type="button" class="wc-primary" data-modal-close>Send</button>' }
      );
      break;
    case "whats-new":
      openModal(
        "What's New",
        `<h3>WordCraft 0.19.1</h3><ul class="wc-review-list"><li>${icon(
          "check",
          14
        )}<div><strong>Command palette</strong><span>Press Ctrl+K anywhere.</span></div></li><li>${icon(
          "check",
          14
        )}<div><strong>Faster layout</strong><span>Typing in a 188-page document re-lays out in ~1.4 ms.</span></div></li><li>${icon(
          "check",
          14
        )}<div><strong>Agent-ready</strong><span>389 discrete commands plus a JSON control channel.</span></div></li></ul>`
      );
      break;
    case "shortcuts":
      openModal(
        "Keyboard Shortcuts",
        `<table class="wc-shortcut-table">
          <tr><td>Save</td><td>Ctrl+S</td></tr>
          <tr><td>Find</td><td>Ctrl+F</td></tr>
          <tr><td>Replace</td><td>Ctrl+H</td></tr>
          <tr><td>Command palette</td><td>Ctrl+K</td></tr>
          <tr><td>Bold</td><td>Ctrl+B</td></tr>
          <tr><td>Italic</td><td>Ctrl+I</td></tr>
          <tr><td>Underline</td><td>Ctrl+U</td></tr>
          <tr><td>Add comment</td><td>Ctrl+Alt+M</td></tr>
          <tr><td>Indent list item</td><td>Tab</td></tr>
        </table>`
      );
      break;
    case "about":
      openModal(
        "About WordCraft",
        `<div class="wc-about-hero"><div class="wc-about-logo">W</div><div><strong>WordCraft</strong><span>A fast, open-source word processor · demo build</span></div></div>
         <p>This LiteGUI demo rebuilds the WordCraft workspace in the browser: ribbon, styles, track changes, comments, references and mail merge — no frameworks, just DOM and TypeScript.</p>
         <div class="wc-stat-grid"><span>Version</span><strong>0.19.1-demo</strong><span>Engine</span><strong>LiteGUI components</strong><span>Documents</span><strong>2 pages · ${
           documentStats().words
         } words</strong></div>`
      );
      break;

    /* document templates & misc */
    case "template-blank":
      resetDocument("blank");
      closeBackstage();
      break;
    case "template-handbook":
      resetDocument("handbook");
      closeBackstage();
      break;
    case "template-letter":
      resetDocument("letter");
      closeBackstage();
      break;
    case "go-page":
      goToPage(Number(value ?? "1"));
      break;
    case "custom-margins-done":
      break;
    case "new-style":
      toast("Style created from the current selection");
      break;
    case "close":
    case "backstage-close-command":
      closeBackstage();
      break;
    default:
      toast(`Command “${command}” is not wired in this demo`);
      break;
  }
}

function editorCommand(command: string): void {
  if (!execInEditor(currentEditor(), command)) {
    toast("Place the cursor in the document first", "warn");
    return;
  }
  markDirty();
  syncSelectionState();
}

function selectedBlocksList(): HTMLElement[] {
  const selection = window.getSelection();
  const editor = currentEditor();
  if (!selection || selection.rangeCount === 0 || !selectionInEditor(editor)) {
    const block = currentBlock();
    return block ? [block] : [];
  }
  const range = selection.getRangeAt(0);
  if (range.collapsed) {
    const block = currentBlock();
    return block ? [block] : [];
  }
  const blocks: HTMLElement[] = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      const element = node as HTMLElement;
      if (!/^(P|LI|H1|H2|H3|BLOCKQUOTE|TD|TH)$/.test(element.tagName)) return NodeFilter.FILTER_SKIP;
      return range.intersectsNode(element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) blocks.push(walker.currentNode as HTMLElement);
  if (blocks.length === 0) {
    const block = currentBlock();
    if (block) blocks.push(block);
  }
  return blocks;
}

function toggleBorder(side: "Top" | "Bottom" | "Left" | "Right"): void {
  const property = `border${side}` as "borderTop" | "borderBottom" | "borderLeft" | "borderRight";
  for (const block of selectedBlocksList()) {
    const current = block.style[property];
    block.style[property] = current ? "" : "1px solid #9fb6c4";
  }
  markDirty();
}

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/* initial selection state */
syncSelectionState();
