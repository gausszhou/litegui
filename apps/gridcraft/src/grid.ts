/** Virtual worksheet view: headers, cells, selection, editing, charts and fill. */

import { renderChartSvg, resolveChartData } from "./charts";
import { formatScalar } from "./format";
import { adjustFormula, CalcEngine, isError, type Scalar } from "./formula";
import { icon } from "./icons";
import {
  COL_HEADER_HEIGHT,
  COLS,
  DEFAULT_COL_WIDTH,
  DEFAULT_ROW_HEIGHT,
  ROWS,
  ROW_HEADER_WIDTH,
  cellKey,
  colName,
  findMerge,
  inRect,
  normalizeRect,
  parseRect,
  rangeLabel,
  tableAt,
  TABLE_STYLES,
  type Cell,
  type ChartSpec,
  type CondRule,
  type MergeRange,
  type Point,
  type Rect,
  type Sheet,
  type Workbook
} from "./model";

export type EditDirection = "down" | "up" | "right" | "left" | "none";

export type GridTarget =
  | { kind: "cell"; r: number; c: number }
  | { kind: "row"; r: number }
  | { kind: "col"; c: number }
  | { kind: "chart"; id: string }
  | { kind: "corner" };

export interface GridContext {
  getWorkbook(): Workbook;
  getSheet(): Sheet;
  getEngine(): CalcEngine;
  onSelectionChange(): void;
  onEditStart(address: string, text: string): void;
  onEditInput(text: string): void;
  onEditEnd(): void;
  onCommit(ref: string, text: string, direction: EditDirection): void;
  onBeforeMutate(): void;
  onChanged(reason: string): void;
  onChartSelect(id: string | null): void;
  onFilterRequest(tableId: string, column: number, anchor: HTMLElement): void;
  onContextMenu(event: MouseEvent, target: GridTarget): void;
  onStatus(text: string): void;
  onCommand(name: string): void;
}

export interface Layout {
  widths: number[];
  heights: number[];
  colLeft: number[];
  rowTop: number[];
  headerW: number;
  headerH: number;
  hiddenRows: Set<number>;
}

type Drag =
  | { mode: "select"; pointerId: number }
  | { mode: "col"; pointerId: number; textPointer: boolean }
  | { mode: "row"; pointerId: number }
  | { mode: "col-resize"; pointerId: number; c: number; startX: number; startWidth: number; guide: HTMLElement }
  | { mode: "row-resize"; pointerId: number; r: number; startY: number; startHeight: number; guide: HTMLElement }
  | {
      mode: "fill";
      pointerId: number;
      source: Rect;
      preview: HTMLElement;
    }
  | {
      mode: "chart-move";
      pointerId: number;
      chart: ChartSpec;
      startX: number;
      startY: number;
      x: number;
      y: number;
      element: HTMLElement;
      moved: boolean;
    }
  | {
      mode: "chart-resize";
      pointerId: number;
      chart: ChartSpec;
      handle: string;
      startX: number;
      startY: number;
      x: number;
      y: number;
      w: number;
      h: number;
      element: HTMLElement;
      moved: boolean;
    };

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map(char => char + char)
          .join("")
      : clean;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}

function scaleColor(colors: { min: string; mid: string; max: string }, t: number): string {
  if (t <= 0.5) return lerpColor(colors.min, colors.mid, t / 0.5);
  return lerpColor(colors.mid, colors.max, (t - 0.5) / 0.5);
}

export class GridView {
  private sheetEl: HTMLElement | null = null;
  private selectionEl: HTMLElement | null = null;
  private layout: Layout | null = null;
  private selection: { anchor: Point; focus: Point } = { anchor: { r: 0, c: 0 }, focus: { r: 0, c: 0 } };
  private selectedChart: string | null = null;
  private drag: Drag | null = null;
  private editing: { ref: string; input: HTMLInputElement; original: string } | null = null;
  private zoom = 1;
  showFormulas = false;
  showGridlines = true;
  showHeadings = true;

  constructor(private readonly viewport: HTMLElement, private readonly ctx: GridContext) {
    this.viewport.addEventListener("pointerdown", this.handlePointerDown);
    this.viewport.addEventListener("dblclick", this.handleDoubleClick);
    this.viewport.addEventListener("contextmenu", this.handleContextMenu);
    this.viewport.addEventListener("click", this.handleClick);
  }

  /* ---------------------------------------------------------------- layout */

  private buildLayout(): Layout {
    const sheet = this.ctx.getSheet();
    const hiddenRows = this.hiddenRows(sheet);
    const widths: number[] = [];
    const heights: number[] = [];
    const colLeft: number[] = [];
    const rowTop: number[] = [];
    const headerW = this.showHeadings ? Math.round(ROW_HEADER_WIDTH * this.zoom) : 0;
    const headerH = this.showHeadings ? Math.round(COL_HEADER_HEIGHT * this.zoom) : 0;
    let left = headerW;
    let top = headerH;
    for (let c = 0; c < COLS; c += 1) {
      const width = Math.max(24, Math.round((sheet.colWidths[c] ?? DEFAULT_COL_WIDTH) * this.zoom));
      widths.push(width);
      colLeft.push(left);
      left += width;
    }
    for (let r = 0; r < ROWS; r += 1) {
      const height = hiddenRows.has(r)
        ? 0
        : Math.max(14, Math.round((sheet.rowHeights[r] ?? DEFAULT_ROW_HEIGHT) * this.zoom));
      heights.push(height);
      rowTop.push(top);
      top += height;
    }
    return { widths, heights, colLeft, rowTop, headerW, headerH, hiddenRows };
  }

  private layoutNow(): Layout {
    if (!this.layout) this.layout = this.buildLayout();
    return this.layout;
  }

  private hiddenRows(sheet: Sheet): Set<number> {
    const hidden = new Set<number>();
    const engine = this.ctx.getEngine();
    for (const table of sheet.tables) {
      if (!table.filterState) continue;
      const rect = parseRect(table.range);
      if (!rect) continue;
      const visible = new Set(table.filterState.values);
      for (let r = rect.r1 + 1; r <= rect.r2; r += 1) {
        const value = formatScalar(engine.scalarAt(sheet, r, table.filterState.col), undefined);
        if (!visible.has(value)) hidden.add(r);
      }
    }
    return hidden;
  }

  private cellBox(r: number, c: number): { x: number; y: number; w: number; h: number } {
    const layout = this.layoutNow();
    const merge = findMerge(this.ctx.getSheet(), r, c);
    const r2 = merge ? merge.r2 : r;
    const c2 = merge ? merge.c2 : c;
    const x = layout.colLeft[c] ?? layout.headerW;
    const y = layout.rowTop[r] ?? layout.headerH;
    let w = 0;
    let h = 0;
    for (let cc = c; cc <= c2; cc += 1) w += layout.widths[cc] ?? 0;
    for (let rr = r; rr <= r2; rr += 1) h += layout.heights[rr] ?? 0;
    return { x, y, w: Math.max(1, w), h: Math.max(1, h) };
  }

