type Callback = Function;

interface ButtonOptions {
  size?: "default" | "small" | "mini";
  callback?: Callback;
}

export class Button {
  root: HTMLDivElement;
  content: HTMLButtonElement;
  options: ButtonOptions;
  constructor(value: string, options: ButtonOptions | Callback) {
    options = options || {};
    if (typeof options === "function") options = { callback: options };
    this.options = options;
    this.root = this.createElementRoot();
    this.content = this.createElementButton();
    this.initDom(value);
    this.initEvent();
  }
  createElementRoot() {
    const root = document.createElement("div");
    root.classList.add("lite-button");
    const size = this.options?.size;
    size && root.classList.add(size);
    return root;
  }
  createElementButton() {
    const button = document.createElement("button");
    button.className = "lite-button__inner";
    return button;
  }
  initDom(value: string) {
    this.content.innerHTML = value;
    this.root.appendChild(this.content);
  }
  initEvent() {
    const button = this.content;
    button.addEventListener("click", e => {
      this.click();
    });
  }
  click() {
    const callback = this.options.callback;
    callback && callback.call(this);
  }
}
