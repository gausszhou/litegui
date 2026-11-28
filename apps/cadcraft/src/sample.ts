/**
 * CADCraft sample drawing: a 12 000 x 8 000 mm apartment plan with walls,
 * openings, furniture blocks, dimensions, a room schedule and two paper-space
 * layouts. Every value is in millimetres and matches the dimensions on screen.
 */

import {
  arc,
  circle,
  dimension,
  DrawingDoc,
  ellipse,
  hatch,
  insertBlock,
  leader,
  line,
  polyline,
  pt,
  text,
  type Block,
  type Entity,
  type Layout,
  type Point,
} from "./model";

/* ------------------------------------------------------------------ blocks */

function roundedRect(width: number, height: number, radius: number, layer: string): Entity[] {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  return [
    line(layer, pt(x + r, y), pt(x + width - r, y)),
    arc(layer, pt(x + width - r, y + r), r, -Math.PI / 2, 0),
    line(layer, pt(x + width, y + r), pt(x + width, y + height - r)),
    arc(layer, pt(x + width - r, y + height - r), r, 0, Math.PI / 2),
    line(layer, pt(x + width - r, y + height), pt(x + r, y + height)),
    arc(layer, pt(x + r, y + height - r), r, Math.PI / 2, Math.PI),
    line(layer, pt(x, y + height - r), pt(x, y + r)),
    arc(layer, pt(x + r, y + r), r, Math.PI, Math.PI * 1.5),
  ];
}

function rect(width: number, height: number, layer: string): Entity[] {
  const x = width / 2;
  const y = height / 2;
  return [polyline(layer, [pt(-x, -y), pt(x, -y), pt(x, y), pt(-x, y)], true)];
}

