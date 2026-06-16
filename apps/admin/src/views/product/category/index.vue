<template>
  <div>
    <PageHeader title="商品分类" />

    <!-- Search -->
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="分类名称">
          <a-input v-model:value="searchParams.keyword" placeholder="搜索分类名称" allow-clear style="width: 200px" />
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
        :pagination="false"
        row-key="id"
        :default-expand-all-rows="true"
        :children-column-name="'children'"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'icon'">
            <img
              v-if="record.icon"
              :src="record.icon"
              style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px"
            />
            <span v-else style="color: #ccc">-</span>
          </template>
          <template v-if="column.key === 'is_show'">
            <a-tag :color="record.is_show === 1 ? 'success' : 'default'">
              {{ record.is_show === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确认删除该分类？" @confirm="handleDelete(record.id)">
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
import { getCategoryList, deleteCategory } from '@/api/product';

const loading = ref(false);
const tableData = ref<any[]>([]);

const searchParams = reactive({
  keyword: '',
});

const columns = [
  { title: '分类名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '图标', key: 'icon', width: 80 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', key: 'is_show', width: 90 },
  { title: '操作', key: 'action', width: 130, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getCategoryList({
      keyword: searchParams.keyword || undefined,
    });
    const data = res.data;
    tableData.value = data?.data || data?.list || data || [];
  } catch {
    // use empty
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  fetchData();
}

function resetSearch() {
  searchParams.keyword = '';
  fetchData();
}

function handleEdit(_record: any) {
  message.info('编辑功能开发中');
}

async function handleDelete(id: number) {
  try {
    await deleteCategory(id);
    message.success('删除成功');
    fetchData();
  } catch {
    message.error('删除失败');
  }
}

onMounted(fetchData);
</script>
