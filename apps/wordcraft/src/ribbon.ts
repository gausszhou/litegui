import { icon } from "./icons";
import { FONT_FAMILIES, FONT_SIZES, STYLE_PRESETS } from "./content";

/** State flags that the ribbon needs in order to render toggle buttons. */
export interface RibbonState {
  tracking: boolean;
  commentsOpen: boolean;
  navOpen: boolean;
  ruler: boolean;
  dark: boolean;
  readingMode: boolean;
  editing: string;
  citationStyle: string;
  theme: string;
  pageColor: string;
  margins: string;
  orientation: string;
  size: string;
  columns: boolean;
  lineNumbers: boolean;
  gridlines: boolean;
  marks: boolean;
}

export type RibbonTab =
  | "home"
  | "insert"
  | "draw"
  | "design"
  | "layout"
  | "references"
  | "mailings"
  | "review"
  | "view"
  | "help";

export const RIBBON_TABS: Array<{ id: RibbonTab; label: string }> = [
  { id: "home", label: "Home" },
  { id: "insert", label: "Insert" },
  { id: "draw", label: "Draw" },
  { id: "design", label: "Design" },
  { id: "layout", label: "Layout" },
  { id: "references", label: "References" },
  { id: "mailings", label: "Mailings" },
  { id: "review", label: "Review" },
  { id: "view", label: "View" },
  { id: "help", label: "Help" }
];

interface ItemOptions {
  caret?: boolean;
  active?: boolean;
  popup?: string;
  hint?: string;
  className?: string;
}

function attrs(command?: string, options: ItemOptions = {}): string {
  const parts: string[] = [];
  if (options.popup) parts.push(`data-popup="${options.popup}"`);
  else if (command) parts.push(`data-command="${command}"`);
  if (options.active) parts.push('class="is-active"');
  return parts.join(" ");
}

function large(iconName: string, label: string, command: string, options: ItemOptions = {}): string {
  const title = options.hint ? `${label} (${options.hint})` : label;
  return `<button type="button" class="wc-rbtn wc-rbtn--large${options.active ? " is-active" : ""}" ${attrs(
    command,
    options
  )} title="${title}">
    <span class="wc-rbtn__icon">${icon(iconName, 26)}</span>
    <span class="wc-rbtn__label">${label}${options.caret ? ` ${icon("chevron", 9)}` : ""}</span>
  </button>`;
}

function small(iconName: string, label: string, command: string, options: ItemOptions = {}): string {
  const title = options.hint ? `${label} (${options.hint})` : label;
  return `<button type="button" class="wc-rbtn wc-rbtn--small${options.active ? " is-active" : ""}" ${attrs(
    command,
    options
  )} title="${title}">
    <span class="wc-rbtn__icon">${icon(iconName, 15)}</span>
    <span class="wc-rbtn__label">${label}</span>
  </button>`;
}

function tiny(iconName: string, label: string, command: string, options: ItemOptions = {}): string {
  const title = options.hint ? `${label} (${options.hint})` : label;
  return `<button type="button" class="wc-rbtn wc-rbtn--tiny${options.active ? " is-active" : ""}" ${attrs(
    command,
    options
  )} title="${title}" aria-label="${label}">
    ${icon(iconName, 16)}
  </button>`;
}

function stack(...items: string[]): string {
  return `<div class="wc-stack">${items.join("")}</div>`;
}

function group(label: string, body: string, extra = ""): string {
  return `<div class="wc-group ${extra}"><div class="wc-group__body">${body}</div><div class="wc-group__label">${label}</div></div>`;
}

function ribbon(parts: string[]): string {
  return `<div class="wc-ribbon-row">${parts.join("")}</div>`;
}

const styleCards = STYLE_PRESETS.map(
  preset =>
    `<button type="button" class="wc-style-card" data-command="apply-style" data-value="${preset.id}" title="${preset.label}">
      <span class="wc-style-card__sample" data-style-preview="${preset.id}">${preset.sample}</span>
      <span class="wc-style-card__label">${preset.label}</span>
    </button>`
).join("");

