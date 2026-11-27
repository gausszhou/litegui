import { LiteGUI } from "./litegui";

export { LiteGUI };

// 命名导出便于 `import LiteGUI, { Table } from "@gausszhou/litegui"`；
// 按组件子路径（`@gausszhou/litegui/table`）仍然可用，适合只要单个组件的场景。
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

export default LiteGUI;