function buildBlocks(): Block[] {
  const blocks: Block[] = [];

  blocks.push(
    blockFromEntities(
      "SOFA",
      "Three-seat sofa · 2400 x 800",
      [
        ...rect(2400, 800, "0"),
        line("0", pt(-1200, 400), pt(1200, 400)),
        line("0", pt(-1200, -400), pt(-980, -400)),
        line("0", pt(-980, -400), pt(-980, 400)),
        line("0", pt(980, -400), pt(980, 400)),
        line("0", pt(1200, -400), pt(980, -400)),
        line("0", pt(-980, 120), pt(980, 120)),
      ],
      "Sofa"
    )
  );

  blocks.push(
    blockFromEntities(
      "TABLE",
      "Dining table · 1500 x 900",
      [...rect(1500, 900, "0"), ...rect(1260, 660, "0")],
      "Table"
    )
  );

  blocks.push(
    blockFromEntities(
      "CHAIR",
      "Dining chair · 430 x 430",
      [...rect(430, 430, "0"), arc("0", pt(0, 0), 190, 0, Math.PI * 1.2), line("0", pt(-215, 215), pt(215, 215))],
      "Chair"
    )
  );

  blocks.push(
    blockFromEntities(
      "BED",
      "Double bed · 2000 x 1600",
      [
        ...rect(2000, 1600, "0"),
        ...rect(1900, 300, "0"),
        ...rect(620, 330, "0"),
        ...rect(620, 330, "0"),
        line("0", pt(-260, 165), pt(360, 165)),
        line("0", pt(-260, -165), pt(360, -165)),
        line("0", pt(-950, -800), pt(-950, -500)),
        line("0", pt(950, -800), pt(950, -500)),
        line("0", pt(-950, -500), pt(950, -500)),
      ],
      "Bed"
    )
  );

  blocks.push(
    blockFromEntities("NIGHTSTAND", "Bedside table · 450 x 450", [...rect(450, 450, "0")], "Nightstand")
  );

  blocks.push(
    blockFromEntities(
      "WARDROBE",
      "Wardrobe · 2400 x 600",
      [
        ...rect(2400, 600, "0"),
        line("0", pt(0, -300), pt(0, 300)),
        line("0", pt(-800, -300), pt(-800, 300)),
        line("0", pt(800, -300), pt(800, 300)),
        circle("0", pt(-90, 0), 22),
        circle("0", pt(90, 0), 22),
      ],
      "Wardrobe"
    )
  );

  blocks.push(
    blockFromEntities(
      "BATHTUB",
      "Bathtub · 1700 x 750",
      [
        ...roundedRect(1700, 750, 90, "0"),
        ...roundedRect(1540, 590, 60, "0"),
        circle("0", pt(-620, 0), 45),
      ],
      "Bathtub"
    )
  );

  blocks.push(
    blockFromEntities(
      "SINK",
      "Bathroom sink · 800 x 500",
      [...roundedRect(800, 500, 60, "0"), ellipse("0", pt(0, 0), 290, 160), circle("0", pt(0, 210), 28)],
      "Sink"
    )
  );

  blocks.push(
    blockFromEntities(
      "TOILET",
      "Toilet · 480 x 700",
      [
        ...rect(480, 240, "0"),
        line("0", pt(-240, 120), pt(-240, -120)),
        line("0", pt(240, 120), pt(240, -120)),
        ellipse("0", pt(0, -140), 240, 280),
        ellipse("0", pt(0, -140), 170, 210),
      ],
      "Toilet"
    )
  );

  blocks.push(
    blockFromEntities(
      "DOOR900",
      "Single door · 900 leaf",
      [
        line("0", pt(0, 0), pt(900, 0)),
        arc("0", pt(0, 0), 900, 0, Math.PI / 2),
        line("0", pt(-40, 100), pt(-40, -20)),
        line("0", pt(900, 40), pt(940, 40)),
      ],
      "Door 900"
    )
  );

  blocks.push(
    blockFromEntities(
      "WINDOW1800",
      "Fixed glazing · 1800 wide",
      [
        line("0", pt(-900, 67), pt(900, 67)),
        line("0", pt(-900, 0), pt(900, 0)),
        line("0", pt(-900, -67), pt(900, -67)),
        line("0", pt(-900, -100), pt(-900, 100)),
        line("0", pt(900, -100), pt(900, 100)),
        line("0", pt(-300, 67), pt(-300, -67)),
        line("0", pt(300, 67), pt(300, -67)),
      ],
      "Window 1800"
    )
  );

  blocks.push(
    blockFromEntities(
      "PLANT",
      "Indoor plant",
      [
        circle("0", pt(0, 0), 160),
        arc("0", pt(0, 0), 400, 0.3, 1.5),
        arc("0", pt(0, 0), 400, 1.8, 3.0),
        arc("0", pt(0, 0), 400, 3.3, 4.5),
        arc("0", pt(0, 0), 400, 4.8, 6.0),
      ],
      "Plant"
    )
  );

  return blocks;
}

/** Minimal block factory (kept here so block data stays declarative). */
function blockFromEntities(name: string, description: string, entities: Entity[], _label: string): Block {
  return { name, description, entities };
}

export const BLOCKS: Block[] = buildBlocks();

/* ----------------------------------------------------------------- drawing */

function wallSegment(doc: DrawingDoc, x1: number, y1: number, x2: number, y2: number): void {
  const boundary = [pt(x1, y1), pt(x2, y1), pt(x2, y2), pt(x1, y2)];
  doc.add(hatch("wall", boundary, "solid", 120, Math.PI / 4));
  doc.add(polyline("wall", boundary, true, { lineweight: 0.35 }));
}

function windowInsert(doc: DrawingDoc, center: Point, gap: number, rotation: number): void {
  doc.add(insertBlock("glaz", "WINDOW1800", center, gap / 1800, rotation));
}

function doorInsert(doc: DrawingDoc, hinge: Point, rotation: number): void {
  doc.add(insertBlock("door", "DOOR900", hinge, 1, rotation));
}

function addText(
  doc: DrawingDoc,
  layer: string,
  p: Point,
  content: string,
  height: number,
  align: "left" | "center" | "right" = "left",
  extra: Partial<ReturnType<typeof text>> = {}
): void {
  doc.add(text(layer, p, content, height, { align, ...extra }));
}

