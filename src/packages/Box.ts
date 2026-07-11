class LiteBox {
    root = document.createElement('div');
    stopPropagation = false;
    constructor() {
        this.root.addEventListener('click', (e) => {
            if (this.stopPropagation) {
                e.stopPropagation();
            }
        });
    }

    setEmpty(flag: boolean = true) {
        if (flag) {
            this.root.innerHTML = '';
        }
    }    
}