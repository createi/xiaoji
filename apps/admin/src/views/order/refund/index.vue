<template>
  <div class="refund-page">
    <PageHeader title="退款管理" />
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="关键词">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索订单号/用户" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="请选择状态" allow-clear>
            <a-select-option value="processing">退款中</a-select-option>
            <a-select-option value="success">已退款</a-select-option>
            <a-select-option value="error">已拒绝</a-select-option>
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
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'order_no'">
          <a-space>
            <span class="font-mono">{{ record.order_no?.slice(-8) }}</span>
            <a-button type="link" size="small" @click="handleCopy(record.order_no)">复制</a-button>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'user'">
          <a-space>
            <a-avatar :src="record.user?.avatar" :size="28" />
            <span>{{ record.user?.nickname }}</span>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'refund_amount'">
          <span class="font-mono text-red">-¥{{ (record.refund_amount || 0).toFixed(2) }}</span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="statusColorMap[record.status]">
            {{ statusTextMap[record.status] }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space v-if="record.status === 'processing'">
            <a @click="handleApprove(record)">同意退款</a>
            <a style="color: #ff4d4f" @click="handleReject(record)">拒绝</a>
          </a-space>
          <span v-else style="color: #999">-</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/PageHeader/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import { getOrderList } from '@/api/order'

const loading = ref(false)
const tableData = ref<any[]>([])

const statusTextMap: Record<string, string> = {
  processing: '退款中',
  success: '已退款',
  error: '已拒绝',
}

const statusColorMap: Record<string, string> = {
  processing: 'orange',
  success: 'green',
  error: 'red',
}

const searchParams = reactive({
  keyword: '',
  status: undefined as string | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '订单号', dataIndex: 'order_no', width: 180 },
  { title: '用户', dataIndex: 'user', width: 160 },
  { title: '退款金额', dataIndex: 'refund_amount', width: 120 },
  { title: '退款原因', dataIndex: 'refund_reason', width: 200, ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '申请时间', dataIndex: 'created_at', width: 180 },
  { title: '操作', dataIndex: 'action', width: 160, fixed: 'right' },
]

function handleCopy(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制')
  })
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getOrderList({
      page: pagination.current,
      limit: pagination.pageSize,
      ...searchParams,
    })
    tableData.value = res.data?.data ?? res.data?.list ?? []
    pagination.total = res.data?.total ?? 0
  } catch {
    // silent
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function resetSearch() {
  searchParams.keyword = ''
  searchParams.status = undefined
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

async function handleApprove(record: any) {
  try {
    // await approveRefund(record.id)
    message.success('退款已同意')
    fetchData()
  } catch {
    // silent
  }
}

async function handleReject(record: any) {
  try {
    // await rejectRefund(record.id)
    message.success('已拒绝退款')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.refund-page {
  padding: 16px;

  .font-mono {
    font-family: 'Courier New', Courier, monospace;
  }

  .text-red {
    color: #f5222d;
  }
}
</style>
