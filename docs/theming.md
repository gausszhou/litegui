---
title: 主题
description: LiteGUI 的 Blender 暗色/亮色主题与 CSS 变量
---

# 主题

LiteGUI 默认使用 **Blender Dark**。所有颜色、字号、尺寸都通过 CSS 变量（design tokens）控制；在 `<html>` 上加 `data-lg-theme="light"` 即切换到 **Blender Light**。

- 默认暗色：无需设置属性，或设置 `data-lg-theme="dark"`。
- 浅色：设置 `data-lg-theme="light"`。
- token 源文件：`packages/components/src/styles/blender.scss`；构建后位于 `@gausszhou/litegui-components/style.css`。
- `packages/components/src/styles/theme.scss` 保留基础兜底 token，方便单独引用 theme；实际默认主题以 `blender.scss` 为准。

## 切换主题

```ts
import LiteGUI from "@gausszhou/litegui-components";

LiteGUI.setTheme("light"); // document.documentElement.dataset.lgTheme = "light"
LiteGUI.setTheme("dark");  // 写回 "dark"；也可移除该属性
LiteGUI.getTheme();        // "light"
```

初始化时指定：

```ts
LiteGUI.init({
  container: "#app",
  theme: "dark"
});
```

也可以完全不用 JS，直接写 HTML：

```html
<html data-lg-theme="light">
```

## Blender Dark（默认）

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--lg-color-bg` | `#1d1d1d` | 页面、视口、顶栏、状态栏 |
| `--lg-color-bg-alt` | `#282828` | 树、列表、时间线、大纲底 |
| `--lg-color-panel` | `#2e2e2e` | 面板、Dialog、属性内容 |
| `--lg-color-panel-2` | `#252525` | 次级面板、Console footer |
| `--lg-color-header` | `#2b2b2b` | 面板头、区域头、菜单栏 |
| `--lg-color-header-2` | `#353535` | 悬浮、按下、次级表面 |
| `--lg-color-text` | `#d8d8d8` | 正文 |
| `--lg-color-text-strong` | `#f0f0f0` | 标题、激活文本 |
| `--lg-color-text-muted` | `#9a9a9a` | 次要文本、占位 |
| `--lg-color-accent` | `#4772b3` | 选中、激活、焦点 |
| `--lg-color-accent-hover` | `#5885c8` | 强调悬浮 |
| `--lg-color-border` | `#3d3d3d` | 分隔线、控件边框 |
| `--lg-color-border-strong` | `#4a4a4a` | 按钮/输入描边 |
| `--lg-color-button` | `#3d3d3d` | 按钮底 |
| `--lg-color-button-hover` | `#4a4a4a` | 按钮悬浮 |
| `--lg-color-button-text` | `#e6e6e6` | 按钮文字 |
| `--lg-color-overlay` | `rgba(0,0,0,.72)` | 模态遮罩 |
| `--lg-radius` / `--lg-radius-sm` | `3px` / `2px` | 面板 / 内部控件圆角 |
| `--lg-header-height` | `30px` | 面板/区域头 |
| `--lg-row-height` | `26px` | 属性行、树/列表行 |
| `--lg-control-height` | `26px` | 按钮、输入、下拉 |

## Blender Light（`data-lg-theme="light"`）

取自 Blender 4.5 的 `scripts/presets/interface_theme/Blender_Light.xml`：

| 变量 | 值 | Blender 依据 |
| --- | --- | --- |
| `--lg-color-bg` | `#6b6b6b` | `ThemeSpaceGeneric.back` / `ThemeView3D` 视口 |
| `--lg-color-bg-alt` | `#999999` | Outliner / 树 / 列表背景 |
| `--lg-color-panel` | `#cccccc` | `panel_back` |
| `--lg-color-panel-2` | `#b3b3b3` | Properties 内容底 |
| `--lg-color-header` | `#adadad` | `ThemeSpaceGeneric.header` |
| `--lg-color-header-2` | `#c0c0c0` | 悬浮、菜单背板（`wcol_menu_back.inner`） |
| `--lg-color-text` | `#1a1a1a` | `wcol_regular.text` |
| `--lg-color-text-strong` | `#000000` | 标题 |
| `--lg-color-text-muted` | `#4d4d4d` | 次要文本 |
| `--lg-color-accent` | `#5680c2` | `wcol_tool.inner_sel` |
| `--lg-color-accent-hover` | `#668ccc` | `wcol_regular.inner_sel` / `wcol_list_item.inner_sel` |
| `--lg-color-border` | `#999999` | `editor_border` |
| `--lg-color-border-strong` | `#4d4d4d` | `wcol_regular.outline` |
| `--lg-color-button` | `#dbdbdb` | `wcol_regular.inner` |
| `--lg-color-button-hover` | `#e5e5e5` | 按钮悬浮 |
| `--lg-color-button-text` | `#1a1a1a` | 按钮文字 |
| `--lg-color-input-bg` | `#dbdbdb` | 输入 / 下拉 / Checkbox 底 |
| `--lg-color-input-border` | `#4d4d4d` | 输入描边 |
| `--lg-color-row-hover` | `#c0c0c0` | 行悬浮 |
| `--lg-color-row-selected` | `#668ccc` | 列表 / 树选中行 |
| `--lg-color-table-head` | `#adadad` | 表头 |
| `--lg-color-menu-bg` | `#c0c0c0` | 弹出菜单 |
| `--lg-color-tooltip-bg` | `#19191a` | Tooltip（`wcol_tooltip.inner`） |
| `--lg-color-tooltip-text` | `#e6e6e6` | Tooltip 文字 |

