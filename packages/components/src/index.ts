import { LiteGUI } from "./litegui";
import { Inspector } from "./components/Inspector";
import { Tree } from "./components/Tree";

// Inspector/Tree 通过 LiteGUI 命名空间取 sizeToCSS、trigger、Dragger 等静态成员，
// 因此在这里挂载，而不是在 litegui.ts 里 import 组件（那会形成循环依赖，
// 在 ESM chunk 中触发 “Cannot access before initialization”）。
LiteGUI.Inspector = Inspector;
LiteGUI.Tree = Tree;

export { LiteGUI };

// 命名导出便于 `import LiteGUI, { Table } from "@gausszhou/litegui-components"`；
// 按组件子路径（`@gausszhou/litegui-components/table`）仍然可用，适合只要单个组件的场景。
export { Area } from "./components/Area";
export { LiteBox } from "./components/Box";
export { Button } from "./components/Button";
export type { ButtonOptions } from "./components/Button";
export { Checkbox } from "./components/Checkbox";
export { ComplexList } from "./components/ComplexList";
export { Console } from "./components/Console";
export { ContextMenu } from "./components/ContextMenu";
export { Dialog } from "./components/Dialog";
export { Dragger } from "./components/Dragger";
export { Inspector } from "./components/Inspector";
export { LineEditor } from "./components/LineEditor";
export { List } from "./components/List";
export { Menu } from "./components/Menu";
export { Panel } from "./components/Panel";
export { SearchBox } from "./components/SearchBox";
export { Slider } from "./components/Slider";
export { Split } from "./components/Split";
export { Table } from "./components/Table";
export type { TableColumn, TableColumnOption, TableOptions } from "./components/Table";
export { Tabs } from "./components/Tabs";
export { Tree } from "./components/Tree";

export default LiteGUI;
