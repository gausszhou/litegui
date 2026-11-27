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
  public root: HTMLUListElement;
  private items: Array<string | ListItem> = [];
  private callback?: (data: any) => void;

  constructor(id: string, items: Array<string | ListItem>, options: ListOptions = {}) {
    this.root = document.createElement("ul");
    this.root.id = id;
    this.root.className = "lg-list";
    this.root.setAttribute("role", "listbox");
    this.callback = options.callback;
    this.items = items;

    for (const item of items) {
      const listItem = this.createItem(item);
      listItem.addEventListener("click", () => {
        this.selectElement(listItem, true);
      });
      this.root.appendChild(listItem);
    }

    if (options.parent) {
      const parent = "root" in options.parent ? options.parent.root : options.parent;
      parent.appendChild(this.root);
    }
  }

  private itemValue(item: string | ListItem): string {
    return typeof item === "string" ? item : item.value || item.label || "";
  }

  private selectElement(element: HTMLLIElement, emit: boolean) {
    this.root.querySelectorAll<HTMLElement>(".lg-list__item").forEach((item) => {
      item.classList.remove("lg-is-selected");
      item.setAttribute("aria-selected", "false");
    });
    element.classList.add("lg-is-selected");
    element.setAttribute("aria-selected", "true");

    const value = element.dataset.value || "";
    this.items.forEach((item) => {
      if (typeof item !== "string") {
        item.checked = this.itemValue(item) === value;
      }
    });

    if (emit) this.callback?.(element);
  }

  createItem(item: string | ListItem): HTMLLIElement {
    const li = document.createElement("li");
    li.className = "lg-list__item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    li.dataset.value = this.itemValue(item);

    if (typeof item !== "string" && item.id) {
      li.id = item.id;
    }

    li.textContent = li.dataset.value || "";
    const arrow = document.createElement("span");
    arrow.className = "lg-list__arrow";
    li.appendChild(arrow);

    return li;
  }

  getSelectedItem(): HTMLLIElement | null {
    return this.root.querySelector(".lg-list__item.lg-is-selected");
  }

  getSelectedValue(): string | null {
    return this.getSelectedItem()?.dataset.value ?? null;
  }

  setSelectedItem(value: string): boolean {
    const target = Array.from(this.root.querySelectorAll<HTMLLIElement>(".lg-list__item")).find(
      (item) => item.dataset.value === value
    );
    if (!target) return false;

    this.selectElement(target, true);
    return true;
  }

  clear() {
    this.root.innerHTML = "";
    this.items = [];
  }
}
