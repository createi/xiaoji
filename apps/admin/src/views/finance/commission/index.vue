<template>
  <div class="commission-page">
    <PageHeader title="佣金记录" />
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="用户">
          <a-input v-model:value="searchParams.userId" placeholder="请输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="订单号">
          <a-input v-model:value="searchParams.orderNo" placeholder="请输入订单号" allow-clear />
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
        <template v-if="column.dataIndex === 'commission'">
          <span class="font-mono">{{ record.commission }}</span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'default'">
            {{ record.status === 1 ? '已结算' : '待结算' }}
          </a-tag>
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
  orderNo: '',
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
  { title: '订单号', dataIndex: 'orderNo', width: 180 },
  { title: '佣金金额', dataIndex: 'commission', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '时间', dataIndex: 'createdAt', width: 180 },
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
  searchParams.orderNo = ''
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
.commission-page {
  padding: 16px;
}
.font-mono {
  font-variant-numeric: tabular-nums;
}
</style>
