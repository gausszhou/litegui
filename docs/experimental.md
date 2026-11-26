---
title: 实验性组件
description: Inspector 与 Tree
---

# 实验性组件

`Inspector` 与 `Tree` 通过独立入口引入，不进入主包：

```ts
import { Inspector, Tree } from "litegui/experimental";
import "litegui/style.css";

const inspector = new Inspector();
inspector.addString("name", "Untitled");
inspector.addNumber("width", 100, { min: 0 });

const tree = new Tree({
  id: "root",
  children: [{ id: "A" }, { id: "B" }]
});
```

也可以从源码入口引入：

```ts
import { Inspector, Tree } from "../src/experimental";
```

## 稳定性

这两个组件内部仍保留 `@ts-nocheck`，API 可能在次版本调整；不建议在 1.x 的稳定接口中依赖它们。

`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 已回到主入口，但同样标记为 experimental。
