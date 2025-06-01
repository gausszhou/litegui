import EventMitter from "./EventMitter"

export class Widget extends EventMitter {
    root: HTMLElement = document.createElement('div');

    /**
     * 设置元素样式
     * @param key CSS 样式属性名
     * @param value CSS 样式属性值
     * @returns this 当前实例，支持链式调用
     */
    style(key: keyof CSSStyleDeclaration, value: any): this {
        if (
            key !== 'length' && key !== 'parentRule'
            && value !== undefined && value !== null && value !== ''
            && key !== 'float' && key !== 'cssFloat' // 避免与 CSSStyleDeclaration 中的 float 属性冲突
        ) {
            this.root.style[key] = value;
        }
        return this;
    }

    width(width: number | string): this {
        if (typeof width === 'number') {
            this.root.style.width = width + 'px';
        } else {
            this.root.style.width = width;
        }
        return this;
    }

    height(height: number | string): this {
        if (typeof height === 'number') {
            this.root.style.height = height + 'px';
        } else {
            this.root.style.height = height;
        }
        return this;
    }

    /**
     * 设置元素的 class
     * @param className class 名    
     * @returns this 当前实例，支持链式调用
     */
    class(className: string): this {
        this.root.className = className;
        return this;
    }

    /**
     * 设置元素的 id
     * @param id id 名
     * @returns this 当前实例，支持链式调用
     */
    id(id: string): this {
        this.root.id = id;
        return this;
    }
    
}