import { remove as removeElement } from "@gausszhou/litegui-core";
import { getRoot } from "@gausszhou/litegui-core";
import { Panel } from "./Panel";

const MENU_CLASS_NAME = "lite-menu";
const MENU_LIST_CLASS_NAME = "lite-menu-list";
const MENU_ITEM_CLASS_NAME = "lite-menu-item";
const MENU_PANEL_CLASS_NAME = "lite-menu-panel";
const MENU_PANEL_ITEM_CLASS_NAME = "lite-menu-panel-item";

interface MenuOptions {
  auto_open?: boolean;
  sort_entries?: boolean;
  /** 菜单面板挂载的容器，默认 getRoot()；嵌入页面时传自己的容器即可 */
  container?: HTMLElement;
}

interface MenuSeparator {
  name?: string;
  data?: any;
  order: number;
  separator: true;
  children?: []
}

class MenuItem {
  name: string; // 菜单项的名称，展示文字
  data: any;
  separator: false;
  element: HTMLElement | null;
  parent: MenuItem | null;
  children: (MenuItem | MenuSeparator)[]; // 子菜单，由菜单项和分割线组成

  constructor(name: string, parent: MenuItem | null = null, data: any = null) {
    this.name = name;
    this.parent = parent;
    this.children = [];
    this.data = data;
    this.separator = false;
    this.element = null;

  }

  // 禁用菜单项
  disable(): void {
    if (this.data) {
      this.data.disabled = true;
    }
  }

  // 启用菜单项
  enable(): void {
    if (this.data) {
      this.data.disabled = false;
    }
  }

  // 创建新的菜单项
  static create(name: string, parent: MenuItem | null, data: any = null): MenuItem {
    return new MenuItem(name, parent, data);
  }
}

/**
 * Menu
 * @param {*} id
 * @param {*} options
 */

export class Menu {
  root: HTMLDivElement;
  menus: MenuItem[];
  panels: HTMLDivElement[];
  content: HTMLUListElement;
  is_open: boolean = false;
  auto_open: boolean = false;
  sort_entries: boolean = false;
  closing_by_leave: any = null; // Timer
  static closing_time = 500;
  container?: HTMLElement;

  currentMainMenuItem: MenuItem | null = null;

  constructor(id: string, options: MenuOptions = {}) {
    options = options || {};
    this.menus = [];
    this.panels = [];

    this.root = document.createElement("div");
    this.root.className = MENU_CLASS_NAME;
    this.root.id = id;

    this.content = document.createElement("ul");
    this.content.className = MENU_LIST_CLASS_NAME;
    this.content.setAttribute("role", "menubar");
    this.root.appendChild(this.content);

    this.is_open = false;
    this.auto_open = options.auto_open || false;
    this.sort_entries = options.sort_entries || false;
    this.container = options.container;
  }

  /**
   * 添加一个路径到目录中
   * @param path example: "a/b/c"
   * @param data 
   */
  add(path: string, data: any = {}) {
    const prev_length = this.menus.length;
    const tokens = path.split("/");
    // 检查菜单深度
    if (tokens.length > 5) {
      throw new Error("Menu too deep");
    }
    let currentDepth = 0;
    let lastMenuItem: MenuItem | null = null;
    let menu: (MenuItem | MenuSeparator)[] = this.menus;

    // 遍历路径
    while (currentDepth < tokens.length) {
      // 检查是否已经存在同名的菜单项
      const existingMenuItem = menu.find(item => item.name === tokens[currentDepth]);
      if (existingMenuItem) {
        // 如果已经存在同名的菜单项，将其作为当前菜单
        lastMenuItem = existingMenuItem as MenuItem;
        currentDepth++;
        menu = lastMenuItem.children;
      } else {
        // 如果没有同名的菜单项，创建一个新的菜单项（仅末级节点挂载 data）
        const isLastToken = currentDepth === tokens.length - 1;
        const newMenuItem = MenuItem.create(tokens[currentDepth], lastMenuItem, isLastToken ? data : null);
        menu.push(newMenuItem);
        lastMenuItem = newMenuItem;
        currentDepth++;
        menu = lastMenuItem.children;
      }
    }

    // 如果菜单结构发生变化,更新主菜单
    if (prev_length !== this.menus.length) {
      this.updateMainMenu();
    }
  }

  remove(path: string) {
    const menu = this.findMenu(path) as MenuItem;
    if (!menu) return false;
    if (!menu.parent || !menu.parent.children) {
      return console.warn("menu without parent?");
    }
    var index = menu.parent.children.indexOf(menu);
    if (index != -1) menu.parent.children.splice(index, 1);
  }


  /**
   * 插入一个分隔符
   * @param path
   * @param order
   */
  separator(path: string, order: number) {
    const menu = this.findMenu(path);
    if (!menu) return false;;
    (menu.children as MenuSeparator[])?.push({
      separator: true,
      order: order || 10
    });
    return true;
  }

