---
title: Blender UI 设计规范
description: LiteGUI 默认 Blender 风格的主题、尺寸、组件解剖与维护规则
---

# Blender UI 设计规范

这份规范约束 LiteGUI 的 **默认视觉语言**：布局和层级参考 Blender 4.5，但字号、控件尺寸和交互反馈按 Web 可读性放大，不做像素级复刻。

参考基线：Blender 4.5.17 LTS 默认界面（Layout 工作区、Object Mode）。

- 暗色：Blender Dark，token 默认值。
- 亮色：Blender Light，对应安装包 `scripts/presets/interface_theme/Blender_Light.xml` 中的 `wcol_regular`、`ThemeSpaceGeneric`、`ThemeView3D`。

## 1. 设计原则

| 原则 | 做法 |
| --- | --- |
| 扁平深色 / 扁平浅色 | 三层面板 + 1px 分隔线，不使用渐变、内阴影、外发光 |
| 层级靠明度 | 暗色：背景 `#1d1d1d` → 面板 `#2e2e2e` → 头部 `#2b2b2b` → 悬浮 `#353535`；亮色见 2.2 |
| 低饱和强调 | 暗色 `#4772b3`、亮色 `#5680c2`，用于选中、激活、焦点；菜单悬浮可用 `#668ccc` |
| 紧凑但可读 | 基础字号 13px，行高 26px，最小点击区域 26×26px |
| 结构优先 | 顶栏、区域头、面板头、树、属性、时间线、状态栏的层级关系不能省 |
| 不抄资产 | 参考布局与配色，图标必须使用自有或 MIT 图标，不复制 Blender GPL 图标 |

## 2. Design Tokens

默认主题定义在 `packages/components/src/styles/blender.scss`：

- 暗色 Tokens 写在 `:root`（默认值）。
- 亮色 Tokens 写在 `:root[data-lg-theme="light"]`。
- 组件级 CSS 只用 token，不写死色值，才能同时覆盖两套主题。

### 2.1 暗色（Blender Dark，默认）

| Token | 值 | 用途 |
| --- | --- | --- |
| `--lg-color-bg` | `#1d1d1d` | 应用底色、顶栏、状态栏 |
| `--lg-color-bg-alt` | `#282828` | 大纲、时间线、树/列表底 |
| `--lg-color-panel` | `#2e2e2e` | 面板、属性内容 |
| `--lg-color-panel-2` | `#252525` | 次级面板、输入底 |
| `--lg-color-header` | `#2b2b2b` | 面板头、区域头、菜单栏 |
| `--lg-color-header-2` | `#353535` | 悬浮、按下、表头 |
| `--lg-color-text` | `#d8d8d8` | 主文本 |
| `--lg-color-text-strong` | `#f0f0f0` | 标题、激活文本 |
| `--lg-color-text-muted` | `#9a9a9a` | 次要文本、占位 |
| `--lg-color-accent` | `#4772b3` | 选中、激活、焦点 |
| `--lg-color-accent-hover` | `#5885c8` | 强调悬浮 |
| `--lg-color-border` | `#3d3d3d` | 1px 分隔线、控件边框 |
| `--lg-color-border-strong` | `#4a4a4a` | 按钮/输入描边 |
| `--lg-color-button` | `#3d3d3d` | 按钮底 |
| `--lg-color-button-hover` | `#4a4a4a` | 按钮悬浮 |
| `--lg-color-input-bg` | `#1d1d1d` | 输入、下拉、Checkbox 底 |
| `--lg-color-row-hover` | `#333333` | 列表/树/表格悬浮行 |
| `--lg-color-row-alt` | `rgba(255,255,255,.025)` | 斑马纹 |
| `--lg-color-row-selected` | `#4772b3` | 选中行 |
| `--lg-color-row-semiselected` | `rgba(71,114,179,.28)` | 树半选中 |
| `--lg-color-table-head` | `#353535` | 表头 |
| `--lg-color-table-border` | `#333333` | 单元格分隔线 |
| `--lg-color-menu-bg` | `#282828` | 弹出菜单 |
| `--lg-color-menu-border` | `#4a4a4a` | 菜单描边 |
| `--lg-color-menu-hover` | `#4772b3` | 菜单项悬浮 |
| `--lg-color-console-bg` | `#151515` | Console 底 |
| `--lg-color-console-text` | `#c8c8c8` | Console 文本 |
| `--lg-color-tooltip-bg` | `#282828` | Tooltip 底 |
| `--lg-color-tooltip-text` | `#e6e6e6` | Tooltip 文本 |

