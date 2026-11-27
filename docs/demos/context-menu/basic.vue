<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ContextMenu } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const last = ref("（尚未操作）");
let menu: ContextMenu | null = null;

function open(event: MouseEvent) {
  event.preventDefault();
  menu?.close();
  menu = new ContextMenu(
    [
      { title: "重命名", callback: () => (last.value = "重命名") },
      { title: "复制", callback: () => (last.value = "复制") },
      { title: "删除", callback: () => (last.value = "删除") },
    ],
    { event, container: host.value },
  );
}

onUnmounted(() => menu?.close());
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host">
      <div class="doc-context-target" @contextmenu="open">在这里点右键</div>
    </div>
    <p class="doc-demo-hint">最近操作：{{ last }}</p>
  </div>
</template>
