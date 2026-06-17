<template>
  <view class="page">
    <!-- 用户头像区域 -->
    <view class="user-header" :class="{ 'is-login': userStore.isLogin }">
      <view class="user-info" @click="onUserClick">
        <image
          class="avatar"
          :src="userStore.avatar"
          v-if="userStore.avatar"
        />
        <view class="avatar default-avatar" v-else>
          <text class="avatar-icon">&#9679;</text>
        </view>
        <view class="user-detail">
          <text class="nickname">{{ userStore.nickname }}</text>
          <view class="member-badge" v-if="userStore.isLogin && userStore.userInfo?.member_level">
            <text class="member-badge-text">VIP{{ userStore.userInfo.member_level }}</text>
          </view>
          <text class="login-hint" v-if="!userStore.isLogin">点击登录账号</text>
        </view>
      </view>
    </view>

    <!-- 订单快捷入口 -->
    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="section-more" @click="goOrderList">
          <text class="section-more-text">全部订单</text>
          <text class="arrow">&gt;</text>
        </view>
      </view>
      <view class="order-quick">
        <view class="order-quick-item" @click="goOrderStatus(1)">
          <view class="order-icon-wrap">
            <text class="order-icon">&#128179;</text>
          </view>
          <text class="order-quick-text">待付款</text>
        </view>
        <view class="order-quick-item" @click="goOrderStatus(2)">
          <view class="order-icon-wrap">
            <text class="order-icon">&#128230;</text>
          </view>
          <text class="order-quick-text">待发货</text>
        </view>
        <view class="order-quick-item" @click="goOrderStatus(3)">
          <view class="order-icon-wrap">
            <text class="order-icon">&#128666;</text>
          </view>
          <text class="order-quick-text">待收货</text>
        </view>
        <view class="order-quick-item" @click="goOrderStatus(4)">
          <view class="order-icon-wrap">
            <text class="order-icon">&#11088;</text>
          </view>
          <text class="order-quick-text">待评价</text>
        </view>
        <view class="order-quick-item" @click="goOrderStatus(5)">
          <view class="order-icon-wrap">
            <text class="order-icon">&#128176;</text>
          </view>
          <text class="order-quick-text">退款</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" v-for="item in menuList" :key="item.name" @click="onMenuClick(item)">
        <view class="menu-left">
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-name">{{ item.name }}</text>
        </view>
        <text class="menu-arrow">&gt;</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userStore.isLogin">
      <view class="logout-btn" @click="onLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { getUserDetail } from '@/api/user';
import { checkLogin, navigateTo } from '@/utils';

const userStore = useUserStore();
const loading = ref(false);

const menuList = ref([
  { name: '积分', icon: '&#127942;', url: '/pages/integral/index' },
  { name: '签到', icon: '&#9989;', url: '/pages/sign/index' },
  { name: '收藏', icon: '&#10084;', url: '/pages/favorite/index' },
  { name: '地址管理', icon: '&#128205;', url: '/pages/address/list/index' },
  { name: '关于我们', icon: '&#9432;', url: '/pages/about/index' },
]);

async function fetchUserInfo() {
  if (!userStore.isLogin) return;
  loading.value = true;
  try {
    const res = await getUserDetail();
    if (res?.data) {
      userStore.setUserInfo(res.data);
    }
  } catch (e) {
    // handled by request layer
  } finally {
    loading.value = false;
  }
}

function onUserClick() {
  if (!userStore.isLogin) {
    navigateTo('/pages/users/login/index');
  }
}

function goOrderList() {
  if (!checkLogin()) return;
  navigateTo('/pages/order_list/index');
}

function goOrderStatus(status: number) {
  if (!checkLogin()) return;
  navigateTo(`/pages/order_list/index?status=${status}`);
}

function onMenuClick(item: { name: string; url: string }) {
  if (item.name === '积分' || item.name === '签到' || item.name === '收藏') {
    if (!checkLogin()) return;
  }
  navigateTo(item.url);
}

function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.showToast({ title: '已退出', icon: 'success' });
      }
    },
  });
}

onShow(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

/* 用户头部 */
.user-header {
  padding: 48rpx 32rpx 40rpx;
  background: linear-gradient(135deg, #ff6600, #ff8533);
}
.user-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: 24rpx;
  flex-shrink: 0;
}
.default-avatar {
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon {
  font-size: 56rpx;
  color: rgba(255, 255, 255, 0.6);
}
.user-detail {
  flex: 1;
}
.nickname {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}
.member-badge {
  display: inline-flex;
  margin-top: 8rpx;
  padding: 2rpx 16rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}
.member-badge-text {
  font-size: 22rpx;
  color: #fff;
}
.login-hint {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

/* 订单快捷入口 */
.order-section {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  padding: 24rpx;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.section-more {
  display: flex;
  align-items: center;
}
.section-more-text {
  font-size: 24rpx;
  color: #999;
}
.arrow {
  font-size: 24rpx;
  color: #999;
  margin-left: 4rpx;
}
.order-quick {
  display: flex;
  justify-content: space-between;
}
.order-quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.order-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-icon {
  font-size: 44rpx;
}
.order-quick-text {
  font-size: 24rpx;
  color: #333;
  margin-top: 8rpx;
}

/* 功能菜单 */
.menu-section {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-left {
  display: flex;
  align-items: center;
}
.menu-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}
.menu-name {
  font-size: 28rpx;
  color: #333;
}
.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
}

/* 退出登录 */
.logout-section {
  margin-top: 40rpx;
  padding: 0 24rpx;
}
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background: #fff;
  border-radius: 16rpx;
}
.logout-text {
  font-size: 30rpx;
  color: #ff4d4f;
}

.safe-bottom {
  height: 20rpx;
}
</style>