### 2.2 亮色（Blender Light，`data-lg-theme="light"`）

数值取自 `Blender_Light.xml`；括号里是对应的 XML 字段。

| Token | 值 | 用途 / 依据 |
| --- | --- | --- |
| `--lg-color-bg` | `#6b6b6b` | 页面/视口背景（`ThemeView3D` / `ThemeSpaceGeneric.back`） |
| `--lg-color-bg-alt` | `#999999` | 大纲/树/列表底（Outliner `ThemeSpaceGeneric.back`） |
| `--lg-color-panel` | `#cccccc` | 面板（`panel_back`） |
| `--lg-color-panel-2` | `#b3b3b3` | Properties 内容底（`ThemeProperties.back`） |
| `--lg-color-header` | `#adadad` | 面板/区域头（`ThemeSpaceGeneric.header`） |
| `--lg-color-header-2` | `#c0c0c0` | 悬浮、菜单背板（`wcol_menu_back.inner`） |
| `--lg-color-text` | `#1a1a1a` | 主文本（`wcol_regular.text`） |
| `--lg-color-text-strong` | `#000000` | 标题、激活文本 |
| `--lg-color-text-muted` | `#4d4d4d` | 次要文本（菜单文本同色） |
| `--lg-color-accent` | `#5680c2` | 选中/激活（`wcol_tool.inner_sel`、`wcol_menu_item.inner_sel`） |
| `--lg-color-accent-hover` | `#668ccc` | 菜单/列表选中（`wcol_regular.inner_sel`、`wcol_list_item.inner_sel`） |
| `--lg-color-border` | `#999999` | 默认分隔线（`editor_border`、Outliner 背景同色） |
| `--lg-color-border-strong` | `#4d4d4d` | 控件描边（`wcol_regular.outline`） |
| `--lg-color-button` | `#dbdbdb` | 按钮/控件底（`wcol_regular.inner`） |
| `--lg-color-button-hover` | `#e5e5e5` | 按钮悬浮 |
| `--lg-color-button-text` | `#1a1a1a` | 按钮文本 |
| `--lg-color-input-bg` | `#dbdbdb` | 输入/Checkbox 底 |
| `--lg-color-input-border` | `#4d4d4d` | 输入描边 |
| `--lg-color-row-hover` | `#c0c0c0` | 列表/树悬浮行 |
| `--lg-color-row-alt` | `rgba(0,0,0,.035)` | 斑马纹（文件列表 `row_alternate` 的低对比版本） |
| `--lg-color-row-selected` | `#668ccc` | 列表/树选中行 |
| `--lg-color-row-semiselected` | `rgba(86,128,194,.28)` | 树半选中 |
| `--lg-color-table-head` | `#adadad` | 表头（与面板头一致） |
| `--lg-color-table-border` | `#999999` | 单元格分隔线 |
| `--lg-color-menu-bg` | `#c0c0c0` | 弹出菜单（`wcol_menu_back.inner`） |
| `--lg-color-menu-border` | `#a6a6a6` | 菜单描边（`wcol_menu_back.outline`） |
| `--lg-color-menu-text` | `#1a1a1a` | 菜单文本（`wcol_menu_item.text`） |
| `--lg-color-menu-hover` | `#668ccc` | 菜单项悬浮 |
| `--lg-color-console-bg` | `#1d1d1d` | Console 保持深色（`ThemeConsole.back`） |
| `--lg-color-console-text` | `#e6e6e6` | Console 文本（`ThemeConsole.text`） |
| `--lg-color-tooltip-bg` | `#19191a` | Tooltip（`wcol_tooltip.inner`） |
| `--lg-color-tooltip-text` | `#e6e6e6` | Tooltip 文本（`wcol_tooltip.text`） |
| `--lg-color-warn` | `#ac8737` | 警告（`wcol_state.warning`） |
| `--lg-color-error` | `#c62828` | 错误 |
| `--lg-color-good` | `#188625` | 成功（`wcol_state.success`） |

