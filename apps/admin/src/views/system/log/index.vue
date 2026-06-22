<template>
  <div>
    <PageHeader title="操作日志" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="管理员">
          <a-input v-model:value="searchParams.admin_name" placeholder="管理员名称" allow-clear style="width: 150px" />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-input v-model:value="searchParams.type" placeholder="操作类型" allow-clear style="width: 120px" />
        </a-form-item>
        <a-form-item label="请求地址">
          <a-input v-model:value="searchParams.url" placeholder="请求地址" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="dateRange" style="width: 240px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </SearchForm>

    <!-- Table -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'method'">
            <a-tag :color="getMethodColor(record.method)">{{ record.method }}</a-tag>
          </template>
          <template v-if="column.key === 'add_time'">
            {{ formatTime(record.add_time) }}
          </template>
          <template v-if="column.key === 'action'">
            <a @click="handleDetail(record)">详情</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Detail Modal -->
    <a-modal v-model:open="detailVisible" title="日志详情" :footer="null" width="600px">
      <a-descriptions :column="1" bordered size="small">
        <a-descriptions-item label="操作管理员">{{ currentRecord.admin_name }}</a-descriptions-item>
        <a-descriptions-item label="操作类型">{{ currentRecord.type }}</a-descriptions-item>
        <a-descriptions-item label="请求方式">
          <a-tag :color="getMethodColor(currentRecord.method)">{{ currentRecord.method }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="请求地址">{{ currentRecord.url }}</a-descriptions-item>
        <a-descriptions-item label="IP 地址">{{ currentRecord.ip }}</a-descriptions-item>
        <a-descriptions-item label="操作时间">{{ formatTime(currentRecord.add_time) }}</a-descriptions-item>
        <a-descriptions-item label="操作内容">{{ currentRecord.content }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { getSystemLogList } from '@/api/setting';

const loading = ref(false);
const tableData = ref<any[]>([]);
const detailVisible = ref(false);
const currentRecord = ref<any>({});
const dateRange = ref<any>(null);

const searchParams = reactive({
  admin_name: '',
  type: '',
  url: '',
  start_time: '',
  end_time: '',
  page: 1,
  limit: 15,
});

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '管理员', dataIndex: 'admin_name', key: 'admin_name', width: 120 },
  { title: '操作类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '请求方式', key: 'method', width: 90 },
  { title: '请求地址', dataIndex: 'url', key: 'url', ellipsis: true },
  { title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
  { title: '操作时间', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
];

function getMethodColor(method: string) {
  const map: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
  };
  return map[method] || 'default';
}

function formatTime(timestamp: number) {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getSystemLogList({
      admin_name: searchParams.admin_name || undefined,
      type: searchParams.type || undefined,
      url: searchParams.url || undefined,
      start_time: searchParams.start_time || undefined,
      end_time: searchParams.end_time || undefined,
      page: searchParams.page,
      limit: searchParams.limit,
    });
    const data = res.data;
    tableData.value = data?.data || [];
    pagination.total = data?.total || 0;
  } catch {
    // use empty
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  if (dateRange.value && dateRange.value.length === 2) {
    searchParams.start_time = dateRange.value[0].format('YYYY-MM-DD');
    searchParams.end_time = dateRange.value[1].format('YYYY-MM-DD');
  } else {
    searchParams.start_time = '';
    searchParams.end_time = '';
  }
  searchParams.page = 1;
  pagination.current = 1;
  fetchData();
}

function resetSearch() {
  searchParams.admin_name = '';
  searchParams.type = '';
  searchParams.url = '';
  searchParams.start_time = '';
  searchParams.end_time = '';
  dateRange.value = null;
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleDetail(record: any) {
  currentRecord.value = record;
  detailVisible.value = true;
}

onMounted(fetchData);
</script>
