import type { LiteComponent } from "../types/index";
import { type ButtonOptions, Button } from "./Button";
import EventMitter from "./EventMitter";
import LiteGUI from "./index";

interface ButtonsItemOptions extends ButtonOptions {
  name: string;
  close?: boolean;
}

interface DialogOptions {
  fullscreen?: boolean;
  fullcontent?: boolean;
  minimize?: boolean;
  hide?: boolean;
  detachable?: boolean;
  /** 兼容旧写法：close 与 closable 等价 */
  close?: boolean;
  closable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  scroll?: boolean;
  id?: string;
  title?: string;
  content?: string;
  className?: string;
  parent?: HTMLElement | string;
  attach?: boolean;
  buttons?: ButtonsItemOptions[];
  onClose?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
}

export class Dialog extends EventMitter implements LiteComponent {
  static INSTANCE_LIST: Dialog[] = [];
  static MINIMIZED_WIDTH: number = 200;
  static MIN_WIDTH: number = 150;
  static MIN_HEIGHT: number = 150;
  static TITLE_HEIGHT: string = "20px";
  static minimized: Dialog[] = [];
  static maximized: Dialog[] = [];


  draggable: boolean = false;
  resizable: boolean = false;
  minimized: boolean = false;
  maximized: boolean = false;
  isModal: boolean = false;
  
  top: number = 0;
  bottom: number = 0;
  old_box: any;

  on_resize: any;
  on_hide: any;
  on_show: any;
  on_minimize: any;
  on_maximize: any;
  on_detach: any;
  on_attach: any;
  on_close: any;
  on_enter: any;
  on_escape: any;
  on_keydown: any;
  on_keyup: any;

  public left: number = 0;
  public right: number = 0;
  public width: number | string = 0;
  public height: number | string = 0;

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

  constructor(options: DialogOptions | string = {}) {
    super();
    const opts: DialogOptions = typeof options === "string" ? { id: options } : options;
    this.options = opts;
    this.id = opts.id ?? "";
    this.left = 0;
    this.right = 0;
    this.width = opts.width ?? Dialog.MIN_WIDTH;
    this.height = opts.height ?? Dialog.MIN_HEIGHT;
    this.minWidth = opts.minWidth ?? Dialog.MIN_WIDTH;
    this.minHeight = opts.minHeight ?? Dialog.MIN_HEIGHT;
    this.root = this.createElementRoot();
    this.header = this.createElementHeader();
    this.buttons = this.createElementButtons();
    this.content = this.createElementContent();
    this.footer = this.createElementFooter();
    this.initDom();
    this.bindWindowButtons();
    this.enableProperties({ draggable: opts.draggable, resizable: opts.resizable });
    Dialog.INSTANCE_LIST.push(this);

    if (opts.attach || opts.parent) {
      const parent =
        typeof opts.parent === "string"
          ? document.querySelector<HTMLElement>(opts.parent)
          : opts.parent;
      (parent || LiteGUI.root || document.body).appendChild(this.root);
      this.center();
    }
  }

  createElementRoot() {
    const options = this.options;
    const element = document.createElement("div");
    element.className = "litedialog";
    if (this.id) element.id = this.id;
    if (options.className) element.className += " " + options.className;
    return element;
  }

  createElementHeader() {
    const options = this.options;
    const header = document.createElement("div");
    header.className = "panel-header";
    header.textContent = options.title || "";
    if (!options.title) header.style.display = "none";
    return header;
  }

  createElementButtons() {
    const options = this.options;
    const container = document.createElement("div");
    container.className = "buttons";

    const createMiniButton = (className: string, label: string, title: string) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `litebutton mini-button ${className}`;
      button.textContent = label;
      button.title = title;
      return button;
    };

    if (options.minimize) {
      container.appendChild(createMiniButton("minimize-button", "-", "Minimize"));
      const maximize = createMiniButton("maximize-button", "□", "Maximize");
      maximize.style.display = "none";
      container.appendChild(maximize);
    }
    if (options.hide) {
      container.appendChild(createMiniButton("hide-button", "", "Hide"));
    }
    if (options.detachable) {
      container.appendChild(createMiniButton("detach-button", "", "Detach"));
    }
    if (options.close || options.closable) {
      container.appendChild(createMiniButton("close-button", "×", "Close"));
    }

