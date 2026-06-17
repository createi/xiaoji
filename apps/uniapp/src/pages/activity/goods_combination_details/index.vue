<template>
  <view class="page" v-if="detail">
    <!-- 商品信息 -->
    <view class="product-section">
      <image class="product-img" :src="detail.image || productInfo.image" mode="aspectFill" v-if="detail.image || productInfo.image" />
      <view class="product-img placeholder" v-else />
      <view class="product-info">
        <text class="product-name">{{ productInfo.store_name || detail.title }}</text>
        <view class="product-price-row">
          <text class="group-price">¥{{ detail.price?.toFixed(2) }}</text>
          <text class="original-price" v-if="detail.ot_price">¥{{ detail.ot_price.toFixed(2) }}</text>
        </view>
        <text class="people-num">已拼 {{ detail.people_num || 0 }} 人成团</text>
      </view>
    </view>

    <!-- 拼团进度 -->
    <view class="progress-section">
      <view class="section-header">
        <text class="section-title">拼团进度</text>
      </view>
      <view class="progress-content">
        <view class="progress-steps">
          <view class="step-item" v-for="(step, idx) in detail.people_num || 2" :key="idx">
            <view class="step-dot" :class="{ active: idx < joinedCount }">
              <text class="step-dot-text" v-if="idx < joinedCount">&#10003;</text>
              <text class="step-dot-text" v-else>{{ idx + 1 }}</text>
            </view>
            <view class="step-line" v-if="idx < (detail.people_num || 2) - 1" :class="{ active: idx < joinedCount - 1 }" />
          </view>
        </view>
        <text class="progress-desc">还差 {{ Math.max(0, (detail.people_num || 2) - joinedCount) }} 人成团</text>
      </view>
    </view>

    <!-- 正在拼团 -->
    <view class="active-groups-section" v-if="activeGroups.length">
      <view class="section-header">
        <text class="section-title">正在拼团</text>
      </view>
      <view class="group-list">
        <view class="group-item" v-for="group in activeGroups" :key="group.id">
          <view class="group-avatars">
            <image
              class="group-avatar"
              :src="avatar"
              v-for="(avatar, idx) in group.avatars"
              :key="idx"
              v-if="avatar"
            />
            <view class="group-avatar placeholder-avatar" v-for="idx in Math.max(0, (detail.people_num || 2) - group.avatars.length)" :key="'p' + idx" />
          </view>
          <view class="group-info">
            <text class="group-count">还差{{ Math.max(0, (detail.people_num || 2) - group.count) }}人</text>
            <view class="group-countdown">
              <text class="group-countdown-text">{{ group.countdown }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动详情 -->
    <view class="detail-section" v-if="detail.info">
      <view class="section-header">
        <text class="section-title">活动详情</text>
      </view>
      <view class="detail-content">
        <rich-text :nodes="detail.info" />
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom" />

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-btn invite-btn" @click="onInvite">
        <text class="bar-btn-text">邀请好友拼团</text>
      </view>
      <view class="bar-btn join-btn" @click="onJoin">
        <text class="bar-btn-text">立即参团</text>
      </view>
    </view>
  </view>

  <!-- Loading -->
  <view class="loading-wrap" v-else-if="loading">
    <text class="loading-text">加载中...</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCombinationDetail } from '@/api/marketing';
import { getProductDetail } from '@/api/product';
import { checkLogin } from '@/utils';

const loading = ref(true);
const detail = ref<any>(null);
const productInfo = ref<any>({});
const joinedCount = ref(1);

const activeGroups = ref([
  {
    id: 1,
    avatars: ['/static/avatar1.png', '/static/avatar2.png'],
    count: 1,
    countdown: '01:23:45',
  },
  {
    id: 2,
    avatars: ['/static/avatar3.png'],
    count: 1,
    countdown: '00:45:12',
  },
]);

function onJoin() {
  if (!checkLogin()) return;
  if (!detail.value) return;

  const params = {
    productId: detail.value.product_id,
    skuUnique: '',
    num: 1,
    price: detail.value.price,
    name: productInfo.value.store_name || detail.value.title,
    image: detail.value.image || productInfo.value.image,
    activityType: 'combination',
    activityId: detail.value.id,
  };
  uni.setStorageSync('buyNowItem', JSON.stringify(params));
  uni.navigateTo({ url: '/pages/goods/order_confirm/index?type=buyNow' });
}

function onInvite() {
  // 分享功能
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
}

onLoad((options) => {
  const id = Number(options?.id || 0);
  if (!id) {
    loading.value = false;
    return;
  }
  fetchDetail(id);
});

async function fetchDetail(id: number) {
  loading.value = true;
  try {
    const res = await getCombinationDetail(id);
    detail.value = res?.data || null;

    if (detail.value?.product_id) {
      try {
        const productRes = await getProductDetail(detail.value.product_id);
        productInfo.value = productRes?.data || {};
      } catch {
        // ignore
      }
    }
  } catch (e) {
    // handled
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 商品信息 */
.product-section {
  background: #fff;
  padding: 24rpx;
}
.product-img {
  width: 100%;
  height: 500rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.product-img.placeholder {
  background: #f5f5f5;
}
.product-info {
  padding: 0;
}
.product-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  margin-top: 16rpx;
}
.group-price {
  font-size: 40rpx;
  color: #ff6600;
  font-weight: bold;
}
.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 16rpx;
}
.people-num {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

/* 拼团进度 */
.progress-section {
  background: #fff;
  margin-top: 16rpx;
}
.section-header {
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.progress-content {
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-steps {
  display: flex;
  align-items: center;
}
.step-item {
  display: flex;
  align-items: center;
}
.step-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-dot.active {
  background: #ff6600;
}
.step-dot-text {
  font-size: 24rpx;
  color: #999;
}
.step-dot.active .step-dot-text {
  color: #fff;
}
.step-line {
  width: 80rpx;
  height: 4rpx;
  background: #f5f5f5;
  margin: 0 8rpx;
}
.step-line.active {
  background: #ff6600;
}
.progress-desc {
  font-size: 26rpx;
  color: #ff6600;
  margin-top: 20rpx;
}

/* 正在拼团 */
.active-groups-section {
  background: #fff;
  margin-top: 16rpx;
}
.group-list {
  padding: 16rpx 24rpx;
}
.group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.group-item:last-child {
  border-bottom: none;
}
.group-avatars {
  display: flex;
  align-items: center;
}
.group-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: -12rpx;
  border: 2rpx solid #fff;
}
.placeholder-avatar {
  background: #f5f5f5;
}
.group-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.group-count {
  font-size: 24rpx;
  color: #999;
}
.group-countdown {
  background: #fff5f0;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.group-countdown-text {
  font-size: 22rpx;
  color: #ff6600;
}

/* 活动详情 */
.detail-section {
  background: #fff;
  margin-top: 16rpx;
}
.detail-content {
  padding: 24rpx;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 24rpx;
  gap: 16rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}
.bar-btn {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
}
.invite-btn {
  background: #fff;
  border: 2rpx solid #ff6600;
}
.invite-btn .bar-btn-text {
  color: #ff6600;
}
.join-btn {
  background: #ff6600;
}
.bar-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

/* Loading */
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
}

.safe-bottom {
  height: 20rpx;
}
</style>
