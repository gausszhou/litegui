import { EventMitter } from "@gausszhou/litegui-core";

export interface TextEditorTab {
  id: string;
  label: string;
  value?: string;
  readOnly?: boolean;
}

export interface TextEditorOptions {
  id?: string;
  className?: string;
  value?: string;
  language?: string;
  encoding?: string;
  tabs?: TextEditorTab[];
  activeTab?: string;
  showFooter?: boolean;
  showTabs?: boolean;
  readOnly?: boolean;
  title?: string;
}

/**
 * TextEditor — code/text editor with line numbers, tabs and a Ln/Col footer.
 *
 * BEM:
 *   .lg-text-editor
 *   .lg-text-editor__tabs | __tab | __tab--active | __meta
 *   .lg-text-editor__body | __gutter | __textarea
 *   .lg-text-editor__footer | __status
 */
export class TextEditor extends EventMitter {
  public root: HTMLElement;
  public tabsElement: HTMLElement;
  public body: HTMLElement;
  public gutter: HTMLElement;
  public textarea: HTMLTextAreaElement;
  public footer: HTMLElement;
  public statusElement: HTMLElement;

  public language: string;
  public encoding: string;

  private tabs: TextEditorTab[];
  private activeTabId: string;
  private tabValues = new Map<string, string>();
  private tabButtons = new Map<string, HTMLButtonElement>();
  private readOnly = false;

  constructor(options: TextEditorOptions = {}) {
    super();
    this.language = options.language || "Python";
    this.encoding = options.encoding || "UTF-8";
    this.tabs = options.tabs?.length
      ? options.tabs
      : [{ id: "text", label: options.title || "Text", value: options.value || "" }];
    this.activeTabId = options.activeTab || this.tabs[0].id;
    this.readOnly = options.readOnly || false;
    for (const tab of this.tabs) this.tabValues.set(tab.id, tab.value || "");

    this.root = document.createElement("div");
    this.root.className = ["lg-text-editor", options.className || ""].filter(Boolean).join(" ");
    if (options.id) this.root.id = options.id;

    this.tabsElement = document.createElement("div");
    this.tabsElement.className = "lg-text-editor__tabs";
    this.root.appendChild(this.tabsElement);

    if (options.showTabs !== false && this.tabs.length) {
      for (const tab of this.tabs) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lg-text-editor__tab";
        button.dataset.tab = tab.id;
        button.textContent = tab.label;
        button.addEventListener("click", () => this.setTab(tab.id, true));
        this.tabsElement.appendChild(button);
        this.tabButtons.set(tab.id, button);
      }
      const meta = document.createElement("span");
      meta.className = "lg-text-editor__meta";
      meta.textContent = `${this.language}`;
      this.tabsElement.appendChild(meta);
    } else {
      const meta = document.createElement("span");
      meta.className = "lg-text-editor__meta";
      meta.textContent = options.title || `${this.language} · 示例`;
      this.tabsElement.appendChild(meta);
    }

    this.body = document.createElement("div");
    this.body.className = "lg-text-editor__body";
    this.gutter = document.createElement("div");
    this.gutter.className = "lg-text-editor__gutter";
    this.gutter.setAttribute("aria-hidden", "true");
    this.textarea = document.createElement("textarea");
    this.textarea.className = "lg-text-editor__textarea";
    this.textarea.spellcheck = false;
    this.textarea.wrap = "off";
    this.textarea.setAttribute("aria-label", options.title || "Text editor");
    this.body.append(this.gutter, this.textarea);
    this.root.appendChild(this.body);

    this.footer = document.createElement("div");
    this.footer.className = "lg-text-editor__footer";
    this.statusElement = document.createElement("span");
    this.statusElement.className = "lg-text-editor__status";
    this.footer.appendChild(this.statusElement);
    const meta = document.createElement("span");
    meta.className = "lg-text-editor__meta";
    meta.textContent = `${this.language} · ${this.encoding}`;
    this.footer.appendChild(meta);
    if (options.showFooter !== false) this.root.appendChild(this.footer);

