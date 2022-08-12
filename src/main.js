// import LiteGUI from "./index"
import LiteGUI from "../lib/bundle.esm"

let mainarea = null;
let bottomPanel = null;
let rightPanel = null;

window.onload = function () {

  LiteGUI.init();
  createMenu()

  mainarea = new LiteGUI.Area({ id: "mainarea", content_id: "canvasarea", height: "calc( 100% - 30px )", main: true, inmediateResize: true });
  LiteGUI.add(mainarea);

  //create main canvas to test redraw
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = 100;
  canvas.times = 0 ;
  canvas.redraw = function () {
    const rect = canvas.parentNode.getClientRects()[0];
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#AAF";
    ctx.font = "16px arial"
    ctx.strokeRect(10.5, 10.5, this.width - 20, this.height - 20);
    ctx.strokeText("Redraw times: " + this.times, 20.5, 30.5);
    this.times += 1;
  }

  mainarea.content.appendChild(canvas);

  //split mainarea
  mainarea.split("horizontal", [null, 340], true);
  
  rightPanel = createSidePanel();
  // split left area
  mainarea.getSection(0).split("vertical", [null, "100px"], true);
  bottomPanel =  createBottomPanel()

  createWidgetsDialog();
  createTableDialog();
  createComplexListDialog();

  // linstener size change

  canvas.redraw();
  mainarea.onresize = function () { canvas.redraw(); };
  mainarea.getSection(0).onresize = () => canvas.redraw();
  mainarea.getSection(0).getSection(1).onresize = () => canvas.redraw();
  window.onresize = () => canvas.redraw()
};


function createMenu(){
  
  const mainmenu = new LiteGUI.Menu("MainMenu");

  LiteGUI.add(mainmenu);
  mainmenu.add("File/New");
  mainmenu.add("File/Open...");
  mainmenu.add("File/Open_Recent");
  mainmenu.add("File/Revert");
  mainmenu.add("File/Recover");
  mainmenu.add("File/Recover/Last Session");
  mainmenu.add("File/Recover/Auto Save");
  mainmenu.add("File/");

  mainmenu.add("File/Save");
  mainmenu.add("File/Save As...");
  mainmenu.add("File/Save Copy");
  mainmenu.add("File/");

  mainmenu.add("File/Link...");
  mainmenu.add("File/Append...");
  mainmenu.add("File/Data Previews");
  mainmenu.add("File/Data Previews/Refresh Data-Block Previews");
  mainmenu.add("File/Data Previews/Batch-Generate Previews");
  mainmenu.add("File/Data Previews/");
  mainmenu.add("File/Data Previews/Clear Data-Block Previews");
  mainmenu.add("File/Data Previews/Batch-Clear Previews");
  mainmenu.add("File/");

  mainmenu.add("File/Import");
  mainmenu.add("File/Export");
  mainmenu.add("File/");

  mainmenu.add("File/External Data");
  mainmenu.add("File/Clean Up");
  mainmenu.add("File/");

  mainmenu.add("File/Defaults");
  mainmenu.add("File/");

  mainmenu.add("File/Quit");


  mainmenu.add("Edit/Undo");
  mainmenu.add("Edit/Redo");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Undo History...");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Repeat Last");
  mainmenu.add("Edit/Repeat History...");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Adjust Last Operation");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Copy", { callback: function () { console.log("Copy"); } });
  mainmenu.add("Edit/Paste", { callback: function () { console.log("Paste"); } });
  mainmenu.add("Edit/Clear", { callback: function () { console.log("Clear"); } });


  mainmenu.add("View/Fixed size", { callback: function () { LiteGUI.setWindowSize(1000, 600); } });
  mainmenu.add("View/Maximize", { callback: function () { LiteGUI.setWindowSize(); } });
  mainmenu.add("View/");
  mainmenu.add("View/Bottom panel", { callback: function () {  } });
  mainmenu.add("View/Side panel", { callback: function () {  } });

  mainmenu.add("Debug/Dialog", { callback: function () { createWidgetsDialog(); } });

  mainmenu.add("Debug/Message", {
    callback: function () {
      LiteGUI.showMessage("This is an example of message");
    }
  });

  mainmenu.add("Debug/Modal", {
    callback: function () {
      var dialog = new LiteGUI.Dialog("blarg", { width: 300, height: 100, close: true, content: "This is an example of modal dialog" });
      dialog.makeModal();
      dialog.addButton("Accept", { close: true });
      dialog.addButton("Cancel", { close: 'fade' });
    }
  });
}
function createSidePanel() {
  const panel = new LiteGUI.Panel("right-panel", { title: 'Docked Right Panel', close: true });
  mainarea.getSection(1).add(panel);
  LiteGUI.bind(panel, "closed", function () { mainarea.merge(); });
  updateSidePanel(panel);
  return panel
}

