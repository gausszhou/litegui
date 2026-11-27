import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import ComponentDemo from "./components/ComponentDemo.vue";
import ComponentGallery from "./components/ComponentGallery.vue";
import "@gausszhou/litegui-elements";
import "@gausszhou/litegui-elements/tokens.css";
import "./generated/litegui-demo.css";
import "./custom.css";

// 让 LiteGUI 的 tokens 跟随文档站的深色模式（html.dark）。
if (typeof document !== "undefined") {
  const applyTheme = () => {
    document.documentElement.dataset.lgTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  };
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"]
  });
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ComponentDemo", ComponentDemo);
    app.component("ComponentGallery", ComponentGallery);
  }
} satisfies Theme;
