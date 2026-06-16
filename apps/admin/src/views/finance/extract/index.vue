<template>
  <div class="extract-page">
    <PageHeader title="提现管理" />
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="用户">
          <a-input v-model:value="searchParams.userId" placeholder="请输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="请选择状态" allow-clear>
            <a-select-option :value="0">待审核</a-select-option>
            <a-select-option :value="1">已通过</a-select-option>
            <a-select-option :value="2">已拒绝</a-select-option>
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
        <template v-if="column.dataIndex === 'amount'">
          <span class="font-mono">{{ record.amount }}</span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="statusColor(record.status)">
            {{ statusText(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space v-if="record.status === 0">
            <a-popconfirm title="确定通过该申请？" @confirm="handleApprove(record)">
              <a style="color: #52c41a">通过</a>
            </a-popconfirm>
            <a-popconfirm title="确定拒绝该申请？" @confirm="handleReject(record)">
              <a style="color: #ff4d4f">拒绝</a>
            </a-popconfirm>
          </a-space>
          <span v-else>-</span>
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
import { getExtractList, auditExtract } from '@/api/finance'

const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  userId: '',
  status: undefined as number | undefined,
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
  { title: '用户', dataIndex: 'userId', width: 120 },
  { title: '提现金额', dataIndex: 'amount', width: 120 },
  { title: '提现方式', dataIndex: 'method', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '申请时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' },
]

function statusColor(status: number) {
  const map: Record<number, string> = { 0: 'processing', 1: 'success', 2: 'error' }
  return map[status] ?? 'default'
}

function statusText(status: number) {
  const map: Record<number, string> = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
  return map[status] ?? '未知'
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getExtractList({
      page: pagination.current,
      limit: pagination.pageSize,
      ...searchParams,
    })
    tableData.value = res.data?.data ?? []
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
  searchParams.userId = ''
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
    await auditExtract(record.id, { status: 1 })
    message.success('已通过')
    fetchData()
  } catch {
    // silent
  }
}

async function handleReject(record: any) {
  try {
    await auditExtract(record.id, { status: 2 })
    message.success('已拒绝')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.extract-page {
  padding: 16px;
}
.font-mono {
  font-variant-numeric: tabular-nums;
}
</style>
