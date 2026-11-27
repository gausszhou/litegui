import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Slider } from "@gausszhou/litegui-components/slider";

/**
 * `<LiteGuiSlider v-model="value" :min="0" :max="100" />`
 */
export const LiteGuiSlider = defineComponent({
  name: "LiteGuiSlider",
  props: {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 1 },
    step: { type: Number, default: undefined }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Slider | null = null;

    const create = () => {
      if (!host.value) return;
      instance = new Slider(props.modelValue, {
        min: props.min,
        max: props.max,
        step: props.step
      });
      instance.onChange = (value: number) => {
        emit("update:modelValue", value);
        emit("change", value);
      };
      host.value.replaceChildren(instance.root);
    };

    onMounted(create);

    watch(
      () => props.modelValue,
      value => instance?.setValue(value, true)
    );

    watch(
      () => [props.min, props.max, props.step],
      () => {
        instance?.root.remove();
        instance = null;
        create();
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-slider", style: { display: "block" } });
  }
});
