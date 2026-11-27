<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Button, Dialog, Panel } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const status = ref("打开中");
let dialog: Dialog | null = null;

onMounted(() => {
  dialog = new Dialog({
    parent: host.value,
    title: "设置",
    width: 300,
    height: 170,
    close: true,
    draggable: true,
    resizable: true,
  });

  dialog.add(new Panel({ content: "这是一个可拖拽、可缩放的浮动对话框。" }));
  dialog.addButtonToFooter("关闭", {
    name: "close",
    close: true,
  });
  dialog.on_close = () => {
    status.value = "已关闭";
  };
  dialog.show();

  host.value?.appendChild(dialog.root);
});

onUnmounted(() => {
  dialog?.close();
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host doc-demo-dialog-host" />
    <p class="doc-demo-hint">状态：{{ status }}（可以直接拖动标题栏或在右下角调整大小）</p>
  </div>
</template>
