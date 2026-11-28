// @ts-nocheck
import "@gausszhou/litegui-components/style.css";
import "./app.css";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/editor/editor.worker.js?worker";
import jsonWorker from "monaco-editor/language/json/json.worker.js?worker";
import cssWorker from "monaco-editor/language/css/css.worker.js?worker";
import htmlWorker from "monaco-editor/language/html/html.worker.js?worker";
import tsWorker from "monaco-editor/language/typescript/ts.worker.js?worker";
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
  Toolbar,
  Tree
} from "@gausszhou/litegui-components";

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less") return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor") return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  }
};

// The demo project lives in memory only, so module resolution diagnostics are noise.
monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
});
monaco.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
});

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
      <div class="app-activity">
        <div class="app-activity__tools" id="activity-host"></div>
        <div class="app-activity__bottom">
          <button
            type="button"
            class="app-activity__action"
            id="account-button"
            data-menu-anchor
            title="Accounts"
            aria-label="Accounts"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M5.6 18.2a7.6 7.6 0 0 1 12.8 0"/></svg>
          </button>
          <button
            type="button"
            class="app-activity__action"
            id="manage-button"
            data-menu-anchor
            title="Manage"
            aria-label="Manage"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>
      <aside class="app-sidebar" id="sidebar-host"></aside>

      <main class="app-editor-area">
        <div class="app-breadcrumb" id="breadcrumb">No file open</div>
        <div class="app-editor-main">
          <div class="app-editor-stack" id="editor-stack">
            <div class="app-editor-empty" id="editor-empty">
              <strong>LiteGUI VS Code</strong>
              <span>Open a file from the Explorer</span>
              <span>Press Ctrl+Shift+P for commands</span>
            </div>
          </div>
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

const project: FsFolder = dir("litegui-vscode", [
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
    <title>LiteGUI VS Code</title>
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
    `# LiteGUI VS Code

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
  "name": "litegui-vscode",
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

let openTabsReady = false;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character] ?? character;
  });
}

const FILE_BADGES: Record<string, { label: string; className: string }> = {
  ts: { label: "TS", className: "ts" },
  js: { label: "JS", className: "js" },
  json: { label: "{}", className: "json" },
  css: { label: "#", className: "css" },
  html: { label: "<>", className: "html" },
  md: { label: "M↓", className: "md" },
  svg: { label: "SVG", className: "svg" },
  xml: { label: "XML", className: "xml" },
  txt: { label: "TXT", className: "default" }
};

function fileBadge(name: string): { label: string; className: string } {
  if (name === "package.json") return { label: "n", className: "npm" };
  if (name === ".gitignore") return { label: "G", className: "default" };
  const extension = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  return FILE_BADGES[extension] ?? { label: extension ? extension.slice(0, 2).toUpperCase() : "•", className: "default" };
}

function fileIconHtml(name: string): string {
  const badge = fileBadge(name);
  return `<span class="app-file-icon app-file-icon--${badge.className}">${badge.label}</span>`;
}

function folderIconHtml(): string {
  return '<span class="app-folder-icon"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.6 3.4h4.2l1.4 1.7h7.2v7.3a1.1 1.1 0 0 1-1.1 1.1H2.7a1.1 1.1 0 0 1-1.1-1.1z"/></svg></span>';
}

const SEEDED_GIT: Record<string, string> = {
  "package.json": "R",
  "public/index.html": "R"
};

function folderHasChanges(path: string): boolean {
  if (!path) return false;
  if (path === "src") return true;
  const prefix = `${path}/`;
  if (Object.keys(SEEDED_GIT).some(file => file.startsWith(prefix))) return true;
  if (!openTabsReady) return false;
  return Array.from(openTabs.entries()).some(([openPath, record]) => record.dirty && openPath.startsWith(prefix));
}

function gitDecoration(path: string, isFolder: boolean): string {
  if (isFolder) {
    return folderHasChanges(path) ? '<span class="app-git-dot" title="Uncommitted changes"></span>' : "";
  }
  let letter = SEEDED_GIT[path] ?? "";
  if (path.startsWith("src/untitled-")) letter = "U";
  if (openTabsReady && openTabs.get(path)?.dirty) letter = "M";
  if (!letter) return "";
  const titles: Record<string, string> = { R: "Renamed", M: "Modified", U: "Untracked", D: "Deleted" };
  return `<span class="app-git-badge app-git-badge--${letter}" title="${titles[letter] ?? "Changed"}">${letter}</span>`;
}

const TREE_ACTION_ICONS: Record<string, string> = {
  "new-file":
    '<path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6z"/><path d="M9 2v4h4"/><path d="M11.5 11.5h-3"/><path d="M10 10v3"/>',
  "new-folder":
    '<path d="M1.5 4h4.3l1.5 1.8h7.2V13a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1z"/><path d="M8 8.5v4"/><path d="M6 10.5h4"/>',
  refresh:
    '<path d="M13.5 8A5.5 5.5 0 0 0 3.3 6"/><path d="M2.5 8V4.5H6"/><path d="M2.5 8a5.5 5.5 0 0 0 10.2 2"/><path d="M13.5 8v3.5H10"/>',
  "collapse-all":
    '<rect x="2.5" y="3.5" width="11" height="9" rx="1"/><path d="m6.5 6 2 2-2 2"/><path d="m10 6-2 2 2 2"/>'
};

function treeActionsHtml(): string {
  const actions: Array<[string, string]> = [
    ["new-file", "New File"],
    ["new-folder", "New Folder"],
    ["refresh", "Refresh Explorer"],
    ["collapse-all", "Collapse Folders"]
  ];
  const buttons = actions
    .map(
      ([action, label]) =>
        `<button type="button" class="app-tree-action" data-tree-action="${action}" title="${label}" aria-label="${label}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TREE_ACTION_ICONS[action]}</svg></button>`
    )
    .join("");
  return `<span class="app-tree-actions">${buttons}</span>`;
}

const collapsedFolders = new Set<string>();

function folderCaretHtml(path: string): string {
  const collapsed = collapsedFolders.has(path);
  return `<span class="app-folder-caret${collapsed ? " app-folder-caret--collapsed" : ""}" data-folder-path="${path}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg></span>`;
}

