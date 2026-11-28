/**
 * A compact worksheet formula engine.
 *
 * It supports the pieces the demo workbook needs: arithmetic, comparisons,
 * text concatenation, A1 / range / cross-sheet references, named ranges and a
 * pragmatic library of worksheet functions. Values are calculated lazily and
 * memoised per revision; cycles resolve to #CIRC! instead of hanging.
 */

import { COLS, ROWS, cellKey, colIndex, colName, parseAddress, sheetByName, type Sheet, type Workbook } from "./model";

export interface CellError {
  error: string;
}

export type Scalar = number | string | boolean | CellError;
export interface Matrix {
  matrix: Scalar[][];
}
export type Value = Scalar | Matrix;

export const ERR = {
  div0: { error: "#DIV/0!" },
  value: { error: "#VALUE!" },
  ref: { error: "#REF!" },
  name: { error: "#NAME?" },
  na: { error: "#N/A" },
  num: { error: "#NUM!" },
  circ: { error: "#CIRC!" },
  null: { error: "#NULL!" }
} as const;

export function isError(value: unknown): value is CellError {
  return typeof value === "object" && value !== null && "error" in value;
}

export function isMatrix(value: Value): value is Matrix {
  return typeof value === "object" && value !== null && "matrix" in value;
}

export function err(code: keyof typeof ERR): CellError {
  return ERR[code];
}

/* ------------------------------------------------------------------ tokens */

type Token =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "ref"; sheet?: string; r1: number; c1: number; r2: number; c2: number }
  | { kind: "name"; value: string }
  | { kind: "op"; value: string }
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "comma" };

const REF_START =
  /^(?:(?:'((?:[^']|'')+)'|([A-Za-z_][A-Za-z0-9_.]*))!)?(\$?)([A-Za-z]{1,2})(\$?)(\d+)(?::(\$?)([A-Za-z]{1,2})(\$?)(\d+))?(?![A-Za-z0-9_])/;

function unquoteSheet(name: string): string {
  return name.replace(/''/g, "'");
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (token: Token) => tokens.push(token);

  while (i < source.length) {
    const char = source[i];
    if (/\s/.test(char)) {
      i += 1;
      continue;
    }
    if (char === '"') {
      let text = "";
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === '"') {
          if (source[j + 1] === '"') {
            text += '"';
            j += 2;
            continue;
          }
          break;
        }
        text += source[j];
        j += 1;
      }
      if (source[j] !== '"') throw new Error("Unterminated string");
      push({ kind: "str", value: text });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(char) || (char === "." && /[0-9]/.test(source[i + 1] ?? ""))) {
      const match = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(source.slice(i));
      if (match) {
        push({ kind: "num", value: Number(match[0]) });
        i += match[0].length;
        continue;
      }
    }
    const refMatch = REF_START.exec(source.slice(i));
    if (refMatch) {
      const sheet = refMatch[1] !== undefined ? unquoteSheet(refMatch[1]) : refMatch[2];
      const c1 = colIndex(refMatch[4]);
      const r1 = Number(refMatch[6]) - 1;
      if (c1 < 0 || c1 >= COLS || r1 < 0 || r1 >= ROWS) {
        throw new Error("Reference out of range");
      }
      if (refMatch[7] !== undefined) {
        const c2 = colIndex(refMatch[8]);
        const r2 = Number(refMatch[10]) - 1;
        if (c2 < 0 || c2 >= COLS || r2 < 0 || r2 >= ROWS) throw new Error("Reference out of range");
        push({
          kind: "ref",
          sheet,
          r1: Math.min(r1, r2),
          c1: Math.min(c1, c2),
          r2: Math.max(r1, r2),
          c2: Math.max(c1, c2)
        });
      } else {
        push({ kind: "ref", sheet, r1, c1, r2: r1, c2: c1 });
      }
      i += refMatch[0].length;
      continue;
    }
    if (/[A-Za-z_]/.test(char)) {
      const match = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(source.slice(i));
      if (!match) throw new Error("Invalid identifier");
      push({ kind: "name", value: match[0] });
      i += match[0].length;
      continue;
    }
    if (char === "(") {
      push({ kind: "lparen" });
      i += 1;
      continue;
    }
    if (char === ")") {
      push({ kind: "rparen" });
      i += 1;
      continue;
    }
    if (char === ",") {
      push({ kind: "comma" });
      i += 1;
      continue;
    }
    const two = source.slice(i, i + 2);
    if (two === "<>" || two === "<=" || two === ">=") {
      push({ kind: "op", value: two });
      i += 2;
      continue;
    }
    if ("+-*/^&=<>%".includes(char)) {
      push({ kind: "op", value: char });
      i += 1;
      continue;
    }
    throw new Error(`Unexpected character: ${char}`);
  }
  return tokens;
}

/* ------------------------------------------------------------------ parser */

type Node =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "bool"; value: boolean }
  | { kind: "empty" }
  | { kind: "ref"; sheet?: string; r1: number; c1: number; r2: number; c2: number }
  | { kind: "name"; value: string }
  | { kind: "fn"; name: string; args: Node[] }
  | { kind: "un"; op: string; value: Node }
  | { kind: "bin"; op: string; left: Node; right: Node };

