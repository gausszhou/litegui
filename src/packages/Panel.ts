import LiteGUI from ".";
import type { LiteComponent } from "../types";
import { createElementFromString } from "./utils";

class Panel {
  static TITLE_HEIGHT = "20px";

  public id: string;
  public options: any;
  public root: HTMLElement;
  public header: HTMLElement;
  public content: HTMLElement;
  public footer: HTMLElement;
  constructor(id: string, options: any) {
    if (!options && id && id.constructor !== String) {
      options = id;
    }
    this.id = id;
    options = options || {};
    this.content = options.content || "";
    this.root = this.createElementRoot();
    this.header = this.createElementHeader();
    this.content = this.createElementContent();
    this.footer = this.createElementFooter();
    this.initDom();
    this.initStyle();
  }
  createElementRoot() {
    const options = this.options;
    const id = this.id;
    const root = document.createElement("div");
    if (id) root.id = id;
    root.className = "litepanel " + (options.className || "");
    return root;
  }
  createElementHeader() {
    const title = this.options.title;
    if (title) {
      return createElementFromString(`<div class="panel-header">${title}</div>`);
    } else {
      return createElementFromString("");
    }
  }
  
  createElementContent() {
    const content = this.options.content;
    return createElementFromString(`<div class="content">${content}</div>`);
  }

  createElementFooter() {
    return createElementFromString(`<div class="panel-footer"></div>`);
  }

  initDom() {
    this.root.appendChild(this.header);
    this.root.appendChild(this.content);
    this.root.appendChild(this.footer);
  }

  initStyle() {
    const options = this.options;
    if (options.width) {
      this.root.style.width = LiteGUI.sizeToCSS(options.width);
    }
    if (options.height) {
      this.root.style.height = LiteGUI.sizeToCSS(options.height);
    }
    if (options.position) {
      this.root.style.position = "absolute";
      this.root.style.left = LiteGUI.sizeToCSS(options.position[0]);
      this.root.style.top = LiteGUI.sizeToCSS(options.position[1]);
    }
    if (options.scroll == true) {
      this.content.style.overflow = "auto";
    }
  }

  add(item: LiteComponent) {
    this.content.appendChild(item.root);
  }

  clear() {
    this.content.innerHTML = "";
  }
}

export default Panel;
