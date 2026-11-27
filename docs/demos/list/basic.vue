<script setup lang="ts">
import { onMounted, ref } from "vue";
import { List } from "@gausszhou/litegui";

const host = ref<HTMLElement>();
const selected = ref("（未选择）");

onMounted(() => {
  const list = new List("doc-list", ["Alpha", "Beta", "Gamma"], {
    callback: (element: HTMLLIElement) => {
      selected.value = element.dataset.value ?? "";
    },
  });
  host.value?.appendChild(list.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-list-host" />
    <p class="doc-demo-hint">当前选中：{{ selected }}</p>
  </div>
</template>
