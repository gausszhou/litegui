/**
 * LiteGUI core：与具体组件无关的基础设施。
 *
 * 组件包（`@gausszhou/litegui`、`@gausszhou/litegui-experimental`）都从这里取
 * DOM 工具、事件总线、全局状态与 Widget 基类，保证全仓库只有一份 core 实例。
 */
export * from "./dom";
export * from "./events";
export * from "./state";
export * from "./deprecated";
export * from "./utils";

export { default as EventMitter } from "./EventMitter";
export { Widget } from "./Widget";
export type { LiteComponent } from "./component";
