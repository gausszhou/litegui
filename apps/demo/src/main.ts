// @ts-nocheck
import "@gausszhou/litegui-components/style.css";
import "./demo.css";
import {
  Button,
  Checkbox,
  ComplexList,
  Console,
  ContextMenu,
  Dialog,
  Dragger,
  Inspector,
  List,
  Menu,
  Panel,
  SearchBox,
  Slider,
  Table,
  Tabs,
  Tree
} from "@gausszhou/litegui-components";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

const blenderHref = location.port === "5173" ? "http://127.0.0.1:5175/" : "../blender/";

app.innerHTML = `
  <header class="demo-topbar">
    <div class="demo-brand"><span class="demo-brand-mark">LG</span> LiteGUI</div>
    <nav class="demo-links">
      <a href="#buttons">组件</a>
      <a href="${blenderHref}">Blender Workbench</a>
      <a href="../docs/">文档</a>
    </nav>
    <div class="demo-top-actions">
      <button class="lg-button__control" id="theme-toggle">切换浅色</button>
    </div>
  </header>

  <div class="demo-layout">
    <aside class="demo-nav">
      <div class="demo-nav-group">
        <div class="demo-nav-title">Getting started</div>
        <a href="#overview" class="active">Overview</a>
      </div>
      <div class="demo-nav-group">
        <div class="demo-nav-title">Controls</div>
        <a href="#buttons">Buttons</a>
        <a href="#inputs">Inputs</a>
        <a href="#menus">Menus</a>
        <a href="#tabs">Tabs</a>
        <a href="#dialogs">Dialogs</a>
      </div>
      <div class="demo-nav-group">
        <div class="demo-nav-title">Data</div>
        <a href="#tree">Tree</a>
        <a href="#inspector">Inspector</a>
        <a href="#table">Table</a>
        <a href="#list">List</a>
        <a href="#complex-list">ComplexList</a>
        <a href="#console">Console</a>
      </div>
      <div class="demo-nav-group">
        <div class="demo-nav-title">Layout</div>
        <a href="#panel">Panel</a>
        <a href="#context-menu">ContextMenu</a>
      </div>
    </aside>

    <main class="demo-content">
      <section class="demo-hero" id="overview">
        <div class="demo-eyebrow">Framework-free desktop-style UI</div>
        <h1>Blender 风格的组件工作台</h1>
        <p>
          默认主题已经切换为 Blender 深色设计：扁平表面、1px 分隔线、低饱和蓝色强调，
          字号和控件高度按 Web 可读性放大。下面每个卡片都是可交互的真实组件，不是静态图片。
        </p>
        <div class="demo-hero-actions">
          <a class="lg-button" href="${blenderHref}"><button class="lg-button__control">打开 Blender Workbench</button></a>
          <a class="lg-button" href="../docs/design/blender-ui"><button class="lg-button__control">查看 UI 规范</button></a>
        </div>
      </section>

      <div class="demo-grid">
        <section class="demo-card" id="buttons">
          <div class="demo-card-header"><h2>Button</h2><code>lg-button</code></div>
          <p class="demo-note">默认 / 小尺寸 / 激活 / 禁用。所有按钮都可以键盘聚焦。</p>
          <div class="demo-row" id="button-host"></div>
        </section>

        <section class="demo-card" id="inputs">
          <div class="demo-card-header"><h2>Inputs</h2><code>Checkbox · Slider · SearchBox · Dragger</code></div>
          <div class="demo-stack" id="input-host"></div>
        </section>

        <section class="demo-card" id="menus">
          <div class="demo-card-header"><h2>Menu</h2><code>lg-menu</code></div>
          <p class="demo-note">点击顶部菜单项打开子菜单；支持分隔线和多级子菜单。</p>
          <div class="demo-host demo-host--menu" id="menu-host"></div>
        </section>

        <section class="demo-card" id="tabs">
          <div class="demo-card-header"><h2>Tabs</h2><code>lg-tabs</code></div>
          <div class="demo-host demo-host--tabs" id="tabs-host"></div>
        </section>

        <section class="demo-card" id="tree">
          <div class="demo-card-header"><h2>Tree</h2><code>lg-tree</code></div>
          <div class="demo-host demo-host--tree" id="tree-host"></div>
        </section>

        <section class="demo-card" id="inspector">
          <div class="demo-card-header"><h2>Inspector</h2><code>lg-inspector</code></div>
          <div class="demo-host demo-host--inspector" id="inspector-host"></div>
        </section>

        <section class="demo-card demo-card--wide" id="table">
          <div class="demo-card-header"><h2>Table</h2><code>lg-table</code></div>
          <div class="demo-host demo-host--table" id="table-host"></div>
        </section>

        <section class="demo-card" id="list">
          <div class="demo-card-header"><h2>List</h2><code>lg-list</code></div>
          <div class="demo-host demo-host--list" id="list-host"></div>
          <p class="demo-muted" id="list-value">未选择</p>
        </section>

        <section class="demo-card" id="complex-list">
          <div class="demo-card-header"><h2>ComplexList</h2><code>lg-complex-list</code></div>
          <div class="demo-host demo-host--complex" id="complex-host"></div>
        </section>

        <section class="demo-card demo-card--wide" id="console">
          <div class="demo-card-header"><h2>Console</h2><code>lg-console</code></div>
          <div class="demo-host demo-host--console" id="console-host"></div>
        </section>

        <section class="demo-card" id="panel">
          <div class="demo-card-header"><h2>Panel</h2><code>lg-panel</code></div>
          <div class="demo-host demo-host--panel" id="panel-host"></div>
        </section>

        <section class="demo-card" id="dialogs">
          <div class="demo-card-header"><h2>Dialog</h2><code>lg-dialog</code></div>
          <p class="demo-note">打开一个可拖动、可关闭的模态框，用于确认和错误信息。</p>
          <div class="demo-row" id="dialog-host"></div>
        </section>

        <section class="demo-card demo-card--wide" id="context-menu">
          <div class="demo-card-header"><h2>ContextMenu</h2><code>lg-context-menu</code></div>
          <div class="demo-context-surface" id="context-surface">在这里右键打开上下文菜单</div>
        </section>
      </div>

      <footer class="demo-footer">
        LiteGUI · Blender-inspired default theme · <a href="../docs/design/blender-ui">设计规范</a>
      </footer>
    </main>
  </div>
`;