function buildTreeData(node: FsNode): any {
  if (node.kind === "file") {
    return {
      id: node.path,
      content: `<span class="app-tree-caret-spacer"></span>${fileIconHtml(node.name)}<span class="app-tree-name">${escapeHtml(node.name)}</span>`,
      postcontent: gitDecoration(node.path, false),
      filePath: node.path,
      name: node.name
    };
  }
  const isRoot = node.path === "";
  return {
    id: isRoot ? "dir:root" : `dir:${node.path}`,
    content: `${folderCaretHtml(node.path)}${isRoot ? "" : folderIconHtml()}<span class="app-tree-name">${escapeHtml(node.name)}</span>`,
    postcontent: isRoot ? treeActionsHtml() : gitDecoration(node.path, true),
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

const TITLEBAR_ICONS = {
  back: '<path d="M15 4 7 12l8 8"/>',
  forward: '<path d="m9 4 8 8-8 8"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chat:
    '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20.5l1.4-4.4a8.5 8.5 0 1 1 15.1-4.6Z"/>' +
    '<path d="M12.9 6.6 13.7 8.6 15.7 9.4 13.7 10.2 12.9 12.2 12.1 10.2 10.1 9.4 12.1 8.6Z" fill="currentColor" stroke="none"/>',
  layoutSidebar:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><rect x="12.8" y="7.4" width="4.6" height="3.6" rx="1"/><rect x="12.8" y="13" width="4.6" height="3.6" rx="1"/>',
  layoutActivity:
    '<path d="M3 6a2 2 0 0 1 2-2h7v16H5a2 2 0 0 1-2-2z" fill="currentColor" stroke="none"/>' +
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
  layoutPanel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 14h18"/>',
  layoutCustomize:
    '<rect x="3.5" y="4.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="4.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="13" width="6.5" height="6.5" rx="1"/><rect x="14" y="13" width="6.5" height="6.5" rx="1"/>'
};

function titlebarIcon(name: keyof typeof TITLEBAR_ICONS): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TITLEBAR_ICONS[name]}</svg>`;
}

function createTitlebarButton(className: string, label: string, html: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = html;
  return button;
}

const brandLogo = document.createElement("span");
brandLogo.className = "app-titlebar__logo";
brandLogo.title = "LiteGUI VS Code";
brandLogo.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4.5"/><path d="m10.2 8.6-3.2 3.4 3.2 3.4"/><path d="m13.8 8.6 3.2 3.4-3.2 3.4"/></svg>`;
titlebar.setLeft(brandLogo);

const searchBox = new SearchBox("", { placeholder: "LiteGUI VS Code" });
searchBox.root.classList.add("app-command-center__field");

const titlebarBack = createTitlebarButton("app-titlebar__icon-button", "Go Back", titlebarIcon("back"));
titlebarBack.id = "nav-back";
titlebarBack.disabled = true;

const titlebarForward = createTitlebarButton("app-titlebar__icon-button", "Go Forward", titlebarIcon("forward"));
titlebarForward.id = "nav-forward";
titlebarForward.disabled = true;

const commandCenter = document.createElement("div");
commandCenter.className = "app-command-center";
const commandDivider = document.createElement("span");
commandDivider.className = "app-command-center__divider";
const chatButton = createTitlebarButton("app-command-center__button", "Open Chat", titlebarIcon("chat"));
const chatMenuButton = createTitlebarButton(
  "app-command-center__button app-command-center__more",
  "Chat options",
  titlebarIcon("chevronDown")
);
chatMenuButton.setAttribute("data-menu-anchor", "");
chatMenuButton.setAttribute("aria-haspopup", "menu");
chatMenuButton.setAttribute("aria-expanded", "false");
commandCenter.append(searchBox.root, commandDivider, chatButton, chatMenuButton);

const avatarButton = document.createElement("button");
avatarButton.type = "button";
avatarButton.className = "app-titlebar__avatar";
avatarButton.id = "titlebar-account";
avatarButton.setAttribute("data-menu-anchor", "");
avatarButton.setAttribute("aria-label", "Accounts");
avatarButton.setAttribute("aria-haspopup", "menu");
avatarButton.setAttribute("aria-expanded", "false");
avatarButton.title = "Accounts";

const titlebarCenter = document.createElement("div");
titlebarCenter.className = "app-titlebar__center";
titlebarCenter.append(titlebarBack, titlebarForward, commandCenter, avatarButton);
titlebar.setCenter(titlebarCenter);

const layoutSidebarButton = createTitlebarButton(
  "app-titlebar__layout",
  "Toggle Primary Side Bar",
  titlebarIcon("layoutSidebar")
);
layoutSidebarButton.id = "layout-sidebar";
const layoutActivityButton = createTitlebarButton(
  "app-titlebar__layout",
  "Toggle Activity Bar",
  titlebarIcon("layoutActivity")
);
layoutActivityButton.id = "layout-activity";
const layoutPanelButton = createTitlebarButton("app-titlebar__layout", "Toggle Panel", titlebarIcon("layoutPanel"));
layoutPanelButton.id = "layout-panel";
const layoutCustomizeButton = createTitlebarButton(
  "app-titlebar__layout",
  "Customize Layout",
  titlebarIcon("layoutCustomize")
);
layoutCustomizeButton.id = "layout-customize";
layoutCustomizeButton.setAttribute("data-menu-anchor", "");
layoutCustomizeButton.setAttribute("aria-haspopup", "menu");
layoutCustomizeButton.setAttribute("aria-expanded", "false");
titlebar.setRight([layoutSidebarButton, layoutActivityButton, layoutPanelButton, layoutCustomizeButton]);

document.querySelector<HTMLElement>("#titlebar-host")!.appendChild(titlebar.root);

/* title bar history navigation + layout state */
const navigationHistory: string[] = [];
let navigationIndex = -1;

function updateNavButtons(): void {
  titlebarBack.disabled = navigationIndex <= 0;
  titlebarForward.disabled = navigationIndex >= navigationHistory.length - 1;
}

function pushNavigation(path: string): void {
  if (navigationIndex >= 0 && navigationHistory[navigationIndex] === path) {
    updateNavButtons();
    return;
  }
  navigationHistory.splice(navigationIndex + 1);
  navigationHistory.push(path);
  if (navigationHistory.length > 80) navigationHistory.shift();
  navigationIndex = navigationHistory.length - 1;
  updateNavButtons();
}

function stepNavigation(delta: number): void {
  let next = navigationIndex + delta;
  while (next >= 0 && next < navigationHistory.length && !findFile(navigationHistory[next])) {
    next += delta;
  }
  if (next < 0 || next >= navigationHistory.length) return;
  navigationIndex = next;
  openFile(navigationHistory[next]);
  updateNavButtons();
}

function syncTitlebarControls(): void {
  layoutSidebarButton.setAttribute("aria-pressed", String(!shell.classList.contains("sidebar-hidden")));
  layoutActivityButton.setAttribute("aria-pressed", String(!shell.classList.contains("activity-hidden")));
  layoutPanelButton.setAttribute("aria-pressed", String(!terminalDrawer.hidden));
}

titlebarBack.addEventListener("click", () => stepNavigation(-1));
titlebarForward.addEventListener("click", () => stepNavigation(1));
layoutSidebarButton.addEventListener("click", () => toggleSidebar());
layoutActivityButton.addEventListener("click", () => toggleActivityBar());
layoutPanelButton.addEventListener("click", () => toggleTerminal());
layoutCustomizeButton.addEventListener("click", () =>
  toggleLauncherMenu("layout", layoutCustomizeButton, buildLayoutMenu())
);
chatButton.addEventListener("click", () => showToast("Chat is not available in this demo."));
chatMenuButton.addEventListener("click", () => toggleLauncherMenu("chat", chatMenuButton, buildChatMenu()));
avatarButton.addEventListener("click", () => toggleLauncherMenu("titlebar-account", avatarButton, buildAccountMenu()));
commandCenter.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  if (target.closest(".app-command-center__button")) return;
  searchBox.input.focus();
});

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
menu.add("Selection/Select All", { callback: () => selectAllActive() });
menu.add("Selection/Expand Selection", {
  callback: () => activeEditor()?.trigger("app", "editor.action.smartSelect.expand", null)
});
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
menu.add("Help/About LiteGUI VS Code", { callback: () => openAboutDialog() });
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

