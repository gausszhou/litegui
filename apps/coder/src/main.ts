// @ts-nocheck
import "@gausszhou/litegui-components/style.css";
import "./app.css";
import {
  Button,
  Console,
  ContextMenu,
  Dialog,
  HeaderBar,
  Menu,
  Panel,
  SearchBox,
  StatusBar,
  Tabs,
  TextEditor,
  Toolbar,
  Tree
} from "@gausszhou/litegui-components";

/* ------------------------------------------------------------------ */
/* shell                                                               */
/* ------------------------------------------------------------------ */

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="app-shell" id="app-shell">
    <div class="app-titlebar" id="titlebar-host"></div>
    <div class="app-menubar" id="menubar-host"></div>

    <div class="app-workbench">
      <div class="app-activity" id="activity-host"></div>
      <aside class="app-sidebar" id="sidebar-host"></aside>

      <main class="app-editor-area">
        <div class="app-breadcrumb" id="breadcrumb">No file open</div>
        <div class="app-editor-main">
          <div class="app-editor-stack" id="editor-stack">
            <div class="app-editor-empty" id="editor-empty">
              <strong>LiteGUI Code</strong>
              <span>Open a file from the Explorer</span>
              <span>Press Ctrl+Shift+P for commands</span>
            </div>
          </div>
          <aside class="app-minimap"><pre id="minimap"></pre></aside>
        </div>
      </main>
    </div>

    <section class="app-terminal" id="terminal-drawer" hidden>
      <div class="app-terminal__header">
        <span>Terminal</span>
        <span class="app-terminal__hint">bash</span>
        <button type="button" class="lg-button__control app-terminal__close" id="terminal-close" title="Close terminal">×</button>
      </div>
      <div class="app-terminal__body" id="terminal-host"></div>
    </section>

    <div class="app-status" id="status-host"></div>

    <div class="app-command-palette" id="command-palette" hidden>
      <div class="app-command-palette__backdrop" data-close></div>
      <div class="app-command-palette__dialog" role="dialog" aria-label="Command Palette">
        <input class="lg-input__field app-command-palette__input" id="command-input" type="text" placeholder="Type a command" autocomplete="off" spellcheck="false" />
        <div class="app-command-palette__list" id="command-list"></div>
      </div>
    </div>
  </div>
`;

const shell = document.querySelector<HTMLElement>("#app-shell")!;
const breadcrumb = document.querySelector<HTMLElement>("#breadcrumb")!;
const editorStack = document.querySelector<HTMLElement>("#editor-stack")!;
const editorEmpty = document.querySelector<HTMLElement>("#editor-empty")!;
const minimap = document.querySelector<HTMLElement>("#minimap")!;
const terminalDrawer = document.querySelector<HTMLElement>("#terminal-drawer")!;

/* ------------------------------------------------------------------ */
/* in-memory project                                                   */
/* ------------------------------------------------------------------ */

interface FsFile {
  kind: "file";
  name: string;
  path: string;
  language: string;
  content: string;
}

interface FsFolder {
  kind: "folder";
  name: string;
  path: string;
  children: FsNode[];
}

type FsNode = FsFile | FsFolder;

function file(name: string, language: string, content: string): FsFile {
  return { kind: "file", name, path: "", language, content };
}

function dir(name: string, children: FsNode[]): FsFolder {
  return { kind: "folder", name, path: "", children };
}

const project: FsFolder = dir("LITEGUI-CODE", [
  dir("src", [
    dir("components", [
      file(
        "Button.ts",
        "TypeScript",
        `import { Widget } from "@gausszhou/litegui-core";

export class Button extends Widget {
  readonly root: HTMLButtonElement;

  constructor(label: string, onClick?: () => void) {
    super();
    this.root = document.createElement("button");
    this.root.className = "lg-button__control";
    this.root.textContent = label;
    this.root.addEventListener("click", () => onClick?.());
  }
}
`
      ),
      file(
        "Panel.ts",
        "TypeScript",
        `export interface PanelOptions {
  title?: string;
  width?: number | string;
  height?: number | string;
}
`
      ),
      file(
        "Tree.ts",
        "TypeScript",
        `export interface TreeNode {
  id: string;
  children?: TreeNode[];
}

export function flatten(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);
}
`
      )
    ]),
    dir("styles", [
      file(
        "theme.css",
        "CSS",
        `:root {
  --app-bg: #1e1e1e;
  --app-panel: #252526;
  --app-accent: #0e639c;
  --app-text: #cccccc;
}

body {
  margin: 0;
  background: var(--app-bg);
  color: var(--app-text);
}
`
      ),
      file(
        "layout.css",
        "CSS",
        `.workbench {
  display: flex;
  min-height: 0;
}

.sidebar {
  flex: 0 0 260px;
  border-right: 1px solid #333;
}

