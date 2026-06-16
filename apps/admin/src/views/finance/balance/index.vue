<template>
  <div class="balance-page">
    <PageHeader title="余额记录" />
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="用户">
          <a-input v-model:value="searchParams.userId" placeholder="请输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="searchParams.type" placeholder="请选择类型" allow-clear>
            <a-select-option :value="1">充值</a-select-option>
            <a-select-option :value="2">消费</a-select-option>
            <a-select-option :value="3">退款</a-select-option>
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
          <span class="font-mono">{{ record.amount > 0 ? '+' : '' }}{{ record.amount }}</span>
        </template>
        <template v-if="column.dataIndex === 'balance'">
          <span class="font-mono">{{ record.balance }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import { getBillList } from '@/api/finance'

const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  userId: '',
  type: undefined as number | undefined,
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
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '金额', dataIndex: 'amount', width: 120 },
  { title: '余额', dataIndex: 'balance', width: 120 },
  { title: '时间', dataIndex: 'createdAt', width: 180 },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await getBillList({
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
  searchParams.type = undefined
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.balance-page {
  padding: 16px;
}
.font-mono {
  font-variant-numeric: tabular-nums;
}
</style>
