import { EventMitter } from "@gausszhou/litegui-core";

export type HeaderBarContent = string | HTMLElement | Array<string | HTMLElement>;

export interface HeaderBarOptions {
  id?: string;
  className?: string;
  /** topbar: application top bar (32px); area: editor area header (30px) */
  variant?: "topbar" | "area";
  left?: HeaderBarContent;
  center?: HeaderBarContent;
  right?: HeaderBarContent;
  title?: string;
  titleIcon?: string;
  titleTooltip?: string;
  height?: number | string;
}

/**
 * HeaderBar — generic horizontal bar with three slots.
 *
 * Used for the application top bar (brand / menus / workspace tabs / scene)
 * and for editor area headers (area icon / mode menus / shading controls).
 *
 * BEM:
 *   .lg-header-bar
 *   .lg-header-bar--topbar | .lg-header-bar--area
 *   .lg-header-bar__left | __center | __right | __title | __icon | __spacer
 */
export class HeaderBar extends EventMitter {
  public root: HTMLElement;
  public left: HTMLElement;
  public center: HTMLElement;
  public right: HTMLElement;
  public titleElement: HTMLElement | null = null;
  constructor(options: HeaderBarOptions = {}) {
    super();
    this.root = document.createElement("header");
    this.root.className = [
      "lg-header-bar",
      options.variant === "area" ? "lg-header-bar--area" : "lg-header-bar--topbar",
      options.className || ""
    ]
      .filter(Boolean)
      .join(" ");
    if (options.id) this.root.id = options.id;
    if (options.height !== undefined) {
      this.root.style.height = typeof options.height === "number" ? `${options.height}px` : options.height;
    }

    this.left = this.createSlot("left");
    this.center = this.createSlot("center");
    this.right = this.createSlot("right");
    this.root.append(this.left, this.center, this.right);

    if (options.title) this.setTitle(options.title, options.titleIcon, options.titleTooltip);
    if (options.left) this.setLeft(options.left);
    if (options.center) this.setCenter(options.center);
    if (options.right) this.setRight(options.right);
  }

  private createSlot(name: string): HTMLElement {
    const slot = document.createElement("div");
    slot.className = `lg-header-bar__${name}`;
    return slot;
  }

  private append(target: HTMLElement, content: HeaderBarContent) {
    const items = Array.isArray(content) ? content : [content];
    for (const item of items) {
      if (typeof item === "string") {
        const span = document.createElement("span");
        span.className = "lg-header-bar__text";
        span.innerHTML = item;
        target.appendChild(span);
      } else {
        target.appendChild(item);
      }
    }
    return this;
  }

  setLeft(content: HeaderBarContent) {
    this.left.innerHTML = "";
    return this.append(this.left, content);
  }

  setCenter(content: HeaderBarContent) {
    this.center.innerHTML = "";
    return this.append(this.center, content);
  }

  setRight(content: HeaderBarContent) {
    this.right.innerHTML = "";
    return this.append(this.right, content);
  }

  addLeft(item: string | HTMLElement) {
    return this.append(this.left, item);
  }

  addCenter(item: string | HTMLElement) {
    return this.append(this.center, item);
  }

  addRight(item: string | HTMLElement) {
    return this.append(this.right, item);
  }

  setTitle(title: string, icon?: string, tooltip?: string) {
    if (!this.titleElement) {
      this.titleElement = document.createElement("div");
      this.titleElement.className = "lg-header-bar__title";
      this.left.prepend(this.titleElement);
    }
    this.titleElement.innerHTML = "";
    if (icon) {
      const iconEl = document.createElement("span");
      iconEl.className = "lg-header-bar__icon";
      iconEl.innerHTML = icon;
      this.titleElement.appendChild(iconEl);
    }
    const text = document.createElement("span");
    text.className = "lg-header-bar__title-text";
    text.textContent = title;
    this.titleElement.appendChild(text);
    if (tooltip) this.titleElement.title = tooltip;
    return this;
  }

  clear() {
    this.left.innerHTML = "";
    this.center.innerHTML = "";
    this.right.innerHTML = "";
    this.titleElement = null;
    return this;
  }

  show() {
    this.root.style.display = "";
    return this;
  }

  hide() {
    this.root.style.display = "none";
    return this;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default HeaderBar;
