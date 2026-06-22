<template>
  <view class="page">
    <view class="balance-card">
      <text class="balance-label">可提现余额</text>
      <text class="balance-value">¥{{ balance.toFixed(2) }}</text>
      <view class="extract-btn" @click="showExtractModal = true">
        <text class="extract-btn-text">提现</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">提现记录</text>
      <view class="record-list">
        <view class="record-item" v-for="item in records" :key="item.id">
          <view class="record-left">
            <text class="record-type">{{ item.type_name }}</text>
            <text class="record-time">{{ item.add_time }}</text>
          </view>
          <view class="record-right">
            <text class="record-amount">-¥{{ item.amount.toFixed(2) }}</text>
            <text class="record-status" :class="item.status === 1 ? 'success' : item.status === 0 ? 'pending' : 'fail'">
              {{ item.status === 0 ? '审核中' : item.status === 1 ? '已提现' : '已拒绝' }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 提现弹窗 -->
    <view class="modal-mask" v-if="showExtractModal" @click="showExtractModal = false">
      <view class="modal" @click.stop>
        <text class="modal-title">申请提现</text>
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">提现金额</text>
            <input class="form-input" v-model="extractAmount" type="digit" placeholder="请输入提现金额" />
          </view>
          <view class="form-item">
            <text class="form-label">提现方式</text>
            <view class="method-list">
              <view class="method-item" :class="{ active: extractMethod === 'wechat' }" @click="extractMethod = 'wechat'">
                <text>微信</text>
              </view>
              <view class="method-item" :class="{ active: extractMethod === 'alipay' }" @click="extractMethod = 'alipay'">
                <text>支付宝</text>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="showExtractModal = false">
            <text>取消</text>
          </view>
          <view class="modal-btn confirm" @click="handleExtract">
            <text>确认提现</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const balance = ref(1280.50);
const showExtractModal = ref(false);
const extractAmount = ref('');
const extractMethod = ref('wechat');

const records = ref([
  { id: 1, type_name: '微信提现', amount: 200.00, status: 1, add_time: '2024-01-15 14:00' },
  { id: 2, type_name: '支付宝提现', amount: 500.00, status: 0, add_time: '2024-01-14 10:30' },
  { id: 3, type_name: '微信提现', amount: 300.00, status: 2, add_time: '2024-01-12 09:00' },
]);

function handleExtract() {
  const amount = parseFloat(extractAmount.value);
  if (!amount || amount <= 0) {
    uni.showToast({ title: '请输入正确的金额', icon: 'none' });
    return;
  }
  if (amount > balance.value) {
    uni.showToast({ title: '余额不足', icon: 'none' });
    return;
  }
  showExtractModal.value = false;
  uni.showToast({ title: '提现申请已提交', icon: 'success' });
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.balance-card { background: linear-gradient(135deg, #ff6600, #ff8533); padding: 40rpx 24rpx; text-align: center; }
.balance-label { font-size: 24rpx; color: rgba(255,255,255,0.8); }
.balance-value { font-size: 56rpx; color: #fff; font-weight: bold; display: block; margin-top: 8rpx; }
.extract-btn { margin-top: 24rpx; display: inline-block; padding: 12rpx 48rpx; border: 2rpx solid rgba(255,255,255,0.8); border-radius: 32rpx; }
.extract-btn-text { font-size: 26rpx; color: #fff; }
.section { background: #fff; margin-top: 16rpx; padding: 24rpx; }
.section-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 16rpx; display: block; }
.record-item { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.record-item:last-child { border-bottom: none; }
.record-left { flex: 1; }
.record-type { font-size: 28rpx; color: #333; display: block; }
.record-time { font-size: 22rpx; color: #999; margin-top: 8rpx; display: block; }
.record-right { text-align: right; }
.record-amount { font-size: 30rpx; font-weight: bold; color: #333; display: block; }
.record-status { font-size: 22rpx; display: block; margin-top: 8rpx; }
.record-status.success { color: #07c160; }
.record-status.pending { color: #ff6600; }
.record-status.fail { color: #ff4d4f; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal { width: 600rpx; background: #fff; border-radius: 16rpx; overflow: hidden; }
.modal-title { font-size: 32rpx; font-weight: bold; text-align: center; padding: 24rpx; border-bottom: 1rpx solid #f0f0f0; }
.modal-body { padding: 24rpx; }
.form-item { margin-bottom: 24rpx; }
.form-label { font-size: 26rpx; color: #333; margin-bottom: 12rpx; display: block; }
.form-input { width: 100%; height: 80rpx; border: 1rpx solid #eee; border-radius: 8rpx; padding: 0 16rpx; font-size: 28rpx; box-sizing: border-box; }
.method-list { display: flex; gap: 16rpx; }
.method-item { flex: 1; height: 72rpx; display: flex; align-items: center; justify-content: center; border: 2rpx solid #eee; border-radius: 8rpx; font-size: 26rpx; }
.method-item.active { border-color: #ff6600; color: #ff6600; background: #fff7f0; }
.modal-footer { display: flex; border-top: 1rpx solid #f0f0f0; }
.modal-btn { flex: 1; height: 88rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; }
.modal-btn.cancel { color: #999; border-right: 1rpx solid #f0f0f0; }
.modal-btn.confirm { color: #ff6600; font-weight: bold; }
</style>
