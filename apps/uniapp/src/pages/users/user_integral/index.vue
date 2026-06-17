<template>
  <view class="page">
    <!-- Points Balance -->
    <view class="balance-area">
      <text class="balance-label">当前积分</text>
      <text class="balance-number">{{ balance }}</text>
    </view>

    <!-- Points History -->
    <view class="section">
      <text class="section-title">积分明细</text>

      <view v-if="loading && list.length === 0" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="list.length === 0" class="empty-wrap">
        <text class="empty-text">暂无积分记录</text>
      </view>

      <view v-else class="integral-list">
        <view class="integral-item" v-for="item in list" :key="item.id">
          <view class="item-left">
            <text class="item-title">{{ item.title || item.mark || '积分变动' }}</text>
            <text class="item-time">{{ item.add_time }}</text>
          </view>
          <view class="item-right">
            <text :class="['item-amount', item.number > 0 ? 'positive' : 'negative']">
              {{ item.number > 0 ? '+' : '' }}{{ item.number }}
            </text>
          </view>
        </view>
      </view>

      <!-- Load More -->
      <view v-if="list.length > 0 && !noMore" class="load-more" @tap="loadMore">
        <text class="load-more-text">{{ loadingMore ? '加载中...' : '加载更多' }}</text>
      </view>
      <view v-if="noMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getIntegralList } from '@/api/user';
import { checkLogin } from '@/utils';

const loading = ref(true);
const loadingMore = ref(false);
const noMore = ref(false);
const page = ref(1);
const balance = ref(0);
const list = ref<any[]>([]);

async function fetchList(isRefresh = false) {
  if (isRefresh) {
    page.value = 1;
    noMore.value = false;
  }

  if (page.value === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const res = await getIntegralList({ page: page.value, limit: 20 });
    if (res.status === 200) {
      const data = res.data || {};
      const newList = data.list || data || [];
      if (isRefresh || page.value === 1) {
        list.value = newList;
      } else {
        list.value = [...list.value, ...newList];
      }
      balance.value = data.balance || data.total || 0;
      if (newList.length < 20) {
        noMore.value = true;
      }
      page.value++;
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  if (loadingMore.value || noMore.value) return;
  fetchList(false);
}

// Pull-down refresh
onPullDownRefresh(() => {
  fetchList(true).then(() => {
    uni.stopPullDownRefresh();
  });
});

// Reach bottom load more
onReachBottom(() => {
  loadMore();
});

onShow(() => {
  if (checkLogin()) {
    fetchList(true);
  }
});
</script>

<script lang="ts">
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.balance-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx;
  background: linear-gradient(135deg, #ff6600, #ff8533);
}

.balance-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.balance-number {
  font-size: 72rpx;
  font-weight: bold;
  color: #fff;
  margin-top: 12rpx;
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
  padding: 60rpx 0;
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

.empty-wrap {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}

.integral-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.integral-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 28rpx;
  color: #333;
}

.item-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.item-amount {
  font-size: 32rpx;
  font-weight: bold;
}

.item-amount.positive {
  color: #ff6600;
}

.item-amount.negative {
  color: #999;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.load-more-text {
  font-size: 26rpx;
  color: #ff6600;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #ccc;
}
</style>
