<template>
  <view class="page">
    <view class="news-list">
      <view class="news-item" v-for="item in newsList" :key="item.id" @click="goDetail(item)">
        <view class="news-content">
          <text class="news-title">{{ item.title }}</text>
          <text class="news-digest">{{ item.digest }}</text>
          <view class="news-meta">
            <text class="news-author">{{ item.author }}</text>
            <text class="news-time">{{ item.add_time }}</text>
          </view>
        </view>
        <image class="news-image" :src="item.image" mode="aspectFill" v-if="item.image"></image>
      </view>
    </view>

    <view class="empty" v-if="newsList.length === 0">
      <text class="empty-text">暂无文章</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const newsList = ref([
  { id: 1, title: '商城活动公告', digest: '新年大促活动即将开始，更多优惠等你来...', image: '', author: '管理员', add_time: '2024-01-15' },
  { id: 2, title: '新品上架通知', digest: '多款新品已上架，品质保证...', image: '', author: '管理员', add_time: '2024-01-14' },
  { id: 3, title: '春节放假通知', digest: '春节期间正常营业，客服在线时间调整...', image: '', author: '管理员', add_time: '2024-01-13' },
  { id: 4, title: '会员权益升级', digest: '会员等级权益全面升级，更多专属优惠...', image: '', author: '管理员', add_time: '2024-01-12' },
]);

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/extension/news_detail?id=${item.id}` });
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.news-list { padding: 16rpx; }
.news-item { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; display: flex; }
.news-content { flex: 1; }
.news-title { font-size: 30rpx; font-weight: bold; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-digest { font-size: 24rpx; color: #999; margin-top: 12rpx; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-meta { display: flex; gap: 16rpx; margin-top: 12rpx; }
.news-author, .news-time { font-size: 22rpx; color: #999; }
.news-image { width: 200rpx; height: 140rpx; border-radius: 8rpx; margin-left: 20rpx; flex-shrink: 0; background: #eee; }
.empty { padding: 120rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: #999; }
</style>
