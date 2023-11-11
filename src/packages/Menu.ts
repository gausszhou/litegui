import LiteGUI from ".";
import Panel from "./Panel";

const MENU_CLASS_NAME = "lite-menu";
const MENU_PANEL_CLASS_NAME = "lite-menu-panel";
const MENU_ITEM_CLASS_NAME = "lite-menu-entry";

interface MenuOptions {
  auto_open?: boolean;
  sort_entries?: boolean;
}

interface MenuSeparator {
  name?: string;
  data?: any;
  order: number;
  separator: true;
  children?: []
}

interface MenuItem {
  name: string; // 菜单项的名称，展示文字
  data: any;
  order: number;
  separator: false;
  element: HTMLElement;
  parent: MenuItem;
  children?: (MenuItem | MenuSeparator)[] // 子菜单，由菜单项和分割线组成
}

/**
 * Menu
 * @param {*} id
 * @param {*} options
 */

class Menu {
  menu: MenuItem[];
  panels: HTMLDivElement[];
  root: HTMLDivElement;
  content: HTMLUListElement;
  is_open: boolean = false;
  auto_open: boolean = false;
  sort_entries: boolean = false;
  closing_by_leave: any = null; // Timer
  static closing_time = 500;

  constructor(id: string, options: MenuOptions = {}) {
    options = options || {};
    this.menu= [];
    this.panels = [];

    this.root = document.createElement("div");
    this.root.id = id;
    this.root.className = MENU_CLASS_NAME;

    this.content = document.createElement("ul");
    this.root.appendChild(this.content);

    this.is_open = false;
    this.auto_open = options.auto_open || false;
    this.sort_entries = options.sort_entries || false;
  }


  /**
   * 添加一个路径到目录中
   * @param path example: "a/b/c"
   * @param data 
   */
  add(path: string, data: any = {}) {

    if (typeof data == "function") data = { callback: data };

    var prev_length = this.menu.length;

    var tokens = path.split("/");
    var current_token = 0; // 目录的最大深度
    var current_pos = 0;
    var menu: (MenuItem| MenuSeparator)[] = this.menu;
    var last_item = null; // null => a => b => c

    while (menu) {
      if (current_token > 5) throw "Error: Menu too deep";
      // token not found in this menu, create it
      if (menu.length == current_pos) {
        const v: any = { name: tokens[current_token], parent: last_item, children: [], data: null };
        last_item = v;
        if (current_token == tokens.length - 1) {
          v.data = data;
        }

        v.disable = function () {
          if (this.data) this.data.disabled = true;
        };
        v.enable = function () {
          if (this.data) this.data.disabled = false;
        };

        menu.push(v);
        // 递进
        current_token += 1;
        if (current_token == tokens.length) {
          // 归
          break;
        }
        // 递
        menu = v.children;
        current_pos = 0;
        continue;
      }

      // token found in this menu, get inside for next token
      if (menu[current_pos]?.name === tokens[current_token]) {
        // 找到了
        if (current_token < tokens.length - 1) {
          // 不是最后一层
          last_item = menu[current_pos];
          menu = menu[current_pos]?.children || [];
          current_pos = 0;
          current_token++;
          continue;
        } else {
          // 最后一层
          // last token but like File/ enable repeat
          if (menu[current_pos]?.name !== "") {
            console.warn("Warning: Adding menu that already exists: " + path);
            break;
          }
        }
      }
      // 遍历
      current_pos++;
    }

    if (prev_length != this.menu.length) {
      this.updateMainMenu();
    }
  };

  remove(path: string) {
    const menu = this.findMenu(path) as MenuItem;
    if (!menu) return false;
    if (!menu.parent || !menu.parent.children) {
      return console.warn("menu without parent?");
    }

    var index = menu.parent.children.indexOf(menu);
    if (index != -1) menu.parent.children.splice(index, 1);
  }


  separator(path: string, order: number) {
    const menu = this.findMenu(path);
    if (!menu) return false;;
    (menu.children as MenuSeparator[])?.push({ 
      separator: true, 
      order: order || 10 
    });
    return true;
  }

  //returns the menu entry that matches this path
  findMenu(path: string): MenuItem | MenuSeparator  | null | undefined {
    var tokens = path.split("/");
    var current_token = 0;
    var current_pos = 0;
    var menu: (MenuItem | MenuSeparator)[] = this.menu;

    while (menu) {
      //no more tokens, return last found menu
      if (current_token == tokens.length) return menu[current_pos];
      
      //this menu doesnt have more entries
      if (menu.length <= current_pos) return null;
      
      if (tokens[current_token] == "*") return menu[current_pos];

      //token found in this menu, get inside for next token
      if (tokens[current_token] == menu[current_pos].name) {
        if (current_token == tokens.length - 1) {
          //last token
          return menu[current_pos];
        } else {
          menu = menu[current_pos].children || [];
          current_pos = 0;
          current_token++;
          continue;
        }
      }

      //check next entry in this menu
      current_pos++;
    }
    return null;
  };


  clear() {
    this.content.innerHTML = "";
    this.menu = [];
    this.panels = [];
  };

