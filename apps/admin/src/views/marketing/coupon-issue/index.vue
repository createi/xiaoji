<template>
  <div>
    <PageHeader title="优惠券发放" />
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="优惠券">
          <a-input v-model:value="searchParams.coupon_name" placeholder="优惠券名称" allow-clear style="width: 180px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
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
      <template #extra>
        <a-button type="primary" @click="handleAdd">新增发放</a-button>
      </template>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'default'">{{ record.status === 1 ? '启用' : '禁用' }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)"><a style="color: #f5222d">删除</a></a-popconfirm>
            </a-space>
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
const searchParams = reactive({ coupon_name: '', status: undefined as number | undefined, page: 1, limit: 15 });
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` });
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '优惠券名称', dataIndex: 'coupon_name', key: 'coupon_name', width: 160 },
  { title: '发放类型', dataIndex: 'type_name', key: 'type_name', width: 100 },
  { title: '领取限制', dataIndex: 'stay_limit', key: 'stay_limit', width: 100 },
  { title: '已领取', dataIndex: 'received', key: 'received', width: 80 },
  { title: '已使用', dataIndex: 'used', key: 'used', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try { tableData.value = []; pagination.total = 0; } catch {} finally { loading.value = false; }
}
function handleSearch() { searchParams.page = 1; pagination.current = 1; fetchData(); }
function resetSearch() { searchParams.coupon_name = ''; searchParams.status = undefined; handleSearch(); }
function handleTableChange(pag: any) { searchParams.page = pag.current; searchParams.limit = pag.pageSize; pagination.current = pag.current; fetchData(); }
function handleAdd() { message.info('新增发放功能开发中'); }
function handleEdit(_r: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }
onMounted(fetchData);
</script>
