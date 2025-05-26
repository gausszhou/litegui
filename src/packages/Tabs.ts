import LiteGUI from ".";
import { LiteComponent } from "../types";

class Tab {
  id: string;
  content: HTMLElement;
  title: HTMLElement;
  onclose?: Function;
  selected?: boolean;

  constructor() {
    this.id = '';
    this.content = document.createElement("div");
    this.title = document.createElement("span");
    this.selected = false;
  }

  // 添加内容到标签页
  add(v: LiteComponent) {
    this.content.appendChild(v.root || v);
  }

  // 设置标签页标题
  setTitle(title: string) {
    this.title.innerHTML = title;
  }

  // 触发标签页点击事件
  click() {
    LiteGUI.trigger(this, "click");
  }

  // 销毁当前标签页
  destroy() {
    // 这里的 that 需要从外部传入,暂时注释掉
    // that.removeTab(this.id);
  }
}

/**
 * Widget that contains several tabs and their content
 * - 包含多个选项卡及其内容的小部件
 * - Options:
 * - - mode: "vertical","horizontal"
 * - - size
 * - - width,height
 * - - trigger: hover,click
 * @class Tabs
 * @constructor
 */

export class Tabs {
  options: any;
  mode: any;
  root: any;
  current_tab: any;
  previous_tab: any;
  plus_tab: any;
  _timeout_mouseover: any;
  list: HTMLUListElement;
  tabs_root: any;
  tabs: any;

  static tabs_width = 64;
  static tabs_height = 26;
  tabs_by_index: any;
  selected: any;
  onchange: any;


  constructor(options: any = {}, legacy: any = {}) {
    // 处理旧版本的参数传递方式
    if (legacy || (options && options.constructor === String)) {
      const id = options;
      options = legacy || {};
      options.id = id;
      console.warn("LiteGUI.Tabs legacy parameter, use options as first parameter instead of id.");
    }

    this.options = options;
    this.mode = options.mode || "horizontal";

    // 创建根元素
    const root = document.createElement("div");
    if (options.id) root.id = options.id;
    root.className = "litetabs " + this.mode;
    this.root = root;
    this.root.tabs = this;

    this.current_tab = null; // 当前选中的标签页 [id, tab, content]

    // 设置尺寸
    if (this.mode === "horizontal") {
      if (options.size) {
        this.root.style.height = options.size === "full" ? "100%" : options.size;
      }
    } else if (this.mode === "vertical") {
      if (options.size) {
        this.root.style.width = options.size === "full" ? "100%" : options.size;
      }
    }

    // 设置宽高
    if (options.width) {
      this.root.style.width = typeof options.width === "number" ?
        `${options.width.toFixed(0)}px` : options.width;
    }
    if (options.height) {
      this.root.style.height = typeof options.height === "number" ?
        `${options.height.toFixed(0)}px` : options.height;
    }

    // 创建标签页容器
    const list = document.createElement("ul");
    list.className = "wtabcontainer";
    if (this.mode === "vertical") {
      list.style.width = `${Tabs.tabs_width}px`;
    } else {
      list.style.height = `${Tabs.tabs_height}px`;
    }

    this.list = list;
    this.root.appendChild(list);
    this.tabs_root = list;

    // 初始化标签页相关属性
    this.tabs = {};
    this.tabs_by_index = [];
    this.selected = null;
    this.onchange = options.callback;

    // 添加到父元素
    if (options.parent) {
      this.appendTo(options.parent);
    }
  }


  show() {
    this.root.style.display = "block";
  };

  hide() {
    this.root.style.display = "none";
  };



  /**
   * Returns the currently selected tab in the form of a tab object
   * @method getCurrentTab
   * @return {Object} the tab in the form of an object with {id,tab,content}
   */
  getCurrentTab() {
    if (!this.current_tab) return null;
    return this.tabs[this.current_tab[0]];
  };

  getCurrentTabId() {
    return this.current_tab[0];
  };

