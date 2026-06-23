<template>
  <view class="page">
    <view class="layout">
      <!-- 左侧分类栏 -->
      <scroll-view class="sidebar" scroll-y :scroll-into-view="scrollIntoId">
        <view
          class="sidebar-item"
          :class="{ active: selectedId === item.id }"
          v-for="item in categoryList"
          :key="item.id"
          :id="'cate-' + item.id"
          @click="selectCategory(item.id)"
        >
          <view class="sidebar-active-bar" v-if="selectedId === item.id" />
          <text class="sidebar-text">{{ item.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品区 -->
      <scroll-view class="content" scroll-y>
        <view v-if="productList.length" class="product-grid">
          <view class="product-grid-item" v-for="item in productList" :key="item.id">
            <ProductCard :product="item" />
          </view>
        </view>
        <Empty text="该分类暂无商品" v-else-if="!loading" />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import ProductCard from '@/components/ProductCard/index.vue';
import Empty from '@/components/Empty/index.vue';
import { getProductList, getCategoryList } from '@/api/product';

const loading = ref(false);
const categoryList = ref<any[]>([]);
const productList = ref<any[]>([]);
const selectedId = ref<number>(0);
const scrollIntoId = ref('');

async function fetchCategories() {
  try {
    const res = await getCategoryList();
    const list = res?.data || [];
    categoryList.value = list;
    if (list.length && !selectedId.value) {
      selectedId.value = list[0].id;
    }
  } catch (e) {
    // handled by request layer
  }
}

async function fetchProducts() {
  if (!selectedId.value) return;
  loading.value = true;
  try {
    const res = await getProductList({ cate_id: selectedId.value, page: 1, limit: 50 });
    productList.value = res?.data || [];
  } catch (e) {
    // handled by request layer
  } finally {
    loading.value = false;
  }
}

function selectCategory(id: number) {
  if (selectedId.value === id) return;
  selectedId.value = id;
  scrollIntoId.value = 'cate-' + id;
}

watch(selectedId, () => {
  fetchProducts();
});

onShow(() => {
  fetchCategories();
});
</script>

<style scoped>
.page {
  height: 100vh;
  background: #f5f5f5;
}

.layout {
  display: flex;
  height: 100%;
  padding-bottom: 100rpx;
}

/* 左侧分类栏 */
.sidebar {
  width: 180rpx;
  height: 100%;
  background: #fff;
  flex-shrink: 0;
}
.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  padding: 0 16rpx;
}
.sidebar-item.active {
  background: #f5f5f5;
}
.sidebar-active-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 36rpx;
  background: #E93323;
  border-radius: 0 3rpx 3rpx 0;
}
.sidebar-text {
  font-size: 26rpx;
  color: #333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar-item.active .sidebar-text {
  color: #E93323;
  font-weight: bold;
}

/* 右侧商品区 */
.content {
  flex: 1;
  height: 100%;
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
</style>
