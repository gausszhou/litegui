/**
 * Dependency-free PDF writer for the PdfCraft workbench demo.
 *
 * `buildPdf` turns the arranged pages into a valid PDF 1.4 document: base-14 fonts only
 * (Helvetica / Helvetica-Bold, no embedding), exact xref offsets and stream lengths, and
 * WinAnsi-safe literal strings. It touches no DOM API, so it also runs under Node.
 * `downloadPdf` is the only browser-facing helper: it wraps the bytes in a Blob and
 * triggers a download through a temporary anchor, then revokes the object URL.
 *
 * Usage:
 *   const bytes = buildPdf(
 *     [{ widthPt: 612, heightPt: 792, rotation: 0, title: "Report", subtitle: "Draft", lines: ["Hello (world)"] }],
 *     { title: "Report", author: "PdfCraft", subject: "Demo", keywords: "pdf, demo" }
 *   );
 *   downloadPdf("report.pdf", bytes);
 *
 * Layout is deliberately simple: 54pt margins, body text at 10.5pt on 15pt leading with
 * real Helvetica advance-width tables for wrapping, a 20pt title, a thin rule, and a centred
 * page-number footer 36pt from the bottom. Body text that runs past the bottom margin is
 * clipped rather than repaginated, because the caller already decided the page breaks.
 * A `dark` page gets a full-bleed charcoal background with warm off-white text.
 */

export interface ExportPage {
  widthPt: number;
  heightPt: number;
  rotation: 0 | 90 | 180 | 270;
  title?: string;
  subtitle?: string;
  lines: string[];
  dark?: boolean;
}

/** Document metadata written into the PDF /Info dictionary. */
export interface ExportMeta {
  title: string;
  author: string;
  subject: string;
  keywords: string;
}

const MARGIN = 54;
const BODY_SIZE = 10.5;
const BODY_LEADING = 15;
const TITLE_SIZE = 20;
const TITLE_LEADING = 24;
const SUBTITLE_SIZE = 10;
const SUBTITLE_LEADING = 14;
const FOOTER_SIZE = 8.5;
const FOOTER_BASELINE = 36;
const FALLBACK_WIDTH = 612;
const FALLBACK_HEIGHT = 792;

const INK = "0.12 0.12 0.14";
const MUTED = "0.42 0.42 0.46";
const RULE = "0.78 0.78 0.80";
const FOOTER = "0.45 0.45 0.49";
const DARK_BG = "0.11 0.10 0.13";
const DARK_INK = "0.96 0.94 0.90";
const DARK_MUTED = "0.72 0.70 0.74";
const DARK_RULE = "0.38 0.37 0.42";
const DARK_FOOTER = "0.62 0.60 0.64";

/** Helvetica advance widths for ASCII 32..126, in 1/1000 em (base-14 AFM values). */
const HELVETICA_WIDTHS: readonly number[] = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556,
  556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334,
  260, 334, 584
];

/** Helvetica-Bold advance widths for ASCII 32..126, in 1/1000 em (base-14 AFM values). */
const HELVETICA_BOLD_WIDTHS: readonly number[] = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611,
  556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389,
  280, 389, 584
];

/**
 * Characters outside WinAnsi that still have an obvious ASCII reading. Anything not listed
 * here and above U+00FF becomes "?", so the writer never emits bytes a base-14 font cannot show.
 */
const ASCII_SUBSTITUTIONS = new Map<number, string>([
  [0x00a0, " "],
  [0x00ad, ""],
  [0x2007, " "],
  [0x2008, " "],
  [0x2009, " "],
  [0x200a, " "],
  [0x200b, ""],
  [0x200c, ""],
  [0x200d, ""],
  [0x2028, " "],
  [0x2029, " "],
  [0xfeff, ""],
  [0x2010, "-"],
  [0x2011, "-"],
  [0x2012, "-"],
  [0x2013, "-"],
  [0x2014, "-"],
  [0x2015, "-"],
  [0x2212, "-"],
  [0x2018, "'"],
  [0x2019, "'"],
  [0x201a, "'"],
  [0x201b, "'"],
  [0x2032, "'"],
  [0x201c, '"'],
  [0x201d, '"'],
  [0x201e, '"'],
  [0x201f, '"'],
  [0x2033, '"'],
  [0x2026, "..."],
  [0x2022, "*"],
  [0x00b7, "-"],
  [0x2190, "<-"],
  [0x2192, "->"],
  [0x2194, "<->"],
  [0x2264, "<="],
  [0x2265, ">="],
  [0x2260, "!="],
  [0x221e, "infinity"],
  [0xfb01, "fi"],
  [0xfb02, "fl"]
]);