  /**
   * Returns the last tab pressed before this one. used to know from which tab we come
   * @method getCurrentTab
   * @return {Object} the tab in the form of an object with {id,tab,content}
   */
  getPreviousTab() {
    if (!this.previous_tab) return null;
    return this.tabs[this.previous_tab[0]];
  };

  appendTo(parent: HTMLElement, at_front = false) {
    if (at_front) parent.prepend(this.root);
    else parent.appendChild(this.root);
  };


  /**
   * Returns a tab given its id
   * @method getTab
   * @param {String} id tab id
   * @return {Object} the tab in the form of an object with {id,tab,content}
   */
  getTab(id: string) {
    return this.tabs[id];
  };

  /**
   * Returns a tab given its index in the tabs list
   * @method getTabByIndex
   * @param {Number} index
   * @return {Object} the tab in the form of an object with {id,tab,content}
   */
  getTabByIndex(index: number) {
    return this.tabs_by_index[index];
  };

  /**
   * Returns how many tabs there is
   * @method getNumOfTabs
   * @return {number} number of tabs
   */
  getNumOfTabs() {
    return Object.keys(this.tabs).length
  };

  /**
   * Returns the content HTML element of a tab
   * @method getTabContent
   * @param {String} id
   * @return {HTMLEntity} content
   */
  getTabContent(id: string) {
    const tab = this.tabs[id];
    if (tab) {
      return tab.content;
    }
  };


  /**
   * Returns the index of a tab (the position in the tabs list)
   * @method getTabIndex
   * @param {String} id
   * @return {number} index
   */
  getTabIndex(id: string) {
    const tab = this.tabs[id];
    if (!tab) return -1;
    for (var i = 0; i < this.list.childNodes.length; i++) if (this.list.childNodes[i] == tab.tab) return i;
    return -1;
  };


