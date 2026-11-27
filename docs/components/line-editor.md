---
title: LineEditor
description: 曲线 / 关键点编辑器
---

# LineEditor

LineEditor 在 canvas 上编辑一条由关键点组成的曲线，适合曲线映射、缓动等场景。

<ComponentDemo name="line-editor/basic" title="编辑曲线" height="220px" />

<<< @/demos/line-editor/basic.vue

## 用法

```ts
const editor = new LineEditor(
  [
    [0, 0.2],
    [0.5, 0.8],
    [1, 0.3],
  ],
  { width: 360, height: 120, show_samples: 4 },
);
container.appendChild(editor.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` / `height` | `number` | `200` / `50` | canvas 尺寸 |
| `xrange` / `yrange` | `[number, number]` | `[0, 1]` | 坐标范围 |
| `defaulty` | `number` | `0.5` | 新增点的默认 y |
| `no_trespassing` | `boolean` | `false` | 禁止曲线越界 |
| `show_samples` | `number` | `0` | 采样点数量 |
| `bgcolor` / `pointscolor` / `linecolor` | `string` | `#222` / `#5AF` / `#444` | 颜色 |
| `callback` | `(value: number[][]) => void` | — | 值变化回调 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `getValueAt(x)` | 取指定 x 处的插值 |
| `resample(n)` | 重采样为 n 个点 |
| `addValue([x, y])` | 追加关键点 |
| `redraw()` | 重绘 canvas |

> 属于 experimental API。
