<template>
  <view class="page">
    <view class="header">
      <text class="express-name">{{ logisticsInfo.delivery_name }}</text>
      <text class="express-no">运单号: {{ logisticsInfo.delivery_id }}</text>
    </view>

    <view class="timeline">
      <view class="timeline-item" v-for="(item, index) in logisticsList" :key="index" :class="{ active: index === 0 }">
        <view class="dot"></view>
        <view class="content">
          <text class="text">{{ item.context }}</text>
          <text class="time">{{ item.time }}</text>
        </view>
      </view>
    </view>

    <view class="empty" v-if="logisticsList.length === 0">
      <text class="empty-text">暂无物流信息</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const logisticsInfo = ref({ delivery_name: '顺丰速运', delivery_id: 'SF1234567890' });
const logisticsList = ref([
  { context: '快件已签收，签收人：本人', time: '2024-01-15 14:30:00' },
  { context: '快件正在派送中', time: '2024-01-15 09:20:00' },
  { context: '快件已到达 本地分拨中心', time: '2024-01-14 22:10:00' },
  { context: '快件已发出，从 深圳分拨中心 发出', time: '2024-01-14 18:00:00' },
  { context: '快件已到达 深圳分拨中心', time: '2024-01-14 12:30:00' },
  { context: '快件已揽收', time: '2024-01-14 10:00:00' },
]);

onLoad(() => {});
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.header { background: #fff; padding: 24rpx; margin-bottom: 16rpx; }
.express-name { font-size: 32rpx; font-weight: bold; color: #333; }
.express-no { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }
.timeline { background: #fff; padding: 24rpx; }
.timeline-item { display: flex; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.timeline-item:last-child { border-bottom: none; }
.dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: #ddd; margin-right: 20rpx; margin-top: 8rpx; flex-shrink: 0; }
.timeline-item.active .dot { background: #ff6600; }
.content { flex: 1; }
.text { font-size: 26rpx; color: #333; display: block; }
.timeline-item.active .text { color: #ff6600; }
.time { font-size: 22rpx; color: #999; margin-top: 8rpx; display: block; }
.empty { padding: 120rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: #999; }
</style>
