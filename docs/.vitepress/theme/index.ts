import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import ComponentDemo from "./components/ComponentDemo.vue";
import ComponentGallery from "./components/ComponentGallery.vue";
import "./generated/litegui-demo.css";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ComponentDemo", ComponentDemo);
    app.component("ComponentGallery", ComponentGallery);
  },
} satisfies Theme;
