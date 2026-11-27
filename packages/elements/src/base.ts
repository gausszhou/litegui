import elementsCss from "./styles/generated/elements.css?raw";

/**
 * Node/SSR 下没有 HTMLElement，用一个空基类兜底，
 * 保证 `import "@gausszhou/litegui-elements"` 不会在服务端直接抛错。
 */
export const HTMLElementBase = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

let sharedSheet: CSSStyleSheet | null | undefined;
const hostSheetCache = new Map<string, CSSStyleSheet>();

function getSharedSheet(): CSSStyleSheet | null {
  if (sharedSheet !== undefined) return sharedSheet;
  if (typeof CSSStyleSheet === "undefined" || typeof document === "undefined") {
    sharedSheet = null;
    return null;
  }
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(elementsCss);
    sharedSheet = sheet;
  } catch {
    sharedSheet = null;
  }
  return sharedSheet;
}

function getHostSheet(css: string): CSSStyleSheet | null {
  const cached = hostSheetCache.get(css);
  if (cached) return cached;
  if (typeof CSSStyleSheet === "undefined") return null;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    hostSheetCache.set(css, sheet);
    return sheet;
  } catch {
    return null;
  }
}

/**
 * 所有 LiteGUI 自定义元素的基类。
 *
 * 约定：
 * - 宿主元素不承担语义，内部仍然使用原生控件（button / input / dialog）；
 * - 样式：共享一份 components CSS，每个元素再附加一段 `:host` 规则；
 * - 生命周期幂等：`connectedCallback` 可能因移动节点重复触发，不重复挂载；
 * - 事件：`litegui-*`，`bubbles: true` + `composed: true`，数据放 `detail`。
 */
export abstract class LiteGuiElement extends HTMLElementBase {
  static observedAttributes: readonly string[] = [];
  static hostStyles = "";

  protected readonly mountPoint: HTMLElement;
  private _component: { root: HTMLElement } | null = null;
  private _rendered = false;

  constructor() {
    super();

    const root = this.attachShadow({ mode: "open" });
    const hostCss = `${(this.constructor as typeof LiteGuiElement).hostStyles}\n:host([hidden]) { display: none; }`;
    const sheet = getSharedSheet();
    const hostSheet = getHostSheet(hostCss);

    if (sheet && hostSheet && "adoptedStyleSheets" in root) {
      root.adoptedStyleSheets = [sheet, hostSheet];
    } else {
      // jsdom 等环境没有 constructable stylesheet，退回 <style>
      const style = document.createElement("style");
      style.textContent = `${elementsCss}\n${hostCss}`;
      root.appendChild(style);
    }

    this.mountPoint = document.createElement("div");
    this.mountPoint.setAttribute("part", "mount");
    root.appendChild(this.mountPoint);
  }

  connectedCallback() {
    if (!this._rendered) {
      this._rendered = true;
      this.render();
    } else {
      this.onReconnect?.();
    }
  }

  disconnectedCallback() {
    this.onDisconnect?.();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this.onAttributeChanged?.(name, oldValue, newValue);
  }

  /** 原生 LiteGUI 实例（逃生口） */
  get component(): unknown {
    return this._component;
  }

  protected abstract render(): void;

  protected onAttributeChanged?(name: string, oldValue: string | null, newValue: string | null): void;

  protected onReconnect?(): void;
  protected onDisconnect?(): void;

  protected setComponent(component: { root: HTMLElement }) {
    this._component = component;
    this.mountPoint.replaceChildren(component.root);
  }

  protected emit<T>(type: string, detail?: T) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  protected stringAttr(name: string, fallback = ""): string {
    return this.getAttribute(name) ?? fallback;
  }

  protected numberAttr(name: string, fallback: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  protected boolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /** 反射属性：false / null / 空串移除 attribute，true 写成空 attribute */
  protected reflect(name: string, value: string | number | boolean | null | undefined) {
    if (value === false || value === null || value === undefined || value === "") {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value === true ? "" : String(value));
    }
  }
}
