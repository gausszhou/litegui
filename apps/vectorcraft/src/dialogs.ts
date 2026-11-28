import { icon } from "./icons";
import { openModal } from "./overlay";

export interface SearchCommand {
  label: string;
  run: () => void;
}

const SHORTCUTS: Array<[string, string]> = [
  ["V", "Selection"],
  ["A", "Direct Selection"],
  ["P", "Pen"],
  ["M", "Rectangle"],
  ["L", "Ellipse"],
  ["T", "Type"],
  ["Q", "Lasso"],
  ["B", "Paintbrush"],
  ["H", "Hand"],
  ["Z", "Zoom"],
  ["R", "Rotate"],
  ["Space + Drag", "Pan"],
  ["Ctrl + Wheel", "Zoom"],
  ["Ctrl + 0", "Fit Artboard"],
  ["Ctrl + 1", "Actual Size"],
  ["Ctrl + Z / Shift + Ctrl + Z", "Undo / Redo"],
  ["Ctrl + D", "Duplicate"],
  ["Ctrl + G / Shift + Ctrl + G", "Group / Ungroup"],
  ["Ctrl + A", "Select All"],
  ["Delete", "Delete selection"],
  ["Arrows", "Nudge 1 pt（Shift 10 pt）"],
  ["Shift + Ctrl + O", "Create Outlines"]
];

export function showShortcutsDialog() {
  openModal(
    `<div class="vc-modal">
      <header class="vc-modal-head"><span>${icon(
        "help",
        14
      )} Keyboard Shortcuts</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
      <div class="vc-modal-body">
        <div class="vc-shortcut-grid">${SHORTCUTS.map(([key, label]) => `<kbd>${key}</kbd><span>${label}</span>`).join(
          ""
        )}</div>
      </div>
      <footer class="vc-modal-foot"><span class="vc-modal-hint">LiteGUI VectorCraft demo</span></footer>
    </div>`
  );
}

export function showAboutDialog() {
  openModal(
    `<div class="vc-modal vc-modal--about">
      <header class="vc-modal-head"><span>${icon(
        "logo",
        18
      )} VectorCraft</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
      <div class="vc-modal-body">
        <p><b>VectorCraft</b> 是一个参考 Adobe Illustrator 工作台的矢量设计示例，使用 LiteGUI 组件与原生 DOM/SVG 构建。</p>
        <p>特性：SVG 矢量渲染 · 画板/标尺 · 选择/拖拽/缩放/旋转 · 路径与锚点编辑 · 真实文字轮廓 · 图层/属性面板 · SVG/PNG 导出。</p>
        <p class="vc-modal-hint">LiteGUI monorepo · apps/vectorcraft · 字体 Chakra Petch（SIL OFL 1.1）</p>
      </div>
      <footer class="vc-modal-foot"><button class="vc-quick-btn vc-quick-btn--primary" data-modal="close">Close</button></footer>
    </div>`
  );
}

export function showHistoryDialog(options: {
  undoCount: number;
  redoCount: number;
  undo: () => void;
  redo: () => void;
}) {
  openModal(
    `<div class="vc-modal">
      <header class="vc-modal-head"><span>${icon(
        "history",
        14
      )} History</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
      <div class="vc-modal-body">
        <p>可撤销 ${options.undoCount} 步，可重做 ${options.redoCount} 步。</p>
        <div class="vc-quick-grid">
          <button class="vc-quick-btn" data-history="undo">Undo</button>
          <button class="vc-quick-btn" data-history="redo">Redo</button>
        </div>
      </div>
      <footer class="vc-modal-foot"><button class="vc-quick-btn vc-quick-btn--primary" data-modal="close">Close</button></footer>
    </div>`,
    ({ root, close }) => {
      root.addEventListener("click", event => {
        const action = (event.target as HTMLElement).closest<HTMLElement>("[data-history]")?.dataset.history;
        if (action === "undo") options.undo();
        else if (action === "redo") options.redo();
        if (action) close();
      });
    }
  );
}

export function showSearchDialog(commands: SearchCommand[]) {
  openModal(
    `<div class="vc-modal vc-search-modal">
      <header class="vc-modal-head"><span>${icon(
        "search",
        14
      )} Command Search</span><button class="vc-mini-btn" data-modal="close">${icon("close", 12)}</button></header>
      <div class="vc-modal-body">
        <input class="vc-input vc-search-input" placeholder="搜索命令…" />
        <div class="vc-search-list"></div>
      </div>
      <footer class="vc-modal-foot"><span class="vc-modal-hint">Enter 执行首个结果 · Esc 关闭</span></footer>
    </div>`,
    ({ root, close }) => {
      const input = root.querySelector<HTMLInputElement>(".vc-search-input")!;
      const list = root.querySelector<HTMLElement>(".vc-search-list")!;
      const render = () => {
        const query = input.value.trim().toLowerCase();
        const filtered = commands.filter(command => command.label.toLowerCase().includes(query));
        list.innerHTML = filtered
          .map(
            (command, index) =>
              `<button class="vc-search-item${index === 0 ? " is-first" : ""}" data-command="${index}">${
                command.label
              }</button>`
          )
          .join("");
        list.querySelectorAll<HTMLElement>("[data-command]").forEach(button => {
          button.addEventListener("click", () => {
            const command = filtered[Number(button.dataset.command)];
            close();
            command?.run();
          });
        });
        return filtered;
      };
      let filtered = render();
      input.addEventListener("input", () => {
        filtered = render();
      });
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          const command = filtered[0];
          close();
          command?.run();
        }
        if (event.key === "Escape") close();
      });
      input.focus();
    }
  );
}
