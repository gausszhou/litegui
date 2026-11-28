/** The shipped sample workbook: a quarterly dashboard, budget, gradebook and pivot table. */

import { CalcEngine } from "./formula";
import {
  CHART_PALETTES,
  cellKey,
  createSheet,
  type CellStyle,
  type ChartSpec,
  type Sheet,
  type Workbook
} from "./model";
import { applyPivot } from "./pivot";

const ACCENT = "#0e6b5c";

const currency0: CellStyle = { numFmt: "currency", decimals: 0 };
const currency2: CellStyle = { numFmt: "currency", decimals: 2 };
const percent1: CellStyle = { numFmt: "percent", decimals: 1 };
const number0: CellStyle = { numFmt: "number", decimals: 0 };

function put(sheet: Sheet, address: string, raw: string | number, style?: CellStyle): void {
  sheet.cells[address] = { raw: String(raw), style: style ? { ...style } : undefined };
}

function styleRange(sheet: Sheet, range: string, style: CellStyle): void {
  const [start, end] = range.split(":");
  const startMatch = /^([A-Z]+)(\d+)$/.exec(start);
  const endMatch = /^([A-Z]+)(\d+)$/.exec(end ?? start);
  if (!startMatch || !endMatch) return;
  const toCol = (letters: string) => [...letters].reduce((value, char) => value * 26 + char.charCodeAt(0) - 64, 0);
  const c1 = toCol(startMatch[1]);
  const c2 = toCol(endMatch[1]);
  const r1 = Number(startMatch[2]);
  const r2 = Number(endMatch[2]);
  for (let r = r1; r <= r2; r += 1) {
    for (let c = c1; c <= c2; c += 1) {
      const key = cellKey(r - 1, c - 1);
      const cell = sheet.cells[key] ?? (sheet.cells[key] = { raw: "" });
      cell.style = { ...cell.style, ...style };
    }
  }
}

function merge(sheet: Sheet, r1: number, c1: number, r2: number, c2: number): void {
  sheet.merges.push({ r1, c1, r2, c2 });
}

function chart(
  id: string,
  type: ChartSpec["type"],
  title: string,
  categories: string,
  series: ChartSpec["series"],
  x: number,
  y: number,
  w: number,
  h: number,
  extra: Partial<ChartSpec> = {}
): ChartSpec {
  return {
    id,
    type,
    title,
    categories,
    series,
    x,
    y,
    w,
    h,
    legend: type === "pie" || type === "doughnut" ? "right" : "bottom",
    palette: type === "pie" || type === "doughnut" ? "vivid" : "office",
    dataLabels: false,
    gridlines: type !== "pie" && type !== "doughnut",
    ...extra
  };
}

/* ------------------------------------------------------------------ sales */

