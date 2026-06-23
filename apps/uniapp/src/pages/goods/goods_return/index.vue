<template>
  <view class="page">
    <view class="section">
      <text class="section-title">退款商品</text>
      <view class="product-info">
        <image class="product-image" :src="product.image" mode="aspectFill"></image>
        <view class="product-detail">
          <text class="product-name">{{ product.store_name }}</text>
          <text class="product-spec">{{ product.spec }}</text>
          <text class="product-price">¥{{ product.price }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">退款原因</text>
      <view class="reason-list">
        <view
          class="reason-item"
          v-for="reason in reasons"
          :key="reason"
          :class="{ active: selectedReason === reason }"
          @click="selectedReason = reason"
        >
          <text>{{ reason }}</text>
          <text class="check" v-if="selectedReason === reason">✓</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">退款说明</text>
      <textarea class="textarea" v-model="remark" placeholder="请详细描述退款原因（选填）" maxlength="200" />
    </view>

    <view class="section">
      <text class="section-title">上传凭证</text>
      <view class="upload-list">
        <view class="upload-item" v-for="(img, i) in images" :key="i">
          <image class="upload-img" :src="img" mode="aspectFill"></image>
          <view class="upload-delete" @click="removeImage(i)">×</view>
        </view>
        <view class="upload-add" v-if="images.length < 5" @click="chooseImage">
          <text class="upload-add-text">+</text>
        </view>
      </view>
    </view>

    <view class="submit-wrap">
      <view class="submit-btn" @click="handleSubmit">
        <text class="submit-text">提交申请</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const product = ref({ image: '', store_name: '商品名称', spec: '默认规格', price: '99.00' });
const selectedReason = ref('');
const remark = ref('');
const images = ref<string[]>([]);

const reasons = ['不想要了', '商品质量问题', '商品与描述不符', '发错货/漏发', '其他原因'];

onLoad(() => {});

function chooseImage() {
  uni.chooseImage({
    count: 5 - images.value.length,
    success: (res) => {
      images.value.push(...res.tempFilePaths);
    },
  });
}

function removeImage(index: number) {
  images.value.splice(index, 1);
}

function handleSubmit() {
  if (!selectedReason.value) {
    uni.showToast({ title: '请选择退款原因', icon: 'none' });
    return;
  }
  uni.showToast({ title: '退款申请已提交', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.section { background: #fff; padding: 24rpx; margin-bottom: 16rpx; }
.section-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 16rpx; display: block; }
.product-info { display: flex; }
.product-image { width: 160rpx; height: 160rpx; border-radius: 8rpx; margin-right: 20rpx; background: #eee; }
.product-detail { flex: 1; }
.product-name { font-size: 26rpx; color: #333; display: block; }
.product-spec { font-size: 22rpx; color: #999; margin-top: 8rpx; display: block; }
.product-price { font-size: 28rpx; color: #E93323; font-weight: bold; margin-top: 12rpx; display: block; }
.reason-list { }
.reason-item { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; font-size: 26rpx; color: #333; }
.reason-item.active { color: #E93323; }
.check { color: #E93323; font-weight: bold; }
.textarea { width: 100%; height: 200rpx; font-size: 26rpx; padding: 16rpx; border: 1rpx solid #eee; border-radius: 8rpx; box-sizing: border-box; }
.upload-list { display: flex; gap: 16rpx; flex-wrap: wrap; }
.upload-item { position: relative; }
.upload-img { width: 140rpx; height: 140rpx; border-radius: 8rpx; }
.upload-delete { position: absolute; top: -8rpx; right: -8rpx; width: 32rpx; height: 32rpx; background: #ff4d4f; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20rpx; }
.upload-add { width: 140rpx; height: 140rpx; border: 2rpx dashed #ddd; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; }
.upload-add-text { font-size: 48rpx; color: #999; }
.submit-wrap { position: fixed; bottom: 0; left: 0; right: 0; padding: 24rpx; background: #fff; }
.submit-btn { height: 88rpx; display: flex; align-items: center; justify-content: center; background: #E93323; border-radius: 44rpx; }
.submit-text { font-size: 32rpx; color: #fff; font-weight: bold; }
</style>
