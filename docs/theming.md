---
title: 主题
description: LiteGUI 的暗色/亮色主题与 CSS 变量
---

# 主题

LiteGUI 使用 CSS 变量作为主题 token，默认暗色；在 `<html>` 上设置 `data-lg-theme="light"` 即可切换亮色。

## 切换主题

```ts
import LiteGUI from "@gausszhou/litegui";

LiteGUI.setTheme("light");
LiteGUI.getTheme(); // "light"
```

也可以在初始化时指定：

```ts
LiteGUI.init({
  container: "#app",
  theme: "dark"
});
```

## 变量

主题变量定义在 `packages/litegui/src/styles/theme.scss`，构建后位于 `@gausszhou/litegui/style.css`：

| 变量 | 用途 |
| --- | --- |
| `--lg-color-bg` | 页面背景 |
| `--lg-color-panel` | 面板/对话框背景 |
| `--lg-color-header` | 标题栏背景 |
| `--lg-color-text` | 正文文字 |
| `--lg-color-text-strong` | 高对比文字 |
| `--lg-color-accent` | 强调色 |
| `--lg-color-button` | 按钮背景 |
| `--lg-color-overlay` | 模态遮罩 |

覆盖示例：

```css
:root {
  --lg-color-accent: #3b82f6;
  --lg-color-header: #1e3a5f;
}

:root[data-lg-theme="light"] {
  --lg-color-bg: #ffffff;
}
```

## 自定义样式

组件暴露稳定的 class 前缀（`litearea`、`litepanel`、`litedialog`、`litetable` 等）。建议优先覆盖变量；需要更细的样式时再覆盖 class。

> 1.x 仍使用全局 class；作用域前缀与 Shadow DOM 不在当前路线图内。
