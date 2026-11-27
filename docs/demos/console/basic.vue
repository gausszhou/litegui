<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button, Console } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const toolbar = ref<HTMLElement>();

onMounted(() => {
  const consolePanel = new Console({ prompt: ">" });
  consolePanel.addMessage("LiteGUI Console 就绪", "good");
  host.value?.appendChild(consolePanel.root);

  const add = (text: string, className: string) => {
    consolePanel.addMessage(text, className);
  };
  for (const [label, className] of [
    ["普通日志", "msglog"],
    ["警告", "msgwarn"],
    ["错误", "msgerror"],
  ] as const) {
    toolbar.value?.appendChild(
      new Button(label, { size: "small", callback: () => add(`[${label}] ${new Date().toLocaleTimeString()}`, className) }).root,
    );
  }
});
</script>

<template>
  <div class="doc-demo">
    <div ref="toolbar" class="doc-demo-row" />
    <div ref="host" class="doc-demo-console-host" />
    <p class="doc-demo-hint">在输入框回车会把命令写进日志；`onProcessCommand` 可接管命令。</p>
  </div>
</template>
