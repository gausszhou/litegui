import "@gausszhou/litegui-components/style.css";
import "./style.css";

import { HeaderBar } from "@gausszhou/litegui-components";
import { icon } from "./icons";
import { drawVectorscope, drawWaveform } from "./scopes";
import {
  COLOR_PRESETS,
  DEFAULT_GRADE,
  DISPLAY_FPS,
  PROJECT,
  SEQUENCE_DURATION,
  clamp,
  clipEnd,
  cloneProject,
  findClip,
  formatDuration,
  keyframeValue,
  mediaById,
  snapTime,
  timecode,
  trackOfClip,
  type Clip,
  type ColorGrade,
  type MediaItem,
  type Project,
  type Track
} from "./project";
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
  frameDataUrl,
  mediaThumbnail,
  presetThumbnail,
  renderProgram,
  waveformDataUrl,
  type MediaSources
} from "./render";

type Workspace = "editing" | "color";
type View = "edit" | "export";
type LeftTab = "source" | "effects" | "mixer" | "metadata" | "scopes";
type RightTab = "properties" | "graphics" | "text" | "lumetri" | "effects";
type ProjectTab = "project" | "media" | "libraries" | "info" | "effects" | "markers";
type Tool = "select" | "ripple" | "slip" | "slide" | "rate" | "razor" | "title" | "hand" | "zoom";

interface Snapshot {
  project: string;
  grade: ColorGrade;
  selectedClip: string | null;
}

interface DragState {
  mode: "move" | "trim-start" | "trim-end" | "playhead" | "slip" | "slide" | "rate" | "pan" | null;
  clipId?: string;
  startX: number;
  startTime: number;
  originalStart: number;
  originalDuration: number;
  originalIn: number;
  originalSpeed: number;
  scrollLeft: number;
}

const TOOLS: Array<{ id: Tool; label: string; key: string; icon: string }> = [
  { id: "select", label: "Selection", key: "V", icon: "pointer" },
  { id: "ripple", label: "Ripple Edit", key: "R", icon: "ripple" },
  { id: "slip", label: "Slip", key: "Y", icon: "slip" },
  { id: "slide", label: "Slide", key: "U", icon: "slide" },
  { id: "rate", label: "Rate Stretch", key: "T", icon: "rate" },
  { id: "razor", label: "Razor", key: "C", icon: "razor" },
  { id: "title", label: "Title", key: "G", icon: "title" },
  { id: "hand", label: "Hand", key: "H", icon: "hand" },
  { id: "zoom", label: "Zoom", key: "Z", icon: "zoom" }
];

const MOUNT = `<div class="fc-app">
  <header class="fc-topbar-slot" id="fc-topbar"></header>
  <div class="fc-body">
    <div class="fc-edit" id="fc-edit">
      <div class="fc-upper" id="fc-upper">
        <section class="fc-panel fc-left">
          <div class="fc-panel-tabs" id="fc-left-tabs"></div>
          <div class="fc-panel-body" id="fc-left-body"></div>
        </section>
        <section class="fc-monitor">
          <div class="fc-panel-head"><span class="fc-panel-title">Program</span><button class="fc-mini-btn" data-action="monitor-menu" title="Program menu">${icon(
            "more",
            14
          )}</button></div>
          <div class="fc-program-wrap" id="fc-program-wrap">
            <canvas id="fc-program" width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}"></canvas>
            <div class="fc-program-safe"></div>
            <div class="fc-program-badge" id="fc-program-badge">Fit</div>
          </div>
          <div class="fc-transport" id="fc-transport"></div>
        </section>
        <aside class="fc-panel fc-right">
          <div class="fc-panel-tabs" id="fc-right-tabs"></div>
          <div class="fc-panel-body" id="fc-right-body"></div>
        </aside>
      </div>
      <div class="fc-hsplitter" id="fc-hsplitter"></div>
      <div class="fc-lower" id="fc-lower">
        <section class="fc-panel fc-project">
          <div class="fc-panel-tabs" id="fc-project-tabs"></div>
          <div class="fc-panel-body" id="fc-project-body"></div>
        </section>
        <section class="fc-timeline">
          <div class="fc-timeline-head">
            <span class="fc-panel-title">${icon("film", 13)} Timeline</span>
            <span class="fc-timeline-time" id="fc-timeline-time">00:00:00:00</span>
            <span class="fc-spacer"></span>
            <button class="fc-mini-btn" data-action="timeline-menu" title="Timeline menu">${icon("more", 14)}</button>
          </div>
          <div class="fc-timeline-main">
            <div class="fc-toolrail" id="fc-toolrail"></div>
            <div class="fc-timeline-pane">
              <div class="fc-timeline-toolbar" id="fc-timeline-toolbar"></div>
              <div class="fc-timeline-scroll" id="fc-timeline-scroll">
                <div class="fc-timeline-content" id="fc-timeline-content"></div>
              </div>
            </div>
          </div>
        </section>
        <aside class="fc-meters" id="fc-meters"></aside>
      </div>
    </div>
    <div class="fc-export-view" id="fc-export-view" hidden></div>
  </div>
  <footer class="fc-status" id="fc-status">
    <span class="fc-status-hint" id="fc-status-hint">Click to select, or click in empty space and drag to marquee select. Use Shift, Opt, and Cmd for other options.</span>
    <span class="fc-spacer"></span>
    <span class="fc-status-mode" id="fc-status-mode">EDITING</span>
  </footer>
</div>`;

class FilmCraft {
  private project: Project = cloneProject(PROJECT);
  private view: View = "edit";
  private workspace: Workspace = "editing";
  private leftTab: LeftTab = "effects";
  private rightTab: RightTab = "properties";
  private projectTab: ProjectTab = "project";
  private tool: Tool = "select";
  private selectedClip: string | null = "v1-night";
  private selectedMedia: string = "night";
  private time = 2.09;
  private inPoint = 0;
  private outPoint = SEQUENCE_DURATION;
  private playing = false;
  private playDirection = 1;
  private playSpeed = 1;
  private grade: ColorGrade = { ...DEFAULT_GRADE };
  private showGraph = true;
  private collapsedTracks = new Set<string>();
  private snap = true;
  private link = true;
  private zoom = 28;
  private search = "";
  private binView: "grid" | "list" = "grid";
  private exportDestination = "Media File";
  private exportFormat = "H.264";
  private exportProgress = 0;
  private history: Snapshot[] = [];
  private future: Snapshot[] = [];
  private toastTimer = 0;
  private drag: DragState = {
    mode: null,
    startX: 0,
    startTime: 0,
    originalStart: 0,
    originalDuration: 0,
    originalIn: 0,
    originalSpeed: 100,
    scrollLeft: 0
  };
  private sources: MediaSources = {};
  private importInput!: HTMLInputElement;
  private programCanvas!: HTMLCanvasElement;
  private topbar!: HeaderBar;
  private lastFrame = performance.now();
  private exportTimer = 0;
  private splitterStart: { y: number; upper: number; lower: number } | null = null;

  start() {
    document.querySelector<HTMLElement>("#app")!.innerHTML = MOUNT;
    this.programCanvas = document.querySelector<HTMLCanvasElement>("#fc-program")!;
    this.importInput = document.createElement("input");
    this.importInput.type = "file";
    this.importInput.multiple = true;
    this.importInput.accept = "video/*,image/*";
    this.importInput.hidden = true;
    this.importInput.addEventListener("change", () => this.handleImport());
    document.body.appendChild(this.importInput);

    this.buildTopbar();
    this.buildToolrail();
    this.buildTransport();
    this.bindGlobal();
    this.renderAll();
    this.setTime(this.time);
    this.requestFrame();
  }

  /* ------------------------- shell ------------------------- */

  private buildTopbar() {
    this.topbar = new HeaderBar({ id: "fc-topbarbar", className: "fc-topbar", variant: "topbar" });
    this.topbar.appendTo(document.querySelector<HTMLElement>("#fc-topbar")!);

    const home = document.createElement("button");
    home.className = "fc-home";
    home.innerHTML = icon("home", 16);
    home.title = "Home";
    home.dataset.action = "home";
    this.topbar.left.appendChild(home);

    const tabs = document.createElement("nav");
    tabs.className = "fc-top-tabs";
    for (const [id, label] of [
      ["import", "Import"],
      ["edit", "Edit"],
      ["export", "Export"]
    ]) {
      const button = document.createElement("button");
      button.className = `fc-top-tab${id === "edit" ? " is-active" : ""}`;
      button.dataset.view = id;
      button.textContent = label;
      tabs.appendChild(button);
    }
    this.topbar.left.appendChild(tabs);

    const title = document.createElement("div");
    title.className = "fc-project-title";
    title.id = "fc-project-title";
    title.textContent = "Night of the Living Dead - Trailer";
    this.topbar.center.appendChild(title);

    const workspace = document.createElement("button");
    workspace.className = "fc-workspace-btn";
    workspace.dataset.action = "workspace";
    workspace.innerHTML = `<span id="fc-workspace-label">EDITING</span>${icon("grid", 13)}`;
    this.topbar.right.appendChild(workspace);

    for (const [action, iconName, label] of [
      ["share", "share", "Share"],
      ["notifications", "bell", "Notifications"],
      ["search", "search", "Search"],
      ["fullscreen", "fullscreen", "Full screen"]
    ] as const) {
      const button = document.createElement("button");
      button.className = "fc-top-icon";
      button.dataset.action = action;
      button.title = label;
      button.innerHTML = icon(iconName, 15);
      this.topbar.right.appendChild(button);
    }
  }

  private buildToolrail() {
    const rail = document.querySelector<HTMLElement>("#fc-toolrail")!;
    rail.innerHTML = TOOLS.map(
      tool =>
        `<button class="fc-tool-btn${tool.id === this.tool ? " is-active" : ""}" data-tool="${tool.id}" title="${
          tool.label
        } (${tool.key})">${icon(tool.icon, 16)}</button>`
    ).join("");
  }

  private buildTransport() {
    const transport = document.querySelector<HTMLElement>("#fc-transport")!;
    transport.innerHTML = `
      <span class="fc-monitor-time" id="fc-monitor-time">00:00:00:00</span>
      <select class="fc-select fc-fit-select" data-action="monitor-fit">
        <option>Fit</option>
        <option>100%</option>
        <option>50%</option>
      </select>
      <span class="fc-spacer"></span>
      <span class="fc-transport-speed" id="fc-transport-speed">Speed 100%</span>
      <span class="fc-monitor-duration" id="fc-monitor-duration">00:00:32:00</span>
      <div class="fc-marker-strip" id="fc-marker-strip"></div>
      <div class="fc-transport-buttons">
        <button class="fc-transport-btn" data-action="go-start" title="Go to start">${icon("toStart", 14)}</button>
        <button class="fc-transport-btn" data-action="prev-edit" title="Previous edit">${icon("prevEdit", 14)}</button>
        <button class="fc-transport-btn" data-action="step-back" title="Step back">${icon("stepBack", 14)}</button>
        <button class="fc-transport-btn fc-play-btn" data-action="play" title="Play/Pause (Space)">${icon(
          "play",
          16
        )}</button>
        <button class="fc-transport-btn" data-action="step-forward" title="Step forward">${icon(
          "stepForward",
          14
        )}</button>
        <button class="fc-transport-btn" data-action="next-edit" title="Next edit">${icon("nextEdit", 14)}</button>
        <button class="fc-transport-btn" data-action="go-end" title="Go to end">${icon("toEnd", 14)}</button>
        <button class="fc-transport-btn" data-action="mark-in" title="Mark in (I)">[</button>
        <button class="fc-transport-btn" data-action="mark-out" title="Mark out (O)">]</button>
        <button class="fc-transport-btn" data-action="add-marker" title="Add marker (M)">${icon("marker", 14)}</button>
        <button class="fc-transport-btn" data-action="fit" title="Fit sequence">${icon("fit", 14)}</button>
      </div>
    `;
  }

