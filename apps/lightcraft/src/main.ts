/**
 * LightCraft 应用入口：图库 / 显影两个视图，右侧面板 + 底部胶片条 + 快捷键。
 *
 * 数据流：滑杆等控件 → controller 就地修改 Photo.develop → 调度一次显影 →
 * 画布与直方图重绘。原图（source）永不改写，撤销历史保存的是参数快照。
 */
import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { HeaderBar, Toolbar, type ToolbarTool } from "@gausszhou/litegui-components";
import {
  PRESETS,
  applyMaskedAdjust,
  applyPreset,
  autoTone,
  cloneDevelop,
  computeHistogram,
  createDevelop,
  developImage,
  editCount,
  exportDataUrl,
  isNeutral,
  maskAlpha,
  type DevelopParams,
  type Histogram,
  type MaskKind,
  type MaskSpec
} from "./develop";
import { icon } from "./icons";
import { Filmstrip, LibraryView, Sidebar, visiblePhotos } from "./library";
import { RightPanel, type PanelHooks } from "./panels";
import { SCENES, renderScene, renderThumb, type SceneSpec } from "./photos";
import type { AppState, GridSize, HistoryStep, LibraryScope, MaskEntry, PanelMode, Photo, SortKey, ViewMode } from "./types";
import { el, flagControl, iconButton, openMenu, openModal, starControl, toast, type MenuItemSpec } from "./ui";
import { Viewer } from "./viewer";

/* ------------------------------------------------------------------ 常量 */

const PREVIEW_MAX = 1400;
const APP_NAME = "LightCraft";

const SEED_RATINGS = [5, 0, 4, 3, 5, 4, 0, 3, 4, 5, 2, 0, 4, 3, 5, 0, 4, 3, 5, 4, 0, 3, 5, 4];
const SEED_PICKS = new Set([0, 4, 8, 12, 16, 20]);

/* ------------------------------------------------------------------ 数据 */

function sceneSize(spec: SceneSpec): { width: number; height: number } {
  return spec.portrait ? { width: 1000, height: 1400 } : { width: 1600, height: 1000 };
}

function buildPhoto(spec: SceneSpec, index: number): Photo {
  const { width, height } = sceneSize(spec);
  return {
    id: spec.id,
    spec,
    thumb: renderThumb(spec, 480),
    rating: SEED_RATINGS[index % SEED_RATINGS.length] ?? 0,
    flag: SEED_PICKS.has(index) ? "pick" : "none",
    keywords: [...spec.keywords],
    develop: createDevelop(),
    masks: [],
    deleted: false,
    imported: false,
    width,
    height
  };
}

const state: AppState = {
  photos: SCENES.map(buildPhoto),
  selectedId: SCENES[0]?.id ?? "",
  view: "library",
  panel: "edit",
  activeMaskId: null,
  gridSize: "m",
  showLeft: true,
  compare: false,
  zoomMode: "fit",
  sort: "date",
  search: "",
  scope: { kind: "all" }
};

interface PhotoHistory {
  steps: HistoryStep[];
  index: number;
}

const histories = new Map<string, PhotoHistory>();

function historyFor(photo: Photo): PhotoHistory {
  let entry = histories.get(photo.id);
  if (!entry) {
    entry = { steps: [{ label: "导入", develop: createDevelop(), masks: [] }], index: 0 };
    histories.set(photo.id, entry);
  }
  return entry;
}

let clipboard: { develop: DevelopParams; masks: MaskEntry[] } | null = null;

/* ------------------------------------------------------------------ 工具 */

function currentPhoto(): Photo | null {
  return state.photos.find((photo) => photo.id === state.selectedId) ?? null;
}

function cloneMasks(masks: MaskEntry[]): MaskEntry[] {
  return masks.map((mask) => ({
    ...mask,
    spec: { ...mask.spec, p1: { ...mask.spec.p1 }, p2: { ...mask.spec.p2 } },
    params: cloneDevelop(mask.params)
  }));
}

function ensureSource(photo: Photo): HTMLCanvasElement {
  if (!photo.source) {
    photo.source = photo.imported
      ? document.createElement("canvas")
      : renderScene(photo.spec, photo.width, photo.height);
    if (photo.imported) {
      photo.source.width = photo.width;
      photo.source.height = photo.height;
    }
  }
  return photo.source;
}

function ensurePreview(photo: Photo): HTMLCanvasElement {
  if (!photo.preview) {
    const source = ensureSource(photo);
    const scale = Math.min(1, PREVIEW_MAX / Math.max(photo.width, photo.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(photo.width * scale));
    canvas.height = Math.max(1, Math.round(photo.height * scale));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("2D context unavailable");
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    photo.preview = canvas;
    photo.previewPixels = context.getImageData(0, 0, canvas.width, canvas.height);
  }
  return photo.preview;
}

function basePixels(photo: Photo): ImageData {
  ensurePreview(photo);
  if (!photo.previewPixels) throw new Error("preview pixels missing");
  return photo.previewPixels;
}

/* ------------------------------------------------------------------ 外壳 DOM */

const root = el("div", "lc-app lc-app--library");
root.id = "lc-app";
root.innerHTML = `
  <div class="lc-topbar-slot" id="lc-topbar"></div>
  <div class="lc-main" id="lc-main">
    <div class="lc-side-slot" id="lc-side"></div>
    <main class="lc-center" id="lc-center">
      <section class="lc-library" id="lc-library"></section>
      <div class="lc-develop" id="lc-develop" hidden>
        <div class="lc-viewer-slot" id="lc-viewer-slot"></div>
        <div class="lc-filmstrip-slot" id="lc-filmstrip-slot"></div>
      </div>
    </main>
    <aside class="lc-panel-slot" id="lc-panel-slot"></aside>
    <div class="lc-rail-slot" id="lc-rail"></div>
  </div>
  <footer class="lc-bottombar" id="lc-bottombar">
    <div class="lc-bb-left">
      <div class="lc-seg" id="lc-view-switch">
        <button type="button" class="lc-seg__btn" data-view="library" title="图库 (G)">${icon("grid", 14)}</button>
        <button type="button" class="lc-seg__btn" data-view="develop" title="显影 (D)">${icon("single", 14)}</button>
      </div>
      <span class="lc-bb-hint" id="lc-status"></span>
    </div>
    <div class="lc-bb-center" id="lc-bb-center"></div>
    <div class="lc-bb-right">
      <button type="button" class="lc-icon-btn lc-compare-btn" id="lc-compare" title="前后对比 (按住 \\ 临时查看)">${icon("compare", 15)}</button>
      <button type="button" class="lc-zoom-fit" id="lc-fit" title="缩放模式">适合</button>
      <button type="button" class="lc-icon-btn" id="lc-zoom-out" title="缩小 (-)">${icon("zoomOut", 15)}</button>
      <span class="lc-bb-zoom" id="lc-status-zoom">100%</span>
      <button type="button" class="lc-icon-btn" id="lc-zoom-in" title="放大 (+)">${icon("zoomIn", 15)}</button>
    </div>
  </footer>
  <div class="lc-drop" id="lc-drop" hidden><span>松开鼠标导入照片</span></div>
  <input type="file" id="lc-file" accept="image/*" multiple hidden />
`;
document.getElementById("app")?.appendChild(root);

const mount = <T extends HTMLElement>(selector: string): T => {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`LightCraft shell is incomplete: ${selector}`);
  return node;
};

