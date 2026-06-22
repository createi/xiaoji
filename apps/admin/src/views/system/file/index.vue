<template>
  <div>
    <PageHeader title="文件管理" />

    <a-card>
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="6">
          <a-input-search v-model:value="searchKeyword" placeholder="搜索文件名" @search="handleSearch" />
        </a-col>
        <a-col :span="18" style="text-align: right">
          <a-space>
            <a-upload :show-upload-list="false" :before-upload="handleUpload">
              <a-button type="primary">上传文件</a-button>
            </a-upload>
            <a-button @click="handleRefresh">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-table
        :columns="columns"
        :data-source="filteredFiles"
        :loading="loading"
        row-key="id"
        :pagination="{ pageSize: 20, showTotal: (t: number) => `共 ${t} 个文件` }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-space>
              <span>{{ getFileIcon(record.name) }}</span>
              <a @click="handlePreview(record)">{{ record.name }}</a>
            </a-space>
          </template>
          <template v-if="column.key === 'size'">
            {{ formatFileSize(record.size) }}
          </template>
          <template v-if="column.key === 'add_time'">
            {{ record.add_time }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleCopy(record)">复制链接</a>
              <a-popconfirm title="确认删除此文件？" @confirm="handleDelete(record)">
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
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const loading = ref(false);
const searchKeyword = ref('');

const files = ref([
  { id: 1, name: 'logo.png', url: '/uploads/logo.png', size: 102400, add_time: '2024-01-10 10:00:00' },
  { id: 2, name: 'banner.jpg', url: '/uploads/banner.jpg', size: 512000, add_time: '2024-01-11 14:30:00' },
  { id: 3, name: 'product-01.jpg', url: '/uploads/product-01.jpg', size: 204800, add_time: '2024-01-12 09:15:00' },
  { id: 4, name: 'avatar-default.png', url: '/uploads/avatar-default.png', size: 8192, add_time: '2024-01-13 16:45:00' },
]);

const filteredFiles = computed(() => {
  if (!searchKeyword.value) return files.value;
  return files.value.filter((f) => f.name.includes(searchKeyword.value));
});

const columns = [
  { title: '文件名', key: 'name' },
  { title: '大小', key: 'size', width: 120 },
  { title: '上传时间', key: 'add_time', width: 170 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const },
];

function getFileIcon(name: string) {
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif')) {
    return '🖼️';
  }
  if (name.endsWith('.mp4') || name.endsWith('.avi')) {
    return '🎬';
  }
  if (name.endsWith('.pdf')) {
    return '📄';
  }
  return '📁';
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleSearch() {
  // search is reactive via computed
}

function handleRefresh() {
  message.success('已刷新');
}

function handleUpload(file: File) {
  message.success(`${file.name} 上传成功`);
  return false;
}

function handlePreview(record: any) {
  window.open(record.url, '_blank');
}

function handleCopy(record: any) {
  navigator.clipboard.writeText(record.url);
  message.success('链接已复制');
}

function handleDelete(record: any) {
  files.value = files.value.filter((f) => f.id !== record.id);
  message.success('删除成功');
}

onMounted(() => {
  loading.value = false;
});
</script>
