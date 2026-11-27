---
title: List
description: 列表
---

# List

List 渲染一组可选中的条目，带 `listbox` / `option` 语义。

<ComponentDemo name="list/basic" title="基础列表" height="180px" />

<<< @/demos/list/basic.vue

## 用法

```ts
const list = new List("my-list", ["Alpha", "Beta"], {
  callback: (element) => console.log(element.dataset.value),
});
container.appendChild(list.root);
```

条目可以是字符串，也可以是 `{ id?, value?, label?, checked }`。

## Options

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | `(element: HTMLLIElement) => void` | 选中回调 |
| `parent` | `HTMLElement \| { root }` | 构造时自动挂载 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `getSelectedItem()` | 当前选中的 `<li>` |
| `getSelectedValue()` | 当前选中值 |
| `setSelectedItem(value)` | 按值选中 |
| `clear()` | 清空列表 |
