/**
 * LightCraft 轻量交互层：弹出菜单、模态框、消息条、评分/旗标控件。
 * 与 vectorcraft 的做法保持一致：不依赖框架，直接操作 DOM，弹层统一挂在 body 上。
 */
import { icon } from "./icons";

/* ------------------------------------------------------------------ DOM 小工具 */

export function q<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function iconButton(name: string, title: string, dataset: Record<string, string> = {}, size = 16): HTMLButtonElement {
  const button = el("button", "lc-icon-btn");
  button.type = "button";
  button.title = title;
  button.setAttribute("aria-label", title);
  button.innerHTML = icon(name, size);
  for (const [key, value] of Object.entries(dataset)) {
    if (key === "id") button.id = value;
    else button.dataset[key] = value;
  }
  return button;
}

/* ------------------------------------------------------------------ 弹出菜单 */

export interface MenuItemSpec {
  label?: string;
  /** 右侧快捷键提示 */
  key?: string;
  checked?: boolean;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  action?: () => void;
}

let openPopup: HTMLElement | null = null;
let popupCleanup: (() => void) | null = null;

export function closeMenu(): void {
  popupCleanup?.();
  openPopup?.remove();
  openPopup = null;
  popupCleanup = null;
}

export function isMenuOpen(): boolean {
  return openPopup !== null;
}

function positionFloating(node: HTMLElement, x: number, y: number): void {
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  const rect = node.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 8;
  const maxY = window.innerHeight - rect.height - 8;
  if (rect.left > maxX) node.style.left = `${Math.max(8, maxX)}px`;
  if (rect.top > maxY) node.style.top = `${Math.max(8, maxY - 4)}px`;
}

export function openMenu(items: MenuItemSpec[], anchor: { x: number; y: number } | HTMLElement): void {
  closeMenu();
  const menu = el("div", "lc-menu");
  menu.setAttribute("role", "menu");

  for (const item of items) {
    if (item.separator) {
      menu.appendChild(el("div", "lc-menu__sep"));
      continue;
    }
    const row = el("button", "lc-menu__item");
    row.type = "button";
    row.setAttribute("role", "menuitem");
    if (item.disabled) row.disabled = true;
    if (item.danger) row.classList.add("is-danger");
    if (item.checked) row.classList.add("is-checked");

    const mark = el("span", "lc-menu__mark");
    mark.innerHTML = item.checked ? icon("check", 13) : "";
    const label = el("span", "lc-menu__label", item.label ?? "");
    row.append(mark, label);
    if (item.key) {
      const key = el("span", "lc-menu__key", item.key);
      row.appendChild(key);
    }
    row.addEventListener("click", () => {
      if (item.disabled) return;
      closeMenu();
      item.action?.();
    });
    menu.appendChild(row);
  }

  document.body.appendChild(menu);
  openPopup = menu;

  if (anchor instanceof HTMLElement) {
    const rect = anchor.getBoundingClientRect();
    positionFloating(menu, rect.left, rect.bottom + 4);
  } else {
    positionFloating(menu, anchor.x, anchor.y);
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!menu.contains(event.target as Node)) closeMenu();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeMenu();
    }
  };
  const timer = window.setTimeout(() => {
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
  }, 0);
  popupCleanup = () => {
    window.clearTimeout(timer);
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("keydown", onKeyDown, true);
  };
}

/* ------------------------------------------------------------------ 模态框 */

export interface ModalAction {
  label: string;
  primary?: boolean;
  /** 返回 false 可阻止关闭 */
  action?: () => boolean | void;
  close?: boolean;
}

export interface ModalOptions {
  title: string;
  subtitle?: string;
  body: HTMLElement | string;
  actions?: ModalAction[];
  width?: number;
  className?: string;
}

let activeModal: HTMLElement | null = null;

export function closeModal(): void {
  activeModal?.remove();
  activeModal = null;
}

