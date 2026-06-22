<template>
  <div>
    <PageHeader title="员工管理" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加员工</a-button>
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
              {{ record.status === 1 ? '正常' : '禁用' }}
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
  { id: 1, uid: 1001, nickname: '张三', department: '推广一部', role: 'manager', status: 1, add_time: '2024-01-01 00:00:00' },
  { id: 2, uid: 1002, nickname: '李四', department: '推广二部', role: 'staff', status: 1, add_time: '2024-01-05 00:00:00' },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: 'UID', dataIndex: 'uid', key: 'uid', width: 80 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 120 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '状态', key: 'status', width: 80 },
  { title: '添加时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('添加员工功能开发中'); }
function handleEdit(_record: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }

onMounted(() => { loading.value = false; });
</script>