> 亮色下 Console 仍使用深色输入区，这是 Blender Light 的原始行为，不要为了“统一浅色”把它改成白底。

### 2.3 字体与字号

| Token / 角色 | 值 |
| --- | --- |
| `--lg-font` | `Inter, "Segoe UI", "DejaVu Sans", Roboto, Arial, sans-serif` |
| `--lg-font-size` | 13px |
| `--lg-font-size-sm` | 12px |
| `--lg-font-size-xs` | 11px |
| 等宽（Console / 脚本） | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`，12px |
| 标题字重 | 500，不使用 700 |
| 行高 | 1.45–1.6 |

### 2.4 尺寸与间距

| Token | 值 | 说明 |
| --- | --- | --- |
| `--lg-header-height` | 30px | 面板头、区域头 |
| `--lg-row-height` | 26px | 属性行、树/列表行 |
| `--lg-control-height` | 26px | 按钮、输入、下拉 |
| `--lg-radius` | 3px | 面板、按钮、输入 |
| `--lg-radius-sm` | 2px | 单元格、Checkbox、内部控件 |
| 间距基数 | 4px | 4 / 8 / 12 / 16 |
| 区域分隔线 | 1px | 不使用粗边框 |
| 焦点环 | `0 0 0 1px rgba(71,114,179,.35)` | 暗色输入聚焦 |

### 2.5 形状与阴影

- 面板、按钮、输入：`3px` 圆角；Checkbox、表头和内部小块用 `2px`。
- 菜单、Dialog：允许 `0 8px 24px rgba(0,0,0,.6)` 阴影（亮色降到 `.28`），其他组件不加阴影。
- 不使用渐变、发光、玻璃拟态。
- 选中态优先使用底色 + 2px 强调线，不只用文字颜色。

## 3. 布局骨架

```
┌────────────────────────────────────────────────────────────┐
│ Top Bar：品牌 / 应用菜单 / Workspace Tabs / Scene/ViewLayer │ 32px
├───────────────────────────────────────────────┬────────────┤
│ Area Header：编辑器图标 / 模式 / 菜单 / 控制   │ Outliner   │ 30px
├───────────────────────────────────────────────┤ 300px      │
│                                               ├────────────┤
│ Viewport / Editor                             │ Properties │
│                                               │ 图标 Tab   │
├───────────────────────────────────────────────┴────────────┤
│ Timeline：菜单 / 播放控制 / 帧 / 标尺 / 播放头 │ 100px      │
├────────────────────────────────────────────────────────────┤
│ Status Bar：提示 / 统计 / 版本                             │ 26px
└────────────────────────────────────────────────────────────┘
```

- 区域之间用 1px 分隔线，不使用卡片间距。
- 右侧栏最小 250px、最大 520px，可拖拽；属性面板的基准可用宽度为 **340px**，Inspector 必须在该宽度内不横向溢出。
- 时间线可折叠；脚本工作区隐藏右栏和时间线。
- 窄屏（<1100px）右栏降到 300px，仍保留视口和属性；390px 下组件必须可收缩或自身滚动。

## 4. 组件解剖

### Top Bar

- 高度 32px；品牌 42px。
- 应用菜单：File / Edit / Render / Window / Help，按钮高 27px，悬浮底色 `#353535`。
- Workspace Tabs：高度 32px，激活项底色 `#282828` + 底部 2px `--lg-color-accent`。
- 右侧：Scene / ViewLayer 小按钮，前置 6px 蓝色圆点。
- 不放大图标；菜单文字 13px。

### Area Header

- 高度 30px；左侧编辑器图标（14–16px）+ 模式下拉 + View/Select/Add/Object。
- 右侧：变换方向、吸附、着色模式（Wire/Solid/Material/Rendered）、Overlays、Options。
- 按钮 24–26px 高，图标 13–15px，激活项用强调色底。
- 模式切换用文字 + `▾`，不要只放图标。

### Panel / Dialog

