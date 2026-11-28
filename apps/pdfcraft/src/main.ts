import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { cloneDoc, createFieldNotes, createShowcase, nextId, pageLabel, rotatePage } from "./document";
import { buildPdf, downloadPdf, type ExportPage } from "./export";
import { icon, type IconName } from "./icons";
import { PAGE_H, PAGE_W, renderPageContent } from "./pages";
import {
  clearCurrentHit,
  clearSearchHighlights,
  highlightInPage,
  scrollToHit,
  selectionInfo,
  wrapQuote,
  type SearchHit
} from "./search";
import type { Comment, CommentKind, FieldDef, HistoryEntry, Page, PageSnapshot, PdfDoc } from "./types";
import {
  closePopups,
  debounce,
  escapeHTML,
  nowStamp,
  openDialog,
  openPopup,
  openPopupAt,
  q,
  shortDate,
  toast,
  type PopupItem
} from "./ui";

/* ------------------------------------------------------------------ types */

type Layout = "continuous" | "single" | "two";
type Persona = "all" | "read" | "edit" | "convert" | "esign";
type SideTab = "comments" | "pages" | "bookmarks" | "layers" | "fields" | "search";
type ToolId = "select" | "hand" | "text" | "snapshot" | "textbox" | "highlight" | "ink" | "eraser";
type Theme = "light" | "dark";

interface CatalogueTool {
  id: string;
  label: string;
  icon: IconName;
  tone: string;
  personas: Persona[];
  hint?: string;
  action: () => void;
}

interface RailTool {
  id: ToolId;
  label: string;
  icon: IconName;
  shortcut: string;
}

interface PaletteCommand {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  keywords?: string;
  run: () => void;
}

/* ------------------------------------------------------------------ data */

const LAYOUTS: Array<{ id: Layout; label: string; icon: IconName }> = [
  { id: "continuous", label: "Continuous", icon: "pages" },
  { id: "single", label: "Single page", icon: "file" },
  { id: "two", label: "Two-up", icon: "organize" }
];

const PERSONAS: Array<{ id: Persona; label: string }> = [
  { id: "all", label: "All tools" },
  { id: "read", label: "Read" },
  { id: "edit", label: "Edit" },
  { id: "convert", label: "Convert" },
  { id: "esign", label: "E-Sign" }
];

const RAIL_TOOLS: RailTool[] = [
  { id: "select", label: "Select", icon: "cursor", shortcut: "V" },
  { id: "hand", label: "Hand", icon: "hand", shortcut: "H" },
  { id: "text", label: "Select text", icon: "text-select", shortcut: "T" },
  { id: "snapshot", label: "Snapshot", icon: "snapshot", shortcut: "S" },
  { id: "textbox", label: "Text box", icon: "textbox", shortcut: "X" },
  { id: "highlight", label: "Highlight", icon: "highlight", shortcut: "U" },
  { id: "ink", label: "Draw", icon: "ink", shortcut: "D" },
  { id: "eraser", label: "Erase", icon: "eraser", shortcut: "E" }
];

const SIDE_TABS: Array<{ id: SideTab; label: string; icon: IconName }> = [
  { id: "comments", label: "Comments", icon: "comment" },
  { id: "pages", label: "Pages", icon: "pages" },
  { id: "bookmarks", label: "Bookmarks", icon: "bookmarks" },
  { id: "layers", label: "Layers", icon: "layers" },
  { id: "fields", label: "Fields", icon: "fields" },
  { id: "search", label: "Search", icon: "search" }
];

const ZOOM_MIN = 0.18;
const ZOOM_MAX = 2.6;
const ACCENT = "#c2412d";

/* ------------------------------------------------------------------ state */

const docs: PdfDoc[] = [createShowcase()];
let activeIndex = 0;

let theme: Theme = "light";
let layout: Layout = "continuous";
let layoutBeforeRead: Layout | null = null;
let zoomBeforeRead: number | null = null;
let sideBeforeRead: { open: boolean; tab: SideTab } | null = null;
let toolsBeforeRead = true;
let persona: Persona = "all";
let activeTool: ToolId = "select";
let sideTab: SideTab = "comments";
let sideOpen = true;
let toolsOpen = true;
let catalogExpanded = false;
let organizerOpen = false;
let currentPage = 0;
let zoom = 0.86;
let findOpen = false;
let searchQuery = "";
let hits: SearchHit[] = [];
let hitIndex = -1;
let replyTarget: string | null = null;
let bannerDismissed = false;
let fieldHighlight = false;
let selectedPages = new Set<string>();
let selectedBookmark: string | null = null;
let collapsedBookmarks = new Set<string>();
let dragPageId: string | null = null;
const undoStack: HistoryEntry[] = [];
const redoStack: HistoryEntry[] = [];
const layerState = { draft: true, notes: false, annotations: true };
const inkPaths = new Map<string, string[]>();

const currentDoc = (): PdfDoc => docs[activeIndex];
const pageIndexOf = (pageId: string): number => currentDoc().pages.findIndex(page => page.id === pageId);
function setHint(text: string, timeout = 0): void {
  const hint = document.querySelector<HTMLElement>("#pf-hint");
  if (!hint) return;
  hint.textContent = text;
  if (timeout > 0) {
    window.setTimeout(() => {
      const node = document.querySelector<HTMLElement>("#pf-hint");
      if (node && node.textContent === text) node.textContent = defaultHint();
    }, timeout);
  }
}

function defaultHint(): string {
  return "Wheel to scroll · ⌘K for every tool · Select text on a page to comment";
}

function markDirty(doc: PdfDoc = currentDoc()): void {
  doc.dirty = true;
  renderTabs();
}

/* ------------------------------------------------------------------ history */

function snapshotDoc(doc: PdfDoc): PageSnapshot {
  return {
    docId: doc.id,
    pages: doc.pages.map(page => ({ ...page })),
    comments: doc.comments.map(comment => ({ ...comment, replies: comment.replies.map(reply => ({ ...reply })) })),
    bookmarks: doc.bookmarks.map(bookmark => ({ ...bookmark })),
    fields: doc.fields.map(field => ({ ...field })),
    values: { ...doc.values },
    meta: { ...doc.meta }
  };
}

function applySnapshot(doc: PdfDoc, snapshot: PageSnapshot): void {
  doc.pages = snapshot.pages.map(page => ({ ...page }));
  doc.comments = snapshot.comments.map(comment => ({
    ...comment,
    replies: comment.replies.map(reply => ({ ...reply }))
  }));
  doc.bookmarks = snapshot.bookmarks.map(bookmark => ({ ...bookmark }));
  doc.fields = snapshot.fields.map(field => ({ ...field }));
  doc.values = { ...snapshot.values };
  doc.meta = { ...snapshot.meta };
}

function pushHistory(label: string): void {
  const doc = currentDoc();
  undoStack.push({ label, time: Date.now(), snapshot: snapshotDoc(doc) });
  if (undoStack.length > 80) undoStack.shift();
  redoStack.length = 0;
}

function undo(): void {
  const entry = undoStack.pop();
  if (!entry) {
    toast("Nothing to undo");
    return;
  }
  const target = docs.find(doc => doc.id === entry.snapshot.docId);
  if (!target) {
    toast("That document is no longer open", "warning");
    return;
  }
  const index = docs.indexOf(target);
  redoStack.push({ label: entry.label, time: Date.now(), snapshot: snapshotDoc(target) });
  activeIndex = index;
  applySnapshot(target, entry.snapshot);
  target.dirty = true;
  currentPage = Math.min(currentPage, target.pages.length - 1);
  renderAll();
  setHint(`Undo ${entry.label}`, 2400);
}

function redo(): void {
  const entry = redoStack.pop();
  if (!entry) {
    toast("Nothing to redo");
    return;
  }
  const target = docs.find(doc => doc.id === entry.snapshot.docId);
  if (!target) return;
  const index = docs.indexOf(target);
  undoStack.push({ label: entry.label, time: Date.now(), snapshot: snapshotDoc(target) });
  activeIndex = index;
  applySnapshot(target, entry.snapshot);
  target.dirty = true;
  currentPage = Math.min(currentPage, target.pages.length - 1);
  renderAll();
  setHint(`Redo ${entry.label}`, 2400);
}

/* ------------------------------------------------------------------ shell */

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="pf-app" id="pf-app">
    <header class="pf-titlebar">
      <div class="pf-traffic" aria-hidden="true">
        <span class="pf-light pf-light-close"></span>
        <span class="pf-light pf-light-min"></span>
        <span class="pf-light pf-light-max"></span>
      </div>
      <div class="pf-tabs" id="pf-tabs" role="tablist" aria-label="Open documents"></div>
      <button type="button" class="pf-open-tab" id="pf-open">${icon("plus", 12)} <span>Open</span></button>
      <div class="pf-title-actions">
        <button type="button" class="pf-icon-btn" id="pf-discord" title="ArtCraft community">${icon(
          "discord",
          16
        )}</button>
        <button type="button" class="pf-icon-btn" id="pf-help" title="Help and shortcuts">${icon("help", 16)}</button>
        <button type="button" class="pf-icon-btn" id="pf-theme" title="Toggle theme">${icon("moon", 16)}</button>
      </div>
    </header>

    <div class="pf-menubar">
      <button type="button" class="pf-menu-toggle" id="pf-menu">${icon("menu", 16)}<span>Menu</span></button>
      <nav class="pf-personas" id="pf-personas" aria-label="Workspaces"></nav>
      <button type="button" class="pf-cmdsearch" id="pf-cmdsearch">
        ${icon("search", 15)}
        <span class="pf-cmdsearch-label">Find tools and commands</span>
        <kbd>⌘K</kbd>
      </button>
      <div class="pf-menubar-actions">
        <button type="button" class="pf-icon-btn" id="pf-recents" title="Recent documents">${icon(
          "rotate-ccw",
          15
        )}</button>
        <button type="button" class="pf-icon-btn" id="pf-save" title="Save">${icon("save", 15)}</button>
        <button type="button" class="pf-icon-btn" id="pf-print" title="Print">${icon("printer", 15)}</button>
      </div>
    </div>

    <div class="pf-body">
      <aside class="pf-tools" id="pf-tools" aria-label="All tools"></aside>
      <div class="pf-rail" id="pf-tool-rail" aria-label="Document tools"></div>
      <main class="pf-stage" id="pf-stage">
        <div class="pf-banner" id="pf-banner"></div>
        <div class="pf-canvas" id="pf-canvas">
          <div class="pf-pages" id="pf-pages"></div>
        </div>
        <div class="pf-dock" id="pf-dock"></div>
        <div class="pf-findbar" id="pf-findbar" hidden>
          ${icon("search", 14)}
          <input id="pf-find-input" type="text" placeholder="Find in document" spellcheck="false" />
          <span class="pf-find-count" id="pf-find-count">0 / 0</span>
          <button type="button" class="pf-icon-btn" id="pf-find-prev" title="Previous match">${icon(
            "chevron-up",
            14
          )}</button>
          <button type="button" class="pf-icon-btn" id="pf-find-next" title="Next match">${icon(
            "chevron-down",
            14
          )}</button>
          <button type="button" class="pf-icon-btn" id="pf-find-close" title="Close find bar">${icon(
            "close",
            13
          )}</button>
        </div>
        <div class="pf-organizer" id="pf-organizer" hidden></div>
      </main>
      <aside class="pf-side" id="pf-side">
        <div class="pf-side-panel" id="pf-side-panel"></div>
        <div class="pf-side-rail" id="pf-side-rail" aria-label="Panels"></div>
      </aside>
    </div>

    <footer class="pf-status">
      <span class="pf-hint" id="pf-hint">${defaultHint()}</span>
      <span class="pf-status-right" id="pf-status-right"></span>
    </footer>
  </div>
`;

const appEl = q<HTMLElement>("#pf-app");
const tabsEl = q<HTMLElement>("#pf-tabs");
const personasEl = q<HTMLElement>("#pf-personas");
const toolsEl = q<HTMLElement>("#pf-tools");
const toolRailEl = q<HTMLElement>("#pf-tool-rail");
const stageEl = q<HTMLElement>("#pf-stage");
const canvasEl = q<HTMLElement>("#pf-canvas");
const pagesEl = q<HTMLElement>("#pf-pages");
const dockEl = q<HTMLElement>("#pf-dock");
const bannerEl = q<HTMLElement>("#pf-banner");
const sidePanelEl = q<HTMLElement>("#pf-side-panel");
const sideRailEl = q<HTMLElement>("#pf-side-rail");
const organizerEl = q<HTMLElement>("#pf-organizer");
const findbarEl = q<HTMLElement>("#pf-findbar");
const findInput = q<HTMLInputElement>("#pf-find-input");
const findCountEl = q<HTMLElement>("#pf-find-count");
const statusRightEl = q<HTMLElement>("#pf-status-right");

/* ------------------------------------------------------------------ shell classes */

function syncShellClasses(): void {
  appEl.className = [
    "pf-app",
    theme === "dark" ? "theme-dark" : "",
    toolsOpen ? "" : "tools-closed",
    sideOpen ? "" : "side-closed",
    persona === "read" ? "is-read" : "",
    organizerOpen ? "is-organizing" : "",
    fieldHighlight ? "show-fields" : "",
    layerState.draft ? "" : "hide-draft",
    layerState.notes ? "show-notes" : "",
    layerState.annotations ? "" : "hide-annotations"
  ]
    .filter(Boolean)
    .join(" ");
  pagesEl.className = `pf-pages mode-${layout}`;
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
  const themeButton = document.querySelector<HTMLElement>("#pf-theme");
  if (themeButton) themeButton.innerHTML = icon(theme === "dark" ? "sun" : "moon", 16);
}

/* ------------------------------------------------------------------ tabs / personas */

function renderTabs(): void {
  tabsEl.innerHTML = docs
    .map(
      (doc, index) => `<div class="pf-tab${
        index === activeIndex ? " is-active" : ""
      }" data-doc-index="${index}" role="tab" aria-selected="${index === activeIndex}">
        ${icon("file", 13)}
        <span class="pf-tab-name" title="${escapeHTML(doc.name)}">${escapeHTML(doc.name)}</span>
        ${doc.dirty ? '<span class="pf-tab-dot" title="Unsaved changes"></span>' : ""}
        <button type="button" class="pf-tab-close" data-close-doc="${index}" title="Close document">${icon(
        "close",
        10
      )}</button>
      </div>`
    )
    .join("");
  syncShellClasses();
}

function renderPersonas(): void {
  personasEl.innerHTML = PERSONAS.map(
    item =>
      `<button type="button" class="pf-persona${persona === item.id ? " is-active" : ""}" data-persona="${item.id}">${
        item.label
      }</button>`
  ).join("");
}

/* ------------------------------------------------------------------ tools panel */

function catalogue(): CatalogueTool[] {
  return [
    {
      id: "export",
      label: "Export a PDF",
      icon: "export",
      tone: "blue",
      personas: ["all", "convert"],
      action: () => openExportDialog()
    },
    {
      id: "sign",
      label: "Fill & Sign",
      icon: "sign",
      tone: "violet",
      personas: ["all", "esign"],
      action: () => {
        goToPage(pageIndexOfFieldPage());
        setSide("fields");
        setTool("textbox");
        toast("Click a form field to fill it in");
      }
    },
    {
      id: "edit",
      label: "Edit a PDF",
      icon: "edit",
      tone: "rose",
      personas: ["all", "edit"],
      action: () => {
        setSide("comments");
        setTool("text");
        setHint("Select text on a page, then choose Highlight or Note", 3600);
      }
    },
    {
      id: "create",
      label: "Create a PDF",
      icon: "create",
      tone: "red",
      personas: ["all", "convert"],
      action: () => insertBlankPage()
    },
    {
      id: "combine",
      label: "Combine files",
      icon: "combine",
      tone: "blue",
      personas: ["all", "convert"],
      action: () => openCombineDialog()
    },
    {
      id: "organize",
      label: "Organize pages",
      icon: "organize",
      tone: "green",
      personas: ["all", "edit", "convert"],
      action: () => openOrganizer()
    },
    {
      id: "comments",
      label: "Add comments",
      icon: "comment",
      tone: "amber",
      personas: ["all", "edit"],
      action: () => {
        setSide("comments");
        setTool("text");
        setHint("Select text to highlight, or drag the note tool", 3600);
      }
    },
    {
      id: "scan",
      label: "Scan & OCR",
      icon: "scan",
      tone: "green",
      personas: ["all", "convert"],
      action: () => openScanDialog()
    },
    {
      id: "protect",
      label: "Protect a PDF",
      icon: "protect",
      tone: "blue",
      personas: ["all", "convert", "esign"],
      action: () => openProtectDialog()
    },
    {
      id: "redact",
      label: "Redact a PDF",
      icon: "redact",
      tone: "red",
      personas: ["all", "edit"],
      action: () => openRedactDialog()
    },
    {
      id: "compress",
      label: "Compress a PDF",
      icon: "compress",
      tone: "red",
      personas: ["all", "convert"],
      action: () => openCompressDialog()
    },
    {
      id: "form",
      label: "Prepare a form",
      icon: "form",
      tone: "violet",
      personas: ["all", "esign"],
      action: () => {
        goToPage(pageIndexOfFieldPage());
        setSide("fields");
        fieldHighlight = true;
        syncShellClasses();
        renderSide();
        toast("Field highlighting is on");
      }
    },
    {
      id: "stamp",
      label: "Add a stamp",
      icon: "stamp",
      tone: "violet",
      personas: ["all", "edit"],
      action: () => openStampDialog()
    },
    {
      id: "certificate",
      label: "Use a certificate",
      icon: "certificate",
      tone: "teal",
      personas: ["all", "esign"],
      action: () => openCertificateDialog()
    },
    {
      id: "more",
      label: "View more",
      icon: "more",
      tone: "blue",
      personas: ["all"],
      action: () => {
        catalogExpanded = !catalogExpanded;
        renderToolsPanel();
      }
    },
    {
      id: "split",
      label: "Split document",
      icon: "insert",
      tone: "amber",
      personas: ["convert"],
      action: () => openSplitDialog()
    },
    {
      id: "extract",
      label: "Extract pages",
      icon: "export",
      tone: "teal",
      personas: ["convert"],
      action: () => openExtractDialog()
    },
    {
      id: "fonts",
      label: "Fonts & properties",
      icon: "info",
      tone: "violet",
      personas: ["convert", "edit"],
      action: () => openPropertiesDialog()
    }
  ];
}

function visibleTools(): CatalogueTool[] {
  const all = catalogue();
  if (persona === "all")
    return catalogExpanded
      ? all.filter(tool => tool.personas.includes("all"))
      : all.filter(tool => tool.personas.includes("all") && tool.id !== "more");
  return all.filter(tool => tool.personas.includes(persona));
}

function personaTitle(): string {
  if (persona === "all") return "All tools";
  if (persona === "read") return "Read";
  if (persona === "edit") return "Edit";
  if (persona === "convert") return "Convert";
  return "E-Sign";
}

function renderToolsPanel(): void {
  const tools = visibleTools();
  const showMore = persona === "all" && !catalogExpanded;
  toolsEl.innerHTML = `
    <header class="pf-tools-head">
      <h2>${personaTitle()}</h2>
      <button type="button" class="pf-icon-btn" data-tools-close title="Hide the tools panel">${icon(
        "close",
        13
      )}</button>
    </header>
    <div class="pf-tools-list">
      ${tools
        .map(
          tool => `<button type="button" class="pf-tool-row tone-${tool.tone}" data-tool="${tool.id}">
            <span class="pf-tool-icon">${icon(tool.icon, 18)}</span>
            <span class="pf-tool-label">${tool.label}</span>
          </button>`
        )
        .join("")}
      ${
        showMore
          ? `<button type="button" class="pf-tool-row pf-tool-more" data-tool="more"><span class="pf-tool-icon"></span><span class="pf-tool-label">View more</span></button>`
          : ""
      }
    </div>
    <div class="pf-tools-foot">
      <span>${currentDoc().pages.length} pages · ${currentDoc().comments.length} comments</span>
      <span class="pf-tools-foot-badge">DEMO</span>
    </div>
  `;
}

function renderToolRail(): void {
  toolRailEl.innerHTML = RAIL_TOOLS.map(
    tool =>
      `<button type="button" class="pf-rail-btn${activeTool === tool.id ? " is-active" : ""}" data-rail-tool="${
        tool.id
      }" title="${tool.label} (${tool.shortcut})">${icon(tool.icon, 17)}</button>`
  ).join("");
}

