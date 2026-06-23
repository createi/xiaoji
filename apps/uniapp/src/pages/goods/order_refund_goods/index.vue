<template>
  <view class="page">
    <view class="section">
      <text class="section-title">退货物流</text>
      <view class="form-item">
        <text class="label">快递公司</text>
        <picker :range="expressList" @change="onExpressChange">
          <view class="picker">
            <text :class="{ placeholder: !selectedExpress }">{{ selectedExpress || '请选择快递公司' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">快递单号</text>
        <input class="input" v-model="expressNo" placeholder="请输入快递单号" />
      </view>
    </view>

    <view class="submit-wrap">
      <view class="submit-btn" @click="handleSubmit">
        <text class="submit-text">提交物流信息</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const expressList = ref(['顺丰速运', '圆通速递', '中通快递', '韵达快递', '申通快递', '邮政快递']);
const selectedExpress = ref('');
const expressNo = ref('');

onLoad(() => {});

function onExpressChange(e: any) {
  selectedExpress.value = expressList.value[e.detail.value];
}

function handleSubmit() {
  if (!selectedExpress.value) {
    uni.showToast({ title: '请选择快递公司', icon: 'none' });
    return;
  }
  if (!expressNo.value) {
    uni.showToast({ title: '请输入快递单号', icon: 'none' });
    return;
  }
  uni.showToast({ title: '物流信息提交成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.section { background: #fff; padding: 24rpx; margin-bottom: 16rpx; }
.section-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 16rpx; display: block; }
.form-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.form-item:last-child { border-bottom: none; }
.label { font-size: 26rpx; color: #333; width: 160rpx; flex-shrink: 0; }
.picker { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.picker text { font-size: 26rpx; color: #333; }
.picker text.placeholder { color: #999; }
.arrow { color: #999; }
.input { flex: 1; font-size: 26rpx; text-align: right; }
.submit-wrap { position: fixed; bottom: 0; left: 0; right: 0; padding: 24rpx; background: #fff; }
.submit-btn { height: 88rpx; display: flex; align-items: center; justify-content: center; background: #E93323; border-radius: 44rpx; }
.submit-text { font-size: 32rpx; color: #fff; font-weight: bold; }
</style>
