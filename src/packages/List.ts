interface ListItem {
    id?: string;
    value?: string;
    label?: string;
    checked: boolean;
}

interface ListOptions {
    callback?: (data: any) => void;
    parent?: HTMLElement | { root: HTMLElement };
}

export class List {
    private root: HTMLUListElement;
    private items: any[] = [];
    private callback?: (data: any) => void;


    constructor(id: string, items: Array<string | ListItem>, options: ListOptions = {}) {
        
        this.root = document.createElement("ul");
        this.root.id = id;
        this.root.className = "litelist";
        this.callback = options.callback;

        this.items = items;

        // 遍历列表项并创建DOM元素
        for (const item of items) {
            const listItem =  this.createItem(item); // 创建一个新的列表项元素
            listItem.addEventListener("click", () => {
                // 移除所有选中项的selected类
                const selectedItems = this.root.querySelectorAll(".list-item.selected");
                selectedItems.forEach(item => item.classList.remove("selected"));
                // 为当前选中项添加selected类
                listItem.classList.add("selected");
                this.items.forEach(item => {
                    if (item.value === listItem.dataset.value) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                });
                // 触发回调函数
                this.callback?.(listItem);
            });

            this.root.appendChild(listItem);
        }
    }

    createItem(item:  string | ListItem): HTMLLIElement {
        const $li = document.createElement("li");
        $li.className = "list-item";
        if (typeof item === "string") {
            $li.dataset.value = item || "";
        } else {
            $li.dataset.value =item.value || item.label || "";
            if (item.id) {
                $li.id = item.id;
            }
        }
        $li.innerHTML = `${$li.dataset.value}<span class='arrow'></span>`;          
        return $li;
    }

    getSelectedItem(): HTMLLIElement | null {
        return this.root.querySelector(".list-item.selected");
    }

    setSelectedItem(name: string): void {
    }
}