/* ------------------------------------------------------------------ side panel */

function renderSideRail(): void {
  sideRailEl.innerHTML = SIDE_TABS.map(tab => {
    const badge = tab.id === "comments" ? currentDoc().comments.length : 0;
    return `<button type="button" class="pf-side-btn${
      sideOpen && sideTab === tab.id ? " is-active" : ""
    }" data-side-tab="${tab.id}" title="${tab.label}">${icon(tab.icon, 17)}${
      badge ? `<span class="pf-side-badge">${badge}</span>` : ""
    }</button>`;
  }).join("");
}

function setSide(tab: SideTab): void {
  sideTab = tab;
  sideOpen = true;
  replyTarget = null;
  renderSide();
  syncShellClasses();
}

function setTool(tool: ToolId): void {
  activeTool = tool;
  renderToolRail();
  const meta = RAIL_TOOLS.find(entry => entry.id === tool);
  if (meta) setHint(`${meta.label} tool selected`, 2000);
}

function renderSide(): void {
  if (!sideOpen) {
    sidePanelEl.innerHTML = "";
    renderSideRail();
    return;
  }
  const doc = currentDoc();
  const counts: Record<SideTab, number> = {
    comments: doc.comments.length,
    pages: doc.pages.length,
    bookmarks: doc.bookmarks.length,
    layers: 3,
    fields: doc.fields.length,
    search: hits.length
  };
  const meta = SIDE_TABS.find(tab => tab.id === sideTab);
  const body = (() => {
    switch (sideTab) {
      case "comments":
        return commentsPanel();
      case "pages":
        return pagesPanel();
      case "bookmarks":
        return bookmarksPanel();
      case "layers":
        return layersPanel();
      case "fields":
        return fieldsPanel();
      case "search":
        return searchPanel();
    }
  })();
  sidePanelEl.innerHTML = `
    <header class="pf-side-head">
      <h2>${meta?.label ?? ""}<span class="pf-side-count">${counts[sideTab]}</span></h2>
      <div class="pf-side-head-actions">
        ${
          sideTab === "comments"
            ? `<button type="button" class="pf-text-btn" data-add-comment>Add comment</button>`
            : ""
        }
        <button type="button" class="pf-icon-btn" data-side-close title="Close panel">${icon("close", 13)}</button>
      </div>
    </header>
    <div class="pf-side-body">${body}</div>
  `;
  renderSideRail();
}

function commentsPanel(): string {
  const doc = currentDoc();
  if (!doc.comments.length) {
    return `<div class="pf-empty">${icon(
      "comment",
      28
    )}<p>No comments yet.</p><span>Select text on a page and choose Highlight or Note.</span></div>`;
  }
  const groups = doc.pages
    .map((page, index) => {
      const items = doc.comments.filter(comment => comment.pageId === page.id);
      return { page, index, items };
    })
    .filter(group => group.items.length > 0);

  return groups
    .map(
      group => `<section class="pf-comment-group">
        <header class="pf-group-head"><span>Page ${group.index + 1}</span><em>${escapeHTML(
        pageLabel(group.page)
      )}</em></header>
        ${group.items.map(comment => commentCard(comment)).join("")}
      </section>`
    )
    .join("");
}

function commentCard(comment: Comment): string {
  const pageIndex = pageIndexOf(comment.pageId);
  const kindLabel =
    comment.kind === "highlight"
      ? "Highlight"
      : comment.kind === "underline"
      ? "Underline"
      : comment.kind === "textbox"
      ? "Text box"
      : "Note";
  return `<article class="pf-comment${comment.resolved ? " is-resolved" : ""}" data-comment="${comment.id}">
    <div class="pf-comment-head">
      <span class="pf-avatar" style="--avatar:${comment.accent}">${escapeHTML(comment.initials)}</span>
      <div class="pf-comment-title">
        <strong>${escapeHTML(comment.author)}</strong>
        <span>${kindLabel} · ${shortDate(comment.date)}${pageIndex >= 0 ? ` · page ${pageIndex + 1}` : ""}</span>
      </div>
      <button type="button" class="pf-icon-btn pf-comment-menu" data-comment-menu="${
        comment.id
      }" title="Comment options">${icon("dots", 14)}</button>
    </div>
    ${comment.quote ? `<blockquote class="pf-comment-quote">${escapeHTML(comment.quote)}</blockquote>` : ""}
    ${comment.body ? `<p class="pf-comment-body">${escapeHTML(comment.body)}</p>` : ""}
    ${
      comment.replies.length
        ? `<div class="pf-replies">${comment.replies
            .map(
              reply => `<div class="pf-reply">
                <span class="pf-avatar pf-avatar-sm" style="--avatar:${comment.accent}">${escapeHTML(
                reply.initials
              )}</span>
                <div>
                  <div class="pf-reply-head"><strong>${escapeHTML(reply.author)}</strong><span>${shortDate(
                reply.date
              )}</span></div>
                  <p>${escapeHTML(reply.body)}</p>
                </div>
              </div>`
            )
            .join("")}</div>`
        : ""
    }
    ${
      replyTarget === comment.id
        ? `<div class="pf-reply-form">
            <textarea data-reply-input placeholder="Write a reply…" rows="2"></textarea>
            <div class="pf-reply-actions">
              <button type="button" class="pf-btn pf-btn-ghost" data-reply-cancel>Cancel</button>
              <button type="button" class="pf-btn pf-btn-primary" data-reply-submit="${comment.id}">Reply</button>
            </div>
          </div>`
        : `<div class="pf-comment-actions">
            <button type="button" class="pf-text-btn" data-comment-reply="${comment.id}">${icon(
            "reply",
            13
          )} Reply</button>
            <button type="button" class="pf-text-btn" data-comment-resolve="${comment.id}">${
            comment.resolved ? "Reopen" : "Resolve"
          }</button>
          </div>`
    }
  </article>`;
}

function miniPreview(page: Page): string {
  const dark = page.kind === "cover";
  return `<span class="pf-mini${dark ? " is-dark" : ""}"><span class="pf-mini-title">${escapeHTML(
    page.kind === "cover" ? "◆" : page.label || "—"
  )}</span><span class="pf-mini-rule"></span><span class="pf-mini-rule short"></span></span>`;
}

function pagesPanel(): string {
  const doc = currentDoc();
  return `<div class="pf-page-list">
    ${doc.pages
      .map(
        (page, index) => `<div class="pf-page-item${
          index === currentPage ? " is-current" : ""
        }" data-page-index="${index}">
          ${miniPreview(page)}
          <div class="pf-page-copy">
            <strong>${index + 1} <span>${escapeHTML(pageLabel(page))}</span></strong>
            <em>${escapeHTML(page.title)}</em>
          </div>
          ${
            page.rotation
              ? `<span class="pf-page-rot" title="Rotated ${page.rotation}°">${icon("rotate", 13)}</span>`
              : ""
          }
          <button type="button" class="pf-icon-btn pf-page-more" data-page-menu="${index}" title="Page options">${icon(
          "dots",
          14
        )}</button>
        </div>`
      )
      .join("")}
  </div>
  <div class="pf-side-foot">
    <button type="button" class="pf-text-btn" data-open-organizer>${icon("organize", 14)} Organize pages</button>
    <span class="pf-side-foot-meta">${doc.pages.length} pages</span>
  </div>`;
}

function bookmarksPanel(): string {
  const doc = currentDoc();
  const rows = doc.bookmarks;
  const hidden = (index: number): boolean => {
    let depth = rows[index].depth;
    for (let parent = index - 1; parent >= 0 && depth > 0; parent -= 1) {
      if (rows[parent].depth < depth) {
        if (collapsedBookmarks.has(rows[parent].id)) return true;
        depth = rows[parent].depth;
      }
    }
    return false;
  };
  const items = rows
    .map((bookmark, index) => {
      if (hidden(index)) return "";
      const next = rows[index + 1];
      const hasChildren = next ? next.depth > bookmark.depth : false;
      const collapsed = collapsedBookmarks.has(bookmark.id);
      const pageIndex = bookmark.pageId ? pageIndexOf(bookmark.pageId) : -1;
      const label = pageIndex >= 0 ? pageLabel(doc.pages[pageIndex]) : "";
      return `<div class="pf-bm-row${selectedBookmark === bookmark.id ? " is-selected" : ""}${
        bookmark.depth > 0 ? " is-child" : ""
      }" data-bm="${bookmark.id}" style="--depth:${bookmark.depth}">
        <span class="pf-bm-caret" data-bm-toggle="${bookmark.id}">${
        hasChildren ? icon(collapsed ? "chevron-right" : "chevron-down", 12) : ""
      }</span>
        <span class="pf-bm-title">${escapeHTML(bookmark.title)}</span>
        <span class="pf-bm-page">${escapeHTML(label)}</span>
      </div>`;
    })
    .join("");
  return `<div class="pf-bookmarks">${items}</div>
  <div class="pf-side-foot"><span class="pf-side-foot-meta">Nested outline · click a row to jump</span></div>`;
}

function layersPanel(): string {
  const rows: Array<{ key: keyof typeof layerState; label: string; note: string }> = [
    { key: "draft", label: "Draft watermark", note: "Optional content layer" },
    { key: "notes", label: "Print-only notes", note: "Hidden on screen by default" },
    { key: "annotations", label: "Annotations", note: "Highlights, underlines and ink" }
  ];
  return `<div class="pf-layers">
    ${rows
      .map(
        row => `<div class="pf-layer-row">
          <button type="button" class="pf-icon-btn" data-layer-toggle="${row.key}" title="Toggle ${row.label}">${icon(
          layerState[row.key] ? "eye" : "eye-off",
          15
        )}</button>
          <div><strong>${row.label}</strong><em>${row.note}</em></div>
          <span class="pf-layer-state">${layerState[row.key] ? "on" : "off"}</span>
        </div>`
      )
      .join("")}
  </div>
  <p class="pf-panel-note">Layers are stored as optional content in the PDF. Toggling one re-renders the
  page without touching its other objects.</p>`;
}

function fieldsPanel(): string {
  const doc = currentDoc();
  if (!doc.fields.length) {
    return `<div class="pf-empty">${icon(
      "fields",
      28
    )}<p>No form fields.</p><span>This document has no interactive form.</span></div>`;
  }
  return `<div class="pf-fields">
    <p class="pf-panel-note">${doc.fields.length} fields on page ${
    pageIndexOfFieldPage() + 1
  }. Values are stored per field.</p>
    ${doc.fields
      .map(field => {
        const value = doc.values[field.id];
        const shown =
          field.type === "checkbox" || field.type === "radio" ? (value ? "yes" : "no") : String(value ?? "");
        return `<button type="button" class="pf-field-row" data-field-jump="${field.id}">
          <span class="pf-field-type">${icon(
            field.type === "checkbox" || field.type === "radio" ? "check" : "form",
            14
          )}</span>
          <span class="pf-field-name">${escapeHTML(field.name)}</span>
          <span class="pf-field-value">${escapeHTML(shown) || "—"}</span>
        </button>`;
      })
      .join("")}
  </div>
  <div class="pf-side-foot">
    <button type="button" class="pf-text-btn" data-highlight-fields>${icon("highlight", 14)} ${
    fieldHighlight ? "Hide field highlight" : "Highlight fields"
  }</button>
    <button type="button" class="pf-text-btn" data-clear-form>Clear form</button>
  </div>`;
}

