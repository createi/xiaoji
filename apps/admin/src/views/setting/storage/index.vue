<template>
  <div>
    <PageHeader title="存储配置" />

    <a-card>
      <a-form layout="vertical" :model="formState" style="max-width: 600px">
        <a-form-item label="存储驱动">
          <a-radio-group v-model:value="formState.driver">
            <a-radio value="local">本地存储</a-radio>
            <a-radio value="oss">阿里云 OSS</a-radio>
            <a-radio value="qiniu">七牛云</a-radio>
            <a-radio value="cos">腾讯云 COS</a-radio>
          </a-radio-group>
        </a-form-item>

        <template v-if="formState.driver === 'local'">
          <a-form-item label="上传路径">
            <a-input v-model:value="formState.localPath" placeholder="uploads" />
          </a-form-item>
        </template>

        <template v-else>
          <a-form-item label="Bucket">
            <a-input v-model:value="formState.bucket" placeholder="OSS Bucket 名称" />
          </a-form-item>
          <a-form-item label="Endpoint">
            <a-input v-model:value="formState.endpoint" placeholder="OSS Endpoint" />
          </a-form-item>
          <a-form-item label="Access Key">
            <a-input v-model:value="formState.accessKey" placeholder="Access Key" />
          </a-form-item>
          <a-form-item label="Secret Key">
            <a-input-password v-model:value="formState.secretKey" placeholder="Secret Key" />
          </a-form-item>
          <a-form-item label="CDN 域名">
            <a-input v-model:value="formState.cdn" placeholder="https://cdn.example.com" />
          </a-form-item>
          <a-form-item label="自定义域名">
            <a-input v-model:value="formState.customDomain" placeholder="可选，自定义访问域名" />
          </a-form-item>
        </template>

        <a-form-item>
          <a-button type="primary" @click="handleSave">保存配置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const formState = reactive({
  driver: 'local',
  localPath: 'uploads',
  bucket: '',
  endpoint: '',
  accessKey: '',
  secretKey: '',
  cdn: '',
  customDomain: '',
});

function handleSave() {
  message.success('存储配置保存成功');
}
</script>