function buildSales(): Sheet {
  const sheet = createSheet("sales", "Sales");
  sheet.tabColor = ACCENT;
  sheet.colWidths = { 0: 112, 1: 84, 2: 84, 3: 84, 4: 84, 5: 100, 6: 92, 7: 104 };
  sheet.rowHeights = { 1: 32, 2: 18, 3: 23 };

  put(sheet, "A2", "Quarterly Sales Dashboard", {
    bold: true,
    size: 21,
    color: "#12554d",
    align: "left",
    valign: "middle"
  });
  merge(sheet, 1, 0, 1, 9);
  put(sheet, "A3", "Fiscal year 2026 · all figures in USD", {
    italic: true,
    size: 10.5,
    color: "#6b6b6b",
    align: "left",
    valign: "bottom"
  });
  merge(sheet, 2, 0, 2, 9);

  const headers = ["Region", "Q1", "Q2", "Q3", "Q4", "Total", "Growth", "Trend"];
  headers.forEach((header, index) => put(sheet, cellKey(3, index), header));

  const rows: Array<[string, number, number, number, number]> = [
    ["North", 48200, 51340, 56010, 61870],
    ["South", 39150, 37980, 42400, 45120],
    ["East", 55300, 58910, 57230, 63480],
    ["West", 61020, 64400, 70750, 76390],
    ["Central", 28740, 31360, 33980, 36510],
    ["Online", 72410, 81630, 95220, 112840]
  ];

  rows.forEach(([region, q1, q2, q3, q4], index) => {
    const r = 5 + index;
    put(sheet, `A${r}`, region);
    put(sheet, `B${r}`, q1, currency0);
    put(sheet, `C${r}`, q2, currency0);
    put(sheet, `D${r}`, q3, currency0);
    put(sheet, `E${r}`, q4, currency0);
    put(sheet, `F${r}`, `=SUM(B${r}:E${r})`, { ...currency0, fill: "#eaf4f2" });
    put(sheet, `G${r}`, `=(E${r}-B${r})/B${r}`, { ...percent1, bold: true });
    put(sheet, `H${r}`, "", { align: "center" });
    const trend = sheet.cells[`H${r}`];
    if (trend) trend.sparkline = { range: `B${r}:E${r}`, kind: "line", color: "#215c8a" };
  });

  put(sheet, "A11", "Total", { bold: true });
  for (const column of ["B", "C", "D", "E", "F"]) {
    put(sheet, `${column}11`, `=SUM(${column}5:${column}10)`, { ...currency0, bold: true });
  }
  put(sheet, "G11", "=(F11-SUM(B11:D11))/SUM(B11:D11)", { ...percent1, bold: true });
  styleRange(sheet, "A11:H11", {
    bold: true,
    fill: "#e3f0ed",
    border: { top: true, bottom: true }
  });
  for (const column of ["B", "C", "D", "E", "F"]) {
    const cell = sheet.cells[`${column}11`];
    if (cell) cell.style = { ...cell.style, numFmt: "currency", decimals: 0 };
  }

  const summary: Array<[string, string, CellStyle?]> = [
    ["Best region", "=INDEX(A5:A10,MATCH(MAX(F5:F10),F5:F10,0))"],
    ["Average quarter", "=ROUND(AVERAGE(B5:E10),0)", currency0],
    ["Online share", "=F10/F11", percent1],
    ["Year-over-year", "0.3", percent1]
  ];
  summary.forEach(([label, value, style], index) => {
    const r = 13 + index;
    put(sheet, `A${r}`, label, {
      bold: true,
      size: 10.5,
      border: { top: index === 0, bottom: index === summary.length - 1, left: true }
    });
    put(sheet, `B${r}`, value, {
      size: 10.5,
      align: "right",
      border: { top: index === 0, bottom: index === summary.length - 1, right: true },
      ...style
    });
  });
  sheet.cells["F11"].comment = "Consolidated FY26 revenue across all regions.";

  sheet.tables.push({
    id: "sales-table",
    name: "SalesTable",
    range: "A4:H10",
    style: "teal",
    header: true,
    banded: true,
    totals: false,
    filter: true
  });

  sheet.condRules.push(
    {
      id: "sales-growth",
      range: "G5:G10",
      type: "iconSet",
      color: "#2e7d32"
    },
    {
      id: "sales-total-bar",
      range: "F5:F10",
      type: "dataBar",
      color: "#8fc7bd"
    }
  );

  sheet.charts.push(
    chart(
      "sales-column",
      "column",
      "Revenue by Region",
      "A5:A10",
      [
        { name: "Q1", range: "B5:B10" },
        { name: "Q2", range: "C5:C10" },
        { name: "Q3", range: "D5:D10" },
        { name: "Q4", range: "E5:E10" }
      ],
      770,
      52,
      470,
      252
    ),
    chart(
      "sales-pie",
      "pie",
      "Share of Annual Total",
      "A5:A10",
      [{ name: "Total", range: "F5:F10" }],
      770,
      320,
      470,
      326,
      { legend: "right", palette: "vivid" }
    )
  );

  return sheet;
}

/* ------------------------------------------------------------------ budget */

