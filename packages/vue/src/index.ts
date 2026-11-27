import type { App, Component } from "vue";
import { LiteGuiButton } from "./components/button";
import { LiteGuiCheckbox } from "./components/checkbox";
import { LiteGuiConsole } from "./components/console";
import { LiteGuiDialog } from "./components/dialog";
import { LiteGuiDragger } from "./components/dragger";
import { LiteGuiMenu } from "./components/menu";
import { LiteGuiPanel } from "./components/panel";
import { LiteGuiList } from "./components/list";
import { LiteGuiSearchBox } from "./components/searchbox";
import { LiteGuiSlider } from "./components/slider";
import { LiteGuiSplit } from "./components/split";
import { LiteGuiTable } from "./components/table";
import { LiteGuiTabs } from "./components/tabs";

export * from "./components/button";
export * from "./components/checkbox";
export * from "./components/console";
export * from "./components/dialog";
export * from "./components/dragger";
export * from "./components/menu";
export * from "./components/panel";
export * from "./components/list";
export * from "./components/searchbox";
export * from "./components/slider";
export * from "./components/split";
export * from "./components/table";
export * from "./components/tabs";

export const components: Record<string, Component> = {
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiSlider,
  LiteGuiPanel,
  LiteGuiConsole,
  LiteGuiDialog,
  LiteGuiDragger,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiSearchBox,
  LiteGuiSplit,
  LiteGuiTable,
  LiteGuiTabs
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