/* bottom-left launcher buttons (Accounts / Manage) */
const accountButton = document.querySelector<HTMLButtonElement>("#account-button")!;
const manageButton = document.querySelector<HTMLButtonElement>("#manage-button")!;
accountButton.addEventListener("click", () => toggleLauncherMenu("account", accountButton, buildAccountMenu()));
manageButton.addEventListener("click", () => toggleLauncherMenu("manage", manageButton, buildManageMenu()));

/* sidebar */
const sidebarPanel = new Panel({ title: "Explorer", width: "100%", height: "100%", className: "app-sidebar-panel" });
document.querySelector<HTMLElement>("#sidebar-host")!.appendChild(sidebarPanel.root);

const explorerMenuButton = document.createElement("button");
explorerMenuButton.type = "button";
explorerMenuButton.className = "app-sidebar__menu";
explorerMenuButton.textContent = "…";
explorerMenuButton.title = "Views and More Actions";
explorerMenuButton.setAttribute("aria-label", "Views and More Actions");
explorerMenuButton.setAttribute("data-menu-anchor", "");
explorerMenuButton.setAttribute("aria-haspopup", "menu");
explorerMenuButton.setAttribute("aria-expanded", "false");
sidebarPanel.header.appendChild(explorerMenuButton);
explorerMenuButton.addEventListener("click", () =>
  toggleLauncherMenu("sidebar-menu", explorerMenuButton, buildSidebarMenu())
);
const sidebarBody = document.createElement("div");
sidebarBody.className = "app-sidebar-body";
sidebarPanel.content.appendChild(sidebarBody);

const explorerView = document.createElement("div");
explorerView.className = "app-explorer";
const treeHost = document.createElement("div");
treeHost.className = "app-tree";
explorerView.appendChild(treeHost);
sidebarBody.appendChild(explorerView);

const timelineView = document.createElement("div");
timelineView.className = "app-timeline";
timelineView.innerHTML = `
  <button type="button" class="app-timeline__header" aria-expanded="false">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>
    <span>Timeline</span>
  </button>
  <div class="app-timeline__body" hidden></div>
`;
const timelineToggle = timelineView.querySelector<HTMLButtonElement>(".app-timeline__header")!;
const timelineBody = timelineView.querySelector<HTMLElement>(".app-timeline__body")!;
timelineToggle.addEventListener("click", () => {
  const open = timelineView.classList.toggle("app-timeline--open");
  timelineBody.hidden = !open;
  timelineToggle.setAttribute("aria-expanded", String(open));
  if (open) renderTimeline();
});

const tree = new Tree(buildTreeData(project), {
  height: "100%",
  collapsed_depth: 10,
  allow_drag: false,
  allow_rename: false,
  allow_multiselection: false
});
treeHost.appendChild(tree.root);

tree.root.addEventListener(
  "click",
  event => {
    const target = event.target as HTMLElement;
    const button = target.closest?.("[data-tree-action]") as HTMLElement | null;
    if (button) {
      event.preventDefault();
      event.stopPropagation();
      const action = button.dataset.treeAction;
      if (action === "new-file") newFile();
      else if (action === "new-folder") newFolder();
      else if (action === "refresh") renderExplorerTree();
      else if (action === "collapse-all") collapseAllFolders();
      return;
    }
    const caret = target.closest?.("[data-folder-path]") as HTMLElement | null;
    if (caret) {
      event.preventDefault();
      event.stopPropagation();
      toggleFolder(caret.dataset.folderPath ?? "");
      return;
    }
    const row = target.closest?.(".ltreeitem") as HTMLElement | null;
    const itemId = row?.dataset.item_id ?? "";
    if (itemId.startsWith("dir:")) {
      // 让 Tree 先处理选中，再切换目录展开状态（与 VS Code 单击目录行一致）。
      const folderPath = itemId === "dir:root" ? "" : itemId.slice(4);
      window.setTimeout(() => toggleFolder(folderPath), 0);
    }
  },
  true
);

/* editor tabs */
const editorTabs = new Tabs({ id: "editor-tabs" });
editorTabs.root.classList.add("app-editor-tabs");
editorStack.insertBefore(editorTabs.root, editorEmpty);
editorTabs.onchange = (id: string) => activateFile(id);

/* status bar */
const statusBar = new StatusBar();
document.querySelector<HTMLElement>("#status-host")!.appendChild(statusBar.root);
statusBar.leftElement.classList.add("app-status__left");
statusBar.rightElement.classList.add("app-status__right");

const STATUS_ICONS = {
  remote: '<path d="m9 5-5 4 5 4"/><path d="m15 5 5 4-5 4"/>',
  branch:
    '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9v2a4 4 0 0 1-4 4H9"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.9-3"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.9 3"/><path d="M20 20v-4h-4"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  warning: '<path d="M12 3 2.5 20h19z"/><path d="M12 9.5v4.5"/><path d="M12 18v.01"/>',
  layout:
    '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  formatter: '<path d="m5 19 .8-3.2L16.6 5a2.1 2.1 0 0 1 3 3L8.8 18.8z"/><path d="m14.8 6.8 2.9 2.9"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 9h18c0-2-3-3-3-9"/><path d="M10 21h4"/>'
};

