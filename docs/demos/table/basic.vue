<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Table } from "@gausszhou/litegui";

const host = ref<HTMLElement>();

const rows = [
  { name: "Alice", type: "User", size: 12 },
  { name: "Bob", type: "User", size: 8 },
  { name: "Scene", type: "Folder", size: 42 },
  { name: "main.ts", type: "File", size: 4 },
  { name: "README.md", type: "File", size: 2 },
];

onMounted(() => {
  const table = new Table({
    columns: [
      { name: "Name", field: "name" },
      { name: "Type", field: "type" },
      { name: "Size", field: "size" },
    ],
    rows,
    scrollable: true,
    height: 200,
  });
  host.value?.appendChild(table.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-table-host" />
    <p class="doc-demo-hint">字符串列按列名小写映射字段；需要自定义字段时用 { name, field }。</p>
  </div>
</template>
