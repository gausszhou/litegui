import { LiteGuiButtonElement } from "./elements/button";
import { LiteGuiCheckboxElement } from "./elements/checkbox";
import { LiteGuiDialogElement } from "./elements/dialog";
import { LiteGuiMenuElement, LiteGuiMenuItemElement } from "./elements/menu";
import { LiteGuiPanelElement } from "./elements/panel";

export const ELEMENT_TAGS = {
  "litegui-button": LiteGuiButtonElement,
  "litegui-checkbox": LiteGuiCheckboxElement,
  "litegui-panel": LiteGuiPanelElement,
  "litegui-dialog": LiteGuiDialogElement,
  "litegui-menu": LiteGuiMenuElement,
  "litegui-menu-item": LiteGuiMenuItemElement
} as const;

export type LiteGuiElementTag = keyof typeof ELEMENT_TAGS;

/**
 * 注册全部元素；已注册的标签会跳过，可重复调用。
 * 服务端（没有 customElements）下是 no-op。
 */
export function defineElements(registry?: CustomElementRegistry): void {
  const target = registry ?? (typeof customElements !== "undefined" ? customElements : null);
  if (!target) return;

  for (const [tag, ctor] of Object.entries(ELEMENT_TAGS)) {
    if (!target.get(tag)) {
      target.define(tag, ctor as CustomElementConstructor);
    }
  }
}
