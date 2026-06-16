<template>
  <div>
    <PageHeader title="订单列表" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="订单状态">
          <a-select v-model:value="searchParams.status" placeholder="全部状态" allow-clear style="width: 130px">
            <a-select-option :value="0">待付款</a-select-option>
            <a-select-option :value="1">待发货</a-select-option>
            <a-select-option :value="2">已发货</a-select-option>
            <a-select-option :value="3">已完成</a-select-option>
            <a-select-option :value="-1">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键词">
          <a-input v-model:value="searchParams.keyword" placeholder="订单号/用户" allow-clear style="width: 180px" />
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
          <template v-if="column.key === 'order_no'">
            <a-tooltip :title="record.orderId">
              <span class="font-mono">{{ record.orderId?.slice(-8) }}</span>
            </a-tooltip>
            <a class="copy-btn" @click="copyText(record.orderId)">复制</a>
          </template>
          <template v-if="column.key === 'user'">
            <span>{{ record.realName || '-' }}</span>
          </template>
          <template v-if="column.key === 'goods'">
            <div class="flex-center">
              <img :src="record.cartInfos?.[0]?.image" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover; margin-right: 8px" />
              <span class="text-ellipsis" style="max-width: 160px">{{ record.cartInfos?.[0]?.storeName }}</span>
            </div>
          </template>
          <template v-if="column.key === 'total_price'">
            <span class="font-mono">{{ record.totalPrice }}</span>
          </template>
          <template v-if="column.key === 'pay_type'">
            <a-tag :color="record.paid === 1 ? 'green' : 'blue'">
              {{ record.paid === 1 ? '已支付' : '待支付' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="router.push(`/order/detail/${record.id}`)">详情</a>
              <a v-if="record.status === 1" @click="handleShip(record)">发货</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { getOrderList } from '@/api/order';

const router = useRouter();
const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
  status: undefined as number | undefined,
  keyword: '',
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
  { title: '订单号', key: 'order_no', width: 160 },
  { title: '用户', key: 'user', width: 140 },
  { title: '商品', key: 'goods' },
  { title: '数量', dataIndex: 'totalNum', width: 70 },
  { title: '金额', key: 'total_price', width: 100 },
  { title: '支付方式', key: 'pay_type', width: 100 },
  { title: '状态', key: 'status', width: 90 },
  { title: '下单时间', dataIndex: 'addTime', width: 160 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function statusText(s: number) {
  return ({ '-1': '已取消', 0: '待付款', 1: '待发货', 2: '已发货', 3: '已完成' } as Record<number, string>)[s] || '未知';
}

function statusColor(s: number) {
  return ({ '-1': 'default', 0: 'default', 1: 'processing', 2: 'orange', 3: 'success' } as Record<number, string>)[s] || 'default';
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => message.success('已复制'));
}

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getOrderList({
      status: searchParams.status,
      keyword: searchParams.keyword || undefined,
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
  searchParams.status = undefined;
  searchParams.keyword = '';
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleShip(_record: any) {
  message.info('发货功能开发中');
}

onMounted(fetchData);
</script>

<style scoped lang="scss">
.copy-btn {
  margin-left: 4px;
  font-size: 12px;
}
</style>
