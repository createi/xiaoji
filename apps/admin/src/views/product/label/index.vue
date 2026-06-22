<template>
  <div>
    <PageHeader title="商品标签" />
    <a-card>
      <template #extra><a-button type="primary" @click="handleAdd">添加标签</a-button></template>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'color'"><div :style="{ width: '24px', height: '24px', borderRadius: '4px', background: record.color }"></div></template>
          <template v-if="column.key === 'status'"><a-tag :color="record.status === 1 ? 'success' : 'default'">{{ record.status === 1 ? '启用' : '禁用' }}</a-tag></template>
          <template v-if="column.key === 'action'">
            <a-space><a @click="handleEdit(record)">编辑</a><a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)"><a style="color: #f5222d">删除</a></a-popconfirm></a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const loading = ref(false);
const tableData = ref([
  { id: 1, name: '新品', color: '#ff6600', sort: 1, status: 1 },
  { id: 2, name: '热卖', color: '#f5222d', sort: 2, status: 1 },
  { id: 3, name: '推荐', color: '#1890ff', sort: 3, status: 1 },
  { id: 4, name: '包邮', color: '#52c41a', sort: 4, status: 1 },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '标签名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '颜色', key: 'color', width: 80 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('添加标签功能开发中'); }
function handleEdit(_r: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }
onMounted(() => { loading.value = false; });
</script>
