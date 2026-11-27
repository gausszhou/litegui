import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Table, type TableColumn } from "@gausszhou/litegui-components/table";

/**
 * `<LiteGuiTable :columns="columns" :rows="rows" :height="240" />`
 */
export const LiteGuiTable = defineComponent({
  name: "LiteGuiTable",
  props: {
    columns: { type: Array as PropType<TableColumn[]>, default: () => [] },
    rows: { type: Array as PropType<unknown[]>, default: () => [] },
    height: { type: [Number, String], default: undefined },
    scrollable: { type: Boolean, default: false }
  },
  setup(props, { expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Table | null = null;

    const create = () => {
      if (!host.value) return;
      instance = new Table({
        columns: props.columns,
        rows: props.rows,
        height: props.height,
        scrollable: props.scrollable
      });
      host.value.replaceChildren(instance.root);
    };

    onMounted(create);

    watch(
      () => props.columns,
      columns => {
        if (!instance) return;
        instance.setColumns(columns);
        instance.setRows(props.rows);
      },
      { deep: true }
    );

    watch(
      () => props.rows,
      rows => instance?.setRows(rows),
      { deep: true }
    );

    watch(
      () => [props.height, props.scrollable],
      () => {
        instance?.root.remove();
        instance = null;
        create();
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-table",
        style: { display: "block", width: "100%" }
      });
  }
});
