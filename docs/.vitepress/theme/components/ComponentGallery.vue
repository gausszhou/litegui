<script setup lang="ts">
import { withBase } from "vitepress";

const groups = [
  {
    title: "布局",
    items: [
      { name: "Area", slug: "area", desc: "可分割、可拖拽的布局容器" },
      { name: "Box", slug: "box", desc: "极简 div 容器" },
      { name: "Panel", slug: "panel", desc: "带标题与关闭按钮的面板" },
      { name: "Split", slug: "split", desc: "固定比例分栏" },
      { name: "Tabs", slug: "tabs", desc: "标签页" },
    ],
  },
  {
    title: "浮层",
    items: [
      { name: "Dialog", slug: "dialog", desc: "浮动 / 模态对话框" },
      { name: "Menu", slug: "menu", desc: "菜单栏与多级子菜单" },
      { name: "ContextMenu", slug: "context-menu", desc: "右键菜单" },
    ],
  },
  {
    title: "表单",
    items: [
      { name: "Button", slug: "button", desc: "按钮" },
      { name: "Checkbox", slug: "checkbox", desc: "复选框" },
      { name: "Slider", slug: "slider", desc: "滑块" },
      { name: "SearchBox", slug: "searchbox", desc: "搜索输入框" },
      { name: "Dragger", slug: "dragger", desc: "可拖拽数值输入" },
      { name: "LineEditor", slug: "line-editor", desc: "曲线 / 关键点编辑器" },
    ],
  },
  {
    title: "数据",
    items: [
      { name: "List", slug: "list", desc: "列表" },
      { name: "ComplexList", slug: "complex-list", desc: "带标题、勾选与删除的列表" },
      { name: "Table", slug: "table", desc: "数据表格" },
      { name: "Console", slug: "console", desc: "控制台输出" },
    ],
  },
];
</script>

<template>
  <div class="component-gallery">
    <section v-for="group in groups" :key="group.title" class="component-group">
      <h2>{{ group.title }}</h2>
      <div class="component-grid">
        <a
          v-for="item in group.items"
          :key="item.slug"
          class="component-card"
          :href="withBase(`/components/${item.slug}`)"
        >
          <strong>{{ item.name }}</strong>
          <span>{{ item.desc }}</span>
        </a>
      </div>
    </section>
  </div>
</template>
