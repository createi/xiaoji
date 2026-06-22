<template>
  <div>
    <PageHeader title="资金流水" />

    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="UID">
          <a-input v-model:value="searchParams.uid" placeholder="用户 UID" allow-clear style="width: 120px" />
        </a-form-item>
        <a-form-item label="交易类型">
          <a-select v-model:value="searchParams.type" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="1">充值</a-select-option>
            <a-select-option :value="2">消费</a-select-option>
            <a-select-option :value="3">提现</a-select-option>
            <a-select-option :value="4">佣金</a-select-option>
            <a-select-option :value="5">其他</a-select-option>
          </a-select>
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
          <template v-if="column.key === 'number'">
            <span :style="{ color: record.number > 0 ? '#52c41a' : '#f5222d' }">
              {{ record.number > 0 ? '+' : '' }}{{ record.number }}
            </span>
          </template>
          <template v-if="column.key === 'type'">
            {{ getTypeName(record.type) }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';

const loading = ref(false);
const tableData = ref<any[]>([]);
const dateRange = ref<any>(null);

const searchParams = reactive({
  uid: '',
  type: undefined as number | undefined,
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
  { title: 'UID', dataIndex: 'uid', key: 'uid', width: 80 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '金额', key: 'number', width: 100 },
  { title: '余额', dataIndex: 'balance', key: 'balance', width: 100 },
  { title: '类型', key: 'type', width: 90 },
  { title: '备注', dataIndex: 'mark', key: 'mark', ellipsis: true },
  { title: '时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
];

function getTypeName(type: number) {
  const map: Record<number, string> = {
    1: '充值',
    2: '消费',
    3: '提现',
    4: '佣金',
    5: '其他',
  };
  return map[type] || '未知';
}

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
  searchParams.uid = '';
  searchParams.type = undefined;
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

onMounted(fetchData);
</script>