const viewerSlot = mount<HTMLElement>("#lc-viewer-slot");
const filmstripSlot = mount<HTMLElement>("#lc-filmstrip-slot");
const sideSlot = mount<HTMLElement>("#lc-side");
const panelSlot = mount<HTMLElement>("#lc-panel-slot");
const railSlot = mount<HTMLElement>("#lc-rail");
const librarySlot = mount<HTMLElement>("#lc-library");
const developLayer = mount<HTMLElement>("#lc-develop");

/* ------------------------------------------------------------------ 顶栏 */

const topbar = new HeaderBar({ variant: "topbar", className: "lc-topbar" });
topbar.appendTo(mount<HTMLElement>("#lc-topbar"));

const brand = el("div", "lc-brand");
brand.innerHTML = `<span class="lc-brand__mark">${icon("sun", 16)}</span><span class="lc-brand__name">${APP_NAME}</span>`;

const menuButton = iconButton("menu", "主菜单 (Alt+F)", { id: "lc-menu-btn" }, 17);
const undoButton = iconButton("undo", "撤销 (Ctrl+Z)", { id: "lc-undo" }, 16);
const redoButton = iconButton("redo", "重做 (Ctrl+Shift+Z)", { id: "lc-redo" }, 16);
topbar.left.append(brand, menuButton, undoButton, redoButton);

const searchWrap = el("div", "lc-search");
searchWrap.innerHTML = `<span class="lc-search__icon">${icon("search", 14)}</span>`;
const searchInput = el("input", "lc-search__input");
searchInput.id = "lc-search";
searchInput.type = "search";
searchInput.placeholder = "搜索照片";
searchInput.autocomplete = "off";
searchInput.addEventListener("input", () => {
  state.search = searchInput.value;
  syncLibrary();
});
const searchClear = iconButton("close", "清除搜索", { id: "lc-search-clear" }, 12);
searchClear.classList.add("lc-search__clear");
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  state.search = "";
  syncLibrary();
});
searchWrap.append(searchInput, searchClear);
topbar.center.appendChild(searchWrap);

const filterButton = iconButton("filter", "筛选", { id: "lc-filter" }, 15);
const importButton = iconButton("import", "导入照片 (Ctrl+O)", { id: "lc-import" }, 16);
const exportButton = iconButton("export", "导出照片 (Ctrl+E)", { id: "lc-export" }, 16);
const helpButton = iconButton("help", "帮助与快捷键 (?)", { id: "lc-help" }, 16);
const fullscreenButton = iconButton("expand", "全屏", { id: "lc-fullscreen" }, 15);
topbar.right.append(filterButton, importButton, exportButton, helpButton, fullscreenButton);

/* ------------------------------------------------------------------ 右侧模块栏 */

const RAIL_TOOLS: Array<{ id: PanelMode; label: string; icon: string }> = [
  { id: "edit", label: "编辑", icon: "sliders" },
  { id: "mask", label: "遮罩", icon: "masks" },
  { id: "metadata", label: "元数据", icon: "metadata" },
  { id: "history", label: "历史记录", icon: "history" }
];

const railTools: ToolbarTool[] = RAIL_TOOLS.map((tool) => ({
  id: tool.id,
  label: tool.label,
  icon: icon(tool.icon, 18)
}));
const rail = new Toolbar({ orientation: "vertical", tools: railTools, active: "edit", className: "lc-rail" });
railSlot.appendChild(rail.root);
rail.root.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>(".lg-toolbar__tool");
  const id = button?.dataset["tool"];
  if (!id) return;
  setPanelMode(id as PanelMode);
});

/* ------------------------------------------------------------------ 视图组件 */

const libraryHooks = {
  photos: () => state.photos,
  scope: () => state.scope,
  search: () => state.search,
  sort: () => state.sort,
  selectedId: () => state.selectedId,
  gridSize: () => state.gridSize,
  onScope: (scope: LibraryScope) => {
    state.scope = scope;
    syncSidebar();
    syncLibrary();
  },
  onSelect: (photo: Photo) => selectPhoto(photo),
  onOpen: (photo: Photo) => selectPhoto(photo, true),
  onRate: (photo: Photo, rating: number) => {
    photo.rating = rating;
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    if (photo.id === state.selectedId) syncPanel();
    toast(rating > 0 ? `已评为 ${rating} 星` : "已清除评分");
  },
  onFlag: (photo: Photo, flag: Photo["flag"]) => {
    photo.flag = flag;
    syncSidebar();
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    if (photo.id === state.selectedId) syncPanel();
    toast(flag === "pick" ? "标记为精选" : flag === "reject" ? "标记为排斥" : "已清除旗标");
  },
  onSort: (sort: SortKey) => {
    state.sort = sort;
    syncLibrary();
  },
  onSortMenu: (anchor: HTMLElement) => {
    openMenu(
      (["date", "rating", "name"] as SortKey[]).map((key) => ({
        label: key === "date" ? "拍摄时间" : key === "rating" ? "评分" : "文件名",
        checked: state.sort === key,
        action: () => {
          state.sort = key;
          syncLibrary();
        }
      })),
      anchor
    );
  },
  onGridSize: (size: GridSize) => {
    state.gridSize = size;
    syncLibrary();
  },
  onSearch: (text: string) => {
    state.search = text;
    syncLibrary();
  },
  onImport: () => openImportDialog(),
  onContextMenu: (photo: Photo, event: MouseEvent) => openPhotoMenu(photo, event),
  onClearFilters: () => {
    state.scope = { kind: "all" };
    state.search = "";
    searchInput.value = "";
    syncSidebar();
    syncLibrary();
  }
};