  /* ---------------------------------------------------------------- render */

  render(): void {
    const sheet = this.ctx.getSheet();
    this.layout = this.buildLayout();
    const layout = this.layout;
    const rect = this.selectionRect();
    const selectedChart = this.selectedChart;
    const parts: string[] = [];

    if (this.showHeadings) {
      parts.push(
        `<div class="gc-corner" data-target="corner" style="position:sticky;left:0;top:0;z-index:9">${icon(
          "chevron-down",
          10
        )}</div>`
      );
      for (let c = 0; c < COLS; c += 1) {
        const active = c >= rect.c1 && c <= rect.c2;
        parts.push(
          `<div class="gc-col-header${active ? " gc-col-header--active" : ""}" data-col="${c}" style="grid-column:${
            c + 2
          };grid-row:1;position:sticky;top:0;z-index:8;width:${layout.widths[c]}px">${colName(
            c
          )}<span class="gc-col-resize" data-resize="col" data-col="${c}"></span></div>`
        );
      }
    }

    if (this.showHeadings) {
      for (let r = 0; r < ROWS; r += 1) {
        const hidden = layout.hiddenRows.has(r);
        if (hidden) continue;
        const active = r >= rect.r1 && r <= rect.r2;
        parts.push(
          `<div class="gc-row-header${
            active ? " gc-row-header--active" : ""
          }" data-row="${r}" style="grid-column:1;grid-row:${r + 2};position:sticky;left:0;z-index:7;height:${
            layout.heights[r]
          }px">${r + 1}<span class="gc-row-resize" data-resize="row" data-row="${r}"></span></div>`
        );
      }
    }

    for (let r = 0; r < ROWS; r += 1) {
      if (layout.hiddenRows.has(r)) continue;
      for (let c = 0; c < COLS; c += 1) {
        const merge = findMerge(sheet, r, c);
        if (merge && (merge.r1 !== r || merge.c1 !== c)) continue;
        const cell = sheet.cells[cellKey(r, c)];
        parts.push(this.renderCell(r, c, cell, merge));
      }
    }

    const charts = this.renderCharts(sheet, selectedChart);
    const selection = this.renderSelection(rect);
    const gridClass = `gc-sheet${this.showGridlines ? "" : " gc-sheet--no-grid"}`;
    const template = `grid-template-columns:${layout.headerW}px ${layout.widths
      .map(width => `${width}px`)
      .join(" ")};grid-template-rows:${layout.headerH}px ${layout.heights.map(height => `${height}px`).join(" ")};`;
    const width = layout.colLeft[COLS - 1] + layout.widths[COLS - 1];
    const height = layout.rowTop[ROWS - 1] + layout.heights[ROWS - 1];
    this.viewport.innerHTML = `<div class="${gridClass}" id="gc-sheet" style="${template}width:${width}px;height:${height}px;position:relative;display:grid">
      ${parts.join("")}
      ${charts}
      ${selection}
    </div>`;
    this.sheetEl = this.viewport.querySelector<HTMLElement>(".gc-sheet");
    this.selectionEl = this.sheetEl?.querySelector<HTMLElement>(".gc-selection") ?? null;
    if (this.sheetEl) this.sheetEl.style.fontSize = `${12 * this.zoom}px`;
  }

  private renderCell(r: number, c: number, cell: Cell | undefined, merge: MergeRange | undefined): string {
    const sheet = this.ctx.getSheet();
    const layout = this.layoutNow();
    const engine = this.ctx.getEngine();
    const value = engine.scalarAt(sheet, r, c);
    const style = cell?.style;
    const table = tableAt(sheet, r, c);
    const tableRect = table ? parseRect(table.range) : null;
    let fill = style?.fill ?? "";
    let color = style?.color ?? "";
    let bold = style?.bold ?? false;
    let size = style?.size ?? 12;
    let borderStyle = "";
    let filterButton = "";

    if (table && tableRect) {
      const palette = TABLE_STYLES[table.style];
      const isHeader = table.header && r === tableRect.r1;
      const isTotals = table.totals && r === tableRect.r2;
      if (isHeader) {
        fill = fill || palette.header;
        color = color || "#ffffff";
        bold = true;
        borderStyle = `border-bottom:1px solid ${palette.header};`;
        if (table.filter) {
          filterButton = `<button class="gc-filter-btn" type="button" data-table="${
            table.id
          }" data-col="${c}" title="Filter">${icon("filter", 10)}${icon("chevron-down", 9)}</button>`;
        }
      } else if (isTotals) {
        fill = fill || palette.band;
        bold = true;
      } else if (table.banded && (r - tableRect.r1) % 2 === 0) {
        fill = fill || palette.band;
      }
    }

    let iconMarkup = "";
    let barMarkup = "";
    let condFill = "";
    let condFont = "";
    for (const rule of sheet.condRules) {
      if (this.ruleCovers(rule, r, c)) {
        const result = this.conditional(rule, r, c);
        if (result.fill) condFill = result.fill;
        if (result.color) condFont = result.color;
        if (result.icon) iconMarkup = result.icon;
        if (result.bar) barMarkup = result.bar;
      }
    }
    if (condFill) fill = condFill;
    if (condFont) color = condFont;

    const selected = inRect(this.selectionRect(), r, c);
    const active = this.selection.anchor.r === r && this.selection.anchor.c === c;
    const mergeSelected = merge
      ? this.selectionRect().r1 <= merge.r2 &&
        this.selectionRect().r2 >= merge.r1 &&
        this.selectionRect().c1 <= merge.c2 &&
        this.selectionRect().c2 >= merge.c1
      : false;

    let text: string;
    let isNumeric = false;
    if (this.showFormulas && cell?.raw.startsWith("=")) {
      text = cell.raw;
    } else {
      text = formatScalar(value, style);
      isNumeric = typeof value === "number";
    }
    if (!cell && !style) text = "";

    let sparkline = "";
    if (cell?.sparkline) sparkline = this.renderSparkline(cell);

    const align = style?.align ?? (isNumeric ? "right" : typeof value === "boolean" ? "center" : "left");
    const wrap = style?.wrap ? "white-space:normal;line-height:1.15;" : "";
    const fontFamily = style?.font ? `font-family:${escapeHtml(style.font)};` : "";
    const border = style?.border
      ? `${style.border.top ? `border-top:1px solid #4a4a4a;` : ""}${
          style.border.right ? `border-right:1px solid #4a4a4a;` : ""
        }${style.border.bottom ? `border-bottom:1px solid #4a4a4a;` : ""}${
          style.border.left ? `border-left:1px solid #4a4a4a;` : ""
        }`
      : "";

    const frozenTop =
      r < (sheet.freeze?.rows ?? 0)
        ? `position:sticky;top:${layout.headerH + (layout.rowTop[r] - layout.headerH)}px;z-index:4;`
        : "";
    const frozenLeft = c < (sheet.freeze?.cols ?? 0) ? `position:sticky;left:${layout.colLeft[c]}px;z-index:4;` : "";
    const frozenPosition = frozenTop || frozenLeft ? `${frozenTop}${frozenLeft}` : "";

    const styleString = [
      `grid-column:${c + 2}${merge ? ` / span ${merge.c2 - merge.c1 + 1}` : ""};`,
      `grid-row:${r + 2}${merge ? ` / span ${merge.r2 - merge.r1 + 1}` : ""};`,
      `justify-content:${align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"};`,
      fill ? `background-color:${fill};` : "",
      color ? `color:${color};` : "",
      bold ? "font-weight:600;" : "",
      style?.italic ? "font-style:italic;" : "",
      style?.underline ? "text-decoration:underline;" : "",
      `font-size:${Math.max(8, Math.round(size * this.zoom))}px;`,
      style?.valign === "top"
        ? "align-items:flex-start;padding-top:2px;"
        : style?.valign === "bottom"
        ? "align-items:flex-end;padding-bottom:1px;"
        : "",
      fontFamily,
      wrap,
      border,
      borderStyle,
      frozenPosition
    ]
      .join("")
      .replace(/;;/g, ";");

