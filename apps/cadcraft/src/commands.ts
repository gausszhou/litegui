/**
 * CADCraft command engine: AutoCAD-style command line and prompts.
 *
 * Commands are async functions that ask for points, keywords, numbers, text or
 * object selections. Typed input and canvas clicks both feed the same prompt,
 * so `LINE`, object snaps and direct distance entry behave like the real thing.
 */

import {
  arc as makeArc,
  arcPoint,
  circle as makeCircle,
  cloneEntity,
  dimension,
  distance,
  ellipse as makeEllipse,
  hatch,
  insertBlock,
  leader,
  line as makeLine,
  mirrorEntity,
  normalizeAngle,
  pointEntity,
  polyline,
  pt,
  rotateEntity,
  scaleEntity,
  text as makeText,
  translateEntity,
  type DrawingDoc,
  type Entity,
  type Point,
} from "./model";
import { dimMeasurement, findSnap, pickEntity, type SnapResult } from "./picking";
import type { CadRenderer } from "./renderer";

export interface CommandSettings {
  ortho: boolean;
  polar: boolean;
  osnap: boolean;
  gridSnap: boolean;
  gridSize: number;
}

export type LogKind = "command" | "info" | "warn" | "error";

export interface CommandHost {
  doc(): DrawingDoc;
  renderer(): CadRenderer;
  settings(): CommandSettings;
  activeLayer(): string;
  log(kind: LogKind, text: string): void;
  setPrompt(prompt: string): void;
  onChange(): void;
  onSelectionChange(): void;
  onCommandChange(command: string | null): void;
  openDialog(name: "layers" | "plot" | "about"): void;
  downloadDxf(): void;
  toast(text: string): void;
  blockHeight?(): number;
}

type PointAnswer =
  | { type: "point"; point: Point }
  | { type: "keyword"; keyword: string }
  | { type: "value"; value: number }
  | { type: "enter" }
  | { type: "cancel" };

interface CommandDefinition {
  id: string;
  name: string;
  aliases: string[];
  run: () => Promise<void>;
}

interface PointPending {
  kind: "point";
  resolver: (answer: PointAnswer) => void;
  keywords: string[];
  numeric: "none" | "angle" | "scale";
  base: Point | null;
}

interface TextPending {
  kind: "text";
  resolver: (value: string | null) => void;
  fallback: string;
}

interface SelectionPending {
  kind: "selection";
  resolver: (entities: Entity[] | null) => void;
  single: boolean;
}

type Pending = PointPending | TextPending | SelectionPending;

export class History {
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private limit = 80;

