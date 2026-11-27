---
title: Dragger
description: 可拖拽数值输入
---

# Dragger

Dragger 是「可拖拽的数值框」：上下拖动改值，也可以直接输入；常用于属性面板。

<ComponentDemo name="dragger/basic" title="基础用法" height="120px" />

<<< @/demos/dragger/basic.vue

## 用法

```ts
const dragger = new Dragger(1.5, { min: 0, max: 10, step: 0.1, precision: 2 });
dragger.input.addEventListener("change", () => console.log(dragger.getValue()));
container.appendChild(dragger.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `min` / `max` | `number` | — | 取值范围 |
| `step` | `number` | `1` | 每次拖拽/按键的步长 |
| `precision` | `number` | `3` | 小数位数 |
| `units` | `string` | — | 显示单位 |
| `horizontal` | `boolean` | `false` | 水平拖动 |
| `linear` | `boolean` | `false` | 线性映射（默认指数） |
| `disabled` | `boolean` | `false` | 禁用 |
| `full` | `boolean` | `false` | 占满父容器宽度 |
| `extraclass` | `string` | — | 追加 class |

## 方法与事件

| 名称 | 说明 |
| --- | --- |
| `getValue()` / `setValue(value)` | 读取 / 设置值 |
| `setRange(min, max)` | 修改范围 |
| `dragger.input` | 内部输入框，`change` 事件会在拖拽结束时触发 |

> Dragger 属于 experimental API，后续版本可能调整。