    const valueHtml = `${iconMarkup}<span class="gc-cell-text">${escapeHtml(text)}</span>${sparkline}`;
    return `<div class="gc-cell${selected || mergeSelected ? " gc-cell--selected" : ""}${
      active ? " gc-cell--active" : ""
    }${isNumeric ? " gc-cell--number" : ""}${fill ? " gc-cell--filled" : ""}${
      filterButton ? " gc-cell--filterable" : ""
    }${freezeRowsAt(sheet, r) ? " gc-cell--frozen" : ""}" data-r="${r}" data-c="${c}" data-key="${cellKey(
      r,
      c
    )}" style="${styleString}">${barMarkup}${valueHtml}${filterButton}${
      cell?.comment ? '<span class="gc-comment-dot" title="Comment"></span>' : ""
    }</div>`;
  }

  private renderSelection(rect: Rect): string {
    const box = this.cellBox(rect.r1, rect.c1);
    const end = this.cellBox(rect.r2, rect.c2);
    const width = end.x + end.w - box.x;
    const height = end.y + end.h - box.y;
    return `<div class="gc-selection" style="left:${box.x}px;top:${box.y}px;width:${width}px;height:${height}px">
      <span class="gc-fill-handle" data-handle="fill"></span>
    </div>`;
  }

  private renderCharts(sheet: Sheet, selectedChart: string | null): string {
    if (!sheet.charts.length) return '<div class="gc-charts"></div>';
    const engine = this.ctx.getEngine();
    const layout = this.layoutNow();
    const markup = sheet.charts
      .map(chart => {
        const width = Math.round(chart.w * this.zoom);
        const height = Math.round(chart.h * this.zoom);
        const data = resolveChartData(chart, engine, sheet);
        const svg = renderChartSvg(chart, data, width, height);
        const selected = chart.id === selectedChart;
        const handles = selected
          ? ["nw", "n", "ne", "e", "se", "s", "sw", "w"]
              .map(
                handle =>
                  `<span class="gc-chart-handle gc-chart-handle--${handle}" data-chart-handle="${handle}"></span>`
              )
              .join("")
          : "";
        return `<div class="gc-chart${selected ? " gc-chart--selected" : ""}" data-chart="${chart.id}" style="left:${
          layout.headerW + Math.round(chart.x * this.zoom)
        }px;top:${layout.headerH + Math.round(chart.y * this.zoom)}px;width:${width}px;height:${height}px">
          <div class="gc-chart-card">${svg}</div>${handles}
        </div>`;
      })
      .join("");
    return `<div class="gc-charts">${markup}</div>`;
  }

  /* ---------------------------------------------------------- conditional */

  private ruleCovers(rule: CondRule, r: number, c: number): boolean {
    const rect = parseRect(rule.range);
    return rect ? inRect(rect, r, c) : false;
  }

  private ruleValues(rule: CondRule): number[] {
    const sheet = this.ctx.getSheet();
    const engine = this.ctx.getEngine();
    const rect = parseRect(rule.range);
    if (!rect) return [];
    const values: number[] = [];
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      for (let c = rect.c1; c <= rect.c2; c += 1) {
        const value = engine.numeric(sheet, r, c);
        if (value !== null) values.push(value);
      }
    }
    return values;
  }

  private conditional(
    rule: CondRule,
    r: number,
    c: number
  ): { fill?: string; color?: string; icon?: string; bar?: string } {
    const sheet = this.ctx.getSheet();
    const engine = this.ctx.getEngine();
    const value = engine.scalarAt(sheet, r, c);
    const numeric =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim() !== ""
        ? Number(value.replace(/[$,%\s]/g, ""))
        : null;
    if (rule.type === "dataBar") {
      const values = this.ruleValues(rule);
      const max = Math.max(...values, 0.0001);
      if (numeric === null) return {};
      const percent = clamp((numeric / max) * 100, 0, 100);
      return {
        bar: `<span class="gc-cell-bar" style="width:${percent}%;background:${rule.color ?? "#8fc7bd"}"></span>`
      };
    }
    if (rule.type === "iconSet") {
      const values = this.ruleValues(rule);
      if (numeric === null || values.length < 2) return {};
      const min = Math.min(...values);
      const max = Math.max(...values);
      const t = max === min ? 0.5 : (numeric - min) / (max - min);
      const iconMarkup =
        t > 0.66
          ? '<svg viewBox="0 0 12 12" width="12" height="12" class="gc-cond-icon"><path d="M6 2.4l4.2 6.2H1.8z" fill="#2e7d32"/></svg>'
          : t > 0.33
          ? '<svg viewBox="0 0 12 12" width="12" height="12" class="gc-cond-icon"><path d="M2.4 6l6.2-4.2v8.4z" fill="#d29c1d"/></svg>'
          : '<svg viewBox="0 0 12 12" width="12" height="12" class="gc-cond-icon"><path d="M6 9.6L1.8 3.4h8.4z" fill="#c0392b"/></svg>';
      return { icon: iconMarkup };
    }
    if (rule.type === "colorScale") {
      const values = this.ruleValues(rule);
      if (numeric === null || values.length < 2) return {};
      const min = Math.min(...values);
      const max = Math.max(...values);
      const t = max === min ? 0.5 : (numeric - min) / (max - min);
      const scale = rule.scale ?? { min: "#63be7b", mid: "#ffeb84", max: "#f8696b" };
      return { fill: scaleColor(scale, t) };
    }
    if (rule.type === "greater" && numeric !== null && rule.value !== undefined && numeric > rule.value) {
      return { fill: rule.color ?? "#d7ecd9" };
    }
    if (rule.type === "less" && numeric !== null && rule.value !== undefined && numeric < rule.value) {
      return { fill: rule.color ?? "#f8d7d4", color: "#9c2b23" };
    }
    if (
      rule.type === "between" &&
      numeric !== null &&
      rule.value !== undefined &&
      rule.value2 !== undefined &&
      numeric >= rule.value &&
      numeric <= rule.value2
    ) {
      return { fill: rule.color ?? "#fff0b8" };
    }
    if (rule.type === "equal") {
      const text = formatScalar(value, undefined);
      if (rule.text !== undefined && text === rule.text) return { fill: rule.color ?? "#dfeecd" };
    }
    return {};
  }

  private renderSparkline(cell: Cell): string {
    if (!cell.sparkline) return "";
    const engine = this.ctx.getEngine();
    const sheet = this.ctx.getSheet();
    const rect = parseRect(cell.sparkline.range);
    if (!rect) return "";
    const values: number[] = [];
    for (let rr = rect.r1; rr <= rect.r2; rr += 1) {
      for (let cc = rect.c1; cc <= rect.c2; cc += 1) {
        const value = engine.numeric(sheet, rr, cc);
        if (value !== null) values.push(value);
      }
    }
    if (values.length < 2) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = 92;
    const height = 16;
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * (width - 2) + 1;
      const y = height - 2 - ((value - min) / (max - min || 1)) * (height - 4);
      return { x, y };
    });
    if (cell.sparkline.kind === "column") {
      const barWidth = Math.max(1, (width - 2) / values.length - 1);
      const bars = values
        .map((value, index) => {
          const x = 1 + index * ((width - 2) / values.length);
          const barHeight = ((value - Math.min(0, min)) / (max - Math.min(0, min) || 1)) * (height - 3);
          return `<rect x="${x.toFixed(1)}" y="${(height - 2 - barHeight).toFixed(1)}" width="${barWidth.toFixed(
            1
          )}" height="${Math.max(1, barHeight).toFixed(1)}" fill="${
            cell.sparkline?.color ?? "#215c8a"
          }" opacity="0.8"/>`;
        })
        .join("");
      return `<svg class="gc-spark" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">${bars}</svg>`;
    }
    const path = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(" ");
    return `<svg class="gc-spark" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${path}" fill="none" stroke="${cell.sparkline.color}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  }

  /* ------------------------------------------------------------- selection */

  selectionRect(): Rect {
    return normalizeRect({
      r1: this.selection.anchor.r,
      c1: this.selection.anchor.c,
      r2: this.selection.focus.r,
      c2: this.selection.focus.c
    });
  }

  get activeCell(): Point {
    return this.selection.anchor;
  }

  selectionLabel(): string {
    return rangeLabel(this.selectionRect());
  }

  setSelection(rect: Rect, focus?: Point): void {
    const normalized = normalizeRect(rect);
    const anchor = { r: normalized.r1, c: normalized.c1 };
    this.selection = { anchor, focus: focus ? { ...focus } : { r: normalized.r2, c: normalized.c2 } };
    this.paint();
    this.ctx.onSelectionChange();
  }

  setActive(r: number, c: number): void {
    this.setSelection({ r1: r, c1: c, r2: r, c2: c });
    this.ensureVisible(r, c);
  }

  selectAll(): void {
    this.setSelection({ r1: 0, c1: 0, r2: ROWS - 1, c2: COLS - 1 }, { r: 0, c: 0 });
  }

  selectRow(r: number, extend = false): void {
    if (extend) this.selection.focus = { r, c: COLS - 1 };
    else this.selection = { anchor: { r, c: 0 }, focus: { r, c: COLS - 1 } };
    this.paint();
    this.ctx.onSelectionChange();
  }

  selectCol(c: number, extend = false): void {
    if (extend) this.selection = { anchor: this.selection.anchor, focus: { r: ROWS - 1, c } };
    else this.selection = { anchor: { r: 0, c }, focus: { r: ROWS - 1, c } };
    this.paint();
    this.ctx.onSelectionChange();
  }

  private paint(): void {
    if (!this.sheetEl) return;
    const rect = this.selectionRect();
    this.sheetEl.querySelectorAll<HTMLElement>(".gc-cell").forEach(element => {
      const r = Number(element.dataset.r);
      const c = Number(element.dataset.c);
      const merge = findMerge(this.ctx.getSheet(), r, c);
      const selected = merge
        ? rect.r1 <= merge.r2 && rect.r2 >= merge.r1 && rect.c1 <= merge.c2 && rect.c2 >= merge.c1
        : inRect(rect, r, c);
      element.classList.toggle("gc-cell--selected", selected);
      element.classList.toggle("gc-cell--active", this.selection.anchor.r === r && this.selection.anchor.c === c);
    });
    this.sheetEl.querySelectorAll<HTMLElement>(".gc-col-header").forEach(element => {
      const c = Number(element.dataset.col);
      element.classList.toggle("gc-col-header--active", c >= rect.c1 && c <= rect.c2);
    });
    this.sheetEl.querySelectorAll<HTMLElement>(".gc-row-header").forEach(element => {
      const r = Number(element.dataset.row);
      element.classList.toggle("gc-row-header--active", r >= rect.r1 && r <= rect.r2);
    });
    if (this.selectionEl) {
      const box = this.cellBox(rect.r1, rect.c1);
      const end = this.cellBox(rect.r2, rect.c2);
      this.selectionEl.style.left = `${box.x}px`;
      this.selectionEl.style.top = `${box.y}px`;
      this.selectionEl.style.width = `${end.x + end.w - box.x}px`;
      this.selectionEl.style.height = `${end.y + end.h - box.y}px`;
    }
  }

  private ensureVisible(r: number, c: number): void {
    const layout = this.layoutNow();
    const box = this.cellBox(r, c);
    const left = box.x;
    const right = box.x + box.w;
    const top = box.y;
    const bottom = box.y + box.h;
    const viewLeft = this.viewport.scrollLeft + layout.headerW;
    const viewTop = this.viewport.scrollTop + layout.headerH;
    const viewRight = this.viewport.scrollLeft + this.viewport.clientWidth;
    const viewBottom = this.viewport.scrollTop + this.viewport.clientHeight;
    if (left < viewLeft) this.viewport.scrollLeft = Math.max(0, left - layout.headerW);
    else if (right > viewRight) this.viewport.scrollLeft = right - this.viewport.clientWidth;
    if (top < viewTop) this.viewport.scrollTop = Math.max(0, top - layout.headerH);
    else if (bottom > viewBottom) this.viewport.scrollTop = bottom - this.viewport.clientHeight;
  }

  /* ---------------------------------------------------------------- editing */

  isEditing(): boolean {
    return this.editing !== null;
  }

  editText(): string {
    return this.editing?.input.value ?? "";
  }

  beginEdit(initial?: string, mode: "replace" | "edit" = "replace", focus = true): boolean {
    if (this.editing) {
      if (initial !== undefined) this.updateEditText(initial);
      return true;
    }
    const sheet = this.ctx.getSheet();
    const anchor = this.selection.anchor;
    const merge = findMerge(sheet, anchor.r, anchor.c);
    const r = merge?.r1 ?? anchor.r;
    const c = merge?.c1 ?? anchor.c;
    if (r >= ROWS || c >= COLS) return false;
    if (merge) this.setSelection(merge);
    const box = this.cellBox(r, c);
    const cell = sheet.cells[cellKey(r, c)];
    const original = cell?.raw ?? "";
    const value = initial ?? original;
    const input = document.createElement("input");
    input.className = "gc-cell-editor";
    input.type = "text";
    input.value = value;
    input.style.left = `${box.x}px`;
    input.style.top = `${box.y}px`;
    input.style.width = `${Math.max(box.w + 24, 90)}px`;
    input.style.height = `${box.h + 1}px`;
    input.style.fontSize = `${Math.max(8, Math.round((cell?.style?.size ?? 12) * this.zoom))}px`;
    input.style.fontWeight = cell?.style?.bold ? "600" : "400";
    input.style.textAlign =
      cell?.style?.align ?? (typeof this.ctx.getEngine().scalarAt(sheet, r, c) === "number" ? "right" : "left");
    if (!this.sheetEl) return false;
    this.sheetEl.appendChild(input);
    this.editing = { ref: cellKey(r, c), input, original };
    if (focus) {
      input.focus();
      const end = mode === "edit" ? value.length : value.length;
      input.setSelectionRange(end, end);
    }
    this.sheetEl.querySelector(".gc-selection")?.classList.add("gc-selection--editing");
    input.addEventListener("input", () => {
      this.ctx.onEditInput(input.value);
    });
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        this.commitEdit(event.shiftKey ? "up" : "down");
      } else if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        this.commitEdit(event.shiftKey ? "left" : "right");
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.cancelEdit();
      } else {
        event.stopPropagation();
      }
    });
    this.ctx.onEditStart(this.editing.ref, value);
    if (focus) this.ctx.onStatus("Edit");
    return true;
  }

  updateEditText(text: string): void {
    if (this.editing) {
      this.editing.input.value = text;
      this.editing.input.setSelectionRange(text.length, text.length);
    }
  }

  commitEdit(direction: EditDirection = "none"): void {
    if (!this.editing) return;
    const { input, ref, original } = this.editing;
    const text = input.value;
    input.remove();
    this.editing = null;
    this.sheetEl?.querySelector(".gc-selection")?.classList.remove("gc-selection--editing");
    this.ctx.onEditEnd();
    if (direction !== "none")
      this.navigate(
        direction === "down" ? 1 : direction === "up" ? -1 : 0,
        direction === "right" ? 1 : direction === "left" ? -1 : 0,
        false,
        false
      );
    this.ctx.onSelectionChange();
    if (text !== original) {
      this.ctx.onCommit(ref, text, direction);
    } else {
      this.render();
      this.ensureVisible(this.selection.anchor.r, this.selection.anchor.c);
    }
    this.ctx.onStatus("Ready");
  }

  cancelEdit(): void {
    if (!this.editing) return;
    this.editing.input.remove();
    this.editing = null;
    this.ctx.onEditEnd();
    this.ctx.onStatus("Ready");
    this.render();
  }

  /* --------------------------------------------------------------- keyboard */

  handleKey(event: KeyboardEvent): boolean {
    if (this.editing) return false;
    if (this.selectedChart) {
      if (event.key === "Escape") {
        this.setSelectedChart(null);
        return true;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        this.ctx.onCommand("delete-chart");
        return true;
      }
      return false;
    }
    const key = event.key;
    const extend = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;
    if (key.startsWith("Arrow")) {
      event.preventDefault();
      let dr = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
      let dc = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
      if (ctrl) {
        const jump = this.jumpTarget(dr, dc);
        dr = jump.r - this.selection.anchor.r;
        dc = jump.c - this.selection.anchor.c;
      }
      this.navigate(dr, dc, extend, true);
      return true;
    }
    if (key === "Tab") {
      event.preventDefault();
      this.navigate(0, extend ? -1 : 1, false, true);
      return true;
    }
    if (key === "Enter") {
      event.preventDefault();
      this.navigate(extend ? -1 : 1, 0, false, true);
      return true;
    }
    if (key === "PageDown" || key === "PageUp") {
      event.preventDefault();
      this.navigate(key === "PageDown" ? 18 : -18, 0, extend, true);
      return true;
    }
    if (key === "Home") {
      event.preventDefault();
      if (ctrl) this.setActive(0, 0);
      else this.setActive(this.selection.anchor.r, 0);
      return true;
    }
    if (key === "End") {
      event.preventDefault();
      if (ctrl) {
        const last = this.lastUsedCell();
        this.setActive(last.r, last.c);
      } else {
        this.setActive(this.selection.anchor.r, COLS - 1);
      }
      return true;
    }
    if (key === "F2") {
      event.preventDefault();
      this.beginEdit(undefined, "edit");
      return true;
    }
    if (key === "Delete" || key === "Backspace") {
      event.preventDefault();
      this.ctx.onCommand("clear-contents");
      return true;
    }
    if (key.length === 1 && !ctrl && !event.altKey) {
      this.beginEdit(key, "replace");
      return true;
    }
    return false;
  }

  private jumpTarget(dr: number, dc: number): Point {
    const sheet = this.ctx.getSheet();
    let { r, c } = this.selection.anchor;
    const filled = (rr: number, cc: number) => (sheet.cells[cellKey(rr, cc)]?.raw ?? "") !== "";
    const inside = (rr: number, cc: number) => rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS;
    if (!inside(r, c)) return { r, c };
    let moved = false;
    while (inside(r + dr, c + dc) && (filled(r + dr, c + dc) || filled(r, c))) {
      r += dr;
      c += dc;
      moved = true;
    }
    if (!moved) return { r, c };
    if (!filled(r, c)) {
      r -= dr;
      c -= dc;
    }
    return { r, c };
  }

  navigate(dr: number, dc: number, extend: boolean, scroll = false): void {
    const hidden = this.layoutNow().hiddenRows;
    let r = clamp(this.selection.anchor.r + dr, 0, ROWS - 1);
    let c = clamp(this.selection.anchor.c + dc, 0, COLS - 1);
    let guard = 0;
    while (hidden.has(r) && guard < ROWS) {
      r = clamp(r + Math.sign(dr || 1), 0, ROWS - 1);
      guard += 1;
    }
    if (extend) {
      this.selection.focus = { r, c };
    } else {
      this.selection = { anchor: { r, c }, focus: { r, c } };
    }
    this.paint();
    if (scroll) this.ensureVisible(r, c);
    this.ctx.onSelectionChange();
  }

  private lastUsedCell(): Point {
    const sheet = this.ctx.getSheet();
    let last = { r: 0, c: 0 };
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if ((sheet.cells[cellKey(r, c)]?.raw ?? "") !== "") last = { r, c };
      }
    }
    return last;
  }

  /* ------------------------------------------------------------- pointer */

  private cellFromPoint(clientX: number, clientY: number): Point | null {
    const element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const cell = element?.closest<HTMLElement>(".gc-cell");
    if (!cell) return null;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    if (Number.isNaN(r) || Number.isNaN(c)) return null;
    const merge = findMerge(this.ctx.getSheet(), r, c);
    return merge ? { r: merge.r1, c: merge.c1 } : { r, c };
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (this.editing && !target.closest(".gc-cell-editor")) {
      this.commitEdit("none");
    }
    const resizer = target.closest<HTMLElement>("[data-resize]");
    if (resizer) {
      event.preventDefault();
      this.startResize(resizer, event);
      return;
    }
    if (target.closest(".gc-filter-btn")) return;
    const chartHandle = target.closest<HTMLElement>("[data-chart-handle]");
    if (chartHandle) {
      const chartElement = chartHandle.closest<HTMLElement>(".gc-chart");
      const chart = this.ctx.getSheet().charts.find(entry => entry.id === chartElement?.dataset.chart);
      if (chart && chartElement) {
        event.preventDefault();
        this.drag = {
          mode: "chart-resize",
          pointerId: event.pointerId,
          chart,
          handle: chartHandle.dataset.chartHandle ?? "se",
          startX: event.clientX,
          startY: event.clientY,
          x: chart.x,
          y: chart.y,
          w: chart.w,
          h: chart.h,
          element: chartElement,
          moved: false
        };
        this.attachDragListeners();
      }
      return;
    }
    const chartElement = target.closest<HTMLElement>(".gc-chart");
    if (chartElement) {
      event.preventDefault();
      const id = chartElement.dataset.chart ?? null;
      this.setSelectedChart(id);
      const chart = this.ctx.getSheet().charts.find(entry => entry.id === id);
      if (chart) {
        this.drag = {
          mode: "chart-move",
          pointerId: event.pointerId,
          chart,
          startX: event.clientX,
          startY: event.clientY,
          x: chart.x,
          y: chart.y,
          element: chartElement,
          moved: false
        };
        this.attachDragListeners();
      }
      return;
    }
    const fillHandle = target.closest<HTMLElement>(".gc-fill-handle");
    if (fillHandle) {
      event.preventDefault();
      const preview = document.createElement("div");
      preview.className = "gc-fill-preview";
      this.sheetEl?.appendChild(preview);
      this.drag = { mode: "fill", pointerId: event.pointerId, source: this.selectionRect(), preview };
      this.attachDragListeners();
      return;
    }
    const cellElement = target.closest<HTMLElement>(".gc-cell");
    if (cellElement) {
      event.preventDefault();
      const r = Number(cellElement.dataset.r);
      const c = Number(cellElement.dataset.c);
      const merge = findMerge(this.ctx.getSheet(), r, c);
      const point = merge ? { r: merge.r1, c: merge.c1 } : { r, c };
      if (event.shiftKey) {
        this.selection.focus = point;
      } else {
        this.selection = { anchor: point, focus: point };
      }
      this.setSelectedChart(null);
      this.paint();
      this.ctx.onSelectionChange();
      this.focusViewport();
      this.drag = { mode: "select", pointerId: event.pointerId };
      this.attachDragListeners();
      return;
    }
    const colHeader = target.closest<HTMLElement>(".gc-col-header");
    if (colHeader) {
      event.preventDefault();
      const c = Number(colHeader.dataset.col);
      this.selectCol(c, event.shiftKey);
      this.drag = { mode: "col", pointerId: event.pointerId, textPointer: false };
      this.attachDragListeners();
      return;
    }
    const rowHeader = target.closest<HTMLElement>(".gc-row-header");
    if (rowHeader) {
      event.preventDefault();
      const r = Number(rowHeader.dataset.row);
      this.selectRow(r, event.shiftKey);
      this.drag = { mode: "row", pointerId: event.pointerId };
      this.attachDragListeners();
      return;
    }
    if (target.closest(".gc-corner")) {
      event.preventDefault();
      this.selectAll();
      return;
    }
  };

  private startResize(handle: HTMLElement, event: PointerEvent): void {
    const layout = this.layoutNow();
    const guide = document.createElement("div");
    if (handle.dataset.resize === "col") {
      const c = Number(handle.dataset.col);
      this.ctx.onBeforeMutate();
      guide.className = "gc-guide gc-guide--v";
      guide.style.left = `${layout.colLeft[c] + layout.widths[c]}px`;
      guide.style.top = `${layout.headerH}px`;
      guide.style.height = `${this.viewport.scrollHeight}px`;
      this.sheetEl?.appendChild(guide);
      this.drag = {
        mode: "col-resize",
        pointerId: event.pointerId,
        c,
        startX: event.clientX,
        startWidth: layout.widths[c],
        guide
      };
    } else {
      const r = Number(handle.dataset.row);
      this.ctx.onBeforeMutate();
      guide.className = "gc-guide gc-guide--h";
      guide.style.top = `${layout.rowTop[r] + layout.heights[r]}px`;
      guide.style.left = `${layout.headerW}px`;
      guide.style.width = `${this.viewport.scrollWidth}px`;
      this.sheetEl?.appendChild(guide);
      this.drag = {
        mode: "row-resize",
        pointerId: event.pointerId,
        r,
        startY: event.clientY,
        startHeight: layout.heights[r],
        guide
      };
    }
    this.attachDragListeners();
  }

  private attachDragListeners(): void {
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerUp);
  }

  private detachDragListeners(): void {
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);
  }

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.drag) return;
    switch (this.drag.mode) {
      case "select": {
        const point = this.cellFromPoint(event.clientX, event.clientY);
        if (point && (point.r !== this.selection.focus.r || point.c !== this.selection.focus.c)) {
          this.selection.focus = point;
          this.paint();
          this.ctx.onSelectionChange();
        }
        break;
      }
      case "col": {
        const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>(".gc-col-header");
        if (element?.dataset.col !== undefined) {
          const c = Number(element.dataset.col);
          this.selection = { anchor: { r: 0, c: this.selection.anchor.c }, focus: { r: ROWS - 1, c } };
          this.paint();
          this.ctx.onSelectionChange();
        }
        break;
      }
      case "row": {
        const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>(".gc-row-header");
        if (element?.dataset.row !== undefined) {
          const r = Number(element.dataset.row);
          this.selection = { anchor: { r: this.selection.anchor.r, c: 0 }, focus: { r, c: COLS - 1 } };
          this.paint();
          this.ctx.onSelectionChange();
        }
        break;
      }
      case "col-resize": {
        const layout = this.layoutNow();
        const delta = event.clientX - this.drag.startX;
        const width = clamp(Math.round((this.drag.startWidth + delta) / this.zoom), 30, 400);
        this.drag.guide.style.left = `${layout.colLeft[this.drag.c] + this.drag.startWidth + delta}px`;
        this.drag.guide.dataset.width = String(width);
        break;
      }
      case "row-resize": {
        const layout = this.layoutNow();
        const delta = event.clientY - this.drag.startY;
        const height = clamp(Math.round((this.drag.startHeight + delta) / this.zoom), 16, 140);
        this.drag.guide.style.top = `${layout.rowTop[this.drag.r] + this.drag.startHeight + delta}px`;
        this.drag.guide.dataset.height = String(height);
        break;
      }
      case "fill": {
        const point = this.cellFromPoint(event.clientX, event.clientY);
        if (!point) break;
        const source = this.drag.source;
        const target: Rect = {
          r1: Math.min(source.r1, point.r),
          c1: Math.min(source.c1, point.c),
          r2: Math.max(source.r2, point.r),
          c2: Math.max(source.c2, point.c)
        };
        const box = this.cellBox(target.r1, target.c1);
        const end = this.cellBox(target.r2, target.c2);
        this.drag.preview.style.left = `${box.x}px`;
        this.drag.preview.style.top = `${box.y}px`;
        this.drag.preview.style.width = `${end.x + end.w - box.x}px`;
        this.drag.preview.style.height = `${end.y + end.h - box.y}px`;
        this.drag.preview.dataset.target = JSON.stringify(target);
        break;
      }
      case "chart-move": {
        if (!this.drag.moved) {
          if (Math.abs(event.clientX - this.drag.startX) + Math.abs(event.clientY - this.drag.startY) < 3) break;
          this.ctx.onBeforeMutate();
          this.drag.moved = true;
        }
        const x = Math.round(this.drag.x + (event.clientX - this.drag.startX) / this.zoom);
        const y = Math.round(this.drag.y + (event.clientY - this.drag.startY) / this.zoom);
        this.drag.chart.x = x;
        this.drag.chart.y = y;
        const layout = this.layoutNow();
        this.drag.element.style.left = `${layout.headerW + Math.round(x * this.zoom)}px`;
        this.drag.element.style.top = `${layout.headerH + Math.round(y * this.zoom)}px`;
        break;
      }
      case "chart-resize": {
        if (!this.drag.moved) {
          if (Math.abs(event.clientX - this.drag.startX) + Math.abs(event.clientY - this.drag.startY) < 3) break;
          this.ctx.onBeforeMutate();
          this.drag.moved = true;
        }
        const dx = (event.clientX - this.drag.startX) / this.zoom;
        const dy = (event.clientY - this.drag.startY) / this.zoom;
        let { x, y, w, h } = this.drag;
        const handle = this.drag.handle;
        if (handle.includes("e")) w = Math.max(160, this.drag.w + dx);
        if (handle.includes("s")) h = Math.max(110, this.drag.h + dy);
        if (handle.includes("w")) {
          w = Math.max(160, this.drag.w - dx);
          x = this.drag.x + (this.drag.w - w);
        }
        if (handle.includes("n")) {
          h = Math.max(110, this.drag.h - dy);
          y = this.drag.y + (this.drag.h - h);
        }
        Object.assign(this.drag.chart, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
        const layout = this.layoutNow();
        this.drag.element.style.left = `${layout.headerW + Math.round(x * this.zoom)}px`;
        this.drag.element.style.top = `${layout.headerH + Math.round(y * this.zoom)}px`;
        this.drag.element.style.width = `${Math.round(w * this.zoom)}px`;
        this.drag.element.style.height = `${Math.round(h * this.zoom)}px`;
        break;
      }
      default:
        break;
    }
  };

  private handlePointerUp = (): void => {
    if (!this.drag) return;
    const drag = this.drag;
    this.drag = null;
    this.detachDragListeners();
    if (drag.mode === "col-resize") {
      const width = Number(drag.guide.dataset.width ?? drag.startWidth / this.zoom);
      drag.guide.remove();
      this.ctx.getSheet().colWidths[drag.c] = width;
      this.layout = null;
      this.ctx.onChanged("Column width");
    } else if (drag.mode === "row-resize") {
      const height = Number(drag.guide.dataset.height ?? drag.startHeight / this.zoom);
      drag.guide.remove();
      this.ctx.getSheet().rowHeights[drag.r] = height;
      this.layout = null;
      this.ctx.onChanged("Row height");
    } else if (drag.mode === "fill") {
      const targetRaw = drag.preview.dataset.target;
      drag.preview.remove();
      if (targetRaw) {
        const target = JSON.parse(targetRaw) as Rect;
        this.ctx.onBeforeMutate();
        this.applyFill(drag.source, target);
      }
    } else if (drag.mode === "chart-move" || drag.mode === "chart-resize") {
      if (drag.moved) {
        this.layout = null;
        this.ctx.onChanged("Chart");
      }
    } else if (drag.mode === "select" || drag.mode === "col" || drag.mode === "row") {
      const rect = this.selectionRect();
      if (rect.r1 === rect.r2 && rect.c1 === rect.c2) this.ctx.onStatus("Ready");
    }
  };

  private applyFill(source: Rect, target: Rect): void {
    if (source.r1 === target.r1 && source.r2 === target.r2 && source.c1 === target.c1 && source.c2 === target.c2)
      return;
    const sheet = this.ctx.getSheet();
    const sourceRows = source.r2 - source.r1 + 1;
    const sourceCols = source.c2 - source.c1 + 1;
    const changed: string[] = [];
    for (let r = target.r1; r <= target.r2; r += 1) {
      for (let c = target.c1; c <= target.c2; c += 1) {
        if (inRect(source, r, c)) continue;
        const srcR = source.r1 + ((((r - source.r1) % sourceRows) + sourceRows) % sourceRows);
        const srcC = source.c1 + ((((c - source.c1) % sourceCols) + sourceCols) % sourceCols);
        const sourceCell = sheet.cells[cellKey(srcR, srcC)];
        if (!sourceCell) continue;
        const dr = r - srcR;
        const dc = c - srcC;
        const raw = sourceCell.raw.startsWith("=") ? adjustFormula(sourceCell.raw, dr, dc) : sourceCell.raw;
        sheet.cells[cellKey(r, c)] = {
          raw,
          style: sourceCell.style ? structuredClone(sourceCell.style) : undefined,
          sparkline: sourceCell.sparkline ? { ...sourceCell.sparkline } : undefined
        };
        changed.push(cellKey(r, c));
      }
    }
    if (!changed.length) return;
    this.selection = { anchor: { r: source.r1, c: source.c1 }, focus: { r: target.r2, c: target.c2 } };
    this.layout = null;
    this.ctx.onChanged(`Filled ${changed.length} cells`);
  }

  private handleDoubleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const cellElement = target.closest<HTMLElement>(".gc-cell");
    if (!cellElement) return;
    const r = Number(cellElement.dataset.r);
    const c = Number(cellElement.dataset.c);
    if (Number.isNaN(r) || Number.isNaN(c)) return;
    this.setSelection({ r1: r, c1: c, r2: r, c2: c });
    this.beginEdit(undefined, "edit");
  };

  private handleContextMenu = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const chart = target.closest<HTMLElement>(".gc-chart");
    if (chart?.dataset.chart) {
      event.preventDefault();
      this.setSelectedChart(chart.dataset.chart);
      this.ctx.onContextMenu(event, { kind: "chart", id: chart.dataset.chart });
      return;
    }
    const cell = target.closest<HTMLElement>(".gc-cell");
    if (cell) {
      event.preventDefault();
      const r = Number(cell.dataset.r);
      const c = Number(cell.dataset.c);
      if (!inRect(this.selectionRect(), r, c)) this.setActive(r, c);
      this.ctx.onContextMenu(event, { kind: "cell", r, c });
      return;
    }
    const row = target.closest<HTMLElement>(".gc-row-header");
    if (row?.dataset.row) {
      event.preventDefault();
      this.selectRow(Number(row.dataset.row));
      this.ctx.onContextMenu(event, { kind: "row", r: Number(row.dataset.row) });
      return;
    }
    const col = target.closest<HTMLElement>(".gc-col-header");
    if (col?.dataset.col) {
      event.preventDefault();
      this.selectCol(Number(col.dataset.col));
      this.ctx.onContextMenu(event, { kind: "col", c: Number(col.dataset.col) });
    }
  };

  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const filter = target.closest<HTMLElement>(".gc-filter-btn");
    if (filter) {
      event.preventDefault();
      event.stopPropagation();
      const tableId = filter.dataset.table;
      const column = Number(filter.dataset.col);
      if (tableId) this.ctx.onFilterRequest(tableId, column, filter);
      return;
    }
    const corner = target.closest(".gc-corner");
    if (corner) this.selectAll();
  };

  private focusViewport(): void {
    this.viewport.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------- charts */

  setSelectedChart(id: string | null): void {
    if (this.selectedChart === id) return;
    this.selectedChart = id;
    if (this.sheetEl) {
      this.sheetEl.querySelectorAll<HTMLElement>(".gc-chart").forEach(element => {
        element.classList.toggle("gc-chart--selected", element.dataset.chart === id);
      });
    }
    this.ctx.onChartSelect(id);
  }

  selectedChartId(): string | null {
    return this.selectedChart;
  }

  selectedChartSpec(): ChartSpec | null {
    return this.ctx.getSheet().charts.find(chart => chart.id === this.selectedChart) ?? null;
  }

  deselectChart(): void {
    this.setSelectedChart(null);
  }

  /** Pixel bounds of a range inside the sheet content (A1 origin, zoom applied). */
  contentBounds(rect: Rect): { x: number; y: number; w: number; h: number } {
    const layout = this.layoutNow();
    const x = (layout.colLeft[rect.c1] ?? layout.headerW) - layout.headerW;
    const y = (layout.rowTop[rect.r1] ?? layout.headerH) - layout.headerH;
    let w = 0;
    let h = 0;
    for (let c = rect.c1; c <= rect.c2; c += 1) w += layout.widths[c] ?? 0;
    for (let r = rect.r1; r <= rect.r2; r += 1) h += layout.heights[r] ?? 0;
    return { x, y, w, h };
  }

  /* ------------------------------------------------------------- settings */

  setZoom(zoom: number): void {
    this.zoom = clamp(zoom, 0.4, 2);
    this.layout = null;
    this.render();
  }

  getZoom(): number {
    return this.zoom;
  }

  setShowFormulas(show: boolean): void {
    this.showFormulas = show;
    this.render();
  }

  setShowGridlines(show: boolean): void {
    this.showGridlines = show;
    this.render();
  }

  setShowHeadings(show: boolean): void {
    this.showHeadings = show;
    this.layout = null;
    this.render();
  }

  invalidateLayout(): void {
    this.layout = null;
  }

  scrollToActive(): void {
    this.ensureVisible(this.selection.anchor.r, this.selection.anchor.c);
  }

  /** Briefly outline referenced ranges (Trace Precedents/Dependents). */
  flashRanges(addresses: string[]): void {
    if (!this.sheetEl) return;
    for (const rawAddress of addresses) {
      const address = rawAddress.includes("!") ? rawAddress.slice(rawAddress.lastIndexOf("!") + 1) : rawAddress;
      const rect = parseRect(address);
      if (!rect) continue;
      const box = this.cellBox(rect.r1, rect.c1);
      const end = this.cellBox(rect.r2, rect.c2);
      const marker = document.createElement("div");
      marker.className = "gc-trace";
      marker.style.left = `${box.x}px`;
      marker.style.top = `${box.y}px`;
      marker.style.width = `${end.x + end.w - box.x}px`;
      marker.style.height = `${end.y + end.h - box.y}px`;
      this.sheetEl.appendChild(marker);
      window.setTimeout(() => marker.remove(), 1600);
    }
  }

  /* ---------------------------------------------------------------- stats */

  selectionValues(): Scalar[] {
    const sheet = this.ctx.getSheet();
    const rect = this.selectionRect();
    const engine = this.ctx.getEngine();
    const values: Scalar[] = [];
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      for (let c = rect.c1; c <= rect.c2; c += 1) values.push(engine.scalarAt(sheet, r, c));
    }
    return values;
  }

  selectionNumbers(): number[] {
    return this.selectionValues().filter((value): value is number => typeof value === "number");
  }

  /** A tab/newline separated matrix of the current selection, for the clipboard. */
  selectionMatrix(): string[][] {
    const sheet = this.ctx.getSheet();
    const rect = this.selectionRect();
    const engine = this.ctx.getEngine();
    const rows: string[][] = [];
    for (let r = rect.r1; r <= rect.r2; r += 1) {
      const row: string[] = [];
      for (let c = rect.c1; c <= rect.c2; c += 1) {
        const cell = sheet.cells[cellKey(r, c)];
        row.push(
          cell?.raw ??
            (isError(engine.scalarAt(sheet, r, c)) ? "" : formatScalar(engine.scalarAt(sheet, r, c), cell?.style))
        );
      }
      rows.push(row);
    }
    return rows;
  }
}

function freezeRowsAt(sheet: Sheet, r: number): boolean {
  return r < (sheet.freeze?.rows ?? 0);
}
