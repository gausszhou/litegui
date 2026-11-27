interface SearchBoxOptions {
    placeholder?: string;
    callback?: (value: string) => void;
}

export class SearchBox {
    root: HTMLDivElement;
    input: HTMLInputElement;
    options: SearchBoxOptions;

    constructor(value: string = "", options: SearchBoxOptions = {}) {
        this.options = options;
        this.root = this.createElementRoot();
        this.input = this.createElementInput(value);
        this.initDom();
        this.initEvent();
    }

    createElementRoot() {
        const root = document.createElement("div");
        root.className = "lg-searchbox";
        root.setAttribute("role", "search");
        return root;
    }

    createElementInput(value: string) {
        const input = document.createElement("input");
        input.className = "lg-searchbox__input";
        input.value = value;
        input.type = "search";
        input.placeholder = this.options.placeholder ?? "Search";
        input.setAttribute("aria-label", this.options.placeholder ?? "Search");
        return input;
    }

    initDom() {
        this.root.appendChild(this.input);
    }

    initEvent() {
        this.input.onchange = (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            this.options.callback?.(value);
        };
    }

    setValue(value: string) {
        this.input.value = value;
        this.input.dispatchEvent(new Event("change"));
    }

    getValue(): string {
        return this.input.value;
    }
}
