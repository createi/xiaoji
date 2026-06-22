<template>
  <div>
    <PageHeader title="DIY 模板列表" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">新建模板</a-button>
      </template>

      <a-row :gutter="16">
        <a-col :span="6" v-for="item in templates" :key="item.id">
          <a-card hoverable style="margin-bottom: 16px">
            <template #cover>
              <div style="height: 200px; background: #f0f2f5; display: flex; align-items: center; justify-content: center; color: #999;">
                预览图
              </div>
            </template>
            <a-card-meta :title="item.name" :description="item.description" />
            <template #actions>
              <a @click="handleEdit(item)">编辑</a>
              <a @click="handlePreview(item)">预览</a>
              <a-popconfirm title="确认删除？" @confirm="handleDelete(item.id)">
                <a style="color: #f5222d">删除</a>
              </a-popconfirm>
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
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader/index.vue';

const router = useRouter();

const templates = ref([
  { id: 1, name: '首页模板A', description: '标准电商首页布局', is_default: true, add_time: '2024-01-01' },
  { id: 2, name: '首页模板B', description: '简约风格首页', is_default: false, add_time: '2024-01-05' },
  { id: 3, name: '用户中心模板', description: '用户中心自定义布局', is_default: false, add_time: '2024-01-10' },
]);

function handleAdd() {
  message.info('新建模板功能开发中');
}

function handleEdit(item: any) {
  router.push(`/diy/edit/${item.id}`);
}

function handlePreview(_item: any) {
  message.info('预览功能开发中');
}

function handleDelete(_id: number) {
  message.success('删除成功');
}
</script>
