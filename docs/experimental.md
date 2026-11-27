---
title: 实验性组件
description: Inspector 与 Tree
---

# 实验性组件

`Inspector` 与 `Tree` 位于独立的 `@gausszhou/litegui-experimental` 包，不进入主包：

```ts
import { Inspector, Tree } from "@gausszhou/litegui-experimental";
import "@gausszhou/litegui/style.css";

const inspector = new Inspector();
inspector.addString("name", "Untitled");
inspector.addNumber("width", 100, { min: 0 });

const tree = new Tree({
  id: "root",
  children: [{ id: "A" }, { id: "B" }]
});
```

`@gausszhou/litegui-experimental` 依赖 `@gausszhou/litegui` 与 `@gausszhou/litegui-core`
（workspace 内由 pnpm 处理），ESM 构建把两者外置，保证与主包共用同一份 core 实例。
包内只提供 ESM 与 CJS 产物，不提供 `<script>` 全局构建。

## 稳定性

这两个组件内部仍保留 `@ts-nocheck`，API 可能在次版本调整；不建议在 1.x 的稳定接口中依赖它们。

`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 已回到主入口，但同样标记为 experimental。
