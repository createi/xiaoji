<template>
  <view class="load-more">
    <view class="loading" v-if="loading">
      <view class="spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    <view class="no-more" v-else-if="finished">
      <text class="no-more-text">— 没有更多了 —</text>
    </view>
    <view class="load-btn" v-else @click="$emit('load')">
      <text class="load-text">加载更多</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  finished?: boolean;
}>();

defineEmits(['load']);
</script>

<style scoped>
.load-more { padding: 24rpx 0; text-align: center; }
.loading { display: flex; align-items: center; justify-content: center; gap: 12rpx; }
.spinner { width: 32rpx; height: 32rpx; border: 4rpx solid #eee; border-top-color: #E93323; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 24rpx; color: #999; }
.no-more-text { font-size: 24rpx; color: #ccc; }
.load-text { font-size: 24rpx; color: #E93323; }
</style>
