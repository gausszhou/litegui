import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { List } from "@gausszhou/litegui-components/list";

export interface LiteGuiListItem {
  id?: string;
  value?: string;
  label?: string;
  checked?: boolean;
}

/**
 * `<LiteGuiList v-model="selected" :items="items" />`
 */
export const LiteGuiList = defineComponent({
  name: "LiteGuiList",
  props: {
    items: {
      type: Array as PropType<Array<string | LiteGuiListItem>>,
      default: () => []
    },
    modelValue: { type: String, default: undefined },
    id: { type: String, default: undefined }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: List | null = null;

    const build = () => {
      if (!host.value) return;
      const items = props.items.map(item => {
        if (typeof item === "string") return item;
        return { ...item, checked: item.checked ?? false };
      });
      instance = new List(props.id ?? "litegui-vue-list", items, {
        callback: (element: HTMLElement) => {
          const value = element.dataset.value ?? "";
          emit("update:modelValue", value);
          emit("change", value);
        }
      });
      host.value.replaceChildren(instance.root);
      if (props.modelValue) instance.setSelectedItem(props.modelValue);
    };

    onMounted(build);

    watch(
      () => props.items,
      () => build(),
      { deep: true }
    );

    watch(
      () => props.modelValue,
      value => {
        if (value) instance?.setSelectedItem(value);
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-list", style: { display: "block" } });
  }
});
