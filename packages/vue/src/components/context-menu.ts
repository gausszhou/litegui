import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { ContextMenu } from "@gausszhou/litegui-components/context-menu";

export interface LiteGuiContextMenuItem {
  title?: string;
  /** 传给 `@select` 的标识值（缺省时使用 `title`）。 */
  value?: unknown;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * `<LiteGuiContextMenu v-model="menuOpen" :items="items" :x="120" :y="80" @select="..." />`
 *
 * 菜单渲染在 `document.body` 上，`v-model` / `open` 控制显隐；选中条目时触发 `select`。
 */
export const LiteGuiContextMenu = defineComponent({
  name: "LiteGuiContextMenu",
  props: {
    items: { type: Array as PropType<LiteGuiContextMenuItem[]>, default: () => [] },
    modelValue: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    title: { type: String, default: "" }
  },
  emits: ["update:modelValue", "update:open", "open", "select"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: ContextMenu | null = null;

    const emitOpen = (value: boolean) => {
      emit("update:modelValue", value);
      emit("update:open", value);
      emit("open", value);
    };

    const close = (notify = true) => {
      const menu = instance;
      if (!menu) return;
      instance = null;
      menu.close();
      if (notify) emitOpen(false);
    };

    const open = () => {
      close(false);
      if (!host.value) return;
      const values = props.items.map(item => ({ ...item }));
      const menu = new ContextMenu(values, {
        left: props.x,
        top: props.y,
        title: props.title || undefined,
        container: document.body,
        callback: (item: unknown) => emit("select", item)
      });

      const nativeClose = menu.close.bind(menu);
      menu.close = ((event?: Event, ignoreParentMenu?: boolean) => {
        nativeClose(event, ignoreParentMenu);
        if (instance !== menu) return;
        instance = null;
        emitOpen(false);
      }) as typeof menu.close;

      instance = menu;
      emitOpen(true);
    };

    const wanted = () => props.modelValue || props.open;

    const sync = () => {
      if (wanted() && !instance) open();
      else if (!wanted() && instance) close();
    };

    onMounted(sync);

    watch(() => [props.modelValue, props.open], sync);

    watch(
      () => [props.items, props.x, props.y, props.title],
      () => {
        if (instance) open();
      },
      { deep: true }
    );

    onBeforeUnmount(() => close(false));

    expose({ getInstance: () => instance, open, close });

    return () => h("div", { ref: host, class: "lg-vue-context-menu", style: { display: "contents" } });
  }
});
