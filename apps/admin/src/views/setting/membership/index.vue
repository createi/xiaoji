<template>
  <div>
    <PageHeader title="会员等级" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加等级</a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="40" :height="40" style="border-radius: 4px" />
          </template>
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
  { id: 1, name: '普通会员', image: '', grade: 0, one_brokerage_percent: 5, two_brokerage_percent: 3, task_total_num: 100, task_num: 0, status: 1 },
  { id: 2, name: '银卡会员', image: '', grade: 1, one_brokerage_percent: 8, two_brokerage_percent: 5, task_total_num: 500, task_num: 0, status: 1 },
  { id: 3, name: '金卡会员', image: '', grade: 2, one_brokerage_percent: 12, two_brokerage_percent: 8, task_total_num: 2000, task_num: 0, status: 1 },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '图标', key: 'image', width: 80 },
  { title: '等级名称', dataIndex: 'name', key: 'name', width: 140 },
  { title: '等级值', dataIndex: 'grade', key: 'grade', width: 80 },
  { title: '一级佣金(%)', dataIndex: 'one_brokerage_percent', key: 'one_brokerage_percent', width: 120 },
  { title: '二级佣金(%)', dataIndex: 'two_brokerage_percent', key: 'two_brokerage_percent', width: 120 },
  { title: '任务总数', dataIndex: 'task_total_num', key: 'task_total_num', width: 100 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() {
  message.info('添加等级功能开发中');
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
