import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "LiteGUI",
  description: "无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库",
  base: "/litegui/",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#181818" }],
    ["link", { rel: "icon", href: "/litegui/logo.svg" }]
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "LiteGUI",
    nav: [
      { text: "指南", link: "/getting-started", activeMatch: "^/getting-started|^/theming|^/testing" },
      { text: "组件", link: "/components", activeMatch: "^/components" },
      { text: "示例", link: "/examples" },
      { text: "实验性", link: "/experimental" },
      { text: "更新日志", link: "/changelog" }
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "快速开始", link: "/getting-started" },
          { text: "主题", link: "/theming" },
          { text: "测试", link: "/testing" }
        ]
      },
      {
        text: "组件",
        items: [
          { text: "组件概览", link: "/components" },
          { text: "布局", link: "/components/layout" },
          { text: "浮层", link: "/components/overlays" },
          { text: "表单", link: "/components/forms" },
          { text: "数据展示", link: "/components/data" }
        ]
      },
      {
        text: "进阶",
        items: [
          { text: "示例", link: "/examples" },
          { text: "实验性组件", link: "/experimental" },
          { text: "API 稳定性", link: "/api-stability" },
          { text: "从 0.2 迁移", link: "/migration" },
          { text: "更新日志", link: "/changelog" }
        ]
      }
    ],
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/gausszhou/litegui" }],
    editLink: {
      pattern: "https://github.com/gausszhou/litegui/edit/develop/docs/:path",
      text: "在 GitHub 编辑此页"
    },
    footer: {
      message: "MIT Licensed",
      copyright: "Copyright © 2022-2026 gausszhou"
    },
    outline: { level: [2, 3], label: "本页目录" },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdatedText: "最后更新",
    returnToTopLabel: "回到顶部"
  }
});
