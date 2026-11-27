---
title: 实验性组件
description: Inspector 与 Tree
---

# 实验性组件

`Inspector` 与 `Tree` 和其余组件一样位于 `@gausszhou/litegui`，从主入口或按组件子路径引入：

```ts
import { Inspector, Tree } from "@gausszhou/litegui";
// 也可以按组件子路径引入
// import { Inspector } from "@gausszhou/litegui/inspector";
// import { Tree } from "@gausszhou/litegui/tree";
import "@gausszhou/litegui/style.css";

const inspector = new Inspector();
inspector.addString("name", "Untitled");
inspector.addNumber("width", 100, { min: 0 });

const tree = new Tree({
  id: "root",
  children: [{ id: "A" }, { id: "B" }]
});
```

`LiteGUI.Inspector`、`LiteGUI.Tree` 静态成员同样可用，与 0.2 的写法一致：

```ts
const inspector = new LiteGUI.Inspector();
const tree = new LiteGUI.Tree(data);
```

## 稳定性

这两个组件内部仍保留 `@ts-nocheck`，API 可能在次版本调整；不建议在 1.x 的稳定接口中依赖它们。
它们也不参与覆盖率统计，文档站暂不为它们单独建页。

`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 同样标记为 experimental。
