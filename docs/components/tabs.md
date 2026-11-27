---
title: Tabs
description: 标签页
---

# Tabs

Tabs 提供标签栏与内容区，支持关闭按钮、加号标签和按钮式标签。

<ComponentDemo name="tabs/basic" title="基础标签页" height="240px" />

<<< @/demos/tabs/basic.vue

## 用法

```ts
const tabs = new Tabs();
tabs.addTab("info", { title: "信息", content: "内容" });
tabs.addTab("tree", { title: "层级", content: "内容" });
tabs.appendTo(container);
tabs.selectTab("tree");
```

## Options（构造）

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | `"horizontal" \| "vertical"` | 标签栏方向 |
| `width` / `height` | `number \| string` | 整体尺寸 |
| `trigger` | `"click" \| "hover"` | 切换触发方式 |
| `callback` | `(id, tab, content) => void` | 标签切换回调 |

## `addTab(id, options)`

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 标签文字 |
| `content` | `string \| HTMLElement` | 内容 |
| `closable` | `boolean` | 显示关闭按钮 |
| `selected` | `boolean` | 默认选中 |
| `button` | `boolean` | 渲染为按钮标签 |
| `bigicon` | `string` | 标签图标 URL |
| `index` | `number` | 插入位置 |
| `callback` | `Function` | 选中回调 |
| `callback_canopen` | `() => boolean` | 返回 `false` 时阻止切换 |
| `callback_leave` | `Function` | 离开该标签时回调 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `addTab` / `addPlusTab` / `addButtonTab` | 添加标签 |
| `selectTab(id)` | 选中标签 |
| `getCurrentTab()` / `getCurrentTabId()` | 当前标签 |
| `getTabContent(id)` | 标签内容元素 |
| `appendTo(parent)` | 挂载到容器 |
| `show()` / `hide()` | 显示 / 隐藏 |