function buildBudget(): Sheet {
  const sheet = createSheet("budget", "Budget");
  sheet.colWidths = { 0: 146, 1: 98, 2: 98, 3: 106, 4: 84 };
  sheet.rowHeights = { 0: 32, 2: 23 };
  put(sheet, "A1", "Monthly Budget — October 2026", { bold: true, size: 19, color: "#12554d", valign: "middle" });
  merge(sheet, 0, 0, 0, 4);

  ["Category", "Budget", "Actual", "Difference", "% Used"].forEach((header, index) => {
    put(sheet, cellKey(2, index), header, {
      bold: true,
      color: ACCENT,
      size: 11.5,
      border: { bottom: true }
    });
  });
  styleRange(sheet, "A3:E3", { border: { bottom: true } });

  const rows: Array<[string, number, number]> = [
    ["Rent", 1850, 1850],
    ["Groceries", 620, 684.35],
    ["Utilities", 240, 212.8],
    ["Transport", 180, 203.5],
    ["Internet & phone", 95, 95],
    ["Insurance", 210, 210],
    ["Dining out", 200, 265.9],
    ["Entertainment", 120, 88.25],
    ["Savings", 600, 600],
    ["Art supplies", 150, 172.4]
  ];
  rows.forEach(([category, budget, actual], index) => {
    const r = 4 + index;
    put(sheet, `A${r}`, category);
    put(sheet, `B${r}`, budget, currency2);
    put(sheet, `C${r}`, actual, currency2);
    put(sheet, `D${r}`, `=C${r}-B${r}`, currency2);
    put(sheet, `E${r}`, `=C${r}/B${r}`, { ...percent1, decimals: 0, align: "right" });
  });

  put(sheet, "A14", "Total", { bold: true });
  put(sheet, "B14", "=SUM(B4:B13)", { ...currency2, bold: true });
  put(sheet, "C14", "=SUM(C4:C13)", { ...currency2, bold: true });
  put(sheet, "D14", "=C14-B14", { ...currency2, bold: true });
  put(sheet, "E14", "=C14/B14", { ...percent1, decimals: 0, bold: true });
  styleRange(sheet, "A14:E14", { bold: true, fill: "#e3f0ed", border: { top: true, bottom: true } });
  for (const column of ["B", "C", "D"]) {
    const cell = sheet.cells[`${column}14`];
    if (cell) cell.style = { ...cell.style, numFmt: "currency", decimals: 2 };
  }

  sheet.condRules.push(
    { id: "budget-under", range: "D4:D13", type: "less", value: 0, color: "#f8d7d4" },
    {
      id: "budget-used",
      range: "E4:E13",
      type: "colorScale",
      scale: { min: "#c9ead2", mid: "#fff2b2", max: "#f7b7ab" }
    }
  );

  sheet.charts.push(
    chart(
      "budget-bar",
      "bar",
      "Budget vs Actual",
      "A4:A13",
      [
        { name: "Budget", range: "B4:B13" },
        { name: "Actual", range: "C4:C13" }
      ],
      570,
      72,
      486,
      300,
      { palette: "office", legend: "bottom" }
    )
  );

  return sheet;
}

/* ------------------------------------------------------------------ grades */

function buildGrades(): Sheet {
  const sheet = createSheet("grades", "Grades");
  sheet.colWidths = { 0: 156, 1: 78, 2: 82, 3: 80, 4: 70, 5: 88, 6: 78 };
  ["Student", "Essay", "Midterm", "Project", "Final", "Average", "Grade"].forEach((header, index) => {
    put(sheet, cellKey(0, index), header);
  });

  const students: Array<[string, number, number, number, number]> = [
    ["Amara Okafor", 92, 88, 95, 91],
    ["Bruno Silva", 78, 82, 74, 80],
    ["Chen Wei", 85, 91, 89, 94],
    ["Dana Kowalski", 67, 72, 80, 70],
    ["Elif Yilmaz", 98, 95, 97, 99],
    ["Farid Haddad", 74, 69, 71, 77],
    ["Grace Mensah", 88, 84, 90, 86]
  ];
  students.forEach(([name, essay, midterm, project, final], index) => {
    const r = 2 + index;
    put(sheet, `A${r}`, name, { bold: true });
    put(sheet, `B${r}`, essay, number0);
    put(sheet, `C${r}`, midterm, number0);
    put(sheet, `D${r}`, project, number0);
    put(sheet, `E${r}`, final, number0);
    put(sheet, `F${r}`, `=AVERAGE(B${r}:E${r})`, { numFmt: "number", decimals: 1, align: "right", bold: true });
    put(sheet, `G${r}`, `=IF(F${r}>=90,"A",IF(F${r}>=80,"B",IF(F${r}>=70,"C","D")))`, { align: "center", bold: true });
  });

  sheet.tables.push({
    id: "gradebook",
    name: "Gradebook",
    range: "A1:G8",
    style: "teal",
    header: true,
    banded: true,
    totals: false,
    filter: false
  });

  const grades: Array<[string, string]> = [
    ["A", "#c9e9d0"],
    ["B", "#d8efc0"],
    ["C", "#fff0b8"],
    ["D", "#f8cec2"]
  ];
  sheet.condRules.push({
    id: "grades-scale",
    range: "F2:F8",
    type: "colorScale",
    scale: { min: "#f4b9ae", mid: "#ffedb3", max: "#b9e3bf" }
  });
  for (const [letter, color] of grades) {
    sheet.condRules.push({
      id: `grade-${letter}`,
      range: "G2:G8",
      type: "equal",
      text: letter,
      color
    });
  }

  return sheet;
}