function addRoomSchedule(doc: DrawingDoc): void {
  const layer = "text";
  const left = 13800;
  const right = 17600;
  const top = 7600;
  const bottom = 5000;
  const divider = 16400;
  const titleBottom = 7100;
  const headerBottom = 6700;
  const rows = [6300, 5900, 5500];

  doc.add(polyline(layer, [pt(left, bottom), pt(right, bottom), pt(right, top), pt(left, top)], true));
  doc.add(line(layer, pt(left, titleBottom), pt(right, titleBottom)));
  doc.add(line(layer, pt(left, headerBottom), pt(right, headerBottom)));
  for (const y of rows) doc.add(line(layer, pt(left, y), pt(right, y)));
  doc.add(line(layer, pt(divider, bottom), pt(divider, headerBottom)));

  addText(doc, layer, pt((left + right) / 2, 7300), "ROOM SCHEDULE", 230, "center");
  addText(doc, layer, pt(left + 220, 6830), "Room", 165);
  addText(doc, layer, pt((divider + right) / 2, 6830), "Area", 165, "center");
  addText(doc, layer, pt(left + 220, 6430), "Living / Dining", 150);
  addText(doc, layer, pt((divider + right) / 2, 6430), "34.6 m²", 150, "center");
  addText(doc, layer, pt(left + 220, 6030), "Bedroom", 150);
  addText(doc, layer, pt((divider + right) / 2, 6030), "16.4 m²", 150, "center");
  addText(doc, layer, pt(left + 220, 5630), "Bath", 150);
  addText(doc, layer, pt((divider + right) / 2, 5630), "7.7 m²", 150, "center");
  addText(doc, layer, pt(left + 220, 5230), "Total", 150);
  addText(doc, layer, pt((divider + right) / 2, 5230), "58.7 m²", 150, "center");
}

function addWalls(doc: DrawingDoc): void {
  // Exterior ring: bottom, top, left and right walls, with window openings.
  wallSegment(doc, 0, 0, 1200, 200);
  wallSegment(doc, 3000, 0, 3600, 200);
  wallSegment(doc, 5400, 0, 7800, 200);
  wallSegment(doc, 9600, 0, 12000, 200);
  wallSegment(doc, 0, 7800, 12000, 8000);
  wallSegment(doc, 0, 0, 200, 5000);
  wallSegment(doc, 0, 6800, 200, 8000);
  wallSegment(doc, 11800, 0, 12000, 1600);
  wallSegment(doc, 11800, 2600, 12000, 6000);
  wallSegment(doc, 11800, 7000, 12000, 8000);

  // Interior partitions.
  wallSegment(doc, 6900, 200, 7100, 3500);
  wallSegment(doc, 6900, 4400, 7100, 7800);
  wallSegment(doc, 7100, 4900, 7300, 5100);
  wallSegment(doc, 8200, 4900, 11800, 5100);

  // Windows sit in the openings.
  windowInsert(doc, pt(2100, 100), 1800, 0);
  windowInsert(doc, pt(4500, 100), 1800, 0);
  windowInsert(doc, pt(8700, 100), 1800, 0);
  windowInsert(doc, pt(100, 5900), 1800, Math.PI / 2);
  windowInsert(doc, pt(11900, 6500), 1000, Math.PI / 2);
  windowInsert(doc, pt(11900, 2100), 1000, Math.PI / 2);

  // Doors.
  doorInsert(doc, pt(7100, 4400), -Math.PI / 2);
  doorInsert(doc, pt(8200, 5100), Math.PI / 2);
}

function addFurniture(doc: DrawingDoc): void {
  doc.add(insertBlock("furn", "SOFA", pt(1500, 6250)));
  doc.add(insertBlock("furn", "TABLE", pt(3300, 2500)));
  for (const chair of [
    pt(2300, 2500),
    pt(4300, 2500),
    pt(2900, 3320),
    pt(3700, 3320),
    pt(2900, 1680),
    pt(3700, 1680),
  ]) {
    doc.add(insertBlock("furn", "CHAIR", chair));
  }
  doc.add(circle("furn", pt(3300, 5700), 500));
  doc.add(insertBlock("furn", "BED", pt(9700, 2800)));
  doc.add(insertBlock("furn", "NIGHTSTAND", pt(11250, 3700)));
  doc.add(insertBlock("furn", "WARDROBE", pt(11400, 2000), 1, Math.PI / 2));
  doc.add(insertBlock("furn", "BATHTUB", pt(10300, 6700)));
  doc.add(insertBlock("furn", "SINK", pt(7700, 7150)));
  doc.add(insertBlock("furn", "TOILET", pt(7600, 6250)));
  doc.add(insertBlock("furn", "PLANT", pt(5250, 6900)));
}

