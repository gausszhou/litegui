import EventMitter from "./EventMitter";
import { createElementFromString } from "./utils";

class Console extends EventMitter {
  options: any;
  _prompt: any;
  history: any;
  _history_offset: any;
  _input_blocked: any;

  root: HTMLDivElement;
  $log: HTMLDivElement;
  $footer: HTMLDivElement;
  $input: HTMLInputElement;

  onAutocomplete: any;
  onProcessCommand: any;

  constructor(options: any) {
    super();
    options = options || {};
    this.options = options;
    this._prompt = options.prompt || "]";

    this.onAutocomplete = null; //receives string, must return final string
    this.onProcessCommand = null; //receives input value
    this.history = [];
    this._history_offset = 0;

    this.root = this.createRoot();
    this.$log = this.createLog();
    this.$footer = this.createFooter();
    this.$input = this.createInput();

    this.initDom();
    this.initEvent();
  }
  createRoot() {
    const root = document.createElement("div");
    root.className = "liteconsole";
    return root;
  }
  createLog() {
    return createElementFromString(`<div class='log'></div>`) as HTMLDivElement;
  }
  createFooter() {
    return createElementFromString(`<div class='foot'></div>`) as HTMLDivElement;
  }
  createInput() {
    return createElementFromString(`<input type='text'/>`) as HTMLInputElement;
  }
  initDom() {
    this.root.appendChild(this.$log);
    this.root.appendChild(this.$footer);
    this.$footer.appendChild(this.$input);
  }
  initEvent() {
    this.$input.addEventListener("keydown", this.processKeyDown.bind(this));
  }
  processKeyDown(e: any) {
    if (this._input_blocked) return;

    if (e.keyCode == 13) {
      //return and exec
      var value = this.$input.value;
      var cmd = value.trim();
      this.addMessage(this._prompt + cmd, "me", true);
      this.$input.value = "";
      this.history.push(cmd);
      if (this.history.length > 10) this.history.shift();
      if (this.onProcessCommand) this.onProcessCommand(cmd);
      this._history_offset = 0;
    } else if (e.keyCode == 38 || e.keyCode == 40) {
      //up & down history
      this._history_offset += e.keyCode == 38 ? -1 : 1;
      if (this._history_offset > 0) this._history_offset = 0;
      else if (this._history_offset < -this.history.length) this._history_offset = -this.history.length;
      var pos = this.history.length + this._history_offset;
      if (pos < 0) return;
      if (pos >= this.history.length) this.$input.value = "";
      else this.$input.value = this.history[pos];
    } else if (e.keyCode == 9) {
      //tab autocompletion
      if (this.onAutocomplete) this.$input.value = this.onAutocomplete(this.$input.value);
      else return;
    } else return;
    e.preventDefault();
    e.stopPropagation();
  }

  addMessage(text: string | string[], className: string, as_text?: boolean) {
    const content = this.$log;
    let element: HTMLPreElement | null = null; //contains the last message sent

    const add = (txt: string) => {
      element = document.createElement("pre");
      if (as_text) {
        element.innerText = txt;
      } else {
        element.innerHTML = txt;
      }
      element.className = "msg";
      if (className) {
        element.classList.add(className);
      }
      content.appendChild(element);
      // length limit
      if (content.children.length > 1000) {
        content.removeChild(content.children[0]);
      }
    };

    if (text && text.constructor === Array) {
      for (var i = 0; i < text.length; ++i) {
        add(text[i]);
      }
    } else if (text && text.constructor === Object) {
      add(JSON.stringify(text, null, ""));
    } else {
      add(text.toString());
    }

    this.$log.scrollTop = 1000000;
    const message = {
      update: (v: string) => {
        if (element) element.innerHTML = v;
      }
    };

    return message;
  }

  log() {
    const args = Array.prototype.slice.call(arguments);
    const msg = args.join(",");
    return this.addMessage(msg, "msglog");
  }

  warn() {
    const args = Array.prototype.slice.call(arguments);
    const msg = args.join(",");
    return this.addMessage(msg, "msgwarn");
  }

  error() {
    const args = Array.prototype.slice.call(arguments);
    const msg = args.join(",");
    return this.addMessage(msg, "msgerror");
  }

  clear() {
    this.$log.innerHTML = "";
  }
}

export default Console;
