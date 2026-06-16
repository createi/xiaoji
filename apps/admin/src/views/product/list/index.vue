<template>
  <div>
    <PageHeader title="商品列表" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="商品名称">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索商品" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="全部状态" allow-clear style="width: 120px">
            <a-select-option :value="1">上架</a-select-option>
            <a-select-option :value="0">下架</a-select-option>
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
          <template v-if="column.key === 'image'">
            <img :src="record.image" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px" />
          </template>
          <template v-if="column.key === 'store_name'">
            <span class="text-ellipsis" style="max-width: 200px; display: inline-block">{{ record.store_name }}</span>
          </template>
          <template v-if="column.key === 'price'">
            <span class="font-mono">{{ record.price }}</span>
          </template>
          <template v-if="column.key === 'sales'">
            <span class="font-mono">{{ record.sales }}</span>
          </template>
          <template v-if="column.key === 'stock'">
            <span class="font-mono">{{ record.stock }}</span>
          </template>
          <template v-if="column.key === 'is_show'">
            <a-switch
              :checked="record.is_show === 1"
              checked-children="上架"
              un-checked-children="下架"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
            />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="router.push(`/product/add/${record.id}`)">编辑</a>
              <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)">
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
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';
import { getProductList, deleteProduct, updateProductStatus } from '@/api/product';

const router = useRouter();
const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
  keyword: '',
  status: undefined as number | undefined,
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
  { title: '图片', key: 'image', width: 80 },
  { title: '商品名称', key: 'store_name', dataIndex: 'store_name', ellipsis: true },
  { title: '价格', key: 'price', dataIndex: 'price', width: 100 },
  { title: '销量', key: 'sales', dataIndex: 'sales', width: 80 },
  { title: '库存', key: 'stock', dataIndex: 'stock', width: 80 },
  { title: '状态', key: 'is_show', width: 100 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getProductList({
      keyword: searchParams.keyword || undefined,
      status: searchParams.status,
      page: searchParams.page,
      limit: searchParams.limit,
    });
    const data = res.data;
    tableData.value = data?.data || data?.list || data?.items || [];
    pagination.total = data?.total || 0;
  } catch {
    // use empty data
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
  searchParams.status = undefined;
  handleSearch();
}

function handleTableChange(pag: any) {
  searchParams.page = pag.current;
  searchParams.limit = pag.pageSize;
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

async function handleStatusChange(record: any, checked: boolean) {
  try {
    await updateProductStatus(record.id, { is_show: checked ? 1 : 0 });
    record.is_show = checked ? 1 : 0;
    message.success('状态更新成功');
  } catch {
    message.error('状态更新失败');
  }
}

async function handleDelete(id: number) {
  try {
    await deleteProduct(id);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(fetchData);
</script>