function normalizeRotation(value: number): 0 | 90 | 180 | 270 {
  return value === 90 || value === 180 || value === 270 ? value : 0;
}

function positive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function num(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  return String(Math.round(value * 1000) / 1000);
}

/**
 * Converts arbitrary UI text into a WinAnsi-safe string: tabs/newlines become spaces, control
 * characters are dropped, typographic quotes and dashes fall back to ASCII, and anything a
 * base-14 font cannot encode becomes "?".
 */
function sanitizeText(input: string): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 0x09 || code === 0x0a || code === 0x0d) {
      out += " ";
      continue;
    }
    if (code < 0x20 || (code >= 0x7f && code <= 0x9f)) {
      continue;
    }
    const substituted = ASCII_SUBSTITUTIONS.get(code);
    if (substituted !== undefined) {
      out += substituted;
      continue;
    }
    out += code <= 0xff ? char : "?";
  }
  return out;
}

/** Escape the three characters that are special inside a PDF literal string. */
function escapePdfString(text: string): string {
  return text.replace(/[\\()]/g, match => `\\${match}`);
}

function measureText(text: string, size: number, bold: boolean): number {
  const table = bold ? HELVETICA_BOLD_WIDTHS : HELVETICA_WIDTHS;
  let units = 0;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    units += code >= 0x20 && code <= 0x7e ? table[code - 0x20] : 556;
  }
  return (units / 1000) * size;
}

/** Split a single over-long word so it cannot overflow the text column. */
function breakWord(word: string, size: number, bold: boolean, maxWidth: number): string[] {
  const pieces: string[] = [];
  let current = "";
  for (const char of word) {
    const candidate = current + char;
    if (current.length > 0 && measureText(candidate, size, bold) > maxWidth) {
      pieces.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) {
    pieces.push(current);
  }
  return pieces;
}

/** Greedy word wrap with a hard break for words wider than the column. */
function wrapText(text: string, size: number, bold: boolean, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line.length === 0 ? word : `${line} ${word}`;
    if (measureText(candidate, size, bold) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line.length > 0) {
      lines.push(line);
    }
    if (measureText(word, size, bold) > maxWidth) {
      const pieces = breakWord(word, size, bold, maxWidth);
      for (let index = 0; index < pieces.length - 1; index += 1) {
        lines.push(pieces[index]);
      }
      line = pieces[pieces.length - 1] ?? "";
    } else {
      line = word;
    }
  }
  if (line.length > 0) {
    lines.push(line);
  }
  if (lines.length === 0) {
    lines.push("");
  }
  return lines;
}

interface TextStyle {
  size: number;
  font: "F1" | "F2";
  color: string;
}

/** One absolutely positioned, self-contained text object. */
function textBlock(text: string, x: number, baseline: number, style: TextStyle): string {
  return [
    "BT",
    `/${style.font} ${num(style.size)} Tf`,
    `${style.color} rg`,
    `1 0 0 1 ${num(x)} ${num(baseline)} Tm`,
    `(${escapePdfString(text)}) Tj`,
    "ET"
  ].join("\n");
}

function ruleBlock(x1: number, x2: number, baseline: number, color: string): string {
  return [`${color} RG`, "0.6 w", `${num(x1)} ${num(baseline)} m`, `${num(x2)} ${num(baseline)} l`, "S"].join("\n");
}

