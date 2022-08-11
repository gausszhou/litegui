import "./styles/inspector.css";
import "./styles/layout.css";
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/widgets.css";

import LiteGUI from "./core";
import Dialog from "./Dialog";
import Menu from "./Menu";

export {
  Menu,
  Dialog
}

(function(global) {
  global.LiteGUI = LiteGUI
  console.log(global)
})(window as any);

export default LiteGUI;
