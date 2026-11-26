import { trigger } from "../core/events";
import { isCursorOverElement } from "../core/dom";

/**
* ContextMenu 
*
* @class ContextMenu 
* @constructor
* @param {Array} values (allows object { title: "Nice text", callback: function ... })
* @param {Object} options [optional] Some options:\
* - title: title to show on top of the menu
* - callback: function to call when an option is clicked, it receives the item information
* - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback 
* - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
*/
interface ContextMenuOptions {
    parentMenu?: ContextMenu;
    event?: MouseEvent | PointerEvent | CustomEvent;
    title?: string;
    left?: number;
    top?: number;
    callback?: Function;
    ignore_item_callbacks?: boolean;
    autoopen?: boolean;
}

export class ContextMenu {
    options: ContextMenuOptions;
    root: HTMLDivElement;
    parentMenu?: ContextMenu;
    lock: boolean = false;
    current_submenu?: ContextMenu;

    constructor(values: any[] | Record<string, any>, options: ContextMenuOptions = {}) {
        this.options = options;

        // 处理父菜单关联
        if (options.parentMenu) {
            if (!(options.parentMenu instanceof ContextMenu)) {
                console.error("parentMenu must be of class ContextMenu, ignoring it");
                options.parentMenu = undefined;
            } else {
                this.parentMenu = options.parentMenu;
                this.parentMenu.lock = true;
                this.parentMenu.current_submenu = this;
            }
        }

        // 验证事件类型
        if (options.event &&
            options.event.constructor.name !== "MouseEvent" &&
            options.event.constructor.name !== "PointerEvent" &&
            options.event.constructor.name !== "CustomEvent") {
            console.error("Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it.");
            options.event = undefined;
        }

        // 创建根元素
        const root = this.root = document.createElement("div");
        root.className = "litecontextmenu litemenubar-panel";
        root.style.minWidth = "100px";
        root.style.minHeight = "100px";
        root.style.pointerEvents = "none";

        // 延迟启用指针事件
        setTimeout(() => {
            root.style.pointerEvents = "auto";
        }, 100);

        // 阻止默认右键菜单
        root.addEventListener("mouseup", (e) => {
            e.preventDefault();
        }, true);

        root.addEventListener("contextmenu", (e) => {
            if (e.button !== 2) return;
            e.preventDefault();
        }, true);

        root.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                this.close();
                e.preventDefault();
            }
        }, true);

        // 添加标题
        if (options.title) {
            const element = document.createElement("div");
            element.className = "litemenu-title";
            element.innerHTML = options.title;
            root.appendChild(element);
        }

        // 添加菜单项
        const entries: Array<[any, any]> = Array.isArray(values)
            ? values.map((value) => [value?.title ?? value?.content ?? String(value), value])
            : Object.entries(values);
        for (const [name, value] of entries) {
            this.addItem(name, value, options);
        }

        // 处理鼠标离开事件
        root.addEventListener("mouseleave", (e) => {
            if (this.lock) return;
            if ((root as any).closing_timer) {
                clearTimeout((root as any).closing_timer);
            }
            (root as any).closing_timer = setTimeout(() => this.close(e), 500);
        });

        root.addEventListener("mouseenter", () => {
            if ((root as any).closing_timer) {
                clearTimeout((root as any).closing_timer);
            }
        });

        // 处理滚轮事件
        const onMouseWheel = (e: WheelEvent) => {
            const pos = parseInt(root.style.top || "0");
            root.style.top = `${pos + e.deltaY * 0.1}px`;
            e.preventDefault();
            return true;
        };

        root.addEventListener("wheel", onMouseWheel, true);
        root.addEventListener("mousewheel" as any, onMouseWheel, true);

        // 添加到文档
        const rootDocument = options.event ?
            (options.event.target as Node)?.ownerDocument || document :
            document;
        rootDocument.body.appendChild(root);

        // 计算位置
        this.computePosition();
    }

    private computePosition() {
        let left = this.options.left || 0;
        let top = this.options.top || 0;

        if (this.options.event) {
            if (this.options.event.constructor.name !== "MouseEvent" &&
                this.options.event.constructor.name !== "PointerEvent" &&
                this.options.event.constructor.name !== "CustomEvent") {
                console.warn("Event passed to ContextMenu is not of type MouseEvent");
                this.options.event = undefined;
            } else {
                const event = this.options.event as MouseEvent;
                left = (event.pageX - 10);
                top = (event.pageY - 10);

                if (this.options.title) {
                    top -= 20;
                }

                if (this.options.parentMenu) {
                    const rect = this.options.parentMenu.root.getBoundingClientRect();
                    left = rect.left + rect.width;
                }

                const bodyRect = document.body.getBoundingClientRect();
                const rootRect = this.root.getBoundingClientRect();

                if (left > (bodyRect.width - rootRect.width - 10)) {
                    left = (bodyRect.width - rootRect.width - 10);
                }
                if (top > (bodyRect.height - rootRect.height - 10)) {
                    top = (bodyRect.height - rootRect.height - 10);
                }
            }
        }

        this.root.style.left = `${left}px`;
        this.root.style.top = `${top}px`;
    }
    addItem(name: any, value: any, options: ContextMenuOptions = {}) {
        const that = this;

        const element = document.createElement("div");
        element.className = "litemenu-entry submenu";

        let disabled = false;

        if (value === null) {
            element.classList.add("separator");
        } else {
            element.innerHTML = value && value.title ? value.title : String(name ?? "");
            (element as any).value = value;

            if (value) {
                if (value.disabled) {
                    disabled = true;
                    element.classList.add("disabled");
                }
                if (value.submenu || value.has_submenu) {
                    element.classList.add("has_submenu");
                }
            }

            if (typeof value === "function") {
                element.dataset["value"] = String(name);
                (element as any).onclick_callback = value;
            } else {
                element.dataset["value"] = String(value);
            }
        }

        this.root.appendChild(element);
        if (!disabled) element.addEventListener("click", inner_onclick);
        if (options.autoopen) element.addEventListener("mouseenter", inner_over);

        function inner_over(this: HTMLDivElement, e: Event) {
            const item = (this as any).value;
            if (!item || !item.has_submenu) return;
            inner_onclick.call(this, e);
        }

        function inner_onclick(this: HTMLDivElement, e: Event) {
            const item = (this as any).value;
            let close_parent = true;

            if (that.current_submenu) that.current_submenu.close(e);

            if (options.callback) {
                const result = options.callback.call(that, item, options, e);
                if (result === true) close_parent = false;
            }

            if (item) {
                if (item.callback && !options.ignore_item_callbacks && item.disabled !== true) {
                    const result = item.callback.call(this, item, options, e, that);
                    if (result === true) close_parent = false;
                }
                if (item.submenu) {
                    if (!item.submenu.options) throw new Error("ContextMenu submenu needs options");
                    that.current_submenu = new ContextMenu(item.submenu.options, {
                        callback: item.submenu.callback,
                        event: e as MouseEvent,
                        parentMenu: that,
                        ignore_item_callbacks: item.submenu.ignore_item_callbacks,
                        title: item.submenu.title,
                        autoopen: options.autoopen
                    });
                    close_parent = false;
                }
            }

            if (close_parent && !that.lock) that.close();
        }

        return element;
    }

    /**
     * 关闭当前菜单及其子菜单
     * @param e 事件对象
     * @param ignore_parent_menu 是否忽略父菜单
     */
    close(e?: Event, ignore_parent_menu?: boolean): void {
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }

        if (this.parentMenu && !ignore_parent_menu) {
            this.parentMenu.lock = false;
            this.parentMenu.current_submenu = undefined;
            if (e === undefined) {
                this.parentMenu.close();
            } else if (e && !isCursorOverElement(e as MouseEvent, this.parentMenu.root)) {
                trigger(this.parentMenu.root, "mouseleave", e);
            }
        }

        if (this.current_submenu) {
            this.current_submenu.close(e, true);
        }

        if ((this.root as any).closing_timer) {
            clearTimeout((this.root as any).closing_timer);
        }
    }

    /**
     * 获取最顶层的菜单
     * @returns 最顶层菜单实例
     */
    getTopMenu(): ContextMenu {
        if (this.options.parentMenu) {
            return this.options.parentMenu.getTopMenu();
        }
        return this;
    }

    /**
     * 获取第一个触发事件
     * @returns 事件对象
     */
    getFirstEvent(): Event | undefined {
        if (this.options.parentMenu) {
            return this.options.parentMenu.getFirstEvent();
        }
        return this.options.event;
    }
}
