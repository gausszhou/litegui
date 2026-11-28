/** Pivot table evaluation and rendering into worksheet cells. */

import { CalcEngine, isError, type Scalar } from "./formula";
import { cellKey, ensureCell, type CellStyle, type PivotAgg, type PivotConfig, type Sheet } from "./model";

export interface PivotSource {
  headers: string[];
  rows: Scalar[][];
}

export function readPivotSource(sheet: Sheet, engine: CalcEngine, config: PivotConfig): PivotSource {
  const resolved = engine.resolveRange(sheet, config.source);
  if (!resolved) return { headers: [], rows: [] };
  const matrix = engine.matrixOf(sheet, config.source);
  if (matrix.length === 0) return { headers: [], rows: [] };
  const headers = matrix[0].map(value => text(value));
  const rows = matrix.slice(1).filter(row => row.some(value => text(value) !== ""));
  return { headers, rows };
}

function text(value: Scalar): string {
  if (isError(value)) return value.error;
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return String(value);
}

function numberValue(value: Scalar): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/[$,%\s]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function aggregate(values: number[], agg: PivotAgg): number | null {
  if (!values.length) return null;
  if (agg === "count") return values.length;
  if (agg === "average") return values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + value, 0);
}

interface PivotResult {
  rowKeys: string[];
  colKeys: string[];
  cells: Map<string, number | null>;
  rowTotals: Map<string, number | null>;
  colTotals: Map<string, number | null>;
  grandTotal: number | null;
  valueLabel: string;
}

function computePivot(config: PivotConfig, source: PivotSource): PivotResult {
  const rowFields = config.rows.length ? config.rows : [];
  const colFields = config.cols.length ? config.cols : [];
  const value = config.values[0] ?? {
    field: source.headers[source.headers.length - 1] ?? "Value",
    agg: "sum" as PivotAgg
  };
  const valueIndex = source.headers.indexOf(value.field);
  const filterEntries = Object.entries(config.filters).filter(([, filter]) => filter && filter !== "(All)");
  const rowIndexes = rowFields.map(field => source.headers.indexOf(field)).filter(index => index >= 0);
  const colIndexes = colFields.map(field => source.headers.indexOf(field)).filter(index => index >= 0);
  const filterIndexes = filterEntries
    .map(([field, filter]) => ({ index: source.headers.indexOf(field), filter }))
    .filter(entry => entry.index >= 0);

  const rowKeys = new Set<string>();
  const colKeys = new Set<string>();
  const groups = new Map<string, number[]>();

  for (const row of source.rows) {
    if (filterIndexes.some(entry => text(row[entry.index]) !== entry.filter)) continue;
    const rowKey = formatKey(rowIndexes, row);
    const colKey = formatKey(colIndexes, row);
    rowKeys.add(rowKey);
    colKeys.add(colKey);
    const valueNumber = valueIndex >= 0 ? numberValue(row[valueIndex]) : null;
    if (value.agg === "count" || valueNumber !== null) {
      const key = `${rowKey}\u0000${colKey}`;
      const bucket = groups.get(key) ?? [];
      if (valueNumber !== null) bucket.push(valueNumber);
      else bucket.push(1);
      groups.set(key, bucket);
    }
  }

  const sortedRows = [...rowKeys].sort((a, b) => a.localeCompare(b, "en"));
  const sortedCols = [...colKeys].sort((a, b) => a.localeCompare(b, "en"));
  const cells = new Map<string, number | null>();
  for (const rowKey of sortedRows) {
    for (const colKey of sortedCols) {
      cells.set(`${rowKey}\u0000${colKey}`, aggregate(groups.get(`${rowKey}\u0000${colKey}`) ?? [], value.agg));
    }
  }
  const rowTotals = new Map<string, number | null>();
  for (const rowKey of sortedRows) {
    const all: number[] = [];
    for (const colKey of sortedCols) {
      const valueNumber = cells.get(`${rowKey}\u0000${colKey}`);
      if (typeof valueNumber === "number") all.push(valueNumber);
    }
    rowTotals.set(rowKey, aggregate(all, value.agg));
  }
  const colTotals = new Map<string, number | null>();
  for (const colKey of sortedCols) {
    const all: number[] = [];
    for (const rowKey of sortedRows) {
      const valueNumber = cells.get(`${rowKey}\u0000${colKey}`);
      if (typeof valueNumber === "number") all.push(valueNumber);
    }
    colTotals.set(colKey, aggregate(all, value.agg));
  }
  const allFlat: number[] = [];
  for (const rowKey of sortedRows) {
    const total = rowTotals.get(rowKey);
    if (typeof total === "number") allFlat.push(total);
  }
  const label = `${value.agg === "sum" ? "Sum" : value.agg === "average" ? "Average" : "Count"} of ${value.field}`;
  return {
    rowKeys: sortedRows,
    colKeys: sortedCols,
    cells,
    rowTotals,
    colTotals,
    grandTotal: config.grandTotals ? aggregate(allFlat, value.agg) : null,
    valueLabel: label
  };
}

