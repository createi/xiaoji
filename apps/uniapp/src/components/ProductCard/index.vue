<template>
  <view class="product-card" @click="handleClick">
    <view class="product-img-wrap">
      <image class="product-img" :src="product.image" mode="aspectFill" v-if="product.image" />
      <view class="product-img placeholder" v-else />
      <view class="coupon-badge" v-if="product.coupon_price">
        <text class="coupon-text">券</text>
      </view>
    </view>
    <view class="product-info">
      <text class="product-name">{{ product.store_name }}</text>
      <view class="product-price-row">
        <text class="product-price">¥{{ product.price?.toFixed(2) }}</text>
        <text class="product-ot-price" v-if="product.ot_price">¥{{ product.ot_price?.toFixed(2) }}</text>
      </view>
      <view class="product-meta">
        <text class="product-sales" v-if="product.sales">{{ product.sales }}人付款</text>
        <view class="product-rating" v-if="product.score">
          <text class="rating-star">★</text>
          <text class="rating-value">{{ product.score }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: {
    id: number;
    image?: string;
    store_name?: string;
    price?: number;
    ot_price?: number;
    sales?: number;
    score?: number;
    coupon_price?: number;
  };
}>();

const emit = defineEmits(['click']);

function handleClick() {
  emit('click', props.product);
  uni.navigateTo({ url: `/pages/goods_details/index?id=${props.product.id}` });
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}
.product-img-wrap {
  position: relative;
}
.product-img {
  width: 100%;
  height: 340rpx;
  background: #f5f5f5;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}
.coupon-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  background: #E93323;
  border-radius: 6rpx;
  padding: 2rpx 8rpx;
}
.coupon-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}
.product-info {
  padding: 16rpx;
}
.product-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  margin-top: 10rpx;
}
.product-price {
  font-size: 32rpx;
  color: #E93323;
  font-weight: bold;
}
.product-ot-price {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 10rpx;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6rpx;
}
.product-sales {
  font-size: 22rpx;
  color: #999;
}
.product-rating {
  display: flex;
  align-items: center;
}
.rating-star {
  font-size: 22rpx;
  color: #E93323;
}
.rating-value {
  font-size: 22rpx;
  color: #E93323;
  margin-left: 4rpx;
}
</style>