const PRECEDENCE: Record<string, number> = {
  "=": 1,
  "<>": 1,
  "<": 1,
  ">": 1,
  "<=": 1,
  ">=": 1,
  "&": 2,
  "+": 3,
  "-": 3,
  "*": 4,
  "/": 4,
  "^": 5
};

class Parser {
  private index = 0;
  constructor(private readonly tokens: Token[]) {}

  parse(): Node {
    if (this.tokens.length === 0) return { kind: "empty" };
    const node = this.parseExpression(1);
    if (this.index < this.tokens.length) throw new Error("Unexpected token");
    return node;
  }

  private peek(): Token | undefined {
    return this.tokens[this.index];
  }

  private next(): Token | undefined {
    return this.tokens[this.index++];
  }

  private parseExpression(min: number): Node {
    let left = this.parseUnary();
    for (;;) {
      const token = this.peek();
      if (!token || token.kind !== "op") break;
      const precedence = PRECEDENCE[token.value];
      if (precedence === undefined || precedence < min) break;
      this.next();
      const right = this.parseExpression(precedence + 1);
      left = { kind: "bin", op: token.value, left, right };
    }
    return left;
  }

  private parseUnary(): Node {
    const token = this.peek();
    if (token && token.kind === "op" && (token.value === "-" || token.value === "+")) {
      this.next();
      return { kind: "un", op: token.value, value: this.parseUnary() };
    }
    let node = this.parsePrimary();
    while (this.peek()?.kind === "op" && (this.peek() as { value: string }).value === "%") {
      this.next();
      node = { kind: "un", op: "%", value: node };
    }
    return node;
  }

  private parsePrimary(): Node {
    const token = this.next();
    if (!token) throw new Error("Unexpected end of formula");
    switch (token.kind) {
      case "num":
        return { kind: "num", value: token.value };
      case "str":
        return { kind: "str", value: token.value };
      case "ref":
        return { kind: "ref", sheet: token.sheet, r1: token.r1, c1: token.c1, r2: token.r2, c2: token.c2 };
      case "name": {
        const upper = token.value.toUpperCase();
        if (upper === "TRUE") return { kind: "bool", value: true };
        if (upper === "FALSE") return { kind: "bool", value: false };
        if (this.peek()?.kind === "lparen") {
          this.next();
          const args: Node[] = [];
          if (this.peek()?.kind !== "rparen") {
            for (;;) {
              if (this.peek()?.kind === "comma") {
                args.push({ kind: "empty" });
                this.next();
                continue;
              }
              if (this.peek()?.kind === "rparen") break;
              args.push(this.parseExpression(1));
              if (this.peek()?.kind === "comma") {
                this.next();
                if (this.peek()?.kind === "rparen") args.push({ kind: "empty" });
                continue;
              }
              break;
            }
          }
          const closing = this.next();
          if (!closing || closing.kind !== "rparen") throw new Error("Missing )");
          return { kind: "fn", name: upper, args };
        }
        return { kind: "name", value: upper };
      }
      case "lparen": {
        const node = this.parseExpression(1);
        const closing = this.next();
        if (!closing || closing.kind !== "rparen") throw new Error("Missing )");
        return node;
      }
      case "op":
        if (token.value === "+") return this.parseUnary();
        if (token.value === "-") return { kind: "un", op: "-", value: this.parseUnary() };
        throw new Error("Unexpected operator");
      default:
        throw new Error("Unexpected token");
    }
  }
}

const parseCache = new Map<string, Node>();

function parseFormula(formula: string): Node {
  const cached = parseCache.get(formula);
  if (cached) return cached;
  const node = new Parser(tokenize(formula)).parse();
  if (parseCache.size > 800) parseCache.clear();
  parseCache.set(formula, node);
  return node;
}

/* ------------------------------------------------------------------ values */

export function matrix(rows: Scalar[][]): Matrix {
  return { matrix: rows };
}

function topLeft(value: Value): Scalar {
  if (isMatrix(value)) return value.matrix[0]?.[0] ?? "";
  return value;
}

function text(value: Scalar): string {
  if (isError(value)) return value.error;
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return String(value);
}

function toNumber(value: Scalar): number | CellError {
  if (isError(value)) return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : ERR.num;
  if (typeof value === "boolean") return value ? 1 : 0;
  const raw = value.trim();
  if (raw === "") return 0;
  const normalized = raw
    .replace(/^\$/, "")
    .replace(/,/g, "")
    .replace(/^\((.*)\)$/, "-$1");
  const percent = normalized.endsWith("%");
  const number = Number(percent ? normalized.slice(0, -1) : normalized);
  if (!Number.isFinite(number)) return ERR.value;
  return percent ? number / 100 : number;
}

function toBool(value: Scalar): boolean | CellError {
  if (isError(value)) return value;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const raw = value.trim().toUpperCase();
  if (raw === "" || raw === "FALSE") return false;
  if (raw === "TRUE") return true;
  return true;
}

function sameValue(a: Scalar, b: Scalar): boolean {
  if (isError(a) || isError(b)) return false;
  if (typeof a === "number" || typeof b === "number") {
    const na = toNumber(a);
    const nb = toNumber(b);
    if (typeof na === "number" && typeof nb === "number") return Math.abs(na - nb) < 1e-10;
  }
  return text(a).toLowerCase() === text(b).toLowerCase();
}

