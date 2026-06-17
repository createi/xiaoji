<template>
  <div class="article-list-page">
    <PageHeader title="文章列表">
      <a-button type="primary" @click="handleAdd">新建</a-button>
    </PageHeader>
    <SearchForm>
      <a-form layout="inline" @finish="handleSearch">
        <a-form-item label="关键词">
          <a-input v-model:value="searchParams.title" placeholder="搜索文章标题" allow-clear />
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
        <template v-if="column.dataIndex === 'title'">
          <a-tooltip :title="record.title">
            <span class="ellipsis-text">{{ record.title }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'category'">
          <a-tag>{{ record.category }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'cover'">
          <a-image :src="record.cover" :width="60" :height="40" style="border-radius: 4px" />
        </template>
        <template v-if="column.dataIndex === 'views'">
          <span class="font-mono">{{ record.views }}</span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'warning'">
            {{ record.status === 1 ? '已发布' : '草稿' }}
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
import { getArticleList, deleteArticle } from '@/api/cms'

const router = useRouter()
const loading = ref(false)
const tableData = ref<any[]>([])

const searchParams = reactive({
  title: '',
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
  { title: '标题', dataIndex: 'title', width: 200, ellipsis: true },
  { title: '分类', dataIndex: 'category', width: 120 },
  { title: '封面', dataIndex: 'cover', width: 100 },
  { title: '作者', dataIndex: 'author', width: 120 },
  { title: '浏览量', dataIndex: 'views', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '发布时间', dataIndex: 'published_at', width: 180 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await getArticleList({
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
  pagination.current = 1
  fetchData()
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

function handleAdd() {
  router.push('/cms/article-save/add')
}

function handleEdit(record: any) {
  router.push('/cms/article-save/' + record.id)
}

async function handleDelete(record: any) {
  try {
    await deleteArticle(record.id)
    message.success('删除成功')
    fetchData()
  } catch {
    // silent
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.article-list-page {
  padding: 16px;

  .font-mono {
    font-family: 'Courier New', Courier, monospace;
  }

  .ellipsis-text {
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