function searchPanel(): string {
  return `<div class="pf-search-panel">
    <label class="pf-search-field">${icon(
      "search",
      14
    )}<input id="pf-side-search" type="text" placeholder="Search this document" value="${escapeHTML(
    searchQuery
  )}" spellcheck="false" /></label>
    <div class="pf-search-meta">${searchQuery ? `${hits.length} matches` : "Search as you type"}</div>
    <div class="pf-search-results">
      ${hits
        .map(
          (hit, index) => `<button type="button" class="pf-search-result${
            index === hitIndex ? " is-current" : ""
          }" data-search-hit="${index}">
            <span class="pf-search-page">Page ${hit.pageIndex + 1}</span>
            <span class="pf-search-snippet">${escapeHTML(hit.snippet)}</span>
          </button>`
        )
        .join("")}
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ canvas */

function renderCanvas(): void {
  const doc = currentDoc();
  pagesEl.innerHTML = doc.pages
    .map((page, index) => {
      const ink = inkPaths.get(page.id) ?? [];
      return `<div class="pf-page-wrap${index === currentPage ? " is-current" : ""}" data-page-id="${
        page.id
      }" data-page-index="${index}">
        <div class="pf-page-frame" data-rot="${page.rotation}">
          <div class="pf-page-turn" style="--pf-rot:${page.rotation}deg">
            ${renderPageContent(page, doc)}
            ${
              ink.length
                ? `<svg class="pf-ink" viewBox="0 0 ${PAGE_W} ${PAGE_H}" preserveAspectRatio="none">${ink
                    .map(
                      path =>
                        `<path d="${path}" fill="none" stroke="#c2412d" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`
                    )
                    .join("")}</svg>`
                : ""
            }
          </div>
        </div>
      </div>`;
    })
    .join("");
  pagesEl.style.setProperty("--pf-zoom", String(zoom));
  applyAnnotations();
  wirePageForms();
  syncCurrentPageClasses();
  renderDock();
  renderStatus();
  if (searchQuery.trim()) runSearch(false);
}

function applyAnnotations(): void {
  const doc = currentDoc();
  for (const comment of doc.comments) {
    if (comment.kind !== "highlight" && comment.kind !== "underline") continue;
    if (!comment.quote) continue;
    const wrap = pagesEl.querySelector<HTMLElement>(`.pf-page-wrap[data-page-id="${comment.pageId}"]`);
    if (!wrap) continue;
    wrapQuote(
      wrap,
      comment.quote,
      comment.id,
      comment.kind === "highlight" ? "pg-annot-highlight" : "pg-annot-underline"
    );
  }
}

function wirePageForms(): void {
  const doc = currentDoc();
  pagesEl
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-field]")
    .forEach(input => {
      if (input instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")) {
        const key = input.dataset.field;
        if (!key) return;
        input.checked = doc.values[key] === true;
      }
    });
}

function renderBanner(): void {
  const doc = currentDoc();
  if (!doc.fields.length || bannerDismissed) {
    bannerEl.hidden = true;
    bannerEl.innerHTML = "";
    return;
  }
  bannerEl.hidden = false;
  bannerEl.innerHTML = `
    <span class="pf-banner-icon">${icon("form", 16)}</span>
    <span class="pf-banner-text">This document contains <strong>${
      doc.fields.length
    } interactive form fields</strong>.</span>
    <span class="pf-banner-spacer"></span>
    <button type="button" class="pf-btn pf-btn-ghost" data-banner-highlight>${
      fieldHighlight ? "Hide fields" : "Highlight fields"
    }</button>
    <button type="button" class="pf-icon-btn" data-banner-close title="Dismiss">${icon("close", 13)}</button>
  `;
}

function syncCurrentPageClasses(): void {
  pagesEl.querySelectorAll<HTMLElement>(".pf-page-wrap").forEach(wrap => {
    wrap.classList.toggle("is-current", Number(wrap.dataset.pageIndex) === currentPage);
  });
}

function renderDock(): void {
  const total = currentDoc().pages.length;
  dockEl.innerHTML = `
    <div class="pf-dock-page">
      <input id="pf-page-input" type="text" inputmode="numeric" value="${currentPage + 1}" aria-label="Page number" />
      <span>/ ${total}</span>
    </div>
    <div class="pf-dock-nav">
      <button type="button" class="pf-dock-btn" data-dock="prev" title="Previous page">${icon(
        "chevron-up",
        13
      )}</button>
      <button type="button" class="pf-dock-btn" data-dock="next" title="Next page">${icon("chevron-down", 13)}</button>
    </div>
    <div class="pf-dock-sep"></div>
    <button type="button" class="pf-dock-btn" data-dock="zoom-out" title="Zoom out">${icon("minus", 14)}</button>
    <button type="button" class="pf-dock-zoom" data-dock="zoom-menu" title="Zoom presets">${Math.round(
      zoom * 100
    )}%</button>
    <button type="button" class="pf-dock-btn" data-dock="zoom-in" title="Zoom in">${icon("plus", 14)}</button>
    <button type="button" class="pf-dock-btn" data-dock="fit" title="Fit page">${icon("fit", 14)}</button>
    <button type="button" class="pf-dock-btn" data-dock="rotate" title="Rotate page clockwise">${icon(
      "rotate",
      14
    )}</button>
    <button type="button" class="pf-dock-btn" data-dock="find" title="Find in document">${icon("search", 14)}</button>
  `;
}

function renderStatus(): void {
  const doc = currentDoc();
  const page = doc.pages[currentPage];
  const layoutLabel = LAYOUTS.find(item => item.id === layout)?.label ?? layout;
  statusRightEl.innerHTML = `
    <span>${
      page ? `Page ${currentPage + 1} of ${doc.pages.length} · ${escapeHTML(pageLabel(page))}` : "No pages"
    }</span>
    <span class="pf-status-sep"></span>
    <span>${layoutLabel}</span>
    <span class="pf-status-sep"></span>
    <span>US Letter · 8.5 × 11 in</span>
    <span class="pf-status-sep"></span>
    <span>${Math.round(zoom * 100)}%</span>
    <span class="pf-status-sep"></span>
    <span class="pf-status-file">${escapeHTML(doc.name)}${doc.dirty ? " · edited" : ""}</span>
    <span class="pf-status-app">PdfCraft · LiteGUI</span>
  `;
}

function renderAll(): void {
  renderTabs();
  renderPersonas();
  renderToolsPanel();
  renderToolRail();
  renderSide();
  renderCanvas();
  renderBanner();
  renderOrganizer();
  syncShellClasses();
  renderSideRail();
  updateFindbar();
}

/* ------------------------------------------------------------------ navigation */

function setZoom(next: number, anchorHint = ""): void {
  zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
  pagesEl.style.setProperty("--pf-zoom", String(zoom));
  renderDock();
  renderStatus();
  if (anchorHint) setHint(anchorHint, 1600);
}

function zoomBy(delta: number): void {
  setZoom(zoom + delta);
}

function fitWidth(): void {
  const available = canvasEl.clientWidth - 120;
  setZoom(available / PAGE_W, "Fit width");
}

function fitPage(): void {
  const available = canvasEl.clientHeight - 96;
  setZoom(available / PAGE_H, "Fit page");
}

function zoomActual(): void {
  setZoom(1, "Actual size");
}

function goToPage(index: number, smooth = true): void {
  const total = currentDoc().pages.length;
  const target = Math.min(total - 1, Math.max(0, index));
  currentPage = target;
  const wrap = pagesEl.querySelector<HTMLElement>(`.pf-page-wrap[data-page-index="${target}"]`);
  if (wrap && layout !== "single") {
    const canvasRect = canvasEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const top = canvasEl.scrollTop + (wrapRect.top - canvasRect.top) - 26;
    canvasEl.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  }
  syncCurrentPageClasses();
  renderDock();
  renderStatus();
  if (sideTab === "pages" && sideOpen) renderSide();
}

function updateCurrentPageFromScroll(): void {
  if (organizerOpen) return;
  const wraps = Array.from(pagesEl.querySelectorAll<HTMLElement>(".pf-page-wrap"));
  if (!wraps.length) return;
  const canvasRect = canvasEl.getBoundingClientRect();
  const center = canvasRect.top + canvasRect.height / 2;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  wraps.forEach((wrap, index) => {
    const rect = wrap.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  if (best !== currentPage) {
    currentPage = best;
    syncCurrentPageClasses();
    renderDock();
    renderStatus();
    if (sideTab === "pages" && sideOpen) renderSide();
  }
}

function setLayout(next: Layout): void {
  layout = next;
  pagesEl.className = `pf-pages mode-${next}`;
  syncCurrentPageClasses();
  window.requestAnimationFrame(() => goToPage(currentPage, false));
  renderStatus();
  setHint(`${LAYOUTS.find(item => item.id === next)?.label} layout`, 1600);
}

function setTheme(next: Theme): void {
  theme = next;
  syncShellClasses();
  if (organizerOpen) renderOrganizer();
  toast(next === "dark" ? "Dark theme" : "Light theme");
}

function setPersona(next: Persona): void {
  const wasRead = persona === "read";
  persona = next;
  if (next === "read") {
    if (!wasRead) {
      layoutBeforeRead = layout;
      zoomBeforeRead = zoom;
      sideBeforeRead = { open: sideOpen, tab: sideTab };
      toolsBeforeRead = toolsOpen;
    }
    toolsOpen = false;
    sideOpen = false;
    setLayout("two");
    setZoom(0.72);
    renderToolsPanel();
  } else {
    if (wasRead && layoutBeforeRead) {
      setLayout(layoutBeforeRead);
      if (zoomBeforeRead) setZoom(zoomBeforeRead);
      layoutBeforeRead = null;
      zoomBeforeRead = null;
    }
    if (wasRead && sideBeforeRead) {
      sideOpen = sideBeforeRead.open;
      sideTab = sideBeforeRead.tab;
      sideBeforeRead = null;
    }
    toolsOpen = wasRead ? toolsBeforeRead : true;
    if (next === "edit") {
      sideOpen = true;
      sideTab = "comments";
    }
    if (next === "esign") {
      sideOpen = true;
      sideTab = "fields";
      goToPage(pageIndexOfFieldPage());
    }
    if (next === "convert") {
      sideOpen = true;
      sideTab = "pages";
    }
    renderToolsPanel();
  }
  renderPersonas();
  renderSide();
  syncShellClasses();
  setHint(`${PERSONAS.find(item => item.id === next)?.label} workspace`, 1800);
}

function pageIndexOfFieldPage(): number {
  const doc = currentDoc();
  const index = doc.pages.findIndex(page => page.kind === "form");
  return index >= 0 ? index : 0;
}

/* ------------------------------------------------------------------ document ops */

function switchDoc(index: number): void {
  if (index === activeIndex || index < 0 || index >= docs.length) return;
  activeIndex = index;
  currentPage = 0;
  replyTarget = null;
  bannerDismissed = false;
  organizerOpen = false;
  renderAll();
  canvasEl.scrollTop = 0;
  setHint(`${currentDoc().name} opened`, 1600);
}

function openBundledDoc(which: "showcase" | "notes"): void {
  const template = which === "showcase" ? createShowcase() : createFieldNotes();
  const doc = cloneDoc(template, { dirty: false });
  docs.push(doc);
  activeIndex = docs.length - 1;
  currentPage = 0;
  bannerDismissed = false;
  organizerOpen = false;
  renderAll();
  canvasEl.scrollTop = 0;
  toast(`${doc.name} opened`, "success");
}

function createBlankDocument(): void {
  const page = createBlankPage();
  const doc: PdfDoc = {
    id: nextId("doc"),
    name: `untitled-${docs.length + 1}.pdf`,
    pages: [page],
    comments: [],
    bookmarks: [{ id: nextId("bm"), title: "Blank page", pageId: page.id, depth: 0 }],
    fields: [],
    values: {},
    meta: { title: "untitled", author: "", subject: "", keywords: "" },
    dirty: true
  };
  docs.push(doc);
  activeIndex = docs.length - 1;
  currentPage = 0;
  renderAll();
  toast("Blank document created", "success");
}

function createBlankPage(): Page {
  return {
    id: nextId("page"),
    kind: "blank",
    label: "",
    title: "Blank page",
    section: "Untitled",
    rotation: 0,
    blank: true
  };
}

function closeDoc(index: number): void {
  if (docs.length === 1) {
    toast("Keep at least one document open", "warning");
    return;
  }
  const doc = docs[index];
  const remove = (): void => {
    docs.splice(index, 1);
    if (activeIndex >= docs.length) activeIndex = docs.length - 1;
    currentPage = Math.min(currentPage, currentDoc().pages.length - 1);
    renderAll();
    toast(`${doc.name} closed`);
  };
  if (!doc.dirty) {
    remove();
    return;
  }
  openDialog({
    title: `Save changes to “${doc.name}”?`,
    subtitle: "Your edits will be lost if you close without saving.",
    body: `<p class="pf-dialog-text">This document has unsaved page and comment changes.</p>`,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-close-cancel>Cancel</button>
      <button type="button" class="pf-btn pf-btn-ghost" data-close-discard>Don’t save</button>
      <button type="button" class="pf-btn pf-btn-primary" data-close-save>Save</button>`,
    onMount: (root, close) => {
      root.querySelector("[data-close-cancel]")?.addEventListener("click", close);
      root.querySelector("[data-close-discard]")?.addEventListener("click", () => {
        close();
        remove();
      });
      root.querySelector("[data-close-save]")?.addEventListener("click", () => {
        saveDocument();
        close();
        remove();
      });
    }
  });
}

function saveDocument(): void {
  const doc = currentDoc();
  try {
    window.localStorage.setItem(`pdfcraft:${doc.id}`, JSON.stringify({ ...doc, dirty: false }));
  } catch {
    /* storage can be unavailable in private windows */
  }
  doc.dirty = false;
  renderTabs();
  renderStatus();
  toast(`Saved ${doc.name} locally`, "success");
}

function saveCopy(): void {
  openExportDialog();
}

function deriveDoc(source: PdfDoc, pages: Page[], name: string): PdfDoc {
  const idMap = new Map<string, string>();
  const copiedPages = pages.map(page => {
    const copy: Page = { ...page, id: nextId("page") };
    idMap.set(page.id, copy.id);
    return copy;
  });
  const comments = source.comments
    .filter(comment => idMap.has(comment.pageId))
    .map(comment => ({
      ...comment,
      id: nextId("comment"),
      pageId: idMap.get(comment.pageId) as string,
      replies: comment.replies.map(reply => ({ ...reply, id: nextId("reply") }))
    }));
  const bookmarks = source.bookmarks
    .filter(bookmark => !bookmark.pageId || idMap.has(bookmark.pageId))
    .map(bookmark => ({
      ...bookmark,
      id: nextId("bm"),
      pageId: bookmark.pageId ? idMap.get(bookmark.pageId) : undefined
    }));
  const fields = source.fields
    .filter(field => idMap.has(field.pageId))
    .map(field => ({ ...field, pageId: idMap.get(field.pageId) as string }));
  const values: Record<string, string | boolean> = {};
  for (const field of fields) {
    if (field.id in source.values) values[field.id] = source.values[field.id];
  }
  return {
    id: nextId("doc"),
    name,
    pages: copiedPages,
    comments,
    bookmarks,
    fields,
    values,
    meta: { ...source.meta, title: name.replace(/\.pdf$/i, "") },
    dirty: true
  };
}

function addDocument(doc: PdfDoc, message: string): void {
  docs.push(doc);
  activeIndex = docs.length - 1;
  currentPage = 0;
  bannerDismissed = false;
  organizerOpen = false;
  renderAll();
  toast(message, "success");
}

/* ------------------------------------------------------------------ page operations */

function rotateSelected(direction: 1 | -1): void {
  if (organizerOpen) {
    const selected = selectedPageList();
    if (!selected.length) {
      toast("Select one or more pages first");
      return;
    }
    pushHistory(direction === 1 ? "Rotate pages clockwise" : "Rotate pages counter-clockwise");
    selected.forEach(page => rotatePage(page, direction));
    markDirty();
    renderOrganizer();
    renderCanvas();
    setHint(`${selected.length} page${selected.length === 1 ? "" : "s"} rotated`, 1600);
    return;
  }
  const page = currentDoc().pages[currentPage];
  if (!page) return;
  pushHistory(direction === 1 ? "Rotate page clockwise" : "Rotate page counter-clockwise");
  rotatePage(page, direction);
  markDirty();
  renderCanvas();
  setHint(`Page ${currentPage + 1} rotated to ${page.rotation}°`, 1600);
}

function deleteSelectedPages(): void {
  const doc = currentDoc();
  const targets = organizerOpen ? selectedPageList() : [doc.pages[currentPage]].filter(Boolean);
  if (!targets.length) return;
  if (targets.length >= doc.pages.length) {
    toast("At least one page must remain", "warning");
    return;
  }
  pushHistory("Delete pages");
  const removeIds = new Set(targets.map(page => page.id));
  doc.pages = doc.pages.filter(page => !removeIds.has(page.id));
  doc.comments = doc.comments.filter(comment => !removeIds.has(comment.pageId));
  doc.bookmarks = doc.bookmarks.filter(bookmark => !bookmark.pageId || !removeIds.has(bookmark.pageId));
  doc.fields = doc.fields.filter(field => !removeIds.has(field.pageId));
  selectedPages.clear();
  currentPage = Math.min(currentPage, doc.pages.length - 1);
  markDirty();
  renderAll();
  setHint(`${removeIds.size} page${removeIds.size === 1 ? "" : "s"} deleted`, 1600);
}

