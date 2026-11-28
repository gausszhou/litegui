# Getting Started

LiteGUI 是一个无框架的 DOM UI 组件库。它不依赖 React/Vue，适合编辑器、调试器、内部工具等桌面式界面。仓库是 pnpm monorepo：`packages/*` 是可发布的库，`apps/*` 是示例页面。

## 环境

- Node.js ≥ 20
- pnpm（品牌版本见根 `package.json` 的 `packageManager`）

> 当前 1.0.1 尚未发布到 npm registry；以下为仓库内开发方式。发布后安装命令为
> `pnpm add @gausszhou/litegui-components`。

```bash
pnpm install

pnpm dev          # 最小示例 http://127.0.0.1:5173/
```

## 初始化

```ts
import LiteGUI from "@gausszhou/litegui-components";
import "@gausszhou/litegui-components/style.css";

LiteGUI.init({
  container: "#app",
  menubar: true
});
```

`container` 可以是 CSS 选择器或元素 id。未传时使用 `document.body`。

## 布局

```ts
const area = new LiteGUI.Area({
  id: "main",
  width: "100%",
  height: "calc(100% - 24px)"
});

LiteGUI.add(area);
area.split("horizontal", [240, null], true);
```

`Area.split()` 的尺寸规则：

- 数字：负值表示 `calc(100% - Npx)`；
- `null`：自动填充剩余空间；
- 字符串：直接作为 CSS 尺寸。

## 对话框

```ts
const dialog = new LiteGUI.Dialog({
  title: "Settings",
  width: 360,
  height: 240,
  close: true,
  draggable: true,
  resizable: true
});

dialog.add(new LiteGUI.Panel({ content: "Hello" }));
dialog.addButtonToFooter("OK", { name: "OK", close: true });
dialog.show();
```

模态对话框使用 `dialog.makeModal()`。

## 表格

```ts
const table = new LiteGUI.Table({ scrollable: true });
table.setColumns(["Name", { name: "Age", width: 60 }]);
table.setRows([
  { name: "Alice", age: 30 },
  { name: "Bob", age: 42 }
]);
```

字符串列会按列名小写映射对象字段；需要自定义字段时使用 `{ name, field }`。

## 菜单

```ts
const menu = new LiteGUI.Menu("main-menu");
menu.add("File/New", { callback: () => console.log("new") });
menu.add("File/Open", { callback: () => console.log("open") });
LiteGUI.add(menu);
```

## 主题

```ts
LiteGUI.setTheme("light");
LiteGUI.getTheme(); // "light"
```

也可以在初始化时传入：

```ts
LiteGUI.init({ container: "#app", theme: "light" });
```

主题通过 `<html data-lg-theme="...">` 与 CSS 变量实现，可在 `@gausszhou/litegui-components/style.css` 之后覆盖 `--lg-color-*` 变量。

## 按组件引入

```ts
import { Button } from "@gausszhou/litegui-components/button";
import { Table } from "@gausszhou/litegui-components/table";

import "@gausszhou/litegui-components/style.css";
```

也可以从主入口按命名导出取组件：

```ts
import LiteGUI, { Button, Table } from "@gausszhou/litegui-components";
```

可用子路径：`area`、`panel`、`split`、`tabs`、`dialog`、`menu`、`button`、`checkbox`、`slider`、`searchbox`、`list`、`table`、`console`。

## 构建与测试

```bash
pnpm build           # 拓扑序构建 packages/* 与 apps/*
pnpm typecheck       # 各包 tsc --noEmit
pnpm lint            # ESLint flat config
pnpm test            # Vitest + jsdom
pnpm test:coverage   # 覆盖率与门槛
pnpm test:e2e        # Playwright（Chrome + Firefox）
pnpm size            # 各产物体积（raw / gzip）
pnpm verify-pack     # 校验发布会话中的 tarball 内容
pnpm docs:dev        # 文档站
```

库产物在各包的 `dist/`，示例页面在根目录 `dist/vscode`、`dist/blender`、`dist/photocraft`、`dist/gridcraft`、`dist/vectorcraft`、`dist/lightcraft`、`dist/filmcraft` 与 `dist/cadcraft`。