function addAnnotations(doc: DrawingDoc): void {
  addText(doc, "text", pt(3500, 4700), "LIVING / DINING", 300, "center");
  addText(doc, "text", pt(3500, 4330), "34.6 m²", 180, "center");
  addText(doc, "text", pt(9400, 5950), "BATH", 240, "center");
  addText(doc, "text", pt(9400, 5680), "7.7 m²", 160, "center");
  addText(doc, "text", pt(9400, 4050), "BEDROOM", 260, "center");
  addText(doc, "text", pt(9400, 3760), "16.4 m²", 170, "center");

  // Dimensions.
  doc.add(dimension("dim", "linear", pt(0, 0), pt(7000, 0), pt(3500, -700)));
  doc.add(dimension("dim", "linear", pt(7000, 0), pt(12000, 0), pt(9500, -700)));
  doc.add(dimension("dim", "linear", pt(0, 0), pt(12000, 0), pt(6000, -1350)));
  doc.add(dimension("dim", "linear", pt(0, 0), pt(0, 8000), pt(-800, 4000)));
  doc.add(dimension("dim", "linear", pt(12000, 0), pt(12000, 5000), pt(12800, 2500)));
  doc.add(dimension("dim", "linear", pt(12000, 5000), pt(12000, 8000), pt(12800, 6500)));
  doc.add(dimension("dim", "radial", pt(3300, 5700), pt(3300 + 500 * Math.cos(0.6), 5700 + 500 * Math.sin(0.6)), pt(4750, 6450), "R500"));

  doc.add(leader("text", [pt(5200, 180), pt(7600, -1520)], "Double glazing, U = 1.1", 200));

  addRoomSchedule(doc);
}

/* ---------------------------------------------------------------- layouts */

function paperLine(layer: string, p1: Point, p2: Point, width = 0.35): Entity {
  return line(layer, p1, p2, { color: "#2b3038", lineweight: width });
}

function paperRect(layer: string, x1: number, y1: number, x2: number, y2: number, width = 0.35): Entity {
  return polyline(layer, [pt(x1, y1), pt(x2, y1), pt(x2, y2), pt(x1, y2)], true, {
    color: "#2b3038",
    lineweight: width,
  });
}

function paperText(layer: string, p: Point, content: string, height: number, align: "left" | "center" | "right" = "left"): Entity {
  return text(layer, p, content, height, { align, color: "#2b3038" });
}

function titleBlock(entries: Array<[string, string]>, x1: number, y1: number, x2: number, y2: number): Entity[] {
  const entities: Entity[] = [paperRect("sheet", x1, y1, x2, y2, 0.5)];
  const rowHeight = (y2 - y1) / entries.length;
  for (let i = 1; i < entries.length; i++) {
    entities.push(paperLine("sheet", pt(x1, y1 + i * rowHeight), pt(x2, y1 + i * rowHeight), 0.25));
  }
  const labelWidth = (x2 - x1) * 0.38;
  entities.push(paperLine("sheet", pt(x1 + labelWidth, y1), pt(x1 + labelWidth, y2), 0.25));
  entries.forEach(([label, value], index) => {
    const centerY = y1 + rowHeight * (index + 0.5);
    entities.push(paperText("sheet", pt(x1 + 3, centerY - 2.2), label, 4.2));
    entities.push(paperText("sheet", pt(x1 + labelWidth + 4, centerY - 2.4), value, 4.9));
  });
  return entities;
}

