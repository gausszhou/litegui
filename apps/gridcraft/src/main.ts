import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { HeaderBar } from "@gausszhou/litegui-components";
import { createDemoWorkbook } from "./demo";
import { confirmDialog, escape as esc, isDialogOpen, openDialog, promptDialog } from "./dialogs";
import { formatScalar, formatStat, parseInput } from "./format";
import { adjustFormula, CalcEngine, isError, remapFormula, scanRefs } from "./formula";
import { GridView, type EditDirection, type GridContext, type GridTarget } from "./grid";
import { icon } from "./icons";
import { closeMenus, initMenus, openMenu, openMenuAt, type MenuItem } from "./menu";
import {
  activeSheet,
  cellKey,
  createSheet,
  ensureCell,
  parseAddress,
  parseRect,
  rectToRange,
  tableAt,
  tableRect,
  type Cell,
  type CellStyle,
  type ChartSpec,
  type ChartType,
  type CondRule,
  type NumFmt,
  type PivotValue,
  type Rect,
  type Sheet,
  type TableSpec,
  type TableStyleId,
  type Workbook
} from "./model";
import { renderChartPane, renderPivotPane, type PivotArea } from "./panes";
import { applyPivot, PIVOT_AGG_LABELS, readPivotSource } from "./pivot";
import { contextTabs, renderRibbon, RIBBON_TABS, type RibbonState, type RibbonTabId } from "./ribbon";

/* ------------------------------------------------------------------ state */

const STORAGE_KEY = "litegui.gridcraft.workbook.v1";

let workbook: Workbook = loadWorkbook();
let engine = new CalcEngine(workbook);
let grid: GridView;
let activeTab: RibbonTabId = "home";
let showFormulaBar = true;
let chartPaneOpen = true;
let pivotPaneOpen = true;
let paneKey = "";
let manualCalc = false;
let clipboard: { matrix: string[][]; rect: Rect | null; cut: boolean } | null = null;
const undoStack: string[] = [];
const redoStack: string[] = [];
let statusTimer = 0;
let autosaveTimer = 0;
let chartHistoryAt = 0;
let contextSignature = "";

function loadWorkbook(): Workbook {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { version?: number; workbook?: Workbook };
      if (data.version === 1 && data.workbook?.sheets?.length) return data.workbook;
    }
  } catch {
    /* corrupted autosave: fall back to the sample workbook */
  }
  return createDemoWorkbook();
}

const FUNCTION_LIBRARY: Array<{ name: string; category: string; signature: string; description: string }> = [
  {
    name: "SUM",
    category: "Math & Trig",
    signature: "SUM(number1, [number2], …)",
    description: "Adds all the numbers in a range of cells."
  },
  {
    name: "AVERAGE",
    category: "Statistical",
    signature: "AVERAGE(number1, [number2], …)",
    description: "Returns the average (arithmetic mean) of its arguments."
  },
  {
    name: "COUNT",
    category: "Statistical",
    signature: "COUNT(value1, [value2], …)",
    description: "Counts the number of cells that contain numbers."
  },
  {
    name: "COUNTA",
    category: "Statistical",
    signature: "COUNTA(value1, [value2], …)",
    description: "Counts the number of non-empty cells."
  },
  {
    name: "MIN",
    category: "Statistical",
    signature: "MIN(number1, [number2], …)",
    description: "Returns the smallest number in a set of values."
  },
  {
    name: "MAX",
    category: "Statistical",
    signature: "MAX(number1, [number2], …)",
    description: "Returns the largest number in a set of values."
  },
  {
    name: "MEDIAN",
    category: "Statistical",
    signature: "MEDIAN(number1, [number2], …)",
    description: "Returns the median of the given numbers."
  },
  {
    name: "STDEV.S",
    category: "Statistical",
    signature: "STDEV.S(number1, [number2], …)",
    description: "Estimates standard deviation based on a sample."
  },
  {
    name: "ROUND",
    category: "Math & Trig",
    signature: "ROUND(number, num_digits)",
    description: "Rounds a number to a specified number of digits."
  },
  {
    name: "ROUNDUP",
    category: "Math & Trig",
    signature: "ROUNDUP(number, num_digits)",
    description: "Rounds a number up, away from zero."
  },
  {
    name: "ROUNDDOWN",
    category: "Math & Trig",
    signature: "ROUNDDOWN(number, num_digits)",
    description: "Rounds a number down, toward zero."
  },
  {
    name: "ABS",
    category: "Math & Trig",
    signature: "ABS(number)",
    description: "Returns the absolute value of a number."
  },
  {
    name: "MOD",
    category: "Math & Trig",
    signature: "MOD(number, divisor)",
    description: "Returns the remainder after division."
  },
  {
    name: "SQRT",
    category: "Math & Trig",
    signature: "SQRT(number)",
    description: "Returns the positive square root of a number."
  },
  {
    name: "POWER",
    category: "Math & Trig",
    signature: "POWER(number, power)",
    description: "Returns a number raised to a power."
  },
  {
    name: "SUMPRODUCT",
    category: "Math & Trig",
    signature: "SUMPRODUCT(array1, [array2], …)",
    description: "Multiplies ranges and returns the sum of the products."
  },
  {
    name: "SUMIF",
    category: "Math & Trig",
    signature: "SUMIF(range, criteria, [sum_range])",
    description: "Adds cells specified by a given condition."
  },
  {
    name: "SUMIFS",
    category: "Math & Trig",
    signature: "SUMIFS(sum_range, criteria_range1, criteria1, …)",
    description: "Adds cells that meet multiple conditions."
  },
  {
    name: "COUNTIF",
    category: "Statistical",
    signature: "COUNTIF(range, criteria)",
    description: "Counts cells that meet a condition."
  },
  {
    name: "COUNTIFS",
    category: "Statistical",
    signature: "COUNTIFS(range1, criteria1, …)",
    description: "Counts cells that meet multiple conditions."
  },
  {
    name: "IF",
    category: "Logical",
    signature: "IF(logical_test, [value_if_true], [value_if_false])",
    description: "Returns one value if a condition is TRUE and another if FALSE."
  },
  {
    name: "IFS",
    category: "Logical",
    signature: "IFS(test1, value1, [test2, value2], …)",
    description: "Checks multiple conditions and returns the first TRUE result."
  },
  {
    name: "IFERROR",
    category: "Logical",
    signature: "IFERROR(value, value_if_error)",
    description: "Returns a fallback when a formula evaluates to an error."
  },
  {
    name: "AND",
    category: "Logical",
    signature: "AND(logical1, [logical2], …)",
    description: "Returns TRUE if all arguments are TRUE."
  },
  {
    name: "OR",
    category: "Logical",
    signature: "OR(logical1, [logical2], …)",
    description: "Returns TRUE if any argument is TRUE."
  },
  { name: "NOT", category: "Logical", signature: "NOT(logical)", description: "Reverses the logic of its argument." },
  {
    name: "VLOOKUP",
    category: "Lookup & Reference",
    signature: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
    description: "Looks for a value in the first column of a table."
  },
  {
    name: "HLOOKUP",
    category: "Lookup & Reference",
    signature: "HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
    description: "Looks for a value in the first row of a table."
  },
  {
    name: "XLOOKUP",
    category: "Lookup & Reference",
    signature: "XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])",
    description: "Searches a range and returns a corresponding item."
  },
  {
    name: "INDEX",
    category: "Lookup & Reference",
    signature: "INDEX(array, row_num, [column_num])",
    description: "Returns a value from a position inside a range."
  },
  {
    name: "MATCH",
    category: "Lookup & Reference",
    signature: "MATCH(lookup_value, lookup_array, [match_type])",
    description: "Returns the relative position of an item in a range."
  },
  {
    name: "CHOOSE",
    category: "Lookup & Reference",
    signature: "CHOOSE(index_num, value1, [value2], …)",
    description: "Chooses a value from a list of arguments."
  },
  {
    name: "TEXT",
    category: "Text",
    signature: "TEXT(value, format_text)",
    description: "Converts a value to text with a number format."
  },
  {
    name: "CONCAT",
    category: "Text",
    signature: "CONCAT(text1, [text2], …)",
    description: "Joins text from ranges and strings."
  },
  {
    name: "TEXTJOIN",
    category: "Text",
    signature: "TEXTJOIN(delimiter, ignore_empty, text1, …)",
    description: "Joins text with a delimiter."
  },
  {
    name: "LEFT",
    category: "Text",
    signature: "LEFT(text, [num_chars])",
    description: "Returns characters from the start of a text string."
  },
  {
    name: "RIGHT",
    category: "Text",
    signature: "RIGHT(text, [num_chars])",
    description: "Returns characters from the end of a text string."
  },
  {
    name: "MID",
    category: "Text",
    signature: "MID(text, start_num, num_chars)",
    description: "Returns characters from the middle of a text string."
  },
  {
    name: "LEN",
    category: "Text",
    signature: "LEN(text)",
    description: "Returns the number of characters in a text string."
  },
  { name: "UPPER", category: "Text", signature: "UPPER(text)", description: "Converts text to uppercase." },
  { name: "LOWER", category: "Text", signature: "LOWER(text)", description: "Converts text to lowercase." },
  { name: "TRIM", category: "Text", signature: "TRIM(text)", description: "Removes extra spaces from text." },
  { name: "TODAY", category: "Date & Time", signature: "TODAY()", description: "Returns the current date." },
  { name: "NOW", category: "Date & Time", signature: "NOW()", description: "Returns the current date and time." },
  {
    name: "YEAR",
    category: "Date & Time",
    signature: "YEAR(serial_number)",
    description: "Returns the year of a date."
  },
  {
    name: "MONTH",
    category: "Date & Time",
    signature: "MONTH(serial_number)",
    description: "Returns the month of a date."
  },
  { name: "DAY", category: "Date & Time", signature: "DAY(serial_number)", description: "Returns the day of a date." },
  {
    name: "DATE",
    category: "Date & Time",
    signature: "DATE(year, month, day)",
    description: "Builds a date from year, month and day."
  },
  {
    name: "LARGE",
    category: "Statistical",
    signature: "LARGE(array, k)",
    description: "Returns the k-th largest value in a data set."
  },
  {
    name: "SMALL",
    category: "Statistical",
    signature: "SMALL(array, k)",
    description: "Returns the k-th smallest value in a data set."
  }
];

const CELL_STYLE_PRESETS: Array<{ name: string; style: CellStyle }> = [
  { name: "Normal", style: {} },
  { name: "Title", style: { bold: true, size: 18, color: "#12554d" } },
  { name: "Heading 1", style: { bold: true, size: 15, color: "#12554d" } },
  { name: "Heading 2", style: { bold: true, size: 13, color: "#12554d" } },
  { name: "Total", style: { bold: true, fill: "#e3f0ed", border: { top: true, bottom: true } } },
  { name: "Good", style: { fill: "#c9e9d0" } },
  { name: "Bad", style: { fill: "#f8cec2" } },
  { name: "Neutral", style: { fill: "#fff0b8" } },
  { name: "Input", style: { fill: "#fff7d6", border: { bottom: true } } },
  { name: "Output", style: { bold: true, fill: "#eaf4f2" } },
  { name: "Calculation", style: { italic: true, color: "#4a4a4a" } },
  { name: "Note", style: { italic: true, color: "#7a5c00", fill: "#fffbe6" } }
];

/* ------------------------------------------------------------------ shell */

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="gc-app">
    <div id="gc-topbar" class="gc-topbar-slot"></div>
    <div class="gc-ribbon">
      <div class="gc-ribbon-tabs" id="gc-ribbon-tabs" role="tablist"></div>
      <div class="gc-ribbon-body" id="gc-ribbon-body"></div>
    </div>
    <div class="gc-formula-bar" id="gc-formula-bar">
      <div class="gc-name-wrap">
        <input class="gc-name-box" id="gc-name-box" value="A1" aria-label="Name Box" spellcheck="false" />
        <button class="gc-name-caret" id="gc-name-caret" type="button" title="Named ranges">${icon(
          "chevron-down",
          10
        )}</button>
      </div>
      <div class="gc-fb-buttons">
        <button class="gc-fb-btn" id="gc-fb-cancel" type="button" title="Cancel (Esc)">${icon("close", 13)}</button>
        <button class="gc-fb-btn" id="gc-fb-enter" type="button" title="Enter">${icon("check", 14)}</button>
      </div>
      <span class="gc-fx">fx</span>
      <input class="gc-formula-input" id="gc-formula-input" spellcheck="false" autocomplete="off" aria-label="Formula bar" />
      <button class="gc-formula-caret" id="gc-formula-caret" type="button" title="Formula options">${icon(
        "chevron-down",
        12
      )}</button>
    </div>
    <div class="gc-workspace">
      <div class="gc-grid-area">
        <div class="gc-viewport" id="gc-viewport" tabindex="0"></div>
      </div>
      <aside class="gc-pane-host" id="gc-pane" hidden></aside>
    </div>
    <div class="gc-sheet-bar">
      <div class="gc-sheet-nav">
        <button class="gc-sheet-navbtn" id="gc-sheet-prev" type="button" title="Previous sheet">${icon(
          "chevron-left",
          12
        )}</button>
        <button class="gc-sheet-navbtn" id="gc-sheet-next" type="button" title="Next sheet">${icon(
          "chevron-right",
          12
        )}</button>
      </div>
      <div class="gc-sheet-tabs" id="gc-sheet-tabs"></div>
      <button class="gc-sheet-add" id="gc-sheet-add" type="button" title="New sheet">${icon("plus", 14)}</button>
      <div class="gc-sheet-spacer"></div>
    </div>
    <div class="gc-status-bar">
      <span class="gc-status-text" id="gc-status">Ready</span>
      <span class="gc-status-stats" id="gc-status-stats"></span>
      <div class="gc-status-right">
        <div class="gc-view-buttons">
          <button class="gc-status-btn" type="button" data-cmd="view-normal" title="Normal view">${icon(
            "normal",
            14
          )}</button>
          <button class="gc-status-btn" type="button" data-cmd="view-page-break" title="Page Break Preview">${icon(
            "page-break",
            14
          )}</button>
          <button class="gc-status-btn" type="button" data-cmd="view-page-layout" title="Page Layout">${icon(
            "page-layout",
            14
          )}</button>
        </div>
        <div class="gc-zoom-control">
          <button class="gc-status-btn" type="button" data-cmd="zoom-out" title="Zoom out">${icon("minus", 12)}</button>
          <input type="range" id="gc-zoom-slider" min="40" max="200" step="10" value="100" aria-label="Zoom" />
          <button class="gc-status-btn" type="button" data-cmd="zoom-in" title="Zoom in">${icon("plus", 12)}</button>
          <span class="gc-zoom-label" id="gc-zoom-label">100%</span>
        </div>
      </div>
    </div>
  </div>
`;

initMenus();

function q<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
}

function getSheet(): Sheet {
  return activeSheet(workbook);
}

function setStatus(text: string, timeout = 3200): void {
  const element = q<HTMLElement>("#gc-status");
  element.textContent = text;
  if (statusTimer) window.clearTimeout(statusTimer);
  if (timeout > 0) {
    statusTimer = window.setTimeout(() => {
      const current = document.querySelector<HTMLElement>("#gc-status");
      if (current) current.textContent = "Ready";
    }, timeout);
  }
}

function markDirty(): void {
  updateDocTitle();
  scheduleAutosave();
}

function scheduleAutosave(): void {
  if (!workbook.autosave) return;
  if (autosaveTimer) window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => saveWorkbook(true), 800);
}

function saveWorkbook(silent: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), workbook }));
    if (!silent) setStatus("Workbook saved in this browser");
  } catch {
    if (!silent) setStatus("Could not save the workbook");
  }
}

function updateDocTitle(): void {
  const title = q<HTMLElement>("#gc-doc-title");
  title.textContent = workbook.title;
  document.title = `${workbook.title} — GridCraft`;
}

/* --------------------------------------------------------------- top bar */

const header = new HeaderBar({ variant: "topbar", className: "gc-topbar", height: 34 });
q<HTMLElement>("#gc-topbar").appendChild(header.root);

const topLeft = document.createElement("div");
topLeft.className = "gc-topbar-left";
topLeft.innerHTML = `
  <span class="gc-autosave-label">AutoSave</span>
  <button class="gc-switch${
    workbook.autosave ? " is-on" : ""
  }" id="gc-autosave" type="button" role="switch" aria-checked="${
  workbook.autosave
}" title="AutoSave"><span></span></button>
  <span class="gc-top-sep"></span>
  <button class="gc-top-btn" type="button" data-cmd="home" title="Start">${icon("home", 16)}</button>
  <button class="gc-top-btn" type="button" data-cmd="save" title="Save">${icon("save", 16)}</button>
  <button class="gc-top-btn" type="button" data-cmd="undo" title="Undo (Ctrl+Z)">${icon("undo", 16)}</button>
  <button class="gc-top-btn" type="button" data-cmd="redo" title="Redo (Ctrl+Y)">${icon("redo", 16)}</button>
  <button class="gc-top-btn" type="button" data-cmd="more-menu" title="More">${icon("more", 16)}</button>
`;
const docTitle = document.createElement("button");
docTitle.type = "button";
docTitle.id = "gc-doc-title";
docTitle.className = "gc-doc-title";
docTitle.title = "Rename workbook";
docTitle.textContent = workbook.title;

const topRight = document.createElement("div");
topRight.className = "gc-topbar-right";
topRight.innerHTML = `
  <button class="gc-top-btn" type="button" data-cmd="show-comments" title="Comments">${icon("comment", 16)}</button>
  <button class="gc-share-btn" type="button" data-cmd="share-menu" title="Share">Share ${icon(
    "chevron-down",
    10
  )}</button>
