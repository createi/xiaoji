<template>
  <view class="page">
    <!-- Loading -->
    <view v-if="pageLoading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- Form -->
    <view v-else class="form">
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input
          class="form-input"
          v-model="form.real_name"
          placeholder="请输入收货人姓名"
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          class="form-input"
          v-model="form.phone"
          placeholder="请输入手机号码"
          type="number"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <text class="form-label">所在地区</text>
        <picker
          mode="region"
          :value="region"
          @change="onRegionChange"
        >
          <view class="picker-wrap">
            <text :class="['picker-text', region.length === 0 ? 'placeholder' : '']">
              {{ region.length > 0 ? region.join(' ') : '请选择省/市/区' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">详细地址</text>
        <textarea
          class="form-textarea"
          v-model="form.detail"
          placeholder="请输入详细地址，如街道、楼栋、门牌号"
          maxlength="100"
        />
      </view>

      <view class="form-item switch-item">
        <text class="form-label">设为默认地址</text>
        <switch
          :checked="form.is_default === 1"
          color="#E93323"
          @change="onSwitchChange"
        />
      </view>
    </view>

    <!-- Save Button -->
    <view class="btn-area" v-if="!pageLoading">
      <button class="save-btn" :loading="saving" @tap="handleSave">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onLoad } from '@dcloudio/uni-app';
import { getAddressDetail, createAddress, updateAddress } from '@/api/user';
import { navigateTo } from '@/utils';

const addressId = ref<number | null>(null);
const pageLoading = ref(false);
const saving = ref(false);
const region = ref<string[]>([]);

const form = reactive({
  real_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  is_default: 0,
});

onLoad((options: any) => {
  if (options?.id) {
    addressId.value = Number(options.id);
    uni.setNavigationBarTitle({ title: '编辑地址' });
    fetchDetail(addressId.value);
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' });
  }
});

async function fetchDetail(id: number) {
  pageLoading.value = true;
  try {
    const res = await getAddressDetail(id);
    if (res.status === 200 && res.data) {
      const d = res.data;
      form.real_name = d.real_name || '';
      form.phone = d.phone || '';
      form.province = d.province || '';
      form.city = d.city || '';
      form.district = d.district || '';
      form.detail = d.detail || '';
      form.is_default = d.is_default || 0;
      if (d.province) {
        region.value = [d.province, d.city, d.district];
      }
    }
  } catch (e: any) {
    // handled by interceptor
  } finally {
    pageLoading.value = false;
  }
}

function onRegionChange(e: any) {
  const val = e.detail.value;
  region.value = val;
  form.province = val[0] || '';
  form.city = val[1] || '';
  form.district = val[2] || '';
}

function onSwitchChange(e: any) {
  form.is_default = e.detail.value ? 1 : 0;
}

async function handleSave() {
  if (!form.real_name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!form.phone || form.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
    return;
  }
  if (!form.province) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' });
    return;
  }
  if (!form.detail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }

  saving.value = true;
  try {
    const data = { ...form };
    if (addressId.value) {
      await updateAddress(addressId.value, data);
    } else {
      await createAddress(data);
    }
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 500);
  } catch (e: any) {
    // handled by interceptor
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
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

.form {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 0 30rpx;
}

.form-item {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.form-input {
  height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f9f9f9;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.picker-wrap {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx;
  background-color: #f9f9f9;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.picker-text.placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 28rpx;
  color: #999;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-item .form-label {
  margin-bottom: 0;
}

.btn-area {
  padding: 40rpx 30rpx;
}

.save-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #E93323;
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}

.save-btn::after {
  border: none;
}
</style>