function statusIcon(name: keyof typeof STATUS_ICONS): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${STATUS_ICONS[name]}</svg>`;
}

function statusItem(text: string): HTMLElement {
  const element = document.createElement("span");
  element.className = "app-status__item";
  element.textContent = text;
  return element;
}

function statusIconItem(name: keyof typeof STATUS_ICONS, label: string, title: string): HTMLElement {
  const element = document.createElement("span");
  element.className = "app-status__item";
  element.title = title;
  element.innerHTML = `<span class="app-status__icon">${statusIcon(name)}</span>`;
  if (label) {
    const text = document.createElement("span");
    text.className = "app-status__label";
    text.textContent = label;
    element.appendChild(text);
  }
  return element;
}

const remoteItem = statusIconItem("remote", "", "Open a Remote Window");
remoteItem.classList.add("app-status__item--remote");

const branchLabel = document.createElement("span");
branchLabel.className = "app-status__branch-name";
branchLabel.textContent = "master";

const branchItem = document.createElement("span");
branchItem.className = "app-status__item";
branchItem.title = "Git branch: master";
branchItem.innerHTML = `<span class="app-status__icon">${statusIcon("branch")}</span>`;
branchItem.appendChild(branchLabel);

const syncItem = statusIconItem("sync", "", "Synchronize Changes");
const errorsItem = statusIconItem("error", "0", "No errors");
const warningsItem = statusIconItem("warning", "0", "No warnings");
const errorsLabel = errorsItem.querySelector<HTMLElement>(".app-status__label")!;
const warningsLabel = warningsItem.querySelector<HTMLElement>(".app-status__label")!;
const gitGraphItem = statusItem("Git Graph");
gitGraphItem.title = "Git Graph";
const remoteNameItem = statusItem("LiteGUI Dev Space: local");
remoteNameItem.title = "Remote environment";

statusBar.leftElement.append(remoteItem, branchItem, syncItem, errorsItem, warningsItem, gitGraphItem, remoteNameItem);

const statusPosition = statusItem("Ln 1, Col 1");
const statusSpaces = statusItem("Spaces: 2");
const statusEncoding = statusItem("UTF-8");
const statusEol = statusItem("LF");

const statusLanguage = document.createElement("span");
statusLanguage.id = "status-language";
statusLanguage.className = "app-status__item app-status__item--clickable";
statusLanguage.title = "Select language mode";
statusLanguage.setAttribute("data-menu-anchor", "");
statusLanguage.innerHTML =
  '<span class="app-status__icon app-status__lang-icon"></span><span class="app-status__label"></span>';

const LANGUAGE_ICONS: Record<string, string> = {
  JSON: "{}",
  TypeScript: "TS",
  JavaScript: "JS",
  CSS: "#",
  HTML: "<>",
  XML: "<>",
  Markdown: "M↓",
  "Plain Text": "TXT"
};

function setStatusLanguage(language: string): void {
  const icon = statusLanguage.querySelector<HTMLElement>(".app-status__lang-icon")!;
  const label = statusLanguage.querySelector<HTMLElement>(".app-status__label")!;
  icon.textContent = LANGUAGE_ICONS[language] ?? "TXT";
  label.textContent = language;
}

const LANGUAGE_MODES: Array<{ id: string; label: string }> = [
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "json", label: "JSON" },
  { id: "css", label: "CSS" },
  { id: "html", label: "HTML" },
  { id: "markdown", label: "Markdown" },
  { id: "xml", label: "XML" },
  { id: "plaintext", label: "Plain Text" }
];

function buildLanguageMenu(): FlyoutItem[] {
  const current = activeTab()?.file.language ?? "Plain Text";
  return LANGUAGE_MODES.map(mode => ({
    label: mode.label,
    checked: mode.label === current,
    action: () => applyLanguage(mode)
  }));
}

function applyLanguage(mode: { id: string; label: string }): void {
  const record = activeTab();
  const model = record?.editor.getModel();
  if (!record || !model) return;
  monaco.editor.setModelLanguage(model, mode.id);
  record.file.language = mode.label;
  setStatusLanguage(mode.label);
  showToast(`Language: ${mode.label}`);
}

function updateDiagnosticsStatus(): void {
  const model = activeEditor()?.getModel();
  const markers = model ? monaco.editor.getModelMarkers({ resource: model.uri }) : [];
  let errors = 0;
  let warnings = 0;
  for (const marker of markers) {
    if (marker.severity === monaco.MarkerSeverity.Error) errors += 1;
    else if (marker.severity === monaco.MarkerSeverity.Warning) warnings += 1;
  }
  errorsLabel.textContent = String(errors);
  warningsLabel.textContent = String(warnings);
  errorsItem.title = errors === 1 ? "1 error" : `${errors} errors`;
  warningsItem.title = warnings === 1 ? "1 warning" : `${warnings} warnings`;
}

function updateEditorStatus(): void {
  const record = activeTab();
  const model = record?.editor.getModel();
  if (!record || !model) {
    statusSpaces.textContent = "Spaces: 2";
    statusEol.textContent = "LF";
    setStatusLanguage("Plain Text");
    updateDiagnosticsStatus();
    return;
  }
  const options = model.getOptions();
  statusSpaces.textContent = options.insertSpaces ? `Spaces: ${options.tabSize}` : `Tab Size: ${options.tabSize}`;
  statusEol.textContent = model.getEOL() === "\r\n" ? "CRLF" : "LF";
  setStatusLanguage(record.file.language);
  updateDiagnosticsStatus();
}
setStatusLanguage("Plain Text");

const layoutItem = statusIconItem("layout", "", "Layout controls");
const formatterItem = statusIconItem("formatter", "Prettier", "Format document");
const bellItem = statusIconItem("bell", "", "Notifications");

statusBar.setRight([
  statusPosition,
  statusSpaces,
  statusEncoding,
  statusEol,
  statusLanguage,
  layoutItem,
  formatterItem,
  bellItem
]);

function updateBranchStatus(): void {
  const dirty = Array.from(openTabs.values()).some(record => record.dirty);
  branchLabel.textContent = dirty ? "master*" : "master";
}

const statusActions: Array<[HTMLElement, string]> = [
  [remoteItem, "Remote: LiteGUI Dev Space"],
  [branchItem, "Git branch: master"],
  [syncItem, "No remote configured."],
  [errorsItem, "No problems detected."],
  [warningsItem, "No warnings detected."],
  [gitGraphItem, "Git Graph (demo)"],
  [remoteNameItem, "Remote: LiteGUI Dev Space"],
  [bellItem, "No new notifications"]
];
for (const [element, message] of statusActions) {
  element.classList.add("app-status__item--clickable");
  element.addEventListener("click", () => showToast(message));
}

statusLanguage.addEventListener("click", () => toggleLauncherMenu("language", statusLanguage, buildLanguageMenu()));

layoutItem.classList.add("app-status__item--clickable");
layoutItem.setAttribute("data-menu-anchor", "");
layoutItem.addEventListener("click", () => toggleLauncherMenu("layout-status", layoutItem, buildLayoutMenu()));

formatterItem.classList.add("app-status__item--clickable");
formatterItem.addEventListener("click", () => {
  activeEditor()?.getAction("editor.action.formatDocument")?.run();
  showToast("Formatted with Prettier");
});

/* terminal */
const terminal = new Console({ prompt: "$" });
terminal.$input.placeholder = "Type a command (help)";
terminal.$input.setAttribute("aria-label", "Terminal command");
document.querySelector<HTMLElement>("#terminal-host")!.appendChild(terminal.root);
terminal.addMessage("LiteGUI VS Code terminal. Type help for commands.", "msglog");

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
  editor: monaco.editor.IStandaloneCodeEditor;
  tab: HTMLElement;
  titleElement: HTMLElement | null;
  dirty: boolean;
}

const openTabs = new Map<string, OpenTab>();
openTabsReady = true;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function activeTab(): OpenTab | null {
  return activePath ? openTabs.get(activePath) ?? null : null;
}

function activeEditor(): monaco.editor.IStandaloneCodeEditor | null {
  return activeTab()?.editor ?? null;
}

function selectAllActive(): void {
  const editor = activeEditor();
  const model = editor?.getModel();
  if (!editor || !model) return;
  editor.setSelection(model.getFullRange());
  editor.focus();
}

const MONACO_LANGUAGES: Record<string, string> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  CSS: "css",
  HTML: "html",
  JSON: "json",
  Markdown: "markdown",
  XML: "xml",
  "Plain Text": "plaintext"
};

let minimapEnabled = true;

function currentMonacoTheme(): string {
  return document.documentElement.dataset.lgTheme === "light" ? "vs" : "vs-dark";
}

function createCodeEditor(file: FsFile): { editor: monaco.editor.IStandaloneCodeEditor; host: HTMLElement } {
  const host = document.createElement("div");
  host.className = "app-code-editor";
  const uri = monaco.Uri.file(file.path);
  monaco.editor.getModel(uri)?.dispose();
  const model = monaco.editor.createModel(file.content, MONACO_LANGUAGES[file.language] ?? "plaintext", uri);
  const editor = monaco.editor.create(host, {
    model,
    theme: currentMonacoTheme(),
    automaticLayout: true,
    fontSize: 13,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    lineNumbersMinChars: 3,
    minimap: { enabled: minimapEnabled, renderCharacters: false, maxColumn: 90, showSlider: "mouseover" },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    tabSize: 2,
    padding: { top: 6 },
    fixedOverflowWidgets: true
  });
  return { editor, host };
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

function updateCursorPosition(line: number, column: number): void {
  statusPosition.textContent = `Ln ${line}, Col ${column}`;
}

function updateStatusForEditor(editor: monaco.editor.IStandaloneCodeEditor | null): void {
  if (!editor) {
    statusPosition.textContent = "Ln 1, Col 1";
    return;
  }
  const position = editor.getPosition();
  if (position) updateCursorPosition(position.lineNumber, position.column);
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

function applyCollapseState(): void {
  const rows = Array.from(tree.root.querySelectorAll<HTMLElement>(".ltreeitem"));
  const stack: Array<{ level: number; collapsed: boolean }> = [];
  for (const row of rows) {
    const level = Number(row.dataset.level ?? 0);
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    const hidden = stack.some(entry => entry.collapsed);
    row.classList.toggle("hidden", hidden);
    const itemId = row.dataset.item_id ?? "";
    if (itemId.startsWith("dir:")) {
      const folderPath = itemId === "dir:root" ? "" : itemId.slice(4);
      const collapsed = !searchQuery && collapsedFolders.has(folderPath);
      stack.push({ level, collapsed });
      row
        .querySelector<HTMLElement>("[data-folder-path]")
        ?.classList.toggle("app-folder-caret--collapsed", collapsed);
    }
  }
}

function toggleFolder(path: string): void {
  if (collapsedFolders.has(path)) collapsedFolders.delete(path);
  else collapsedFolders.add(path);
  applyCollapseState();
}

function expandAncestors(path: string): void {
  const parts = path.split("/");
  parts.pop();
  let prefix = "";
  for (const part of parts) {
    prefix = prefix ? `${prefix}/${part}` : part;
    collapsedFolders.delete(prefix);
  }
  applyCollapseState();
}

function collapseAllFolders(): void {
  const collect = (node: FsNode): void => {
    if (node.kind !== "folder") return;
    if (node.path) collapsedFolders.add(node.path);
    node.children.forEach(collect);
  };
  project.children.forEach(collect);
  applyCollapseState();
}

function updateTreeDecoration(path: string): void {
  const row = Array.from(tree.root.querySelectorAll<HTMLElement>(".ltreeitem")).find(
    element => element.dataset.item_id === path
  );
  const post = row?.querySelector<HTMLElement>(".postcontent");
  if (post) post.innerHTML = gitDecoration(path, false);
}

function renderTimeline(): void {
  timelineBody.innerHTML = "";
  const record = activeTab();
  if (!record) {
    const empty = document.createElement("div");
    empty.className = "app-empty";
    empty.textContent = "No timeline items.";
    timelineBody.appendChild(empty);
    return;
  }
  const entries = [
    { label: `${record.file.name} · Saved`, meta: "just now" },
    { label: `${record.file.name} · Opened`, meta: "2 minutes ago" },
    { label: "Initial commit", meta: "3 days ago" }
  ];
  for (const entry of entries) {
    const row = document.createElement("div");
    row.className = "app-timeline__item";
    const label = document.createElement("span");
    label.className = "app-timeline__label";
    label.textContent = entry.label;
    const meta = document.createElement("span");
    meta.className = "app-timeline__meta";
    meta.textContent = entry.meta;
    row.append(label, meta);
    row.addEventListener("click", () => showToast(`Timeline: ${entry.label}`));
    timelineBody.appendChild(row);
  }
}

function toggleTimeline(): void {
  timelineToggle.click();
}

/* ------------------------------------------------------------------ */
/* explorer                                                            */
/* ------------------------------------------------------------------ */

function renderExplorerTree(): void {
  searchQuery = searchBox.input.value.trim();
  const filtered = searchQuery ? filterTree(project, searchQuery.toLowerCase()) : project;
  const result = filtered ?? { ...project, children: [] };
  tree.updateTree(buildTreeData(result));
  applyCollapseState();
  highlightTreeFile(activePath);
  if (currentView === "explorer") {
    const resultCount = countFiles(filtered);
    sidebarPanel.setTitle(searchQuery ? `Folders: ${resultCount} result${resultCount === 1 ? "" : "s"}` : "Folders");
    sidebarPanel.root.classList.add("app-explorer-panel");
    explorerMenuButton.hidden = false;
    explorerView.hidden = false;
  }
}

function setSidebarView(view: string): void {
  currentView = view;
  activityBar.setActive(view);
  sidebarBody.innerHTML = "";
  explorerView.hidden = view !== "explorer";
  sidebarPanel.root.classList.toggle("app-explorer-panel", view === "explorer");
  explorerMenuButton.hidden = view !== "explorer";

  if (view === "explorer") {
    sidebarBody.append(explorerView, timelineView);
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

  const { editor, host } = createCodeEditor(source);

  const record: OpenTab = {
    path,
    file: source,
    editor,
    tab: null as unknown as HTMLElement,
    titleElement: null,
    dirty: false
  };
  openTabs.set(path, record);

  const tabInfo = editorTabs.addTab(path, { title: source.name, content: host });
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

  editor.onDidChangeModelContent(() => {
    source.content = editor.getValue();
    record.dirty = true;
    updateTabTitle(path);
    updateBranchStatus();
    updateTreeDecoration(path);
    if (activePath === path) {
      updateBreadcrumb(path);
      updateEditorStatus();
    }
  });

  editor.onDidChangeCursorPosition(({ position }) => {
    if (activePath === path) updateCursorPosition(position.lineNumber, position.column);
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
  statusEncoding.textContent = "UTF-8";
  updateEditorStatus();
  record.editor.layout();
  updateStatusForEditor(record.editor);
  expandAncestors(path);
  highlightTreeFile(path);
  pushNavigation(path);
  if (timelineView.classList.contains("app-timeline--open")) renderTimeline();
}

function closeFile(path: string): void {
  const record = openTabs.get(path);
  if (!record) return;

  const wasActive = activePath === path;
  const ids = Array.from(editorTabs.list.querySelectorAll<HTMLElement>(".lg-tabs__tab")).map(tab => tab.dataset.id);
  const index = ids.indexOf(path);

  editorTabs.removeTab(path);
  openTabs.delete(path);
  updateBranchStatus();
  const model = record.editor.getModel();
  record.editor.dispose();
  model?.dispose();

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
    updateEditorStatus();
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
  collapsedFolders.delete(target.path);
  const name = `untitled-${untitledCount}.ts`;
  const next = file(name, "TypeScript", `// ${name}\n`);
  target.children.push(next);
  assignPaths(project);
  renderExplorerTree();
  openFile(next.path);
  showToast(`Created ${next.path}`);
}

