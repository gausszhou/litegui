type Callback = Function;

interface CheckboxOptions {
  size?: "default" | "small" | "mini";
  onChange?: Callback;
}

export class Checkbox {
  value: boolean;
  options: CheckboxOptions;
  root: HTMLSpanElement;
  element: HTMLSpanElement;
  constructor(value: boolean, options: CheckboxOptions | Callback) {
    options = options || {};
    if (typeof options === "function") options = { onChange: options };
    this.options = options;
    this.value = value;
    this.root = this.createElementRoot();
    this.element = this.createElementContent();
    this.root.dataset["value"] = value.toString();
    this.initDom();
    this.initEvent();
  }
  createElementRoot() {
    const root = (this.root = document.createElement("span"));
    root.className = "lite-checkbox inputfield";
    root.setAttribute("role", "checkbox");
    root.setAttribute("aria-checked", this.value.toString());
    root.tabIndex = 0;
    return root;
  }
  createElementContent() {
    const value = this.value;
    const element = (this.element = document.createElement("span"));
    element.className = "fixed flag checkbox " + (value ? "on" : "off");
    return element;
  }
  initDom() {
    this.root.appendChild(this.element);
  }
  initEvent() {
    this.root.addEventListener("click", (e) => {
      this.toggle();
      e.preventDefault();
      e.stopPropagation();
    });
    this.root.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        this.toggle();
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  private toggle() {
    this.setValue(this.root.dataset["value"] !== "true");
  }
  setValue(v: boolean) {
    if (this.value === v) return false;
    this.onValueChange(v);
    const oldValue = this.value;
    this.value = v;
    this.root.dataset["value"] = this.value.toString();
    this.root.setAttribute("aria-checked", this.value.toString());
    const onChange = this.options?.onChange;
    if (onChange) onChange(v, oldValue);
    return true;
  }
  onValueChange(v: boolean) {
    if (v) {
      this.element.classList.remove("off");
      this.element.classList.add("on");
    } else {
      this.element.classList.remove("on");
      this.element.classList.add("off");
    }
  }
  getValue() {
    return this.value;
  }
}
