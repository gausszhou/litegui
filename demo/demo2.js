import LiteGUI from "../src/index"
//call the init to setup 
LiteGUI.init();

//create a main container and split it in two
var mainarea = new LiteGUI.Area("mainarea", { content_id: "canvasarea", autoresize: true, inmediateResize: true });
mainarea.split("horizontal", [200, null], true);
LiteGUI.add(mainarea);

//create a left panel
var side_panel = new LiteGUI.Panel("sidepanel", { title: "Inspector", width: 200 });
mainarea.getSection(0).add(side_panel);

//create a inspector (widget container)
var widgets = new LiteGUI.Inspector();
widgets.addTitle("Dialogs");
widgets.addButton("Alert", "Show", function () { LiteGUI.alert("foo"); });
widgets.addButton("Prompt", "Show", function () { LiteGUI.prompt("What are you?", function (v) { if (v) LiteGUI.alert(v); }); });
widgets.addButton("Confirm", "Show", function () { LiteGUI.confirm("Are you sure?"); });
widgets.addButton("Dialog", "Show", function () {
  var dialog = new LiteGUI.Dialog("simple-dialog", { title: "My dialog", content: "<p>Boring content</p>", close: true, resizable: true, draggable: true });
  dialog.show();
  dialog.center();
});
widgets.addSeparator();
side_panel.add(widgets);

//create right panel
var main_panel = new LiteGUI.Panel("mainpanel");
mainarea.getSection(1).add(main_panel);


//create some tabs
var tabs = new LiteGUI.Tabs("tabs", { size: "full" });
var code_tab = tabs.addTab("Code", { size: "full" });

//show the code applying the most basic code beautify algorithm (by me!)
var code = escapeHtmlEntities(document.querySelector("body script").innerHTML);
code = beautifyCode(code);

code_tab.content.innerHTML = "<h2>Code of this example</h2><pre>" + code + "</pre>";
tabs.addTab("Image", { content: "<img src='http://www.w3.org/html/logo/downloads/HTML5_Badge_512.png'/>" });

widgets.addButton(null, "Detach Code tab", function () { tabs.detachTab("Code"); });

main_panel.add(tabs);