function newFolder(): void {
  const name = window.prompt("New folder name");
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (project.children.some(child => child.kind === "folder" && child.name === trimmed)) {
    showToast(`Folder "${trimmed}" already exists.`);
    return;
  }
  project.children.push(dir(trimmed, []));
  assignPaths(project);
  renderExplorerTree();
  showToast(`Created ${trimmed}`);
}

function saveActiveFile(): void {
  const record = activeTab();
  if (!record) {
    showToast("No file is open.");
    return;
  }
  record.dirty = false;
  updateTabTitle(record.path);
  updateBranchStatus();
  updateTreeDecoration(record.path);
  updateBreadcrumb(record.path);
  showToast(`Saved ${record.file.name}`);
}

function editCommand(command: "undo" | "redo"): void {
  const editor = activeEditor();
  if (!editor) return;
  editor.focus();
  editor.trigger("app", command, null);
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
  syncTitlebarControls();
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
  { label: "Help: About LiteGUI VS Code", run: () => openAboutDialog() }
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
  syncTitlebarControls();
}

function toggleActivityBar(): void {
  shell.classList.toggle("activity-hidden");
  syncTitlebarControls();
}

function toggleMinimap(): void {
  minimapEnabled = !minimapEnabled;
  openTabs.forEach(record => record.editor.updateOptions({ minimap: { enabled: minimapEnabled } }));
  syncTitlebarControls();
  showToast(minimapEnabled ? "Minimap enabled" : "Minimap disabled");
}

