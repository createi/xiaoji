<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索商品"
          confirm-type="search"
          :focus="true"
          @confirm="doSearch"
        />
        <view class="search-clear" v-if="keyword" @click="keyword = ''">
          <text class="search-clear-icon">X</text>
        </view>
      </view>
      <text class="search-btn" @click="doSearch">搜索</text>
    </view>

    <!-- 搜索建议/历史/热门 -->
    <view class="search-body" v-if="!hasSearched">
      <!-- 搜索历史 -->
      <view class="section" v-if="historyList.length">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <view class="section-action" @click="clearHistory">
            <text class="section-action-text">清空</text>
          </view>
        </view>
        <view class="tag-list">
          <view
            class="tag-item"
            v-for="(item, idx) in historyList"
            :key="idx"
            @click="searchFromTag(item)"
          >
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="section" v-if="hotKeywords.length">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="tag-list">
          <view
            class="tag-item hot"
            v-for="(item, idx) in hotKeywords"
            :key="idx"
            @click="searchFromTag(item)"
          >
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="hasSearched">
      <view class="product-grid" v-if="productList.length">
        <view class="product-grid-item" v-for="item in productList" :key="item.id">
          <ProductCard :product="item" />
        </view>
      </view>

      <Empty text="没有找到相关商品" v-if="!productList.length && !loading" />

      <view class="load-more" v-if="productList.length">
        <text class="load-more-text">{{ loading ? '加载中...' : noMore ? '没有更多了' : '' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';
import ProductCard from '@/components/ProductCard/index.vue';
import Empty from '@/components/Empty/index.vue';
import { getProductList } from '@/api/product';

const keyword = ref('');
const hasSearched = ref(false);
const loading = ref(false);
const noMore = ref(false);
const page = ref(1);
const limit = 10;
const productList = ref<any[]>([]);

// 搜索历史
const historyList = ref<string[]>(uni.getStorageSync('searchHistory') || []);

// 热门关键词
const hotKeywords = ref(['手机', '耳机', '手表', '平板', '键盘', '充电器']);

function saveHistory(kw: string) {
  if (!kw.trim()) return;
  const list = historyList.value.filter((item) => item !== kw);
  list.unshift(kw);
  if (list.length > 20) list.length = 20;
  historyList.value = list;
  uni.setStorageSync('searchHistory', list);
}

function clearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = [];
        uni.removeStorageSync('searchHistory');
      }
    },
  });
}

function searchFromTag(kw: string) {
  keyword.value = kw;
  doSearch();
}

async function doSearch() {
  const kw = keyword.value.trim();
  if (!kw) return;

  saveHistory(kw);
  hasSearched.value = true;
  page.value = 1;
  noMore.value = false;
  productList.value = [];
  await fetchProducts(true);
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
    const res = await getProductList({
      page: page.value,
      limit,
      keyword: keyword.value.trim(),
      is_show: 1,
    });
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

onReachBottom(() => {
  if (hasSearched.value) {
    fetchProducts();
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  height: 64rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;
}
.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.search-clear {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
}
.search-clear-icon {
  font-size: 24rpx;
  color: #999;
}
.search-btn {
  font-size: 28rpx;
  color: #E93323;
  margin-left: 20rpx;
  flex-shrink: 0;
}

/* 搜索内容区 */
.search-body {
  padding: 24rpx;
}

/* 分段标题 */
.section {
  margin-bottom: 32rpx;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.section-action {
  padding: 8rpx 0;
}
.section-action-text {
  font-size: 24rpx;
  color: #999;
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag-item {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 30rpx;
}
.tag-item.hot {
  background: #fff5f0;
}
.tag-text {
  font-size: 24rpx;
  color: #666;
}
.tag-item.hot .tag-text {
  color: #E93323;
}

/* 搜索结果 */
.search-results {
  padding: 16rpx;
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
.load-more {
  padding: 30rpx 0;
  text-align: center;
}
.load-more-text {
  font-size: 24rpx;
  color: #999;
}
</style>
