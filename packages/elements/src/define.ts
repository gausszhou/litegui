import { LiteGuiAreaElement } from "./elements/area";
import { LiteGuiBoxElement } from "./elements/box";
import { LiteGuiButtonElement } from "./elements/button";
import { LiteGuiCheckboxElement } from "./elements/checkbox";
import { LiteGuiComplexListElement } from "./elements/complex-list";
import { LiteGuiConsoleElement } from "./elements/console";
import { LiteGuiContextMenuElement } from "./elements/context-menu";
import { LiteGuiDialogElement } from "./elements/dialog";
import { LiteGuiDraggerElement } from "./elements/dragger";
import { LiteGuiHeaderBarElement } from "./elements/header-bar";
import { LiteGuiImageEditorElement } from "./elements/image-editor";
import { LiteGuiInspectorElement } from "./elements/inspector";
import { LiteGuiLineEditorElement } from "./elements/line-editor";
import { LiteGuiListElement } from "./elements/list";
import { LiteGuiMenuElement, LiteGuiMenuItemElement } from "./elements/menu";
import { LiteGuiNodeEditorElement } from "./elements/node-editor";
import { LiteGuiPanelElement } from "./elements/panel";
import { LiteGuiSearchBoxElement } from "./elements/searchbox";
import { LiteGuiSliderElement } from "./elements/slider";
import { LiteGuiSplitElement } from "./elements/split";
import { LiteGuiStatusBarElement } from "./elements/status-bar";
import { LiteGuiTableElement } from "./elements/table";
import { LiteGuiTabsElement } from "./elements/tabs";
import { LiteGuiTextEditorElement } from "./elements/text-editor";
import { LiteGuiTimelineElement } from "./elements/timeline";
import { LiteGuiToolbarElement } from "./elements/toolbar";
import { LiteGuiTreeElement } from "./elements/tree";

export const ELEMENT_TAGS = {
  // 基础控件
  "lg-button": LiteGuiButtonElement,
  "lg-checkbox": LiteGuiCheckboxElement,
  "lg-slider": LiteGuiSliderElement,
  "lg-searchbox": LiteGuiSearchBoxElement,
  "lg-dragger": LiteGuiDraggerElement,
  "lg-tabs": LiteGuiTabsElement,
  "lg-list": LiteGuiListElement,
  "lg-table": LiteGuiTableElement,
  "lg-console": LiteGuiConsoleElement,
  "lg-complex-list": LiteGuiComplexListElement,
  "lg-tree": LiteGuiTreeElement,
  "lg-inspector": LiteGuiInspectorElement,
  "lg-line-editor": LiteGuiLineEditorElement,
  // 布局
  "lg-area": LiteGuiAreaElement,
  "lg-split": LiteGuiSplitElement,
  "lg-box": LiteGuiBoxElement,
  "lg-context-menu": LiteGuiContextMenuElement,
  // 面板 / 工作区
  "lg-panel": LiteGuiPanelElement,
  "lg-dialog": LiteGuiDialogElement,
  "lg-menu": LiteGuiMenuElement,
  "lg-menu-item": LiteGuiMenuItemElement,
  "lg-header-bar": LiteGuiHeaderBarElement,
  "lg-status-bar": LiteGuiStatusBarElement,
  "lg-timeline": LiteGuiTimelineElement,
  "lg-toolbar": LiteGuiToolbarElement,
  "lg-node-editor": LiteGuiNodeEditorElement,
  "lg-text-editor": LiteGuiTextEditorElement,
  "lg-image-editor": LiteGuiImageEditorElement
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
