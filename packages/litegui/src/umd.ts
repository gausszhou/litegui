// UMD 专用入口：只保留默认导出，保证 `window.LiteGUI` 仍是可直接使用的类，
// 与 1.0 的 `<script src="litegui.umd.cjs">` 用法兼容。
import LiteGUI from "./index";

export default LiteGUI;