  private bindGlobal() {
    document.addEventListener("click", this.onClick);
    document.addEventListener("change", this.onChange);
    document.addEventListener("input", this.onInput);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("dblclick", this.onDoubleClick);
    document.addEventListener("pointerdown", this.onPointerDown);
    document.addEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointerup", this.onPointerUp);
    document.querySelector<HTMLElement>("#fc-hsplitter")?.addEventListener("pointerdown", this.onSplitterDown);
  }

  private onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, select, textarea")) return;
    const viewButton = target.closest<HTMLElement>("[data-view]");
    if (viewButton) {
      const view = viewButton.dataset.view;
      if (view === "import") {
        this.importInput.click();
        return;
      }
      this.setView(view as View);
      return;
    }
    const tab = target.closest<HTMLElement>("[data-tab]");
    if (tab?.dataset.tab) {
      this.setTab(tab.dataset.tab);
      return;
    }
    const media = target.closest<HTMLElement>("[data-media-id]");
    if (media?.dataset.mediaId) {
      this.selectedMedia = media.dataset.mediaId;
      this.renderProject();
      this.renderLeft();
      return;
    }
    const clip = target.closest<HTMLElement>("[data-clip-id]");
    if (clip?.dataset.clipId) {
      this.selectClip(clip.dataset.clipId);
      return;
    }
    if (this.onClickExtra(target)) return;
    const tool = target.closest<HTMLElement>("[data-tool]");
    if (tool?.dataset.tool) {
      this.tool = tool.dataset.tool as Tool;
      this.buildToolrail();
      this.toast(`${TOOLS.find(item => item.id === this.tool)?.label} tool`);
      return;
    }
    const action = target.closest<HTMLElement>("[data-action]");
    if (action?.dataset.action) {
      this.runAction(action.dataset.action, action);
      return;
    }
    if (target.closest("#fc-tracks") && this.tool !== "title") {
      this.selectedClip = null;
      this.setTime(this.timeFromClientX(event.clientX));
      this.renderTimeline();
      this.renderPanels();
    }
  };

  private onInput = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target.matches("[data-search]")) {
      this.search = target.value;
      const caret = target instanceof HTMLInputElement ? target.selectionStart : null;
      this.renderProject();
      const next = document.querySelector<HTMLInputElement>("[data-search]");
      if (next) {
        next.focus();
        if (caret !== null) next.setSelectionRange(caret, caret);
      }
      return;
    }
    if (target.matches("[data-zoom]")) {
      this.zoom = Number(target.value);
      return;
    }
    if (target.matches("[data-mixer]")) {
      const id = target.dataset.mixer ?? "";
      const value = Number(target.value);
      const output = document.querySelector<HTMLElement>(`[data-mixer-out="${id}"]`);
      if (output) output.textContent = `${value} dB`;
      return;
    }
    if (target.matches("[data-grade]")) {
      const key = target.dataset.grade as keyof ColorGrade;
      this.grade[key] = Number(target.value);
      this.renderProgramView();
      const output = document.querySelector<HTMLElement>(`[data-grade-out="${key}"]`);
      if (output) output.textContent = this.formatGrade(this.grade[key]);
      return;
    }
    if (target.matches("[data-effect]") && target instanceof HTMLInputElement) {
      this.applyEffectInput(target);
    }
  };

  private onChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target.matches("[data-zoom]")) {
      this.zoom = Number(target.value);
      this.renderTimeline();
      return;
    }
    if (target.matches("[data-prop]") && target instanceof HTMLInputElement) {
      this.applyPropertyInput(target);
    } else if (target.matches("[data-grade]")) {
      const key = target.dataset.grade as keyof ColorGrade;
      this.grade[key] = Number(target.value);
      this.renderProgramView();
    } else if (target.matches("[data-look]")) {
      const preset = COLOR_PRESETS[target.value] ?? DEFAULT_GRADE;
      this.grade = { ...preset };
      this.renderRight();
      this.renderProgramView();
    } else if (target.matches("[data-title-field]") && target.dataset.titleField) {
      this.updateTitleField(target.dataset.titleField as "title" | "subtitle", target.value);
    } else if (target.matches("[data-export]") && target.dataset.export) {
      this.setExportOption(target.dataset.export, target.value);
    }
  };

  private onDoubleClick = (event: MouseEvent) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-media-id]");
    if (card?.dataset.mediaId) {
      this.selectedMedia = card.dataset.mediaId;
      this.insertSelectedMedia("insert");
    }
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement && event.key === "Enter") {
      target.blur();
      return;
    }
    if (target.closest("input, textarea, select")) return;
    const key = event.key.toLowerCase();
    if (event.code === "Space") {
      event.preventDefault();
      this.togglePlay();
      return;
    }
    if (key === "j") {
      this.playDirection = -1;
      this.playSpeed = this.playing && this.playDirection === -1 ? Math.min(4, this.playSpeed * 2) : 1;
      this.play();
      return;
    }
    if (key === "k") {
      this.pause();
      return;
    }
    if (key === "l") {
      this.playDirection = 1;
      this.playSpeed = this.playing && this.playDirection === 1 ? Math.min(4, this.playSpeed * 2) : 1;
      this.play();
      return;
    }
    if (key === "i") {
      this.inPoint = this.time;
      this.toast(`Mark in ${timecode(this.inPoint)}`);
      this.renderTimeline();
      return;
    }
    if (key === "o") {
      this.outPoint = this.time;
      this.toast(`Mark out ${timecode(this.outPoint)}`);
      this.renderTimeline();
      return;
    }
    if (key === "m") {
      this.addMarker();
      return;
    }
    if (key === "delete" || key === "backspace") {
      this.deleteSelected();
      return;
    }
    if (key === "arrowleft") {
      event.preventDefault();
      this.setTime(this.time - 1 / DISPLAY_FPS);
      return;
    }
    if (key === "arrowright") {
      event.preventDefault();
      this.setTime(this.time + 1 / DISPLAY_FPS);
      return;
    }
    if (key === "home") {
      this.setTime(0);
      return;
    }
    if (key === "end") {
      this.setTime(this.project.duration);
      return;
    }
    if (key === "v") {
      this.tool = "select";
      this.buildToolrail();
      return;
    }
    if (key === "c") {
      this.tool = "razor";
      this.buildToolrail();
      return;
    }
    if (key === "h") {
      this.tool = "hand";
      this.buildToolrail();
      return;
    }
    if (key === "r") {
      this.tool = "ripple";
      this.buildToolrail();
      return;
    }
    if (key === "y") {
      this.tool = "slip";
      this.buildToolrail();
      return;
    }
    if (key === "u") {
      this.tool = "slide";
      this.buildToolrail();
      return;
    }
    if (key === "g") {
      this.tool = "title";
      this.buildToolrail();
      return;
    }
    if (key === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (event.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if (key === "y" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.redo();
      return;
    }
    if (key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.saveProject();
      return;
    }
    if (key === "e") {
      this.setView(this.view === "export" ? "edit" : "export");
      return;
    }
    if (key === "0") {
      this.fitTimeline();
    }
  };

  /* ------------------------- timeline / playback ------------------------- */

  private setTime(time: number) {
    this.time = clamp(time, 0, this.project.duration);
    this.updateTimeUi();
    this.renderProgramView();
  }

  private updateTimeUi() {
    const value = timecode(this.time);
    for (const id of ["#fc-monitor-time", "#fc-timeline-time"]) {
      const element = document.querySelector<HTMLElement>(id);
      if (element) element.textContent = value;
    }
    const playhead = document.querySelector<HTMLElement>("#fc-playhead");
    if (playhead) playhead.style.left = `${150 + this.time * this.zoom}px`;
    const timeField = document.querySelector<HTMLInputElement>("[data-current-time]");
    if (timeField) timeField.value = value;
    const programBadge = document.querySelector<HTMLElement>("#fc-program-badge");
    if (programBadge) {
      const clip = this.activeClipAtTime();
      programBadge.textContent = clip ? clip.name : "No clip";
    }
  }

  private activeClipAtTime(): Clip | null {
    for (const track of this.project.tracks) {
      if (track.kind !== "video" || track.muted) continue;
      const clip = track.clips.find(item => this.time >= item.start && this.time < clipEnd(item));
      if (clip && clip.kind === "video") return clip;
    }
    return null;
  }

  private play() {
    this.playing = true;
    this.lastFrame = performance.now();
    this.updatePlayButton();
    this.toast(`Playing ${this.playDirection > 0 ? "forward" : "reverse"} ${this.playSpeed}×`);
  }

  private pause() {
    this.playing = false;
    this.updatePlayButton();
  }

  private togglePlay() {
    if (this.playing) this.pause();
    else {
      this.playDirection = 1;
      this.playSpeed = 1;
      this.play();
    }
  }

  private updatePlayButton() {
    const button = document.querySelector<HTMLElement>('[data-action="play"]');
    if (button) button.innerHTML = icon(this.playing ? "pause" : "play", 16);
  }

  private requestFrame() {
    const loop = (now: number) => {
      const delta = Math.min(0.1, (now - this.lastFrame) / 1000);
      this.lastFrame = now;
      if (this.playing) {
        let next = this.time + delta * this.playDirection * this.playSpeed;
        if (next >= this.project.duration) {
          next = this.project.duration;
          this.playing = false;
          this.updatePlayButton();
        }
        if (next <= 0) {
          next = 0;
          this.playing = false;
          this.updatePlayButton();
        }
        this.setTime(next);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private renderProgramView() {
    renderProgram(this.programCanvas, this.project, this.time, this.grade, this.sources);
    if (this.workspace === "color") {
      const waveform = document.querySelector<HTMLCanvasElement>("#fc-waveform");
      const vector = document.querySelector<HTMLCanvasElement>("#fc-vector");
      if (waveform) drawWaveform(waveform, this.programCanvas);
      if (vector) drawVectorscope(vector, this.programCanvas);
      const graph = document.querySelector<HTMLCanvasElement>("#fc-graph");
      if (graph) this.drawGraph(graph);
    }
  }

  private selectClip(id: string | null) {
    this.selectedClip = id;
    this.renderTimeline();
    this.renderPanels();
    this.renderTransportTime();
  }

  private renderAll() {
    this.renderTabs();
    this.renderLeft();
    this.renderRight();
    this.renderProject();
    this.renderTimeline();
    this.renderTransport();
    this.renderProgramView();
    this.updateTimeUi();
  }

  private setView(view: View) {
    this.view = view;
    document.querySelectorAll<HTMLElement>("[data-view]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });
    document.querySelector<HTMLElement>("#fc-edit")!.hidden = view !== "edit";
    document.querySelector<HTMLElement>("#fc-export-view")!.hidden = view !== "export";
    if (view === "export") {
      if (this.workspace !== "editing") this.setWorkspace("editing");
      this.renderExport();
    } else this.renderProgramView();
  }

  private setTab(tab: string) {
    if (["source", "effects", "mixer", "metadata", "scopes"].includes(tab)) {
      this.leftTab = tab as LeftTab;
    } else if (["properties", "graphics", "text", "lumetri"].includes(tab)) {
      this.rightTab = tab as RightTab;
    } else if (["project", "media", "libraries", "info", "markers"].includes(tab)) {
      this.projectTab = tab as ProjectTab;
    }
    this.renderTabs();
    this.renderLeft();
    this.renderRight();
    this.renderProject();
    if (this.workspace === "color") this.renderProgramView();
  }

  private renderTabs() {
    const leftTabs: Array<[LeftTab, string]> =
      this.workspace === "color"
        ? [
            ["scopes", "Lumetri Scopes"],
            ["source", "Source"],
            ["effects", "Effect Controls"]
          ]
        : [
            ["source", "Source"],
            ["effects", "Effect Controls"],
            ["mixer", "Audio Clip Mixer"],
            ["metadata", "Metadata"]
          ];
    const rightTabs: Array<[RightTab, string]> =
      this.workspace === "color"
        ? [
            ["lumetri", "Lumetri Color"],
            ["effects", "Effects"]
          ]
        : [
            ["properties", "Properties"],
            ["graphics", "Essential Graphics"],
            ["text", "Text"]
          ];
    const left = document.querySelector<HTMLElement>("#fc-left-tabs")!;
    left.innerHTML = leftTabs
      .map(
        ([id, label]) =>
          `<button class="fc-tab${this.leftTab === id ? " is-active" : ""}" data-tab="${id}">${label}</button>`
      )
      .join("");
    const right = document.querySelector<HTMLElement>("#fc-right-tabs")!;
    right.innerHTML = rightTabs
      .map(
        ([id, label]) =>
          `<button class="fc-tab${this.rightTab === id ? " is-active" : ""}" data-tab="${id}">${label}</button>`
      )
      .join("");
    const project = document.querySelector<HTMLElement>("#fc-project-tabs")!;
    const projectTabs: Array<[ProjectTab, string]> = [
      ["project", "Project"],
      ["media", "Media Browser"],
      ["libraries", "Libraries"],
      ["info", "Info"],
      ["effects", "Effects"],
      ["markers", "Markers"]
    ];
    project.innerHTML = projectTabs
      .map(
        ([id, label]) =>
          `<button class="fc-tab${this.projectTab === id ? " is-active" : ""}" data-tab="${id}">${label}</button>`
      )
      .join("");
    const workspaceLabel = document.querySelector<HTMLElement>("#fc-workspace-label");
    if (workspaceLabel) workspaceLabel.textContent = this.workspace === "color" ? "COLOR" : "EDITING";
    const statusMode = document.querySelector<HTMLElement>("#fc-status-mode");
    if (statusMode) statusMode.textContent = this.workspace === "color" ? "COLOR" : "EDITING";
  }

  private renderPanels() {
    this.renderLeft();
    this.renderRight();
  }

  private selectedClipData(): Clip | null {
    return this.selectedClip ? findClip(this.project, this.selectedClip) : null;
  }

  private renderLeft() {
    const host = document.querySelector<HTMLElement>("#fc-left-body")!;
    switch (this.leftTab) {
      case "source":
        host.innerHTML = this.sourcePanel();
        break;
      case "effects":
        host.innerHTML = this.effectsPanel();
        break;
      case "mixer":
        host.innerHTML = this.mixerPanel();
        break;
      case "metadata":
        host.innerHTML = this.metadataPanel();
        break;
      case "scopes":
        host.innerHTML = this.scopesPanel();
        break;
    }
    const graph = host.querySelector<HTMLCanvasElement>("#fc-graph");
    if (graph) this.drawGraph(graph);
  }

  private sourcePanel(): string {
    const media = mediaById(this.project, this.selectedMedia) ?? this.project.media[0];
    const thumb = media.preset ? presetThumbnail(media.preset, 960, 540) : mediaThumbnail(media);
    return `<div class="fc-source-head">
        <span class="fc-source-name">Source · ${media.name}</span>
        <button class="fc-mini-btn" data-action="source-menu">${icon("more", 14)}</button>
      </div>
      <div class="fc-source-preview" style="${thumb ? `background-image:url(${thumb})` : ""}">
        ${media.kind === "audio" ? icon("waveform", 34) : ""}
        <span class="fc-source-timecode">${timecode(this.time)}</span>
      </div>
      <div class="fc-source-info">
        <span>${media.kind.toUpperCase()} · ${media.width ?? 1440} × ${media.height ?? 1080}</span>
        <span>${formatDuration(media.duration)} · ${media.preset ? "Procedural" : "Imported"}</span>
      </div>
      <div class="fc-source-actions">
        <button class="fc-btn" data-action="source-mark-in">Mark In</button>
        <button class="fc-btn" data-action="source-mark-out">Mark Out</button>
        <button class="fc-btn fc-btn--primary" data-action="insert-media">Insert</button>
        <button class="fc-btn" data-action="overwrite-media">Overwrite</button>
      </div>`;
  }

  private effectsPanel(): string {
    const clip = this.selectedClipData();
    if (!clip) {
      return `<div class="fc-empty">Select a clip in the timeline to view its effects.</div>`;
    }
    const k = (prop: string) => (clip.keyframes[prop]?.length ? " is-keyed" : "");
    const stopwatch = (prop: string) =>
      `<button class="fc-stopwatch${k(prop)}" data-keyframe="${prop}" title="Toggle keyframes">${icon(
        "keyframe",
        11
      )}</button>`;
    const row = (label: string, value: string, prop?: string, extra = "") =>
      `<div class="fc-effect-row">
        ${prop ? stopwatch(prop) : '<span class="fc-stopwatch-spacer"></span>'}
        <span class="fc-effect-label">${label}</span>
        <span class="fc-effect-value">${extra ? "" : value}</span>${extra}
      </div>`;
    return `<div class="fc-source-head">
        <span class="fc-source-name">${icon("film", 13)} ${clip.name}</span>
        <button class="fc-mini-btn" data-action="effect-menu">${icon("more", 14)}</button>
      </div>
      <div class="fc-effect-scroll">
        <div class="fc-effect-group">
          <div class="fc-effect-title"><span>fx</span> Motion</div>
          ${row(
            "Position",
            `${Math.round(clip.transform.x)} × ${Math.round(clip.transform.y)}`,
            "transform.x",
            `<input class="fc-num fc-num--tiny" data-effect="transform.x" type="text" value="${Math.round(
              clip.transform.x
            )}" /><input class="fc-num fc-num--tiny" data-effect="transform.y" type="text" value="${Math.round(
              clip.transform.y
            )}" />`
          )}
          ${row(
            "Scale",
            `${Math.round(keyframeValue(clip, "scale", this.time, clip.transform.scale))}`,
            "transform.scale",
            `<input class="fc-num" data-effect="transform.scale" type="text" value="${Math.round(
              keyframeValue(clip, "scale", this.time, clip.transform.scale)
            )}" /><span class="fc-effect-unit">%</span>`
          )}
          ${row(
            "Scale Width",
            "100.0",
            undefined,
            `<input class="fc-num" data-effect="transform.scaleWidth" type="text" value="100" disabled />`
          )}
          <div class="fc-effect-row"><span class="fc-stopwatch-spacer"></span><span class="fc-effect-label">Uniform Scale</span><input type="checkbox" checked /></div>
          ${row(
            "Rotation",
            `${clip.transform.rotation.toFixed(1)}°`,
            "transform.rotation",
            `<input class="fc-num" data-effect="transform.rotation" type="text" value="${clip.transform.rotation.toFixed(
              1
            )}" />`
          )}
          ${row("Anchor Point", "318 × 240")}
          ${row("Anti-flicker Filter", "0.00")}
        </div>
        ${
          this.showGraph
            ? `<div class="fc-graph-wrap"><div class="fc-graph-head"><span>Scale · value</span><button class="fc-mini-btn" data-action="toggle-graph">${icon(
                "graph",
                13
              )}</button></div><canvas id="fc-graph" width="440" height="120"></canvas></div>`
            : ""
        }
        <div class="fc-effect-group">
          <div class="fc-effect-title"><span>fx</span> Opacity</div>
          ${row(
            "Opacity",
            `${Math.round(clip.transform.opacity)}%`,
            "transform.opacity",
            `<input class="fc-num" data-effect="transform.opacity" type="text" value="${Math.round(
              clip.transform.opacity
            )}" />`
          )}
          <div class="fc-effect-row"><span class="fc-stopwatch-spacer"></span><span class="fc-effect-label">Blend Mode</span>
            <select class="fc-select fc-select--tiny"><option>Normal</option><option>Screen</option><option>Multiply</option><option>Overlay</option></select>
          </div>
        </div>
        <div class="fc-effect-group">
          <div class="fc-effect-title"><span>fx</span> Time Remapping</div>
          ${row(
            "Speed",
            "100.00%",
            undefined,
            `<input class="fc-num" data-effect="speed" type="text" value="${clip.speed}" />`
          )}
        </div>
        <div class="fc-effect-group">
          <div class="fc-effect-title"><span>fx</span> Lumetri Color</div>
          ${this.gradeRow("Temperature", "temperature", -100, 100)}
          ${this.gradeRow("Tint", "tint", -100, 100)}
          ${this.gradeRow("Exposure", "exposure", -100, 100)}
          ${this.gradeRow("Contrast", "contrast", -100, 100)}
          ${this.gradeRow("Saturation", "saturation", -100, 100)}
        </div>
        ${
          this.showGraph && clip.keyframes.scale
            ? `<div class="fc-graph-wrap"><div class="fc-graph-head"><span>Scale</span><button class="fc-mini-btn" data-action="toggle-graph">${icon(
                "graph",
                13
              )}</button></div><canvas id="fc-graph" width="440" height="120"></canvas></div>`
            : `<button class="fc-graph-toggle" data-action="toggle-graph">${icon("graph", 13)} Graph Editor</button>`
        }
      </div>`;
  }

  private gradeRow(label: string, key: keyof ColorGrade, min: number, max: number): string {
    void min;
    void max;
    return `<div class="fc-effect-row fc-grade-row">
      <span class="fc-stopwatch-spacer"></span>
      <span class="fc-effect-label">${label}</span>
      <span class="fc-effect-value" data-grade-out="${key}">${this.formatGrade(this.grade[key])}</span>
    </div>`;
  }

  private formatGrade(value: number): string {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
  }

  private mixerPanel(): string {
    return `<div class="fc-mixer">
      ${["A1", "A2"]
        .map(id => {
          const track = this.project.tracks.find(item => item.id === id)!;
          const value = id === "A1" ? -6 : -9;
          return `<div class="fc-mixer-channel">
          <div class="fc-mixer-name">${id}</div>
          <div class="fc-mixer-fader">
            <input type="range" min="-60" max="12" value="${value}" data-mixer="${id}" orient="vertical" />
            <div class="fc-mixer-meter"><span></span></div>
          </div>
          <div class="fc-mixer-db" data-mixer-out="${id}">${value} dB</div>
          <div class="fc-mixer-buttons">
            <button class="fc-mini-btn${
              track.muted ? " is-on" : ""
            }" data-action="toggle-mute" data-track-id="${id}">M</button>
            <button class="fc-mini-btn${
              track.solo ? " is-on" : ""
            }" data-action="toggle-solo" data-track-id="${id}">S</button>
          </div>
        </div>`;
        })
        .join("")}
      <div class="fc-mixer-channel fc-mixer-master">
        <div class="fc-mixer-name">Master</div>
        <div class="fc-mixer-fader"><input type="range" min="-60" max="12" value="-3" data-mixer="master" orient="vertical" /><div class="fc-mixer-meter"><span></span></div></div>
        <div class="fc-mixer-db">-3 dB</div>
      </div>
    </div>
    <div class="fc-mixer-foot">Mix</div>`;
  }

  private metadataPanel(): string {
    const clip = this.selectedClipData();
    const media = mediaById(this.project, clip?.mediaId ?? this.selectedMedia);
    return `<div class="fc-meta-table">
      <div>Clip</div><div>${clip?.name ?? "—"}</div>
      <div>Media</div><div>${media?.name ?? "—"}</div>
      <div>Type</div><div>${media?.kind ?? "—"}</div>
      <div>Duration</div><div>${clip ? formatDuration(clip.duration) : "—"}</div>
      <div>Source In</div><div>${clip ? timecode(clip.inPoint) : "—"}</div>
      <div>Frame Size</div><div>1440 × 1080</div>
      <div>Frame Rate</div><div>23.976 fps</div>
      <div>Color Space</div><div>Rec. 709</div>
      <div>Audio</div><div>48 kHz · Stereo</div>
    </div>`;
  }

  private scopesPanel(): string {
    return `<div class="fc-scopes">
      <div class="fc-scope">
        <div class="fc-scope-head"><span>Waveform</span><span class="fc-scope-label">YUV · 0–100</span></div>
        <canvas id="fc-waveform" width="300" height="430"></canvas>
      </div>
      <div class="fc-scope fc-scope--vector">
        <div class="fc-scope-head"><span>Vectorscope</span><span class="fc-scope-label">Hue / Sat</span></div>
        <canvas id="fc-vector" width="300" height="300"></canvas>
      </div>
    </div>`;
  }

  private renderRight() {
    const host = document.querySelector<HTMLElement>("#fc-right-body")!;
    switch (this.rightTab) {
      case "properties":
        host.innerHTML = this.propertiesPanel();
        break;
      case "graphics":
      case "text":
        host.innerHTML = this.graphicsPanel();
        break;
      case "lumetri":
        host.innerHTML = this.lumetriPanel();
        break;
      case "effects":
        host.innerHTML = this.effectsLibraryPanel();
        break;
    }
    const curves = host.querySelector<HTMLCanvasElement>("#fc-curves");
    if (curves) this.drawCurves(curves);
    const graph = host.querySelector<HTMLCanvasElement>("#fc-graph");
    if (graph) this.drawGraph(graph);
  }

  private propRow(label: string, values: Array<{ value: number; prop: string; unit?: string }>, keyed = false): string {
    return `<div class="fc-prop-row">
      <span class="fc-prop-label">${label}</span>
      <span class="fc-prop-values">${values
        .map(
          item =>
            `<span class="fc-prop-field"><input class="fc-num fc-num--prop" type="text" value="${this.num(
              item.value
            )}" data-prop="${item.prop}" ${item.prop.startsWith("transform.anchor") ? "disabled" : ""} />${
              item.unit ? `<span class="fc-prop-unit">${item.unit}</span>` : ""
            }</span>`
        )
        .join("")}</span>
      <button class="fc-stopwatch${keyed ? " is-keyed" : ""}" data-keyframe="${
      values[0]?.prop ?? ""
    }" title="Toggle keyframes">${icon("keyframe", 11)}</button>
    </div>`;
  }

  private num(value: number): string {
    return Number.isInteger(value) ? `${value}` : `${Math.round(value * 10) / 10}`;
  }

  private propertiesPanel(): string {
    const clip = this.selectedClipData();
    if (!clip) {
      return `<div class="fc-empty">No clip selected. Select a clip in the timeline to inspect its properties.</div>`;
    }
    const scale = keyframeValue(clip, "scale", this.time, clip.transform.scale);
    return `<div class="fc-right-scroll">
      <div class="fc-clip-title"><span class="fc-clip-dot" style="background:${clip.color}"></span>${clip.name}</div>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Transform</span><button class="fc-mini-btn">${icon(
          "more",
          13
        )}</button></div>
        ${this.propRow("Position", [
          { value: clip.transform.x, prop: "transform.x", unit: "X" },
          { value: clip.transform.y, prop: "transform.y", unit: "Y" }
        ])}
        ${this.propRow("Anchor point", [
          { value: 318, prop: "transform.anchorX", unit: "X" },
          { value: 240, prop: "transform.anchorY", unit: "Y" }
        ])}
        ${this.propRow(
          "Scale",
          [{ value: scale, prop: "transform.scale", unit: "%" }],
          (clip.keyframes.scale?.length ?? 0) > 0
        )}
        ${this.propRow(
          "Rotation",
          [{ value: clip.transform.rotation, prop: "transform.rotation", unit: "°" }],
          (clip.keyframes.rotation?.length ?? 0) > 0
        )}
        ${this.propRow(
          "Opacity",
          [{ value: clip.transform.opacity, prop: "transform.opacity", unit: "%" }],
          (clip.keyframes.opacity?.length ?? 0) > 0
        )}
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Crop</span><button class="fc-mini-btn">${icon(
          "more",
          13
        )}</button></div>
        ${this.propRow("Left", [{ value: clip.crop.left, prop: "crop.left", unit: "%" }])}
        ${this.propRow("Top", [{ value: clip.crop.top, prop: "crop.top", unit: "%" }])}
        ${this.propRow("Right", [{ value: clip.crop.right, prop: "crop.right", unit: "%" }])}
        ${this.propRow("Bottom", [{ value: clip.crop.bottom, prop: "crop.bottom", unit: "%" }])}
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Time Remapping</span></div>
        ${this.propRow("Speed", [{ value: clip.speed, prop: "speed", unit: "%" }])}
        <div class="fc-speed-badge">Speed ${clip.speed}%</div>
      </section>
    </div>`;
  }

  private graphicsPanel(): string {
    const clip = this.selectedClipData();
    const titles = this.project.tracks.flatMap(track => track.clips).filter(clip => clip.kind === "title");
    if (!clip || clip.kind !== "title") {
      return `<div class="fc-empty">
        <p>No graphic selected.</p>
        <p class="fc-empty-hint">Select one of the title clips below, or create a title from the timeline.</p>
        <div class="fc-title-list">${titles
          .map(
            title =>
              `<button class="fc-title-item" data-action="select-title" data-clip="${title.id}"><b>${
                title.name
              }</b><span>${timecode(title.start)} – ${timecode(clipEnd(title))}</span></button>`
          )
          .join("")}</div>
      </div>`;
    }
    return `<div class="fc-right-scroll">
      <div class="fc-clip-title"><span class="fc-clip-dot" style="background:${clip.color}"></span>${clip.name}</div>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Source Text</span></div>
        <textarea class="fc-textarea" data-title-field="title">${clip.title ?? ""}</textarea>
        <label class="fc-graphics-label">Subtitle</label>
        <input class="fc-text-input" data-title-field="subtitle" value="${clip.subtitle ?? ""}" />
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Font</span></div>
        <select class="fc-select"><option>Georgia</option><option>Times New Roman</option><option>Inter</option></select>
        <div class="fc-graphics-row"><span>Size</span><input class="fc-num" value="48" /><span>px</span></div>
        <div class="fc-graphics-row"><span>Tracking</span><input class="fc-num" value="120" /><span>%</span></div>
        <div class="fc-graphics-row"><span>Fill</span><span class="fc-color-chip" style="background:#f2f0ea"></span></div>
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Background</span></div>
        <div class="fc-graphics-row"><span>Color</span><span class="fc-color-chip" style="background:#000"></span></div>
        <div class="fc-graphics-row"><span>Opacity</span><input class="fc-num" value="0" /><span>%</span></div>
      </section>
    </div>`;
  }

  private lumetriPanel(): string {
    return `<div class="fc-right-scroll">
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Basic Correction</span><button class="fc-mini-btn">${icon(
          "chevronDown",
          12
        )}</button></div>
        <label class="fc-look-row"><span>Input LUT</span><select class="fc-select"><option>None</option><option>Rec. 709</option><option>Film</option></select></label>
        ${this.gradeSlider("Temperature", "temperature", -100, 100)}
        ${this.gradeSlider("Tint", "tint", -100, 100)}
        ${this.gradeSlider("Exposure", "exposure", -100, 100)}
        ${this.gradeSlider("Contrast", "contrast", -100, 100)}
        ${this.gradeSlider("Highlights", "highlights", -100, 100)}
        ${this.gradeSlider("Shadows", "shadows", -100, 100)}
        ${this.gradeSlider("Whites", "whites", -100, 100)}
        ${this.gradeSlider("Blacks", "blacks", -100, 100)}
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Creative</span><button class="fc-mini-btn">${icon(
          "chevronDown",
          12
        )}</button></div>
        <label class="fc-look-row"><span>Look</span>
          <select class="fc-select" data-look>
            ${Object.keys(COLOR_PRESETS)
              .map(key => `<option ${key === "None" ? "selected" : ""}>${key}</option>`)
              .join("")}
          </select>
        </label>
        ${this.gradeSlider("Faded Film", "fadedFilm", 0, 100)}
        ${this.gradeSlider("Vibrance", "vibrance", -100, 100)}
        ${this.gradeSlider("Saturation", "saturation", -100, 100)}
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Curves</span><button class="fc-mini-btn">${icon(
          "chevronDown",
          12
        )}</button></div>
        <canvas id="fc-curves" width="360" height="160"></canvas>
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Color Wheels</span><button class="fc-mini-btn">${icon(
          "chevronDown",
          12
        )}</button></div>
        <div class="fc-wheels">
          ${["Shadows", "Midtones", "Highlights"]
            .map(
              name => `<div class="fc-wheel"><div class="fc-wheel-ring"><span></span></div><span>${name}</span></div>`
            )
            .join("")}
        </div>
      </section>
      <section class="fc-prop-section">
        <div class="fc-prop-section-head"><span>Vignette</span><button class="fc-mini-btn">${icon(
          "chevronDown",
          12
        )}</button></div>
        ${this.gradeSlider("Amount", "vignette", 0, 100)}
      </section>
    </div>`;
  }

  private gradeSlider(label: string, key: keyof ColorGrade, min: number, max: number): string {
    return `<div class="fc-lumetri-row">
      <span class="fc-lumetri-label">${label}</span>
      <input class="fc-lumetri-range" type="range" min="${min}" max="${max}" step="1" value="${
      this.grade[key]
    }" data-grade="${key}" />
      <span class="fc-lumetri-value" data-grade-out="${key}">${this.formatGrade(this.grade[key])}</span>
    </div>`;
  }

  private effectsLibraryPanel(): string {
    return `<div class="fc-right-scroll">
      <div class="fc-lib-search"><input class="fc-search-input" placeholder="Search effects" /></div>
      ${[
        ["Video Effects", ["Lumetri Color", "Crop", "Transform", "Gaussian Blur", "Drop Shadow", "Noise"]],
        ["Transitions", ["Cross Dissolve", "Dip to Black", "Wipe", "Slide"]],
        ["Audio Effects", ["Parametric EQ", "Limiter", "Reverb", "Noise Reduction"]]
      ]
        .map(
          ([group, items]) => `<section class="fc-prop-section">
            <div class="fc-prop-section-head"><span>${group}</span></div>
            ${(items as string[])
              .map(
                item =>
                  `<button class="fc-effect-library-row"><span>${item}</span><span class="fc-effect-add">${icon(
                    "plus",
                    12
                  )}</span></button>`
              )
              .join("")}
          </section>`
        )
        .join("")}
    </div>`;
  }

  private renderProject() {
    const host = document.querySelector<HTMLElement>("#fc-project-body")!;
    if (this.projectTab === "markers") {
      host.innerHTML = `<div class="fc-markers-panel">
        <div class="fc-marker-head"><span>Markers</span><button class="fc-mini-btn" data-action="add-marker">${icon(
          "plus",
          13
        )}</button></div>
        ${this.project.markers
          .slice()
          .sort((a, b) => a.time - b.time)
          .map(
            marker => `<button class="fc-marker-row" data-action="goto-marker" data-time="${marker.time}">
              <span class="fc-marker-dot" style="background:${marker.color}"></span>
              <span class="fc-marker-time">${timecode(marker.time)}</span>
              <span class="fc-marker-label">${marker.label}</span>
            </button>`
          )
          .join("")}
      </div>`;
      return;
    }
    if (this.projectTab === "info") {
      host.innerHTML = `<div class="fc-meta-table fc-meta-table--panel">
        <div>Project</div><div>${this.project.name}</div>
        <div>Sequence</div><div>Night of the Living Dead - Trailer</div>
        <div>Frame Size</div><div>1440 × 1080</div>
        <div>Frame Rate</div><div>23.976 fps</div>
        <div>Duration</div><div>${timecode(this.project.duration)}</div>
        <div>Color</div><div>Rec. 709 · 8-bit</div>
        <div>Audio</div><div>48 kHz · Stereo</div>
      </div>`;
      return;
    }
    if (this.projectTab === "libraries") {
      host.innerHTML = `<div class="fc-library-list">
        ${["Video", "Audio", "Titles", "Transitions", "LUTs", "Graphics"]
          .map(
            name =>
              `<button class="fc-library-row">${icon("folder", 15)}<span>${name}</span><span class="fc-library-count">${
                name === "Video" ? 5 : 3
              }</span></button>`
          )
          .join("")}
      </div>`;
      return;
    }
    if (this.projectTab === "effects") {
      host.innerHTML = `<div class="fc-effect-browser">
        <input class="fc-search-input" placeholder="Search effects" />
        <div class="fc-effect-grid">${[
          "Lumetri Color",
          "Crop",
          "Transform",
          "Gaussian Blur",
          "Drop Shadow",
          "Noise",
          "Cross Dissolve",
          "Dip to Black",
          "Wipe",
          "Slide",
          "EQ",
          "Limiter"
        ]
          .map(
            name =>
              `<button class="fc-effect-card"><span class="fc-effect-thumb">${icon(
                "effects",
                18
              )}</span><span>${name}</span></button>`
          )
          .join("")}</div>
      </div>`;
      return;
    }
    const media = this.project.media.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()));
    host.innerHTML = `<div class="fc-bin-head">
        <span class="fc-bin-title">${this.project.name}</span>
        <span class="fc-bin-count">${this.project.media.length} items</span>
        <button class="fc-mini-btn" data-action="bin-menu">${icon("more", 14)}</button>
      </div>
      <div class="fc-bin-search"><span>${icon(
        "search",
        13
      )}</span><input class="fc-search-input" placeholder="Search" data-search value="${this.search}" /></div>
      <div class="fc-bin-${this.binView}">
        ${media.map(item => this.mediaCard(item)).join("")}
      </div>
      <div class="fc-bin-foot">
        <button class="fc-mini-btn" data-action="bin-menu">${icon("more", 14)}</button>
        <span class="fc-spacer"></span>
        <button class="fc-mini-btn${this.binView === "grid" ? " is-active" : ""}" data-action="bin-grid">${icon(
      "grid",
      14
    )}</button>
        <button class="fc-mini-btn${this.binView === "list" ? " is-active" : ""}" data-action="bin-list">${icon(
      "list",
      14
    )}</button>
        <button class="fc-mini-btn" data-action="new-bin">${icon("folder", 14)}</button>
        <button class="fc-mini-btn" data-action="import">${icon("plus", 14)}</button>
      </div>`;
  }

  private mediaCard(media: MediaItem): string {
    const thumb = mediaThumbnail(media);
    const duration = media.kind === "audio" ? formatDuration(media.duration) : formatDuration(media.duration);
    return `<button class="fc-media-card${this.selectedMedia === media.id ? " is-selected" : ""}" data-media-id="${
      media.id
    }" title="${media.name}">
      <span class="fc-media-thumb" style="${thumb ? `background-image:url(${thumb})` : ""};--media-color:${
      media.color
    }">
        ${
          media.kind === "audio"
            ? `<span class="fc-media-wave" style="background-image:url(${waveformDataUrl(
                media.id.length * 17,
                "#79c4fa"
              )})"></span>`
            : ""
        }
        <span class="fc-media-duration">${duration}</span>
        ${media.kind === "audio" ? `<span class="fc-media-kind">${icon("music", 12)}</span>` : ""}
      </span>
      <span class="fc-media-name">${media.name}</span>
    </button>`;
  }

  private renderTimeline() {
    const toolbar = document.querySelector<HTMLElement>("#fc-timeline-toolbar")!;
    toolbar.innerHTML = `
      <button class="fc-timeline-timecode" data-action="focus-time">${timecode(this.time)}</button>
      <button class="fc-toolbar-btn${this.snap ? " is-active" : ""}" data-action="snap" title="Snapping">${icon(
      "magnet",
      14
    )}</button>
      <button class="fc-toolbar-btn${this.link ? " is-active" : ""}" data-action="link" title="Linked selection">${icon(
      "link",
      14
    )}</button>
      <span class="fc-toolbar-sep"></span>
      <button class="fc-toolbar-btn" data-action="add-marker" title="Add marker">${icon("marker", 13)}</button>
      <span class="fc-spacer"></span>
      <button class="fc-toolbar-btn" data-action="zoom-out" title="Zoom out">${icon("zoomOut", 13)}</button>
      <input class="fc-zoom-slider" type="range" min="14" max="80" step="1" value="${this.zoom}" data-zoom />
      <button class="fc-toolbar-btn" data-action="zoom-in" title="Zoom in">${icon("zoomIn", 13)}</button>
      <button class="fc-toolbar-btn" data-action="fit" title="Fit timeline">${icon("fit", 13)}</button>
    `;
    const content = document.querySelector<HTMLElement>("#fc-timeline-content")!;
    const width = Math.max(900, this.project.duration * this.zoom);
    const ticks: string[] = [];
    for (let second = 0; second <= this.project.duration; second += 1) {
      const major = second % 5 === 0;
      ticks.push(
        `<span class="fc-ruler-tick${major ? " is-major" : ""}" style="left:${second * this.zoom}px">${
          major
            ? `<em>${timecode(second)
                .slice(3)
                .replace(/:(\d+)$/, ".$1")}</em>`
            : ""
        }</span>`
      );
    }
    const markers = this.project.markers
      .map(
        marker =>
          `<button class="fc-ruler-marker" data-action="goto-marker" data-time="${marker.time}" style="left:${
            marker.time * this.zoom
          }px;--marker-color:${marker.color}" title="${marker.label}"></button>`
      )
      .join("");
    const trackRows = this.project.tracks.map(track => this.trackRow(track)).join("");
    content.style.width = `${width + 150}px`;
    content.innerHTML = `
      <div class="fc-ruler-row">
        <div class="fc-ruler-corner"><span>${icon("film", 12)} Sequence</span></div>
        <div class="fc-ruler" id="fc-ruler" style="width:${width}px">
          ${ticks.join("")}
          ${markers}
          <div class="fc-inout" style="left:${this.inPoint * this.zoom}px;width:${Math.max(
      0,
      (this.outPoint - this.inPoint) * this.zoom
    )}px"></div>
        </div>
      </div>
      <div class="fc-tracks" id="fc-tracks">${trackRows}</div>
      <div class="fc-playhead" id="fc-playhead" style="left:${150 + this.time * this.zoom}px">
        <span class="fc-playhead-head"></span>
      </div>`;
    this.updateTimeUi();
    this.updateMeters();
  }

  private trackRow(track: Track): string {
    const collapsed = this.collapsedTracks.has(track.id);
    const height = collapsed ? 24 : track.height;
    const controls =
      track.kind === "video"
        ? `<button class="fc-track-btn${track.muted ? " is-on" : ""}" data-action="toggle-eye" data-track-id="${
            track.id
          }" title="Toggle output">${icon(track.muted ? "eyeOff" : "eye", 13)}</button>
           <button class="fc-track-btn${track.locked ? " is-on" : ""}" data-action="toggle-lock" data-track-id="${
            track.id
          }" title="Lock">${icon(track.locked ? "lock" : "unlock", 12)}</button>`
        : `<button class="fc-track-btn${track.muted ? " is-on" : ""}" data-action="toggle-mute" data-track-id="${
            track.id
          }" title="Mute">M</button>
           <button class="fc-track-btn${track.solo ? " is-on" : ""}" data-action="toggle-solo" data-track-id="${
            track.id
          }" title="Solo">S</button>
           <button class="fc-track-btn${track.locked ? " is-on" : ""}" data-action="toggle-lock" data-track-id="${
            track.id
          }" title="Lock">${icon(track.locked ? "lock" : "unlock", 12)}</button>`;
    return `<div class="fc-track${collapsed ? " is-collapsed" : ""}" data-track-id="${track.id}">
      <div class="fc-track-head" style="height:${height}px">
        <button class="fc-track-expand" data-action="toggle-track" data-track-id="${track.id}">${icon(
      collapsed ? "chevronRight" : "chevronDown",
      11
    )}</button>
        <span class="fc-track-badge">${track.id}</span>
        <span class="fc-track-name">${track.name}</span>
        <span class="fc-spacer"></span>
        ${controls}
      </div>
      <div class="fc-track-lane" data-track-id="${track.id}" style="height:${height}px;width:${Math.max(
      900,
      this.project.duration * this.zoom
    )}px;--fc-second:${this.zoom}px">
        ${track.clips.map(clip => this.clipBlock(clip)).join("")}
      </div>
    </div>`;
  }

  private clipBlock(clip: Clip): string {
    const media = mediaById(this.project, clip.mediaId);
    const thumb = media ? mediaThumbnail(media) : "";
    const audio = clip.kind === "audio";
    const bg = audio
      ? `background-image:url(${waveformDataUrl(
          (media?.id.length ?? 3) * 23,
          clip.trackId === "A2" ? "#9ccf61" : "#79c4fa"
        )})`
      : clip.kind === "title"
      ? ""
      : thumb
      ? `background-image:url(${thumb})`
      : "";
    const keyframes = Object.entries(clip.keyframes)
      .flatMap(([property, frames]) => (property === "scale" ? frames : []))
      .map(
        frame =>
          `<span class="fc-keyframe-dot" style="left:${Math.max(
            2,
            Math.min(clip.duration * this.zoom - 4, frame.time * this.zoom)
          )}px"></span>`
      )
      .join("");
    return `<div class="fc-clip fc-clip--${clip.kind}${audio ? " fc-clip--audio" : ""}${
      this.selectedClip === clip.id ? " is-selected" : ""
    }" data-clip-id="${clip.id}" style="left:${clip.start * this.zoom}px;width:${Math.max(
      8,
      clip.duration * this.zoom
    )}px;--clip-color:${clip.color};${bg}" title="${clip.name}">
      <span class="fc-clip-shade"></span>
      <span class="fc-clip-name">${clip.name}</span>
      <span class="fc-trim fc-trim--start" data-trim="start"></span>
      <span class="fc-trim fc-trim--end" data-trim="end"></span>
      ${keyframes}
    </div>`;
  }

  private renderTransport() {
    const duration = document.querySelector<HTMLElement>("#fc-monitor-duration");
    if (duration) duration.textContent = timecode(this.project.duration);
    const speed = document.querySelector<HTMLElement>("#fc-transport-speed");
    if (speed) speed.textContent = `Speed ${Math.round(this.playSpeed * 100)}%`;
    const strip = document.querySelector<HTMLElement>("#fc-marker-strip");
    if (strip) {
      strip.innerHTML = this.project.markers
        .map(
          marker =>
            `<button class="fc-mini-marker" data-action="goto-marker" data-time="${marker.time}" style="left:${
              (marker.time / this.project.duration) * 100
            }%;--marker-color:${marker.color}" title="${marker.label}"></button>`
        )
        .join("");
    }
    this.updateTimeUi();
  }

  private updateMeters() {
    const host = document.querySelector<HTMLElement>("#fc-meters");
    if (!host || this.workspace === "color") {
      if (host) host.innerHTML = "";
      return;
    }
    const levels = [0.72, 0.54, 0.38];
    host.innerHTML = `<div class="fc-meter-head">dB</div>
      <div class="fc-meter-scale">${[0, -6, -12, -18, -24, -30, -36, -42, -48, -54, -60]
        .map(value => `<span>${value}</span>`)
        .join("")}</div>
      <div class="fc-meter-bars">
        ${levels
          .map(
            (level, index) => `<div class="fc-meter-bar" data-level="${level}">
              <span style="height:${level * 100}%"></span>
              ${index === 0 ? '<i class="fc-meter-peak" style="bottom:78%"></i>' : ""}
            </div>`
          )
          .join("")}
      </div>
      <div class="fc-meter-labels"><span>S</span><span>S</span><span>dB</span></div>
      <div class="fc-meter-readout"><span>M</span><strong>-7.1</strong><span>LUFS</span></div>
      <div class="fc-meter-readout"><span>S</span><strong>-7.2</strong><span>LUFS</span></div>
      <div class="fc-meter-readout"><span>I</span><strong>-7.9</strong><span>LUFS</span></div>
      <div class="fc-meter-readout"><span>TP</span><strong>-0.9</strong><span>dBTP</span></div>`;
  }

  private renderTransportTime() {
    this.updateTimeUi();
    this.renderTransport();
  }

  /* ------------------------- interaction ------------------------- */

  private onClickExtra(target: HTMLElement): boolean {
    const keyframe = target.closest<HTMLElement>("[data-keyframe]");
    if (keyframe?.dataset.keyframe) {
      this.toggleKeyframe(keyframe.dataset.keyframe);
      return true;
    }
    const title = target.closest<HTMLElement>("[data-clip]");
    if (title?.dataset.clip) {
      this.selectClip(title.dataset.clip);
      return true;
    }
    return false;
  }

  private runAction(action: string, anchor: HTMLElement) {
    switch (action) {
      case "workspace":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom + 4, [
          { label: "Editing", checked: this.workspace === "editing", action: () => this.setWorkspace("editing") },
          { label: "Color", checked: this.workspace === "color", action: () => this.setWorkspace("color") }
        ]);
        break;
      case "play":
        this.togglePlay();
        break;
      case "go-start":
        this.setTime(0);
        break;
      case "go-end":
        this.setTime(this.project.duration);
        break;
      case "step-back":
        this.setTime(this.time - 1 / DISPLAY_FPS);
        break;
      case "step-forward":
        this.setTime(this.time + 1 / DISPLAY_FPS);
        break;
      case "prev-edit":
        this.setTime(this.nearestEdit(-1));
        break;
      case "next-edit":
        this.setTime(this.nearestEdit(1));
        break;
      case "mark-in":
        this.inPoint = this.time;
        this.renderTimeline();
        this.toast(`Mark in ${timecode(this.inPoint)}`);
        break;
      case "mark-out":
        this.outPoint = this.time;
        this.renderTimeline();
        this.toast(`Mark out ${timecode(this.outPoint)}`);
        break;
      case "add-marker":
        this.addMarker();
        break;
      case "fit":
        this.fitTimeline();
        break;
      case "snap":
        this.snap = !this.snap;
        this.renderTimeline();
        break;
      case "link":
        this.link = !this.link;
        this.renderTimeline();
        break;
      case "zoom-in":
        this.zoom = clamp(this.zoom + 4, 14, 80);
        this.renderTimeline();
        break;
      case "zoom-out":
        this.zoom = clamp(this.zoom - 4, 14, 80);
        this.renderTimeline();
        break;
      case "toggle-graph":
        this.showGraph = !this.showGraph;
        this.renderLeft();
        break;
      case "toggle-mute":
        this.toggleTrack(anchor.dataset.trackId, "muted");
        break;
      case "toggle-solo":
        this.toggleTrack(anchor.dataset.trackId, "solo");
        break;
      case "toggle-lock":
        this.toggleTrack(anchor.dataset.trackId, "locked");
        break;
      case "toggle-eye":
        this.toggleTrack(anchor.dataset.trackId, "muted");
        break;
      case "toggle-track":
        if (anchor.dataset.trackId) {
          if (this.collapsedTracks.has(anchor.dataset.trackId)) this.collapsedTracks.delete(anchor.dataset.trackId);
          else this.collapsedTracks.add(anchor.dataset.trackId);
          this.renderTimeline();
        }
        break;
      case "source-mark-in":
      case "source-mark-out":
        this.toast("Source marks are applied to the next insert.");
        break;
      case "insert-media":
        this.insertSelectedMedia("insert");
        break;
      case "overwrite-media":
        this.insertSelectedMedia("overwrite");
        break;
      case "select-title":
        if (anchor.dataset.clip) this.selectClip(anchor.dataset.clip);
        break;
      case "goto-marker":
        this.setTime(Number(anchor.dataset.time ?? 0));
        break;
      case "bin-grid":
        this.binView = "grid";
        this.renderProject();
        break;
      case "bin-list":
        this.binView = "list";
        this.renderProject();
        break;
      case "import":
        this.importInput.click();
        break;
      case "new-bin":
        this.toast("New bin created.");
        break;
      case "undo":
        this.undo();
        break;
      case "redo":
        this.redo();
        break;
      case "save":
        this.saveProject();
        break;
      case "fullscreen":
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => this.toast("Fullscreen is unavailable."));
        break;
      case "search":
        this.projectTab = "project";
        this.renderProject();
        this.renderTabs();
        document.querySelector<HTMLInputElement>("[data-search]")?.focus();
        break;
      case "home":
        this.setView("edit");
        this.projectTab = "project";
        this.renderProject();
        this.renderTabs();
        break;
      case "share":
        this.toast("Share link copied to clipboard.");
        void navigator.clipboard?.writeText(location.href).catch(() => undefined);
        break;
      case "notifications":
        this.toast("No new notifications.");
        break;
      case "monitor-menu":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom, [
          { label: "Fit", action: () => this.toast("Monitor fit") },
          { label: "Full Resolution", action: () => this.toast("Full resolution") },
          { label: "Safe Margins", action: () => this.toast("Safe margins") }
        ]);
        break;
      case "timeline-menu":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom + 3, [
          { label: "Fit Timeline", action: () => this.fitTimeline() },
          { label: "Add Marker", action: () => this.addMarker() },
          { label: this.snap ? "Disable Snapping" : "Enable Snapping", action: () => this.runAction("snap", anchor) },
          { label: "Clear Markers", action: () => this.clearMarkers() }
        ]);
        break;
      case "bin-menu":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom + 3, [
          { label: "Grid View", checked: this.binView === "grid", action: () => this.runAction("bin-grid", anchor) },
          { label: "List View", checked: this.binView === "list", action: () => this.runAction("bin-list", anchor) },
          { label: "Import Media…", action: () => this.importInput.click() },
          { label: "New Bin", action: () => this.toast("New bin created.") }
        ]);
        break;
      case "source-menu":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom + 3, [
          { label: "Insert into Timeline", action: () => this.insertSelectedMedia("insert") },
          { label: "Overwrite Timeline", action: () => this.insertSelectedMedia("overwrite") },
          { label: "Mark In", action: () => this.runAction("source-mark-in", anchor) },
          { label: "Mark Out", action: () => this.runAction("source-mark-out", anchor) }
        ]);
        break;
      case "effect-menu":
        this.openMenuAt(anchor.getBoundingClientRect().left, anchor.getBoundingClientRect().bottom + 3, [
          { label: "Reset Transform", action: () => this.resetTransform() },
          { label: "Reset Color", action: () => this.resetColor() },
          { label: "Remove All Effects", action: () => this.removeEffects() }
        ]);
        break;
      case "export-start":
        this.startExport();
        break;
      case "export-destination":
        this.exportDestination = anchor.dataset.destination ?? "Media File";
        this.renderExport();
        break;
      default:
        this.toast(action);
        break;
    }
  }

  private setWorkspace(workspace: Workspace) {
    this.workspace = workspace;
    document.querySelector<HTMLElement>("#fc-lower")?.classList.toggle("is-color", workspace === "color");
    if (workspace === "color") {
      this.leftTab = "scopes";
      this.rightTab = "lumetri";
      if (this.time < 8 || this.time > 16) this.setTime(10.5);
    } else {
      this.leftTab = "effects";
      this.rightTab = "properties";
    }
    this.renderTabs();
    this.renderLeft();
    this.renderRight();
    this.updateMeters();
    this.renderProgramView();
  }

  private nearestEdit(direction: number): number {
    const points = [0, this.project.duration];
    for (const track of this.project.tracks) {
      for (const clip of track.clips) {
        points.push(clip.start, clipEnd(clip));
      }
    }
    const unique = [...new Set(points)].sort((a, b) => a - b);
    if (direction > 0) return unique.find(point => point > this.time + 0.001) ?? this.project.duration;
    return [...unique].reverse().find(point => point < this.time - 0.001) ?? 0;
  }

  private toggleTrack(id: string | undefined, key: "muted" | "solo" | "locked") {
    const track = this.project.tracks.find(item => item.id === id);
    if (!track) return;
    this.pushHistory();
    track[key] = !track[key];
    this.renderTimeline();
    this.renderProgramView();
  }

  private addMarker() {
    this.pushHistory();
    const colors = ["#e0a23c", "#3b82f6", "#6fae54", "#d05b5b"];
    this.project.markers.push({
      id: `marker-${Date.now()}`,
      time: this.time,
      color: colors[this.project.markers.length % colors.length],
      label: `Marker ${this.project.markers.length + 1}`
    });
    this.renderTimeline();
    this.renderTransport();
    this.toast(`Marker added at ${timecode(this.time)}`);
  }

  private fitTimeline() {
    this.zoom = clamp(900 / this.project.duration, 14, 80);
    this.renderTimeline();
  }

  private toggleKeyframe(property: string) {
    const clip = this.selectedClipData();
    if (!clip) return;
    const map: Record<string, string> = {
      "transform.x": "x",
      "transform.y": "y",
      "transform.scale": "scale",
      "transform.rotation": "rotation",
      "transform.opacity": "opacity",
      speed: "speed"
    };
    const key = map[property] ?? property;
    clip.keyframes[key] = clip.keyframes[key]?.length ? [] : [{ time: 0, value: this.keyframeBase(clip, key) }];
    this.renderTimeline();
    this.renderPanels();
    this.drawProgram();
    this.toast(clip.keyframes[key].length ? `Keyframed ${key}` : `Removed ${key} keyframes`);
  }

  private keyframeBase(clip: Clip, key: string): number {
    switch (key) {
      case "x":
        return clip.transform.x;
      case "y":
        return clip.transform.y;
      case "scale":
        return clip.transform.scale;
      case "rotation":
        return clip.transform.rotation;
      case "opacity":
        return clip.transform.opacity;
      default:
        return clip.speed;
    }
  }

  private drawProgram() {
    this.renderProgramView();
  }

  private onSplitterDown = (event: PointerEvent) => {
    const upper = document.querySelector<HTMLElement>("#fc-upper")!;
    const lower = document.querySelector<HTMLElement>("#fc-lower")!;
    this.splitterStart = {
      y: event.clientY,
      upper: upper.getBoundingClientRect().height,
      lower: lower.getBoundingClientRect().height
    };
    event.preventDefault();
  };

  private onPointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, button, select, textarea")) return;
    if (this.splitterStart) return;
    if (target.closest("#fc-hsplitter")) return;
    if (this.tool === "hand" && target.closest(".fc-timeline-scroll")) {
      const scroll = document.querySelector<HTMLElement>("#fc-timeline-scroll")!;
      this.drag = {
        mode: "pan",
        startX: event.clientX,
        startTime: 0,
        originalStart: 0,
        originalDuration: 0,
        originalIn: 0,
        originalSpeed: 100,
        scrollLeft: scroll.scrollLeft
      };
      event.preventDefault();
      return;
    }
    if (this.tool === "zoom" && target.closest(".fc-timeline-scroll")) {
      this.zoom = clamp(this.zoom + (event.altKey ? -4 : 4), 14, 80);
      this.renderTimeline();
      return;
    }
    if (this.tool === "title" && (target.closest("#fc-ruler") || target.closest(".fc-track-lane"))) {
      this.addTitleAt(this.timeFromClientX(event.clientX));
      event.preventDefault();
      return;
    }
    const ruler = target.closest<HTMLElement>("#fc-ruler");
    if (ruler) {
      this.pushHistory();
      this.setTime(this.timeFromClientX(event.clientX));
      this.drag.mode = "playhead";
      this.drag.startX = event.clientX;
      event.preventDefault();
      return;
    }
    const clipElement = target.closest<HTMLElement>("[data-clip-id]");
    if (!clipElement) {
      if (this.tool === "title" && target.closest(".fc-track-lane")) {
        this.addTitleAt(this.timeFromClientX(event.clientX));
        event.preventDefault();
      }
      return;
    }
    const clip = findClip(this.project, clipElement.dataset.clipId ?? "");
    if (!clip) return;
    const trim = target.closest<HTMLElement>("[data-trim]");
    if (this.tool === "title") {
      this.addTitleAt(this.timeFromClientX(event.clientX));
      event.preventDefault();
      return;
    }
    if (this.tool === "razor") {
      this.splitClip(clip, this.timeFromClientX(event.clientX));
      event.preventDefault();
      return;
    }
    this.selectClip(clip.id);
    this.pushHistory();
    const mode =
      this.tool === "slip"
        ? "slip"
        : this.tool === "slide"
        ? "slide"
        : this.tool === "rate"
        ? "rate"
        : trim?.dataset.trim === "start"
        ? "trim-start"
        : trim?.dataset.trim === "end"
        ? "trim-end"
        : "move";
    this.drag = {
      mode,
      clipId: clip.id,
      startX: event.clientX,
      startTime: this.timeFromClientX(event.clientX),
      originalStart: clip.start,
      originalDuration: clip.duration,
      originalIn: clip.inPoint,
      originalSpeed: clip.speed,
      scrollLeft: 0
    };
    event.preventDefault();
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.splitterStart) {
      const upper = document.querySelector<HTMLElement>("#fc-upper")!;
      const delta = event.clientY - this.splitterStart.y;
      const height = clamp(this.splitterStart.upper + delta, 260, window.innerHeight - 260);
      upper.style.height = `${height}px`;
      upper.style.flex = "0 0 auto";
      return;
    }
    if (this.drag.mode === "pan") {
      const scroll = document.querySelector<HTMLElement>("#fc-timeline-scroll");
      if (scroll) scroll.scrollLeft = this.drag.scrollLeft - (event.clientX - this.drag.startX);
      return;
    }
    if (this.drag.mode === "playhead") {
      this.setTime(this.timeFromClientX(event.clientX));
      return;
    }
    if (!this.drag.mode || !this.drag.clipId) return;
    const clip = findClip(this.project, this.drag.clipId);
    if (!clip) return;
    const delta = (event.clientX - this.drag.startX) / this.zoom;
    if (this.drag.mode === "move") {
      const start = this.snapTime(this.drag.originalStart + delta, clip);
      clip.start = clamp(start, 0, this.project.duration - clip.duration);
    } else if (this.drag.mode === "trim-start") {
      const start = clamp(
        this.snapTime(this.drag.originalStart + delta, clip),
        0,
        this.drag.originalStart + this.drag.originalDuration - 0.2
      );
      const change = start - this.drag.originalStart;
      clip.start = start;
      clip.duration = this.drag.originalDuration - change;
      clip.inPoint = Math.max(0, this.drag.originalIn + change);
    } else if (this.drag.mode === "trim-end") {
      const end = clamp(
        this.snapTime(this.drag.originalStart + this.drag.originalDuration + delta, clip),
        this.drag.originalStart + 0.2,
        this.project.duration
      );
      clip.duration = end - this.drag.originalStart;
    } else if (this.drag.mode === "slip") {
      clip.inPoint = clamp(this.drag.originalIn + delta, 0, Math.max(0, this.mediaDuration(clip) - clip.duration));
    } else if (this.drag.mode === "slide") {
      clip.start = clamp(this.drag.originalStart + delta, 0, this.project.duration - clip.duration);
    } else if (this.drag.mode === "rate") {
      const duration = clamp(this.drag.originalDuration - delta, 0.25, this.project.duration - this.drag.originalStart);
      clip.duration = duration;
      clip.speed = clamp((this.drag.originalDuration / duration) * this.drag.originalSpeed, 10, 400);
    }
    this.renderTimeline();
    this.renderProgramView();
  };

  private onPointerUp = () => {
    if (this.splitterStart) this.splitterStart = null;
    if (this.drag.mode && this.drag.mode !== "playhead") {
      this.renderTimeline();
      this.renderProgramView();
      this.renderPanels();
    }
    this.drag.mode = null;
    this.drag.clipId = undefined;
  };

  private timeFromClientX(clientX: number): number {
    const content = document.querySelector<HTMLElement>("#fc-timeline-content")!;
    const rect = content.getBoundingClientRect();
    return clamp((clientX - rect.left - 150) / this.zoom, 0, this.project.duration);
  }

  private snapTime(time: number, clip: Clip): number {
    if (!this.snap) return time;
    const points = [0, this.project.duration, this.time];
    for (const track of this.project.tracks) {
      for (const item of track.clips) {
        if (item.id === clip.id) continue;
        points.push(item.start, clipEnd(item));
      }
    }
    return snapTime(time, points, 6 / this.zoom);
  }

  private mediaDuration(clip: Clip): number {
    return mediaById(this.project, clip.mediaId)?.duration ?? clip.duration;
  }

  private addTitleAt(time: number) {
    const track = this.project.tracks.find(item => item.id === "V3");
    if (!track) return;
    this.pushHistory();
    const clip: Clip = {
      id: `title-${Date.now().toString(36)}`,
      trackId: "V3",
      mediaId: "trailer",
      name: "NEW TITLE",
      kind: "title",
      start: clamp(time, 0, this.project.duration - 4),
      duration: 4,
      inPoint: 0,
      color: "#5b4b86",
      title: "NEW TITLE",
      subtitle: "SUBTITLE",
      transform: { x: 720, y: 520, scale: 100, rotation: 0, opacity: 100 },
      crop: { left: 0, top: 0, right: 0, bottom: 0 },
      speed: 100,
      keyframes: {}
    };
    track.clips.push(clip);
    this.selectedClip = clip.id;
    this.rightTab = "graphics";
    this.renderTabs();
    this.renderTimeline();
    this.renderPanels();
    this.renderProgramView();
    this.toast("Title added. Edit the text in Essential Graphics.");
  }

  private splitClip(clip: Clip, time: number) {
    if (time <= clip.start + 0.1 || time >= clipEnd(clip) - 0.1) return;
    this.pushHistory();
    const track = trackOfClip(this.project, clip.id);
    if (!track) return;
    const leftDuration = time - clip.start;
    const right: Clip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `${clip.id}-b-${Date.now().toString(36)}`,
      start: time,
      duration: clip.duration - leftDuration,
      inPoint: clip.inPoint + leftDuration
    };
    clip.duration = leftDuration;
    track.clips.push(right);
    this.selectedClip = right.id;
    this.renderTimeline();
    this.renderPanels();
    this.renderProgramView();
    this.toast("Clip split at playhead.");
  }

  private deleteSelected() {
    if (!this.selectedClip) return;
    const track = trackOfClip(this.project, this.selectedClip);
    if (!track) return;
    this.pushHistory();
    const removed = track.clips.find(clip => clip.id === this.selectedClip);
    track.clips = track.clips.filter(clip => clip.id !== this.selectedClip);
    if (removed && this.tool === "ripple") {
      for (const clip of track.clips) {
        if (clip.start >= clipEnd(removed)) clip.start = Math.max(0, clip.start - removed.duration);
      }
    }
    this.selectedClip = null;
    this.renderTimeline();
    this.renderPanels();
    this.renderProgramView();
    this.toast("Clip deleted.");
  }

  private applyPropertyInput(target: HTMLInputElement) {
    const clip = this.selectedClipData();
    if (!clip) return;
    const prop = target.dataset.prop ?? "";
    const value = Number.parseFloat(target.value);
    if (!Number.isFinite(value)) return;
    this.pushHistory();
    if (prop.startsWith("transform.")) {
      const key = prop.slice("transform.".length);
      if (key === "anchorX" || key === "anchorY") return;
      const map: Record<string, keyof Clip["transform"]> = {
        x: "x",
        y: "y",
        scale: "scale",
        rotation: "rotation",
        opacity: "opacity"
      };
      const field = map[key];
      if (!field) return;
      const frames = clip.keyframes[field];
      if (frames?.length) {
        const local = Math.max(0, this.time - clip.start);
        const existing = frames.find(frame => Math.abs(frame.time - local) < 0.05);
        if (existing) existing.value = value;
        else frames.push({ time: local, value });
        frames.sort((a, b) => a.time - b.time);
      } else {
        clip.transform[field] = value;
      }
    } else if (prop.startsWith("crop.")) {
      const key = prop.slice("crop.".length) as keyof Clip["crop"];
      clip.crop[key] = clamp(value, 0, 95);
    } else if (prop === "speed") {
      clip.speed = clamp(value, 1, 400);
    }
    this.renderTimeline();
    this.renderProgramView();
    this.renderRight();
  }

  private applyEffectInput(target: HTMLInputElement) {
    const clip = this.selectedClipData();
    if (!clip) return;
    const prop = target.dataset.effect ?? "";
    const value = Number.parseFloat(target.value);
    if (!Number.isFinite(value)) return;
    this.pushHistory();
    const map: Record<string, keyof Clip["transform"]> = {
      "transform.x": "x",
      "transform.y": "y",
      "transform.scale": "scale",
      "transform.rotation": "rotation",
      "transform.opacity": "opacity"
    };
    const field = map[prop];
    if (field) {
      const frames = clip.keyframes[field];
      if (frames?.length) {
        const local = Math.max(0, this.time - clip.start);
        const existing = frames.find(frame => Math.abs(frame.time - local) < 0.05);
        if (existing) existing.value = value;
        else frames.push({ time: local, value });
      } else {
        clip.transform[field] = value;
      }
    } else if (prop === "speed") {
      clip.speed = clamp(value, 1, 400);
    }
    this.renderTimeline();
    this.renderProgramView();
  }

  private updateTitleField(field: "title" | "subtitle", value: string) {
    const clip = this.selectedClipData();
    if (!clip || clip.kind !== "title") return;
    this.pushHistory();
    if (field === "title") clip.title = value;
    else clip.subtitle = value;
    this.renderTimeline();
    this.renderProgramView();
  }

  private pushHistory() {
    this.history.push({
      project: JSON.stringify(this.project),
      grade: { ...this.grade },
      selectedClip: this.selectedClip
    });
    if (this.history.length > 40) this.history.shift();
    this.future = [];
  }

  private undo() {
    const snapshot = this.history.pop();
    if (!snapshot) {
      this.toast("Nothing to undo.");
      return;
    }
    this.future.push({
      project: JSON.stringify(this.project),
      grade: { ...this.grade },
      selectedClip: this.selectedClip
    });
    this.project = JSON.parse(snapshot.project) as Project;
    this.grade = { ...snapshot.grade };
    this.selectedClip = snapshot.selectedClip;
    this.renderAll();
    this.toast("Undo");
  }

  private redo() {
    const snapshot = this.future.pop();
    if (!snapshot) {
      this.toast("Nothing to redo.");
      return;
    }
    this.history.push({
      project: JSON.stringify(this.project),
      grade: { ...this.grade },
      selectedClip: this.selectedClip
    });
    this.project = JSON.parse(snapshot.project) as Project;
    this.grade = { ...snapshot.grade };
    this.selectedClip = snapshot.selectedClip;
    this.renderAll();
    this.toast("Redo");
  }

  private insertSelectedMedia(mode: "insert" | "overwrite") {
    const media = mediaById(this.project, this.selectedMedia);
    if (!media) return;
    const track = this.project.tracks.find(item => item.id === (media.kind === "audio" ? "A1" : "V1"))!;
    const duration = Math.min(media.kind === "audio" ? 8 : 6, this.project.duration - this.time);
    if (duration <= 0.2) {
      this.toast("Playhead is at the end of the sequence.");
      return;
    }
    this.pushHistory();
    if (mode === "overwrite") {
      for (const existing of track.clips) {
        if (existing.start < this.time + duration && clipEnd(existing) > this.time) {
          const left = this.time - existing.start;
          if (left > 0.15) existing.duration = left;
          else track.clips = track.clips.filter(item => item.id !== existing.id);
        }
      }
    }
    const clip: Clip = {
      id: `clip-${Date.now().toString(36)}`,
      trackId: track.id,
      mediaId: media.id,
      name: media.name,
      kind: media.kind === "audio" ? "audio" : "video",
      start: this.time,
      duration,
      inPoint: 0,
      color: media.kind === "audio" ? "#2d5f7a" : "#264f66",
      transform: { x: 720, y: 540, scale: 100, rotation: 0, opacity: 100 },
      crop: { left: 0, top: 0, right: 0, bottom: 0 },
      speed: 100,
      keyframes: {}
    };
    track.clips.push(clip);
    this.selectedClip = clip.id;
    this.renderAll();
    this.toast(`${mode === "insert" ? "Inserted" : "Overwritten"} ${media.name}`);
  }

  private handleImport() {
    const files = [...(this.importInput.files ?? [])];
    if (!files.length) return;
    for (const file of files) {
      const id = `media-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
      const isVideo = file.type.startsWith("video/");
      const url = URL.createObjectURL(file);
      const media: MediaItem = {
        id,
        name: file.name,
        kind: isVideo ? "video" : "still",
        duration: 5,
        color: isVideo ? "#3a3a3a" : "#4a3a2a",
        src: url
      };
      this.project.media.push(media);
      if (isVideo) {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        this.sources[id] = video;
        video.addEventListener("loadedmetadata", () => {
          media.duration = Number.isFinite(video.duration) ? video.duration : 10;
          media.width = video.videoWidth;
          media.height = video.videoHeight;
          video.currentTime = 0.1;
          this.renderProject();
        });
        video.addEventListener("seeked", () => {
          media.thumbnail = this.thumbnailFrom(video);
          this.renderProject();
        });
      } else {
        const image = new Image();
        image.src = url;
        this.sources[id] = image;
        image.addEventListener("load", () => {
          media.duration = 5;
          media.width = image.naturalWidth;
          media.height = image.naturalHeight;
          media.thumbnail = this.thumbnailFrom(image);
          this.renderProject();
        });
      }
      this.selectedMedia = id;
    }
    this.importInput.value = "";
    this.projectTab = "project";
    this.setView("edit");
    this.renderProject();
    this.renderLeft();
    this.toast(`Imported ${files.length} item${files.length > 1 ? "s" : ""}.`);
  }

  private thumbnailFrom(source: HTMLImageElement | HTMLVideoElement): string {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 135;
    const ctx = canvas.getContext("2d");
    const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
    if (!ctx || !sw || !sh) return "";
    const scale = Math.max(canvas.width / sw, canvas.height / sh);
    ctx.drawImage(source, (canvas.width - sw * scale) / 2, (canvas.height - sh * scale) / 2, sw * scale, sh * scale);
    return canvas.toDataURL("image/jpeg", 0.75);
  }

  private saveProject() {
    const payload = {
      ...this.project,
      grade: this.grade,
      savedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = this.project.name.replace(/\.fcproj$/, ".fcproj");
    anchor.click();
    URL.revokeObjectURL(url);
    this.toast("Project saved.");
  }

  private renderExport() {
    const host = document.querySelector<HTMLElement>("#fc-export-view")!;
    const destinations = ["Media File", "YouTube", "Vimeo", "TikTok", "Instagram", "FTP"];
    host.innerHTML = `<div class="fc-export-layout">
      <aside class="fc-export-destinations">
        <div class="fc-export-label">Destinations</div>
        ${destinations
          .map(
            name =>
              `<button class="fc-export-dest${
                name === this.exportDestination ? " is-active" : ""
              }" data-action="export-destination" data-destination="${name}">${name}</button>`
          )
          .join("")}
      </aside>
      <main class="fc-export-main">
        <div class="fc-export-preview"><canvas id="fc-export-canvas" width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}"></canvas></div>
        <div class="fc-export-progress"><span id="fc-export-bar" style="width:${this.exportProgress}%"></span></div>
        <div class="fc-export-status" id="fc-export-status">Ready to export · ${timecode(this.time)}</div>
        <p class="fc-export-note">Web demo exports the current frame as PNG and the project as .fcproj. Media encoding is simulated.</p>
      </main>
      <aside class="fc-export-settings">
        <div class="fc-export-label">Settings</div>
        <label class="fc-export-field"><span>File name / location</span><input class="fc-text-input" data-export="filename" value="~/Movies/Trailer.png" /></label>
        <label class="fc-export-field"><span>Format</span>
          <select class="fc-select" data-export="format">
            ${["H.264", "ProRes", "WebM", "GIF"]
              .map(format => `<option ${format === this.exportFormat ? "selected" : ""}>${format}</option>`)
              .join("")}
          </select>
        </label>
        <div class="fc-export-meta">
          <span>Video</span><span>1440 × 1080 · 23.976 fps</span>
          <span>Audio</span><span>48000 Hz · Stereo</span>
          <span>Range</span><span>Entire Sequence</span>
        </div>
        <button class="fc-export-btn" data-action="export-start">Export</button>
      </aside>
    </div>`;
    const canvas = host.querySelector<HTMLCanvasElement>("#fc-export-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(this.programCanvas, 0, 0, canvas.width, canvas.height);
    }
  }

  private setExportOption(key: string, value: string) {
    if (key === "format") this.exportFormat = value;
  }

  private startExport() {
    if (this.exportProgress > 0 && this.exportProgress < 100) return;
    this.exportProgress = 0;
    const bar = document.querySelector<HTMLElement>("#fc-export-bar");
    const status = document.querySelector<HTMLElement>("#fc-export-status");
    window.clearInterval(this.exportTimer);
    this.exportTimer = window.setInterval(() => {
      this.exportProgress = Math.min(100, this.exportProgress + 4);
      if (bar) bar.style.width = `${this.exportProgress}%`;
      if (status)
        status.textContent =
          this.exportProgress < 100 ? `Rendering… ${Math.round(this.exportProgress)}%` : "Export complete";
      if (this.exportProgress >= 100) {
        window.clearInterval(this.exportTimer);
        this.downloadFrame();
        this.toast("Export complete: Trailer.png + project file.");
      }
    }, 90);
  }

  private downloadFrame() {
    const anchor = document.createElement("a");
    anchor.href = frameDataUrl(this.programCanvas);
    anchor.download = "Trailer.png";
    anchor.click();
    this.saveProject();
  }

  private drawGraph(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#161616";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(28, 12 + (i / 5) * (h - 28));
      ctx.lineTo(w - 10, 12 + (i / 5) * (h - 28));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(28 + (i / 5) * (w - 40), 12);
      ctx.lineTo(28 + (i / 5) * (w - 40), h - 16);
      ctx.stroke();
    }
    const clip = this.selectedClipData();
    const frames = clip?.keyframes.scale;
    ctx.strokeStyle = "#5b9cff";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (frames?.length) {
      const max = Math.max(1, clip!.duration);
      const values = frames.map(frame => frame.value);
      const min = Math.min(...values) - 4;
      const maxV = Math.max(...values) + 4;
      frames.forEach((frame, index) => {
        const x = 28 + (frame.time / max) * (w - 40);
        const y = h - 18 - ((frame.value - min) / Math.max(1, maxV - min)) * (h - 32);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      frames.forEach(frame => {
        const x = 28 + (frame.time / max) * (w - 40);
        const y = h - 18 - ((frame.value - min) / Math.max(1, maxV - min)) * (h - 32);
        ctx.fillStyle = "#d7e6ff";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.moveTo(28, h - 50);
      ctx.bezierCurveTo(w * 0.35, h - 40, w * 0.62, h - 74, w - 12, h - 40);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(220,220,220,0.45)";
    ctx.font = "9px Inter, sans-serif";
    ctx.fillText("Value", 4, 10);
    ctx.fillText("Time", w - 28, h - 4);
  }

  private drawCurves(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#161616";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    for (let i = 1; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo((w / 4) * i, 0);
      ctx.lineTo((w / 4) * i, h);
      ctx.moveTo(0, (h / 4) * i);
      ctx.lineTo(w, (h / 4) * i);
      ctx.stroke();
    }
    ctx.strokeStyle = "#d8d8d8";
    ctx.lineWidth = 1.4;
    const contrast = this.grade.contrast / 100;
    ctx.beginPath();
    ctx.moveTo(8, h - 8);
    ctx.bezierCurveTo(w * 0.28, h - 8 - contrast * 20, w * 0.62, h - 8 + contrast * 18, w - 8, 8 + contrast * 10);
    ctx.stroke();
    ctx.fillStyle = "#4b91ff";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(8 + ((w - 16) / 2) * i, h - 8 - ((h - 16) / 2) * i, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private clearMarkers() {
    this.pushHistory();
    this.project.markers = [];
    this.renderTimeline();
    this.renderTransport();
    this.toast("Markers cleared.");
  }

  private resetTransform() {
    const clip = this.selectedClipData();
    if (!clip) return;
    this.pushHistory();
    clip.transform = { x: 720, y: 540, scale: 100, rotation: 0, opacity: 100 };
    clip.keyframes = {};
    this.renderTimeline();
    this.renderPanels();
    this.renderProgramView();
    this.toast("Transform reset.");
  }

  private resetColor() {
    this.grade = { ...DEFAULT_GRADE };
    this.renderRight();
    this.renderProgramView();
    this.toast("Color reset.");
  }

  private removeEffects() {
    const clip = this.selectedClipData();
    if (!clip) return;
    this.pushHistory();
    clip.keyframes = {};
    clip.transform = { x: 720, y: 540, scale: 100, rotation: 0, opacity: 100 };
    clip.crop = { left: 0, top: 0, right: 0, bottom: 0 };
    this.grade = { ...DEFAULT_GRADE };
    this.renderTimeline();
    this.renderPanels();
    this.renderProgramView();
    this.toast("All effects removed.");
  }

  private openMenuAt(x: number, y: number, items: Array<{ label: string; checked?: boolean; action: () => void }>) {
    document.querySelectorAll(".fc-menu").forEach(menu => menu.remove());
    const menu = document.createElement("div");
    menu.className = "fc-menu";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.innerHTML = items
      .map(
        (item, index) =>
          `<button class="fc-menu-item" data-index="${index}"><span class="fc-menu-check">${
            item.checked ? "✓" : ""
          }</span>${item.label}</button>`
      )
      .join("");
    menu.addEventListener("click", event => {
      const index = Number((event.target as HTMLElement).closest<HTMLElement>("[data-index]")?.dataset.index);
      if (Number.isFinite(index)) items[index].action();
      menu.remove();
    });
    document.body.appendChild(menu);
    const close = (event: MouseEvent) => {
      if (!menu.contains(event.target as Node)) {
        menu.remove();
        document.removeEventListener("pointerdown", close, true);
      }
    };
    document.addEventListener("pointerdown", close, true);
  }

  private toast(message: string) {
    let element = document.querySelector<HTMLElement>(".fc-toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "fc-toast";
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("is-visible");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => element?.classList.remove("is-visible"), 2000);
  }
}

const editor = new FilmCraft();
editor.start();
