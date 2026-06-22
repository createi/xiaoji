<template>
  <div>
    <PageHeader title="注销申请" />
    <a-card>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 0 ? 'warning' : record.status === 1 ? 'success' : 'error'">
              {{ record.status === 0 ? '待审核' : record.status === 1 ? '已通过' : '已拒绝' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space v-if="record.status === 0">
              <a @click="handleApprove(record)">通过</a>
              <a style="color: #f5222d" @click="handleReject(record)">拒绝</a>
            </a-space>
            <a v-else>详情</a>
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
  { id: 1, uid: 1005, nickname: '用户***5', phone: '138****8888', reason: '不再使用', status: 0, add_time: '2024-01-15 10:00:00' },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: 'UID', dataIndex: 'uid', key: 'uid', width: 80 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '注销原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
  { title: '状态', key: 'status', width: 100 },
  { title: '申请时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleApprove(record: any) { record.status = 1; message.success('审核通过'); }
function handleReject(record: any) { record.status = 2; message.success('已拒绝'); }
onMounted(() => { loading.value = false; });
</script>
