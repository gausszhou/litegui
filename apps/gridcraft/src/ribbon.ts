/**
 * Ribbon markup. Commands are referenced by `data-cmd` / `data-menu` and
 * dispatched centrally from main.ts; this module is purely declarative.
 */

import type { ChartSpec } from "./model";
import { icon } from "./icons";

export interface RibbonState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: string;
  valign: string;
  wrap: boolean;
  fontName: string;
  fontSize: number;
  numFmt: string;
  showFormulas: boolean;
  gridlines: boolean;
  headings: boolean;
  formulaBar: boolean;
  table?: {
    name: string;
    header: boolean;
    totals: boolean;
    banded: boolean;
    firstColumn: boolean;
    lastColumn: boolean;
    filter: boolean;
    style: string;
  };
  chart?: ChartSpec;
  pivot?: boolean;
}

export const RIBBON_TABS = [
  { id: "home", label: "Home" },
  { id: "insert", label: "Insert" },
  { id: "draw", label: "Draw" },
  { id: "layout", label: "Page Layout" },
  { id: "formulas", label: "Formulas" },
  { id: "data", label: "Data" },
  { id: "review", label: "Review" },
  { id: "view", label: "View" },
  { id: "automate", label: "Automate" }
] as const;

export type RibbonTabId = (typeof RIBBON_TABS)[number]["id"] | "table" | "chart" | "pivot";

export function contextTabs(state: RibbonState): Array<{ id: RibbonTabId; label: string }> {
  const tabs: Array<{ id: RibbonTabId; label: string }> = [];
  if (state.table) tabs.push({ id: "table", label: "Table Design" });
  if (state.chart) tabs.push({ id: "chart", label: "Chart Design" });
  if (state.pivot) tabs.push({ id: "pivot", label: "PivotTable Analyze" });
  return tabs;
}

const FONTS = ["Calibri", "Aptos", "Arial", "Times New Roman", "Georgia", "Consolas", "Verdana", "Segoe UI"];
const NUM_FORMATS: Array<[string, string]> = [
  ["general", "General"],
  ["number", "Number"],
  ["currency", "Currency"],
  ["percent", "Percentage"],
  ["text", "Text"]
];
const TABLE_SWATCHES: Array<[string, string]> = [
  ["teal", "#0e6b5c"],
  ["green", "#217346"],
  ["blue", "#4472c4"],
  ["orange", "#c55a11"],
  ["gray", "#595959"]
];
const CHART_SWATCHES: Array<[string, string]> = [
  ["office", "#4472c4"],
  ["teal", "#0e6b5c"],
  ["warm", "#ed7d31"],
  ["cool", "#2f5597"],
  ["vivid", "#70ad47"]
];

function attr(name: string, value: string | boolean | undefined): string {
  return value === undefined || value === false ? "" : ` ${name}="${typeof value === "boolean" ? "" : value}"`;
}

interface ButtonOptions {
  menu?: string;
  caret?: boolean;
  toggle?: boolean;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}

function big(cmd: string, label: string, iconName: string, options: ButtonOptions = {}): string {
  return `<button class="gc-rbn-big${options.active ? " is-active" : ""}" type="button" data-cmd="${cmd}"${attr(
    "data-menu",
    options.menu
  )}${attr("title", options.title ?? label)}${attr("disabled", options.disabled)}>
    ${icon(iconName, 22)}<span>${label}</span>${
    options.caret ? '<span class="gc-rbn-caret" data-menu-caret="1">' + icon("chevron-down", 9) + "</span>" : ""
  }
  </button>`;
}

function small(cmd: string, iconName: string, title: string, options: ButtonOptions = {}): string {
  return `<button class="gc-rbn-small${options.active ? " is-active" : ""}" type="button" data-cmd="${cmd}"${attr(
    "data-menu",
    options.menu
  )}${attr("title", title)}${attr("disabled", options.disabled)} aria-label="${title}">${icon(iconName, 16)}${
    options.caret ? '<span class="gc-rbn-caret" data-menu-caret="1">' + icon("chevron-down", 8) + "</span>" : ""
  }</button>`;
}

