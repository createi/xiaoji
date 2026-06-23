<template>
  <view class="page">
    <!-- Logo Area -->
    <view class="logo-area">
      <view class="logo-icon">LOGO</view>
      <text class="app-name">小记</text>
    </view>

    <!-- Login Form -->
    <view class="form">
      <view class="form-item">
        <text class="form-label">账号</text>
        <input
          class="form-input"
          v-model="form.account"
          placeholder="请输入手机号/账号"
          maxlength="30"
        />
      </view>
      <view class="form-item">
        <text class="form-label">密码</text>
        <view class="password-wrap">
          <input
            class="form-input"
            v-model="form.password"
            :password="!showPassword"
            placeholder="请输入密码"
            maxlength="30"
          />
          <view class="eye-btn" @tap="showPassword = !showPassword">
            <text class="eye-text">{{ showPassword ? '隐藏' : '显示' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Login Button -->
    <view class="btn-area">
      <button class="login-btn" :loading="loading" @tap="handleLogin">登录</button>
    </view>

    <!-- Links -->
    <view class="links">
      <text class="link-text" @tap="handleForgot">忘记密码</text>
      <text class="link-divider">|</text>
      <text class="link-text" @tap="handleRegister">注册</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { login } from '@/api/auth';
import { useUserStore } from '@/stores/user';
import { navigateTo } from '@/utils';

const userStore = useUserStore();

const showPassword = ref(false);
const loading = ref(false);

const form = reactive({
  account: '',
  password: '',
});

async function handleLogin() {
  if (!form.account) {
    uni.showToast({ title: '请输入账号', icon: 'none' });
    return;
  }
  if (!form.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const res = await login({ account: form.account, password: form.password });
    if (res.status === 200) {
      userStore.setToken(res.data.token);
      if (res.data.userInfo) {
        userStore.setUserInfo(res.data.userInfo);
      }
      uni.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        uni.navigateBack({ fail: () => {
          uni.switchTab({ url: '/pages/index/index' });
        }});
      }, 500);
    }
  } catch (e: any) {
    // Error already handled by request interceptor
  } finally {
    loading.value = false;
  }
}

function handleForgot() {
  uni.showToast({ title: '忘记密码功能开发中', icon: 'none' });
}

function handleRegister() {
  uni.showToast({ title: '注册功能开发中', icon: 'none' });
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 60rpx;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 180rpx;
  padding-bottom: 80rpx;
}

.logo-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  background-color: #E93323;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.app-name {
  margin-top: 20rpx;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.form {
  margin-top: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.form-input {
  height: 90rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f9f9f9;
}

.password-wrap {
  position: relative;
}

.password-wrap .form-input {
  padding-right: 100rpx;
}

.eye-btn {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 10rpx;
}

.eye-text {
  font-size: 24rpx;
  color: #999;
}

.btn-area {
  margin-top: 60rpx;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #E93323;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  border: none;
}

.login-btn::after {
  border: none;
}

.links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  gap: 30rpx;
}

.link-text {
  font-size: 28rpx;
  color: #E93323;
}

.link-divider {
  font-size: 28rpx;
  color: #ccc;
}
</style>
