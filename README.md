# LiteGUI

> 无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库。

LiteGUI 面向编辑器、调试器、工具台这类需要菜单、面板、分栏、对话框、属性检查器、树和表格的 Web 应用。项目从 [jagenjo/litegui.js](https://github.com/jagenjo/litegui.js)（MIT）重构而来。

当前版本 **0.1.0**（Phase 1 完成），路线图见 [ROADMAP.md](./ROADMAP.md)。

## 状态

| 范围 | 组件 | 状态 |
| --- | --- | --- |
| 核心 | `Area`、`Panel`、`Split`、`Tabs`、`Dialog`、`Menu`、`Button`、`Checkbox`、`Slider`、`SearchBox`、`List`、`Table`、`Console` | 可用，有验收测试 |
| Experimental | `Inspector`、`Tree`、`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` | 暂不承诺稳定性 |

Phase 0/1 已完成：依赖可安装、类型检查归零、核心回归修复、core 模块抽取、18 个测试文件 / 62 个用例、库构建与 npm 包冒烟。

## 文档

- [Getting Started](./docs/getting-started.md)
- [示例](./docs/examples.md)
- [路线图](./ROADMAP.md)

## 快速开始

```bash
npm install
npm run dev
```

- `/`：入口页
- `/demo/`：最小示例
- `/editor/`：综合示例

## 文档站

```bash
npm run docs:dev
npm run docs:build
```

VitePress 配置位于 `docs/.vitepress/`，构建产物输出到 `docs/.vitepress/dist`。

## 构建

```bash
npm run build
```

产物：

```text
lib/
  litegui.esm.js     # ESM
  litegui.umd.cjs    # UMD / CommonJS
  litegui.css        # 样式
  types/             # .d.ts
dist/                # demo / editor 静态页面
```

单独构建库或页面：

```bash
npm run build:lib
npm run build:pages
```

## 测试与检查

```bash
npm run typecheck
npm test
npm run test:watch
```

## 作为依赖使用

```ts
import LiteGUI from "litegui";
import "litegui/style.css";

LiteGUI.init({ container: "#app", menubar: true });
```

> `exports` 同时提供 ESM、CommonJS 和 `style.css` 子路径。

## 目录

```text
src/
  index.ts          # 库入口
  packages/         # 组件与核心
  styles/           # 全局与组件样式
  types/            # 类型声明
demo/               # 最小演示
editor/             # 综合演示
tests/              # Vitest + jsdom
```

## 许可证

[MIT](./LICENSE)，保留上游 Javi Agenjo 的版权声明。
