<template>
  <view class="page" v-if="product">
    <!-- 商品图片轮播 -->
    <view class="swiper-wrap">
      <swiper
        class="swiper"
        indicator-dots
        indicator-color="rgba(255,255,255,0.4)"
        indicator-active-color="#ff6600"
        :autoplay="false"
        circular
        :current="currentSwiper"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(img, idx) in swiperImages" :key="idx">
          <image class="swiper-img" :src="img" mode="aspectFill" @click="previewImage(idx)" />
        </swiper-item>
      </swiper>
      <view class="swiper-counter">
        <text class="swiper-counter-text">{{ currentSwiper + 1 }}/{{ swiperImages.length }}</text>
      </view>
    </view>

    <!-- 价格区域 -->
    <view class="price-section">
      <view class="price-row">
        <text class="price-label">¥</text>
        <text class="price-value">{{ selectedPrice.toFixed(2) }}</text>
        <text class="ot-price" v-if="product.ot_price">¥{{ product.ot_price.toFixed(2) }}</text>
      </view>
      <view class="sales-row">
        <text class="sales-text">已售 {{ product.sales || 0 }}</text>
      </view>
    </view>

    <!-- 商品名称 -->
    <view class="name-section">
      <text class="product-name">{{ product.store_name }}</text>
      <text class="product-desc" v-if="product.store_info">{{ product.store_info }}</text>
    </view>

    <!-- 规格选择 -->
    <view class="spec-section" v-if="product.spec_type === 1 && skuList.length" @click="openSkuPopup('cart')">
      <view class="section-cell">
        <text class="cell-label">规格</text>
        <text class="cell-value" v-if="selectedSkuName">{{ selectedSkuName }}</text>
        <text class="cell-value placeholder" v-else>请选择规格</text>
        <text class="cell-arrow">></text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section">
      <view class="detail-header">
        <text class="detail-title">商品详情</text>
      </view>
      <view class="detail-content" v-if="product.content">
        <rich-text :nodes="product.content" />
      </view>
      <view class="detail-empty" v-else>
        <text class="detail-empty-text">暂无详情</text>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom" />

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-icon-group">
        <view class="bar-icon-item" @click="toggleFavorite">
          <text class="bar-icon">{{ isFavorited ? '&#9829;' : '&#9825;' }}</text>
          <text class="bar-icon-label">收藏</text>
        </view>
      </view>
      <view class="bar-btn-group">
        <view class="bar-btn cart-btn" @click="openSkuPopup('cart')">
          <text class="bar-btn-text">加入购物车</text>
        </view>
        <view class="bar-btn buy-btn" @click="openSkuPopup('buy')">
          <text class="bar-btn-text">立即购买</text>
        </view>
      </view>
    </view>

    <!-- SKU 弹窗 -->
    <view class="sku-mask" v-if="showSkuPopup" @click="closeSkuPopup" />
    <view class="sku-popup" :class="{ show: showSkuPopup }">
      <view class="sku-header">
        <image class="sku-thumb" :src="product.image" mode="aspectFill" v-if="product.image" />
        <view class="sku-header-info">
          <text class="sku-price">¥{{ selectedPrice.toFixed(2) }}</text>
          <text class="sku-stock">库存: {{ selectedStock }}</text>
          <text class="sku-selected" v-if="selectedSkuName">已选: {{ selectedSkuName }}</text>
        </view>
        <view class="sku-close" @click="closeSkuPopup">
          <text class="sku-close-icon">X</text>
        </view>
      </view>
      <view class="sku-body">
        <!-- 规格属性 -->
        <view class="sku-group" v-for="(group, gIdx) in specGroups" :key="gIdx">
          <text class="sku-group-title">{{ group.name }}</text>
          <view class="sku-options">
            <view
              class="sku-option"
              :class="{ active: selectedSpecs[gIdx] === val }"
              v-for="(val, vIdx) in group.values"
              :key="vIdx"
              @click="selectSpec(gIdx, val)"
            >
              <text class="sku-option-text">{{ val }}</text>
            </view>
          </view>
        </view>
        <!-- 数量 -->
        <view class="sku-quantity">
          <text class="sku-quantity-label">数量</text>
          <view class="stepper">
            <view class="stepper-btn" :class="{ disabled: buyNum <= 1 }" @click="buyNum = Math.max(1, buyNum - 1)">
              <text class="stepper-btn-text">-</text>
            </view>
            <text class="stepper-value">{{ buyNum }}</text>
            <view class="stepper-btn" @click="buyNum++">
              <text class="stepper-btn-text">+</text>
            </view>
          </view>
        </view>
      </view>
      <view class="sku-footer">
        <view class="sku-footer-btn" v-if="skuAction === 'cart'" @click="onAddCart">
          <text class="sku-footer-btn-text">加入购物车</text>
        </view>
        <view class="sku-footer-btn" v-if="skuAction === 'buy'" @click="onBuyNow">
          <text class="sku-footer-btn-text">立即购买</text>
        </view>
      </view>
    </view>
  </view>

  <!-- Loading -->
  <view class="loading-wrap" v-else-if="loading">
    <text class="loading-text">加载中...</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getProductDetail } from '@/api/product';
