<template>
  <div>
    <PageHeader title="打印管理" />

    <a-card>
      <a-alert
        message="打印设置"
        description="配置订单打印相关参数，支持小票打印机和 A4 打印机。"
        type="info"
        show-icon
        style="margin-bottom: 24px"
      />

      <a-form layout="vertical" :model="formState" style="max-width: 600px">
        <a-form-item label="打印方式">
          <a-radio-group v-model:value="formState.printType">
            <a-radio value="browser">浏览器打印</a-radio>
            <a-radio value="printer">小票打印机</a-radio>
          </a-radio-group>
        </a-form-item>

        <template v-if="formState.printType === 'printer'">
          <a-form-item label="打印机类型">
            <a-select v-model:value="formState.printerType" style="width: 200px">
              <a-select-option value="luetooth">蓝牙打印机</a-select-option>
              <a-select-option value="network">网络打印机</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="打印联数">
            <a-input-number v-model:value="formState.copyCount" :min="1" :max="5" />
          </a-form-item>
        </template>

        <a-form-item label="自动打印">
          <a-switch v-model:checked="formState.autoPrint" />
        </a-form-item>

        <a-form-item label="打印内容">
          <a-checkbox-group v-model:value="formState.contents">
            <a-checkbox value="order_info">订单信息</a-checkbox>
            <a-checkbox value="product_info">商品信息</a-checkbox>
            <a-checkbox value="user_info">用户信息</a-checkbox>
            <a-checkbox value="remark">备注信息</a-checkbox>
            <a-checkbox value="qrcode">二维码</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSave">保存配置</a-button>
            <a-button @click="handleTestPrint">测试打印</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const formState = reactive({
  printType: 'browser',
  printerType: 'luetooth',
  copyCount: 1,
  autoPrint: true,
  contents: ['order_info', 'product_info', 'remark'],
});

function handleSave() {
  message.success('打印配置保存成功');
}

function handleTestPrint() {
  message.info('测试打印任务已提交');
}
</script>