> 亮色下 Console 仍为深色（`#1d1d1d` / `#e6e6e6`），这是 `ThemeConsole` 在 Blender Light 里的实际取值，不是遗漏。

## 组件级 token

除核心 token 外，组件样式还会读取以下 token；它们都在 `blender.scss` 中同时给出暗/亮两套值，覆盖主题时可按需修改：

| 变量 | 作用 |
| --- | --- |
| `--lg-color-input-bg` / `--lg-color-input-border` / `--lg-color-input-text` | Input、Select、Textarea、Checkbox |
| `--lg-color-placeholder` | 输入占位文本 |
| `--lg-color-number` | Inspector 数字值 |
| `--lg-color-row-hover` / `--lg-color-row-alt` / `--lg-color-row-selected` / `--lg-color-row-semiselected` | List、Tree、Table、ComplexList |
| `--lg-color-table-head` / `--lg-color-table-border` | Table |
| `--lg-color-checkbox-bg` / `--lg-color-checkbox-border` | Checkbox 与 ComplexList tick |
| `--lg-color-menu-bg` / `--lg-color-menu-border` / `--lg-color-menu-text` / `--lg-color-menu-hover` | Menu、ContextMenu |
| `--lg-color-console-bg` / `--lg-color-console-text` | Console |
| `--lg-color-tooltip-bg` / `--lg-color-tooltip-text` | Tooltip |
| `--lg-color-warn` / `--lg-color-error` / `--lg-color-good` / `--lg-color-info` | Console 消息、状态色 |
| `--lg-color-focus-ring` | 输入聚焦环 |
| `--lg-color-scrollbar-track` / `--lg-color-scrollbar-thumb` | 滚动条 |
| `--lg-shadow-panel` / `--lg-shadow-menu` | 面板 / 菜单阴影 |
| `--lg-viewport-bg` / `--lg-viewport-bg-wire` / `--lg-viewport-grid` / `--lg-viewport-grid-axis` / `--lg-viewport-outline` | Viewport 背景、网格与描边 |
| `--lg-viewport-axis-*` / `--lg-viewport-gizmo-*` / `--lg-viewport-selection*` / `--lg-viewport-edit*` / `--lg-viewport-face-1..6` / `--lg-viewport-camera` / `--lg-viewport-light` / `--lg-viewport-brush*` | Viewport 3D 场景配色 |

## 覆盖主题

优先覆盖 token；需要更细的样式时再覆盖组件 class。覆盖代码应放在 LiteGUI 样式之后：

```css
/* 品牌强调色（同时覆盖暗/亮两套） */
:root {
  --lg-color-accent: #3b82f6;
  --lg-color-accent-hover: #60a5fa;
}

/* 只改亮色 */
:root[data-lg-theme="light"] {
  --lg-color-bg: #ffffff;
  --lg-color-panel: #f2f2f2;
  --lg-color-accent: #2563eb;
}
```

组件级覆盖示例：

```css
/* Inspector 标签列加宽到 120px */
.inspector .wname {
  width: 120px;
}

/* Table 表头换成品牌色 */
table.lg-table th {
  background: var(--lg-color-header-2);
  color: var(--lg-color-text-strong);
}

/* Checkbox 选中态使用自己的颜色 */
.lg-checkbox__flag.lg-checkbox--on {
  background: #16a34a;
  border-color: #16a34a;
}
```

注意：

1. 组件 class 是稳定的公开接口（`lg-*` 以及旧版的 `.inspector` / `.litetree`），不要依赖标签层级选择器。
2. Checkbox 的选中修饰符在 `.lg-checkbox__flag` 上：用 `.lg-checkbox__flag.lg-checkbox--on`，不要写 `.lg-checkbox--on .lg-checkbox__flag`。
3. Table 已恢复原生表格布局；自定义时不要给 `table/tr/th/td` 设置 `display:block`，否则列会错位。
4. 文档站会给 `packages/components/src/styles/index.scss` 的选择器统一加 `.lg-demo` 前缀（`:root` 变量除外），因此不要在组件 CSS 里使用依赖 `:root` 祖先的选择器；改完样式后执行 `pnpm docs:styles`。
5. 1.x 仍使用全局 class；作用域前缀与 Shadow DOM 不在当前路线图内。

## 与 Blender 的差异

- 字号 13px、控件/行高 26px，比 Blender 的 11px 更适合 Web。
- 不使用 Blender 的 GPL 图标与启动资源。
- 亮色不是简单的“反色”，而是按 Blender Light 的面板/控件层级重新配色；详见 [`docs/design/blender-ui.md`](/design/blender-ui)。
