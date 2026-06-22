<template>
  <view class="price-display">
    <text class="price-symbol">¥</text>
    <text class="price-integer">{{ integerPart }}</text>
    <text class="price-decimal" v-if="decimalPart">.{{ decimalPart }}</text>
    <text class="price-ot" v-if="otPrice">¥{{ otPrice }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  price: number;
  otPrice?: number;
}>();

const integerPart = computed(() => {
  const parts = props.price.toFixed(2).split('.');
  return parts[0];
});

const decimalPart = computed(() => {
  const parts = props.price.toFixed(2).split('.');
  return parts[1] === '00' ? '' : parts[1];
});
</script>

<style scoped>
.price-display { display: flex; align-items: baseline; }
.price-symbol { font-size: 24rpx; color: #ff6600; font-weight: bold; }
.price-integer { font-size: 36rpx; color: #ff6600; font-weight: bold; line-height: 1; }
.price-decimal { font-size: 24rpx; color: #ff6600; font-weight: bold; }
.price-ot { font-size: 22rpx; color: #999; text-decoration: line-through; margin-left: 10rpx; }
</style>
