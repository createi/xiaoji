<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Left: Carousel -->
      <div class="login-carousel">
        <a-carousel autoplay :autoplay-speed="4000" effect="fade">
          <div class="carousel-item">
            <div class="carousel-content">
              <ShoppingCartOutlined style="font-size: 48px; color: rgba(255,255,255,0.9)" />
              <h3>多商户电商系统</h3>
              <p>一站式电商解决方案</p>
            </div>
          </div>
          <div class="carousel-item">
            <div class="carousel-content">
              <ToolOutlined style="font-size: 48px; color: rgba(255,255,255,0.9)" />
              <h3>强大的管理后台</h3>
              <p>高效运营，轻松管理</p>
            </div>
          </div>
          <div class="carousel-item">
            <div class="carousel-content">
              <BarChartOutlined style="font-size: 48px; color: rgba(255,255,255,0.9)" />
              <h3>数据驱动决策</h3>
              <p>实时统计，智能分析</p>
            </div>
          </div>
        </a-carousel>
      </div>

      <!-- Right: Form -->
      <div class="login-form-wrap">
        <div class="login-logo">
          <h2>xiaoji 管理后台</h2>
        </div>
        <a-form :model="formState" @finish="handleLogin" class="login-form">
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
                <UserOutlined />
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
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            v-if="captchaEnabled"
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
                  <SafetyCertificateOutlined />
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
              html-type="submit"
              class="login-btn"
              :loading="loading"
            >
              登 录
            </a-button>
          </a-form-item>
        </a-form>
        <div class="login-copyright">
          Copyright &copy; 2024 xiaoji
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { adminLogin, getCaptcha } from '@/api/auth';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const captchaImg = ref('');
const captchaKey = ref('');

const captchaEnabled = computed(() => {
  return import.meta.env.VITE_CAPTCHA_ENABLED === 'true';
});

const formState = ref({
  account: '',
  password: '',
  captcha: '',
});

onMounted(() => {
  if (captchaEnabled.value) {
    refreshCaptcha();
  }
});

async function refreshCaptcha() {
  try {
    const res: any = await getCaptcha();
    captchaImg.value = res.data.image;
    captchaKey.value = res.data.key;
  } catch {
    // ignore
  }
}

async function handleLogin() {
  loading.value = true;
  try {
    const loginData: any = {
      account: formState.value.account,
      password: formState.value.password,
    };
    if (captchaEnabled.value) {
      loginData.captcha = formState.value.captcha;
      loginData.key = captchaKey.value;
    }
    const res: any = await adminLogin(loginData);
    userStore.setToken(res.data.token);
    message.success('登录成功');
    router.push('/dashboard');
  } catch {
    if (captchaEnabled.value) {
      refreshCaptcha();
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #282c34 0%, #1a1e24 100%);
  position: relative;
  overflow: hidden;
}

.login-box {
  width: 910px;
  height: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.login-carousel {
  width: 510px;
  height: 400px;
  background: linear-gradient(135deg, #409eff 0%, #0256ff 100%);
  border-radius: 12px 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 32px;
  overflow: hidden;

  :deep(.ant-carousel) {
    width: 100%;

    .slick-slide {
      text-align: center;
    }
  }
}

.carousel-item {
  padding: 24px 0;
}

.carousel-content {
  color: #fff;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 16px 0 8px;
    color: #fff;
  }

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.login-form-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 40px;
  height: 400px;
  box-sizing: border-box;
  border-radius: 0 12px 12px 0;
}

.login-logo {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 22px;
    font-weight: 600;
    color: var(--xj-text-primary);
    margin: 0;
  }
}

.login-form {
  width: 100%;

  :deep(.ant-input-affix-wrapper) {
    height: 40px;
    border-radius: 4px;
    font-size: 13px;
  }

  :deep(.ant-input) {
    font-size: 13px;
  }
}

.login-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: linear-gradient(90deg, #19b4f1, #0e73e8) !important;
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #1ab8ff, #117df5) !important;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-img {
  width: 120px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.login-copyright {
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: var(--xj-text-secondary);
}
</style>
