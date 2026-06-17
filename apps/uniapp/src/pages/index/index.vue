<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="navigateTo('/pages/search/index')">
      <view class="search-inner">
        <text class="search-icon">&#xe612;</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        class="swiper"
        indicator-dots
        indicator-color="rgba(255,255,255,0.4)"
        indicator-active-color="#ff6600"
        autoplay
        circular
        :interval="3000"
      >
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <view class="swiper-item">
            <image
              class="banner-img"
              :src="item.image"
              mode="aspectFill"
              v-if="item.image"
            />
            <view class="banner-placeholder" v-else>
              <text class="banner-placeholder-text">{{ item.title || '广告' }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="category-nav-grid">
        <view
          class="category-nav-item"
          v-for="item in categoryList"
          :key="item.id"
          @click="goCategory(item.id)"
        >
          <image
            class="category-icon"
            :src="item.image"
            mode="aspectFill"
            v-if="item.image"
          />
          <view class="category-icon placeholder-icon" v-else />
          <text class="category-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
      </view>
      <view class="product-grid" v-if="productList.length">
        <view class="product-grid-item" v-for="item in productList" :key="item.id">
          <ProductCard :product="item" />
        </view>
      </view>
      <Empty text="暂无商品" v-else-if="!loading" />
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import ProductCard from '@/components/ProductCard/index.vue';
import Empty from '@/components/Empty/index.vue';
import { getProductList, getCategoryList } from '@/api/product';
import { navigateTo } from '@/utils';

const loading = ref(false);
const bannerList = ref<{ image?: string; title?: string }[]>([
  { image: '', title: '限时特惠' },
  { image: '', title: '新品上市' },
  { image: '', title: '品质好物' },
]);
const categoryList = ref<any[]>([]);
const productList = ref<any[]>([]);

async function fetchData() {
  loading.value = true;
  try {
    const [cateRes, productRes] = await Promise.all([
      getCategoryList(),
      getProductList({ page: 1, limit: 10 }),
    ]);
    categoryList.value = cateRes?.data || [];
    productList.value = productRes?.data || [];
  } catch (e) {
    // errors handled by request layer
  } finally {
    loading.value = false;
  }
}

function goCategory(id: number) {
  uni.switchTab({ url: '/pages/goods_cate/index' });
}

onShow(() => {
  fetchData();
});

onPullDownRefresh(() => {
  fetchData().finally(() => {
    uni.stopPullDownRefresh();
  });
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

/* 搜索栏 */
.search-bar {
  padding: 16rpx 24rpx;
  background: #ff6600;
}
.search-inner {
  display: flex;
  align-items: center;
  height: 64rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 0 24rpx;
}
.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}
.search-placeholder {
  font-size: 26rpx;
  color: #999;
}

/* 轮播图 */
.banner {
  width: 100%;
}
.swiper {
  width: 100%;
  height: 300rpx;
}
.swiper-item {
  width: 100%;
  height: 300rpx;
}
.banner-img {
  width: 100%;
  height: 300rpx;
}
.banner-placeholder {
  width: 100%;
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6600, #ff8533);
}
.banner-placeholder-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

/* 分类导航 */
.category-nav {
  margin-top: 20rpx;
  background: #fff;
  padding: 20rpx 0;
}
.category-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 20rpx;
}
.category-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.category-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
}
.placeholder-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: #f5f5f5;
}
.category-name {
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}

/* 热门推荐 */
.section {
  margin-top: 20rpx;
  background: #fff;
  padding: 24rpx;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
.product-grid-item {
  border-radius: 12rpx;
  overflow: hidden;
}

.safe-bottom {
  height: 20rpx;
}
</style>
