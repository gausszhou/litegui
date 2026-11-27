import tokensCss from "./styles/generated/tokens.css?raw";
import "./index";

export * from "./index";

// <script> 直接引入时把主题变量注入文档，省去额外的 tokens.css
if (typeof document !== "undefined" && !document.getElementById("litegui-elements-tokens")) {
  const style = document.createElement("style");
  style.id = "litegui-elements-tokens";
  style.textContent = tokensCss;
  document.head.appendChild(style);
}
