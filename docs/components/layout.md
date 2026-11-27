---
title: 布局
description: Area / Box / Panel / Split / Tabs
---

# 布局

| 组件 | 说明 |
| --- | --- |
| [Area](/components/area) | 可分割、可拖拽调整的布局容器 |
| [Box](/components/box) | 极简 div 容器 |
| [Panel](/components/panel) | 带标题与关闭按钮的面板 |
| [Split](/components/split) | 固定比例分栏 |
| [Tabs](/components/tabs) | 标签页 |

组合示例：

```ts
const area = new Area({ height: "100%" });
area.split("horizontal", [null, 320], true);

const left = area.getSection(0);
const right = area.getSection(1);

right.add(new Panel({ title: "属性" }));
left.add(new Tabs());
```
