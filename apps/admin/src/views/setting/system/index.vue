<template>
  <div>
    <PageHeader title="系统设置" />

    <a-card>
      <a-form
        :model="formData"
        layout="vertical"
        style="max-width: 600px"
        @finish="handleSave"
      >
        <a-form-item label="系统名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入系统名称" />
        </a-form-item>

        <a-form-item label="系统LOGO">
          <a-upload
            v-model:file-list="formData.logoFileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :max-count="1"
          >
            <div v-if="!formData.logoFileList.length">
              <div style="font-size: 12px; color: #999">点击上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="联系电话">
          <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱地址" />
        </a-form-item>

        <a-form-item label="详细地址">
          <a-textarea v-model:value="formData.address" placeholder="请输入详细地址" :rows="3" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="saving">保存设置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const saving = ref(false);

const formData = reactive({
  name: '',
  logoFileList: [] as any[],
  phone: '',
  email: '',
  address: '',
});

function beforeUpload(_file: File) {
  return false;
}

async function handleSave() {
  saving.value = true;
  try {
    // TODO: call save API
    message.success('保存成功');
  } catch {
    message.error('保存失败');
  } finally {
    saving.value = false;
  }
}
</script>
