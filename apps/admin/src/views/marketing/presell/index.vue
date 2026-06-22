<template>
  <div>
    <PageHeader title="预售管理" />
    <SearchForm>
      <a-form layout="inline" :model="searchParams" @finish="handleSearch">
        <a-form-item label="商品名称">
          <a-input v-model:value="searchParams.store_name" placeholder="商品名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchParams.status" placeholder="全部" allow-clear style="width: 120px">
            <a-select-option :value="1">开启</a-select-option>
            <a-select-option :value="0">关闭</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space><a-button type="primary" html-type="submit">搜索</a-button><a-button @click="resetSearch">重置</a-button></a-space>
        </a-form-item>
      </a-form>
    </SearchForm>
    <a-card>
      <template #extra><a-button type="primary" @click="handleAdd">添加预售</a-button></template>
      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'"><a-image :src="record.image" :width="40" :height="40" style="border-radius: 4px" /></template>
          <template v-if="column.key === 'status'">
            <a-switch :checked="record.status === 1" @change="(v: boolean) => { record.status = v ? 1 : 0; }" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space><a @click="handleEdit(record)">编辑</a><a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)"><a style="color: #f5222d">删除</a></a-popconfirm></a-space>
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

const loading = ref(false);
const tableData = ref<any[]>([]);
const searchParams = reactive({ store_name: '', status: undefined as number | undefined, page: 1, limit: 15 });
const pagination = reactive({ current: 1, pageSize: 15, total: 0, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` });
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '图片', key: 'image', width: 60 },
  { title: '商品名称', dataIndex: 'store_name', key: 'store_name', ellipsis: true },
  { title: '预售价格', dataIndex: 'price', key: 'price', width: 100 },
  { title: '库存', dataIndex: 'stock', key: 'stock', width: 80 },
  { title: '已售', dataIndex: 'sales', key: 'sales', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];
async function fetchData() { loading.value = true; try { tableData.value = []; pagination.total = 0; } catch {} finally { loading.value = false; } }
function handleSearch() { searchParams.page = 1; pagination.current = 1; fetchData(); }
function resetSearch() { searchParams.store_name = ''; searchParams.status = undefined; handleSearch(); }
function handleTableChange(pag: any) { searchParams.page = pag.current; pagination.current = pag.current; fetchData(); }
function handleAdd() { message.info('添加预售功能开发中'); }
function handleEdit(_r: any) { message.info('编辑功能开发中'); }
function handleDelete(_id: number) { message.success('删除成功'); }
onMounted(fetchData);
</script>
