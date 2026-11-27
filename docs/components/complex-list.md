---
title: ComplexList
description: 带标题、勾选与删除的列表
---

# ComplexList

ComplexList 是「图层 / 资源列表」式的富列表：可加标题、切换启用状态、删除条目。

<ComponentDemo name="complex-list/basic" title="图层列表" height="300px" />

<<< @/demos/complex-list/basic.vue

## 用法

```ts
const list = new ComplexList({ height: 200 });
list.addTitle("图层");
list.addItem({ name: "背景" }, "背景", true, false);
list.onItemSelected = (item) => console.log(item);
container.appendChild(list.root);
```

## Options

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `item_code` | `string` | 自定义条目模板 |
| `height` | `number \| string` | 列表高度 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `addTitle(text)` | 添加分组标题 |
| `addHTML(html, onClick?)` | 添加自定义 HTML 行 |
| `addItem(item, text?, enabled?, removable?)` | 添加条目 |
| `getSelected()` | 当前选中条目 |
| `clear()` | 清空 |

## 回调

在实例上赋值：`onItemSelected(item, element)`、`onItemToggled(item, element, enabled)`、`onItemRemoved(item, element)`。

> 属于 experimental API。