`;
header.setLeft(topLeft);
header.setCenter(docTitle);
header.setRight(topRight);
updateDocTitle();

docTitle.addEventListener("click", () => {
  promptDialog("Rename workbook", "Workbook name", workbook.title, value => {
    if (!value.trim()) return;
    workbook.title = value.trim();
    updateDocTitle();
    markDirty();
  });
});

/* ------------------------------------------------------------- shell refs */

const viewport = q<HTMLElement>("#gc-viewport");
const tabsEl = q<HTMLElement>("#gc-ribbon-tabs");
const ribbonBody = q<HTMLElement>("#gc-ribbon-body");
const formulaBar = q<HTMLElement>("#gc-formula-bar");
const formulaInput = q<HTMLInputElement>("#gc-formula-input");
const nameBox = q<HTMLInputElement>("#gc-name-box");
const sheetTabsEl = q<HTMLElement>("#gc-sheet-tabs");
const paneHost = q<HTMLElement>("#gc-pane");
const statusStats = q<HTMLElement>("#gc-status-stats");
const zoomSlider = q<HTMLInputElement>("#gc-zoom-slider");
const zoomLabel = q<HTMLElement>("#gc-zoom-label");

/* ---------------------------------------------------------------- history */

function snapshot(): string {
  return JSON.stringify(workbook);
}

function pushHistory(): void {
  undoStack.push(snapshot());
  if (undoStack.length > 60) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}

function restore(json: string): void {
  const data = JSON.parse(json) as Workbook;
  workbook.title = data.title;
  workbook.file = data.file;
  workbook.sheets = data.sheets;
  workbook.active = Math.min(Math.max(0, data.active), data.sheets.length - 1);
  workbook.names = data.names;
  workbook.autosave = data.autosave;
  engine = new CalcEngine(workbook);
  engine.invalidate();
  grid.invalidateLayout();
  grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
  grid.render();
  renderEverything();
  setStatus("Undo", 1200);
}

function undo(): void {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack.push(snapshot());
  restore(previous);
  updateHistoryButtons();
}

function redo(): void {
  const next = redoStack.pop();
  if (!next) return;
  undoStack.push(snapshot());
  restore(next);
  updateHistoryButtons();
}

function updateHistoryButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-cmd="undo"]').forEach(button => {
    button.classList.toggle("is-disabled", undoStack.length === 0);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-cmd="redo"]').forEach(button => {
    button.classList.toggle("is-disabled", redoStack.length === 0);
  });
}

/* --------------------------------------------------------------- mutations */

function afterMutation(message?: string, rerender = true): void {
  engine.invalidate();
  if (rerender) {
    grid.invalidateLayout();
    grid.render();
  }
  renderSheetTabs();
  refreshRibbon();
  syncSelectionUI();
  markDirty();
  if (message) setStatus(message);
}

function applyStyle(patch: Partial<CellStyle>, toggle?: keyof CellStyle): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  const targets: Cell[] = [];
  for (let r = rect.r1; r <= rect.r2; r += 1) {
    for (let c = rect.c1; c <= rect.c2; c += 1) targets.push(ensureCell(sheet, r, c));
  }
  const desired = toggle ? !targets.every(cell => Boolean(cell.style?.[toggle])) : undefined;
  pushHistory();
  for (const cell of targets) {
    const style: CellStyle = { ...(cell.style ?? {}) };
    if (toggle) {
      (style as Record<string, unknown>)[toggle] = desired;
    } else {
      Object.assign(style, patch);
    }
    for (const key of Object.keys(style) as Array<keyof CellStyle>) {
      if (style[key] === "" || style[key] === undefined) delete style[key];
    }
    cell.style = Object.keys(style).length ? style : undefined;
  }
  afterMutation(toggle ? "Formatting updated" : "Formatting applied");
}

function applyNumberFormat(format: NumFmt): void {
  const decimals =
    format === "currency" ? 2 : format === "number" ? 2 : format === "percent" ? 0 : format === "comma" ? 0 : undefined;
  applyStyle({ numFmt: format, decimals });
}

function toggleNumberFormat(format: NumFmt): void {
  const active = getActiveCell();
  if (active?.style?.numFmt === format) applyNumberFormat("general");
  else applyNumberFormat(format);
}

function getActiveCell(): Cell | undefined {
  const point = grid.activeCell;
  return getSheet().cells[cellKey(point.r, point.c)];
}

function selectionAddress(): string {
  return grid.selectionLabel();
}

function commitCell(ref: string, text: string, _direction: EditDirection): void {
  const point = parseAddress(ref);
  if (!point) return;
  const sheet = getSheet();
  if ((sheet as Sheet & { protected?: boolean }).protected) {
    setStatus("This sheet is protected");
    return;
  }
  pushHistory();
  const existing = sheet.cells[ref];
  if (text.trim() === "") {
    if (existing?.style || existing?.comment || existing?.sparkline) {
      existing.raw = "";
    } else {
      delete sheet.cells[ref];
    }
  } else {
    const parsed = parseInput(text);
    const cell = ensureCell(sheet, point.r, point.c);
    cell.raw = parsed.raw;
    if (parsed.style) cell.style = { ...cell.style, ...parsed.style };
  }
  afterMutation();
  setStatus("Ready");
  syncFormula();
}

/* -------------------------------------------------------------- selection */

function syncSelectionUI(): void {
  if (grid.isEditing()) return;
  nameBox.value = selectionAddress();
  syncFormula();
  const numbers = grid.selectionNumbers();
  if (numbers.length > 1) {
    const sum = numbers.reduce((total, value) => total + value, 0);
    const average = sum / numbers.length;
    statusStats.textContent = `Average: ${formatStat(average)}   Count: ${numbers.length}   Sum: ${formatStat(sum)}`;
  } else {
    statusStats.textContent = "";
  }
  updateContext();
}

function syncFormula(): void {
  if (grid.isEditing()) return;
  const cell = getActiveCell();
  formulaInput.value = cell?.raw ?? "";
}

function updateContext(): void {
  const sheet = getSheet();
  const active = grid.activeCell;
  const table = tableAt(sheet, active.r, active.c);
  const chart = grid.selectedChartSpec();
  const signature = `${sheet.id}|${table?.id ?? ""}|${chart?.id ?? ""}|${sheet.pivot ? 1 : 0}|${activeTab}`;
  if (signature === contextSignature) return;
  contextSignature = signature;
  const contextual = contextTabs(ribbonState());
  const valid = new Set<string>([...RIBBON_TABS.map(tab => tab.id), ...contextual.map(tab => tab.id)]);
  if (!valid.has(activeTab)) activeTab = "home";
  renderRibbonChrome();
  renderPane();
  updateSheetTabs();
}

/* ---------------------------------------------------------------- ribbon */

function ribbonState(): RibbonState {
  const sheet = getSheet();
  const active = grid.activeCell;
  const cell = sheet.cells[cellKey(active.r, active.c)];
  const table = tableAt(sheet, active.r, active.c);
  const chart = grid.selectedChartSpec() ?? undefined;
  return {
    bold: Boolean(cell?.style?.bold),
    italic: Boolean(cell?.style?.italic),
    underline: Boolean(cell?.style?.underline),
    align: cell?.style?.align ?? "left",
    valign: cell?.style?.valign ?? "middle",
    wrap: Boolean(cell?.style?.wrap),
    fontName: cell?.style?.font ?? "Calibri",
    fontSize: cell?.style?.size ?? 11,
    numFmt: cell?.style?.numFmt ?? "general",
    showFormulas: grid.showFormulas,
    gridlines: grid.showGridlines,
    headings: grid.showHeadings,
    formulaBar: showFormulaBar,
    table: table
      ? {
          name: table.name,
          header: table.header,
          totals: table.totals,
          banded: table.banded,
          firstColumn: Boolean(table.firstColumn),
          lastColumn: Boolean(table.lastColumn),
          filter: table.filter,
          style: table.style
        }
      : undefined,
    chart,
    pivot: Boolean(sheet.pivot)
  };
}

function renderRibbonChrome(): void {
  const state = ribbonState();
  const contextual = contextTabs(state);
  const sheet = getSheet();
  const active = grid.activeCell;
  contextSignature = `${sheet.id}|${tableAt(sheet, active.r, active.c)?.id ?? ""}|${state.chart?.id ?? ""}|${
    sheet.pivot ? 1 : 0
  }|${activeTab}`;
  const allTabs = [...RIBBON_TABS, ...contextual];
  tabsEl.innerHTML = allTabs
    .map(
      tab =>
        `<button class="gc-ribbon-tab${tab.id === activeTab ? " is-active" : ""}${
          contextual.some(entry => entry.id === tab.id) ? " is-contextual" : ""
        }" type="button" data-tab="${tab.id}">${tab.label}</button>`
    )
    .join("");
  ribbonBody.innerHTML = renderRibbon(activeTab, state);
}

function refreshRibbon(): void {
  renderRibbonChrome();
  contextSignature = "";
}

/* ------------------------------------------------------------ formatting */

function toggleStyle(key: "bold" | "italic" | "underline"): void {
  applyStyle({}, key);
}

function setAlign(direction: "left" | "center" | "right"): void {
  applyStyle({ align: direction });
}

function setVAlign(direction: "top" | "middle" | "bottom"): void {
  applyStyle({ valign: direction });
}

function shiftFontSize(delta: number): void {
  const current = getActiveCell()?.style?.size ?? 11;
  const size = Math.min(72, Math.max(6, current + delta));
  applyStyle({ size });
}

function mergeSelection(mode: "center" | "across" | "cells" | "unmerge"): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  pushHistory();
  const overlapping = sheet.merges.filter(
    merge => merge.r1 <= rect.r2 && merge.r2 >= rect.r1 && merge.c1 <= rect.c2 && merge.c2 >= rect.c1
  );
  sheet.merges = sheet.merges.filter(merge => !overlapping.includes(merge));
  if (mode === "unmerge") {
    afterMutation("Cells unmerged");
    return;
  }
  if (mode === "across") {
    for (let r = rect.r1; r <= rect.r2; r += 1) sheet.merges.push({ r1: r, c1: rect.c1, r2: r, c2: rect.c2 });
  } else {
    if (rect.r1 === rect.r2 && rect.c1 === rect.c2) {
      setStatus("Select more than one cell to merge");
      return;
    }
    sheet.merges.push({ r1: rect.r1, c1: rect.c1, r2: rect.r2, c2: rect.c2 });
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      for (let c = rect.c1; c <= rect.c2; c += 1) {
        if (r === rect.r1 && c === rect.c1) continue;
        const cell = sheet.cells[cellKey(r, c)];
        if (cell?.raw) delete sheet.cells[cellKey(r, c)];
      }
    }
    if (mode === "center") {
      const anchor = ensureCell(sheet, rect.r1, rect.c1);
      anchor.style = { ...anchor.style, align: "center" };
    }
  }
  afterMutation("Cells merged");
}

/* ---------------------------------------------------------------- editing */

function beginFormulaEdit(): void {
  if (grid.isEditing()) return;
  const cell = getActiveCell();
  grid.beginEdit(cell?.raw ?? "", "edit", false);
  formulaInput.classList.add("is-editing");
  formulaInput.focus();
  formulaInput.setSelectionRange(formulaInput.value.length, formulaInput.value.length);
}

function commitFormula(): void {
  if (grid.isEditing()) {
    grid.commitEdit("none");
    formulaInput.classList.remove("is-editing");
    viewport.focus({ preventScroll: true });
  }
}

function cancelFormula(): void {
  grid.cancelEdit();
  formulaInput.classList.remove("is-editing");
  viewport.focus({ preventScroll: true });
}

