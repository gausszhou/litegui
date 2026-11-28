/**
 * GridCraft workbook model.
 *
 * The workbook is intentionally made of plain JSON-friendly objects so that
 * snapshots for undo/redo, autosave and tests can simply use structuredClone.
 * Cells are keyed by canonical A1 addresses; column widths and row heights are
 * sparse records keyed by zero-based index.
 */

export const COLS = 26;
export const ROWS = 60;
export const ROW_HEADER_WIDTH = 42;
export const COL_HEADER_HEIGHT = 21;
export const DEFAULT_COL_WIDTH = 86;
export const DEFAULT_ROW_HEIGHT = 21;

export type NumFmt = "general" | "number" | "currency" | "percent" | "comma" | "text";
export type HAlign = "left" | "center" | "right";
export type VAlign = "top" | "middle" | "bottom";

export interface CellBorders {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  align?: HAlign;
  valign?: VAlign;
  font?: string;
  size?: number;
  color?: string;
  fill?: string;
  numFmt?: NumFmt;
  decimals?: number;
  wrap?: boolean;
  indent?: number;
  border?: CellBorders;
}

export type SparklineKind = "line" | "column";

export interface Sparkline {
  range: string;
  kind: SparklineKind;
  color: string;
}

export interface Cell {
  raw: string;
  style?: CellStyle;
  comment?: string;
  sparkline?: Sparkline;
}