.editor {
  flex: 1 1 auto;
  min-width: 0;
}
`
      )
    ]),
    file(
      "app.ts",
      "TypeScript",
      `import { createSidebar } from "./components/Sidebar";
import { createEditor } from "./components/Editor";

export class App {
  private root: HTMLElement | null = null;

  mount(selector: string) {
    this.root = document.querySelector(selector);
    if (!this.root) throw new Error("Missing root element");
    return this;
  }

  start() {
    createSidebar(this.root!);
    createEditor(this.root!);
  }
}
`
    ),
    file(
      "main.ts",
      "TypeScript",
      `import { App } from "./app";

const app = new App();
app.mount("#app");
app.start();
`
    )
  ]),
  dir("public", [
    file(
      "index.html",
      "HTML",
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>LiteGUI Code</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
    ),
    file(
      "favicon.svg",
      "XML",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0e639c" />
  <path d="M9 11l6 5-6 5M17 21h6" stroke="#fff" stroke-width="2" fill="none" />
</svg>
`
    )
  ]),
  dir(".vscode", [
    file(
      "settings.json",
      "JSON",
      `{
  "editor.fontSize": 13,
  "editor.tabSize": 2,
  "files.eol": "\\n",
  "workbench.colorTheme": "Default Dark+"
}
`
    )
  ]),
  file(
    "README.md",
    "Markdown",
    `# LiteGUI Code

A VS Code-style code editor built with LiteGUI components.

## Features

- Explorer tree with search filtering
- Editor tabs with close buttons
- Command palette
- Integrated terminal
- Status bar with line and column

## Scripts

    pnpm dev
    pnpm build
    pnpm test
`
  ),
  file(
    "package.json",
    "JSON",
    `{
  "name": "litegui-code",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build"
  }
}
`
  ),
  file(
    "tsconfig.json",
    "JSON",
    `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true
  },
  "include": ["src"]
}
`
  )
]);

function assignPaths(node: FsNode, parentPath: string = ""): void {
  if (node.kind === "file") {
    node.path = parentPath ? `${parentPath}/${node.name}` : node.name;
    return;
  }
  node.path = node === project ? "" : parentPath ? `${parentPath}/${node.name}` : node.name;
  for (const child of node.children) assignPaths(child, node.path);
}

assignPaths(project);

function findFile(path: string, node: FsNode = project): FsFile | null {
  if (node.kind === "file") return node.path === path ? node : null;
  for (const child of node.children) {
    const found = findFile(path, child);
    if (found) return found;
  }
  return null;
}

function findFolder(name: string, node: FsNode = project): FsFolder | null {
  if (node.kind === "folder" && node.name === name) return node;
  if (node.kind === "folder") {
    for (const child of node.children) {
      const found = findFolder(name, child);
      if (found) return found;
    }
  }
  return null;
}

function findParentFolder(path: string, node: FsFolder = project): FsFolder | null {
  for (const child of node.children) {
    if (child.kind === "file" && child.path === path) return node;
    if (child.kind === "folder") {
      const found = findParentFolder(path, child);
      if (found) return found;
    }
  }
  return null;
}

function flattenFiles(node: FsNode = project): FsFile[] {
  if (node.kind === "file") return [node];
  return node.children.flatMap(child => flattenFiles(child));
}

/* ------------------------------------------------------------------ */
/* tree data                                                           */
/* ------------------------------------------------------------------ */

function buildTreeData(node: FsNode): any {
  if (node.kind === "file") {
    return { id: node.path, content: node.name, filePath: node.path, name: node.name };
  }
  return {
    id: node.path ? `dir:${node.path}` : "dir:root",
    content: node.name,
    name: node.name,
    children: node.children.map(buildTreeData)
  };
}

function filterTree(node: FsNode, needle: string): FsNode | null {
  if (node.kind === "file") {
    return node.name.toLowerCase().includes(needle) ||
      node.path.toLowerCase().includes(needle) ||
      node.content.toLowerCase().includes(needle)
      ? { ...node }
      : null;
  }
  const children = node.children.map(child => filterTree(child, needle)).filter(Boolean) as FsNode[];
  if (!children.length && !node.name.toLowerCase().includes(needle)) return null;
  return { ...node, children };
}

function countFiles(node: FsNode | null): number {
  if (!node) return 0;
  return flattenFiles(node).length;
}

/* ------------------------------------------------------------------ */
/* ui components                                                       */
/* ------------------------------------------------------------------ */

const titlebar = new HeaderBar({ variant: "topbar" });

const brandIcon = document.createElement("span");
brandIcon.className = "app-brand-icon";
brandIcon.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 2 12l6 8"/><path d="m16 4 6 8-6 8"/></svg>';
const brandTitle = document.createElement("span");
brandTitle.className = "app-brand-title";
brandTitle.textContent = "LiteGUI Code";
titlebar.setLeft([brandIcon, brandTitle]);