function mount(id: string, element: HTMLElement) {
  const host = document.querySelector<HTMLElement>(id);
  if (host) host.appendChild(element);
  return host;
}

/* Buttons */
const buttonHost = document.querySelector<HTMLElement>("#button-host")!;
const primary = new Button("Primary", { callback: () => flash("Primary clicked") });
primary.root.classList.add("lg-button--primary");
primary.content.classList.add("lg-button__control--primary");
buttonHost.appendChild(primary.root);
buttonHost.appendChild(new Button("Secondary").root);
buttonHost.appendChild(new Button("Small", { size: "small" }).root);
buttonHost.appendChild(new Button("Disabled").root);
const disabled = buttonHost.lastElementChild!.querySelector<HTMLButtonElement>("button");
if (disabled) disabled.disabled = true;

/* Inputs */
const inputHost = document.querySelector<HTMLElement>("#input-host")!;
function fieldRow(label: string, control: HTMLElement) {
  const row = document.createElement("div");
  row.className = "demo-field-row";
  const labelEl = document.createElement("span");
  labelEl.className = "demo-label";
  labelEl.textContent = label;
  const grow = document.createElement("div");
  grow.className = "demo-grow";
  grow.appendChild(control);
  row.append(labelEl, grow);
  inputHost.appendChild(row);
  return grow;
}

const checkbox = new Checkbox(true, {
  onChange: (value) => flash(`Checkbox: ${value ? "on" : "off"}`)
});
fieldRow("Checkbox", checkbox.root);