  push(doc: DrawingDoc): void {
    this.undoStack.push(JSON.stringify(doc.snapshot()));
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(doc: DrawingDoc): boolean {
    const snapshot = this.undoStack.pop();
    if (!snapshot) return false;
    this.redoStack.push(JSON.stringify(doc.snapshot()));
    doc.restore(JSON.parse(snapshot));
    return true;
  }

  redo(doc: DrawingDoc): boolean {
    const snapshot = this.redoStack.pop();
    if (!snapshot) return false;
    this.undoStack.push(JSON.stringify(doc.snapshot()));
    doc.restore(JSON.parse(snapshot));
    return true;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export class CommandEngine {
  readonly history = new History();
  selection = new Set<string>();
  activeCommandId: string | null = null;
  lastSnapped: Point | null = null;
  blockToInsert: string | null = null;
  lastDraftPoint: Point | null = null;

  private host: CommandHost;
  private pending: Pending | null = null;
  private commands = new Map<string, CommandDefinition>();
  private aliases = new Map<string, string>();
  private preview: ((cursor: Point) => Entity[]) | null = null;
  private rawCursor: Point | null = null;
  private lastCommandId: string | null = null;
  private executing = false;

  constructor(host: CommandHost) {
    this.host = host;
    this.registerCommands();
  }

  /* ------------------------------------------------------------ registry */

  private add(command: CommandDefinition): void {
    this.commands.set(command.id, command);
    for (const alias of command.aliases) this.aliases.set(alias.toUpperCase(), command.id);
    this.aliases.set(command.name.toUpperCase(), command.id);
  }

  commandName(id: string | null): string {
    if (!id) return "";
    return this.commands.get(id)?.name ?? id.toUpperCase();
  }

  commandExists(id: string): boolean {
    return this.commands.has(id);
  }

  private registerCommands(): void {
    this.add({ id: "line", name: "LINE", aliases: ["L"], run: () => this.cmdLine() });
    this.add({ id: "polyline", name: "PLINE", aliases: ["PL", "POLYLINE"], run: () => this.cmdPolyline() });
    this.add({ id: "rectangle", name: "RECTANG", aliases: ["REC", "RECTANGLE"], run: () => this.cmdRectangle() });
    this.add({ id: "polygon", name: "POLYGON", aliases: ["POL"], run: () => this.cmdPolygon() });
    this.add({ id: "circle", name: "CIRCLE", aliases: ["C"], run: () => this.cmdCircle() });
    this.add({ id: "arc", name: "ARC", aliases: ["A"], run: () => this.cmdArc() });
    this.add({ id: "ellipse", name: "ELLIPSE", aliases: ["EL"], run: () => this.cmdEllipse() });
    this.add({ id: "point", name: "POINT", aliases: ["PO"], run: () => this.cmdPoint() });
    this.add({ id: "text", name: "TEXT", aliases: ["T", "DTEXT"], run: () => this.cmdText() });
    this.add({ id: "leader", name: "LEADER", aliases: ["LE"], run: () => this.cmdLeader() });
    this.add({ id: "hatch", name: "HATCH", aliases: ["H"], run: () => this.cmdHatch() });
    this.add({ id: "insert", name: "INSERT", aliases: ["I"], run: () => this.cmdInsert() });
    this.add({ id: "move", name: "MOVE", aliases: ["M"], run: () => this.cmdMove() });
    this.add({ id: "copy", name: "COPY", aliases: ["CO"], run: () => this.cmdCopy() });
    this.add({ id: "rotate", name: "ROTATE", aliases: ["RO"], run: () => this.cmdRotate() });
    this.add({ id: "scale", name: "SCALE", aliases: ["SC"], run: () => this.cmdScale() });
    this.add({ id: "mirror", name: "MIRROR", aliases: ["MI"], run: () => this.cmdMirror() });
    this.add({ id: "offset", name: "OFFSET", aliases: ["O"], run: () => this.cmdOffset() });
    this.add({ id: "erase", name: "ERASE", aliases: ["E", "DELETE"], run: () => this.cmdErase() });
    this.add({ id: "dimlinear", name: "DIMLINEAR", aliases: ["DLI", "DIM"], run: () => this.cmdDimLinear() });
    this.add({ id: "dimaligned", name: "DIMALIGNED", aliases: ["DAL"], run: () => this.cmdDimAligned() });
    this.add({ id: "dimradius", name: "DIMRADIUS", aliases: ["DRA"], run: () => this.cmdDimRadius() });
    this.add({ id: "zoom", name: "ZOOM", aliases: ["Z"], run: () => this.cmdZoom() });
    this.add({ id: "pan", name: "PAN", aliases: ["P"], run: () => this.cmdPan() });
    this.add({ id: "select", name: "SELECT", aliases: ["SEL"], run: () => this.cmdSelect() });
    this.add({ id: "regen", name: "REGEN", aliases: ["RE"], run: () => this.cmdRegen() });
    this.add({ id: "undo", name: "UNDO", aliases: ["U"], run: () => this.cmdUndo() });
    this.add({ id: "redo", name: "REDO", aliases: [], run: () => this.cmdRedo() });
    this.add({ id: "layer", name: "LAYER", aliases: ["LA"], run: () => this.cmdLayer() });
    this.add({ id: "properties", name: "PROPERTIES", aliases: ["PR", "PROPS"], run: () => this.cmdProperties() });
    this.add({ id: "save", name: "SAVE", aliases: ["QSAVE"], run: () => this.cmdSave() });
    this.add({ id: "plot", name: "PLOT", aliases: ["PRINT"], run: () => this.cmdPlot() });
    this.add({ id: "about", name: "ABOUT", aliases: [], run: () => this.cmdAbout() });
  }

  get commandList(): CommandDefinition[] {
    return [...this.commands.values()];
  }

  /* ------------------------------------------------------- feeding input */

  get isIdle(): boolean {
    return this.pending === null && !this.executing;
  }

  get isAwaitingPoint(): boolean {
    return this.pending?.kind === "point";
  }

  get isAwaitingSelection(): boolean {
    return this.pending?.kind === "selection";
  }

  execute(input: string): void {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (this.executing) {
      this.host.log("warn", "Finish or cancel the current command first (Esc).");
      return;
    }
    const [token, ...args] = trimmed.split(/\s+/);
    const id = this.aliases.get(token.toUpperCase());
    if (!id) {
      this.host.log("warn", `Unknown command "${token}". Try LINE, CIRCLE, RECTANG, DIMLINEAR, LAYER…`);
      return;
    }
    if (id === "zoom" && args.length > 0 && /^e/i.test(args[0])) {
      void this.runCommand(id);
      return;
    }
    void this.runCommand(id);
  }

  private async runCommand(id: string): Promise<void> {
    const definition = this.commands.get(id);
    if (!definition) return;
    this.activeCommandId = id;
    this.lastCommandId = id;
    this.executing = true;
    this.host.onCommandChange(id);
    this.host.log("command", `Command: ${definition.name}`);
    try {
      await definition.run();
    } catch (error) {
      console.error(error);
      this.host.log("error", error instanceof Error ? error.message : String(error));
    } finally {
      this.executing = false;
      this.pending = null;
      this.preview = null;
      this.blockToInsert = null;
      this.activeCommandId = null;
      this.lastDraftPoint = null;
      const renderer = this.host.renderer();
      renderer.preview = [];
      renderer.draftFrom = null;
      renderer.activeSnap = null;
      renderer.requestRender();
      this.host.onCommandChange(null);
      this.host.setPrompt("Command:");
    }
  }

  repeatLast(): void {
    if (this.executing || !this.lastCommandId) return;
    void this.runCommand(this.lastCommandId);
  }

  /** A console Enter or typed answer. */
  submit(text: string): void {
    const pending = this.pending;
    if (!pending) {
      this.execute(text);
      return;
    }
    const trimmed = text.trim();
    if (pending.kind === "text") {
      this.pending = null;
      pending.resolver(trimmed || pending.fallback || null);
      return;
    }
    if (pending.kind === "selection") {
      if (!trimmed) {
        if (this.selection.size === 0) {
          this.host.log("info", "Select objects, or press Esc to cancel.");
          return;
        }
        this.pending = null;
        pending.resolver(this.selectedEntities());
        return;
      }
      if (/^all$/i.test(trimmed)) {
        this.selectMany(this.host.doc().visibleEntities(), true);
        return;
      }
      this.host.log("info", "Pick objects in the drawing, then press Enter. Type ALL to select everything.");
      return;
    }

    // Point prompt.
    const keyword = this.matchKeyword(trimmed, pending.keywords);
    if (keyword) {
      this.pending = null;
      pending.resolver({ type: "keyword", keyword });
      return;
    }
    if (!trimmed) {
      this.pending = null;
      pending.resolver({ type: "enter" });
      return;
    }
    if (pending.numeric !== "none" && /^[-+]?(\d+\.?\d*|\.\d+)$/.test(trimmed)) {
      this.pending = null;
      pending.resolver({ type: "value", value: Number(trimmed) });
      return;
    }
    const point = this.parsePointInput(trimmed, pending.base ?? this.lastDraftPoint);
    if (!point) {
      this.host.log("warn", "Invalid point. Use 1200,3400 · @600,0 · @900<45 · or type a distance.");
      return;
    }
    this.pending = null;
    pending.resolver({ type: "point", point });
  }

  private matchKeyword(text: string, keywords: string[]): string | null {
    if (!text) return null;
    const upper = text.toUpperCase();
    for (const keyword of keywords) {
      const k = keyword.toUpperCase();
      if (upper === k) return k;
    }
    for (const keyword of keywords) {
      const k = keyword.toUpperCase();
      if (k.startsWith(upper) && upper.length >= 1) return k;
    }
    return null;
  }

  private parsePointInput(text: string, anchor: Point | null): Point | null {
    const value = text.replace(/\s+/g, "");
    const relative = value.startsWith("@");
    const body = relative ? value.slice(1) : value;
    if (!body) return null;
    if (body.includes(",")) {
      const [xs, ys] = body.split(",");
      const x = Number(xs);
      const y = Number(ys);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      const base = relative ? anchor ?? pt(0, 0) : pt(0, 0);
      return pt(base.x + x, base.y + y);
    }
    if (body.includes("<")) {
      const [distanceText, angleText] = body.split("<");
      const d = Number(distanceText);
      const angle = (Number(angleText) * Math.PI) / 180;
      if (!Number.isFinite(d) || !Number.isFinite(angle)) return null;
      const base = relative ? anchor ?? pt(0, 0) : pt(0, 0);
      return pt(base.x + Math.cos(angle) * d, base.y + Math.sin(angle) * d);
    }
    const directDistance = Number(body);
    if (!Number.isFinite(directDistance)) return null;
    let angle = 0;
    if (anchor && this.rawCursor) {
      angle = Math.atan2(this.rawCursor.y - anchor.y, this.rawCursor.x - anchor.x);
    }
    const base = anchor ?? pt(0, 0);
    return pt(base.x + Math.cos(angle) * directDistance, base.y + Math.sin(angle) * directDistance);
  }

  /** A canvas click. Returns true when the click was consumed by a command. */
  handleCanvasClick(world: Point): boolean {
    const pending = this.pending;
    if (!pending) return false;
    if (pending.kind === "point") {
      this.pending = null;
      pending.resolver({ type: "point", point: world });
      return true;
    }
    if (pending.kind === "selection") {
      const entity = pickEntity(this.host.doc(), world, this.host.renderer().hitTolerance() * 1.2);
      if (entity) {
        this.toggleSelection(entity, true);
        if (pending.single) {
          this.pending = null;
          pending.resolver([entity]);
        }
      }
      return true;
    }
    return false;
  }

  handleWindowSelection(entities: Entity[], additive: boolean): void {
    if (this.pending?.kind !== "selection") return;
    this.selectMany(entities, additive);
  }

  /** Update hover/snap/preview state while the pointer moves. */
  updateCursor(world: Point): Point {
    this.rawCursor = world;
    const settings = this.host.settings();
    const renderer = this.host.renderer();
    const doc = this.host.doc();

    let snap: SnapResult | null = null;
    let snapped = world;
    if (settings.osnap) {
      snap = findSnap(doc, world, renderer.hitTolerance() * 1.7, {
        endpoint: true,
        midpoint: true,
        center: true,
        quadrant: true,
        intersection: true,
      });
    }
    if (snap) {
      snapped = snap.point;
    } else if (this.pending?.kind === "point" && this.pending.base) {
      snapped = this.constrainAngle(world, this.pending.base, settings);
    }
    if (!snap && settings.gridSnap) {
      snapped = {
        x: Math.round(snapped.x / settings.gridSize) * settings.gridSize,
        y: Math.round(snapped.y / settings.gridSize) * settings.gridSize,
      };
    }

    renderer.activeSnap = snap;
    this.lastSnapped = snapped;

    if (this.pending?.kind === "point" && this.preview) {
      renderer.preview = this.preview(snapped);
    } else if (!this.pending) {
      renderer.preview = [];
    }
    renderer.draftFrom = this.pending?.kind === "point" ? this.pending.base : null;
    renderer.requestRender();
    return snapped;
  }

  private constrainAngle(world: Point, base: Point, settings: CommandSettings): Point {
    const dx = world.x - base.x;
    const dy = world.y - base.y;
    const radius = Math.hypot(dx, dy);
    if (radius < 1e-6) return world;
    if (settings.ortho) {
      if (Math.abs(dx) >= Math.abs(dy)) return pt(base.x + dx, base.y);
      return pt(base.x, base.y + dy);
    }
    if (settings.polar) {
      const step = Math.PI / 12; // 15 degrees
      const angle = Math.atan2(dy, dx);
      const target = Math.round(angle / step) * step;
      const delta = Math.abs(normalizeAngle(angle - target));
      if (delta <= (5 * Math.PI) / 180) {
        return pt(base.x + Math.cos(target) * radius, base.y + Math.sin(target) * radius);
      }
    }
    return world;
  }

  /* --------------------------------------------------------------- prompts */

  private askPoint(
    prompt: string,
    keywords: string[] = [],
    options: { numeric?: "none" | "angle" | "scale"; base?: Point | null } = {}
  ): Promise<PointAnswer> {
    return new Promise(resolve => {
      this.pending = {
        kind: "point",
        resolver: resolve,
        keywords,
        numeric: options.numeric ?? "none",
        base: options.base ?? this.lastDraftPoint,
      };
      this.host.setPrompt(prompt);
    });
  }

  private askText(prompt: string, fallback = ""): Promise<string | null> {
    return new Promise(resolve => {
      this.pending = { kind: "text", resolver: resolve, fallback };
      this.host.setPrompt(prompt);
    });
  }

  private askSelection(prompt: string, single = false): Promise<Entity[] | null> {
    return new Promise(resolve => {
      this.clearSelection(false);
      this.pending = { kind: "selection", resolver: resolve, single };
      this.host.setPrompt(prompt);
    });
  }

  private async ensureSelection(prompt: string): Promise<Entity[] | null> {
    if (this.selection.size > 0) return this.selectedEntities();
    return this.askSelection(prompt);
  }

  private selectedEntities(): Entity[] {
    const doc = this.host.doc();
    return [...this.selection].map(id => doc.byId(id)).filter((entity): entity is Entity => Boolean(entity));
  }

  escape(): void {
    const pending = this.pending;
    if (pending) {
      this.pending = null;
      if (pending.kind === "point") pending.resolver({ type: "cancel" });
      else if (pending.kind === "text") pending.resolver(null);
      else pending.resolver(null);
      this.clearPreview();
      this.host.setPrompt("Command:");
      return;
    }
    if (this.selection.size) this.clearSelection(true);
  }

  enter(): void {
    const pending = this.pending;
    if (pending?.kind === "point") {
      this.pending = null;
      pending.resolver({ type: "enter" });
      this.host.setPrompt("Command:");
      return;
    }
    if (pending?.kind === "selection" || pending?.kind === "text") {
      this.submit("");
      return;
    }
    this.repeatLast();
  }

  /* ------------------------------------------------------------ selection */

  toggleSelection(entity: Entity, additive: boolean): void {
    if (!additive) {
      this.selection.clear();
      this.selection.add(entity.id);
    } else if (this.selection.has(entity.id)) {
      this.selection.delete(entity.id);
    } else {
      this.selection.add(entity.id);
    }
    this.syncSelection();
  }

  selectMany(entities: Entity[], additive: boolean): void {
    if (!additive) this.selection.clear();
    for (const entity of entities) this.selection.add(entity.id);
    this.syncSelection();
  }

  selectAll(): void {
    this.selectMany(this.host.doc().visibleEntities(), false);
  }

  clearSelection(notify = true): void {
    if (this.selection.size === 0) return;
    this.selection.clear();
    if (notify) this.syncSelection();
  }

  selectAt(world: Point, additive: boolean): Entity | null {
    const entity = pickEntity(this.host.doc(), world, this.host.renderer().hitTolerance());
    if (entity) this.toggleSelection(entity, additive);
    else if (!additive) this.clearSelection(true);
    return entity;
  }

  private syncSelection(): void {
    const renderer = this.host.renderer();
    renderer.selection.clear();
    for (const id of this.selection) renderer.selection.add(id);
    renderer.requestRender();
    this.host.onSelectionChange();
  }

  deleteSelection(): void {
    if (this.selection.size === 0) return;
    const doc = this.host.doc();
    const count = this.selection.size;
    this.history.push(doc);
    doc.removeIds(this.selection);
    this.clearSelection(false);
    this.syncSelection();
    this.host.onChange();
    this.host.log("info", `${count} object${count === 1 ? "" : "s"} erased.`);
  }

  /* ------------------------------------------------------------- preview */

  private setPreview(builder: ((cursor: Point) => Entity[]) | null, base: Point | null): void {
    this.preview = builder;
    this.lastDraftPoint = base;
    const renderer = this.host.renderer();
    renderer.draftFrom = base;
    if (base && builder && this.rawCursor) renderer.preview = builder(this.lastSnapped ?? base);
    renderer.requestRender();
  }

  private clearPreview(): void {
    this.preview = null;
    const renderer = this.host.renderer();
    renderer.preview = [];
    renderer.draftFrom = null;
    renderer.activeSnap = null;
    renderer.requestRender();
  }

  private commit(entities: Entity[], message: string): void {
    if (entities.length === 0) return;
    const doc = this.host.doc();
    this.history.push(doc);
    doc.addAll(entities);
    this.host.onChange();
    this.host.log("info", message);
  }

  /* ------------------------------------------------------------- commands */

  private activeLayer(): string {
    return this.host.activeLayer();
  }

  private async cmdLine(): Promise<void> {
    const first = await this.askPoint("Specify first point:");
    if (first.type !== "point") return;
    const points: Point[] = [first.point];
    this.setPreview(cursor => {
      const last = points[points.length - 1];
      return [makeLine(this.activeLayer(), last, cursor, { color: "#65d5ef" })];
    }, first.point);

    for (;;) {
      const answer = await this.askPoint("Specify next point or [Close/Undo]:", ["Close", "Undo"], {
        base: points[points.length - 1],
      });
      if (answer.type === "cancel" || answer.type === "enter") break;
      if (answer.type === "keyword") {
        if (answer.keyword === "UNDO") {
          if (points.length > 1) points.pop();
          continue;
        }
        if (answer.keyword === "CLOSE") {
          if (points.length > 2) {
            const entities: Entity[] = [];
            for (let i = 0; i < points.length - 1; i++) entities.push(makeLine(this.activeLayer(), points[i], points[i + 1]));
            entities.push(makeLine(this.activeLayer(), points[points.length - 1], points[0]));
            this.commit(entities, `Line loop closed — ${entities.length} segments drawn.`);
            return;
          }
          continue;
        }
      }
      if (answer.type === "point") {
        points.push(answer.point);
        this.lastDraftPoint = answer.point;
        this.setPreview(cursor => {
          const last = points[points.length - 1];
          return [makeLine(this.activeLayer(), last, cursor, { color: "#65d5ef" })];
        }, answer.point);
      }
    }

    const entities: Entity[] = [];
    for (let i = 0; i < points.length - 1; i++) entities.push(makeLine(this.activeLayer(), points[i], points[i + 1]));
    this.commit(entities, `${entities.length} line segment${entities.length === 1 ? "" : "s"} drawn.`);
  }

  private async cmdPolyline(): Promise<void> {
    const first = await this.askPoint("Specify start point of polyline:");
    if (first.type !== "point") return;
    const points: Point[] = [first.point];
    this.setPreview(cursor => [polyline(this.activeLayer(), [...points, cursor], false, { color: "#65d5ef" })], first.point);
    for (;;) {
      const answer = await this.askPoint("Specify next point or [Close/Undo]:", ["Close", "Undo"], {
        base: points[points.length - 1],
      });
      if (answer.type === "cancel" || answer.type === "enter") break;
      if (answer.type === "keyword") {
        if (answer.keyword === "UNDO") {
          if (points.length > 1) points.pop();
          continue;
        }
        if (answer.keyword === "CLOSE" && points.length > 2) {
          this.commit([polyline(this.activeLayer(), points, true)], "Polyline closed.");
          return;
        }
        continue;
      }
      if (answer.type === "point") {
        points.push(answer.point);
        this.lastDraftPoint = answer.point;
        this.setPreview(cursor => [polyline(this.activeLayer(), [...points, cursor], false, { color: "#65d5ef" })], answer.point);
      }
    }
    if (points.length > 1) this.commit([polyline(this.activeLayer(), points, false)], "Polyline drawn.");
  }

  private async cmdRectangle(): Promise<void> {
    const first = await this.askPoint("Specify first corner point:");
    if (first.type !== "point") return;
    this.setPreview(cursor => [polyline(this.activeLayer(), this.rectanglePoints(first.point, cursor), true, { color: "#65d5ef" })], first.point);
    const second = await this.askPoint("Specify other corner point:", [], { base: first.point });
    if (second.type !== "point") return;
    this.commit([polyline(this.activeLayer(), this.rectanglePoints(first.point, second.point), true)], "Rectangle drawn.");
  }

  private rectanglePoints(a: Point, b: Point): Point[] {
    return [pt(a.x, a.y), pt(b.x, a.y), pt(b.x, b.y), pt(a.x, b.y)];
  }

  private async cmdPolygon(): Promise<void> {
    const sides = await this.askText("Enter number of sides <6>:", "6");
    if (sides === null) return;
    const count = Math.max(3, Math.min(64, Math.round(Number(sides) || 6)));
    const center = await this.askPoint("Specify center of polygon:");
    if (center.type !== "point") return;
    this.setPreview(cursor => [polyline(this.activeLayer(), this.polygonPoints(center.point, cursor, count), true, { color: "#65d5ef" })], center.point);
    const radius = await this.askPoint("Specify radius of polygon:", [], { base: center.point });
    if (radius.type !== "point") return;
    this.commit([polyline(this.activeLayer(), this.polygonPoints(center.point, radius.point, count), true)], `${count}-sided polygon drawn.`);
  }

  private polygonPoints(center: Point, edge: Point, sides: number): Point[] {
    const radius = distance(center, edge);
    const start = Math.atan2(edge.y - center.y, edge.x - center.x);
    const points: Point[] = [];
    for (let i = 0; i < sides; i++) {
      points.push(arcPoint(center, radius, start + (i / sides) * Math.PI * 2));
    }
    return points;
  }

  private async cmdCircle(): Promise<void> {
    const center = await this.askPoint("Specify center point for circle:");
    if (center.type !== "point") return;
    this.setPreview(cursor => [makeCircle(this.activeLayer(), center.point, distance(center.point, cursor), { color: "#65d5ef" })], center.point);
    const radius = await this.askPoint("Specify radius of circle or type a distance:", [], { base: center.point });
    if (radius.type !== "point") return;
    const r = distance(center.point, radius.point);
    if (r < 1) {
      this.host.log("warn", "Radius is too small.");
      return;
    }
    this.commit([makeCircle(this.activeLayer(), center.point, r)], `Circle drawn — radius ${r.toFixed(0)} mm.`);
  }

  private async cmdArc(): Promise<void> {
    const start = await this.askPoint("Specify start point of arc:");
    if (start.type !== "point") return;
    this.setPreview(cursor => [makeLine(this.activeLayer(), start.point, cursor, { color: "#65d5ef" })], start.point);
    const through = await this.askPoint("Specify second point of arc:", [], { base: start.point });
    if (through.type !== "point") return;
    const end = await this.askPoint("Specify end point of arc:", [], { base: through.point });
    if (end.type !== "point") return;
    const arcEntity = arcThroughPoints(this.activeLayer(), start.point, through.point, end.point);
    if (!arcEntity) {
      this.host.log("warn", "Those three points are collinear; arc not created.");
      return;
    }
    this.commit([arcEntity], "Arc drawn.");
  }

  private async cmdEllipse(): Promise<void> {
    const center = await this.askPoint("Specify center of ellipse:");
    if (center.type !== "point") return;
    this.setPreview(cursor => [makeLine(this.activeLayer(), center.point, cursor, { color: "#65d5ef" })], center.point);
    const axis = await this.askPoint("Specify endpoint of first axis:", [], { base: center.point });
    if (axis.type !== "point") return;
    const rx = distance(center.point, axis.point);
    const rotation = Math.atan2(axis.point.y - center.point.y, axis.point.x - center.point.x);
    this.setPreview(cursor => [makeEllipse(this.activeLayer(), center.point, rx, Math.max(1, this.perpendicularDistance(cursor, center.point, rotation)), rotation, { color: "#65d5ef" })], center.point);
    const other = await this.askPoint("Specify endpoint of second axis:", [], { base: center.point });
    if (other.type !== "point") return;
    const ry = Math.max(1, this.perpendicularDistance(other.point, center.point, rotation));
    this.commit([makeEllipse(this.activeLayer(), center.point, rx, ry, rotation)], "Ellipse drawn.");
  }

  private perpendicularDistance(p: Point, origin: Point, rotation: number): number {
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    return Math.abs(-dx * Math.sin(rotation) + dy * Math.cos(rotation));
  }

  private async cmdPoint(): Promise<void> {
    const answer = await this.askPoint("Specify a point:");
    if (answer.type !== "point") return;
    this.commit([pointEntity(this.activeLayer(), answer.point)], "Point placed.");
  }

  private async cmdText(): Promise<void> {
    const answer = await this.askPoint("Specify start point of text:");
    if (answer.type !== "point") return;
    const content = await this.askText("Enter text:");
    if (!content) return;
    this.commit([makeText(this.activeLayer(), answer.point, content, 250)], `Text "${content}" created.`);
  }

  private async cmdLeader(): Promise<void> {
    const first = await this.askPoint("Specify leader arrowhead location:");
    if (first.type !== "point") return;
    const points: Point[] = [first.point];
    for (;;) {
      const next = await this.askPoint("Specify next point or [Enter to finish]:", [], { base: points[points.length - 1] });
      if (next.type !== "point") break;
      points.push(next.point);
      if (points.length >= 2) {
        this.setPreview(cursor => [leader(this.activeLayer(), [...points, cursor], "", 200, { color: "#65d5ef" })], points[points.length - 1]);
      }
    }
    if (points.length < 2) return;
    const content = await this.askText("Enter annotation text:");
    if (!content) return;
    this.commit([leader(this.activeLayer(), points, content, 200)], "Leader created.");
  }

  private async cmdHatch(): Promise<void> {
    const answer = await this.askPoint("Pick an internal point to hatch:");
    if (answer.type !== "point") return;
    const boundary = this.findBoundary(answer.point);
    if (!boundary) {
      this.host.log("warn", "No closed boundary found at that point. Draw a closed polyline first.");
      return;
    }
    this.commit([hatch(this.activeLayer(), boundary, "ansi31", 180)], "Hatch created with ANSI31 pattern.");
  }

  private findBoundary(point: Point): Point[] | null {
    const doc = this.host.doc();
    let best: Point[] | null = null;
    let bestArea = Infinity;
    for (const entity of doc.visibleEntities()) {
      if (entity.kind === "polyline" && entity.closed && entity.points.length >= 3) {
        if (!pointInPolygon(entity.points, point)) continue;
        const area = Math.abs(polygonArea(entity.points));
        if (area < bestArea) {
          bestArea = area;
          best = entity.points.map(p => ({ ...p }));
        }
      } else if (entity.kind === "circle") {
        if (distance(entity.center, point) > entity.radius) continue;
        const area = Math.PI * entity.radius * entity.radius;
        if (area < bestArea) {
          bestArea = area;
          best = [];
          for (let i = 0; i < 64; i++) best.push(arcPoint(entity.center, entity.radius, (i / 64) * Math.PI * 2));
        }
      }
    }
    return best;
  }

  private async cmdInsert(): Promise<void> {
    const blockName = this.blockToInsert ?? "SOFA";
    const block = this.host.doc().blocks[blockName];
    if (!block) {
      this.host.log("warn", `Block "${blockName}" is not defined.`);
      return;
    }
    const answer = await this.askPoint(`Specify insertion point for ${blockName}:`);
    if (answer.type !== "point") return;
    this.commit([insertBlock(this.activeLayer(), blockName, answer.point)], `${blockName} block inserted.`);
  }

  startInsert(blockName: string): void {
    if (this.executing) {
      this.escape();
      window.setTimeout(() => {
        this.blockToInsert = blockName;
        this.execute("INSERT");
      }, 0);
      return;
    }
    this.blockToInsert = blockName;
    this.execute("INSERT");
  }

  private async cmdMove(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to move:");
    if (!targets || targets.length === 0) return;
    const base = await this.askPoint("Specify base point:");
    if (base.type !== "point") return;
    this.setPreview(cursor => targets.map(entity => translateEntity(entity, { x: cursor.x - base.point.x, y: cursor.y - base.point.y })), base.point);
    const target = await this.askPoint("Specify second point:", [], { base: base.point });
    if (target.type !== "point") return;
    const delta = { x: target.point.x - base.point.x, y: target.point.y - base.point.y };
    this.applyTransform(targets, entity => translateEntity(entity, delta), `${targets.length} object(s) moved.`);
  }

  private async cmdCopy(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to copy:");
    if (!targets || targets.length === 0) return;
    const base = await this.askPoint("Specify base point:");
    if (base.type !== "point") return;
    this.setPreview(cursor => targets.map(entity => translateEntity(entity, { x: cursor.x - base.point.x, y: cursor.y - base.point.y })), base.point);
    const target = await this.askPoint("Specify second point:", [], { base: base.point });
    if (target.type !== "point") return;
    const delta = { x: target.point.x - base.point.x, y: target.point.y - base.point.y };
    const copies = targets.map(entity => translateEntity(cloneEntity(entity), delta));
    this.commit(copies, `${copies.length} object(s) copied.`);
  }

  private async cmdRotate(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to rotate:");
    if (!targets || targets.length === 0) return;
    const base = await this.askPoint("Specify base point:");
    if (base.type !== "point") return;
    this.setPreview(
      cursor => targets.map(entity => rotateEntity(entity, base.point, Math.atan2(cursor.y - base.point.y, cursor.x - base.point.x))),
      base.point
    );
    const answer = await this.askPoint("Specify rotation angle (degrees or pick a point):", [], {
      numeric: "angle",
      base: base.point,
    });
    let angle: number | null = null;
    if (answer.type === "value") angle = (answer.value * Math.PI) / 180;
    else if (answer.type === "point") angle = Math.atan2(answer.point.y - base.point.y, answer.point.x - base.point.x);
    if (angle === null) return;
    this.applyTransform(targets, entity => rotateEntity(entity, base.point, angle as number), `${targets.length} object(s) rotated ${((angle * 180) / Math.PI).toFixed(1)}°.`);
  }

  private async cmdScale(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to scale:");
    if (!targets || targets.length === 0) return;
    const base = await this.askPoint("Specify base point:");
    if (base.type !== "point") return;
    this.setPreview(
      cursor => targets.map(entity => scaleEntity(entity, base.point, Math.max(0.01, distance(base.point, cursor) / 1000))),
      base.point
    );
    const answer = await this.askPoint("Specify scale factor:", [], { numeric: "scale", base: base.point });
    let factor: number | null = null;
    if (answer.type === "value") factor = Math.abs(answer.value);
    else if (answer.type === "point") factor = Math.max(0.01, distance(base.point, answer.point) / 1000);
    if (factor === null || factor <= 0) return;
    this.applyTransform(targets, entity => scaleEntity(entity, base.point, factor as number), `${targets.length} object(s) scaled by ${Number(factor.toFixed(3))}.`);
  }

  private async cmdMirror(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to mirror:");
    if (!targets || targets.length === 0) return;
    const first = await this.askPoint("Specify first point of mirror line:");
    if (first.type !== "point") return;
    this.setPreview(cursor => targets.map(entity => mirrorEntity(cloneEntity(entity), first.point, cursor)), first.point);
    const second = await this.askPoint("Specify second point of mirror line:", [], { base: first.point });
    if (second.type !== "point") return;
    const copies = targets.map(entity => mirrorEntity(cloneEntity(entity), first.point, second.point));
    this.commit(copies, `${copies.length} object(s) mirrored.`);
  }

  private async pickSupportedObject(prompt: string, kinds: Entity["kind"][]): Promise<Entity | null> {
    for (;;) {
      const targets = await this.askSelection(prompt, true);
      if (!targets || targets.length === 0) return null;
      const candidate = targets[0];
      if (kinds.includes(candidate.kind)) return candidate;
      this.host.log("warn", `${prompt.replace(/:$/, "")} expects ${kinds.join(", ")}. Pick another object.`);
    }
  }

  private async cmdOffset(): Promise<void> {
    const entity = await this.pickSupportedObject("Select object to offset:", ["line", "circle", "arc", "polyline"]);
    if (!entity) return;
    const side = await this.askPoint("Specify point on side to offset:");
    if (side.type !== "point") return;
    let offset: Entity | null = null;
    if (entity.kind === "line") {
      const d = perpendicularDistanceToLine(side.point, entity.p1, entity.p2);
      const dx = entity.p2.x - entity.p1.x;
      const dy = entity.p2.y - entity.p1.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const sign = (side.point.x - entity.p1.x) * nx + (side.point.y - entity.p1.y) * ny;
      const amount = d * (sign >= 0 ? 1 : -1);
      offset = translateEntity(cloneEntity(entity), { x: nx * amount, y: ny * amount });
    } else if (entity.kind === "circle") {
      const amount = distance(side.point, entity.center) - entity.radius;
      offset = { ...cloneEntity(entity), radius: Math.abs(entity.radius + amount) } as Entity;
    } else if (entity.kind === "arc") {
      const amount = distance(side.point, entity.center) - entity.radius;
      offset = { ...cloneEntity(entity), radius: Math.abs(entity.radius + amount) } as Entity;
    } else if (entity.kind === "polyline") {
      const d = distance(side.point, entity.points[0]);
      offset = translateEntity(cloneEntity(entity), { x: d, y: d });
    }
    if (!offset) return;
    this.commit([offset], "Offset created.");
  }

  private async cmdErase(): Promise<void> {
    const targets = await this.ensureSelection("Select objects to erase:");
    if (!targets || targets.length === 0) return;
    const doc = this.host.doc();
    this.history.push(doc);
    const ids = targets.map(entity => entity.id);
    doc.removeIds(ids);
    this.clearSelection(false);
    this.syncSelection();
    this.host.onChange();
    this.host.log("info", `${ids.length} object(s) erased.`);
  }

  private applyTransform(targets: Entity[], transform: (entity: Entity) => Entity, message: string): void {
    const doc = this.host.doc();
    this.history.push(doc);
    for (const target of targets) {
      const index = doc.entities.findIndex(entity => entity.id === target.id);
      if (index >= 0) doc.entities[index] = transform(target);
    }
    this.host.onChange();
    this.syncSelection();
    this.host.log("info", message);
  }

  private async cmdDimLinear(): Promise<void> {
    const first = await this.askPoint("Specify first extension line origin:");
    if (first.type !== "point") return;
    const second = await this.askPoint("Specify second extension line origin:", [], { base: first.point });
    if (second.type !== "point") return;
    this.setPreview(cursor => [dimension("dim", "linear", first.point, second.point, cursor)], first.point);
    const pos = await this.askPoint("Specify dimension line location:");
    if (pos.type !== "point") return;
    const dim = dimension("dim", "linear", first.point, second.point, pos.point);
    this.commit([dim], `Linear dimension added — ${dimMeasurement(dim).toFixed(0)} mm.`);
  }

  private async cmdDimAligned(): Promise<void> {
    const first = await this.askPoint("Specify first extension line origin:");
    if (first.type !== "point") return;
    const second = await this.askPoint("Specify second extension line origin:", [], { base: first.point });
    if (second.type !== "point") return;
    this.setPreview(cursor => [dimension("dim", "aligned", first.point, second.point, cursor)], first.point);
    const pos = await this.askPoint("Specify dimension line location:");
    if (pos.type !== "point") return;
    this.commit([dimension("dim", "aligned", first.point, second.point, pos.point)], "Aligned dimension added.");
  }

  private async cmdDimRadius(): Promise<void> {
    const entity = await this.pickSupportedObject("Select circle or arc:", ["circle", "arc"]);
    if (!entity || (entity.kind !== "circle" && entity.kind !== "arc")) return;
    const centerPoint = entity.center;
    const radius = entity.radius;
    this.setPreview(cursor => {
      const angle = Math.atan2(cursor.y - centerPoint.y, cursor.x - centerPoint.x);
      return [dimension("dim", "radial", centerPoint, arcPoint(centerPoint, radius, angle), cursor)];
    }, centerPoint);
    const pos = await this.askPoint("Specify dimension line location:");
    if (pos.type !== "point") return;
    const angle = Math.atan2(pos.point.y - centerPoint.y, pos.point.x - centerPoint.x);
    const dim = dimension("dim", "radial", centerPoint, arcPoint(centerPoint, radius, angle), pos.point);
    this.commit([dim], `Radius dimension added — R${dimMeasurement(dim).toFixed(0)}.`);
  }

  private async cmdZoom(): Promise<void> {
    const answer = await this.askPoint("Specify scale factor or [Extents] <Extents>:", ["Extents"]);
    if (answer.type === "cancel") return;
    if (answer.type === "value") {
      const renderer = this.host.renderer();
      renderer.view.scale = Math.max(0.006, Math.min(3, answer.value * 0.001));
      renderer.requestRender();
      this.host.log("info", `Zoom set to ${renderer.zoomPercent}%.`);
      return;
    }
    this.host.renderer().fitExtents();
    this.host.log("info", "Zoomed to drawing extents.");
  }

  private async cmdPan(): Promise<void> {
    this.host.toast("Hold the middle mouse button (or Space-drag) to pan the drawing.");
  }

  private async cmdSelect(): Promise<void> {
    await this.askSelection("Select objects:");
  }

  private async cmdRegen(): Promise<void> {
    this.host.renderer().requestRender();
    this.host.log("info", "Drawing regenerated.");
  }

  private async cmdUndo(): Promise<void> {
    if (this.history.undo(this.host.doc())) {
      this.clearSelection(false);
      this.syncSelection();
      this.host.onChange();
      this.host.log("info", "Undo.");
    } else {
      this.host.log("info", "Nothing to undo.");
    }
  }

  private async cmdRedo(): Promise<void> {
    if (this.history.redo(this.host.doc())) {
      this.clearSelection(false);
      this.syncSelection();
      this.host.onChange();
      this.host.log("info", "Redo.");
    } else {
      this.host.log("info", "Nothing to redo.");
    }
  }

  private async cmdLayer(): Promise<void> {
    this.host.openDialog("layers");
  }

  private async cmdProperties(): Promise<void> {
    this.host.onSelectionChange();
    this.host.toast("Properties palette is on the right.");
  }

  private async cmdSave(): Promise<void> {
    this.host.downloadDxf();
  }

  private async cmdPlot(): Promise<void> {
    this.host.openDialog("plot");
  }

  private async cmdAbout(): Promise<void> {
    this.host.openDialog("about");
  }
}

/* ------------------------------------------------------------------ utils */

function pointInPolygon(polygon: Point[], p: Point): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function polygonArea(points: Point[]): number {
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  return area / 2;
}

function perpendicularDistanceToLine(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / len;
}

function arcThroughPoints(layer: string, p1: Point, p2: Point, p3: Point): Entity | null {
  const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
  if (Math.abs(d) < 1e-6) return null;
  const p1Sq = p1.x * p1.x + p1.y * p1.y;
  const p2Sq = p2.x * p2.x + p2.y * p2.y;
  const p3Sq = p3.x * p3.x + p3.y * p3.y;
  const center = pt(
    (p1Sq * (p2.y - p3.y) + p2Sq * (p3.y - p1.y) + p3Sq * (p1.y - p2.y)) / d,
    (p1Sq * (p3.x - p2.x) + p2Sq * (p1.x - p3.x) + p3Sq * (p2.x - p1.x)) / d
  );
  const radius = distance(center, p1);
  const a1 = Math.atan2(p1.y - center.y, p1.x - center.x);
  const a2 = Math.atan2(p2.y - center.y, p2.x - center.x);
  const a3 = Math.atan2(p3.y - center.y, p3.x - center.x);
  const sweep = normalizeAngle(a3 - a1);
  const midSweep = normalizeAngle(a2 - a1);
  if (midSweep <= sweep) return makeArc(layer, center, radius, a1, a3);
  return makeArc(layer, center, radius, a3, a1);
}
