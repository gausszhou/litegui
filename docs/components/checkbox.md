---
title: Checkbox
description: 复选框
---

# Checkbox

复选框，支持键盘操作与 `aria-checked`。

<ComponentDemo name="checkbox/basic" title="基础用法" height="100px" />

<<< @/demos/checkbox/basic.vue

## 用法

```ts
const checkbox = new Checkbox(true, {
  onChange: (value, oldValue) => console.log(value, oldValue),
});
container.appendChild(checkbox.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"default" \| "small" \| "mini"` | `"default"` | 尺寸 |
| `onChange` | `(value: boolean, oldValue: boolean) => void` | — | 值变化回调 |

> 第二个参数也可以直接传函数，等价于 `{ onChange }`。

## 方法

| 方法 | 说明 |
| --- | --- |
| `getValue()` | 当前值 |
| `setValue(value)` | 设置值并同步 DOM / ARIA |
| `value` | 当前布尔值 |

## 可访问性

`role="checkbox"`、`aria-checked` 会同步更新；`Space` / `Enter` 可切换。