function goToName(value: string): void {
  const trimmed = value.trim();
  if (!trimmed) return;
  const named = workbook.names[trimmed] ?? workbook.names[trimmed.toUpperCase()];
  let address = named ?? trimmed;
  let targetSheet: Sheet | undefined;
  const bang = address.lastIndexOf("!");
  if (bang >= 0) {
    const sheetName = address.slice(0, bang).replace(/^'|'$/g, "").replace(/''/g, "'");
    targetSheet = workbook.sheets.find(sheet => sheet.name.toLowerCase() === sheetName.toLowerCase());
    address = address.slice(bang + 1);
    if (targetSheet) switchSheet(workbook.sheets.indexOf(targetSheet));
  }
  const sheet = targetSheet ?? getSheet();
  const columnOnly = /^([A-Za-z]{1,3}):([A-Za-z]{1,3})$/.exec(address);
  const rowOnly = /^(\d+):(\d+)$/.exec(address);
  let rect: Rect | null = null;
  if (columnOnly) {
    const start = parseAddress(`${columnOnly[1]}1`);
    const end = parseAddress(`${columnOnly[2]}1`);
    if (start && end) rect = { r1: 0, c1: Math.min(start.c, end.c), r2: 59, c2: Math.max(start.c, end.c) };
  } else if (rowOnly) {
    rect = {
      r1: Math.min(Number(rowOnly[1]), Number(rowOnly[2])) - 1,
      c1: 0,
      r2: Math.max(Number(rowOnly[1]), Number(rowOnly[2])) - 1,
      c2: 25
    };
  } else {
    rect = parseRect(address.replace(/\$/g, ""));
  }
  if (sheet.id !== getSheet().id) switchSheet(workbook.sheets.indexOf(sheet));
  if (!rect) {
    setStatus(`Cannot find ${trimmed}`);
    return;
  }
  grid.setSelection(rect);
  grid.scrollToActive();
  viewport.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ sheets */

function switchSheet(index: number): void {
  if (index < 0 || index >= workbook.sheets.length) return;
  workbook.active = index;
  grid.setSelectedChart(null);
  grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
  grid.invalidateLayout();
  grid.render();
  renderEverything();
}

function sheetIdFor(name: string): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "sheet";
  let id = base;
  let counter = 2;
  while (workbook.sheets.some(sheet => sheet.id === id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

function uniqueSheetName(base: string): string {
  let name = base;
  let counter = 2;
  while (workbook.sheets.some(sheet => sheet.name.toLowerCase() === name.toLowerCase())) {
    name = `${base}${counter}`;
    counter += 1;
  }
  return name;
}

function addSheet(): void {
  pushHistory();
  const name = uniqueSheetName(`Sheet${workbook.sheets.length + 1}`);
  const sheet = createSheet(sheetIdFor(name), name);
  workbook.sheets.push(sheet);
  workbook.active = workbook.sheets.length - 1;
  grid.invalidateLayout();
  grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
  grid.render();
  renderEverything();
  setStatus(`Added ${name}`);
  markDirty();
}

function renameSheet(index: number): void {
  const sheet = workbook.sheets[index];
  if (!sheet) return;
  promptDialog("Rename sheet", "Sheet name", sheet.name, value => {
    const name = value.trim();
    if (!name) return;
    if (workbook.sheets.some(other => other !== sheet && other.name.toLowerCase() === name.toLowerCase())) {
      setStatus("A sheet with that name already exists");
      return;
    }
    pushHistory();
    sheet.name = name;
    renderEverything();
    markDirty();
  });
}

function duplicateSheet(index: number): void {
  const source = workbook.sheets[index];
  if (!source) return;
  pushHistory();
  const copy: Sheet = structuredClone(source);
  copy.id = sheetIdFor(`${source.id}-copy`);
  copy.name = uniqueSheetName(`${source.name} (2)`).replace(" (2) (2)", " (2)");
  copy.charts = copy.charts.map(chart => ({ ...chart, id: `${chart.id}-${Date.now()}` }));
  copy.tables = copy.tables.map(table => ({ ...table, id: `${table.id}-${Date.now()}` }));
  workbook.sheets.splice(index + 1, 0, copy);
  workbook.active = index + 1;
  grid.invalidateLayout();
  grid.render();
  renderEverything();
  markDirty();
}

function deleteSheet(index: number): void {
  if (workbook.sheets.length <= 1) {
    setStatus("A workbook needs at least one sheet");
    return;
  }
  const sheet = workbook.sheets[index];
  confirmDialog("Delete sheet", `Delete “${sheet.name}”? This can be undone.`, () => {
    pushHistory();
    workbook.sheets.splice(index, 1);
    workbook.active = Math.min(index, workbook.sheets.length - 1);
    grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
    grid.invalidateLayout();
    grid.render();
    renderEverything();
    markDirty();
  });
}

function updateSheetTabs(): void {
  const buttons = sheetTabsEl.querySelectorAll<HTMLElement>(".gc-sheet-tab");
  buttons.forEach(button => {
    button.classList.toggle("is-active", Number(button.dataset.index) === workbook.active);
    button.style.borderBottomColor = button.classList.contains("is-active")
      ? workbook.sheets[Number(button.dataset.index)]?.tabColor ?? "var(--gc-accent)"
      : "transparent";
  });
}

function renderSheetTabs(): void {
  sheetTabsEl.innerHTML = workbook.sheets
    .map(
      (sheet, index) =>
        `<div class="gc-sheet-tab${index === workbook.active ? " is-active" : ""}" data-index="${index}" title="${esc(
          sheet.name
        )}" role="tab" tabindex="0"><span>${esc(sheet.name)}</span></div>`
    )
    .join("");
  updateSheetTabs();
}

sheetTabsEl.addEventListener("click", event => {
  const tab = (event.target as HTMLElement).closest<HTMLElement>(".gc-sheet-tab");
  if (tab) switchSheet(Number(tab.dataset.index));
});
sheetTabsEl.addEventListener("dblclick", event => {
  const tab = (event.target as HTMLElement).closest<HTMLElement>(".gc-sheet-tab");
  if (tab) renameSheet(Number(tab.dataset.index));
});
sheetTabsEl.addEventListener("contextmenu", event => {
  const tab = (event.target as HTMLElement).closest<HTMLElement>(".gc-sheet-tab");
  if (!tab) return;
  event.preventDefault();
  const index = Number(tab.dataset.index);
  openMenuAt(tab, [
    { label: "Rename", icon: "rename", action: () => renameSheet(index) },
    { label: "Duplicate", icon: "copy", action: () => duplicateSheet(index) },
    { label: "Move Left", icon: "chevron-left", disabled: index === 0, action: () => moveSheet(index, -1) },
    {
      label: "Move Right",
      icon: "chevron-right",
      disabled: index === workbook.sheets.length - 1,
      action: () => moveSheet(index, 1)
    },
    { separator: true },
    { label: "Delete", icon: "delete", danger: true, action: () => deleteSheet(index) }
  ]);
});

function moveSheet(index: number, direction: number): void {
  const target = index + direction;
  if (target < 0 || target >= workbook.sheets.length) return;
  pushHistory();
  const [sheet] = workbook.sheets.splice(index, 1);
  workbook.sheets.splice(target, 0, sheet);
  workbook.active = target;
  renderEverything();
  markDirty();
}

q<HTMLButtonElement>("#gc-sheet-add").addEventListener("click", addSheet);
q<HTMLButtonElement>("#gc-sheet-prev").addEventListener("click", () => switchSheet(Math.max(0, workbook.active - 1)));
q<HTMLButtonElement>("#gc-sheet-next").addEventListener("click", () =>
  switchSheet(Math.min(workbook.sheets.length - 1, workbook.active + 1))
);

/* ------------------------------------------------------------------- panes */

function renderPane(force = false): void {
  const sheet = getSheet();
  const chart = grid.selectedChartId() ? grid.selectedChartSpec() : null;
  let nextKey: string;
  if (chart) nextKey = `chart:${chart.id}:${chartPaneOpen ? 1 : 0}`;
  else if (sheet.pivot && pivotPaneOpen) nextKey = `pivot:${sheet.id}`;
  else nextKey = "none";
  if (!force && nextKey === paneKey) return;
  paneKey = nextKey;
  if (nextKey === "none") {
    paneHost.hidden = true;
    paneHost.innerHTML = "";
    return;
  }
  paneHost.hidden = false;
  paneHost.innerHTML = "";
  if (chart) {
    paneHost.appendChild(
      renderChartPane(chart, {
        onChange: patch => updateChart(chart, patch),
        onClose: () => {
          chartPaneOpen = false;
          renderPane(true);
        }
      })
    );
  } else if (sheet.pivot) {
    const config = sheet.pivot;
    const source = readPivotSource(sheet, engine, config);
    const fields = source.headers.length ? source.headers : ["Region", "Product", "Channel", "Units", "Revenue"];
    paneHost.appendChild(
      renderPivotPane(sheet, fields, {
        onFieldToggle: (field, checked) => togglePivotField(field, checked),
        onDropField: (area, field) => movePivotField(area, field),
        onChipMenu: (area, field, anchor, value) => openPivotChipMenu(area, field, anchor, value),
        onRefresh: () => {
          pushHistory();
          applyPivot(sheet, engine);
          afterMutation("PivotTable refreshed");
          renderPane(true);
        },
        onLayout: anchor => {
          openMenuAt(anchor, [
            { label: "Compact Form", checked: config.layout === "compact", action: () => setPivotLayout("compact") },
            { label: "Tabular Form", checked: config.layout === "tabular", action: () => setPivotLayout("tabular") },
            { label: "Outline Form", checked: config.layout === "outline", action: () => setPivotLayout("outline") }
          ]);
        },
        onClose: () => {
          pivotPaneOpen = false;
          renderPane(true);
        }
      })
    );
  }
}

function updateChart(chart: ChartSpec, patch: Partial<ChartSpec>): void {
  const now = Date.now();
  if (now - chartHistoryAt > 700) {
    pushHistory();
    chartHistoryAt = now;
  }
  Object.assign(chart, patch);
  grid.render();
  refreshRibbon();
  markDirty();
}

function updateSelectedChart(patch: Partial<ChartSpec>): void {
  const chart = grid.selectedChartSpec();
  if (!chart) return;
  updateChart(chart, patch);
  renderPane(true);
}

function togglePivotField(field: string, checked: boolean): void {
  const sheet = getSheet();
  const config = sheet.pivot;
  if (!config) return;
  pushHistory();
  if (!checked) {
    config.rows = config.rows.filter(entry => entry !== field);
    config.cols = config.cols.filter(entry => entry !== field);
    config.values = config.values.filter(entry => entry.field !== field);
    delete config.filters[field];
  } else if (pivotAreaOf(config, field) === undefined) {
    const numeric = pivotFieldIsNumeric(sheet, config, field);
    if (numeric) config.values.push({ field, agg: "sum" });
    else config.rows.push(field);
  }
  applyPivot(sheet, engine);
  afterMutation("PivotTable updated");
  renderPane(true);
}

function pivotFieldIsNumeric(sheet: Sheet, config: import("./model").PivotConfig, field: string): boolean {
  const source = readPivotSource(sheet, engine, config);
  const index = source.headers.indexOf(field);
  if (index < 0) return false;
  let numeric = 0;
  let total = 0;
  for (const row of source.rows) {
    const value = row[index];
    total += 1;
    if (
      typeof value === "number" ||
      (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)))
    )
      numeric += 1;
  }
  return total > 0 && numeric / total > 0.8;
}

function pivotAreaOf(config: import("./model").PivotConfig, field: string): PivotArea | undefined {
  if (config.filters[field] !== undefined) return "filters";
  if (config.rows.includes(field)) return "rows";
  if (config.cols.includes(field)) return "cols";
  if (config.values.some(entry => entry.field === field)) return "values";
  return undefined;
}

function movePivotField(area: PivotArea, field: string): void {
  const sheet = getSheet();
  const config = sheet.pivot;
  if (!config) return;
  pushHistory();
  config.rows = config.rows.filter(entry => entry !== field);
  config.cols = config.cols.filter(entry => entry !== field);
  config.values = config.values.filter(entry => entry.field !== field);
  delete config.filters[field];
  if (area === "filters") config.filters[field] = null;
  else if (area === "rows") config.rows.push(field);
  else if (area === "cols") config.cols.push(field);
  else config.values.push({ field, agg: "sum" });
  applyPivot(sheet, engine);
  afterMutation("PivotTable fields updated");
  renderPane(true);
}

function setPivotLayout(layout: "compact" | "tabular" | "outline"): void {
  const sheet = getSheet();
  if (!sheet.pivot) return;
  pushHistory();
  sheet.pivot.layout = layout;
  applyPivot(sheet, engine);
  afterMutation(`PivotTable layout: ${layout}`);
  renderPane(true);
}

function openPivotChipMenu(area: PivotArea, field: string, anchor: HTMLElement, value?: PivotValue): void {
  const sheet = getSheet();
  const config = sheet.pivot;
  if (!config) return;
  const items: MenuItem[] = [];
  if (area === "filters") {
    const source = readPivotSource(sheet, engine, config);
    const index = source.headers.indexOf(field);
    const values = new Set<string>();
    if (index >= 0) {
      for (const row of source.rows) {
        const text = String(row[index] ?? "").trim();
        if (text) values.add(text);
      }
    }
    items.push({ header: true, label: `Filter ${field}` });
    items.push({
      label: "(All)",
      checked: !config.filters[field],
      action: () => {
        pushHistory();
        config.filters[field] = null;
        applyPivot(sheet, engine);
        afterMutation("PivotTable filtered");
        renderPane(true);
      }
    });
    for (const option of [...values].sort()) {
      items.push({
        label: option,
        checked: config.filters[field] === option,
        action: () => {
          pushHistory();
          config.filters[field] = option;
          applyPivot(sheet, engine);
          afterMutation(`PivotTable filtered by ${option}`);
          renderPane(true);
        }
      });
    }
    items.push({ separator: true });
  }
  if (area === "values" && value) {
    items.push({
      header: true,
      label: "Summarize values by"
    });
    (["sum", "count", "average"] as const).forEach(agg => {
      items.push({
        label: PIVOT_AGG_LABELS[agg],
        checked: value.agg === agg,
        action: () => {
          pushHistory();
          value.agg = agg;
          applyPivot(sheet, engine);
          afterMutation("PivotTable values updated");
          renderPane(true);
        }
      });
    });
    items.push({ separator: true });
  }
  items.push(
    {
      label: "Move to Rows",
      icon: "arrow-down",
      disabled: area === "rows",
      action: () => movePivotField("rows", field)
    },
    {
      label: "Move to Columns",
      icon: "arrow-right",
      disabled: area === "cols",
      action: () => movePivotField("cols", field)
    },
    {
      label: "Move to Values",
      icon: "chart-column",
      disabled: area === "values",
      action: () => movePivotField("values", field)
    },
    {
      label: "Move to Filters",
      icon: "filter",
      disabled: area === "filters",
      action: () => movePivotField("filters", field)
    },
    { separator: true },
    {
      label: "Remove Field",
      icon: "close",
      danger: true,
      action: () => {
        pushHistory();
        config.rows = config.rows.filter(entry => entry !== field);
        config.cols = config.cols.filter(entry => entry !== field);
        config.values = config.values.filter(entry => entry.field !== field);
        delete config.filters[field];
        applyPivot(sheet, engine);
        afterMutation("Field removed");
        renderPane(true);
      }
    }
  );
  openMenuAt(anchor, items);
}

/* ------------------------------------------------------------- grid wiring */

const gridContext: GridContext = {
  getWorkbook: () => workbook,
  getSheet,
  getEngine: () => engine,
  onSelectionChange: () => syncSelectionUI(),
  onEditStart: (address, text) => {
    formulaInput.value = text;
    formulaInput.classList.add("is-editing");
    if (document.activeElement !== formulaInput) setStatus("Edit");
    nameBox.value = address;
  },
  onEditInput: text => {
    formulaInput.value = text;
  },
  onEditEnd: () => {
    formulaInput.classList.remove("is-editing");
    syncFormula();
  },
  onCommit: (ref, text, direction) => commitCell(ref, text, direction),
  onBeforeMutate: () => pushHistory(),
  onChanged: reason => {
    engine.invalidate();
    grid.render();
    renderSheetTabs();
    refreshRibbon();
    syncSelectionUI();
    markDirty();
    setStatus(reason);
  },
  onChartSelect: id => {
    if (id) {
      activeTab = "chart";
      chartPaneOpen = true;
    } else if (activeTab === "chart") {
      activeTab = "home";
    }
    contextSignature = "";
    renderRibbonChrome();
    renderPane(true);
  },
  onFilterRequest: (tableId, column, anchor) => openFilterMenu(tableId, column, anchor),
  onContextMenu: (event, target) => openGridContextMenu(event, target),
  onStatus: text => setStatus(text),
  onCommand: name => runCommand(name)
};

grid = new GridView(viewport, gridContext);
grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
grid.render();

/* ----------------------------------------------------------------- top bar */

function toggleAutosave(): void {
  workbook.autosave = !workbook.autosave;
  q<HTMLButtonElement>("#gc-autosave").classList.toggle("is-on", workbook.autosave);
  q<HTMLButtonElement>("#gc-autosave").setAttribute("aria-checked", String(workbook.autosave));
  setStatus(workbook.autosave ? "AutoSave on" : "AutoSave off");
  if (workbook.autosave) saveWorkbook(true);
}

q<HTMLButtonElement>("#gc-autosave").addEventListener("click", toggleAutosave);

/* ----------------------------------------------------------------- helpers */

function activeTable(): TableSpec | undefined {
  const sheet = getSheet();
  return tableAt(sheet, grid.activeCell.r, grid.activeCell.c);
}

function currentRegion(rect: Rect): Rect {
  const sheet = getSheet();
  const filled = (r: number, c: number) => (sheet.cells[cellKey(r, c)]?.raw ?? "") !== "";
  let { r1, c1, r2, c2 } = rect;
  let changed = true;
  while (changed) {
    changed = false;
    if (r1 > 0 && Array.from({ length: c2 - c1 + 1 }, (_, i) => filled(r1 - 1, c1 + i)).every(Boolean)) {
      r1 -= 1;
      changed = true;
    }
    if (r2 < 59 && Array.from({ length: c2 - c1 + 1 }, (_, i) => filled(r2 + 1, c1 + i)).every(Boolean)) {
      r2 += 1;
      changed = true;
    }
    if (c1 > 0 && Array.from({ length: r2 - r1 + 1 }, (_, i) => filled(r1 + i, c1 - 1)).every(Boolean)) {
      c1 -= 1;
      changed = true;
    }
    if (c2 < 25 && Array.from({ length: r2 - r1 + 1 }, (_, i) => filled(r1 + i, c2 + 1)).every(Boolean)) {
      c2 += 1;
      changed = true;
    }
  }
  return { r1, c1, r2, c2 };
}

function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/* ----------------------------------------------------------- tables & rules */

function setTableOption(key: "header" | "totals" | "banded" | "filter", value: boolean): void {
  const table = activeTable();
  if (!table) return;
  const sheet = getSheet();
  const rect = parseRect(table.range);
  if (!rect) return;
  pushHistory();
  if (key === "totals") {
    if (value && !table.totals) {
      table.totals = true;
      table.range = rectToRange({ ...rect, r2: rect.r2 + 1 });
      const totalRow = rect.r2 + 1;
      const label = ensureCell(sheet, totalRow, rect.c1);
      if (!label.raw) label.raw = "Total";
      for (let c = rect.c1 + 1; c <= rect.c2; c += 1) {
        const column = String.fromCharCode(65 + c);
        if (!engine.numeric(sheet, rect.r1 + 1, c)) continue;
        if ((sheet.cells[cellKey(totalRow, c)]?.raw ?? "") !== "") continue;
        const cell = ensureCell(sheet, totalRow, c);
        cell.raw = `=SUBTOTAL(109,${column}${rect.r1 + 2}:${column}${rect.r2 + 1})`;
      }
    } else if (!value && table.totals) {
      table.totals = false;
      table.range = rectToRange({ ...rect, r2: Math.max(rect.r1 + 1, rect.r2 - 1) });
    }
  } else {
    table[key] = value;
  }
  afterMutation("Table options updated");
}

function formatAsTable(style: TableStyleId): void {
  const sheet = getSheet();
  const rect = currentRegion(grid.selectionRect());
  if (rect.r1 === rect.r2) {
    setStatus("Select a data range with headers to format as a table");
    return;
  }
  pushHistory();
  const existing = sheet.tables.filter(table => {
    const other = parseRect(table.range);
    return other && other.r1 <= rect.r2 && other.r2 >= rect.r1 && other.c1 <= rect.c2 && other.c2 >= rect.c1;
  });
  sheet.tables = sheet.tables.filter(table => !existing.includes(table));
  const table: TableSpec = {
    id: `table-${Date.now()}`,
    name: `Table${sheet.tables.length + 1}`,
    range: rectToRange(rect),
    style,
    header: true,
    banded: true,
    totals: false,
    filter: true
  };
  sheet.tables.push(table);
  afterMutation("Table created");
}

function tableStyle(style: TableStyleId): void {
  const table = activeTable();
  if (!table) return;
  pushHistory();
  table.style = style;
  afterMutation("Table style updated");
}

function convertTableToRange(): void {
  const table = activeTable();
  if (!table) return;
  pushHistory();
  getSheet().tables = getSheet().tables.filter(entry => entry !== table);
  afterMutation("Converted table to range");
}

function addCondRule(partial: Omit<CondRule, "id" | "range">): void {
  const sheet = getSheet();
  const range = rectToRange(grid.selectionRect());
  pushHistory();
  sheet.condRules.push({ ...partial, id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, range });
  afterMutation("Conditional formatting applied");
}

function clearCondRules(scope: "selection" | "sheet"): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  pushHistory();
  sheet.condRules =
    scope === "sheet"
      ? []
      : sheet.condRules.filter(rule => {
          const ruleRect = parseRect(rule.range);
          return !(
            ruleRect &&
            ruleRect.r1 <= rect.r2 &&
            ruleRect.r2 >= rect.r1 &&
            ruleRect.c1 <= rect.c2 &&
            ruleRect.c2 >= rect.c1
          );
        });
  afterMutation("Conditional formatting cleared");
}

/* ---------------------------------------------------------------- filters */

function openFilterMenu(tableId: string, column: number, anchor: HTMLElement): void {
  const sheet = getSheet();
  const table = sheet.tables.find(entry => entry.id === tableId);
  if (!table) return;
  const rect = parseRect(table.range);
  if (!rect) return;
  const engineRef = engine;
  const values = new Set<string>();
  for (let r = rect.r1 + 1; r <= rect.r2; r += 1) {
    values.add(formatScalar(engineRef.scalarAt(sheet, r, column), undefined));
  }
  const selected = table.filterState ? new Set(table.filterState.values) : new Set(values);
  const toggleValue = (value: string) => {
    if (selected.has(value)) selected.delete(value);
    else selected.add(value);
  };
  const items: MenuItem[] = [
    { header: true, label: "Sort" },
    {
      label: "Sort A to Z",
      icon: "sort-asc",
      action: () => {
        table.filterState = null;
        sortTable(rect, column, true);
      }
    },
    {
      label: "Sort Z to A",
      icon: "sort-desc",
      action: () => {
        table.filterState = null;
        sortTable(rect, column, false);
      }
    },
    { separator: true },
    { header: true, label: "Filter by value" },
    {
      label: "Select All",
      checked: selected.size === values.size,
      sticky: true,
      action: () => {
        values.forEach(value => selected.add(value));
        applyTableFilter(table, column, selected, values);
        refreshFilterMenu(tableId, column);
      }
    }
  ];
  for (const value of [...values].sort()) {
    items.push({
      label: value || "(blank)",
      checked: selected.has(value),
      sticky: true,
      action: () => {
        toggleValue(value);
        applyTableFilter(table, column, selected, values);
        refreshFilterMenu(tableId, column);
      }
    });
  }
  items.push(
    { separator: true },
    {
      label: "Clear Filter",
      icon: "clear-filter",
      disabled: !table.filterState,
      action: () => {
        pushHistory();
        table.filterState = null;
        afterMutation("Filter cleared");
      }
    }
  );
  openMenuAt(anchor, items);
}

function applyTableFilter(table: TableSpec, column: number, selected: Set<string>, all: Set<string>): void {
  pushHistory();
  if (selected.size === all.size) table.filterState = null;
  else table.filterState = { col: column, values: [...selected] };
  afterMutation("Filter applied");
}

