<template>
  <div class="coupon-page">
    <PageHeader title="优惠券管理">
      <a-button type="primary" @click="handleAdd">新建</a-button>
    </PageHeader>
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="优惠券名称">
          <a-input v-model:value="searchParams.title" placeholder="请输入优惠券名称" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="请选择状态" allow-clear>
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
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          {{ record.type === 1 ? '满减' : '折扣' }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'default'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-popconfirm title="确定要删除吗？" @confirm="handleDelete(record)">
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/PageHeader/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import { getCouponList, deleteCoupon } from '@/api/marketing'

const router = useRouter()
const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  title: '',
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
  { title: '优惠券名称', dataIndex: 'name', ellipsis: true },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '面额', dataIndex: 'amount', width: 100 },
  { title: '使用门槛', dataIndex: 'threshold', width: 120 },
  { title: '有效期', dataIndex: 'expireTime', width: 180 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await getCouponList({
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
  searchParams.title = ''
  searchParams.status = undefined
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

function handleAdd() {
  router.push('/marketing/coupon/add')
}

function handleEdit(record: any) {
  router.push('/marketing/coupon/add/' + record.id)
}

async function handleDelete(record: any) {
  try {
    await deleteCoupon(record.id)
    message.success('删除成功')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.coupon-page {
  padding: 16px;
}
</style>