const searchBox = new SearchBox("", { placeholder: "Search files" });
searchBox.root.classList.add("app-title-search");
titlebar.setCenter(searchBox.root);

const commandsButton = new Button("Commands", { callback: () => openCommandPalette() });
const themeButton = new Button("Light theme", { callback: () => toggleTheme() });
titlebar.setRight([commandsButton.root, themeButton.root]);
document.querySelector<HTMLElement>("#titlebar-host")!.appendChild(titlebar.root);

/* menu bar */
const menu = new Menu("app-menu");
menu.add("File/New File", { callback: () => newFile() });
menu.add("File/Save", { callback: () => saveActiveFile() });
menu.add("File/Close Editor", { callback: () => activePath && closeFile(activePath) });
menu.add("File/Open File", { callback: () => searchBox.input.focus() });
menu.add("Edit/Undo", { callback: () => editCommand("undo") });
menu.add("Edit/Redo", { callback: () => editCommand("redo") });
menu.add("Edit/Find", { callback: () => searchBox.input.focus() });
menu.add("Edit/Command Palette", { callback: () => openCommandPalette() });
menu.add("Selection/Select All", { callback: () => activeEditor()?.textarea.select() });
menu.add("Selection/Expand Selection", { callback: () => activeEditor()?.textarea.select() });
menu.add("View/Command Palette", { callback: () => openCommandPalette() });
menu.add("View/Toggle Sidebar", { callback: () => toggleSidebar() });
menu.add("View/Toggle Minimap", { callback: () => toggleMinimap() });
menu.add("View/Toggle Theme", { callback: () => toggleTheme() });
menu.add("Go/Go to File", { callback: () => searchBox.input.focus() });
menu.add("Go/Next Editor", { callback: () => cycleEditor(1) });
menu.add("Go/Previous Editor", { callback: () => cycleEditor(-1) });
menu.add("Run/Run Current File", { callback: () => runCurrentFile() });
menu.add("Run/Run Tests", { callback: () => runTests() });
menu.add("Terminal/Toggle Terminal", { callback: () => toggleTerminal() });
menu.add("Terminal/Clear Terminal", { callback: () => terminal.clear() });
menu.add("Help/About LiteGUI Code", { callback: () => openAboutDialog() });
document.querySelector<HTMLElement>("#menubar-host")!.appendChild(menu.root);

/* activity bar */
const activityIcons = {
  explorer:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 3h9l7 7v11H4z"/><path d="M13 3v7h7"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5.5 5.5"/></svg>',
  scm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9v2a4 4 0 0 1-4 4H9"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
  extensions:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'
};

const activityBar = new Toolbar({
  orientation: "vertical",
  tools: [
    { id: "explorer", label: "Explorer", icon: activityIcons.explorer },
    { id: "search", label: "Search", icon: activityIcons.search },
    { id: "scm", label: "Source Control", icon: activityIcons.scm },
    { id: "run", label: "Run", icon: activityIcons.run },
    { id: "extensions", label: "Extensions", icon: activityIcons.extensions }
  ],
  active: "explorer"
});
activityBar.on("change", id => setSidebarView(String(id)));
document.querySelector<HTMLElement>("#activity-host")!.appendChild(activityBar.root);

/* sidebar */
const sidebarPanel = new Panel({ title: "Explorer", width: "100%", height: "100%", className: "app-sidebar-panel" });
document.querySelector<HTMLElement>("#sidebar-host")!.appendChild(sidebarPanel.root);
const sidebarBody = document.createElement("div");
sidebarBody.className = "app-sidebar-body";
sidebarPanel.content.appendChild(sidebarBody);

const explorerView = document.createElement("div");
explorerView.className = "app-explorer";
const treeHost = document.createElement("div");
treeHost.className = "app-tree";
explorerView.appendChild(treeHost);
sidebarBody.appendChild(explorerView);

const tree = new Tree(buildTreeData(project), {
  height: "100%",
  collapsed_depth: 10,
  allow_drag: false,
  allow_rename: false,
  allow_multiselection: false
});
treeHost.appendChild(tree.root);

/* editor tabs */
const editorTabs = new Tabs({ id: "editor-tabs" });
editorTabs.root.classList.add("app-editor-tabs");
editorStack.insertBefore(editorTabs.root, editorEmpty);
editorTabs.onchange = (id: string) => activateFile(id);

/* status bar */
const statusBar = new StatusBar({ left: "main" });
const statusErrors = statusItem("0 errors");
const statusWarnings = statusItem("0 warnings");
const statusPosition = statusItem("Ln 1, Col 1");
const statusEncoding = statusItem("UTF-8");
const statusLanguage = statusItem("Plain Text");
statusBar.setRight([statusErrors, statusWarnings, statusPosition, statusEncoding, statusLanguage]);
document.querySelector<HTMLElement>("#status-host")!.appendChild(statusBar.root);

