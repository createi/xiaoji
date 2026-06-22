<template>
  <div>
    <PageHeader title="小程序包管理" />

    <a-card>
      <a-alert
        message="小程序包上传"
        description="通过微信开发者工具上传小程序包后，在此处进行版本管理和发布。"
        type="info"
        show-icon
        style="margin-bottom: 24px"
      />

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="上传小程序包" size="small">
            <a-form layout="vertical">
              <a-form-item label="版本号">
                <a-input v-model:value="uploadForm.version" placeholder="如: 1.0.0" />
              </a-form-item>
              <a-form-item label="版本描述">
                <a-textarea v-model:value="uploadForm.description" :rows="3" placeholder="本次更新内容" />
              </a-form-item>
              <a-form-item label="小程序包">
                <a-upload :before-upload="handleUpload" :max-count="1">
                  <a-button>选择文件</a-button>
                </a-upload>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" :loading="uploadLoading" @click="handleSubmitUpload">
                  上传并提交审核
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="版本历史" size="small">
            <a-timeline>
              <a-timeline-item v-for="item in versions" :key="item.id" :color="item.status === 1 ? 'green' : 'gray'">
                <p><strong>v{{ item.version }}</strong>
                  <a-tag :color="item.status === 1 ? 'success' : item.status === 0 ? 'warning' : 'default'" style="margin-left: 8px">
                    {{ item.status === 1 ? '已发布' : item.status === 0 ? '审核中' : '已拒绝' }}
                  </a-tag>
                </p>
                <p style="color: #999; font-size: 12px">{{ item.add_time }}</p>
                <p>{{ item.description }}</p>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const uploadLoading = ref(false);

const uploadForm = reactive({
  version: '',
  description: '',
});

const versions = ref([
  { id: 3, version: '1.2.0', description: '新增积分商城功能', status: 1, add_time: '2024-01-15 10:00:00' },
  { id: 2, version: '1.1.0', description: '优化商品详情页加载速度', status: 1, add_time: '2024-01-10 14:30:00' },
  { id: 1, version: '1.0.0', description: '首次发布', status: 1, add_time: '2024-01-01 00:00:00' },
]);

function handleUpload(_file: File) {
  return false;
}

function handleSubmitUpload() {
  if (!uploadForm.version) {
    message.warning('请输入版本号');
    return;
  }
  uploadLoading.value = true;
  setTimeout(() => {
    uploadLoading.value = false;
    message.success('上传成功，已提交审核');
    uploadForm.version = '';
    uploadForm.description = '';
  }, 1500);
}
</script>
