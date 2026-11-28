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
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.startsWith("lg-")
      }
    }
  },
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ["meta", { name: "theme-color", content: "#181818" }],
    ["link", { rel: "icon", href: `${base}logo.svg` }]
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
          { text: "Blender UI 规范", link: "/design/blender-ui" },
          { text: "测试", link: "/testing" }
        ]
      },
      {
        text: "组件",
        items: [
          { text: "组件总览", link: "/components" },
          {
            text: "布局",
            collapsed: false,
            items: [
              { text: "Area", link: "/components/area" },
              { text: "Box", link: "/components/box" },
              { text: "Panel", link: "/components/panel" },
              { text: "Split", link: "/components/split" },
              { text: "Tabs", link: "/components/tabs" },
              { text: "Viewport", link: "/components/viewport" }
            ]
          },
          {
            text: "浮层",
            collapsed: false,
            items: [
              { text: "Dialog", link: "/components/dialog" },
              { text: "Menu", link: "/components/menu" },
              { text: "ContextMenu", link: "/components/context-menu" }
            ]
          },
          {
            text: "表单",
            collapsed: false,
            items: [
              { text: "Button", link: "/components/button" },
              { text: "Checkbox", link: "/components/checkbox" },
              { text: "Slider", link: "/components/slider" },
              { text: "SearchBox", link: "/components/searchbox" },
              { text: "Dragger", link: "/components/dragger" },
              { text: "LineEditor", link: "/components/line-editor" }
            ]
          },
          {
            text: "数据展示",
            collapsed: false,
            items: [
              { text: "List", link: "/components/list" },
              { text: "ComplexList", link: "/components/complex-list" },
              { text: "Table", link: "/components/table" },
              { text: "Console", link: "/components/console" }
            ]
          },
          { text: "实验性组件", link: "/experimental" }
        ]
      },
      {
        text: "进阶",
        items: [
          { text: "Web Components", link: "/web-components" },
          { text: "Vue 绑定", link: "/vue" },
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
