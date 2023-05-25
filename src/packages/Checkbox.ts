type Callback = Function;

interface CheckboxOptions {
  size?: "default" | "small" | "mini";
  onChange?: Callback;
}

class Checkbox {
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
  }
  createElementRoot() {
    const root = (this.root = document.createElement("span"));
    root.className = "lite-checkbox inputfield";
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
    this.root.addEventListener("click", e => {
      this.setValue(this.root.dataset["value"] != "true");
      e.preventDefault();
      e.stopPropagation();
    });
  }
  setValue(v: boolean) {
    if (this.value === v) return false;
    this.onValueChange(v);
    const oldValue = this.value;
    this.value = v;
    this.root.dataset["value"] = this.value.toString();
    const onChange = this.options?.onChange;
    onChange && onChange(v, oldValue);
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
