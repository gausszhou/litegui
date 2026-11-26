# 组件概览

## 核心

| 组件 | 说明 | 文档 |
| --- | --- | --- |
| `Area` | 可分割的布局容器 | [布局](/components/layout) |
| `Panel` | 带标题/关闭按钮的面板 | [布局](/components/layout) |
| `Split` | 固定比例分栏 | [布局](/components/layout) |
| `Tabs` | 标签页 | [布局](/components/layout) |
| `Dialog` | 浮动/模态窗口 | [浮层](/components/overlays) |
| `Menu` | 菜单栏与子菜单 | [浮层](/components/overlays) |
| `Button` | 按钮 | [表单](/components/forms) |
| `Checkbox` | 复选框 | [表单](/components/forms) |
| `Slider` | 滑块 | [表单](/components/forms) |
| `SearchBox` | 搜索输入框 | [表单](/components/forms) |
| `List` | 列表 | [数据展示](/components/data) |
| `Table` | 表格 | [数据展示](/components/data) |
| `Console` | 控制台输出 | [数据展示](/components/data) |

## Experimental

`Inspector`、`Tree` 通过 `litegui/experimental` 单独引入；`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 暂不承诺 API 稳定性。

## 公共约定

- 组件都暴露 `root: HTMLElement`。
- 值类组件提供 `getValue()` / `setValue()`。
- 交互类组件通过实例事件或回调通知变化。

## 安全

- `Table` 默认用 `textContent` 渲染单元格；只有显式 `allowHTML: true` 才解析 HTML。
- `List`、`ComplexList` 标题、`Menu` 标签使用文本节点，不解析 HTML。
- `Panel.content`、`Dialog.content`、`ComplexList.addHTML`、`Console` 的 HTML 接口按“可信内容”处理，传入用户输入前请先转义。
- `LiteGUI.escapeHTML(value)` 可用于转义用户输入。
