import { isFunction, isArray, isString } from "lodash-es";
import mitt from "mitt";
import type { Handler } from "mitt";
const emitter = mitt();

interface MonitorableObject {
  _events: EventMitter;
  [key: string]: any
}

import Area from "./Area";
import Console from "./Console";
import Dialog from "./Dialog";
import Dragger from "./Dragger";
import Inspector from "./Inspector";
import Menu from "./Menu";
import Panel from "./Panel";
import Split from "./Split";
import Table from "./Table";
import Tabs from "./Tabs";
import Tree from "./Tree";
import Checkbox from "./Checkbox";
import Button from "./Button";
import { Widget, SearchBox, ContextMenu, List, LineEditor, Slider, ComplexList, createLitebox } from "./Widgets";
import { LiteComponent } from "../types";
import EventMitter from "./EventMitter";

interface LiteGUIOptions {
  container?: string;
  width?: number;
  height?: number;
  wrapped?: boolean;
  menubar?: boolean;
}

/**
 * Core namespace of LiteGUI library, it holds some useful functions
 *
 * @class LiteGUI
 * @constructor
 */

export default class LiteGUI {
  // component
  static Area = Area;
  static Button = Button;
  static Checkbox = Checkbox;
  static Console = Console;
  static Dialog = Dialog;
  static Dragger = Dragger;
  static Inspector = Inspector;
  static Panel = Panel;
  static Split = Split;
  static Table = Table;
  static Menu = Menu;
  static Tabs = Tabs;
  static Tree = Tree;
  static SearchBox = SearchBox;
  static ContextMenu = ContextMenu;
  static List = List;
  static LineEditor = LineEditor;
  static Slider = Slider;
  static ComplexList = ComplexList;
  static createLitebox = createLitebox

  static root: HTMLElement
  // the top menu
  static mainmenu: Menu | null = null
  static menubar: Menu | null = null
  static container: HTMLElement | null = null
  static content: HTMLElement
  // used for blacken when a modal dialog is shown
  static modalbg_div: HTMLDivElement | null = null
  // 
  static windows: Window[] = [];
  static panels = {}
  static __events = []
  static _safe_cliboard: any = null;
  // undo redo
  static undo_steps = []
  static redo_steps = []


  /**
   * initializes the lib, must be called
   * @method init
   * @param {object} options some options are container, menubar,
   */

  static init(options: LiteGUIOptions = {}) {

    // choose main container
    this.container = null;

    if (options.container) {
      this.container = document.getElementById(options.container);
    }
    if (!this.container) {
      this.container = document.body;
    }

    if (options.wrapped) {
      //create litegui root element
      const root = document.createElement("div");
      root.style.position = "relative";
      root.style.overflow = "hidden";
      this.root = root;

      this.container.appendChild(root);

      //content: the main container for everything
      const content = document.createElement("div");
      this.content = content;
      this.root.appendChild(content);

      //maximize
      if (this.root.classList.contains("fullscreen")) {
        window.addEventListener("resize", () => {
          LiteGUI.maximizeWindow();
        });
      }

    } else {
      this.root = this.container;
      this.content = this.container;
    }

    if (options.width && options.height) {
      this.setWindowSize(options.width, options.height);
    }
    this.root.className = "litegui-wrap fullscreen";
    this.content.className = "litegui-maincontent";

    //create modal dialogs container
    this.modalbg_div = document.createElement("div")
    this.modalbg_div.className = "litemodalbg";
    this.modalbg_div.style.display = "none";
    this.root.appendChild(this.modalbg_div);

    //create menubar
    if (options.menubar) this.createMenu();

    //called before anything
    // if (options.gui_callback) options.gui_callback();

    //external windows
    window.addEventListener("beforeunload", function (e) {
      for (var i in LiteGUI.windows) LiteGUI.windows[i].close();
      LiteGUI.windows = [];
    });

    // Done
  }


  static createMenu() {
    LiteGUI.menubar = new Menu("mainmenubar");
    LiteGUI.add(LiteGUI.menubar);
  }