import { addCart } from '@/api/order';
import { checkLogin } from '@/utils';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(true);
const product = ref<any>(null);
const currentSwiper = ref(0);

// 收藏
const isFavorited = ref(false);

// SKU
const showSkuPopup = ref(false);
const skuAction = ref<'cart' | 'buy'>('cart');
const buyNum = ref(1);
const selectedSpecs = ref<Record<number, string>>({});

const swiperImages = computed(() => {
  if (!product.value) return [];
  const main = product.value.image ? [product.value.image] : [];
  if (product.value.slider_image) {
    try {
      const arr = JSON.parse(product.value.slider_image);
      if (Array.isArray(arr)) return [...main, ...arr];
    } catch {
      // ignore
    }
  }
  return main.length ? main : ['/static/placeholder.png'];
});

const skuList = computed(() => {
  if (!product.value?.sku) return [];
  try {
    const arr = JSON.parse(product.value.sku);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
});

const specGroups = computed(() => {
  if (!product.value?.attr) return [];
  try {
    const arr = JSON.parse(product.value.attr);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
});

const selectedSkuName = computed(() => {
  const vals = Object.values(selectedSpecs.value).filter(Boolean);
  return vals.length ? vals.join(', ') : '';
});

const matchedSku = computed(() => {
  if (!skuList.value.length) return null;
  const selected = Object.values(selectedSpecs.value).filter(Boolean);
  if (!selected.length) return skuList.value[0];
  return (
    skuList.value.find((sku: any) => {
      const skuValues = sku.sku?.map((s: any) => s.value) || [];
      return selected.every((v) => skuValues.includes(v));
    }) || skuList.value[0]
  );
});

const selectedPrice = computed(() => {
  if (matchedSku.value) return Number(matchedSku.value.price) || product.value?.price || 0;
  return product.value?.price || 0;
});

const selectedStock = computed(() => {
  if (matchedSku.value) return matchedSku.value.stock ?? 99;
  return product.value?.stock ?? 99;
});

function onSwiperChange(e: any) {
  currentSwiper.value = e.detail.current;
}

function previewImage(idx: number) {
  uni.previewImage({
    urls: swiperImages.value,
    current: idx,
  });
}

function toggleFavorite() {
  if (!checkLogin()) return;
  isFavorited.value = !isFavorited.value;
  uni.showToast({
    title: isFavorited.value ? '已收藏' : '已取消收藏',
    icon: 'success',
  });
}

function openSkuPopup(action: 'cart' | 'buy') {
  if (!checkLogin()) return;
  skuAction.value = action;
  showSkuPopup.value = true;
}

function closeSkuPopup() {
  showSkuPopup.value = false;
}

function selectSpec(groupIdx: number, val: string) {
  selectedSpecs.value[groupIdx] = selectedSpecs.value[groupIdx] === val ? '' : val;
}

function getAttrUnique(): string {
  if (!matchedSku.value) return '';
  return matchedSku.value.unique || matchedSku.value.sku?.map((s: any) => s.value).join(',') || '';
}

async function onAddCart() {
  if (!product.value) return;
  try {
    await addCart({
      product_id: product.value.id,
      product_attr_unique: getAttrUnique(),
      cart_num: buyNum.value,
    });
    uni.showToast({ title: '已加入购物车', icon: 'success' });
    showSkuPopup.value = false;
  } catch (e) {
    // handled by request layer
  }
}

function onBuyNow() {
  if (!product.value) return;
  // 跳转到订单确认页，带上商品信息
  const params = {
    productId: product.value.id,
    skuUnique: getAttrUnique(),
    num: buyNum.value,
    price: selectedPrice.value,
    name: product.value.store_name,
    image: product.value.image,
  };
  uni.setStorageSync('buyNowItem', JSON.stringify(params));
  uni.navigateTo({ url: '/pages/goods/order_confirm/index?type=buyNow' });
}

onLoad((options) => {
  const id = Number(options?.id || 0);
  if (!id) {
    loading.value = false;
    return;
  }
  fetchDetail(id);
});

async function fetchDetail(id: number) {
  loading.value = true;
  try {
    const res = await getProductDetail(id);
    product.value = res?.data || null;
  } catch (e) {
    // handled by request layer
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 轮播 */
.swiper-wrap {
  position: relative;
  width: 100%;
  background: #fff;
}
.swiper {
  width: 100%;
  height: 750rpx;
}
.swiper-img {
  width: 100%;
  height: 750rpx;
}
.swiper-counter {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20rpx;
  padding: 4rpx 16rpx;
}
.swiper-counter-text {
  font-size: 22rpx;
  color: #fff;
}

/* 价格区域 */
.price-section {
  background: #fff;
  padding: 24rpx;
}
.price-row {
  display: flex;
  align-items: baseline;
}
.price-label {
  font-size: 28rpx;
  color: #ff6600;
  font-weight: bold;
}
.price-value {
  font-size: 48rpx;
  color: #ff6600;
  font-weight: bold;
  line-height: 1;
}
.ot-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 16rpx;
}
.sales-row {
  margin-top: 10rpx;
}
.sales-text {
  font-size: 24rpx;
  color: #999;
}

/* 商品名称 */
.name-section {
  background: #fff;
  padding: 24rpx;
  margin-top: 16rpx;
}
.product-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 12rpx;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 规格选择 */
.spec-section {
  background: #fff;
  margin-top: 16rpx;
}
.section-cell {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.cell-label {
  font-size: 28rpx;
  color: #999;
  margin-right: 24rpx;
  flex-shrink: 0;
}
.cell-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.cell-value.placeholder {
  color: #999;
}
.cell-arrow {
  font-size: 28rpx;
  color: #ccc;
  flex-shrink: 0;
}

/* 商品详情 */
.detail-section {
  background: #fff;
  margin-top: 16rpx;
}
.detail-header {
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.detail-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.detail-content {
  padding: 24rpx;
}
.detail-empty {
  padding: 60rpx 0;
  display: flex;
  justify-content: center;
}
.detail-empty-text {
  font-size: 26rpx;
  color: #999;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}
.bar-icon-group {
  display: flex;
  padding: 0 20rpx;
}
.bar-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24rpx;
}
.bar-icon {
  font-size: 36rpx;
  color: #333;
}
.bar-icon-label {
  font-size: 20rpx;
  color: #666;
  margin-top: 2rpx;
}
.bar-btn-group {
  flex: 1;
  display: flex;
  height: 72rpx;
}
.bar-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
}
.cart-btn {
  background: #ff8533;
  margin-right: 16rpx;
}
.buy-btn {
  background: #ff6600;
}
.bar-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

/* SKU 弹窗 */
.sku-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
.sku-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 201;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.sku-popup.show {
  transform: translateY(0);
}
.sku-header {
  display: flex;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
}
.sku-thumb {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.sku-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.sku-price {
  font-size: 36rpx;
  color: #ff6600;
  font-weight: bold;
}
.sku-stock {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
.sku-selected {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}
.sku-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sku-close-icon {
  font-size: 32rpx;
  color: #999;
}

/* SKU 属性组 */
.sku-body {
  padding: 24rpx;
}
.sku-group {
  margin-bottom: 24rpx;
}
.sku-group-title {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 16rpx;
}
.sku-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.sku-option {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  border: 2rpx solid transparent;
}
.sku-option.active {
  border-color: #ff6600;
  background: #fff5f0;
}
.sku-option-text {
  font-size: 26rpx;
  color: #333;
}

/* 数量选择 */
.sku-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.sku-quantity-label {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}
.stepper {
  display: flex;
  align-items: center;
}
.stepper-btn {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8rpx;
}
.stepper-btn.disabled {
  opacity: 0.4;
}
.stepper-btn-text {
  font-size: 30rpx;
  color: #333;
}
.stepper-value {
  width: 72rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

/* SKU 底部 */
.sku-footer {
  padding: 16rpx 24rpx;
}
.sku-footer-btn {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff6600;
  border-radius: 40rpx;
}
.sku-footer-btn-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
}

/* Loading */
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
}

.safe-bottom {
  height: 20rpx;
}
</style>