    return container;
  }

  createElementContent() {
    const options = this.options;
    const content = document.createElement("div");
    content.className = "content";
    if (options.content) content.innerHTML = options.content;
    return content;
  }

  createElementFooter() {
    const footer = document.createElement("div");
    footer.className = "panel-footer";
    return footer;
  }

  initDom() {
    this.root.appendChild(this.header);
    this.root.appendChild(this.buttons);
    this.root.appendChild(this.content);
    this.root.appendChild(this.footer);
    this.initStyle();
  }

  bindWindowButtons() {
    const close = this.root.querySelector<HTMLButtonElement>(".close-button");
    close?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    });

    const minimize = this.root.querySelector<HTMLButtonElement>(".minimize-button");
    minimize?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.minimize();
    });

    const maximize = this.root.querySelector<HTMLButtonElement>(".maximize-button");
    maximize?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.maximize();
    });

    const hide = this.root.querySelector<HTMLButtonElement>(".hide-button");
    hide?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    });
  }

  initStyle() {
    const options = this.options;
    if (options.fullscreen || options.fullcontent) {
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
    const button = new Button(name, {
      size: options.size,
      callback: () => {
        options.callback?.(button);
        if (options.close) this.close();
      }
    });
    this.footer.appendChild(button.root);
    return button;
  }

  clear() {
    if (this.content) this.content.innerHTML = "";
  }

  show() {
    if (!this.root.parentNode) {
      const parent = LiteGUI.content || LiteGUI.root || document.body;
      parent.appendChild(this.root);
      this.center();
    }
    this.root.style.display = "";
    this.emit("shown", this);
    if (this.on_show) this.on_show();
    return this;
  }

  hide() {
    this.root.style.display = "none";
    this.emit("hidden", this);
    if (this.on_hide) this.on_hide();
    return this;
  }

  close() {
    const parent = this.root.parentNode;
    parent?.removeChild(this.root);

    this.emit("closed", this);
    if (this.options.onClose) this.options.onClose();
    if (this.on_close) this.on_close();

    const instanceIndex = Dialog.INSTANCE_LIST.indexOf(this);
    if (instanceIndex !== -1) Dialog.INSTANCE_LIST.splice(instanceIndex, 1);

    const minimizedIndex = Dialog.minimized.indexOf(this);
    if (minimizedIndex !== -1) Dialog.minimized.splice(minimizedIndex, 1);
    Dialog.arrangeMinimized();

    if (this.isModal) {
      this.isModal = false;
      LiteGUI.showModalBackground(false);
    }

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

  getDialogById(id: string) {
    const dialog = Dialog.INSTANCE_LIST.find(dialog => dialog.id === id);
    if (!dialog) return null;
    return dialog;
  }

  static getDialog(id: string) {
    return Dialog.INSTANCE_LIST.find(item => item.id === id);
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

  /**
   * 启用对话框的属性设置
   * @param options 配置选项
   */
  enableProperties(options: { draggable?: boolean; resizable?: boolean } = {}) {
    const panel = this.root;

    // 设置基础样式
    panel.style.position = "absolute";
    panel.style.minWidth = `${this.minWidth}px`;
    panel.style.minHeight = `${this.minHeight}px`;
    panel.style.boxShadow = "0 0 3px black";

    // 设置宽度
    if (this.width) {
      panel.style.width = typeof this.width === "number" ? `${this.width}px` : this.width;
    }

    // 设置高度
    if (this.height) {
      if (typeof this.height === "number") {
        panel.style.height = `${this.height}px`;
        this.content.style.height = "calc(100% - 24px)";
      } else if (this.height.includes("%")) {
        panel.style.height = this.height;
        this.content.style.height = "calc(100% - 24px)";
      }
    }

    // 启用拖拽
    if (options.draggable) {
      this.draggable = true;
      const header = panel.querySelector<HTMLElement>(".panel-header");
      LiteGUI.draggable(
        panel,
        header || panel,
        () => {},
        () => !this.minimized
      );
    }

    // 启用大小调整
    if (options.resizable) {
      this.setResizable();
    }
  }


  setResizable() {
    // 如果已经可调整大小则返回
    if (this.resizable) return;

    this.resizable = true;
    const root = this.root;
    const footer = this.footer;

    // 设置页脚最小高度和添加可调整类
    footer.style.minHeight = "4px";
    footer.classList.add("resizable");

    // 创建右下角调整大小的元素
    const corner = document.createElement("div");
    corner.className = "resizable-corner";
    root.appendChild(corner);

    // 记录鼠标位置
    let mousePos = { x: 0, y: 0 };
    let isCornerDrag = false;

    const handleMouseEvents = (e: MouseEvent) => {
      switch (e.type) {
        case "mousedown":
          // 开始拖拽
          document.body.addEventListener("mousemove", handleMouseEvents);
          document.body.addEventListener("mouseup", handleMouseEvents);
          isCornerDrag = (e.target === corner);
          mousePos = { x: e.pageX, y: e.pageY };
          break;

        case "mousemove":
          // 计算新的尺寸
          const rect = root.getBoundingClientRect();
          const newWidth = rect.width - (mousePos.x - e.pageX);
          const newHeight = rect.height - (mousePos.y - e.pageY);

          // 更新尺寸
          if (isCornerDrag) {
            root.style.width = `${Math.max(this.minWidth, newWidth)}px`;
          }
          root.style.height = `${Math.max(this.minHeight, newHeight)}px`;

          // 更新内容区域高度
          this.content.style.height = "calc(100% - 24px)";

          // 更新鼠标位置
          mousePos = { x: e.pageX, y: e.pageY };

          // 触发resize事件
          if (this.on_resize && (rect.width !== newWidth || rect.height !== newHeight)) {
            this.on_resize(e, newWidth, newHeight);
          }
          break;

        case "mouseup":
          // 结束拖拽
          document.body.removeEventListener("mousemove", handleMouseEvents);
          document.body.removeEventListener("mouseup", handleMouseEvents);
          isCornerDrag = false;
          break;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    // 添加事件监听
    footer.addEventListener("mousedown", handleMouseEvents);
    corner.addEventListener("mousedown", handleMouseEvents);
  }


  /**
   * 将对话框停靠到指定的父元素
   * @param parent 父元素或选择器
   * @param dockType 停靠类型: 'full' | 'left' | 'right' | 'top' | 'bottom'
   */
  dockTo(parent: HTMLElement | string, dockType: 'full' | 'left' | 'right' | 'top' | 'bottom' = 'full') {
    if (!parent) return;
    const panel = this.root;

    // 重置基础样式
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.boxShadow = 'none';

    // 根据停靠类型设置样式
    switch (dockType) {
      case 'full':
        panel.style.position = 'relative';
        panel.style.width = '100%';
        panel.style.height = '100%';
        this.content.style.width = '100%';
        this.content.style.height = `calc(100% - ${Dialog.TITLE_HEIGHT})`;
        this.content.style.overflow = 'auto';
        break;

      case 'left':
      case 'right':
        panel.style.position = 'absolute';
        panel.style.top = '0';
        panel.style[dockType] = '0';
        panel.style.width = `${this.width}px`;
        panel.style.height = '100%';
        this.content.style.height = `calc(100% - ${Dialog.TITLE_HEIGHT})`;
        this.content.style.overflow = 'auto';

        if (dockType === 'right') {
          panel.style.left = 'auto';
          panel.style.right = '0';
        }
        break;

      case 'top':
      case 'bottom':
        panel.style.width = '100%';
        panel.style.height = `${this.height}px`;

        if (dockType === 'bottom') {
          panel.style.bottom = '0';
          panel.style.top = 'auto';
        }
        break;
    }

    // 如果启用了拖拽，重新绑定拖拽事件
    if (this.draggable) {
      LiteGUI.draggable(panel);
    }

    // 将面板添加到父元素
    if (typeof parent === 'string') {
      const parentElement = document.querySelector(parent);
      if (parentElement) {
        parentElement.appendChild(panel);
      }
    } else if ((parent as any).content) {
      (parent as any).content.appendChild(panel);
    } else {
      (parent as HTMLElement).appendChild(panel);
    }
  }



  /**
   * 高亮显示对话框
   * @param time 高亮持续时间(毫秒)，默认100ms
   */
  highlight(time: number = 100): void {
    // 设置白色轮廓
    this.root.style.outline = "1px solid white";

    // 延时清除轮廓
    setTimeout(() => {
      this.root.style.outline = "";
    }, time);
  }


  minimize() {
    // 如果已经最小化则返回
    if (this.minimized) return;

    // 设置最小化状态并保存当前位置信息
    this.minimized = true;
    this.old_box = this.root.getBoundingClientRect();

    // 隐藏内容区域
    this.content.style.display = "none";

    // 更新最小化/最大化按钮显示状态
    const minimizeButton = this.root.querySelector(".minimize-button") as HTMLElement;
    const maximizeButton = this.root.querySelector(".maximize-button") as HTMLElement;
    if (minimizeButton) minimizeButton.style.display = "none";
    if (maximizeButton) maximizeButton.style.display = "";

    // 设置最小化宽度
    this.root.style.width = `${Dialog.MINIMIZED_WIDTH}px`;

    // 添加到最小化列表并重新排列
    if (!Dialog.minimized.includes(this)) Dialog.minimized.push(this);
    Dialog.arrangeMinimized();

    // 触发最小化事件
    this.emit("minimize", this);
    if (this.on_minimize) {
      this.on_minimize();
    }
  }


  static arrangeMinimized() {
    Dialog.minimized.forEach((dialog: Dialog, index: number) => {
      const parent = dialog.root.parentElement;
      if (!parent) return;
      const pos = parent.getBoundingClientRect().height - 20;
      dialog.root.style.left = Dialog.MINIMIZED_WIDTH * index + "px";
      dialog.root.style.top = pos + "px";
    });
  }



  /**
   * 将最小化的对话框恢复到原始大小
   */
  maximize() {
    // 如果对话框未最小化则返回
    if (!this.minimized) return;
    
    // 重置最小化状态
    this.minimized = false;

    // 显示内容区域
    this.content.style.display = "";

    // 恢复原始位置和尺寸
    if (this.old_box) {
      this.root.style.left = `${this.old_box.left}px`;
      this.root.style.top = `${this.old_box.top}px`;
      this.root.style.width = `${this.old_box.width}px`;
      this.root.style.height = `${this.old_box.height}px`;
    }

    // 更新按钮显示状态
    const minimizeButton = this.root.querySelector(".minimize-button") as HTMLElement;
    const maximizeButton = this.root.querySelector(".maximize-button") as HTMLElement;
    if (minimizeButton) minimizeButton.style.display = "";
    if (maximizeButton) maximizeButton.style.display = "none";

    // 从最小化列表中移除并重新排列
    const index = Dialog.minimized.indexOf(this);
    if (index !== -1) {
      Dialog.minimized.splice(index, 1);
      Dialog.arrangeMinimized();
    }

    // 触发最大化事件
    this.emit("maximize", this);
    if (this.on_maximize) {
      this.on_maximize();
    }
  }



  /**
   * 将对话框设置为模态对话框
   */
  makeModal(): void {
    this.isModal = true;
    LiteGUI.showModalBackground(true);

    const parent = LiteGUI.modalbg_div || document.body;
    if (this.root.parentNode !== parent) parent.appendChild(this.root);

    this.show();
    this.center();
  }

  /**
   * 淡入显示对话框
   * @param time 淡入动画时长(毫秒)，默认1000ms
   */
  fadeIn(time: number = 1000): void {
    // 先显示对话框但透明度为0
    this.root.style.display = "";
    this.root.style.opacity = "0";

    // 延迟设置过渡效果和透明度，确保初始状态已应用
    requestAnimationFrame(() => {
      this.root.style.transition = `opacity ${time}ms`;
      this.root.style.opacity = "1";
    });
  }

  /**
   * 设置对话框位置
   * @param x X坐标
   * @param y Y坐标
   */
  setPosition(x: number, y: number): void {
    // 检查对话框是否在DOM中
    if (!this.root.parentNode) {
      console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM");
      return;
    }

    // 设置绝对定位和坐标
    this.root.style.position = "absolute";
    this.root.style.left = `${x}px`;
    this.root.style.top = `${y}px`;
  }


  // TODO change prop
  /**
   * 将对话框居中显示在父元素中
   */
  center(): void {
    // 如果对话框没有父元素则返回
    if (!this.root.parentNode) return;

    // 设置定位方式为绝对定位
    this.root.style.position = "absolute";

    // 获取对话框和父元素的尺寸
    const width = this.root.offsetWidth;
    const height = this.root.offsetHeight;
    const parentWidth = this.root.parentElement!.offsetWidth;
    const parentHeight = this.root.parentElement!.offsetHeight;

    // 计算居中位置并设置
    this.root.style.left = `${Math.floor((parentWidth - width) * 0.5)}px`;
    this.root.style.top = `${Math.floor((parentHeight - height) * 0.5)}px`;
  }


  /**
   * 根据内容自动调整对话框大小
   * @param margin 额外边距，默认为0
   * @param skipTimeout 是否跳过延时检查，默认为false
   */
  adjustSize(margin: number = 0, skipTimeout: boolean = false): void {
    // 设置内容高度为自动
    this.content.style.height = "auto";

    // 如果内容高度为0且未跳过延时，等待DOM更新后重试
    if (this.content.offsetHeight === 0 && !skipTimeout) {
      setTimeout(() => {
        this.adjustSize(margin, true);
      }, 1);
      return;
    }

    // 计算额外高度(页脚)
    let extraHeight = 0;
    const footer = this.root.querySelector(".panel-footer") as HTMLDivElement;
    if (footer) {
      extraHeight += footer.offsetHeight;
    }

    // 计算新的宽度和高度
    const newWidth = this.content.offsetWidth;
    const newHeight = this.content.offsetHeight + 20 + margin + extraHeight;

    // 设置对话框大小
    this.setSize(newWidth, newHeight);
  }

  reattachWindow() {
    if (!this.dialogWindow) return;

    this.root.appendChild(this.content);
    this.root.style.display = ""; //show
    this.dialogWindow.close();
    var index = LiteGUI.windows.indexOf(this.dialogWindow);
    if (index != -1) LiteGUI.windows.splice(index, 1);
    this.dialogWindow = null;
  };

}