function makeSheetLayouts(): Layout[] {
  const plan: Layout = {
    id: "layout1",
    name: "Layout1",
    paper: { width: 841, height: 594 },
    viewports: [
      {
        id: "vp-plan",
        rect: { minX: 32, minY: 100, maxX: 660, maxY: 540 },
        center: pt(8400, 3200),
        scale: 0.0325,
        label: "PLAN · 1:30",
      },
    ],
    paperEntities: [],
  };

  plan.paperEntities.push(paperRect("sheet", 10, 10, 831, 584, 0.5));
  plan.paperEntities.push(paperRect("sheet", 16, 16, 825, 578, 0.18));
  plan.paperEntities.push(paperText("sheet", pt(22, 562), "APARTMENT FLOOR PLAN", 10));
  plan.paperEntities.push(paperText("sheet", pt(22, 550), "GROUND FLOOR · 58.7 m²", 5));
  plan.paperEntities.push(...titleBlock(
    [
      ["PROJECT", "RIVERSIDE APARTMENT"],
      ["SHEET", "A1 · GROUND FLOOR PLAN"],
      ["SCALE", "1:100 @ A1"],
      ["DATE", "2026-11-28"],
      ["DRAWN", "LITEGUI CADCRAFT"],
    ],
    631,
    16,
    825,
    96
  ));
  plan.paperEntities.push(paperText("sheet", pt(32, 90), "PLAN · 1:30", 5.2));

  const details: Layout = {
    id: "layout2",
    name: "Layout2",
    paper: { width: 420, height: 297 },
    viewports: [
      {
        id: "vp-bath",
        rect: { minX: 22, minY: 150, maxX: 200, maxY: 268 },
        center: pt(9450, 6450),
        scale: 0.038,
        label: "BATH · 1:26",
      },
      {
        id: "vp-bedroom",
        rect: { minX: 210, minY: 100, maxX: 398, maxY: 268 },
        center: pt(9450, 2550),
        scale: 0.035,
        label: "BEDROOM · 1:28",
      },
    ],
    paperEntities: [],
  };
  details.paperEntities.push(paperRect("sheet", 10, 10, 410, 287, 0.5));
  details.paperEntities.push(paperRect("sheet", 15, 15, 405, 282, 0.18));
  details.paperEntities.push(paperText("sheet", pt(20, 272), "DETAIL SHEETS", 8));
  details.paperEntities.push(...titleBlock(
    [
      ["PROJECT", "RIVERSIDE APARTMENT"],
      ["SHEET", "A2 · INTERIOR DETAILS"],
      ["SCALE", "AS SHOWN"],
      ["DATE", "2026-11-28"],
      ["DRAWN", "LITEGUI CADCRAFT"],
    ],
    262,
    15,
    405,
    80
  ));
  details.paperEntities.push(paperText("sheet", pt(22, 140), "BATH · 1:26", 5));
  details.paperEntities.push(paperText("sheet", pt(210, 90), "BEDROOM · 1:28", 5));

  return [plan, details];
}

/* ------------------------------------------------------------------ public */

export function createSampleDrawing(): DrawingDoc {
  const doc = new DrawingDoc("apartment.dxf");
  doc.layers = [
    { id: "0", name: "0", color: "#e4e9f0", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "wall", name: "A-WALL", color: "#aeb6c1", visible: true, frozen: false, locked: false, lineweight: 0.35, linetype: "continuous", plot: true },
    { id: "door", name: "A-DOOR", color: "#8fd460", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "glaz", name: "A-GLAZ", color: "#59c8e8", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "furn", name: "A-FURN", color: "#9aa7b6", visible: true, frozen: false, locked: false, lineweight: 0.18, linetype: "continuous", plot: true },
    { id: "text", name: "A-ANNO-TEXT", color: "#ffd24d", visible: true, frozen: false, locked: false, lineweight: 0.25, linetype: "continuous", plot: true },
    { id: "dim", name: "A-DIM", color: "#4fd6e6", visible: true, frozen: false, locked: false, lineweight: 0.18, linetype: "continuous", plot: true },
    { id: "hatch", name: "A-HATCH", color: "#79828e", visible: true, frozen: false, locked: false, lineweight: 0.13, linetype: "continuous", plot: true },
    { id: "sheet", name: "S-SHEET", color: "#2b3038", visible: true, frozen: false, locked: false, lineweight: 0.35, linetype: "continuous", plot: true },
  ];

  for (const block of BLOCKS) doc.blocks[block.name] = block;

  addWalls(doc);
  addFurniture(doc);
  addAnnotations(doc);

  doc.layouts = makeSheetLayouts();
  return doc;
}
