# 组件

## 核心

| 组件 | 说明 |
| --- | --- |
| `Area` | 可分割的布局容器 |
| `Panel` | 带标题/关闭按钮的面板 |
| `Split` | 固定比例分栏 |
| `Tabs` | 标签页 |
| `Dialog` | 浮动/模态窗口 |
| `Menu` | 菜单栏与子菜单 |
| `Button` | 按钮 |
| `Checkbox` | 复选框 |
| `Slider` | 滑块 |
| `SearchBox` | 搜索输入框 |
| `List` | 列表 |
| `Table` | 表格 |
| `Console` | 控制台输出 |

## Experimental

`Inspector`、`Tree`、`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList` 暂不承诺 API 稳定性。

## 公共约定

- 组件都暴露 `root: HTMLElement`。
- 值类组件提供 `getValue()` / `setValue()`。
- 交互类组件通过实例事件或回调通知变化。
