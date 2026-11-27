---
title: 浮层
description: Dialog / Menu / ContextMenu
---

# 浮层

| 组件 | 说明 |
| --- | --- |
| [Dialog](/components/dialog) | 浮动 / 模态对话框 |
| [Menu](/components/menu) | 菜单栏与多级子菜单 |
| [ContextMenu](/components/context-menu) | 右键菜单 |

浮层默认挂到 `LiteGUI` 的根容器；嵌入到已有页面时，`Dialog` 传 `parent`，
`Menu` / `ContextMenu` 传 `container`，即可把浮层限制在指定容器内。
