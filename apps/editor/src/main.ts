// @ts-nocheck 示例页面沿用上游 litegui.js 的 JS 写法（隐式 any / 宽松回调），
// 这里保留原样以便和上游示例对照；库本身仍按 strict 检查。
//
// 布局约定：
// - html/body/#app/.lg-app 100% 高，页面不滚动（见 editor.css）
// - 顶部主菜单 30px，Area 撑满剩余高度
// - Area 横向切成 [主画布 | 右侧 dock 面板]，左侧再纵向切成 [画布 | 底部 dock 面板]
// - 组件视觉全部来自 packages/components 的默认 Blender 深色主题，这里只管结构
import "@gausszhou/litegui-components/style.css";
import "./editor.css";
import LiteGUI, { Console, Inspector, Tree } from "@gausszhou/litegui-components";

const MENUBAR_HEIGHT = 30;
const SIDE_PANEL_WIDTH = 340;
const BOTTOM_PANEL_HEIGHT = 140;

let mainarea: any = null;
let rightPanel: any = null;
let bottomPanel: any = null;
let bottomConsole: any = null;

window.onload = function () {
  // 关键：用 #app 作为容器并生成 .lg-app 根节点，
  // 这样 #app 不再是空 div，Area 的百分比高度才有参照物。
  LiteGUI.init({ container: "#app", wrapped: true });

  createMenu();

  mainarea = new LiteGUI.Area({
    id: "mainarea",
    main: true,
    content_id: "canvasarea",
    height: "calc( 100% - " + MENUBAR_HEIGHT + "px )",
    inmediateResize: true
  });

  LiteGUI.add(mainarea);

  //create main canvas to test redraw
  const canvas: any = document.createElement("canvas");
  canvas.width = canvas.height = 100;
  canvas.times = 0;
  canvas.redraw = function () {
    const rect = canvas.parentNode.getClientRects()[0];
    canvas.width = rect ? Math.max(1, Math.round(rect.width)) : 300;
    canvas.height = rect ? Math.max(1, Math.round(rect.height)) : 150;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#4a4a4a";
    ctx.font = "12px Inter, Arial, sans-serif";
    ctx.strokeRect(10.5, 10.5, this.width - 20, this.height - 20);
    ctx.strokeStyle = "#8a8a8a";
    ctx.strokeText("Redraw times: " + this.times, 20.5, 28.5);
    this.times += 1;
  };

  mainarea.content.appendChild(canvas);

  // 左上：主画布 / 右侧：dock 面板
  mainarea.split("horizontal", [null, SIDE_PANEL_WIDTH], true);
  // 左侧再分成 上（画布）/ 下（底部 dock 面板）
  mainarea.getSection(0).split("vertical", [null, BOTTOM_PANEL_HEIGHT], true);

  bottomPanel = createBottomPanel();
  rightPanel = createSidePanel();

  createWidgetsDialog();
  createTableDialog();
  createComplexListDialog();

  canvas.redraw();
  fitDialogsIntoView();
  bindMenuShortcuts();
  window.addEventListener("resize", () => {
    canvas.redraw();
    fitDialogsIntoView();
  });
  // 拖动结束后把窗口收回视口内
  document.addEventListener("mouseup", () => requestAnimationFrame(() => fitDialogsIntoView()));
  // Area 的 splitbar 拖动后重绘画布
  LiteGUI.bind(mainarea.root, "split_moved", () => canvas.redraw());
};

/**
 * Tree 的右键菜单。
 * ContextMenu 自己在鼠标离开时关闭，这里再补一个“点别处 / Esc 立刻关闭”，
 * 避免右键菜单留在屏幕上关不掉。
 */
function openTreeContextMenu(event: MouseEvent, nodeName: string) {
  const menu = new LiteGUI.ContextMenu(
    [
      { title: "Rename", callback: () => notify("Rename: " + nodeName) },
      { title: "Duplicate", callback: () => notify("Duplicate: " + nodeName) },
      { title: "Delete", callback: () => notify("Delete: " + nodeName) }
    ],
    { event: event, title: nodeName, container: LiteGUI.root as HTMLElement }
  );

  const dismiss = (e: Event) => {
    const target = e.target;
    if (e instanceof MouseEvent && target instanceof Node && menu.root.contains(target)) return;
    cleanup();
    menu.close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.key !== "Esc") return;
    cleanup();
    menu.close();
  };
  const cleanup = () => {
    document.removeEventListener("mousedown", dismiss, true);
    document.removeEventListener("keydown", onKey);
  };
  // 放到下一个任务，避免当前这次 mousedown 立刻把菜单关掉
  setTimeout(() => {
    document.addEventListener("mousedown", dismiss, true);
    document.addEventListener("keydown", onKey);
  }, 0);

  notify("Context menu: " + nodeName);
  return menu;
}

