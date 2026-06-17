<template>
  <view class="empty">
    <text class="empty-text">{{ text }}</text>
    <view class="empty-action" v-if="actionText" @click="$emit('action')">
      <text class="empty-action-text">{{ actionText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
  actionText?: string;
}>();

defineEmits(['action']);
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}
.empty-action {
  margin-top: 30rpx;
  padding: 16rpx 40rpx;
  background: #ff6600;
  border-radius: 40rpx;
}
.empty-action-text {
  font-size: 28rpx;
  color: #fff;
}
</style>