const sliderValue = document.createElement("span");
sliderValue.className = "demo-value";
sliderValue.textContent = "0.65";
const slider = new Slider(0.65, { min: 0, max: 1, step: 0.01 });
slider.onChange = (value) => {
  sliderValue.textContent = value.toFixed(2);
};
const sliderWrap = document.createElement("div");
sliderWrap.className = "demo-row";
sliderWrap.append(slider.root, sliderValue);
fieldRow("Slider", sliderWrap);

const search = new SearchBox("", {
  placeholder: "Search components…",
  callback: (value) => flash(`Search: ${value}`)
});
search.root.classList.add("lg-searchbox--full");
fieldRow("SearchBox", search.root);

const draggerValue = document.createElement("span");
draggerValue.className = "demo-value";
draggerValue.textContent = "24.00";
const dragger = new Dragger(24, { min: 0, max: 100, step: 1, precision: 2 });
dragger.onChange = (value) => {
  draggerValue.textContent = value.toFixed(2);
};
const draggerWrap = document.createElement("div");
draggerWrap.className = "demo-row";
draggerWrap.append(dragger.root, draggerValue);
fieldRow("Dragger", draggerWrap);

/* Menu */
const menu = new Menu("demo-main-menu");
menu.add("File/New", { callback: () => flash("File → New") });
menu.add("File/Save", { callback: () => flash("File → Save") });
menu.add("File/Export", { callback: () => flash("File → Export") });
menu.add("Edit/Undo", { callback: () => flash("Edit → Undo") });
menu.add("Edit/Redo", { callback: () => flash("Edit → Redo") });
menu.add("Edit/Copy", { callback: () => flash("Edit → Copy") });
menu.add("View/Zoom In", { callback: () => flash("View → Zoom In") });
menu.add("View/Zoom Out", { callback: () => flash("View → Zoom Out") });
menu.add("View/Reset", { callback: () => flash("View → Reset") });
mount("#menu-host", menu.root);

/* Tabs */
const tabs = new Tabs();
const tabsHost = document.querySelector<HTMLElement>("#tabs-host")!;
tabs.appendTo(tabsHost);
tabs.addTab("overview", {
  title: "Overview",
  content: "<div style='padding:10px;color:#c8c8c8'>Blender-style tabs with a flat header and an accent underline.</div>"
});
tabs.addTab("properties", {
  title: "Properties",
  content: "<div style='padding:10px;color:#c8c8c8'>Each tab owns its content panel; switching is keyboard accessible.</div>"
});
tabs.selectTab("overview");

/* Tree */
const tree = new Tree(
  {
    id: "Scene Collection",
    children: [
      { id: "Camera", children: [] },
      { id: "Cube", children: [] },
      { id: "Light", children: [] },
      { id: "Collection", children: [{ id: "Mesh" }, { id: "Material" }] }
    ]
  },
  { height: "100%", allow_rename: true }
);
mount("#tree-host", tree.root);

/* Inspector */
const inspector = new Inspector({ height: "100%", width: "100%" });
inspector.appendTo(document.querySelector<HTMLElement>("#inspector-host")!);
inspector.addString("Name", "Cube");
inspector.addNumber("Width", 2, { min: 0, max: 20, step: 0.1 });
inspector.addSlider("Opacity", 0.8, { min: 0, max: 1, step: 0.01 });
inspector.addCheckbox("Visible", true);
inspector.addVector3("Location", [0, 0, 0]);
inspector.addColor("Color", "#b8b8b8");
inspector.addButton("Apply", { callback: () => flash("Inspector → Apply") });

/* Table */
const rows = [
  { name: "Camera", type: "Camera", location: "7.36, -6.93, 4.96" },
  { name: "Cube", type: "Mesh", location: "0.00, 0.00, 1.00" },
  { name: "Light", type: "Light", location: "4.08, 1.01, 5.90" },
  { name: "Collection", type: "Collection", location: "—" }
];
const table = new Table({
  columns: [
    { name: "Name", field: "name" },
    { name: "Type", field: "type" },
    { name: "Location", field: "location" }
  ],
  rows,
  height: 220,
  scrollable: true
});
mount("#table-host", table.root);

