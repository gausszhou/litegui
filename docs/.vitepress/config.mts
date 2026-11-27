import { defineConfig } from "vitepress";

const repository = "https://github.com/gausszhou/litegui";
// 文档站在 Pages 上位于 /litegui/docs/；本地/自定义部署可用 DOCS_BASE 覆盖。
const base = process.env.DOCS_BASE || "/litegui/docs/";

export default defineConfig({
  lang: "zh-CN",
  title: "LiteGUI",
  description: "无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库",
  base,
  outDir: "../dist/docs",
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ["meta", { name: "theme-color", content: "#181818" }],
    ["link", { rel: "icon", href: "/logo.svg" }]
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "LiteGUI",
    nav: [
      { text: "指南", link: "/getting-started", activeMatch: "^/getting-started|^/theming|^/testing|^/packages" },
      { text: "组件", link: "/components", activeMatch: "^/components" },
      { text: "示例", link: "/examples" },
      { text: "API", link: "/api/" },
      { text: "实验性", link: "/experimental" },
      { text: "更新日志", link: "/changelog" }
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "快速开始", link: "/getting-started" },
          { text: "包与导入", link: "/packages" },
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
          { text: "API 参考", link: "/api/" },
          { text: "API 稳定性", link: "/api-stability" },
          { text: "迁移指南", link: "/migration" },
          { text: "更新日志", link: "/changelog" }
        ]
      }
    ],
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: repository }],
    editLink: {
      pattern: `${repository}/edit/master/docs/:path`,
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
