<template>
  <div>
    <PageHeader title="用户列表" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="关键词">
          <a-input v-model:value="searchParams.keyword" placeholder="昵称/手机/UID" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="等级">
          <a-select v-model:value="searchParams.level" placeholder="全部等级" allow-clear style="width: 120px">
            <a-select-option v-for="item in levels" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
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
        row-key="uid"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'uid'">
            <span class="font-mono">{{ record.uid }}</span>
          </template>
          <template v-if="column.key === 'avatar'">
            <a-avatar :size="32" :src="record.avatar" style="background: #0256ff">
              {{ record.nickname?.charAt(0) || 'U' }}
            </a-avatar>
          </template>
          <template v-if="column.key === 'nickname'">
            <span>{{ record.nickname || '-' }}</span>
          </template>
          <template v-if="column.key === 'phone'">
            <span class="font-mono">{{ record.phone || '-' }}</span>
          </template>
          <template v-if="column.key === 'balance'">
            <span class="font-mono">{{ record.balance || '0.00' }}</span>
          </template>
          <template v-if="column.key === 'integral'">
            <span class="font-mono">{{ record.integral || 0 }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge :status="record.status === 1 ? 'success' : 'default'" :text="record.status === 1 ? '正常' : '禁用'" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确认删除？" @confirm="handleDelete(record.uid)">
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
import { getUserList, deleteUser, getUserLevelAll } from '@/api/user';

const loading = ref(false);
const tableData = ref<any[]>([]);
const levels = ref<any[]>([]);

const searchParams = reactive({
  keyword: '',
  level: undefined as number | undefined,
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
  { title: 'UID', key: 'uid', width: 80 },
  { title: '', key: 'avatar', width: 50 },
  { title: '昵称', key: 'nickname', ellipsis: true },
  { title: '手机', key: 'phone', width: 120 },
  { title: '余额', key: 'balance', width: 100 },
  { title: '积分', key: 'integral', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '注册时间', dataIndex: 'add_time', width: 160 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getUserList({
      keyword: searchParams.keyword || undefined,
      level: searchParams.level,
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

async function fetchLevels() {
  try {
    const res: any = await getUserLevelAll();
    levels.value = res.data || [];
  } catch {
    // ignore
  }
}

function handleSearch() {
  searchParams.page = 1;
  pagination.current = 1;
  fetchData();
}

function resetSearch() {
  searchParams.keyword = '';
  searchParams.level = undefined;
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

async function handleDelete(uid: number) {
  try {
    await deleteUser(uid);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(() => {
  fetchData();
  fetchLevels();
});
</script>
