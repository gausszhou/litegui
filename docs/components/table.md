---
title: Table
description: 数据表格
---

# Table

Table 用于展示二维数据，支持列配置、滚动和原地更新；默认按纯文本渲染单元格。

<ComponentDemo name="table/basic" title="基础表格" height="280px" />

<<< @/demos/table/basic.vue

## 用法

```ts
const table = new Table({
  columns: [
    { name: "Name", field: "name" },
    { name: "Type", field: "type" },
    { name: "Size", field: "size" },
  ],
  rows: [{ name: "Alice", type: "User", size: 12 }],
  scrollable: true,
  height: 180,
});
container.appendChild(table.root);
```

字符串列会按列名小写映射对象字段；需要自定义字段时使用 `{ name, field }`。

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | `[]` | 列定义 |
| `rows` | `any[]` | `[]` | 初始数据 |
| `height` | `number \| string` | — | 表格高度 |
| `scrollable` | `boolean` | `false` | 内容超出时滚动 |
| `allowHTML` | `boolean` | `false` | 允许单元格 HTML（默认纯文本，安全默认值） |

## 方法

| 方法 | 说明 |
| --- | --- |
| `setColumns(columns)` | 设置列 |
| `setRows(rows, reuse?)` | 设置数据，`reuse` 为 `true` 时复用行节点 |
| `addRow(row, skipAdd?)` | 追加一行 |
| `updateRow(index, row)` | 更新指定行 |
| `updateCell(rowIndex, cellIndex, data)` | 更新单元格 |
| `updateContent(reuse?)` | 重新渲染 |

## 安全

单元格默认使用 `textContent` 渲染；只有显式传 `allowHTML: true` 时才解析 HTML。用户输入请先 `LiteGUI.escapeHTML()`。
