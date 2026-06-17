<template>
  <view class="page">
    <!-- Tab Bar -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', currentTab === tab.value ? 'active' : '']"
        @tap="switchTab(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <view v-if="currentTab === tab.value" class="tab-line"></view>
      </view>
    </view>

    <!-- Order List -->
    <scroll-view
      class="order-scroll"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshing"
    >
      <!-- Loading -->
      <view v-if="loading && list.length === 0" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- Empty -->
      <view v-else-if="list.length === 0" class="empty-wrap">
        <text class="empty-text">暂无订单</text>
      </view>

      <!-- Order Cards -->
      <view v-else class="order-list">
        <view
          class="order-card"
          v-for="item in list"
          :key="item.id"
          @tap="handleDetail(item.id)"
        >
          <!-- Order Header -->
          <view class="card-header">
            <text class="order-no">订单号：{{ item.order_id }}</text>
            <text :class="['order-status', 'status-' + item.status]">
              {{ getStatusText(item.status) }}
            </text>
          </view>

          <!-- Product Item -->
          <view class="card-body" v-for="goods in item.cartInfo" :key="goods.id">
            <image
              class="goods-image"
              :src="goods.productInfo?.image"
              mode="aspectFill"
            />
            <view class="goods-info">
              <text class="goods-name">{{ goods.productInfo?.store_name }}</text>
              <text class="goods-spec" v-if="goods.productInfo?.attrInfo">
                {{ goods.productInfo.attrInfo.sku }}
              </text>
            </view>
            <view class="goods-price-wrap">
              <text class="goods-price">¥{{ goods.productInfo?.price }}</text>
              <text class="goods-qty">x{{ goods.cart_num }}</text>
            </view>
          </view>

          <!-- Order Footer -->
          <view class="card-footer">
            <text class="order-total">
              共{{ item.total_num }}件 合计：<text class="total-price">¥{{ item.pay_price }}</text>
            </text>
          </view>
        </view>
      </view>

      <!-- Load More -->
      <view v-if="list.length > 0 && !noMore" class="load-more">
        <text class="load-more-text">{{ loadingMore ? '加载中...' : '加载更多' }}</text>
      </view>
      <view v-if="noMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOrderList } from '@/api/order';
import { checkLogin, navigateTo } from '@/utils';

const tabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: '0' },
  { label: '待发货', value: '1' },
  { label: '待收货', value: '2' },
  { label: '待评价', value: '3' },
  { label: '退款', value: '-1' },
];

const loading = ref(true);
const loadingMore = ref(false);
const refreshing = ref(false);
const noMore = ref(false);
const currentTab = ref('');
const page = ref(1);
const list = ref<any[]>([]);

function getStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '待评价',
    4: '已完成',
    '-1': '已退款',
  };
  return map[status] || '未知';
}

async function fetchList(isRefresh = false) {
  if (isRefresh) {
    page.value = 1;
    noMore.value = false;
  }

  if (page.value === 1 && !isRefresh) {
    loading.value = true;
  } else if (isRefresh) {
    refreshing.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const params: Record<string, any> = { page: page.value, limit: 10 };
    if (currentTab.value) {
      params.status = currentTab.value;
    }
    const res = await getOrderList(params);
    if (res.status === 200) {
      const newList = res.data?.list || res.data || [];
      if (isRefresh || page.value === 1) {
        list.value = newList;
      } else {
        list.value = [...list.value, ...newList];
      }
      if (newList.length < 10) {
        noMore.value = true;
      }
      page.value++;
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    loading.value = false;
    loadingMore.value = false;
    refreshing.value = false;
  }
}

function switchTab(value: string) {
  if (currentTab.value === value) return;
  currentTab.value = value;
  list.value = [];
  fetchList(true);
}

function handleDetail(id: number) {
  navigateTo(`/pages/goods/order_details/index?id=${id}`);
}

function onRefresh() {
  fetchList(true).then(() => {
    uni.stopPullDownRefresh();
  });
}

function loadMore() {
  if (loadingMore.value || noMore.value) return;
  fetchList(false);
}

onShow(() => {
  if (checkLogin()) {
    fetchList(true);
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
  display: flex;
  flex-direction: column;
}

.tab-bar {
  display: flex;
  background-color: #fff;
  padding: 0 10rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 16rpx;
  position: relative;
}

.tab-text {
  font-size: 26rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #ff6600;
  font-weight: bold;
}

.tab-line {
  position: absolute;
  bottom: 0;
  width: 48rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: #ff6600;
}

.order-scroll {
  flex: 1;
  height: 0;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 300rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-wrap {
  display: flex;
  justify-content: center;
  padding: 300rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.order-list {
  padding: 20rpx;
}

.order-card {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-no {
  font-size: 24rpx;
  color: #999;
}

.order-status {
  font-size: 24rpx;
  font-weight: bold;
}

.status-0 {
  color: #ff6600;
}

.status-1 {
  color: #1890ff;
}

.status-2 {
  color: #52c41a;
}

.status-3 {
  color: #faad14;
}

.status--1 {
  color: #999;
}

.card-body {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  gap: 20rpx;
}

.goods-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background-color: #f5f5f5;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goods-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-spec {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.goods-price-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.goods-price {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.goods-qty {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16rpx 24rpx 24rpx;
}

.order-total {
  font-size: 26rpx;
  color: #333;
}

.total-price {
  color: #ff6600;
  font-weight: bold;
  font-size: 30rpx;
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
