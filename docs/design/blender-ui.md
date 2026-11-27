---
title: Blender UI 设计规范
description: LiteGUI 默认 Blender 风格的主题、尺寸、组件解剖与维护规则
---

# Blender UI 设计规范

这份规范约束 LiteGUI 的 **默认视觉语言**：布局和层级参考 Blender 4.5，但字号、控件尺寸和交互反馈按 Web 可读性放大，不做像素级复刻。

参考基线：Blender 4.5.17 LTS 默认界面（Layout 工作区、Object Mode、Blender Dark 主题）。

## 1. 设计原则

| 原则 | 做法 |
| --- | --- |
| 扁平深色 | 三层面板 + 1px 分隔线，不使用渐变、内阴影、外发光 |
| 层级靠明度 | 背景 `#1d1d1d` → 面板 `#2e2e2e` → 头部 `#2b2b2b` → 悬浮 `#353535` |
| 低饱和强调 | 只用一种蓝色 `#4772b3` 表示选中、激活、焦点 |
| 紧凑但可读 | 基础字号 13px，行高 26px，最小点击区域 26×26px |
| 结构优先 | 顶栏、区域头、面板头、树、属性、时间线、状态栏的层级关系不能省 |
| 不抄资产 | 参考布局与配色，图标必须使用自有或 MIT 图标，不复制 Blender GPL 图标 |

## 2. Design Tokens

默认主题在 `packages/components/src/styles/blender.scss` 的 `:root:not([data-lg-theme="light"])` 中定义；`data-lg-theme="light"` 时回退浅色。

### 2.1 颜色

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
| `--lg-color-button` | `#3d3d3d` | 按钮底 |
| `--lg-color-button-hover` | `#4a4a4a` | 按钮悬浮 |

### 2.2 字体与字号

| Token / 角色 | 值 |
| --- | --- |
| `--lg-font` | `Inter, "Segoe UI", "DejaVu Sans", Roboto, Arial, sans-serif` |
| 基础字号 | 13px |
| 次级字号 | 12px |
| 小标签/快捷键 | 11px |
| 等宽（Console / 脚本） | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`，12px |
| 标题字重 | 500，不使用 700 |
| 行高 | 1.45–1.6 |

### 2.3 尺寸与间距

| Token | 值 | 说明 |
| --- | --- | --- |
| `--lg-header-height` | 30px | 面板头、区域头 |
| `--lg-row-height` | 26px | 属性行、树/列表行 |
| `--lg-control-height` | 26px | 按钮、输入、下拉 |
| `--lg-radius` | 3px | 面板、按钮、输入 |
| 间距基数 | 4px | 4 / 8 / 12 / 16 |
| 区域分隔线 | 1px | 不使用粗边框 |
| 焦点环 | `0 0 0 1px rgba(71,114,179,.35)` | 输入聚焦 |

### 2.4 形状与阴影

- 面板、按钮、输入：`3px` 圆角。
- 菜单、Dialog：允许 `0 8px 24px rgba(0,0,0,.6)` 阴影，其他组件不加阴影。
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
- 右侧栏最小 250px、最大 520px，可拖拽。
- 时间线可折叠；脚本工作区隐藏右栏和时间线。
- 窄屏（<1100px）右栏降到 300px，仍保留视口和属性。

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
- Content padding 8px。
- Dialog 只用于确认/错误/模态；常规面板不要浮空。

### Button

- 最小高度 26px，水平 padding 12px。
- 默认底色 `#3d3d3d`，边框 `#4a4a4a`；悬浮 `#4a4a4a`；激活/主按钮 `#4772b3`。
- 禁用透明度 0.45。
- 不允许渐变、3D 高光、文字阴影。

### Input / Checkbox / SearchBox / Dragger

- 高度 26px，底色 `#1d1d1d`，边框 `#3d3d3d`，圆角 3px。
- 输入字号 13px，padding 0 8px。
- 聚焦时边框变强调色 + 1px 焦点环。
- Checkbox 18×18px；选中用强调色底 + 白色对勾。
- 数字输入支持轴向拖拽；拖拽标签用红/绿/蓝区分 X/Y/Z，但保持低饱和。

### Menu / ContextMenu