function refreshFilterMenu(tableId: string, column: number): void {
  const nextAnchor = document.querySelector<HTMLElement>(
    `.gc-filter-btn[data-table="${tableId}"][data-col="${column}"]`
  );
  if (!nextAnchor) {
    closeMenus();
    return;
  }
  closeMenus();
  openFilterMenu(tableId, column, nextAnchor);
}

function sortTable(rect: Rect, column: number, ascending: boolean): void {
  const sheet = getSheet();
  const rowCount = rect.r2 - rect.r1;
  if (rowCount < 1) return;
  pushHistory();
  const sourceRows = Array.from({ length: rowCount }, (_, index) => rect.r1 + 1 + index);
  const values = new Map<number, number | string>();
  for (const r of sourceRows) {
    const value = engine.scalarAt(sheet, r, column);
    values.set(r, typeof value === "number" ? value : formatScalar(value, undefined));
  }
  sourceRows.sort((a, b) => {
    const va = values.get(a) ?? "";
    const vb = values.get(b) ?? "";
    const result =
      typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "en");
    return ascending ? result : -result;
  });
  const snapshotCells = sourceRows.map(row => {
    const cells: Array<{ raw: string; style?: CellStyle }> = [];
    for (let c = rect.c1; c <= rect.c2; c += 1) {
      const cell = sheet.cells[cellKey(row, c)];
      cells.push({ raw: cell?.raw ?? "", style: cell?.style ? structuredClone(cell.style) : undefined });
    }
    return cells;
  });
  sourceRows.forEach((sourceRow, index) => {
    const targetRow = rect.r1 + 1 + index;
    const delta = targetRow - sourceRow;
    for (let c = rect.c1; c <= rect.c2; c += 1) {
      const cell = snapshotCells[index][c - rect.c1];
      if (!cell.raw) {
        delete sheet.cells[cellKey(targetRow, c)];
        continue;
      }
      sheet.cells[cellKey(targetRow, c)] = {
        raw: cell.raw.startsWith("=") ? adjustFormula(cell.raw, delta, 0) : cell.raw,
        style: cell.style
      };
    }
  });
  afterMutation(`Sorted ${ascending ? "A to Z" : "Z to A"}`);
}

/* ------------------------------------------------------------ insert/delete */

function remapSheetReferences(
  target: Sheet,
  transform: (row: number, col: number) => { row: number; col: number } | null
): void {
  for (const sheet of workbook.sheets) {
    for (const cell of Object.values(sheet.cells)) {
      if (cell.raw.startsWith("=")) {
        const raw = remapFormula(cell.raw, (sheetName, row, col) => {
          const referenced = sheetName
            ? workbook.sheets.find(entry => entry.name.toLowerCase() === sheetName.toLowerCase())
            : sheet;
          if (referenced !== target) return { row, col };
          return transform(row, col);
        });
        if (raw !== cell.raw) cell.raw = raw;
      }
    }
  }
}

function shiftMergeRows(sheet: Sheet, at: number, count: number, mode: "insert" | "delete"): void {
  const next: Array<{ r1: number; c1: number; r2: number; c2: number }> = [];
  for (const merge of sheet.merges) {
    if (mode === "insert") {
      if (merge.r1 >= at) next.push({ ...merge, r1: merge.r1 + count, r2: merge.r2 + count });
      else if (merge.r2 >= at) next.push({ ...merge, r2: merge.r2 + count });
      else next.push(merge);
      continue;
    }
    if (merge.r2 < at) {
      next.push(merge);
      continue;
    }
    const r1 = merge.r1 >= at + count ? merge.r1 - count : Math.max(merge.r1, at);
    const r2 = merge.r2 >= at + count ? merge.r2 - count : at - 1;
    if (r2 >= r1) next.push({ ...merge, r1, r2 });
  }
  sheet.merges = next;
}

function updateTableRanges(
  sheet: Sheet,
  axis: "row" | "col",
  at: number,
  count: number,
  mode: "insert" | "delete"
): void {
  const fixRange = (range: string): string | null => {
    const rect = parseRect(range);
    if (!rect) return range;
    if (axis === "row") {
      if (mode === "insert") {
        if (rect.r1 >= at) return rectToRange({ ...rect, r1: rect.r1 + count, r2: rect.r2 + count });
        if (rect.r2 >= at) return rectToRange({ ...rect, r2: rect.r2 + count });
        return range;
      }
      if (rect.r2 < at) return range;
      const r1 = rect.r1 >= at + count ? rect.r1 - count : Math.max(rect.r1, at);
      const r2 = rect.r2 >= at + count ? rect.r2 - count : at - 1;
      return r2 >= r1 ? rectToRange({ ...rect, r1, r2 }) : null;
    }
    if (mode === "insert") {
      if (rect.c1 >= at) return rectToRange({ ...rect, c1: rect.c1 + count, c2: rect.c2 + count });
      if (rect.c2 >= at) return rectToRange({ ...rect, c2: rect.c2 + count });
      return range;
    }
    if (rect.c2 < at) return range;
    const c1 = rect.c1 >= at + count ? rect.c1 - count : Math.max(rect.c1, at);
    const c2 = rect.c2 >= at + count ? rect.c2 - count : at - 1;
    return c2 >= c1 ? rectToRange({ ...rect, c1, c2 }) : null;
  };
  const tables: TableSpec[] = [];
  for (const table of sheet.tables) {
    const range = fixRange(table.range);
    if (range) tables.push({ ...table, range, filterState: null });
  }
  sheet.tables = tables;
  const rules: CondRule[] = [];
  for (const rule of sheet.condRules) {
    const range = fixRange(rule.range);
    if (range) rules.push({ ...rule, range });
  }
  sheet.condRules = rules;
}

function insertRows(count: number): void {
  const sheet = getSheet();
  const at = grid.selectionRect().r1;
  pushHistory();
  const moving: Array<[number, number, Cell]> = [];
  for (const [key, cell] of Object.entries(sheet.cells)) {
    const point = parseAddress(key);
    if (point && point.r >= at) {
      moving.push([point.r, point.c, cell]);
      delete sheet.cells[key];
    }
  }
  for (const [r, c, cell] of moving) sheet.cells[cellKey(r + count, c)] = cell;
  const heights: Record<number, number> = {};
  for (const [key, value] of Object.entries(sheet.rowHeights)) {
    const r = Number(key);
    heights[r >= at ? r + count : r] = value;
  }
  sheet.rowHeights = heights;
  shiftMergeRows(sheet, at, count, "insert");
  updateTableRanges(sheet, "row", at, count, "insert");
  remapSheetReferences(sheet, (row, col) => ({ row: row >= at ? row + count : row, col }));
  afterMutation(`Inserted ${count} row${count > 1 ? "s" : ""}`);
}

function deleteRows(count: number): void {
  const sheet = getSheet();
  const at = grid.selectionRect().r1;
  pushHistory();
  const moving: Array<[number, number, Cell]> = [];
  for (const [key, cell] of Object.entries(sheet.cells)) {
    const point = parseAddress(key);
    if (!point) continue;
    if (point.r >= at && point.r < at + count) delete sheet.cells[key];
    else if (point.r >= at + count) {
      moving.push([point.r, point.c, cell]);
      delete sheet.cells[key];
    }
  }
  for (const [r, c, cell] of moving) sheet.cells[cellKey(r - count, c)] = cell;
  const heights: Record<number, number> = {};
  for (const [key, value] of Object.entries(sheet.rowHeights)) {
    const r = Number(key);
    if (r < at) heights[r] = value;
    else if (r >= at + count) heights[r - count] = value;
  }
  sheet.rowHeights = heights;
  shiftMergeRows(sheet, at, count, "delete");
  updateTableRanges(sheet, "row", at, count, "delete");
  remapSheetReferences(sheet, (row, col) => {
    if (row >= at && row < at + count) return null;
    return { row: row >= at + count ? row - count : row, col };
  });
  afterMutation(`Deleted ${count} row${count > 1 ? "s" : ""}`);
}

function insertCols(count: number): void {
  const sheet = getSheet();
  const at = grid.selectionRect().c1;
  pushHistory();
  const moving: Array<[number, number, Cell]> = [];
  for (const [key, cell] of Object.entries(sheet.cells)) {
    const point = parseAddress(key);
    if (point && point.c >= at) {
      moving.push([point.r, point.c, cell]);
      delete sheet.cells[key];
    }
  }
  for (const [r, c, cell] of moving) sheet.cells[cellKey(r, c + count)] = cell;
  const widths: Record<number, number> = {};
  for (const [key, value] of Object.entries(sheet.colWidths)) {
    const c = Number(key);
    widths[c >= at ? c + count : c] = value;
  }
  sheet.colWidths = widths;
  updateTableRanges(sheet, "col", at, count, "insert");
  remapSheetReferences(sheet, (row, col) => ({ row, col: col >= at ? col + count : col }));
  afterMutation(`Inserted ${count} column${count > 1 ? "s" : ""}`);
}

function deleteCols(count: number): void {
  const sheet = getSheet();
  const at = grid.selectionRect().c1;
  pushHistory();
  const moving: Array<[number, number, Cell]> = [];
  for (const [key, cell] of Object.entries(sheet.cells)) {
    const point = parseAddress(key);
    if (!point) continue;
    if (point.c >= at && point.c < at + count) delete sheet.cells[key];
    else if (point.c >= at + count) {
      moving.push([point.r, point.c, cell]);
      delete sheet.cells[key];
    }
  }
  for (const [r, c, cell] of moving) sheet.cells[cellKey(r, c - count)] = cell;
  const widths: Record<number, number> = {};
  for (const [key, value] of Object.entries(sheet.colWidths)) {
    const c = Number(key);
    if (c < at) widths[c] = value;
    else if (c >= at + count) widths[c - count] = value;
  }
  sheet.colWidths = widths;
  updateTableRanges(sheet, "col", at, count, "delete");
  remapSheetReferences(sheet, (row, col) => {
    if (col >= at && col < at + count) return null;
    return { row, col: col >= at + count ? col - count : col };
  });
  afterMutation(`Deleted ${count} column${count > 1 ? "s" : ""}`);
}

/* ------------------------------------------------------------------ charts */

function insertChartOfType(type: ChartType): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  if (rect.r1 === rect.r2 && rect.c1 === rect.c2) {
    setStatus("Select the data you want to chart first");
    return;
  }
  const matrix = engine.matrixOf(sheet, rectToRange(rect));
  if (!matrix.length) return;
  const isNumeric = (value: unknown) =>
    typeof value === "number" || (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)));
  const headerRow = matrix[0].every(value => typeof value === "string" && !isNumeric(value));
  const dataStart = headerRow ? 1 : 0;
  const firstColumnText = matrix.slice(dataStart).every(row => typeof row[0] === "string" && !isNumeric(row[0]));
  const dataStartCol = firstColumnText ? 1 : 0;
  const series: ChartSpec["series"] = [];
  for (let c = rect.c1 + dataStartCol; c <= rect.c2; c += 1) {
    const columnIndex = c - rect.c1;
    const values = matrix.slice(dataStart).map(row => row[columnIndex]);
    if (!values.some(value => isNumeric(value))) continue;
    const name = headerRow ? formatScalar(matrix[0][columnIndex], undefined) : `Series ${series.length + 1}`;
    series.push({ name, range: `${cellKey(rect.r1 + dataStart, c)}:${cellKey(rect.r2, c)}` });
    if (type === "pie" || type === "doughnut") break;
  }
  if (!series.length) {
    setStatus("The selected range has no numeric data");
    return;
  }
  const categories = firstColumnText
    ? `${cellKey(rect.r1 + dataStart, rect.c1)}:${cellKey(rect.r2, rect.c1)}`
    : series[0].range;
  const bounds = grid.contentBounds(rect);
  const chart: ChartSpec = {
    id: `chart-${Date.now()}`,
    type,
    title: "Chart Title",
    categories,
    series,
    x: Math.max(40, bounds.x + bounds.w + 24),
    y: Math.max(30, bounds.y),
    w: 440,
    h: 268,
    legend: type === "pie" || type === "doughnut" ? "right" : "bottom",
    palette: type === "pie" || type === "doughnut" ? "vivid" : "office",
    dataLabels: false,
    gridlines: type !== "pie" && type !== "doughnut"
  };
  pushHistory();
  sheet.charts.push(chart);
  activeTab = "chart";
  afterMutation("Chart inserted");
  grid.setSelectedChart(chart.id);
  chartPaneOpen = true;
  renderPane(true);
}

function deleteSelectedChart(): void {
  const chart = grid.selectedChartSpec();
  if (!chart) return;
  const sheet = getSheet();
  pushHistory();
  sheet.charts = sheet.charts.filter(entry => entry !== chart);
  grid.setSelectedChart(null);
  afterMutation("Chart deleted");
}

function insertSparkline(kind: "line" | "column"): void {
  const sheet = getSheet();
  const point = grid.activeCell;
  let start = point.c - 1;
  while (start >= 0 && engine.numeric(sheet, point.r, start) !== null) start -= 1;
  start += 1;
  if (point.c - start < 2) {
    setStatus("Put numeric data to the left of the active cell first");
    return;
  }
  pushHistory();
  const cell = ensureCell(sheet, point.r, point.c);
  cell.sparkline = { range: `${cellKey(point.r, start)}:${cellKey(point.r, point.c - 1)}`, kind, color: "#215c8a" };
  afterMutation("Sparkline inserted");
}

/* --------------------------------------------------------------- pivot */

function createPivotTable(): void {
  const sheet = getSheet();
  const active = grid.activeCell;
  const table = tableAt(sheet, active.r, active.c);
  const rect = table ? tableRect(table) : currentRegion(grid.selectionRect());
  const headers =
    engine.matrixOf(sheet, rectToRange({ ...rect, r2: rect.r1 }))[0]?.map(value => formatScalar(value, undefined)) ??
    [];
  if (headers.length < 2) {
    setStatus("Select a data range with headers first");
    return;
  }
  const sourceRows = engine.matrixOf(sheet, rectToRange(rect)).slice(1);
  const textFields: string[] = [];
  const numericFields: string[] = [];
  headers.forEach((header, index) => {
    const values = sourceRows.map(row => row[index]);
    const numericCount = values.filter(value => typeof value === "number").length;
    if (numericCount > values.length / 2) numericFields.push(header);
    else textFields.push(header);
  });
  const pivotSheet = createSheet(sheetIdFor("pivot"), uniqueSheetName("PivotTable1"));
  pivotSheet.pivot = {
    source: `${sheet.name.includes(" ") ? `'${sheet.name}'` : sheet.name}!${rectToRange(rect)}`,
    filters: textFields[2] ? { [textFields[2]]: null } : {},
    rows: [textFields[0] ?? headers[0]],
    cols: [textFields[1] ?? textFields[0] ?? headers[1]],
    values: [{ field: numericFields[0] ?? headers[headers.length - 1], agg: "sum" }],
    layout: "compact",
    grandTotals: true
  };
  workbook.sheets.push(pivotSheet);
  applyPivot(pivotSheet, engine);
  workbook.active = workbook.sheets.length - 1;
  grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
  grid.invalidateLayout();
  grid.render();
  pivotPaneOpen = true;
  renderEverything();
  setStatus("PivotTable created");
  markDirty();
}

/* ---------------------------------------------------------------- dialogs */

function openFindDialog(): void {
  const sheet = getSheet();
  const state = { index: -1 };
  const body = document.createElement("div");
  body.className = "gc-find";
  body.innerHTML = `
    <div class="gc-find-tabs"><button class="is-active" type="button">Find</button><button type="button">Replace</button></div>
    <label class="gc-field"><span>Find what</span><input class="gc-input" data-find value="" /></label>
    <label class="gc-field"><span>Replace with</span><input class="gc-input" data-replace value="" /></label>
    <label class="gc-field gc-field--inline"><input type="checkbox" data-match-case /> Match case</label>
    <p class="gc-find-result" data-find-result></p>
  `;
  const footer = document.createElement("div");
  footer.className = "gc-dialog-actions";
  footer.innerHTML = `<button class="gc-btn" data-action="find-next" type="button">Find Next</button><button class="gc-btn" data-action="find-prev" type="button">Find Previous</button><button class="gc-btn" data-action="replace" type="button">Replace</button><button class="gc-btn gc-btn--primary" data-action="replace-all" type="button">Replace All</button>`;
  const dialog = openDialog({ title: "Find and Replace", width: 560, body, footer });
  const findInput = body.querySelector<HTMLInputElement>("[data-find]");
  const replaceInput = body.querySelector<HTMLInputElement>("[data-replace]");
  const matchCase = body.querySelector<HTMLInputElement>("[data-match-case]");
  const result = body.querySelector<HTMLElement>("[data-find-result]");
  const collect = (): Array<{ r: number; c: number; text: string; raw: string }> => {
    const query = findInput?.value ?? "";
    if (!query) return [];
    const matches: Array<{ r: number; c: number; text: string; raw: string }> = [];
    for (let r = 0; r < 60; r += 1) {
      for (let c = 0; c < 26; c += 1) {
        const cell = sheet.cells[cellKey(r, c)];
        if (!cell?.raw) continue;
        const display = formatScalar(engine.scalarAt(sheet, r, c), cell.style);
        const haystack = [cell.raw, display];
        const needle = matchCase?.checked ? query : query.toLowerCase();
        if (haystack.some(text => (matchCase?.checked ? text : text.toLowerCase()).includes(needle))) {
          matches.push({ r, c, text: display, raw: cell.raw });
        }
      }
    }
    return matches;
  };
  const showMatch = (direction: 1 | -1) => {
    const matches = collect();
    if (!matches.length) {
      if (result) result.textContent = "No matches";
      return;
    }
    state.index = (state.index + direction + matches.length) % matches.length;
    const match = matches[state.index];
    grid.setActive(match.r, match.c);
    if (result)
      result.textContent = `Match ${state.index + 1} of ${matches.length} · ${cellKey(match.r, match.c)}: ${
        match.text
      }`;
  };
  findInput?.addEventListener("input", () => {
    state.index = -1;
    if (result) result.textContent = "";
  });
  findInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      showMatch(1);
    }
  });
  footer.querySelector('[data-action="find-next"]')?.addEventListener("click", () => showMatch(1));
  footer.querySelector('[data-action="find-prev"]')?.addEventListener("click", () => showMatch(-1));
  footer.querySelector('[data-action="replace"]')?.addEventListener("click", () => {
    const point = grid.activeCell;
    const cell = sheet.cells[cellKey(point.r, point.c)];
    const query = findInput?.value ?? "";
    if (!cell || !query) return;
    if (
      (matchCase?.checked ? cell.raw : cell.raw.toLowerCase()).includes(
        matchCase?.checked ? query : query.toLowerCase()
      )
    ) {
      pushHistory();
      const flags = matchCase?.checked ? "g" : "gi";
      cell.raw = cell.raw.replace(
        new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags),
        replaceInput?.value ?? ""
      );
      afterMutation("Replaced");
    }
    showMatch(1);
  });
  footer.querySelector('[data-action="replace-all"]')?.addEventListener("click", () => {
    const query = findInput?.value ?? "";
    if (!query) return;
    const matches = collect();
    if (!matches.length) return;
    pushHistory();
    const flags = matchCase?.checked ? "g" : "gi";
    const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    for (const match of matches) {
      const cell = sheet.cells[cellKey(match.r, match.c)];
      if (cell) cell.raw = cell.raw.replace(pattern, replaceInput?.value ?? "");
    }
    afterMutation(`Replaced ${matches.length} matches`);
    dialog.close();
  });
  window.setTimeout(() => findInput?.focus(), 30);
}

