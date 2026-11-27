import { EventMitter } from "@gausszhou/litegui-core";

export interface StatusBarOptions {
  id?: string;
  className?: string;
  left?: string;
  right?: Array<string | HTMLElement>;
  /** Render right-side items with the accent color (version label). */
  accent?: string;
}

/**
 * StatusBar — bottom status line.
 *
 * BEM:
 *   .lg-status-bar
 *   .lg-status-bar__left | __right | __item | __accent
 */
export class StatusBar extends EventMitter {
  public root: HTMLElement;
  public leftElement: HTMLElement;
  public rightElement: HTMLElement;

  constructor(options: StatusBarOptions = {}) {
    super();
    this.root = document.createElement("footer");
    this.root.className = ["lg-status-bar", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;

    this.leftElement = document.createElement("div");
    this.leftElement.className = "lg-status-bar__left";
    this.rightElement = document.createElement("div");
    this.rightElement.className = "lg-status-bar__right";
    this.root.append(this.leftElement, this.rightElement);

    if (options.left) this.setLeft(options.left);
    if (options.right) options.right.forEach((item) => this.addRight(item));
    if (options.accent) this.addAccent(options.accent);
  }

  setLeft(text: string) {
    this.leftElement.textContent = text;
    return this;
  }

  getLeft() {
    return this.leftElement.textContent || "";
  }

  setRight(items: Array<string | HTMLElement>) {
    this.rightElement.innerHTML = "";
    items.forEach((item) => this.addRight(item));
    return this;
  }

  addRight(item: string | HTMLElement) {
    if (typeof item === "string") {
      const span = document.createElement("span");
      span.className = "lg-status-bar__item";
      span.textContent = item;
      this.rightElement.appendChild(span);
      return this;
    }
    this.rightElement.appendChild(item);
    return this;
  }

  setRightText(text: string) {
    this.rightElement.innerHTML = "";
    return this.addRight(text);
  }

  addAccent(text: string) {
    const span = document.createElement("span");
    span.className = "lg-status-bar__item lg-status-bar__accent";
    span.textContent = text;
    this.rightElement.appendChild(span);
    return this;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default StatusBar;