function compare(a: Scalar, b: Scalar): number {
  const na = toNumber(a);
  const nb = toNumber(b);
  if (typeof na === "number" && typeof nb === "number") return na - nb;
  return text(a).toLowerCase().localeCompare(text(b).toLowerCase());
}

function flatten(values: Value[]): Scalar[] {
  const out: Scalar[] = [];
  for (const value of values) {
    if (isMatrix(value)) {
      for (const row of value.matrix) out.push(...row);
    } else {
      out.push(value);
    }
  }
  return out;
}

function numbers(values: Value[]): number[] {
  const out: number[] = [];
  for (const value of values) {
    if (isMatrix(value)) {
      for (const row of value.matrix) {
        for (const cell of row) {
          if (typeof cell === "number" && Number.isFinite(cell)) out.push(cell);
          else if (typeof cell === "boolean") out.push(cell ? 1 : 0);
        }
      }
      continue;
    }
    if (typeof value === "number" && Number.isFinite(value)) out.push(value);
    else if (typeof value === "boolean") out.push(value ? 1 : 0);
    else if (typeof value === "string" && value.trim() !== "") {
      const parsed = toNumber(value);
      if (typeof parsed === "number") out.push(parsed);
    }
  }
  return out;
}

function firstError(values: Value[]): CellError | undefined {
  for (const value of flatten(values)) if (isError(value)) return value;
  return undefined;
}

/* ------------------------------------------------------------------ engine */

interface ResolvedRange {
  sheet: Sheet;
  rect: { r1: number; c1: number; r2: number; c2: number };
}

export class CalcEngine {
  private cache = new Map<string, Scalar>();
  private visiting = new Set<string>();

  constructor(private readonly workbook: Workbook) {}

  invalidate(): void {
    this.cache.clear();
  }

