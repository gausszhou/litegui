---
title: Viewport
description: 3D 场景画布：轨道旋转、平移、缩放、拾取与编辑模式
---

# Viewport

`Viewport` 用 `<canvas>` 绘制一个桌面软件风格的 3D 视口，支持轨道旋转、右键平移、滚轮缩放、对象拾取、变换 gizmo 与编辑模式（点/边/面）叠加。数据模型是扁平的 `ViewportObject[]`，渲染与业务无关。

<ComponentDemo name="viewport/basic" title="基础用法" height="300px" />

<<< @/demos/viewport/basic.vue

## 用法

```ts
import { Viewport } from "@gausszhou/litegui-components";

const viewport = new Viewport({
  objects: [
    { id: "cube", name: "Cube", type: "mesh", loc: [0, 0, 0.9], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true }
  ],
  overlays: true
});

host.appendChild(viewport.root);
viewport.resize();
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `objects` | `ViewportObject[]` | `[]` | 场景对象（mesh / camera / light） |
| `selected` | `string \| null` | `null` | 初始选中对象 id |
| `overlays` | `boolean` | `false` | 绘制变换 gizmo 与坐标轴小部件 |
| `sidebarOpen` | `boolean` | `false` | 为右侧栏预留空间（坐标轴小部件偏移） |
| `shading` | `"wireframe" \| "solid" \| "material" \| "rendered"` | `"solid"` | 着色模式 |
| `editMode` | `boolean` | `false` | 编辑模式 |
| `editElement` | `"vertex" \| "edge" \| "face"` | `"vertex"` | 编辑模式下高亮元素 |
| `brush` | `string \| null` | `null` | 画笔 id，设置后跟随指针绘制画笔光标 |

## 方法与事件

| 名称 | 说明 |
| --- | --- |
| `getObjects()` / `setObjects(objects)` | 读取 / 替换场景对象 |
| `getSelected()` / `setSelected(id)` | 读取 / 设置选中对象 |
| `setOverlays()` / `setShading()` / `setEditMode()` / `setEditElementMode()` | 切换显示模式 |
| `setView(yaw, pitch, distance?)` | 设置轨道相机 |
| `frameAll()` / `focusSelection()` / `zoom(delta)` | 取景全部 / 聚焦选中 / 缩放 |
| `resize()` / `invalidate()` | 重新测量画布 / 请求重绘 |
| `snapshot()` | 导出当前画面为 PNG DataURL |
| `dispose()` | 释放监听与渲染循环 |
| 事件 `select` / `status` / `context-menu` / `change` / `transform` | 选中、状态提示、右键、变更与变换状态 |

## 主题

3D 配色全部走 `--lg-viewport-*` token（背景、网格、坐标轴、gizmo、选中、编辑、立方体面等），暗色默认值与亮色覆盖见 `blender.scss`。

> Viewport 属于 experimental API，API 可能在 minor 版本调整。
