# Changelog

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
