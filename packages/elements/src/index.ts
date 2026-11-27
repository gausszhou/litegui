import { defineElements } from "./define";

export * from "./define";
export * from "./elements/button";
export * from "./elements/checkbox";
export * from "./elements/panel";
export * from "./elements/dialog";

// 自动注册；SSR/Node 下 customElements 不存在，跳过。
if (typeof customElements !== "undefined") {
  defineElements();
}
