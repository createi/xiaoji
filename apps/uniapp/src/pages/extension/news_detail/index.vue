<template>
  <view class="page">
    <view class="article">
      <text class="article-title">{{ article.title }}</text>
      <view class="article-meta">
        <text class="article-author">{{ article.author }}</text>
        <text class="article-time">{{ article.add_time }}</text>
        <text class="article-visit">{{ article.visit }} 阅读</text>
      </view>
      <view class="article-content">
        <rich-text :nodes="article.content"></rich-text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const article = ref({
  title: '商城活动公告',
  author: '管理员',
  add_time: '2024-01-15',
  visit: 1250,
  content: '<p>尊敬的用户：</p><p>新年大促活动即将开始，更多优惠等你来！</p><p>活动时间：2024年1月20日 - 2024年2月5日</p><p>活动内容：</p><ul><li>全场商品满200减30</li><li>新品限时8折</li><li>会员专属双倍积分</li></ul><p>敬请期待！</p>',
});

onLoad((options) => {
  if (options?.id) {
    // TODO: fetch article by id
  }
});
</script>

<style scoped>
.page { min-height: 100vh; background: #fff; }
.article { padding: 32rpx; }
.article-title { font-size: 36rpx; font-weight: bold; color: #333; line-height: 1.5; }
.article-meta { display: flex; gap: 20rpx; margin-top: 16rpx; padding-bottom: 24rpx; border-bottom: 1rpx solid #f0f0f0; }
.article-author, .article-time, .article-visit { font-size: 24rpx; color: #999; }
.article-content { margin-top: 24rpx; font-size: 28rpx; color: #333; line-height: 1.8; }
</style>