function statusItem(text: string): HTMLElement {
  const element = document.createElement("span");
  element.className = "lg-status-bar__item";
  element.textContent = text;
  return element;
}

/* terminal */
const terminal = new Console({ prompt: "$" });
terminal.$input.placeholder = "Type a command (help)";
terminal.$input.setAttribute("aria-label", "Terminal command");
document.querySelector<HTMLElement>("#terminal-host")!.appendChild(terminal.root);
terminal.addMessage("LiteGUI Code terminal. Type help for commands.", "msglog");

/* search filter */
searchBox.input.addEventListener("input", () => {
  if (currentView !== "explorer") setSidebarView("explorer");
  else renderExplorerTree();
});
searchBox.input.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    searchBox.input.value = "";
    renderExplorerTree();
  }
});

/* ------------------------------------------------------------------ */
/* state                                                               */
/* ------------------------------------------------------------------ */

let currentView = "explorer";
let searchQuery = "";
let activePath: string | null = null;
let contextMenu: ContextMenu | null = null;
let untitledCount = 0;

interface OpenTab {
  path: string;
  file: FsFile;
  editor: TextEditor;
  tab: HTMLElement;
  titleElement: HTMLElement | null;
  dirty: boolean;
}

const openTabs = new Map<string, OpenTab>();

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function activeTab(): OpenTab | null {
  return activePath ? openTabs.get(activePath) ?? null : null;
}

function activeEditor(): TextEditor | null {
  return activeTab()?.editor ?? null;
}

function showToast(message: string): void {
  let toast = document.querySelector<HTMLElement>(".app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("app-toast--visible");
  window.clearTimeout((toast as any)._timer);
  (toast as any)._timer = window.setTimeout(() => toast?.classList.remove("app-toast--visible"), 1800);
}

function updateTabTitle(path: string): void {
  const record = openTabs.get(path);
  if (!record) return;
  if (record.titleElement) record.titleElement.textContent = `${record.dirty ? "● " : ""}${record.file.name}`;
}

function updateBreadcrumb(path: string | null): void {
  breadcrumb.innerHTML = "";
  if (!path) {
    breadcrumb.textContent = "No file open";
    return;
  }
  const parts = path.split("/");
  parts.forEach((part, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.className = "app-breadcrumb__sep";
      separator.textContent = "›";
      breadcrumb.appendChild(separator);
    }
    const segment = document.createElement("span");
    segment.className = "app-breadcrumb__segment";
    segment.textContent = part;
    breadcrumb.appendChild(segment);
  });
  const record = openTabs.get(path);
  if (record?.dirty) {
    const dot = document.createElement("span");
    dot.className = "app-breadcrumb__dirty";
    dot.textContent = "●";
    breadcrumb.appendChild(dot);
  }
}

function updateMinimap(file: FsFile | null): void {
  if (!file) {
    minimap.textContent = "";
    return;
  }
  const lines = file.content
    .split("\n")
    .slice(0, 180)
    .map(line => line.replace(/\t/g, "  ").slice(0, 64));
  minimap.textContent = lines.join("\n");
}

function updateCursorPosition(line: number, column: number): void {
  statusPosition.textContent = `Ln ${line}, Col ${column}`;
}

function computeCursor(editor: TextEditor): { line: number; column: number } {
  const value = editor.textarea.value;
  const position = editor.textarea.selectionStart || 0;
  const before = value.slice(0, position);
  const line = before.split("\n").length;
  const column = position - before.lastIndexOf("\n");
  return { line, column };
}

function updateStatusForEditor(editor: TextEditor | null): void {
  if (!editor) {
    statusPosition.textContent = "Ln 1, Col 1";
    return;
  }
  const { line, column } = computeCursor(editor);
  updateCursorPosition(line, column);
}

function setEmptyState(empty: boolean): void {
  editorEmpty.hidden = !empty;
  shell.classList.toggle("editor-empty-state", empty);
}

function highlightTreeFile(path: string | null): void {
  tree.root.querySelectorAll(".ltreeitem.selected").forEach(node => node.classList.remove("selected"));
  if (!path) return;
  const item = tree.root.querySelector<HTMLElement>(`.ltreeitem[data-item_id="${path}"]`);
  if (item) item.classList.add("selected");
}

/* ------------------------------------------------------------------ */
/* explorer                                                            */
/* ------------------------------------------------------------------ */

function renderExplorerTree(): void {
  searchQuery = searchBox.input.value.trim();
  const filtered = searchQuery ? filterTree(project, searchQuery.toLowerCase()) : project;
  const result = filtered ?? { ...project, children: [] };
  tree.updateTree(buildTreeData(result));
  highlightTreeFile(activePath);
  if (currentView === "explorer") {
    const resultCount = countFiles(filtered);
    sidebarPanel.setTitle(searchQuery ? `Explorer: ${resultCount} result${resultCount === 1 ? "" : "s"}` : "Explorer");
    explorerView.hidden = false;
  }
}

