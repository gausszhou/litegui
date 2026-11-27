import { sizeToCSS } from "@gausszhou/litegui-core";
import type { LiteComponent } from "@gausszhou/litegui-core";
import { EventMitter } from "@gausszhou/litegui-core";

export class Panel extends EventMitter {
  static TITLE_HEIGHT = "20px";

  public id: string;
  public options: any;
  public root: HTMLElement;
  public header: HTMLElement;
  public titleElement: HTMLElement;
  public content: HTMLElement;
  public footer: HTMLElement;

  constructor(idOrOptions: string | any = {}, options: any = {}) {
    super();
    const opts = typeof idOrOptions === "string" ? { ...options, id: idOrOptions } : idOrOptions || {};

    this.options = opts;
    this.id = opts.id || "";
    this.root = this.createElementRoot();
    this.header = this.createElementHeader();
    this.titleElement = this.header.querySelector(".lg-panel__title") as HTMLElement;
    this.content = this.createElementContent();
    this.footer = this.createElementFooter();

    this.initDom();
    this.initStyle();
  }

  createElementRoot() {
    const root = document.createElement("div");
    if (this.id) root.id = this.id;
    root.className = "lg-panel " + (this.options.className || "");
    return root;
  }

  createElementHeader() {
    const header = document.createElement("div");
    header.className = "lg-panel__header";

    const title = document.createElement("span");
    title.className = "lg-panel__title";
    title.textContent = this.options.title || "";
    header.appendChild(title);

    if (this.options.close) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lg-button__control lg-button__control--mini lg-panel__close";
      button.textContent = "×";
      button.title = "Close";
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
      header.appendChild(button);
    }

    if (!this.options.title && !this.options.close) {
      header.style.display = "none";
    }

    return header;
  }

  createElementContent() {
    const content = document.createElement("div");
    content.className = "lg-panel__content";
    if (this.options.content) content.innerHTML = this.options.content;
    return content;
  }

  createElementFooter() {
    const footer = document.createElement("div");
    footer.className = "lg-panel__footer";
    return footer;
  }

  initDom() {
    this.root.appendChild(this.header);
    this.root.appendChild(this.content);
    this.root.appendChild(this.footer);
  }

  initStyle() {
    const options = this.options;
    if (options.width) {
      this.root.style.width = sizeToCSS(options.width);
    }
    if (options.height) {
      this.root.style.height = sizeToCSS(options.height);
    }
    if (options.position) {
      this.root.style.position = "absolute";
      this.root.style.left = sizeToCSS(options.position[0]);
      this.root.style.top = sizeToCSS(options.position[1]);
    }
    if (options.scroll == true) {
      this.content.style.overflow = "auto";
    }
  }

  add(item: LiteComponent) {
    this.content.appendChild(item.root || (item as unknown as HTMLElement));
  }

  setTitle(title: string) {
    this.titleElement.textContent = title;
    return this;
  }

  close() {
    this.root.parentElement?.removeChild(this.root);
    this.emit("closed", this);
    return this;
  }

  show() {
    this.root.style.display = "";
    return this;
  }

  hide() {
    this.root.style.display = "none";
    return this;
  }

  clear() {
    this.content.innerHTML = "";
    return this;
  }
}

export default Panel;