  scalarAt(sheet: Sheet, r: number, c: number): Scalar {
    const key = `${sheet.id}!${cellKey(r, c)}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;
    if (this.visiting.has(key)) return ERR.circ;
    this.visiting.add(key);
    let result: Value;
    try {
      result = this.evaluateRaw(sheet, sheet.cells[cellKey(r, c)]?.raw ?? "");
    } finally {
      this.visiting.delete(key);
    }
    const collapsed = topLeft(result);
    this.cache.set(key, collapsed);
    return collapsed;
  }

  private evaluateRaw(sheet: Sheet, raw: string): Value {
    if (raw.startsWith("=")) {
      try {
        const node = parseFormula(raw.slice(1));
        return this.evaluate(node, sheet);
      } catch {
        return ERR.name;
      }
    }
    return this.literal(raw);
  }

  literal(raw: string): Scalar {
    const trimmed = raw.trim();
    if (trimmed === "") return "";
    const upper = trimmed.toUpperCase();
    if (upper === "TRUE") return true;
    if (upper === "FALSE") return false;
    if (/^-?\$?\d[\d,]*(\.\d+)?%?$/.test(trimmed) || /^-?\(\$?\d[\d,]*(\.\d+)?\)$/.test(trimmed)) {
      const n = toNumber(trimmed);
      if (typeof n === "number") return n;
    }
    return raw;
  }

  resolveRange(sheet: Sheet, address: string): ResolvedRange | null {
    const bang = address.lastIndexOf("!");
    if (bang >= 0) {
      const name = address.slice(0, bang).replace(/^'|'$/g, "").replace(/''/g, "'");
      const target = sheetByName(this.workbook, name);
      if (!target) return null;
      const rect = parseRectAddress(address.slice(bang + 1));
      return rect ? { sheet: target, rect } : null;
    }
    const rect = parseRectAddress(address);
    return rect ? { sheet, rect } : null;
  }

  matrixOf(sheet: Sheet, address: string): Scalar[][] {
    const resolved = this.resolveRange(sheet, address);
    if (!resolved) return [[ERR.ref]];
    const rows: Scalar[][] = [];
    for (let r = resolved.rect.r1; r <= resolved.rect.r2; r += 1) {
      const row: Scalar[] = [];
      for (let c = resolved.rect.c1; c <= resolved.rect.c2; c += 1) row.push(this.scalarAt(resolved.sheet, r, c));
      rows.push(row);
    }
    return rows;
  }

  /** Raw values for charts / conditional formatting (numbers stay numbers). */
  numeric(sheet: Sheet, r: number, c: number): number | null {
    const value = this.scalarAt(sheet, r, c);
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") {
      const n = toNumber(value);
      if (typeof n === "number") return n;
    }
    return null;
  }

  private evaluate(node: Node, sheet: Sheet): Value {
    switch (node.kind) {
      case "num":
        return node.value;
      case "str":
        return node.value;
      case "bool":
        return node.value;
      case "empty":
        return "";
      case "ref": {
        const target = node.sheet ? sheetByName(this.workbook, node.sheet) : sheet;
        if (!target) return ERR.ref;
        if (node.r1 === node.r2 && node.c1 === node.c2) return this.scalarAt(target, node.r1, node.c1);
        const rows: Scalar[][] = [];
        for (let r = node.r1; r <= node.r2; r += 1) {
          const row: Scalar[] = [];
          for (let c = node.c1; c <= node.c2; c += 1) row.push(this.scalarAt(target, r, c));
          rows.push(row);
        }
        return matrix(rows);
      }
      case "name": {
        const named = this.workbook.names[node.value] ?? this.workbook.names[node.value.toLowerCase()];
        if (!named) return ERR.name;
        const resolved = this.resolveRange(sheet, named);
        if (!resolved) return ERR.ref;
        const rows: Scalar[][] = [];
        for (let r = resolved.rect.r1; r <= resolved.rect.r2; r += 1) {
          const row: Scalar[] = [];
          for (let c = resolved.rect.c1; c <= resolved.rect.c2; c += 1) row.push(this.scalarAt(resolved.sheet, r, c));
          rows.push(row);
        }
        return rows.length === 1 && rows[0].length === 1 ? rows[0][0] : matrix(rows);
      }
      case "un": {
        if (node.op === "%") {
          const value = this.evaluate(node.value, sheet);
          const n = toNumber(topLeft(value));
          return isError(n) ? n : n / 100;
        }
        const value = this.evaluate(node.value, sheet);
        const n = toNumber(topLeft(value));
        if (isError(n)) return n;
        return node.op === "-" ? -n : n;
      }
      case "bin":
        return this.binary(node, sheet);
      case "fn":
        return this.call(node.name, node.args, sheet);
      default:
        return ERR.value;
    }
  }

  private binary(node: Extract<Node, { kind: "bin" }>, sheet: Sheet): Value {
    const left = this.evaluate(node.left, sheet);
    const right = this.evaluate(node.right, sheet);
    const a = topLeft(left);
    const b = topLeft(right);
    if (isError(a)) return a;
    if (isError(b)) return b;
    switch (node.op) {
      case "&":
        return text(a) + text(b);
      case "=":
      case "<>":
      case "<":
      case ">":
      case "<=":
      case ">=": {
        const result =
          node.op === "="
            ? sameValue(a, b)
            : node.op === "<>"
            ? !sameValue(a, b)
            : node.op === "<"
            ? compare(a, b) < 0
            : node.op === ">"
            ? compare(a, b) > 0
            : node.op === "<="
            ? compare(a, b) <= 0
            : compare(a, b) >= 0;
        return result;
      }
      default: {
        const na = toNumber(a);
        const nb = toNumber(b);
        if (isError(na)) return na;
        if (isError(nb)) return nb;
        switch (node.op) {
          case "+":
            return na + nb;
          case "-":
            return na - nb;
          case "*":
            return na * nb;
          case "/":
            return nb === 0 ? ERR.div0 : na / nb;
          case "^":
            return Math.pow(na, nb);
          default:
            return ERR.value;
        }
      }
    }
  }

  private call(name: string, argNodes: Node[], sheet: Sheet): Value {
    const args = argNodes.map(node => this.evaluate(node, sheet));

    switch (name) {
      case "IF": {
        const condition = toBool(topLeft(args[0] ?? ""));
        if (isError(condition)) return condition;
        if (condition) return args[1] ?? true;
        return args[2] ?? false;
      }
      case "IFERROR": {
        const value = topLeft(args[0] ?? "");
        return isError(value) ? args[1] ?? "" : value;
      }
      case "IFNA": {
        const value = topLeft(args[0] ?? "");
        return isError(value) && value.error === "#N/A" ? args[1] ?? "" : value;
      }
      case "IFS": {
        for (let i = 0; i + 1 < args.length; i += 2) {
          const condition = toBool(topLeft(args[i]));
          if (isError(condition)) return condition;
          if (condition) return args[i + 1];
        }
        return ERR.na;
      }
      case "AND": {
        for (const value of flatten(args)) {
          if (isError(value)) return value;
          const bool = toBool(value);
          if (isError(bool)) return bool;
          if (!bool) return false;
        }
        return true;
      }
      case "OR": {
        for (const value of flatten(args)) {
          if (isError(value)) return value;
          const bool = toBool(value);
          if (isError(bool)) return bool;
          if (bool) return true;
        }
        return false;
      }
      case "NOT": {
        const bool = toBool(topLeft(args[0] ?? ""));
        return isError(bool) ? bool : !bool;
      }
      case "TRUE":
        return true;
      case "FALSE":
        return false;
      default:
        break;
    }

    const error = firstError(args);
    if (error) return error;

    switch (name) {
      case "SUM":
        return numbers(args).reduce((sum, value) => sum + value, 0);
      case "PRODUCT": {
        const values = numbers(args);
        return values.length ? values.reduce((product, value) => product * value, 1) : 0;
      }
      case "AVERAGE": {
        const values = numbers(args);
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : ERR.div0;
      }
      case "MIN": {
        const values = numbers(args);
        return values.length ? Math.min(...values) : 0;
      }
      case "MAX": {
        const values = numbers(args);
        return values.length ? Math.max(...values) : 0;
      }
      case "COUNT":
        return numbers(args).length;
      case "COUNTA":
        return flatten(args).filter(value => value !== "" && value !== null && value !== undefined).length;
      case "COUNTBLANK":
        return flatten(args).filter(value => value === "").length;
      case "MEDIAN": {
        const values = numbers(args).sort((a, b) => a - b);
        if (!values.length) return ERR.num;
        const mid = Math.floor(values.length / 2);
        return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
      }
      case "STDEV.S":
      case "STDEV": {
        const values = numbers(args);
        if (values.length < 2) return ERR.div0;
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1));
      }
      case "VAR.S":
      case "VAR": {
        const values = numbers(args);
        if (values.length < 2) return ERR.div0;
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
      }
      case "ABS":
        return Math.abs(requireNumber(args[0]));
      case "ROUND":
        return roundTo(requireNumber(args[0]), Math.trunc(requireNumber(args[1] ?? 0)), "round");
      case "ROUNDUP":
        return roundTo(requireNumber(args[0]), Math.trunc(requireNumber(args[1] ?? 0)), "up");
      case "ROUNDDOWN":
        return roundTo(requireNumber(args[0]), Math.trunc(requireNumber(args[1] ?? 0)), "down");
      case "INT":
        return Math.floor(requireNumber(args[0]));
      case "TRUNC": {
        const digits = Math.trunc(requireNumber(args[1] ?? 0));
        const factor = 10 ** digits;
        const value = requireNumber(args[0]);
        return Math.trunc(value * factor) / factor;
      }
      case "SQRT": {
        const value = requireNumber(args[0]);
        return value < 0 ? ERR.num : Math.sqrt(value);
      }
      case "POWER":
        return Math.pow(requireNumber(args[0]), requireNumber(args[1]));
      case "MOD": {
        const divisor = requireNumber(args[1]);
        return divisor === 0 ? ERR.div0 : requireNumber(args[0]) % divisor;
      }
      case "SIGN":
        return Math.sign(requireNumber(args[0]));
      case "EXP":
        return Math.exp(requireNumber(args[0]));
      case "LN":
        return Math.log(requireNumber(args[0]));
      case "LOG": {
        const base = requireNumber(args[1] ?? 10);
        return Math.log(requireNumber(args[0])) / Math.log(base);
      }
      case "PI":
        return Math.PI;
      case "RAND":
        return Math.random();
      case "RANDBETWEEN": {
        const low = Math.ceil(requireNumber(args[0]));
        const high = Math.floor(requireNumber(args[1]));
        return low + Math.floor(Math.random() * (high - low + 1));
      }
      case "CEILING": {
        const base = requireNumber(args[1] ?? 1);
        return base === 0 ? 0 : Math.ceil(requireNumber(args[0]) / base) * base;
      }
      case "FLOOR": {
        const base = requireNumber(args[1] ?? 1);
        return base === 0 ? 0 : Math.floor(requireNumber(args[0]) / base) * base;
      }
      case "MROUND": {
        const multiple = requireNumber(args[1]);
        return multiple === 0 ? 0 : Math.round(requireNumber(args[0]) / multiple) * multiple;
      }
      case "LARGE":
      case "SMALL": {
        const values = numbers([args[0]]).sort((a, b) => (name === "LARGE" ? b - a : a - b));
        const index = Math.trunc(requireNumber(args[1]));
        return values[index - 1] ?? ERR.num;
      }
      case "RANK.EQ":
      case "RANK": {
        const values = numbers([args[1]]).sort((a, b) => (requireNumber(args[2] ?? 0) === 0 ? b - a : a - b));
        const index = values.indexOf(requireNumber(args[0]));
        return index < 0 ? ERR.na : index + 1;
      }
      case "SUBTOTAL": {
        const code = Math.trunc(requireNumber(args[0]));
        const values = numbers(args.slice(1));
        switch (code) {
          case 1:
          case 101:
            return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : ERR.div0;
          case 2:
          case 102:
            return values.length;
          case 3:
          case 103:
            return flatten(args.slice(1)).filter(value => value !== "").length;
          case 4:
          case 104:
            return values.length ? Math.max(...values) : 0;
          case 5:
          case 105:
            return values.length ? Math.min(...values) : 0;
          case 9:
          case 109:
          default:
            return values.reduce((sum, value) => sum + value, 0);
        }
      }
      case "SUMIF":
        return conditionalSum(args, "sum");
      case "SUMIFS": {
        const ranges = args.slice(1);
        return multiCriteriaAggregate([args[0]], ranges, "sum");
      }
      case "COUNTIF":
        return conditionalSum(args, "count");
      case "COUNTIFS":
        return multiCriteriaAggregate(args, args, "count");
      case "AVERAGEIF":
        return conditionalSum(args, "average");
      case "AVERAGEIFS": {
        const ranges = args.slice(1);
        return multiCriteriaAggregate([args[0]], ranges, "average");
      }
      case "SUMPRODUCT": {
        const arrays: number[][] = args.map(value =>
          isMatrix(value) ? flatten([value]).map(v => toNumber(v) as number) : [requireNumber(value)]
        );
        const length = Math.min(...arrays.map(array => array.length));
        let total = 0;
        for (let i = 0; i < length; i += 1) {
          let product = 1;
          for (const array of arrays) product *= array[i] ?? 0;
          total += product;
        }
        return total;
      }
      case "MAXIFS":
      case "MINIFS": {
        const data = args[0];
        const filtered = valuesMatching(data, args.slice(1));
        const values = filtered.filter((value): value is number => typeof value === "number");
        if (!values.length) return 0;
        return name === "MAXIFS" ? Math.max(...values) : Math.min(...values);
      }
      case "VLOOKUP": {
        const table = args[1];
        if (!isMatrix(table)) return ERR.ref;
        const column = Math.trunc(requireNumber(args[2]));
        const exact = args[3] === undefined || args[3] === false || args[3] === 0;
        return lookupVertical(table.matrix, topLeft(args[0]), column, exact);
      }
      case "HLOOKUP": {
        const table = args[1];
        if (!isMatrix(table)) return ERR.ref;
        const rowIndex = Math.trunc(requireNumber(args[2]));
        const exact = args[3] === undefined || args[3] === false || args[3] === 0;
        const firstRow = table.matrix[0] ?? [];
        const needle = topLeft(args[0]);
        for (let c = 0; c < firstRow.length; c += 1) {
          if (sameValue(firstRow[c], needle)) {
            if (exact) return table.matrix[rowIndex - 1]?.[c] ?? ERR.na;
          }
        }
        return ERR.na;
      }
      case "XLOOKUP": {
        const lookup = topLeft(args[0]);
        const lookupArray = args[1];
        const returnArray = args[2];
        if (!isMatrix(lookupArray) || !isMatrix(returnArray)) return ERR.ref;
        const haystack = flatten([lookupArray]);
        const results = flatten([returnArray]);
        let found = -1;
        for (let i = 0; i < haystack.length; i += 1) {
          if (sameValue(haystack[i], lookup)) {
            found = i;
            break;
          }
        }
        if (found < 0) return args[3] !== undefined ? args[3] : ERR.na;
        return results[0] !== undefined && returnArray.matrix.length === 1
          ? results[found] ?? ERR.na
          : returnArray.matrix[found]?.[0] ?? ERR.na;
      }
      case "INDEX": {
        const table = args[0];
        if (!isMatrix(table)) return topLeft(table);
        const row = Math.trunc(requireNumber(args[1] ?? 1));
        const col = Math.trunc(requireNumber(args[2] ?? (table.matrix.length === 1 ? row : 1)));
        return table.matrix[row - 1]?.[table.matrix.length === 1 ? row - 1 : col - 1] ?? ERR.ref;
      }
      case "MATCH": {
        const lookup = topLeft(args[0]);
        const array = flatten([args[1]]);
        const mode = Math.trunc(requireNumber(args[2] ?? 1));
        let best = -1;
        for (let i = 0; i < array.length; i += 1) {
          if (sameValue(array[i], lookup)) return i + 1;
          if (mode !== 0 && best < 0 && compare(array[i], lookup) > 0) best = i;
        }
        return best > 0 ? best : ERR.na;
      }
      case "CHOOSE": {
        const index = Math.trunc(requireNumber(args[0]));
        return args[index] ?? ERR.value;
      }
      case "LEFT": {
        const count = Math.trunc(requireNumber(args[1] ?? 1));
        return text(topLeft(args[0])).slice(0, Math.max(0, count));
      }
      case "RIGHT": {
        const count = Math.trunc(requireNumber(args[1] ?? 1));
        const value = text(topLeft(args[0]));
        return count <= 0 ? "" : value.slice(-count);
      }
      case "MID": {
        const start = Math.trunc(requireNumber(args[1]));
        const count = Math.trunc(requireNumber(args[2]));
        return text(topLeft(args[0])).slice(Math.max(0, start - 1), Math.max(0, start - 1) + Math.max(0, count));
      }
      case "LEN":
        return text(topLeft(args[0])).length;
      case "UPPER":
        return text(topLeft(args[0])).toUpperCase();
      case "LOWER":
        return text(topLeft(args[0])).toLowerCase();
      case "PROPER":
        return text(topLeft(args[0])).replace(/\b\w/g, char => char.toUpperCase());
      case "TRIM":
        return text(topLeft(args[0])).replace(/\s+/g, " ").trim();
      case "CONCAT":
      case "CONCATENATE":
        return flatten(args).map(text).join("");
      case "TEXTJOIN": {
        const delimiter = text(topLeft(args[0]));
        const ignoreEmpty = toBool(topLeft(args[1]));
        const values = flatten(args.slice(2))
          .map(text)
          .filter(value => !ignoreEmpty || value !== "");
        return values.join(delimiter);
      }
      case "REPT":
        return text(topLeft(args[0])).repeat(Math.max(0, Math.trunc(requireNumber(args[1]))));
      case "SUBSTITUTE": {
        const source = text(topLeft(args[0]));
        const search = text(topLeft(args[1]));
        const replacement = text(topLeft(args[2]));
        return search ? source.split(search).join(replacement) : source;
      }
      case "FIND":
      case "SEARCH": {
        const needle = text(topLeft(args[0]));
        const haystack = text(topLeft(args[1]));
        const start = Math.trunc(requireNumber(args[2] ?? 1)) - 1;
        const index =
          name === "FIND"
            ? haystack.indexOf(needle, start)
            : haystack.toLowerCase().indexOf(needle.toLowerCase(), start);
        return index < 0 ? ERR.value : index + 1;
      }
      case "VALUE": {
        const n = toNumber(topLeft(args[0]));
        return typeof n === "number" ? n : ERR.value;
      }
      case "TEXT": {
        const n = toNumber(topLeft(args[0]));
        if (isError(n)) return n;
        return formatNumberPattern(n, text(topLeft(args[1] ?? "0")));
      }
      case "TODAY":
        return todaySerial();
      case "NOW":
        return todaySerial() + (Date.now() % 86400000) / 86400000;
      case "YEAR":
      case "MONTH":
      case "DAY": {
        const date = parseDateValue(topLeft(args[0]));
        if (!date) return ERR.value;
        return name === "YEAR" ? date.getFullYear() : name === "MONTH" ? date.getMonth() + 1 : date.getDate();
      }
      case "DATE": {
        const date = new Date(
          Math.trunc(requireNumber(args[0])),
          Math.trunc(requireNumber(args[1])) - 1,
          Math.trunc(requireNumber(args[2]))
        );
        return dateSerial(date);
      }
      case "COUNTUNIQUE": {
        const seen = new Set(flatten(args).map(text));
        return seen.size;
      }
      case "EXACT":
        return text(topLeft(args[0])) === text(topLeft(args[1]));
      default:
        return ERR.name;
    }
  }
}

function requireNumber(value: Value | undefined): number {
  if (value === undefined) return 0;
  const n = toNumber(topLeft(value));
  return isError(n) ? NaN : n;
}

function roundTo(value: number, digits: number, mode: "round" | "up" | "down"): number {
  const factor = 10 ** digits;
  if (mode === "round") return Math.round(value * factor) / factor;
  const scaled = value * factor;
  return (mode === "up" ? Math.ceil(scaled) : Math.floor(scaled)) / factor;
}

function lookupVertical(rows: Scalar[][], needle: Scalar, column: number, exact: boolean): Scalar {
  let best: Scalar = ERR.na;
  for (const row of rows) {
    if (row.length === 0) continue;
    if (sameValue(row[0], needle)) return row[column - 1] ?? ERR.ref;
    if (!exact && compare(row[0], needle) <= 0) best = row[column - 1] ?? ERR.ref;
  }
  return exact ? ERR.na : best;
}

function parseRectAddress(address: string): { r1: number; c1: number; r2: number; c2: number } | null {
  const [a, b] = address.split(":");
  const start = parseAddress(a);
  if (!start) return null;
  const end = b ? parseAddress(b) : start;
  if (!end) return null;
  return {
    r1: Math.min(start.r, end.r),
    c1: Math.min(start.c, end.c),
    r2: Math.max(start.r, end.r),
    c2: Math.max(start.c, end.c)
  };
}

function matchesCriteria(value: Scalar, criteria: Scalar): boolean {
  if (typeof criteria === "number" || typeof criteria === "boolean") return sameValue(value, criteria);
  const raw = text(criteria);
  const match = /^(<=|>=|<>|=|<|>)(.*)$/.exec(raw);
  if (!match) return wildcardMatch(text(value), raw);
  const operator = match[1];
  const operandRaw = match[2];
  const operandNum = Number(operandRaw);
  const operand: Scalar = operandRaw.trim() !== "" && Number.isFinite(operandNum) ? operandNum : operandRaw;
  switch (operator) {
    case "=":
      return wildcardMatch(text(value), text(operand));
    case "<>":
      return !wildcardMatch(text(value), text(operand));
    case "<":
      return compare(value, operand) < 0;
    case ">":
      return compare(value, operand) > 0;
    case "<=":
      return compare(value, operand) <= 0;
    case ">=":
      return compare(value, operand) >= 0;
    default:
      return false;
  }
}

function wildcardMatch(value: string, pattern: string): boolean {
  if (!/[?*]/.test(pattern)) return value.toLowerCase() === pattern.toLowerCase();
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`, "i").test(value);
}