function openFormatCellsDialog(): void {
  const cell = getActiveCell();
  const style = cell?.style ?? {};
  const swatches = [
    "",
    "#ffffff",
    "#fff2cc",
    "#fce4d6",
    "#e2efda",
    "#deebf7",
    "#e4dfec",
    "#f2f2f2",
    "#c9e9d0",
    "#f8cec2",
    "#fff0b8",
    "#dcefeb",
    "#0e6b5c",
    "#c0392b",
    "#1f3864",
    "#7f6000"
  ];
  const body = document.createElement("div");
  body.className = "gc-format-dialog";
  body.innerHTML = `
    <div class="gc-format-grid">
      <label class="gc-field"><span>Number format</span>
        <select class="gc-input" data-format>
          ${["general", "number", "currency", "percent", "comma", "text"]
            .map(
              format =>
                `<option value="${format}"${(style.numFmt ?? "general") === format ? " selected" : ""}>${
                  format[0].toUpperCase() + format.slice(1)
                }</option>`
            )
            .join("")}
        </select>
      </label>
      <label class="gc-field"><span>Decimal places</span><input class="gc-input" type="number" min="0" max="6" data-decimals value="${
        style.decimals ?? 2
      }" /></label>
      <label class="gc-field"><span>Font size</span><input class="gc-input" type="number" min="6" max="72" data-size value="${
        style.size ?? 11
      }" /></label>
      <label class="gc-field"><span>Horizontal align</span>
        <select class="gc-input" data-align>
          ${["left", "center", "right"]
            .map(
              align =>
                `<option value="${align}"${(style.align ?? "left") === align ? " selected" : ""}>${align}</option>`
            )
            .join("")}
        </select>
      </label>
      <label class="gc-field"><span>Vertical align</span>
        <select class="gc-input" data-valign>
          ${["top", "middle", "bottom"]
            .map(
              align =>
                `<option value="${align}"${(style.valign ?? "middle") === align ? " selected" : ""}>${align}</option>`
            )
            .join("")}
        </select>
      </label>
      <label class="gc-field gc-field--inline"><input type="checkbox" data-bold ${
        style.bold ? "checked" : ""
      }/> Bold</label>
      <label class="gc-field gc-field--inline"><input type="checkbox" data-italic ${
        style.italic ? "checked" : ""
      }/> Italic</label>
      <label class="gc-field gc-field--inline"><input type="checkbox" data-underline ${
        style.underline ? "checked" : ""
      }/> Underline</label>
      <label class="gc-field gc-field--inline"><input type="checkbox" data-wrap ${
        style.wrap ? "checked" : ""
      }/> Wrap text</label>
    </div>
    <div class="gc-field"><span>Fill color</span><div class="gc-fill-swatches">${swatches
      .map(
        color =>
          `<button class="gc-swatch${
            color === "" ? " gc-swatch--none" : ""
          }" type="button" data-fill="${color}" style="background:${color || "#ffffff"}"></button>`
      )
      .join("")}</div></div>
  `;
  let fill = style.fill ?? "";
  body.querySelectorAll<HTMLElement>("[data-fill]").forEach(button => {
    button.addEventListener("click", () => {
      fill = button.dataset.fill ?? "";
      body.querySelectorAll(".gc-fill-swatches .gc-swatch").forEach(element => element.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
  const dialog = openDialog({
    title: "Format Cells",
    width: 560,
    body,
    footer: `<button class="gc-btn" data-cancel type="button">Cancel</button><button class="gc-btn gc-btn--primary" data-apply type="button">Apply</button>`
  });
  const footer = dialog.root.querySelector(".gc-dialog-foot");
  footer?.querySelector("[data-cancel]")?.addEventListener("click", dialog.close);
  footer?.querySelector("[data-apply]")?.addEventListener("click", () => {
    const patch: Partial<CellStyle> = {};
    const format = body.querySelector<HTMLSelectElement>("[data-format]")?.value as NumFmt | undefined;
    if (format) patch.numFmt = format;
    patch.decimals = Number(body.querySelector<HTMLInputElement>("[data-decimals]")?.value ?? 2);
    patch.size = Number(body.querySelector<HTMLInputElement>("[data-size]")?.value ?? 11);
    patch.align = body.querySelector<HTMLSelectElement>("[data-align]")?.value as CellStyle["align"];
    patch.valign = body.querySelector<HTMLSelectElement>("[data-valign]")?.value as CellStyle["valign"];
    patch.bold = Boolean(body.querySelector<HTMLInputElement>("[data-bold]")?.checked);
    patch.italic = Boolean(body.querySelector<HTMLInputElement>("[data-italic]")?.checked);
    patch.underline = Boolean(body.querySelector<HTMLInputElement>("[data-underline]")?.checked);
    patch.wrap = Boolean(body.querySelector<HTMLInputElement>("[data-wrap]")?.checked);
    patch.fill = fill;
    applyStyle(patch);
    dialog.close();
  });
}

function openInsertFunctionDialog(): void {
  const categories = ["All", ...new Set(FUNCTION_LIBRARY.map(entry => entry.category))];
  const body = document.createElement("div");
  body.className = "gc-function-dialog";
  body.innerHTML = `
    <div class="gc-function-cols">
      <div class="gc-function-list">
        <label class="gc-field"><span>Category</span><select class="gc-input" data-category>${categories
          .map(category => `<option>${category}</option>`)
          .join("")}</select></label>
        <div class="gc-function-items" data-items></div>
      </div>
      <div class="gc-function-detail">
        <h4 data-fn-name>SUM</h4>
        <p data-fn-signature class="gc-code"></p>
        <p data-fn-description></p>
        <p class="gc-muted">Select a function, then press Insert Function to start the formula.</p>
      </div>
    </div>
  `;
  const list = body.querySelector<HTMLElement>("[data-items]");
  const nameEl = body.querySelector<HTMLElement>("[data-fn-name]");
  const sigEl = body.querySelector<HTMLElement>("[data-fn-signature]");
  const descEl = body.querySelector<HTMLElement>("[data-fn-description]");
  let selected = "SUM";
  const renderList = () => {
    const category = body.querySelector<HTMLSelectElement>("[data-category]")?.value ?? "All";
    const entries = FUNCTION_LIBRARY.filter(entry => category === "All" || entry.category === category);
    if (list) {
      list.innerHTML = entries
        .map(
          entry =>
            `<button class="gc-function-item${entry.name === selected ? " is-active" : ""}" type="button" data-name="${
              entry.name
            }">${entry.name}</button>`
        )
        .join("");
    }
    const entry = FUNCTION_LIBRARY.find(item => item.name === selected) ?? entries[0];
    if (entry) {
      selected = entry.name;
      if (nameEl) nameEl.textContent = entry.name;
      if (sigEl) sigEl.textContent = entry.signature;
      if (descEl) descEl.textContent = entry.description;
    }
  };
  body.addEventListener("click", event => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-name]");
    if (button) {
      selected = button.dataset.name ?? selected;
      renderList();
    }
  });
  body.querySelector("[data-category]")?.addEventListener("change", renderList);
  renderList();
  const dialog = openDialog({
    title: "Insert Function",
    width: 640,
    body,
    footer: `<button class="gc-btn" data-cancel type="button">Cancel</button><button class="gc-btn gc-btn--primary" data-insert type="button">Insert Function</button>`
  });
  dialog.root.querySelector(".gc-dialog-foot [data-cancel]")?.addEventListener("click", dialog.close);
  dialog.root.querySelector(".gc-dialog-foot [data-insert]")?.addEventListener("click", () => {
    insertFunctionSnippet(selected);
    dialog.close();
  });
}

function insertFunctionSnippet(name: string): void {
  if (grid.isEditing()) {
    grid.updateEditText(`${grid.editText()}${name}(`);
  } else {
    grid.beginEdit(`=${name}(`, "edit", false);
  }
  formulaInput.classList.add("is-editing");
  formulaInput.focus();
  formulaInput.setSelectionRange(formulaInput.value.length, formulaInput.value.length);
}