/** 菜单里展示的快捷键真正可用（输入框内不抢按键） */
function bindMenuShortcuts() {
  const targets: Record<string, string> = {
    "ctrl+n": "File > New",
    "ctrl+o": "File > Open...",
    "ctrl+s": "File > Save",
    "ctrl+shift+s": "File > Save As...",
    "ctrl+q": "File > Quit (demo)",
    "ctrl+z": "Edit > Undo",
    "ctrl+shift+z": "Edit > Redo"
  };

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push("ctrl");
    if (e.shiftKey) parts.push("shift");
    if (e.altKey) parts.push("alt");
    parts.push(e.key.toLowerCase());
    const action = targets[parts.join("+")];
    if (!action) return;
    e.preventDefault();
    notify(action);
  });
}

/** 往底部 Console 写一行；面板被关掉时静默丢弃 */
function notify(message: string, kind?: string) {
  if (bottomConsole) bottomConsole.addMessage(String(message), kind);
}

function createMenu() {
  const mainmenu = new LiteGUI.Menu("MainMenu");

  LiteGUI.add(mainmenu);
  LiteGUI.mainmenu = mainmenu;

  mainmenu.add("File/New", { shortcut: "Ctrl+N", callback: () => notify("File > New") });
  mainmenu.add("File/Open...", { shortcut: "Ctrl+O", callback: () => notify("File > Open...") });
  mainmenu.add("File/Open_Recent");
  mainmenu.add("File/Revert");
  mainmenu.add("File/Recover");
  mainmenu.add("File/Recover/Last Session");
  mainmenu.add("File/Recover/Auto Save");
  mainmenu.add("File/");

  mainmenu.add("File/Save", { shortcut: "Ctrl+S", callback: () => notify("File > Save") });
  mainmenu.add("File/Save As...", { shortcut: "Ctrl+Shift+S", callback: () => notify("File > Save As...") });
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
  mainmenu.add("File/Quit", { shortcut: "Ctrl+Q", callback: () => notify("File > Quit (demo)") });

  mainmenu.add("Edit/Undo", { shortcut: "Ctrl+Z", callback: () => notify("Edit > Undo") });
  mainmenu.add("Edit/Redo", { shortcut: "Ctrl+Shift+Z", callback: () => notify("Edit > Redo") });
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Undo History...");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Repeat Last");
  mainmenu.add("Edit/Repeat History...");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Adjust Last Operation");
  mainmenu.add("Edit/");
  mainmenu.add("Edit/Copy", { shortcut: "Ctrl+C", callback: () => notify("Copy") });
  mainmenu.add("Edit/Paste", { shortcut: "Ctrl+V", callback: () => notify("Paste") });
  mainmenu.add("Edit/Clear", { callback: () => notify("Clear") });

  mainmenu.add("View/Fixed size", {
    callback: function () {
      LiteGUI.setWindowSize(1000, 600);
      fitDialogsIntoView();
      notify("View > Fixed size (1000 x 600)");
    }
  });
  mainmenu.add("View/Maximize", {
    callback: function () {
      LiteGUI.setWindowSize();
      fitDialogsIntoView();
      notify("View > Maximize");
    }
  });
  mainmenu.add("View/");
  mainmenu.add("View/Bottom panel", {
    callback: function () {
      toggleBottomPanel();
    }
  });
  mainmenu.add("View/Side panel", {
    callback: function () {
      toggleSidePanel();
    }
  });

  mainmenu.add("Debug/Dialog", {
    callback: function () {
      createWidgetsDialog();
    }
  });
  mainmenu.add("Debug/Message", {
    callback: function () {
      LiteGUI.showMessage("This is an example of message");
    }
  });
  mainmenu.add("Debug/Modal", {
    callback: function () {
      var dialog = new LiteGUI.Dialog({
        width: 320,
        height: 160,
        close: true,
        content: "This is an example of modal dialog"
      });
      dialog.show();
      dialog.center();
      dialog.makeModal();
      dialog.addButtonToFooter("Accept", { name: "Accept", close: true });
      dialog.addButtonToFooter("Cancel", { name: "Cancel", close: true });
    }
  });

  return mainmenu;
}

