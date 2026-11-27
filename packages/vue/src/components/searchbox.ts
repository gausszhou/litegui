import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { SearchBox } from "@gausszhou/litegui-components/searchbox";

/**
 * `<LiteGuiSearchBox v-model="keyword" placeholder="搜索" />`
 */
export const LiteGuiSearchBox = defineComponent({
  name: "LiteGuiSearchBox",
  props: {
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "Search" }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: SearchBox | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new SearchBox(props.modelValue, {
        placeholder: props.placeholder,
        callback: (value: string) => {
          emit("update:modelValue", value);
          emit("change", value);
        }
      });
      host.value.appendChild(instance.root);
    });

    watch(
      () => props.modelValue,
      value => {
        if (instance && instance.input.value !== value) instance.input.value = value;
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-searchbox", style: { display: "inline-block" } });
  }
});
