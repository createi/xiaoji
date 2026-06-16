<template>
  <div>
    <PageHeader title="商品评价" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="商品名称">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索商品名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="评分">
          <a-select v-model:value="searchParams.rating" placeholder="全部评分" allow-clear style="width: 120px">
            <a-select-option :value="5">5分</a-select-option>
            <a-select-option :value="4">4分</a-select-option>
            <a-select-option :value="3">3分</a-select-option>
            <a-select-option :value="2">2分</a-select-option>
            <a-select-option :value="1">1分</a-select-option>
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
          <template v-if="column.key === 'product'">
            <span class="text-ellipsis" style="max-width: 160px; display: inline-block">{{ record.product_name || '-' }}</span>
          </template>
          <template v-if="column.key === 'user'">
            <div>
              <a-avatar :size="24" :src="record.user_avatar" style="margin-right: 4px">
                {{ record.user_name?.charAt(0) }}
              </a-avatar>
              <span>{{ record.user_name || '-' }}</span>
            </div>
          </template>
          <template v-if="column.key === 'rating'">
            <a-rate :value="record.rating" disabled :count="5" />
          </template>
          <template v-if="column.key === 'content'">
            <a-tooltip :title="record.content">
              <span class="text-ellipsis" style="max-width: 180px; display: inline-block">{{ record.content }}</span>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'reply'">
            <a-tooltip :title="record.reply_content">
              <span class="text-ellipsis" style="max-width: 140px; display: inline-block">{{ record.reply_content || '-' }}</span>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleReply(record)">回复</a>
              <a-popconfirm title="确认删除该评价？" @confirm="handleDelete(record.id)">
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
import { getReplyList, deleteReply } from '@/api/product';

const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
  keyword: '',
  rating: undefined as number | undefined,
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
  { title: '商品名称', key: 'product', width: 180 },
  { title: '用户', key: 'user', width: 140 },
  { title: '评分', key: 'rating', width: 140 },
  { title: '评价内容', key: 'content' },
  { title: '回复内容', key: 'reply', width: 160 },
  { title: '评价时间', dataIndex: 'create_time', key: 'create_time', width: 160 },
  { title: '操作', key: 'action', width: 110, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getReplyList({
      keyword: searchParams.keyword || undefined,
      rating: searchParams.rating,
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
  searchParams.rating = undefined;
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleReply(_record: any) {
  message.info('回复功能开发中');
}

async function handleDelete(id: number) {
  try {
    await deleteReply(id);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(fetchData);
</script>
