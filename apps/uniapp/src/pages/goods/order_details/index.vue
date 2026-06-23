<template>
  <view class="page">
    <!-- Loading -->
    <view v-if="loading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <template v-else-if="order">
      <!-- Status Header -->
      <view class="status-header">
        <text class="status-text">{{ getStatusText(order.status) }}</text>
        <text class="status-desc">{{ getStatusDesc(order.status) }}</text>
      </view>

      <!-- Shipping Info -->
      <view class="section" v-if="order.orderInfo">
        <view class="section-row">
          <text class="section-icon">&#x1f4cd;</text>
          <view class="shipping-info">
            <view class="shipping-header">
              <text class="shipping-name">{{ order.orderInfo.real_name }}</text>
              <text class="shipping-phone">{{ order.orderInfo.phone }}</text>
            </view>
            <text class="shipping-address">
              {{ order.orderInfo.province }}{{ order.orderInfo.city }}{{ order.orderInfo.district }}{{ order.orderInfo.detail }}
            </text>
          </view>
        </view>
      </view>

      <!-- Product List -->
      <view class="section">
        <view
          class="product-item"
          v-for="goods in order.cartInfo"
          :key="goods.id"
        >
          <image
            class="product-image"
            :src="goods.productInfo?.image"
            mode="aspectFill"
          />
          <view class="product-info">
            <text class="product-name">{{ goods.productInfo?.store_name }}</text>
            <text class="product-spec" v-if="goods.productInfo?.attrInfo">
              {{ goods.productInfo.attrInfo.sku }}
            </text>
          </view>
          <view class="product-right">
            <text class="product-price">¥{{ goods.productInfo?.price }}</text>
            <text class="product-qty">x{{ goods.cart_num }}</text>
          </view>
        </view>
      </view>

      <!-- Price Breakdown -->
      <view class="section">
        <view class="price-row">
          <text class="price-label">商品合计</text>
          <text class="price-value">¥{{ order.total_price }}</text>
        </view>
        <view class="price-row">
          <text class="price-label">运费</text>
          <text class="price-value">¥{{ order.postage_price || '0.00' }}</text>
        </view>
        <view class="price-row" v-if="order.coupon_price && Number(order.coupon_price) > 0">
          <text class="price-label">优惠券</text>
          <text class="price-value coupon">-¥{{ order.coupon_price }}</text>
        </view>
        <view class="price-row total-row">
          <text class="price-label">实付金额</text>
          <text class="price-total">¥{{ order.pay_price }}</text>
        </view>
      </view>

      <!-- Order Info -->
      <view class="section">
        <view class="info-row">
          <text class="info-label">订单编号</text>
          <text class="info-value">{{ order.order_id }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">创建时间</text>
          <text class="info-value">{{ order.add_time }}</text>
        </view>
        <view class="info-row" v-if="order.pay_time">
          <text class="info-label">付款时间</text>
          <text class="info-value">{{ order.pay_time }}</text>
        </view>
        <view class="info-row" v-if="order.delivery_time">
          <text class="info-label">发货时间</text>
          <text class="info-value">{{ order.delivery_time }}</text>
        </view>
      </view>

      <!-- Action Buttons -->
      <view class="action-bar" v-if="order.status === 0 || order.status === 2">
        <view
          v-if="order.status === 0"
          class="action-btn cancel-btn"
          @tap="handleCancel"
        >
          <text class="action-btn-text">取消订单</text>
        </view>
        <view
          v-if="order.status === 2"
          class="action-btn confirm-btn"
          @tap="handleConfirm"
        >
          <text class="action-btn-text">确认收货</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOrderDetail, cancelOrder, confirmOrder } from '@/api/order';
import { onLoad } from '@dcloudio/uni-app';

const loading = ref(true);
const orderId = ref<number>(0);
const order = ref<any>(null);

function getStatusText(status: number): string {
  const map: Record<number, string> = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '待评价',
    4: '已完成',
    '-1': '已退款',
  };
  return map[status] || '未知';
}

function getStatusDesc(status: number): string {
  const map: Record<number, string> = {
    0: '请在30分钟内完成付款',
    1: '商家正在为您备货',
    2: '商品已发出，请注意查收',
    3: '交易已完成，请对商品进行评价',
    4: '感谢您的购买',
    '-1': '订单已退款',
  };
  return map[status] || '';
}

async function fetchDetail() {
  loading.value = true;
  try {
    const res = await getOrderDetail(orderId.value);
    if (res.status === 200) {
      order.value = res.data;
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}

async function handleCancel() {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: async (modalRes) => {
      if (modalRes.confirm) {
        try {
          await cancelOrder(orderId.value);
          uni.showToast({ title: '取消成功', icon: 'success' });
          fetchDetail();
        } catch (e: any) {
          // handled by interceptor
        }
      }
    },
  });
}

async function handleConfirm() {
  uni.showModal({
    title: '提示',
    content: '确认已收到商品？',
    success: async (modalRes) => {
      if (modalRes.confirm) {
        try {
          await confirmOrder(orderId.value);
          uni.showToast({ title: '确认收货成功', icon: 'success' });
          fetchDetail();
        } catch (e: any) {
          // handled by interceptor
        }
      }
    },
  });
}

onLoad((options: any) => {
  if (options?.id) {
    orderId.value = Number(options.id);
    fetchDetail();
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding-top: 300rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.status-header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #E93323, #f0684d);
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.status-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
}

.section-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.section-icon {
  font-size: 36rpx;
  margin-top: 4rpx;
}

.shipping-info {
  flex: 1;
}

.shipping-header {
  display: flex;
  gap: 20rpx;
  margin-bottom: 8rpx;
}

.shipping-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.shipping-phone {
  font-size: 28rpx;
  color: #666;
}

.shipping-address {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  gap: 20rpx;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-spec {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.product-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.product-price {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.product-qty {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14rpx 0;
}

.price-label {
  font-size: 28rpx;
  color: #666;
}

.price-value {
  font-size: 28rpx;
  color: #333;
}

.price-value.coupon {
  color: #E93323;
}

.total-row {
  border-top: 1rpx solid #f5f5f5;
  margin-top: 10rpx;
  padding-top: 20rpx;
}

.total-row .price-label {
  font-weight: bold;
  color: #333;
}

.price-total {
  font-size: 32rpx;
  color: #E93323;
  font-weight: bold;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx;
  gap: 20rpx;
}

.action-btn {
  padding: 0 40rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
}

.cancel-btn {
  border: 2rpx solid #999;
}

.confirm-btn {
  background-color: #E93323;
}

.action-btn-text {
  font-size: 28rpx;
}

.cancel-btn .action-btn-text {
  color: #666;
}

.confirm-btn .action-btn-text {
  color: #fff;
}
</style>
