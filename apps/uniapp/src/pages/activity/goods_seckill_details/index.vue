<template>
  <view class="page" v-if="detail">
    <!-- 倒计时区域 -->
    <view class="countdown-section">
      <view class="countdown-header">
        <text class="countdown-title">{{ detail.title }}</text>
        <view class="countdown-timer" v-if="countdownText">
          <text class="countdown-label">{{ countdownLabel }}</text>
          <view class="countdown-blocks">
            <view class="countdown-block">
              <text class="countdown-num">{{ timeParts.hours }}</text>
            </view>
            <text class="countdown-sep">:</text>
            <view class="countdown-block">
              <text class="countdown-num">{{ timeParts.minutes }}</text>
            </view>
            <text class="countdown-sep">:</text>
            <view class="countdown-block">
              <text class="countdown-num">{{ timeParts.seconds }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="countdown-status" v-if="statusText">
        <text class="countdown-status-text">{{ statusText }}</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-section">
      <image class="product-img" :src="detail.image || productInfo.image" mode="aspectFill" v-if="detail.image || productInfo.image" />
      <view class="product-img placeholder" v-else />
      <view class="product-info">
        <text class="product-name">{{ productInfo.store_name || detail.title }}</text>
        <view class="product-price-row">
          <text class="seckill-price">¥{{ detail.price?.toFixed(2) }}</text>
          <text class="original-price" v-if="productInfo.ot_price">¥{{ productInfo.ot_price.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 库存进度条 -->
    <view class="progress-section">
      <view class="progress-header">
        <text class="progress-text">已抢 {{ progressPercent }}%</text>
        <text class="progress-remain">剩余 {{ detail.stock }} 件</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }" />
      </view>
    </view>

    <!-- 活动规则 -->
    <view class="rules-section">
      <view class="section-header">
        <text class="section-title">活动规则</text>
      </view>
      <view class="rules-content">
        <text class="rule-item">1. 活动时间：{{ formatTime(detail.start_time) }} - {{ formatTime(detail.end_time) }}</text>
        <text class="rule-item">2. 秒杀商品数量有限，先到先得</text>
        <text class="rule-item" v-if="detail.quota">3. 每人限购 {{ detail.quota }} 件</text>
        <text class="rule-item">4. 秒杀商品不支持退换货</text>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom" />

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-btn" :class="{ disabled: !canBuy }" @click="onBuy">
        <text class="bar-btn-text">{{ buyBtnText }}</text>
      </view>
    </view>
  </view>

  <!-- Loading -->
  <view class="loading-wrap" v-else-if="loading">
    <text class="loading-text">加载中...</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getSeckillDetail } from '@/api/marketing';
import { getProductDetail } from '@/api/product';
import { checkLogin } from '@/utils';

const loading = ref(true);
const detail = ref<any>(null);
const productInfo = ref<any>({});

// 倒计时
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

const status = computed(() => {
  if (!detail.value) return 'pending';
  const nowTime = Date.now();
  if (nowTime < detail.value.start_time) return 'pending'; // 未开始
  if (nowTime > detail.value.end_time) return 'ended'; // 已结束
  return 'active'; // 进行中
});

const statusText = computed(() => {
  if (status.value === 'pending') return '未开始';
  if (status.value === 'ended') return '已结束';
  return '进行中';
});

const countdownLabel = computed(() => {
  if (status.value === 'pending') return '距开始';
  if (status.value === 'active') return '距结束';
  return '';
});

const countdownText = computed(() => {
  if (status.value === 'ended') return '';
  const target = status.value === 'pending' ? detail.value?.start_time : detail.value?.end_time;
  if (!target) return '';
  const diff = target - Date.now();
  return diff > 0 ? String(diff) : '';
});

const timeParts = computed(() => {
  const target = status.value === 'pending' ? detail.value?.start_time : detail.value?.end_time;
  if (!target) return { hours: '00', minutes: '00', seconds: '00' };
  const diff = Math.max(0, target - now.value);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
});

const progressPercent = computed(() => {
  if (!detail.value) return 0;
  const total = detail.value.stock + (detail.value.total - detail.value.stock) || detail.value.total || 1;
  return Math.round(((detail.value.total - detail.value.stock) / total) * 100);
});

const canBuy = computed(() => status.value === 'active' && detail.value?.stock > 0);

const buyBtnText = computed(() => {
  if (status.value === 'pending') return '未开始';
  if (status.value === 'ended') return '已结束';
  if (detail.value?.stock <= 0) return '已售罄';
  return '立即抢购';
});

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function onBuy() {
  if (!canBuy.value) return;
  if (!checkLogin()) return;

  // 跳转到下单页
  const params = {
    productId: detail.value.product_id,
    skuUnique: '',
    num: 1,
    price: detail.value.price,
    name: productInfo.value.store_name || detail.value.title,
    image: detail.value.image || productInfo.value.image,
    activityType: 'seckill',
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
    const res = await getSeckillDetail(id);
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

  // 启动倒计时
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 倒计时 */
.countdown-section {
  background: linear-gradient(135deg, #ff6600, #ff8533);
  padding: 32rpx 24rpx;
}
.countdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.countdown-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  flex: 1;
}
.countdown-timer {
  display: flex;
  align-items: center;
}
.countdown-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 12rpx;
}
.countdown-blocks {
  display: flex;
  align-items: center;
}
.countdown-block {
  width: 48rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.countdown-num {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}
.countdown-sep {
  font-size: 24rpx;
  color: #fff;
  margin: 0 6rpx;
}
.countdown-status {
  margin-top: 12rpx;
}
.countdown-status-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 商品信息 */
.product-section {
  background: #fff;
  padding: 24rpx;
  margin-top: 16rpx;
  display: flex;
}
.product-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.product-img.placeholder {
  background: #f5f5f5;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  margin-top: 16rpx;
}
.seckill-price {
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

/* 进度条 */
.progress-section {
  background: #fff;
  padding: 24rpx;
  margin-top: 16rpx;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.progress-text {
  font-size: 24rpx;
  color: #ff6600;
}
.progress-remain {
  font-size: 24rpx;
  color: #999;
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

/* 活动规则 */
.rules-section {
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
.rules-content {
  padding: 24rpx;
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
  justify-content: center;
  background: #fff;
  padding: 0 24rpx;
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
  background: #ff6600;
  border-radius: 36rpx;
}
.bar-btn.disabled {
  background: #ccc;
}
.bar-btn-text {
  font-size: 30rpx;
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