function setSidebarView(view: string): void {
  currentView = view;
  activityBar.setActive(view);
  sidebarBody.innerHTML = "";
  explorerView.hidden = view !== "explorer";

  if (view === "explorer") {
    sidebarBody.appendChild(explorerView);
    renderExplorerTree();
    return;
  }

  if (view === "search") {
    sidebarPanel.setTitle("Search");
    sidebarBody.appendChild(createSearchView());
    return;
  }

  if (view === "scm") {
    sidebarPanel.setTitle("Source Control");
    sidebarBody.appendChild(createSourceControlView());
    return;
  }

  if (view === "run") {
    sidebarPanel.setTitle("Run");
    sidebarBody.appendChild(createRunView());
    return;
  }

  sidebarPanel.setTitle("Extensions");
  sidebarBody.appendChild(createExtensionsView());
}

function createSearchView(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "app-sidebar-view";

  const box = new SearchBox("", { placeholder: "Search files" });
  const results = document.createElement("div");
  results.className = "app-search-results";

  const render = () => {
    const needle = box.input.value.trim().toLowerCase();
    results.innerHTML = "";
    if (!needle) {
      const empty = document.createElement("div");
      empty.className = "app-empty";
      empty.textContent = "Type to search across project files.";
      results.appendChild(empty);
      return;
    }
    const files = flattenFiles(project).filter(
      item =>
        item.name.toLowerCase().includes(needle) ||
        item.path.toLowerCase().includes(needle) ||
        item.content.toLowerCase().includes(needle)
    );
    if (!files.length) {
      const empty = document.createElement("div");
      empty.className = "app-empty";
      empty.textContent = "No results found.";
      results.appendChild(empty);
      return;
    }
    for (const item of files) {
      const row = document.createElement("div");
      row.className = "app-search-result";
      row.innerHTML = `<span class="app-search-result__name"></span><span class="app-search-result__path"></span>`;
      row.querySelector(".app-search-result__name")!.textContent = item.name;
      row.querySelector(".app-search-result__path")!.textContent = item.path;
      row.addEventListener("click", () => openFile(item.path));
      results.appendChild(row);
    }
  };

  box.input.addEventListener("input", render);
  wrap.append(box.root, results);
  render();
  return wrap;
}

function createSourceControlView(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "app-sidebar-view";
  const dirty = Array.from(openTabs.values()).filter(record => record.dirty);

  const header = document.createElement("div");
  header.className = "app-sidebar-heading";
  header.textContent = `main · ${dirty.length} change${dirty.length === 1 ? "" : "s"}`;
  wrap.appendChild(header);

  if (!dirty.length) {
    const empty = document.createElement("div");
    empty.className = "app-empty";
    empty.textContent = "No changes detected.";
    wrap.appendChild(empty);
    return wrap;
  }

  for (const record of dirty) {
    const row = document.createElement("div");
    row.className = "app-search-result";
    row.innerHTML = `<span class="app-search-result__name"></span><span class="app-search-result__path"></span>`;
    row.querySelector(".app-search-result__name")!.textContent = `M ${record.file.name}`;
    row.querySelector(".app-search-result__path")!.textContent = record.file.path;
    row.addEventListener("click", () => openFile(record.path));
    wrap.appendChild(row);
  }
  return wrap;
}

function createRunView(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "app-sidebar-view";

  const runButton = new Button("Run Current File", { callback: () => runCurrentFile() });
  const testsButton = new Button("Run Tests", { callback: () => runTests() });
  const output = document.createElement("pre");
  output.className = "app-run-output";
  output.textContent = "Ready.";

  wrap.append(runButton.root, testsButton.root, output);
  return wrap;
}

function createExtensionsView(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "app-sidebar-view";
  const extensions = [
    { name: "LiteGUI Components", publisher: "LiteGUI", version: "1.0.1" },
    { name: "LiteGUI Theme", publisher: "LiteGUI", version: "1.0.0" },
    { name: "TypeScript Language Basics", publisher: "LiteGUI", version: "1.0.0" }
  ];
  for (const extension of extensions) {
    const card = document.createElement("div");
    card.className = "app-extension";
    card.innerHTML = `<span class="app-extension__name"></span><span class="app-extension__meta"></span><span class="app-extension__state">Installed</span>`;
    card.querySelector(".app-extension__name")!.textContent = extension.name;
    card.querySelector(".app-extension__meta")!.textContent = `${extension.publisher} · v${extension.version}`;
    wrap.appendChild(card);
  }
  return wrap;
}

/* ------------------------------------------------------------------ */
/* editor tabs                                                         */
/* ------------------------------------------------------------------ */

