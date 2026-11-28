# Changelog

## Unreleased（Viewport 组件化）

### Added

- 新增 `Viewport` 组件：把 Blender app 里的 `apps/blender/src/viewport.ts` 抽到 `packages/components`，统一为 `.lg-viewport` BEM 结构，支持轨道/平移/缩放、对象点选、变换 gizmo、编辑模式、笔刷光标与 `snapshot()`。
- 新增事件 API：`select`、`status`、`change`、`context-menu`、`transform`；选中状态由组件持有，`setSelected()` 只做程序化同步，不派发事件。
- 新增子路径导出 `@gausszhou/litegui-components/viewport`，并在主入口导出 `Viewport` 与 `ViewportObject` / `ViewportOptions` 等类型。
- 新增 `<lg-viewport>` Web Component（JSON `objects` + `litegui-*` 事件）与 `<LiteGuiViewport>` Vue 绑定（支持 `v-model:selected`）。
- 3D 场景配色改为 CSS 变量（`--lg-viewport-bg`、`--lg-viewport-selection` 等），并补亮色主题覆盖。
- 补 Viewport 组件、元素、Vue 绑定单测；Blender app 改为使用组件包并删除本地实现。

## Unreleased（CSS class BEM 化）

### Changed

- 组件根 class 统一为 `lg-<block>`，子元素使用 `__`，修饰符使用 `--`；状态统一为 `lg-is-*`。
- 已迁移：Button、Checkbox、Slider、SearchBox、Dragger、Panel、Dialog、Menu、ContextMenu、Tabs、Split、Area、List、ComplexList、Table、Console，以及根布局 `lg-app` / `lg-modal-backdrop`。
- 同步更新 SCSS、组件 DOM、文档示例、单测与 e2e 选择器；旧 class 不再保留。

## Unreleased（Web Components 标签前缀）

### Changed

- 自定义元素标签从 `litegui-*` 统一改为 `lg-*`：`lg-button`、`lg-checkbox`、`lg-panel`、`lg-dialog`、`lg-menu`、`lg-menu-item`。
- 事件名保持 `litegui-*`（`litegui-click` / `litegui-change` / `litegui-close` / `litegui-select`），避免同时改事件 API。

## Unreleased（Vue 绑定）

### Added

- 新增 `@gausszhou/litegui-vue`：Vue 3 绑定，依赖 `@gausszhou/litegui-components`，首批封装 Button / Checkbox / Slider / Panel / Dialog / Menu，并补充 Table / List / Split / SearchBox / Tabs / Dragger / Console，支持 props、`v-model`、slots 与 `app.use()` 插件注册。
- 新增文档页 `docs/vue.md` 与实时示例。

## Unreleased（目录调整）

### Changed

- 包目录 `packages/litegui` → `packages/components`；npm 包名、子路径导出与公开 API 不变。

## Unreleased（包名调整）

### Changed

- npm 包名 `@gausszhou/litegui` → `@gausszhou/litegui-components`；子路径导出、`window.LiteGUI` 与公开 API 均不变。

## Unreleased（Web Components 适配）

### Added

- 新增 `@gausszhou/litegui-elements` Web Components 适配层（Shadow DOM 薄封装），首批支持 `lg-button`、`lg-checkbox`、`lg-panel`、`lg-dialog`、`lg-menu`（含声明式 `lg-menu-item`），含 `tokens.css`、ESM/CJS/UMD 产物与 jsdom/Playwright 测试。
- 新增文档页 `docs/web-components.md`，包含实时示例、属性/事件约定与 React 19 / Vue 接入说明。

## Unreleased（monorepo 改造）

### Changed

- 仓库改为 pnpm monorepo：`packages/{core,litegui,tests}` + `apps/{demo,editor}`。
- 包名：`litegui` → `@gausszhou/litegui-components`；新增 `@gausszhou/litegui-core`
  （DOM 工具、事件总线、全局状态、`Widget` 基类、通用工具）。
- `litegui/experimental` 不再单独成包：`Inspector`、`Tree` 回到 `@gausszhou/litegui-components`，
  主入口恢复 `LiteGUI.Inspector` / `LiteGUI.Tree` 与同名命名导出，并新增 `./inspector`、`./tree` 子路径。
- 构建产物从根目录 `lib/` 改为各包的 `dist/`；仓库脚本改用 pnpm（`pnpm build` / `pnpm test` 等）。
- `@gausszhou/litegui-components` 新增组件命名导出（`import LiteGUI, { Table } from "@gausszhou/litegui-components"`）；
  默认导出与 15 个按组件子路径保持不变。
- UMD 产物仍是自包含单文件，`window.LiteGUI` 用法不变；新增 `dist/index.cjs` 供 `require` 使用（外置 core）。
- 主包产物重新包含 `Inspector`、`Tree`：`dist/index.cjs` 约 134 KB（gzip 35.2 KB），
  `dist/index.umd.cjs` 约 139 KB（gzip 36.8 KB）；单包换来“一个包、一种引入方式”。

### Added

- 文档站：18 个主入口组件各有独立页面，包含可交互的真实渲染 demo 与 `<<<` 同源示例代码；
  演示样式由构建期生成并加 `.lg-demo` 前缀，避免污染文档站。
- `Menu`、`ContextMenu` 新增 `container` 选项，可把浮层挂到指定容器（文档 demo 与嵌入式使用）。
- ESLint flat config、Typedoc 生成的 API 文档。
- `pnpm size` / `pnpm verify-umd` / `pnpm verify-pack` / `pnpm pages:build` 脚本与 `shells/` 手动发布入口。
- CI 增加 lint、coverage、体积、UMD 与 tarball 校验、Chrome/Firefox e2e，并在 master 通过后自动发布 gh-pages。

