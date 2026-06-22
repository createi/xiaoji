<template>
  <div>
    <PageHeader title="主题管理" />

    <a-card>
      <a-row :gutter="16">
        <a-col :span="6" v-for="theme in themes" :key="theme.id">
          <a-card hoverable style="margin-bottom: 16px" :bordered="theme.is_current">
            <template #cover>
              <div style="height: 180px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px;">
                {{ theme.name }}
              </div>
            </template>
            <a-card-meta :title="theme.name" :description="theme.description" />
            <template #actions>
              <a v-if="!theme.is_current" @click="handleApply(theme)">应用</a>
              <a-tag v-else color="green">当前使用</a-tag>
              <a @click="handlePreview(theme)">预览</a>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const themes = ref([
  { id: 1, name: '经典主题', description: '默认电商主题', is_current: true },
  { id: 2, name: '简约主题', description: '简约风格设计', is_current: false },
  { id: 3, name: '活力主题', description: '活力橙色调设计', is_current: false },
  { id: 4, name: '暗色主题', description: '暗色系主题', is_current: false },
]);

function handleApply(theme: any) {
  themes.value.forEach((t) => (t.is_current = false));
  theme.is_current = true;
  message.success(`已切换到 ${theme.name}`);
}

function handlePreview(_theme: any) {
  message.info('预览功能开发中');
}
</script>