function conditionalSum(args: Value[], mode: "sum" | "count" | "average"): Scalar {
  const range = flatten([args[0]]);
  const criteria = topLeft(args[1] ?? "");
  const sumRange = args[2] !== undefined ? flatten([args[2]]) : range;
  const selected = range.map((value, index) => (matchesCriteria(value, criteria) ? sumRange[index] : undefined));
  if (mode === "count") return selected.filter(value => value !== undefined).length;
  const values = selected.filter((value): value is number => typeof value === "number");
  if (mode === "average")
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : ERR.div0;
  return values.reduce((sum, value) => sum + value, 0);
}

function valuesMatching(data: Value, criteriaPairs: Value[]): Scalar[] {
  const values = flatten([data]);
  const masks: boolean[][] = [];
  for (let i = 0; i + 1 < criteriaPairs.length; i += 2) {
    const range = flatten([criteriaPairs[i]]);
    const criteria = topLeft(criteriaPairs[i + 1] ?? "");
    masks.push(range.map(value => matchesCriteria(value, criteria)));
  }
  return values.filter((_, index) => masks.every(mask => mask[index]));
}

function multiCriteriaAggregate(dataArgs: Value[], rangeArgs: Value[], mode: "sum" | "count" | "average"): Scalar {
  const selected = valuesMatching(dataArgs[0], rangeArgs);
  if (mode === "count") return selected.length;
  const values = selected.filter((value): value is number => typeof value === "number");
  if (mode === "average")
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : ERR.div0;
  return values.reduce((sum, value) => sum + value, 0);
}

