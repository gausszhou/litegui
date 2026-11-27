import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Button } from "@gausszhou/litegui-components/button";

export type LiteGuiButtonSize = "default" | "small" | "mini";

/**
 * `<LiteGuiButton label="保存" @click="..."/>`
 */
export const LiteGuiButton = defineComponent({
  name: "LiteGuiButton",
  props: {
    label: { type: String, default: "" },
    size: {
      type: String as PropType<LiteGuiButtonSize>,
      default: "default"
    },
    disabled: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Button | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new Button(props.label, {
        size: props.size,
        callback: () => {
          if (!props.disabled) emit("click");
        }
      });
      instance.content.disabled = props.disabled;
      host.value.appendChild(instance.root);
    });

    watch(
      () => props.label,
      value => {
        if (instance) instance.content.textContent = value;
      }
    );

    watch(
      () => props.size,
      value => {
        if (!instance) return;
        instance.root.classList.remove("small", "mini");
        if (value !== "default") instance.root.classList.add(value);
      }
    );

    watch(
      () => props.disabled,
      value => {
        if (instance) instance.content.disabled = value;
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-button", style: { display: "inline-block" } });
  }
});