function col(...content: string[]): string {
  return `<div class="gc-rbn-col">${content.join("")}</div>`;
}

function row(...content: string[]): string {
  return `<div class="gc-rbn-row">${content.join("")}</div>`;
}

function group(label: string, content: string): string {
  return `<div class="gc-rbn-group"><div class="gc-rbn-group-body">${content}</div><span class="gc-rbn-group-label">${label}</span></div>`;
}

function select(dataName: string, options: Array<[string, string]>, value: string, title: string): string {
  return `<select class="gc-rbn-select" data-select="${dataName}" title="${title}">${options
    .map(([key, text]) => `<option value="${key}"${key === value ? " selected" : ""}>${text}</option>`)
    .join("")}</select>`;
}

function fontSelect(state: RibbonState): string {
  return select(
    "font-name",
    FONTS.map(font => [font, font]),
    state.fontName,
    "Font"
  );
}

function sizeControl(state: RibbonState): string {
  return `<div class="gc-rbn-size"><input class="gc-rbn-input" data-select="font-size" type="number" min="8" max="72" value="${
    state.fontSize
  }" title="Font size" /><div class="gc-rbn-size-buttons"><button class="gc-rbn-step" type="button" data-cmd="font-inc" title="Increase font size">${icon(
    "plus",
    8
  )}</button><button class="gc-rbn-step" type="button" data-cmd="font-dec" title="Decrease font size">${icon(
    "minus",
    8
  )}</button></div></div>`;
}

function numberSelect(state: RibbonState): string {
  return select("num-format", NUM_FORMATS, state.numFmt, "Number format");
}

function tableSwatchGallery(): string {
  return `<div class="gc-rbn-gallery">${TABLE_SWATCHES.map(
    ([id, color]) =>
      `<button class="gc-style-swatch" type="button" data-cmd="table-style-${id}" title="Table style"><span style="background:${color}"></span><span style="background:${color}22"></span><span style="background:${color}22"></span></button>`
  ).join("")}</div>`;
}

function chartSwatchGallery(): string {
  return `<div class="gc-rbn-gallery">${CHART_SWATCHES.map(
    ([id, color]) =>
      `<button class="gc-style-swatch gc-style-swatch--chart" type="button" data-cmd="chart-palette-${id}" title="Chart colors"><span style="background:${color}"></span><span style="background:#ed7d31"></span><span style="background:#a5a5a5"></span></button>`
  ).join("")}</div>`;
}

