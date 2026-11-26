---
title: 布局
description: Area、Panel、Split 与 Tabs
---

# 布局

## Area

`Area` 是可分割的布局容器，是工具台界面的基础。

```ts
const area = new LiteGUI.Area({ id: "main", width: "100%", height: "100%" });
LiteGUI.add(area);
area.split("horizontal", [240, null], true);

const left = area.getSection(0);
left.split("vertical", [null, 160], true);
```

| 方法 | 说明 |
| --- | --- |
| `split(direction, sizes, editable)` | `horizontal`/`vertical`，`null` 表示剩余空间 |
| `getSection(index)` | 获取子区域 |
| `hideSection(index)` / `showSection(index)` | 折叠/展开 |
| `merge(index)` | 合并回单区域 |
| `onResize` | 尺寸变化回调 |

## Panel

```ts
const panel = new LiteGUI.Panel({
  id: "side",
  title: "Properties",
  content: "<p>Hello</p>",
  close: true
});

panel.on("closed", () => console.log("closed"));
```

`Panel` 的 `content` 是普通 HTMLElement，可直接 `appendChild` 组件。

## Split

`Split` 适合固定比例分栏：

```ts
const split = new LiteGUI.Split([60, 40], { vertical: true, parent: area.getSection(0) });
split.getSection(0).add(panel.root);
```

数字表示百分比，字符串可作为 CSS 尺寸。

## Tabs

```ts
const tabs = new LiteGUI.Tabs();
tabs.addTab("info", { title: "Info", content: "Details" });
tabs.addTab("tree", { title: "Tree", content: "Tree content" });
tabs.selectTab("tree");
tabs.appendTo(panel.content);
```

Tabs 自动维护 `role="tablist"`、`aria-selected` 与 `tabpanel`。