- 顶部菜单栏高 28–32px，项高 27px。
- 弹出面板背景 `#282828`，边框 `#4a4a4a`，圆角 3px，阴影。
- 菜单项高 26px，padding 0 12px；悬浮 `#4772b3` + 白字。
- 分隔线 1px `#3d3d3d`，上下 4px。
- 快捷键右对齐，11px，弱化颜色。

### Tabs

- Tab 高度 30px；默认文字 `#9a9a9a`；悬浮底色 `#333`。
- 选中：内容底色 + 2px 强调色下划线。
- 允许关闭按钮，但不要挤压标题。

### Tree / Outliner

- 行高 24–26px；缩进 16–18px/层。
- 图标 14–15px；名称 13px；眼睛/可选性按钮 16×16px。
- 选中行整行强调色底 + 白字。
- 隐藏对象降低透明度，不删除行。

### List / Table

- List 行高 26px；选中强调色底；箭头指示器可保留，但不要盖住文字。
- Table 表头 `#353535`，单元格 12px，行高 28–30px；斑马纹用 2.5% 白，不用高对比条纹。

### Inspector / Properties

- 左侧图标 Tab 30px 宽，激活项左侧 2px 强调线。
- 属性分组标题 26px，可折叠；属性行 24px。
- 标签列 88–104px，值列自适应；数字框三轴并排。
- 颜色字段用 18–22px 色块；复制/动画按钮可后置，但不要挤压输入。
- 面板内容滚动，不整页滚动。

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
| Panel | `Panel` / `.lg-panel` |
| Dialog | `Dialog` / `.lg-dialog` |
| Button | `Button` / `.lg-button__control` |
| Checkbox | `Checkbox` / `.lg-checkbox` |
| Input | `.lg-input__field` |
| Menu | `Menu` / `.lg-menu` |
| Context Menu | `ContextMenu` / `.lg-context-menu` |
| Tabs | `Tabs` / `.lg-tabs` |
| Tree / Outliner | `Tree` / `.lg-tree` |
| Inspector / Properties | `Inspector` / `.lg-inspector` |
| List | `List` / `.lg-list` |
| Table | `Table` / `.lg-table` |
| Console | `Console` / `.lg-console` |
| Timeline | editor `.be-timeline`（后续抽成 `Timeline` 组件） |
| Status Bar | editor `.be-statusbar` |

> 目前 Top Bar、Workspace Tabs、Area Header、Timeline、Status Bar 在 `apps/editor` 内实现；后续抽到组件包时，class 和 token 保持本规范不变。

## 6. 主题实现

默认主题：

```scss
:root:not([data-lg-theme="light"]) {
  --lg-color-bg: #1d1d1d;
  --lg-color-panel: #2e2e2e;
  --lg-color-accent: #4772b3;
  --lg-font-size: 13px;
  --lg-control-height: 26px;
}
```

浅色主题：

```html
<html data-lg-theme="light">
```

维护规则：

1. 颜色只通过 token 修改，不在组件 SCSS 里新增硬编码色值。
2. 新组件必须给出 default / hover / active / focus / disabled 五种状态。
3. 新组件必须提供 26px 控件高度和 13px 文本基线；图标 14–16px。
4. 新增或修改视觉规范时，同步更新本文档、`docs/theming.md` 和 `apps/demo`。
5. 用固定 1600×961 视口截图对比 editor；用 390×720 验证窄屏。

## 7. 禁止项

- 不使用 Blender 的 GPL 图标、启动图、品牌资源。
- 不把 Blender 的 11px 密度直接搬到 Web；最小可点击区域 26px。
- 不使用高对比条纹、渐变按钮、玻璃拟态、发光阴影。
- 不用纯图标替代模式/菜单文字；关键操作保留文字或 tooltip。
- 不用绝对定位堆出“看起来像”的布局；区域必须可伸缩、可折叠。

## 8. 验收清单

- [ ] Top Bar、Workspace Tabs、Area Header 三层结构存在。
- [ ] 面板/菜单/按钮/输入均为扁平深色，无渐变。
- [ ] 选中态使用 `#4772b3`，焦点态可见。
- [ ] 文字 13px、控件 26px、行高 26px，窄屏不横向溢出。
- [ ] 右栏可拖拽，视口/时间线可伸缩。
- [ ] 菜单、右键菜单、工具提示可键盘关闭。
- [ ] 1600×961 截图与 Blender 结构一致，但尺寸适合 Web。
