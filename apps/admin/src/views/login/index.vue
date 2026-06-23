<template>
  <div class="login-container">
    <!-- Background particles -->
    <div class="login-bg">
      <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)" />
      <div class="line" v-for="i in 10" :key="'l'+i" :style="getLineStyle(i)" />
    </div>

    <div class="login-box">
      <!-- Left: Branding -->
      <div class="login-left">
        <div class="login-left-content">
          <div class="brand-logo">
            <span class="brand-x">小鸡</span>
          </div>
          <h2 class="brand-slogan">开源 · 不止开源</h2>
          <p class="brand-desc">基于 NestJS + Vue3 + UniApp 的现代化电商系统</p>
          <!-- Isometric illustration -->
          <div class="illustration">
            <div class="iso-cart">
              <div class="iso-box box1"></div>
              <div class="iso-box box2"></div>
              <div class="iso-box box3"></div>
              <div class="iso-cart-body"></div>
            </div>
            <div class="iso-db">
              <div class="iso-db-layer l1"></div>
              <div class="iso-db-layer l2"></div>
              <div class="iso-db-layer l3"></div>
            </div>
            <div class="iso-chart">
              <div class="iso-bar b1"></div>
              <div class="iso-bar b2"></div>
              <div class="iso-bar b3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="login-right">
        <div class="login-logo">
          <span class="logo-icon">🐔</span>
          <span class="logo-text">xiaoji</span>
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
          Copyright &copy; 2024 xiaoji.com
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

function getParticleStyle(i: number) {
  const x = (i * 37) % 100;
  const y = (i * 53) % 100;
  const size = 2 + (i % 3);
  const delay = (i * 0.5) % 5;
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
  };
}

function getLineStyle(i: number) {
  const x1 = (i * 23) % 100;
  const y1 = (i * 41) % 100;
  const rotation = (i * 37) % 360;
  const width = 60 + (i * 17) % 120;
  return {
    left: `${x1}%`,
    top: `${y1}%`,
    width: `${width}px`,
    transform: `rotate(${rotation}deg)`,
    animationDelay: `${i * 0.3}s`,
  };
}

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
  background: linear-gradient(135deg, #0c1426 0%, #1a1e3a 40%, #0d1b2a 100%);
  position: relative;
  overflow: hidden;
}

/* Background particles and lines */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(64, 158, 255, 0.4);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.15), transparent);
  animation: drift 8s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-20px); opacity: 0.8; }
}

@keyframes drift {
  0% { opacity: 0; }
  50% { opacity: 0.3; }
  100% { opacity: 0; }
}

.login-box {
  width: 900px;
  height: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Left panel */
.login-left {
  width: 480px;
  background: linear-gradient(135deg, #2b5ea7 0%, #1e4d8c 50%, #1a3f7a 100%);
  border-radius: 12px 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  }
}

.login-left-content {
  text-align: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.brand-logo {
  margin-bottom: 16px;
}

.brand-x {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
}

.brand-slogan {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px;
}

.brand-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px;
  line-height: 1.6;
}

/* Isometric illustration */
.illustration {
  position: relative;
  width: 280px;
  height: 180px;
  margin: 0 auto;
}

.iso-cart {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.iso-box {
  position: absolute;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.box1 {
  width: 60px;
  height: 50px;
  background: linear-gradient(135deg, #5b9bd5, #4a8bc2);
  left: -30px;
  top: -25px;
  transform: skewX(-5deg);
}

.box2 {
  width: 50px;
  height: 45px;
  background: linear-gradient(135deg, #7cb8e8, #6aa8d8);
  left: 40px;
  top: -20px;
  transform: skewX(-5deg);
}

.box3 {
  width: 45px;
  height: 40px;
  background: linear-gradient(135deg, #a0d0f0, #8ec0e8);
  left: 10px;
  top: 30px;
  transform: skewX(-5deg);
}

.iso-cart-body {
  width: 100px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  position: relative;
  left: -50px;
  top: -30px;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 15px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 54px 0 0 rgba(255, 255, 255, 0.4);
  }
}

.iso-db {
  position: absolute;
  right: 30px;
  top: 20px;
}

.iso-db-layer {
  width: 60px;
  height: 16px;
  border-radius: 8px;
  margin-bottom: 4px;
}

.l1 { background: linear-gradient(135deg, #5b9bd5, #4a8bc2); }
.l2 { background: linear-gradient(135deg, #7cb8e8, #6aa8d8); }
.l3 { background: linear-gradient(135deg, #a0d0f0, #8ec0e8); }

.iso-chart {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.iso-bar {
  width: 14px;
  border-radius: 3px 3px 0 0;
}

.b1 { height: 30px; background: linear-gradient(180deg, #5b9bd5, #4a8bc2); }
.b2 { height: 45px; background: linear-gradient(180deg, #7cb8e8, #6aa8d8); }
.b3 { height: 35px; background: linear-gradient(180deg, #a0d0f0, #8ec0e8); }

/* Right panel */
.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 48px;
  box-sizing: border-box;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  letter-spacing: 1px;
}

.login-form {
  width: 100%;
  max-width: 320px;

  :deep(.ant-input-affix-wrapper) {
    height: 42px;
    border-radius: 6px;
    font-size: 14px;
    border-color: #e0e0e0;

    &:hover, &:focus {
      border-color: #0256ff;
    }
  }

  :deep(.ant-input) {
    font-size: 14px;
  }
}

.login-btn {
  width: 100%;
  height: 42px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  background: #0256ff !important;
  color: #fff;

  &:hover {
    background: #409eff !important;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-img {
  width: 120px;
  height: 42px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
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
  margin-top: 24px;
  font-size: 12px;
  color: #999;
}
</style>
