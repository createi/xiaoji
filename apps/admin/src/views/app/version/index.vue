<template>
  <div>
    <PageHeader title="版本管理" />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加版本</a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'platform'">
            <a-tag :color="record.platform === 'ios' ? 'blue' : record.platform === 'android' ? 'green' : 'orange'">
              {{ record.platform === 'ios' ? 'iOS' : record.platform === 'android' ? 'Android' : 'H5' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'is_force'">
            <a-tag :color="record.is_force ? 'red' : 'default'">
              {{ record.is_force ? '强制更新' : '非强制' }}
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
  { id: 1, platform: 'ios', version: '1.2.0', build: 12, is_force: false, download_url: '', add_time: '2024-01-15 10:00:00' },
  { id: 2, platform: 'android', version: '1.2.0', build: 12, is_force: false, download_url: '', add_time: '2024-01-15 10:00:00' },
  { id: 3, platform: 'h5', version: '1.2.0', build: 12, is_force: false, download_url: '', add_time: '2024-01-15 10:00:00' },
]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '平台', key: 'platform', width: 100 },
  { title: '版本号', dataIndex: 'version', key: 'version', width: 120 },
  { title: 'Build', dataIndex: 'build', key: 'build', width: 80 },
  { title: '强制更新', key: 'is_force', width: 110 },
  { title: '下载地址', dataIndex: 'download_url', key: 'download_url', ellipsis: true },
  { title: '更新时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleAdd() { message.info('添加版本功能开发中'); }
function handleEdit(_record: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }

onMounted(() => { loading.value = false; });
</script>