const sidebar = new Sidebar(libraryHooks);
sideSlot.appendChild(sidebar.root);

const libraryView = new LibraryView(libraryHooks);
librarySlot.replaceWith(libraryView.root);
librarySlot.remove();

const filmstrip = new Filmstrip(libraryHooks);
filmstripSlot.appendChild(filmstrip.root);

/* ------------------------------------------------------------------ 画布 / 面板 */

let lastHistogram: Histogram | null = null;

const viewer = new Viewer({
  onZoom: (percent) => {
    const label = root.querySelector<HTMLElement>("#lc-status-zoom");
    if (label) label.textContent = `${percent}%`;
  },
  onMaskGeometry: (mask) => {
    const photo = currentPhoto();
    if (!photo) return;
    const entry = photo.masks.find((candidate) => candidate.id === mask.id);
    if (entry) entry.spec = mask.spec;
    viewer.setMask(mask);
    scheduleRender();
  },
  onMaskCommit: () => commit("调整遮罩范围")
});
viewerSlot.appendChild(viewer.root);

const panelHooks: PanelHooks = {
  photo: () => currentPhoto(),
  edit: (mutate, label, live) => edit(mutate, label, live),
  editMask: (maskId, mutate, label, live) => editMask(maskId, mutate, label, live),
  addMask: (kind) => addMask(kind),
  removeMask: (maskId) => removeMask(maskId),
  selectMask: (maskId) => {
    state.activeMaskId = maskId;
    syncPanel();
    syncMaskOverlay();
    scheduleRender();
  },
  toggleMaskVisible: (maskId) => toggleMaskVisible(maskId),
  updateMaskSpec: (maskId, mutate, live) => updateMaskSpec(maskId, mutate, live),
  applyPreset: (presetId) => applyPresetToPhoto(presetId),
  autoTone: () => runAutoTone(),
  toggleMonochrome: () => toggleMonochrome(),
  resetDevelop: () => resetDevelop(),
  addKeyword: (word) => addKeyword(word),
  restoreHistory: (index) => restoreHistory(index),
  history: () => {
    const photo = currentPhoto();
    return photo ? historyFor(photo).steps : [];
  },
  historyIndex: () => {
    const photo = currentPhoto();
    return photo ? historyFor(photo).index : 0;
  },
  setRating: (value) => {
    const photo = currentPhoto();
    if (!photo) return;
    photo.rating = value;
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    syncPanel();
  },
  panelMode: () => state.panel,
  activeMaskId: () => state.activeMaskId,
  onMenu: (anchor, items) => openMenu(items, anchor)
};

const panel = new RightPanel(panelHooks);
panelSlot.appendChild(panel.root);

/* ------------------------------------------------------------------ 渲染调度 */

let renderQueued = false;
let lastDeveloped: ImageData | null = null;
let lastHistogramPhotoId = "";

function scheduleRender(): void {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderNow();
  });
}

function renderNow(): void {
  const photo = currentPhoto();
  if (!photo || state.view !== "develop") return;
  if (!photo.source && photo.imported) return;
  const base = basePixels(photo);
  let developed = developImage(base, photo.develop);
  for (const mask of photo.masks) {
    if (isNeutral(mask.params)) continue;
    const raster = maskAlpha(mask.spec, base.width, base.height);
    developed = applyMaskedAdjust(developed, raster.alpha, mask.params);
  }
  lastDeveloped = developed;
  viewer.setImage(developed, base);
  lastHistogram = computeHistogram(developed);
  lastHistogramPhotoId = photo.id;
  panel.renderHistogram(lastHistogram);
}

/* ------------------------------------------------------------------ 状态同步 */

function syncView(): void {
  const isDevelop = state.view === "develop";
  root.classList.toggle("lc-app--library", !isDevelop);
  root.classList.toggle("lc-app--develop", isDevelop);
  libraryView.root.hidden = isDevelop;
  developLayer.hidden = !isDevelop;
  for (const button of Array.from(root.querySelectorAll<HTMLElement>("#lc-view-switch [data-view]"))) {
    button.classList.toggle("is-active", button.dataset["view"] === state.view);
  }
  const status = root.querySelector<HTMLElement>("#lc-status");
  if (status) {
    status.textContent = isDevelop
      ? "拖动滑杆即时显影 · \\ 对比 · 滚轮缩放 · 双击复位"
      : "双击照片进入显影 · 1–5 打星 · P 精选 · X 排斥";
  }
}

function syncSidebar(): void {
  sidebar.render();
  sideSlot.hidden = !state.showLeft;
}

function syncLibrary(): void {
  libraryView.render();
}

function syncFilmstrip(): void {
  filmstrip.render();
}

function syncPanel(): void {
  panel.setMode(state.panel);
  const photo = currentPhoto();
  if (!photo) return;
  if (lastHistogram && lastHistogramPhotoId === photo.id) {
    panel.renderHistogram(lastHistogram);
  } else {
    // 图库视图里还没有显影结果时，先用原图直方图占位
    panel.renderHistogram(computeHistogram(basePixels(photo)));
  }
}

function syncRail(): void {
  rail.setActive(state.panel);
}

function syncMaskOverlay(): void {
  const photo = currentPhoto();
  const mask = photo?.masks.find((candidate) => candidate.id === state.activeMaskId) ?? null;
  viewer.setMask(state.panel === "mask" && mask && mask.visible ? mask : null);
}

