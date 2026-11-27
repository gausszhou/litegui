---
title: Area
description: 可分割、可拖拽调整的布局容器
---

# Area

Area 是 LiteGUI 的布局核心：按 `horizontal` / `vertical` 递归分割，分隔条可拖拽调整，每个分区又是一个独立的 Area。

<ComponentDemo name="area/basic" title="横向分割" height="260px" />

<<< @/demos/area/basic.vue

## 用法

```ts
const area = new Area({ height: "100%" });
container.appendChild(area.root);

area.split("horizontal", [null, 140], true);
area.getSection(0).content.innerHTML = "左侧";
area.getSection(1).content.innerHTML = "右侧";
```

`split(direction, sizes, editable)` 的尺寸规则：

| 写法 | 含义 |
| --- | --- |
| 数字 | 像素值 |
| `null` | 自动填充剩余空间 |
| CSS 字符串 | 原样作为尺寸，如 `"30%"`、`"calc(100% - 200px)"` |
| 负数 | 内部转换为 `calc(100% - Npx)` |

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 根元素 id |
| `className` | `string` | — | 追加到根元素上的 class |
| `content_id` | `string` | — | 内容区 id |
| `width` / `height` | `number \| string` | `"100%"` | 尺寸，数字按 px 处理 |
| `autoresize` | `boolean` | `false` | 尺寸变化时自动重算分区 |
| `minSplitSize` | `number` | `10` | 拖拽分隔条时的最小尺寸 |
| `immediateResize` | `boolean` | `false` | 拖拽过程中实时重排 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `split(direction, sizes, editable)` | 分割当前区域；已分割过会抛错 |
| `getSection(index)` | 取子区域（返回 `Area \| null`） |
| `setAreaSize(index, size)` | 调整某个分区的尺寸 |
| `merge(index)` | 合并分区 |
| `add(component \| html)` | 往内容区追加内容 |

## 事件

- `area.onresize`：尺寸变化回调，参数为 Area 实例。
- `area.sections`：子区域数组。