function homeTab(state: RibbonState): string {
  const bold = state.bold ? " is-active" : "";
  return [
    group(
      "Clipboard",
      row(
        big("paste", "Paste", "paste", { menu: "paste" }),
        col(
          row(small("cut", "cut", "Cut"), small("copy", "copy", "Copy")),
          row(small("format-painter", "format-painter", "Format Painter"))
        )
      )
    ),
    group(
      "Font",
      col(
        row(fontSelect(state), sizeControl(state)),
        row(
          `<button class="gc-rbn-small${bold}" type="button" data-cmd="bold" title="Bold (Ctrl+B)"><strong>B</strong></button>`,
          `<button class="gc-rbn-small${
            state.italic ? " is-active" : ""
          }" type="button" data-cmd="italic" title="Italic (Ctrl+I)"><em>I</em></button>`,
          `<button class="gc-rbn-small${
            state.underline ? " is-active" : ""
          }" type="button" data-cmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>`,
          small("borders", "borders", "Borders", { menu: "borders", caret: true }),
          `<button class="gc-rbn-small gc-color-btn" type="button" data-menu="fill-color" title="Fill color">${icon(
            "fill",
            16
          )}<span class="gc-color-bar" style="background:#ffeb84"></span></button>`,
          `<button class="gc-rbn-small gc-color-btn" type="button" data-menu="font-color" title="Font color">${icon(
            "font-color",
            16
          )}<span class="gc-color-bar" style="background:#c0392b"></span></button>`
        )
      )
    ),
    group(
      "Alignment",
      col(
        row(
          small("valign-top", "align-top", "Top Align", { active: state.valign === "top" }),
          small("valign-middle", "align-middle", "Middle Align", { active: state.valign === "middle" }),
          small("valign-bottom", "align-bottom", "Bottom Align", { active: state.valign === "bottom" }),
          small("orientation", "orientation", "Orientation", { menu: "orientation" }),
          small("wrap-text", "wrap-text", "Wrap Text", { active: state.wrap })
        ),
        row(
          small("align-left", "align-left", "Align Left", { active: state.align === "left" }),
          small("align-center", "align-center", "Center", { active: state.align === "center" }),
          small("align-right", "align-right", "Align Right", { active: state.align === "right" }),
          small("merge", "merge", "Merge & Center", { menu: "merge", caret: true })
        )
      )
    ),
    group(
      "Number",
      col(
        row(numberSelect(state)),
        row(
          small("currency", "dollar", "Currency format"),
          small("percent", "percent", "Percent format"),
          small("comma", "comma", "Comma format"),
          small("inc-decimals", "decimal-inc", "Increase decimal"),
          small("dec-decimals", "decimal-dec", "Decrease decimal")
        )
      )
    ),
    group(
      "Styles",
      row(
        big("conditional", "Conditional Formatting", "conditional", { menu: "conditional", caret: true }),
        big("format-table", "Format as Table", "table", { menu: "table-styles", caret: true }),
        big("cell-styles", "Cell Styles", "cell-styles", { menu: "cell-styles", caret: true })
      )
    ),
    group(
      "Cells",
      col(
        row(
          small("insert-cells", "insert", "Insert", { menu: "insert-cells", caret: true }),
          small("delete-cells", "delete", "Delete", { menu: "delete-cells", caret: true })
        ),
        row(small("format-cells-menu", "format", "Format", { menu: "format-cells-menu", caret: true }))
      )
    ),
    group(
      "Editing",
      row(
        big("autosum", "AutoSum", "autosum", { menu: "autosum-menu", caret: true }),
        col(
          row(small("sort-filter", "sort-desc", "Sort & Filter", { menu: "sort-filter", caret: true })),
          row(small("find-select", "find", "Find & Select", { menu: "find-select", caret: true })),
          row(
            small("fill", "fill-down", "Fill", { menu: "fill-menu", caret: true }),
            small("clear", "clear", "Clear", { menu: "clear-menu", caret: true })
          )
        )
      )
    )
  ].join("");
}

function insertTab(): string {
  return [
    group("Tables", row(big("pivot-table", "PivotTable", "pivot"), big("insert-table", "Table", "table"))),
    group("Illustrations", row(big("insert-picture", "Pictures", "picture"), big("insert-shape", "Shapes", "shapes"))),
    group(
      "Charts",
      row(
        big("insert-chart-column", "Column", "chart-column", { menu: "chart-types" }),
        col(
          row(
            small("insert-chart-bar", "chart-bar", "Bar chart"),
            small("insert-chart-line", "chart-line", "Line chart"),
            small("insert-chart-area", "chart-area", "Area chart")
          ),
          row(
            small("insert-chart-pie", "chart-pie", "Pie chart"),
            small("insert-chart-scatter", "chart-scatter", "Scatter chart"),
            small("insert-chart-more", "more", "More chart types", { menu: "chart-types" })
          )
        )
      )
    ),
    group(
      "Sparklines",
      row(big("sparkline-line", "Line", "sparkline"), big("sparkline-column", "Column", "chart-column"))
    ),
    group(
      "Text",
      row(
        big("insert-textbox", "Text Box", "text-box"),
        big("insert-header-footer", "Header & Footer", "header-footer")
      )
    ),
    group("Symbols", row(big("insert-symbol", "Symbol", "symbol")))
  ].join("");
}

