<template>
  <view class="page">
    <!-- 支付结果 - 成功 -->
    <view class="result-section" v-if="payResult === 'success'">
      <view class="result-icon success">
        <text class="result-icon-text">&#10003;</text>
      </view>
      <text class="result-title">支付成功</text>
      <text class="result-amount">¥{{ payAmount.toFixed(2) }}</text>
      <view class="result-actions">
        <view class="result-btn" @click="goOrderDetail">
          <text class="result-btn-text">查看订单</text>
        </view>
        <view class="result-btn outline" @click="goHome">
          <text class="result-btn-text outline-text">返回首页</text>
        </view>
      </view>
    </view>

    <!-- 支付结果 - 失败 -->
    <view class="result-section" v-else-if="payResult === 'fail'">
      <view class="result-icon fail">
        <text class="result-icon-text">X</text>
      </view>
      <text class="result-title">支付失败</text>
      <text class="result-desc">请稍后重试</text>
      <view class="result-actions">
        <view class="result-btn" @click="retryPay">
          <text class="result-btn-text">重新支付</text>
        </view>
        <view class="result-btn outline" @click="goOrderDetail">
          <text class="result-btn-text outline-text">查看订单</text>
        </view>
      </view>
    </view>

    <!-- 支付页面 -->
    <view class="pay-section" v-else>
      <!-- 订单金额 -->
      <view class="amount-section">
        <text class="amount-label">订单金额</text>
        <view class="amount-row">
          <text class="amount-sign">¥</text>
          <text class="amount-value">{{ payAmount.toFixed(2) }}</text>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="method-section">
        <text class="method-title">选择支付方式</text>
        <view
          class="method-item"
          :class="{ active: selectedMethod === 'wechat' }"
          @click="selectedMethod = 'wechat'"
        >
          <view class="method-left">
            <view class="method-icon wechat">
              <text class="method-icon-text">W</text>
            </view>
            <text class="method-name">微信支付</text>
          </view>
          <view class="method-radio" :class="{ active: selectedMethod === 'wechat' }">
            <text class="method-radio-dot" v-if="selectedMethod === 'wechat'"></text>
          </view>
        </view>
        <view
          class="method-item"
          :class="{ active: selectedMethod === 'balance' }"
          @click="selectedMethod = 'balance'"
        >
          <view class="method-left">
            <view class="method-icon balance">
              <text class="method-icon-text">B</text>
            </view>
            <text class="method-name">余额支付</text>
          </view>
          <view class="method-radio" :class="{ active: selectedMethod === 'balance' }">
            <text class="method-radio-dot" v-if="selectedMethod === 'balance'"></text>
          </view>
        </view>
      </view>

      <!-- 确认支付 -->
      <view class="pay-btn-wrap">
        <view class="pay-btn" @click="confirmPay">
          <text class="pay-btn-text">确认支付</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getOrderDetail } from '@/api/order';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const orderId = ref(0);
const payAmount = ref(0);
const selectedMethod = ref('wechat');
const payResult = ref<'pending' | 'success' | 'fail'>('pending');

onLoad((options) => {
  orderId.value = Number(options?.id || 0);
  payAmount.value = Number(options?.price || 0);

  if (orderId.value) {
    fetchOrderDetail();
  }
});

async function fetchOrderDetail() {
  try {
    const res = await getOrderDetail(orderId.value);
    if (res?.data) {
      payAmount.value = res.data.total_price || payAmount.value;
    }
  } catch {
    // handled
  }
}

function confirmPay() {
  uni.showLoading({ title: '支付中...' });

  // 模拟支付流程
  setTimeout(() => {
    uni.hideLoading();

    if (selectedMethod.value === 'wechat') {
      // 模拟微信支付
      // 实际项目中会调用 wx.requestPayment
      uni.showModal({
        title: '支付提示',
        content: `确认支付 ¥${payAmount.value.toFixed(2)} 吗？（演示模式）`,
        success: (res) => {
          if (res.confirm) {
            payResult.value = 'success';
            cartStore.clear();
          } else {
            payResult.value = 'fail';
          }
        },
      });
    } else {
      // 余额支付
      uni.showModal({
        title: '支付提示',
        content: `确认使用余额支付 ¥${payAmount.value.toFixed(2)} 吗？（演示模式）`,
        success: (res) => {
          if (res.confirm) {
            payResult.value = 'success';
            cartStore.clear();
          } else {
            payResult.value = 'fail';
          }
        },
      });
    }
  }, 1000);
}

function retryPay() {
  payResult.value = 'pending';
}

function goOrderDetail() {
  uni.redirectTo({ url: `/pages/goods/order_details/index?id=${orderId.value}` });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 支付金额 */
.amount-section {
  background: #fff;
  padding: 48rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.amount-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}
.amount-row {
  display: flex;
  align-items: baseline;
}
.amount-sign {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
}
.amount-value {
  font-size: 56rpx;
  color: #333;
  font-weight: bold;
  line-height: 1;
}

/* 支付方式 */
.method-section {
  background: #fff;
  margin-top: 16rpx;
  padding: 24rpx;
}
.method-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.method-item:last-child {
  border-bottom: none;
}
.method-left {
  display: flex;
  align-items: center;
}
.method-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}
.method-icon.wechat {
  background: #07c160;
}
.method-icon.balance {
  background: #E93323;
}
.method-icon-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}
.method-name {
  font-size: 28rpx;
  color: #333;
}
.method-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}
.method-radio.active {
  border-color: #E93323;
}
.method-radio-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #E93323;
}

/* 确认支付按钮 */
.pay-btn-wrap {
  padding: 48rpx 24rpx;
}
.pay-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E93323;
  border-radius: 44rpx;
}
.pay-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

/* 支付结果 */
.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
}
.result-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-icon.success {
  background: #07c160;
}
.result-icon.fail {
  background: #ff4d4f;
}
.result-icon-text {
  font-size: 56rpx;
  color: #fff;
}
.result-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-top: 32rpx;
}
.result-amount {
  font-size: 28rpx;
  color: #666;
  margin-top: 16rpx;
}
.result-desc {
  font-size: 26rpx;
  color: #999;
  margin-top: 12rpx;
}
.result-actions {
  display: flex;
  margin-top: 60rpx;
  gap: 24rpx;
}
.result-btn {
  padding: 0 40rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E93323;
  border-radius: 36rpx;
}
.result-btn.outline {
  background: #fff;
  border: 2rpx solid #ddd;
}
.result-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}
.result-btn-text.outline-text {
  color: #666;
}
</style>
