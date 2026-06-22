<template>
  <view class="page">
    <view class="tabs">
      <view class="tab" :class="{ active: currentTab === item.value }" v-for="item in tabs" :key="item.value" @click="currentTab = item.value">
        <text class="tab-text">{{ item.label }}</text>
      </view>
    </view>

    <view class="bill-list">
      <view class="bill-item" v-for="item in billList" :key="item.id">
        <view class="bill-left">
          <text class="bill-type">{{ item.type_name }}</text>
          <text class="bill-mark">{{ item.mark }}</text>
        </view>
        <view class="bill-right">
          <text class="bill-number" :class="{ positive: item.number > 0, negative: item.number < 0 }">
            {{ item.number > 0 ? '+' : '' }}{{ item.number.toFixed(2) }}
          </text>
          <text class="bill-time">{{ item.add_time }}</text>
        </view>
      </view>
    </view>

    <view class="empty" v-if="billList.length === 0">
      <text class="empty-text">暂无账单记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentTab = ref('all');

const tabs = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' },
];

const billList = ref([
  { id: 1, type_name: '购物消费', mark: '购买商品 - 无线蓝牙耳机', number: -299.00, add_time: '2024-01-15 14:30' },
  { id: 2, type_name: '充值', mark: '微信充值', number: 500.00, add_time: '2024-01-14 10:00' },
  { id: 3, type_name: '佣金收入', mark: '推广佣金', number: 25.50, add_time: '2024-01-13 08:20' },
  { id: 4, type_name: '购物消费', mark: '购买商品 - 运动水杯', number: -89.00, add_time: '2024-01-12 16:45' },
]);
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.tabs { display: flex; background: #fff; padding: 0 24rpx; border-bottom: 1rpx solid #f0f0f0; }
.tab { flex: 1; padding: 24rpx 0; text-align: center; position: relative; }
.tab.active .tab-text { color: #ff6600; font-weight: bold; }
.tab.active::after { content: ''; position: absolute; bottom: 0; left: 30%; right: 30%; height: 4rpx; background: #ff6600; border-radius: 2rpx; }
.tab-text { font-size: 28rpx; color: #666; }
.bill-list { padding: 16rpx; }
.bill-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; display: flex; justify-content: space-between; }
.bill-left { flex: 1; }
.bill-type { font-size: 28rpx; color: #333; display: block; }
.bill-mark { font-size: 22rpx; color: #999; margin-top: 8rpx; display: block; }
.bill-right { text-align: right; }
.bill-number { font-size: 30rpx; font-weight: bold; display: block; }
.bill-number.positive { color: #ff6600; }
.bill-number.negative { color: #333; }
.bill-time { font-size: 22rpx; color: #999; margin-top: 8rpx; display: block; }
.empty { padding: 120rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: #999; }
</style>
