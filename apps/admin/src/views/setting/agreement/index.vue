<template>
  <div>
    <PageHeader title="协议管理" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加协议</a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'default'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)">
                <a style="color: #f5222d">删除</a>
              </a-popconfirm>
            </a-space>
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
  { id: 1, title: '用户服务协议', status: 1, add_time: '2024-01-01 00:00:00' },
  { id: 2, title: '隐私政策', status: 1, add_time: '2024-01-01 00:00:00' },
  { id: 3, title: '退款协议', status: 1, add_time: '2024-01-01 00:00:00' },
  { id: 4, title: '会员服务协议', status: 0, add_time: '2024-01-05 10:00:00' },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '协议标题', dataIndex: 'title', key: 'title' },
  { title: '状态', key: 'status', width: 80 },
  { title: '添加时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() {
  message.info('添加协议功能开发中');
}

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

function handleDelete(_id: number) {
  message.success('删除成功');
}

onMounted(() => {
  loading.value = false;
});
</script>
