<template>
  <view class="page">
    <!-- Sign-in Header -->
    <view class="sign-header">
      <view class="sign-info">
        <text class="sign-title">每日签到</text>
        <text class="sign-desc">连续签到可获得积分奖励</text>
      </view>
      <view class="sign-count">
        <text class="count-number">{{ consecutiveDays }}</text>
        <text class="count-label">天</text>
      </view>
    </view>

    <!-- Sign-in Button -->
    <view class="sign-btn-area">
      <view
        :class="['sign-btn', signedToday ? 'signed' : '']"
        @tap="handleSign"
      >
        <text class="sign-btn-text">{{ signedToday ? '今日已签到' : '立即签到' }}</text>
      </view>
    </view>

    <!-- Sign-in History -->
    <view class="section">
      <text class="section-title">签到记录</text>
      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="signList.length === 0" class="empty-wrap">
        <text class="empty-text">暂无签到记录</text>
      </view>
      <view v-else class="sign-history">
        <view class="history-item" v-for="item in signList" :key="item.id">
          <view class="history-left">
            <text class="history-date">{{ item.date }}</text>
            <text class="history-integral">+{{ item.integral }} 积分</text>
          </view>
          <view class="history-right">
            <view class="check-icon">
              <text class="check-text">V</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Rules Section -->
    <view class="section rules-section">
      <text class="section-title">签到规则</text>
      <view class="rules-list">
        <text class="rule-item">1. 每日签到可获得积分奖励，连续签到天数越多奖励越丰厚。</text>
        <text class="rule-item">2. 连续签到7天可获得额外奖励积分。</text>
        <text class="rule-item">3. 签到中断后将重新计算连续天数。</text>
        <text class="rule-item">4. 每日仅可签到一次，签到时间为每日00:00-23:59。</text>
        <text class="rule-item">5. 积分可用于抵扣商品金额，具体规则请查看积分商城。</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sign, getSignList } from '@/api/user';
import { checkLogin } from '@/utils';

const loading = ref(true);
const consecutiveDays = ref(0);
const signedToday = ref(false);
const signList = ref<any[]>([]);

async function fetchSignList() {
  loading.value = true;
  try {
    const res = await getSignList();
    if (res.status === 200) {
      const list = res.data?.list || res.data || [];
      signList.value = list;
      // Calculate consecutive days from list
      let days = 0;
      const today = new Date().toISOString().slice(0, 10);
      for (const item of list) {
        if (item.date === today) {
          signedToday.value = true;
        }
        days++;
      }
      consecutiveDays.value = days > 0 ? days : 0;
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}

async function handleSign() {
  if (!checkLogin()) return;
  if (signedToday.value) {
    uni.showToast({ title: '今日已签到', icon: 'none' });
    return;
  }

  try {
    const res = await sign();
    if (res.status === 200) {
      uni.showToast({ title: '签到成功', icon: 'success' });
      signedToday.value = true;
      consecutiveDays.value++;
      fetchSignList();
    }
  } catch (e: any) {
    // handled by interceptor
  }
}

onShow(() => {
  if (checkLogin()) {
    fetchSignList();
  }
});
</script>

<script lang="ts">
import { onShow } from '@dcloudio/uni-app';
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.sign-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #E93323, #f0684d);
}

.sign-info {
  display: flex;
  flex-direction: column;
}

.sign-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.sign-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.sign-count {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.count-number {
  font-size: 60rpx;
  font-weight: bold;
  color: #fff;
}

.count-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.sign-btn-area {
  padding: 30rpx;
}

.sign-btn {
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E93323;
  border-radius: 45rpx;
}

.sign-btn.signed {
  background-color: #ccc;
}

.sign-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

.empty-wrap {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-left {
  display: flex;
  flex-direction: column;
}

.history-date {
  font-size: 28rpx;
  color: #333;
}

.history-integral {
  font-size: 24rpx;
  color: #E93323;
  margin-top: 6rpx;
}

.check-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #E93323;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.rules-section {
  margin-bottom: 40rpx;
}

.rule-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 10rpx;
  display: block;
}
</style>