function insertBlankPage(): void {
  const doc = currentDoc();
  const at =
    organizerOpen && selectedPages.size
      ? Math.max(...selectedPageList().map(page => doc.pages.indexOf(page))) + 1
      : currentPage + 1;
  pushHistory("Insert blank page");
  const page = createBlankPage();
  doc.pages.splice(at, 0, page);
  currentPage = at;
  markDirty();
  if (organizerOpen) {
    selectedPages = new Set([page.id]);
    renderOrganizer();
  }
  renderCanvas();
  renderSide();
  setHint("Blank page inserted", 1600);
}

function duplicateSelectedPages(): void {
  const doc = currentDoc();
  const targets = organizerOpen ? selectedPageList() : [doc.pages[currentPage]].filter(Boolean);
  if (!targets.length) return;
  pushHistory("Duplicate pages");
  const copies: Page[] = [];
  for (const page of targets) {
    const index = doc.pages.indexOf(page);
    const copy: Page = { ...page, id: nextId("page") };
    doc.pages.splice(index + 1 + copies.length, 0, copy);
    copies.push(copy);
  }
  selectedPages = new Set(copies.map(page => page.id));
  currentPage = doc.pages.indexOf(copies[0]);
  markDirty();
  renderOrganizer();
  renderCanvas();
  renderSide();
  setHint(`${copies.length} page${copies.length === 1 ? "" : "s"} duplicated`, 1600);
}

function moveSelectedPages(direction: 1 | -1): void {
  const doc = currentDoc();
  const selected = organizerOpen ? selectedPageList() : [doc.pages[currentPage]].filter(Boolean);
  if (!selected.length) return;
  const indexes = selected.map(page => doc.pages.indexOf(page)).sort((a, b) => (direction === 1 ? b - a : a - b));
  pushHistory(direction === 1 ? "Move pages later" : "Move pages earlier");
  let moved = 0;
  for (const index of indexes) {
    const target = index + direction;
    if (target < 0 || target >= doc.pages.length) continue;
    const page = doc.pages[index];
    doc.pages[index] = doc.pages[target];
    doc.pages[target] = page;
    moved += 1;
  }
  if (!moved) {
    undoStack.pop();
    toast(direction === 1 ? "Already at the end" : "Already at the start");
    return;
  }
  currentPage = doc.pages.indexOf(selected[0]);
  markDirty();
  renderOrganizer();
  renderCanvas();
  renderSide();
  setHint("Page order updated", 1600);
}

function selectedPageList(): Page[] {
  const doc = currentDoc();
  return doc.pages.filter(page => selectedPages.has(page.id));
}

/* ------------------------------------------------------------------ organizer */

function openOrganizer(): void {
  organizerOpen = true;
  if (!selectedPages.size) selectedPages = new Set([currentDoc().pages[currentPage]?.id].filter(Boolean));
  syncShellClasses();
  renderOrganizer();
  setHint("Organize pages · click to select, ⌘-click to add, drag to reorder", 3000);
}

function closeOrganizer(): void {
  organizerOpen = false;
  syncShellClasses();
  stageEl.classList.remove("is-organizing");
  organizerEl.hidden = true;
  goToPage(currentPage, false);
  renderSide();
  setHint("Organize pages closed", 1600);
}

function renderOrganizer(): void {
  if (!organizerOpen) {
    organizerEl.hidden = true;
    organizerEl.innerHTML = "";
    stageEl.classList.remove("is-organizing");
    return;
  }
  organizerEl.hidden = false;
  stageEl.classList.add("is-organizing");
  const doc = currentDoc();
  const selected = selectedPageList();
  organizerEl.innerHTML = `
    <div class="pf-org-toolbar">
      <div class="pf-org-status">
        ${icon("organize", 15)}
        <strong>${
          selected.length ? `${selected.length} page${selected.length === 1 ? "" : "s"} selected` : "Organize pages"
        }</strong>
        <span>Rotate, delete, insert or reorder, then close.</span>
      </div>
      <div class="pf-org-actions">
        <button type="button" class="pf-rail-btn" data-org="rotate-ccw" title="Rotate counter-clockwise">${icon(
          "rotate-ccw",
          16
        )}</button>
        <button type="button" class="pf-rail-btn" data-org="rotate-cw" title="Rotate clockwise">${icon(
          "rotate",
          16
        )}</button>
        <button type="button" class="pf-rail-btn" data-org="delete" title="Delete pages">${icon("trash", 16)}</button>
        <button type="button" class="pf-rail-btn" data-org="insert" title="Insert blank page">${icon(
          "insert",
          16
        )}</button>
        <button type="button" class="pf-rail-btn" data-org="duplicate" title="Duplicate pages">${icon(
          "duplicate",
          16
        )}</button>
        <span class="pf-org-sep"></span>
        <button type="button" class="pf-rail-btn" data-org="move-left" title="Move earlier">${icon(
          "move-left",
          16
        )}</button>
        <button type="button" class="pf-rail-btn" data-org="move-right" title="Move later">${icon(
          "move-right",
          16
        )}</button>
        <span class="pf-org-sep"></span>
        <button type="button" class="pf-rail-btn" data-org="extract" title="Extract selected pages">${icon(
          "export",
          16
        )}</button>
        <button type="button" class="pf-btn pf-btn-primary" data-org="done">Done</button>
        <button type="button" class="pf-icon-btn" data-org="close" title="Close organizer">${icon("close", 15)}</button>
      </div>
    </div>
    <div class="pf-org-grid" id="pf-org-grid">
      ${doc.pages
        .map(
          (page, index) => `<div class="pf-org-card${
            selectedPages.has(page.id) ? " is-selected" : ""
          }" data-org-page="${page.id}" draggable="true">
            <div class="pf-org-thumb">
              <div class="pf-thumb-frame" data-rot="${page.rotation}">
                <div class="pf-page-turn" style="--pf-rot:${page.rotation}deg">${renderPageContent(page, doc)}</div>
              </div>
              <span class="pf-org-index">${index + 1}</span>
              ${page.rotation ? `<span class="pf-org-rot">${page.rotation}°</span>` : ""}
            </div>
            <span class="pf-org-label">${escapeHTML(
              pageLabel(page) === page.title ? page.title : `${pageLabel(page)} · ${page.title}`
            )}</span>
          </div>`
        )
        .join("")}
    </div>
  `;
}

/* ------------------------------------------------------------------ forms */

/* ------------------------------------------------------------------ search */

const debouncedSearch = debounce(() => runSearch(true), 140);

function openFind(): void {
  findOpen = true;
  findbarEl.hidden = false;
  findInput.focus();
  findInput.select();
  if (searchQuery) runSearch(true);
}

function closeFind(): void {
  findOpen = false;
  findbarEl.hidden = true;
  searchQuery = "";
  clearSearchHighlights(pagesEl);
  hits = [];
  hitIndex = -1;
  updateFindbar();
  if (sideTab === "search") renderSide();
}

function runSearch(scrollToFirst: boolean): void {
  clearSearchHighlights(pagesEl);
  hits = [];
  hitIndex = -1;
  const query = searchQuery.trim();
  if (!query) {
    updateFindbar();
    if (sideTab === "search") renderSide();
    return;
  }
  const doc = currentDoc();
  doc.pages.forEach((page, index) => {
    const wrap = pagesEl.querySelector<HTMLElement>(`.pf-page-wrap[data-page-id="${page.id}"]`);
    if (wrap) highlightInPage(wrap, page.id, index, query, hits);
  });
  if (hits.length) {
    hitIndex = 0;
    hits[0].mark.classList.add("is-current");
    if (scrollToFirst) {
      const hitPage = hits[0].pageIndex;
      if (hitPage !== currentPage) {
        currentPage = hitPage;
        syncCurrentPageClasses();
        renderDock();
        renderStatus();
      }
      scrollToHit(hits[0].mark);
    }
  }
  updateFindbar();
  if (sideTab === "search" && sideOpen) renderSide();
}

function goToHit(direction: 1 | -1): void {
  if (!hits.length) return;
  hitIndex = (hitIndex + direction + hits.length) % hits.length;
  const hit = hits[hitIndex];
  clearCurrentHit(pagesEl);
  hit.mark.classList.add("is-current");
  currentPage = hit.pageIndex;
  syncCurrentPageClasses();
  renderDock();
  renderStatus();
  scrollToHit(hit.mark);
  updateFindbar();
  if (sideTab === "search" && sideOpen) renderSide();
}

function updateFindbar(): void {
  findCountEl.textContent = `${hits.length ? hitIndex + 1 : 0} / ${hits.length}`;
  if (!findbarEl.hidden && document.activeElement !== findInput) {
    /* keep the input's caret while typing */
  }
}

/* ------------------------------------------------------------------ comments */

function commentKindLabel(kind: CommentKind): string {
  if (kind === "highlight") return "Highlight";
  if (kind === "underline") return "Underline";
  if (kind === "textbox") return "Text box";
  return "Note";
}

function addComment(kind: CommentKind, options: { quote?: string; body?: string; pageId?: string } = {}): Comment {
  const doc = currentDoc();
  pushHistory(`Add ${commentKindLabel(kind).toLowerCase()}`);
  const comment: Comment = {
    id: nextId("comment"),
    pageId: options.pageId ?? doc.pages[currentPage].id,
    kind,
    author: "You",
    initials: "YO",
    date: nowStamp(),
    body: options.body ?? "",
    quote: options.quote,
    accent: "#b4552f",
    replies: []
  };
  doc.comments.push(comment);
  markDirty();
  renderCanvas();
  renderSide();
  renderBanner();
  renderToolsPanel();
  return comment;
}

function openCommentComposer(initial: { pageId: string; quote?: string }): void {
  openDialog({
    title: "Add comment",
    subtitle: "Comments are threaded and saved with the document.",
    width: 480,
    body: `
      ${initial.quote ? `<blockquote class="pf-dialog-quote">${escapeHTML(initial.quote)}</blockquote>` : ""}
      <label class="pf-field">
        <span>Comment</span>
        <textarea id="pf-comment-text" rows="3" placeholder="What should change?"></textarea>
      </label>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-comment-save>Add comment</button>`,
    onMount: (root, close) => {
      const textarea = root.querySelector<HTMLTextAreaElement>("#pf-comment-text");
      textarea?.focus();
      root.querySelector<HTMLElement>("[data-comment-save]")?.addEventListener("click", () => {
        const body = textarea?.value.trim() ?? "";
        addComment(initial.quote ? "highlight" : "note", {
          quote: initial.quote,
          body: body || "Reviewed.",
          pageId: initial.pageId
        });
        close();
        setSide("comments");
        toast("Comment added", "success");
      });
    }
  });
}

function jumpToComment(commentId: string): void {
  const doc = currentDoc();
  const comment = doc.comments.find(item => item.id === commentId);
  if (!comment) return;
  const index = pageIndexOf(comment.pageId);
  if (index < 0) return;
  goToPage(index);
  window.setTimeout(() => {
    const mark = pagesEl.querySelector<HTMLElement>(`[data-comment-id="${commentId}"]`);
    if (mark) {
      scrollToHit(mark);
      mark.classList.add("pf-annot-flash");
      window.setTimeout(() => mark.classList.remove("pf-annot-flash"), 1800);
    }
  }, 380);
}

function deleteComment(commentId: string): void {
  const doc = currentDoc();
  pushHistory("Delete comment");
  doc.comments = doc.comments.filter(comment => comment.id !== commentId);
  markDirty();
  renderCanvas();
  renderSide();
  renderBanner();
  renderToolsPanel();
  toast("Comment deleted");
}

/* ------------------------------------------------------------------ palette */

function paletteCommands(): PaletteCommand[] {
  const doc = currentDoc();
  const commands: PaletteCommand[] = [
    {
      id: "organize",
      label: "Organize pages",
      category: "Pages",
      keywords: "grid thumbnails reorder",
      run: openOrganizer
    },
    {
      id: "rotate-cw",
      label: "Rotate pages clockwise",
      category: "Pages",
      shortcut: "⌘R",
      run: () => rotateSelected(1)
    },
    {
      id: "rotate-ccw",
      label: "Rotate pages counter-clockwise",
      category: "Pages",
      shortcut: "⇧⌘R",
      run: () => rotateSelected(-1)
    },
    { id: "delete-pages", label: "Delete pages", category: "Pages", run: deleteSelectedPages },
    { id: "insert-blank", label: "Insert blank page", category: "Pages", run: insertBlankPage },
    { id: "duplicate", label: "Duplicate pages", category: "Pages", run: duplicateSelectedPages },
    { id: "extract", label: "Extract pages…", category: "Pages", run: () => openExtractDialog() },
    { id: "split", label: "Split document…", category: "Pages", run: () => openSplitDialog() },
    { id: "combine", label: "Combine files…", category: "Pages", run: () => openCombineDialog() },
    { id: "continuous", label: "Continuous layout", category: "View", run: () => setLayout("continuous") },
    { id: "single", label: "Single page layout", category: "View", run: () => setLayout("single") },
    { id: "two-up", label: "Two-up layout", category: "View", run: () => setLayout("two") },
    { id: "read-mode", label: "Read mode", category: "View", run: () => setPersona("read") },
    { id: "zoom-in", label: "Zoom in", category: "View", shortcut: "⌘+", run: () => zoomBy(0.1) },
    { id: "zoom-out", label: "Zoom out", category: "View", shortcut: "⌘−", run: () => zoomBy(-0.1) },
    { id: "fit-width", label: "Fit width", category: "View", shortcut: "⌘1", run: fitWidth },
    { id: "fit-page", label: "Fit page", category: "View", shortcut: "⌘9", run: fitPage },
    { id: "actual-size", label: "Actual size", category: "View", shortcut: "⌘0", run: zoomActual },
    {
      id: "theme",
      label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      category: "View",
      run: () => setTheme(theme === "dark" ? "light" : "dark")
    },
    { id: "find", label: "Find in document", category: "Edit", shortcut: "⌘F", run: openFind },
    {
      id: "undo",
      label: `Undo${undoStack.length ? ` ${undoStack[undoStack.length - 1].label}` : ""}`,
      category: "Edit",
      shortcut: "⌘Z",
      run: undo
    },
    {
      id: "redo",
      label: `Redo${redoStack.length ? ` ${redoStack[redoStack.length - 1].label}` : ""}`,
      category: "Edit",
      shortcut: "⇧⌘Z",
      run: redo
    },
    { id: "save", label: "Save", category: "File", shortcut: "⌘S", run: saveDocument },
    { id: "save-copy", label: "Save a copy…", category: "File", shortcut: "⇧⌘S", run: saveCopy },
    { id: "export", label: "Export a PDF…", category: "File", shortcut: "⇧⌘E", run: () => openExportDialog() },
    { id: "open", label: "Open document…", category: "File", shortcut: "⌘O", run: openOpenDialog },
    { id: "new-blank", label: "New blank document", category: "File", run: createBlankDocument },
    { id: "close-doc", label: "Close document", category: "File", shortcut: "⌘W", run: () => closeDoc(activeIndex) },
    { id: "properties", label: "Document properties…", category: "Document", run: openPropertiesDialog },
    { id: "protect", label: "Protect document…", category: "Document", run: openProtectDialog },
    { id: "compress", label: "Compress a PDF…", category: "Convert", run: openCompressDialog },
    { id: "redact", label: "Redact a PDF…", category: "Edit", run: openRedactDialog },
    { id: "scan", label: "Scan & OCR…", category: "Convert", run: openScanDialog },
    { id: "stamp", label: "Add a stamp…", category: "Edit", run: openStampDialog },
    { id: "certificate", label: "Use a certificate…", category: "Document", run: openCertificateDialog },
    {
      id: "fill-sign",
      label: "Fill & Sign",
      category: "Document",
      run: () => {
        goToPage(pageIndexOfFieldPage());
        setSide("fields");
        setTool("textbox");
      }
    },
    {
      id: "prepare-form",
      label: "Prepare a form",
      category: "Document",
      run: () => {
        goToPage(pageIndexOfFieldPage());
        setSide("fields");
        fieldHighlight = true;
        syncShellClasses();
        renderSide();
      }
    },
    { id: "comments", label: "Comments panel", category: "Panels", run: () => setSide("comments") },
    { id: "pages-panel", label: "Pages panel", category: "Panels", run: () => setSide("pages") },
    { id: "bookmarks-panel", label: "Bookmarks panel", category: "Panels", run: () => setSide("bookmarks") },
    { id: "layers-panel", label: "Layers panel", category: "Panels", run: () => setSide("layers") },
    { id: "fields-panel", label: "Fields panel", category: "Panels", run: () => setSide("fields") },
    {
      id: "highlight-fields",
      label: fieldHighlight ? "Hide form field highlight" : "Highlight form fields",
      category: "Document",
      run: toggleFieldHighlight
    },
    { id: "clear-form", label: "Clear form", category: "Document", run: clearForm },
    { id: "print", label: "Print…", category: "File", shortcut: "⌘P", run: openPrintDialog },
    { id: "preferences", label: "Preferences…", category: "View", run: openPreferencesDialog },
    { id: "shortcuts", label: "Keyboard shortcuts", category: "Help", shortcut: "?", run: openShortcutsDialog },
    { id: "about", label: "About PdfCraft", category: "Help", run: openAboutDialog }
  ];
  if (doc.pages.length) {
    commands.push({ id: "first-page", label: "Go to first page", category: "Pages", run: () => goToPage(0) });
    commands.push({
      id: "last-page",
      label: "Go to last page",
      category: "Pages",
      run: () => goToPage(doc.pages.length - 1)
    });
  }
  return commands;
}