function formatKey(indexes: number[], row: Scalar[]): string {
  if (!indexes.length) return "(All)";
  return indexes.map(index => text(row[index]) || "(blank)").join(" / ");
}

const HEADER_FILL = "#dcefeb";
const TOTAL_FILL = "#eef6f4";

function style(fill?: string, extra: CellStyle = {}): CellStyle {
  return {
    bold: extra.bold,
    italic: extra.italic,
    fill,
    align: extra.align,
    numFmt: extra.numFmt,
    decimals: extra.decimals,
    color: extra.color,
    border: extra.border
  };
}

export function applyPivot(sheet: Sheet, engine: CalcEngine): void {
  const config = sheet.pivot;
  if (!config) return;
  for (const address of sheet.pivotCells ?? []) delete sheet.cells[address];
  sheet.pivotCells = [];

  const source = readPivotSource(sheet, engine, config);
  if (!source.headers.length) return;
  const result = computePivot(config, source);
  const touched = new Set<string>();
  const put = (r: number, c: number, raw: string, styleValue?: CellStyle): void => {
    const key = cellKey(r, c);
    const cell = ensureCell(sheet, r, c);
    cell.raw = raw;
    if (styleValue) cell.style = styleValue;
    touched.add(key);
  };

  const filterFields = Object.keys(config.filters);
  if (filterFields.length) {
    put(0, 0, filterFields[0], style(HEADER_FILL, { bold: true, border: { bottom: true, right: true } }));
    const filterLabel = config.filters[filterFields[0]] ?? "(All)";
    put(0, 1, filterLabel, style(HEADER_FILL, { bold: true, border: { bottom: true, right: true } }));
  }

  put(2, 0, result.valueLabel, style(undefined, { bold: true }));
  put(2, 1, "Column Labels", style(undefined, { italic: true, color: "#7a7a7a", border: { bottom: true } }));

  const headerRow = 3;
  const firstDataRow = headerRow + 1;
  const colCount = Math.max(1, result.colKeys.length);
  put(headerRow, 0, "Row Labels", style(HEADER_FILL, { bold: true, border: { bottom: true, right: true } }));
  result.colKeys.forEach((colKey, index) => {
    put(headerRow, index + 1, colKey, style(HEADER_FILL, { bold: true, border: { bottom: true, right: true } }));
  });
  put(
    headerRow,
    colCount + 1,
    "Grand Total",
    style(HEADER_FILL, { bold: true, border: { bottom: true, right: true } })
  );

  result.rowKeys.forEach((rowKey, rowIndex) => {
    const r = firstDataRow + rowIndex;
    put(r, 0, rowKey, style(undefined, { bold: true, border: { right: true } }));
    result.colKeys.forEach((colKey, colIndex) => {
      const value = result.cells.get(`${rowKey}\u0000${colKey}`);
      put(
        r,
        colIndex + 1,
        value === null || value === undefined ? "" : String(value),
        style(undefined, {
          numFmt:
            value === null || value === undefined
              ? undefined
              : config.values[0]?.agg === "count"
              ? "number"
              : "currency",
          decimals: config.values[0]?.agg === "count" ? 0 : 2,
          align: "right",
          border: { right: true }
        })
      );
    });
    const total = result.rowTotals.get(rowKey);
    put(
      r,
      colCount + 1,
      total === null || total === undefined ? "" : String(total),
      style(TOTAL_FILL, { bold: true, numFmt: "currency", decimals: 2, align: "right", border: { right: true } })
    );
  });

  if (config.grandTotals) {
    const totalRow = firstDataRow + result.rowKeys.length;
    put(totalRow, 0, "Grand Total", style(TOTAL_FILL, { bold: true, border: { top: true, right: true } }));
    result.colKeys.forEach((colKey, colIndex) => {
      const total = result.colTotals.get(colKey);
      put(
        totalRow,
        colIndex + 1,
        total === null || total === undefined ? "" : String(total),
        style(TOTAL_FILL, {
          bold: true,
          numFmt: "currency",
          decimals: 2,
          align: "right",
          border: { top: true, right: true }
        })
      );
    });
    put(
      totalRow,
      colCount + 1,
      result.grandTotal === null ? "" : String(result.grandTotal),
      style(TOTAL_FILL, {
        bold: true,
        numFmt: "currency",
        decimals: 2,
        align: "right",
        border: { top: true, right: true }
      })
    );
    for (let c = 0; c <= colCount + 1; c += 1) {
      const cell = ensureCell(sheet, totalRow, c);
      cell.style = { ...cell.style, fill: TOTAL_FILL, bold: true, border: { ...cell.style?.border, top: true } };
    }
  }

  sheet.colWidths = { ...sheet.colWidths, 0: 120 };
  for (let c = 1; c <= colCount + 1; c += 1) sheet.colWidths[c] = Math.max(sheet.colWidths[c] ?? 86, 92);

  sheet.pivotCells = [...touched];
  engine.invalidate();
}

export function pivotFieldList(source: PivotSource): string[] {
  return source.headers;
}

export const PIVOT_AGG_LABELS: Record<PivotAgg, string> = {
  sum: "Sum",
  count: "Count",
  average: "Average"
};
