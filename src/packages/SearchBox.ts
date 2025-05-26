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
        root.className = "litegui searchbox";
        return root;
    }

    createElementInput(value: string) {
        const input = document.createElement("input");
        input.value = value;
        input.placeholder = this.options.placeholder ?? "Search";
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
