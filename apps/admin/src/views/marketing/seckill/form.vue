<template>
  <div class="seckill-form-page">
    <PageHeader :title="isEdit ? '编辑秒杀活动' : '新建秒杀活动'" />
    <a-card>
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        @finish="handleSave"
      >
        <a-form-item label="活动名称" required>
          <a-input v-model:value="formData.title" placeholder="请输入活动名称" />
        </a-form-item>

        <a-form-item label="活动标题">
          <a-input v-model:value="formData.activity_name" placeholder="请输入活动标题" />
        </a-form-item>

        <a-form-item label="关联商品ID" required>
          <a-input-number v-model:value="formData.product_id" :min="1" style="width: 100%" placeholder="请输入关联商品ID" />
        </a-form-item>

        <a-form-item label="秒杀价格" required>
          <a-input-number v-model:value="formData.price" :min="0" :precision="2" style="width: 100%" placeholder="请输入秒杀价格" />
        </a-form-item>

        <a-form-item label="库存" required>
          <a-input-number v-model:value="formData.stock" :min="0" style="width: 100%" placeholder="请输入库存" />
        </a-form-item>

        <a-form-item label="限购数量">
          <a-input-number v-model:value="formData.quota" :min="0" style="width: 100%" placeholder="请输入限购数量" />
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

        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" placeholder="请输入排序值" />
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
import { getSeckillDetail, createSeckill, updateSeckill } from '@/api/marketing'

const route = useRoute()
const router = useRouter()

const seckillId = computed(() => route.params.id ? Number(route.params.id) : 0)
const isEdit = computed(() => seckillId.value > 0)

const saving = ref(false)

const formData = reactive({
  title: '',
  activity_name: '',
  product_id: undefined as number | undefined,
  price: undefined as number | undefined,
  stock: undefined as number | undefined,
  quota: undefined as number | undefined,
  start_time: '',
  end_time: '',
  sort: 0,
  status: false,
})

async function fetchDetail() {
  if (!isEdit.value) return
  try {
    const res: any = await getSeckillDetail(seckillId.value)
    const data = res.data || {}
    formData.title = data.title || ''
    formData.activity_name = data.activity_name || ''
    formData.product_id = data.product_id
    formData.price = data.price
    formData.stock = data.stock
    formData.quota = data.quota
    formData.start_time = data.start_time || ''
    formData.end_time = data.end_time || ''
    formData.sort = data.sort ?? 0
    formData.status = !!data.status
  } catch {
    // silent
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      await updateSeckill(seckillId.value, { ...formData })
      message.success('更新成功')
    } else {
      await createSeckill({ ...formData })
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
.seckill-form-page {
  padding: 16px;
}
</style>