/* ------------------------------------------------------------------ data */

function buildData(): Sheet {
  const sheet = createSheet("data", "Data");
  sheet.colWidths = { 0: 96, 1: 126, 2: 96, 3: 70, 4: 108 };
  ["Region", "Product", "Channel", "Units", "Revenue"].forEach((header, index) => {
    put(sheet, cellKey(0, index), header);
  });

  const regions = ["East", "North", "Online", "South", "West"];
  const products: Array<[string, number]> = [
    ["Backpacks", 64],
    ["Desk Lamps", 46],
    ["Notebooks", 23],
    ["Pens", 9],
    ["Planners", 31]
  ];
  const channels = ["Direct", "Partner", "Retail", "Web"];

  for (let i = 0; i < 59; i += 1) {
    const r = i + 2;
    const region = regions[(i * 3 + Math.floor(i / 5)) % regions.length];
    const [product, price] = products[(i * 2 + Math.floor(i / 7)) % products.length];
    const channel = channels[(i * 5 + 1) % channels.length];
    const units = 42 + ((i * 37) % 90);
    const revenue = Math.round(units * price * (0.92 + ((i * 13) % 19) / 100));
    put(sheet, `A${r}`, region);
    put(sheet, `B${r}`, product);
    put(sheet, `C${r}`, channel);
    put(sheet, `D${r}`, units, number0);
    put(sheet, `E${r}`, revenue, currency0);
  }

  sheet.tables.push({
    id: "sales-data",
    name: "SalesData",
    range: "A1:E60",
    style: "teal",
    header: true,
    banded: true,
    totals: false,
    filter: true
  });

  return sheet;
}

/* ------------------------------------------------------------------ pivot */

function buildPivot(): Sheet {
  const sheet = createSheet("pivot", "Pivot");
  sheet.pivot = {
    source: "Data!A1:E60",
    filters: { Channel: null },
    rows: ["Region"],
    cols: ["Product"],
    values: [{ field: "Revenue", agg: "sum" }],
    layout: "compact",
    grandTotals: true
  };
  return sheet;
}

/* ------------------------------------------------------------------ build */

export function createDemoWorkbook(): Workbook {
  const workbook: Workbook = {
    title: "Quarterly Sales Dashboard",
    file: "Quarterly Sales Dashboard.xlsx",
    sheets: [buildSales(), buildBudget(), buildGrades(), buildData(), buildPivot()],
    active: 0,
    names: {
      SalesData: "Data!$A$1:$E$60",
      TotalRevenue: "Data!$E$2:$E$60"
    },
    autosave: false
  };
  const engine = new CalcEngine(workbook);
  const pivot = workbook.sheets.find(sheet => sheet.id === "pivot");
  if (pivot) applyPivot(pivot, engine);
  engine.invalidate();
  return workbook;
}

export const DEMO_CHART_PALETTES = Object.keys(CHART_PALETTES);
