<template>
  <view class="page">
    <!-- 收货地址 -->
    <view class="address-section" @click="goSelectAddress">
      <view class="address-content" v-if="address">
        <view class="address-info">
          <view class="address-top">
            <text class="address-name">{{ address.real_name }}</text>
            <text class="address-phone">{{ address.user_phone }}</text>
          </view>
          <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
        </view>
        <text class="address-arrow">></text>
      </view>
      <view class="address-empty" v-else>
        <text class="address-empty-text">请选择收货地址</text>
        <text class="address-arrow">></text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-section">
      <view class="goods-item" v-for="item in orderItems" :key="item.id">
        <image class="goods-img" :src="item.image" mode="aspectFill" v-if="item.image" />
        <view class="goods-img placeholder" v-else />
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ (item.price || 0).toFixed(2) }}</text>
            <text class="goods-num">x{{ item.num }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="cell-section">
      <view class="cell-item" @click="showCouponPopup = true">
        <text class="cell-label">优惠券</text>
        <text class="cell-value" v-if="selectedCoupon">{{ couponLabel }}</text>
        <text class="cell-value placeholder" v-else>暂无可用</text>
        <text class="cell-arrow">></text>
      </view>
    </view>

    <!-- 积分抵扣 -->
    <view class="cell-section">
      <view class="cell-item">
        <text class="cell-label">积分抵扣</text>
        <text class="cell-value" v-if="userIntegral > 0">
          可用 {{ userIntegral }} 积分，抵 ¥{{ integralDeduction.toFixed(2) }}
        </text>
        <text class="cell-value placeholder" v-else>暂无可用积分</text>
        <switch
          class="integral-switch"
          :checked="useIntegral"
          :disabled="userIntegral <= 0"
          color="#ff6600"
          @change="useIntegral = $event.detail.value"
        />
      </view>
    </view>

    <!-- 备注 -->
    <view class="cell-section">
      <view class="cell-item remark-cell">
        <text class="cell-label">备注</text>
        <input
          class="remark-input"
          v-model="remark"
          placeholder="选填：对本次交易的说明"
          maxlength="50"
        />
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="summary-section">
      <view class="summary-row">
        <text class="summary-label">商品总额</text>
        <text class="summary-value">¥{{ goodsTotal.toFixed(2) }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">运费</text>
        <text class="summary-value">¥{{ shippingFee.toFixed(2) }}</text>
      </view>
      <view class="summary-row" v-if="couponDeduction > 0">
        <text class="summary-label">优惠券</text>
        <text class="summary-value discount">-¥{{ couponDeduction.toFixed(2) }}</text>
      </view>
      <view class="summary-row" v-if="useIntegral && integralDeduction > 0">
        <text class="summary-label">积分抵扣</text>
        <text class="summary-value discount">-¥{{ integralDeduction.toFixed(2) }}</text>
      </view>
      <view class="summary-divider" />
      <view class="summary-row total">
        <text class="summary-label">实付款</text>
        <text class="summary-total">¥{{ actualPayment.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="safe-bottom" />

    <!-- 底部提交栏 -->
    <view class="footer">
      <view class="footer-right">
        <text class="footer-label">合计：</text>
        <text class="footer-price">¥{{ actualPayment.toFixed(2) }}</text>
        <view class="footer-btn" @click="submitOrder">
          <text class="footer-btn-text">提交订单</text>
        </view>
      </view>
    </view>

    <!-- 优惠券弹窗 -->
    <view class="sku-mask" v-if="showCouponPopup" @click="showCouponPopup = false" />
    <view class="coupon-popup" :class="{ show: showCouponPopup }">
      <view class="popup-header">
        <text class="popup-title">选择优惠券</text>
        <view class="popup-close" @click="showCouponPopup = false">
          <text class="popup-close-text">X</text>
        </view>
      </view>
      <view class="coupon-list">
        <view
          class="coupon-item"
          :class="{ active: selectedCoupon?.id === item.id, disabled: !isCouponUsable(item) }"
          v-for="item in couponList"
          :key="item.id"
          @click="selectCoupon(item)"
        >
          <view class="coupon-left">
            <text class="coupon-value" v-if="item.type === 1">¥{{ item.value }}</text>
            <text class="coupon-value" v-else-if="item.type === 2">{{ item.value }}折</text>
            <text class="coupon-value" v-else>¥{{ item.value }}</text>
            <text class="coupon-condition" v-if="item.min_price">满{{ item.min_price }}可用</text>
            <text class="coupon-condition" v-else>无门槛</text>
          </view>
          <view class="coupon-right">
            <text class="coupon-name">{{ item.title }}</text>
            <text class="coupon-date" v-if="item.end_time">{{ formatTime(item.end_time) }} 到期</text>
          </view>
          <view class="coupon-check" v-if="selectedCoupon?.id === item.id">
            <text class="coupon-check-icon">&#10003;</text>
          </view>
        </view>
        <view class="coupon-empty" v-if="!couponList.length">
          <text class="coupon-empty-text">暂无可用优惠券</text>
        </view>
        <view class="coupon-no-use" @click="selectCoupon(null)">
          <text class="coupon-no-use-text">不使用优惠券</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { createOrder } from '@/api/order';
import { getCouponList } from '@/api/marketing';
import { getAddressList } from '@/api/user';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { checkLogin } from '@/utils';

const cartStore = useCartStore();
const userStore = useUserStore();

const address = ref<any>(null);
const orderType = ref('cart'); // cart | buyNow
const orderItems = ref<any[]>([]);
const remark = ref('');
const useIntegral = ref(false);
const userIntegral = ref(0);
const showCouponPopup = ref(false);
const couponList = ref<any[]>([]);
const selectedCoupon = ref<any>(null);

// 初始化
onLoad((options) => {
  orderType.value = options?.type || 'cart';
  loadOrderData();
  fetchAddress();
  fetchCoupons();
});

async function loadOrderData() {
  if (orderType.value === 'buyNow') {
    try {
      const raw = uni.getStorageSync('buyNowItem');
      if (raw) {
        const item = JSON.parse(raw);
        orderItems.value = [item];
      }
    } catch {
      // ignore
    }
  } else {
    // 从购物车选中项加载
    orderItems.value = cartStore.checkedItems.map((item) => ({
      id: item.id,
      productId: item.product_id,
      image: item.product?.image,
      name: item.product?.store_name || '商品',
      price: item.attr?.price || item.product?.price || 0,
      num: item.cart_num,
      skuUnique: item.product_attr_unique,
    }));
  }
}

async function fetchAddress() {
  try {
    const res = await getAddressList();
    const list = res?.data || [];
    // 取默认地址
    address.value = list.find((a: any) => a.is_default) || list[0] || null;
  } catch {
    // handled
  }
}

async function fetchCoupons() {
  try {
    const res = await getCouponList();
    couponList.value = res?.data || [];
  } catch {
    // handled
  }
}

function isCouponUsable(coupon: any): boolean {
  if (coupon.type === 1 && coupon.min_price && goodsTotal.value < coupon.min_price) {
    return false;
  }
  return true;
}

function selectCoupon(coupon: any) {
  selectedCoupon.value = coupon;
  showCouponPopup.value = false;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const couponLabel = computed(() => {
  if (!selectedCoupon.value) return '';
  const c = selectedCoupon.value;
  if (c.type === 1) return `-¥${c.value}`;
  if (c.type === 2) return `${c.value}折`;
  return `-¥${c.value}`;
});

const goodsTotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.price || 0) * (item.num || 1), 0);
});

const shippingFee = computed(() => {
  return 0; // 默认包邮
});

const couponDeduction = computed(() => {
  if (!selectedCoupon.value) return 0;
  const c = selectedCoupon.value;
  if (c.type === 1) return c.value || 0;
  if (c.type === 2) return goodsTotal.value * (1 - c.value / 10);
  return 0;
});

const integralDeduction = computed(() => {
  if (!useIntegral.value || userIntegral.value <= 0) return 0;
  // 100积分 = 1元
  const maxDeduction = Math.min(userIntegral.value / 100, goodsTotal.value);
  return Math.round(maxDeduction * 100) / 100;
});

const actualPayment = computed(() => {
  const total = goodsTotal.value + shippingFee.value - couponDeduction.value - integralDeduction.value;
  return Math.max(0, Math.round(total * 100) / 100);
});

function goSelectAddress() {
  uni.navigateTo({ url: '/pages/users/user_address_list/index?select=1' });
}

async function submitOrder() {
  if (!address.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' });
    return;
  }
  if (!orderItems.value.length) {
    uni.showToast({ title: '请选择商品', icon: 'none' });
    return;
  }

  try {
    const data: Record<string, any> = {
      address_id: address.value.id,
      remark: remark.value,
      use_integral: useIntegral.value ? 1 : 0,
      coupon_id: selectedCoupon.value?.id || 0,
      products: orderItems.value.map((item) => ({
        product_id: item.productId || item.product_id,
        cart_num: item.num,
        product_attr_unique: item.skuUnique || '',
      })),
    };

    const res = await createOrder(data);
    const orderId = res?.data?.id || res?.data;

    // 清理
    if (orderType.value === 'cart') {
      cartStore.clear();
    }
    uni.removeStorageSync('buyNowItem');

    uni.redirectTo({
      url: `/pages/goods/cashier/index?id=${orderId}&price=${actualPayment.value}`,
    });
  } catch (e) {
    // handled by request layer
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 地址区域 */
.address-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.address-content {
  display: flex;
  align-items: center;
}
.address-info {
  flex: 1;
}
.address-top {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.address-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}
.address-phone {
  font-size: 28rpx;
  color: #666;
}
.address-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
.address-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.address-empty-text {
  font-size: 28rpx;
  color: #999;
}
.address-arrow {
  font-size: 28rpx;
  color: #ccc;
}

/* 商品列表 */
.goods-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.goods-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.goods-item:last-child {
  border-bottom: none;
}
.goods-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.goods-img.placeholder {
  background: #f5f5f5;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.goods-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.goods-price {
  font-size: 28rpx;
  color: #ff6600;
  font-weight: bold;
}
.goods-num {
  font-size: 24rpx;
  color: #999;
}

/* 单元格 */
.cell-section {
  background: #fff;
  margin-bottom: 16rpx;
}
.cell-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.cell-item:last-child {
  border-bottom: none;
}
.cell-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.cell-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  text-align: right;
}
.cell-value.placeholder {
  color: #999;
}
.cell-arrow {
  font-size: 28rpx;
  color: #ccc;
  margin-left: 12rpx;
}
.integral-switch {
  transform: scale(0.8);
}
.remark-cell {
  align-items: flex-start;
}
.remark-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  text-align: right;
}

/* 价格明细 */
.summary-section {
  background: #fff;
  padding: 24rpx;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 0;
}
.summary-row.total {
  padding-top: 16rpx;
}
.summary-label {
  font-size: 26rpx;
  color: #666;
}
.summary-value {
  font-size: 26rpx;
  color: #333;
}
.summary-value.discount {
  color: #ff6600;
}
.summary-divider {
  height: 1rpx;
  background: #f5f5f5;
  margin: 12rpx 0;
}
.summary-total {
  font-size: 34rpx;
  color: #ff6600;
  font-weight: bold;
}

/* 底部栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff;
  padding: 0 24rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}
.footer-right {
  display: flex;
  align-items: center;
}
.footer-label {
  font-size: 26rpx;
  color: #333;
}
.footer-price {
  font-size: 32rpx;
  color: #ff6600;
  font-weight: bold;
  margin-right: 20rpx;
}
.footer-btn {
  padding: 0 32rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff6600;
  border-radius: 34rpx;
}
.footer-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

/* 优惠券弹窗 */
.sku-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
.coupon-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 201;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 70vh;
  overflow-y: auto;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.coupon-popup.show {
  transform: translateY(0);
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.popup-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.popup-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-close-text {
  font-size: 32rpx;
  color: #999;
}
.coupon-list {
  padding: 16rpx 24rpx;
}
.coupon-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  background: #fff5f0;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid transparent;
}
.coupon-item.active {
  border-color: #ff6600;
}
.coupon-item.disabled {
  opacity: 0.5;
}
.coupon-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24rpx;
  min-width: 120rpx;
}
.coupon-value {
  font-size: 36rpx;
  color: #ff6600;
  font-weight: bold;
}
.coupon-condition {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}
.coupon-right {
  flex: 1;
}
.coupon-name {
  font-size: 26rpx;
  color: #333;
}
.coupon-date {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}
.coupon-check {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.coupon-check-icon {
  font-size: 28rpx;
  color: #ff6600;
}
.coupon-empty {
  padding: 40rpx 0;
  text-align: center;
}
.coupon-empty-text {
  font-size: 26rpx;
  color: #999;
}
.coupon-no-use {
  padding: 20rpx 0;
  text-align: center;
}
.coupon-no-use-text {
  font-size: 26rpx;
  color: #ff6600;
}

.safe-bottom {
  height: 20rpx;
}
</style>