/* ---------- 右侧 dock 面板：Tabs(Info/Tree/Extra) + Inspector ---------- */

function createSidePanel() {
  const panel = new LiteGUI.Panel("right-panel", {
    title: "Docked Right Panel",
    close: true,
    className: "editor-sidepanel"
  });
  mainarea.getSection(1).add(panel);
  LiteGUI.bind(panel, "closed", function () {
    // 只收起右侧分栏，不销毁整个 Area，避免主画布一起没了
    mainarea.hideSection(1);
  });

  updateSidePanel(panel);
  return panel;
}

function updateSidePanel(root: any) {
  root = root || rightPanel;
  if (!root) return;
  root.content.innerHTML = "";

  // ---- tabs ----
  const tabs = new LiteGUI.Tabs();
  tabs.root.classList.add("editor-tabs");
  tabs.addTab("Info", {
    content:
      "<p class='editor-hint'>LiteGUI 经典编辑器布局：顶部菜单 + Area 主画布 + 右侧 dock 面板 + 底部 dock 面板 + 浮动窗口。</p>" +
      "<p class='editor-hint'>拖动 Area 之间的分隔条可以调整比例；右侧 Tree / Inspector 各自内部滚动。</p>"
  });
  tabs.addTab("Tree", { selected: true });
  tabs.addTab("Extra", {
    content:
      "<p class='editor-hint'>Extra tab 用来说明 tab 内容区是独立滚动的。</p>" +
      "<p class='editor-hint'>Debug 菜单可以重新打开 Inspector 浮动窗口。</p>"
  });
  root.add(tabs);

  // ---- tree ----
  const treeData = {
    id: "Rootnode",
    children: [
      { id: "Child1" },
      {
        id: "Child2",
        children: [
          { id: "SubChild1" },
          { id: "SubChild2" },
          { id: "SubChild3" },
          { id: "SubChild4" },
          { id: "SubChild5" },
          { id: "SubChild6" },
          { id: "SubChild7" }
        ]
      },
      { id: "Child3" }
    ]
  };

  const litetree = new Tree(treeData, { allow_rename: true });
  litetree.root.classList.add("editor-tree");
  LiteGUI.bind(litetree.root, "item_selected", function (e: any) {
    const item = e.detail && e.detail.item;
    const name = (item && (item.dataset.item_id || item.textContent)) || "?";
    notify("Tree selected: " + name);
  });
  // 右键：节点菜单 + 空白处菜单（Tree 内部已经 preventDefault）
  litetree.onItemContextMenu = function (e: MouseEvent, payload: any) {
    const node = payload && payload.item;
    const name = (payload && payload.data && payload.data.id) || (node && node.textContent) || "node";
    openTreeContextMenu(e, String(name));
    return true;
  };
  litetree.onContextMenu = function (e: MouseEvent) {
    openTreeContextMenu(e, "background");
  };
  tabs.getTabContent("Tree").appendChild(litetree.root);

  litetree.insertItem({ id: "FOO" }, "Child2", 2);
  litetree.insertItem({ id: "MAX" }, "Child1");

  // ---- inspector ----
  const widgets = new Inspector();
  widgets.root.classList.add("editor-inspector");
  widgets.onchange = function (name: string, value: any) {
    notify("Widget change: " + name + " -> " + JSON.stringify(value));
  };

  widgets.addSection("Number Stuff");
  widgets.addSlider("Slider", 20, { min: 1, max: 100, step: 1 });
  widgets.addNumber("Number", 10, { min: 0, precision: 2 });
  widgets.addVector2("Vector2", [10, 20], { min: 0, precision: 2 });
  widgets.addVector3("Vector3", [10, 20, 30], { min: 0, precision: 2 });
  widgets.addVector4("Vector4", [0.1, 0.2, 0.3, 0.4], { min: 0, precision: 2 });

  widgets.addSection("Text Stuff");
  widgets.addString("String", "foo");
  widgets.addStringButton("String Button", "foo", {
    callback: function (v: any) {
      notify("Button: " + v);
    }
  });
  widgets.addTextarea(null, "a really long silly text", { height: 100 });
  widgets.addCombo("Combo", "javi", {
    values: ["foo", "faa", "super largo texto que no cabe entero", "javi", "nada"],
    callback: function (name: any) {
      notify("Combo selected: " + name);
    }
  });
  widgets.addComboButtons("Combobtns", "javi", {
    values: ["foo", "faa", "javi", "nada"],
    callback: function (name: any) {
      notify("Combo button selected: " + name);
    }
  });
  widgets.addTags("Tags", "pop", {
    values: ["rap", "blues", "pop", "jazz"],
    callback: function (tags: any) {
      notify("Tag added: " + JSON.stringify(tags));
    }
  });

  widgets.addSection("Other widgets");
  widgets.addCheckbox("Checkbox", true, {
    callback: function (value: any) {
      notify("Checkbox pressed: " + value);
    }
  });
  widgets.addButton("Serialize", "Save", {
    callback: function (name: any) {
      notify("Button pressed: " + name);
    }
  });
  widgets.addButtons("Serialize", ["Save", "Load", "New"], {
    callback: function (name: any) {
      notify("Button pressed: " + name);
    }
  });
  widgets.addButton(null, "Save");
  widgets.addSeparator();
  widgets.addColor("Color", [0, 1, 0]);
  widgets.addPad("Pad", [0.5, 0.5], function (v: any) {
    notify("Pad: " + JSON.stringify(v));
  });
  widgets.addFile("File", "test.png");
  widgets.addLine(
    "Line",
    [
      [0.5, 1],
      [0.75, 0.25]
    ],
    { defaulty: 0, width: 120 }
  );

  root.add(widgets);
}

