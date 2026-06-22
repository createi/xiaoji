<template>
  <div>
    <PageHeader title="积分订单" />
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="订单号">
          <a-input v-model:value="searchParams.order_id" placeholder="订单号" allow-clear style="width: 200px" />
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
            <a-tag :color="record.status === 1 ? 'success' : record.status === 0 ? 'warning' : 'error'">
              {{ record.status === 0 ? '待确认' : record.status === 1 ? '已完成' : '已取消' }}
            </a-tag>
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
const searchParams = reactive({ order_id: '', page: 1, limit: 15 });
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` });
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '订单号', dataIndex: 'order_id', key: 'order_id', width: 180 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '商品', dataIndex: 'store_name', key: 'store_name', ellipsis: true },
  { title: '积分', dataIndex: 'integral', key: 'integral', width: 100 },
  { title: '状态', key: 'status', width: 90 },
  { title: '时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
];
async function fetchData() { loading.value = true; try { tableData.value = []; pagination.total = 0; } catch {} finally { loading.value = false; } }
function handleSearch() { searchParams.page = 1; pagination.current = 1; fetchData(); }
function resetSearch() { searchParams.order_id = ''; handleSearch(); }
function handleTableChange(pag: any) { searchParams.page = pag.current; pagination.current = pag.current; fetchData(); }
onMounted(fetchData);
</script>
