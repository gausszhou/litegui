/**
 * 图库：左侧照片树、网格视图、底部胶片条。
 * 三者都只负责渲染，状态与行为通过 hooks 交给 main.ts，方便快捷键与撤销统一处理。
 */
import type { GridSize, LibraryScope, Photo, SortKey } from "./types";
import { icon, starStrip } from "./icons";
import { el } from "./ui";

export interface LibraryHooks {
  photos(): Photo[];
  scope(): LibraryScope;
  search(): string;
  sort(): SortKey;
  selectedId(): string;
  gridSize(): GridSize;
  onScope(scope: LibraryScope): void;
  onSelect(photo: Photo): void;
  onOpen(photo: Photo): void;
  onRate(photo: Photo, rating: number): void;
  onFlag(photo: Photo, flag: Photo["flag"]): void;
  onSort(sort: SortKey): void;
  onSortMenu(anchor: HTMLElement): void;
  onGridSize(size: GridSize): void;
  onSearch(text: string): void;
  onImport(): void;
  onContextMenu(photo: Photo, event: MouseEvent): void;
  onClearFilters(): void;
}

/* ------------------------------------------------------------------ 过滤 / 排序 */

const yearOf = (date: string): string => date.slice(0, 4);
const monthOf = (date: string): string => date.slice(0, 7);

