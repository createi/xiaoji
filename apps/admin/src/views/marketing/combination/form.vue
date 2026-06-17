<template>
  <div class="combination-form-page">
    <PageHeader :title="isEdit ? '编辑拼团活动' : '新建拼团活动'" />
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

        <a-form-item label="拼团价" required>
          <a-input-number v-model:value="formData.price" :min="0" :precision="2" style="width: 100%" placeholder="请输入拼团价" />
        </a-form-item>

        <a-form-item label="原价">
          <a-input-number v-model:value="formData.ot_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入原价" />
        </a-form-item>

        <a-form-item label="成团人数" required>
          <a-input-number v-model:value="formData.people_num" :min="2" style="width: 100%" placeholder="请输入成团人数" />
        </a-form-item>

        <a-form-item label="总库存" required>
          <a-input-number v-model:value="formData.total" :min="0" style="width: 100%" placeholder="请输入总库存" />
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

        <a-form-item label="是否展示">
          <a-switch v-model:checked="formData.is_show" />
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
import { getCombinationDetail, createCombination, updateCombination } from '@/api/marketing'

const route = useRoute()
const router = useRouter()

const combinationId = computed(() => route.params.id ? Number(route.params.id) : 0)
const isEdit = computed(() => combinationId.value > 0)

const saving = ref(false)

const formData = reactive({
  title: '',
  product_id: undefined as number | undefined,
  price: undefined as number | undefined,
  ot_price: undefined as number | undefined,
  people_num: undefined as number | undefined,
  total: undefined as number | undefined,
  quota: undefined as number | undefined,
  start_time: '',
  end_time: '',
  sort: 0,
  is_show: false,
})

async function fetchDetail() {
  if (!isEdit.value) return
  try {
    const res: any = await getCombinationDetail(combinationId.value)
    const data = res.data || {}
    formData.title = data.title || ''
    formData.product_id = data.product_id
    formData.price = data.price
    formData.ot_price = data.ot_price
    formData.people_num = data.people_num
    formData.total = data.total
    formData.quota = data.quota
    formData.start_time = data.start_time || ''
    formData.end_time = data.end_time || ''
    formData.sort = data.sort ?? 0
    formData.is_show = !!data.is_show
  } catch {
    // silent
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      await updateCombination(combinationId.value, { ...formData })
      message.success('更新成功')
    } else {
      await createCombination({ ...formData })
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
.combination-form-page {
  padding: 16px;
}
</style>
