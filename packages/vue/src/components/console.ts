import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Console } from "@gausszhou/litegui-components/console";

/**
 * `<LiteGuiConsole prompt=">" @command="run" />`
 */
export const LiteGuiConsole = defineComponent({
  name: "LiteGuiConsole",
  props: {
    prompt: { type: String, default: "]" }
  },
  emits: ["command"],
  setup(props, { emit, expose: exposeVue }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Console | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new Console({ prompt: props.prompt });
      instance.onProcessCommand = (command: string) => emit("command", command);
      host.value.appendChild(instance.root);
    });

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    const log = (...args: unknown[]) => instance?.log(...args);
    const warn = (...args: unknown[]) => instance?.warn(...args);
    const error = (...args: unknown[]) => instance?.error(...args);
    const clear = () => instance?.clear();

    exposeVue({ getInstance: () => instance, log, warn, error, clear });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-console",
        style: { display: "block", height: "200px" }
      });
  }
});