  // 根据路径查找对应的菜单项
  findMenu(path: string): MenuItem | MenuSeparator | null {
    const tokens = path.split("/");
    let currentToken = 0;
    let menu: (MenuItem | MenuSeparator)[] = this.menus;

    // 递归查找菜单项
    while (currentToken < tokens.length && menu.length > 0) {
      // 在当前层级查找匹配的菜单项
      const matchedItem = menu.find(item => item.name === tokens[currentToken]);

      if (!matchedItem) {
        return null;
      }

      // 找到最后一个token,返回匹配项
      if (currentToken === tokens.length - 1) {
        return matchedItem;
      }

      // 继续查找下一层
      menu = matchedItem.children || [];
      currentToken++;
    }

    return null;
  }


  clear() {
    this.content.innerHTML = "";
    this.menus = [];
    this.panels = [];
  };

  createMainMenuItemElement(item: MenuItem) {
    const $item = document.createElement("li");
    $item.className = MENU_ITEM_CLASS_NAME;
    $item.setAttribute("role", "menuitem");
    $item.setAttribute("aria-haspopup", "true");

    const icon = document.createElement("span");
    icon.className = "icon";
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = item.name;
    $item.append(icon, name);
    /* ON CLICK TOP MAIN MENU ITEM */
    $item.addEventListener("click", (e) => {
      const main_menu_item = item;
      if (main_menu_item.data && main_menu_item.data.callback && typeof main_menu_item.data.callback == "function") {
        main_menu_item.data.callback(main_menu_item.data);
      }
      if (!this.is_open) {
        this.is_open = true;
        this.currentMainMenuItem = main_menu_item;
        this.showMenuPanel(main_menu_item, e, $item);
      } else {
        this.is_open = false;
        this.hideMenuPanel();
      }
    });

    $item.addEventListener("mouseenter", (_e) => {
      if (this.is_open  && this.currentMainMenuItem !== item) {
        this.hideMenuPanel();
        this.currentMainMenuItem = item;
        this.showMenuPanel(item, _e, $item);
      }
    });
    return $item;
  };

  createPanelItemElement(_item: MenuItem) {
    const $item = document.createElement("p");
    return $item;
  }
  
  // update top main menu
  updateMainMenu() {
    this.content.innerHTML = "";
    this.menus.forEach((item) => {
      const $item = this.createMainMenuItemElement(item);
      item.element = $item;
      this.content.appendChild($item);
    });
  };