  /**
 * Create a new tab, where id is a unique identifier
 * @method addTab
 * @param {String} id could be null then a random id is generated
 * @param {Object} options {
 *	title: tab text,
 *	callback: called when selected,
 *	callback_leave: callback when leaving,
 *   callback_context: on right click on tab
 *   callback_canopen: used to block if this tab can be opened or not (if it returns true then yes)
 *	content: HTML content,
 *   closable: if it can be closed (callback is onclose),
 *	tab_width: size of the tab,
 *	tab_className: classes for the tab element,
 *	id: content id,
 *	size: full means all,
 *	mode: "vertical" or "horizontal",
 *	button: if it is a button tab, not a selectable tab
 *	}
 * @param {bool} skip_event prevent dispatching events
 * @return {Object} an object containing { id, tab, content }
 */
  addTab(id: string, options: any, skip_event?: any) {
    options = options || {};
    if (typeof options == "function") options = { callback: options };

    var that = this;
    if (id === undefined || id === null) id = "rand_" + ((Math.random() * 1000000) | 0);

    //the tab element
    var element = document.createElement("LI");
    var safe_id = id.replace(/ /gi, "_");
    element.className = "wtab wtab-" + safe_id + " ";
    //if(options.selected) element.className += " selected";
    element.dataset["id"] = id;
    element.innerHTML = "<span class='tabtitle'>" + (options.title || id) + "</span>";

    if (options.button) element.className += "button ";
    if (options.tab_className) element.className += options.tab_className;
    if (options.bigicon)
      element.innerHTML = "<img class='tabbigicon' src='" + options.bigicon + "'/>" + element.innerHTML;
    if (options.closable) {
      element.innerHTML += "<span class='tabclose'>Close</span>";
      element.querySelector("span.tabclose")!.addEventListener(
        "click",
        function (e) {
          that.removeTab(id);
          e.preventDefault();
          e.stopPropagation();
        },
        true
      );
    }
    //WARNING: do not modify element.innerHTML or events will be lost

    if (options.index !== undefined) {
      var after = this.list.childNodes[options.index];
      if (after) this.list.insertBefore(element, after);
      else this.list.appendChild(element);
    } else if (this.plus_tab) this.list.insertBefore(element, this.plus_tab);
    else this.list.appendChild(element);

    if (options.tab_width) {
      element.style.width =
        options.tab_width.constructor === Number ? options.tab_width.toFixed(0) + "px" : options.tab_width;
      element.style.minWidth = "0";
    }

    if (this.options.autoswitch) {
      element.classList.add("autoswitch");
      element.addEventListener("dragenter", function (e) {
        //console.log("Enter",this.dataset["id"]);
        if (that._timeout_mouseover) clearTimeout(that._timeout_mouseover);
        that._timeout_mouseover = setTimeout(
          function () {
            LiteGUI.trigger(element, "click");
            that._timeout_mouseover = null;
          }.bind(this),
          500
        );
      });

      element.addEventListener("dragleave", function (e) {
        //console.log("Leave",this.dataset["id"]);
        if (that._timeout_mouseover) {
          clearTimeout(that._timeout_mouseover);
          that._timeout_mouseover = null;
        }
      });
    }

    //the content of the tab
    var content = document.createElement("div");
    if (options.id) content.id = options.id;

    content.className = "wtabcontent " + "wtabcontent-" + safe_id + " " + (options.className || "");
    content.dataset["id"] = id;
    content.style.display = "none";

    //adapt height
    if (this.mode == "horizontal") {
      if (options.size) {
        content.style.overflow = "auto";
        if (options.size == "full") {
          content.style.width = "100%";
          content.style.height = "calc( 100% - " + LiteGUI.Tabs.tabs_height + "px )"; //minus title
          content.style.height = "-moz-calc( 100% - " + LiteGUI.Tabs.tabs_height + "px )"; //minus title
          content.style.height = "-webkit-calc( 100% - " + LiteGUI.Tabs.tabs_height + "px )"; //minus title
          //content.style.height = "-webkit-calc( 90% )"; //minus title
        } else content.style.height = options.size;
      }
    } else if (this.mode == "vertical") {
      if (options.size) {
        content.style.overflow = "auto";
        if (options.size == "full") {
          content.style.height = "100%";
          content.style.width = "calc( 100% - " + LiteGUI.Tabs.tabs_width + "px )"; //minus title
          content.style.width = "-moz-calc( 100% - " + LiteGUI.Tabs.tabs_width + "px )"; //minus title
          content.style.width = "-webkit-calc( 100% - " + LiteGUI.Tabs.tabs_width + "px )"; //minus title
          //content.style.height = "-webkit-calc( 90% )"; //minus title
        } else content.style.width = options.size;
      }
    }

    //overwrite
    if (options.width !== undefined)
      content.style.width = typeof options.width === "string" ? options.width : options.width + "px";
    if (options.height !== undefined)
      content.style.height = typeof options.height === "string" ? options.height : options.height + "px";

    //add content
    if (options.content) {
      if (typeof options.content == "string") content.innerHTML = options.content;
      else content.appendChild(options.content);
    }

    this.root.appendChild(content);

    //when clicked
    if (!options.button) element.addEventListener("click", Tabs.prototype.onTabClicked);
    else
      element.addEventListener("click", function (e) {
        var tab_id = this.dataset["id"];
        if (options.callback) options.callback(tab_id, e);
      });



    var title = element.querySelector("span.tabtitle");

    //tab object
    var tab_info = new Tab()

    if (options.onclose) tab_info.onclose = options.onclose;
    this.tabs[id] = tab_info;

    this.recomputeTabsByIndex();

    //context menu
    element.addEventListener(
      "contextmenu",
      (e)  => {
        if (e.button != 2)
          //right button
          return false;
        e.preventDefault();
        if (options.callback_context) options.callback_context.call(tab_info);
        return false;
      }
    );

    if (options.selected == true || this.selected == null) this.selectTab(id, options.skip_callbacks);

    return tab_info;
  };

