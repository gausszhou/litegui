---
title: 从 0.2 迁移
description: 0.2 到 1.0 的破坏性变更
---

# 从 0.2 迁移

## Inspector / Tree 移至 experimental

0.2：

```ts
const inspector = new LiteGUI.Inspector();
const tree = new LiteGUI.Tree(data);
```

1.0：

```ts
import { Inspector, Tree } from "litegui/experimental";

const inspector = new Inspector();
const tree = new Tree(data);
```

主入口不再暴露 `LiteGUI.Inspector` 与 `LiteGUI.Tree`。

## Table 默认转义

1.0 起 `Table` 默认使用 `textContent` 渲染单元格。若需要 HTML：

```ts
new LiteGUI.Table({ columns, allowHTML: true });
```

## 主题

新增 `LiteGUI.setTheme("light" | "dark")` 与 `init({ theme })`；原有硬编码样式被 CSS 变量覆盖。

## 按组件引入

```ts
import { Button } from "litegui/button";
import { Table } from "litegui/table";
```

## API 稳定性

完整弃用清单见 [API 稳定性](/api-stability)。
