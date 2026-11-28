export interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  checked?: boolean;
  /** 稳定的测试/自动化选择器。 */
  command?: string;
}

export function buildMenu(items: MenuItem[], onSelect: () => void): HTMLElement {
  const menu = document.createElement("div");
  menu.className = "vc-menu";
  for (const item of items) {
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "vc-menu-sep";
      menu.appendChild(separator);
      continue;
    }
    const row = document.createElement("button");
    row.type = "button";
    row.className = `vc-menu-item${item.disabled ? " is-disabled" : ""}`;
    if (item.command) row.dataset.command = item.command;
    row.innerHTML = `<span class="vc-menu-check">${item.checked ? "✓" : ""}</span><span class="vc-menu-label">${
      item.label ?? ""
    }</span><span class="vc-menu-shortcut">${item.shortcut ?? ""}</span>`;
    row.addEventListener("click", () => {
      if (item.disabled) return;
      onSelect();
      item.action?.();
    });
    menu.appendChild(row);
  }
  return menu;
}

export function positionMenu(menu: HTMLElement, x: number, y: number) {
  menu.style.left = `${Math.max(6, Math.min(x, window.innerWidth - menu.offsetWidth - 8))}px`;
  menu.style.top = `${Math.max(6, Math.min(y, window.innerHeight - menu.offsetHeight - 8))}px`;
}

export interface ModalHandle {
  root: HTMLElement;
  close: () => void;
}

/** 统一的模态骨架：点击遮罩、关闭按钮或按 Esc 关闭。 */
export function openModal(html: string, onMount?: (handle: ModalHandle) => void): ModalHandle {
  const root = document.createElement("div");
  root.className = "vc-modal-backdrop";
  root.innerHTML = html;
  document.body.appendChild(root);
  const close = () => root.remove();
  root.tabIndex = -1;
  root.addEventListener("click", event => {
    const element = event.target as HTMLElement;
    if (element === root || element.closest("[data-modal]")) close();
  });
  root.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
  root.focus();
  onMount?.({ root, close });
  return { root, close };
}
