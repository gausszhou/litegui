---
title: 更新日志
description: LiteGUI 版本变更
---

# 更新日志

## Unreleased

monorepo 改造：

- pnpm workspace：`packages/{core,litegui,tests}` + `apps/{demo,editor}`
- 包名改为 `@gausszhou/litegui`、`@gausszhou/litegui-core`；`Inspector`、`Tree` 不再拆包，统一回到主包
- 产物从 `lib/` 改为各包 `dist/`；新增 ESLint、Typedoc API、size / verify-pack / pages 脚本
- 主包新增组件命名导出；`Inspector`、`Tree` 并入主包并恢复 `LiteGUI.Inspector/Tree`，UMD 仍为自包含单文件
- 修复二级菜单定位：与父项对齐、视口内自动翻转、清理旧子菜单
- 文档站改为每组件独立页：真实渲染 demo + 同源示例代码，`.lg-demo` 前缀样式隔离
- `Menu` / `ContextMenu` 新增 `container` 选项

## 1.0.1

测试与交互修复：

- Dragger 键盘/滚轮同步 `value`
- Tabs plus tab 插入修复
- Area merge 修复
- ContextMenu 子菜单引用
- htmlEncode/htmlDecode 兼容 jsdom
- 单元测试 120 个、覆盖率约 72.8%

## 1.0.0

- Inspector/Tree 拆分到 `@gausszhou/litegui-experimental`
- HTML 安全默认值、escapeHTML、Table allowHTML
- API 稳定性与弃用策略
- Playwright Chrome/Firefox
- 主包体积下降

## 0.2.0

- 主题 token 与亮/暗主题
- 基础可访问性
- 按组件导出
- VitePress 文档站

## 0.1.0

- 核心组件、core 抽取、构建与测试基线。

完整文件：[CHANGELOG.md](https://github.com/gausszhou/litegui/blob/master/CHANGELOG.md)
