---
title: Panel
description: 带标题与关闭按钮的面板
---

# Panel

面板是工具台里最基础的容器：可带标题栏、关闭按钮，并可挂载任意子组件。

<ComponentDemo name="panel/basic" title="基础用法" height="230px" />

<<< @/demos/panel/basic.vue

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 根元素 id |
| `title` | `string` | — | 标题栏文字，未设置且未开启 `close` 时隐藏标题栏 |
| `content` | `string` | — | 内容 HTML（按可信内容处理） |
| `close` | `boolean` | `false` | 显示关闭按钮 |
| `width` | `number \| string` | `100%` | 宽度，数字按 px 处理 |
| `height` | `number \| string` | `100%` | 高度，数字按 px 处理 |
| `position` | `[number \| string, number \| string]` | — | 绝对定位的 `[left, top]` |
| `scroll` | `boolean` | `false` | 内容区超出时滚动 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `add(component)` | 把组件追加到内容区 |
| `setTitle(title)` | 修改标题 |
| `show()` / `hide()` | 显示 / 隐藏 |
| `close()` | 从 DOM 移除并派发 `closed` 事件 |
| `clear()` | 清空内容区 |

## 结构

- `root`：`.litepanel`
- `header` / `titleElement`：标题栏与标题节点
- `content`：内容区（`add()` 的挂载点）
- `footer`：页脚
