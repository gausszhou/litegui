<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button, Panel } from "@gausszhou/litegui";

const host = ref<HTMLElement>();
const status = ref("待应用");

onMounted(() => {
  const panel = new Panel({
    title: "属性面板",
    close: true,
    height: 170,
  });

  const button = new Button("应用", {
    callback: () => {
      status.value = `已应用（${new Date().toLocaleTimeString()}）`;
    },
  });

  panel.add(button);
  host.value?.appendChild(panel.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host" />
    <p class="doc-demo-hint">状态：{{ status }}</p>
  </div>
</template>