function openPalette(): void {
  if (document.querySelector(".pf-palette-layer")) return;
  closePopups();
  const layer = document.createElement("div");
  layer.className = "pf-palette-layer";
  layer.innerHTML = `
    <div class="pf-palette" role="dialog" aria-label="Command palette">
      <div class="pf-palette-input">
        ${icon("search", 17)}
        <input id="pf-palette-input" type="text" placeholder="Search every tool and command" spellcheck="false" autocomplete="off" />
        <kbd>esc</kbd>
      </div>
      <div class="pf-palette-results" id="pf-palette-results"></div>
      <div class="pf-palette-foot"><span>↑↓ to navigate</span><span>↵ to run</span><span>⌘K anywhere</span></div>
    </div>
  `;
  document.body.appendChild(layer);
  const input = layer.querySelector<HTMLInputElement>("#pf-palette-input");
  const results = layer.querySelector<HTMLElement>("#pf-palette-results");
  if (!input || !results) return;
  const commands = paletteCommands();
  let filtered = commands;
  let cursor = 0;

  const renderResults = (): void => {
    results.innerHTML = filtered.length
      ? filtered
          .map(
            (command, index) => `<button type="button" class="pf-palette-item${
              index === cursor ? " is-active" : ""
            }" data-index="${index}">
              <span class="pf-palette-label">${escapeHTML(command.label)}</span>
              <span class="pf-palette-cat">${escapeHTML(command.category)}</span>
              ${command.shortcut ? `<kbd>${escapeHTML(command.shortcut)}</kbd>` : ""}
            </button>`
          )
          .join("")
      : `<div class="pf-palette-empty">No matching command</div>`;
  };

  const run = (command: PaletteCommand | undefined): void => {
    if (!command) return;
    close();
    command.run();
  };

  const close = (): void => {
    document.removeEventListener("keydown", onKey, true);
    layer.remove();
  };

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      cursor = Math.min(filtered.length - 1, cursor + 1);
      renderResults();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      cursor = Math.max(0, cursor - 1);
      renderResults();
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(filtered[cursor]);
    }
  };

  document.addEventListener("keydown", onKey, true);
  layer.addEventListener("mousedown", event => {
    if (event.target === layer) close();
  });
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    filtered = commands.filter(command =>
      `${command.label} ${command.category} ${command.keywords ?? ""}`.toLowerCase().includes(query)
    );
    cursor = 0;
    renderResults();
  });
  results.addEventListener("click", event => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
    if (!item) return;
    run(filtered[Number(item.dataset.index)]);
  });
  renderResults();
  input.focus();
}

/* ------------------------------------------------------------------ menus */

interface MenuSection {
  id: string;
  label: string;
  icon: IconName;
  items: () => PopupItem[];
}

function menus(): MenuSection[] {
  const undoLabel = undoStack.length ? `Undo ${undoStack[undoStack.length - 1].label}` : "Undo";
  const redoLabel = redoStack.length ? `Redo ${redoStack[redoStack.length - 1].label}` : "Redo";
  return [
    {
      id: "file",
      label: "File",
      icon: "file",
      items: () => [
        { label: "Open…", shortcut: "⌘O", action: openOpenDialog },
        { label: "Open recent", icon: "rotate-ccw", action: () => openRecentsPopup() },
        { separator: true },
        { label: "New blank document", action: createBlankDocument },
        { label: "Save", shortcut: "⌘S", action: saveDocument },
        { label: "Save a copy…", shortcut: "⇧⌘S", action: saveCopy },
        { label: "Export a PDF…", shortcut: "⇧⌘E", action: () => openExportDialog() },
        { separator: true },
        { label: "Print…", shortcut: "⌘P", action: openPrintDialog },
        { label: "Document properties…", action: openPropertiesDialog },
        { separator: true },
        { label: "Close document", shortcut: "⌘W", action: () => closeDoc(activeIndex) }
      ]
    },
    {
      id: "edit",
      label: "Edit",
      icon: "edit",
      items: () => [
        { label: undoLabel, shortcut: "⌘Z", disabled: !undoStack.length, action: undo },
        { label: redoLabel, shortcut: "⇧⌘Z", disabled: !redoStack.length, action: redo },
        { separator: true },
        { label: "Find in document", shortcut: "⌘F", action: openFind },
        { label: "Find next", shortcut: "⌘G", action: () => goToHit(1) },
        { label: "Find previous", shortcut: "⇧⌘G", action: () => goToHit(-1) },
        { separator: true },
        { label: "Add comment…", action: () => openCommentComposer({ pageId: currentDoc().pages[currentPage].id }) },
        { label: "Select all text", action: selectAllPageText }
      ]
    },
    {
      id: "view",
      label: "View",
      icon: "eye",
      items: () => [
        ...LAYOUTS.map(item => ({
          label: item.label,
          checked: layout === item.id,
          action: () => setLayout(item.id)
        })),
        { separator: true },
        {
          label: "Read mode",
          checked: persona === "read",
          action: () => setPersona(persona === "read" ? "all" : "read")
        },
        { label: "Zoom in", shortcut: "⌘+", action: () => zoomBy(0.1) },
        { label: "Zoom out", shortcut: "⌘−", action: () => zoomBy(-0.1) },
        { label: "Actual size", shortcut: "⌘0", action: zoomActual },
        { label: "Fit width", shortcut: "⌘1", action: fitWidth },
        { label: "Fit page", shortcut: "⌘9", action: fitPage },
        { separator: true },
        { label: "Tools panel", checked: toolsOpen, action: toggleToolsPanel },
        { label: "Side panel", checked: sideOpen, shortcut: "F4", action: toggleSidePanel },
        {
          label: theme === "dark" ? "Use light theme" : "Use dark theme",
          icon: theme === "dark" ? "sun" : "moon",
          action: () => setTheme(theme === "dark" ? "light" : "dark")
        }
      ]
    },
    {
      id: "document",
      label: "Document",
      icon: "pages",
      items: () => [
        { label: "Organize pages", icon: "organize", action: openOrganizer },
        { label: "Insert blank page", icon: "insert", action: insertBlankPage },
        { label: "Duplicate page", icon: "duplicate", action: duplicateSelectedPages },
        { label: "Rotate clockwise", icon: "rotate", action: () => rotateSelected(1) },
        { label: "Rotate counter-clockwise", icon: "rotate-ccw", action: () => rotateSelected(-1) },
        { label: "Delete page", icon: "trash", action: deleteSelectedPages },
        { separator: true },
        { label: "Extract pages…", action: () => openExtractDialog() },
        { label: "Split document…", action: () => openSplitDialog() },
        { label: "Combine files…", action: () => openCombineDialog() },
        { separator: true },
        { label: "Add comments", checked: sideTab === "comments" && sideOpen, action: () => setSide("comments") },
        { label: "Form fields", checked: sideTab === "fields" && sideOpen, action: () => setSide("fields") },
        { label: "Bookmarks", checked: sideTab === "bookmarks" && sideOpen, action: () => setSide("bookmarks") },
        { label: "Layers", checked: sideTab === "layers" && sideOpen, action: () => setSide("layers") },
        { separator: true },
        { label: "Document properties…", icon: "info", action: openPropertiesDialog },
        { label: "Protect document…", icon: "protect", action: openProtectDialog },
        { label: "Compress…", icon: "compress", action: openCompressDialog }
      ]
    },
    {
      id: "pages",
      label: "Pages",
      icon: "pages",
      items: () => [
        { label: "Organize pages", checked: organizerOpen, action: openOrganizer },
        { label: "Go to first page", action: () => goToPage(0) },
        { label: "Go to last page", action: () => goToPage(currentDoc().pages.length - 1) },
        { separator: true },
        { label: "Extract pages…", action: () => openExtractDialog() },
        { label: "Split document…", action: () => openSplitDialog() },
        { label: "Combine files…", action: () => openCombineDialog() },
        { separator: true },
        { label: "Insert blank page", action: insertBlankPage },
        { label: "Move earlier", action: () => moveSelectedPages(-1) },
        { label: "Move later", action: () => moveSelectedPages(1) }
      ]
    },
    {
      id: "help",
      label: "Help",
      icon: "help",
      items: () => [
        { label: "Keyboard shortcuts", shortcut: "?", action: openShortcutsDialog },
        { label: "Navigation guide", icon: "info", action: openGuideDialog },
        { label: "Preferences…", icon: "settings", action: openPreferencesDialog },
        { separator: true },
        { label: "About PdfCraft", icon: "logo", action: openAboutDialog }
      ]
    }
  ];
}

function openMenuSections(anchor: HTMLElement): void {
  const rect = anchor.getBoundingClientRect();
  const sections = menus();
  openPopup(
    rect.left,
    rect.bottom + 4,
    sections.map(section => ({
      label: section.label,
      icon: section.icon,
      action: () => openSectionMenu(section, rect.left, rect.bottom + 4)
    })),
    anchor
  );
}

function openSectionMenu(section: MenuSection, x: number, y: number): void {
  openPopup(x + 8, y + 4, section.items());
}

function openRecentsPopup(): void {
  const anchor = document.querySelector<HTMLElement>("#pf-recents");
  if (!anchor) return;
  openPopupAt(anchor, [
    { label: "pdfcraft-showcase.pdf", icon: "file", action: () => openBundledDoc("showcase") },
    { label: "field-notes.pdf", icon: "file", action: () => openBundledDoc("notes") },
    { separator: true },
    { label: "New blank document", icon: "create", action: createBlankDocument }
  ]);
}

/* ------------------------------------------------------------------ dialogs */

function openOpenDialog(): void {
  openDialog({
    title: "Open a document",
    subtitle: "This demo ships two generated documents; a production build reads local PDF files.",
    width: 560,
    body: `
      <div class="pf-open-list">
        <button type="button" class="pf-open-row" data-open-doc="showcase">
          <span class="pf-open-icon">${icon("file", 18)}</span>
          <span><strong>pdfcraft-showcase.pdf</strong><em>13 pages · typography specimen · 14 comments</em></span>
          <span class="pf-open-badge">Bundled</span>
        </button>
        <button type="button" class="pf-open-row" data-open-doc="notes">
          <span class="pf-open-icon">${icon("file", 18)}</span>
          <span><strong>field-notes.pdf</strong><em>4 pages · checklist, invoice and sign-off</em></span>
          <span class="pf-open-badge">Bundled</span>
        </button>
        <button type="button" class="pf-open-row is-disabled" disabled>
          <span class="pf-open-icon">${icon("folder", 18)}</span>
          <span><strong>Import a PDF…</strong><em>Not part of the LiteGUI demo build</em></span>
        </button>
      </div>
      <p class="pf-dialog-text">Opening a bundled document adds a tab. Edits stay in the tab until you
      close it; “Save” writes the document to browser storage.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-new-doc>New blank document</button>`,
    onMount: (root, close) => {
      root.querySelectorAll<HTMLElement>("[data-open-doc]").forEach(button => {
        button.addEventListener("click", () => {
          close();
          openBundledDoc(button.dataset.openDoc === "notes" ? "notes" : "showcase");
        });
      });
      root.querySelector("[data-new-doc]")?.addEventListener("click", () => {
        close();
        createBlankDocument();
      });
    }
  });
}

