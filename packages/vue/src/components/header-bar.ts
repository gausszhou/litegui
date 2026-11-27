import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { HeaderBar } from "@gausszhou/litegui-components/header-bar";
import type { HeaderBarContent } from "@gausszhou/litegui-components";

export type LiteGuiHeaderBarContent = string | string[];

/**
 * `<LiteGuiHeaderBar variant="area" title="UV Editor" :left="['文件']" @...>`
 * `#left` / `#center` / `#right` 插槽优先于同名 props。
 */
export const LiteGuiHeaderBar = defineComponent({
  name: "LiteGuiHeaderBar",
  props: {
    variant: { type: String as PropType<"topbar" | "area">, default: "topbar" },
    title: { type: String, default: "" },
    titleIcon: { type: String, default: "" },
    titleTooltip: { type: String, default: "" },
    height: { type: [Number, String], default: 32 },
    left: { type: [String, Array] as PropType<LiteGuiHeaderBarContent>, default: undefined },
    center: { type: [String, Array] as PropType<LiteGuiHeaderBarContent>, default: undefined },
    right: { type: [String, Array] as PropType<LiteGuiHeaderBarContent>, default: undefined }
  },
  setup(props, { slots, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const slotHosts: Record<"left" | "center" | "right", HTMLDivElement | null> = {
      left: null,
      center: null,
      right: null
    };
    let instance: HeaderBar | null = null;

    const toContent = (value: LiteGuiHeaderBarContent): HeaderBarContent => (Array.isArray(value) ? value : value);

    const applyFallbacks = () => {
      if (!instance) return;
      (["left", "center", "right"] as const).forEach(name => {
        if (slots[name] || props[name] === undefined) return;
        const content = toContent(props[name] as LiteGuiHeaderBarContent);
        if (name === "left") instance?.setLeft(content);
        else if (name === "center") instance?.setCenter(content);
        else instance?.setRight(content);
      });
    };

    const build = () => {
      if (!host.value) return;
      instance?.root.remove();
      instance = new HeaderBar({
        variant: props.variant,
        title: props.title || undefined,
        titleIcon: props.titleIcon || undefined,
        titleTooltip: props.titleTooltip || undefined,
        height: props.height
      });
      host.value.replaceChildren(instance.root);

      (["left", "center", "right"] as const).forEach(name => {
        const element = slotHosts[name];
        if (!element || !slots[name] || !instance) return;
        instance[name].appendChild(element);
      });
      applyFallbacks();
    };

    onMounted(build);

    watch(
      () => [props.variant, props.height],
      () => build()
    );

    watch(
      () => [props.title, props.titleIcon, props.titleTooltip],
      () => {
        if (!instance) return;
        instance.setTitle(props.title, props.titleIcon || undefined, props.titleTooltip || undefined);
      }
    );

    watch(
      () => [props.left, props.center, props.right],
      () => {
        if (!instance) return;
        (["left", "center", "right"] as const).forEach(name => {
          if (slots[name] || props[name] === undefined) return;
          const content = toContent(props[name] as LiteGuiHeaderBarContent);
          if (name === "left") instance?.setLeft(content);
          else if (name === "center") instance?.setCenter(content);
          else instance?.setRight(content);
        });
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({
      getInstance: () => instance,
      setLeft: (content: HeaderBarContent) => instance?.setLeft(content),
      setCenter: (content: HeaderBarContent) => instance?.setCenter(content),
      setRight: (content: HeaderBarContent) => instance?.setRight(content)
    });

    return () =>
      h("div", { ref: host, class: "lg-vue-header-bar", style: { display: "block", width: "100%" } }, [
        (["left", "center", "right"] as const).map(name =>
          h(
            "div",
            {
              key: name,
              class: `lg-vue-header-bar__${name}`,
              ref: element => {
                slotHosts[name] = element as HTMLDivElement | null;
              }
            },
            slots[name]?.()
          )
        )
      ]);
  }
});