/* ---------- 底部 dock 面板 ---------- */

function createBottomPanel() {
  const panel = new LiteGUI.Panel({
    id: "bottom-panel",
    title: "Docked Bottom Panel",
    close: true,
    className: "editor-bottompanel"
  });
  mainarea.getSection(0).getSection(1).add(panel);

  LiteGUI.bind(panel, "closed", function () {
    mainarea.getSection(0).hideSection(1);
  });

  const consoleWidget = new Console({ prompt: ">" });
  consoleWidget.addMessage("LiteGUI editor ready — Blender dark theme is the default", "log");
  consoleWidget.addMessage("Try: View > Fixed size / Maximize, drag the split bars", "log");
  consoleWidget.addMessage("Tips: Tree rows are selectable, Inspector fields are editable", "log");
  consoleWidget.onProcessCommand = function (command: string) {
    if (!command) return;
    if (command === "clear") {
      consoleWidget.clear();
      return;
    }
    if (command === "help") {
      consoleWidget.addMessage("commands: help, clear", "log");
      return;
    }
    consoleWidget.addMessage("unknown command: " + command, "warn");
  };
  panel.add(consoleWidget);
  bottomConsole = consoleWidget;

  return panel;
}

function toggleBottomPanel() {
  const left = mainarea && mainarea.getSection(0);
  if (!left || !left.sections || left.sections.length < 2) return;
  if (left.sections[1].root.style.display === "none") {
    if (!bottomPanel || !bottomPanel.root.parentElement) bottomPanel = createBottomPanel();
    left.showSection(1);
    notify("Bottom panel shown");
  } else {
    left.hideSection(1);
    notify("Bottom panel hidden");
  }
}

function toggleSidePanel() {
  if (!mainarea || !mainarea.sections || mainarea.sections.length < 2) return;
  if (mainarea.sections[1].root.style.display === "none") {
    // 面板被 × 关掉时 DOM 已经移除，这里按需重建，避免显示出一个空的右侧分栏
    if (!rightPanel || !rightPanel.root.parentElement) rightPanel = createSidePanel();
    mainarea.showSection(1);
    notify("Side panel shown");
  } else {
    mainarea.hideSection(1);
    notify("Side panel hidden");
  }
}

/* ---------- 浮动窗口 ---------- */

/**
 * 窗口尺寸变化后把浮动窗口收进 .lg-app 里，避免 View > Fixed size 之后窗口跑到屏幕外。
 * 最小化的窗口由 Dialog.arrangeMinimized 负责贴底，这里跳过。
 */
function fitDialogsIntoView() {
  const root = LiteGUI.root;
  if (!root) return;
  const bounds = root.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const margin = 8;
  const list = (LiteGUI.Dialog && LiteGUI.Dialog.INSTANCE_LIST) || [];
  list.forEach(function (dialog: any) {
    if (!dialog || dialog.minimized || !dialog.root || !dialog.root.parentElement) return;
    const box = dialog.root.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const currentLeft = parseFloat(dialog.root.style.left) || 0;
    const currentTop = parseFloat(dialog.root.style.top) || 0;
    const left = Math.max(margin, Math.min(currentLeft, bounds.width - box.width - margin));
    const top = Math.max(margin, Math.min(currentTop, bounds.height - box.height - margin));
    if (left !== currentLeft) dialog.root.style.left = Math.round(left) + "px";
    if (top !== currentTop) dialog.root.style.top = Math.round(top) + "px";
  });
}

