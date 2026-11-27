# LiteGUI 项目介绍与路线图

> 基线：`develop@6953f3d`（2026-11-27）
> 上游项目：[jagenjo/litegui.js](https://github.com/jagenjo/litegui.js)（MIT）
> 本文同时记录项目现状、问题判断和 12 周路线图，不是 API 文档。

## 0. 结论先行

LiteGUI 是一个**无框架、原生 DOM + TypeScript 的桌面风格 Web UI 组件库**，面向编辑器、调试器、工具台这类需要菜单、面板、分栏、对话框、属性检查器、树和表格的应用。

代码量不大，但当前处在**重构中断状态**：

- `develop` 保存了最完整的代码（19 个导出组件，约 10k 行 TS），但 `tsc` 有 **1192 个错误**，`npm run build` 无法通过。
- 多个核心路径有**已确认的运行时回归**：`Dialog.show()` 为空、`Button` 不触发 `click` 事件、`EventMitter` 使用全局单例、`Checkbox`/`Dragger` 没有挂载 DOM、`Table` 字符串列表头失效。
- 发布链路是断的：`package.json` 的 `exports` 指向构建永远不会产出的文件，没有 `.d.ts`，没有 LICENSE。
- 没有测试、CI、Lint、API 文档；锁文件被 `.gitignore` 忽略。

因此路线图的第一原则不是“继续加组件”，而是：

> **先救活基线，再收窄范围，然后把核心做深，最后发布。**

v0.1 只承诺 **12 个核心组件**；`Inspector`、`Tree`、`ContextMenu` 等大组件先标记为 experimental，等核心稳定后再逐个转正。

### 0.1 实施进度

- [x] **Phase 0（2026-11-27）**：绿色基线
  - 依赖可安装，`package-lock.json` 入库
  - `tsc --noEmit` 0 错误（Inspector/Tree/ContextMenu 临时 `@ts-nocheck`）
  - Vitest + jsdom：9 个测试文件、30 个用例通过
  - `npm run build` 通过，产出 `lib/litegui.esm.js`、`lib/litegui.umd.cjs`、`lib/litegui.css`、`lib/types`
  - `npm pack` 产物可在临时项目安装并 import
  - 核心修复：EventMitter 实例化、Dialog、Button、Checkbox、Dragger、Table、Tabs、LiteGUI.bind/createMenu
  - demo/editor 冒烟测试通过
  - 补充 MIT LICENSE、README 状态表、GitHub Actions CI
- [x] **Phase 1（2026-11-27）**：核心组件验收与 v0.1.0
  - 抽取 `src/core/`，面板/表格/输入/布局/对话框等不再依赖入口
  - Panel、Slider、List、Menu、Area、Split、Console、ComplexList 验收修复
  - 18 个测试文件、62 个用例通过
  - Getting Started 与示例文档、CHANGELOG、0.1.0 版本号
  - Inspector/Tree/ContextMenu 明确标记 experimental
- [x] **Phase 2（2026-11-27）**：主题、可访问性、文档站与 v0.2.0
  - 主题 token、亮/暗主题、`setTheme` API
  - 核心组件基础 ARIA 与键盘操作
  - 13 个按组件 ESM 入口与 `exports` 子路径
  - VitePress 文档站与 GitHub Pages 部署工作流
  - 视觉回归/完整浏览器矩阵顺延到 Phase 3
- [x] **Phase 3（2026-11-27）**：安全、性能、API 治理与 v1.0.0（后续 1.0.1 补齐测试）
  - [x] 安全：`escapeHTML`、Table 默认纯文本、Menu 标签文本化
  - [x] 性能：Table 1000 行基准、Dialog/Panel 生命周期泄漏检查
  - [x] API 稳定性与弃用文档、`deprecate` 一次性告警
  - [x] Playwright Chrome + Firefox 页面/主题测试
  - [x] Inspector/Tree 拆分到 `litegui/experimental`，主入口移除
  - [x] ContextMenu 移除 `@ts-nocheck`
  - [x] v1.0.0 冻结与发布
  - 视觉截图基线与 WebKit 矩阵列入 post-1.0 backlog
- [x] **Phase 4（2026-11-27）**：monorepo 化
  - pnpm workspace：`packages/{core,litegui,tests}` + `apps/{demo,editor}`
  - 包名 `@gausszhou/litegui`、`@gausszhou/litegui-core`，`publishConfig` 切换 `src`/`dist`
  - `Inspector`、`Tree` 不单独拆包：并入 `@gausszhou/litegui`，恢复 `LiteGUI.Inspector/Tree` 静态成员与 `./inspector`、`./tree` 子路径
  - 只保留“API 标记 experimental”的稳定性约定，不再维护独立包
  - ESM 外置 core（单一实例），UMD 保持自包含单文件
  - ESLint flat config、Typedoc API、size / verify-umd / verify-pack / pages:build 脚本
  - CI：lint → typecheck → test → coverage → build → size → verify → e2e → docs，master 通过后发布 gh-pages

---

## 1. 项目是什么

### 1.1 定位

LiteGUI 用 JavaScript/TypeScript 直接创建 DOM，不依赖 React/Vue，提供一套“桌面应用式”的界面能力：

- 可分割、可调整大小的布局（Area / Split / Panel）
- 浮动、模态、可拖拽、可缩放的窗口（Dialog）
- 菜单栏、上下文菜单、树
- 属性检查器（Inspector）和各类表单控件
- 表格、列表、控制台、曲线编辑器

它适合：Web 编辑器、节点编辑器、调试面板、内部工具、游戏/图形工具的控制台。不适合：内容型网站、需要强 SEO 的页面、需要完整设计系统的产品。

### 1.2 技术栈

| 维度 | 现状 |
| --- | --- |
| 语言 | TypeScript（`strict: true`），SCSS |
| 页面构建 | Vite 5（apps/*） |
| 库构建 | Vite 5 lib 模式（ESM + UMD / CJS）+ `tsc` 声明 |
| 运行时依赖 | `mitt`、`lodash-es` |
| 演示 | `apps/demo`（最小示例）、`apps/editor`（综合示例） |
| 部署 | `pnpm pages:build` + `shells/gh-pages.sh`（CI 自动发布） |
| 包管理 | pnpm workspace（`pnpm-lock.yaml` 入库） |

### 1.3 目录结构

```text
packages/
  core/                    # DOM/事件/状态/Widget/utils（无 CSS）
  litegui/                 # 全部组件（含 Inspector、Tree）、LiteGUI 命名空间、entries、styles
  tests/                   # Vitest + Playwright + bench
apps/
  demo/                    # 最小演示页
  editor/                  # 综合演示页
docs/                      # VitePress 文档站（API 由 Typedoc 生成）
scripts/                   # size / verify-umd / verify-pack / pages:build
shells/                    # build.sh、gh-pages.sh
```

### 1.4 组件地图

| 领域 | 组件 |
| --- | --- |
| 布局 | `Area`、`Panel`、`Split`、`Tabs` |
| 窗口/导航 | `Dialog`、`Menu`、`ContextMenu`、`Tree` |
| 数据展示 | `Table`、`List`、`ComplexList` |
| 表单/输入 | `Inspector`、`Button`、`Checkbox`、`Dragger`、`Slider`、`LineEditor`、`SearchBox` |
| 反馈 | `Console` |
| 基础设施 | `LiteGUI`、`EventMitter`、`Widget`、`Box`、`utils` |

`LiteGUI` 通过静态属性暴露 20 个组件（`LiteGUI.Area`、`LiteGUI.Dialog`、`LiteGUI.Inspector` 等），这是对上游 litegui.js 使用方式的兼容层。

---

## 2. 当前状态（基于 develop@6953f3d）

### 2.1 分支与提交

| 分支/提交 | 状态 |
| --- | --- |
| `master@03c62e2` | 默认分支；旧 develop 的合并结果；缺 `Inspector`/`Tree`/`Widgets` 文件，`tsc` 36 个错误，不可构建 |
| `develop@6953f3d` | 本地分支；由 `ea2626c` amend 而来，**代码树与 ea2626c 完全一致**，只改了提交信息 |
| `origin/develop@6953f3d` | 远程分支；已指向 amend 后的提交，与本地一致；远端历史已被改写 |

当前 `develop` 与 `origin/develop` 都指向 `6953f3d`。该提交由 `ea2626c` amend 而来，代码树不变，只改了提交信息；由于属于历史改写，其他协作者需要重新同步 `develop`。**建议在基线转绿前冻结历史改写**，避免分叉扩大。

### 2.2 构建与发布：命令实测

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `npm install` | ❌ | `rollup-plugin-uglify@6` 的 peer 要求 `rollup < 2`，与 `rollup@2` 冲突；需 `--legacy-peer-deps` 才能装 |
| `npm run build:lib` | ✅ | Rollup 产出 `lib/litegui.esm.js`（约 300 KB，gzip 约 61 KB）、`lib/litegui.umd.cjs`、`lib/litegui.css`；`tsc` 另产 `lib/types` |
| `npx tsc --noEmit` | ❌ | **1192 个错误**（见 2.3） |
| `npm run build` | ❌ | 在 `tsc` 阶段失败，走不到 Vite 构建 |
| `npx vite build` | ⚠️ | 先执行 `npm run lib` 后可以成功；产物约 131 KB JS + 28 KB CSS；**新克隆直接构建会因缺少 `lib/index.css` 失败**（`editor/index.js` 直接 import 构建产物） |
| `npm pack` / 发布 | ❌ | `exports` 指向 `dist/bundle.esm.js`、`dist/bundle.umd.cjs`，实际没有任何构建命令产出这两个路径；`main` 也指向不存在的 `lib/bundle.umd.cjs` |

结论：**开发、库构建、页面构建、npm 发布是四套互不一致的路径**，需要收敛成一套。

### 2.3 类型错误分布

```text
893  src/packages/Inspector.ts
264  src/packages/Tree.ts
 23  src/packages/ContextMenu.ts
  6  src/packages/Tabs.ts
  2  src/packages/index.ts
  2  src/packages/Menu.ts
  1  src/packages/Dialog.ts
  1  src/packages/ComplexList.ts
---
1192 total
```

主要原因不是“逻辑全错”，而是迁移方式：

- `Inspector` 和 `Tree` 保留了 `Class.prototype.method = function () {}` 的旧写法，TypeScript 看不到这些成员，于是构造函数里调用 `this.addContainer()`、`this.getChildren()` 全部报“属性不存在”。
- `Inspector` 使用了 `LiteGUI.sizeToCSS`、`purgeElement`，但没有导入；`ContextMenu` 使用了 `LiteGUI.ContextMenu`、`LiteGUI.trigger`，也没有导入。这些是**运行时会直接 ReferenceError** 的问题，不只是类型问题。
- 旧 `.d.ts`（`types/core.d.ts`、`types/widgets.d.ts`）与真实实现脱节，`Menu`/`Panel` 等类型互相引用但未导入。
- 大量 `any`、隐式 `any`、未使用变量，在 `noImplicitAny`/`noUnusedLocals` 下被放大。

### 2.4 组件成熟度（需要区分“编译错误”和“运行回归”）

图例：✅ 基本可用；⚠️ 代码在但有已知缺口，未验收；❌ 已确认阻塞。

| 组件 | 状态 | 说明 |
| --- | --- | --- |
| `Area` | ⚠️ | 布局/分割逻辑基本在；`initEvent()` 用 `LiteGUI.bind(LiteGUI, "resized", ...)`，而当前 `bind` 只处理 DOM 元素，**自动 resize 实际不生效** |
| `Panel` | ⚠️ | 已修复 `this.options` 未赋值；基础布局可用；`close` 选项和 `closed` 事件没有实现 |
| `Split` | ✅ | 固定比例分栏，逻辑简单，待 smoke test |
| `Tabs` | ⚠️ | 主体已迁移；6 个类型错误；`skip_event`、拖拽/关闭等路径未验收 |
| `Dialog` | ❌ | `show()` 是空函数，非模态对话框不会挂载；`createElementButtons()` 从未调用，`this.buttons` 被赋成了第二个 header；`INSTANCE_LIST` 未初始化，`close()` 会抛错；footer 按钮依赖 `Button` 的 `click` 事件，而该事件从未 emit |
| `Menu` | ⚠️ | 类本身可创建菜单；`LiteGUI.createMenu()` 被清空；`updateMainMenu` 的闭包使用循环变量，存在点击错项风险 |
| `ContextMenu` | ❌ | 缺少 `import LiteGUI`，子菜单/关闭路径会 ReferenceError；23 个类型错误 |
| `Tree` | ⚠️ | 1.2k 行，32 个 `prototype` 方法；264 个类型错误；`getChildren`/`getParent` 运行时存在但类型不可见；未验收 |
| `Inspector` | ⚠️ | 3k 行，60 个 `prototype` 方法；893 个类型错误；缺少 `LiteGUI`/`purgeElement` 导入；未验收 |
| `Button` | ⚠️ | 渲染和 `callback` 可用；虽然继承了 `Widget`/`EventMitter`，但 `click()` 只调用 callback、不 emit 事件，导致 Dialog footer 的 `button.on("click")` 永远不触发 |
| `Checkbox` | ❌ | 构造器没有调用 `initDom()`/`initEvent()`，root 为空、无点击行为 |
| `Dragger` | ❌ | 同样没有调用 `initDom()`/`initEvent()`，root 为空 |
| `Slider` | ⚠️ | 可用；`mouseup` 用新的 bind 函数移除监听，监听器泄漏，拖拽可能在松手后继续 |
| `LineEditor` | ⚠️ | 主体可用；`width: "100%"` 赋给 canvas 会被转成 0，需区分 CSS 尺寸和画布像素尺寸 |
| `SearchBox` | ✅ | 逻辑完整，待 smoke test |
| `List` | ⚠️ | 基础列表可用；`setSelectedItem()` 是空实现；字符串项的 `checked` 状态没有真正回写 |
| `ComplexList` | ⚠️ | 可用；`selected` 字段未使用；`innerHTML` 拼接内容，需注意 XSS |
| `Table` | ❌ | 列可以传字符串，但 `cName: String(c)` 是标签语句不是赋值，字符串列名/字段都变成空；构造器要求 `options` 必传；`<table>` 直接设 `overflow` 不能滚动 |
| `Console` | ✅ | 逻辑完整；使用废弃的 `keyCode`，待现代化 |
| `EventMitter` | ❌ | 模块级 `const emitter = mitt()`，**所有实例共享同一个事件总线**；任一实例 emit 会广播给全部实例 |
| `Widget` | ⚠️ | 只是样式/尺寸链式辅助基类；没有生命周期、挂载/销毁、事件封装 |
| `LiteGUI` | ❌ | `createMenu()` 为空；`bind()` 对非 DOM 对象静默失效；`unbind` 是实例方法；`showMessage`/`popup` 依赖坏掉的 Dialog；`init()` 里有 `console.log(options)` 调试语句 |

### 2.5 工程质量与合规

| 项目 | 现状 | 影响 |
| --- | --- | --- |
| 代码量 | `src/packages` 约 10,184 行 TS；样式约 2,278 行 SCSS | 规模中等，但大文件集中 |
| 类型 | 215 处 `any`；1192 个类型错误 | `strict` 形同虚设，重构无法靠编译器兜底 |
| 循环依赖 | 11 个组件直接 `import LiteGUI from "."`（入口），入口又导入这些组件 | 初始化顺序脆弱，tree-shaking 差，测试难隔离 |
| DOM 注入 | 81 处 `innerHTML` | 用户数据/插件内容存在 XSS 风险 |
| 样式 | 全局选择器、硬编码深色配色、无 CSS 变量；`list.scss` 未被入口引入 | 与宿主页面冲突，无法做主题 |
| 可访问性 | div/span 模拟控件，缺少 ARIA、键盘导航、焦点管理 | 键盘用户和屏幕阅读器不可用 |
| 测试 | 无测试脚本、无测试文件 | 每次重构都靠手点，回归无法发现 |
| CI | 无 `.github/workflows` | 构建/类型/测试没有门禁 |
| Lint | 只有 Prettier；无 ESLint | 风格之外的错误无法拦截 |
| 许可证 | 无 `LICENSE`；上游是 MIT | **法律上不能安心发布**，必须保留上游版权声明 |
| 锁文件 | `package-lock.json`/`pnpm-lock.yaml`/`yarn.lock` 被忽略 | 依赖不可复现，今天能装明天未必 |
| 版本/发布 | `version: 0.0.0`；无 CHANGELOG、无 tag、无 release 流程 | 无法对外承诺兼容性 |
| 文档 | 只有 README；README 的组件清单已过期（说 Inspector/Tree 未完成，实际已有代码）；无 API 文档 | 新用户无法上手，维护者也会误判 |

### 2.6 主要风险排序

1. **产品不可用**：Dialog、Checkbox、Dragger、Table 等基础组件有确认回归，demo/editor 无法完整跑通。
2. **无法交付**：`tsc` 1192 错误 + 发布入口指向不存在的文件，npm 包不可用。
3. **事件系统错误**：全局 `mitt` 会让不同实例互相污染，属于隐蔽但系统性的 bug。
4. **范围过宽**：19 个组件 + 3k 行 Inspector，单人或小团队同时维护会持续失血。
5. **无回归防线**：没有测试/CI，重构（尤其是这次）很容易再次把可用代码改坏。
6. **合规缺口**：没有 LICENSE，不能合法发布衍生作品。
7. **样式/可访问性债**：全局 CSS、深色写死、无键盘支持，会阻碍真实项目采用。
8. **文档债**：README 与实际状态不一致，新人（包括未来的自己）无法判断哪些能用。

---

## 3. 产品判断与策略

### 3.1 核心价值

不是“组件数量”，而是：

- **零框架依赖**：适合嵌入任何技术栈的编辑器/工具。
- **桌面式布局与窗口**：Area/Panel/Dialog/Menu 的组合是差异化能力。
- **直接 DOM、可控**：没有虚拟 DOM 黑盒，适合与 Canvas/WebGL 编辑器集成。

### 3.2 当前最大的问题

不是缺组件，而是**缺一条可验证的基线**：

- 没有“全绿”的构建；
- 没有“哪些组件可用”的清单；
- 没有“改坏了会报警”的测试；
- 没有“装得上、用得了”的发布包。

### 3.3 策略

1. **先救活**：1 周内让 `npm ci && npm run build && npm test` 全绿，核心 demo 能跑。
2. **再收窄**：v0.1 只承诺核心 12 个组件；大组件标记 experimental。
3. **做深核心**：统一生命周期、事件、主题、可访问性，而不是继续铺新组件。
4. **最后发布**：打包、文档、CI、License、SemVer 全就绪后再谈 1.0。

### 3.4 v0.1 范围建议

**核心（必须可用）**

`LiteGUI` 核心、`EventMitter`、`Widget`、`Area`、`Panel`、`Split`、`Tabs`、`Dialog`、`Menu`、`Button`、`Checkbox`、`Slider`、`SearchBox`、`List`、`Table`、`Console`。

**Experimental（可用但不在 0.1 稳定性承诺内）**

`Inspector`、`Tree`、`ContextMenu`、`Dragger`、`LineEditor`、`ComplexList`。

**暂缓**

新增组件、框架 wrapper、可视化编辑器应用。

### 3.5 API 原则（用于后续统一）

- 构造参数统一为 `options` 对象；旧签名保留一个 minor 版本并输出 deprecation warning。
- 统一生命周期：`mount(parent)`、`destroy()`、`show()/hide()`。
- 统一值接口：`getValue()/setValue(v)`。
- 统一事件：实例级 `on/off/once/emit`，并与 DOM `CustomEvent` 桥接；不再使用全局总线。
- 组件不得从入口 `"."` 导入 `LiteGUI`；核心能力下沉到 `src/core/`。
- 样式统一 `lg-` 前缀 + CSS 变量；组件不修改 `body` 全局样式。

---

## 4. 路线图（12 周）

> 假设：1 名主要维护者、现代浏览器（Chrome/Edge/Firefox/Safari 最近两个大版本）、MIT 协议、npm 包名 `litegui`（当前 registry 未被占用）。可按实际人力压缩或拉长。

### Phase 0（第 1 周）：绿色基线

**目标**：新克隆能装、能构建、能测试；核心 demo 不再有确认的运行时错误。

| ID | 任务 | 产出/验收 |
| --- | --- | --- |
| P0-1 | 分支与依赖治理：冻结 `master`，以 `develop` 为集成分支；移除 `rollup-plugin-uglify`，升级 Vite/Rollup/TS 插件到互相兼容的版本；提交锁文件 | `npm ci` 一次成功；`git status` 干净 |
| P0-2 | 构建收敛：只保留一套库构建，产出 `dist/litegui.esm.js`、`dist/litegui.umd.cjs`、`dist/litegui.css`、`dist/types/*.d.ts`；修正 `main`/`module`/`exports`/`files`/`sideEffects` | `npm pack` 后在临时项目里 `import` 成功；CSS 可单独引入 |
| P0-3 | 类型门禁：对 `Inspector`/`Tree`/`ContextMenu` 先用 `// @ts-nocheck` 止血（登记 issue），修复其余 35 个错误 | `tsc --noEmit` 0 错误；ts-nocheck 文件不超过 3 个且有移除计划 |
| P0-4 | 事件核心：`EventMitter` 改为每个实例独立；补 `off/once`；删除全局 `mitt` 或改为显式注入 | 两个实例互不串事件；单元测试通过 |
| P0-5 | 运行时回归：修 `Dialog`（show/挂载、buttons、INSTANCE_LIST、close、modal）、`Button`（emit click）、`Checkbox`/`Dragger`（initDom/initEvent）、`Table`（字符串列、options 默认值）、`LiteGUI.bind/createMenu` | 5 个核心组件的 smoke test 通过；demo/editor 无控制台异常 |
| P0-6 | 测试与 CI：Vitest + jsdom；至少覆盖 EventMitter、Button、Dialog、Table、Tabs；GitHub Actions 执行 install/typecheck/test/build/pack | PR 上四项检查全绿 |
| P0-7 | 合规与文档：添加 MIT LICENSE（保留 Javi Agenjo 版权声明）；README 加“开发中/可用组件”状态表 | LICENSE 出现在 npm 包中；README 不再误导 |

**Phase 0 退出标准**

- 新克隆执行 `npm ci && npm run build && npm test` 全绿。
- `npm pack` 产物可安装、可 import、可用样式。
- `demo/` 与 `editor/` 能加载，核心路径无报错。
- 已知问题列表（GitHub Issues）建立，P0 问题清零。

### Phase 1（第 2–4 周）：核心可用，发布 v0.1.0

**目标**：核心 12 个组件达到“可演示、可测试、可文档化”的状态。

| ID | 任务 | 产出/验收 |
| --- | --- | --- |
| P1-1 | 拆出 `src/core/`：`dom.ts`、`events.ts`、`component.ts`、`registry.ts`；组件不再 import 入口 | 循环依赖为 0；单组件可独立测试 |
| P1-2 | 统一组件基类/生命周期：`root`、`mount`、`destroy`、`on/off/emit`、`setEnabled` | 核心组件全部迁移，旧 API 有兼容层 |
| P1-3 | Dialog/窗口管理器重写：z-index 栈、模态遮罩、焦点陷阱、ESC、拖拽/缩放、最小化/最大化 | 交互测试覆盖；键盘可关闭；无焦点逃逸 |
| P1-4 | 组件验收矩阵：Area/Panel/Split/Tabs/Dialog/Menu/Button/Checkbox/Slider/SearchBox/List/Table/Console 逐个过 | 每个组件有 demo + 单元测试 + 已知限制 |
| P1-5 | 大组件决策：`Inspector`/`Tree`/`ContextMenu` 标记 experimental 并从核心入口的稳定性承诺中排除；或投入 1 周完成类型与 smoke test | 在 README/文档中明确标注 |
| P1-6 | 文档最小集：Getting Started、安装/引入、5 个示例（布局、窗口、表单、表格、菜单）、从 litegui.js 迁移说明 | 新用户 10 分钟内能跑起一个页面 |
| P1-7 | 发布 0.1.0：CHANGELOG、git tag、npm publish（或先 dry-run） | `npm view litegui` 可见；示例项目安装成功 |

**Phase 1 退出标准**

- 核心组件 P0/P1 bug 为 0；测试覆盖率核心模块 ≥ 60%（核心基础模块 ≥ 80%）。
- 核心组件（不含 Inspector/Tree）ESM gzip ≤ 35 KB；CSS ≤ 10 KB。
- v0.1.0 tag + release notes；README 状态表与真实情况一致。

### Phase 2（第 5–8 周）：工程化与体验，发布 v0.2.0

**目标**：从“能用”到“好集成、好定制、好维护”。

| ID | 任务 | 产出/验收 |
| --- | --- | --- |
| P2-1 | 主题系统：CSS 变量/design tokens、亮/暗主题、`lg-` 前缀、组件样式隔离，移除对 `body` 的全局改写 | 同一页面可并存两套主题；宿主 CSS 不冲突 |
| P2-2 | 可访问性：ARIA role、键盘导航、焦点可见、对比度；axe-core 集成 | axe 0 critical/serious；Tab/Enter/Esc 全链路可用 |
| P2-3 | 按组件导出：`litegui/button`、`litegui/dialog` 等子路径；完善 `sideEffects`；tree-shaking 验证 | 只引入 Button 时，包体显著小于全量 |
| P2-4 | 文档站：VitePress（依赖已在 devDependencies）+ 在线 playground + API 自动生成；部署 GitHub Pages | 文档站可访问；每个导出 API 有说明和示例 |
| P2-5 | 视觉与浏览器回归：Playwright 截图对比；Chrome/Edge/Firefox/Safari 冒烟 | 主题/布局改动有截图 diff |
| P2-6 | 真实示例：工具台布局、Inspector 表单、数据表格三个完整示例 | 示例代码可复制运行 |
| P2-7 | 发布 0.2.0：迁移指南、弃用清单、性能基线 | 0.1 → 0.2 升级有明确步骤 |

**Phase 2 退出标准**

- 文档站上线；100% 导出 API 有文档。
- a11y 无 critical/serious；核心浏览器矩阵通过。
- 核心包体达标；按组件引入可用。

### Phase 3（第 9–12 周）：稳定与 1.0

**目标**：API 冻结、性能/安全达标、可长期维护。

| ID | 任务 | 产出/验收 |
| --- | --- | --- |
| P3-1 | API freeze：RC 版本、SemVer 策略、弃用周期；1.0 后 breaking change 走 major | API review 记录；无未决命名冲突 |
| P3-2 | 性能：1k 行 Table、1k 节点 Tree 的渲染/更新基准；内存泄漏检查（mount/destroy 循环） | 基准数据入库；无持续增长 |
| P3-3 | 安全：用户内容默认转义；`innerHTML` 白名单/显式 opt-in；依赖审计 | `npm audit` 无 high/critical；XSS 测试用例通过 |
| P3-4 | 发布自动化：Changesets/Release Please、npm provenance、GitHub Release、CDN 产物 | 打 tag 即自动发布 |
| P3-5 | 1.0.0：完整文档、迁移指南、示例库、支持矩阵、贡献指南 | `npm install litegui@1` 可用；release notes 完整 |

**Phase 3 退出标准**

- 0 个 P0/P1 已知问题；核心测试覆盖率 ≥ 70%。
- 浏览器矩阵、性能基准、a11y、安全审计全部通过。
- 1.0.0 发布，文档与代码一致。

### 4.1 1.0 之后（Backlog，不排期）

- 新组件：Toolbar、StatusBar、Tooltip、Popover、Select/Combobox、DatePicker、ColorPicker、Toast、DockLayout、VirtualTable/VirtualTree。
- `editor/` 从手工示例升级为真正的可视化编辑器 showcase。
- 框架 wrapper（React/Vue）——只在有明确需求时做。
- i18n/RTL、SSR 安全、Web Components 封装。
- 设计 token 包/图标包。

---

## 5. 验收指标

| 维度 | 指标 | 目标 |
| --- | --- | --- |
| 构建 | 新克隆 `npm ci && npm run build` | 0 错误，≤ 3 分钟 |
| 类型 | `tsc --noEmit` | 0 错误（ts-nocheck 文件有清单和移除期限） |
| 测试 | 核心模块行覆盖率 | ≥ 60%（基础模块 ≥ 80%） |
| 体积 | 核心组件（不含 Inspector/Tree）ESM gzip | ≤ 35 KB |
| 样式 | 核心 CSS gzip | ≤ 10 KB |
| 运行时 | P0/P1 已知问题 | 0 |
| 可访问性 | axe critical/serious | 0 |
| 文档 | 导出 API 覆盖率 | 100% |
| 发布 | `npm pack` + 临时项目安装 | 每次 PR 验证 |
| 兼容 | 浏览器 | Chrome/Edge/Firefox/Safari 最近两个大版本 |

---

## 6. 未来 7 天任务清单

- [x] 确认分支策略：`master` 冻结，`develop` 作为集成分支；为当前工作开 PR。
- [x] 修复 `npm install`：移除 `rollup-plugin-uglify`，升级构建链，提交锁文件。
- [x] 统一库构建与 `package.json` 出口；`npm pack` 冒烟。
- [x] 对 `Inspector`/`Tree`/`ContextMenu` 加临时 `@ts-nocheck`，修完其余类型错误，`tsc` 归零。
- [x] 重写 `EventMitter` 为实例级事件总线，补测试。
- [x] 修 `Dialog` 的 show/挂载、按钮、`INSTANCE_LIST`、close/modal。
- [x] 修 `Button` 的 click 事件、`Checkbox`/`Dragger` 的初始化、`Table` 的字符串列。
- [x] 修 `LiteGUI.bind`、`createMenu`、`showMessage/popup` 的依赖链。
- [x] 加 MIT LICENSE（保留上游版权）与 README 状态表。
- [x] 建 Vitest + jsdom + GitHub Actions 最小流水线。

---

## 7. 需要确认的决策

1. **提交历史**：已确认；`origin/develop` 指向 amend 后的 `6953f3d`，后续基线转绿前冻结历史改写。
2. **默认分支**：已确认；`master` 保持默认分支，`develop` 作为开发分支，阶段完成后合并到 `master`。
3. **包名/发布**：已确认使用 `litegui`（registry 当前未占用）；是否发布公共 npm 在 0.1.0 前决定。
4. **兼容性**：是否必须兼容上游 litegui.js 的旧签名/全局 `LiteGUI` 用法？兼容一个 minor 还是长期保留？
5. **大组件归属**：`Inspector`/`Tree`/`ContextMenu` 是 v0.1 必须可用，还是允许 experimental 到 0.2？（已决：组件统一留在 `@gausszhou/litegui`，只标记 experimental）
6. **浏览器基线**：只支持现代浏览器（推荐），还是需要兼容旧版/IE？
7. **投入节奏**：12 周是目标还是上限？是否有其他人可以分担测试/文档？

---

## 8. 风险与应对

| 风险 | 触发信号 | 应对 |
| --- | --- | --- |
| 历史改写导致协作冲突 | 协作者未重新同步、远程/本地再次分叉 | 已改写的历史通知协作者重新拉取；基线转绿前冻结再次改写 |
| 范围蔓延 | 又在加新组件 | v0.1 范围冻结；新组件进 backlog |
| 旧代码迁移成本失控 | Inspector/Tree 类型错误长期不降 | 先 ts-nocheck 止血；按“声明合并”或“重写为 class 方法”两条路评估，设 1 周上限 |
| 全局样式破坏宿主 | 用户反馈样式冲突 | `lg-` 前缀 + CSS 变量 + 作用域；1.0 前完成 |
| 包体反弹 | gzip 超预算 | 按组件入口 + 构建体积门禁 |
| 无测试导致再次回归 | 修 A 坏 B | 每个 P0 修复必须带测试；CI 拦截 |
| 单人维护中断 | issue/PR 积压 | 文档化架构决策；CI 自动化；控制范围 |
| 许可证问题 | npm 发布被质疑 | Phase 0 补 MIT + 上游版权声明 |

---

## 9. 一句话路线图

> **第 1 周把灯点亮（构建/类型/核心回归/CI），第 2–4 周把核心 12 个组件做扎实并发布 0.1，第 5–8 周做主题/可访问性/文档并发布 0.2，第 9–12 周冻结 API、补齐性能与安全，发布 1.0。**
