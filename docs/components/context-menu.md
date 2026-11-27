---
title: ContextMenu
description: 右键菜单
---

# ContextMenu

右键菜单，支持子菜单、标题与自定义定位。

<ComponentDemo name="context-menu/basic" title="右键打开" height="200px" />

<<< @/demos/context-menu/basic.vue

## 用法

```ts
element.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  new ContextMenu(
    [
      { title: "重命名", callback: () => {} },
      { title: "删除", callback: () => {} },
    ],
    { event },
  );
});
```

## Options

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `event` | `MouseEvent \| PointerEvent \| CustomEvent` | 用事件坐标定位 |
| `left` / `top` | `number` | 不传 `event` 时的坐标 |
| `title` | `string` | 菜单标题 |
| `callback` | `Function` | 未命中条目回调 |
| `ignore_item_callbacks` | `boolean` | 忽略条目自身回调 |
| `parentMenu` | `ContextMenu` | 作为子菜单时指向父菜单 |
| `autoopen` | `boolean` | 预留：自动展开 |
| `container` | `HTMLElement` | 挂载容器，默认 `document.body` |

条目可以是字符串、`{ title, callback }`，或带 `submenu` 的嵌套结构。

## 方法

| 方法 | 说明 |
| --- | --- |
| `addItem(name, value, options)` | 追加条目 |
| `close(event?)` | 关闭菜单（含子菜单） |

> 属于 experimental API；样式类名为 `.litecontextmenu`。
