<template>
  <div>
    <PageHeader title="图文管理" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">新建图文</a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <a-space>
              <a-image :src="record.image" :width="40" :height="40" style="border-radius: 4px" v-if="record.image" />
              <span>{{ record.title }}</span>
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'default'">
              {{ record.status === 1 ? '已发布' : '草稿' }}
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
  { id: 1, title: '商城活动公告', image: '', author: '管理员', visit: 1250, status: 1, add_time: '2024-01-10 10:00:00' },
  { id: 2, title: '新品上架通知', image: '', author: '管理员', visit: 860, status: 1, add_time: '2024-01-12 14:30:00' },
  { id: 3, title: '春节放假通知', image: '', author: '管理员', visit: 2100, status: 1, add_time: '2024-01-15 09:00:00' },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '标题', key: 'title', width: 250 },
  { title: '作者', dataIndex: 'author', key: 'author', width: 100 },
  { title: '阅读量', dataIndex: 'visit', key: 'visit', width: 90 },
  { title: '状态', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('新建图文功能开发中'); }
function handleEdit(_record: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }

onMounted(() => { loading.value = false; });
</script>
