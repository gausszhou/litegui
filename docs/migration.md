---
title: 从 0.2 迁移
description: 0.2 到 1.0 的破坏性变更
---

# 从 0.2 迁移

## 单包 → monorepo（未发布）

仓库从单包改为 pnpm monorepo，包名与引入路径随之变化：

| 旧 | 新 |
| --- | --- |
| `litegui` | `@gausszhou/litegui` |
| `litegui/style.css` | `@gausszhou/litegui/style.css` |
| `litegui/experimental` | `@gausszhou/litegui`（或 `@gausszhou/litegui/<inspector\|tree>`） |
| `litegui/<component>` | `@gausszhou/litegui/<component>` |

其他变化：

- 构建产物从根目录 `lib/` 改为各包的 `packages/*/dist`；
- 仓库脚本从 npm 改为 pnpm（`pnpm build`、`pnpm test` 等），详见[包与导入](/packages)；
- `@gausszhou/litegui` 新增命名导出（`import LiteGUI, { Table } from "@gausszhou/litegui"`），
  原有默认导出与子路径引入方式保持不变；
- UMD 产物仍是自包含单文件，`window.LiteGUI` 用法不变；
- `Inspector`、`Tree` 不再单独成包：`litegui/experimental` 改为主包的命名导出或
  `inspector` / `tree` 子路径，`LiteGUI.Inspector`、`LiteGUI.Tree` 静态成员恢复。

## Inspector / Tree 回到主包

0.2 与 1.0.1 的写法都继续可用：

```ts
import LiteGUI, { Inspector, Tree } from "@gausszhou/litegui";

// 命名导出
new Inspector();
new Tree(data);

// 与 0.2 一致的静态成员写法
new LiteGUI.Inspector();
new LiteGUI.Tree(data);

// 子路径写法
// import { Inspector } from "@gausszhou/litegui/inspector";
// import { Tree } from "@gausszhou/litegui/tree";
```

拆分历史：1.0.0 曾把 `Inspector`、`Tree` 拆到 `litegui/experimental`，1.0.1 又拆成独立的
`@gausszhou/litegui-experimental` 包；monorepo 版本取消这次拆分，组件统一放在
`@gausszhou/litegui`，只保留“API 标记为 experimental”这一层稳定性约定。

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
