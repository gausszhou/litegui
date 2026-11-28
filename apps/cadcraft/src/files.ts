/**
 * File output for CADCraft: a compact ASCII DXF writer and a PNG plot helper.
 * The DXF covers the geometry this demo can create; block references are
 * exploded, and dimensions/leaders are exported as their visible primitives.
 */

import {
  distance,
  flattenEntity,
  type DrawingDoc,
  type Entity,
  type Layer,
} from "./model";

function num(value: number): string {
  return String(Math.round(value * 10000) / 10000);
}

function aciFor(color: string | undefined): number {
  if (!color) return 7;
  const hex = color.replace("#", "");
  if (hex.length !== 6) return 7;
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 30) return max > 170 ? 7 : max > 90 ? 8 : 9;
  if (r === max && g === max) return 7;
  if (r === max) return g > b + 40 ? 2 : g > b ? 2 : 1;
  if (g === max) return b > r + 40 ? 4 : 3;
  return r > 150 && g < 100 ? 6 : 5;
}

function trueColor(color: string): number | null {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return null;
  return Number.parseInt(hex, 16);
}

function entityRecords(entity: Entity, doc: DrawingDoc): string[] {
  const layer = doc.layer(entity.layer)?.name ?? entity.layer;
  const colorCode = entity.color ? trueColor(entity.color) : null;
  const colorLine = colorCode !== null ? `420\n${colorCode}\n` : "";
  const head = (type: string) => `0\n${type}\n8\n${layer}\n${colorLine}`;
  const records: string[] = [];

  switch (entity.kind) {
    case "line":
      records.push(`${head("LINE")}10\n${num(entity.p1.x)}\n20\n${num(entity.p1.y)}\n11\n${num(entity.p2.x)}\n21\n${num(entity.p2.y)}\n`);
      break;
    case "polyline":
      records.push(
        `${head("LWPOLYLINE")}90\n${entity.points.length}\n70\n${entity.closed ? 1 : 0}\n${entity.points
          .map(point => `10\n${num(point.x)}\n20\n${num(point.y)}\n`)
          .join("")}`
      );
      break;
    case "circle":
      records.push(`${head("CIRCLE")}10\n${num(entity.center.x)}\n20\n${num(entity.center.y)}\n40\n${num(entity.radius)}\n`);
      break;
    case "arc":
      records.push(
        `${head("ARC")}10\n${num(entity.center.x)}\n20\n${num(entity.center.y)}\n40\n${num(entity.radius)}\n50\n${num(
          (entity.startAngle * 180) / Math.PI
        )}\n51\n${num((entity.endAngle * 180) / Math.PI)}\n`
      );
      break;
    case "ellipse":
      records.push(
        `${head("ELLIPSE")}10\n${num(entity.center.x)}\n20\n${num(entity.center.y)}\n11\n${num(
          Math.cos(entity.rotation) * entity.rx
        )}\n21\n${num(Math.sin(entity.rotation) * entity.rx)}\n40\n${num(entity.ry / Math.max(entity.rx, 1e-6))}\n`
      );
      break;
    case "text": {
      const align = entity.align === "center" ? 1 : entity.align === "right" ? 2 : 0;
      records.push(
        `${head("TEXT")}10\n${num(entity.p.x)}\n20\n${num(entity.p.y)}\n40\n${num(entity.height)}\n1\n${entity.text}\n50\n${num(
          (entity.rotation * 180) / Math.PI
        )}\n72\n${align}\n`
      );
      break;
    }
    case "point":
      records.push(`${head("POINT")}10\n${num(entity.p.x)}\n20\n${num(entity.p.y)}\n`);
      break;
    case "leader":
      records.push(
        `${head("LWPOLYLINE")}90\n${entity.points.length}\n70\n0\n${entity.points
          .map(point => `10\n${num(point.x)}\n20\n${num(point.y)}\n`)
          .join("")}`
      );
      records.push(
        `${head("TEXT")}10\n${num(entity.points[entity.points.length - 1].x)}\n20\n${num(
          entity.points[entity.points.length - 1].y + entity.textHeight
        )}\n40\n${num(entity.textHeight)}\n1\n${entity.text}\n72\n0\n`
      );
      break;
    case "dim": {
      const measure =
        entity.dimType === "radial"
          ? `R${Math.round(distance(entity.p1, entity.p2))}`
          : String(
              Math.round(
                entity.dimType === "aligned"
                  ? distance(entity.p1, entity.p2)
                  : Math.max(Math.abs(entity.p2.x - entity.p1.x), Math.abs(entity.p2.y - entity.p1.y))
              )
            );
      records.push(
        `${head("LINE")}10\n${num(entity.p1.x)}\n20\n${num(entity.p1.y)}\n11\n${num(entity.p2.x)}\n21\n${num(entity.p2.y)}\n`
      );
      records.push(
        `${head("TEXT")}10\n${num(entity.pos.x)}\n20\n${num(entity.pos.y)}\n40\n160\n1\n${entity.textOverride ?? measure}\n72\n1\n`
      );
      break;
    }
    case "hatch":
      records.push(
        `${head("LWPOLYLINE")}90\n${entity.boundary.length}\n70\n1\n${entity.boundary
          .map(point => `10\n${num(point.x)}\n20\n${num(point.y)}\n`)
          .join("")}`
      );
      break;
    case "insert":
      for (const primitive of flattenEntity(entity, doc.blocks)) {
        if (primitive.layer === "0" || primitive.layer === "") primitive.layer = entity.layer;
        records.push(...entityRecords(primitive, doc));
      }
      break;
  }
  return records;
}

export function drawingToDxf(doc: DrawingDoc): string {
  const lines: string[] = [];
  const push = (...rows: string[]) => lines.push(...rows);

  push("0", "SECTION", "2", "HEADER", "9", "$ACADVER", "1", "AC1015", "9", "$INSUNITS", "70", "4", "0", "ENDSEC");
  push("0", "SECTION", "2", "TABLES", "0", "TABLE", "2", "LAYER", "70", String(doc.layers.length));
  for (const layer of doc.layers) {
    const flags = (layer.frozen ? 1 : 0) + (layer.locked ? 4 : 0);
    const color = layer.visible ? aciFor(layer.color) : -aciFor(layer.color);
    push(
      "0",
      "LAYER",
      "2",
      layer.name,
      "70",
      String(flags),
      "62",
      String(color),
      "6",
      layer.linetype.toUpperCase(),
      "370",
      String(Math.round(layer.lineweight * 100)),
      "290",
      layer.plot ? "1" : "0"
    );
  }
  push("0", "ENDTAB", "0", "ENDSEC", "0", "SECTION", "2", "ENTITIES");
  for (const entity of doc.entities) lines.push(...entityRecords(entity, doc));
  push("0", "ENDSEC", "0", "EOF");
  return lines.join("\n") + "\n";
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadDxf(doc: DrawingDoc): void {
  const base = doc.name.replace(/\.(dxf|dwg)$/i, "");
  download(new Blob([drawingToDxf(doc)], { type: "application/dxf" }), `${base}.dxf`);
}

export function exportCanvasPng(canvas: HTMLCanvasElement, name: string): void {
  canvas.toBlob(blob => {
    if (blob) download(blob, `${name.replace(/\.[^.]+$/, "")}-plot.png`);
  }, "image/png");
}

export function layerAci(layer: Layer): number {
  return aciFor(layer.color);
}