- Header 30px，背景 `--lg-color-header`，底部 1px 边框。
- 标题 13px/500；关闭按钮 24×22px。
- Content padding 8px；Panel 使用纵向 flex，内容区可滚动，footer 无内容时隐藏。
- Dialog 只用于确认/错误/模态；常规面板不要浮空。Dialog 宽 280px 起，最大 `calc(100vw - 24px)`。
- 亮色下 panel `#cccccc`、header `#adadad`、正文 `#1a1a1a`。

### Button

- 最小高度 26px，水平 padding 12px；small 22px、mini 20px。
- 暗色默认底 `#3d3d3d`、描边 `#4a4a4a`、悬浮 `#4a4a4a`、激活/主按钮 `#4772b3`。
- 亮色默认底 `#dbdbdb`、描边 `#4d4d4d`、悬浮 `#e5e5e5`、激活/主按钮 `#5680c2`。
- 禁用透明度 0.45；不允许渐变、3D 高光、文字阴影。

### Input / Checkbox / SearchBox / Dragger

- 高度 26px，暗色底 `#1d1d1d`；亮色底 `#dbdbdb`；边框分别 `#3d3d3d` / `#4d4d4d`；圆角 3px。
- 输入字号 13px，padding 0 8px；聚焦时边框变强调色 + 1px 焦点环。
- Checkbox 根节点 18×18px；`--on` 放在 `.lg-checkbox__flag` 上（不是 root）：
  - `.lg-checkbox__flag.lg-checkbox--on` 使用强调色底；
  - 选中对勾由 `::after` 绘制，白色，2px 线宽。
- 数字输入支持轴向拖拽；拖拽标签用红/绿/蓝区分 X/Y/Z，但保持低饱和。
- Inspector 内部的旧 checkbox 用 `.inspector .wcontent .checkbox.on` 兼容，选中态同样是强调色底。

### Menu / ContextMenu

- 顶部菜单栏高 30px，项高 28px。
- 弹出面板暗色背景 `#282828`、边框 `#4a4a4a`；亮色 `#c0c0c0` / `#a6a6a6`。
- 菜单项高 26px，padding 0 12px；悬浮强调色 + 白字（亮色菜单 `#668ccc`）。
- 分隔线 1px `--lg-color-border`，上下 4px。
- 快捷键右对齐，11px，弱化颜色。

### Tabs

- Tab 高度 30px；默认文字弱化；悬浮底色 `--lg-color-header-2`。
- 选中：内容底色 + 2px 强调色下划线；亮色选中文字 `#000`。
- 允许关闭按钮，但不要挤压标题。

### Tree / Outliner

- 实际类名是 `.litetree` / `.ltreeitem` / `.ltreeitemtitle` / `.incontent` / `.listbox`，不是 `.lg-tree`。
- 行高 26px；缩进由 Tree.INDENT=20px 的内联 padding 提供，CSS 不要写死缩进。
- 名称 13px；选中整行 `--lg-color-row-selected` + 白字；半选中用 `--lg-color-row-semiselected`。
- 隐藏对象降低透明度，不删除行。

### List / Table

- List 行高 26px；选中强调色底；旧的三角形指示器已禁用。
- Table 必须是真正的表格布局：`table` / `table-row` / `table-cell`，`table-layout: fixed`，列宽 100% 分配。
- **不要**把 `.lg-table` / `tr` / `th` / `td` 改成 `display:block` 或 `inline-block`，否则表头与数据列会错位。
- 表头 `--lg-color-table-head`，单元格 12px，行高约 27–30px；斑马纹用低对比 token。
- 表格纵向滚动需要外层容器或后续在 Table 内增加 wrapper；当前 CSS 不通过 `display:block` 换滚动，避免列错位。

### Inspector / Properties

- 实际类名是 `.inspector` / `.widget` / `.wname` / `.wcontent` / `.info_content` / `.inputfield`，不是 `.lg-inspector`。
- 每行 26px：`.widget` 为 flex，两列布局。
- 标签列 `.wname` 基准 96px（可用内联 `name_width` 覆盖），值列 `.wcontent`/`.info_content` 自适应且 `min-width: 0`。
- `.inputfield` 高 24px，输入框宽度 100%、`box-sizing: border-box`，不得撑破 340px 右栏。
- `.wtitle` / `.wsectiontitle` 26px、可折叠；`.wsectioncontent` 用面板次级底色。
- 数字值可用 `.number` 的 `--lg-color-number`，亮色下为 `#2f5fae`。
- 面板内容滚动，不整页滚动。

