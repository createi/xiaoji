<template>
  <view class="page">
    <view class="comment-item" v-for="item in commentList" :key="item.id">
      <view class="user-info">
        <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="nickname">{{ item.nickname }}</text>
          <view class="stars">
            <text v-for="i in 5" :key="i" class="star" :class="{ active: i <= item.product_score }">★</text>
          </view>
        </view>
        <text class="time">{{ item.time }}</text>
      </view>
      <text class="content">{{ item.context }}</text>
      <view class="pics" v-if="item.pics && item.pics.length > 0">
        <image class="pic" v-for="(pic, i) in item.pics" :key="i" :src="pic" mode="aspectFill" @click="previewImage(i, item.pics)"></image>
      </view>
      <view class="specs" v-if="item.specs">
        <text class="specs-text">{{ item.specs }}</text>
      </view>
    </view>

    <view class="empty" v-if="commentList.length === 0">
      <text class="empty-text">暂无评价</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const commentList = ref([
  { id: 1, avatar: '', nickname: '用户***3', product_score: 5, context: '质量很好，发货也快，非常满意！', pics: [], time: '2024-01-15', specs: '颜色:白色 尺码:XL' },
  { id: 2, avatar: '', nickname: '用户***8', product_score: 4, context: '不错的商品，物流也快。', pics: [], time: '2024-01-14', specs: '颜色:黑色 尺码:L' },
]);

onLoad(() => {});

function previewImage(index: number, urls: string[]) {
  uni.previewImage({ urls, current: urls[index] });
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.comment-item { background: #fff; padding: 24rpx; margin-bottom: 16rpx; }
.user-info { display: flex; align-items: center; }
.avatar { width: 64rpx; height: 64rpx; border-radius: 50%; margin-right: 16rpx; background: #eee; }
.user-detail { flex: 1; }
.nickname { font-size: 26rpx; color: #333; }
.stars { margin-top: 4rpx; }
.star { font-size: 24rpx; color: #ddd; }
.star.active { color: #E93323; }
.time { font-size: 22rpx; color: #999; }
.content { font-size: 26rpx; color: #333; margin-top: 16rpx; line-height: 1.6; }
.pics { display: flex; gap: 12rpx; margin-top: 16rpx; flex-wrap: wrap; }
.pic { width: 140rpx; height: 140rpx; border-radius: 8rpx; background: #eee; }
.specs { margin-top: 12rpx; }
.specs-text { font-size: 22rpx; color: #999; background: #f5f5f5; padding: 4rpx 12rpx; border-radius: 4rpx; }
.empty { padding: 120rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: #999; }
</style>
