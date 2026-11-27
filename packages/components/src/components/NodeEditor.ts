import { EventMitter } from "@gausszhou/litegui-core";

export interface NodePort {
  id: string;
  name: string;
}

export interface NodeEditorNode {
  id: string;
  title: string;
  x: number;
  y: number;
  width?: number;
  /** Accent color for the node header. */
  color?: string;
  inputs?: NodePort[];
  outputs?: NodePort[];
}

export interface NodeEditorLink {
  from: string;
  fromPort: string;
  to: string;
  toPort: string;
}

export interface NodeEditorOptions {
  id?: string;
  className?: string;
  nodes?: NodeEditorNode[];
  links?: NodeEditorLink[];
  readOnly?: boolean;
}

interface LinkDrag {
  nodeId: string;
  portId: string;
  kind: "input" | "output";
  x: number;
  y: number;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * NodeEditor — node graph canvas with draggable nodes and port-to-port links.
 * Shared by Shading, Compositing and Geometry Nodes workspaces.
 *
 * BEM:
 *   .lg-node-editor
 *   .lg-node-editor__canvas | __links | __nodes | __grid
 *   .lg-node-editor__node | __node--selected | __node-header | __node-title
 *   .lg-node-editor__node-body | __ports | __port | __port--input | __port--output
 *   .lg-node-editor__dot | __port-name | __link | __link--temp | __hint
 */
export class NodeEditor extends EventMitter {
  public root: HTMLElement;
  public canvas: HTMLElement;
  public svg: SVGSVGElement;
  public nodesLayer: HTMLElement;

  public selectedId: string | null = null;

  private nodes: NodeEditorNode[] = [];
  private links: NodeEditorLink[] = [];
  private nodeElements = new Map<string, HTMLElement>();
  private readOnly: boolean;
  private tempPath: SVGPathElement | null = null;
  private connecting: LinkDrag | null = null;
  private draggingNode: { id: string; offsetX: number; offsetY: number; moved: boolean } | null = null;
  private raf = 0;

  constructor(options: NodeEditorOptions = {}) {
    super();
    this.readOnly = options.readOnly || false;
    this.root = document.createElement("div");
    this.root.className = ["lg-node-editor", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;
    this.root.tabIndex = 0;

    this.canvas = document.createElement("div");
    this.canvas.className = "lg-node-editor__canvas";
    this.svg = document.createElementNS(SVG_NS, "svg");
    this.svg.classList.add("lg-node-editor__links");
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.nodesLayer = document.createElement("div");
    this.nodesLayer.className = "lg-node-editor__nodes";

    const hint = document.createElement("div");
    hint.className = "lg-node-editor__hint";
    hint.textContent = "Drag nodes · Drag a port to connect · Delete: remove selected";

    this.canvas.append(this.svg, this.nodesLayer, hint);
    this.root.appendChild(this.canvas);

    this.bindEvents();
    this.setGraph(options.nodes || [], options.links || []);

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => this.scheduleLinks()).observe(this.root);
    }
  }