function formatNumberPattern(value: number, pattern: string): string {
  const decimalsMatch = /\.([0#]+)/.exec(pattern);
  const decimals = decimalsMatch ? decimalsMatch[1].length : 0;
  const grouped = pattern.includes(",");
  const percent = pattern.includes("%");
  const currency = pattern.includes("$");
  const scaled = percent ? value * 100 : value;
  let body = grouped
    ? scaled.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : scaled.toFixed(decimals);
  if (currency) body = `$${body}`;
  return `${body}${percent ? "%" : ""}`;
}

function dateSerial(date: Date): number {
  const epoch = Date.UTC(1899, 11, 30);
  return Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - epoch) / 86400000);
}

function todaySerial(): number {
  return dateSerial(new Date());
}

function parseDateValue(value: Scalar): Date | null {
  if (typeof value === "number") {
    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + value * 86400000);
  }
  const date = new Date(text(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

/* ------------------------------------------------------------------ formulas as text */

const REF_SCAN = /(?:(?:'(?:[^']|'')+'|[A-Za-z_][A-Za-z0-9_.]*)!)?\$?[A-Za-z]{1,2}\$?[0-9]+/g;

export interface FormulaRef {
  sheet?: string;
  address: string;
  row: number;
  col: number;
  absoluteRow: boolean;
  absoluteCol: boolean;
}

/** Walk the reference-looking fragments of a formula, skipping string literals. */
export function scanRefs(formula: string): FormulaRef[] {
  const refs: FormulaRef[] = [];
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === '"') {
      i += 1;
      while (i < formula.length) {
        if (formula[i] === '"') {
          if (formula[i + 1] === '"') {
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    REF_SCAN.lastIndex = i;
    const match = REF_SCAN.exec(formula);
    if (match && match.index === i) {
      const raw = match[0];
      const bang = raw.lastIndexOf("!");
      const sheetPart = bang >= 0 ? raw.slice(0, bang) : undefined;
      const addressPart = bang >= 0 ? raw.slice(bang + 1) : raw;
      const parsed = /\$?([A-Za-z]{1,2})\$?([0-9]+)/.exec(addressPart);
      if (parsed) {
        refs.push({
          sheet: sheetPart ? sheetPart.replace(/^'|'$/g, "").replace(/''/g, "'") : undefined,
          address: addressPart.replace(/\$/g, "").toUpperCase(),
          row: Number(parsed[2]) - 1,
          col: colIndex(parsed[1]),
          absoluteRow: addressPart.includes(`$${parsed[2]}`),
          absoluteCol: /\$[A-Za-z]/.test(addressPart)
        });
      }
      i += raw.length;
      continue;
    }
    i += 1;
  }
  return refs;
}

/** Shift relative references, used by fill and copy/paste. */
export function adjustFormula(formula: string, deltaRows: number, deltaCols: number): string {
  if (!formula.startsWith("=")) return formula;
  let result = "";
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === '"') {
      const start = i;
      i += 1;
      while (i < formula.length) {
        if (formula[i] === '"') {
          if (formula[i + 1] === '"') {
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        i += 1;
      }
      result += formula.slice(start, i);
      continue;
    }
    REF_SCAN.lastIndex = i;
    const match = REF_SCAN.exec(formula);
    if (match && match.index === i) {
      const raw = match[0];
      const bang = raw.lastIndexOf("!");
      const prefix = bang >= 0 ? raw.slice(0, bang + 1) : "";
      const addressPart = bang >= 0 ? raw.slice(bang + 1) : raw;
      const piece = /^(\$?)([A-Za-z]{1,2})(\$?)([0-9]+)$/.exec(addressPart);
      if (piece) {
        const colAbs = piece[1] === "$";
        const rowAbs = piece[3] === "$";
        const col = colIndex(piece[2]) + (colAbs ? 0 : deltaCols);
        const row = Number(piece[4]) - 1 + (rowAbs ? 0 : deltaRows);
        if (col < 0 || row < 0 || col >= COLS || row >= ROWS) {
          result += "#REF!";
        } else {
          const letters = (colAbs ? "$" : "") + colName(col);
          result += `${prefix}${letters}${rowAbs ? "$" : ""}${row + 1}`;
        }
        i += raw.length;
        continue;
      }
      result += raw;
      i += raw.length;
      continue;
    }
    result += formula[i];
    i += 1;
  }
  return result;
}

/** Rewrite references while preserving sheets and absolute markers. */
export function remapFormula(
  formula: string,
  transform: (sheet: string | undefined, row: number, col: number) => { row: number; col: number } | null
): string {
  if (!formula.startsWith("=")) return formula;
  let result = "";
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === '"') {
      const start = i;
      i += 1;
      while (i < formula.length) {
        if (formula[i] === '"') {
          if (formula[i + 1] === '"') {
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        i += 1;
      }
      result += formula.slice(start, i);
      continue;
    }
    REF_SCAN.lastIndex = i;
    const match = REF_SCAN.exec(formula);
    if (match && match.index === i) {
      const raw = match[0];
      const bang = raw.lastIndexOf("!");
      const prefix = bang >= 0 ? raw.slice(0, bang + 1) : "";
      const sheetPart = bang >= 0 ? raw.slice(0, bang).replace(/^'|'$/g, "").replace(/''/g, "'") : undefined;
      const addressPart = bang >= 0 ? raw.slice(bang + 1) : raw;
      const piece = /^(\$?)([A-Za-z]{1,2})(\$?)([0-9]+)$/.exec(addressPart);
      if (piece) {
        const mapped = transform(sheetPart, Number(piece[4]) - 1, colIndex(piece[2]));
        if (!mapped) {
          result += "#REF!";
        } else {
          result += `${prefix}${piece[1]}${colName(mapped.col)}${piece[3]}${mapped.row + 1}`;
        }
        i += raw.length;
        continue;
      }
      result += raw;
      i += raw.length;
      continue;
    }
    result += formula[i];
    i += 1;
  }
  return result;
}
