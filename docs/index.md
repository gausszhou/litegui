---
layout: home

hero:
  name: LiteGUI
  text: 无框架的桌面式 Web UI
  tagline: 原生 DOM + TypeScript，面向编辑器、工具台与内部工具
  image:
    src: /logo.svg
    alt: LiteGUI
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started
    - theme: alt
      text: 组件
      link: /components
    - theme: alt
      text: 在线 Editor
      link: https://gausszhou.github.io/litegui/editor/

features:
  - title: 零框架依赖
    details: 直接操作 DOM，可嵌入 React、Vue、Canvas/WebGL 编辑器或纯 HTML 页面。
  - title: 桌面式布局
    details: Area、Panel、Split、Tabs、Dialog、Menu，组合出工具台界面。
  - title: 可测试
    details: Vitest + jsdom 125 个用例，Playwright 覆盖 Chrome/Firefox。
  - title: 可定制
    details: CSS 变量主题、亮/暗模式、按组件 ESM 入口。
---

## 快速预览

```ts
import LiteGUI from "@gausszhou/litegui-components";
import "@gausszhou/litegui-components/style.css";

LiteGUI.init({ container: "#app", menubar: true });

const area = new LiteGUI.Area({ id: "main", height: "100%" });
LiteGUI.add(area);
area.split("horizontal", [null, 320], true);
```

[查看完整示例 →](/examples)