function openFile(path: string): void {
  const existing = openTabs.get(path);
  if (existing) {
    editorTabs.selectTab(path);
    activateFile(path);
    return;
  }

  const source = findFile(path);
  if (!source) return;

  const editor = new TextEditor({
    value: source.content,
    language: source.language,
    title: source.name,
    showTabs: false,
    showFooter: false
  });

  const record: OpenTab = {
    path,
    file: source,
    editor,
    tab: null as unknown as HTMLElement,
    titleElement: null,
    dirty: false
  };
  openTabs.set(path, record);

  const tabInfo = editorTabs.addTab(path, { title: source.name, content: editor.root });
  record.tab = tabInfo.tab;
  record.titleElement = tabInfo.tab.querySelector<HTMLElement>(".lg-tabs__tab-title");

  const close = document.createElement("span");
  close.className = "app-tab-close";
  close.textContent = "×";
  close.title = "Close";
  close.setAttribute("role", "button");
  close.setAttribute("aria-label", `Close ${source.name}`);
  close.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    closeFile(path);
  });
  tabInfo.tab.appendChild(close);

  editor.on("change", ({ value }: { value: string }) => {
    source.content = value;
    record.dirty = true;
    updateTabTitle(path);
    if (activePath === path) {
      updateMinimap(source);
      updateBreadcrumb(path);
    }
  });

  editor.on("cursor", ({ line, column }: { line: number; column: number }) => {
    if (activePath === path) updateCursorPosition(line, column);
  });

  editorTabs.selectTab(path);
  activateFile(path);
  editor.focus();
}

function activateFile(path: string): void {
  const record = openTabs.get(path);
  if (!record) return;
  activePath = path;
  setEmptyState(false);
  updateBreadcrumb(path);
  updateMinimap(record.file);
  statusLanguage.textContent = record.file.language;
  statusEncoding.textContent = "UTF-8";
  updateStatusForEditor(record.editor);
  highlightTreeFile(path);
}

function closeFile(path: string): void {
  const record = openTabs.get(path);
  if (!record) return;

  const wasActive = activePath === path;
  const ids = Array.from(editorTabs.list.querySelectorAll<HTMLElement>(".lg-tabs__tab")).map(tab => tab.dataset.id);
  const index = ids.indexOf(path);

  editorTabs.removeTab(path);
  openTabs.delete(path);

  if (!wasActive) {
    if (!openTabs.size) setEmptyState(true);
    return;
  }

  const remaining = Array.from(editorTabs.list.querySelectorAll<HTMLElement>(".lg-tabs__tab")).map(
    tab => tab.dataset.id
  );
  if (remaining.length) {
    const nextId = remaining[Math.min(index, remaining.length - 1)];
    editorTabs.selectTab(nextId);
    activateFile(nextId);
  } else {
    editorTabs.current_tab = null;
    editorTabs.selected = null;
    activePath = null;
    setEmptyState(true);
    updateBreadcrumb(null);
    updateStatusForEditor(null);
    updateMinimap(null);
    statusLanguage.textContent = "Plain Text";
    highlightTreeFile(null);
  }
}

function cycleEditor(direction: number): void {
  const ids = Array.from(editorTabs.list.querySelectorAll<HTMLElement>(".lg-tabs__tab")).map(tab => tab.dataset.id);
  if (!ids.length) return;
  const current = activePath ? ids.indexOf(activePath) : 0;
  const next = (current + direction + ids.length) % ids.length;
  editorTabs.selectTab(ids[next]);
  activateFile(ids[next]);
}

/* ------------------------------------------------------------------ */
/* file operations                                                     */
/* ------------------------------------------------------------------ */

function newFile(): void {
  untitledCount += 1;
  const target = findFolder("src") ?? project;
  const name = `untitled-${untitledCount}.ts`;
  const next = file(name, "TypeScript", `// ${name}\n`);
  target.children.push(next);
  assignPaths(project);
  renderExplorerTree();
  openFile(next.path);
  showToast(`Created ${next.path}`);
}

function saveActiveFile(): void {
  const record = activeTab();
  if (!record) {
    showToast("No file is open.");
    return;
  }
  record.dirty = false;
  updateTabTitle(record.path);
  updateBreadcrumb(record.path);
  showToast(`Saved ${record.file.name}`);
}

function editCommand(command: "undo" | "redo"): void {
  const editor = activeEditor();
  if (!editor) return;
  editor.textarea.focus();
  document.execCommand(command);
}

function deleteFile(path: string): void {
  const parent = findParentFolder(path);
  if (!parent) return;
  const index = parent.children.findIndex(child => child.path === path);
  if (index === -1) return;
  const removed = parent.children.splice(index, 1)[0];
  if (openTabs.has(path)) closeFile(path);
  renderExplorerTree();
  showToast(`Deleted ${removed.name}`);
}

