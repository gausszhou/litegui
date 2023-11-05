import type { LiteComponent } from "../types";
import type { ButtonOptions } from "./Button";
import Button from "./Button";
import EventMitter from "./EventMitter";
import LiteGUI from "./index";
import { createElementFromString } from "./utils";

interface ButtonsItemOptions extends ButtonOptions {
  name: string;
  close?: boolean;
}

interface DialogOptions {
  fullscreen?: boolean;
  minimize?: boolean;
  hide?: boolean;
  detachable?: boolean;
  closable?: boolean;
}

export default class Dialog extends EventMitter implements LiteComponent {
  static INSTANCE_LIST: Dialog[];
  static MINIMIZED_WIDTH: number = 200;
  static MIN_WIDTH: number = 150;
  static MIN_HEIGHT: number = 150;
  static TITLE_HEIGHT: string = "20px";

  public left: number = 0;
  public right: number = 0;
  public width: number = 0;
  public height: number = 0;

  public minWidth: number = 150;
  public minHeight: number = 150;

  public options: any;
  public root: HTMLDivElement;
  public header: HTMLDivElement;
  public buttons: HTMLDivElement;
  public content: HTMLDivElement;
  public footer: HTMLDivElement;
  public id: string;

  public dialogWindow?: Window | null;
  public oldStyleWidth: string = "0px";
  public oldStyleHeight: string = "0px";

  constructor(options: any, legacy: any) {
    super();
    if (legacy || options.constructor === String) {
      const id: string = options;
      options = legacy || {};
      options.id = id;
    }
    this.options = options || {};
    this.id = this.options.id;
    this.left = 0;
    this.right = 0;
    this.width = options.width;
    this.height = options.height;
    this.minWidth = options.minWidth || Dialog.MIN_WIDTH;
    this.minHeight = options.minHeight || Dialog.MIN_HEIGHT;
    this.root = this.createElementRoot();
    this.header = this.createElementHeader();
    this.buttons = this.createElementHeader();
    this.content = this.createElementContent();
    this.footer = this.createElementFooter();
    this.initDom();
  }

  createElementRoot() {
    const options = this.options;
    const element = createElementFromString(`<div class="lite-dialog"><div>`);
    element.id = options.id;
    options.className && element.classList.add(options.className);
    return element;
  }

  createElementHeader() {
    const options = this.options;
    return createElementFromString(`<div class="dialog-header"> ${options.title}<div>`);
  }

  createElementButtons() {
    const options = this.options;
    const str = ` 
    <div class="buttons"> 
      ${options.minimize ? `<button class="lite-button mini-button minimize-button">-</button>` : ""}
      ${options.minimize ? `<button class="lite-button mini-button maximize-button hidden"></button>` : ""}
      ${options.hide ? `<button class='lite-button mini-button   hide-button'></button>` : ""}
      ${options.detachable ? `<button class='lite-button mini-button detach-button'></button>` : ""}  
      ${options.closable ? `<button class='litebutton mini-button close-button'></button>` : ""}  
    </div>
    `;
    return createElementFromString(str);
  }

  createElementContent() {
    const options = this.options;
    return createElementFromString(`<div class="dialog-content"> ${options.content}<div>`);
  }

  createElementFooter() {
    return createElementFromString(`<div class="dialog-footer"><div>`);
  }

  initDom() {
    this.root.appendChild(this.header);
    this.root.appendChild(this.buttons);
    this.root.appendChild(this.content);
    this.root.appendChild(this.footer);
    this.initStyle();
  }
  initStyle() {
    const options = this.options;
    if (options.fullscreen) {
      this.content.style.width = "100%";
      this.content.style.height = options.title ? "calc( 100% - " + Dialog.TITLE_HEIGHT + " )" : "100%";
    }
    if (options.scroll == true) {
      this.content.style.overflow = "auto";
    }
    if (options.buttons) {
      options.buttons.forEach((button: ButtonsItemOptions) => {
        this.addButtonToFooter(button.name, button);
      });
    }
  }

  add(component: LiteComponent) {
    this.content?.appendChild(component.root || component);
  }

