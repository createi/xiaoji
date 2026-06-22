<template>
  <div>
    <PageHeader title="数据备份" />

    <a-card>
      <a-alert
        message="数据备份"
        description="备份功能用于将数据库中的数据导出为 SQL 文件，以便在需要时恢复数据。"
        type="info"
        show-icon
        style="margin-bottom: 24px"
      />

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="手动备份" size="small">
            <a-form layout="vertical">
              <a-form-item label="备份表">
                <a-select
                  v-model:value="selectedTables"
                  mode="multiple"
                  placeholder="选择要备份的表（留空则备份全部）"
                  style="width: 100%"
                >
                  <a-select-option v-for="table in tables" :key="table" :value="table">{{ table }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" :loading="backupLoading" @click="handleBackup">
                  开始备份
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="备份记录" size="small">
            <a-empty description="暂无备份记录" />
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const backupLoading = ref(false);
const selectedTables = ref<string[]>([]);

const tables = ref([
  'xj_system_admin',
  'xj_system_role',
  'xj_system_menus',
  'xj_system_config',
  'xj_system_log',
  'xj_user',
  'xj_store_product',
  'xj_store_order',
  'xj_store_cart',
]);

async function handleBackup() {
  backupLoading.value = true;
  try {
    message.success('备份任务已提交，请稍后查看');
  } catch {
    message.error('备份失败');
  } finally {
    backupLoading.value = false;
  }
}
</script>
