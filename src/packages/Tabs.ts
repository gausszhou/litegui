import { trigger } from "../core/events";
import { LiteComponent } from "../types";

class Tab {
  id: string;
  content: HTMLElement;
  title: HTMLElement;
  tab?: HTMLElement;
  options?: any;
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
    trigger(this, "click");
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
  root: HTMLElement = document.createElement("div");
  current_tab: any;
  previous_tab: any;
  plus_tab: any;
  _timeout_mouseover: any;
  list: HTMLUListElement = document.createElement("ul");
  tabs_root: any;
  tabs: any;

  static tabs_width = 64;
  static tabs_height = 26;
  tabs_by_index: any;
  selected: any;
  onchange: any;


  constructor(options: any = {}, legacy?: any) {
    // 处理旧版本的参数传递方式
    if (legacy || typeof options === "string") {
      const id = options;
      options = legacy || {};
      options.id = id;
      console.warn("LiteGUI.Tabs legacy parameter, use options as first parameter instead of id.");
    }

    this.options = options;
    this.mode = options.mode || "horizontal";

    // 创建根元素
    const root = document.createElement("div");
    if (options.id) {
      root.id = options.id;
    }
    root.className = "litetabs " + this.mode;
    this.root = root;
    

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
    list.setAttribute("role", "tablist");
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
    return this.current_tab ? this.current_tab[0] : null;
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
  addTab(id: string, options: any, _skip_event?: any) {
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
      element.addEventListener("dragenter", function (_e) {
        //console.log("Enter",this.dataset["id"]);
        if (that._timeout_mouseover) clearTimeout(that._timeout_mouseover);
        that._timeout_mouseover = setTimeout(
          function () {
            trigger(element, "click");
            that._timeout_mouseover = null;
          }.bind(this),
          500
        );
      });

      element.addEventListener("dragleave", function (_e) {
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
    content.setAttribute("role", "tabpanel");
    content.setAttribute("aria-hidden", "true");
    element.setAttribute("role", "tab");
    element.setAttribute("aria-selected", "false");
    element.tabIndex = -1;

    //adapt height
    if (this.mode == "horizontal") {
      if (options.size) {
        content.style.overflow = "auto";
        if (options.size == "full") {
          content.style.width = "100%";
          content.style.height = "calc( 100% - " + Tabs.tabs_height + "px )"; //minus title
          content.style.height = "-moz-calc( 100% - " + Tabs.tabs_height + "px )"; //minus title
          content.style.height = "-webkit-calc( 100% - " + Tabs.tabs_height + "px )"; //minus title
          //content.style.height = "-webkit-calc( 90% )"; //minus title
        } else content.style.height = options.size;
      }
    } else if (this.mode == "vertical") {
      if (options.size) {
        content.style.overflow = "auto";
        if (options.size == "full") {
          content.style.height = "100%";
          content.style.width = "calc( 100% - " + Tabs.tabs_width + "px )"; //minus title
          content.style.width = "-moz-calc( 100% - " + Tabs.tabs_width + "px )"; //minus title
          content.style.width = "-webkit-calc( 100% - " + Tabs.tabs_width + "px )"; //minus title
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
    if (!options.button) {
      element.addEventListener("click", () => {
        this.onTabClicked(element);
      });
    } 
    else
      element.addEventListener("click", function (e) {
        var tab_id = this.dataset["id"];
        if (options.callback) options.callback(tab_id, e);
      });



    const titleElement = element.querySelector<HTMLElement>("span.tabtitle");

    //tab object
    const tab_info = new Tab();
    tab_info.id = id;
    tab_info.tab = element;
    tab_info.content = content;
    tab_info.title = titleElement || tab_info.title;
    tab_info.options = options;

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

  /**
   * 激活一个标签页。
   * @param element 标签页的 li 元素
   * @param emit 是否触发回调与事件
   */
  onTabClicked(element: HTMLElement, emit: boolean = true) {
    const tabId = element.dataset["id"];
    if (!tabId) return;

    const tab = this.tabs[tabId];
    if (!tab) return;

    const options = tab.options || {};
    if (options.callback_canopen && options.callback_canopen() === false) return;

    if (this.current_tab && this.current_tab[0] !== tabId && this.current_tab[2]?.callback_leave) {
      this.current_tab[2].callback_leave(
        this.current_tab[0],
        this.current_tab[1],
        this.current_tab[2]
      );
    }

    for (const id in this.tabs) {
      const info = this.tabs[id];
      if (id === tabId) {
        info.selected = true;
        info.content.style.display = "";
        info.content.setAttribute("aria-hidden", "false");
      } else {
        delete info.selected;
        info.content.style.display = "none";
        info.content.setAttribute("aria-hidden", "true");
      }
    }

    this.list.querySelectorAll<HTMLElement>("li.wtab").forEach((tabElement) => {
      const selected = tabElement === element;
      tabElement.classList.toggle("selected", selected);
      tabElement.setAttribute("aria-selected", selected ? "true" : "false");
      tabElement.tabIndex = selected ? 0 : -1;
    });

    this.previous_tab = this.current_tab;
    this.current_tab = [tabId, tab.content, options];
    this.selected = tabId;

    if (!emit) return;

    if (options.callback) {
      options.callback(tabId, tab.content, element);
    }
    trigger(this, "wchange", [tabId, tab.content]);
    if (this.onchange) {
      this.onchange(tabId, tab.content);
    }
  }

  selectTab(id: string | Tab, skip_events: boolean = false) {
    if (!id) return;
    if (typeof id !== "string") id = id.id;

    const tab = this.tabs[id];
    if (!tab || !tab.tab) return;

    this.onTabClicked(tab.tab, !skip_events);
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



  /**
   * 重新计算标签页的索引顺序
   * 根据标签页在DOM中的实际位置更新tabs_by_index数组
   */
  recomputeTabsByIndex() {
    // 清空原有索引数组
    this.tabs_by_index = [];

    // 获取所有标签页元素
    const tabElements = Array.from(this.list.children);

    // 遍历所有标签页元素
    tabElements.forEach((tabElement, index) => {
      const tabId = tabElement.getAttribute('data-id');
      if (tabId && this.tabs[tabId]) {
        // 将标签页对象按DOM中的顺序存入索引数组
        this.tabs_by_index[index] = this.tabs[tabId];
      }
    });
  }

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
}

