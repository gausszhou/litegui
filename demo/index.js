// import LiteGUI from "../src/index"
import LiteGUI from "../lib/bundle.esm";

let mainarea = null;
let bottomPanel = null;
let rightPanel = null;

window.onload = function () {
  LiteGUI.init();
  // createMenu();

  mainarea = new LiteGUI.Area({
    id: "mainarea",
    main: true,
    content_id: "canvasarea",
    height: "calc( 100% - 30px )",
    inmediateResize: true
  });

  LiteGUI.add(mainarea);
};
