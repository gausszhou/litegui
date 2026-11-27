import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Checkbox } from "@gausszhou/litegui-components/checkbox";

/**
 * `<LiteGuiCheckbox v-model="checked" />`
 */
export const LiteGuiCheckbox = defineComponent({
  name: "LiteGuiCheckbox",
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Checkbox | null = null;

    const applyDisabled = () => {
      if (!instance) return;
      instance.root.setAttribute("aria-disabled", String(props.disabled));
      instance.root.style.pointerEvents = props.disabled ? "none" : "";
    };

    onMounted(() => {
      if (!host.value) return;
      instance = new Checkbox(props.modelValue, {
        onChange: (value: boolean) => {
          emit("update:modelValue", value);
          emit("change", value);
        }
      });
      applyDisabled();
      host.value.appendChild(instance.root);
    });

    watch(
      () => props.modelValue,
      value => {
        instance?.setValue(value);
      }
    );

    watch(() => props.disabled, applyDisabled);

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-checkbox", style: { display: "inline-block" } });
  }
});