function copyPath(path: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(path).then(
      () => showToast(`Copied ${path}`),
      () => showToast(path)
    );
  } else {
    showToast(path);
  }
}

/* ------------------------------------------------------------------ */
/* terminal / run                                                      */
/* ------------------------------------------------------------------ */

function setTerminalOpen(open: boolean): void {
  terminalDrawer.hidden = !open;
  if (open) terminal.$input.focus();
}

function toggleTerminal(): void {
  setTerminalOpen(terminalDrawer.hidden);
}

function runCurrentFile(): void {
  setTerminalOpen(true);
  const record = activeTab();
  if (!record) {
    terminal.addMessage("No file is open.", "warn");
    return;
  }
  terminal.addMessage(`$ run ${record.file.path}`, "me");
  terminal.addMessage(`Running ${record.file.name}...`, "msglog");
  window.setTimeout(() => terminal.addMessage("Process finished with exit code 0.", "good"), 400);
  showToast(`Running ${record.file.name}`);
}

function runTests(): void {
  setTerminalOpen(true);
  terminal.addMessage("$ run tests", "me");
  terminal.addMessage("Running test suite...", "msglog");
  window.setTimeout(() => terminal.addMessage("All tests passed (12).", "good"), 500);
  showToast("Running tests");
}

terminal.onProcessCommand = (command: string) => {
  const value = command.trim();
  const lower = value.toLowerCase();
  if (!value) return;
  if (lower === "help") {
    terminal.addMessage("Commands: help, clear, ls, cat FILE, pwd, run", "msglog");
  } else if (lower === "clear") {
    terminal.clear();
  } else if (lower === "ls") {
    terminal.addMessage(project.children.map(child => child.name).join("  "), "msglog");
  } else if (lower.startsWith("cat ")) {
    const target = findFile(value.slice(4).trim());
    if (target) terminal.addMessage(target.content, "msglog", true);
    else terminal.addMessage(`cat: ${value.slice(4).trim()}: No such file`, "warn");
  } else if (lower === "pwd") {
    terminal.addMessage(activePath ? activePath.split("/").slice(0, -1).join("/") || "/" : "/", "msglog");
  } else if (lower === "run") {
    runCurrentFile();
  } else {
    terminal.addMessage(`command not found: ${value}`, "warn");
  }
};
document.querySelector<HTMLElement>("#terminal-close")!.addEventListener("click", () => setTerminalOpen(false));

/* ------------------------------------------------------------------ */
/* command palette                                                     */
/* ------------------------------------------------------------------ */

interface Command {
  label: string;
  keys?: string;
  run: () => void;
}

const commands: Command[] = [
  { label: "File: New File", keys: "Ctrl+N", run: () => newFile() },
  { label: "File: Save", keys: "Ctrl+S", run: () => saveActiveFile() },
  { label: "File: Close Editor", run: () => activePath && closeFile(activePath) },
  { label: "View: Toggle Theme", run: () => toggleTheme() },
  { label: "View: Toggle Sidebar", keys: "Ctrl+B", run: () => toggleSidebar() },
  { label: "View: Toggle Minimap", run: () => toggleMinimap() },
  { label: "Go: Go to File", keys: "Ctrl+P", run: () => searchBox.input.focus() },
  { label: "Go: Next Editor", run: () => cycleEditor(1) },
  { label: "Go: Previous Editor", run: () => cycleEditor(-1) },
  { label: "Run: Run Current File", run: () => runCurrentFile() },
  { label: "Run: Run Tests", run: () => runTests() },
  { label: "Terminal: Toggle Terminal", keys: "Ctrl+`", run: () => toggleTerminal() },
  { label: "Help: About LiteGUI Code", run: () => openAboutDialog() }
];

const palette = document.querySelector<HTMLElement>("#command-palette")!;
const paletteInput = document.querySelector<HTMLInputElement>("#command-input")!;
const paletteList = document.querySelector<HTMLElement>("#command-list")!;
let paletteResults: Command[] = [];
let paletteIndex = 0;

function renderCommandList(): void {
  const query = paletteInput.value.trim().toLowerCase();
  paletteResults = commands.filter(command => command.label.toLowerCase().includes(query));
  paletteIndex = 0;
  paletteList.innerHTML = "";

  if (!paletteResults.length) {
    const empty = document.createElement("div");
    empty.className = "app-command-empty";
    empty.textContent = "No commands found.";
    paletteList.appendChild(empty);
    return;
  }

  paletteResults.forEach((command, index) => {
    const item = document.createElement("div");
    item.className = "app-command-item" + (index === 0 ? " app-command-item--active" : "");
    const label = document.createElement("span");
    label.textContent = command.label;
    const keys = document.createElement("span");
    keys.className = "app-command-item__keys";
    keys.textContent = command.keys ?? "";
    item.append(label, keys);
    item.addEventListener("click", () => {
      paletteIndex = index;
      runPaletteCommand();
    });
    paletteList.appendChild(item);
  });
}

