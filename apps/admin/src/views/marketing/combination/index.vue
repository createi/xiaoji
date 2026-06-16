<template>
  <div class="combination-page">
    <PageHeader title="拼团活动" />
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="活动名称">
          <a-input v-model:value="searchParams.title" placeholder="请输入活动名称" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.is_show" placeholder="请选择状态" allow-clear>
            <a-select-option :value="1">进行中</a-select-option>
            <a-select-option :value="0">已结束</a-select-option>
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
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'default'">
            {{ record.status === 1 ? '进行中' : '已结束' }}
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
import { message } from 'ant-design-vue'
import PageHeader from '@/components/PageHeader/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import { getCombinationList, deleteCombination } from '@/api/marketing'

const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  title: '',
  is_show: undefined as number | undefined,
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
  { title: '活动名称', dataIndex: 'name', ellipsis: true },
  { title: '商品', dataIndex: 'productName', ellipsis: true },
  { title: '拼团价', dataIndex: 'combinationPrice', width: 120 },
  { title: '原价', dataIndex: 'originalPrice', width: 120 },
  { title: '成团人数', dataIndex: 'groupCount', width: 100 },
  { title: '已售', dataIndex: 'soldCount', width: 80 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await getCombinationList({
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
  searchParams.is_show = undefined
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

function handleEdit(record: any) {
  // TODO: navigate to edit page
}

async function handleDelete(record: any) {
  try {
    await deleteCombination(record.id)
    message.success('删除成功')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.combination-page {
  padding: 16px;
}
</style>