  static setWindowSize(w?: number, h?: number) {
    if (!this.root) return false;
    const style = this.root.style;
    if (w && h) {
      style.width = w + "px";
      style.height = h + "px";
      style.boxShadow = "0 0 4px black";
      this.root.classList.remove("fullscreen");
    } else {
      if (this.root.classList.contains("fullscreen")) return;
      this.root.classList.add("fullscreen");
      style.width = "100%";
      style.height = "100%";
      style.boxShadow = "0 0 0";
    }
    LiteGUI.trigger(LiteGUI, "resized");
    return true;
  }

  /**
   * Binds an event in an object (similar to jQuery.bind)
   * If the element is not an HTML entity a new one is created, attached to the object (as non-enumerable, called __events) and used
   * @method trigger
   * @param {Object} element could be an HTMLEntity, a regular object, a query string or a regular Array of entities
   * @param {String} event the string defining the event
   * @param {Function} callback where to call
   */
  public bind(element: string | NodeList | HTMLElement | MonitorableObject, event: string, callback: EventListener) {
    if (!element) throw "Cannot bind to null";
    if (!event) throw "Event bind missing";
    if (!callback) throw "Bind callback missing";

    if (typeof element === 'string') {
      element = document.querySelectorAll(element);
    }

    if (element instanceof Array || element instanceof NodeList) {
      element.forEach(ele => inner(ele));
    } else {
      inner(element);
    }

    function inner(element: HTMLElement | MonitorableObject) {
      if (element.addEventListener) {
        element.addEventListener(event, callback);
      } else if ((element as MonitorableObject).__events) {
        (element as MonitorableObject).__events.on(event, callback);
      } else {
        (element as MonitorableObject)._events = new EventMitter();
        (element as MonitorableObject).__events.on(event, callback);
      }
    }
  }
  /**
 * Unbinds an event in an object (similar to jQuery.unbind)
 * @method unbind
 * @param {Object} element could be anu HTMLEntity or a regular object
 * @param {String} event the string defining the event
 * @param {Function} callback where to call
 */
  unbind(element: HTMLElement | MonitorableObject, event: string, callback: EventListener) {
    if (element.removeEventListener) {
      element.removeEventListener(event, callback);
    } else {
      (element as MonitorableObject).__events?.off(event, callback);
    }
  }

  /**
* Appends litegui widget to the global interface
* @method add
* @param {Object} component
*/
  static add(component: LiteComponent) {
    LiteGUI.content.appendChild(component.root || component);
  }

  /**
   * Remove from the interface, it is is an HTML element it is removed from its parent, if it is a widget the same.
   * @method remove
   * @param {Object} litegui_element it also supports HTMLentity, selector string or Array of elements
   */
  static remove(element: HTMLElement | string) {
    if (!element) return false;

    if (typeof element === 'string') {
      // as a selector
      const elements = document.querySelectorAll(element);
      Array.from(elements).forEach(element => {
        element.parentElement?.removeChild(element)
      })
    } else if (element instanceof Array || element instanceof NodeList) {
      // as list
      Array.from(element).forEach(ele => {
        LiteGUI.remove(ele);
      })
    } else if (element instanceof Widget) {
      // as a ltiegui widget
      element.root.parentNode?.removeChild(element.root);
    } else if (element.parentNode) {
      // as regular HTML entity
      element.parentNode.removeChild(element);
    }

    return true;
  }

  /**
     * Change cursor
     * @method setCursor
     * @param {String} cursor
     **/
  static setCursor(name: string) {
    if (!this.root) return false;
    this.root.style.cursor = name;
    return true;
  }


  /**
 * wrapper of document.getElementById
 * @method getById
 * @param {String} id
 * return {HTMLEntity}
 **/
  static getById(id: string) {
    return document.getElementById(id);
  }

  // ====== static method ======

  /**
   * Triggers a simple event in an object (similar to jQuery.trigger)
   * @method trigger
   * @param {Object} element could be an HTMLEntity or a regular object
   * @param {String} event_name the type of the event
   * @param {*} params it will be stored in e.detail
   * @param {*} origin it will be stored in e.target
   */