function drawTab(): string {
  return [
    group(
      "Tools",
      row(
        big("draw-pen", "Pen", "script"),
        big("draw-highlighter", "Highlighter", "fill"),
        big("draw-eraser", "Eraser", "clear"),
        big("draw-ruler", "Ruler", "ruler")
      )
    ),
    group(
      "Convert",
      row(
        big("ink-shape", "Ink to Shape", "shapes"),
        big("ink-math", "Ink to Math", "symbol"),
        big("ink-replay", "Replay", "run")
      )
    ),
    group("Close", row(big("draw-close", "Close Ink", "close")))
  ].join("");
}

function layoutTab(state: RibbonState): string {
  return [
    group(
      "Page Setup",
      row(
        big("page-margins", "Margins", "page-layout", { menu: "margins" }),
        big("page-orientation", "Orientation", "orientation", { menu: "orientation" }),
        big("page-size", "Size", "page-layout", { menu: "page-size" }),
        col(
          row(small("print-area", "print", "Print Area", { menu: "print-area" })),
          row(small("page-breaks", "page-break", "Breaks", { menu: "page-breaks" })),
          row(small("page-background", "picture", "Background"), small("print-titles", "header-footer", "Print Titles"))
        )
      )
    ),
    group(
      "Scale to Fit",
      col(
        row(
          small("scale-width", "arrow-right", "Width: Automatic"),
          small("scale-height", "arrow-down", "Height: Automatic")
        ),
        row(small("scale-percent", "percent", "Scale: 100%"))
      )
    ),
    group(
      "Sheet Options",
      col(
        row(
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="gridlines"${
            state.gridlines ? " checked" : ""
          }/> Gridlines</label>`
        ),
        row(
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="headings"${
            state.headings ? " checked" : ""
          }/> Headings</label>`
        )
      )
    ),
    group(
      "Arrange",
      row(
        small("arrange-forward", "arrow-up", "Bring Forward"),
        small("arrange-backward", "arrow-down", "Send Backward"),
        small("arrange-pane", "layout", "Selection Pane")
      )
    )
  ].join("");
}

function formulasTab(state: RibbonState): string {
  return [
    group(
      "Function Library",
      row(
        big("insert-function", "Insert Function", "fx", { title: "Insert Function" }),
        big("autosum", "AutoSum", "autosum", { menu: "autosum-menu", caret: true }),
        col(
          row(
            small("fn-financial", "dollar", "Financial", { menu: "fn-financial", caret: true }),
            small("fn-logical", "conditional", "Logical", { menu: "fn-logical", caret: true })
          ),
          row(
            small("fn-text", "text-box", "Text", { menu: "fn-text", caret: true }),
            small("fn-date", "page-layout", "Date & Time", { menu: "fn-date", caret: true })
          ),
          row(
            small("fn-lookup", "find", "Lookup & Reference", { menu: "fn-lookup", caret: true }),
            small("fn-math", "autosum", "Math & Trig", { menu: "fn-math", caret: true })
          ),
          row(small("fn-more", "more", "More Functions", { menu: "fn-more", caret: true }))
        )
      )
    ),
    group(
      "Defined Names",
      row(
        big("name-manager", "Name Manager", "name-manager"),
        col(
          row(small("define-name", "define-name", "Define Name")),
          row(small("use-formula", "use-formula", "Use in Formula", { menu: "use-formula", caret: true })),
          row(small("create-from-selection", "selection", "Create from Selection"))
        )
      )
    ),
    group(
      "Formula Auditing",
      col(
        row(
          small("trace-precedents", "trace-prec", "Trace Precedents"),
          small("trace-dependents", "trace-dep", "Trace Dependents"),
          small("remove-arrows", "remove-arrows", "Remove Arrows")
        ),
        row(
          small("show-formulas", "show-formulas", "Show Formulas", { active: state.showFormulas }),
          small("error-checking", "error-check", "Error Checking"),
          small("evaluate-formula", "evaluate", "Evaluate Formula")
        )
      )
    ),
    group(
      "Calculation",
      row(
        big("calc-options", "Calculation Options", "calc-options", { menu: "calc-options", caret: true }),
        col(
          row(small("calculate-now", "calculate", "Calculate Now")),
          row(small("calculate-sheet", "calculate", "Calculate Sheet"))
        )
      )
    )
  ].join("");
}