function openExportDialog(): void {
  const doc = currentDoc();
  const size = estimateSize(doc);
  openDialog({
    title: "Export a PDF",
    subtitle: `${doc.name} · ${doc.pages.length} pages`,
    width: 560,
    body: `
      <div class="pf-export-preview">
        <span class="pf-export-icon">${icon("export", 22)}</span>
        <div><strong>${escapeHTML(doc.name)}</strong><em>US Letter · ${doc.pages.length} pages · ${size}</em></div>
      </div>
      <label class="pf-field"><span>Pages</span><input id="pf-export-range" type="text" value="1-${
        doc.pages.length
      }" /></label>
      <label class="pf-field"><span>Content</span>
        <select id="pf-export-content">
          <option value="text">Text-only reader’s copy</option>
          <option value="text-art">Text and page decoration</option>
        </select>
      </label>
      <p class="pf-dialog-text">The export writes a real, valid PDF: arranged page order, rotation,
      metadata and page numbers are preserved. Rich magazine artwork is reduced to its text on this build.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-export>Export</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-export]")?.addEventListener("click", () => {
        const range = root.querySelector<HTMLInputElement>("#pf-export-range")?.value ?? "";
        const selected = parsePageRange(range, doc.pages.length);
        if (!selected.length) {
          toast("That page range selects nothing", "warning");
          return;
        }
        const pages = selected.map(index => exportPageFor(doc, index));
        const bytes = buildPdf(pages, doc.meta);
        const filename = doc.name.replace(/\.pdf$/i, "") + "-export.pdf";
        downloadPdf(filename, bytes);
        close();
        toast(`Exported ${pages.length} page${pages.length === 1 ? "" : "s"} as ${filename}`, "success");
      });
    }
  });
}

function exportPageFor(doc: PdfDoc, index: number): ExportPage {
  const page = doc.pages[index];
  const holder = document.createElement("div");
  holder.innerHTML = renderPageContent(page, doc);
  const cover = page.kind === "cover";
  const blocks = Array.from(
    holder.querySelectorAll<HTMLElement>(
      ".pg-body p, .pg-body li, .pg-body h2, .pg-body td, .pg-body figcaption, .pg-body .pg-eq-body, .pg-body .pg-caption, .pg-body .pg-script-sample"
    )
  );
  const lines = blocks
    .map(block => (block.textContent ?? "").replace(/\s+/g, " ").trim())
    .filter(text => text.length > 1);
  return {
    widthPt: 612,
    heightPt: 792,
    rotation: page.rotation,
    title: cover ? "PdfCraft Showcase" : page.title,
    subtitle: cover ? "A tour of the page, glyph by glyph." : page.section,
    lines: cover ? [] : lines,
    dark: cover
  };
}

function estimateSize(doc: PdfDoc): string {
  const text = doc.pages.length * 2200 + doc.comments.length * 180;
  return `${(text / 1024).toFixed(1)} KB approx.`;
}

function parsePageRange(input: string, total: number): number[] {
  const result = new Set<number>();
  for (const part of input.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(chunk);
    if (range) {
      const start = Math.max(1, Number(range[1]));
      const end = Math.min(total, Number(range[2]));
      for (let page = start; page <= end; page += 1) result.add(page - 1);
      continue;
    }
    const single = Number(chunk);
    if (Number.isFinite(single) && single >= 1 && single <= total) result.add(single - 1);
  }
  return Array.from(result).sort((a, b) => a - b);
}

function openExtractDialog(preselected: Page[] = []): void {
  const doc = currentDoc();
  const initial = preselected.length
    ? preselected.map(page => doc.pages.indexOf(page) + 1).join(",")
    : selectedPages.size
    ? selectedPageList()
        .map(page => doc.pages.indexOf(page) + 1)
        .join(",")
    : `${currentPage + 1}`;
  openDialog({
    title: "Extract pages",
    subtitle: "Copies pages into a new document; the original stays untouched.",
    width: 520,
    body: `
      <label class="pf-field"><span>Pages</span><input id="pf-extract-range" type="text" value="${escapeHTML(
        initial
      )}" /></label>
      <p class="pf-hint-text" id="pf-extract-preview"></p>
      <label class="pf-field"><span>Name</span><input id="pf-extract-name" type="text" value="${escapeHTML(
        doc.name.replace(/\.pdf$/i, "")
      )}-extract.pdf" /></label>
      <p class="pf-dialog-text">Links, comments and form values are remapped to the copied pages.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-extract>Extract</button>`,
    onMount: (root, close) => {
      const range = root.querySelector<HTMLInputElement>("#pf-extract-range");
      const preview = root.querySelector<HTMLElement>("#pf-extract-preview");
      const update = (): void => {
        const count = parsePageRange(range?.value ?? "", doc.pages.length).length;
        if (preview) preview.textContent = `${count} page${count === 1 ? "" : "s"} selected`;
      };
      range?.addEventListener("input", update);
      update();
      root.querySelector<HTMLElement>("[data-extract]")?.addEventListener("click", () => {
        const indexes = parsePageRange(range?.value ?? "", doc.pages.length);
        if (!indexes.length) {
          toast("Select at least one page", "warning");
          return;
        }
        const name = root.querySelector<HTMLInputElement>("#pf-extract-name")?.value.trim() || "extract.pdf";
        const pages = indexes.map(index => doc.pages[index]);
        const derived = deriveDoc(doc, pages, name.endsWith(".pdf") ? name : `${name}.pdf`);
        close();
        addDocument(derived, `${pages.length} pages extracted`);
      });
    }
  });
}

function openSplitDialog(): void {
  const doc = currentDoc();
  openDialog({
    title: "Split document",
    subtitle: `${doc.name} · ${doc.pages.length} pages`,
    width: 540,
    body: `
      <label class="pf-field"><span>Split every</span><input id="pf-split-every" type="number" min="1" max="${doc.pages.length}" value="4" /></label>
      <p class="pf-hint-text" id="pf-split-preview"></p>
      <p class="pf-dialog-text">Each part becomes its own document tab, in page order. “Split every page”
      makes a file per page — the reference app’s one-page-per-file case.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-split>Split</button>`,
    onMount: (root, close) => {
      const input = root.querySelector<HTMLInputElement>("#pf-split-every");
      const preview = root.querySelector<HTMLElement>("#pf-split-preview");
      const update = (): void => {
        const every = Math.max(1, Math.min(doc.pages.length, Number(input?.value) || 1));
        const parts = Math.ceil(doc.pages.length / every);
        if (preview)
          preview.textContent = `Creates ${parts} file${parts === 1 ? "" : "s"} from ${doc.pages.length} pages`;
      };
      input?.addEventListener("input", update);
      update();
      root.querySelector<HTMLElement>("[data-split]")?.addEventListener("click", () => {
        const every = Math.max(1, Math.min(doc.pages.length, Number(input?.value) || 1));
        const parts: PdfDoc[] = [];
        for (let start = 0; start < doc.pages.length; start += every) {
          const slice = doc.pages.slice(start, start + every);
          const name = `${doc.name.replace(/\.pdf$/i, "")}-part-${parts.length + 1}.pdf`;
          parts.push(deriveDoc(doc, slice, name));
        }
        close();
        parts.forEach(part => docs.push(part));
        activeIndex = docs.length - 1;
        currentPage = 0;
        renderAll();
        toast(`${parts.length} part${parts.length === 1 ? "" : "s"} created`, "success");
      });
    }
  });
}

function openCombineDialog(): void {
  openDialog({
    title: "Combine files",
    subtitle: "Merge open documents into one, keeping each file’s bookmarks and comments.",
    width: 560,
    body: `<div class="pf-combine-list">
      ${docs
        .map(
          (doc, index) => `<label class="pf-combine-row">
            <input type="checkbox" data-combine="${index}" checked />
            <span>${icon("file", 16)} <strong>${escapeHTML(doc.name)}</strong></span>
            <em>${doc.pages.length} pages</em>
          </label>`
        )
        .join("")}
    </div>
    <p class="pf-dialog-text">The combined document is a new tab; nothing is removed from the originals.</p>`,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-combine-go>Combine</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-combine-go]")?.addEventListener("click", () => {
        const picks = Array.from(root.querySelectorAll<HTMLInputElement>("[data-combine]:checked")).map(input =>
          Number(input.dataset.combine)
        );
        if (picks.length < 1) {
          toast("Choose at least one file", "warning");
          return;
        }
        const pages: Page[] = [];
        const comments: Comment[] = [];
        const bookmarks: PdfDoc["bookmarks"] = [];
        const fields: FieldDef[] = [];
        const values: PdfDoc["values"] = {};
        for (const index of picks) {
          const source = docs[index];
          const derived = deriveDoc(source, source.pages, source.name);
          pages.push(...derived.pages);
          comments.push(...derived.comments);
          fields.push(...derived.fields);
          Object.assign(values, derived.values);
          const first = derived.pages[0]?.id;
          bookmarks.push({ id: nextId("bm"), title: source.name.replace(/\.pdf$/i, ""), pageId: first, depth: 0 });
          bookmarks.push(...derived.bookmarks.map(bookmark => ({ ...bookmark, depth: bookmark.depth + 1 })));
        }
        const combined: PdfDoc = {
          id: nextId("doc"),
          name: "combined.pdf",
          pages,
          comments,
          bookmarks,
          fields,
          values,
          meta: { title: "combined", author: "PdfCraft Studio", subject: "Combined files", keywords: "combined" },
          dirty: true
        };
        close();
        addDocument(combined, `${picks.length} files combined`);
      });
    }
  });
}

function openPropertiesDialog(): void {
  const doc = currentDoc();
  const fonts = [
    ["Display", "Spectral / serif", "system"],
    ["Text", "EB Garamond / serif", "system"],
    ["Mono", "JetBrains Mono", "embedded"],
    ["Math", "STIX Two Math", "system"]
  ];
  openDialog({
    title: "Document properties",
    subtitle: doc.name,
    width: 600,
    body: `
      <div class="pf-tabs-strip" role="tablist">
        <button type="button" class="pf-tab-strip-btn is-active" data-prop-tab="description">Description</button>
        <button type="button" class="pf-tab-strip-btn" data-prop-tab="fonts">Fonts</button>
        <button type="button" class="pf-tab-strip-btn" data-prop-tab="security">Security</button>
      </div>
      <div class="pf-prop-pane" data-pane="description">
        <label class="pf-field"><span>Title</span><input id="pf-meta-title" type="text" value="${escapeHTML(
          doc.meta.title
        )}" /></label>
        <label class="pf-field"><span>Author</span><input id="pf-meta-author" type="text" value="${escapeHTML(
          doc.meta.author
        )}" /></label>
        <label class="pf-field"><span>Subject</span><input id="pf-meta-subject" type="text" value="${escapeHTML(
          doc.meta.subject
        )}" /></label>
        <label class="pf-field"><span>Keywords</span><input id="pf-meta-keywords" type="text" value="${escapeHTML(
          doc.meta.keywords
        )}" /></label>
      </div>
      <div class="pf-prop-pane" data-pane="fonts" hidden>
        <table class="pf-props-table"><thead><tr><th>Role</th><th>Font</th><th>Status</th></tr></thead><tbody>
        ${fonts.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}
        </tbody></table>
        <p class="pf-dialog-text">PDF version 1.7 · 13 pages · tagged PDF · US Letter 612 × 792 pt.</p>
      </div>
      <div class="pf-prop-pane" data-pane="security" hidden>
        <div class="pf-security-row"><span>Encryption</span><strong>Not encrypted</strong></div>
        <div class="pf-security-row"><span>Owner password</span><strong>None</strong></div>
        <div class="pf-security-row"><span>Permissions</span><strong>Printing, copying, comments</strong></div>
        <p class="pf-dialog-text">Protect the document to set a user password and restrict editing.</p>
      </div>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-ghost" data-prop-protect>Protect…</button>
      <button type="button" class="pf-btn pf-btn-primary" data-prop-save>Save</button>`,
    onMount: (root, close) => {
      root.querySelectorAll<HTMLElement>("[data-prop-tab]").forEach(tab => {
        tab.addEventListener("click", () => {
          root.querySelectorAll(".pf-tab-strip-btn").forEach(node => node.classList.remove("is-active"));
          tab.classList.add("is-active");
          root.querySelectorAll<HTMLElement>("[data-pane]").forEach(pane => {
            pane.hidden = pane.dataset.pane !== tab.dataset.propTab;
          });
        });
      });
      root.querySelector("[data-prop-protect]")?.addEventListener("click", () => {
        close();
        openProtectDialog();
      });
      root.querySelector<HTMLElement>("[data-prop-save]")?.addEventListener("click", () => {
        pushHistory("Edit document properties");
        doc.meta.title = root.querySelector<HTMLInputElement>("#pf-meta-title")?.value ?? doc.meta.title;
        doc.meta.author = root.querySelector<HTMLInputElement>("#pf-meta-author")?.value ?? doc.meta.author;
        doc.meta.subject = root.querySelector<HTMLInputElement>("#pf-meta-subject")?.value ?? doc.meta.subject;
        doc.meta.keywords = root.querySelector<HTMLInputElement>("#pf-meta-keywords")?.value ?? doc.meta.keywords;
        markDirty();
        close();
        toast("Document properties saved", "success");
      });
    }
  });
}

function openProtectDialog(): void {
  openDialog({
    title: "Protect with a password",
    subtitle: "The demo records the choice; the exported file stays unencrypted.",
    width: 520,
    body: `
      <label class="pf-field"><span>User password</span><input id="pf-password" type="password" placeholder="Required to open" /></label>
      <label class="pf-field"><span>Confirm</span><input id="pf-password-2" type="password" placeholder="Repeat the password" /></label>
      <div class="pf-perms">
        <label><input type="checkbox" checked /> Allow printing</label>
        <label><input type="checkbox" checked /> Allow copying text</label>
        <label><input type="checkbox" /> Allow commenting</label>
        <label><input type="checkbox" /> Allow form filling</label>
      </div>
      <p class="pf-dialog-text">A production build would use AES-256 and honour author permissions;
      this LiteGUI demo keeps the flag on the document.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-protect-save>Set password</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-protect-save]")?.addEventListener("click", () => {
        const first = root.querySelector<HTMLInputElement>("#pf-password")?.value ?? "";
        const second = root.querySelector<HTMLInputElement>("#pf-password-2")?.value ?? "";
        if (!first) {
          toast("Enter a password first", "warning");
          return;
        }
        if (first !== second) {
          toast("The passwords do not match", "warning");
          return;
        }
        markDirty();
        close();
        toast("Protection set on the document", "success");
      });
    }
  });
}

function openCompressDialog(): void {
  openDialog({
    title: "Compress a PDF",
    subtitle: currentDoc().name,
    width: 500,
    body: `
      <label class="pf-field"><span>Image quality</span>
        <select id="pf-compress-quality">
          <option value="high">High · keep colours</option>
          <option value="balanced" selected>Balanced · recommended</option>
          <option value="small">Small · 96 dpi, aggressive</option>
        </select>
      </label>
      <div class="pf-compare">
        <div><span>Before</span><strong>${estimateSize(currentDoc())}</strong></div>
        <div><span>After</span><strong>~ 812 KB</strong></div>
        <div><span>Saved</span><strong>64%</strong></div>
      </div>
      <p class="pf-dialog-text">Compression keeps text, links and form fields; only image streams are
      re-encoded. This build previews the size without rewriting the file.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-compress>Compress</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-compress]")?.addEventListener("click", () => {
        close();
        markDirty();
        toast("Compression preview applied — no bytes changed in this demo", "success");
      });
    }
  });
}

function openScanDialog(): void {
  openDialog({
    title: "Scan & OCR",
    subtitle: "Recognise text in a scanned page and make it searchable.",
    width: 540,
    body: `
      <div class="pf-empty pf-empty-inline">
        ${icon("scan", 30)}
        <p>OCR is not part of this browser demo.</p>
        <span>The fields on page 10 are live, so you can still try tabbing through a real form.</span>
      </div>
      <label class="pf-field"><span>Language</span><select><option>English</option><option>German</option><option>Japanese</option></select></label>
      <div class="pf-compare"><div><span>Pages</span><strong>${
        currentDoc().pages.length
      }</strong></div><div><span>Engine</span><strong>Built-in</strong></div><div><span>Output</span><strong>Searchable PDF</strong></div></div>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-primary" data-dialog-close>Close</button>`
  });
}

function openRedactDialog(): void {
  openDialog({
    title: "Redact a PDF",
    subtitle: "Remove content permanently, not just cover it.",
    width: 520,
    body: `<p class="pf-dialog-text">Redaction removes the pixels and the text underneath. Drawing a black
    bar over a line leaves the text extractable, which is why the workbench treats redaction as a
    document operation rather than an annotation.</p>
    <div class="pf-callout">${icon("info", 16)} <span>The demo can mark a region but does not rewrite
    the content streams.</span></div>`,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-redact>Mark for redaction</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-redact]")?.addEventListener("click", () => {
        close();
        markDirty();
        toast("Region marked — redaction is a study in this demo");
      });
    }
  });
}

function openStampDialog(): void {
  openDialog({
    title: "Add a stamp",
    subtitle: `Page ${currentPage + 1} · ${currentDoc().pages[currentPage].title}`,
    width: 480,
    body: `<div class="pf-stamp-grid">
      ${["APPROVED", "REVIEWED", "DRAFT", "CONFIDENTIAL"]
        .map(stamp => `<button type="button" class="pf-stamp-choice" data-stamp="${stamp}">${stamp}</button>`)
        .join("")}
    </div>
    <p class="pf-dialog-text">Stamps are annotations, not part of the page content, so they can be
    switched off with the annotation layer.</p>`,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>`,
    onMount: (root, close) => {
      root.querySelectorAll<HTMLElement>("[data-stamp]").forEach(button => {
        button.addEventListener("click", () => {
          addComment("textbox", {
            pageId: currentDoc().pages[currentPage].id,
            body: `Stamp: ${button.dataset.stamp}`
          });
          close();
          setSide("comments");
          toast(`${button.dataset.stamp} stamp added`, "success");
        });
      });
    }
  });
}

function openCertificateDialog(): void {
  openDialog({
    title: "Use a certificate",
    subtitle: "Sign the document with a digital certificate.",
    width: 500,
    body: `<div class="pf-empty pf-empty-inline">${icon("certificate", 30)}<p>No certificate is
    configured in this demo.</p><span>A desktop build reads the OS certificate store; the browser
    demo stops at the form and signature fields on page 10.</span></div>`,
    footer: `<button type="button" class="pf-btn pf-btn-primary" data-dialog-close>Close</button>`
  });
}

function openPrintDialog(): void {
  openDialog({
    title: "Print",
    subtitle: currentDoc().name,
    width: 500,
    body: `
      <label class="pf-field"><span>Pages</span><input id="pf-print-range" type="text" value="1-${
        currentDoc().pages.length
      }" /></label>
      <label class="pf-field"><span>Scale</span><select><option>Fit to printable area</option><option>Actual size</option></select></label>
      <div class="pf-compare"><div><span>Paper</span><strong>US Letter</strong></div><div><span>Layout</span><strong>${
        layout === "two" ? "Two-up" : "One page"
      }</strong></div><div><span>Copies</span><strong>1</strong></div></div>
      <p class="pf-dialog-text">Printing from a browser demo opens the system dialog. The PDF export
      path is the reliable way to produce a file.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-print-export>Export instead</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-print-export]")?.addEventListener("click", () => {
        close();
        openExportDialog();
      });
    }
  });
}

