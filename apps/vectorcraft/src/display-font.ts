import type { Font, PathCommand } from "opentype.js";
import boldFontUrl from "./assets/chakra-petch-bold.ttf?url";
import regularFontUrl from "./assets/chakra-petch-regular.ttf?url";
import type { SubLine, VecObject } from "./scene";

/** 与 style.css 中的 @font-face 保持一致。 */
export const DISPLAY_FONT = '"VectorCraft", "Chakra Petch", "Segoe UI", sans-serif';

interface OutlineLine {
  text: string;
  fontSize: number;
  letterSpacing: number;
  textLength?: number;
  baseline: number;
  weight: number;
}

const fontCache = new Map<number, Promise<Font>>();

export function loadDisplayFont(weight = 700): Promise<Font> {
  const key = weight >= 600 ? 700 : 400;
  let pending = fontCache.get(key);
  if (!pending) {
    const url = key === 700 ? boldFontUrl : regularFontUrl;
    pending = Promise.all([fetch(url), import("opentype.js")]).then(async ([response, opentype]) =>
      opentype.parse(await response.arrayBuffer())
    );
    fontCache.set(key, pending);
  }
  return pending;
}

function number(value: number | undefined): string {
  return `${Math.round((value ?? 0) * 100) / 100}`;
}

/** 把字形命令按文本行变换成绝对路径（含 textLength 的水平压缩）。 */
function commandsToPathData(commands: PathCommand[], startX: number, baseline: number, squeezeX: number): string {
  const parts: string[] = [];
  for (const command of commands) {
    const px = (value: number | undefined) => `${number(startX + (value ?? 0) * squeezeX)}`;
    const py = (value: number | undefined) => `${number(baseline + (value ?? 0))}`;
    switch (command.type) {
      case "M":
      case "L":
        parts.push(`${command.type}${px(command.x)} ${py(command.y)}`);
        break;
      case "C":
        parts.push(
          `C${px(command.x1)} ${py(command.y1)} ${px(command.x2)} ${py(command.y2)} ${px(command.x)} ${py(command.y)}`
        );
        break;
      case "Q":
        parts.push(`Q${px(command.x1)} ${py(command.y1)} ${px(command.x)} ${py(command.y)}`);
        break;
      case "Z":
        parts.push("Z");
        break;
      default:
        break;
    }
  }
  return parts.join(" ");
}

function linePathData(font: Font, line: OutlineLine, frameX: number, frameWidth: number, align: string): string {
  const scale = line.fontSize / font.unitsPerEm;
  const chars = [...line.text];
  const offsets: number[] = [];
  let naturalWidth = 0;
  for (const char of chars) {
    offsets.push(naturalWidth);
    const glyph = font.charToGlyph(char);
    naturalWidth += (glyph.advanceWidth ?? 0) * scale + line.letterSpacing;
  }
  naturalWidth = Math.max(1, naturalWidth - line.letterSpacing);
  const squeeze = line.textLength ? line.textLength / naturalWidth : 1;
  const width = naturalWidth * squeeze;
  const startX =
    align === "left" ? frameX : align === "right" ? frameX + frameWidth - width : frameX + (frameWidth - width) / 2;

  const parts: string[] = [];
  chars.forEach((char, index) => {
    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(offsets[index], 0, line.fontSize);
    const data = commandsToPathData(path.commands, startX, line.baseline, squeeze);
    if (data) parts.push(data);
  });
  return parts.join(" ");
}

function sublineOptions(object: VecObject, subline: SubLine): OutlineLine {
  const mainBaseline = object.y + (object.fontSize ?? 48) * 0.72;
  return {
    text: subline.text,
    fontSize: subline.fontSize,
    letterSpacing: subline.letterSpacing,
    textLength: subline.textLength,
    baseline: mainBaseline + subline.offset,
    weight: subline.weight ?? 400
  };
}

/**
 * 把文本对象转换成真实字形轮廓路径。优先使用对象自身的字体设置，
 * 目前应用内只打包了 Chakra Petch 的两个字重，因此按 weight 选择。
 */
export async function textToOutlinePath(object: VecObject): Promise<string> {
  const [bold, regular] = await Promise.all([loadDisplayFont(700), loadDisplayFont(400)]);
  const main: OutlineLine = {
    text: object.text ?? "",
    fontSize: object.fontSize ?? 48,
    letterSpacing: object.letterSpacing ?? 0,
    textLength: object.textLength,
    baseline: object.y + (object.fontSize ?? 48) * 0.72,
    weight: object.fontWeight ?? 400
  };
  const lines = [main];
  if (object.subline) lines.push(sublineOptions(object, object.subline));
  return lines
    .map(line =>
      linePathData(line.weight >= 600 ? bold : regular, line, object.x, object.width, object.align ?? "center")
    )
    .join(" ");
}

async function toBase64(buffer: ArrayBuffer): Promise<string> {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
}

/** 导出 SVG / PNG 时嵌入字体，保证脱离页面也能正确渲染。 */
export async function buildFontCss(): Promise<string> {
  const [bold, regular] = await Promise.all([
    fetch(boldFontUrl).then(response => response.arrayBuffer()),
    fetch(regularFontUrl).then(response => response.arrayBuffer())
  ]);
  const boldBase64 = await toBase64(bold);
  const regularBase64 = await toBase64(regular);
  return `<style><![CDATA[
    @font-face{font-family:"VectorCraft";font-weight:700;src:url(data:font/ttf;base64,${boldBase64}) format("truetype");}
    @font-face{font-family:"VectorCraft";font-weight:400;src:url(data:font/ttf;base64,${regularBase64}) format("truetype");}
  ]]></style>`;
}