function setPaletteIndex(index: number): void {
  if (!paletteResults.length) return;
  paletteIndex = (index + paletteResults.length) % paletteResults.length;
  const items = paletteList.querySelectorAll<HTMLElement>(".app-command-item");
  items.forEach((item, i) => item.classList.toggle("app-command-item--active", i === paletteIndex));
  items[paletteIndex]?.scrollIntoView({ block: "nearest" });
}

function runPaletteCommand(): void {
  const command = paletteResults[paletteIndex];
  if (!command) return;
  closeCommandPalette();
  command.run();
}

function openCommandPalette(): void {
  palette.hidden = false;
  paletteInput.value = "";
  renderCommandList();
  paletteInput.focus();
}

function closeCommandPalette(): void {
  palette.hidden = true;
}

paletteInput.addEventListener("input", renderCommandList);
paletteInput.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setPaletteIndex(paletteIndex + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    setPaletteIndex(paletteIndex - 1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    runPaletteCommand();
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeCommandPalette();
  }
});
palette.querySelectorAll<HTMLElement>("[data-close]").forEach(element => {
  element.addEventListener("click", () => closeCommandPalette());
});

/* ------------------------------------------------------------------ */
/* misc actions                                                        */
/* ------------------------------------------------------------------ */

function toggleSidebar(): void {
  shell.classList.toggle("sidebar-hidden");
}

function toggleMinimap(): void {
  shell.classList.toggle("minimap-hidden");
}

function toggleTheme(): void {
  const light = document.documentElement.dataset.lgTheme !== "light";
  if (light) document.documentElement.dataset.lgTheme = "light";
  else delete document.documentElement.dataset.lgTheme;
  themeButton.content.textContent = light ? "Dark theme" : "Light theme";
  showToast(light ? "Light theme" : "Dark theme");
}

function openAboutDialog(): void {
  const dialog = new Dialog({
    title: "About LiteGUI Code",
    width: 440,
    height: 230,
    close: true,
    className: "app-about-dialog",
    content: `
      <div class="app-about">
        <strong>LiteGUI Code</strong>
        <span>Version 1.0.0</span>
        <span>A VS Code-style editor built with LiteGUI components.</span>
      </div>
    `,
    buttons: [{ name: "Close", close: true }]
  });
  dialog.show();
  dialog.root.style.position = "fixed";
  dialog.root.style.zIndex = "3000";
  const rect = dialog.root.getBoundingClientRect();
  dialog.root.style.left = `${Math.max(12, Math.round((window.innerWidth - rect.width) / 2))}px`;
  dialog.root.style.top = `${Math.max(12, Math.round((window.innerHeight - rect.height) / 2))}px`;
}

/* ------------------------------------------------------------------ */
/* tree events                                                         */
/* ------------------------------------------------------------------ */

tree.root.addEventListener("item_selected", (event: CustomEvent) => {
  const data = event.detail?.data;
  if (data?.filePath) openFile(data.filePath);
});

tree.root.addEventListener(
  "contextmenu",
  (event: MouseEvent) => {
    const item = (event.target as HTMLElement).closest?.(".ltreeitem") as (HTMLElement & { data?: any }) | null;
    const data = item?.data;
    if (!data?.filePath) return;
    event.preventDefault();
    event.stopPropagation();
    contextMenu?.close();
    contextMenu = new ContextMenu(
      [
        { title: "Open", callback: () => openFile(data.filePath) },
        { title: "Copy Path", callback: () => copyPath(data.filePath) },
        null,
        { title: "Delete", callback: () => deleteFile(data.filePath) }
      ],
      { event, title: data.name }
    );
  },
  true
);

document.addEventListener("contextmenu", event => {
  if ((event.target as HTMLElement).closest?.(".ltreeitem")) return;
  contextMenu?.close();
});

/* ------------------------------------------------------------------ */
/* keyboard shortcuts                                                  */
/* ------------------------------------------------------------------ */

document.addEventListener("keydown", event => {
  const modifier = event.ctrlKey || event.metaKey;
  if (!modifier) return;
  const key = event.key.toLowerCase();

  if (event.shiftKey && key === "p") {
    event.preventDefault();
    openCommandPalette();
  } else if (key === "p" && !event.shiftKey) {
    event.preventDefault();
    searchBox.input.focus();
  } else if (key === "s") {
    event.preventDefault();
    saveActiveFile();
  } else if (key === "b") {
    event.preventDefault();
    toggleSidebar();
  } else if (key === "`") {
    event.preventDefault();
    toggleTerminal();
  }
});

/* ------------------------------------------------------------------ */
/* boot                                                                */
/* ------------------------------------------------------------------ */

setSidebarView("explorer");
openFile("src/main.ts");