export function openModal(options: ModalOptions): HTMLElement {
  closeModal();
  const backdrop = el("div", "lc-modal-backdrop");
  const card = el("div", `lc-modal ${options.className ?? ""}`.trim());
  card.style.width = `${options.width ?? 420}px`;
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");

  const header = el("div", "lc-modal__head");
  const titleBox = el("div", "lc-modal__titles");
  titleBox.appendChild(el("h2", "lc-modal__title", options.title));
  if (options.subtitle) titleBox.appendChild(el("p", "lc-modal__subtitle", options.subtitle));
  header.appendChild(titleBox);

  const close = el("button", "lc-icon-btn lc-modal__close");
  close.type = "button";
  close.title = "关闭";
  close.setAttribute("aria-label", "关闭");
  close.innerHTML = icon("close", 15);
  close.addEventListener("click", () => closeModal());
  header.appendChild(close);

  const body = el("div", "lc-modal__body");
  if (typeof options.body === "string") body.innerHTML = options.body;
  else body.appendChild(options.body);

  const footer = el("div", "lc-modal__foot");
  for (const action of options.actions ?? []) {
    const button = el("button", `lc-btn${action.primary ? " lc-btn--primary" : ""}`, action.label);
    button.type = "button";
    button.addEventListener("click", () => {
      const result = action.action?.();
      if (result === false) return;
      if (action.close !== false) closeModal();
    });
    footer.appendChild(button);
  }

  card.append(header, body);
  if (footer.childElementCount > 0) card.appendChild(footer);
  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
  activeModal = backdrop;

  backdrop.addEventListener("pointerdown", (event) => {
    if (event.target === backdrop) closeModal();
  });
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && activeModal === backdrop) {
        event.stopPropagation();
        closeModal();
      }
    },
    true
  );
  return card;
}

/* ------------------------------------------------------------------ 消息条 */

let toastNode: HTMLElement | null = null;
let toastTimer = 0;

export function toast(message: string, kind: "info" | "good" | "warn" = "info"): void {
  if (!toastNode) {
    toastNode = el("div", "lc-toast");
    toastNode.setAttribute("role", "status");
    toastNode.setAttribute("aria-live", "polite");
    document.body.appendChild(toastNode);
  }
  toastNode.textContent = message;
  toastNode.dataset["kind"] = kind;
  toastNode.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastNode?.classList.remove("is-visible"), 2400);
}

/* ------------------------------------------------------------------ 评分 / 旗标 */

export function starControl(value: number, onRate: (rating: number) => void, size = 14): HTMLElement {
  const group = el("div", "lc-rating");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "评分");
  const buttons: HTMLButtonElement[] = [];

  const paint = (count: number) => {
    buttons.forEach((button, index) => {
      const on = index < count;
      button.classList.toggle("is-on", on);
      button.innerHTML = icon(on ? "starFill" : "star", size);
    });
  };

  for (let i = 0; i < 5; i++) {
    const button = el("button", "lc-rating__star");
    button.type = "button";
    button.title = `${i + 1} 星`;
    button.setAttribute("aria-label", `${i + 1} 星`);
    button.addEventListener("mouseenter", () => paint(i + 1));
    button.addEventListener("mouseleave", () => paint(value));
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = value === i + 1 ? 0 : i + 1;
      onRate(next);
    });
    buttons.push(button);
    group.appendChild(button);
  }
  paint(value);
  return group;
}

export type FlagKind = "none" | "pick" | "reject";

export function flagControl(value: FlagKind, onSet: (flag: FlagKind) => void): HTMLElement {
  const group = el("div", "lc-flags");
  const entries: Array<[FlagKind, string, string]> = [
    ["pick", "flagPick", "标记为精选"],
    ["reject", "flagReject", "标记为排斥"],
    ["none", "flagNone", "清除旗标"]
  ];
  for (const [kind, name, title] of entries) {
    const button = el("button", "lc-icon-btn lc-flags__btn");
    button.type = "button";
    button.title = title;
    button.setAttribute("aria-label", title);
    button.innerHTML = icon(name, 15);
    button.classList.toggle("is-on", value === kind && kind !== "none");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onSet(kind);
    });
    group.appendChild(button);
  }
  return group;
}

/** 数字格式化：正数带 +，负数带 −，保留指定小数位。 */
export function formatSigned(value: number, digits = 0): string {
  if (Math.abs(value) < 1e-6) return digits > 0 ? (0).toFixed(digits) : "0";
  const text = Math.abs(value).toFixed(digits);
  return `${value > 0 ? "+" : "−"}${text}`;
}