function setTheme(light: boolean): void {
  if (light) document.documentElement.dataset.lgTheme = "light";
  else delete document.documentElement.dataset.lgTheme;
  monaco.editor.setTheme(light ? "vs" : "vs-dark");
  showToast(light ? "Light theme" : "Dark theme");
}

function toggleTheme(): void {
  setTheme(document.documentElement.dataset.lgTheme !== "light");
}

let density: "comfortable" | "compact" = "comfortable";

function setDensity(value: "comfortable" | "compact"): void {
  density = value;
  shell.classList.toggle("density-compact", value === "compact");
  showToast(value === "compact" ? "Compact layout" : "Comfortable layout");
}

function openSettings(): void {
  openFile(".vscode/settings.json");
}

function openInfoDialog(title: string, content: string, width: number, height: number): void {
  const dialog = new Dialog({
    title,
    width,
    height,
    close: true,
    className: "app-info-dialog",
    content,
    buttons: [{ name: "Close", close: true }]
  });
  dialog.show();
  dialog.root.style.position = "fixed";
  dialog.root.style.zIndex = "3000";
  const rect = dialog.root.getBoundingClientRect();
  dialog.root.style.left = `${Math.max(12, Math.round((window.innerWidth - rect.width) / 2))}px`;
  dialog.root.style.top = `${Math.max(12, Math.round((window.innerHeight - rect.height) / 2))}px`;
}

function openAboutDialog(): void {
  openInfoDialog(
    "About LiteGUI VS Code",
    `
      <div class="app-about">
        <strong>LiteGUI VS Code</strong>
        <span>Version 1.0.0</span>
        <span>A VS Code-style editor built with LiteGUI components.</span>
      </div>
    `,
    440,
    230
  );
}

function openKeyboardShortcutsDialog(): void {
  const shortcuts: Array<[string, string]> = [
    ["Command Palette", "Ctrl+Shift+P"],
    ["Go to File", "Ctrl+P"],
    ["Save", "Ctrl+S"],
    ["Toggle Sidebar", "Ctrl+B"],
    ["Toggle Terminal", "Ctrl+`"],
    ["Settings", "Ctrl+,"],
    ["Extensions", "Ctrl+Shift+X"]
  ];
  const rows = shortcuts
    .map(([name, keys]) => `<div class="app-shortcut-row"><span>${name}</span><kbd>${keys}</kbd></div>`)
    .join("");
  openInfoDialog("Keyboard Shortcuts", `<div class="app-shortcuts">${rows}</div>`, 420, 300);
}

