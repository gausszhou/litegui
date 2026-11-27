import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Menu } from "@gausszhou/litegui-components/menu";

export interface LiteGuiMenuItem {
  label: string;
  children?: LiteGuiMenuItem[];
  disabled?: boolean;
}

let menuId = 0;

/**
 * `<LiteGuiMenu :items="items" @select="..."/>`
 */
export const LiteGuiMenu = defineComponent({
  name: "LiteGuiMenu",
  props: {
    items: {
      type: Array as PropType<LiteGuiMenuItem[]>,
      default: () => []
    }
  },
  emits: ["select"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Menu | null = null;

    const addItems = (menu: Menu, items: LiteGuiMenuItem[], prefix = "") => {
      for (const item of items) {
        const path = prefix ? `${prefix}/${item.label}` : item.label;
        menu.add(path, {
          disabled: item.disabled,
          callback: item.children?.length ? undefined : () => emit("select", { label: item.label, path })
        });
        if (item.children?.length) addItems(menu, item.children, path);
      }
    };

    const build = () => {
      if (!host.value) return;
      host.value.replaceChildren();
      instance = new Menu(`lg-vue-menu-${++menuId}`, { container: host.value });
      addItems(instance, props.items);
      host.value.appendChild(instance.root);
    };

    onMounted(build);

    watch(
      () => props.items,
      () => build(),
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.hideMenuPanel();
      host.value?.replaceChildren();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-menu", style: { display: "inline-block" } });
  }
});