  /**
   * 添加一个加号标签页
   * @param callback 点击加号标签页时的回调函数
   * @returns 返回创建的加号标签页对象
   */
  addPlusTab(callback: Function) {
    // 检查是否已存在加号标签页
    if (this.plus_tab) {
      console.warn("该标签组件中已存在加号标签页");
      return;
    }

    // 创建并保存加号标签页
    this.plus_tab = this.addTab("plus_tab", {
      title: "+",
      tab_width: 20,
      button: true,
      callback: callback,
      skip_callbacks: true
    });

    return this.plus_tab;
  }


  /**
   * 添加一个按钮类型的标签页
   * @param id 标签页ID
   * @param title 标签页标题
   * @param callback 点击按钮时的回调函数
   * @returns 返回创建的标签页对象
   */
  addButtonTab(id: string, title: string, callback: Function) {
    return this.addTab(id, {
      title: title,
      tab_width: 20,
      button: true,
      callback: callback,
      skip_callbacks: true
    });
  }
  //this is tab
  onTabClicked(e: any) {
    // 如果标签页已经被选中则跳过
    if (this.root.classList.contains("selected")) return;

    // 如果标签页已被移除则跳过
    if (!this.root.parentNode) return;

    const options = (this as any).options;
    const tabs = (this.root.parentNode.parentNode as any).tabs;
    if (!tabs) throw "tabs not found";
    const that = tabs;

    // 检查标签页是否可用
    if (options.callback_canopen && options.callback_canopen() === false) return;

    const tab_id = this.root.dataset["id"];

    // 触发离开当前标签页事件
    if (that.current_tab &&
      that.current_tab[0] !== tab_id &&
      that.current_tab[2]?.callback_leave) {
      that.current_tab[2].callback_leave(
        that.current_tab[0],
        that.current_tab[1],
        that.current_tab[2]
      );
    }

    let tab_content = null;

    // 更新所有标签页状态
    for (const i in that.tabs) {
      const tab_info = that.tabs[i];
      if (i === tab_id) {
        tab_info.selected = true;
        tab_info.content.style.display = "";
        tab_content = tab_info.content;
      } else {
        delete tab_info.selected;
        tab_info.content.style.display = "none";
      }
    }

    // 更新标签页样式
    const list = this.list.querySelectorAll("li.wtab");
    list.forEach(tab => tab.classList.remove("selected"));
    this.root.classList.add("selected");

    // 更新当前标签页
    that.previous_tab = that.current_tab;
    that.current_tab = [tab_id, tab_content, options];

    // 触发回调和事件
    if (e) {
      if (options.callback) {
        options.callback(tab_id, tab_content, e);
      }

      LiteGUI.trigger(that, "wchange", [tab_id, tab_content]);
      if (that.onchange) {
        that.onchange(tab_id, tab_content);
      }
    }

    // 更新选中状态
    that.selected = tab_id;
  }

  selectTab(id: string | Tab, skip_events?: boolean) {
    // 如果没有传入id则直接返回
    if (!id) return;

    // 如果传入的是Tab对象,则获取其id
    if (typeof id !== 'string') {
      id = id.id;
    }

    // 查找对应id的tab元素并触发点击
    const tabs = Array.from(this.list.querySelectorAll("li.wtab")) as HTMLElement[];
    for (const tab of tabs) {
      if (id === tab.dataset["id"]) {
        this.onTabClicked.call(tab, !skip_events);
        break;
      }
    }
  }

  /**
   * 设置标签页的可见性
   * @param id 标签页ID
   * @param visible 是否可见
   */
  setTabVisibility(id: string, visible: boolean) {
    const tab = this.tabs[id];
    if (!tab) return;

    // 修复显示逻辑,visible为true时显示,false时隐藏
    tab.tab.style.display = visible ? null : "none";
    tab.content.style.display = visible ? null : "none";
  }