function dataTab(): string {
  return [
    group("Get & Transform Data", row(big("get-data", "Get Data", "get-data", { menu: "get-data", caret: true }))),
    group(
      "Sort & Filter",
      row(
        big("sort", "Sort", "sort-asc", { menu: "sort-menu", caret: true }),
        col(
          row(small("filter-toggle", "filter", "Filter"), small("clear-filter", "clear-filter", "Clear")),
          row(small("reapply-filter", "refresh", "Reapply"))
        )
      )
    ),
    group(
      "Data Tools",
      col(
        row(
          small("text-columns", "text-columns", "Text to Columns"),
          small("flash-fill", "flash-fill", "Flash Fill"),
          small("remove-duplicates", "remove-duplicates", "Remove Duplicates")
        ),
        row(
          small("data-validation", "validation", "Data Validation"),
          small("consolidate", "consolidate", "Consolidate"),
          small("relationships", "relationships", "Relationships")
        )
      )
    ),
    group(
      "Outline",
      row(big("group", "Group", "group"), big("ungroup", "Ungroup", "ungroup"), big("subtotal", "Subtotal", "subtotal"))
    ),
    group("PivotTable", row(big("pivot-table", "PivotTable", "pivot")))
  ].join("");
}

function reviewTab(state: RibbonState): string {
  return [
    group("Proofing", row(big("spelling", "Spelling", "spell"), big("thesaurus", "Thesaurus", "thesaurus"))),
    group(
      "Comments",
      row(
        big("new-comment", "New Comment", "new-comment"),
        col(
          row(small("delete-comment", "delete-comment", "Delete")),
          row(small("prev-comment", "prev-comment", "Previous"), small("next-comment", "next-comment", "Next")),
          row(small("show-comments", "show-formulas", "Show Comments", { active: state.showFormulas }))
        )
      )
    ),
    group(
      "Protect",
      row(
        big("protect-sheet", "Protect Sheet", "protect"),
        big("protect-workbook", "Protect Workbook", "lock"),
        big("allow-edit-ranges", "Allow Edit Ranges", "unlock")
      )
    ),
    group("Workbook", row(big("share-workbook", "Share", "share")))
  ].join("");
}

function viewTab(state: RibbonState): string {
  return [
    group(
      "Workbook Views",
      row(
        big("view-normal", "Normal", "normal"),
        big("view-page-break", "Page Break Preview", "page-break"),
        big("view-page-layout", "Page Layout", "page-layout")
      )
    ),
    group(
      "Show",
      col(
        row(small("toggle-ruler", "ruler", "Ruler")),
        row(
          small("toggle-gridlines", "grid", "Gridlines", { active: state.gridlines }),
          small("toggle-formula-bar", "formula-bar", "Formula Bar", { active: state.formulaBar })
        ),
        row(small("toggle-headings", "headings", "Headings", { active: state.headings }))
      )
    ),
    group(
      "Zoom",
      row(
        big("zoom", "Zoom", "zoom", { menu: "zoom-menu", caret: true }),
        col(row(small("zoom-100", "percent", "100%")), row(small("zoom-selection", "selection", "Zoom to Selection")))
      )
    ),
    group(
      "Window",
      col(
        row(small("new-window", "new-window", "New Window"), small("arrange-all", "arrange", "Arrange All")),
        row(
          small("freeze-panes", "freeze", "Freeze Panes", { menu: "freeze-panes", caret: true }),
          small("split", "split", "Split")
        ),
        row(small("hide-window", "hide", "Hide"), small("unhide-window", "eye", "Unhide"))
      )
    ),
    group("Macros", row(big("macros", "Macros", "macros")))
  ].join("");
}

function automateTab(): string {
  return [
    group(
      "Scripting",
      row(
        big("record-macro", "Record Macro", "record"),
        big("macros", "Macros", "macros"),
        big("script-editor", "Script Editor", "script"),
        big("run-script", "Run Script", "run")
      )
    ),
    group("AI", row(big("ai-assistant", "GridCraft AI", "ai"), big("analyze-data", "Analyze Data", "chart-column"))),
    group("Automation", row(big("mcp-server", "MCP Server", "mcp"), big("cli", "CLI", "script")))
  ].join("");
}