  addButtonToFooter(name: string, options: ButtonsItemOptions) {
    const button = new Button(name, options);
    this.footer.appendChild(button.root);
    button.on("click", () => {
      options.close && this.close();
    });
    return button;
  }

  clear() {
    if (this.content) this.content.innerHTML = "";
  }

  show() { }
  hide() {
    this.root.style.display = "none";
    LiteGUI.trigger(this, "hidden");
  }

  close() {
    LiteGUI.remove(this.root);
    LiteGUI.trigger(this, "closed", this);
    Dialog.INSTANCE_LIST.filter(dialog => dialog.id !== this.id);
    if (this.options.onClose) {
      this.options.onClose()
    };
    if (this.dialogWindow) {
      this.dialogWindow.close();
      this.dialogWindow = null;
    }
  }

  setSize(w: number, h: number) {
    this.root.style.width = typeof w == "number" ? w + "px" : w;
    this.root.style.height = typeof h == "number" ? h + "px" : h;
  }

  setPositon(x: number, y: number) {
    if (!this.root.parentNode) console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM");
    this.root.style.position = "absolute";
    this.root.style.left = x + "px";
    this.root.style.top = y + "px";
  }

  setTitle(title: string) {
    if (!this.header) return false;
    this.header.innerHTML = title;
    return true;
  }

  detachWindow(onComplete: Function, onClose: Function) {
    if (this.dialogWindow) return false;
    const rect = this.root.getClientRects()[0];
    const w = rect.width;
    const h = rect.height;
    const header = this.header;
    const title = header.textContent || "Window";
    const dialogWindow = window.open(
      "",
      "",
      `window=${w}, height=${h}, location=no, status=no, menubar=no,  titlebar=no, fullscreen=yes`
    );
    dialogWindow?.document.write()
    const styles = document.querySelectorAll("link[rel='stylesheet'], style");
    const html = `
    <head>
      <title>${title}</title>
      ${Array.from(styles).map(style => {
      return style.outerHTML;
    })
      }
      </head>
     <body></body>
    `
    dialogWindow?.document.write(html);
    dialogWindow?.document.close();
    // show content in new window
    dialogWindow?.document.body.appendChild(this.content);
    // hide in old window
    this.root.style.display = "none";
    // store 
    this.oldStyleWidth = this.content.style.width;
    this.oldStyleHeight = this.content.style.height;
    // fullscreen
    this.content.style.width = "100%";
    this.content.style.height = "100%";
    // add window
    dialogWindow && LiteGUI.windows.push(dialogWindow);
    // remove window
    dialogWindow && dialogWindow?.addEventListener("onbeforeunload", () => {
      LiteGUI.windows = LiteGUI.windows.filter((window: Window) => window !== dialogWindow);
      onClose && onClose();
    })
    onComplete && onComplete();
    return true;
  }
  getDialogById(id: string) {
    const dialog = Dialog.INSTANCE_LIST.find(dialog => dialog.id === id);
    if (!dialog) return null;
    return dialog;
  }

  static getDialog(id: string) {
    var element = document.getElementById(id);
    if (!element) return null;
    return element.dialog;
  };

  static showAll() {
    Dialog.INSTANCE_LIST.forEach(dialog => {
      dialog.show();
    });
  }

  static hideAll() {
    Dialog.INSTANCE_LIST.forEach(dialog => {
      dialog.hide();
    });
  }

  static closeAll() {
    Dialog.INSTANCE_LIST.forEach(dialog => {
      dialog.close();
    });
  }

  //takes the info from the parent to
  enableProperties(options = {}) {

    var that = this;

    var panel = this.root;
    panel.style.position = "absolute";
    //panel.style.display = "none";

    panel.style.minWidth = this.minWidth + "px";
    panel.style.minHeight = this.minHeight + "px";

    if (this.width) panel.style.width = this.width + "px";

    if (this.height) {
      if (typeof this.height == "number") {
        panel.style.height = this.height + "px";
      } else {
        if (this.height.indexOf("%") != -1) panel.style.height = this.height;
      }

      this.content.style.height = "calc( " + this.height + "px - 24px )";
    }

    panel.style.boxShadow = "0 0 3px black";

    if (options.draggable) {
      this.draggable = true;
      LiteGUI.draggable(
        panel,
        panel.querySelector(".panel-header"),
        function () {
          that.bringToFront();
        },
        null,
        function () {
          return !that.minimized;
        }
      );
    }

    if (options.resizable) this.setResizable();
  };


