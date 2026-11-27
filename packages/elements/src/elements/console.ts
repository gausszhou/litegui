import { Console } from "@gausszhou/litegui-components/console";
import { LiteGuiElement } from "../base";

/**
 * `<lg-console prompt=">">`
 *
 * 输入命令并回车时派发 `litegui-command`，detail 为 `{ command }`。
 * 公共方法：`log()` / `warn()` / `error()` / `clear()`，直接转发到原生 Console。
 */
export class LiteGuiConsoleElement extends LiteGuiElement {
  static observedAttributes = ["prompt"];
  static hostStyles = ":host { display: block; height: 220px; min-height: 120px; }";

  #console: Console | null = null;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#console = new Console({ prompt: this.prompt });
    this.#console.onProcessCommand = (command: string) => {
      this.emit("litegui-command", { command });
    };
    this.setComponent(this.#console);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#console || name !== "prompt") return;
    this.#console._prompt = this.prompt;
  }

  get prompt(): string {
    return this.stringAttr("prompt", "]");
  }
  set prompt(value: string) {
    this.reflect("prompt", value);
  }

  log(...args: unknown[]): this {
    this.#console?.log(...args);
    return this;
  }

  warn(...args: unknown[]): this {
    this.#console?.warn(...args);
    return this;
  }

  error(...args: unknown[]): this {
    this.#console?.error(...args);
    return this;
  }

  clear(): this {
    this.#console?.clear();
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-console": LiteGuiConsoleElement;
  }
}
