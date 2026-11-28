/** Lightweight popup menus used by the ribbon, context menus and dropdowns. */

import { icon } from "./icons";

export interface MenuItem {
  label?: string;
  icon?: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  header?: boolean;
  hint?: string;
  swatches?: string[];
  swatchColumns?: number;
  onSwatch?: (color: string) => void;
  action?: () => void;
  submenu?: MenuItem[];
  /** Keep the root menu open after the action (used for toggles). */
  sticky?: boolean;
}

export type MenuSection = MenuItem[];

interface OpenMenu {
  root: HTMLElement;
  anchor: HTMLElement | null;
  parents: HTMLElement[];
}

let open: OpenMenu | null = null;

export function isMenuOpen(): boolean {
  return open !== null;
}

export function closeMenus(): void {
  if (!open) return;
  for (const element of open.parents) element.remove();
  open.root.remove();
  open.anchor?.classList.remove("gc-menu-anchor--open");
  open = null;
}

function buildMenu(items: MenuSection, depth: number): HTMLElement {
  const menu = document.createElement("div");
  menu.className = `gc-menu${depth > 0 ? " gc-menu--sub" : ""}`;
  menu.setAttribute("role", "menu");
  for (const item of items) {
    if (!item) continue;
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "gc-menu-sep";
      menu.appendChild(separator);
      continue;
    }
    if (item.header) {
      const header = document.createElement("div");
      header.className = "gc-menu-header";
      header.textContent = item.label ?? "";
      menu.appendChild(header);
      continue;
    }
    if (item.swatches) {
      const grid = document.createElement("div");
      grid.className = "gc-swatches";
      grid.style.gridTemplateColumns = `repeat(${item.swatchColumns ?? 8}, 20px)`;
      for (const color of item.swatches) {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "gc-swatch";
        swatch.title = color === "transparent" ? "No fill" : color;
        swatch.style.background = color === "transparent" ? "#ffffff" : color;
        if (color === "transparent") swatch.innerHTML = '<span class="gc-swatch-slash"></span>';
        swatch.addEventListener("click", () => {
          item.onSwatch?.(color);
          item.action?.();
          if (!item.sticky) closeMenus();
        });
        grid.appendChild(swatch);
      }
      menu.appendChild(grid);
      continue;
    }
    const row = document.createElement("button");
    row.type = "button";
    row.className = `gc-menu-item${item.disabled ? " is-disabled" : ""}${item.danger ? " is-danger" : ""}${
      item.checked ? " is-checked" : ""
    }`;
    row.setAttribute("role", "menuitem");
    if (item.disabled) row.disabled = true;
    row.innerHTML = `
      <span class="gc-menu-icon">${item.checked ? icon("check", 13) : item.icon ? icon(item.icon, 15) : ""}</span>
      <span class="gc-menu-label">${item.label ?? ""}</span>
      ${item.shortcut ? `<span class="gc-menu-shortcut">${item.shortcut}</span>` : ""}
      ${item.submenu ? `<span class="gc-menu-caret">${icon("chevron-right", 12)}</span>` : ""}
      ${item.hint ? `<span class="gc-menu-hint">${item.hint}</span>` : ""}
    `;
    if (item.submenu && !item.disabled) {
      let submenuEl: HTMLElement | null = null;
      const openSub = () => {
        if (submenuEl) return;
        submenuEl = buildMenu(item.submenu ?? [], depth + 1);
        document.body.appendChild(submenuEl);
        const rect = row.getBoundingClientRect();
        const subRect = submenuEl.getBoundingClientRect();
        let left = rect.right - 2;
        if (left + subRect.width > window.innerWidth - 6) left = rect.left - subRect.width + 2;
        let top = rect.top - 4;
        if (top + subRect.height > window.innerHeight - 6) top = Math.max(6, window.innerHeight - subRect.height - 6);
        submenuEl.style.left = `${Math.max(4, left)}px`;
        submenuEl.style.top = `${top}px`;
        open?.parents.push(submenuEl);
        row.classList.add("is-open");
      };
      row.addEventListener("mouseenter", openSub);
      row.addEventListener("click", event => {
        event.stopPropagation();
        openSub();
      });
      row.addEventListener("mouseleave", () => {
        window.setTimeout(() => {
          if (submenuEl && !submenuEl.matches(":hover") && !row.matches(":hover")) {
            submenuEl.remove();
            open?.parents.splice(open.parents.indexOf(submenuEl), 1);
            submenuEl = null;
            row.classList.remove("is-open");
          }
        }, 180);
      });
    } else if (!item.disabled) {
      row.addEventListener("click", () => {
        item.action?.();
        if (!item.sticky) closeMenus();
      });
    }
    menu.appendChild(row);
  }
  return menu;
}

function placeMenu(
  menu: HTMLElement,
  anchor: HTMLElement | null,
  x?: number,
  y?: number,
  align: "left" | "right" = "left"
): void {
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  let left: number;
  let top: number;
  if (anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    left = align === "right" ? anchorRect.right - rect.width : anchorRect.left;
    top = anchorRect.bottom + 2;
  } else {
    left = x ?? 0;
    top = y ?? 0;
  }
  if (left + rect.width > window.innerWidth - 6) left = window.innerWidth - rect.width - 6;
  if (top + rect.height > window.innerHeight - 6) top = Math.max(6, window.innerHeight - rect.height - 6);
  menu.style.left = `${Math.max(4, left)}px`;
  menu.style.top = `${Math.max(4, top)}px`;
}

export function openMenuAt(
  anchor: HTMLElement | null,
  items: MenuSection,
  options: { x?: number; y?: number; align?: "left" | "right"; className?: string } = {}
): void {
  closeMenus();
  const menu = buildMenu(items, 0);
  if (options.className) menu.classList.add(options.className);
  placeMenu(menu, anchor, options.x, options.y, options.align);
  anchor?.classList.add("gc-menu-anchor--open");
  open = { root: menu, anchor, parents: [] };
}

export function openMenu(x: number, y: number, items: MenuSection): void {
  closeMenus();
  const menu = buildMenu(items, 0);
  placeMenu(menu, null, x, y);
  open = { root: menu, anchor: null, parents: [] };
}

export function initMenus(): void {
  document.addEventListener("mousedown", event => {
    if (!open) return;
    const target = event.target as Node;
    if (open.root.contains(target)) return;
    if (open.parents.some(element => element.contains(target))) return;
    if (open.anchor?.contains(target)) return;
    closeMenus();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && open) {
      closeMenus();
      event.stopPropagation();
    }
  });
  window.addEventListener("resize", () => closeMenus());
  window.addEventListener("scroll", () => closeMenus(), true);
}