function syncBottom(): void {
  const photo = currentPhoto();
  const center = root.querySelector<HTMLElement>("#lc-bb-center");
  const status = root.querySelector<HTMLElement>("#lc-status");
  if (!center) return;
  center.innerHTML = "";

  if (photo) {
    const ratingHost = el("div", "lc-bb-rating");
    center.appendChild(ratingHost);
    ratingHost.appendChild(
      starControl(photo.rating, (value) => {
        photo.rating = value;
        syncLibrary();
        syncFilmstrip();
        syncBottom();
      }, 13)
    );
    const flags = el("div", "lc-bb-flags");
    flags.appendChild(
      flagControl(photo.flag, (flag) => {
        photo.flag = flag;
        syncSidebar();
        syncLibrary();
        syncFilmstrip();
        syncBottom();
      })
    );
    center.appendChild(flags);

    const copy = el("button", "lc-chip lc-chip--ghost", "复制编辑设置");
    copy.type = "button";
    copy.title = "复制当前照片的显影参数";
    copy.addEventListener("click", () => copySettings());
    const paste = el("button", "lc-chip lc-chip--ghost", "粘贴编辑设置");
    paste.type = "button";
    paste.title = "把剪贴板里的显影参数粘贴到当前照片";
    paste.disabled = clipboard === null;
    paste.addEventListener("click", () => pasteSettings());
    const clip = el("div", "lc-bb-clip");
    clip.append(copy, paste);
    center.appendChild(clip);
  } else {
    center.appendChild(el("span", "lc-bb-empty", "未选择照片"));
  }

  undoButton.disabled = photo ? historyFor(photo).index <= 0 : true;
  undoButton.classList.toggle("is-disabled", undoButton.disabled);
  redoButton.disabled = photo ? historyFor(photo).index >= historyFor(photo).steps.length - 1 : true;
  redoButton.classList.toggle("is-disabled", redoButton.disabled);

  if (status && photo && state.view === "library") {
    status.textContent = `${photo.spec.title} · ${photo.spec.camera}`;
  }
}

function syncAll(refreshLibrary = true): void {
  syncView();
  syncSidebar();
  if (refreshLibrary) syncLibrary();
  syncFilmstrip();
  libraryView.setSelection(state.selectedId);
  syncRail();
  syncPanel();
  syncBottom();
  const photo = currentPhoto();
  viewer.setPhoto(photo);
  syncMaskOverlay();
  if (state.view === "develop") scheduleRender();
}

/* ------------------------------------------------------------------ 动作 */

function selectPhoto(photo: Photo, open = false): void {
  const previous = state.selectedId;
  state.selectedId = photo.id;
  if (previous !== photo.id) state.activeMaskId = photo.masks[0]?.id ?? null;
  if (open) state.view = "develop";
  syncAll(false);
  libraryView.setSelection(photo.id);
}

function setView(view: ViewMode): void {
  if (state.view === view) return;
  state.view = view;
  syncView();
  if (view === "develop") {
    const photo = currentPhoto();
    viewer.setPhoto(photo);
    syncMaskOverlay();
    scheduleRender();
  } else {
    viewer.showLoading(null);
    syncLibrary();
  }
  syncBottom();
}

function setPanelMode(mode: PanelMode): void {
  state.panel = mode;
  rail.setActive(mode);
  syncPanel();
  syncMaskOverlay();
  scheduleRender();
}

function edit(mutate: (params: DevelopParams) => void, label: string, live: boolean): void {
  const photo = currentPhoto();
  if (!photo) return;
  mutate(photo.develop);
  scheduleRender();
  if (!live) commit(label);
}

function editMask(maskId: string, mutate: (params: DevelopParams) => void, label: string, live: boolean): void {
  const photo = currentPhoto();
  const mask = photo?.masks.find((candidate) => candidate.id === maskId);
  if (!mask) return;
  mutate(mask.params);
  scheduleRender();
  if (!live) commit(label);
}

function commit(label: string): void {
  const photo = currentPhoto();
  if (!photo) return;
  const entry = historyFor(photo);
  if (entry.index < entry.steps.length - 1) entry.steps.splice(entry.index + 1);
  entry.steps.push({ label, develop: cloneDevelop(photo.develop), masks: cloneMasks(photo.masks) });
  if (entry.steps.length > 80) entry.steps.shift();
  entry.index = entry.steps.length - 1;
  updateEditCount();
  if (state.panel === "history") panel.render();
  syncBottom();
}

function updateEditCount(): void {
  const count = panel.root.querySelector<HTMLElement>(".lc-edit-head__count");
  const photo = currentPhoto();
  if (!count || !photo) return;
  const edits = editCount(photo.develop);
  count.textContent = edits > 0 ? `${edits} 项调整` : "相机原始";
}

function restoreStep(photo: Photo, step: HistoryStep): void {
  photo.develop = cloneDevelop(step.develop);
  photo.masks = cloneMasks(step.masks);
  state.activeMaskId = photo.masks[0]?.id ?? null;
  syncPanel();
  syncMaskOverlay();
  syncBottom();
  scheduleRender();
}

function undo(): void {
  const photo = currentPhoto();
  if (!photo) return;
  const entry = historyFor(photo);
  if (entry.index <= 0) {
    toast("已经回到最初状态", "warn");
    return;
  }
  entry.index--;
  restoreStep(photo, entry.steps[entry.index]);
  toast(`撤销：${entry.steps[entry.index + 1]?.label ?? ""}`);
}

function redo(): void {
  const photo = currentPhoto();
  if (!photo) return;
  const entry = historyFor(photo);
  if (entry.index >= entry.steps.length - 1) {
    toast("没有可重做的操作", "warn");
    return;
  }
  entry.index++;
  restoreStep(photo, entry.steps[entry.index]);
  toast(`重做：${entry.steps[entry.index].label}`);
}

function restoreHistory(index: number): void {
  const photo = currentPhoto();
  if (!photo) return;
  const entry = historyFor(photo);
  if (index < 0 || index >= entry.steps.length) return;
  entry.index = index;
  restoreStep(photo, entry.steps[index]);
}

function applyPresetToPhoto(presetId: string): void {
  const photo = currentPhoto();
  const preset = PRESETS.find((candidate) => candidate.id === presetId);
  if (!photo || !preset) return;
  photo.develop = applyPreset(photo.develop, preset);
  commit(`预设：${preset.name}`);
  syncPanel();
  scheduleRender();
  toast(`已应用预设「${preset.name}」`);
}

function runAutoTone(): void {
  const photo = currentPhoto();
  if (!photo) return;
  const patch = autoTone(basePixels(photo));
  Object.assign(photo.develop, patch);
  commit("自动色调");
  syncPanel();
  scheduleRender();
  toast("已根据亮度分布自动调整");
}