function createBottomPanel(){
  var panel = new LiteGUI.Panel({ id: "bottom-panel", title: "Docked Bottom Panel", hide: false });
  mainarea.getSection(0).getSection(1).add(panel);
  LiteGUI.bind(panel, "closed", function () { LiteGUI.mainarea.getSection(0).merge() });
  return panel
}

function updateSidePanel(root) {
  root = root || window.sidepanel;
  root.content.innerHTML = "";

  //tabs 
  
  var tabs_widget = new LiteGUI.Tabs();
  tabs_widget.addTab("Info");
  tabs_widget.addTab("Tree", { selected: true, width: "100%", height: 200 });
  tabs_widget.addTab("Extra");

  tabs_widget.getTabContent("Info").appendChild(LiteGUI.createElement("strong", null, "Example of code inside tab container"));

  //tree
  var mytree = {
    id: "Rootnode",
    children: [
      { id: "Child1" },
      {
        id: "Child2", children: [
          { id: "SubChild1" },
          { id: "SubChild2" },
          { id: "SubChild3" },
          { id: "SubChild4" }
        ]
      },
      { id: "Child3" },
    ]
  };

  const litetree = new LiteGUI.Tree(mytree, { allow_rename: true });
  LiteGUI.bind(litetree.root, "item_selected", function (e) {
    console.log("Node selected: ", e.detail);
  });
  const tree_tab_content = tabs_widget.getTabContent("Tree");
  tree_tab_content.appendChild(litetree.root)

  litetree.insertItem({ id: "FOO" }, "Child2", 2);

  litetree.insertItem({ id: "MAX" }, "Child1");
  root.add(tabs_widget);

  //side panel widget
  const widgets = new LiteGUI.Inspector();
  widgets.onchange = function (name, value, widget) {
    console.log("Widget change: " + name + " -> " + value);
  };
  
  root.content.appendChild(widgets.root);
  widgets.addSection("Number Stuff");
  widgets.addSlider("Slider", 20, { min: 1, max: 100, step: 1 });

  widgets.addVector2("Vector2", [10, 20], { min: 0 });
  widgets.addVector3("Vector3", [10, 20, 30], { min: 0 });
  widgets.addVector4("Vector4", [0.1, 0.2, 0.3, 0.4], { min: 0 });
  widgets.addSection("Text Stuff");
  widgets.addString("String", "foo");
  widgets.addStringButton("String Button", "foo", { callback: function (v) { console.log("Button: " + v); } });
  widgets.addTextarea(null, "a really long silly text", { height: 100 });
  widgets.addCombo("Combo", "javi", { values: ["foo", "faa", "super largo texto que no cabe entero", "javi", "nada"], callback: function (name) { console.log("Combo selected: " + name); } });
  widgets.addComboButtons("Combobtns", "javi", { values: ["foo", "faa", "javi", "nada"], callback: function (name) { console.log("Combo button selected: " + name); } });
  widgets.addTags("Tags", "pop", { values: ["rap", "blues", "pop", "jazz"], callback: function (tags) { console.log("Tag added: " + JSON.stringify(tags)); } });
  widgets.addSection("Other widgets");
  widgets.addCheckbox("Checkbox", true, { callback: function (value) { console.log("Checkbox pressed: " + value); } });
  widgets.addButton("Serialize", "Save", { callback: function (name) { console.log("Button pressed: " + name); } });
  widgets.addButtons("Serialize", ["Save", "Load", "New"], { callback: function (name) { console.log("Button pressed: " + name); } });
  widgets.addButton(null, "Save");
  widgets.addSeparator();
  widgets.addColor("Color", [0, 1, 0]);
  widgets.addPad("Pad", [0.5, 0.5], function (v) { console.log(v); });
  widgets.addFile("File", "test.png");
  widgets.addLine("Line", [[0.5, 1], [0.75, 0.25]], { defaulty: 0, width: 120 });

  //mainarea.resize();
}







