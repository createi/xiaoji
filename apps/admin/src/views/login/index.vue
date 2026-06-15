<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">xiaoji 管理后台</h1>
      <a-form
        :model="formState"
        @finish="handleLogin"
        layout="vertical"
      >
        <a-form-item
          name="account"
          :rules="[{ required: true, message: '请输入账号' }]"
        >
          <a-input
            v-model:value="formState.account"
            size="large"
            placeholder="管理员账号"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          name="captcha"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <div class="captcha-row">
            <a-input
              v-model:value="formState.captcha"
              size="large"
              placeholder="验证码"
            >
              <template #prefix>
                <safety-certificate-outlined />
              </template>
            </a-input>
            <div class="captcha-img" @click="refreshCaptcha">
              <img v-if="captchaImg" :src="captchaImg" alt="验证码" />
              <span v-else>获取验证码</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { adminLogin, getCaptcha } from '@/api/auth';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const captchaImg = ref('');
const captchaKey = ref('');

const formState = ref({
  account: '',
  password: '',
  captcha: '',
});

onMounted(() => {
  refreshCaptcha();
});

async function refreshCaptcha() {
  try {
    const res: any = await getCaptcha();
    captchaImg.value = res.data.image;
    captchaKey.value = res.data.key;
  } catch {
    // 忽略错误
  }
}

async function handleLogin() {
  loading.value = true;
  try {
    const res: any = await adminLogin({
      ...formState.value,
      key: captchaKey.value,
    });
    userStore.setToken(res.data.token);
    message.success('登录成功');
    router.push('/dashboard');
  } catch {
    refreshCaptcha();
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-img {
  width: 120px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.captcha-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
