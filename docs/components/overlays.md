---
title: 浮层
description: Dialog、Menu 与 ContextMenu
---

# 浮层

## Dialog

```ts
const dialog = new LiteGUI.Dialog({
  title: "Settings",
  width: 420,
  height: 280,
  close: true,
  draggable: true,
  resizable: true
});

dialog.add(new LiteGUI.Panel({ content: "Content" }));
dialog.addButtonToFooter("OK", { name: "OK", close: true });
dialog.show();
```

模态对话框：

```ts
dialog.makeModal();
```

`Dialog` 支持 `show/hide/close`、`minimize/maximize`、`setSize`、`setPosition`、`center`、`fadeIn`。

## Menu

```ts
const menu = new LiteGUI.Menu("main-menu");
menu.add("File/New", { callback: () => console.log("new") });
menu.add("File/Open", { callback: () => console.log("open") });
menu.add("File/");
LiteGUI.add(menu);
```

`LiteGUI.createMenu()` 会创建 id 为 `mainmenubar` 的默认菜单栏。

## ContextMenu

```ts
const menu = new LiteGUI.ContextMenu(
  [
    { title: "Rename", callback: () => console.log("rename") },
    { title: "Delete", disabled: false, callback: () => console.log("delete") }
  ],
  { left: 100, top: 100 }
);
```

ContextMenu 已移除 `@ts-nocheck`，但仍属于实验性 API。