function openPreferencesDialog(): void {
  openDialog({
    title: "Preferences",
    subtitle: "Settings are local to this demo session.",
    width: 520,
    body: `
      <label class="pf-field"><span>Appearance</span>
        <select id="pf-pref-theme"><option value="light"${
          theme === "light" ? " selected" : ""
        }>Light</option><option value="dark"${theme === "dark" ? " selected" : ""}>Dark</option></select>
      </label>
      <label class="pf-field"><span>Default layout</span>
        <select id="pf-pref-layout">${LAYOUTS.map(
          item => `<option value="${item.id}"${layout === item.id ? " selected" : ""}>${item.label}</option>`
        ).join("")}</select>
      </label>
      <label class="pf-field pf-check-field"><input id="pf-pref-banner" type="checkbox"${
        bannerDismissed ? " checked" : ""
      } /> <span>Hide the form-field banner</span></label>
      <p class="pf-dialog-text">Preferences affect panels and rendering only; the document is untouched.</p>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-dialog-close>Cancel</button>
      <button type="button" class="pf-btn pf-btn-primary" data-pref-save>Apply</button>`,
    onMount: (root, close) => {
      root.querySelector<HTMLElement>("[data-pref-save]")?.addEventListener("click", () => {
        const nextTheme = root.querySelector<HTMLSelectElement>("#pf-pref-theme")?.value;
        const nextLayout = root.querySelector<HTMLSelectElement>("#pf-pref-layout")?.value;
        bannerDismissed = root.querySelector<HTMLInputElement>("#pf-pref-banner")?.checked ?? bannerDismissed;
        if (nextTheme === "dark" || nextTheme === "light") setTheme(nextTheme);
        if (nextLayout === "continuous" || nextLayout === "single" || nextLayout === "two") setLayout(nextLayout);
        renderBanner();
        close();
        toast("Preferences applied", "success");
      });
    }
  });
}

function openShortcutsDialog(): void {
  const rows: Array<[string, string]> = [
    ["⌘K / Ctrl K", "Command palette"],
    ["⌘F / Ctrl F", "Find in document"],
    ["⌘G / ⇧⌘G", "Next / previous match"],
    ["⌘S / ⇧⌘S", "Save / save a copy"],
    ["⌘Z / ⇧⌘Z", "Undo / redo"],
    ["⌘O", "Open a document"],
    ["⌘W", "Close the current document"],
    ["⌘+ / ⌘−", "Zoom in / out"],
    ["⌘0 / ⌘1 / ⌘9", "Actual size / fit width / fit page"],
    ["V · H · T · S", "Select · hand · text · snapshot"],
    ["X · U · D · E", "Text box · highlight · draw · erase"],
    ["F4", "Toggle the side panel"],
    ["⇧F4", "Toggle the tools panel"],
    ["Esc", "Close menus, palette and find"],
    ["PageUp / PageDown", "Previous / next page"]
  ];
  openDialog({
    title: "Keyboard shortcuts",
    width: 560,
    body: `<table class="pf-shortcut-table"><tbody>${rows
      .map(row => `<tr><td><kbd>${row[0]}</kbd></td><td>${row[1]}</td></tr>`)
      .join("")}</tbody></table>`,
    footer: `<button type="button" class="pf-btn pf-btn-primary" data-dialog-close>Done</button>`
  });
}

function openGuideDialog(): void {
  openDialog({
    title: "Navigation guide",
    width: 540,
    body: `
      <div class="pf-guide">
        <p><strong>Read.</strong> Continuous, single-page and two-up layouts; Read mode hides the
        panels and fits the pages side by side.</p>
        <p><strong>Find.</strong> Type in the find bar: every match is highlighted in the page, and
        ⌘G steps through them in reading order.</p>
        <p><strong>Comment.</strong> Select text on a page to get the popover. Highlights are anchored
        to the exact phrase and survive page reordering.</p>
        <p><strong>Organize.</strong> The grid lets you rotate, delete, insert, duplicate and drag pages.
        Every change is one undo step.</p>
        <p><strong>Export.</strong> “Export a PDF” builds a real PDF with the current page order and
        rotation.</p>
      </div>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-primary" data-dialog-close>Close</button>`
  });
}

function openAboutDialog(): void {
  openDialog({
    title: "About PdfCraft",
    width: 520,
    body: `
      <div class="pf-about">
        <span class="pf-about-mark">◼</span>
        <h3>PdfCraft <em>for LiteGUI</em></h3>
        <p>A PDF workbench study built with LiteGUI: read, search, organize, comment, split, combine and
        export a specimen document — all rendered in the browser with no PDF engine.</p>
        <p class="pf-about-fine">Design reference: <a href="https://getartcraft.com/apps/pdfcraft" target="_blank" rel="noreferrer">PdfCraft</a>
        by ArtCraft (open source, MIT/Apache-2.0). This is an independent LiteGUI demo, not an official
        PdfCraft build; the showcase pages are original and generated procedurally.</p>
        <div class="pf-about-meta"><span>Version 0.1.0 · demo</span><span>US Letter · 13 pages</span></div>
      </div>
    `,
    footer: `<button type="button" class="pf-btn pf-btn-ghost" data-about-shortcuts>Keyboard shortcuts</button>
      <button type="button" class="pf-btn pf-btn-primary" data-dialog-close>Close</button>`,
    onMount: (root, close) => {
      root.querySelector("[data-about-shortcuts]")?.addEventListener("click", () => {
        close();
        openShortcutsDialog();
      });
    }
  });
}

/* ------------------------------------------------------------------ toggles */

function toggleToolsPanel(): void {
  toolsOpen = !toolsOpen;
  if (toolsOpen && persona === "read") persona = "all";
  syncShellClasses();
  renderToolsPanel();
  renderPersonas();
}

function toggleSidePanel(): void {
  sideOpen = !sideOpen;
  syncShellClasses();
  renderSide();
}

function toggleFieldHighlight(): void {
  fieldHighlight = !fieldHighlight;
  syncShellClasses();
  renderBanner();
  renderSide();
  setHint(fieldHighlight ? "Form fields highlighted" : "Form field highlight off", 1600);
}

function clearForm(): void {
  const doc = currentDoc();
  pushHistory("Clear form");
  for (const field of doc.fields) {
    doc.values[field.id] =
      field.type === "checkbox" || field.type === "radio"
        ? false
        : field.type === "select"
        ? field.options?.[0] ?? ""
        : "";
  }
  markDirty();
  renderCanvas();
  renderSide();
  toast("Form cleared", "success");
}

function selectAllPageText(): void {
  const wrap = pagesEl.querySelector<HTMLElement>(`.pf-page-wrap[data-page-index="${currentPage}"] .pg-body`);
  if (!wrap) return;
  const range = document.createRange();
  range.selectNodeContents(wrap);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/* ------------------------------------------------------------------ selection popover */

let selectionPop: HTMLElement | null = null;

function closeSelectionPopover(): void {
  selectionPop?.remove();
  selectionPop = null;
}

function openSelectionPopover(text: string, pageId: string, rect: DOMRect): void {
  closeSelectionPopover();
  const pop = document.createElement("div");
  pop.className = "pf-selpop";
  pop.innerHTML = `
    <button type="button" data-sel="highlight"><span class="pf-sel-swatch is-yellow"></span>Highlight</button>
    <button type="button" data-sel="underline"><span class="pf-sel-swatch is-blue"></span>Underline</button>
    <button type="button" data-sel="note">${icon("comment", 14)} Note</button>
    <button type="button" data-sel="copy">${icon("copy", 14)} Copy</button>
  `;
  document.body.appendChild(pop);
  const width = pop.offsetWidth;
  const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.left + rect.width / 2 - width / 2));
  const top = rect.top > 76 ? rect.top - pop.offsetHeight - 10 : rect.bottom + 10;
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
  selectionPop = pop;

  pop.addEventListener("click", event => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-sel]");
    if (!button) return;
    const action = button.dataset.sel;
    if (action === "copy") {
      void navigator.clipboard?.writeText(text).catch(() => undefined);
      toast("Copied to the clipboard");
    } else if (action === "note") {
      window.getSelection()?.removeAllRanges();
      openCommentComposer({ pageId, quote: text });
    } else {
      const comment = addComment(action === "underline" ? "underline" : "highlight", { quote: text });
      window.getSelection()?.removeAllRanges();
      setSide("comments");
      toast(`${action === "underline" ? "Underline" : "Highlight"} added`, "success");
      window.setTimeout(() => jumpToComment(comment.id), 120);
    }
    closeSelectionPopover();
  });
}

/* ------------------------------------------------------------------ ink & pan */

let drawing: { pageId: string; path: string; points: Array<[number, number]> } | null = null;
let panning: { x: number; y: number; left: number; top: number } | null = null;
let snapshotRect: { startX: number; startY: number; node: HTMLElement } | null = null;

function beginInk(event: PointerEvent, wrap: HTMLElement): void {
  const sheet = wrap.querySelector<HTMLElement>(".pg-sheet, .pg-cover");
  if (!sheet) return;
  const rect = sheet.getBoundingClientRect();
  const pageId = wrap.dataset.pageId;
  if (!pageId) return;
  const x = ((event.clientX - rect.left) / rect.width) * PAGE_W;
  const y = ((event.clientY - rect.top) / rect.height) * PAGE_H;
  drawing = { pageId, path: `M${x.toFixed(1)} ${y.toFixed(1)}`, points: [[x, y]] };
  const svg = wrap.querySelector<SVGSVGElement>(".pf-ink");
  if (svg) return;
  const layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  layer.setAttribute("class", "pf-ink");
  layer.setAttribute("viewBox", `0 0 ${PAGE_W} ${PAGE_H}`);
  layer.setAttribute("preserveAspectRatio", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", ACCENT);
  path.setAttribute("stroke-width", "2.4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("d", drawing.path);
  layer.appendChild(path);
  wrap.querySelector(".pf-page-turn")?.appendChild(layer);
  drawing.pageId = pageId;
}

/* ------------------------------------------------------------------ events: shell */

tabsEl.addEventListener("click", event => {
  const closeButton = (event.target as HTMLElement).closest<HTMLElement>("[data-close-doc]");
  if (closeButton) {
    event.stopPropagation();
    closeDoc(Number(closeButton.dataset.closeDoc));
    return;
  }
  const tab = (event.target as HTMLElement).closest<HTMLElement>("[data-doc-index]");
  if (tab) switchDoc(Number(tab.dataset.docIndex));
});

personasEl.addEventListener("click", event => {
  const button = (event.target as HTMLElement).closest<HTMLElement>("[data-persona]");
  if (!button) return;
  setPersona(button.dataset.persona as Persona);
});

toolsEl.addEventListener("click", event => {
  if ((event.target as HTMLElement).closest("[data-tools-close]")) {
    toolsOpen = false;
    syncShellClasses();
    return;
  }
  const row = (event.target as HTMLElement).closest<HTMLElement>("[data-tool]");
  if (!row) return;
  if (row.dataset.tool === "more") {
    catalogExpanded = !catalogExpanded;
    renderToolsPanel();
    return;
  }
  catalogue()
    .find(tool => tool.id === row.dataset.tool)
    ?.action();
});

toolRailEl.addEventListener("click", event => {
  const button = (event.target as HTMLElement).closest<HTMLElement>("[data-rail-tool]");
  if (!button) return;
  setTool(button.dataset.railTool as ToolId);
});

sideRailEl.addEventListener("click", event => {
  const button = (event.target as HTMLElement).closest<HTMLElement>("[data-side-tab]");
  if (!button) return;
  const tab = button.dataset.sideTab as SideTab;
  if (sideOpen && sideTab === tab) {
    sideOpen = false;
    syncShellClasses();
    renderSide();
    return;
  }
  setSide(tab);
});

q<HTMLElement>("#pf-menu").addEventListener("click", event => {
  openMenuSections(event.currentTarget as HTMLElement);
});

q<HTMLElement>("#pf-cmdsearch").addEventListener("click", () => openPalette());
q<HTMLElement>("#pf-open").addEventListener("click", openOpenDialog);
q<HTMLElement>("#pf-help").addEventListener("click", openGuideDialog);
q<HTMLElement>("#pf-discord").addEventListener("click", () => {
  toast("ArtCraft community — discord.gg/artcraft (demo link)");
});
q<HTMLElement>("#pf-theme").addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
q<HTMLElement>("#pf-save").addEventListener("click", saveDocument);
q<HTMLElement>("#pf-print").addEventListener("click", openPrintDialog);
q<HTMLElement>("#pf-recents").addEventListener("click", openRecentsPopup);

document.addEventListener("mousedown", event => {
  const target = event.target as HTMLElement;
  if (selectionPop && !selectionPop.contains(target)) closeSelectionPopover();
});

/* ------------------------------------------------------------------ events: canvas */

canvasEl.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateCurrentPageFromScroll);
});

pagesEl.addEventListener("mousedown", event => {
  const target = event.target as HTMLElement;
  if (target.closest("input, select, textarea, button, label")) return;
  const wrap = target.closest<HTMLElement>(".pf-page-wrap");
  if (!wrap) return;
  const index = Number(wrap.dataset.pageIndex);
  if (activeTool === "hand") {
    panning = { x: event.clientX, y: event.clientY, left: canvasEl.scrollLeft, top: canvasEl.scrollTop };
    appEl.classList.add("is-panning");
    return;
  }
  if (activeTool === "ink") {
    event.preventDefault();
    beginInk(event as PointerEvent, wrap);
    return;
  }
  if (index !== currentPage) {
    currentPage = index;
    syncCurrentPageClasses();
    renderDock();
    renderStatus();
    if (sideTab === "pages" && sideOpen) renderSide();
  }
});

pagesEl.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  if (target.closest("input, select, textarea, button, label")) return;
  const annot = target.closest<HTMLElement>(".pg-annot");
  if (annot?.dataset.commentId) {
    jumpToComment(annot.dataset.commentId);
    setSide("comments");
    return;
  }
  if (activeTool === "eraser") {
    const wrap = target.closest<HTMLElement>(".pf-page-wrap");
    const comment = wrap
      ? currentDoc().comments.find(item => wrap.querySelector(`[data-comment-id="${item.id}"]`))
      : undefined;
    if (comment) deleteComment(comment.id);
    return;
  }
  if (activeTool === "textbox") {
    const wrap = target.closest<HTMLElement>(".pf-page-wrap");
    if (wrap) openCommentComposer({ pageId: wrap.dataset.pageId as string });
  }
});

pagesEl.addEventListener("pointermove", event => {
  if (drawing) {
    const wrap = pagesEl.querySelector<HTMLElement>(`.pf-page-wrap[data-page-id="${drawing.pageId}"]`);
    const sheet = wrap?.querySelector<HTMLElement>(".pg-sheet, .pg-cover");
    if (!sheet) return;
    const rect = sheet.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PAGE_W;
    const y = ((event.clientY - rect.top) / rect.height) * PAGE_H;
    drawing.path += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    const path = pagesEl.querySelector<SVGPathElement>(`.pf-page-wrap[data-page-id="${drawing.pageId}"] .pf-ink path`);
    path?.setAttribute("d", drawing.path);
  }
});

window.addEventListener("pointermove", event => {
  if (panning) {
    canvasEl.scrollLeft = panning.left - (event.clientX - panning.x);
    canvasEl.scrollTop = panning.top - (event.clientY - panning.y);
  }
  if (snapshotRect) {
    const target = snapshotRect.node;
    const left = Math.min(snapshotRect.startX, event.clientX);
    const top = Math.min(snapshotRect.startY, event.clientY);
    const width = Math.abs(event.clientX - snapshotRect.startX);
    const height = Math.abs(event.clientY - snapshotRect.startY);
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
  }
});

window.addEventListener("pointerup", () => {
  if (panning) {
    panning = null;
    appEl.classList.remove("is-panning");
  }
  if (drawing) {
    const paths = inkPaths.get(drawing.pageId) ?? [];
    paths.push(drawing.path);
    inkPaths.set(drawing.pageId, paths);
    drawing = null;
    markDirty();
    setHint("Ink stroke added", 1600);
  }
  if (snapshotRect) {
    snapshotRect.node.remove();
    snapshotRect = null;
    toast("Snapshot copied to the clipboard (demo)");
  }
});

