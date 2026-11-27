---
title: Dialog
description: 浮动 / 模态对话框
---

# Dialog

对话框是一个可拖拽、可缩放、可关闭的浮动窗口；通过 `parent` 可以挂到任意容器里，适合嵌入面板或文档示例。

<ComponentDemo name="dialog/basic" title="浮动对话框" height="300px" />

<<< @/demos/dialog/basic.vue

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题栏文字 |
| `width` / `height` | `number \| string` | `150` | 初始尺寸 |
| `parent` | `HTMLElement \| string` | `getRoot()` | 挂载容器；构造时立即挂载并居中 |
| `content` | `string` | — | 内容 HTML（按可信内容处理） |
| `close` / `closable` | `boolean` | `false` | 显示关闭按钮 |
| `draggable` | `boolean` | `false` | 可拖动标题栏 |
| `resizable` | `boolean` | `false` | 可拖动右下角调整大小 |
| `minimize` / `hide` / `detachable` | `boolean` | `false` | 标题栏按钮 |
| `lg-app--fullscreen` / `fullcontent` | `boolean` | `false` | 全屏 / 内容区占满 |
| `scroll` | `boolean` | `false` | 内容区滚动 |
| `buttons` | `ButtonsItemOptions[]` | — | 页脚按钮 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `show()` | 显示对话框；未挂载时挂到 `getContent()` 并居中 |
| `close()` | 关闭并派发 `closed` |
| `makeModal()` | 设为模态：显示遮罩并挂到遮罩层 |
| `add(component)` | 往内容区添加组件 |
| `addButtonToFooter(name, options)` | 添加页脚按钮 |
| `fadeIn(ms)` | 淡入显示 |
| `center()` | 相对父元素居中 |

## 事件

`shown`、`closed`、`resized` 等通过 `EventMitter` 派发；也可以直接赋值 `on_show`、`on_close`、`on_resize`。

## 已知限制

`makeModal()` 依赖 `LiteGUI.init()` 创建的遮罩层；在文档站这类未调用 `init()` 的环境里，请使用普通浮动对话框。