/* ------------------------------------------------------------------ */
/* bottom-left flyout menus (Accounts / Manage)                        */
/* ------------------------------------------------------------------ */

interface FlyoutItem {
  label?: string;
  shortcut?: string;
  separator?: boolean;
  checked?: boolean;
  disabled?: boolean;
  submenu?: FlyoutItem[];
  action?: () => void;
}

let flyoutRoot: HTMLElement | null = null;
let flyoutSource: string | null = null;
let flyoutSubmenu: HTMLElement | null = null;
let flyoutCleanup: (() => void) | null = null;
let flyoutRowSeq = 0;
let submenuTimer = 0;

const CHEVRON_ICON =
  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 4 4 4-4 4"/></svg>';

function buildManageMenu(): FlyoutItem[] {
  const light = document.documentElement.dataset.lgTheme === "light";
  return [
    { label: "Command Palette…", shortcut: "Ctrl+Shift+P", action: () => openCommandPalette() },
    {
      label: "Profile (Default)",
      submenu: [
        { label: "Default", checked: true, action: () => showToast("Profile: Default") },
        { separator: true },
        { label: "New Profile…", action: () => showToast("Create a profile (demo)") },
        { label: "Manage Profiles…", action: () => showToast("Manage profiles (demo)") }
      ]
    },
    { label: "Settings", shortcut: "Ctrl+,", action: () => openSettings() },
    { label: "Extensions", shortcut: "Ctrl+Shift+X", action: () => setSidebarView("extensions") },
    { label: "Keyboard Shortcuts", shortcut: "Ctrl+K Ctrl+S", action: () => openKeyboardShortcutsDialog() },
    { label: "Snippets", action: () => showToast("No snippets configured.") },
    { label: "Tasks", action: () => showToast("No tasks found in this workspace.") },
    {
      label: "Themes",
      submenu: [
        { label: "Dark Modern", checked: !light, action: () => setTheme(false) },
        { label: "Light Modern", checked: light, action: () => setTheme(true) },
        { separator: true },
        { label: "Browse Themes…", action: () => showToast("Theme marketplace (demo)") }
      ]
    },
    {
      label: "Layout Density",
      submenu: [
        { label: "Comfortable", checked: density === "comfortable", action: () => setDensity("comfortable") },
        { label: "Compact", checked: density === "compact", action: () => setDensity("compact") }
      ]
    },
    { separator: true },
    { label: "Backup and Sync Settings…", action: () => showToast("Sign in to enable Settings Sync.") },
    { separator: true },
    { label: "Check for Updates…", action: () => showToast("LiteGUI VS Code 1.0.0 is up to date.") }
  ];
}

function buildSidebarMenu(): FlyoutItem[] {
  return [
    { label: "New File", action: () => newFile() },
    { label: "New Folder…", action: () => newFolder() },
    { label: "Refresh Explorer", action: () => renderExplorerTree() },
    { label: "Collapse Folders in Explorer", action: () => collapseAllExplorer() },
    { separator: true },
    { label: "Toggle Timeline", action: () => toggleTimeline() }
  ];
}

function buildLayoutMenu(): FlyoutItem[] {
  return [
    { label: "Primary Side Bar", checked: !shell.classList.contains("sidebar-hidden"), action: () => toggleSidebar() },
    { label: "Activity Bar", checked: !shell.classList.contains("activity-hidden"), action: () => toggleActivityBar() },
    { label: "Panel", checked: !terminalDrawer.hidden, action: () => toggleTerminal() },
    { label: "Minimap", checked: minimapEnabled, action: () => toggleMinimap() },
    { separator: true },
    { label: "Comfortable", checked: density === "comfortable", action: () => setDensity("comfortable") },
    { label: "Compact", checked: density === "compact", action: () => setDensity("compact") }
  ];
}

function buildChatMenu(): FlyoutItem[] {
  return [
    { label: "Open Chat", action: () => showToast("Chat is not available in this demo.") },
    { label: "Inline Chat", action: () => showToast("Inline Chat is not available in this demo.") },
    { label: "New Chat", action: () => showToast("New chat (demo)") },
    { separator: true },
    { label: "Chat Settings…", action: () => openSettings() }
  ];
}

function buildAccountMenu(): FlyoutItem[] {
  return [
    { label: "You are not signed in", disabled: true },
    { separator: true },
    { label: "Sign in to Sync Settings", action: () => showToast("Sign in to sync settings (demo)") },
    { label: "Manage Accounts", action: () => showToast("Manage accounts (demo)") }
  ];
}

function buildFlyout(items: FlyoutItem[], level: number): HTMLElement {
  const menu = document.createElement("div");
  menu.className = "app-menu-flyout" + (level === 1 ? " app-menu-flyout--root" : " app-menu-flyout--submenu");
  menu.setAttribute("role", "menu");

  for (const item of items) {
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "app-menu-flyout__separator";
      separator.setAttribute("role", "separator");
      menu.appendChild(separator);
      continue;
    }

    const row = document.createElement("div");
    row.className = "app-menu-flyout__item";
    row.dataset.rowId = String(++flyoutRowSeq);
    row.tabIndex = -1;
    row.setAttribute("role", "menuitem");
    if (item.disabled) row.classList.add("app-menu-flyout__item--disabled");
    if (item.checked) row.classList.add("app-menu-flyout__item--checked");
    if (item.submenu?.length) row.classList.add("app-menu-flyout__item--submenu");

    const check = document.createElement("span");
    check.className = "app-menu-flyout__check";
    check.textContent = item.checked ? "✓" : "";
    const label = document.createElement("span");
    label.className = "app-menu-flyout__label";
    label.textContent = item.label ?? "";
    row.append(check, label);

    if (item.shortcut) {
      const shortcut = document.createElement("span");
      shortcut.className = "app-menu-flyout__shortcut";
      shortcut.textContent = item.shortcut;
      row.appendChild(shortcut);
    }
    if (item.submenu?.length) {
      const more = document.createElement("span");
      more.className = "app-menu-flyout__more";
      more.innerHTML = CHEVRON_ICON;
      row.appendChild(more);
    }

    row.addEventListener("mouseenter", () => {
      const rowMenu = row.closest<HTMLElement>(".app-menu-flyout");
      const insideOpenSubmenu = !!rowMenu && rowMenu === flyoutSubmenu;
      if (item.submenu?.length) {
        if (flyoutSubmenu?.dataset.owner !== row.dataset.rowId) {
          openFlyoutSubmenu(row, item.submenu, level + 1);
        }
      } else if (!insideOpenSubmenu) {
        closeFlyoutSubmenu();
      }
    });

    row.addEventListener("click", () => {
      if (item.disabled) return;
      if (item.submenu?.length) {
        if (flyoutSubmenu?.dataset.owner !== row.dataset.rowId) {
          openFlyoutSubmenu(row, item.submenu, level + 1);
        }
        return;
      }
      closeLauncherMenu();
      item.action?.();
    });

    menu.appendChild(row);
  }

  return menu;
}

