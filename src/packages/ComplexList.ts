import LiteGUI from ".";

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
    private root: HTMLElement;
    private item_code: string;
    private selected: any;
    public onItemSelected: ((item: any, elem: ExtendedHTMLElement) => void) | null;
    public onItemToggled: ((item: any, elem: ExtendedHTMLElement, enabled: boolean) => void) | null;
    public onItemRemoved: ((item: any, elem: ExtendedHTMLElement) => void) | null;

    constructor(options: ComplexListOptions = {}) {
        this.root = document.createElement("div");
        this.root.className = "litecomplexlist";

        this.item_code = options.item_code || `<div class='listitem'><span class='tick'><span>Tick</span></span><span class='title'></span><button class='trash'>Close</button></div>`;

        if (options.height) {
            this.root.style.height = LiteGUI.sizeToCSS(options.height);
        }

        this.selected = null;
        this.onItemSelected = null;
        this.onItemToggled = null;
        this.onItemRemoved = null;
    }

    public addTitle(text: string): HTMLElement {
        const elem = LiteGUI.createElement("div", ".listtitle", text);
        this.root.appendChild(elem);
        return elem;
    }

    public addHTML(html: string, on_click?: (e: MouseEvent) => void): HTMLElement {
        const elem = LiteGUI.createElement("div", ".listtext", html);
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
        const elem = LiteGUI.createListItem(this.item_code, { title: title }) as ExtendedHTMLElement;
        elem.item = item;

        if (is_enabled) {
            elem.classList.add("enabled");
        }

        if (!can_be_removed) {
            const trashElem = elem.querySelector(".trash") as HTMLDivElement;
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

        const tickElem = elem.querySelector(".tick") as HTMLDivElement;
        if (tickElem) {
            tickElem.addEventListener("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                elem.classList.toggle("enabled");
                if (this.onItemToggled) {
                    this.onItemToggled(item, elem, elem.classList.contains("enabled"));
                }
            });
        }

        const trashElem = elem.querySelector(".trash") as HTMLDivElement;
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
            const titleElem = elem.querySelector(".title");
            if (titleElem) {
                if (is_html) {
                    titleElem.innerHTML = v;
                } else {
                    titleElem.textContent = v;
                }
            }
        };

        elem.toggleEnabled = () => {
            elem.classList.toggle("enabled");
        };

        elem.setSelected = (v: boolean) => {
            this.root.classList.remove("selected");
            if (v) {
                elem.classList.add("selected");
            } else {
                elem.classList.remove("selected");
            }
            this.selected = elem.item;
        };

        elem.show = () => { elem.style.display = ""; };
        elem.hide = () => { elem.style.display = "none"; };

        this.root.appendChild(elem);
        return elem;
    }
}