  /**
   * 
   * @param menu 
   * @param e 
   * @param root 
   * @param is_submenu 
   * @returns 
   */
  showMenuPanel(menu: MenuItem, _e: Event, root: HTMLElement, is_submenu: boolean = false, level: number = 1) {
    // if not a submenu close current menu panel 如果不是子菜单，则关闭当前的菜单面板
    if (!is_submenu) {
      this.hideMenuPanel();
    } else {
      // 打开下一级子菜单时，先关闭同层及更深的旧面板，避免多个子菜单叠在一起
      this.closePanelsFromLevel(level);
    }
    if (!menu.children || !menu.children.length) {
      return false;
    }
    if (this.closing_by_leave) {
      clearInterval(this.closing_by_leave);
    }
    const $menu_panel = document.createElement("div");
    $menu_panel.className = MENU_PANEL_CLASS_NAME;
    $menu_panel.setAttribute("role", "menu");
    $menu_panel.dataset.level = String(level);

    const sorted_entries = Array.from(menu.children);

    if (this.sort_entries) {
      // 按照 order 排个序
      sorted_entries.sort((a, b) => {
        let a_order = 10;
        let b_order = 10;
        if (a && a.data && a.data.order != null) a_order = a.data.order;
        if (a && a.separator && a.order != null) a_order = a.order;
        if (b && b.data && b.data.order != null) b_order = b.data.order;
        if (b && b.separator && b.order != null) b_order = b.order;
        return a_order - b_order;
      });
    }
    // Build Menu HTML ELement
    for (var i in sorted_entries) {
      const $menu_item = document.createElement("p");
      const menu_item = sorted_entries[i];
      $menu_item.className = MENU_PANEL_ITEM_CLASS_NAME;
      $menu_item.setAttribute("role", "menuitem");
      const has_submenu = menu_item.children?.length;
      if (has_submenu) {
        $menu_item.classList.add("has_submenu");
      }
      if (menu_item.name) {
        // is a menu item
        const icon = document.createElement("span");
        icon.className = "icon";
        const name = document.createElement("span");
        name.className = "name";
        name.textContent = menu_item.name;
        $menu_item.append(icon, name);
        if (has_submenu) {
          const more = document.createElement("span");
          more.className = "more";
          more.textContent = "+";
          $menu_item.appendChild(more);
        }
      } else {
        // is a menu separator
        $menu_item.classList.add("separator");
        $menu_item.setAttribute("role", "separator");
      }
      //check if it has to show the item being 'checked'
      if (menu_item.data) {
        var data = menu_item.data
        var checked =
          (data.type == "checkbox" && data.instance && data.property && data.instance[data.property] == true) ||
          data.checkbox == true ||
          (data.instance &&
            data.property &&
            Object.prototype.hasOwnProperty.call(data, "value") &&
            data.instance[data.property] == data.value) ||
          (typeof data.isChecked == "function" && data.isChecked.call(data.instance, data));

        if (checked) $menu_item.className += " checked";
        if (data.disabled) $menu_item.className += " disabled";
      }

      /* ON CLICK SUBMENU ITEM */
      $menu_item.addEventListener("click", (e) => {
        const data = menu_item.data;
        if (data) {
          if (data.disabled) return;

          //to change variables directly
          if (data.instance && data.property) {
            if (data.type == "checkbox") {
              data.instance[data.property] = !data.instance[data.property];
              if (data.instance[data.property]) $menu_item.classList.add("checked");
              else $menu_item.classList.remove("checked");
            } else if (Object.prototype.hasOwnProperty.call(data, "value")) {
              data.instance[data.property] = data.value;
            }
          }

          //to have a checkbox behaviour
          if (data.checkbox != null) {
            data.checkbox = !data.checkbox;
            if (data.checkbox) $menu_item.classList.add("checked");
            else $menu_item.classList.remove("checked");
          }

          //execute a function
          if (data.callback && typeof data.callback == "function") data.callback(data);
        }

        // more menus
        if (menu_item.children && menu_item.children.length) {
          this.showMenuPanel(menu_item as MenuItem, e, $menu_item, true, level + 1);
        } else {
          this.is_open = false;
          this.hideMenuPanel();
        }
      });

      $menu_item.addEventListener("mouseenter", function (_e) {

      });
      // append menu element
      $menu_panel.appendChild($menu_item);
    }
    // Event
    // 鼠标离开，再一段时间后关闭菜单面板
    // $menu_panel.addEventListener("mouseleave", () => {
    //   if (this.closing_by_leave) {
    //     clearInterval(this.closing_by_leave);
    //   }
    //   this.closing_by_leave = setTimeout(() => {
    //     this.is_open = false;
    //     this.hideMenuPanel();
    //   }, LiteGUI.Menu.closing_time);
    // });
    // 鼠标进入
    $menu_panel.addEventListener("mouseenter", () => {
      if (this.closing_by_leave) {
        clearInterval(this.closing_by_leave);
      }
      this.closing_by_leave = null;
    });

    // 先挂载再测量：子菜单要按父项的实际位置和面板的实际尺寸对齐
    $menu_panel.style.visibility = "hidden";
    this.panels.push($menu_panel);
    (this.container || getRoot()).appendChild($menu_panel);

    this.positionPanel($menu_panel, root, is_submenu);
    $menu_panel.style.visibility = "";
    return true;
  };

  /**
   * 计算菜单面板位置。
   * 主菜单面板挂在菜单项下方；子菜单与父项顶部对齐、贴着父面板右缘展开，
   * 右侧或底部空间不足时翻到反方向，保证不超出视口。
   */
  positionPanel($menu_panel: HTMLDivElement, root: HTMLElement, is_submenu: boolean) {
    const anchor = root.getBoundingClientRect();
    const box = $menu_panel.getBoundingClientRect();
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = document.documentElement.clientHeight || window.innerHeight;

    let left: number;
    let top: number;
    if (is_submenu) {
      left = anchor.right - 1;
      top = anchor.top;
      // 右侧空间不足：翻到父项左侧
      if (left + box.width > vw) left = anchor.left - box.width + 1;
      // 底部空间不足：向上收，保持子菜单完整可见
      if (top + box.height > vh) top = vh - box.height - 4;
    } else {
      left = anchor.left;
      top = anchor.bottom + 2;
      if (left + box.width > vw) left = vw - box.width - 4;
      // 底部空间不足：翻到菜单项上方
      if (top + box.height > vh) top = anchor.top - box.height - 2;
    }

    left = Math.max(4, Math.min(left, vw - box.width - 4));
    top = Math.max(4, Math.min(top, vh - box.height - 4));

    $menu_panel.style.left = `${Math.round(left)}px`;
    $menu_panel.style.top = `${Math.round(top)}px`;
  };

  /** 关闭指定层级及更深的所有菜单面板 */
  closePanelsFromLevel(level: number) {
    const kept: HTMLDivElement[] = [];
    for (const panel of this.panels) {
      if (Number(panel.dataset.level ?? 1) >= level) {
        removeElement(panel);
      } else {
        kept.push(panel);
      }
    }
    this.panels = kept;
  };

  hideMenuPanel() {
    if (!this.panels.length) return false;
    for (var i in this.panels) {
      removeElement(this.panels[i]);
    }
    this.panels = [];
    return true;
  };

  attachToPanel(panel: Panel) {
    panel.content.insertBefore(this.root, panel.content.firstChild);
  };
}
