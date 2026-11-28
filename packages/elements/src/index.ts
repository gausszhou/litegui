import { defineElements } from "./define";

export * from "./define";
export * from "./elements/area";
export * from "./elements/box";
export * from "./elements/button";
export * from "./elements/checkbox";
export * from "./elements/complex-list";
export * from "./elements/console";
export * from "./elements/context-menu";
export * from "./elements/dialog";
export * from "./elements/dragger";
export * from "./elements/header-bar";
export * from "./elements/image-editor";
export * from "./elements/inspector";
export * from "./elements/line-editor";
export * from "./elements/list";
export * from "./elements/menu";
export * from "./elements/node-editor";
export * from "./elements/panel";
export * from "./elements/searchbox";
export * from "./elements/slider";
export * from "./elements/split";
export * from "./elements/status-bar";
export * from "./elements/table";
export * from "./elements/tabs";
export * from "./elements/text-editor";
export * from "./elements/timeline";
export * from "./elements/toolbar";
export * from "./elements/tree";
export * from "./elements/viewport";

// 自动注册；SSR/Node 下 customElements 不存在，跳过。
if (typeof customElements !== "undefined") {
  defineElements();
}
