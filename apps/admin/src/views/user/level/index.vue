<template>
  <div class="user-level-page">
    <PageHeader title="用户等级">
      <a-button type="primary" @click="handleAdd">新建</a-button>
    </PageHeader>
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="等级名称">
          <a-input v-model:value="searchParams.keyword" placeholder="请输入等级名称" allow-clear />
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
        <template v-if="column.dataIndex === 'icon'">
          <a-image :src="record.icon" :width="40" :height="40" style="border-radius: 4px" />
        </template>
        <template v-if="column.dataIndex === 'min_points'">
          <span class="font-mono">{{ record.min_points }}</span>
        </template>
        <template v-if="column.dataIndex === 'discount'">
          <span class="font-mono">{{ record.discount }}%</span>
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
import { getUserLevelList, deleteUserLevel } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  keyword: '',
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
  { title: '等级名称', dataIndex: 'name', width: 150 },
  { title: '等级图标', dataIndex: 'icon', width: 100 },
  { title: '最低积分', dataIndex: 'min_points', width: 120 },
  { title: '折扣', dataIndex: 'discount', width: 100 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await getUserLevelList({
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
  searchParams.keyword = ''
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

function handleAdd() {
  router.push('/user/level/add')
}

function handleEdit(record: any) {
  router.push('/user/level/add/' + record.id)
}

async function handleDelete(record: any) {
  try {
    await deleteUserLevel(record.id)
    message.success('删除成功')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.user-level-page {
  padding: 16px;

  .font-mono {
    font-family: 'Courier New', Courier, monospace;
  }
}
</style>