  private bindEvents() {
    this.root.addEventListener("pointerdown", (event) => {
      const target = event.target as HTMLElement;
      if (this.readOnly) return;
      if (!target.closest(".lg-node-editor__node") && !target.closest(".lg-node-editor__port")) {
        this.select(null);
      }
    });

    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.root.addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (!this.readOnly && this.selectedId) {
          event.preventDefault();
          this.removeNode(this.selectedId);
        }
      }
    });
  }

  private onPointerMove = (event: PointerEvent) => {
    if (this.draggingNode) {
      const node = this.nodes.find((item) => item.id === this.draggingNode?.id);
      const nodeEl = this.draggingNode ? this.nodeElements.get(this.draggingNode.id) : null;
      if (!node || !nodeEl) return;
      const rect = this.canvas.getBoundingClientRect();
      node.x = Math.max(0, event.clientX - rect.left - this.draggingNode.offsetX);
      node.y = Math.max(0, event.clientY - rect.top - this.draggingNode.offsetY);
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;
      this.draggingNode.moved = true;
      this.scheduleLinks();
      return;
    }
    if (this.connecting) {
      this.connecting.x = event.clientX;
      this.connecting.y = event.clientY;
      this.updateTempPath(event.clientX, event.clientY);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    if (this.draggingNode) {
      const moved = this.draggingNode.moved;
      this.draggingNode = null;
      if (moved) this.emitChange();
    }
    if (this.connecting) {
      const source = this.connecting;
      this.connecting = null;
      this.removeTempPath();
      const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const port = target?.closest<HTMLElement>(".lg-node-editor__port");
      if (port) {
        const nodeId = port.dataset.node;
        const portId = port.dataset.port;
        const kind = port.dataset.kind as "input" | "output" | undefined;
        if (nodeId && portId && kind && kind !== source.kind && nodeId !== source.nodeId) {
          if (source.kind === "output") {
            this.addLink({ from: source.nodeId, fromPort: source.portId, to: nodeId, toPort: portId }, true);
          } else {
            this.addLink({ from: nodeId, fromPort: portId, to: source.nodeId, toPort: source.portId }, true);
          }
        }
      }
    }
  };

  setGraph(nodes: NodeEditorNode[], links: NodeEditorLink[]) {
    this.nodes = nodes.map((node) => ({ ...node, inputs: node.inputs?.slice(), outputs: node.outputs?.slice() }));
    this.links = links.filter((link) => this.validLink(link)).map((link) => ({ ...link }));
    this.selectedId = null;
    this.render();
    return this;
  }

  getGraph() {
    return {
      nodes: this.nodes.map((node) => ({ ...node, inputs: node.inputs?.map((port) => ({ ...port })), outputs: node.outputs?.map((port) => ({ ...port })) })),
      links: this.links.map((link) => ({ ...link }))
    };
  }

  getNodes() {
    return this.getGraph().nodes;
  }

  getLinks() {
    return this.getGraph().links;
  }

  addNode(node: NodeEditorNode) {
    if (this.nodes.some((item) => item.id === node.id)) return this;
    this.nodes.push({ ...node, inputs: node.inputs?.slice(), outputs: node.outputs?.slice() });
    this.render();
    this.emitChange();
    return this;
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter((node) => node.id !== id);
    this.links = this.links.filter((link) => link.from !== id && link.to !== id);
    if (this.selectedId === id) this.selectedId = null;
    this.render();
    this.emitChange();
    return this;
  }

  addLink(link: NodeEditorLink, emit = false) {
    if (!this.validLink(link)) return this;
    const duplicate = this.links.some(
      (item) => item.from === link.from && item.fromPort === link.fromPort && item.to === link.to && item.toPort === link.toPort
    );
    if (duplicate) return this;
    this.links.push({ ...link });
    this.renderLinks();
    if (emit) this.emitChange();
    return this;
  }

  removeLink(link: NodeEditorLink) {
    this.links = this.links.filter(
      (item) => !(item.from === link.from && item.fromPort === link.fromPort && item.to === link.to && item.toPort === link.toPort)
    );
    this.renderLinks();
    this.emitChange();
    return this;
  }

  select(id: string | null) {
    this.selectedId = id;
    for (const [nodeId, element] of this.nodeElements) {
      element.classList.toggle("lg-node-editor__node--selected", nodeId === id);
    }
    this.emit("select", id);
    return this;
  }

  getSelected() {
    return this.selectedId;
  }

  private validLink(link: NodeEditorLink) {
    const from = this.nodes.find((node) => node.id === link.from);
    const to = this.nodes.find((node) => node.id === link.to);
    if (!from || !to) return false;
    if (!from.outputs?.some((port) => port.id === link.fromPort)) return false;
    if (!to.inputs?.some((port) => port.id === link.toPort)) return false;
    return true;
  }

  private render() {
    this.nodesLayer.innerHTML = "";
    this.nodeElements.clear();
    for (const node of this.nodes) this.nodesLayer.appendChild(this.createNodeElement(node));
    this.renderLinks();
  }

  private createNodeElement(node: NodeEditorNode) {
    const element = document.createElement("div");
    element.className = "lg-node-editor__node";
    element.dataset.nodeId = node.id;
    element.style.left = `${node.x}px`;
    element.style.top = `${node.y}px`;
    if (node.width) element.style.width = `${node.width}px`;
    if (node.color) element.style.setProperty("--lg-node-color", node.color);
    if (node.id === this.selectedId) element.classList.add("lg-node-editor__node--selected");

    const header = document.createElement("div");
    header.className = "lg-node-editor__node-header";
    header.innerHTML = `<span class="lg-node-editor__node-title">${node.title}</span><span class="lg-node-editor__node-dot"></span>`;
    header.addEventListener("pointerdown", (event) => this.beginNodeDrag(event, node, element));
    header.addEventListener("click", () => {
      this.select(node.id);
      this.root.focus({ preventScroll: true });
    });

    const body = document.createElement("div");
    body.className = "lg-node-editor__node-body";
    const ports = document.createElement("div");
    ports.className = "lg-node-editor__ports";

    const inputColumn = document.createElement("div");
    inputColumn.className = "lg-node-editor__port-col";
    for (const port of node.inputs || []) inputColumn.appendChild(this.createPortElement(node, port, "input"));

    const outputColumn = document.createElement("div");
    outputColumn.className = "lg-node-editor__port-col lg-node-editor__port-col--output";
    for (const port of node.outputs || []) outputColumn.appendChild(this.createPortElement(node, port, "output"));

    ports.append(inputColumn, outputColumn);
    body.appendChild(ports);
    element.append(header, body);
    element.addEventListener("click", () => this.select(node.id));
    this.nodeElements.set(node.id, element);
    return element;
  }

  private createPortElement(node: NodeEditorNode, port: NodePort, kind: "input" | "output") {
    const element = document.createElement("div");
    element.className = `lg-node-editor__port lg-node-editor__port--${kind}`;
    element.dataset.node = node.id;
    element.dataset.port = port.id;
    element.dataset.kind = kind;
    if (this.links.some((link) => (kind === "input" ? link.to === node.id && link.toPort === port.id : link.from === node.id && link.fromPort === port.id))) {
      element.classList.add("lg-node-editor__port--linked");
    }
    const dot = document.createElement("span");
    dot.className = "lg-node-editor__dot";
    const name = document.createElement("span");
    name.className = "lg-node-editor__port-name";
    name.textContent = port.name;
    if (kind === "input") element.append(dot, name);
    else element.append(name, dot);

    element.addEventListener("pointerdown", (event) => {
      if (this.readOnly) return;
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      this.select(node.id);
      this.connecting = { nodeId: node.id, portId: port.id, kind, x: event.clientX, y: event.clientY };
      this.createTempPath();
      this.updateTempPath(event.clientX, event.clientY);
    });
    return element;
  }

  private beginNodeDrag(event: PointerEvent, node: NodeEditorNode, element: HTMLElement) {
    if (this.readOnly || event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".lg-node-editor__port")) return;
    event.preventDefault();
    this.select(node.id);
    this.root.focus({ preventScroll: true });
    const rect = element.getBoundingClientRect();
    this.draggingNode = {
      id: node.id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moved: false
    };
  }

  private renderLinks() {
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    for (const link of this.links) {
      const path = this.buildLinkPath(link);
      if (!path) continue;
      const el = document.createElementNS(SVG_NS, "path");
      el.setAttribute("d", path);
      el.classList.add("lg-node-editor__link");
      this.svg.appendChild(el);
    }
    if (this.tempPath) this.svg.appendChild(this.tempPath);
  }

  private buildLinkPath(link: NodeEditorLink) {
    const from = this.portCenter(link.from, link.fromPort, "output");
    const to = this.portCenter(link.to, link.toPort, "input");
    if (!from || !to) return "";
    return this.curve(from, to);
  }

  private portCenter(nodeId: string, portId: string, kind: "input" | "output"): { x: number; y: number } | null {
    const port = this.nodesLayer.querySelector<HTMLElement>(
      `.lg-node-editor__port[data-node="${nodeId}"][data-port="${portId}"][data-kind="${kind}"]`
    );
    if (!port) return null;
    const dot = port.querySelector<HTMLElement>(".lg-node-editor__dot") || port;
    const rect = dot.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    return { x: rect.left - canvasRect.left + rect.width / 2, y: rect.top - canvasRect.top + rect.height / 2 };
  }

  private curve(from: { x: number; y: number }, to: { x: number; y: number }) {
    const dx = Math.max(36, Math.abs(to.x - from.x) * 0.5);
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  }

  private createTempPath() {
    this.tempPath = document.createElementNS(SVG_NS, "path");
    this.tempPath.classList.add("lg-node-editor__link", "lg-node-editor__link--temp");
    this.svg.appendChild(this.tempPath);
  }

  private removeTempPath() {
    this.tempPath?.remove();
    this.tempPath = null;
  }

  private updateTempPath(clientX: number, clientY: number) {
    if (!this.tempPath || !this.connecting) return;
    const canvasRect = this.canvas.getBoundingClientRect();
    const cursor = { x: clientX - canvasRect.left, y: clientY - canvasRect.top };
    const start = this.portCenter(this.connecting.nodeId, this.connecting.portId, this.connecting.kind);
    if (!start) return;
    this.tempPath.setAttribute("d", this.connecting.kind === "output" ? this.curve(start, cursor) : this.curve(cursor, start));
  }

  private emitChange() {
    this.emit("change", this.getGraph());
  }

  private scheduleLinks() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.renderLinks();
    });
  }

  /** Recompute link geometry (call after the editor becomes visible or resizes). */
  refresh() {
    this.renderLinks();
    return this;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default NodeEditor;
