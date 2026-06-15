<template>
  <view class="index">
    <view class="banner">
      <swiper class="swiper" indicator-dots autoplay circular>
        <swiper-item>
          <view class="swiper-item">轮播图 1</view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">轮播图 2</view>
        </swiper-item>
      </swiper>
    </view>
    <view class="nav-grid">
      <view class="nav-item" v-for="item in navList" :key="item.name">
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>
    <view class="section">
      <view class="section-title">热门推荐</view>
      <view class="goods-list">
        <view class="goods-item" v-for="item in 6" :key="item">
          <view class="goods-img">商品图</view>
          <view class="goods-name">商品名称{{ item }}</view>
          <view class="goods-price">¥99.00</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navList = ref([
  { name: '手机数码' },
  { name: '电脑办公' },
  { name: '家用电器' },
  { name: '服饰鞋包' },
  { name: '食品饮料' },
  { name: '美妆个护' },
  { name: '查看更多' },
  { name: '全部分类' },
]);
</script>

<style scoped>
.index {
  padding-bottom: 100rpx;
}

.banner {
  height: 300rpx;
}

.swiper {
  height: 300rpx;
}

.swiper-item {
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  color: #999;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20rpx;
  background: #fff;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.nav-name {
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}

.section {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #fff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.goods-item {
  background: #f9f9f9;
  border-radius: 12rpx;
  overflow: hidden;
}

.goods-img {
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  color: #999;
}

.goods-name {
  padding: 10rpx 16rpx;
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  padding: 0 16rpx 16rpx;
  font-size: 32rpx;
  color: #ff6600;
  font-weight: bold;
}
</style>
