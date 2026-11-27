<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const clicks = ref(0);

onMounted(() => {
  const button = new Button("点我 +1", {
    callback: () => {
      clicks.value += 1;
    },
  });
  host.value?.appendChild(button.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row" />
    <p class="doc-demo-hint">已点击 {{ clicks }} 次</p>
  </div>
</template>