export function visiblePhotos(hooks: LibraryHooks): Photo[] {
  const photos = hooks.photos();
  const scope = hooks.scope();
  const search = hooks.search().trim().toLowerCase();
  const sort = hooks.sort();

  let list = photos.filter((photo) => {
    if (scope.kind === "deleted") return photo.deleted;
    if (photo.deleted) return false;
    switch (scope.kind) {
      case "all":
      case "recent":
        return true;
      case "picks":
        return photo.flag === "pick";
      case "rated":
        return photo.rating > 0;
      case "album":
        return photo.spec.albums.includes(scope.name);
      case "date":
        return photo.spec.date.startsWith(scope.value);
      default:
        return true;
    }
  });

  if (scope.kind === "recent") {
    list = [...list].sort((a, b) => b.spec.date.localeCompare(a.spec.date)).slice(0, 8);
  }

  if (search) {
    list = list.filter((photo) => {
      const haystack = [
        photo.spec.title,
        photo.spec.file,
        photo.spec.location,
        photo.spec.camera,
        photo.spec.lens,
        ...photo.spec.albums,
        ...photo.keywords,
        ...photo.spec.keywords
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  const sorted = [...list];
  if (sort === "date") sorted.sort((a, b) => b.spec.date.localeCompare(a.spec.date));
  else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.spec.date.localeCompare(a.spec.date));
  else sorted.sort((a, b) => a.spec.file.localeCompare(b.spec.file));
  return sorted;
}

export function scopeLabel(scope: LibraryScope): string {
  switch (scope.kind) {
    case "all":
      return "所有照片";
    case "recent":
      return "最近添加";
    case "picks":
      return "精选";
    case "rated":
      return "已评级";
    case "album":
      return scope.name;
    case "date":
      return scope.value.length === 4 ? `${scope.value} 年` : scope.value;
    case "deleted":
      return "最近删除";
  }
}

/* ------------------------------------------------------------------ 左侧照片树 */

interface SidebarCounts {
  all: number;
  recent: number;
  picks: number;
  rated: number;
  deleted: number;
  albums: Array<{ name: string; count: number }>;
  years: Array<{ value: string; count: number; months: Array<{ value: string; count: number }> }>;
}

function countAll(photos: Photo[]): SidebarCounts {
  const live = photos.filter((photo) => !photo.deleted);
  const albums = new Map<string, number>();
  const years = new Map<string, Map<string, number>>();
  for (const photo of live) {
    for (const album of photo.spec.albums) albums.set(album, (albums.get(album) ?? 0) + 1);
    const year = yearOf(photo.spec.date);
    const month = monthOf(photo.spec.date);
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    months?.set(month, (months.get(month) ?? 0) + 1);
  }
  const albumOrder = ["旅行 2026", "海岸线", "沙漠", "群山", "花园", "夜空", "作品集"];
  return {
    all: live.length,
    recent: Math.min(8, live.length),
    picks: live.filter((photo) => photo.flag === "pick").length,
    rated: live.filter((photo) => photo.rating > 0).length,
    deleted: photos.filter((photo) => photo.deleted).length,
    albums: [...albums.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const ai = albumOrder.indexOf(a.name);
        const bi = albumOrder.indexOf(b.name);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name);
      }),
    years: [...years.entries()]
      .map(([value, months]) => ({
        value,
        count: [...months.values()].reduce((sum, count) => sum + count, 0),
        months: [...months.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([month, count]) => ({ value: month, count }))
      }))
      .sort((a, b) => b.value.localeCompare(a.value))
  };
}

const collapsed = new Set<string>();

export class Sidebar {
  public root: HTMLElement;
  private hooks: LibraryHooks;
  private nav: HTMLElement;

  constructor(hooks: LibraryHooks) {
    this.hooks = hooks;
    this.root = el("aside", "lc-side");
    const head = el("div", "lc-side__head");
    head.innerHTML = `<h1 class="lc-side__title">我的照片</h1>`;
    this.nav = el("nav", "lc-side__nav");
    this.root.append(head, this.nav);
  }

  render(): void {
    const counts = countAll(this.hooks.photos());
    const scope = this.hooks.scope();
    this.nav.innerHTML = "";

    const isActive = (candidate: LibraryScope): boolean => {
      if (scope.kind !== candidate.kind) return false;
      if (candidate.kind === "album" && scope.kind === "album") return scope.name === candidate.name;
      if (candidate.kind === "date" && scope.kind === "date") return scope.value === candidate.value;
      return true;
    };

    const row = (
      label: string,
      count: number,
      scopeValue: LibraryScope,
      iconName: string,
      indent = false,
      extra?: HTMLElement
    ): HTMLElement => {
      const button = el("button", `lc-side__row${indent ? " lc-side__row--sub" : ""}`);
      button.type = "button";
      button.dataset["scope"] = JSON.stringify(scopeValue);
      if (isActive(scopeValue)) button.classList.add("is-active");
      button.innerHTML = `<span class="lc-side__icon">${icon(iconName, 14)}</span><span class="lc-side__label">${label}</span>`;
      const badge = el("span", "lc-side__count", String(count));
      button.appendChild(badge);
      if (extra) button.appendChild(extra);
      button.addEventListener("click", () => this.hooks.onScope(scopeValue));
      return button;
    };

    const group = (title: string, key: string, children: HTMLElement[], action?: HTMLElement): HTMLElement => {
      const section = el("section", "lc-side__group");
      const head = el("div", "lc-side__group-head");
      const isCollapsed = collapsed.has(key);
      head.innerHTML = `<button class="lc-side__chev" type="button">${icon(isCollapsed ? "chevronRight" : "chevronDown", 12)}</button><span class="lc-side__group-title">${title}</span>`;
      head.querySelector("button")?.addEventListener("click", () => {
        if (collapsed.has(key)) collapsed.delete(key);
        else collapsed.add(key);
        this.render();
      });
      if (action) head.appendChild(action);
      section.appendChild(head);
      if (!isCollapsed) {
        const body = el("div", "lc-side__group-body");
        body.append(...children);
        section.appendChild(body);
      }
      return section;
    };

    this.nav.append(
      row("所有照片", counts.all, { kind: "all" }, "image"),
      row("最近添加", counts.recent, { kind: "recent" }, "clock"),
      row("精选", counts.picks, { kind: "picks" }, "flagPick"),
      row("已评级", counts.rated, { kind: "rated" }, "star")
    );

    const albumAdd = el("button", "lc-side__add");
    albumAdd.type = "button";
    albumAdd.title = "从图库选择照片加入相册（演示）";
    albumAdd.innerHTML = icon("plus", 13);
    this.nav.appendChild(
      group(
        `相册 <span class="lc-side__group-count">${counts.albums.length}</span>`,
        "albums",
        counts.albums.map((album) => row(album.name, album.count, { kind: "album", name: album.name }, "album", true)),
        albumAdd
      )
    );

    const yearRows: HTMLElement[] = [];
    for (const year of counts.years) {
      yearRows.push(row(`${year.value} 年`, year.count, { kind: "date", value: year.value }, "calendar", true));
      for (const month of year.months) {
        const label = `${Number(month.value.slice(5))} 月`;
        yearRows.push(row(label, month.count, { kind: "date", value: month.value }, "calendar", true));
      }
    }
    this.nav.appendChild(group("按日期", "dates", yearRows));
    this.nav.appendChild(row("最近删除", counts.deleted, { kind: "deleted" }, "trash"));
  }
}

/* ------------------------------------------------------------------ 图库网格 */

export class LibraryView {
  public root: HTMLElement;
  private hooks: LibraryHooks;
  private title: HTMLElement;
  private count: HTMLElement;
  private grid: HTMLElement;
  private scroller: HTMLElement;
  private empty: HTMLElement;
  private sortButton: HTMLButtonElement;
  private sizeButtons: Map<GridSize, HTMLButtonElement>;

  constructor(hooks: LibraryHooks) {
    this.hooks = hooks;
    this.root = el("section", "lc-library");

    const head = el("div", "lc-lib-head");
    const titles = el("div", "lc-lib-titles");
    this.title = el("h2", "lc-lib-title", "所有照片");
    this.count = el("span", "lc-lib-count", "");
    titles.append(this.title, this.count);

    const tools = el("div", "lc-lib-tools");
    this.sortButton = el("button", "lc-chip lc-chip--ghost");
    this.sortButton.type = "button";
    this.sortButton.title = "排序";
    this.sortButton.addEventListener("click", () => this.hooks.onSortMenu(this.sortButton));

    this.sizeButtons = new Map();
    const sizes: Array<[GridSize, string, string]> = [
      ["s", "gridSmall", "小缩略图"],
      ["m", "grid", "中缩略图"],
      ["l", "single", "大缩略图"]
    ];
    const sizeGroup = el("div", "lc-seg");
    for (const [size, iconName, title] of sizes) {
      const button = el("button", "lc-seg__btn");
      button.type = "button";
      button.title = title;
      button.setAttribute("aria-label", title);
      button.innerHTML = icon(iconName, 14);
      button.addEventListener("click", () => this.hooks.onGridSize(size));
      this.sizeButtons.set(size, button);
      sizeGroup.appendChild(button);
    }
    tools.append(this.sortButton, sizeGroup);
    head.append(titles, tools);

    this.grid = el("div", "lc-grid");
    this.scroller = el("div", "lc-grid-scroll");
    this.scroller.appendChild(this.grid);
    this.empty = el("div", "lc-empty");
    this.empty.innerHTML = `<div class="lc-empty__art">${icon("image", 34)}</div><p class="lc-empty__title">没有匹配的照片</p><p class="lc-empty__hint">换个关键词、相册或清除筛选条件再试。</p>`;
    const clear = el("button", "lc-btn", "清除筛选");
    clear.type = "button";
    clear.addEventListener("click", () => this.hooks.onClearFilters());
    this.empty.appendChild(clear);

    this.root.append(head, this.scroller, this.empty);
    this.grid.addEventListener("click", this.onClick);
    this.grid.addEventListener("dblclick", this.onDoubleClick);
    this.grid.addEventListener("contextmenu", this.onContextMenu);
    this.grid.addEventListener("keydown", this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tile = (event.target as HTMLElement).closest<HTMLElement>(".lc-tile");
    const id = tile?.dataset["photo"];
    if (!id) return;
    event.preventDefault();
    const photo = this.hooks.photos().find((candidate) => candidate.id === id);
    if (photo) this.hooks.onOpen(photo);
  };

  private onClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const tile = target.closest<HTMLElement>(".lc-tile");
    const id = tile?.dataset["photo"];
    if (!tile || !id) return;
    const photo = this.hooks.photos().find((candidate) => candidate.id === id);
    if (!photo) return;
    const rateButton = target.closest<HTMLElement>("[data-rate]");
    if (rateButton) {
      this.hooks.onRate(photo, Number(rateButton.dataset["rate"]));
      return;
    }
    const flagButton = target.closest<HTMLElement>("[data-flag]");
    if (flagButton) {
      const flag = flagButton.dataset["flag"] as Photo["flag"];
      this.hooks.onFlag(photo, photo.flag === flag ? "none" : flag);
      return;
    }
    this.hooks.onSelect(photo);
  };

  private onDoubleClick = (event: MouseEvent): void => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>(".lc-tile");
    const id = tile?.dataset["photo"];
    if (!id) return;
    const photo = this.hooks.photos().find((candidate) => candidate.id === id);
    if (photo) this.hooks.onOpen(photo);
  };

  private onContextMenu = (event: MouseEvent): void => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>(".lc-tile");
    const id = tile?.dataset["photo"];
    if (!id) return;
    event.preventDefault();
    const photo = this.hooks.photos().find((candidate) => candidate.id === id);
    if (photo) this.hooks.onContextMenu(photo, event);
  };

  /** 只更新选中态，避免整块网格重建（否则双击会被第一次 click 打断）。 */
  setSelection(id: string): void {
    for (const tile of Array.from(this.grid.querySelectorAll<HTMLElement>(".lc-tile"))) {
      const selected = tile.dataset["photo"] === id;
      tile.classList.toggle("is-selected", selected);
      tile.setAttribute("aria-selected", String(selected));
    }
  }

  render(): void {
    const photos = visiblePhotos(this.hooks);
    const scope = this.hooks.scope();
    this.title.textContent = scopeLabel(scope);
    this.count.textContent = `${photos.length} 张照片`;

    const sortLabels: Record<SortKey, string> = { date: "拍摄时间", rating: "评分", name: "文件名" };
    this.sortButton.innerHTML = `${icon("sort", 13)}<span>${sortLabels[this.hooks.sort()]}</span>${icon("chevronDown", 12)}`;
    for (const [size, button] of this.sizeButtons) {
      button.classList.toggle("is-active", size === this.hooks.gridSize());
    }
    this.root.dataset["grid"] = this.hooks.gridSize();

    this.grid.innerHTML = "";
    const selectedId = this.hooks.selectedId();
    for (const photo of photos) {
      this.grid.appendChild(this.tile(photo, photo.id === selectedId));
    }
    this.empty.hidden = photos.length > 0;
    this.grid.hidden = photos.length === 0;
    // 纵向滚动到当前选中项；不要用 scrollIntoView，避免多列容器被横向滚走
    this.scroller.scrollLeft = 0;
    const selected = this.grid.querySelector<HTMLElement>(".lc-tile.is-selected");
    if (selected) {
      const gridRect = this.scroller.getBoundingClientRect();
      const tileRect = selected.getBoundingClientRect();
      if (tileRect.top < gridRect.top) this.scroller.scrollTop -= gridRect.top - tileRect.top + 8;
      else if (tileRect.bottom > gridRect.bottom) this.scroller.scrollTop += tileRect.bottom - gridRect.bottom + 8;
    }
  }

  private tile(photo: Photo, selected: boolean): HTMLElement {
    const tile = el("div", `lc-tile${selected ? " is-selected" : ""}${photo.deleted ? " is-deleted" : ""}`);
    tile.dataset["photo"] = photo.id;
    tile.tabIndex = 0;
    tile.style.aspectRatio = `${photo.width} / ${photo.height}`;
    tile.setAttribute("role", "option");
    tile.setAttribute("aria-selected", String(selected));

    const image = el("img", "lc-tile__img");
    image.src = photo.thumb;
    image.alt = photo.spec.title;
    image.loading = "lazy";
    image.draggable = false;

    const overlay = el("div", "lc-tile__overlay");
    const meta = el("div", "lc-tile__meta");
    const stars = el("div", "lc-tile__stars");
    stars.innerHTML = starStrip(photo.rating, 10);
    meta.appendChild(stars);
    if (photo.flag === "pick") {
      const flag = el("span", "lc-tile__flag");
      flag.innerHTML = icon("flagPick", 11);
      meta.appendChild(flag);
    } else if (photo.flag === "reject") {
      const flag = el("span", "lc-tile__flag is-reject");
      flag.innerHTML = icon("flagReject", 11);
      meta.appendChild(flag);
    }
    if (photo.masks.length > 0) {
      const badge = el("span", "lc-tile__flag lc-tile__flag--mask");
      badge.innerHTML = icon("masks", 11);
      badge.title = `${photo.masks.length} 个遮罩`;
      meta.appendChild(badge);
    }

    const hover = el("div", "lc-tile__hover");
    const name = el("span", "lc-tile__name", photo.spec.title);
    const rateRow = el("span", "lc-tile__rate");
    for (let i = 1; i <= 5; i++) {
      const button = el("button", "lc-tile__rate-btn");
      button.type = "button";
      button.dataset["rate"] = String(i);
      button.title = `${i} 星`;
      button.innerHTML = icon(i <= photo.rating ? "starFill" : "star", 11);
      rateRow.appendChild(button);
    }
    const flagRow = el("span", "lc-tile__flagbtn");
    const pick = el("button", "lc-tile__rate-btn");
    pick.type = "button";
    pick.dataset["flag"] = "pick";
    pick.title = photo.flag === "pick" ? "取消精选" : "标记为精选";
    pick.innerHTML = icon("flagPick", 11);
    if (photo.flag === "pick") pick.classList.add("is-on");
    const reject = el("button", "lc-tile__rate-btn");
    reject.type = "button";
    reject.dataset["flag"] = "reject";
    reject.title = photo.flag === "reject" ? "取消排斥" : "标记为排斥";
    reject.innerHTML = icon("flagReject", 11);
    if (photo.flag === "reject") reject.classList.add("is-on");
    flagRow.append(pick, reject);
    hover.append(name, rateRow, flagRow);

    overlay.append(hover);
    tile.append(image, meta, overlay);
    if (photo.deleted) {
      const deleted = el("span", "lc-tile__deleted", "已删除");
      tile.appendChild(deleted);
    }
    return tile;
  }
}

