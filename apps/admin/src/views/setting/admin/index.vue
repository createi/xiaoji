<template>
  <div>
    <PageHeader title="管理员管理" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="用户名">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索用户名" allow-clear style="width: 180px" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="searchParams.role_id" placeholder="全部角色" allow-clear style="width: 150px">
            <a-select-option v-for="item in roleOptions" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="全部状态" allow-clear style="width: 120px">
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
          <template v-if="column.key === 'avatar'">
            <a-avatar :size="36" :src="record.avatar">
              {{ record.username?.charAt(0) }}
            </a-avatar>
          </template>
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role?.color || 'blue'">{{ record.role?.name || '-' }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'default'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
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
import { getUserList } from '@/api/user';
import { getRoleAll } from '@/api/setting';

const loading = ref(false);
const tableData = ref<any[]>([]);
const roleOptions = ref<any[]>([]);

const searchParams = reactive({
  keyword: '',
  role_id: undefined as number | undefined,
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
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '头像', key: 'avatar', width: 80 },
  { title: '用户名', dataIndex: 'username', key: 'username', width: 140 },
  { title: '真实姓名', dataIndex: 'realname', key: 'realname', width: 120 },
  { title: '角色', key: 'role', width: 120 },
  { title: '状态', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
];

async function fetchRoles() {
  try {
    const res: any = await getRoleAll();
    roleOptions.value = res.data || [];
  } catch {
    // use empty
  }
}

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getUserList({
      keyword: searchParams.keyword || undefined,
      role_id: searchParams.role_id,
      status: searchParams.status,
      page: searchParams.page,
      limit: searchParams.limit,
    });
    const data = res.data;
    tableData.value = data?.data || data?.list || [];
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
  searchParams.keyword = '';
  searchParams.role_id = undefined;
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

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

onMounted(() => {
  fetchRoles();
  fetchData();
});
</script>
