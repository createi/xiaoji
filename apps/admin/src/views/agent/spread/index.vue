<template>
  <div>
    <PageHeader title="推广申请" />

    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="0">待审核</a-select-option>
            <a-select-option :value="1">已通过</a-select-option>
            <a-select-option :value="2">已拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </SearchForm>

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
            <a v-else @click="handleDetail(record)">详情</a>
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
import SearchForm from '@/components/SearchForm/index.vue';

const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
  status: undefined as number | undefined,
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
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: 'UID', dataIndex: 'uid', key: 'uid', width: 80 },
  { title: '状态', key: 'status', width: 100 },
  { title: '申请时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    tableData.value = [];
    pagination.total = 0;
  } catch {
    // use empty
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  searchParams.page = 1;
  pagination.current = 1;
  fetchData();
}

function resetSearch() {
  searchParams.status = undefined;
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleApprove(record: any) {
  record.status = 1;
  message.success('审核通过');
}

function handleReject(record: any) {
  record.status = 2;
  message.success('已拒绝');
}

function handleDetail(_record: any) {
  message.info('详情功能开发中');
}

onMounted(fetchData);
</script>