### ComplexList

- 实际类名 `.lg-complex-list` / `.lg-complex-list__item` / `__title` / `__tick`。
- 行高 30px，面板底色 + 1px 边框；选中 `--lg-color-row-selected`。
- `addItem()` 会把 `lg-is-selected` / `lg-is-enabled` 加在**外层 span** 上，CSS 同时兼容外层与 item 自身两个层级。
- tick 默认文案 “Tick” 用 `font-size: 0` 隐藏，启用时用 `::after` 画对勾。

### Timeline

- 总高 100px；头部 30px，标尺 20px。
- 播放按钮 24×24px；帧输入 48px；Start/End 输入 44px。
- 播放头 1.5px 强调色，顶部三角标记；关键帧菱形 8–10px，`#d8b04a`。
- 标尺每 10 帧一个刻度，文字 10–11px。

### Status Bar

- 高 26px；左侧操作提示，中间统计，右侧版本。
- 字号 11px；颜色 `--lg-color-text-muted`；强调信息用 `--lg-color-accent-hover`。
- 渲染进度在左侧替换提示，不弹 Toast。

## 5. 组件映射

| Blender 区域 | LiteGUI 组件 / class |
| --- | --- |
| Top Bar | `lg-topbar`（editor shell）+ `.lg-menu` |
| Workspace Tabs | `.lg-workspace-tabs` / `Tabs` 变体 |
| Area Header | `.lg-area-header` |
| Panel | `Panel` / `.lg-panel`、`.lg-panel__header`、`.lg-panel__content` |
| Dialog | `Dialog` / `.lg-dialog`、`.lg-dialog__buttons`、`.lg-dialog__footer` |
| Button | `Button` / `.lg-button__control`、`.lg-button--small`、`.lg-button--mini` |
| Checkbox | `Checkbox` / `.lg-checkbox` + `.lg-checkbox__flag`（`--on` 在 flag 上） |
| Input | `.lg-input` / `.lg-input__field` |
| SearchBox | `.lg-searchbox` / `.lg-searchbox__input` |
| Menu | `Menu` / `.lg-menu`、`.lg-menu__panel`、`.lg-menu__panel-item` |
| Context Menu | `ContextMenu` / `.lg-context-menu`、`.lg-context-menu__item` |
| Tabs | `Tabs` / `.lg-tabs`、`.lg-tabs__list`、`.lg-tabs__tab--selected` |
| Tree / Outliner | `Tree` / `.litetree`、`li.ltreeitem`、`.ltreeitemtitle`、`.incontent`、`.listbox` |
| Inspector / Properties | `Inspector` / `.inspector`、`.widget`、`.wname`、`.wcontent`、`.info_content`、`.inputfield` |
| List | `List` / `ul.lg-list`、`.lg-list__item` |
| ComplexList | `ComplexList` / `.lg-complex-list`、`.lg-complex-list__item`、`__tick` |
| Table | `Table` / `table.lg-table` |
| Console | `Console` / `.lg-console` |
| Tooltip | `.lg-tooltip`（含 `[role="tooltip"]`） |
| Viewport | `Viewport` / `.lg-viewport`、`.lg-viewport__canvas`、`.lg-viewport__info` |
| Timeline | editor `.be-timeline`（后续抽成 `Timeline` 组件） |
| Status Bar | editor `.be-statusbar` |

> 目前 Top Bar、Workspace Tabs、Area Header、Timeline、Status Bar 在 `apps/blender`/workspace 组件内实现；后续抽到组件包时，class 和 token 保持本规范不变。

## 6. 代码组织

组件的交互逻辑和组件专属样式放在同一目录，文件名一一对应：

```
packages/components/src/components/
  Button.ts
  Button.scss
  Checkbox.ts
  Checkbox.scss
  HeaderBar.ts
  HeaderBar.scss
```

