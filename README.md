# LiteGUI

> 无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库。

LiteGUI 面向编辑器、调试器、工具台这类需要菜单、面板、分栏、对话框、属性检查器、树和表格的 Web 应用。项目从 [jagenjo/litegui.js](https://github.com/jagenjo/litegui.js)（MIT）重构而来，并拆分为「core + 组件库 + 示例应用 + 文档站」的 pnpm monorepo。

- 在线 Demo：https://gausszhou.github.io/litegui/coder/
- 在线 Editor：https://gausszhou.github.io/litegui/editor/
- 文档：https://gausszhou.github.io/litegui/docs/
- 路线图：[ROADMAP.md](./ROADMAP.md)

当前版本 **1.0.1**（monorepo 改造完成，尚未发布到 npm registry）。

## 特性

- **零框架依赖**：直接操作 DOM，可嵌入 React、Vue、Canvas/WebGL 编辑器或纯 HTML 页面。
- **桌面式布局**：`Area` / `Panel` / `Split` / `Tabs` / `Dialog` / `Menu` 组合出工具台界面。
- **稳定的核心 + 标注的 experimental**：核心组件承诺 API 兼容；`Inspector`、`Tree`、`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 同在 `@gausszhou/litegui-components` 内，但 API 标记为 experimental。
- **可测试**：Vitest + jsdom 130 个用例（覆盖率约 73%），Playwright 覆盖 Chrome / Firefox。
- **可交互文档**：18 个主入口组件各有独立页面，真实渲染 demo 与同源示例代码并存。
- **可定制**：CSS 变量主题、亮/暗模式、按组件 ESM 子路径入口。
- **monorepo**：pnpm workspace，按拓扑序构建；`publishConfig` 自动切换 `src` / `dist` 入口。

## 仓库结构

| 路径                  | 说明                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core`       | `@gausszhou/litegui-core`：DOM 工具、事件总线、全局状态、`Widget` 基类、通用工具                                                  |
| `packages/components` | `@gausszhou/litegui-components`：全部 20 个组件（含 `Inspector`、`Tree`）、`LiteGUI` 命名空间、15 个按组件入口、全局样式          |
| `packages/elements`   | `@gausszhou/litegui-elements`：Web Components 适配层（Custom Elements + Shadow DOM），当前覆盖 Button / Checkbox / Panel / Dialog |
| `packages/tests`      | 私有：Vitest + jsdom、Playwright、Table 基准                                                                                      |
| `apps/coder`          | VS Code 风格代码编辑器                                                                                                                        |
| `apps/editor`         | 综合示例：工具台、菜单、对话框、表格、树                                                                                          |
| `docs`                | VitePress 文档站；`docs:api` 由 Typedoc 生成 API 参考                                                                             |
| `scripts`             | 体积报告、UMD / tarball 校验、Pages 构建                                                                                          |
| `shells`              | `build.sh`、`gh-pages.sh` 手动发布脚本                                                                                            |
| `.github/workflows`   | CI：lint → typecheck → test → build → size → verify → e2e → docs，master 通过后发布 gh-pages                                      |

## 快速开始

```bash
pnpm install

pnpm dev          # 最小示例 http://127.0.0.1:5173/
pnpm dev:editor   # 综合示例 http://127.0.0.1:5174/

pnpm build        # 按拓扑序构建 packages/* 与 apps/*
pnpm test         # Vitest + jsdom
pnpm test:e2e     # Playwright（Chrome + Firefox）
```

## 使用

```ts
import LiteGUI from "@gausszhou/litegui-components";
import "@gausszhou/litegui-components/style.css";

LiteGUI.init({ container: "#app", menubar: true });

const area = new LiteGUI.Area({ id: "main", height: "100%" });
LiteGUI.add(area);
area.split("horizontal", [240, null], true);
```

也支持命名导出与按组件子路径：

```ts
import LiteGUI, { Table } from "@gausszhou/litegui-components";
import { Button } from "@gausszhou/litegui-components/button";
import { Inspector, Tree } from "@gausszhou/litegui-components";
```

> 仓库内各包的 `main` / `types` 指向 `src`，方便 workspace 调试源码；`pnpm pack` /
> `pnpm publish` 时由 `publishConfig` 切换到 `dist`。

## 包与产物

| 包                              | ESM                                   | CJS              | UMD（`<script>`）              | 样式             |
| ------------------------------- | ------------------------------------- | ---------------- | ------------------------------ | ---------------- |
| `@gausszhou/litegui-core`       | `dist/index.js`                       | 复用 UMD         | `dist/index.umd.cjs`           | 无               |
| `@gausszhou/litegui-components` | `dist/index.js` + `dist/entries/*.js` | `dist/index.cjs` | `dist/index.umd.cjs`（自包含） | `dist/style.css` |

ESM 与 CJS 构建都把 `@gausszhou/litegui-core` 外置，保证同一页面/进程内只有一份 core 实例；
UMD 产物自包含，`<script src=".../index.umd.cjs">` 后 `window.LiteGUI` 即可使用。

## 质量检查

```bash
pnpm lint            # ESLint flat config
pnpm typecheck       # 各包 tsc --noEmit
pnpm test:coverage   # 覆盖率门槛：70% / branches 65%
pnpm size            # 各产物体积（raw / gzip）
pnpm verify-umd      # VM 中加载 UMD，校验全局 API
pnpm verify-pack     # 逐个 pack，校验 tarball 入口与类型
pnpm docs:build      # Typedoc API + VitePress 文档站
```

## 文档站与部署

```bash
pnpm docs:dev     # 本地文档站
pnpm docs:build   # 输出 dist/docs
pnpm pages:build  # demo + editor + docs + 站点入口页，输出到 dist/
```

`master` 上的 push 在 CI 全部检查通过后，`deploy` job 会执行 `pnpm pages:build`
并强制推送到 `gh-pages` 分支；`shells/gh-pages.sh` 是等价的本地手动发布入口。
文档 base 默认 `/litegui/docs/`，可用 `DOCS_BASE` 覆盖。

## 许可证

[MIT](./LICENSE)，保留上游 Javi Agenjo 的版权声明。