const fontGroup = () => `
  <div class="wc-fontgroup">
    <div class="wc-fontgroup__row">
      <button type="button" class="wc-combo wc-combo--font" data-popup="font-family" title="Font">
        <span class="wc-combo__value" id="font-family-label">Aptos</span>${icon("chevron", 10)}
      </button>
      <button type="button" class="wc-combo wc-combo--size" data-popup="font-size" title="Font Size">
        <span class="wc-combo__value" id="font-size-label">12</span>${icon("chevron", 10)}
      </button>
      ${tiny("fontGrow", "Grow Font", "font-grow")}
      ${tiny("fontShrink", "Shrink Font", "font-shrink")}
      ${tiny("changeCase", "Change Case", "change-case")}
      ${tiny("clearFormat", "Clear All Formatting", "clear-format")}
      ${tiny("fontColor", "Font Color", "font-color")}
      ${tiny("highlight", "Text Highlight Color", "highlight-color")}
    </div>
    <div class="wc-fontgroup__row">
      ${tiny("bold", "Bold", "bold", { hint: "Ctrl+B" })}
      ${tiny("italic", "Italic", "italic", { hint: "Ctrl+I" })}
      ${tiny("underline", "Underline", "underline", { hint: "Ctrl+U" })}
      ${tiny("strike", "Strikethrough", "strike")}
      ${tiny("subscript", "Subscript", "subscript")}
      ${tiny("superscript", "Superscript", "superscript")}
    </div>
  </div>`;

const paragraphGroup = () => `
  <div class="wc-paragraph">
    <div class="wc-paragraph__row">
      ${tiny("bullets", "Bullets", "bullets")}
      ${tiny("numbering", "Numbering", "numbering")}
      ${tiny("multilevel", "Multilevel List", "multilevel")}
      ${tiny("indentInc", "Increase Indent", "indent-increase")}
      ${tiny("indentDec", "Decrease Indent", "indent-decrease")}
      ${tiny("sort", "Sort", "sort")}
    </div>
    <div class="wc-paragraph__row">
      ${tiny("alignLeft", "Align Left", "align-left", { hint: "Ctrl+L" })}
      ${tiny("alignCenter", "Center", "align-center", { hint: "Ctrl+E" })}
      ${tiny("alignRight", "Align Right", "align-right", { hint: "Ctrl+R" })}
      ${tiny("alignJustify", "Justify", "align-justify", { hint: "Ctrl+J" })}
    </div>
    <div class="wc-paragraph__row">
      ${tiny("lineSpacing", "Line and Paragraph Spacing", "line-spacing")}
      ${tiny("shading", "Shading", "shading")}
      ${tiny("borders", "Borders", "borders")}
    </div>
  </div>`;

const stylesGroup = () => `
  <div class="wc-styles">
    <div class="wc-styles__gallery">${styleCards}</div>
    <button type="button" class="wc-styles__more" data-popup="styles-more" title="More styles">${icon(
      "chevron",
      11
    )}</button>
  </div>`;

const home = (state: RibbonState) =>
  ribbon([
    group(
      "Clipboard",
      `${large("paste", "Paste", "paste", { caret: true, hint: "Ctrl+V" })}${stack(
        small("cut", "Cut", "cut", { hint: "Ctrl+X" }),
        small("copy", "Copy", "copy", { hint: "Ctrl+C" }),
        small("painter", "Format Painter", "format-painter")
      )}`
    ),
    group("Font", fontGroup()),
    group("Paragraph", paragraphGroup()),
    group("Styles", stylesGroup(), "wc-group--styles"),
    group(
      "Editing",
      `${large("find", "Find", "find", { hint: "Ctrl+F" })}${stack(
        small("replace", "Replace", "replace", { hint: "Ctrl+H" }),
        small("select", "Select", "select-all")
      )}`
    ),
    ...(state.editing === "Suggesting"
      ? [
          group(
            "Suggesting",
            `${large("trackChanges", "Track Changes", "track-changes", { active: true })}${stack(
              small("markup", "Markup", "markup"),
              small("reviewingPane", "Reviewing Pane", "reviewing-pane")
            )}`
          )
        ]
      : [])
  ]);

