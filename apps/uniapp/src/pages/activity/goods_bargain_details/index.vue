<template>
  <view class="page" v-if="detail">
    <!-- 商品信息 -->
    <view class="product-section">
      <image class="product-img" :src="detail.image || productInfo.image" mode="aspectFill" v-if="detail.image || productInfo.image" />
      <view class="product-img placeholder" v-else />
      <view class="product-info">
        <text class="product-name">{{ productInfo.store_name || detail.title }}</text>
        <view class="product-price-row">
          <view class="price-current">
            <text class="price-sign">¥</text>
            <text class="price-value">{{ currentPrice.toFixed(2) }}</text>
          </view>
          <view class="price-info">
            <text class="original-price">原价 ¥{{ detail.product_price?.toFixed(2) }}</text>
            <text class="bottom-price">底价 ¥{{ detail.price?.toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 砍价进度 -->
    <view class="progress-section">
      <view class="section-header">
        <text class="section-title">砍价进度</text>
      </view>
      <view class="progress-content">
        <view class="progress-bar-wrap">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progressPercent + '%' }" />
          </view>
          <view class="progress-labels">
            <text class="progress-label-left">¥{{ detail.product_price?.toFixed(2) }}</text>
            <text class="progress-label-right">¥{{ detail.price?.toFixed(2) }}</text>
          </view>
        </view>
        <text class="progress-desc">已砍 ¥{{ (detail.product_price - currentPrice).toFixed(2) }}，还差 ¥{{ (currentPrice - detail.price).toFixed(2) }}</text>
      </view>
    </view>

    <!-- 帮砍记录 -->
    <view class="help-section" v-if="helpList.length">
      <view class="section-header">
        <text class="section-title">帮砍记录</text>
        <text class="section-count">{{ helpList.length }} 人帮忙砍价</text>
      </view>
      <view class="help-list">
        <view class="help-item" v-for="item in helpList" :key="item.id">
          <image class="help-avatar" :src="item.avatar" v-if="item.avatar" />
          <view class="help-avatar placeholder-avatar" v-else />
          <view class="help-info">
            <text class="help-name">{{ item.nickname }}</text>
            <text class="help-time">{{ item.time }}</text>
          </view>
          <text class="help-amount">-¥{{ item.amount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 活动规则 -->
    <view class="rules-section">
      <view class="section-header" @click="showRules = !showRules">
        <text class="section-title">活动规则</text>
        <text class="rules-toggle">{{ showRules ? '收起' : '展开' }}</text>
      </view>
      <view class="rules-content" v-if="showRules">
        <text class="rule-item">1. 活动时间：{{ formatTime(detail.start_time) }} - {{ formatTime(detail.end_time) }}</text>
        <text class="rule-item">2. 邀请好友帮砍价，砍到最低价即可购买</text>
        <text class="rule-item">3. 每次砍价金额随机</text>
        <text class="rule-item" v-if="detail.quota">4. 每人限购 {{ detail.quota }} 件</text>
        <text class="rule-item">5. 砍价成功后请在24小时内下单</text>
        <text class="rule-item" v-if="detail.rule">{{ detail.rule }}</text>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom" />

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-left-item">
          <text class="bar-left-icon">&#9825;</text>
          <text class="bar-left-text">收藏</text>
        </view>
      </view>
      <view class="bar-right">
        <view class="bar-btn invite-btn" @click="onInvite">
          <text class="bar-btn-text">邀请好友砍价</text>
        </view>
      </view>
    </view>
  </view>

  <!-- Loading -->
  <view class="loading-wrap" v-else-if="loading">
    <text class="loading-text">加载中...</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getBargainDetail } from '@/api/marketing';
import { getProductDetail } from '@/api/product';
import { checkLogin } from '@/utils';

const loading = ref(true);
const detail = ref<any>(null);
const productInfo = ref<any>({});
const showRules = ref(false);

// 模拟帮砍记录
const helpList = ref([
  { id: 1, nickname: '用户***', avatar: '', time: '2分钟前', amount: 3.5 },
  { id: 2, nickname: '用户***', avatar: '', time: '5分钟前', amount: 2.8 },
  { id: 3, nickname: '用户***', avatar: '', time: '10分钟前', amount: 4.2 },
]);

const currentPrice = computed(() => {
  if (!detail.value) return 0;
  // 模拟当前价格 = 原价 - 已砍金额
  const totalBargained = helpList.value.reduce((sum, item) => sum + item.amount, 0);
  const price = (detail.value.product_price || 0) - totalBargained;
  return Math.max(detail.value.price || 0, Math.round(price * 100) / 100);
});

const progressPercent = computed(() => {
  if (!detail.value) return 0;
  const range = (detail.value.product_price || 0) - (detail.value.price || 0);
  if (range <= 0) return 100;
  const bargained = (detail.value.product_price || 0) - currentPrice.value;
  return Math.min(100, Math.round((bargained / range) * 100));
});

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function onInvite() {
  if (!checkLogin()) return;
  if (!detail.value) return;

  // 模拟砍价成功后购买
  const params = {
    productId: detail.value.product_id,
    skuUnique: '',
    num: 1,
    price: currentPrice.value,
    name: productInfo.value.store_name || detail.value.title,
    image: detail.value.image || productInfo.value.image,
    activityType: 'bargain',
    activityId: detail.value.id,
  };
  uni.setStorageSync('buyNowItem', JSON.stringify(params));
  uni.navigateTo({ url: '/pages/goods/order_confirm/index?type=buyNow' });
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
    const res = await getBargainDetail(id);
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
  align-items: center;
  margin-top: 16rpx;
}
.price-current {
  display: flex;
  align-items: baseline;
  margin-right: 24rpx;
}
.price-sign {
  font-size: 28rpx;
  color: #ff6600;
  font-weight: bold;
}
.price-value {
  font-size: 44rpx;
  color: #ff6600;
  font-weight: bold;
  line-height: 1;
}
.price-info {
  display: flex;
  flex-direction: column;
}
.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}
.bottom-price {
  font-size: 22rpx;
  color: #ff6600;
  margin-top: 4rpx;
}

/* 砍价进度 */
.progress-section {
  background: #fff;
  margin-top: 16rpx;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.section-count {
  font-size: 24rpx;
  color: #999;
}
.progress-content {
  padding: 24rpx;
}
.progress-bar-wrap {
  margin-bottom: 16rpx;
}
.progress-bar {
  height: 16rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6600, #ff8533);
  border-radius: 8rpx;
  transition: width 0.3s ease;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
}
.progress-label-left,
.progress-label-right {
  font-size: 22rpx;
  color: #999;
}
.progress-desc {
  font-size: 24rpx;
  color: #ff6600;
  text-align: center;
}

/* 帮砍记录 */
.help-section {
  background: #fff;
  margin-top: 16rpx;
}
.help-list {
  padding: 0 24rpx;
}
.help-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.help-item:last-child {
  border-bottom: none;
}
.help-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.placeholder-avatar {
  background: #f5f5f5;
}
.help-info {
  flex: 1;
}
.help-name {
  font-size: 26rpx;
  color: #333;
}
.help-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}
.help-amount {
  font-size: 28rpx;
  color: #ff6600;
  font-weight: bold;
  flex-shrink: 0;
}

/* 活动规则 */
.rules-section {
  background: #fff;
  margin-top: 16rpx;
}
.rules-toggle {
  font-size: 24rpx;
  color: #999;
}
.rules-content {
  padding: 0 24rpx 24rpx;
}
.rule-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
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
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}
.bar-left {
  display: flex;
  padding-right: 24rpx;
}
.bar-left-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24rpx;
}
.bar-left-icon {
  font-size: 32rpx;
  color: #333;
}
.bar-left-text {
  font-size: 20rpx;
  color: #666;
  margin-top: 2rpx;
}
.bar-right {
  flex: 1;
}
.bar-btn {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
}
.invite-btn {
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
