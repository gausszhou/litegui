import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { TextEditor } from "@gausszhou/litegui-components/text-editor";

export interface LiteGuiTextEditorTab {
  id: string;
  label?: string;
  value?: string;
  readOnly?: boolean;
}

export interface LiteGuiTextEditorCursor {
  line: number;
  column: number;
}

export interface LiteGuiTextEditorChange {
  tab: string;
  value: string;
}

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiTextEditor v-model="code" language="Python" :tabs="tabs" @change="..." @cursor="..." />`
 */
export const LiteGuiTextEditor = defineComponent({
  name: "LiteGuiTextEditor",
  props: {
    modelValue: { type: String, default: "" },
    language: { type: String, default: "Python" },
    readonly: { type: Boolean, default: false },
    /** `readonly` 的 camelCase 别名。 */
    readOnly: { type: Boolean, default: false },
    tabs: { type: Array as PropType<LiteGuiTextEditorTab[]>, default: () => [] },
    title: { type: String, default: undefined },
    activeTab: { type: String, default: undefined },
    showTabs: { type: Boolean, default: true },
    height: { type: [Number, String], default: 240 }
  },
  emits: ["update:modelValue", "change", "cursor", "tab", "run"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: TextEditor | null = null;

    const isReadOnly = () => props.readonly || props.readOnly;

    const build = () => {
      if (!host.value) return;
      instance = new TextEditor({
        value: props.modelValue,
        language: props.language,
        readOnly: isReadOnly(),
        title: props.title,
        activeTab: props.activeTab,
        showTabs: props.showTabs,
        tabs: props.tabs.length
          ? props.tabs.map(tab => ({
              id: tab.id,
              label: tab.label ?? tab.id,
              value: tab.value ?? "",
              readOnly: tab.readOnly
            }))
          : undefined
      });
      instance.root.style.height = "100%";
      instance.on("change", payload => {
        const data = payload as LiteGuiTextEditorChange;
        emit("update:modelValue", data.value);
        emit("change", data);
      });
      instance.on("cursor", payload => emit("cursor", payload as LiteGuiTextEditorCursor));
      instance.on("tab", id => emit("tab", id));
      instance.on("run", value => emit("run", value));
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.modelValue,
      value => {
        if (instance && instance.getValue() !== value) instance.setValue(value);
      }
    );

    watch(
      () => [props.readonly, props.readOnly],
      () => instance?.setReadOnly(isReadOnly())
    );

    watch(
      () => [props.language, props.tabs, props.title, props.activeTab, props.showTabs],
      () => build(),
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-text-editor",
        style: { display: "block", width: "100%", height: toCSS(props.height) }
      });
  }
});