const insert = () =>
  ribbon([
    group(
      "Pages",
      `${large("coverPage", "Cover Page", "insert-cover", { caret: true })}${stack(
        small("blankPage", "Blank Page", "insert-blank-page"),
        small("pageBreak", "Page Break", "insert-page-break")
      )}`
    ),
    group(
      "Tables",
      `${large("table", "Table", "insert-table", { caret: true })}${stack(
        small("toc", "Table of Figures", "insert-table-of-figures")
      )}`
    ),
    group(
      "Illustrations",
      `${large("picture", "Pictures", "insert-picture")}${stack(
        small("shape", "Shapes", "insert-shape"),
        small("smartart", "SmartArt", "insert-smartart"),
        small("chart", "Chart", "insert-chart")
      )}`
    ),
    group(
      "Links",
      `${large("link", "Link", "insert-link", { caret: true })}${stack(
        small("bookmark", "Bookmark", "insert-bookmark"),
        small("crossref", "Cross-reference", "insert-crossref")
      )}`
    ),
    group("Comments", large("comment", "Comment", "insert-comment")),
    group(
      "Header & Footer",
      `${large("header", "Header", "insert-header", { caret: true })}${stack(
        small("footer", "Footer", "insert-footer"),
        small("pageNumber", "Page Number", "insert-page-number")
      )}`
    ),
    group(
      "Text",
      `${large("textBox", "Text Box", "insert-text-box", { caret: true })}${stack(
        small("quickParts", "Quick Parts", "quick-parts"),
        small("wordArt", "WordArt", "word-art"),
        small("dropCap", "Drop Cap", "drop-cap")
      )}`
    ),
    group(
      "Symbols",
      `${large("equation", "Equation", "insert-equation", { caret: true })}${stack(
        small("symbol", "Symbol", "insert-symbol")
      )}`
    )
  ]);

const draw = () =>
  ribbon([
    group(
      "Drawing Tools",
      `${large("pen", "Pen", "draw-pen", { caret: true })}${stack(
        small("highlighter", "Highlighter", "draw-highlighter"),
        small("eraser", "Eraser", "draw-eraser"),
        small("lasso", "Lasso Select", "draw-lasso")
      )}`
    ),
    group(
      "Convert",
      `${large("inkShape", "Ink to Shape", "draw-shape")}${stack(small("equation", "Ink to Math", "draw-math"))}`
    ),
    group("Replay", large("replay", "Ink Replay", "draw-replay")),
    group("Close", large("close", "Close Ink Tools", "draw-close"))
  ]);

const design = (_state: RibbonState) =>
  ribbon([
    group(
      "Document Formatting",
      `${large("theme", "Themes", "themes", { caret: true })}${stack(
        small("colors", "Colors", "theme-colors"),
        small("fonts", "Fonts", "theme-fonts"),
        small("spacing", "Paragraph Spacing", "theme-spacing"),
        small("effects", "Effects", "theme-effects")
      )}`
    ),
    group(
      "Page Background",
      `${large("watermark", "Watermark", "watermark", { caret: true })}${stack(
        small("pageColor", "Page Color", "page-color"),
        small("borders", "Page Borders", "page-borders")
      )}`
    ),
    group("Close", large("close", "Close Header and Footer", "close-header-footer"))
  ]);

