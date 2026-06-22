<template>
  <view class="page">
    <!-- 支付成功 -->
    <view class="result-section" v-if="status === 'success'">
      <view class="result-icon success">
        <text class="icon-text">&#10003;</text>
      </view>
      <text class="result-title">支付成功</text>
      <text class="result-amount">¥{{ amount }}</text>
      <view class="result-actions">
        <view class="btn primary" @click="goOrderDetail">
          <text class="btn-text">查看订单</text>
        </view>
        <view class="btn outline" @click="goHome">
          <text class="btn-text outline-text">返回首页</text>
        </view>
      </view>
    </view>

    <!-- 支付失败 -->
    <view class="result-section" v-else>
      <view class="result-icon fail">
        <text class="icon-text">X</text>
      </view>
      <text class="result-title">支付失败</text>
      <text class="result-desc">请稍后重试</text>
      <view class="result-actions">
        <view class="btn primary" @click="retryPay">
          <text class="btn-text">重新支付</text>
        </view>
        <view class="btn outline" @click="goOrderDetail">
          <text class="btn-text outline-text">查看订单</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const orderId = ref('');
const amount = ref('0.00');
const status = ref('success');

onLoad((options) => {
  orderId.value = options?.id || '';
  amount.value = options?.price || '0.00';
  status.value = (options?.status as string) || 'success';
});

function goOrderDetail() {
  uni.redirectTo({ url: `/pages/goods/order_details/index?id=${orderId.value}` });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

function retryPay() {
  uni.navigateBack();
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.result-section { display: flex; flex-direction: column; align-items: center; padding-top: 120rpx; }
.result-icon { width: 120rpx; height: 120rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.result-icon.success { background: #07c160; }
.result-icon.fail { background: #ff4d4f; }
.icon-text { font-size: 56rpx; color: #fff; }
.result-title { font-size: 34rpx; font-weight: bold; color: #333; margin-top: 32rpx; }
.result-amount { font-size: 28rpx; color: #666; margin-top: 16rpx; }
.result-desc { font-size: 26rpx; color: #999; margin-top: 12rpx; }
.result-actions { display: flex; margin-top: 60rpx; gap: 24rpx; }
.btn { padding: 0 40rpx; height: 72rpx; display: flex; align-items: center; justify-content: center; background: #ff6600; border-radius: 36rpx; }
.btn.outline { background: #fff; border: 2rpx solid #ddd; }
.btn-text { font-size: 28rpx; color: #fff; font-weight: bold; }
.btn-text.outline-text { color: #666; }
</style>
