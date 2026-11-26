# Getting Started

LiteGUI 是一个无框架的 DOM UI 组件库。它不依赖 React/Vue，适合编辑器、调试器、内部工具等桌面式界面。

## 安装

```bash
npm install litegui
```

或者直接使用仓库源码：

```bash
npm install
npm run dev
```

## 初始化

```ts
import LiteGUI from "litegui";
import "litegui/style.css";

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

在引入 `litegui/style.css` 之前覆盖 CSS 变量或选择器即可。当前版本仍是全局样式，`lg-` 前缀与主题变量在 Phase 2 完成。

## 构建与测试

```bash
npm run typecheck
npm test
npm run build
```

`npm run build` 会同时生成库产物（`lib/`）和示例页面（`dist/`）。