const layout = (state: RibbonState) =>
  ribbon([
    group(
      "Page Setup",
      `${large("margins", "Margins", "margins", { caret: true })}${stack(
        small("orientation", "Orientation", "orientation"),
        small("pageSize", "Size", "page-size"),
        small("columns", "Columns", "columns")
      )}`
    ),
    group(
      "Breaks",
      `${large("breaks", "Breaks", "breaks", { caret: true })}${stack(
        small("lineNumbers", "Line Numbers", "line-numbers", { active: state.lineNumbers }),
        small("hyphenation", "Hyphenation", "hyphenation")
      )}`
    ),
    group(
      "Paragraph",
      `${large("indentInc", "Indent", "paragraph-indent", { caret: true })}${stack(
        small("spacing", "Spacing", "paragraph-spacing")
      )}`
    ),
    group(
      "Arrange",
      `${large("position", "Position", "position", { caret: true })}${stack(
        small("wrap", "Wrap Text", "wrap-text"),
        small("selectionPane", "Selection Pane", "selection-pane")
      )}`
    ),
    group("Show", `${large("ruler", "Ruler", "ruler", { active: state.ruler })}`)
  ]);

const references = (state: RibbonState) =>
  ribbon([
    group(
      "Table of Contents",
      `${large("toc", "Table of Contents", "insert-toc", { caret: true })}${stack(
        small("update", "Update Table", "update-toc"),
        small("addText", "Add Text", "add-toc-text")
      )}`
    ),
    group(
      "Footnotes",
      `${large("footnote", "Insert Footnote", "insert-footnote")}${stack(
        small("nextFootnote", "Next Footnote", "next-footnote"),
        small("showNotes", "Show Notes", "show-notes")
      )}`
    ),
    group("Research", large("researcher", "Researcher", "researcher")),
    group(
      "Citations & Bibliography",
      `${large("citation", "Insert Citation", "insert-citation", { caret: true })}${stack(
        small("sources", "Manage Sources", "manage-sources"),
        small("bibStyle", `Style: ${state.citationStyle}`, "citation-style", { caret: true }),
        small("index", "Bibliography", "insert-bibliography")
      )}`
    ),
    group(
      "Captions",
      `${large("captions", "Insert Caption", "insert-caption")}${stack(
        small("crossref", "Cross-reference", "insert-crossref")
      )}`
    ),
    group(
      "Index",
      `${large("index", "Mark Entry", "mark-index")}${stack(small("update", "Update Index", "update-index"))}`
    ),
    group(
      "Table of Authorities",
      `${large("authorities", "Mark Citation", "mark-authority")}${stack(
        small("update", "Update Table", "update-authorities")
      )}`
    )
  ]);

const mailings = () =>
  ribbon([
    group("Create", `${large("envelopes", "Envelopes", "mail-envelopes")}${large("labels", "Labels", "mail-labels")}`),
    group(
      "Start Mail Merge",
      `${large("merge", "Start Mail Merge", "start-mail-merge", { caret: true })}${stack(
        small("recipients", "Select Recipients", "select-recipients"),
        small("address", "Edit Recipient List", "edit-recipients")
      )}`
    ),
    group(
      "Write & Insert Fields",
      `${large("mergeField", "Insert Merge Field", "insert-merge-field", { caret: true })}${stack(
        small("highlight", "Highlight Merge Fields", "highlight-merge-fields"),
        small("greeting", "Greeting Line", "greeting-line"),
        small("address", "Address Block", "address-block")
      )}`
    ),
    group("Preview Results", large("preview", "Preview Results", "preview-results")),
    group("Finish", `${large("finish", "Finish & Merge", "finish-merge", { caret: true })}`)
  ]);

