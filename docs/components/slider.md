---
title: Slider
description: 滑块
---

# Slider

滑块用于在 `[min, max]` 区间内取值，支持鼠标拖动与方向键微调。

<ComponentDemo name="slider/basic" title="基础用法" height="120px" />

<<< @/demos/slider/basic.vue

## 用法

```ts
const slider = new Slider(0.4, { min: 0, max: 1, step: 0.01 });
slider.onChange = (value) => console.log(value);
container.appendChild(slider.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `min` | `number` | `0` | 最小值 |
| `max` | `number` | `1` | 最大值 |
| `step` | `number` | `(max - min) / 100` | 步长 |

## 方法与属性

| 名称 | 说明 |
| --- | --- |
| `getValue()` / `setValue(value)` | 读取 / 设置值 |
| `onChange(value)` | 值变化回调 |
| `value` | 当前值（只读访问器内部字段） |

键盘支持 `ArrowLeft/Right`、`ArrowUp/Down`、`Home`、`End`；根元素带 `role="slider"` 与 `tabindex="0"`。
