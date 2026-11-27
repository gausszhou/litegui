import { EventMitter } from "@gausszhou/litegui-core";

export interface ToolbarTool {
  id: string;
  /** Tooltip / accessible label. */
  label?: string;
  /** Raw SVG markup. */
  icon?: string;
  shortcut?: string;
}

export interface ToolbarOptions {
  id?: string;
  className?: string;
  tools?: ToolbarTool[];
  active?: string | null;
  /** Vertical strip (default) or horizontal bar. */
  orientation?: "vertical" | "horizontal";
  /** Optional title shown above the tools. */
  title?: string;
}

/**
 * Toolbar — vertical/horizontal tool strip with a single active tool.
 *
 * BEM:
 *   .lg-toolbar
 *   .lg-toolbar--vertical | .lg-toolbar--horizontal
 *   .lg-toolbar__title | __tools | __tool | __tool--active | __icon | __shortcut
 */
export class Toolbar extends EventMitter {
  public root: HTMLElement;
  public toolsElement: HTMLElement;
  public active: string | null = null;
  private tools: ToolbarTool[] = [];
  private buttons = new Map<string, HTMLButtonElement>();
  private titleElement: HTMLElement | null = null;

  constructor(options: ToolbarOptions = {}) {
    super();
    const orientation = options.orientation || "vertical";
    this.root = document.createElement("div");
    this.root.className = [
      "lg-toolbar",
      orientation === "horizontal" ? "lg-toolbar--horizontal" : "lg-toolbar--vertical",
      options.className || ""
    ]
      .filter(Boolean)
      .join(" ");
    if (options.id) this.root.id = options.id;

    if (options.title) this.setTitle(options.title);

    this.toolsElement = document.createElement("div");
    this.toolsElement.className = "lg-toolbar__tools";
    this.root.appendChild(this.toolsElement);

    this.setTools(options.tools || []);
    if (options.active !== undefined) this.setActive(options.active);
  }

  setTitle(title: string) {
    if (!this.titleElement) {
      this.titleElement = document.createElement("div");
      this.titleElement.className = "lg-toolbar__title";
      this.root.prepend(this.titleElement);
    }
    this.titleElement.textContent = title;
    return this;
  }

  setTools(tools: ToolbarTool[]) {
    this.tools = tools;
    this.buttons.clear();
    this.toolsElement.innerHTML = "";
    for (const tool of tools) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lg-toolbar__tool";
      button.dataset.tool = tool.id;
      button.title = tool.label ? (tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label) : tool.id;
      button.setAttribute("aria-label", tool.label || tool.id);
      if (tool.icon) {
        const icon = document.createElement("span");
        icon.className = "lg-toolbar__icon";
        icon.innerHTML = tool.icon;
        button.appendChild(icon);
      } else {
        button.textContent = tool.label || tool.id;
      }
      if (tool.shortcut) {
        const badge = document.createElement("span");
        badge.className = "lg-toolbar__shortcut";
        badge.textContent = tool.shortcut;
        button.appendChild(badge);
      }
      button.addEventListener("click", () => this.setActive(tool.id, true));
      this.toolsElement.appendChild(button);
      this.buttons.set(tool.id, button);
    }
    if (this.active && !this.buttons.has(this.active)) this.active = null;
    this.renderActive();
    return this;
  }

  getTools() {
    return this.tools.slice();
  }

  setActive(id: string | null, emit = false) {
    if (id && !this.buttons.has(id)) return this;
    this.active = id;
    this.renderActive();
    if (emit) this.emit("change", id);
    return this;
  }

  getActive() {
    return this.active;
  }

  private renderActive() {
    for (const [id, button] of this.buttons) {
      const selected = id === this.active;
      button.classList.toggle("lg-toolbar__tool--active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default Toolbar;