- 组件 SCSS 只写该组件的结构/状态；不要在这里放全局 token。
- 共享样式仍放在 `packages/components/src/styles/`：
  - `theme.scss`：颜色/字号/尺寸 token（Dark/Light）
  - `blender.scss`：Blender 默认主题的跨组件覆盖
  - `layout.scss`：应用壳/Area 根容器与 modal 遮罩
  - `normalize.scss` / `scrollbar.scss` / `file-list.scss` / `style.scss`：全局基础样式
- `styles/index.scss` 是唯一样式入口，负责按顺序引入组件 SCSS 和共享样式。
- 新增组件时：先建 `PascalCase.ts`，再建同级 `PascalCase.scss`，最后在 `styles/index.scss` 中 `@use`。

## 6. 主题实现

默认暗色（`packages/components/src/styles/blender.scss`）：

```scss
:root {
  --lg-color-bg: #1d1d1d;
  --lg-color-panel: #2e2e2e;
  --lg-color-accent: #4772b3;
  --lg-font-size: 13px;
  --lg-control-height: 26px;
}
```

亮色：

```scss
:root[data-lg-theme="light"] {
  --lg-color-bg: #6b6b6b;
  --lg-color-panel: #cccccc;
  --lg-color-header: #adadad;
  --lg-color-accent: #5680c2;
  --lg-color-input-bg: #dbdbdb;
}
```

启用亮色：

```html
<html data-lg-theme="light">
```

```ts
LiteGUI.setTheme("light"); // 写入 data-lg-theme="light"
LiteGUI.setTheme("dark");  // 写入 data-lg-theme="dark"，也可移除属性
```

维护规则：

1. 颜色只通过 token 修改，不在组件 SCSS 里新增硬编码色值。
2. 新组件必须给出 default / hover / active / focus / disabled 五种状态，并且暗/亮两套 token 下都成立。
3. 新组件必须提供 26px 控件高度和 13px 文本基线；图标 14–16px。
4. 新增或修改视觉规范时，同步更新本文档、`docs/theming.md` 和演示页。
5. 用固定 1600×961 视口截图对比 blender 示例；用 390×720 验证窄屏。
6. 修改 `styles/**` 后重新执行 `pnpm docs:styles`，文档站会给选择器加 `.lg-demo` 前缀，因此组件规则不要依赖 `:root` 祖先选择器。

## 7. 禁止项

- 不使用 Blender 的 GPL 图标、启动图、品牌资源。
- 不把 Blender 的 11px 密度直接搬到 Web；最小可点击区域 26px。
- 不使用高对比条纹、渐变按钮、玻璃拟态、发光阴影。
- 亮色下不要把页面/面板整体刷成暗色，也不要把 Console 强行改成白底（Blender Light 的 Console 本身就是深色）。
- 不用纯图标替代模式/菜单文字；关键操作保留文字或 tooltip。
- 不用绝对定位堆出“看起来像”的布局；区域必须可伸缩、可折叠。
- 不用 `display:block` / `inline-block` 改造 Table 的 `tr/th/td`。

## 8. 验收清单

- [ ] Top Bar、Workspace Tabs、Area Header 三层结构存在。
- [ ] 面板/菜单/按钮/输入均为扁平表面，无渐变；暗/亮主题都成立。
- [ ] 暗色选中态 `#4772b3`、亮色选中态 `#5680c2`，焦点态可见。
- [ ] Checkbox 选中态可见：`.lg-checkbox__flag.lg-checkbox--on` 有强调色底与对勾。
- [ ] Inspector 在 340px 宽右栏内两列对齐，输入不溢出。
- [ ] Tree 26px 行、选中蓝、层级缩进正常。
- [ ] Table 表头/数据列对齐，`display` 计算值为 `table` / `table-cell`。
- [ ] 文字 13px、控件 26px、行高 26px，390px 窄屏不横向溢出。
- [ ] 右栏可拖拽，视口/时间线可伸缩。
- [ ] 菜单、右键菜单、工具提示可键盘关闭。
- [ ] 1600×961 截图与 Blender 结构一致，但尺寸适合 Web。