function openNameManager(): void {
  const body = document.createElement("div");
  body.className = "gc-name-manager";
  const render = () => {
    body.innerHTML = `
      <table class="gc-names-table">
        <thead><tr><th>Name</th><th>Refers to</th><th></th></tr></thead>
        <tbody>
          ${
            Object.entries(workbook.names)
              .map(
                ([name, range]) =>
                  `<tr><td>${esc(name)}</td><td>${esc(
                    range
                  )}</td><td><button class="gc-btn gc-btn--tiny" type="button" data-edit="${esc(
                    name
                  )}">Edit</button> <button class="gc-btn gc-btn--tiny" type="button" data-delete="${esc(
                    name
                  )}">Delete</button></td></tr>`
              )
              .join("") || '<tr><td colspan="3" class="gc-muted">No defined names yet.</td></tr>'
          }
        </tbody>
      </table>
      <button class="gc-btn" type="button" data-new>New…</button>
    `;
    body.querySelectorAll<HTMLElement>("[data-edit]").forEach(button => {
      button.addEventListener("click", () => {
        const name = button.dataset.edit ?? "";
        promptDialog("Edit name", "Refers to", workbook.names[name], value => {
          if (value.trim()) {
            workbook.names[name] = value.trim();
            render();
            markDirty();
          }
        });
      });
    });
    body.querySelectorAll<HTMLElement>("[data-delete]").forEach(button => {
      button.addEventListener("click", () => {
        delete workbook.names[button.dataset.delete ?? ""];
        render();
        markDirty();
      });
    });
    body.querySelector("[data-new]")?.addEventListener("click", () => {
      promptDialog("New name", "Name", "MyRange", name => {
        const trimmed = name.trim();
        if (!trimmed) return;
        promptDialog("New name", "Refers to (e.g. Sales!A1:B4)", selectionAddress(), range => {
          workbook.names[trimmed] = range.trim();
          render();
          markDirty();
        });
      });
    });
  };
  render();
  openDialog({
    title: "Name Manager",
    width: 620,
    body,
    footer: `<button class="gc-btn gc-btn--primary" data-close type="button">Close</button>`,
    onMount: (root, close) => root.querySelector("[data-close]")?.addEventListener("click", close)
  });
}

function openCommentDialog(): void {
  const point = grid.activeCell;
  const sheet = getSheet();
  const cell = sheet.cells[cellKey(point.r, point.c)];
  promptDialog(
    "Comment",
    `Comment on ${cellKey(point.r, point.c)}`,
    cell?.comment ?? "",
    value => {
      pushHistory();
      const target = ensureCell(sheet, point.r, point.c);
      if (value.trim()) target.comment = value.trim();
      else delete target.comment;
      afterMutation("Comment updated");
    },
    { multiline: true, okLabel: "Save" }
  );
}

function openSortDialog(): void {
  const rect = grid.selectionRect();
  const sheet = getSheet();
  const headers = engine.matrixOf(sheet, rectToRange({ ...rect, r2: rect.r1 }))[0] ?? [];
  const body = document.createElement("div");
  body.innerHTML = `
    <label class="gc-field"><span>Sort by</span><select class="gc-input" data-column>${headers
      .map((header, index) => `<option value="${rect.c1 + index}">${esc(formatScalar(header, undefined))}</option>`)
      .join("")}</select></label>
    <label class="gc-field gc-field--inline"><input type="radio" name="order" value="asc" checked/> Smallest to Largest</label>
    <label class="gc-field gc-field--inline"><input type="radio" name="order" value="desc"/> Largest to Smallest</label>
  `;
  const dialog = openDialog({
    title: "Sort",
    width: 420,
    body,
    footer: `<button class="gc-btn" data-cancel type="button">Cancel</button><button class="gc-btn gc-btn--primary" data-sort type="button">Sort</button>`
  });
  const columnSelect = body.querySelector<HTMLSelectElement>("[data-column]");
  const table = activeTable();
  const range = table ? tableRect(table) : rect;
  dialog.root.querySelector("[data-cancel]")?.addEventListener("click", dialog.close);
  dialog.root.querySelector("[data-sort]")?.addEventListener("click", () => {
    const column = Number(columnSelect?.value ?? rect.c1);
    const ascending = (body.querySelector<HTMLInputElement>('input[name="order"]:checked')?.value ?? "asc") === "asc";
    sortTable(range, column, ascending);
    dialog.close();
  });
}

function openAboutDialog(): void {
  openDialog({
    title: "About GridCraft",
    width: 480,
    body: `<p class="gc-dialog-text"><strong>GridCraft</strong> is a native spreadsheet rebuilt in Rust. This page is a LiteGUI workbench inspired by it: ribbon tabs, a formula bar, 60+ worksheet functions, tables, charts and PivotTables, all in the browser.</p>
      <p class="gc-dialog-text gc-muted">Reference: getartcraft.com/apps/gridcraft · Built with @gausszhou/litegui-components</p>`,
    footer: `<button class="gc-btn gc-btn--primary" data-close type="button">Close</button>`,
    onMount: (root, close) => root.querySelector("[data-close]")?.addEventListener("click", close)
  });
}

function openShortcutsDialog(): void {
  const rows: Array<[string, string]> = [
    ["Ctrl+Z / Ctrl+Y", "Undo / Redo"],
    ["Ctrl+B / I / U", "Bold / Italic / Underline"],
    ["Ctrl+C / X / V", "Copy / Cut / Paste"],
    ["Ctrl+F", "Find and Replace"],
    ["Ctrl+1", "Format Cells"],
    ["Ctrl+Home", "Go to A1"],
    ["Ctrl+End", "Go to last used cell"],
    ["Tab / Enter", "Move right / down"],
    ["Shift+Tab / Shift+Enter", "Move left / up"],
    ["F2", "Edit the active cell"],
    ["Delete", "Clear contents"],
    ["Ctrl+Shift+L", "Toggle table filter"],
    ["Ctrl+S", "Save in browser"],
    ["Esc", "Cancel edit or menu"]
  ];
  openDialog({
    title: "Keyboard Shortcuts",
    width: 480,
    body: `<table class="gc-shortcuts">${rows
      .map(([key, description]) => `<tr><td><kbd>${key}</kbd></td><td>${description}</td></tr>`)
      .join("")}</table>`,
    footer: `<button class="gc-btn gc-btn--primary" data-close type="button">Close</button>`,
    onMount: (root, close) => root.querySelector("[data-close]")?.addEventListener("click", close)
  });
}

/* --------------------------------------------------------------- commands */

function placeholder(feature: string): void {
  setStatus(`${feature} is not available in this browser demo`);
}

function openMenuFor(id: string, anchor?: HTMLElement): void {
  const sections = menuSections(id);
  if (!sections || !sections.length) return;
  openMenuAt(anchor ?? null, sections);
}

function menuSections(id: string): MenuItem[] | null {
  switch (id) {
    case "paste":
      return [
        { label: "Paste", icon: "paste", shortcut: "Ctrl+V", action: () => pasteClipboard(false) },
        { label: "Paste Values", icon: "copy", action: () => pasteClipboard(true) },
        { label: "Paste Formulas", icon: "fx", action: () => pasteClipboard(false) },
        { separator: true },
        { label: "Paste Special…", icon: "settings", action: () => openFormatCellsDialog() }
      ];
    case "borders":
      return [
        { label: "Bottom Border", action: () => applyStyle({ border: { bottom: true } }) },
        { label: "Top Border", action: () => applyStyle({ border: { top: true } }) },
        { label: "Left Border", action: () => applyStyle({ border: { left: true } }) },
        { label: "Right Border", action: () => applyStyle({ border: { right: true } }) },
        { separator: true },
        {
          label: "All Borders",
          action: () => applyStyle({ border: { top: true, bottom: true, left: true, right: true } })
        },
        {
          label: "Outside Borders",
          action: () => applyStyle({ border: { top: true, bottom: true, left: true, right: true } })
        },
        {
          label: "No Border",
          action: () => applyStyle({ border: { top: false, bottom: false, left: false, right: false } })
        }
      ];
    case "fill-color":
      return [
        { header: true, label: "Fill Color" },
        {
          label: "Theme Colors",
          swatches: [
            "transparent",
            "#fff2cc",
            "#fce4d6",
            "#e2efda",
            "#deebf7",
            "#e4dfec",
            "#f2f2f2",
            "#dcefeb",
            "#c9e9d0",
            "#f8cec2",
            "#fff0b8",
            "#b7d8d1",
            "#0e6b5c",
            "#1f3864",
            "#c0392b",
            "#7f6000"
          ],
          onSwatch: color => applyStyle({ fill: color === "transparent" ? "" : color })
        },
        {
          label: "More Colors…",
          action: () => promptDialog("Fill color", "Hex color", "#eaf4f2", value => applyStyle({ fill: value }))
        }
      ];
    case "font-color":
      return [
        { header: true, label: "Font Color" },
        {
          label: "Theme Colors",
          swatches: [
            "#000000",
            "#262626",
            "#595959",
            "#7f7f7f",
            "#12554d",
            "#0e6b5c",
            "#1f3864",
            "#2e75b6",
            "#c0392b",
            "#c55a11",
            "#7f6000",
            "#217346",
            "#7030a0",
            "#ffffff"
          ],
          onSwatch: color => applyStyle({ color })
        },
        {
          label: "More Colors…",
          action: () => promptDialog("Font color", "Hex color", "#c0392b", value => applyStyle({ color: value }))
        }
      ];
    case "orientation":
      return [
        { label: "Angle Counterclockwise", action: () => placeholder("Text rotation") },
        { label: "Angle Clockwise", action: () => placeholder("Text rotation") },
        { label: "Vertical Text", action: () => placeholder("Vertical text") }
      ];
    case "merge":
      return [
        { label: "Merge & Center", icon: "merge", action: () => mergeSelection("center") },
        { label: "Merge Across", action: () => mergeSelection("across") },
        { label: "Merge Cells", action: () => mergeSelection("cells") },
        { label: "Unmerge Cells", action: () => mergeSelection("unmerge") }
      ];
    case "conditional":
      return [
        { header: true, label: "Highlight Cells Rules" },
        {
          label: "Greater Than…",
          submenu: [10, 100, 1000].map(value => ({
            label: `${value}`,
            action: () => addCondRule({ type: "greater", value, color: "#d7ecd9" })
          }))
        },
        {
          label: "Less Than…",
          submenu: [0, -100, -1000].map(value => ({
            label: `${value}`,
            action: () => addCondRule({ type: "less", value, color: "#f8d7d4" })
          }))
        },
        {
          label: "Between…",
          action: () => {
            promptDialog("Between", "Lower bound", "0", low => {
              promptDialog("Between", "Upper bound", "100", high => {
                addCondRule({ type: "between", value: Number(low), value2: Number(high), color: "#fff0b8" });
              });
            });
          }
        },
        { separator: true },
        { header: true, label: "Color Scales" },
        {
          label: "Green - Yellow - Red",
          action: () => addCondRule({ type: "colorScale", scale: { min: "#63be7b", mid: "#ffeb84", max: "#f8696b" } })
        },
        {
          label: "Red - Yellow - Green",
          action: () => addCondRule({ type: "colorScale", scale: { min: "#f8696b", mid: "#ffeb84", max: "#63be7b" } })
        },
        {
          label: "Blue - White - Red",
          action: () => addCondRule({ type: "colorScale", scale: { min: "#5a8ac6", mid: "#f8f8f8", max: "#d6604d" } })
        },
        { separator: true },
        { label: "Data Bars", icon: "chart-column", action: () => addCondRule({ type: "dataBar", color: "#8fc7bd" }) },
        { label: "Icon Sets", icon: "conditional", action: () => addCondRule({ type: "iconSet" }) },
        { separator: true },
        { label: "Clear Rules from Selected Cells", action: () => clearCondRules("selection") },
        { label: "Clear Rules from Entire Sheet", action: () => clearCondRules("sheet") }
      ];
    case "table-styles":
      return [
        { header: true, label: "Table Styles" },
        { label: "Teal, Table Style Medium 2", icon: "table", action: () => formatAsTable("teal") },
        { label: "Green, Table Style Medium 4", icon: "table", action: () => formatAsTable("green") },
        { label: "Blue, Table Style Medium 2", icon: "table", action: () => formatAsTable("blue") },
        { label: "Orange, Table Style Medium 2", icon: "table", action: () => formatAsTable("orange") },
        { label: "Gray, Table Style Medium 1", icon: "table", action: () => formatAsTable("gray") },
        { separator: true },
        { label: "Convert to Range", action: () => convertTableToRange() }
      ];
    case "cell-styles":
      return CELL_STYLE_PRESETS.map(preset => ({
        label: preset.name,
        icon: preset.style.bold ? "font" : "cell-styles",
        action: () => applyStyle(preset.style)
      }));
    case "insert-cells":
      return [
        {
          label: "Insert Sheet Rows",
          icon: "insert",
          action: () => insertRows(grid.selectionRect().r2 - grid.selectionRect().r1 + 1)
        },
        {
          label: "Insert Sheet Columns",
          icon: "insert",
          action: () => insertCols(grid.selectionRect().c2 - grid.selectionRect().c1 + 1)
        },
        { separator: true },
        { label: "Insert Cells…", icon: "insert", action: () => placeholder("Insert cells dialog") }
      ];
    case "delete-cells":
      return [
        {
          label: "Delete Sheet Rows",
          icon: "delete",
          action: () => deleteRows(grid.selectionRect().r2 - grid.selectionRect().r1 + 1)
        },
        {
          label: "Delete Sheet Columns",
          icon: "delete",
          action: () => deleteCols(grid.selectionRect().c2 - grid.selectionRect().c1 + 1)
        },
        { separator: true },
        { label: "Delete Cells…", icon: "delete", action: () => placeholder("Delete cells dialog") }
      ];
    case "format-cells-menu":
      return [
        {
          label: "Row Height…",
          icon: "resize",
          action: () => promptDialog("Row height", "Points", "21", value => setRowHeight(Number(value)))
        },
        {
          label: "Column Width…",
          icon: "resize",
          action: () => promptDialog("Column width", "Pixels", "86", value => setColWidth(Number(value)))
        },
        { label: "AutoFit Column Width", action: () => autofitColumns() },
        { separator: true },
        { label: "Hide Rows", action: () => placeholder("Hide rows") },
        { label: "Hide Columns", action: () => placeholder("Hide columns") },
        { separator: true },
        { label: "Format Cells…", icon: "format", shortcut: "Ctrl+1", action: () => openFormatCellsDialog() }
      ];
    case "autosum-menu":
      return [
        { label: "Sum", icon: "autosum", action: () => autoSum("SUM") },
        { label: "Average", action: () => autoSum("AVERAGE") },
        { label: "Count Numbers", action: () => autoSum("COUNT") },
        { label: "Max", action: () => autoSum("MAX") },
        { label: "Min", action: () => autoSum("MIN") }
      ];
    case "fill-menu":
      return [
        { label: "Down", icon: "arrow-down", action: () => fillSelection("down") },
        { label: "Right", icon: "arrow-right", action: () => fillSelection("right") },
        { label: "Up", icon: "arrow-up", action: () => fillSelection("up") },
        { label: "Left", icon: "chevron-left", action: () => fillSelection("left") }
      ];
    case "clear-menu":
      return [
        { label: "Clear All", icon: "clear", action: () => clearSelection("all") },
        { label: "Clear Contents", action: () => clearSelection("contents") },
        { label: "Clear Formats", action: () => clearSelection("formats") },
        { label: "Clear Comments", action: () => clearSelection("comments") }
      ];
    case "sort-filter":
      return [
        {
          label: "Sort A to Z",
          icon: "sort-asc",
          action: () =>
            sortTable(activeTable() ? tableRect(activeTable()!) : grid.selectionRect(), grid.activeCell.c, true)
        },
        {
          label: "Sort Z to A",
          icon: "sort-desc",
          action: () =>
            sortTable(activeTable() ? tableRect(activeTable()!) : grid.selectionRect(), grid.activeCell.c, false)
        },
        { label: "Custom Sort…", icon: "sort-asc", action: () => openSortDialog() },
        { separator: true },
        { label: "Filter", icon: "filter", action: () => toggleFilter() },
        { label: "Clear Filter", icon: "clear-filter", action: () => clearTableFilter() }
      ];
    case "find-select":
      return [
        { label: "Find…", icon: "find", shortcut: "Ctrl+F", action: () => openFindDialog() },
        {
          label: "Go To…",
          action: () =>
            promptDialog("Go To", "Cell reference or named range", selectionAddress(), value => goToName(value))
        },
        { separator: true },
        { label: "Select All", action: () => grid.selectAll() }
      ];
    case "chart-types":
      return [
        { label: "Column", icon: "chart-column", action: () => insertChartOfType("column") },
        { label: "Bar", icon: "chart-bar", action: () => insertChartOfType("bar") },
        { label: "Line", icon: "chart-line", action: () => insertChartOfType("line") },
        { label: "Area", icon: "chart-area", action: () => insertChartOfType("area") },
        { label: "Pie", icon: "chart-pie", action: () => insertChartOfType("pie") },
        { label: "Doughnut", icon: "chart-pie", action: () => insertChartOfType("doughnut") },
        { label: "Scatter", icon: "chart-scatter", action: () => insertChartOfType("scatter") }
      ];
    case "margins":
      return ["Normal", "Wide", "Narrow"].map(label => ({ label, action: () => placeholder(`${label} margins`) }));
    case "page-size":
      return ["Letter", "A4", "Legal", "Tabloid"].map(label => ({
        label,
        action: () => placeholder(`${label} paper size`)
      }));
    case "print-area":
      return [
        { label: "Set Print Area", action: () => placeholder("Print area") },
        { label: "Clear Print Area", action: () => placeholder("Print area") }
      ];
    case "page-breaks":
      return [
        { label: "Insert Page Break", action: () => placeholder("Page break") },
        { label: "Remove Page Break", action: () => placeholder("Page break") },
        { label: "Reset All Page Breaks", action: () => placeholder("Page break") }
      ];
    case "freeze-panes":
      return [
        { label: "Freeze Panes", icon: "freeze", action: () => freezeAt(grid.activeCell.r, grid.activeCell.c) },
        { label: "Freeze Top Row", action: () => freezeAt(1, 0) },
        { label: "Freeze First Column", action: () => freezeAt(0, 1) },
        { separator: true },
        { label: "Unfreeze Panes", action: () => freezeAt(0, 0) }
      ];
    case "zoom-menu":
      return [50, 75, 100, 125, 150, 200].map(percent => ({
        label: `${percent}%`,
        checked: Math.round(grid.getZoom() * 100) === percent,
        action: () => setZoom(percent)
      }));
    case "get-data":
      return ["From File", "From Table/Range", "From Web", "From Text/CSV"].map(label => ({
        label,
        action: () => placeholder("Get Data")
      }));
    case "sort-menu":
      return [
        {
          label: "Sort A to Z",
          icon: "sort-asc",
          action: () => sortTable(grid.selectionRect(), grid.activeCell.c, true)
        },
        {
          label: "Sort Z to A",
          icon: "sort-desc",
          action: () => sortTable(grid.selectionRect(), grid.activeCell.c, false)
        },
        { label: "Custom Sort…", action: () => openSortDialog() }
      ];
    case "calc-options":
      return [
        {
          label: "Automatic",
          checked: !manualCalc,
          action: () => {
            manualCalc = false;
            setStatus("Calculation: automatic");
          }
        },
        {
          label: "Manual",
          checked: manualCalc,
          action: () => {
            manualCalc = true;
            setStatus("Calculation: manual");
          }
        }
      ];
    case "use-formula":
      return Object.keys(workbook.names).length
        ? Object.entries(workbook.names).map(([name]) => ({ label: name, action: () => insertFunctionSnippet(name) }))
        : [{ label: "No defined names", disabled: true }];
    case "fn-financial":
      return functionMenu(["PMT", "FV", "NPV", "IRR"]);
    case "fn-logical":
      return functionMenu(["IF", "IFS", "IFERROR", "AND", "OR", "NOT"]);
    case "fn-text":
      return functionMenu(["TEXT", "CONCAT", "TEXTJOIN", "LEFT", "RIGHT", "MID", "LEN", "UPPER", "LOWER", "TRIM"]);
    case "fn-date":
      return functionMenu(["TODAY", "NOW", "YEAR", "MONTH", "DAY", "DATE"]);
    case "fn-lookup":
      return functionMenu(["VLOOKUP", "HLOOKUP", "XLOOKUP", "INDEX", "MATCH", "CHOOSE"]);
    case "fn-math":
      return functionMenu(["SUM", "ROUND", "ROUNDUP", "ROUNDDOWN", "ABS", "MOD", "SQRT", "POWER", "SUMPRODUCT"]);
    case "fn-more":
      return [
        { label: "Insert Function…", icon: "fx", action: () => openInsertFunctionDialog() },
        { separator: true },
        ...functionMenu(FUNCTION_LIBRARY.slice(0, 18).map(entry => entry.name))
      ];
    case "chart-elements":
      return chartElementMenu();
    case "chart-layouts":
      return [
        {
          label: "Layout 1 (Title + Legend)",
          action: () => updateSelectedChart({ legend: "bottom", dataLabels: false })
        },
        { label: "Layout 2 (Title + Labels)", action: () => updateSelectedChart({ legend: "none", dataLabels: true }) },
        { label: "Layout 3 (Legend only)", action: () => updateSelectedChart({ title: "", legend: "bottom" }) }
      ];
    case "show-values":
      return [
        { label: "Sum", checked: getSheet().pivot?.values[0]?.agg === "sum", action: () => setPivotAggregation("sum") },
        {
          label: "Count",
          checked: getSheet().pivot?.values[0]?.agg === "count",
          action: () => setPivotAggregation("count")
        },
        {
          label: "Average",
          checked: getSheet().pivot?.values[0]?.agg === "average",
          action: () => setPivotAggregation("average")
        }
      ];
    case "grand-totals":
      return [
        {
          label: "On for Rows and Columns",
          checked: Boolean(getSheet().pivot?.grandTotals),
          action: () => setPivotGrandTotals(true)
        },
        { label: "Off", checked: !getSheet().pivot?.grandTotals, action: () => setPivotGrandTotals(false) }
      ];
    case "pivot-layout":
      return [
        {
          label: "Compact Form",
          checked: getSheet().pivot?.layout === "compact",
          action: () => setPivotLayout("compact")
        },
        {
          label: "Tabular Form",
          checked: getSheet().pivot?.layout === "tabular",
          action: () => setPivotLayout("tabular")
        },
        {
          label: "Outline Form",
          checked: getSheet().pivot?.layout === "outline",
          action: () => setPivotLayout("outline")
        }
      ];
    case "more-menu":
      return moreMenu();
    case "share-menu":
      return shareMenu();
    case "name-box":
      return [
        ...Object.entries(workbook.names).map(([name, range]) => ({
          label: `${name}   ${range}`,
          action: () => goToName(name)
        })),
        ...(Object.keys(workbook.names).length ? [{ separator: true } as MenuItem] : []),
        { label: "Define Name…", icon: "define-name", action: () => defineNameDialog() },
        { label: "Name Manager…", icon: "name-manager", action: () => openNameManager() }
      ];
    default:
      return null;
  }
}

function functionMenu(names: string[]): MenuItem[] {
  return names.map(name => {
    const entry = FUNCTION_LIBRARY.find(candidate => candidate.name === name);
    return {
      label: name,
      icon: "fx",
      hint: entry?.category,
      action: () => insertFunctionSnippet(name)
    };
  });
}

function chartElementMenu(): MenuItem[] {
  return [
    {
      label: "Chart Title",
      submenu: [
        { label: "None", action: () => updateSelectedChart({ title: "" }) },
        {
          label: "Above Chart",
          action: () => {
            if (!grid.selectedChartSpec()) return;
            promptDialog("Chart title", "Title", grid.selectedChartSpec()?.title ?? "Chart Title", value =>
              updateSelectedChart({ title: value })
            );
          }
        }
      ]
    },
    {
      label: "Legend",
      submenu: ["right", "bottom", "top", "none"].map(position => ({
        label: position,
        action: () => updateSelectedChart({ legend: position as ChartSpec["legend"] })
      }))
    },
    {
      label: "Data Labels",
      checked: Boolean(grid.selectedChartSpec()?.dataLabels),
      action: () => {
        const chart = grid.selectedChartSpec();
        if (chart) updateSelectedChart({ dataLabels: !chart.dataLabels });
      }
    },
    {
      label: "Gridlines",
      checked: Boolean(grid.selectedChartSpec()?.gridlines),
      action: () => {
        const chart = grid.selectedChartSpec();
        if (chart) updateSelectedChart({ gridlines: !chart.gridlines });
      }
    }
  ];
}

function moreMenu(): MenuItem[] {
  return [
    { label: "New Workbook", icon: "file", action: () => newWorkbook() },
    { label: "Open Sample Workbook", icon: "home", action: () => loadSample() },
    { separator: true },
    {
      label: "Save a Copy (JSON)",
      icon: "download",
      action: () => download(`${workbook.title}.json`, JSON.stringify(workbook, null, 2), "application/json")
    },
    { label: "Export Sheet as CSV", icon: "download", action: () => exportCsv() },
    { label: "Print", icon: "print", action: () => window.print() },
    { separator: true },
    { label: "Keyboard Shortcuts", icon: "keyboard", action: () => openShortcutsDialog() },
    { label: "About GridCraft", icon: "ai", action: () => openAboutDialog() }
  ];
}

function shareMenu(): MenuItem[] {
  return [
    {
      label: "Copy link",
      icon: "share",
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setStatus("Link copied");
        } catch {
          setStatus("Could not access the clipboard");
        }
      }
    },
    {
      label: "Invite people",
      icon: "comment",
      action: () => promptDialog("Invite people", "Email address", "", () => setStatus("Invitation queued (demo)"))
    },
    {
      label: "Send a copy",
      icon: "download",
      action: () => download(`${workbook.title}.json`, JSON.stringify(workbook, null, 2), "application/json")
    }
  ];
}

function defineNameDialog(): void {
  promptDialog("New name", "Name", "MyRange", name => {
    const trimmed = name.trim();
    if (!trimmed) return;
    promptDialog("New name", "Refers to", selectionAddress(), range => {
      if (!parseRect(range.replace(/\$/g, "")) && !range.includes("!")) {
        setStatus("Enter a valid range such as A1:B4");
        return;
      }
      workbook.names[trimmed] = range.trim();
      setStatus(`Defined ${trimmed}`);
      markDirty();
    });
  });
}

/* ------------------------------------------------------------- basic edits */

function clearSelection(mode: "all" | "contents" | "formats" | "comments"): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  pushHistory();
  for (let r = rect.r1; r <= rect.r2; r += 1) {
    for (let c = rect.c1; c <= rect.c2; c += 1) {
      const key = cellKey(r, c);
      const cell = sheet.cells[key];
      if (!cell) continue;
      if (mode === "all") delete sheet.cells[key];
      else if (mode === "contents") cell.raw = "";
      else if (mode === "formats") delete cell.style;
      else delete cell.comment;
    }
  }
  afterMutation(`Cleared ${mode}`);
}

function autoSum(fn: string): void {
  const sheet = getSheet();
  const point = grid.activeCell;
  let start = point.r - 1;
  while (start >= 0 && engine.numeric(sheet, start, point.c) !== null) start -= 1;
  start += 1;
  if (point.r - start < 1) {
    let left = point.c - 1;
    while (left >= 0 && engine.numeric(sheet, point.r, left) !== null) left -= 1;
    left += 1;
    if (point.c - left < 1) {
      setStatus("There is no numeric data next to the active cell");
      return;
    }
    pushHistory();
    const cell = ensureCell(sheet, point.r, point.c);
    cell.raw = `=${fn}(${cellKey(point.r, left)}:${cellKey(point.r, point.c - 1)})`;
    afterMutation(`${fn} inserted`);
    return;
  }
  pushHistory();
  const cell = ensureCell(sheet, point.r, point.c);
  cell.raw = `=${fn}(${cellKey(start, point.c)}:${cellKey(point.r - 1, point.c)})`;
  afterMutation(`${fn} inserted`);
}

function fillSelection(direction: "down" | "right" | "up" | "left"): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  const vertical = direction === "up" || direction === "down";
  if ((vertical && rect.r2 === rect.r1) || (!vertical && rect.c2 === rect.c1)) {
    setStatus("Select the range to fill including the source cells");
    return;
  }
  pushHistory();
  if (direction === "down") {
    for (let c = rect.c1; c <= rect.c2; c += 1) {
      const source = sheet.cells[cellKey(rect.r1, c)];
      for (let r = rect.r1 + 1; r <= rect.r2; r += 1) copyCell(source, rect.r1, c, r, c);
    }
  } else if (direction === "up") {
    for (let c = rect.c1; c <= rect.c2; c += 1) {
      const source = sheet.cells[cellKey(rect.r2, c)];
      for (let r = rect.r2 - 1; r >= rect.r1; r -= 1) copyCell(source, rect.r2, c, r, c);
    }
  } else if (direction === "right") {
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      const source = sheet.cells[cellKey(r, rect.c1)];
      for (let c = rect.c1 + 1; c <= rect.c2; c += 1) copyCell(source, r, rect.c1, r, c);
    }
  } else {
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      const source = sheet.cells[cellKey(r, rect.c2)];
      for (let c = rect.c2 - 1; c >= rect.c1; c -= 1) copyCell(source, r, rect.c2, r, c);
    }
  }
  afterMutation(`Filled ${direction}`);
}

function copyCell(
  source: Cell | undefined,
  sourceRow: number,
  sourceCol: number,
  targetRow: number,
  targetCol: number
): void {
  if (!source) return;
  const sheet = getSheet();
  const deltaRow = targetRow - sourceRow;
  const deltaCol = targetCol - sourceCol;
  const raw = source.raw.startsWith("=") ? adjustFormula(source.raw, deltaRow, deltaCol) : source.raw;
  sheet.cells[cellKey(targetRow, targetCol)] = {
    raw,
    style: source.style ? structuredClone(source.style) : undefined
  };
}

function setRowHeight(height: number): void {
  if (!Number.isFinite(height)) return;
  pushHistory();
  const rect = grid.selectionRect();
  for (let r = rect.r1; r <= rect.r2; r += 1) getSheet().rowHeights[r] = Math.max(10, Math.min(200, height));
  afterMutation("Row height updated");
}

function setColWidth(width: number): void {
  if (!Number.isFinite(width)) return;
  pushHistory();
  const rect = grid.selectionRect();
  for (let c = rect.c1; c <= rect.c2; c += 1) getSheet().colWidths[c] = Math.max(24, Math.min(400, width));
  afterMutation("Column width updated");
}

function autofitColumns(): void {
  const sheet = getSheet();
  const rect = grid.selectionRect();
  pushHistory();
  for (let c = rect.c1; c <= rect.c2; c += 1) {
    let max = 60;
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      const text = formatScalar(engine.scalarAt(sheet, r, c), sheet.cells[cellKey(r, c)]?.style);
      max = Math.max(max, 18 + text.length * 7);
    }
    sheet.colWidths[c] = Math.min(400, max);
  }
  afterMutation("Columns auto-fitted");
}

function toggleFilter(): void {
  const table = activeTable();
  if (!table) {
    setStatus("Select a cell inside a table to use filters");
    return;
  }
  pushHistory();
  table.filter = !table.filter;
  table.filterState = null;
  afterMutation(table.filter ? "Filter buttons enabled" : "Filter buttons hidden");
}

function clearTableFilter(): void {
  const table = activeTable();
  if (!table?.filterState) {
    setStatus("No filter is applied");
    return;
  }
  pushHistory();
  table.filterState = null;
  afterMutation("Filter cleared");
}

/* ------------------------------------------------------------- clipboard */

function copySelection(cut: boolean): void {
  const matrix = grid.selectionMatrix();
  clipboard = { matrix, rect: grid.selectionRect(), cut };
  const text = matrix.map(row => row.join("\t")).join("\n");
  void navigator.clipboard?.writeText(text).catch(() => undefined);
  setStatus(`${cut ? "Cut" : "Copied"} ${matrix.length} × ${matrix[0]?.length ?? 0}`);
}

function pasteClipboard(valuesOnly: boolean): void {
  if (!clipboard) {
    setStatus("Nothing to paste — copy cells first");
    return;
  }
  const sheet = getSheet();
  const start = grid.selectionRect();
  const sourceRect = clipboard.rect;
  pushHistory();
  clipboard.matrix.forEach((row, rowIndex) => {
    row.forEach((raw, colIndex) => {
      const r = start.r1 + rowIndex;
      const c = start.c1 + colIndex;
      if (r > 59 || c > 25) return;
      const sourceRow = sourceRect ? sourceRect.r1 + rowIndex : start.r1;
      const sourceCol = sourceRect ? sourceRect.c1 + colIndex : start.c1;
      const sourceCell = sheet.cells[cellKey(sourceRow, sourceCol)];
      const cell = ensureCell(sheet, r, c);
      if (valuesOnly) {
        const value = engine.scalarAt(sheet, sourceRow, sourceCol);
        cell.raw = typeof value === "number" ? String(value) : formatScalar(value, undefined);
        if (sourceCell?.style) cell.style = structuredClone(sourceCell.style);
      } else {
        cell.raw = raw.startsWith("=") && sourceRect ? adjustFormula(raw, r - sourceRow, c - sourceCol) : raw;
        if (sourceCell?.style) cell.style = structuredClone(sourceCell.style);
      }
    });
  });
  if (clipboard.cut && sourceRect) {
    for (let r = sourceRect.r1; r <= sourceRect.r2; r += 1) {
      for (let c = sourceRect.c1; c <= sourceRect.c2; c += 1) {
        if (
          inRanges(
            r,
            c,
            start,
            start.r1 + clipboard.matrix.length - 1,
            start.c1 + (clipboard.matrix[0]?.length ?? 1) - 1
          )
        )
          continue;
        delete sheet.cells[cellKey(r, c)];
      }
    }
    clipboard.cut = false;
  }
  afterMutation("Pasted");
}

function inRanges(r: number, c: number, start: Rect, endRow: number, endCol: number): boolean {
  return r >= start.r1 && r <= endRow && c >= start.c1 && c <= endCol;
}

/* -------------------------------------------------------------- view etc. */

function setZoom(percent: number): void {
  const clamped = Math.max(40, Math.min(200, Math.round(percent / 10) * 10));
  grid.setZoom(clamped / 100);
  zoomSlider.value = String(clamped);
  zoomLabel.textContent = `${clamped}%`;
  setStatus(`Zoom ${clamped}%`);
}

function freezeAt(rows: number, cols: number): void {
  pushHistory();
  getSheet().freeze = { rows, cols };
  afterMutation(rows || cols ? "Panes frozen" : "Panes unfrozen");
}

function newWorkbook(): void {
  confirmDialog("New workbook", "Start a new blank workbook? Current unsaved changes stay in this session.", () => {
    pushHistory();
    const sheet = createSheet("sheet-1", "Sheet1");
    workbook = { title: "Book1", file: "Book1.xlsx", sheets: [sheet], active: 0, names: {}, autosave: false };
    engine = new CalcEngine(workbook);
    workbook.autosave = false;
    q<HTMLButtonElement>("#gc-autosave").classList.remove("is-on");
    grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
    grid.invalidateLayout();
    grid.render();
    renderEverything();
    updateDocTitle();
    setStatus("New workbook");
    markDirty();
  });
}

function loadSample(): void {
  confirmDialog(
    "Open sample",
    "Reload the sample workbook? This replaces the current workbook and can be undone.",
    () => {
      pushHistory();
      workbook = createDemoWorkbook();
      engine = new CalcEngine(workbook);
      q<HTMLButtonElement>("#gc-autosave").classList.toggle("is-on", workbook.autosave);
      grid.setSelection({ r1: 0, c1: 0, r2: 0, c2: 0 });
      grid.invalidateLayout();
      grid.render();
      renderEverything();
      updateDocTitle();
      setStatus("Sample workbook loaded");
      markDirty();
    }
  );
}

function exportCsv(): void {
  const sheet = getSheet();
  let maxRow = 0;
  let maxCol = 0;
  for (const key of Object.keys(sheet.cells)) {
    const point = parseAddress(key);
    if (!point) continue;
    if (sheet.cells[key]?.raw) {
      maxRow = Math.max(maxRow, point.r);
      maxCol = Math.max(maxCol, point.c);
    }
  }
  const lines: string[] = [];
  for (let r = 0; r <= maxRow; r += 1) {
    const values: string[] = [];
    for (let c = 0; c <= maxCol; c += 1) {
      const cell = sheet.cells[cellKey(r, c)];
      const text = formatScalar(engine.scalarAt(sheet, r, c), cell?.style);
      values.push(`"${text.replace(/"/g, '""')}"`);
    }
    lines.push(values.join(","));
  }
  download(`${sheet.name}.csv`, lines.join("\n"), "text/csv");
  setStatus("Sheet exported as CSV");
}