  // update top main menu
  updateMainMenu() {
    this.content.innerHTML = "";
    for (var i in this.menu) {
      const $main_menu_item = document.createElement("li");
      $main_menu_item.innerHTML = "<span class='icon'></span><span class='name'>" + this.menu[i].name + "</span>";
      this.content.appendChild($main_menu_item);

      this.menu[i].element = $main_menu_item;

      /* ON CLICK TOP MAIN MENU ITEM */
      $main_menu_item.addEventListener("click", (e) => {
        const main_menu_item = this.menu[i];

        if (main_menu_item.data && main_menu_item.data.callback && typeof main_menu_item.data.callback == "function") main_menu_item.data.callback(main_menu_item.data);
        if (!this.is_open) {
          this.is_open = true;
          this.showMenuPanel(main_menu_item, e, this.content);
        } else {
          this.is_open = false;
          this.hideMenuPanel();
        }
      });

      $main_menu_item.addEventListener("mouseover", (e) => {
        this.hideMenuPanel();
        if (this.is_open || this.auto_open) {
          this.showMenuPanel(this.menu[i].data, e, this.content);
        }
      });
    }
  };

  // Create the panel with the drop menu 创建下拉菜单面板
  showMenuPanel(menu: MenuItem, e: Event, root: HTMLElement, is_submenu: boolean = false) {
    // if not a submenu close current menu panel 如果不是子菜单，则关闭当前的菜单面板
    if (!is_submenu) {
      this.hideMenuPanel();
    }
    if (!menu.children || !menu.children.length) {
      return false;
    }
    if (this.closing_by_leave) {
      clearInterval(this.closing_by_leave);
    }
    const $menu_panel = document.createElement("div");
    $menu_panel.className = MENU_PANEL_CLASS_NAME;

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
      $menu_item.className = MENU_ITEM_CLASS_NAME;
      const has_submenu = menu_item.children?.length;

      if (has_submenu) {
        $menu_item.classList.add("has_submenu");
      }

      if (menu_item.name) {
        // is a menu item
        $menu_item.innerHTML =
          "<span class='icon'></span><span class='name'>" +
          menu_item.name +
          (has_submenu ? "<span class='more'>+</span>" : "") +
          "</span>";
      } else {
        // is a menu separator
        $menu_item.classList.add("separator");
      }
      //check if it has to show the item being 'checked'
      if (menu_item.data) {
        var data = menu_item.data
        var checked =
          (data.type == "checkbox" && data.instance && data.property && data.instance[data.property] == true) ||
          data.checkbox == true ||
          (data.instance &&
            data.property &&
            data.hasOwnProperty("value") &&
            data.instance[data.property] == data.value) ||
          (typeof data.isChecked == "function" && data.isChecked.call(data.instance, data));

        if (checked) $menu_item.className += " checked";

        if (data.disabled) $menu_item.className += " disabled";
      }

      /* ON CLICK SUBMENU ITEM */
      $menu_item.addEventListener("click", () => {
        const item = menu_item.data;
        if (item.data) {
          if (item.data.disabled) return;

          //to change variables directly
          if (item.data.instance && item.data.property) {
            if (item.data.type == "checkbox") {
              item.data.instance[item.data.property] = !item.data.instance[item.data.property];
              if (item.data.instance[item.data.property]) $menu_item.classList.add("checked");
              else $menu_item.classList.remove("checked");
            } else if (item.data.hasOwnProperty("value")) {
              item.data.instance[item.data.property] = item.data.value;
            }
          }

          //to have a checkbox behaviour
          if (item.data.checkbox != null) {
            item.data.checkbox = !item.data.checkbox;
            if (item.data.checkbox) $menu_item.classList.add("checked");
            else $menu_item.classList.remove("checked");
          }

          //execute a function
          if (item.data.callback && typeof item.data.callback == "function") item.data.callback(item.data);
        }

        // more menus
        if (item.children && item.children.length) {
          this.showMenuPanel(item, e, root, true);
        } else {
          this.is_open = false;
          this.hideMenuPanel();
        }
      });

      $menu_item.addEventListener("mouseenter", function (e) {
        // TODO
        /*
        if( that.auto_open && this.classList.contains("has_submenu") )
          LiteGUI.trigger( this, "click" );
        */
      });
      // append menu element
      $menu_panel.appendChild($menu_item);
    }
    // Event
    // 鼠标离开，再一段时间后关闭菜单面板
    $menu_panel.addEventListener("mouseleave", (e) => {
      if (this.closing_by_leave) {
        clearInterval(this.closing_by_leave);
      }
      this.closing_by_leave = setTimeout(() => {
        this.is_open = false;
        this.hideMenuPanel();
      }, LiteGUI.Menu.closing_time);
    });
    // 鼠标进入
    $menu_panel.addEventListener("mouseenter", (e) => {
      if (this.closing_by_leave) {
        clearInterval(this.closing_by_leave);
      }
      this.closing_by_leave = null;
    });

    // compute X and Y for menu
    const box = root.getBoundingClientRect();
    $menu_panel.style.left = box.left + (is_submenu ? 200 : 0) + "px";
    $menu_panel.style.top = box.top + box.height + (is_submenu ? -20 : 10) + "px";

    // TODO animation, not working well, flickers
    /* 
    element.style.opacity = "0.1";
    element.style.transform = "translate(0,-10px)";
    element.style.transition = "all 0.2s";
    setTimeout( function(){ 
      element.style.opacity = "1"; 
      element.style.transform = "translate(0,0)";
    },1);
    */

    this.panels.push($menu_panel);
    document.body.appendChild($menu_panel);
    return true;
  };

  hideMenuPanel() {
    if (!this.panels.length) return false;
    for (var i in this.panels) {
      LiteGUI.remove(this.panels[i]);
    }
    this.panels = [];
    return true;
  };

  attachToPanel(panel: Panel) {
    panel.content.insertBefore(this.root, panel.content.firstChild);
  };
}







export default Menu;
