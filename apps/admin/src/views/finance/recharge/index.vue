<template>
  <div>
    <PageHeader title="充值记录" />
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="用户">
          <a-input v-model:value="searchParams.nickname" placeholder="昵称/UID" allow-clear style="width: 180px" />
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="dateRange" style="width: 240px" />
        </a-form-item>
        <a-form-item>
          <a-space><a-button type="primary" html-type="submit">搜索</a-button><a-button @click="resetSearch">重置</a-button></a-space>
        </a-form-item>
      </a-form>
    </SearchForm>
    <a-card>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'warning'">{{ record.status === 1 ? '已到账' : '处理中' }}</a-tag>
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
const searchParams = reactive({ nickname: '', start_time: '', end_time: '', page: 1, limit: 15 });
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` });
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '充值金额', dataIndex: 'price', key: 'price', width: 100 },
  { title: '赠送金额', dataIndex: 'gift_price', key: 'gift_price', width: 100 },
  { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type', width: 100 },
  { title: '状态', key: 'status', width: 90 },
  { title: '时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
];
async function fetchData() { loading.value = true; try { tableData.value = []; pagination.total = 0; } catch {} finally { loading.value = false; } }
function handleSearch() { searchParams.page = 1; pagination.current = 1; fetchData(); }
function resetSearch() { searchParams.nickname = ''; dateRange.value = null; handleSearch(); }
function handleTableChange(pag: any) { searchParams.page = pag.current; pagination.current = pag.current; fetchData(); }
onMounted(fetchData);
</script>
