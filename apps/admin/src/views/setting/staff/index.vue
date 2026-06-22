<template>
  <div>
    <PageHeader title="店员管理" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="所属门店">
          <a-select v-model:value="searchParams.store_id" placeholder="选择门店" allow-clear style="width: 180px">
            <a-select-option v-for="store in storeList" :key="store.id" :value="store.id">{{ store.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="搜索">
          <a-input v-model:value="searchParams.keywords" placeholder="昵称/手机号" allow-clear style="width: 180px" />
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
      <template #extra>
        <a-button type="primary" @click="handleAdd">添加店员</a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <a-space>
              <a-avatar :src="record.avatar" size="small" />
              <span>{{ record.nickname }}</span>
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'default'">
              {{ record.status === 1 ? '正常' : '禁用' }}
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
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { getStaffList, getStoreAll, deleteStaff } from '@/api/setting';

const loading = ref(false);
const tableData = ref<any[]>([]);
const storeList = ref<any[]>([]);

const searchParams = reactive({
  store_id: undefined as number | undefined,
  keywords: '',
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
  { title: '用户', key: 'user', width: 180 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '所属门店', dataIndex: 'store_name', key: 'store_name', width: 150 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '状态', key: 'status', width: 80 },
  { title: '添加时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

async function fetchStores() {
  try {
    const res: any = await getStoreAll();
    storeList.value = res.data || [];
  } catch {
    // ignore
  }
}

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getStaffList({
      store_id: searchParams.store_id,
      keywords: searchParams.keywords || undefined,
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
  searchParams.page = 1;
  pagination.current = 1;
  fetchData();
}

function resetSearch() {
  searchParams.store_id = undefined;
  searchParams.keywords = '';
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleAdd() {
  message.info('添加店员功能开发中');
}

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

async function handleDelete(id: number) {
  try {
    await deleteStaff(id);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(() => {
  fetchStores();
  fetchData();
});
</script>