function toggleMonochrome(): void {
  const photo = currentPhoto();
  if (!photo) return;
  photo.develop.monochrome = !photo.develop.monochrome;
  commit(photo.develop.monochrome ? "转为黑白" : "转为彩色");
  syncPanel();
  scheduleRender();
}

function resetDevelop(): void {
  const photo = currentPhoto();
  if (!photo) return;
  photo.develop = createDevelop();
  photo.masks = [];
  state.activeMaskId = null;
  commit("重置全部调整");
  syncPanel();
  syncMaskOverlay();
  scheduleRender();
  toast("已恢复相机原始设置");
}

const MASK_DEFAULTS: Record<MaskKind, { spec: MaskSpec; name: string }> = {
  radial: {
    name: "径向渐变",
    spec: { kind: "radial", p1: { x: 0.5, y: 0.5 }, p2: { x: 0.8, y: 0.72 }, feather: 50, invert: false }
  },
  linear: {
    name: "线性渐变",
    spec: { kind: "linear", p1: { x: 0.5, y: 0.2 }, p2: { x: 0.5, y: 0.85 }, feather: 50, invert: false }
  },
  sky: {
    name: "天空",
    spec: { kind: "sky", p1: { x: 0.5, y: 0.5 }, p2: { x: 0.5, y: 0.8 }, feather: 60, invert: false }
  },
  subject: {
    name: "主体",
    spec: { kind: "subject", p1: { x: 0.5, y: 0.56 }, p2: { x: 0.78, y: 0.9 }, feather: 45, invert: false }
  }
};

function addMask(kind: MaskKind): void {
  const photo = currentPhoto();
  if (!photo) {
    toast("先选择一张照片", "warn");
    return;
  }
  const defaults = MASK_DEFAULTS[kind];
  const index = photo.masks.length + 1;
  const mask: MaskEntry = {
    id: `${photo.id}-mask-${Date.now()}`,
    name: `${defaults.name} ${index}`,
    spec: { ...defaults.spec, p1: { ...defaults.spec.p1 }, p2: { ...defaults.spec.p2 } },
    params: createDevelop(),
    visible: true
  };
  photo.masks.push(mask);
  state.activeMaskId = mask.id;
  commit(`创建遮罩：${mask.name}`);
  syncPanel();
  syncMaskOverlay();
  scheduleRender();
  toast(`已创建${mask.name}遮罩，拖动画面上的圆点调整范围`);
}

function removeMask(maskId: string): void {
  const photo = currentPhoto();
  if (!photo) return;
  const index = photo.masks.findIndex((mask) => mask.id === maskId);
  if (index === -1) return;
  const [removed] = photo.masks.splice(index, 1);
  state.activeMaskId = photo.masks[Math.max(0, index - 1)]?.id ?? null;
  commit(`删除遮罩：${removed.name}`);
  syncPanel();
  syncMaskOverlay();
  scheduleRender();
}

function toggleMaskVisible(maskId: string): void {
  const photo = currentPhoto();
  const mask = photo?.masks.find((candidate) => candidate.id === maskId);
  if (!mask) return;
  mask.visible = !mask.visible;
  syncPanel();
  syncMaskOverlay();
}

function updateMaskSpec(maskId: string, mutate: (spec: MaskSpec) => void, live: boolean): void {
  const photo = currentPhoto();
  const mask = photo?.masks.find((candidate) => candidate.id === maskId);
  if (!mask) return;
  mutate(mask.spec);
  if (state.activeMaskId === maskId && state.panel === "mask" && mask.visible) viewer.setMask(mask);
  scheduleRender();
  if (!live) commit(`调整遮罩：${mask.name}`);
}

function addKeyword(word: string): void {
  const photo = currentPhoto();
  if (!photo) return;
  const value = word.trim();
  if (!value) return;
  if (!photo.keywords.includes(value)) photo.keywords.push(value);
  syncPanel();
  syncLibrary();
  toast(`已添加关键词「${value}」`);
}

function copySettings(): void {
  const photo = currentPhoto();
  if (!photo) return;
  clipboard = { develop: cloneDevelop(photo.develop), masks: cloneMasks(photo.masks) };
  syncBottom();
  toast("已复制编辑设置");
}

function pasteSettings(): void {
  const photo = currentPhoto();
  if (!photo || !clipboard) return;
  photo.develop = cloneDevelop(clipboard.develop);
  photo.masks = cloneMasks(clipboard.masks);
  state.activeMaskId = photo.masks[0]?.id ?? null;
  commit("粘贴编辑设置");
  syncPanel();
  syncMaskOverlay();
  scheduleRender();
  toast("已粘贴编辑设置");
}

async function deletePhoto(photo: Photo, permanent = false): Promise<void> {
  if (permanent) {
    state.photos = state.photos.filter((candidate) => candidate.id !== photo.id);
    state.selectedId = state.photos[0]?.id ?? "";
    toast("照片已永久删除");
  } else {
    photo.deleted = true;
    const next = visiblePhotos(libraryHooks).find((candidate) => !candidate.deleted);
    if (next) state.selectedId = next.id;
    toast("已移到最近删除，可在侧栏恢复");
  }
  if (state.view === "develop" && state.photos.length === 0) state.view = "library";
  syncAll();
}

/* ------------------------------------------------------------------ 导入 / 导出 */

async function loadImageFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
}

