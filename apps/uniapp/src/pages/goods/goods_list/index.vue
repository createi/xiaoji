<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-inner" @click="goSearch">
        <text class="search-icon">&#xe612;</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <!-- 分类 tab -->
    <scroll-view class="cate-scroll" scroll-x :show-scrollbar="false" v-if="categoryList.length">
      <view class="cate-list">
        <view
          class="cate-item"
          :class="{ active: currentCateId === 0 }"
          @click="switchCate(0)"
        >
          <text class="cate-text">全部</text>
        </view>
        <view
          class="cate-item"
          :class="{ active: currentCateId === item.id }"
          v-for="item in categoryList"
          :key="item.id"
          @click="switchCate(item.id)"
        >
          <text class="cate-text">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 排序 tab -->
    <view class="sort-bar">
      <view
        class="sort-item"
        :class="{ active: currentSort === 'default' }"
        @click="switchSort('default')"
      >
        <text class="sort-text">综合</text>
      </view>
      <view
        class="sort-item"
        :class="{ active: currentSort === 'sales' }"
        @click="switchSort('sales')"
      >
        <text class="sort-text">销量</text>
      </view>
      <view
        class="sort-item"
        :class="{ active: currentSort === 'price' }"
        @click="switchSort('price')"
      >
        <text class="sort-text">价格</text>
        <view class="sort-arrows">
          <text class="sort-arrow up" :class="{ active: currentSort === 'price' && priceAsc }">&#9650;</text>
          <text class="sort-arrow down" :class="{ active: currentSort === 'price' && !priceAsc }">&#9660;</text>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-grid" v-if="productList.length">
      <view class="product-grid-item" v-for="item in productList" :key="item.id">
        <ProductCard :product="item" />
      </view>
    </view>

    <!-- 空状态 -->
    <Empty text="暂无商品" v-if="!productList.length && !loading" />

    <!-- 加载更多 -->
    <view class="load-more" v-if="productList.length">
      <text class="load-more-text">{{ loading ? '加载中...' : noMore ? '没有更多了' : '' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import ProductCard from '@/components/ProductCard/index.vue';
import Empty from '@/components/Empty/index.vue';
import { getProductList, getCategoryList } from '@/api/product';

const loading = ref(false);
const noMore = ref(false);
const page = ref(1);
const limit = 10;

const categoryList = ref<any[]>([]);
const productList = ref<any[]>([]);
const currentCateId = ref(0);
const currentSort = ref('default');
const priceAsc = ref(true);

async function fetchCategory() {
  try {
    const res = await getCategoryList();
    categoryList.value = res?.data || [];
  } catch (e) {
    // handled by request layer
  }
}

async function fetchProducts(refresh = false) {
  if (loading.value) return;
  if (refresh) {
    page.value = 1;
    noMore.value = false;
  }
  if (noMore.value) return;

  loading.value = true;
  try {
    const params: Record<string, any> = {
      page: page.value,
      limit,
      is_show: 1,
    };
    if (currentCateId.value) {
      params.cate_id = currentCateId.value;
    }
    if (currentSort.value === 'sales') {
      params.keyword = '';
    }
    if (currentSort.value === 'price') {
      params.keyword = '';
    }

    const res = await getProductList(params);
    const list = res?.data || [];
    if (refresh) {
      productList.value = list;
    } else {
      productList.value = [...productList.value, ...list];
    }
    if (list.length < limit) {
      noMore.value = true;
    }
    page.value++;
  } catch (e) {
    // handled by request layer
  } finally {
    loading.value = false;
  }
}

function switchCate(id: number) {
  currentCateId.value = id;
  fetchProducts(true);
}

function switchSort(sort: string) {
  if (sort === 'price' && currentSort.value === 'price') {
    priceAsc.value = !priceAsc.value;
  } else {
    priceAsc.value = true;
  }
  currentSort.value = sort;
  fetchProducts(true);
}

function goSearch() {
  uni.navigateTo({ url: '/pages/goods/goods_search/index' });
}

onPullDownRefresh(() => {
  fetchProducts(true);
  fetchCategory();
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  fetchProducts();
});

// 初始化
fetchCategory();
fetchProducts(true);
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
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

/* 分类滚动 */
.cate-scroll {
  background: #fff;
  white-space: nowrap;
}
.cate-list {
  display: flex;
  padding: 16rpx 16rpx 0;
}
.cate-item {
  padding: 12rpx 24rpx;
  margin-right: 12rpx;
  border-radius: 30rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}
.cate-item.active {
  background: #E93323;
}
.cate-text {
  font-size: 24rpx;
  color: #333;
  white-space: nowrap;
}
.cate-item.active .cate-text {
  color: #fff;
}

/* 排序栏 */
.sort-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.sort-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sort-text {
  font-size: 26rpx;
  color: #666;
}
.sort-item.active .sort-text {
  color: #E93323;
  font-weight: bold;
}
.sort-arrows {
  display: flex;
  flex-direction: column;
  margin-left: 4rpx;
}
.sort-arrow {
  font-size: 14rpx;
  color: #ccc;
  line-height: 14rpx;
}
.sort-arrow.active {
  color: #E93323;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 16rpx;
}
.product-grid-item {
  border-radius: 12rpx;
  overflow: hidden;
}

/* 加载更多 */
.load-more {
  padding: 30rpx 0;
  text-align: center;
}
.load-more-text {
  font-size: 24rpx;
  color: #999;
}
</style>