  setResizable() {
    if (this.resizable) return;

    var root = this.root;
    this.resizable = true;
    var footer = this.footer;
    footer.style.minHeight = "4px";
    footer.classList.add("resizable");

    var corner = document.createElement("div");
    corner.className = "resizable-corner";
    this.root.appendChild(corner);

    footer.addEventListener("mousedown", inner_mouse);
    corner.addEventListener("mousedown", inner_mouse, true);

    var mouse = [0, 0];
    var that = this;

    var is_corner = false;

    function inner_mouse(e) {
      //console.log( getTime(), is_corner );

      if (e.type == "mousedown") {
        document.body.addEventListener("mousemove", inner_mouse);
        document.body.addEventListener("mouseup", inner_mouse);
        is_corner = this == corner;
        mouse[0] = e.pageX;
        mouse[1] = e.pageY;
      } else if (e.type == "mousemove") {
        var rect = LiteGUI.getRect(root);
        var w = rect.width;
        var neww = w - (mouse[0] - e.pageX);

        var h = rect.height;
        var newh = h - (mouse[1] - e.pageY);

        if (is_corner) root.style.width = neww + "px";
        root.style.height = newh + "px";

        mouse[0] = e.pageX;
        mouse[1] = e.pageY;
        that.content.style.height = "calc( 100% - 24px )";

        if (that.on_resize && (w != neww || h != newh)) that.on_resize(e, neww, newh);
      } else if (e.type == "mouseup") {
        document.body.removeEventListener("mousemove", inner_mouse);
        document.body.removeEventListener("mouseup", inner_mouse);
        is_corner = false;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };


  dockTo(parent, dock_type) {
    if (!parent) return;
    var panel = this.root;

    dock_type = dock_type || "full";
    parent = parent.content || parent;

    panel.style.top = 0;
    panel.style.left = 0;

    panel.style.boxShadow = "0 0 0";

    if (dock_type == "full") {
      panel.style.position = "relative";
      panel.style.width = "100%";
      panel.style.height = "100%";
      this.content.style.width = "100%";
      this.content.style.height = "calc(100% - " + LiteGUI.Panel.title_height + ")"; //title offset: 20px
      this.content.style.overflow = "auto";
    } else if (dock_type == "left" || dock_type == "right") {
      panel.style.position = "absolute";
      panel.style.top = 0;
      panel.style[dock_type] = 0;

      panel.style.width = this.width + "px";
      panel.style.height = "100%";
      this.content.style.height = "calc(100% - " + LiteGUI.Panel.title_height + ")";
      this.content.style.overflow = "auto";

      if (dock_type == "right") {
        panel.style.left = "auto";
        panel.style.right = 0;
      }
    } else if (dock_type == "bottom" || dock_type == "top") {
      panel.style.width = "100%";
      panel.style.height = this.height + "px";
      if (dock_type == "bottom") {
        panel.style.bottom = 0;
        panel.style.top = "auto";
      }
    }

    if (this.draggable) {
      LiteGUI.draggable(panel);
    }

    if (parent.content) parent.content.appendChild(panel);
    else if (typeof parent == "string") {
      parent = document.querySelector(parent);
      if (parent) parent.appendChild(panel);
    } else parent.appendChild(panel);
  };



  highlight(time) {
    time = time || 100;
    this.root.style.outline = "1px solid white";
    var doc = this.root.ownerDocument;
    var w = doc.defaultView || doc.parentWindow;
    w.focus();
    setTimeout(
      function () {
        this.root.style.outline = null;
      }.bind(this),
      time
    );
  };


  minimize() {
    if (this.minimized) return;

    this.minimized = true;
    this.old_box = this.root.getBoundingClientRect();

    this.root.querySelector(".content").style.display = "none";

    var minimize_button = this.root.querySelector(".minimize-button");
    if (minimize_button) minimize_button.style.display = "none";

    var maximize_button = this.root.querySelector(".maximize-button");
    if (maximize_button) maximize_button.style.display = "";

    this.root.style.width = LiteGUI.Dialog.MINIMIZED_WIDTH + "px";

    LiteGUI.bind(this, "closed", function () {
      LiteGUI.Dialog.minimized.splice(LiteGUI.Dialog.minimized.indexOf(this), 1);
      LiteGUI.Dialog.arrangeMinimized();
    });

    LiteGUI.Dialog.minimized.push(this);
    LiteGUI.Dialog.arrangeMinimized();

    LiteGUI.trigger(this, "minimizing");
  };



  static arrangeMinimized() {
    for (var i in LiteGUI.Dialog.minimized) {
      var dialog = LiteGUI.Dialog.minimized[i];
      var parent = dialog.root.parentNode;
      var pos = parent.getBoundingClientRect().height - 20;
      dialog.root.style.left = LiteGUI.Dialog.MINIMIZED_WIDTH * i;
      dialog.root.style.top = pos + "px";
    }
  };



  maximize() {
    if (!this.minimized) return;
    this.minimized = false;

    this.root.querySelector(".content").style.display = "";
    LiteGUI.draggable(this.root);
    this.root.style.left = this.old_box.left + "px";
    this.root.style.top = this.old_box.top + "px";
    this.root.style.width = this.old_box.width + "px";
    this.root.style.height = this.old_box.height + "px";

    var minimize_button = this.root.querySelector(".minimize-button");
    if (minimize_button) minimize_button.style.display = "";

    var maximize_button = this.root.querySelector(".maximize-button");
    if (maximize_button) maximize_button.style.display = "none";

    LiteGUI.Dialog.minimized.splice(LiteGUI.Dialog.minimized.indexOf(this), 1);
    LiteGUI.Dialog.arrangeMinimized();
    LiteGUI.trigger(this, "maximizing");
  };



  makeModal() {
    LiteGUI.showModalBackground(true);
    LiteGUI.modalbg_div.appendChild(this.root); //add panel
    this.show();
    this.center();

    LiteGUI.bind(this, "closed", inner);

    function inner(e) {
      LiteGUI.showModalBackground(false);
    }
  };



  fadeIn(time) {
    time = time || 1000;
    this.root.style.display = "";
    this.root.style.opacity = 0;
    var that = this;
    setTimeout(function () {
      that.root.style.transition = "opacity " + time + "ms";
      that.root.style.opacity = 1;
    }, 100);
  };


  setPosition(x, y) {
    if (!this.root.parentNode) console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM");
    this.root.position = "absolute";
    this.root.style.left = x + "px";
    this.root.style.top = y + "px";
  };


  // TODO change prop
  center() {
    if (!this.root.parentNode) return;

    this.root.position = "absolute";
    var width = this.root.offsetWidth;
    var height = this.root.offsetHeight;
    var parent_width = this.root.parentNode.offsetWidth;
    var parent_height = this.root.parentNode.offsetHeight;
    this.root.style.left = Math.floor((parent_width - width) * 0.5) + "px";
    this.root.style.top = Math.floor((parent_height - height) * 0.5) + "px";
  };


  /**
   * Adjust the size of the dialog to the size of the content
   * @method adjustSize
   * @param {number} margin
   */
  adjustSize(margin, skip_timeout) {
    margin = margin || 0;
    this.content.style.height = "auto";

    if (this.content.offsetHeight == 0 && !skip_timeout) {
      //happens sometimes if the dialog is not yet visible
      var that = this;
      setTimeout(function () {
        that.adjustSize(margin, true);
      }, 1);
      return;
    }

    var extra = 0;
    var footer = this.root.querySelector(".panel-footer");
    if (footer) extra += footer.offsetHeight;

    var width = this.content.offsetWidth;
    var height = this.content.offsetHeight + 20 + margin + extra;

    this.setSize(width, height);
  };


  reattachWindow(on_complete) {
    if (!this.dialog_window) return;

    this.root.appendChild(this.content);
    this.root.style.display = ""; //show
    this.content.style.height = this._old_height;
    delete this._old_height;
    this.dialog_window.close();
    var index = LiteGUI.windows.indexOf(this.dialog_window);
    if (index != -1) LiteGUI.windows.splice(index, 1);
    this.dialog_window = null;
  };

}
