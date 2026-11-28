/** Number / value formatting for cells, charts and the status bar. */

import { isError, type Scalar } from "./formula";
import type { CellStyle } from "./model";

function fixedGrouped(value: number, decimals: number): string {
  return Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function generalNumber(value: number): string {
  if (!Number.isFinite(value)) return "#NUM!";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e12 || abs < 1e-9) return value.toExponential(5).replace(/\.?0+e/, "e");
  const rounded = Number(value.toPrecision(10));
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Math.round(rounded * 1e8) / 1e8);
}

export function formatNumber(value: number, style?: CellStyle): string {
  const fmt = style?.numFmt ?? "general";
  switch (fmt) {
    case "currency": {
      const decimals = style?.decimals ?? 2;
      const body = `$${fixedGrouped(value, decimals)}`;
      return value < 0 ? `(${body})` : body;
    }
    case "percent": {
      const decimals = style?.decimals ?? 0;
      const scaled = value * 100;
      const body =
        style?.decimals === undefined
          ? generalNumber(Number(scaled.toFixed(2)))
          : scaled.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      return `${body}%`;
    }
    case "comma": {
      const decimals = style?.decimals ?? 0;
      return `${value < 0 ? "-" : ""}${fixedGrouped(value, decimals)}`;
    }
    case "number": {
      const decimals = style?.decimals ?? 2;
      return `${value < 0 ? "-" : ""}${fixedGrouped(value, decimals)}`;
    }
    case "text":
      return String(value);
    default:
      return generalNumber(value);
  }
}

export function formatScalar(value: Scalar, style?: CellStyle): string {
  if (isError(value)) return value.error;
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return formatNumber(value, style);
  return value;
}

/** Status bar formatting: compact and predictable. */
export function formatStat(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return formatNumber(value, { numFmt: "number", decimals: Number.isInteger(value) ? 0 : 2 });
}

/** Chart axis labels, e.g. 120000 -> "$120,000". */
export function formatAxis(value: number, currency = true): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  let body: string;
  if (abs >= 1_000_000) body = `${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  else if (abs >= 1_000) body = `${(abs / 1_000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  else body = String(abs);
  return `${sign}${currency ? "$" : ""}${body}`;
}

export interface ParsedInput {
  raw: string;
  style?: Partial<CellStyle>;
}

/** Excel-ish input parsing: $, %, signed values keep their look. */
export function parseInput(text: string): ParsedInput {
  const raw = text;
  const trimmed = text.trim();
  if (trimmed === "") return { raw: "" };
  const percent = /^-?\$?\d[\d,]*(\.\d+)?\s*%$/.test(trimmed);
  if (percent) {
    const number = Number(trimmed.replace(/[$,%\s]/g, ""));
    if (Number.isFinite(number)) {
      return { raw: String(number / 100), style: { numFmt: "percent", decimals: 0, align: "right" } };
    }
  }
  const currency = /^-?\$\d[\d,]*(\.\d+)?$/.test(trimmed);
  if (currency) {
    const number = Number(trimmed.replace(/[$,]/g, ""));
    if (Number.isFinite(number)) {
      return { raw: String(number), style: { numFmt: "currency", decimals: 2, align: "right" } };
    }
  }
  const plain = /^-?\d[\d,]*(\.\d+)?$/.test(trimmed);
  if (plain) {
    const number = Number(trimmed.replace(/,/g, ""));
    if (Number.isFinite(number)) return { raw: String(number) };
  }
  return { raw };
}

export function columnLetterLabel(index: number): string {
  let value = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return label;
}
