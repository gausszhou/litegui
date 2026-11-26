# 示例

## 1. 工具台布局

```ts
LiteGUI.init({ container: "#app", menubar: true });

const area = new LiteGUI.Area({ id: "workbench", height: "100%" });
LiteGUI.add(area);
area.split("horizontal", [null, 320], true);

const left = area.getSection(0);
left.split("vertical", [null, 160], true);

new LiteGUI.Panel({ title: "Viewport", content: "<canvas></canvas>" });
new LiteGUI.Panel({ title: "Console" });
```

## 2. 属性面板

```ts
const inspector = new LiteGUI.Inspector();
inspector.addString("name", "Untitled");
inspector.addNumber("width", 100, { min: 0 });
inspector.addSlider("opacity", 0.5, { min: 0, max: 1 });
panel.add(inspector);
```

> `Inspector` 目前标记为 experimental，API 可能在 0.2 前调整。

## 3. 数据表格

```ts
const table = new LiteGUI.Table({
  columns: ["Name", "Age", "Address"],
  rows: [
    { name: "Alice", age: 30, address: "X" },
    { name: "Bob", age: 42, address: "Y" }
  ],
  scrollable: true
});
dialog.add(table);
```

## 4. 标签页

```ts
const tabs = new LiteGUI.Tabs();
tabs.addTab("info", { title: "Info", content: "Details" });
tabs.addTab("tree", { title: "Tree", content: "Tree content" });
tabs.appendTo(panel.content);
tabs.selectTab("tree");
```

## 5. 右键菜单

```ts
const menu = new LiteGUI.ContextMenu(
  [
    { title: "Rename", callback: () => console.log("rename") },
    { title: "Delete", callback: () => console.log("delete") }
  ],
  { event: new MouseEvent("contextmenu", { clientX: 100, clientY: 100 }) }
);
document.body.appendChild(menu.root);
```

> `ContextMenu` 目前标记为 experimental。