  static trigger(element: HTMLElement | any, eventName: string, params?: any) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: params
    })

    if ((element as any).fireEvent) {
      (element as any).fireEvent(event)
    }

    if ((element as HTMLElement).dispatchEvent) {
      (element as HTMLElement).dispatchEvent(event)
    };

    return event;
  }

  /**
   * trigger any event
   * @param event 
   */
  static fireEvent(event: CustomEvent) {
    const eventName = event.type;
    const data = event.detail;
    LiteGUI.emit(eventName, data)
  }


  static maximizeWindow() {
    LiteGUI.setWindowSize();
  }

  static on(type: string, handler: Handler) {
    emitter.on(type, handler)
  }
  static emit(type: string, data: any) {
    emitter.emit(type, data)
  }

  /**
   * Convert sizes in any format to a valid CSS format (number to string, negative number to calc( 100% - number px )
   * @method sizeToCSS
   * @param {String||Number} size
   * @return {String} valid css size string
   **/

  static sizeToCSS(v: any): string {
    if (v === undefined || v === null) return 'auto';
    if (isString(v)) return v;
    if (v >= 0) return (v | 0) + "px";
    return "calc( 100% - " + Math.abs(v | 0) + "px )";
  }


  /**
   * removes a class
   * @method removeClass
   * @param {HTMLElement} root
   * @param {String} selector
   * @param {String} class_name
   */
  static removeClass(root: HTMLElement, selector: string, class_name: string) {
    if (!class_name) {
      class_name = selector;
      selector = "." + selector;
    }
    const list = (root || document).querySelectorAll(selector);
    Array.from(list).forEach(ele => {
      ele.classList.remove(class_name);
    })
  }


  /**
   * Test if the cursor is inside an element
   * @method isCursorOverElement
   * @param {String} cursor
   **/

  static isCursorOverElement(event: MouseEvent, element: HTMLElement): boolean {
    var left = event.pageX;
    var top = event.pageY;
    var rect = element.getBoundingClientRect();
    if (!rect) return false;
    if (top > rect.top && top < rect.top + rect.height && left > rect.left && left < rect.left + rect.width)
      return true;
    return false;
  }

  static getRect(element: HTMLElement) {
    return element.getBoundingClientRect();
  }


  /**
   * Copy a string to the clipboard (it needs to be invoqued from a click event)
   * @method toClipboard
   * @param {String} data
   * @param {Boolean} force_local force to store the data in the browser clipboard (this one can be read back)
   **/
  static toClipboard(object: any, force_local = false) {
    if (object && object.constructor !== String) object = JSON.stringify(object);

    var input = null;
    var in_clipboard = false;
    if (!force_local)
      try {
        input = document.createElement("input");
        input.type = "text";
        input.style.opacity = '0';
        input.value = object;
        document.body.appendChild(input);
        input.select();
        in_clipboard = document.execCommand("copy");
        console.log(in_clipboard ? "saved to clipboard" : "problem saving to clipboard");
        document.body.removeChild(input);
      } catch (err) {
        if (input) {
          document.body.removeChild(input);
        }
        console.warn("Oops, unable to copy using the true clipboard");
      }

    // old system
    try {
      this._safe_cliboard = null;
      localStorage.setItem("litegui_clipboard", object);
    } catch (err) {
      this._safe_cliboard = object;
      console.warn("cliboard quota excedeed");
    }
  }

  /**
   * Reads from the secondary clipboard (only can read if the data was stored using the toClipboard)
   * @method getLocalClipboard
   * @return {String} clipboard
   **/
  static getLocalClipboard() {
    var data = localStorage.getItem("litegui_clipboard");
    if (!data && this._safe_cliboard) data = this._safe_cliboard;
    if (!data) return null;
    if (data[0] == "{") return JSON.parse(data);
    return data;
  }


  /**
   * Insert some CSS code to the website
   * @method addCSS
   * @param {String|Object} code it could be a string with CSS rules, or an object with the style syntax.
   **/
  static addCSS(code: string | object) {
    if (!code) return;

    if (typeof code === 'string') {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = code;
      document.getElementsByTagName("head")[0].appendChild(style);
      return;
    } else {
      Object.entries(code).forEach(([key, value]) => {
        document.body.style[key as any] = value;
      })
    }
  }

  /**
 * Requires a new CSS
 * @method requireCSS
 * @param {String} url string with url or an array with several urls
 * @param {Function} on_complete
 **/
  static requireCSS(url: string | string[], on_complete: ((this: GlobalEventHandlers, ev: Event) => any)) {
    if (typeof url == "string") {
      url = [url];
    }

    while (url.length) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = url.shift() as string;
      link.media = "all";
      const head = document.getElementsByTagName("head")[0];
      head.appendChild(link);
      if (url.length == 0) {
        link.onload = on_complete;
      }
    }
  }


  /**
   * Request file from url (it could be a binary, text, etc.). If you want a simplied version use
   * @method request
   * @param {Object} request object with all the parameters like data (for sending forms), dataType, success, error
   * @param {Function} on_complete
   **/
  static request(request: any) {
    var dataType = request.dataType || "text";
    if (dataType == "json")
      //parse it locally
      dataType = "text";
    else if (dataType == "xml")
      //parse it locally
      dataType = "text";
    else if (dataType == "binary") {
      //request.mimeType = "text/plain; charset=x-user-defined";
      dataType = "arraybuffer";
      request.mimeType = "application/octet-stream";
    }

    //regular case, use AJAX call
    var xhr = new XMLHttpRequest();
    xhr.open(request.data ? "POST" : "GET", request.url, true);
    if (dataType) xhr.responseType = dataType;
    if (request.mimeType) xhr.overrideMimeType(request.mimeType);
    if (request.nocache) xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.onload = function (load) {
      var response = this.response;
      if (this.status != 200) {
        var err = "Error " + this.status;
        if (request.error) request.error(err);
        LiteGUI.trigger(xhr, "fail", this.status);
        return;
      }

      if (request.dataType == "json") {
        //chrome doesnt support json format
        try {
          response = JSON.parse(response);
        } catch (err) {
          if (request.error) request.error(err);
          else throw err;
        }
      } else if (request.dataType == "xml") {
        try {
          var xmlparser = new DOMParser();
          response = xmlparser.parseFromString(response, "text/xml");
        } catch (err) {
          if (request.error) request.error(err);
          else throw err;
        }
      }
      if (request.success) request.success.call(this, response, this);
    };
    xhr.onerror = function (err) {
      if (request.error) request.error(err);
    };

    var data = new FormData();
    if (request.data) {
      for (var i in request.data) data.append(i, request.data[i]);
    }

    xhr.send(data);
    return xhr;
  }

  /**
   * Request file from url
   * @method requestText
   * @param {String} url
   * @param {Function} on_complete
   * @param {Function} on_error
   **/
  static requestText(url: string, on_complete: Function, on_error: Function) {
    return this.request({ url: url, dataType: "text", success: on_complete, error: on_error });
  }

  /**
   * Request file from url
   * @method requestJSON
   * @param {String} url
   * @param {Function} on_complete
   * @param {Function} on_error
   **/
  static requestJSON(url: string, on_complete: Function, on_error: Function) {
    return this.request({ url: url, dataType: "json", success: on_complete, error: on_error });
  }

  /**
   * Request binary file from url
   * @method requestBinary
   * @param {String} url
   * @param {Function} on_complete
   * @param {Function} on_error
   **/
  static requestBinary(url: string, on_complete: Function, on_error: Function) {
    return this.request({ url: url, dataType: "binary", success: on_complete, error: on_error });
  }

  /**
   * Request script and inserts it in the DOM 
   * 一次性加载多个脚本元素
   * @method requireScript
   * @param {String|Array} url the url of the script or an array containing several urls
   * @param {Function} on_complete
   * @param {Function} on_error
   * @param {Function} on_progress (if several files are required, on_progress is called after every file is added to the DOM)
   **/
  static requireScript(
    url: string | string[],
    on_complete: Function,
    on_error: Function,
    on_progress: Function,
    version: string | number
  ) {
    if (!url) throw "invalid URL";
    let urls = [];
    if (typeof url === 'string') {
      urls = [url];
    } else {
      urls = url
    }

    let total = url.length;
    const loaded_scripts: HTMLScriptElement[] = [];
    urls.forEach((url, i) => {
      const script = document.createElement("script");
      script.setAttribute('script_index', i.toString());
      script.setAttribute('original_src', url);
      script.async = false;
      script.type = "text/javascript";
      script.src = url + (version ? "?version=" + version : "");
      script.onload = () => {
        total--;
        loaded_scripts.push(script);
        if (total) {
          if (on_progress) {
            on_progress(
              script.getAttribute("original_src"),
              script.getAttribute("script_index")
            );
          }
        } else if (on_complete) {
          on_complete(loaded_scripts);
        }
      };

      script.onerror = (err) => {
        if (on_error) {
          on_error(err, script.getAttribute("original_src"),
            script.getAttribute("script_index"));
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    })
  }

  /**
   * old version, it loads one by one, so it is slower
   * 
   * @param url 
   * @param on_complete 
   * @param on_progress 
   */
  static requireScriptSerial(url: string, on_complete: Function, on_progress: Function) {
    let urls: string[] = [];
    if (typeof url == "string") {
      urls = [url];
    } else {
      urls = url;
    }

    const loaded_scripts: HTMLScriptElement[] = [];
    function addScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = urls.shift() as string;
      script.onload = () => {
        loaded_scripts.push(script);
        if (urls.length) {
          if (on_progress) {
            on_progress(urls[0], url.length);
          }
          addScript();
          return false;
        }
        if (on_complete) {
          on_complete(loaded_scripts);
        }
        return true;
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    addScript();

  }



  /**
   * Request script and inserts it in the DOM
   * @method createElement
   * @param {String} tag
   * @param {String} id_class string containing id and classes, example: "myid .someclass .anotherclass"
   * @param {String} content
   * @param {Object} style
   **/
  static createElement(
    tag: string,
    id_class: string,
    content: string,
    style: string | object = "",
    events: Record<string, EventListenerOrEventListenerObject> = {}
  ) {

    const elem = document.createElement(tag);
    if (id_class) {
      var t = id_class.split(" ");
      for (var i = 0; i < t.length; i++) {
        if (t[i][0] == ".") elem.classList.add(t[i].substr(1));
        else if (t[i][0] == "#") elem.id = t[i].substr(1);
        else elem.id = t[i];
      }
    }

    if (content) {
      elem.innerHTML = content;
    }


    if (style) {
      if (typeof style === 'string') {
        elem.setAttribute("style", style);
      } else {
        Object.entries(style).forEach(([key, value]) => {
          elem.style[key as any] = value;
        })
      }
    }

    if (events) {
      Object.entries(events).forEach(([event, callback]) => {
        elem.addEventListener(event as keyof HTMLElementEventMap, callback);
      })

    }
    return elem;
  }

  static craeteDivElement(id: string, code: string) {
    return LiteGUI.createElement("div", id, code);
  }

  /**
   * Useful to create elements from a text like '<div><span class="title"></span></div>' 
   * and an object like { ".title":"mytitle" }
   * @method createListItem
   * @param {String} code
   * @param {Object} values it will use innerText in the elements that matches that selector
   * @param {Object} style
   * @return {HTMLElement}
   **/
  static createListItem(code: string, values: Record<string, string>, style: string | Record<string, string>) {
    const elem = document.createElement("span");
    elem.innerHTML = code;
    if (values)
      for (var i in values) {
        const subelem = elem.querySelector(i) as HTMLElement;
        if (subelem) {
          subelem.innerText = values[i];
        }
      }
    if (style) {
      if (typeof style === 'string') {

      } else {
        Object.entries(style).forEach(([key, value]) => {
          elem.style[key as any] = value;
        })
      }

    }
    return elem;
  }

  /**
   * Request script and inserts it in the DOM
   * @method createButton
   * @param {String} id
   * @param {String} content
   * @param {Function} callback when the button is pressed
   * @param {Object|String} style
   **/
  createButton(id_class: string, content: string, callback: EventListener, style: string | Record<string, string>) {
    var elem = document.createElement("button");
    elem.className = "litegui litebutton button";
    if (id_class) {
      var t = id_class.split(" ");
      for (var i = 0; i < t.length; i++) {
        if (t[i][0] == ".") elem.classList.add(t[i].substr(1));
        else if (t[i][0] == "#") elem.id = t[i].substr(1);
        else elem.id = t[i];
      }
    }

    if (content !== undefined) elem.innerHTML = content;
    if (callback) elem.addEventListener("click", callback);
    if (style) {
      if (typeof style === 'string') {
        elem.setAttribute("style", style);
      } else {
        Object.entries(style).forEach(([key, value]) => {
          elem.style[key as any] = value;
        })
      }
    }
    return elem;
  }

  static getParents(element: HTMLElement) {
    const elements: HTMLElement[] = [];
    while ((element.parentElement) !== null) {
      element = element.parentElement
      if (element.nodeType !== Node.ELEMENT_NODE) continue;
      elements.push(element);
    }
    return elements;
  }

  //used to create a window that retains all the CSS info or the scripts.
  newWindow(title, width, height, options) {
    options = options || {};
    var new_window = window.open(
      "",
      "",
      "width=" + width + ", height=" + height + ", location=no, status=no, menubar=no, titlebar=no, fullscreen=yes"
    );
    new_window.document.write("<html><head><title>" + title + "</title>");

    //transfer style
    var styles = document.querySelectorAll("link[rel='stylesheet'],style");
    for (var i = 0; i < styles.length; i++) new_window.document.write(styles[i].outerHTML);

    //transfer scripts (optional because it can produce some errors)
    if (options.scripts) {
      var scripts = document.querySelectorAll("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src)
          //avoid inline scripts, otherwise a cloned website would be created
          new_window.document.write(scripts[i].outerHTML);
      }
    }

    var content = options.content || "";
    new_window.document.write("</head><body>" + content + "</body></html>");
    new_window.document.close();
    return new_window;
  },

  //* DIALOGS *******************
  showModalBackground(v) {
    if (LiteGUI.modalbg_div) LiteGUI.modalbg_div.style.display = v ? "block" : "none";
  },

  showMessage(content, options) {
    options = options || {};

    options.title = options.title || "Attention";
    options.content = content;
    options.close = "fade";
    var dialog = new LiteGUI.Dialog(options);
    if (!options.noclose) dialog.addButton("Close", { close: true });
    dialog.makeModal("fade");
    return dialog;
  },

  /**
   * Shows a dialog with a message
   * @method popup
   * @param {String} content
   * @param {Object} options ( min_height, content, noclose )
   **/
  popup(content, options) {
    options = options || {};

    options.min_height = 140;
    if (typeof content == "string") content = "<p>" + content + "</p>";

    options.content = content;
    options.close = "fade";

    var dialog = new LiteGUI.Dialog(options);
    if (!options.noclose) dialog.addButton("Close", { close: true });
    dialog.show();
    return dialog;
  },

  /**
   * Shows an alert dialog with a message
   * @method alert
   * @param {String} content
   * @param {Object} options ( title, width, height, content, noclose )
   **/
  alert(content, options) {
    options = options || {};

    options.className = "alert";
    options.title = options.title || "Alert";
    options.width = options.width || 280;
    options.height = options.height || 140;
    if (typeof content == "string") content = "<p>" + content + "</p>";
    LiteGUI.remove(".litepanel.alert"); //kill other panels
    return LiteGUI.showMessage(content, options);
  },

  /**
   * Shows a confirm dialog with a message
   * @method confirm
   * @param {String} content
   * @param {Function} callback
   * @param {Object} options ( title, width, height, content, noclose )
   **/
  confirm(content, callback, options) {
    options = options || {};
    options.className = "alert";
    options.title = options.title || "Confirm";
    options.width = options.width || 280;
    //options.height = 100;
    if (typeof content == "string") content = "<p>" + content + "</p>";

    content +=
      "<button class='litebutton' data-value='yes' style='width:45%; margin-left: 10px'>Yes</button><button class='litebutton' data-value='no' style='width:45%'>No</button>";
    options.noclose = true;

    var dialog = this.showMessage(content, options);
    dialog.content.style.paddingBottom = "10px";
    var buttons = dialog.content.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", inner);
    buttons[0].focus();

    function inner(v) {
      var v = this.dataset["value"] == "yes";
      dialog.close(); //close before callback
      if (callback) callback(v);
    }

    return dialog;
  },

  /**
   * Shows a prompt dialog with a message
   * @method prompt
   * @param {String} content
   * @param {Function} callback
   * @param {Object} options ( title, width, height, content, noclose )
   **/
  prompt(content, callback, options) {
    options = options || {};
    options.className = "alert";
    options.title = options.title || "Prompt";
    options.width = options.width || 280;

    //options.height = 140 + (options.textarea ? 40 : 0);
    if (typeof content == "string") content = "<p>" + content + "</p>";

    var value = options.value || "";
    var textinput = "<input type='text' value='" + value + "'/>";
    if (options.textarea) textinput = "<textarea class='textfield' style='width:95%'>" + value + "</textarea>";

    content +=
      "<p>" +
      textinput +
      "</p><button class='litebutton' data-value='accept' style='width:45%; margin-left: 10px; margin-bottom: 10px'>Accept</button><button class='litebutton' data-value='cancel' style='width:45%'>Cancel</button>";
    options.noclose = true;
    var dialog = this.showMessage(content, options);

    var buttons = dialog.content.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", inner);

    var input = dialog.content.querySelector("input,textarea");
    input.addEventListener("keydown", inner_key, true);

    function inner() {
      var value = input.value;
      if (this.dataset && this.dataset["value"] == "cancel") value = null;
      dialog.close(); //close before callback
      if (callback) callback(value);
    }

    function inner_key(e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == "13") {
        inner();
        return false;
      }
      if (keyCode == "29") dialog.close();
    }

    input.focus();
    return dialog;
  },

  /**
   * Shows a choice dialog with a message
   * @method choice
   * @param {String} content
   * @param {Function} callback
   * @param {Object} options ( title, width, height, content, noclose )
   **/
  choice(content, choices, callback, options) {
    options = options || {};
    options.className = "alert";
    options.title = options.title || "Select one option";
    options.width = options.width || 280;
    //options.height = 100;
    if (typeof content == "string") content = "<p>" + content + "</p>";

    for (var i in choices) {
      content +=
        "<button class='litebutton' data-value='" +
        i +
        "' style='width:45%; margin-left: 10px'>" +
        (choices[i].content || choices[i]) +
        "</button>";
    }
    options.noclose = true;

    var dialog = this.showMessage(content, options);
    dialog.content.style.paddingBottom = "10px";
    var buttons = dialog.content.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", inner);

    function inner(v) {
      var v = choices[this.dataset["value"]];
      dialog.close(); //close before callback
      if (callback) callback(v);
    }

    return dialog;
  },

  downloadURL(url, filename) {
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadFile(filename, data, dataType) {
    if (!data) {
      console.warn("No file provided to download");
      return;
    }

    if (!dataType) {
      if (data.constructor === String) dataType = "text/plain";
      else dataType = "application/octet-stream";
    }

    var file = null;
    if (data.constructor !== File && data.constructor !== Blob) file = new Blob([data], { type: dataType });
    else file = data;

    var url = URL.createObjectURL(file);
    var element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000 * 60); //wait one minute to revoke url
  },

  /**
   * Returns the URL vars ( ?foo=faa&foo2=etc )
   * @method getUrlVars
   **/
  getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },

  getUrlVar(name) {
    return LiteGUI.getUrlVars()[name];
  },

  focus(element) {
    element.focus();
  },

  blur(element) {
    element.blur();
  },

  /**
   * Makes one element draggable
   * @method draggable
   * @param {HTMLEntity} container the element that will be dragged
   * @param {HTMLEntity} dragger the area to start the dragging
   **/
  draggable(container, dragger, on_start, on_finish, on_is_draggable) {
    dragger = dragger || container;
    dragger.addEventListener("mousedown", inner_mouse);
    dragger.style.cursor = "move";
    var prev_x = 0;
    var prev_y = 0;

    var rect = container.getClientRects()[0];
    var x = rect ? rect.left : 0;
    var y = rect ? rect.top : 0;

    container.style.position = "absolute";
    container.style.left = x + "px";
    container.style.top = y + "px";

    function inner_mouse(e) {
      if (e.type == "mousedown") {
        if (!rect) {
          rect = container.getClientRects()[0];
          x = rect ? rect.left : 0;
          y = rect ? rect.top : 0;
        }

        if (on_is_draggable && on_is_draggable(container, e) == false) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        prev_x = e.clientX;
        prev_y = e.clientY;
        document.addEventListener("mousemove", inner_mouse);
        document.addEventListener("mouseup", inner_mouse);
        if (on_start) on_start(container, e);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      if (e.type == "mouseup") {
        document.removeEventListener("mousemove", inner_mouse);
        document.removeEventListener("mouseup", inner_mouse);

        if (on_finish) on_finish(container, e);
        return;
      }

      if (e.type == "mousemove") {
        var deltax = e.clientX - prev_x;
        var deltay = e.clientY - prev_y;
        prev_x = e.clientX;
        prev_y = e.clientY;
        x += deltax;
        y += deltay;
        container.style.left = x + "px";
        container.style.top = y + "px";
      }
    }
  },

  /**
   * Clones object content
   * @method cloneObject
   * @param {Object} object
   * @param {Object} target
   **/
  cloneObject(object, target) {
    var o = target || {};
    for (var i in object) {
      if (i[0] == "_" || i.substr(0, 6) == "jQuery")
        //skip vars with _ (they are private)
        continue;

      var v = object[i];
      if (v == null) o[i] = null;
      else if (isFunction(v)) continue;
      else if (typeof v == "number" || typeof v == "string") o[i] = v;
      else if (v.constructor == Float32Array)
        //typed arrays are ugly when serialized
        o[i] = Array.apply([], v); //clone
      else if (isArray(v)) {
        if (o[i] && o[i].constructor == Float32Array)
          //reuse old container
          o[i].set(v);
        else o[i] = JSON.parse(JSON.stringify(v)); //v.slice(0); //not safe using slice because it doesnt clone content, only container
      } //slow but safe
      else {
        try {
          //prevent circular recursions
          o[i] = JSON.parse(JSON.stringify(v));
        } catch (err) {
          console.error(err);
        }
      }
    }
    return o;
  },

  safeName(str) {
    return String(str).replace(/[\s\.]/g, "");
  },

  //those useful HTML unicode codes that I never remeber but I always need
  special_codes: {
    close: "&#10005;",
    navicon: "&#9776;",
    refresh: "&#8634;",
    gear: "&#9881;",
    open_folder: "&#128194;",
    download: "&#11123;",
    tick: "&#10003;",
    trash: "&#128465;"
  },

  //given a html entity string it returns the equivalent unicode character
  htmlEncode(html_code) {
    var e = document.createElement("div");
    e.innerHTML = html_code;
    return e.innerText;
  },

  //given a unicode character it returns the equivalent html encoded string
  htmlDecode(unicode_character: string) {
    var e = document.createElement("div");
    e.innerText = unicode_character;
    return e.innerHTML;
  },



  /**
   * Returns the window where this element is attached (used in multi window applications)
   * @method getElementWindow
   * @param {HTMLElement} v
   * @return {Window} the window element
   **/
  getElementWindow(v: HTMLElement) {
    var doc = v.ownerDocument;
    return doc.defaultView || doc.parentWindow;
  },

  /**
   * Helper, makes drag and drop easier by enabling drag and drop in a given element
   * @method createDropArea
   * @param {HTMLElement} element the element where users could drop items
   * @param {Function} callback_drop function to call when the user drops the item
   * @param {Function} callback_enter [optional] function to call when the user drags something inside
   **/
  createDropArea(element, callback_drop, callback_enter, callback_exit) {
    element.addEventListener("dragenter", onDragEvent);

    function onDragEvent(evt) {
      element.addEventListener("dragexit", onDragEvent);
      element.addEventListener("dragover", onDragEvent);
      element.addEventListener("drop", onDrop);
      evt.stopPropagation();
      evt.preventDefault();
      if (evt.type == "dragenter" && callback_enter) callback_enter(evt, this);
      if (evt.type == "dragexit" && callback_exit) callback_exit(evt, this);
    }

    function onDrop(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      element.removeEventListener("dragexit", onDragEvent);
      element.removeEventListener("dragover", onDragEvent);
      element.removeEventListener("drop", onDrop);

      var r = undefined;
      if (callback_drop) r = callback_drop(evt);
      if (r) {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        return true;
      }
    }
  }
};