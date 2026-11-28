import { icon, type IconName } from "./icons";

/* ------------------------------------------------------------------ helpers */

export function q<T extends Element>(selector: string, root: ParentNode = document): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Missing element: ${selector}`);
  return found;
}

export function escapeHTML(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number): (...args: A) => void {
  let timer = 0;
  return (...args: A) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function nowStamp(): string {
  const date = new Date();
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export function shortDate(stamp: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(stamp);
  if (!match) return stamp;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[Number(match[2]) - 1] ?? match[2];
  return `${Number(match[3])} ${month} · ${match[4]}:${match[5]}`;
}

export function iconButton(name: IconName, title: string, className = "", size = 16): string {
  return `<button type="button" class="pf-icon-btn ${className}" title="${escapeHTML(title)}" aria-label="${escapeHTML(
    title
  )}">${icon(name, size)}</button>`;
}

/* ------------------------------------------------------------------ popup */

export interface PopupItem {
  label?: string;
  shortcut?: string;
  hint?: string;
  separator?: boolean;
  disabled?: boolean;
  checked?: boolean;
  icon?: IconName;
  action?: () => void;
}

let popup: HTMLElement | null = null;
let popupAnchor: HTMLElement | null = null;
let popupDismiss: ((event: MouseEvent) => void) | null = null;

export function closePopups(): void {
  if (popupDismiss) {
    document.removeEventListener("mousedown", popupDismiss, true);
    popupDismiss = null;
  }
  popup?.remove();
  popup = null;
  popupAnchor?.classList.remove("is-open");
  popupAnchor = null;
  document.querySelectorAll(".pf-popup-open").forEach(node => node.classList.remove("pf-popup-open"));
}

export function openPopup(x: number, y: number, items: PopupItem[], anchor?: HTMLElement): void {
  closePopups();
  const menu = document.createElement("div");
  menu.className = "pf-popup";
  menu.setAttribute("role", "menu");

  for (const item of items) {
    if (item.separator) {
      const rule = document.createElement("div");
      rule.className = "pf-popup-sep";
      menu.appendChild(rule);
      continue;
    }
    const row = document.createElement("button");
    row.type = "button";
    row.className = "pf-popup-item";
    if (item.disabled) row.disabled = true;
    if (item.checked) row.classList.add("is-checked");
    row.setAttribute("role", "menuitem");
    row.innerHTML = `
      <span class="pf-popup-check">${item.checked ? icon("check", 12) : ""}</span>
      ${item.icon ? `<span class="pf-popup-icon">${icon(item.icon, 15)}</span>` : ""}
      <span class="pf-popup-label">${escapeHTML(item.label ?? "")}</span>
      ${item.hint ? `<span class="pf-popup-hint">${escapeHTML(item.hint)}</span>` : ""}
      ${item.shortcut ? `<span class="pf-popup-shortcut">${escapeHTML(item.shortcut)}</span>` : ""}
    `;
    row.addEventListener("click", event => {
      event.stopPropagation();
      if (item.disabled) return;
      closePopups();
      item.action?.();
    });
    menu.appendChild(row);
  }

  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  const left = clamp(x, 8, Math.max(8, window.innerWidth - rect.width - 8));
  const top = clamp(y, 8, Math.max(8, window.innerHeight - rect.height - 8));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  popup = menu;
  popupAnchor = anchor ?? null;
  popupAnchor?.classList.add("is-open");

  popupDismiss = (event: MouseEvent) => {
    const target = event.target as Node;
    if (popup?.contains(target)) return;
    if (popupAnchor?.contains(target)) return;
    closePopups();
  };
  document.addEventListener("mousedown", popupDismiss, true);
}

export function openPopupAt(anchor: HTMLElement, items: PopupItem[], align: "left" | "right" = "left"): void {
  const rect = anchor.getBoundingClientRect();
  openPopup(align === "left" ? rect.left : rect.right, rect.bottom + 4, items, anchor);
}

/* ------------------------------------------------------------------ dialogs */

export interface DialogOptions {
  title: string;
  subtitle?: string;
  body: string;
  width?: number;
  footer?: string;
  className?: string;
  onMount?: (root: HTMLElement, close: () => void) => void;
}

export function openDialog(options: DialogOptions): { root: HTMLElement; close: () => void } {
  closePopups();
  const layer = document.createElement("div");
  layer.className = "pf-overlay";
  layer.innerHTML = `
    <div class="pf-dialog ${options.className ?? ""}" role="dialog" aria-modal="true" aria-label="${escapeHTML(
    options.title
  )}" style="width:${options.width ?? 520}px">
      <header class="pf-dialog-head">
        <div>
          <h2>${escapeHTML(options.title)}</h2>
          ${options.subtitle ? `<p>${escapeHTML(options.subtitle)}</p>` : ""}
        </div>
        <button type="button" class="pf-icon-btn" data-dialog-close title="Close">${icon("close", 15)}</button>
      </header>
      <div class="pf-dialog-body">${options.body}</div>
      <footer class="pf-dialog-foot">${options.footer ?? ""}</footer>
    </div>
  `;
  document.body.appendChild(layer);

  let closed = false;
  const close = (): void => {
    if (closed) return;
    closed = true;
    document.removeEventListener("keydown", onKey, true);
    layer.classList.add("is-closing");
    window.setTimeout(() => layer.remove(), 120);
  };
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKey, true);
  layer.addEventListener("mousedown", event => {
    if (event.target === layer) close();
  });
  layer.querySelectorAll("[data-dialog-close]").forEach(button => button.addEventListener("click", close));
  options.onMount?.(layer, close);
  const focusable = layer.querySelector<HTMLElement>("input, textarea, select, button:not([data-dialog-close])");
  focusable?.focus();
  return { root: layer, close };
}

/* ------------------------------------------------------------------ toasts */

let toastLayer: HTMLElement | null = null;

export function toast(message: string, tone: "info" | "success" | "warning" = "info"): void {
  if (!toastLayer) {
    toastLayer = document.createElement("div");
    toastLayer.className = "pf-toasts";
    document.body.appendChild(toastLayer);
  }
  const node = document.createElement("div");
  node.className = `pf-toast pf-toast-${tone}`;
  node.innerHTML = `<span class="pf-toast-dot"></span><span>${escapeHTML(message)}</span>`;
  toastLayer.appendChild(node);
  window.setTimeout(() => {
    node.classList.add("is-leaving");
    window.setTimeout(() => node.remove(), 220);
  }, 2600);
}
