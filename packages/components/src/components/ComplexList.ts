import { sizeToCSS } from "@gausszhou/litegui-core";
import { createElement, createListItem } from "@gausszhou/litegui-core";

interface ComplexListOptions {
    item_code?: string;
    height?: number | string;
}

interface ListItem {
    content?: string;
    name?: string;
    [key: string]: any;
}

interface ExtendedHTMLElement extends HTMLElement {
    item?: any;
    setContent?: (v: string, is_html?: boolean) => void;
    toggleEnabled?: () => void;
    setSelected?: (v: boolean) => void;
    show?: () => void;
    hide?: () => void;
}

export class ComplexList {
    public root: HTMLElement;
    private item_code: string;
    private selected: any;
    public onItemSelected: ((item: any, elem: ExtendedHTMLElement) => void) | null;
    public onItemToggled: ((item: any, elem: ExtendedHTMLElement, enabled: boolean) => void) | null;
    public onItemRemoved: ((item: any, elem: ExtendedHTMLElement) => void) | null;

    constructor(options: ComplexListOptions = {}) {
        this.root = document.createElement("div");
        this.root.className = "lg-complex-list";

        this.item_code = options.item_code || `<div class='lg-complex-list__item'><span class='lg-complex-list__tick'><span>Tick</span></span><span class='lg-complex-list__item-title'></span><button class='lg-complex-list__trash'>Close</button></div>`;

        if (options.height) {
            this.root.style.height = sizeToCSS(options.height);
        }

        this.selected = null;
        this.onItemSelected = null;
        this.onItemToggled = null;
        this.onItemRemoved = null;
    }

    public addTitle(text: string): HTMLElement {
        const elem = createElement("div", ".lg-complex-list__title", text);
        this.root.appendChild(elem);
        return elem;
    }

    public addHTML(html: string, on_click?: (e: MouseEvent) => void): HTMLElement {
        const elem = createElement("div", ".lg-complex-list__text", html);
        if (on_click) {
            elem.addEventListener("mousedown", on_click);
        }
        this.root.appendChild(elem);
        return elem;
    }

    public clear(): void {
        this.root.innerHTML = "";
    }

    public addItem(item: ListItem, text?: string, is_enabled?: boolean, can_be_removed?: boolean): ExtendedHTMLElement {
        const title = text || item.content || item.name || '';
        const elem = createListItem(this.item_code, { ".lg-complex-list__item-title": title }) as ExtendedHTMLElement;
        elem.item = item;

        if (is_enabled) {
            elem.classList.add("lg-is-enabled");
        }

        if (!can_be_removed) {
            const trashElem = elem.querySelector(".lg-complex-list__trash") as HTMLDivElement;
            if (trashElem) {
                trashElem.style.display = "none";
            }
        }

        elem.addEventListener("mousedown", (e: MouseEvent) => {
            e.preventDefault();
            elem.setSelected?.(true);
            if (this.onItemSelected) {
                this.onItemSelected(item, elem);
            }
        });

        const tickElem = elem.querySelector(".lg-complex-list__tick") as HTMLDivElement;
        if (tickElem) {
            tickElem.addEventListener("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                elem.classList.toggle("lg-is-enabled");
                if (this.onItemToggled) {
                    this.onItemToggled(item, elem, elem.classList.contains("enabled"));
                }
            });
        }

        const trashElem = elem.querySelector(".lg-complex-list__trash") as HTMLDivElement;
        if (trashElem) {
            trashElem.addEventListener("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (this.onItemRemoved) {
                    this.onItemRemoved(item, elem);
                }
            });
        }

        elem.setContent = (v: string, is_html?: boolean) => {
            const titleElem = elem.querySelector(".lg-complex-list__item-title");
            if (titleElem) {
                if (is_html) {
                    titleElem.innerHTML = v;
                } else {
                    titleElem.textContent = v;
                }
            }
        };

        elem.toggleEnabled = () => {
            elem.classList.toggle("lg-is-enabled");
        };

        elem.setSelected = (v: boolean) => {
            this.root.querySelectorAll(".lg-complex-list__item.lg-is-selected").forEach((item) => item.classList.remove("lg-is-selected"));
            if (v) {
                elem.classList.add("lg-is-selected");
            } else {
                elem.classList.remove("lg-is-selected");
            }
            this.selected = elem.item;
        };

        elem.show = () => { elem.style.display = ""; };
        elem.hide = () => { elem.style.display = "none"; };

        this.root.appendChild(elem);
        return elem;
    }

    public getSelected(): any {
        return this.selected;
    }
}
