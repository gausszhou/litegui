/**
 * 右侧面板：直方图、编辑（光线/颜色/效果/细节/预设）、遮罩、元数据、历史。
 * 面板只负责把交互翻译成 hooks 调用，参数真身始终在 Photo 上。
 */
import {
  PRESETS,
  editCount,
  type DevelopParams,
  type Histogram,
  type MaskKind,
  type MaskSpec
} from "./develop";
import { icon } from "./icons";
import type { HistoryStep, MaskEntry, PanelMode, Photo } from "./types";
import { el, formatSigned, starControl, type MenuItemSpec } from "./ui";
import { ColorMixer, CurveEditor, GradingWheels, HistogramView, SliderRow } from "./widgets";

export interface PanelHooks {
  photo(): Photo | null;
  edit(mutate: (params: DevelopParams) => void, label: string, live: boolean): void;
  editMask(maskId: string, mutate: (params: DevelopParams) => void, label: string, live: boolean): void;
  addMask(kind: MaskKind): void;
  removeMask(maskId: string): void;
  selectMask(maskId: string): void;
  toggleMaskVisible(maskId: string): void;
  updateMaskSpec(maskId: string, mutate: (spec: MaskSpec) => void, live: boolean): void;
  applyPreset(presetId: string): void;
  autoTone(): void;
  toggleMonochrome(): void;
  resetDevelop(): void;
  addKeyword(word: string): void;
  setRating(value: number): void;
  restoreHistory(index: number): void;
  history(): HistoryStep[];
  historyIndex(): number;
  panelMode(): PanelMode;
  activeMaskId(): string | null;
  onMenu(anchor: HTMLElement, items: MenuItemSpec[]): void;
}

const collapsed = new Set<string>(["presets", "detail", "mixer", "grading", "curve"]);

function section(
  key: string,
  title: string,
  body: HTMLElement,
  options: { actions?: HTMLElement[]; subtitle?: string; bare?: boolean } = {}
): HTMLElement {
  const wrap = el("section", `lc-section lc-section--${key}`);
  if (options.bare) {
    const head = el("div", "lc-section__bare-head");
    head.append(el("span", "lc-section__bare-title", title));
    for (const action of options.actions ?? []) head.appendChild(action);
    wrap.append(head, body);
    return wrap;
  }
  const open = !collapsed.has(key);
  const head = el("button", "lc-section__head");
  head.type = "button";
  head.innerHTML = `<span class="lc-section__chev">${icon(open ? "chevronDown" : "chevronRight", 13)}</span><span class="lc-section__title">${title}</span>`;
  head.addEventListener("click", () => {
    if (collapsed.has(key)) collapsed.delete(key);
    else collapsed.add(key);
    wrap.replaceWith(section(key, title, body, options));
  });
  if (options.subtitle) head.appendChild(el("span", "lc-section__subtitle", options.subtitle));
  for (const action of options.actions ?? []) head.appendChild(action);
  wrap.appendChild(head);
  if (open) wrap.appendChild(body);
  return wrap;
}