async function importFiles(files: File[]): Promise<void> {
  const images = files.filter((file) => file.type.startsWith("image/"));
  if (images.length === 0) {
    toast("没有可导入的图片文件", "warn");
    return;
  }
  const created: Photo[] = [];
  for (const file of images) {
    try {
      const image = await loadImageFile(file);
      const scale = Math.min(1, 2400 / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) continue;
      context.drawImage(image, 0, 0, width, height);

      const thumbCanvas = document.createElement("canvas");
      const thumbScale = Math.min(1, 480 / Math.max(width, height));
      thumbCanvas.width = Math.max(1, Math.round(width * thumbScale));
      thumbCanvas.height = Math.max(1, Math.round(height * thumbScale));
      thumbCanvas.getContext("2d")?.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

      const now = new Date();
      const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const id = `imported-${now.getTime()}-${created.length}`;
      const spec: SceneSpec = {
        id,
        kind: "mountains",
        variant: 0,
        title: file.name.replace(/\.[^.]+$/, ""),
        file: file.name,
        albums: ["已导入"],
        location: "本机",
        date: stamp,
        camera: "导入文件",
        lens: "—",
        iso: 0,
        aperture: "—",
        shutter: "—",
        focal: 0,
        keywords: ["导入"],
        portrait: height > width
      };
      const photo: Photo = {
        id,
        spec,
        thumb: thumbCanvas.toDataURL("image/jpeg", 0.82),
        rating: 0,
        flag: "none",
        keywords: ["导入"],
        develop: createDevelop(),
        masks: [],
        deleted: false,
        imported: true,
        width,
        height,
        source: canvas
      };
      created.push(photo);
    } catch {
      toast(`无法读取 ${file.name}`, "warn");
    }
  }

  if (created.length === 0) return;
  state.photos = [...created, ...state.photos];
  state.selectedId = created[0].id;
  state.scope = { kind: "album", name: "已导入" };
  state.view = "library";
  syncAll();
  toast(`已导入 ${created.length} 张照片`);
}

function openImportDialog(): void {
  const input = root.querySelector<HTMLInputElement>("#lc-file");
  input?.click();
}

