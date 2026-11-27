---
title: 从 0.2 迁移
description: 0.2 到 1.0 的破坏性变更
---

# 从 0.2 迁移

## 单包 → monorepo（1.0.1）

仓库从单包改为 pnpm monorepo，包名与引入路径随之变化：

| 旧 | 新 |
| --- | --- |
| `litegui` | `@gausszhou/litegui` |
| `litegui/style.css` | `@gausszhou/litegui/style.css` |
| `litegui/experimental` | `@gausszhou/litegui-experimental` |
| `litegui/<component>` | `@gausszhou/litegui/<component>` |

其他变化：

- 构建产物从根目录 `lib/` 改为各包的 `packages/*/dist`；
- 仓库脚本从 npm 改为 pnpm（`pnpm build`、`pnpm test` 等），详见[包与导入](/packages)；
- `@gausszhou/litegui` 新增命名导出（`import LiteGUI, { Table } from "@gausszhou/litegui"`），
  原有默认导出与子路径引入方式保持不变；
- UMD 产物仍是自包含单文件，`window.LiteGUI` 用法不变。


## Inspector / Tree 移至 experimental

0.2：

```ts
const inspector = new LiteGUI.Inspector();
const tree = new LiteGUI.Tree(data);
```

1.0：

```ts
import { Inspector, Tree } from "@gausszhou/litegui-experimental";

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
import { Button } from "@gausszhou/litegui/button";
import { Table } from "@gausszhou/litegui/table";
```

## API 稳定性

完整弃用清单见 [API 稳定性](/api-stability)。
