import LiteGUI from "../src/index"
//call the init to setup 
LiteGUI.init();
var sidebar = new LiteGUI.Inspector();
sidebar.addString("Name", "now");
sidebar.addButton(null, "Send", function () {
  LiteGUI.alert("foo");
});
sidebar.appendTo("#sidebar");