function exportCurrent(format: "png" | "jpeg"): void {
  const photo = currentPhoto();
  if (!photo) {
    toast("先选择一张照片", "warn");
    return;
  }
  viewer.showLoading("正在以原始分辨率显影…");
  window.setTimeout(() => {
    try {
      ensureSource(photo);
      const canvas = photo.source as HTMLCanvasElement;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("2D context unavailable");
      let developed = developImage(context.getImageData(0, 0, canvas.width, canvas.height), photo.develop);
      for (const mask of photo.masks) {
        if (isNeutral(mask.params)) continue;
        developed = applyMaskedAdjust(developed, maskAlpha(mask.spec, canvas.width, canvas.height).alpha, mask.params);
      }
      const out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      out.getContext("2d")?.putImageData(developed, 0, 0);
      const dataUrl = exportDataUrl(out, format, 0.92);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${photo.spec.title.replace(/\s+/g, "-")}-lightcraft.${format === "jpeg" ? "jpg" : "png"}`;
      link.click();
      toast(`已导出 ${link.download}`);
    } catch (error) {
      console.error(error);
      toast("导出失败，请重试", "warn");
    } finally {
      viewer.showLoading(null);
    }
  }, 40);
}

/* ------------------------------------------------------------------ 菜单 / 弹窗 */

function openMainMenu(): void {
  const photo = currentPhoto();
  const items: MenuItemSpec[] = [
    { label: "导入照片…", key: "Ctrl+O", action: openImportDialog },
    { label: "导出当前照片…", key: "Ctrl+E", action: () => openExportDialog(), disabled: !photo },
    { separator: true },
    { label: "撤销", key: "Ctrl+Z", action: undo, disabled: !photo || historyFor(photo).index <= 0 },
    { label: "重做", key: "Ctrl+Shift+Z", action: redo, disabled: !photo || historyFor(photo).index >= historyFor(photo).steps.length - 1 },
    { label: "重置全部调整", action: resetDevelop, disabled: !photo },
    { separator: true },
    { label: "复制编辑设置", key: "Ctrl+C", action: copySettings, disabled: !photo },
    { label: "粘贴编辑设置", key: "Ctrl+V", action: pasteSettings, disabled: !photo || clipboard === null },
    { separator: true },
    { label: "图库视图", key: "G", action: () => setView("library") },
    { label: "显影视图", key: "D", action: () => setView("develop") },
    { label: "适合窗口", key: "F", action: () => fitZoom(), disabled: state.view !== "develop" },
    { label: "前后对比", key: "\\", checked: state.compare, action: () => toggleCompare(), disabled: !photo },
    { label: state.showLeft ? "隐藏左侧栏" : "显示左侧栏", action: () => toggleLeftPanel() },
    { separator: true },
    { label: "键盘快捷键", key: "?", action: openShortcutsDialog },
    { label: `关于 ${APP_NAME}`, action: openAboutDialog }
  ];
  openMenu(items, menuButton);
}

function openFilterMenu(): void {
  const scopes: Array<[string, LibraryScope]> = [
    ["所有照片", { kind: "all" }],
    ["精选", { kind: "picks" }],
    ["已评级", { kind: "rated" }],
    ["最近添加", { kind: "recent" }],
    ["最近删除", { kind: "deleted" }]
  ];
  openMenu(
    [
      ...scopes.map(([label, scope]) => ({
        label,
        checked: state.scope.kind === scope.kind,
        action: () => {
          state.scope = scope;
          syncSidebar();
          syncLibrary();
        }
      })),
      { separator: true },
      {
        label: "清除搜索与筛选",
        action: () => {
          state.search = "";
          searchInput.value = "";
          state.scope = { kind: "all" };
          syncSidebar();
          syncLibrary();
        }
      }
    ],
    filterButton
  );
}

function openPhotoMenu(photo: Photo, event: MouseEvent): void {
  const items: MenuItemSpec[] = [
    { label: "在显影中打开", key: "Enter", action: () => selectPhoto(photo, true) },
    { separator: true },
    ...[1, 2, 3, 4, 5].map((rating) => ({
      label: `${rating} 星`,
      checked: photo.rating === rating,
      action: () => {
        photo.rating = rating;
        syncLibrary();
        syncFilmstrip();
        syncBottom();
      }
    })),
    { label: "清除星级", action: () => { photo.rating = 0; syncLibrary(); syncFilmstrip(); syncBottom(); } },
    { separator: true },
    { label: "标记为精选", checked: photo.flag === "pick", action: () => { photo.flag = "pick"; syncSidebar(); syncLibrary(); syncFilmstrip(); syncBottom(); } },
    { label: "标记为排斥", checked: photo.flag === "reject", action: () => { photo.flag = "reject"; syncSidebar(); syncLibrary(); syncFilmstrip(); syncBottom(); } },
    { separator: true },
    { label: "复制编辑设置", action: copySettings },
    { label: "粘贴编辑设置", action: pasteSettings, disabled: clipboard === null },
    { label: "导出…", action: () => { selectPhoto(photo); openExportDialog(); } },
    { separator: true },
    photo.deleted
      ? { label: "从最近删除恢复", action: () => { photo.deleted = false; syncAll(); toast("照片已恢复"); } }
      : { label: "移到最近删除", key: "Delete", danger: true, action: () => void deletePhoto(photo) },
    { label: "永久删除", danger: true, action: () => void deletePhoto(photo, true) }
  ];
  openMenu(items, { x: event.clientX, y: event.clientY });
}

function openExportDialog(): void {
  const photo = currentPhoto();
  if (!photo) {
    toast("先选择一张照片", "warn");
    return;
  }
  const body = el("div", "lc-export");
  const preview = el("img", "lc-export__thumb");
  preview.src = photo.thumb;
  preview.alt = photo.spec.title;
  const info = el("div", "lc-export__info");
  info.innerHTML = `<strong>${photo.spec.title}</strong><span>${photo.spec.file} · ${photo.width} × ${photo.height}</span><span>显影参数会一并烘焙到导出文件</span>`;

  const options = el("div", "lc-export__options");
  const formatRow = el("label", "lc-export__row");
  formatRow.append(el("span", "", "格式"));
  const format = el("select", "lc-input");
  format.innerHTML = `<option value="jpeg">JPEG（质量 92）</option><option value="png">PNG（无损）</option>`;
  formatRow.appendChild(format);

  const sizeRow = el("label", "lc-export__row");
  sizeRow.append(el("span", "", "尺寸"));
  const size = el("select", "lc-input");
  size.innerHTML = `<option value="full">原始分辨率</option><option value="half">长边 800 px</option>`;
  sizeRow.appendChild(size);

  options.append(formatRow, sizeRow);
  body.append(preview, info, options);

  openModal({
    title: "导出照片",
    subtitle: "导出使用当前显影参数渲染的位图",
    body,
    width: 460,
    actions: [
      { label: "取消" },
      {
        label: "导出",
        primary: true,
        action: () => {
          const targetFormat = format.value as "png" | "jpeg";
          if (size.value === "half") {
            exportScaled(photo, targetFormat, 800);
          } else {
            exportCurrent(targetFormat);
          }
        }
      }
    ]
  });
}

function exportScaled(photo: Photo, format: "png" | "jpeg", longest: number): void {
  ensurePreview(photo);
  const preview = photo.preview as HTMLCanvasElement;
  const scale = Math.min(1, longest / Math.max(preview.width, preview.height));
  if (scale >= 0.999) {
    exportCurrent(format);
    return;
  }
  const base = basePixels(photo);
  let developed = developImage(base, photo.develop);
  for (const mask of photo.masks) {
    if (isNeutral(mask.params)) continue;
    developed = applyMaskedAdjust(developed, maskAlpha(mask.spec, base.width, base.height).alpha, mask.params);
  }
  const source = document.createElement("canvas");
  source.width = developed.width;
  source.height = developed.height;
  source.getContext("2d")?.putImageData(developed, 0, 0);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(source.width * scale));
  out.height = Math.max(1, Math.round(source.height * scale));
  out.getContext("2d")?.drawImage(source, 0, 0, out.width, out.height);
  const dataUrl = exportDataUrl(out, format, 0.92);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${photo.spec.title.replace(/\s+/g, "-")}-lightcraft.${format === "jpeg" ? "jpg" : "png"}`;
  link.click();
  toast(`已导出 ${link.download}`);
}

const SHORTCUTS: Array<[string, string]> = [
  ["G / D", "切换图库 / 显影视图"],
  ["Enter", "在图库中打开所选照片"],
  ["1 – 5", "设置星级"],
  ["0", "清除星级"],
  ["P / X / U", "精选 / 排斥 / 清除旗标"],
  ["\\（按住）", "临时查看修改前"],
  ["F", "适合窗口"],
  ["+ / −", "放大 / 缩小"],
  ["← / →", "上一张 / 下一张"],
  ["Ctrl+Z", "撤销"],
  ["Ctrl+Shift+Z", "重做"],
  ["Ctrl+O", "导入照片"],
  ["Ctrl+E", "导出当前照片"],
  ["Delete", "移到最近删除"],
  ["?", "显示本帮助"]
];

function openShortcutsDialog(): void {
  const body = el("div", "lc-shortcuts");
  for (const [keys, description] of SHORTCUTS) {
    const rowNode = el("div", "lc-shortcuts__row");
    rowNode.append(el("kbd", "lc-kbd", keys), el("span", "", description));
    body.appendChild(rowNode);
  }
  openModal({
    title: "键盘快捷键",
    subtitle: "LightCraft · 照片图库与显影",
    body,
    width: 520,
    actions: [{ label: "知道了", primary: true }]
  });
}

function openAboutDialog(): void {
  const body = el("div", "lc-about");
  body.innerHTML = `
    <p class="lc-about__lead">你的照片。你的像素。你的机器。</p>
    <p>LightCraft 是一个用 LiteGUI 搭建的照片图库与非破坏性显影演示：场景参考的 32 位浮点管线在浏览器里以 0..1 浮点中间值模拟，
    原图只读，所有调整都是参数。24 张演示照片由 Canvas 程序化绘制，也可以导入你自己的图片。</p>
    <ul class="lc-about__list">
      <li>光线 / 颜色 / 效果 / 细节 / 曲线 / 8 色带混合器 / 三向颜色分级</li>
      <li>线性、径向、天空、主体遮罩与遮罩再调整</li>
      <li>评分、旗标、相册、搜索、软删除与撤销历史</li>
      <li>按原始分辨率导出 JPEG / PNG</li>
    </ul>
    <p class="lc-about__meta">MIT · LiteGUI monorepo · 参考 https://getartcraft.com/apps/lightcraft</p>`;
  openModal({
    title: `关于 ${APP_NAME}`,
    subtitle: "LiteGUI 示例应用",
    body,
    width: 520,
    actions: [{ label: "关闭", primary: true }]
  });
}

/* ------------------------------------------------------------------ 缩放 / 对比 / 侧栏 */

function fitZoom(): void {
  state.zoomMode = "fit";
  viewer.setZoom("fit");
  const fit = root.querySelector<HTMLElement>("#lc-fit");
  if (fit) fit.textContent = "适合";
}

function setZoomMode(mode: "fit" | "100" | "200"): void {
  state.zoomMode = mode;
  viewer.setZoom(mode);
  const fit = root.querySelector<HTMLElement>("#lc-fit");
  if (fit) fit.textContent = mode === "fit" ? "适合" : `${mode}%`;
}

function toggleCompare(force?: boolean): void {
  state.compare = force ?? !state.compare;
  viewer.setCompare(state.compare);
  const button = root.querySelector<HTMLElement>("#lc-compare");
  button?.classList.toggle("is-active", state.compare);
}

function toggleLeftPanel(): void {
  state.showLeft = !state.showLeft;
  root.classList.toggle("lc-app--no-side", !state.showLeft);
  syncSidebar();
}

/* ------------------------------------------------------------------ 事件绑定 */

menuButton.addEventListener("click", openMainMenu);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
filterButton.addEventListener("click", openFilterMenu);
importButton.addEventListener("click", openImportDialog);
exportButton.addEventListener("click", () => openExportDialog());
helpButton.addEventListener("click", openShortcutsDialog);
fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.();
});

for (const button of Array.from(root.querySelectorAll<HTMLElement>("#lc-view-switch [data-view]"))) {
  button.addEventListener("click", () => setView(button.dataset["view"] as ViewMode));
}

root.querySelector<HTMLElement>("#lc-compare")?.addEventListener("click", () => toggleCompare());
root.querySelector<HTMLElement>("#lc-fit")?.addEventListener("click", (event) => {
  openMenu(
    [
      { label: "适合窗口", checked: state.zoomMode === "fit", action: () => setZoomMode("fit") },
      { label: "100%", checked: state.zoomMode === "100", action: () => setZoomMode("100") },
      { label: "200%", checked: state.zoomMode === "200", action: () => setZoomMode("200") }
    ],
    event.currentTarget as HTMLElement
  );
});
root.querySelector<HTMLElement>("#lc-zoom-in")?.addEventListener("click", () => viewer.zoomBy(1.25));
root.querySelector<HTMLElement>("#lc-zoom-out")?.addEventListener("click", () => viewer.zoomBy(0.8));

root.querySelector<HTMLInputElement>("#lc-file")?.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) void importFiles(Array.from(input.files));
  input.value = "";
});