function tableTab(state: RibbonState): string {
  const table = state.table;
  if (!table) return "";
  return [
    group(
      "Properties",
      row(
        big("table-name", "Table Name", "rename"),
        col(
          row(small("resize-table", "resize", "Resize Table")),
          row(small("summarize-pivot", "pivot", "Summarize with PivotTable")),
          row(
            small("remove-duplicates", "remove-duplicates", "Remove Duplicates"),
            small("convert-to-range", "table", "Convert to Range")
          )
        )
      )
    ),
    group(
      "Table Style Options",
      col(
        row(
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="table-header"${
            table.header ? " checked" : ""
          }/> Header Row</label>`,
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="table-totals"${
            table.totals ? " checked" : ""
          }/> Total Row</label>`
        ),
        row(
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="table-banded"${
            table.banded ? " checked" : ""
          }/> Banded Rows</label>`,
          `<label class="gc-rbn-check"><input type="checkbox" data-toggle="table-filter"${
            table.filter ? " checked" : ""
          }/> Filter Button</label>`
        )
      )
    ),
    group("Table Styles", tableSwatchGallery())
  ].join("");
}

function chartTab(state: RibbonState): string {
  if (!state.chart) return "";
  return [
    group(
      "Data",
      row(
        big("add-chart-element", "Add Chart Element", "add-element", { menu: "chart-elements", caret: true }),
        big("switch-rows", "Switch Row/Column", "switch"),
        big("select-data", "Select Data", "selection")
      )
    ),
    group(
      "Chart Layouts",
      row(
        big("change-chart-type", "Change Chart Type", "chart-design", { menu: "chart-types", caret: true }),
        big("quick-layout", "Quick Layout", "layout", { menu: "chart-layouts", caret: true })
      )
    ),
    group("Chart Styles", chartSwatchGallery()),
    group(
      "Chart",
      row(
        big("format-pane", "Format Pane", "format-pane"),
        big("chart-title", "Chart Title", "chart-title"),
        big("delete-chart", "Delete Chart", "delete-chart")
      )
    )
  ].join("");
}

function pivotTab(state: RibbonState): string {
  if (!state.pivot) return "";
  return [
    group(
      "PivotTable",
      row(
        big("pivot-name", "PivotTable Name", "rename"),
        col(
          row(small("pivot-options", "settings", "Options")),
          row(small("refresh-pivot", "refresh", "Refresh"), small("refresh-all", "refresh", "Refresh All")),
          row(small("change-source", "get-data", "Change Data Source"))
        )
      )
    ),
    group(
      "Show",
      row(
        big("pivot-field-list", "Field List", "field-list"),
        col(
          row(small("pivot-field-headers", "header-footer", "Field Headers")),
          row(small("insert-slicer", "slicer", "Insert Slicer")),
          row(small("insert-timeline", "page-break", "Insert Timeline"))
        )
      )
    ),
    group(
      "Calculations",
      col(
        row(small("show-values-as", "calculator", "Show Values As", { menu: "show-values", caret: true })),
        row(
          small("pivot-grand-totals", "totals", "Grand Totals", { menu: "grand-totals", caret: true }),
          small("pivot-layout", "layout", "Layout", { menu: "pivot-layout", caret: true })
        )
      )
    )
  ].join("");
}

export function renderRibbon(tab: RibbonTabId, state: RibbonState): string {
  switch (tab) {
    case "home":
      return homeTab(state);
    case "insert":
      return insertTab();
    case "draw":
      return drawTab();
    case "layout":
      return layoutTab(state);
    case "formulas":
      return formulasTab(state);
    case "data":
      return dataTab();
    case "review":
      return reviewTab(state);
    case "view":
      return viewTab(state);
    case "automate":
      return automateTab();
    case "table":
      return tableTab(state);
    case "chart":
      return chartTab(state);
    case "pivot":
      return pivotTab(state);
    default:
      return homeTab(state);
  }
}