function openFlyoutSubmenu(row: HTMLElement, items: FlyoutItem[], level: number): void {
  window.clearTimeout(submenuTimer);
  closeFlyoutSubmenu();

  const submenu = buildFlyout(items, level);
  submenu.dataset.owner = row.dataset.rowId ?? "";
  document.body.appendChild(submenu);

  const rowRect = row.getBoundingClientRect();
  const rect = submenu.getBoundingClientRect();
  let left = rowRect.right - 2;
  if (left + rect.width > window.innerWidth - 8) left = rowRect.left - rect.width + 2;
  const top = Math.max(8, Math.min(rowRect.top - 4, window.innerHeight - rect.height - 8));
  submenu.style.left = `${Math.round(left)}px`;
  submenu.style.top = `${Math.round(top)}px`;

  submenu.addEventListener("mouseenter", () => window.clearTimeout(submenuTimer));
  submenu.addEventListener("mouseleave", event => {
    const next = event.relatedTarget as Node | null;
    if (next && submenu.contains(next)) return;
    submenuTimer = window.setTimeout(closeFlyoutSubmenu, 200);
  });

  flyoutSubmenu = submenu;
}

function closeFlyoutSubmenu(): void {
  window.clearTimeout(submenuTimer);
  flyoutSubmenu?.remove();
  flyoutSubmenu = null;
}

function closeLauncherMenu(): void {
  window.clearTimeout(submenuTimer);
  closeFlyoutSubmenu();
  flyoutRoot?.remove();
  flyoutRoot = null;
  flyoutSource = null;
  flyoutCleanup?.();
  flyoutCleanup = null;
  document.querySelectorAll<HTMLElement>("[data-menu-anchor]").forEach(element => {
    element.setAttribute("aria-expanded", "false");
  });
}

function openLauncherMenu(source: string, anchor: HTMLButtonElement, items: FlyoutItem[]): void {
  closeLauncherMenu();

  const menu = buildFlyout(items, 1);
  document.body.appendChild(menu);

  if (anchor.closest(".app-titlebar")) {
    menu.classList.add("app-menu-flyout--titlebar");
    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(Math.max(8, anchorRect.right - menuRect.width), window.innerWidth - menuRect.width - 8);
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(anchorRect.bottom + 4)}px`;
  } else if (anchor.closest(".app-sidebar")) {
    menu.classList.add("app-menu-flyout--titlebar");
    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(Math.max(8, anchorRect.right - menuRect.width), window.innerWidth - menuRect.width - 8);
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(anchorRect.bottom + 4)}px`;
  } else if (anchor.closest(".app-status")) {
    menu.classList.add("app-menu-flyout--titlebar");
    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(Math.max(8, anchorRect.left), window.innerWidth - menuRect.width - 8);
    menu.style.left = `${Math.round(left)}px`;
    menu.style.bottom = `${Math.round(window.innerHeight - anchorRect.top + 4)}px`;
  } else {
    const activity = document.querySelector<HTMLElement>(".app-activity");
    const status = document.querySelector<HTMLElement>(".app-status");
    const left = activity ? activity.getBoundingClientRect().right : 48;
    const bottom = status ? window.innerHeight - status.getBoundingClientRect().top : 26;
    menu.style.left = `${Math.round(left)}px`;
    menu.style.bottom = `${Math.round(bottom)}px`;
  }

  flyoutRoot = menu;
  flyoutSource = source;
  anchor.setAttribute("aria-expanded", "true");

  const dismiss = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest(".app-menu-flyout")) return;
    if (target.closest("[data-menu-anchor]")) return;
    closeLauncherMenu();
  };

  const keydown = (event: KeyboardEvent) => {
    if (!flyoutRoot) return;
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const insideSubmenu = !!active && !!flyoutSubmenu && flyoutSubmenu.contains(active);
    const current = insideSubmenu && flyoutSubmenu ? flyoutSubmenu : flyoutRoot;
    const rows = Array.from(
      current.querySelectorAll<HTMLElement>(".app-menu-flyout__item:not(.app-menu-flyout__item--disabled)")
    );

    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      event.stopPropagation();
      closeLauncherMenu();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!rows.length) return;
      const index = active ? rows.indexOf(active) : -1;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      rows[(index + delta + rows.length) % rows.length].focus();
      return;
    }
    if (event.key === "ArrowRight" && active?.classList.contains("app-menu-flyout__item--submenu")) {
      event.preventDefault();
      active.click();
      return;
    }
    if (event.key === "ArrowLeft" && insideSubmenu && flyoutSubmenu) {
      event.preventDefault();
      const ownerId = flyoutSubmenu.dataset.owner;
      closeFlyoutSubmenu();
      const owner = ownerId ? flyoutRoot?.querySelector<HTMLElement>(`[data-row-id="${ownerId}"]`) : null;
      owner?.focus();
      return;
    }
    if (event.key === "Enter" && active?.classList.contains("app-menu-flyout__item")) {
      event.preventDefault();
      active.click();
    }
  };

  document.addEventListener("mousedown", dismiss, true);
  document.addEventListener("keydown", keydown, true);
  flyoutCleanup = () => {
    document.removeEventListener("mousedown", dismiss, true);
    document.removeEventListener("keydown", keydown, true);
  };
}

function toggleLauncherMenu(source: string, anchor: HTMLButtonElement, items: FlyoutItem[]): void {
  if (flyoutRoot && flyoutSource === source) {
    closeLauncherMenu();
    return;
  }
  openLauncherMenu(source, anchor, items);
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
  } else if (key === ",") {
    event.preventDefault();
    openSettings();
  } else if (event.shiftKey && key === "x") {
    event.preventDefault();
    setSidebarView("extensions");
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
syncTitlebarControls();
monaco.editor.onDidChangeMarkers(() => updateDiagnosticsStatus());
