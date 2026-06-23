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
        indicator-active-color="#E93323"
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

    <!-- 限时秒杀 -->
    <view class="section seckill-section" v-if="seckillList.length">
      <view class="section-header">
        <view class="section-title-row">
          <text class="section-title">限时秒杀</text>
          <view class="countdown">
            <text class="countdown-label">距结束</text>
            <text class="countdown-num">{{ countdown.hours }}</text>
            <text class="countdown-sep">:</text>
            <text class="countdown-num">{{ countdown.minutes }}</text>
            <text class="countdown-sep">:</text>
            <text class="countdown-num">{{ countdown.seconds }}</text>
          </view>
        </view>
        <text class="section-more" @click="goSeckill">更多 ></text>
      </view>
      <scroll-view scroll-x class="seckill-scroll">
        <view class="seckill-list">
          <view class="seckill-item" v-for="item in seckillList" :key="item.id" @click="goSeckillDetail(item)">
            <image class="seckill-img" :src="item.image" mode="aspectFill" v-if="item.image" />
            <view class="seckill-img placeholder-img" v-else />
            <text class="seckill-price">¥{{ item.price }}</text>
            <text class="seckill-ot-price">¥{{ item.product_price }}</text>
          </view>
        </view>
      </scroll-view>
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

    <!-- 分类商品 -->
    <view class="section" v-for="cate in categoryProducts" :key="cate.id">
      <view class="section-header">
        <text class="section-title">{{ cate.name }}</text>
        <text class="section-more" @click="goCategory(cate.id)">更多 ></text>
      </view>
      <view class="product-grid">
        <view class="product-grid-item" v-for="item in cate.products" :key="item.id">
          <ProductCard :product="item" />
        </view>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
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
const seckillList = ref<any[]>([]);
const categoryProducts = ref<any[]>([]);

const countdown = reactive({ hours: '00', minutes: '00', seconds: '00' });
let countdownTimer: any = null;

function startCountdown() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  let diff = Math.floor((end.getTime() - now.getTime()) / 1000);

  countdownTimer = setInterval(() => {
    if (diff <= 0) {
      clearInterval(countdownTimer);
      return;
    }
    diff--;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    countdown.hours = String(h).padStart(2, '0');
    countdown.minutes = String(m).padStart(2, '0');
    countdown.seconds = String(s).padStart(2, '0');
  }, 1000);
}

async function fetchData() {
  loading.value = true;
  try {
    const [cateRes, productRes] = await Promise.all([
      getCategoryList(),
      getProductList({ page: 1, limit: 10 }),
    ]);
    categoryList.value = cateRes?.data || [];
    productList.value = productRes?.data || [];

    // Mock seckill data
    seckillList.value = [
      { id: 1, image: '', price: 9.9, product_price: 99 },
      { id: 2, image: '', price: 19.9, product_price: 199 },
      { id: 3, image: '', price: 29.9, product_price: 299 },
      { id: 4, image: '', price: 39.9, product_price: 399 },
    ];

    // Mock category products
    if (categoryList.value.length > 0) {
      categoryProducts.value = categoryList.value.slice(0, 3).map((cate: any) => ({
        ...cate,
        products: productList.value.slice(0, 4),
      }));
    }
  } catch (e) {
    // errors handled by request layer
  } finally {
    loading.value = false;
  }
}

function goCategory(id: number) {
  uni.switchTab({ url: '/pages/goods_cate/index' });
}

function goSeckill() {
  uni.navigateTo({ url: '/pages/activity/goods_seckill_details/index' });
}

function goSeckillDetail(item: any) {
  uni.navigateTo({ url: `/pages/activity/goods_seckill_details/index?id=${item.id}` });
}

onShow(() => {
  fetchData();
  startCountdown();
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
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
  background: #E93323;
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
  background: linear-gradient(135deg, #E93323, #f0684d);
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

/* 限时秒杀 */
.seckill-section {
  padding-bottom: 16rpx;
}
.section-title-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.countdown {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.countdown-label {
  font-size: 22rpx;
  color: #999;
  margin-right: 8rpx;
}
.countdown-num {
  background: #333;
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  font-family: monospace;
}
.countdown-sep {
  font-size: 22rpx;
  color: #333;
  font-weight: bold;
}
.section-more {
  font-size: 24rpx;
  color: #999;
}
.seckill-scroll {
  white-space: nowrap;
}
.seckill-list {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 4rpx;
}
.seckill-item {
  width: 200rpx;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.seckill-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}
.placeholder-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}
.seckill-price {
  font-size: 28rpx;
  color: #E93323;
  font-weight: bold;
  margin-top: 8rpx;
}
.seckill-ot-price {
  font-size: 20rpx;
  color: #999;
  text-decoration: line-through;
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
