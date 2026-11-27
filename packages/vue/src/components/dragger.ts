import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Dragger } from "@gausszhou/litegui-components/dragger";

/**
 * `<LiteGuiDragger v-model="value" :precision="3" />`
 */
export const LiteGuiDragger = defineComponent({
  name: "LiteGuiDragger",
  props: {
    modelValue: { type: Number, default: 0 },
    precision: { type: Number, default: 3 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    units: { type: String, default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Dragger | null = null;

    const handleChange = () => {
      if (!instance) return;
      const parsed = Number.parseFloat(instance.input.value);
      if (Number.isFinite(parsed) && parsed !== instance.value) instance.setValue(parsed, true);
      const value = instance.value;
      emit("update:modelValue", value);
      emit("change", value);
    };

    onMounted(() => {
      if (!host.value) return;
      instance = new Dragger(props.modelValue, {
        precision: props.precision,
        min: props.min,
        max: props.max,
        units: props.units
      });
      instance.input.addEventListener("change", handleChange);
      host.value.appendChild(instance.root);
    });

    watch(
      () => props.modelValue,
      value => instance?.setValue(value, true)
    );

    onBeforeUnmount(() => {
      instance?.input.removeEventListener("change", handleChange);
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-dragger", style: { display: "inline-block" } });
  }
});
