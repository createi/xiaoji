<template>
  <div>
    <PageHeader title="DIY 编辑器">
      <template #extra>
        <a-space>
          <a-button @click="handlePreview">预览</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </a-space>
      </template>
    </PageHeader>

    <div class="diy-editor">
      <!-- 左侧组件面板 -->
      <div class="diy-left">
        <div class="panel-title">组件库</div>
        <div class="component-list">
          <div
            v-for="comp in componentTypes"
            :key="comp.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart(comp)"
          >
            <span class="comp-icon">{{ comp.icon }}</span>
            <span>{{ comp.name }}</span>
          </div>
        </div>
      </div>

      <!-- 中间画布 -->
      <div class="diy-center">
        <div class="canvas-area">
          <div
            v-for="(item, index) in pageData"
            :key="index"
            class="canvas-item"
            :class="{ active: selectedIndex === index }"
            @click="selectItem(index)"
          >
            <div class="item-label">{{ getComponentName(item.type) }}</div>
            <div class="item-preview">{{ JSON.stringify(item).substring(0, 50) }}...</div>
            <div class="item-actions">
              <a-button size="small" @click.stop="moveUp(index)" :disabled="index === 0">↑</a-button>
              <a-button size="small" @click.stop="moveDown(index)" :disabled="index === pageData.length - 1">↓</a-button>
              <a-button size="small" danger @click.stop="removeItem(index)">删除</a-button>
            </div>
          </div>
          <div v-if="pageData.length === 0" class="canvas-empty">
            拖拽组件到此处或点击组件添加
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="diy-right">
        <div class="panel-title">属性配置</div>
        <div v-if="selectedIndex >= 0 && pageData[selectedIndex]" class="property-panel">
          <a-form layout="vertical" size="small">
            <a-form-item label="组件类型">
              <a-input :value="getComponentName(pageData[selectedIndex].type)" disabled />
            </a-form-item>
            <template v-if="pageData[selectedIndex].type === 'banner'">
              <a-form-item label="轮播图片">
                <a-button block @click="handleAddBanner">+ 添加图片</a-button>
              </a-form-item>
            </template>
            <template v-if="pageData[selectedIndex].type === 'title'">
              <a-form-item label="标题文字">
                <a-input v-model:value="pageData[selectedIndex].title" />
              </a-form-item>
            </template>
            <template v-if="pageData[selectedIndex].type === 'product'">
              <a-form-item label="展示数量">
                <a-input-number v-model:value="pageData[selectedIndex].count" :min="1" :max="10" />
              </a-form-item>
            </template>
          </a-form>
        </div>
        <div v-else class="property-empty">
          请选择一个组件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import PageHeader from '@/components/PageHeader/index.vue';

const route = useRoute();
const templateId = route.params.id;

const selectedIndex = ref(-1);

const componentTypes = [
  { type: 'banner', name: '轮播图', icon: '🖼️' },
  { type: 'nav', name: '导航图标', icon: '🧭' },
  { type: 'title', name: '标题栏', icon: '📝' },
  { type: 'product', name: '商品列表', icon: '🛍️' },
  { type: 'coupon', name: '优惠券', icon: '🎫' },
  { type: 'seckill', name: '秒杀专区', icon: '⚡' },
  { type: 'rich_text', name: '富文本', icon: '📄' },
  { type: 'image', name: '图片广告', icon: '🖼️' },
  { type: 'video', name: '视频', icon: '🎬' },
  { type: 'gap', name: '分割线', icon: '➖' },
  { type: 'blank', name: '空白间距', icon: '⬜' },
];

const pageData = ref<any[]>([
  { type: 'banner', images: [] },
  { type: 'nav', items: [] },
  { type: 'title', title: '热门商品' },
  { type: 'product', count: 4 },
]);

function getComponentName(type: string) {
  return componentTypes.find((c) => c.type === type)?.name || type;
}

function selectItem(index: number) {
  selectedIndex.value = index;
}

function handleDragStart(comp: any) {
  pageData.value.push({ type: comp.type });
  message.success(`已添加 ${comp.name} 组件`);
}

function moveUp(index: number) {
  if (index > 0) {
    const temp = pageData.value[index];
    pageData.value[index] = pageData.value[index - 1];
    pageData.value[index - 1] = temp;
    selectedIndex.value = index - 1;
  }
}

function moveDown(index: number) {
  if (index < pageData.value.length - 1) {
    const temp = pageData.value[index];
    pageData.value[index] = pageData.value[index + 1];
    pageData.value[index + 1] = temp;
    selectedIndex.value = index + 1;
  }
}

function removeItem(index: number) {
  pageData.value.splice(index, 1);
  selectedIndex.value = -1;
}

function handleAddBanner() {
  message.info('添加轮播图功能开发中');
}

function handlePreview() {
  message.info('预览功能开发中');
}

function handleSave() {
  message.success('模板保存成功');
}
</script>

<style scoped>
.diy-editor {
  display: flex;
  height: calc(100vh - 180px);
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.diy-left {
  width: 220px;
  border-right: 1px solid #d9d9d9;
  background: #fff;
  overflow-y: auto;
}
.diy-center {
  flex: 1;
  background: #f5f5f5;
  padding: 16px;
  overflow-y: auto;
}
.diy-right {
  width: 280px;
  border-left: 1px solid #d9d9d9;
  background: #fff;
  overflow-y: auto;
}
.panel-title {
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
.component-list {
  padding: 8px;
}
.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
}
.component-item:hover {
  background: #e6f7ff;
}
.comp-icon {
  font-size: 18px;
}
.canvas-area {
  min-height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
}
.canvas-item {
  border: 2px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
}
.canvas-item.active {
  border-color: #1890ff;
}
.canvas-empty {
  text-align: center;
  color: #999;
  padding: 60px 0;
}
.item-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.item-preview {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}
.item-actions {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}
.property-panel {
  padding: 16px;
}
.property-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>