function chipButton(label: string, onClick: () => void, extraClass = ""): HTMLButtonElement {
  const button = el("button", `lc-chip ${extraClass}`.trim(), label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

export class RightPanel {
  public root: HTMLElement;
  private hooks: PanelHooks;
  private histogram: HistogramView;
  private metaLine: HTMLElement;
  private scroll: HTMLElement;
  private mode: PanelMode = "edit";
  private curveOpen = false;
  private mixerOpen = false;
  private gradingOpen = false;
  private curveEditor: CurveEditor | null = null;

  constructor(hooks: PanelHooks) {
    this.hooks = hooks;
    this.root = el("aside", "lc-panel");

    const histWrap = el("div", "lc-panel__hist");
    this.histogram = new HistogramView();
    histWrap.appendChild(this.histogram.root);

    this.metaLine = el("div", "lc-panel__meta");
    this.scroll = el("div", "lc-panel__scroll");
    this.root.append(histWrap, this.metaLine, this.scroll);
  }

  setMode(mode: PanelMode): void {
    this.mode = mode;
    this.render();
  }

  renderHistogram(histogram: Histogram | null): void {
    this.histogram.render(histogram);
  }

  /** 完整重建：照片切换、预设、撤销、遮罩增删等外部变化后调用。 */
  render(): void {
    const photo = this.hooks.photo();
    const scrollTop = this.scroll.scrollTop;
    this.scroll.innerHTML = "";
    this.curveEditor = null;
    if (!photo) {
      this.metaLine.textContent = "";
      this.scroll.appendChild(el("p", "lc-panel__empty", "在左侧选择一张照片开始编辑。"));
      this.scroll.scrollTop = 0;
      return;
    }
    this.metaLine.innerHTML = [
      `ISO ${photo.spec.iso}`,
      `${photo.spec.focal}mm`,
      photo.spec.aperture,
      photo.spec.shutter
    ]
      .map((text) => `<span>${text}</span>`)
      .join('<span class="lc-panel__meta-sep">·</span>');

    if (this.mode === "edit") this.scroll.appendChild(this.buildEdit(photo));
    else if (this.mode === "mask") this.scroll.appendChild(this.buildMask(photo));
    else if (this.mode === "metadata") this.scroll.appendChild(this.buildMetadata(photo));
    else this.scroll.appendChild(this.buildHistory());
    this.scroll.scrollTop = scrollTop;
  }

  /* ------------------------------------------------------------ 编辑面板 */

  private buildEdit(photo: Photo): HTMLElement {
    const root = el("div", "lc-panel__stack");
    root.appendChild(this.buildEditHeader(photo));
    root.appendChild(this.buildLight(photo));
    root.appendChild(this.buildColor(photo));
    root.appendChild(this.buildEffects(photo));
    root.appendChild(this.buildDetail(photo));
    root.appendChild(this.buildPresets());
    return root;
  }

  private buildEditHeader(photo: Photo): HTMLElement {
    const wrap = el("section", "lc-section lc-edit-head");
    const titleRow = el("div", "lc-edit-head__row");
    titleRow.append(el("h2", "lc-edit-head__title", "编辑"));
    const edits = editCount(photo.develop);
    titleRow.appendChild(
      el("span", "lc-edit-head__count", edits > 0 ? `${edits} 项调整` : "相机原始")
    );

    const buttons = el("div", "lc-edit-head__buttons");
    const auto = chipButton("自动", () => this.hooks.autoTone());
    auto.title = "根据亮度分布自动设置色调";
    const bw = chipButton(photo.develop.monochrome ? "彩色" : "黑白", () => this.hooks.toggleMonochrome());
    bw.classList.toggle("is-active", photo.develop.monochrome);
    const reset = chipButton("重置", () => this.hooks.resetDevelop(), "lc-chip--ghost");
    reset.title = "恢复相机原始设置";
    buttons.append(auto, bw, reset);

    wrap.append(titleRow, buttons);
    return wrap;
  }

  private buildLight(photo: Photo): HTMLElement {
    const body = el("div", "lc-section__body");
    const params = photo.develop;
    const add = (
      label: string,
      key: "exposure" | "contrast" | "highlights" | "shadows" | "whites" | "blacks",
      min: number,
      max: number,
      step: number,
      digits: number,
      defaultValue: number
    ) => {
      body.appendChild(
        new SliderRow({
          label,
          value: params[key],
          min,
          max,
          step,
          digits,
          defaultValue,
          onChange: (value) => {
            this.hooks.edit((next) => {
              next[key] = value;
            }, label, true);
          },
          onCommit: (value) => {
            this.hooks.edit(
              (next) => {
                next[key] = value;
              },
              `${label} ${formatSigned(value, digits)}`,
              false
            );
          }
        }).root
      );
    };

    add("曝光", "exposure", -5, 5, 0.05, 2, 0);
    add("对比度", "contrast", -100, 100, 1, 0, 0);
    add("高光", "highlights", -100, 100, 1, 0, 0);
    add("阴影", "shadows", -100, 100, 1, 0, 0);
    add("白色", "whites", -100, 100, 1, 0, 0);
    add("黑色", "blacks", -100, 100, 1, 0, 0);

    const curveToggle = el("button", "lc-row-btn");
    curveToggle.type = "button";
    curveToggle.innerHTML = `<span class="lc-row-btn__icon">${icon("curve", 14)}</span><span>曲线</span><span class="lc-row-btn__chev">${icon(
      this.curveOpen ? "chevronUp" : "chevronDown",
      12
    )}</span>`;
    curveToggle.addEventListener("click", () => {
      this.curveOpen = !this.curveOpen;
      this.render();
    });
    body.appendChild(curveToggle);

    if (this.curveOpen) {
      const curveHost = el("div", "lc-curve-host");
      this.curveEditor = new CurveEditor(
        params.curves,
        (points) => {
          this.hooks.edit((next) => {
            next.curves = points;
          }, "曲线", true);
        },
        () => {
          this.hooks.edit((next) => {
            next.curves = next.curves.map((point) => ({ ...point }));
          }, "曲线", false);
        }
      );
      curveHost.appendChild(this.curveEditor.root);
      const resetCurve = chipButton("复位曲线", () => {
        this.hooks.edit((next) => {
          next.curves = [
            { x: 0, y: 0 },
            { x: 1, y: 1 }
          ];
        }, "曲线复位", false);
      }, "lc-chip--ghost");
      curveHost.appendChild(resetCurve);
      body.appendChild(curveHost);
      requestAnimationFrame(() => this.curveEditor?.resize());
    }

    return section("light", "光线", body);
  }

  private buildColor(photo: Photo): HTMLElement {
    const body = el("div", "lc-section__body");
    const params = photo.develop;

    const wbButton = el("button", "lc-row-btn");
    wbButton.type = "button";
    wbButton.innerHTML = `<span class="lc-row-btn__label">白平衡</span><span class="lc-row-btn__value">原照设置</span><span class="lc-row-btn__chev">${icon(
      "chevronDown",
      12
    )}</span>`;
    wbButton.addEventListener("click", () => {
      this.hooks.onMenu(wbButton, [
        {
          label: "原照设置",
          action: () =>
            this.hooks.edit((next) => {
              next.temperature = 5500;
              next.tint = 0;
            }, "白平衡：原照设置", false)
        },
        {
          label: "自动",
          action: () =>
            this.hooks.edit((next) => {
              next.temperature = 5800;
              next.tint = 3;
            }, "白平衡：自动", false)
        },
        {
          label: "阴天 6500K",
          action: () =>
            this.hooks.edit((next) => {
              next.temperature = 6500;
            }, "白平衡：阴天", false)
        },
        {
          label: "钨丝灯 3200K",
          action: () =>
            this.hooks.edit((next) => {
              next.temperature = 3200;
            }, "白平衡：钨丝灯", false)
        },
        {
          label: "荧光灯 4200K",
          action: () =>
            this.hooks.edit((next) => {
              next.temperature = 4200;
            }, "白平衡：荧光灯", false)
        }
      ]);
    });
    body.appendChild(wbButton);

    body.appendChild(
      new SliderRow({
        label: "色温",
        value: params.temperature,
        min: 2000,
        max: 12000,
        step: 50,
        defaultValue: 5500,
        format: (value) => `${Math.round(value)} K`,
        track: "linear-gradient(90deg, #4a7bd0 0%, #e8e8ea 48%, #f2c65a 100%)",
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.temperature = value;
          }, "色温", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.temperature = value;
          }, `色温 ${Math.round(value)} K`, false)
      }).root
    );
    body.appendChild(
      new SliderRow({
        label: "色调",
        value: params.tint,
        min: -150,
        max: 150,
        step: 1,
        defaultValue: 0,
        digits: 0,
        track: "linear-gradient(90deg, #4c9a63 0%, #e8e8ea 50%, #b055a8 100%)",
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.tint = value;
          }, "色调", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.tint = value;
          }, `色调 ${formatSigned(value)}`, false)
      }).root
    );
    body.appendChild(
      new SliderRow({
        label: "自然饱和度",
        value: params.vibrance,
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.vibrance = value;
          }, "自然饱和度", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.vibrance = value;
          }, `自然饱和度 ${formatSigned(value)}`, false)
      }).root
    );
    body.appendChild(
      new SliderRow({
        label: "饱和度",
        value: params.saturation,
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        track: "linear-gradient(90deg, #8a8a90 0%, #d06f86 100%)",
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.saturation = value;
          }, "饱和度", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.saturation = value;
          }, `饱和度 ${formatSigned(value)}`, false)
      }).root
    );

    const mixerToggle = el("button", "lc-row-btn");
    mixerToggle.type = "button";
    mixerToggle.innerHTML = `<span class="lc-row-btn__icon">${icon("sliders", 14)}</span><span>色彩混合器</span><span class="lc-row-btn__chev">${icon(
      this.mixerOpen ? "chevronUp" : "chevronDown",
      12
    )}</span>`;
    mixerToggle.addEventListener("click", () => {
      this.mixerOpen = !this.mixerOpen;
      this.render();
    });
    body.appendChild(mixerToggle);
    if (this.mixerOpen) {
      const mixer = new ColorMixer(
        params,
        () => this.hooks.edit(() => undefined, "色彩混合器", true),
        () => this.hooks.edit((next) => next, "色彩混合器", false)
      );
      body.appendChild(mixer.root);
    }

    const gradingToggle = el("button", "lc-row-btn");
    gradingToggle.type = "button";
    gradingToggle.innerHTML = `<span class="lc-row-btn__icon">${icon("bw", 14)}</span><span>颜色分级</span><span class="lc-row-btn__chev">${icon(
      this.gradingOpen ? "chevronUp" : "chevronDown",
      12
    )}</span>`;
    gradingToggle.addEventListener("click", () => {
      this.gradingOpen = !this.gradingOpen;
      this.render();
    });
    body.appendChild(gradingToggle);
    if (this.gradingOpen) {
      const wheels = new GradingWheels(
        params.grading,
        () => this.hooks.edit(() => undefined, "颜色分级", true),
        () => this.hooks.edit((next) => next, "颜色分级", false)
      );
      body.appendChild(wheels.root);
      body.appendChild(
        new SliderRow({
          label: "平衡",
          value: params.grading.balance,
          min: -100,
          max: 100,
          step: 1,
          defaultValue: 0,
          digits: 0,
          onChange: (value) =>
            this.hooks.edit((next) => {
              next.grading.balance = value;
            }, "分级平衡", true),
          onCommit: (value) =>
            this.hooks.edit((next) => {
              next.grading.balance = value;
            }, `分级平衡 ${formatSigned(value)}`, false)
        }).root
      );
    }

    return section("color", "颜色", body);
  }

  private buildEffects(photo: Photo): HTMLElement {
    const body = el("div", "lc-section__body");
    const params = photo.develop;
    const add = (
      label: string,
      key: "texture" | "clarity" | "dehaze" | "vignette" | "grain",
      min: number,
      max: number,
      defaultValue: number
    ) => {
      body.appendChild(
        new SliderRow({
          label,
          value: params[key],
          min,
          max,
          step: 1,
          defaultValue,
          digits: 0,
          onChange: (value) =>
            this.hooks.edit((next) => {
              next[key] = value;
            }, label, true),
          onCommit: (value) =>
            this.hooks.edit((next) => {
              next[key] = value;
            }, `${label} ${formatSigned(value)}`, false)
        }).root
      );
    };
    add("纹理", "texture", -100, 100, 0);
    add("清晰度", "clarity", -100, 100, 0);
    add("去雾", "dehaze", -100, 100, 0);
    add("晕影", "vignette", -100, 100, 0);
    add("颗粒", "grain", 0, 100, 0);
    return section("effects", "效果", body);
  }

  private buildDetail(photo: Photo): HTMLElement {
    const body = el("div", "lc-section__body");
    const params = photo.develop;
    body.appendChild(
      new SliderRow({
        label: "锐化",
        value: params.sharpening,
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.sharpening = value;
          }, "锐化", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.sharpening = value;
          }, `锐化 ${Math.round(value)}`, false)
      }).root
    );
    body.appendChild(
      new SliderRow({
        label: "降噪",
        value: params.noiseReduction,
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        digits: 0,
        onChange: (value) =>
          this.hooks.edit((next) => {
            next.noiseReduction = value;
          }, "降噪", true),
        onCommit: (value) =>
          this.hooks.edit((next) => {
            next.noiseReduction = value;
          }, `降噪 ${Math.round(value)}`, false)
      }).root
    );
    return section("detail", "细节", body);
  }

  private buildPresets(): HTMLElement {
    const body = el("div", "lc-presets");
    const photo = this.hooks.photo();
    for (const preset of PRESETS) {
      const button = el("button", "lc-preset");
      button.type = "button";
      button.title = preset.name;
      button.dataset["preset"] = preset.id;
      const active = preset.id === "original" && photo !== null && editCount(photo.develop) === 0;
      button.classList.toggle("is-active", active);
      button.append(el("span", "lc-preset__swatch"), el("span", "lc-preset__name", preset.name));
      button.dataset["group"] = preset.group;
      button.addEventListener("click", () => this.hooks.applyPreset(preset.id));
      body.appendChild(button);
    }
    return section("presets", "预设", body);
  }

  /* ------------------------------------------------------------ 遮罩面板 */

  private buildMask(photo: Photo): HTMLElement {
    const root = el("div", "lc-panel__stack");
    const createWrap = el("section", "lc-section lc-mask-create");
    createWrap.appendChild(el("h2", "lc-section__heading", "创建新遮罩"));
    const grid = el("div", "lc-mask-tools");
    const tools: Array<[MaskKind | "background" | "brush", string, string, string]> = [
      ["subject", "主体", "maskSubject", "自动选择画面主体"],
      ["sky", "天空", "maskSky", "按画面高度近似天空"],
      ["background", "背景", "maskRadial", "反转的主体椭圆"],
      ["brush", "画笔", "maskBrush", "柔边圆形遮罩"],
      ["linear", "线性", "maskLinear", "线性渐变遮罩"],
      ["radial", "径向", "maskRadial", "椭圆径向渐变"]
    ];
    for (const [kind, label, iconName, title] of tools) {
      const button = el("button", "lc-mask-tool");
      button.type = "button";
      button.title = title;
      button.setAttribute("data-mask-kind", kind);
      button.innerHTML = `<span class="lc-mask-tool__icon">${icon(iconName, 17)}</span><span class="lc-mask-tool__label">${label}</span>`;
      button.addEventListener("click", () => {
        if (kind === "background") this.hooks.addMask("subject");
        else if (kind === "brush") this.hooks.addMask("radial");
        else this.hooks.addMask(kind);
      });
      grid.appendChild(button);
    }
    createWrap.appendChild(grid);
    root.appendChild(createWrap);

    const listWrap = el("section", "lc-section lc-mask-list");
    const head = el("div", "lc-mask-list__head");
    head.append(el("h2", "lc-section__heading", "遮罩"), el("span", "lc-mask-list__count", String(photo.masks.length)));
    listWrap.appendChild(head);

    if (photo.masks.length === 0) {
      listWrap.appendChild(el("p", "lc-panel__empty", "还没有遮罩。选一种上面的工具在画面上创建。"));
    }
    const activeId = this.hooks.activeMaskId();
    for (const mask of photo.masks) {
      listWrap.appendChild(this.maskRow(mask, mask.id === activeId));
    }
    root.appendChild(listWrap);

    const active = photo.masks.find((mask) => mask.id === activeId) ?? null;
    if (active) root.appendChild(this.buildMaskAdjust(active));
    return root;
  }

  private maskRow(mask: MaskEntry, active: boolean): HTMLElement {
    const rowNode = el("button", `lc-mask-row${active ? " is-active" : ""}`);
    rowNode.type = "button";
    rowNode.setAttribute("data-mask-id", mask.id);
    rowNode.innerHTML = `<span class="lc-mask-row__icon">${icon(maskIcon(mask.spec.kind), 13)}</span><span class="lc-mask-row__name">${mask.name}</span>`;
    const eye = el("span", "lc-mask-row__eye");
    eye.innerHTML = icon(mask.visible ? "eye" : "maskRange", 13);
    eye.title = mask.visible ? "隐藏遮罩叠加" : "显示遮罩叠加";
    eye.addEventListener("click", (event) => {
      event.stopPropagation();
      this.hooks.toggleMaskVisible(mask.id);
    });
    const remove = el("span", "lc-mask-row__remove");
    remove.innerHTML = icon("trash", 13);
    remove.title = "删除遮罩";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      this.hooks.removeMask(mask.id);
    });
    rowNode.append(eye, remove);
    rowNode.addEventListener("click", () => this.hooks.selectMask(mask.id));
    return rowNode;
  }

  private buildMaskAdjust(mask: MaskEntry): HTMLElement {
    const body = el("div", "lc-section__body");
    const kindLabel =
      mask.spec.kind === "sky" ? "天空" : mask.spec.kind === "subject" ? "主体" : mask.spec.kind === "linear" ? "线性渐变" : "径向渐变";

    const actions = el("div", "lc-mask-actions");
    const invert = chipButton(mask.spec.invert ? "反相 ✓" : "反相", () =>
      this.hooks.updateMaskSpec(
        mask.id,
        (spec) => {
          spec.invert = !spec.invert;
        },
        false
      )
    );
    actions.append(invert);
    body.appendChild(actions);

    body.appendChild(
      new SliderRow({
        label: "羽化",
        value: mask.spec.feather,
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        digits: 0,
        format: (value) => `${Math.round(value)}`,
        onChange: (value) =>
          this.hooks.updateMaskSpec(
            mask.id,
            (spec) => {
              spec.feather = value;
            },
            true
          ),
        onCommit: (value) =>
          this.hooks.updateMaskSpec(
            mask.id,
            (spec) => {
              spec.feather = value;
            },
            false
          )
      }).root
    );

    const add = (
      label: string,
      key: "exposure" | "contrast" | "highlights" | "shadows" | "whites" | "blacks" | "temperature" | "tint" | "texture" | "clarity" | "dehaze" | "saturation",
      min: number,
      max: number,
      step: number,
      digits: number,
      defaultValue: number
    ) => {
      body.appendChild(
        new SliderRow({
          label,
          value: mask.params[key],
          min,
          max,
          step,
          digits,
          defaultValue,
          onChange: (value) =>
            this.hooks.editMask(
              mask.id,
              (params) => {
                (params as unknown as Record<string, number>)[key] = value;
              },
              label,
              true
            ),
          onCommit: (value) =>
            this.hooks.editMask(
              mask.id,
              (params) => {
                (params as unknown as Record<string, number>)[key] = value;
              },
              `${kindLabel}遮罩 · ${label} ${formatSigned(value, digits)}`,
              false
            )
        }).root
      );
    };
    add("曝光", "exposure", -3, 3, 0.05, 2, 0);
    add("对比度", "contrast", -100, 100, 1, 0, 0);
    add("高光", "highlights", -100, 100, 1, 0, 0);
    add("阴影", "shadows", -100, 100, 1, 0, 0);
    add("白色", "whites", -100, 100, 1, 0, 0);
    add("黑色", "blacks", -100, 100, 1, 0, 0);
    body.appendChild(
      new SliderRow({
        label: "色温",
        value: mask.params.temperature,
        min: 2000,
        max: 12000,
        step: 50,
        defaultValue: 5500,
        format: (value) => `${Math.round(value)} K`,
        track: "linear-gradient(90deg, #4a7bd0 0%, #e8e8ea 48%, #f2c65a 100%)",
        onChange: (value) =>
          this.hooks.editMask(
            mask.id,
            (params) => {
              params.temperature = value;
            },
            "色温",
            true
          ),
        onCommit: (value) =>
          this.hooks.editMask(
            mask.id,
            (params) => {
              params.temperature = value;
            },
            `${kindLabel} · 色温 ${Math.round(value)} K`,
            false
          )
      }).root
    );
    add("色调", "tint", -150, 150, 1, 0, 0);
    add("纹理", "texture", -100, 100, 1, 0, 0);
    add("清晰度", "clarity", -100, 100, 1, 0, 0);
    add("去雾", "dehaze", -100, 100, 1, 0, 0);
    add("饱和度", "saturation", -100, 100, 1, 0, 0);

    return section("mask-adjust", `${kindLabel}遮罩`, body);
  }

  /* ------------------------------------------------------------ 元数据面板 */

  private buildMetadata(photo: Photo): HTMLElement {
    const root = el("div", "lc-panel__stack");
    const body = el("div", "lc-section__body");
    const table = el("dl", "lc-meta-table");
    const entries: Array<[string, string]> = [
      ["文件", photo.spec.file],
      ["标题", photo.spec.title],
      ["拍摄时间", photo.spec.date],
      ["地点", photo.spec.location],
      ["相机", photo.spec.camera],
      ["镜头", photo.spec.lens],
      ["曝光", `${photo.spec.shutter} · ${photo.spec.aperture} · ISO ${photo.spec.iso}`],
      ["焦距", `${photo.spec.focal} mm`],
      ["分辨率", `${photo.width} × ${photo.height}`],
      ["相册", photo.spec.albums.join(" / ")],
      ["遮罩", `${photo.masks.length} 个`]
    ];
    for (const [label, value] of entries) {
      table.append(el("dt", "", label), el("dd", "", value));
    }
    body.appendChild(table);
    root.appendChild(section("meta", "文件信息", body));

    const keyBody = el("div", "lc-section__body");
    const chips = el("div", "lc-keywords");
    for (const keyword of photo.keywords) {
      chips.appendChild(el("span", "lc-keyword", keyword));
    }
    const input = el("input", "lc-input");
    input.placeholder = "添加关键词后回车";
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const value = input.value.trim();
      if (!value) return;
      this.hooks.addKeyword(value);
      input.value = "";
    });
    keyBody.append(chips, input);
    root.appendChild(section("keywords", "关键词", keyBody));

    const rateBody = el("div", "lc-section__body");
    const rateRow = el("div", "lc-meta-rate");
    rateRow.appendChild(starControl(photo.rating, (value) => this.hooks.setRating(value), 15));
    rateBody.appendChild(rateRow);
    rateBody.appendChild(el("p", "lc-panel__hint", "1–5 打星，0 清除；P 精选，X 排斥。"));
    root.appendChild(section("rating", "评分与旗标", rateBody));
    return root;
  }

  /* ------------------------------------------------------------ 历史面板 */

  private buildHistory(): HTMLElement {
    const root = el("div", "lc-panel__stack");
    const body = el("div", "lc-section__body lc-history");
    const steps = this.hooks.history();
    const current = this.hooks.historyIndex();
    if (steps.length === 0) {
      body.appendChild(el("p", "lc-panel__empty", "还没有编辑记录。"));
    }
    steps.forEach((step, index) => {
      const rowNode = el("button", `lc-history__row${index === current ? " is-current" : ""}`);
      rowNode.type = "button";
      rowNode.innerHTML = `<span class="lc-history__index">${index + 1}</span><span class="lc-history__label">${step.label}</span>`;
      rowNode.addEventListener("click", () => this.hooks.restoreHistory(index));
      body.appendChild(rowNode);
    });
    root.appendChild(section("history", "历史记录", body, { bare: true }));
    return root;
  }
}

function maskIcon(kind: MaskSpec["kind"]): string {
  switch (kind) {
    case "sky":
      return "maskSky";
    case "subject":
      return "maskSubject";
    case "linear":
      return "maskLinear";
    default:
      return "maskRadial";
  }
}
