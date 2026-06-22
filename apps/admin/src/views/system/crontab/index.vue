<template>
  <div>
    <PageHeader title="定时任务" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加任务</a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 1"
              checked-children="运行"
              un-checked-children="暂停"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
            />
          </template>
          <template v-if="column.key === 'lastRun'">
            {{ record.lastRun || '从未执行' }}
          </template>
          <template v-if="column.key === 'nextRun'">
            {{ record.nextRun || '-' }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="handleRunOnce(record)">执行一次</a>
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
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const loading = ref(false);

const tableData = ref([
  {
    id: 1,
    name: '订单自动完成',
    command: 'OrderAutoComplete',
    cron: '0 0 * * *',
    status: 1,
    lastRun: '2024-01-15 00:00:00',
    nextRun: '2024-01-16 00:00:00',
    remark: '自动完成超过7天未收货的订单',
  },
  {
    id: 2,
    name: '优惠券过期处理',
    command: 'CouponExpire',
    cron: '0 1 * * *',
    status: 1,
    lastRun: '2024-01-15 01:00:00',
    nextRun: '2024-01-16 01:00:00',
    remark: '处理过期的优惠券',
  },
  {
    id: 3,
    name: '清理过期签到',
    command: 'SignClean',
    cron: '0 2 * * 0',
    status: 0,
    lastRun: '2024-01-14 02:00:00',
    nextRun: '-',
    remark: '每周清理过期的签到记录',
  },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '任务名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '命令标识', dataIndex: 'command', key: 'command', width: 160 },
  { title: 'Cron 表达式', dataIndex: 'cron', key: 'cron', width: 140 },
  { title: '状态', key: 'status', width: 100 },
  { title: '上次执行', key: 'lastRun', width: 170 },
  { title: '下次执行', key: 'nextRun', width: 170 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
];

function handleAdd() {
  message.info('添加任务功能开发中');
}

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

function handleStatusChange(record: any, checked: boolean) {
  record.status = checked ? 1 : 0;
  message.success(`${record.name} 已${checked ? '启用' : '暂停'}`);
}

function handleRunOnce(record: any) {
  message.success(`${record.name} 执行任务已提交`);
}

function handleDelete(_id: number) {
  message.success('删除成功');
}

onMounted(() => {
  loading.value = false;
});
</script>