/** Page-local transform so rotated pages read upright once a viewer applies /Rotate. */
function rotationTransform(rotation: 0 | 90 | 180 | 270, widthPt: number, heightPt: number): string {
  switch (rotation) {
    case 90:
      return `0 1 -1 0 ${num(widthPt)} 0 cm`;
    case 180:
      return `-1 0 0 -1 ${num(widthPt)} ${num(heightPt)} cm`;
    case 270:
      return `0 -1 1 0 0 ${num(heightPt)} cm`;
    default:
      return "";
  }
}

function buildPageContent(page: ExportPage, pageNumber: number): Uint8Array {
  const rotation = normalizeRotation(page.rotation);
  const widthPt = positive(page.widthPt, FALLBACK_WIDTH);
  const heightPt = positive(page.heightPt, FALLBACK_HEIGHT);
  const landscape = rotation === 90 || rotation === 270;
  const frameWidth = landscape ? heightPt : widthPt;
  const frameHeight = landscape ? widthPt : heightPt;
  const available = Math.max(60, frameWidth - MARGIN * 2);
  const dark = page.dark === true;
  const ink = dark ? DARK_INK : INK;
  const muted = dark ? DARK_MUTED : MUTED;
  const commands: string[] = ["q"];
  const transform = rotationTransform(rotation, widthPt, heightPt);
  if (transform.length > 0) {
    commands.push(transform);
  }
  if (dark) {
    commands.push(`${DARK_BG} rg`, `0 0 ${num(frameWidth)} ${num(frameHeight)} re`, "f");
  }

  let cursor = frameHeight - MARGIN;
  const title = page.title ?? "";
  const subtitle = page.subtitle ?? "";
  const hasTitle = title.length > 0;
  const hasSubtitle = subtitle.length > 0;

  if (hasTitle) {
    for (const line of wrapText(sanitizeText(title), TITLE_SIZE, true, available)) {
      if (line.length > 0) {
        commands.push(
          textBlock(line, MARGIN, cursor - TITLE_SIZE * 0.78, { size: TITLE_SIZE, font: "F2", color: ink })
        );
      }
      cursor -= TITLE_LEADING;
    }
  }

  if (hasSubtitle) {
    for (const line of wrapText(sanitizeText(subtitle), SUBTITLE_SIZE, false, available)) {
      if (line.length > 0) {
        commands.push(
          textBlock(line, MARGIN, cursor - SUBTITLE_SIZE * 0.78, { size: SUBTITLE_SIZE, font: "F1", color: muted })
        );
      }
      cursor -= SUBTITLE_LEADING;
    }
  }

  if (hasTitle || hasSubtitle) {
    cursor -= 8;
    commands.push(ruleBlock(MARGIN, MARGIN + available, cursor, dark ? DARK_RULE : RULE));
    cursor -= 16;
  }

  let baseline = cursor - BODY_SIZE * 0.78;
  const rawLines = page.lines.flatMap(line => line.split(/\r\n|[\r\n]/));
  for (const rawLine of rawLines) {
    const bodyLines = wrapText(sanitizeText(rawLine), BODY_SIZE, false, available);
    for (const line of bodyLines) {
      if (baseline < MARGIN) {
        break;
      }
      if (line.length > 0) {
        commands.push(textBlock(line, MARGIN, baseline, { size: BODY_SIZE, font: "F1", color: ink }));
      }
      baseline -= BODY_LEADING;
    }
    if (baseline < MARGIN) {
      break;
    }
  }

  const footer = String(pageNumber);
  const footerWidth = measureText(footer, FOOTER_SIZE, false);
  commands.push(
    textBlock(footer, (frameWidth - footerWidth) / 2, FOOTER_BASELINE, {
      size: FOOTER_SIZE,
      font: "F1",
      color: dark ? DARK_FOOTER : FOOTER
    })
  );
  commands.push("Q");

  return toLatin1Bytes(`${commands.join("\n")}\n`);
}

