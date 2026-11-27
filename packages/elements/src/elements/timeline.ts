import { Timeline } from "@gausszhou/litegui-components/timeline";
import { LiteGuiElement } from "../base";

/**
 * `<lg-timeline start="1" end="120" frame="10" fps="24" keyframes="[10,20,40]">`
 *
 * - 拖拽/输入帧号：`litegui-frame` → `{ frame }`
 * - 播放/暂停：`litegui-play` → `{ playing }`
 * - 修改起止帧：`litegui-range` → `{ start, end }`
 */
export class LiteGuiTimelineElement extends LiteGuiElement {
  static observedAttributes = ["start", "end", "frame", "fps", "keyframes"];
  static hostStyles = ":host { display: block; height: 160px; min-height: 120px; }";

  #timeline: Timeline | null = null;
  #syncing = false;

  protected render() {
    this.mountPoint.style.height = "100%";
    this.#timeline = new Timeline({
      start: this.start,
      end: this.end,
      frame: this.frame,
      fps: this.fps,
      keyframes: this.keyframes
    });

    const timeline = this.#timeline;
    timeline.on("frame", payload => {
      if (this.#syncing) return;
      const frame = Number(payload);
      this.reflect("frame", frame);
      this.emit("litegui-frame", { frame: timeline.getFrame() });
    });
    timeline.on("play", payload => {
      this.emit("litegui-play", { playing: Boolean(payload) });
    });
    timeline.on("range", payload => {
      const range = payload as { start: number; end: number };
      this.reflect("start", range.start);
      this.reflect("end", range.end);
      this.emit("litegui-range", { start: range.start, end: range.end });
    });

    this.setComponent(timeline);
  }

  protected onAttributeChanged(name: string) {
    if (!this.#timeline) return;

    switch (name) {
      case "start":
      case "end":
        this.#syncing = true;
        this.#timeline.setRange(this.start, this.end, false);
        this.#syncing = false;
        break;
      case "frame":
        this.#syncing = true;
        this.#timeline.setFrame(this.frame, false);
        this.#syncing = false;
        break;
      case "fps":
        this.#timeline.setFps(this.fps);
        break;
      case "keyframes":
        this.#timeline.setKeyframes(this.keyframes);
        break;
    }
  }

  get start(): number {
    return this.numberAttr("start", 1);
  }
  set start(value: number) {
    this.reflect("start", value);
  }

  get end(): number {
    return this.numberAttr("end", 250);
  }
  set end(value: number) {
    this.reflect("end", value);
  }

  get frame(): number {
    return this.numberAttr("frame", 1);
  }
  set frame(value: number) {
    this.reflect("frame", value);
  }

  get fps(): number {
    return this.numberAttr("fps", 24);
  }
  set fps(value: number) {
    this.reflect("fps", value);
  }

  get keyframes(): number[] {
    return this.jsonAttr<number[]>("keyframes", []);
  }
  set keyframes(value: number[]) {
    this.reflect("keyframes", JSON.stringify(value));
  }

  /** 当前帧（直接读组件状态） */
  get currentFrame(): number {
    return this.#timeline?.getFrame() ?? this.frame;
  }

  play(): this {
    this.#timeline?.play();
    return this;
  }

  protected onDisconnect() {
    // 元素被移出文档时停止播放，避免遗留 setInterval。
    this.#timeline?.pause();
  }

  pause(): this {
    this.#timeline?.pause();
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lg-timeline": LiteGuiTimelineElement;
  }
}
