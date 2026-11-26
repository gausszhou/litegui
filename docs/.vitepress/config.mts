import { defineConfig } from "vitepress";

export default defineConfig({
  title: "LiteGUI",
  description: "无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库",
  base: "/litegui/",
  themeConfig: {
    nav: [
      { text: "指南", link: "/getting-started" },
      { text: "组件", link: "/components" },
      { text: "示例", link: "/examples" }
    ],
    sidebar: [
      {
        text: "指南",
        items: [
          { text: "快速开始", link: "/getting-started" },
          { text: "示例", link: "/examples" },
          { text: "组件", link: "/components" }
        ]
      }
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/gausszhou/litegui" }]
  }
});