function createTableDialog() {
  var dialog = new LiteGUI.Dialog({ title: "Table dialog", close: true, minimize: true, width: 300, scroll: true, resizable: true, draggable: true });
  dialog.show();
  dialog.setPosition(100, 200);
  dialog.addButton("Randomize", inner);

  dialog.show()
  const table = new LiteGUI.Table({ scrollable: true });
  dialog.add(table);

  table.setColumns(["Name", { name: "Age", width: 50 }, "Address"]);

  const data = [];

  for (var i = 0; i < 10; ++i){
    data.push({
      name: randomName(),
      age: 30,
      address: "none"
    });
  }
    
  inner();
  function inner() {
    for (var i in data){
      data[i].age = (Math.random() * 100) | 0;
    }
    table.setRows(data, true);
  }
}

function createComplexListDialog() {
  const dialog = new LiteGUI.Dialog({ title: "Complex List", close: true, minimize: true, width: 300, height: 400, scroll: true, resizable: true, draggable: true });
  dialog.show();
  dialog.setPosition(450, 200);

  const list = new LiteGUI.ComplexList({ height: "100%" });
  dialog.add(list);

  list.addTitle("Example of title");
  for (var i = 0; i < 10; ++i)
    list.addItem({}, "Example", Math.random() > 0.5, true);
  list.addTitle("Example of title");
  for (var i = 0; i < 10; ++i)
    list.addItem({}, "More items", Math.random() > 0.5, true);
  list.addHTML("+ click me");

  return dialog;
}

function createWidgetsDialog() {
  //test floating panel
  var name = "Dialog_" + ((Math.random() * 100) >> 0);
  var dialog = new LiteGUI.Dialog({ id: name, title: name, close: true, minimize: true, width: 300, scroll: true, resizable: true, draggable: true, detachable: true });
  dialog.show('fade');
  dialog.setPosition(800, 200);

  //test menu in panel
  var minimenu = new LiteGUI.Menu("minimenu");
  minimenu.add("File/New");
  minimenu.add("File/Open...");
  minimenu.add("File/Save");
  minimenu.add("File/Save As");
  minimenu.add("Center", { callback: function () { dialog.center() } });
  minimenu.attachToPanel(dialog);

  var widgets = new LiteGUI.Inspector();
  widgets.addButton("button", "Update", { callback: function () { updateSidePanel(); } });
  widgets.addString("string", "foo");
  widgets.addNumber("number", 10, { min: 0 });
  widgets.addTree("tree", { person: "javi", info: { age: 32, location: "barcelona" }, role: "worker" });

  widgets.addSeparator();
  widgets.addVector2("vector2", [10, 20], { min: 0 });
  widgets.addVector3("vector3", [10, 20, 30], { min: 0 });
  widgets.addSeparator();
  widgets.addTextarea("textarea", "a really long silly text");
  widgets.addInfo("info", "a really long silly text");
  widgets.addSlider("slider", 10, { min: 1, max: 100, step: 1 });
  widgets.addCheckbox("checkbox", true);
  widgets.addCheckbox("checkbox2", false);
  widgets.addCombo("combo", "javi", { values: ["foo", "faa", "super largo texto que no cabe entero", "javi", "nada"] });
  widgets.addButtons("Serialize", ["Save", "Load", "New"]);
  widgets.addButton(null, "Save");
  dialog.add(widgets);

  return dialog;
}


function randomName() {
  var names = ["Phil", "Smith", "Gregory", "Martin", "James", "Coleman", "Jerry", "Helen", "Mary"];
  var name = [];
  name.push(names[Math.floor(Math.random() * names.length)]);
  name.push(names[Math.floor(Math.random() * names.length)]);
  return name.join(" ");
}