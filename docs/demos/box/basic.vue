<script setup lang="ts">
import { onMounted, ref } from "vue";
import { LiteBox } from "@gausszhou/litegui";

const host = ref<HTMLElement>();

onMounted(() => {
  const box = new LiteBox();
  box.root.className = "doc-pane";
  box.root.textContent = "LiteBox 是一个极简容器：只提供一个 div 和可选的点击阻断。";
  host.value?.appendChild(box.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host" />
    <p class="doc-demo-hint">Box 常被当作 Tree / Inspector 内部的轻量容器使用。</p>
  </div>
</template>
