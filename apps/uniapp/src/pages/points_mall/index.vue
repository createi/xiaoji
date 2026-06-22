<template>
  <view class="page">
    <view class="header">
      <text class="title">积分商城</text>
      <view class="integral-info">
        <text class="integral-label">当前积分</text>
        <text class="integral-value">{{ userIntegral }}</text>
      </view>
    </view>

    <view class="product-list">
      <view class="product-card" v-for="item in productList" :key="item.id" @click="goDetail(item)">
        <image class="product-image" :src="item.image" mode="aspectFill"></image>
        <view class="product-info">
          <text class="product-name">{{ item.title }}</text>
          <view class="product-bottom">
            <view class="price-row">
              <text class="integral-icon">🌱</text>
              <text class="price">{{ item.price }}</text>
              <text class="integral-text">积分</text>
            </view>
            <text class="stock">剩余 {{ item.stock }} 件</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="productList.length === 0">
      <text class="empty-text">暂无积分商品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userIntegral = ref(2580);

const productList = ref([
  { id: 1, title: '精美保温杯', image: '', price: 500, stock: 20 },
  { id: 2, title: '品牌运动毛巾', image: '', price: 200, stock: 50 },
  { id: 3, title: '创意手机支架', image: '', price: 100, stock: 100 },
  { id: 4, title: '时尚帆布袋', image: '', price: 300, stock: 30 },
  { id: 5, title: '多功能收纳盒', image: '', price: 400, stock: 25 },
  { id: 6, title: '可爱卡通玩偶', image: '', price: 800, stock: 15 },
]);

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/points_mall/detail?id=${item.id}` });
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.header { background: linear-gradient(135deg, #ff6600, #ff8533); padding: 40rpx 24rpx; display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 36rpx; color: #fff; font-weight: bold; }
.integral-info { text-align: right; }
.integral-label { font-size: 22rpx; color: rgba(255,255,255,0.8); display: block; }
.integral-value { font-size: 40rpx; color: #fff; font-weight: bold; }
.product-list { padding: 16rpx; display: flex; flex-wrap: wrap; gap: 16rpx; }
.product-card { width: calc(50% - 8rpx); background: #fff; border-radius: 12rpx; overflow: hidden; }
.product-image { width: 100%; height: 340rpx; }
.product-info { padding: 16rpx; }
.product-name { font-size: 26rpx; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }
.price-row { display: flex; align-items: center; }
.integral-icon { font-size: 24rpx; margin-right: 4rpx; }
.price { font-size: 32rpx; color: #ff6600; font-weight: bold; }
.integral-text { font-size: 20rpx; color: #999; margin-left: 4rpx; }
.stock { font-size: 20rpx; color: #999; }
.empty { padding: 120rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: #999; }
</style>