const review = (state: RibbonState) =>
  ribbon([
    group(
      "Proofing",
      `${large("spelling", "Spelling & Grammar", "spelling", { hint: "F7" })}${stack(
        small("thesaurus", "Thesaurus", "thesaurus"),
        small("wordCount", "Word Count", "word-count"),
        small("readAloud", "Read Aloud", "read-aloud"),
        small("accessibility", "Check Accessibility", "accessibility")
      )}`
    ),
    group(
      "Comments",
      `${large("newComment", "New Comment", "insert-comment")}${stack(
        small("deleteComment", "Delete", "delete-comment"),
        small("nextFootnote", "Previous", "prev-comment"),
        small("nextFootnote", "Next", "next-comment"),
        small("showComments", "Show Comments", "show-comments", { active: state.commentsOpen })
      )}`
    ),
    group(
      "Tracking",
      `${large("trackChanges", "Track Changes", "track-changes", { active: state.tracking })}${stack(
        small("markup", "Markup", "markup"),
        small("reviewingPane", "Reviewing Pane", "reviewing-pane"),
        small("accept", "Accept", "accept-change", { caret: true }),
        small("reject", "Reject", "reject-change", { caret: true })
      )}`
    ),
    group("Compare", large("compare", "Compare", "compare-documents")),
    group(
      "Protect",
      `${large("protect", "Block Authors", "block-authors")}${stack(
        small("restrict", "Restrict Editing", "restrict-editing")
      )}`
    )
  ]);

const view = (state: RibbonState) =>
  ribbon([
    group(
      "Views",
      `${large("readMode", "Read Mode", "read-mode", { active: state.readingMode })}${stack(
        small("printLayout", "Print Layout", "print-layout"),
        small("webLayout", "Web Layout", "web-layout"),
        small("outline", "Outline", "outline-view"),
        small("draft", "Draft", "draft-view")
      )}`
    ),
    group(
      "Show",
      `${large("ruler", "Ruler", "ruler", { active: state.ruler })}${stack(
        small("navPane", "Navigation Pane", "navigation-pane", { active: state.navOpen }),
        small("gridlines", "Gridlines", "gridlines", { active: state.gridlines }),
        small("marks", "Formatting Marks", "formatting-marks", { active: state.marks }),
        small("theme", "Dark Mode", "dark-mode", { active: state.dark })
      )}`
    ),
    group(
      "Zoom",
      `${large("zoom", "Zoom", "zoom-dialog")}${stack(
        small("onePage", "One Page", "zoom-one-page"),
        small("multiPage", "Multiple Pages", "zoom-multiple-pages"),
        small("pageWidth", "Page Width", "zoom-page-width")
      )}`
    ),
    group(
      "Window",
      `${large("newWindow", "New Window", "new-window")}${stack(
        small("arrange", "Arrange All", "arrange-all"),
        small("split", "Split", "split-window")
      )}`
    ),
    group("Macros", large("macros", "Macros", "macros"))
  ]);

const help = () =>
  ribbon([
    group(
      "WordCraft Help",
      `${large("info", "Help", "help-topics")}${stack(
        small("search", "Search Help", "search-help"),
        small("external", "Contact Support", "contact-support")
      )}`
    ),
    group("What's New", large("star", "What's New", "whats-new")),
    group("Keyboard", large("keyboard", "Keyboard Shortcuts", "shortcuts")),
    group("About", large("info", "About WordCraft", "about"))
  ]);

const renderers: Record<RibbonTab, (state: RibbonState) => string> = {
  home,
  insert: () => insert(),
  draw: () => draw(),
  design,
  layout,
  references,
  mailings,
  review,
  view,
  help
};

export function renderRibbon(tab: RibbonTab, state: RibbonState): string {
  return renderers[tab](state);
}

export function fontPopupEntries(current?: string): Array<Record<string, unknown>> {
  return FONT_FAMILIES.map(family => ({
    label: family,
    checked: current === family,
    command: "set-font",
    value: family
  }));
}

export function sizePopupEntries(current?: string): Array<Record<string, unknown>> {
  return FONT_SIZES.map(size => ({
    label: String(size),
    checked: current === String(size),
    command: "set-font-size",
    value: String(size)
  }));
}
