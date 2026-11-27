---
title: 包与导入
description: monorepo 中各个包的职责、产物与引入方式
---

# 包与导入

仓库按 pnpm workspace 组织，`packages/*` 是可发布的库，`apps/*` 是示例页面：

| 路径 | 包名 | 说明 |
| --- | --- | --- |
| `packages/core` | `@gausszhou/litegui-core` | DOM 工具、事件总线、全局状态、`Widget` 基类、通用工具；无 CSS |
| `packages/litegui` | `@gausszhou/litegui` | 全部稳定组件、`LiteGUI` 命名空间、按组件子路径入口、全局样式 |
| `packages/experimental` | `@gausszhou/litegui-experimental` | `Inspector`、`Tree`，API 不承诺稳定 |
| `packages/tests` | `@gausszhou/litegui-tests` | 私有：Vitest + Playwright 测试与基准 |
| `apps/demo` | `@gausszhou/litegui-demo` | 私有：最小示例 |
| `apps/editor` | `@gausszhou/litegui-editor` | 私有：综合示例 |

## 依赖关系

```text
@gausszhou/litegui-experimental
        │
        ├── @gausszhou/litegui
        │        │
        │        └── @gausszhou/litegui-core
        └── @gausszhou/litegui-core
```

ESM 构建统一把 `@gausszhou/litegui-core` 外置，因此从 ESM 入口引入时，
整个页面只有一份 core 实例（全局状态、事件总线、主题都一致）。

## 引入方式

```ts
// 全量
import LiteGUI from "@gausszhou/litegui";
import "@gausszhou/litegui/style.css";

// 命名导出
import LiteGUI, { Table } from "@gausszhou/litegui";

// 按组件子路径（tree-shaking 友好）
import { Table } from "@gausszhou/litegui/table";

// 实验性组件
import { Inspector, Tree } from "@gausszhou/litegui-experimental";
```

## 开发态与发布态

各包的 `main` / `module` / `types` / `exports` 在仓库内指向 `src`，方便 workspace
直接调试源码；`publishConfig` 在 `pnpm pack` / `pnpm publish` 时切换为 `dist`：

| 包 | ESM | CJS | UMD | 类型 |
| --- | --- | --- | --- | --- |
| `@gausszhou/litegui-core` | `dist/index.js` | 复用 UMD | `dist/index.umd.cjs` | `dist/types/index.d.ts` |
| `@gausszhou/litegui` | `dist/index.js` + `dist/entries/*.js` | `dist/index.cjs` | `dist/index.umd.cjs`（自包含） | `dist/types/**` |
| `@gausszhou/litegui-experimental` | `dist/index.js` | `dist/index.cjs` | — | `dist/types/index.d.ts` |

ESM 与 CJS 构建都把 core 外置（CJS 额外把纯 ESM 的 `lodash-es` 打进产物），
因此 `import` 与 `require` 场景都只有一份 core 实例。只有 `<script>` 使用的
`dist/index.umd.cjs` 是自包含单文件（core、`lodash-es`、`mitt` 全部打包），
加载后 `window.LiteGUI` 即可直接使用。experimental 只提供 ESM/CJS，不提供 `<script>` 全局构建。

## 常用命令

```bash
pnpm --filter @gausszhou/litegui build   # 只构建某个包
pnpm --filter @gausszhou/litegui-tests test
pnpm build                               # 按拓扑序构建全部
pnpm size                                # 产物体积报告
pnpm verify-pack                         # 校验发布 tarball
```