function setPivotAggregation(agg: "sum" | "count" | "average"): void {
  const sheet = getSheet();
  if (!sheet.pivot?.values[0]) return;
  pushHistory();
  sheet.pivot.values[0].agg = agg;
  applyPivot(sheet, engine);
  afterMutation("PivotTable values updated");
  renderPane(true);
}

function setPivotGrandTotals(enabled: boolean): void {
  const sheet = getSheet();
  if (!sheet.pivot) return;
  pushHistory();
  sheet.pivot.grandTotals = enabled;
  applyPivot(sheet, engine);
  afterMutation(enabled ? "Grand totals on" : "Grand totals off");
  renderPane(true);
}

/* ---------------------------------------------------------- context menu */

function openGridContextMenu(event: MouseEvent, target: GridTarget): void {
  if (target.kind === "chart") {
    const chart = grid.selectedChartSpec();
    if (!chart) return;
    openMenu(event.clientX, event.clientY, [
      {
        label: "Format Chart Area…",
        icon: "format-pane",
        action: () => {
          chartPaneOpen = true;
          renderPane(true);
        }
      },
      { label: "Change Chart Type…", icon: "chart-design", action: () => openMenuFor("chart-types", document.body) },
      { separator: true },
      { label: "Delete Chart", icon: "delete", danger: true, action: () => deleteSelectedChart() }
    ]);
    return;
  }
  if (target.kind === "row") {
    openMenu(event.clientX, event.clientY, [
      { label: "Insert Row", icon: "insert", action: () => insertRows(1) },
      { label: "Delete Row", icon: "delete", action: () => deleteRows(1) },
      { separator: true },
      {
        label: "Row Height…",
        icon: "resize",
        action: () => promptDialog("Row height", "Points", "21", value => setRowHeight(Number(value)))
      }
    ]);
    return;
  }
  if (target.kind === "col") {
    openMenu(event.clientX, event.clientY, [
      { label: "Insert Column", icon: "insert", action: () => insertCols(1) },
      { label: "Delete Column", icon: "delete", action: () => deleteCols(1) },
      { separator: true },
      {
        label: "Column Width…",
        icon: "resize",
        action: () => promptDialog("Column width", "Pixels", "86", value => setColWidth(Number(value)))
      }
    ]);
    return;
  }
  if (target.kind !== "cell") return;
  const table = tableAt(getSheet(), target.r, target.c);
  openMenu(event.clientX, event.clientY, [
    {
      label: "Cut",
      icon: "cut",
      shortcut: "Ctrl+X",
      action: () => {
        copySelection(true);
      }
    },
    { label: "Copy", icon: "copy", shortcut: "Ctrl+C", action: () => copySelection(false) },
    { label: "Paste", icon: "paste", shortcut: "Ctrl+V", action: () => pasteClipboard(false) },
    { separator: true },
    { label: "Insert…", icon: "insert", action: () => openMenuFor("insert-cells", viewport) },
    { label: "Delete…", icon: "delete", action: () => openMenuFor("delete-cells", viewport) },
    { label: "Clear Contents", icon: "clear", action: () => clearSelection("contents") },
    { separator: true },
    { label: "Format Cells…", icon: "format", shortcut: "Ctrl+1", action: () => openFormatCellsDialog() },
    { label: "Comment", icon: "new-comment", action: () => openCommentDialog() },
    ...(table
      ? [
          { separator: true } as MenuItem,
          {
            label: "Sort A to Z",
            icon: "sort-asc",
            action: () => sortTable(tableRect(table), target.c, true)
          } as MenuItem,
          { label: "Filter", icon: "filter", action: () => openFilterMenu(table.id, target.c, viewport) } as MenuItem
        ]
      : []),
    { separator: true },
    { label: "Insert Chart", icon: "chart-column", action: () => insertChartOfType("column") },
    { label: "Define Name…", icon: "define-name", action: () => defineNameDialog() }
  ]);
}

/* -------------------------------------------------------------- commands */

