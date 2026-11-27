# API 稳定性

LiteGUI 使用 [Semantic Versioning](https://semver.org/)：

- **patch**：修复 bug、内部重构、文档；
- **minor**：新增组件/选项、向后兼容的行为调整；
- **major**：删除或重命名公共 API、改变默认行为。

## Stable

以下 API 在 1.0 前尽量保持兼容：

`Area`、`Panel`、`Split`、`Tabs`、`Dialog`、`Menu`、`Button`、`Checkbox`、`Slider`、`SearchBox`、`List`、`Table`、`Console`，以及 `LiteGUI.init/add/remove/bind/unbind/trigger/setTheme/getTheme/escapeHTML`。

约定：

- 组件暴露 `root: HTMLElement`；
- 值类组件提供 `getValue()` / `setValue()`；
- 构造函数优先接收 options 对象；
- 样式通过 `@gausszhou/litegui-components/style.css` 或子路径 `@gausszhou/litegui-components/<component>` 引入。

## Experimental

`Inspector`、`Tree`、`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 暂不承诺 API 稳定，可能在 minor 版本调整。

## Deprecated

以下写法会输出一次性 `console.warn`，并计划在 1.0 前移除或转为正式 API：

| 写法                            | 替代                         |
| ------------------------------- | ---------------------------- |
| `new Area(id, options)`         | `new Area(options)`          |
| `new Tabs(id, options)`         | `new Tabs(options)`          |
| `new Tree(id, data, options)`   | `new Tree(data, options)`    |
| `new Inspector(id, options)`    | `new Inspector(options)`     |
| `new Dialog(id)`                | `new Dialog({ id })`         |
| `dialog.setPositon(x, y)`       | `dialog.setPosition(x, y)`   |
| `LiteGUI.craeteDivElement(...)` | `LiteGUI.createElement(...)` |

## 1.0 前的检查项

- 移除 `@ts-nocheck`（Inspector/Tree/ContextMenu）或明确降级为独立包；
- 统一 `mount/destroy` 生命周期；
- 完成焦点管理与键盘导航；
- 补 Playwright 视觉回归和浏览器矩阵；
- 冻结导出表与 `exports` 子路径。
