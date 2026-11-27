---
title: Split
description: 固定比例分栏
---

# Split

Split 按比例切出固定的几栏，不提供拖拽调整；需要可拖拽的布局请用 [Area](/components/area)。

<ComponentDemo name="split/basic" title="左右分栏" height="220px" />

<<< @/demos/split/basic.vue

## 用法

```ts
const split = new Split([{ width: "35%" }, { width: "65%" }], { parent: container });
split.getSection(0).add(someComponent);
```

`new Split(sections, options)`：

- 分区可以是数字（百分比）、CSS 字符串，或 `{ id, width, height }` 对象。
- 设置 `options.vertical: true` 时按高度切分，否则按宽度切分。
- `options.parent` 可以是 `HTMLElement` 或带 `root` 的组件，构造时自动挂载。

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 根元素 id |
| `vertical` | `boolean` | `false` | 纵向分栏 |
| `parent` | `HTMLElement \| { root }` | — | 自动挂载的父容器 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `addSection(info)` | 追加一栏 |
| `getSection(index)` | 取一栏，返回 `{ element, add }` |