document.addEventListener("mouseup", event => {
  if (
    event.target instanceof Element &&
    event.target.closest(".pf-side, .pf-dialog, .pf-popup, .pf-palette, .pf-selpop, .pf-findbar, .pf-dock")
  ) {
    return;
  }
  window.setTimeout(() => {
    const info = selectionInfo();
    if (!info) return;
    if (activeTool === "highlight") {
      const comment = addComment("highlight", { quote: info.text, pageId: info.pageId });
      window.getSelection()?.removeAllRanges();
      setSide("comments");
      toast("Highlight added", "success");
      window.setTimeout(() => jumpToComment(comment.id), 100);
      return;
    }
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    openSelectionPopover(info.text, info.pageId, rect);
  }, 0);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (selectionPop) {
      closeSelectionPopover();
      return;
    }
    if (!findbarEl.hidden) {
      closeFind();
      return;
    }
    closePopups();
    if (organizerOpen) closeOrganizer();
  }
});

/* ------------------------------------------------------------------ events: side panel */

sidePanelEl.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  if (target.closest("[data-side-close]")) {
    sideOpen = false;
    syncShellClasses();
    renderSide();
    return;
  }
  if (target.closest("[data-add-comment]")) {
    openCommentComposer({ pageId: currentDoc().pages[currentPage].id });
    return;
  }
  if (target.closest("[data-open-organizer]")) {
    openOrganizer();
    return;
  }
  if (target.closest("[data-highlight-fields]")) {
    toggleFieldHighlight();
    return;
  }
  if (target.closest("[data-clear-form]")) {
    clearForm();
    return;
  }
  const replyButton = target.closest<HTMLElement>("[data-comment-reply]");
  if (replyButton) {
    replyTarget = replyButton.dataset.commentReply ?? null;
    renderSide();
    sidePanelEl.querySelector<HTMLTextAreaElement>("[data-reply-input]")?.focus();
    return;
  }
  if (target.closest("[data-reply-cancel]")) {
    replyTarget = null;
    renderSide();
    return;
  }
  const replySubmit = target.closest<HTMLElement>("[data-reply-submit]");
  if (replySubmit) {
    const textarea = sidePanelEl.querySelector<HTMLTextAreaElement>("[data-reply-input]");
    const body = textarea?.value.trim() ?? "";
    if (!body) {
      toast("Write a reply first", "warning");
      return;
    }
    const comment = currentDoc().comments.find(item => item.id === replySubmit.dataset.replySubmit);
    if (!comment) return;
    pushHistory("Reply to comment");
    comment.replies.push({
      id: nextId("reply"),
      author: "You",
      initials: "YO",
      date: nowStamp(),
      body
    });
    replyTarget = null;
    markDirty();
    renderSide();
    toast("Reply added", "success");
    return;
  }
  const resolveButton = target.closest<HTMLElement>("[data-comment-resolve]");
  if (resolveButton) {
    const comment = currentDoc().comments.find(item => item.id === resolveButton.dataset.commentResolve);
    if (!comment) return;
    pushHistory(comment.resolved ? "Reopen comment" : "Resolve comment");
    comment.resolved = !comment.resolved;
    markDirty();
    renderSide();
    return;
  }
  const menuButton = target.closest<HTMLElement>("[data-comment-menu]");
  if (menuButton) {
    const rect = menuButton.getBoundingClientRect();
    const commentId = menuButton.dataset.commentMenu as string;
    openPopup(rect.right - 180, rect.bottom + 4, [
      { label: "Go to page", action: () => jumpToComment(commentId) },
      {
        label: "Copy quote",
        action: () => {
          const comment = currentDoc().comments.find(item => item.id === commentId);
          if (comment?.quote) void navigator.clipboard?.writeText(comment.quote).catch(() => undefined);
          toast("Quote copied");
        }
      },
      { separator: true },
      { label: "Delete comment", action: () => deleteComment(commentId) }
    ]);
    return;
  }
  const comment = target.closest<HTMLElement>("[data-comment]");
  if (comment && !target.closest("button, textarea")) {
    jumpToComment(comment.dataset.comment as string);
    return;
  }
  const pageItem = target.closest<HTMLElement>("[data-page-index]");
  if (pageItem) {
    goToPage(Number(pageItem.dataset.pageIndex));
    return;
  }
  const pageMenu = target.closest<HTMLElement>("[data-page-menu]");
  if (pageMenu) {
    const index = Number(pageMenu.dataset.pageMenu);
    const rect = pageMenu.getBoundingClientRect();
    openPopup(rect.right - 180, rect.bottom + 4, [
      { label: "Go to page", action: () => goToPage(index) },
      {
        label: "Rotate clockwise",
        action: () => {
          currentPage = index;
          rotateSelected(1);
        }
      },
      {
        label: "Duplicate page",
        action: () => {
          currentPage = index;
          duplicateSelectedPages();
        }
      },
      { separator: true },
      {
        label: "Delete page",
        action: () => {
          currentPage = index;
          deleteSelectedPages();
        }
      }
    ]);
    return;
  }
  const bmToggle = target.closest<HTMLElement>("[data-bm-toggle]");
  if (bmToggle) {
    const id = bmToggle.dataset.bmToggle as string;
    if (collapsedBookmarks.has(id)) collapsedBookmarks.delete(id);
    else collapsedBookmarks.add(id);
    renderSide();
    return;
  }
  const bm = target.closest<HTMLElement>("[data-bm]");
  if (bm) {
    const bookmark = currentDoc().bookmarks.find(item => item.id === bm.dataset.bm);
    if (!bookmark) return;
    selectedBookmark = bookmark.id;
    if (bookmark.pageId) {
      const index = pageIndexOf(bookmark.pageId);
      if (index >= 0) goToPage(index);
    }
    renderSide();
    return;
  }
  const layerToggle = target.closest<HTMLElement>("[data-layer-toggle]");
  if (layerToggle) {
    const key = layerToggle.dataset.layerToggle as keyof typeof layerState;
    layerState[key] = !layerState[key];
    syncShellClasses();
    renderSide();
    return;
  }
  const fieldJump = target.closest<HTMLElement>("[data-field-jump]");
  if (fieldJump) {
    const fieldId = fieldJump.dataset.fieldJump as string;
    const field = currentDoc().fields.find(item => item.id === fieldId);
    if (!field) return;
    const index = pageIndexOf(field.pageId);
    goToPage(index);
    window.setTimeout(() => {
      const input = pagesEl.querySelector<HTMLElement>(`[data-field="${fieldId}"]`);
      input?.focus();
      input?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 420);
    return;
  }
  const searchResult = target.closest<HTMLElement>("[data-search-hit]");
  if (searchResult) {
    hitIndex = Number(searchResult.dataset.searchHit);
    const hit = hits[hitIndex];
    if (!hit) return;
    clearCurrentHit(pagesEl);
    hit.mark.classList.add("is-current");
    currentPage = hit.pageIndex;
    syncCurrentPageClasses();
    renderDock();
    renderStatus();
    scrollToHit(hit.mark);
    renderSide();
  }
});

sidePanelEl.addEventListener("input", event => {
  const input = event.target as HTMLInputElement;
  if (input.id === "pf-side-search") {
    searchQuery = input.value;
    findInput.value = searchQuery;
    if (!findOpen) {
      findOpen = true;
      findbarEl.hidden = false;
    }
    debouncedSearch();
  }
});

/* ------------------------------------------------------------------ events: findbar */

findInput.addEventListener("input", () => {
  searchQuery = findInput.value;
  debouncedSearch();
});
q<HTMLElement>("#pf-find-prev").addEventListener("click", () => goToHit(-1));
q<HTMLElement>("#pf-find-next").addEventListener("click", () => goToHit(1));
q<HTMLElement>("#pf-find-close").addEventListener("click", closeFind);

/* ------------------------------------------------------------------ events: dock & banner */

dockEl.addEventListener("click", event => {
  const button = (event.target as HTMLElement).closest<HTMLElement>("[data-dock]");
  if (!button) return;
  const action = button.dataset.dock;
  if (action === "prev") goToPage(currentPage - 1);
  else if (action === "next") goToPage(currentPage + 1);
  else if (action === "zoom-in") zoomBy(0.1);
  else if (action === "zoom-out") zoomBy(-0.1);
  else if (action === "fit") fitPage();
  else if (action === "rotate") rotateSelected(1);
  else if (action === "find") openFind();
  else if (action === "zoom-menu") {
    const rect = button.getBoundingClientRect();
    openPopup(rect.left - 70, rect.top - 220, [
      { label: "Actual size", shortcut: "⌘0", action: zoomActual },
      { label: "Fit width", shortcut: "⌘1", action: fitWidth },
      { label: "Fit page", shortcut: "⌘9", action: fitPage },
      { separator: true },
      ...[0.5, 0.75, 1, 1.25, 1.5, 2].map(value => ({
        label: `${Math.round(value * 100)}%`,
        checked: Math.abs(zoom - value) < 0.01,
        action: () => setZoom(value)
      }))
    ]);
  }
});

dockEl.addEventListener("change", event => {
  const input = event.target as HTMLInputElement;
  if (input.id !== "pf-page-input") return;
  const value = Number(input.value);
  if (Number.isFinite(value)) goToPage(value - 1);
  input.value = String(currentPage + 1);
});

dockEl.addEventListener("keydown", event => {
  const input = event.target as HTMLInputElement;
  if (input.id !== "pf-page-input" || event.key !== "Enter") return;
  event.preventDefault();
  const value = Number(input.value);
  if (Number.isFinite(value)) goToPage(value - 1);
  input.blur();
});

bannerEl.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  if (target.closest("[data-banner-highlight]")) {
    toggleFieldHighlight();
    return;
  }
  if (target.closest("[data-banner-close]")) {
    bannerDismissed = true;
    renderBanner();
  }
});

/* ------------------------------------------------------------------ events: organizer */

organizerEl.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const action = target.closest<HTMLElement>("[data-org]")?.dataset.org;
  if (action === "rotate-cw") rotateSelected(1);
  else if (action === "rotate-ccw") rotateSelected(-1);
  else if (action === "delete") deleteSelectedPages();
  else if (action === "insert") insertBlankPage();
  else if (action === "duplicate") duplicateSelectedPages();
  else if (action === "move-left") moveSelectedPages(-1);
  else if (action === "move-right") moveSelectedPages(1);
  else if (action === "extract") openExtractDialog(selectedPageList());
  else if (action === "done" || action === "close") closeOrganizer();
  else {
    const card = target.closest<HTMLElement>("[data-org-page]");
    if (!card) return;
    const pageId = card.dataset.orgPage as string;
    const index = pageIndexOf(pageId);
    const additive = event.metaKey || event.ctrlKey;
    const shift = event.shiftKey;
    if (shift && currentPage >= 0) {
      const min = Math.min(currentPage, index);
      const max = Math.max(currentPage, index);
      selectedPages = new Set(
        currentDoc()
          .pages.slice(min, max + 1)
          .map(page => page.id)
      );
    } else if (additive) {
      if (selectedPages.has(pageId)) selectedPages.delete(pageId);
      else selectedPages.add(pageId);
    } else if (!selectedPages.has(pageId) || selectedPages.size > 1) {
      selectedPages = new Set([pageId]);
    }
    currentPage = index;
    renderOrganizer();
    renderCanvas();
  }
});

organizerEl.addEventListener("dragstart", event => {
  const card = (event.target as HTMLElement).closest<HTMLElement>("[data-org-page]");
  if (!card) return;
  dragPageId = card.dataset.orgPage ?? null;
  card.classList.add("is-dragging");
  event.dataTransfer?.setData("text/plain", dragPageId ?? "");
});

organizerEl.addEventListener("dragover", event => {
  event.preventDefault();
  const card = (event.target as HTMLElement).closest<HTMLElement>("[data-org-page]");
  organizerEl.querySelectorAll(".pf-org-card.is-drop").forEach(node => node.classList.remove("is-drop"));
  if (card && card.dataset.orgPage !== dragPageId) card.classList.add("is-drop");
});

organizerEl.addEventListener("dragleave", event => {
  const card = (event.target as HTMLElement).closest<HTMLElement>("[data-org-page]");
  card?.classList.remove("is-drop");
});

organizerEl.addEventListener("drop", event => {
  event.preventDefault();
  organizerEl
    .querySelectorAll(".pf-org-card.is-drop, .pf-org-card.is-dragging")
    .forEach(node => node.classList.remove("is-drop", "is-dragging"));
  const card = (event.target as HTMLElement).closest<HTMLElement>("[data-org-page]");
  if (!card || !dragPageId) return;
  const targetId = card.dataset.orgPage;
  const doc = currentDoc();
  const from = doc.pages.findIndex(page => page.id === dragPageId);
  const to = doc.pages.findIndex(page => page.id === targetId);
  if (from < 0 || to < 0 || from === to) {
    dragPageId = null;
    return;
  }
  pushHistory("Reorder pages");
  const [moved] = doc.pages.splice(from, 1);
  doc.pages.splice(to, 0, moved);
  currentPage = to;
  dragPageId = null;
  markDirty();
  renderOrganizer();
  renderCanvas();
  renderSide();
});

/* ------------------------------------------------------------------ events: forms & annotations */

pagesEl.addEventListener("input", event => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "[data-field]"
  );
  if (!input) return;
  const key = input.dataset.field;
  if (!key) return;
  const doc = currentDoc();
  if (input instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")) {
    if (input.type === "radio" && input.name) {
      const group = Array.from(pagesEl.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`));
      for (const radio of group) {
        const field = radio.dataset.field;
        if (field) doc.values[field] = radio === input;
      }
    } else {
      doc.values[key] = input.checked;
    }
  } else {
    doc.values[key] = input.value;
  }
  doc.dirty = true;
  renderTabs();
  if (sideTab === "fields" && sideOpen) renderSide();
});

/* ------------------------------------------------------------------ keyboard */

document.addEventListener("keydown", event => {
  const target = event.target as HTMLElement;
  const inField = target.closest("input, textarea, select, [contenteditable]");
  const meta = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();

  if (meta && key === "k") {
    event.preventDefault();
    openPalette();
    return;
  }
  if (meta && key === "f") {
    event.preventDefault();
    openFind();
    return;
  }
  if (meta && key === "g") {
    event.preventDefault();
    goToHit(event.shiftKey ? -1 : 1);
    return;
  }
  if (meta && key === "s") {
    event.preventDefault();
    if (event.shiftKey) saveCopy();
    else saveDocument();
    return;
  }
  if (meta && key === "o") {
    event.preventDefault();
    openOpenDialog();
    return;
  }
  if (meta && key === "w") {
    event.preventDefault();
    closeDoc(activeIndex);
    return;
  }
  if (meta && key === "z") {
    if (inField) return;
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if (meta && key === "p") {
    event.preventDefault();
    openPrintDialog();
    return;
  }
  if (meta && (key === "=" || key === "+")) {
    event.preventDefault();
    zoomBy(0.1);
    return;
  }
  if (meta && key === "-") {
    event.preventDefault();
    zoomBy(-0.1);
    return;
  }
  if (meta && key === "0") {
    event.preventDefault();
    zoomActual();
    return;
  }
  if (meta && key === "1") {
    event.preventDefault();
    fitWidth();
    return;
  }
  if (meta && key === "9") {
    event.preventDefault();
    fitPage();
    return;
  }
  if (inField) return;
  if (event.key === "F4") {
    event.preventDefault();
    if (event.shiftKey) toggleToolsPanel();
    else toggleSidePanel();
    return;
  }
  if (key === "?") {
    event.preventDefault();
    openShortcutsDialog();
    return;
  }
  if (key === "v") setTool("select");
  else if (key === "h") setTool("hand");
  else if (key === "t") setTool("text");
  else if (key === "s") setTool("snapshot");
  else if (key === "x") setTool("textbox");
  else if (key === "u") setTool("highlight");
  else if (key === "d") setTool("ink");
  else if (key === "e") setTool("eraser");
  else if (event.key === "PageDown") {
    event.preventDefault();
    goToPage(currentPage + 1);
  } else if (event.key === "PageUp") {
    event.preventDefault();
    goToPage(currentPage - 1);
  }
});

/* ------------------------------------------------------------------ boot */

renderAll();
window.requestAnimationFrame(() => {
  const available = canvasEl.clientWidth - 120;
  zoom = Math.min(1.05, Math.max(0.5, available / PAGE_W));
  pagesEl.style.setProperty("--pf-zoom", String(zoom));
  renderDock();
  renderStatus();
  goToPage(0, false);
});
setHint(defaultHint());
