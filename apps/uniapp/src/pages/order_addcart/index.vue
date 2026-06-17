<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">购物车</text>
      <text class="header-action" v-if="cartStore.list.length" @click="toggleEdit">
        {{ isEdit ? '完成' : '管理' }}
      </text>
    </view>

    <!-- 购物车列表 -->
    <view class="cart-list" v-if="cartStore.list.length">
      <view
        class="cart-item"
        v-for="item in cartStore.list"
        :key="item.id"
      >
        <!-- 复选框 -->
        <view
          class="checkbox"
          :class="{ checked: item.checked }"
          @click="cartStore.toggleCheck(item.id)"
        >
          <text class="checkbox-icon" v-if="item.checked">&#10003;</text>
        </view>

        <!-- 商品图片 -->
        <image
          class="cart-img"
          :src="item.product?.image"
          mode="aspectFill"
          v-if="item.product?.image"
        />
        <view class="cart-img placeholder" v-else />

        <!-- 商品信息 -->
        <view class="cart-info">
          <text class="cart-name">{{ item.product?.store_name || '商品' }}</text>
          <view class="cart-attr" v-if="item.attr">
            <text class="cart-attr-text">{{ item.attr?.name || '' }}</text>
          </view>
          <view class="cart-bottom">
            <text class="cart-price">¥{{ (item.attr?.price || item.product?.price || 0).toFixed(2) }}</text>
            <view class="stepper">
              <view
                class="stepper-btn"
                :class="{ disabled: item.cart_num <= 1 }"
                @click="onStep(item.id, item.cart_num - 1)"
              >
                <text class="stepper-btn-text">-</text>
              </view>
              <text class="stepper-value">{{ item.cart_num }}</text>
              <view class="stepper-btn" @click="onStep(item.id, item.cart_num + 1)">
                <text class="stepper-btn-text">+</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 删除按钮（编辑模式） -->
        <view class="delete-btn" v-if="isEdit" @click="onDelete(item.id)">
          <text class="delete-btn-text">删除</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <Empty
      text="购物车是空的"
      actionText="去逛逛"
      v-if="!cartStore.list.length && !loading"
      @action="goHome"
    />

    <!-- 底部结算栏 -->
    <view class="footer" v-if="cartStore.list.length">
      <view class="footer-left">
        <view
          class="checkbox"
          :class="{ checked: cartStore.allChecked }"
          @click="cartStore.toggleAll()"
        >
          <text class="checkbox-icon" v-if="cartStore.allChecked">&#10003;</text>
        </view>
        <text class="footer-all-text">全选</text>
      </view>
      <view class="footer-right">
        <view class="footer-total" v-if="!isEdit">
          <text class="footer-label">合计：</text>
          <text class="footer-price">¥{{ cartStore.totalPrice.toFixed(2) }}</text>
        </view>
        <view
          class="footer-btn"
          :class="{ disabled: !cartStore.checkedItems.length }"
          @click="onSubmit"
        >
          <text class="footer-btn-text">
            {{ isEdit ? `删除(${cartStore.checkedItems.length})` : `结算(${cartStore.checkedItems.length})` }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import Empty from '@/components/Empty/index.vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { getCartList, updateCart, deleteCart } from '@/api/order';
import { checkLogin } from '@/utils';

const cartStore = useCartStore();
const userStore = useUserStore();
const loading = ref(false);
const isEdit = ref(false);

async function fetchCart() {
  if (!userStore.isLogin) return;
  loading.value = true;
  try {
    const res = await getCartList();
    cartStore.setList(res?.data || []);
  } catch (e) {
    // handled by request layer
  } finally {
    loading.value = false;
  }
}

function toggleEdit() {
  isEdit.value = !isEdit.value;
}

async function onStep(id: number, num: number) {
  if (num < 1) return;
  cartStore.updateQuantity(id, num);
  try {
    await updateCart(id, { cart_num: num });
  } catch (e) {
    // revert on failure
    cartStore.updateQuantity(id, num);
  }
}

async function onDelete(id: number) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteCart([id]);
          cartStore.removeItem(id);
          uni.showToast({ title: '已删除', icon: 'success' });
        } catch (e) {
          // handled by request layer
        }
      }
    },
  });
}

function onSubmit() {
  if (isEdit.value) {
    // 批量删除
    const ids = cartStore.checkedItems.map((i) => i.id);
    if (!ids.length) return;
    uni.showModal({
      title: '提示',
      content: `确定删除选中的 ${ids.length} 件商品吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteCart(ids);
            ids.forEach((id) => cartStore.removeItem(id));
            isEdit.value = false;
            uni.showToast({ title: '已删除', icon: 'success' });
          } catch (e) {
            // handled by request layer
          }
        }
      },
    });
  } else {
    if (!cartStore.checkedItems.length) return;
    uni.navigateTo({ url: '/pages/order_confirm/index' });
  }
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

onShow(() => {
  if (checkLogin()) {
    fetchCart();
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 头部 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}
.header-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}
.header-action {
  font-size: 28rpx;
  color: #ff6600;
}

/* 购物车列表 */
.cart-list {
  padding: 16rpx 24rpx;
}
.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx 20rpx;
  margin-bottom: 16rpx;
}

/* 复选框 */
.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.checkbox.checked {
  background: #ff6600;
  border-color: #ff6600;
}
.checkbox-icon {
  font-size: 24rpx;
  color: #fff;
}

/* 商品图片 */
.cart-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.cart-img.placeholder {
  background: #f5f5f5;
}

/* 商品信息 */
.cart-info {
  flex: 1;
  min-width: 0;
}
.cart-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.cart-attr {
  margin-top: 8rpx;
}
.cart-attr-text {
  font-size: 22rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}
.cart-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.cart-price {
  font-size: 30rpx;
  color: #ff6600;
  font-weight: bold;
}

/* 数量步进器 */
.stepper {
  display: flex;
  align-items: center;
}
.stepper-btn {
  width: 48rpx;
  height: 48rpx;
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
  font-size: 28rpx;
  color: #333;
}
.stepper-value {
  width: 64rpx;
  text-align: center;
  font-size: 26rpx;
  color: #333;
}

/* 删除按钮 */
.delete-btn {
  margin-left: 16rpx;
  padding: 12rpx 24rpx;
  background: #ff4d4f;
  border-radius: 8rpx;
  flex-shrink: 0;
}
.delete-btn-text {
  font-size: 24rpx;
  color: #fff;
}

/* 底部结算栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 24rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}
.footer-left {
  display: flex;
  align-items: center;
}
.footer-all-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 12rpx;
}
.footer-right {
  display: flex;
  align-items: center;
}
.footer-total {
  margin-right: 20rpx;
}
.footer-label {
  font-size: 26rpx;
  color: #333;
}
.footer-price {
  font-size: 32rpx;
  color: #ff6600;
  font-weight: bold;
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
.footer-btn.disabled {
  opacity: 0.5;
}
.footer-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}
</style>