function toLatin1Bytes(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);
  for (let index = 0; index < text.length; index += 1) {
    bytes[index] = text.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function blankPage(): ExportPage {
  return { widthPt: FALLBACK_WIDTH, heightPt: FALLBACK_HEIGHT, rotation: 0, lines: [] };
}

/** Concatenate the chunk list into the final file buffer. */
function concatChunks(chunks: Uint8Array[], byteLength: number): Uint8Array {
  const output = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function padOffset(offset: number): string {
  return String(offset).padStart(10, "0");
}

/** Build a complete, valid PDF 1.4 file from the arranged pages. */
export function buildPdf(pages: ExportPage[], meta: ExportMeta): Uint8Array {
  const effectivePages = pages.length > 0 ? pages : [blankPage()];
  const totalPages = effectivePages.length;
  const firstPageObject = 6;
  const kids = effectivePages.map((_, index) => `${firstPageObject + index * 2} 0 R`).join(" ");
  const chunks: Uint8Array[] = [];
  const objectOffsets: number[] = [];
  let byteLength = 0;

  const append = (data: string | Uint8Array): void => {
    const bytes = typeof data === "string" ? toLatin1Bytes(data) : data;
    chunks.push(bytes);
    byteLength += bytes.length;
  };
  const startObject = (id: number): void => {
    objectOffsets[id] = byteLength;
    append(`${id} 0 obj\n`);
  };
  const endObject = (): void => {
    append("endobj\n");
  };

  append("%PDF-1.4\n");
  append("%\u00e2\u00e3\u00cf\u00d3\n");

  startObject(1);
  append("<< /Type /Catalog /Pages 2 0 R >>\n");
  endObject();

  startObject(2);
  append(`<< /Type /Pages /Kids [ ${kids} ] /Count ${totalPages} >>\n`);
  endObject();

  startObject(3);
  append("<<");
  append(` /Title (${escapePdfString(sanitizeText(meta.title))})`);
  append(` /Author (${escapePdfString(sanitizeText(meta.author))})`);
  append(` /Subject (${escapePdfString(sanitizeText(meta.subject))})`);
  append(` /Keywords (${escapePdfString(sanitizeText(meta.keywords))})`);
  append(` /Producer (${escapePdfString(sanitizeText("PdfCraft (LiteGUI demo)"))})`);
  append(" /Creator (PdfCraft)");
  append(` /CreationDate (${pdfDate(new Date())})`);
  append(" >>\n");
  endObject();

  startObject(4);
  append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\n");
  endObject();

  startObject(5);
  append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\n");
  endObject();

  for (let index = 0; index < effectivePages.length; index += 1) {
    const page = effectivePages[index];
    const pageObject = firstPageObject + index * 2;
    const contentObject = pageObject + 1;
    const rotation = normalizeRotation(page.rotation);
    const widthPt = positive(page.widthPt, FALLBACK_WIDTH);
    const heightPt = positive(page.heightPt, FALLBACK_HEIGHT);
    const content = buildPageContent(page, index + 1);

    startObject(pageObject);
    append("<< /Type /Page");
    append(" /Parent 2 0 R");
    append(` /MediaBox [0 0 ${num(widthPt)} ${num(heightPt)}]`);
    append(" /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /ProcSet [/PDF /Text] >>");
    append(` /Contents ${contentObject} 0 R`);
    if (rotation !== 0) {
      append(` /Rotate ${rotation}`);
    }
    append(" >>\n");
    endObject();

    startObject(contentObject);
    append(`<< /Length ${content.length} >>\nstream\n`);
    append(content);
    append("endstream\n");
    endObject();
  }

  const objectCount = firstPageObject + effectivePages.length * 2 - 1;
  const xrefOffset = byteLength;
  append("xref\n");
  append(`0 ${objectCount + 1}\n`);
  append("0000000000 65535 f \n");
  for (let id = 1; id <= objectCount; id += 1) {
    append(`${padOffset(objectOffsets[id] ?? 0)} 00000 n \n`);
  }
  append("trailer\n");
  append(`<< /Size ${objectCount + 1} /Root 1 0 R /Info 3 0 R >>\n`);
  append("startxref\n");
  append(`${xrefOffset}\n`);
  append("%%EOF\n");

  return concatChunks(chunks, byteLength);
}

function pdfDate(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  return (
    `D:${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** Trigger a browser download for the generated bytes. */
export function downloadPdf(filename: string, bytes: Uint8Array): void {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    return;
  }
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before the URL is revoked.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
