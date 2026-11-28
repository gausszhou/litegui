# 示例

在线示例：

- [LiteGUI VS Code](https://gausszhou.github.io/litegui/vscode/)
- [Blender Workbench](https://gausszhou.github.io/litegui/blender/)
- [Photocraft](https://gausszhou.github.io/litegui/photocraft/)
- [VectorCraft](https://gausszhou.github.io/litegui/vectorcraft/)：Illustrator 风格矢量设计工作台
- [LightCraft](https://gausszhou.github.io/litegui/lightcraft/)：照片图库与非破坏性显影工作台（参考 [ArtCraft LightCraft](https://getartcraft.com/apps/lightcraft)）

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
import { Inspector } from "@gausszhou/litegui-components";

const inspector = new Inspector();
inspector.addString("name", "Untitled");
inspector.addNumber("width", 100, { min: 0 });
inspector.addSlider("opacity", 0.5, { min: 0, max: 1 });
panel.add(inspector);
```

> `Inspector` 与 `Tree` 直接来自主包 `@gausszhou/litegui-components`，API 仍为 experimental。

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
