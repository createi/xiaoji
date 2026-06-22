<template>
  <div>
    <PageHeader title="服务保障" />
    <a-card>
      <template #extra><a-button type="primary" @click="handleAdd">添加保障</a-button></template>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" row-key="id">
        <template #bodyCell="{ column, record }">
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
  { id: 1, name: '7天无理由退换', description: '购买后7天内支持无理由退换货', sort: 1, status: 1 },
  { id: 2, name: '正品保障', description: '所有商品均为正品行货', sort: 2, status: 1 },
  { id: 3, name: '假一赔十', description: '如发现假货，十倍赔偿', sort: 3, status: 1 },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '保障名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('添加保障功能开发中'); }
function handleEdit(_r: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }
onMounted(() => { loading.value = false; });
</script>