### Fixed

- 二级菜单改为与父菜单项顶部对齐、贴着父面板右缘展开；右侧/底部空间不足时自动翻转，
  并清理同层及更深的旧子菜单（此前子菜单始终按主菜单项定位，会跑到菜单栏下方）。

### Removed

- `@gausszhou/litegui-experimental` 包（`packages/experimental`）：`Inspector`、`Tree` 并入 `@gausszhou/litegui-components`。
- 根 `rollup.config.js`、`vite.config.js`、`package-lock.json`、旧 `lib/` 构建链。
- `src/types/*.d.ts` 中未被引用的遗留类型声明（`LiteGUIInstance` 等）。

## 1.0.1 (2026-11-27)

测试与交互修复版本。

### Fixed

- `Dragger` 键盘/滚轮修改后同步 `value`，`getValue()` 不再返回旧值。
- `Tabs.addTab` 在存在 plus tab 时向正确的 DOM 节点插入。
- `Area.merge()` 正确保留选中区域内容并清理分栏。
- `ContextMenu` 子菜单记录到 `current_submenu`，关闭链路完整。
- `LiteGUI.htmlEncode/htmlDecode` 改用 `textContent/innerHTML`，兼容 jsdom。
- `Console.addMessage` 支持对象消息类型；`removeClass` 的 `class_name` 改为可选。

### Tests

- 单元/集成测试：29 个文件 / 120 个用例。
- 覆盖率：约 72.8%（core 78.8%），并设置 70% 覆盖率门槛。
- Playwright：Chrome + Firefox，10 个交互/移动端用例。

## 1.0.0 (2026-11-27)

首个稳定核心版本。

### Added

- `litegui/experimental` 子路径：`Inspector`、`Tree` 从主入口拆出。
- HTML 安全默认值：`escapeHTML`、Table `allowHTML` 开关、Menu 标签文本化。
- API 稳定性与弃用文档、`deprecate` 一次性告警。
- Playwright 页面测试（Chrome + Firefox）与性能基准、生命周期泄漏检查。

### Changed

- 主 ESM 包体从约 141 KB 降到约 82 KB（Inspector/Tree 移至 experimental）。
- 主入口不再暴露 `LiteGUI.Inspector`、`LiteGUI.Tree`；请改用 `litegui/experimental`。
- ContextMenu 移除 `@ts-nocheck`。

### Known limitations

- 视觉截图基线与 WebKit 矩阵尚未纳入 CI。
- `Inspector`、`Tree` 仍为 experimental，内部保留 `@ts-nocheck`。
- 尚未发布 npm registry；仓库内版本号为 1.0.0。

## 0.2.0 (2026-11-27)

### Added

- 主题系统：`--lg-color-*` CSS 变量、亮/暗主题、`LiteGUI.setTheme/getTheme`、`init({ theme })`。
- 基础可访问性：Checkbox/Tabs/List/Slider/Dialog/Menu/SearchBox/Table 的 role、aria 属性与键盘操作。
- 按组件导出：`litegui/button`、`litegui/table` 等 13 个子路径，`lib/entries` 与对应 `.d.ts`。
- VitePress 文档站与 GitHub Pages 部署工作流，新增首页、组件页。

### Changed

- 样式入口加入 `theme.scss` 与遗漏的 `list.scss`。
- 文档站脚本：`npm run docs:dev` / `docs:build` / `docs:preview`。
- CI 增加 `npm run docs:build`。

### Known limitations

- 未做 Playwright 视觉回归与完整浏览器矩阵。
- `Inspector`、`Tree`、`ContextMenu` 仍为 experimental。

## 0.1.0 (2026-11-27)

首个可构建、可测试、可安装的基线版本。

### Added

- `src/core/`：`dom`、`events`、`state` 三个核心模块，统一尺寸、事件与全局状态。
- Vitest + jsdom 测试体系，覆盖核心组件与 demo/editor 冒烟。
- GitHub Actions CI、MIT LICENSE、Getting Started 与示例文档。
- `npm run typecheck` / `npm test` / `npm run build` 脚本。
- 库构建产物：`lib/litegui.esm.js`、`lib/litegui.umd.cjs`、`lib/litegui.css`、`lib/types`。

### Changed

- `EventMitter` 从全局单例改为实例级事件总线。
- `LiteGUI.bind/trigger/unbind/sizeToCSS/createElement/createListItem/draggable` 改为委托 `core`。
- `Panel`、`Slider`、`List`、`Menu`、`Area`、`Split`、`Console`、`ComplexList` 完成验收修复。
- `Editor` 与 `Demo` 改为直接引用源码样式，不再依赖预先构建的 `lib`。

### Fixed

- Dialog 的挂载、关闭按钮、footer 按钮、`INSTANCE_LIST` 与模态背景。
- Button 的 `click` 事件、Checkbox/Dragger 的初始化。
- Table 的字符串列映射与行更新。
- Tabs 的选中、内容挂载与索引。
- Menu 子项回调、父级误挂 data。
- Area 数值尺寸、Split 方向、Console 多参数日志。
- ComplexList 标题渲染。

### Known limitations

- `Inspector`、`Tree`、`ContextMenu` 仍使用临时 `@ts-nocheck`，标记为 experimental。
- 统一组件生命周期、焦点管理、主题与可访问性在 Phase 2 完成。
- 尚未发布到 npm；版本号已在仓库内更新为 0.1.0。