  recomputeTabsByIndex() {
    this.tabs_by_index = [];

    for (var i in this.tabs) {
      var tab = this.tabs[i];

      //compute index
      var index = 0;
      var child = tab.tab;
      while ((child = child.previousSibling) != null) index++;

      this.tabs_by_index[index] = tab;
    }
  };

  removeTab(id: string) {
    var tab = this.tabs[id];
    if (!tab) {
      console.warn("tab not found: " + id);
      return;
    }

    if (tab.onclose) tab.onclose(tab);
    if (tab.tab.parentNode) tab.tab.parentNode.removeChild(tab.tab);
    if (tab.content.parentNode) tab.content.parentNode.removeChild(tab.content);

    delete this.tabs[id];
    this.recomputeTabsByIndex();
  };

  removeAllTabs(keep_plus = false) {
    var tabs = [];
    for (var i in this.tabs) tabs.push(this.tabs[i]);

    for (var i in tabs) {
      var tab = tabs[i];
      if (tab == this.plus_tab && keep_plus) continue;
      if (tab.tab.parentNode) tab.tab.parentNode.removeChild(tab.tab);
      if (tab.content.parentNode) tab.content.parentNode.removeChild(tab.content);
      delete this.tabs[tab.id];
    }

    this.recomputeTabsByIndex();
  };

  clear() {
    this.removeAllTabs();
  };

  showTab(id: string) {
    this.setTabVisibility(id, true);
  };

  hideTab(id: string) {
    this.setTabVisibility(id, false);
  };


  /**
   * 将标签页从当前标签组转移到目标标签组
   * @param id 要转移的标签页ID
   * @param target_tabs 目标标签组
   * @param index 可选,插入的位置索引
   */
  transferTab(id: string, target_tabs: Tabs, index?: number) {
    // 获取要转移的标签页
    const tab = this.tabs[id];
    if (!tab) return;

    // 将标签页添加到目标标签组
    target_tabs.tabs[id] = tab;

    // 根据index决定插入位置
    if (index !== undefined) {
      target_tabs.list.insertBefore(tab.tab, target_tabs.list.childNodes[index]);
    } else {
      target_tabs.list.appendChild(tab.tab);
    }

    // 移动内容区域
    target_tabs.root.appendChild(tab.content);

    // 从原标签组中删除
    delete this.tabs[id];

    // 在原标签组中选择新的标签页
    const remainingTabs = Object.keys(this.tabs);
    if (remainingTabs.length > 0) {
      this.selectTab(remainingTabs[0]);
    }

    // 更新样式和选中状态
    tab.tab.classList.remove("selected");
    target_tabs.selectTab(id);
  };

  detachTab(id: string, on_complete?: Function, on_close?: Function) {
    const tab = this.tabs[id];
    if (!tab) return;

    const index = this.getTabIndex(id);
    const that = this;

    // 创建新窗口
    const w = 800;
    const h = 600;
    const tab_window = window.open(
      "",
      "",
      `width=${w}, height=${h}, location=no, status=no, menubar=no, titlebar=no, fullscreen=yes`
    );
    if (!tab_window) return;

    // 写入头部和标题
    tab_window.document.write(`<head><title>${id}</title>`);

    // 转移样式表
    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'],style"));
    for (const style of styles) {
      tab_window.document.write(style.outerHTML);
    }
    tab_window.document.write("</head><body></body>");
    tab_window.document.close();

    // 创建新的标签页组件
    const newtabs = new LiteGUI.Tabs(null, this.options);
    

    // 设置关闭事件
    tab_window.onbeforeunload = function () {
      newtabs.transferTab(id, that, index);
      if (on_close) on_close();
    };

    // 移动内容到新窗口
    newtabs.list.style.height = "20px";
    tab_window.document.body.appendChild(newtabs.root);
    this.transferTab(id, newtabs);
    newtabs.tabs[id].tab.classList.add("selected");
    this.recomputeTabsByIndex();

    if (on_complete) on_complete();

    return tab_window;
  }
}

