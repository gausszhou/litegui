import type { App, Component } from "vue";
import { LiteGuiArea } from "./components/area";
import { LiteGuiBox } from "./components/box";
import { LiteGuiButton } from "./components/button";
import { LiteGuiCheckbox } from "./components/checkbox";
import { LiteGuiComplexList } from "./components/complex-list";
import { LiteGuiConsole } from "./components/console";
import { LiteGuiContextMenu } from "./components/context-menu";
import { LiteGuiDialog } from "./components/dialog";
import { LiteGuiDragger } from "./components/dragger";
import { LiteGuiHeaderBar } from "./components/header-bar";
import { LiteGuiImageEditor } from "./components/image-editor";
import { LiteGuiInspector } from "./components/inspector";
import { LiteGuiLineEditor } from "./components/line-editor";
import { LiteGuiMenu } from "./components/menu";
import { LiteGuiNodeEditor } from "./components/node-editor";
import { LiteGuiPanel } from "./components/panel";
import { LiteGuiList } from "./components/list";
import { LiteGuiSearchBox } from "./components/searchbox";
import { LiteGuiSlider } from "./components/slider";
import { LiteGuiSplit } from "./components/split";
import { LiteGuiStatusBar } from "./components/status-bar";
import { LiteGuiTable } from "./components/table";
import { LiteGuiTabs } from "./components/tabs";
import { LiteGuiTextEditor } from "./components/text-editor";
import { LiteGuiTimeline } from "./components/timeline";
import { LiteGuiToolbar } from "./components/toolbar";
import { LiteGuiTree } from "./components/tree";
import { LiteGuiViewport } from "./components/viewport";

export * from "./components/area";
export * from "./components/box";
export * from "./components/button";
export * from "./components/checkbox";
export * from "./components/complex-list";
export * from "./components/console";
export * from "./components/context-menu";
export * from "./components/dialog";
export * from "./components/dragger";
export * from "./components/header-bar";
export * from "./components/image-editor";
export * from "./components/inspector";
export * from "./components/line-editor";
export * from "./components/menu";
export * from "./components/node-editor";
export * from "./components/panel";
export * from "./components/list";
export * from "./components/searchbox";
export * from "./components/slider";
export * from "./components/split";
export * from "./components/status-bar";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/text-editor";
export * from "./components/timeline";
export * from "./components/toolbar";
export * from "./components/tree";
export * from "./components/viewport";

export const components: Record<string, Component> = {
  LiteGuiArea,
  LiteGuiBox,
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiComplexList,
  LiteGuiConsole,
  LiteGuiContextMenu,
  LiteGuiDialog,
  LiteGuiDragger,
  LiteGuiHeaderBar,
  LiteGuiImageEditor,
  LiteGuiInspector,
  LiteGuiLineEditor,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiNodeEditor,
  LiteGuiPanel,
  LiteGuiSearchBox,
  LiteGuiSlider,
  LiteGuiSplit,
  LiteGuiStatusBar,
  LiteGuiTable,
  LiteGuiTabs,
  LiteGuiTextEditor,
  LiteGuiTimeline,
  LiteGuiToolbar,
  LiteGuiTree,
  LiteGuiViewport
};

/**
 * Vue 插件：app.use(LiteGuiVue) 一次注册全部组件。
 */
export const LiteGuiVue = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  }
};

export default LiteGuiVue;
