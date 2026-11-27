---
title: 包与导入
description: monorepo 中各个包的职责、产物与引入方式
---

# 包与导入

仓库按 pnpm workspace 组织，`packages/*` 是可发布的库，`apps/*` 是示例页面：

| 路径                  | 包名                            | 说明                                                                                                     |
| --------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `packages/core`       | `@gausszhou/litegui-core`       | DOM 工具、事件总线、全局状态、`Widget` 基类、通用工具；无 CSS                                            |
| `packages/components` | `@gausszhou/litegui-components` | 全部组件（含标记为 experimental 的 `Inspector`、`Tree`）、`LiteGUI` 命名空间、按组件子路径入口、全局样式 |
| `packages/elements`   | `@gausszhou/litegui-elements`   | 可选 Web Components 适配层；Shadow DOM、`tokens.css`、按元素子路径入口                                   |
| `packages/tests`      | `@gausszhou/litegui-tests`      | 私有：Vitest + Playwright 测试与基准                                                                     |
| `apps/demo`           | `@gausszhou/litegui-demo`       | 私有：最小示例                                                                                           |
| `apps/editor`         | `@gausszhou/litegui-editor`     | 私有：综合示例                                                                                           |

## 依赖关系

```text
@gausszhou/litegui-elements ──► @gausszhou/litegui-components
                                      │
                                      └── @gausszhou/litegui-core
```

ESM 构建统一把 `@gausszhou/litegui-core` 外置，因此从 ESM 入口引入时，
整个页面只有一份 core 实例（全局状态、事件总线、主题都一致）。

## 引入方式

```ts
// 全量
import LiteGUI from "@gausszhou/litegui-components";
import "@gausszhou/litegui-components/style.css";

// 命名导出
import LiteGUI, { Table } from "@gausszhou/litegui-components";

// 按组件子路径（tree-shaking 友好）
import { Table } from "@gausszhou/litegui-components/table";

// 实验性组件（同样在主包内）
import { Inspector, Tree } from "@gausszhou/litegui-components";
// 子路径等价写法（二选一）
// import { Inspector } from "@gausszhou/litegui-components/inspector";
// import { Tree } from "@gausszhou/litegui-components/tree";
```

Web Components 适配层：

```ts
import "@gausszhou/litegui-elements/tokens.css";
import "@gausszhou/litegui-elements";

// 也可以只注册需要的元素
import { defineElements } from "@gausszhou/litegui-elements/define";
defineElements();
```

```html
<litegui-button label="保存"></litegui-button>
<litegui-checkbox checked></litegui-checkbox>
```

详见 [Web Components](/web-components)。

## 开发态与发布态

各包的 `main` / `module` / `types` / `exports` 在仓库内指向 `src`，方便 workspace
直接调试源码；`publishConfig` 在 `pnpm pack` / `pnpm publish` 时切换为 `dist`：

| 包                              | ESM                                    | CJS              | UMD                            | 类型                    |
| ------------------------------- | -------------------------------------- | ---------------- | ------------------------------ | ----------------------- |
| `@gausszhou/litegui-core`       | `dist/index.js`                        | 复用 UMD         | `dist/index.umd.cjs`           | `dist/types/index.d.ts` |
| `@gausszhou/litegui-components` | `dist/index.js` + `dist/entries/*.js`  | `dist/index.cjs` | `dist/index.umd.cjs`（自包含） | `dist/types/**`         |
| `@gausszhou/litegui-elements`   | `dist/index.js` + `dist/elements/*.js` | `dist/index.cjs` | `dist/index.umd.cjs`（自包含） | `dist/types/**`         |

ESM 与 CJS 构建都把 core 外置（CJS 额外把纯 ESM 的 `lodash-es` 打进产物），
因此 `import` 与 `require` 场景都只有一份 core 实例。只有 `<script>` 使用的
`dist/index.umd.cjs` 是自包含单文件（core、`lodash-es`、`mitt` 全部打包），
加载后 `window.LiteGUI` 即可直接使用（`Inspector`、`Tree` 也在其中）。

## 常用命令

```bash
pnpm --filter @gausszhou/litegui-components build   # 只构建某个包
pnpm --filter @gausszhou/litegui-tests test
pnpm build                               # 按拓扑序构建全部
pnpm size                                # 产物体积报告
pnpm verify-pack                         # 校验发布 tarball
```
