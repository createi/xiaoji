<template>
  <div>
    <PageHeader title="商品属性" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="属性名称">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索属性名称" allow-clear style="width: 200px" />
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
          <template v-if="column.key === 'values'">
            <a-tag v-for="(val, idx) in (record.values || [])" :key="idx" style="margin-bottom: 4px">{{ val }}</a-tag>
            <span v-if="!record.values?.length" style="color: #ccc">-</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确认删除该属性？" @confirm="handleDelete(record.id)">
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
import { getProductLabelList, deleteProductLabel } from '@/api/product';

const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
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
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '属性名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '属性值', key: 'values' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '操作', key: 'action', width: 130, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getProductLabelList({
      name: searchParams.keyword || undefined,
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
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

async function handleDelete(id: number) {
  try {
    await deleteProductLabel(id);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(fetchData);
</script>
