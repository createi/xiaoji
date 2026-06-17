<template>
  <view class="page">
    <!-- Loading State -->
    <view v-if="loading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- Empty State -->
    <view v-else-if="addressList.length === 0" class="empty-wrap">
      <text class="empty-text">暂无收货地址</text>
      <text class="empty-sub">点击下方按钮添加新地址</text>
    </view>

    <!-- Address List -->
    <view v-else class="address-list">
      <view
        class="address-item"
        v-for="item in addressList"
        :key="item.id"
        @tap="handleEdit(item.id)"
      >
        <view class="item-main">
          <view class="item-header">
            <text class="item-name">{{ item.real_name }}</text>
            <text class="item-phone">{{ item.phone }}</text>
            <view v-if="item.is_default" class="default-badge">
              <text class="default-text">默认</text>
            </view>
          </view>
          <text class="item-address">
            {{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
          </text>
        </view>
        <view class="item-actions" @tap.stop="handleDelete(item.id)">
          <text class="delete-text">删除</text>
        </view>
      </view>
    </view>

    <!-- Bottom Button -->
    <view class="bottom-bar">
      <view class="add-btn" @tap="handleAdd">
        <text class="add-btn-text">+ 新增收货地址</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAddressList, deleteAddress } from '@/api/user';
import { navigateTo } from '@/utils';

const loading = ref(true);
const addressList = ref<any[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAddressList();
    if (res.status === 200) {
      addressList.value = res.data || [];
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  navigateTo('/pages/users/user_address/index');
}

function handleEdit(id: number) {
  navigateTo(`/pages/users/user_address/index?id=${id}`);
}

async function handleDelete(id: number) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (modalRes) => {
      if (modalRes.confirm) {
        try {
          await deleteAddress(id);
          uni.showToast({ title: '删除成功', icon: 'success' });
          fetchList();
        } catch (e: any) {
          // handled by interceptor
        }
      }
    },
  });
}

onShow(() => {
  fetchList();
});
</script>

<script lang="ts">
import { onShow } from '@dcloudio/uni-app';
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 140rpx;
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

.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 300rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
}

.empty-sub {
  font-size: 24rpx;
  color: #ccc;
  margin-top: 16rpx;
}

.address-list {
  padding: 20rpx;
}

.address-item {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.item-main {
  flex: 1;
  padding: 28rpx 24rpx;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.item-phone {
  font-size: 28rpx;
  color: #666;
}

.default-badge {
  background-color: #ff6600;
  border-radius: 6rpx;
  padding: 2rpx 10rpx;
}

.default-text {
  font-size: 20rpx;
  color: #fff;
}

.item-address {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  background-color: #ff4d4f;
}

.delete-text {
  font-size: 26rpx;
  color: #fff;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
}

.add-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff6600;
  border-radius: 44rpx;
}

.add-btn-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
}
</style>