/* List */
const list = new List("demo-list", ["Camera", "Cube", "Light", "Collection"], {
  callback: (element) => {
    document.querySelector("#list-value")!.textContent = `Selected: ${element.dataset.value}`;
  }
});
mount("#list-host", list.root);

/* ComplexList */
const complex = new ComplexList({ height: 250 });
complex.addTitle("Layers");
complex.addItem({ name: "Background" }, "Background", true);
complex.addItem({ name: "Wave" }, "Wave", true);
complex.addItem({ name: "Caption" }, "Caption", true);
complex.addItem({ name: "Effects" }, "Effects", false);
complex.onItemSelected = (item) => flash(`Layer: ${item.name}`);
mount("#complex-host", complex.root);

/* Console */
const terminal = new Console({ prompt: ">" });
terminal.addMessage("LiteGUI console ready.", "good");
terminal.addMessage("Type a command and press Enter.", "msglog");
mount("#console-host", terminal.root);

/* Panel */
const panel = new Panel({ title: "Scene Settings", width: "100%", height: "100%", close: false });
panel.content.innerHTML = `
  <div class="demo-stack">
    <div class="demo-field-row"><span class="demo-label">Engine</span><select class="lg-select"><option>EEVEE</option><option>Cycles</option></select></div>
    <div class="demo-field-row"><span class="demo-label">Samples</span><input class="lg-input__field" type="number" value="64" /></div>
    <div class="demo-field-row"><span class="demo-label">Color</span><input type="color" value="#4772b3" style="height:26px;width:54px;border:1px solid #3d3d3d;background:#1d1d1d" /></div>
  </div>
`;
panel.footer.innerHTML = `<button class="lg-button__control">Apply</button>`;
mount("#panel-host", panel.root);

/* Dialog */
const openDialog = new Button("Open Dialog", {
  callback: () => {
    const dialog = new Dialog({
      title: "Rename Layer",
      width: 380,
      height: 210,
      close: true,
      content: "<div style='padding:8px;color:#c8c8c8'>A draggable dialog using the Blender surface hierarchy.</div>",
      buttons: [
        { name: "Cancel", close: true },
        { name: "OK", close: true, callback: () => flash("Dialog confirmed") }
      ]
    });
    dialog.show();
  }
});
mount("#dialog-host", openDialog.root);

/* Context menu */
let contextMenu: ContextMenu | null = null;
const contextSurface = document.querySelector<HTMLElement>("#context-surface")!;
contextSurface.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  contextMenu?.close();
  contextMenu = new ContextMenu(
    [
      { title: "Copy", callback: () => flash("Context → Copy") },
      { title: "Paste", callback: () => flash("Context → Paste") },
      { title: "Duplicate", callback: () => flash("Context → Duplicate") },
      "-",
      { title: "Delete", callback: () => flash("Context → Delete") }
    ],
    { event, title: "Object" }
  );
});

/* Theme toggle */
let light = false;
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle")!;
themeToggle.addEventListener("click", () => {
  light = !light;
  if (light) document.documentElement.dataset.lgTheme = "light";
  else delete document.documentElement.dataset.lgTheme;
  themeToggle.textContent = light ? "切换深色" : "切换浅色";
  flash(light ? "Light theme" : "Blender dark theme");
});

/* Small toast for demo feedback */
let toast: HTMLElement | null = null;
function flash(message: string) {
  if (!toast) {
    toast = document.createElement("div");
    toast.style.cssText =
      "position:fixed;right:20px;bottom:20px;z-index:9999;padding:8px 12px;background:#282828;border:1px solid #4a4a4a;border-radius:4px;color:#e6e6e6;box-shadow:0 8px 24px rgba(0,0,0,.5);font-size:12px;";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  window.clearTimeout((flash as any).timer);
  (flash as any).timer = window.setTimeout(() => {
    if (toast) toast.style.opacity = "0";
  }, 1600);
}

/* Active nav on scroll */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".demo-nav a"));
const sections = navLinks
  .map((link) => document.querySelector<HTMLElement>(link.getAttribute("href")!))
  .filter(Boolean);
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  },
  { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1, 0.5] }
);
sections.forEach((section) => observer.observe(section!));
