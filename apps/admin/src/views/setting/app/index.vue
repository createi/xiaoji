<template>
  <div>
    <PageHeader title="应用设置" />

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="wechat" tab="微信设置">
        <a-form layout="vertical" :model="wechatForm" style="max-width: 600px">
          <a-form-item label="AppID">
            <a-input v-model:value="wechatForm.appId" placeholder="微信公众号 AppID" />
          </a-form-item>
          <a-form-item label="AppSecret">
            <a-input-password v-model:value="wechatForm.appSecret" placeholder="微信公众号 AppSecret" />
          </a-form-item>
          <a-form-item label="Token">
            <a-input v-model:value="wechatForm.token" placeholder="消息校验 Token" />
          </a-form-item>
          <a-form-item label="EncodingAESKey">
            <a-input v-model:value="wechatForm.encodingAesKey" placeholder="消息加解密 Key" />
          </a-form-item>
          <a-form-item label="小程序 AppID">
            <a-input v-model:value="wechatForm.miniAppId" placeholder="微信小程序 AppID" />
          </a-form-item>
          <a-form-item label="小程序 AppSecret">
            <a-input-password v-model:value="wechatForm.miniAppSecret" placeholder="微信小程序 AppSecret" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSaveWechat">保存配置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="payment" tab="支付设置">
        <a-form layout="vertical" :model="paymentForm" style="max-width: 600px">
          <a-form-item label="支付方式">
            <a-checkbox-group v-model:value="paymentForm.methods">
              <a-checkbox value="wechat">微信支付</a-checkbox>
              <a-checkbox value="alipay">支付宝支付</a-checkbox>
              <a-checkbox value="balance">余额支付</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-divider>微信支付</a-divider>
          <a-form-item label="商户号">
            <a-input v-model:value="paymentForm.wechat.mchId" placeholder="微信支付商户号" />
          </a-form-item>
          <a-form-item label="商户密钥">
            <a-input-password v-model:value="paymentForm.wechat.mchKey" placeholder="微信支付商户密钥" />
          </a-form-item>
          <a-form-item label="证书序列号">
            <a-input v-model:value="paymentForm.wechat.certSerialNo" placeholder="API 证书序列号" />
          </a-form-item>
          <a-form-item label="APIv3 密钥">
            <a-input-password v-model:value="paymentForm.wechat.apiV3Key" placeholder="APIv3 密钥" />
          </a-form-item>
          <a-form-item label="支付回调地址">
            <a-input v-model:value="paymentForm.wechat.notifyUrl" placeholder="https://api.example.com/pay/notify" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSavePayment">保存配置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="sms" tab="短信设置">
        <a-form layout="vertical" :model="smsForm" style="max-width: 600px">
          <a-form-item label="短信服务商">
            <a-select v-model:value="smsForm.provider" style="width: 200px">
              <a-select-option value="aliyun">阿里云短信</a-select-option>
              <a-select-option value="tencent">腾讯云短信</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Access Key">
            <a-input v-model:value="smsForm.accessKey" placeholder="短信服务 Access Key" />
          </a-form-item>
          <a-form-item label="Secret Key">
            <a-input-password v-model:value="smsForm.secretKey" placeholder="短信服务 Secret Key" />
          </a-form-item>
          <a-form-item label="签名">
            <a-input v-model:value="smsForm.sign" placeholder="短信签名" />
          </a-form-item>
          <a-form-item label="模板 ID">
            <a-input v-model:value="smsForm.templateId" placeholder="验证码模板 ID" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSaveSms">保存配置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const activeTab = ref('wechat');

const wechatForm = reactive({
  appId: '',
  appSecret: '',
  token: '',
  encodingAesKey: '',
  miniAppId: '',
  miniAppSecret: '',
});

const paymentForm = reactive({
  methods: ['wechat'],
  wechat: {
    mchId: '',
    mchKey: '',
    certSerialNo: '',
    apiV3Key: '',
    notifyUrl: '',
  },
});

const smsForm = reactive({
  provider: 'aliyun',
  accessKey: '',
  secretKey: '',
  sign: '',
  templateId: '',
});

function handleSaveWechat() {
  message.success('微信配置保存成功');
}

function handleSavePayment() {
  message.success('支付配置保存成功');
}

function handleSaveSms() {
  message.success('短信配置保存成功');
}
</script>