function runCommand(command: string, anchor?: HTMLElement): void {
  if (grid.isEditing()) grid.commitEdit("none");
  switch (command) {
    case "undo":
      undo();
      return;
    case "redo":
      redo();
      return;
    case "save":
      saveWorkbook(false);
      return;
    case "clear-contents":
      clearSelection("contents");
      return;
    case "page-orientation":
      openMenuFor("orientation", anchor);
      return;
    case "page-margins":
      openMenuFor("margins", anchor);
      return;
    case "page-size":
      openMenuFor("page-size", anchor);
      return;
    case "home":
      switchSheet(
        workbook.sheets.findIndex(sheet => sheet.name === "Sales") >= 0
          ? workbook.sheets.findIndex(sheet => sheet.name === "Sales")
          : 0
      );
      return;
    case "more-menu":
      openMenuFor("more-menu", anchor);
      return;
    case "share-menu":
      openMenuFor("share-menu", anchor);
      return;
    case "paste":
      openMenuFor("paste", anchor);
      return;
    case "cut":
      copySelection(true);
      return;
    case "copy":
      copySelection(false);
      return;
    case "format-painter":
      placeholder("Format Painter");
      return;
    case "bold":
      toggleStyle("bold");
      return;
    case "italic":
      toggleStyle("italic");
      return;
    case "underline":
      toggleStyle("underline");
      return;
    case "font-inc":
      shiftFontSize(1);
      return;
    case "font-dec":
      shiftFontSize(-1);
      return;
    case "borders":
      openMenuFor("borders", anchor);
      return;
    case "fill-color":
      openMenuFor("fill-color", anchor);
      return;
    case "font-color":
      openMenuFor("font-color", anchor);
      return;
    case "wrap-text":
      applyStyle({ wrap: !(getActiveCell()?.style?.wrap ?? false) });
      return;
    case "align-left":
      setAlign("left");
      return;
    case "align-center":
      setAlign("center");
      return;
    case "align-right":
      setAlign("right");
      return;
    case "valign-top":
      setVAlign("top");
      return;
    case "valign-middle":
      setVAlign("middle");
      return;
    case "valign-bottom":
      setVAlign("bottom");
      return;
    case "orientation":
      openMenuFor("orientation", anchor);
      return;
    case "merge":
      openMenuFor("merge", anchor);
      return;
    case "currency":
      toggleNumberFormat("currency");
      return;
    case "percent":
      toggleNumberFormat("percent");
      return;
    case "comma":
      toggleNumberFormat("comma");
      return;
    case "inc-decimals":
      applyStyle({ decimals: Math.min(6, (getActiveCell()?.style?.decimals ?? 0) + 1) });
      return;
    case "dec-decimals":
      applyStyle({ decimals: Math.max(0, (getActiveCell()?.style?.decimals ?? 0) - 1) });
      return;
    case "conditional":
      openMenuFor("conditional", anchor);
      return;
    case "format-table":
      openMenuFor("table-styles", anchor);
      return;
    case "cell-styles":
      openMenuFor("cell-styles", anchor);
      return;
    case "insert-cells":
      openMenuFor("insert-cells", anchor);
      return;
    case "delete-cells":
      openMenuFor("delete-cells", anchor);
      return;
    case "format-cells-menu":
      openMenuFor("format-cells-menu", anchor);
      return;
    case "autosum":
      autoSum("SUM");
      return;
    case "fill":
      openMenuFor("fill-menu", anchor);
      return;
    case "clear":
      openMenuFor("clear-menu", anchor);
      return;
    case "sort-filter":
      openMenuFor("sort-filter", anchor);
      return;
    case "find-select":
      openMenuFor("find-select", anchor);
      return;
    case "insert-function":
      openInsertFunctionDialog();
      return;
    case "name-manager":
      openNameManager();
      return;
    case "define-name":
      defineNameDialog();
      return;
    case "use-formula":
      openMenuFor("use-formula", anchor);
      return;
    case "create-from-selection":
      defineNameDialog();
      return;
    case "trace-precedents": {
      const cell = getActiveCell();
      if (!cell?.raw.startsWith("=")) {
        setStatus("The active cell has no formula");
        return;
      }
      const refs = scanRefs(cell.raw);
      grid.flashRanges(refs.map(ref => ref.address));
      setStatus(`Traced ${refs.length} precedent${refs.length === 1 ? "" : "s"}`);
      return;
    }
    case "trace-dependents":
      placeholder("Trace Dependents");
      return;
    case "remove-arrows":
      setStatus("Trace arrows removed");
      return;
    case "show-formulas":
      grid.setShowFormulas(!grid.showFormulas);
      refreshRibbon();
      setStatus(grid.showFormulas ? "Showing formulas" : "Showing values");
      return;
    case "error-checking":
      checkErrors();
      return;
    case "evaluate-formula": {
      const cell = getActiveCell();
      if (!cell?.raw.startsWith("=")) {
        setStatus("The active cell has no formula");
        return;
      }
      const value = engine.scalarAt(getSheet(), grid.activeCell.r, grid.activeCell.c);
      openDialog({
        title: "Evaluate Formula",
        width: 460,
        body: `<p class="gc-code">${esc(cell.raw)}</p><p class="gc-dialog-text">Current result: <strong>${esc(
          formatScalar(value, cell.style)
        )}</strong></p>`,
        footer: `<button class="gc-btn gc-btn--primary" data-close type="button">Close</button>`,
        onMount: (root, close) => root.querySelector("[data-close]")?.addEventListener("click", close)
      });
      return;
    }
    case "calc-options":
      openMenuFor("calc-options", anchor);
      return;
    case "calculate-now":
    case "calculate-sheet":
      engine.invalidate();
      grid.render();
      setStatus("Workbook calculated");
      return;
    case "fn-financial":
    case "fn-logical":
    case "fn-text":
    case "fn-date":
    case "fn-lookup":
    case "fn-math":
    case "fn-more":
      openMenuFor(command, anchor);
      return;
    case "insert-chart-column":
    case "insert-chart-bar":
    case "insert-chart-line":
    case "insert-chart-pie":
    case "insert-chart-area":
    case "insert-chart-scatter":
      insertChartOfType(command.replace("insert-chart-", "") as ChartType);
      return;
    case "insert-chart-more":
      openMenuFor("chart-types", anchor);
      return;
    case "sparkline-line":
      insertSparkline("line");
      return;
    case "sparkline-column":
      insertSparkline("column");
      return;
    case "insert-table":
      formatAsTable("teal");
      return;
    case "pivot-table":
      createPivotTable();
      return;
    case "insert-picture":
    case "insert-shape":
    case "insert-textbox":
    case "insert-header-footer":
    case "insert-symbol":
      placeholder("Insert " + command.replace("insert-", ""));
      return;
    case "table-name": {
      const table = activeTable();
      if (!table) return;
      promptDialog("Table Name", "Name", table.name, value => {
        if (!value.trim()) return;
        pushHistory();
        table.name = value.trim();
        afterMutation("Table renamed");
      });
      return;
    }
    case "resize-table": {
      const table = activeTable();
      if (!table) return;
      pushHistory();
      table.range = rectToRange(currentRegion(grid.selectionRect()));
      afterMutation("Table resized");
      return;
    }
    case "summarize-pivot":
      createPivotTable();
      return;
    case "convert-to-range":
      convertTableToRange();
      return;
    case "table-style-teal":
    case "table-style-green":
    case "table-style-blue":
    case "table-style-orange":
    case "table-style-gray":
      tableStyle(command.replace("table-style-", "") as TableStyleId);
      return;
    case "switch-rows":
      placeholder("Switch Row/Column");
      return;
    case "select-data":
      promptDialog(
        "Select Data",
        "Data range",
        grid.selectedChartSpec()?.series[0]?.range ?? selectionAddress(),
        value => {
          const chart = grid.selectedChartSpec();
          if (!chart) return;
          updateSelectedChart({ categories: value });
        }
      );
      return;
    case "add-chart-element":
      openMenuFor("chart-elements", anchor);
      return;
    case "change-chart-type":
      openMenuFor("chart-types", anchor);
      return;
    case "quick-layout":
      openMenuFor("chart-layouts", anchor);
      return;
    case "format-pane":
      chartPaneOpen = !chartPaneOpen;
      renderPane(true);
      return;
    case "chart-title": {
      const chart = grid.selectedChartSpec();
      if (!chart) return;
      promptDialog("Chart Title", "Title", chart.title, value => updateSelectedChart({ title: value }));
      return;
    }
    case "delete-chart":
      deleteSelectedChart();
      return;
    case "chart-palette-office":
    case "chart-palette-teal":
    case "chart-palette-warm":
    case "chart-palette-cool":
    case "chart-palette-vivid":
      updateSelectedChart({ palette: command.replace("chart-palette-", "") });
      return;
    case "get-data":
    case "margins":
    case "print-area":
    case "page-breaks":
      openMenuFor(command, anchor);
      return;
    case "filter-toggle":
      toggleFilter();
      return;
    case "clear-filter":
      clearTableFilter();
      return;
    case "reapply-filter":
      setStatus("Filters reapplied");
      return;
    case "sort":
      openMenuFor("sort-menu", anchor);
      return;
    case "sort-asc":
      sortTable(activeTable() ? tableRect(activeTable()!) : grid.selectionRect(), grid.activeCell.c, true);
      return;
    case "sort-desc":
      sortTable(activeTable() ? tableRect(activeTable()!) : grid.selectionRect(), grid.activeCell.c, false);
      return;
    case "text-columns":
    case "flash-fill":
    case "remove-duplicates":
    case "data-validation":
    case "consolidate":
    case "relationships":
    case "group":
    case "ungroup":
    case "subtotal":
      placeholder(command.replace(/-/g, " "));
      return;
    case "refresh-pivot":
      if (getSheet().pivot) {
        pushHistory();
        applyPivot(getSheet(), engine);
        afterMutation("PivotTable refreshed");
      }
      return;
    case "refresh-all":
      setStatus("All data refreshed");
      return;
    case "change-source":
    case "pivot-options":
    case "pivot-name":
    case "insert-slicer":
    case "insert-timeline":
    case "pivot-field-headers":
      placeholder("PivotTable option");
      return;
    case "pivot-field-list":
      pivotPaneOpen = !pivotPaneOpen;
      renderPane(true);
      return;
    case "pivot-grand-totals":
      openMenuFor("grand-totals", anchor);
      return;
    case "pivot-layout":
      openMenuFor("pivot-layout", anchor);
      return;
    case "show-values-as":
      openMenuFor("show-values", anchor);
      return;
    case "show-comments":
      openCommentDialog();
      return;
    case "new-comment":
      openCommentDialog();
      return;
    case "delete-comment": {
      const point = grid.activeCell;
      const cell = getSheet().cells[cellKey(point.r, point.c)];
      if (!cell?.comment) {
        setStatus("The active cell has no comment");
        return;
      }
      pushHistory();
      delete cell.comment;
      afterMutation("Comment deleted");
      return;
    }
    case "prev-comment":
    case "next-comment":
    case "spelling":
    case "thesaurus":
    case "protect-sheet":
    case "protect-workbook":
    case "allow-edit-ranges":
    case "share-workbook":
      placeholder(command.replace(/-/g, " "));
      return;
    case "view-normal":
    case "view-page-break":
    case "view-page-layout":
      setStatus(command === "view-normal" ? "Normal view" : "Print layout preview");
      return;
    case "toggle-ruler":
      placeholder("Ruler");
      return;
    case "toggle-gridlines":
      grid.setShowGridlines(!grid.showGridlines);
      refreshRibbon();
      return;
    case "toggle-headings":
      grid.setShowHeadings(!grid.showHeadings);
      refreshRibbon();
      return;
    case "toggle-formula-bar":
      showFormulaBar = !showFormulaBar;
      formulaBar.hidden = !showFormulaBar;
      refreshRibbon();
      return;
    case "zoom":
      openMenuFor("zoom-menu", anchor);
      return;
    case "zoom-in":
      setZoom(grid.getZoom() * 100 + 10);
      return;
    case "zoom-out":
      setZoom(grid.getZoom() * 100 - 10);
      return;
    case "zoom-100":
      setZoom(100);
      return;
    case "zoom-selection":
      setZoom(120);
      return;
    case "new-window":
      window.open(window.location.href, "_blank");
      return;
    case "arrange-all":
    case "split":
    case "hide-window":
    case "unhide-window":
      placeholder(command.replace(/-/g, " "));
      return;
    case "freeze-panes":
      openMenuFor("freeze-panes", anchor);
      return;
    case "macros":
    case "record-macro":
    case "script-editor":
    case "run-script":
      placeholder("Macro scripting");
      return;
    case "ai-assistant":
      openDialog({
        title: "GridCraft AI",
        width: 480,
        body: `<p class="gc-dialog-text">The real GridCraft exposes every ribbon command to AI agents over MCP and a CLI. This browser workbench keeps the spreadsheet workflow local — no agent connection is configured.</p>`,
        footer: `<button class="gc-btn gc-btn--primary" data-close type="button">Close</button>`,
        onMount: (root, close) => root.querySelector("[data-close]")?.addEventListener("click", close)
      });
      return;
    case "analyze-data":
      setStatus("Analyze Data is not available in this demo");
      return;
    case "mcp-server":
    case "cli":
      placeholder(command === "mcp-server" ? "MCP server" : "CLI");
      return;
    case "arrange-forward":
    case "arrange-backward":
    case "arrange-pane":
    case "draw-pen":
    case "draw-highlighter":
    case "draw-eraser":
    case "draw-ruler":
    case "ink-shape":
    case "ink-math":
    case "ink-replay":
    case "draw-close":
    case "scale-width":
    case "scale-height":
    case "scale-percent":
    case "page-background":
    case "print-titles":
    case "normal":
      placeholder("Drawing and print layout tools");
      return;
    default:
      setStatus(`Unknown command: ${command}`);
  }
}

function checkErrors(): void {
  const sheet = getSheet();
  let count = 0;
  for (let r = 0; r < 60; r += 1) {
    for (let c = 0; c < 26; c += 1) {
      const value = engine.scalarAt(sheet, r, c);
      if (isError(value)) count += 1;
    }
  }
  setStatus(count ? `${count} error${count === 1 ? "" : "s"} found in this sheet` : "No errors found in this sheet");
}

/* ------------------------------------------------------------- event wiring */

tabsEl.addEventListener("click", event => {
  const tab = (event.target as HTMLElement).closest<HTMLElement>("[data-tab]");
  if (!tab) return;
  activeTab = (tab.dataset.tab ?? "home") as RibbonTabId;
  contextSignature = "";
  renderRibbonChrome();
});

ribbonBody.addEventListener("click", event => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const caret = target.closest<HTMLElement>("[data-menu-caret]");
  const button = target.closest<HTMLElement>("[data-cmd],[data-menu]");
  if (!button) return;
  if (caret) {
    const menuId = button.dataset.menu ?? button.dataset.cmd;
    if (menuId) openMenuFor(menuId, button);
    return;
  }
  if (!button.dataset.cmd && button.dataset.menu) {
    openMenuFor(button.dataset.menu, button);
    return;
  }
  if (button.dataset.cmd) runCommand(button.dataset.cmd, button);
});

ribbonBody.addEventListener("change", event => {
  const target = event.target as HTMLElement;
  if (!(target instanceof HTMLSelectElement)) return;
  if (target.dataset.select === "font-name") applyStyle({ font: target.value });
  else if (target.dataset.select === "num-format") applyNumberFormat(target.value as NumFmt);
  else if (target.dataset.select === "font-size") applyStyle({ size: Number(target.value) });
});

ribbonBody.addEventListener("input", event => {
  const target = event.target as HTMLElement;
  if (target instanceof HTMLInputElement && target.dataset.select === "font-size") {
    const size = Number(target.value);
    if (Number.isFinite(size) && size >= 6 && size <= 72) applyStyle({ size });
  }
});

ribbonBody.addEventListener("click", event => {
  event.stopPropagation();
  const target = event.target as HTMLInputElement;
  if (target instanceof HTMLInputElement && target.type === "checkbox" && target.dataset.toggle) {
    if (target.dataset.toggle === "gridlines") grid.setShowGridlines(target.checked);
    else if (target.dataset.toggle === "headings") grid.setShowHeadings(target.checked);
    else if (target.dataset.toggle.startsWith("table-")) {
      const key = target.dataset.toggle.replace("table-", "") as "header" | "totals" | "banded" | "filter";
      setTableOption(key, target.checked);
    }
    refreshRibbon();
  }
});

/* top bar / view buttons / zoom */

document.addEventListener("click", event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cmd]");
  if (!target || !target.isConnected) return;
  if (target.closest("#gc-ribbon-body") || target.closest(".gc-ribbon-tabs") || target.closest(".gc-ribbon")) return;
  event.preventDefault();
  runCommand(target.dataset.cmd ?? "", target);
});

zoomSlider.addEventListener("input", () => setZoom(Number(zoomSlider.value)));

formulaInput.addEventListener("focus", () => {
  if (!grid.isEditing()) beginFormulaEdit();
});
formulaInput.addEventListener("input", () => {
  if (!grid.isEditing()) beginFormulaEdit();
  grid.updateEditText(formulaInput.value);
});
formulaInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    commitFormula();
  } else if (event.key === "Tab") {
    event.preventDefault();
    commitFormula();
  } else if (event.key === "Escape") {
    event.preventDefault();
    cancelFormula();
  }
});

q<HTMLButtonElement>("#gc-fb-cancel").addEventListener("click", () => cancelFormula());
q<HTMLButtonElement>("#gc-fb-enter").addEventListener("click", () => commitFormula());
q<HTMLButtonElement>("#gc-formula-caret").addEventListener("click", event => {
  openMenuAt(event.currentTarget as HTMLElement, [
    { label: "Show Formulas", checked: grid.showFormulas, action: () => runCommand("show-formulas") },
    { label: "Expand Formula Bar", checked: showFormulaBar, action: () => runCommand("toggle-formula-bar") },
    { separator: true },
    { label: "Function Library…", icon: "fx", action: () => openInsertFunctionDialog() }
  ]);
});

nameBox.addEventListener("focus", () => nameBox.select());
nameBox.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    goToName(nameBox.value);
    viewport.focus({ preventScroll: true });
  } else if (event.key === "Escape") {
    syncFormula();
    viewport.focus({ preventScroll: true });
  }
});
q<HTMLButtonElement>("#gc-name-caret").addEventListener("click", event => {
  openMenuFor("name-box", event.currentTarget as HTMLElement);
});

/* ---------------------------------------------------------------- keyboard */

document.addEventListener("keydown", event => {
  if (isDialogOpen()) return;
  const target = event.target as HTMLElement;
  if (target.closest("#gc-formula-input") || target === nameBox) return;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
    return;
  if (grid.isEditing()) return;
  const ctrl = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  if (ctrl) {
    if (key === "z") {
      event.preventDefault();
      undo();
      return;
    }
    if (key === "y") {
      event.preventDefault();
      redo();
      return;
    }
    if (key === "s") {
      event.preventDefault();
      saveWorkbook(false);
      return;
    }
    if (key === "f") {
      event.preventDefault();
      openFindDialog();
      return;
    }
    if (key === "1") {
      event.preventDefault();
      openFormatCellsDialog();
      return;
    }
    if (key === "b") {
      event.preventDefault();
      toggleStyle("bold");
      return;
    }
    if (key === "i") {
      event.preventDefault();
      toggleStyle("italic");
      return;
    }
    if (key === "u") {
      event.preventDefault();
      toggleStyle("underline");
      return;
    }
    if (key === "c") {
      event.preventDefault();
      copySelection(false);
      return;
    }
    if (key === "x") {
      event.preventDefault();
      copySelection(true);
      return;
    }
    if (key === "v") {
      event.preventDefault();
      pasteClipboard(false);
      return;
    }
    if (key === "a") {
      event.preventDefault();
      grid.selectAll();
      return;
    }
    if (event.shiftKey && key === "l") {
      event.preventDefault();
      toggleFilter();
      return;
    }
  }
  if (event.key === "Escape") {
    closeMenus();
    if (grid.selectedChartId()) grid.deselectChart();
    return;
  }
  if (grid.handleKey(event)) event.preventDefault();
});

/* ------------------------------------------------------------------ render */

function renderEverything(): void {
  renderSheetTabs();
  refreshRibbon();
  syncSelectionUI();
  renderPane(true);
  updateHistoryButtons();
  updateDocTitle();
  q<HTMLButtonElement>("#gc-autosave").classList.toggle("is-on", workbook.autosave);
  q<HTMLButtonElement>("#gc-autosave").setAttribute("aria-checked", String(workbook.autosave));
  zoomSlider.value = String(Math.round(grid.getZoom() * 100));
  zoomLabel.textContent = `${Math.round(grid.getZoom() * 100)}%`;
}

renderEverything();
grid.scrollToActive();
viewport.focus({ preventScroll: true });
window.setTimeout(() => setStatus("Ready", 0), 200);

window.addEventListener("beforeunload", () => {
  if (workbook.autosave) saveWorkbook(true);
});
