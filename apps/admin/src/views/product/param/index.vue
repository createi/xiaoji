<template>
  <div>
    <PageHeader title="商品参数" />
    <a-card>
      <template #extra><a-button type="primary" @click="handleAdd">添加参数</a-button></template>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" row-key="id">
        <template #bodyCell="{ column, record }">
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
  { id: 1, name: '材质', value: '棉,涤纶,尼龙', sort: 1 },
  { id: 2, name: '产地', value: '中国', sort: 2 },
  { id: 3, name: '适用人群', value: '通用', sort: 3 },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '参数名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '参数值', dataIndex: 'value', key: 'value', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('添加参数功能开发中'); }
function handleEdit(_r: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }
onMounted(() => { loading.value = false; });
</script>
