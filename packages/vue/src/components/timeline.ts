import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Timeline } from "@gausszhou/litegui-components/timeline";

export interface LiteGuiTimelineRange {
  start: number;
  end: number;
}

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiTimeline v-model:frame="frame" :start="1" :end="250" :fps="24" @play="..." @range="..." />`
 */
export const LiteGuiTimeline = defineComponent({
  name: "LiteGuiTimeline",
  props: {
    start: { type: Number, default: 1 },
    end: { type: Number, default: 250 },
    frame: { type: Number, default: 1 },
    fps: { type: Number, default: 24 },
    keyframes: { type: Array as PropType<number[]>, default: () => [] },
    height: { type: [Number, String], default: 160 },
    showHeader: { type: Boolean, default: true }
  },
  emits: ["update:frame", "frame", "play", "range", "keyframe"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Timeline | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new Timeline({
        start: props.start,
        end: props.end,
        frame: props.frame,
        fps: props.fps,
        keyframes: props.keyframes,
        height: props.height,
        showHeader: props.showHeader
      });
      instance.on("frame", frame => {
        emit("update:frame", frame);
        emit("frame", frame);
      });
      instance.on("play", playing => emit("play", playing));
      instance.on("range", range => emit("range", range as LiteGuiTimelineRange));
      instance.on("keyframe", frame => emit("keyframe", frame));
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.frame,
      value => {
        if (instance && instance.getFrame() !== value) instance.setFrame(value, false);
      }
    );

    watch(
      () => [props.start, props.end],
      () => {
        if (!instance) return;
        const range = instance.getRange();
        if (range.start !== props.start || range.end !== props.end) {
          instance.setRange(props.start, props.end);
        }
      }
    );

    watch(
      () => props.fps,
      value => instance?.setFps(value)
    );

    watch(
      () => props.keyframes,
      value => instance?.setKeyframes(value),
      { deep: true }
    );

    watch(
      () => props.height,
      value => {
        instance?.setHeight(value);
        if (host.value) host.value.style.height = toCSS(value);
      }
    );

    watch(
      () => props.showHeader,
      () => build()
    );

    onBeforeUnmount(() => {
      instance?.destroy();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-timeline",
        style: { display: "block", width: "100%", height: toCSS(props.height) }
      });
  }
});
