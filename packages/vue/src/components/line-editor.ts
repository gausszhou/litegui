import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { LineEditor } from "@gausszhou/litegui-components/line-editor";

export type LiteGuiLineEditorPoint = [number, number];

/**
 * `<LiteGuiLineEditor v-model="curve" :width="320" :height="120" @change="..." />`
 */
export const LiteGuiLineEditor = defineComponent({
  name: "LiteGuiLineEditor",
  props: {
    modelValue: { type: Array as PropType<LiteGuiLineEditorPoint[]>, default: () => [] },
    width: { type: [Number, String], default: 300 },
    height: { type: Number, default: 100 },
    xrange: { type: Array as PropType<number[]>, default: undefined },
    yrange: { type: Array as PropType<number[]>, default: undefined },
    defaulty: { type: Number, default: undefined },
    noTrespassing: { type: Boolean, default: false },
    showSamples: { type: Number, default: 0 }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: LineEditor | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new LineEditor(
        props.modelValue.map(point => [point[0], point[1]]),
        {
          width: props.width,
          height: props.height,
          xrange: props.xrange as [number, number] | undefined,
          yrange: props.yrange as [number, number] | undefined,
          defaulty: props.defaulty,
          no_trespassing: props.noTrespassing,
          show_samples: props.showSamples,
          callback: value => {
            emit("update:modelValue", value);
            emit("change", value);
          }
        }
      );
      instance.root.style.height = `${props.height}px`;
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.modelValue,
      value => {
        if (!instance) return;
        instance.value = value.map(point => [point[0], point[1]]);
        instance.redraw();
      },
      { deep: true }
    );

    watch(
      () => [
        props.width,
        props.height,
        props.xrange,
        props.yrange,
        props.defaulty,
        props.noTrespassing,
        props.showSamples
      ],
      () => build(),
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-line-editor", style: { display: "block", width: "100%" } });
  }
});
