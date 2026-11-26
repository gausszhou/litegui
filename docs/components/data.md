---
title: 数据展示
description: Table、List、Console 与 ComplexList
---

# 数据展示

## Table

```ts
const table = new LiteGUI.Table({
  columns: ["Name", { name: "Age", width: 60 }],
  rows: [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 42 }
  ],
  scrollable: true
});
```

默认单元格按纯文本渲染；需要 HTML 时显式开启：

```ts
new LiteGUI.Table({ columns: ["HTML"], allowHTML: true });
```

| 方法 | 说明 |
| --- | --- |
| `setColumns(columns)` | 字符串或 `{ name, field, width, className }` |
| `setRows(data, reuse)` | 重新渲染或复用行 |
| `updateRow(index, row)` | 更新一行 |
| `updateCell(row, col, value)` | 更新单元格 |

## List

```ts
const list = new LiteGUI.List("files", ["A", "B"], {
  callback: (item) => console.log(item.dataset.value)
});
list.setSelectedItem("B");
```

## Console

```ts
const consoleWidget = new LiteGUI.Console({ prompt: ">" });
consoleWidget.onProcessCommand = (command) => consoleWidget.log("run", command);
consoleWidget.log("ready");
```

支持历史记录、Tab 补全与最多 1000 条消息。

## ComplexList

`ComplexList` 适合文件/资源列表，支持标题、选中、启用/禁用与删除回调。属于 experimental。
