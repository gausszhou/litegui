---
title: SearchBox
description: 搜索输入框
---

# SearchBox

带搜索语义的输入框，在按下 Enter 或失焦（`change`）时触发回调。

<ComponentDemo name="searchbox/basic" title="基础用法" height="120px" />

<<< @/demos/searchbox/basic.vue

## 用法

```ts
const box = new SearchBox("", {
  placeholder: "搜索…",
  callback: (value) => console.log(value),
});
container.appendChild(box.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"Search"` | 占位文字，同时作为 `aria-label` |
| `callback` | `(value: string) => void` | — | 值提交回调 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `getValue()` / `setValue(value)` | 读取 / 设置输入值 |
| `input` | 内部 `<input type="search">` |

根元素带 `role="search"`。