/* ------------------------------------------------------------------ 胶片条 */

export class Filmstrip {
  public root: HTMLElement;
  private hooks: LibraryHooks;
  private track: HTMLElement;

  constructor(hooks: LibraryHooks) {
    this.hooks = hooks;
    this.root = el("div", "lc-filmstrip");
    this.track = el("div", "lc-filmstrip__track");
    this.root.appendChild(this.track);
    this.track.addEventListener("click", (event) => {
      const cell = (event.target as HTMLElement).closest<HTMLElement>(".lc-film");
      const id = cell?.dataset["photo"];
      if (!id) return;
      const photo = this.hooks.photos().find((candidate) => candidate.id === id);
      if (photo) this.hooks.onSelect(photo);
    });
  }

  render(): void {
    const photos = visiblePhotos(this.hooks).filter((photo) => !photo.deleted);
    const selectedId = this.hooks.selectedId();
    this.track.innerHTML = "";
    for (const photo of photos) {
      const cell = el("button", `lc-film${photo.id === selectedId ? " is-active" : ""}`);
      cell.type = "button";
      cell.dataset["photo"] = photo.id;
      cell.title = `${photo.spec.title} · ${photo.spec.file}`;
      const label = el("span", "lc-film__name", photo.spec.file);
      const image = el("img", "lc-film__img");
      image.src = photo.thumb;
      image.alt = photo.spec.title;
      image.loading = "lazy";
      image.draggable = false;
      const meta = el("span", "lc-film__meta");
      meta.innerHTML = `${starStrip(photo.rating, 9)}${photo.flag === "pick" ? `<span class="lc-film__flag">${icon("flagPick", 10)}</span>` : ""}`;
      cell.append(label, image, meta);
      this.track.appendChild(cell);
    }
    const active = this.track.querySelector<HTMLElement>(".lc-film.is-active");
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }
}