// 拖拽导入
const dropZone = root.querySelector<HTMLElement>("#lc-drop");
let dragDepth = 0;
window.addEventListener("dragenter", (event) => {
  if (!event.dataTransfer?.types.includes("Files")) return;
  dragDepth++;
  if (dropZone) dropZone.hidden = false;
});
window.addEventListener("dragover", (event) => {
  if (!event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
});
window.addEventListener("dragleave", () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0 && dropZone) dropZone.hidden = true;
});
window.addEventListener("drop", (event) => {
  dragDepth = 0;
  if (dropZone) dropZone.hidden = true;
  if (!event.dataTransfer?.files.length) return;
  event.preventDefault();
  void importFiles(Array.from(event.dataTransfer.files));
});

document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest("input, textarea, select, [contenteditable='true']")) return;
  const photo = currentPhoto();
  const meta = event.ctrlKey || event.metaKey;

  if (meta && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if (meta && event.key.toLowerCase() === "y") {
    event.preventDefault();
    redo();
    return;
  }
  if (meta && event.key.toLowerCase() === "o") {
    event.preventDefault();
    openImportDialog();
    return;
  }
  if (meta && event.key.toLowerCase() === "e") {
    event.preventDefault();
    openExportDialog();
    return;
  }
  if (meta && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copySettings();
    return;
  }
  if (meta && event.key.toLowerCase() === "v") {
    event.preventDefault();
    pasteSettings();
    return;
  }

  if (event.key === "Escape") {
    toggleCompare(false);
    return;
  }

  switch (event.key) {
    case "\\":
      event.preventDefault();
      if (state.view === "develop") toggleCompare(true);
      return;
    case "g":
    case "G":
      setView("library");
      return;
    case "d":
    case "D":
      setView("develop");
      return;
    case "f":
    case "F":
      fitZoom();
      return;
    case "+":
    case "=":
      viewer.zoomBy(1.25);
      return;
    case "-":
      viewer.zoomBy(0.8);
      return;
    case "?":
      openShortcutsDialog();
      return;
    case "Delete":
    case "Backspace":
      if (photo) {
        event.preventDefault();
        void deletePhoto(photo);
      }
      return;
    case "ArrowLeft":
      if (state.view === "develop") stepPhoto(-1);
      return;
    case "ArrowRight":
      if (state.view === "develop") stepPhoto(1);
      return;
    default:
      break;
  }

  if (!photo) return;
  if (/^[0-5]$/.test(event.key)) {
    photo.rating = Number(event.key);
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    return;
  }
  if (event.key === "p" || event.key === "P") {
    photo.flag = photo.flag === "pick" ? "none" : "pick";
    syncSidebar();
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    return;
  }
  if (event.key === "x" || event.key === "X") {
    photo.flag = photo.flag === "reject" ? "none" : "reject";
    syncSidebar();
    syncLibrary();
    syncFilmstrip();
    syncBottom();
    return;
  }
  if (event.key === "u" || event.key === "U") {
    photo.flag = "none";
    syncSidebar();
    syncLibrary();
    syncFilmstrip();
    syncBottom();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "\\" && state.view === "develop" && state.compare) toggleCompare(false);
});

function stepPhoto(direction: number): void {
  const list = visiblePhotos(libraryHooks).filter((photo) => !photo.deleted);
  if (list.length === 0) return;
  const index = list.findIndex((photo) => photo.id === state.selectedId);
  const next = list[(index + direction + list.length) % list.length];
  if (next) selectPhoto(next);
}

/* ------------------------------------------------------------------ 启动 */

syncAll();
searchClear.hidden = true;
searchInput.addEventListener("input", () => {
  searchClear.hidden = searchInput.value.length === 0;
});

// 预热第一张照片的预览，进显影时不用等待
ensurePreview(state.photos[0] as Photo);

export { state };

/* 供 e2e 与调试观察的只读快照 */
(window as unknown as { lightcraft?: unknown }).lightcraft = {
  get state() {
    return {
      view: state.view,
      panel: state.panel,
      selectedId: state.selectedId,
      count: state.photos.length,
      zoom: viewer.percent(),
      lastHistogram: lastHistogram !== null,
      lastDeveloped: lastDeveloped !== null
    };
  }
};
