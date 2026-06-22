<template>
  <view class="sku-selector" v-if="visible">
    <view class="mask" @click="$emit('close')"></view>
    <view class="sku-popup">
      <view class="sku-header">
        <image class="sku-image" :src="selectedSku.image || product.image" mode="aspectFill"></image>
        <view class="sku-info">
          <view class="sku-price-row">
            <text class="sku-price">¥{{ (selectedSku.price || product.price || 0).toFixed(2) }}</text>
            <text class="sku-ot-price" v-if="product.ot_price">¥{{ product.ot_price?.toFixed(2) }}</text>
          </view>
          <text class="sku-stock">库存: {{ selectedSku.stock || product.stock || 0 }}</text>
          <text class="sku-selected" v-if="selectedText">已选: {{ selectedText }}</text>
        </view>
        <view class="sku-close" @click="$emit('close')">×</view>
      </view>

      <view class="sku-attrs">
        <view class="attr-group" v-for="(attr, index) in productAttr" :key="index">
          <text class="attr-name">{{ attr.attr_name }}</text>
          <view class="attr-values">
            <view
              class="attr-value"
              :class="{ active: selectedValues[index] === value, disabled: isValueDisabled(index, value) }"
              v-for="value in attr.attr_values"
              :key="value"
              @click="selectValue(index, value)"
            >
              <text>{{ value }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="sku quantity">
        <text class="quantity-label">数量</text>
        <view class="quantity-control">
          <view class="qty-btn" @click="quantity > 1 && quantity--">-</view>
          <text class="qty-value">{{ quantity }}</text>
          <view class="qty-btn" @click="quantity++">+</view>
        </view>
      </view>

      <view class="sku-footer">
        <view class="sku-btn cart" @click="handleAddCart" v-if="showCart">
          <text class="btn-text">加入购物车</text>
        </view>
        <view class="sku-btn buy" @click="handleBuy">
          <text class="btn-text">立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  product: any;
  productAttr?: any[];
  productValue?: Record<string, any>;
  showCart?: boolean;
}>();

const emit = defineEmits(['close', 'addCart', 'buy']);

const selectedValues = ref<string[]>([]);
const quantity = ref(1);

const selectedText = computed(() => {
  const filtered = selectedValues.value.filter(Boolean);
  return filtered.length > 0 ? filtered.join(' / ') : '';
});

const selectedSku = computed(() => {
  if (!props.productValue || selectedValues.value.filter(Boolean).length !== props.productAttr?.length) {
    return {};
  }
  const key = selectedValues.value.join('_');
  return props.productValue[key] || {};
});

function selectValue(attrIndex: number, value: string) {
  if (isValueDisabled(attrIndex, value)) return;
  selectedValues.value[attrIndex] = value;
}

function isValueDisabled(attrIndex: number, value: string): boolean {
  return false;
}

function handleAddCart() {
  if (selectedValues.value.filter(Boolean).length < (props.productAttr?.length || 0)) {
    uni.showToast({ title: '请选择规格', icon: 'none' });
    return;
  }
  emit('addCart', { sku: selectedSku.value, quantity: quantity.value, selectedValues: selectedValues.value });
}

function handleBuy() {
  if (selectedValues.value.filter(Boolean).length < (props.productAttr?.length || 0)) {
    uni.showToast({ title: '请选择规格', icon: 'none' });
    return;
  }
  emit('buy', { sku: selectedSku.value, quantity: quantity.value, selectedValues: selectedValues.value });
}

watch(() => props.visible, (val) => {
  if (val && props.productAttr) {
    selectedValues.value = new Array(props.productAttr.length).fill('');
  }
});
</script>

<style scoped>
.sku-selector { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; }
.mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); }
.sku-popup { position: absolute; bottom: 0; left: 0; right: 0; background: #fff; border-radius: 24rpx 24rpx 0 0; max-height: 80vh; overflow-y: auto; }
.sku-header { display: flex; padding: 24rpx; border-bottom: 1rpx solid #f0f0f0; }
.sku-image { width: 160rpx; height: 160rpx; border-radius: 8rpx; margin-right: 20rpx; }
.sku-info { flex: 1; }
.sku-price-row { display: flex; align-items: baseline; }
.sku-price { font-size: 36rpx; color: #ff6600; font-weight: bold; }
.sku-ot-price { font-size: 22rpx; color: #999; text-decoration: line-through; margin-left: 10rpx; }
.sku-stock { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }
.sku-selected { font-size: 24rpx; color: #666; margin-top: 8rpx; display: block; }
.sku-close { font-size: 40rpx; color: #999; padding: 0 16rpx; }
.sku-attrs { padding: 24rpx; }
.attr-group { margin-bottom: 24rpx; }
.attr-name { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 12rpx; display: block; }
.attr-values { display: flex; flex-wrap: wrap; gap: 16rpx; }
.attr-value { padding: 12rpx 24rpx; background: #f5f5f5; border-radius: 8rpx; font-size: 26rpx; color: #333; }
.attr-value.active { background: #fff7f0; color: #ff6600; border: 2rpx solid #ff6600; }
.attr-value.disabled { color: #ccc; }
.sku.quantity { display: flex; justify-content: space-between; align-items: center; padding: 24rpx; border-top: 1rpx solid #f0f0f0; }
.quantity-label { font-size: 28rpx; font-weight: bold; color: #333; }
.quantity-control { display: flex; align-items: center; }
.qty-btn { width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8rpx; font-size: 32rpx; color: #333; }
.qty-value { width: 80rpx; text-align: center; font-size: 28rpx; }
.sku-footer { display: flex; padding: 24rpx; gap: 16rpx; border-top: 1rpx solid #f0f0f0; }
.sku-btn { flex: 1; height: 80rpx; display: flex; align-items: center; justify-content: center; border-radius: 40rpx; }
.sku-btn.cart { background: #ff8533; }
.sku-btn.buy { background: #ff6600; }
.btn-text { font-size: 28rpx; color: #fff; font-weight: bold; }
</style>
