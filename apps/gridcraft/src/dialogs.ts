/** Small modal dialog helpers. */

const openDialogs: Array<HTMLElement> = [];

export interface DialogOptions {
  title: string;
  body: string | HTMLElement;
  width?: number;
  footer?: string | HTMLElement;
  className?: string;
  onClose?: () => void;
  onMount?: (root: HTMLElement, close: () => void) => void;
}

export interface DialogHandle {
  root: HTMLElement;
  close: () => void;
}

export function openDialog(options: DialogOptions): DialogHandle {
  const backdrop = document.createElement("div");
  backdrop.className = "gc-modal-backdrop";
  const card = document.createElement("section");
  card.className = `gc-dialog${options.className ? ` ${options.className}` : ""}`;
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.style.width = `${options.width ?? 460}px`;
  card.innerHTML = `
    <header class="gc-dialog-head">
      <h2>${options.title}</h2>
      <button class="gc-icon-btn gc-dialog-close" type="button" title="Close">×</button>
    </header>
    <div class="gc-dialog-body"></div>
    <footer class="gc-dialog-foot"></footer>
  `;
  const body = card.querySelector<HTMLElement>(".gc-dialog-body");
  if (body) {
    if (typeof options.body === "string") body.innerHTML = options.body;
    else body.appendChild(options.body);
  }
  const footer = card.querySelector<HTMLElement>(".gc-dialog-foot");
  if (footer) {
    if (typeof options.footer === "string") footer.innerHTML = options.footer;
    else if (options.footer) footer.appendChild(options.footer);
    else footer.remove();
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    if (openDialogs[openDialogs.length - 1] !== backdrop) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  };
  const close = () => {
    document.removeEventListener("keydown", onKeyDown, true);
    backdrop.remove();
    const index = openDialogs.indexOf(backdrop);
    if (index >= 0) openDialogs.splice(index, 1);
    options.onClose?.();
  };
  document.addEventListener("keydown", onKeyDown, true);
  card.querySelector(".gc-dialog-close")?.addEventListener("click", close);
  backdrop.addEventListener("mousedown", event => {
    if (event.target === backdrop) close();
  });
  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
  openDialogs.push(backdrop);
  requestAnimationFrame(() => {
    const focusable = card.querySelector<HTMLElement>("input, textarea, select, button");
    focusable?.focus();
  });
  options.onMount?.(card, close);
  return { root: card, close };
}

export function isDialogOpen(): boolean {
  return openDialogs.length > 0;
}

export function closeDialog(): void {
  const last = openDialogs[openDialogs.length - 1];
  if (!last) return;
  last.remove();
  openDialogs.pop();
}

export function promptDialog(
  title: string,
  label: string,
  value: string,
  onOk: (value: string) => void,
  options: { placeholder?: string; okLabel?: string; multiline?: boolean } = {}
): void {
  const field = options.multiline
    ? `<textarea class="gc-input" rows="4" placeholder="${options.placeholder ?? ""}">${escape(value)}</textarea>`
    : `<input class="gc-input" value="${escape(value)}" placeholder="${options.placeholder ?? ""}" />`;
  const dialog = openDialog({
    title,
    width: 420,
    body: `<label class="gc-field"><span>${label}</span>${field}</label>`,
    footer: `<button class="gc-btn" data-role="cancel" type="button">Cancel</button><button class="gc-btn gc-btn--primary" data-role="ok" type="button">${
      options.okLabel ?? "OK"
    }</button>`
  });
  const input = dialog.root.querySelector<HTMLInputElement | HTMLTextAreaElement>(".gc-input");
  const submit = () => {
    onOk(input?.value ?? "");
    dialog.close();
  };
  dialog.root.querySelector('[data-role="ok"]')?.addEventListener("click", submit);
  dialog.root.querySelector('[data-role="cancel"]')?.addEventListener("click", dialog.close);
  (input as HTMLInputElement | null)?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !options.multiline) submit();
  });
  input?.focus();
  input?.select();
}

export function confirmDialog(title: string, message: string, onOk: () => void): void {
  const dialog = openDialog({
    title,
    width: 420,
    body: `<p class="gc-dialog-text">${message}</p>`,
    footer: `<button class="gc-btn" data-role="cancel" type="button">Cancel</button><button class="gc-btn gc-btn--primary" data-role="ok" type="button">OK</button>`
  });
  dialog.root.querySelector('[data-role="ok"]')?.addEventListener("click", () => {
    dialog.close();
    onOk();
  });
  dialog.root.querySelector('[data-role="cancel"]')?.addEventListener("click", dialog.close);
}

export function escape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