export interface MergeRange {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

export type CondRuleType = "colorScale" | "dataBar" | "iconSet" | "greater" | "less" | "equal" | "between";

export interface CondRule {
  id: string;
  range: string;
  type: CondRuleType;
  /** Primary color for bars / icon variants / highlight rules. */
  color?: string;
  /** Numeric threshold for greater / less / equal / between. */
  value?: number;
  value2?: number;
  text?: string;
  scale?: { min: string; mid: string; max: string };
}

export type TableStyleId = "teal" | "green" | "blue" | "orange" | "gray" | "custom";

export interface TableFilter {
  col: number;
  values: string[];
}

export interface TableSpec {
  id: string;
  name: string;
  range: string;
  style: TableStyleId;
  header: boolean;
  banded: boolean;
  totals: boolean;
  filter: boolean;
  firstColumn?: boolean;
  lastColumn?: boolean;
  filterState?: TableFilter | null;
}

export type ChartType = "column" | "bar" | "line" | "pie" | "doughnut" | "area" | "scatter";
export type LegendPosition = "right" | "bottom" | "top" | "none";

export interface ChartSeries {
  name: string;
  range: string;
}

export interface ChartSpec {
  id: string;
  type: ChartType;
  title: string;
  categories: string;
  series: ChartSeries[];
  x: number;
  y: number;
  w: number;
  h: number;
  legend: LegendPosition;
  palette: string;
  dataLabels: boolean;
  gridlines: boolean;
  /** Horizontal charts can be flipped without rebuilding the series. */
  columnChart?: boolean;
}

export type PivotAgg = "sum" | "count" | "average";

export interface PivotValue {
  field: string;
  agg: PivotAgg;
}

export interface PivotConfig {
  source: string;
  filters: Record<string, string | null>;
  rows: string[];
  cols: string[];
  values: PivotValue[];
  layout: "compact" | "tabular" | "outline";
  grandTotals: boolean;
}

export interface FreezePanes {
  rows: number;
  cols: number;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  colWidths: Record<number, number>;
  rowHeights: Record<number, number>;
  merges: MergeRange[];
  condRules: CondRule[];
  tables: TableSpec[];
  charts: ChartSpec[];
  freeze: FreezePanes;
  pivot?: PivotConfig;
  pivotCells?: string[];
  tabColor?: string;
}

export interface Workbook {
  title: string;
  sheets: Sheet[];
  active: number;
  names: Record<string, string>;
  autosave: boolean;
  file: string;
}

export interface Point {
  r: number;
  c: number;
}

export interface Rect {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

/* ------------------------------------------------------------------ addresses */

export function colName(index: number): string {
  let value = index;
  let name = "";
  do {
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return name;
}

export function colIndex(name: string): number {
  const upper = name.replace(/\$/g, "").toUpperCase();
  let value = 0;
  for (const char of upper) value = value * 26 + (char.charCodeAt(0) - 64);
  return value - 1;
}

export function cellKey(r: number, c: number): string {
  return `${colName(c)}${r + 1}`;
}

export function parseAddress(address: string): Point | null {
  const match = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(address.trim());
  if (!match) return null;
  return { r: Number(match[2]) - 1, c: colIndex(match[1]) };
}

export function parseRect(range: string): Rect | null {
  const [start, end] = range.split(":");
  const a = parseAddress(start);
  if (!a) return null;
  const b = end ? parseAddress(end) : a;
  if (!b) return null;
  return {
    r1: Math.min(a.r, b.r),
    c1: Math.min(a.c, b.c),
    r2: Math.max(a.r, b.r),
    c2: Math.max(a.c, b.c)
  };
}

export function rectToRange(rect: Rect): string {
  return `${cellKey(rect.r1, rect.c1)}:${cellKey(rect.r2, rect.c2)}`;
}

export function rangeLabel(rect: Rect): string {
  if (rect.r1 === rect.r2 && rect.c1 === rect.c2) return cellKey(rect.r1, rect.c1);
  if (rect.r1 === 0 && rect.r2 === ROWS - 1) {
    return `${colName(rect.c1)}:${colName(rect.c2)}`;
  }
  if (rect.c1 === 0 && rect.c2 === COLS - 1) {
    return `${rect.r1 + 1}:${rect.r2 + 1}`;
  }
  return `${cellKey(rect.r1, rect.c1)}:${cellKey(rect.r2, rect.c2)}`;
}

export function normalizeRect(rect: Rect): Rect {
  return {
    r1: Math.min(rect.r1, rect.r2),
    c1: Math.min(rect.c1, rect.c2),
    r2: Math.max(rect.r1, rect.r2),
    c2: Math.max(rect.c1, rect.c2)
  };
}

export function inRect(rect: Rect, r: number, c: number): boolean {
  return r >= rect.r1 && r <= rect.r2 && c >= rect.c1 && c <= rect.c2;
}

export function cellAt(sheet: Sheet, r: number, c: number): Cell | undefined {
  return sheet.cells[cellKey(r, c)];
}

export function ensureCell(sheet: Sheet, r: number, c: number): Cell {
  const key = cellKey(r, c);
  let cell = sheet.cells[key];
  if (!cell) {
    cell = { raw: "" };
    sheet.cells[key] = cell;
  }
  return cell;
}

export function removeCell(sheet: Sheet, r: number, c: number): void {
  delete sheet.cells[cellKey(r, c)];
}

export function isBlank(value: string | number | boolean | null | undefined): boolean {
  return value === undefined || value === null || value === "";
}

/* ------------------------------------------------------------------ sheets */

export function createSheet(id: string, name: string): Sheet {
  return {
    id,
    name,
    cells: {},
    colWidths: {},
    rowHeights: {},
    merges: [],
    condRules: [],
    tables: [],
    charts: [],
    freeze: { rows: 0, cols: 0 }
  };
}

export function activeSheet(wb: Workbook): Sheet {
  return wb.sheets[wb.active] ?? wb.sheets[0];
}

export function sheetById(wb: Workbook, id: string): Sheet | undefined {
  return wb.sheets.find(sheet => sheet.id === id);
}

export function sheetByName(wb: Workbook, name: string): Sheet | undefined {
  const lower = name.toLowerCase();
  return wb.sheets.find(sheet => sheet.name.toLowerCase() === lower);
}

export function cloneWorkbook(wb: Workbook): Workbook {
  return structuredClone(wb);
}

export function findMerge(sheet: Sheet, r: number, c: number): MergeRange | undefined {
  return sheet.merges.find(merge => r >= merge.r1 && r <= merge.r2 && c >= merge.c1 && c <= merge.c2);
}

export function mergeAnchor(sheet: Sheet, r: number, c: number): MergeRange | undefined {
  return sheet.merges.find(merge => merge.r1 === r && merge.c1 === c);
}

export function mergeContains(sheet: Sheet, r: number, c: number): boolean {
  return sheet.merges.some(merge => r >= merge.r1 && r <= merge.r2 && c >= merge.c1 && c <= merge.c2);
}

/* ------------------------------------------------------------------ tables */

export function tableAt(sheet: Sheet, r: number, c: number): TableSpec | undefined {
  return sheet.tables.find(table => {
    const rect = parseRect(table.range);
    return rect ? inRect(rect, r, c) : false;
  });
}

export function tableRect(table: TableSpec): Rect {
  return parseRect(table.range) ?? { r1: 0, c1: 0, r2: 0, c2: 0 };
}

export const TABLE_STYLES: Record<TableStyleId, { header: string; band: string; accent: string; border: string }> = {
  teal: { header: "#0e6b5c", band: "#eff7f5", accent: "#0e6b5c", border: "#c9dfda" },
  green: { header: "#217346", band: "#eef7f1", accent: "#217346", border: "#c9e2d2" },
  blue: { header: "#4472c4", band: "#eef3fb", accent: "#4472c4", border: "#cfdcf2" },
  orange: { header: "#c55a11", band: "#fdf2ea", accent: "#c55a11", border: "#f2d5c0" },
  gray: { header: "#595959", band: "#f4f4f4", accent: "#595959", border: "#dddddd" },
  custom: { header: "#0e6b5c", band: "#eff7f5", accent: "#0e6b5c", border: "#c9dfda" }
};

/* ------------------------------------------------------------------ defaults */

export const CHART_PALETTES: Record<string, string[]> = {
  office: ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5", "#70ad47", "#264478", "#9e480e"],
  teal: ["#0e6b5c", "#3f9c8a", "#7cbcae", "#c2ded8", "#1a8a9e", "#5fb3c4", "#0b4f45", "#87c9bd"],
  warm: ["#c55a11", "#ed7d31", "#ffc000", "#f4b183", "#a5a5a5", "#7f6000", "#833c0b", "#d9a26a"],
  cool: ["#2f5597", "#4472c4", "#5b9bd5", "#8faadc", "#1f3864", "#4472c4", "#9dc3e6", "#2e75b6"],
  vivid: ["#264478", "#70ad47", "#2e75b6", "#ed7d31", "#7030a0", "#00b0f0", "#ffc000", "#a5a5a5"]
};

export const MAIN_COLORS = {
  accent: "#0e6b5c",
  accentSoft: "#e4f1ee",
  accentLine: "#0e6b5c",
  green: "#107c41",
  red: "#c0392b",
  yellow: "#b8860b",
  grid: "#dedede",
  headerText: "#3b3a39"
};