    this.textarea.value = this.tabValues.get(this.activeTabId) || "";
    this.textarea.readOnly = this.readOnly || !!this.tabs.find((tab) => tab.id === this.activeTabId)?.readOnly;
    this.bindEvents();
    this.setTab(this.activeTabId, false);
    this.updateGutter();
    this.textarea.setSelectionRange(0, 0);
    this.updateStatus();

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => this.updateGutter()).observe(this.textarea);
    }
  }

  private bindEvents() {
    this.textarea.addEventListener("input", () => {
      this.tabValues.set(this.activeTabId, this.textarea.value);
      this.updateGutter();
      this.updateStatus();
      this.emit("change", { tab: this.activeTabId, value: this.textarea.value });
    });
    this.textarea.addEventListener("scroll", () => {
      this.gutter.scrollTop = this.textarea.scrollTop;
    });
    this.textarea.addEventListener("keyup", () => this.updateStatus());
    this.textarea.addEventListener("click", () => this.updateStatus());
    this.textarea.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        this.textarea.value = `${value.slice(0, start)}    ${value.slice(end)}`;
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
        this.tabValues.set(this.activeTabId, this.textarea.value);
        this.updateGutter();
        this.updateStatus();
        this.emit("change", { tab: this.activeTabId, value: this.textarea.value });
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        this.emit("run", this.textarea.value);
      }
    });
  }

  private updateGutter() {
    const lines = this.textarea.value.split("\n").length;
    const items: string[] = [];
    for (let index = 1; index <= Math.max(lines, 1); index += 1) items.push(String(index));
    this.gutter.textContent = items.join("\n");
    this.gutter.scrollTop = this.textarea.scrollTop;
  }

  private updateStatus() {
    const value = this.textarea.value;
    const position = this.textarea.selectionStart || 0;
    const before = value.slice(0, position);
    const line = before.split("\n").length;
    const column = position - before.lastIndexOf("\n");
    this.statusElement.textContent = `Ln ${line}, Col ${column}`;
    this.emit("cursor", { line, column });
  }

  setTab(id: string, emit = true) {
    const tab = this.tabs.find((item) => item.id === id);
    if (!tab) return this;
    this.tabValues.set(this.activeTabId, this.textarea.value);
    this.activeTabId = id;
    this.textarea.value = this.tabValues.get(id) || tab.value || "";
    this.textarea.readOnly = this.readOnly || !!tab.readOnly;
    for (const [tabId, button] of this.tabButtons) {
      button.classList.toggle("lg-text-editor__tab--active", tabId === id);
    }
    this.updateGutter();
    this.updateStatus();
    if (emit) this.emit("tab", id);
    return this;
  }

  getActiveTab() {
    return this.activeTabId;
  }

  setValue(value: string) {
    this.tabValues.set(this.activeTabId, value);
    this.textarea.value = value;
    this.updateGutter();
    this.updateStatus();
    return this;
  }

  getValue() {
    return this.textarea.value;
  }

  getTabValue(id: string) {
    if (id === this.activeTabId) return this.textarea.value;
    return this.tabValues.get(id) || "";
  }

  setTabValue(id: string, value: string) {
    this.tabValues.set(id, value);
    if (id === this.activeTabId) {
      this.textarea.value = value;
      this.updateGutter();
      this.updateStatus();
    }
    return this;
  }

  appendTabLine(id: string, line: string) {
    const value = this.getTabValue(id);
    this.setTabValue(id, value ? `${value}\n${line}` : line);
    return this;
  }

  setReadOnly(value: boolean) {
    this.readOnly = value;
    this.textarea.readOnly = value;
    return this;
  }

  focus() {
    this.textarea.focus();
    return this;
  }

  appendLine(line: string) {
    const value = this.textarea.value ? `${this.textarea.value}\n${line}` : line;
    this.setValue(value);
    this.textarea.scrollTop = this.textarea.scrollHeight;
    return this;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.root);
    return this;
  }
}

export default TextEditor;
