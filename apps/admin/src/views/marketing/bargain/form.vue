<template>
  <div class="bargain-form-page">
    <PageHeader :title="isEdit ? '编辑砍价活动' : '新建砍价活动'" />
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

        <a-form-item label="关联商品ID" required>
          <a-input-number v-model:value="formData.product_id" :min="1" style="width: 100%" placeholder="请输入关联商品ID" />
        </a-form-item>

        <a-form-item label="底价" required>
          <a-input-number v-model:value="formData.price" :min="0" :precision="2" style="width: 100%" placeholder="请输入底价" />
        </a-form-item>

        <a-form-item label="成本价">
          <a-input-number v-model:value="formData.cost_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入成本价" />
        </a-form-item>

        <a-form-item label="商品原价">
          <a-input-number v-model:value="formData.product_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入商品原价" />
        </a-form-item>

        <a-form-item label="最低砍价金额">
          <a-input-number v-model:value="formData.min_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入最低砍价金额" />
        </a-form-item>

        <a-form-item label="砍价库存">
          <a-input-number v-model:value="formData.bargain_stock" :min="0" style="width: 100%" placeholder="请输入砍价库存" />
        </a-form-item>

        <a-form-item label="限购数量">
          <a-input-number v-model:value="formData.quota" :min="0" style="width: 100%" placeholder="请输入限购数量" />
        </a-form-item>

        <a-form-item label="总库存">
          <a-input-number v-model:value="formData.total" :min="0" style="width: 100%" placeholder="请输入总库存" />
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

        <a-form-item label="活动规则">
          <a-textarea v-model:value="formData.rule" :rows="4" placeholder="请输入活动规则" />
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
import { getBargainDetail, createBargain, updateBargain } from '@/api/marketing'

const route = useRoute()
const router = useRouter()

const bargainId = computed(() => route.params.id ? Number(route.params.id) : 0)
const isEdit = computed(() => bargainId.value > 0)

const saving = ref(false)

const formData = reactive({
  title: '',
  product_id: undefined as number | undefined,
  price: undefined as number | undefined,
  cost_price: undefined as number | undefined,
  product_price: undefined as number | undefined,
  min_price: undefined as number | undefined,
  bargain_stock: undefined as number | undefined,
  quota: undefined as number | undefined,
  total: undefined as number | undefined,
  start_time: '',
  end_time: '',
  sort: 0,
  status: false,
  rule: '',
})

async function fetchDetail() {
  if (!isEdit.value) return
  try {
    const res: any = await getBargainDetail(bargainId.value)
    const data = res.data || {}
    formData.title = data.title || ''
    formData.product_id = data.product_id
    formData.price = data.price
    formData.cost_price = data.cost_price
    formData.product_price = data.product_price
    formData.min_price = data.min_price
    formData.bargain_stock = data.bargain_stock
    formData.quota = data.quota
    formData.total = data.total
    formData.start_time = data.start_time || ''
    formData.end_time = data.end_time || ''
    formData.sort = data.sort ?? 0
    formData.status = !!data.status
    formData.rule = data.rule || ''
  } catch {
    // silent
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      await updateBargain(bargainId.value, { ...formData })
      message.success('更新成功')
    } else {
      await createBargain({ ...formData })
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
.bargain-form-page {
  padding: 16px;
}
</style>
