# Changelog

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
