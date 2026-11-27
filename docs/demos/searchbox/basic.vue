<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SearchBox } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const query = ref("");

onMounted(() => {
  const box = new SearchBox("", {
    placeholder: "搜索组件…",
    callback: (value: string) => {
      query.value = value;
    },
  });
  host.value?.appendChild(box.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row" />
    <p class="doc-demo-hint">按 Enter 或失焦后触发 callback。当前查询：{{ query || "（空）" }}</p>
  </div>
</template>
