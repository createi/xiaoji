<template>
  <div>
    <PageHeader title="领券记录" />
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="用户">
          <a-input v-model:value="searchParams.nickname" placeholder="昵称/UID" allow-clear style="width: 180px" />
        </a-form-item>
        <a-form-item label="使用状态">
          <a-select v-model:value="searchParams.status" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="0">未使用</a-select-option>
            <a-select-option :value="1">已使用</a-select-option>
            <a-select-option :value="2">已过期</a-select-option>
          </a-select>
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
            <a-tag :color="record.status === 0 ? 'blue' : record.status === 1 ? 'green' : 'default'">
              {{ record.status === 0 ? '未使用' : record.status === 1 ? '已使用' : '已过期' }}
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
const searchParams = reactive({ nickname: '', status: undefined as number | undefined, page: 1, limit: 15 });
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` });
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '优惠券名称', dataIndex: 'coupon_name', key: 'coupon_name', width: 160 },
  { title: '面值', dataIndex: 'coupon_price', key: 'coupon_price', width: 80 },
  { title: '使用门槛', dataIndex: 'use_min_price', key: 'use_min_price', width: 100 },
  { title: '状态', key: 'status', width: 90 },
  { title: '领取时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '使用时间', dataIndex: 'used_time', key: 'used_time', width: 170 },
];
async function fetchData() { loading.value = true; try { tableData.value = []; pagination.total = 0; } catch {} finally { loading.value = false; } }
function handleSearch() { searchParams.page = 1; pagination.current = 1; fetchData(); }
function resetSearch() { searchParams.nickname = ''; searchParams.status = undefined; handleSearch(); }
function handleTableChange(pag: any) { searchParams.page = pag.current; pagination.current = pag.current; fetchData(); }
onMounted(fetchData);
</script>
