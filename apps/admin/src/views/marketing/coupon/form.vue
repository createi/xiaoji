<template>
  <div class="coupon-form-page">
    <PageHeader :title="isEdit ? '编辑优惠券' : '新建优惠券'" />
    <a-card>
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        @finish="handleSave"
      >
        <a-form-item label="优惠券名称" required>
          <a-input v-model:value="formData.title" placeholder="请输入优惠券名称" />
        </a-form-item>

        <a-form-item label="类型" required>
          <a-select v-model:value="formData.type" placeholder="请选择类型">
            <a-select-option :value="1">满减</a-select-option>
            <a-select-option :value="2">折扣</a-select-option>
            <a-select-option :value="3">无门槛</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="面值/折扣" required>
          <a-input-number v-model:value="formData.value" :min="0" :precision="2" style="width: 100%" placeholder="请输入面值或折扣" />
        </a-form-item>

        <a-form-item label="使用门槛">
          <a-input-number v-model:value="formData.min_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入使用门槛金额" />
        </a-form-item>

        <a-form-item label="使用范围">
          <a-select v-model:value="formData.use_type" placeholder="请选择使用范围">
            <a-select-option :value="1">全场</a-select-option>
            <a-select-option :value="2">指定分类</a-select-option>
            <a-select-option :value="3">指定商品</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开始时间" required>
          <a-date-picker
            v-model:value="formData.start_time"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            placeholder="请选择开始时间"
          />
        </a-form-item>

        <a-form-item label="结束时间" required>
          <a-date-picker
            v-model:value="formData.end_time"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            placeholder="请选择结束时间"
          />
        </a-form-item>

        <a-form-item label="领取限制">
          <a-input-number v-model:value="formData.stay_limit" :min="0" style="width: 100%" placeholder="请输入领取限制" />
        </a-form-item>

        <a-form-item label="是否展示">
          <a-switch v-model:checked="formData.is_show" />
        </a-form-item>

        <a-form-item label="状态">
          <a-switch v-model:checked="formData.status" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button style="margin-left: 12px" @click="router.back()">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { getCouponDetail, createCoupon, updateCoupon } from '@/api/marketing'

const route = useRoute()
const router = useRouter()

const couponId = computed(() => route.params.id ? Number(route.params.id) : 0)
const isEdit = computed(() => couponId.value > 0)

const saving = ref(false)

const formData = reactive({
  title: '',
  type: undefined as number | undefined,
  value: undefined as number | undefined,
  min_price: undefined as number | undefined,
  use_type: undefined as number | undefined,
  start_time: '',
  end_time: '',
  stay_limit: undefined as number | undefined,
  is_show: false,
  status: false,
})

async function fetchDetail() {
  if (!isEdit.value) return
  try {
    const res: any = await getCouponDetail(couponId.value)
    const data = res.data || {}
    formData.title = data.title || ''
    formData.type = data.type
    formData.value = data.value
    formData.min_price = data.min_price
    formData.use_type = data.use_type
    formData.start_time = data.start_time || ''
    formData.end_time = data.end_time || ''
    formData.stay_limit = data.stay_limit
    formData.is_show = !!data.is_show
    formData.status = !!data.status
  } catch {
    // silent
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      await updateCoupon(couponId.value, { ...formData })
      message.success('更新成功')
    } else {
      await createCoupon({ ...formData })
      message.success('创建成功')
    }
    router.back()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(fetchDetail)
</script>

<style scoped lang="scss">
.coupon-form-page {
  padding: 16px;
}
</style>
