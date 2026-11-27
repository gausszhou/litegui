import type { App, Component } from "vue";
import { LiteGuiButton } from "./components/button";
import { LiteGuiCheckbox } from "./components/checkbox";
import { LiteGuiDialog } from "./components/dialog";
import { LiteGuiMenu } from "./components/menu";
import { LiteGuiPanel } from "./components/panel";
import { LiteGuiSlider } from "./components/slider";

export * from "./components/button";
export * from "./components/checkbox";
export * from "./components/dialog";
export * from "./components/menu";
export * from "./components/panel";
export * from "./components/slider";

export const components: Record<string, Component> = {
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiSlider,
  LiteGuiPanel,
  LiteGuiDialog,
  LiteGuiMenu
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
