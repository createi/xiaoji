<template>
  <div>
    <PageHeader title="发票管理" />

    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="订单号">
          <a-input v-model:value="searchParams.order_id" placeholder="订单号" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="发票类型">
          <a-select v-model:value="searchParams.invoice_type" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="1">个人</a-select-option>
            <a-select-option :value="2">企业</a-select-option>
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
          <template v-if="column.key === 'invoice_type'">
            <a-tag :color="record.invoice_type === 1 ? 'blue' : 'green'">
              {{ record.invoice_type === 1 ? '个人' : '企业' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a @click="handleDetail(record)">详情</a>
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
  order_id: '',
  invoice_type: undefined as number | undefined,
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
  { title: '订单号', dataIndex: 'order_id', key: 'order_id', width: 180 },
  { title: '发票类型', key: 'invoice_type', width: 90 },
  { title: '抬头', dataIndex: 'title', key: 'title', width: 160 },
  { title: '税号', dataIndex: 'tax_no', key: 'tax_no', width: 160 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
  { title: '开票内容', dataIndex: 'invoice_content', key: 'invoice_content', width: 120 },
  { title: '申请时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
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
  searchParams.order_id = '';
  searchParams.invoice_type = undefined;
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleDetail(_record: any) {
  message.info('详情功能开发中');
}

onMounted(fetchData);
</script>