/** 显示并摆好浮动窗口；拖拽由 Dialog 组件自己用 .lg-dialog__header 作为句柄处理 */
function placeDialog(dialog: any, x: number, y: number) {
  dialog.show();
  dialog.setPosition(x, y);
  return dialog;
}

function createTableDialog() {
  const dialog = new LiteGUI.Dialog({
    title: "Table dialog",
    close: true,
    draggable: true,
    width: 380,
    height: 300,
    scroll: true,
    resizable: true
  });
  placeDialog(dialog, 70, 180);
  dialog.addButtonToFooter("Randomize", { name: "Randomize", callback: inner });

  const table = new LiteGUI.Table({ scrollable: true });
  dialog.add(table);

  table.setColumns([{ name: "Name", width: "46%" }, { name: "Age", width: 56 }, "Address"]);

  const data: any[] = [];
  for (var i = 0; i < 10; ++i) {
    data.push({
      name: randomName(),
      age: 30,
      address: "none"
    });
  }

  inner();

  function inner() {
    for (var i in data) {
      data[i].age = (Math.random() * 100) | 0;
    }
    table.setRows(data, true);
  }

  return dialog;
}

function createComplexListDialog() {
  const dialog = new LiteGUI.Dialog({
    title: "Complex List",
    close: true,
    draggable: true,
    width: 320,
    height: 400,
    scroll: true,
    resizable: true
  });
  placeDialog(dialog, 476, 180);

  const list = new LiteGUI.ComplexList({ height: "100%" });
  dialog.add(list);

  list.addTitle("Example of title");
  for (var i = 0; i < 8; ++i) list.addItem({}, "Example", Math.random() > 0.5, true);
  list.addTitle("Example of title");
  for (var i = 0; i < 8; ++i) list.addItem({}, "More items", Math.random() > 0.5, true);
  list.addHTML("+ click me");

  return dialog;
}

function createWidgetsDialog() {
  var name = "Dialog_" + ((Math.random() * 100) >> 0);
  const dialog = new LiteGUI.Dialog({
    id: name,
    title: name,
    close: true,
    draggable: true,
    width: 340,
    height: 430,
    scroll: true,
    resizable: true
  });
  placeDialog(dialog, 824, 180);

  //test menu in panel
  const minimenu = new LiteGUI.Menu("minimenu");
  minimenu.add("File/New");
  minimenu.add("File/Open...");
  minimenu.add("File/Save");
  minimenu.add("File/Save As");
  minimenu.add("Center", {
    callback: function () {
      dialog.center();
    }
  });
  minimenu.attachToPanel(dialog);

  const widgets = new Inspector();
  widgets.addButton("button", "Update", {
    callback: function () {
      updateSidePanel();
    }
  });
  widgets.addString("string", "foo");
  widgets.addNumber("number", 10, { min: 0, precision: 2 });

  widgets.addSeparator();
  widgets.addVector2("vector2", [10, 20], { min: 0, precision: 2 });
  widgets.addVector3("vector3", [10, 20, 30], { min: 0, precision: 2 });
  widgets.addSeparator();
  widgets.addTextarea("textarea", "a really long silly text");
  widgets.addInfo("info", "a really long silly text");
  widgets.addSlider("slider", 10, { min: 1, max: 100, step: 1 });
  widgets.addCheckbox("checkbox", true);
  widgets.addCheckbox("checkbox2", false);
  widgets.addCombo("combo", "javi", {
    values: ["foo", "faa", "super largo texto que no cabe entero", "javi", "nada"]
  });
  widgets.addButtons("Serialize", ["Save", "Load", "New"]);
  widgets.addButton(null, "Save");
  dialog.add(widgets);

  return dialog;
}

function randomName() {
  var names = ["Phil", "Smith", "Gregory", "Martin", "James", "Coleman", "Jerry", "Helen", "Mary"];
  var name: string[] = [];
  name.push(names[Math.floor(Math.random() * names.length)]);
  name.push(names[Math.floor(Math.random() * names.length)]);
  return name.join(" ");
}
