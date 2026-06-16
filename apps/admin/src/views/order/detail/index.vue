<template>
  <div class="order-detail-page">
    <PageHeader title="订单详情" />
    <a-spin :spinning="loading">
      <a-card title="订单信息" class="detail-card">
        <a-descriptions :column="3">
          <a-descriptions-item label="订单号">
            <span class="font-mono">{{ detail.orderId }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="statusColorMap[detail.status]">{{ statusTextMap[detail.status] }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ detail.addTime }}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="收货信息" class="detail-card">
        <a-descriptions :column="3">
          <a-descriptions-item label="收货人">{{ detail.realName }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ detail.userPhone }}</a-descriptions-item>
          <a-descriptions-item label="收货地址">{{ detail.userAddress }}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="商品信息" class="detail-card">
        <a-table
          :columns="productColumns"
          :data-source="detail.cartInfos || []"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'image'">
              <a-image :src="record.image" :width="50" :height="50" style="border-radius: 4px" />
            </template>
            <template v-if="column.dataIndex === 'price'">
              <span class="font-mono">¥{{ (record.price || 0).toFixed(2) }}</span>
            </template>
            <template v-if="column.dataIndex === 'total'">
              <span class="font-mono">¥{{ (record.total || 0).toFixed(2) }}</span>
            </template>
          </template>
        </a-table>
      </a-card>

      <a-card title="支付信息" class="detail-card">
        <a-descriptions :column="3">
          <a-descriptions-item label="支付方式">{{ detail.paid === 1 ? '已支付' : '待支付' }}</a-descriptions-item>
          <a-descriptions-item label="订单总额">
            <span class="font-mono text-red">¥{{ (detail.totalPrice || 0).toFixed(2) }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="支付时间">{{ detail.paidTime || '-' }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader/index.vue'
import { getOrderDetail } from '@/api/order'

const route = useRoute()

const loading = ref(false)

const statusTextMap: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

const statusColorMap: Record<string, string> = {
  pending: 'orange',
  paid: 'blue',
  shipped: 'cyan',
  completed: 'green',
  cancelled: 'default',
}

const detail = reactive<any>({
  id: '',
  orderId: '',
  status: '',
  addTime: '',
  realName: '',
  userPhone: '',
  userAddress: '',
  cartInfos: [],
  paid: 0,
  totalPrice: 0,
  paidTime: '',
})

const productColumns = [
  { title: '商品图片', dataIndex: 'image', width: 80 },
  { title: '商品名称', dataIndex: 'name', width: 200 },
  { title: '单价', dataIndex: 'price', width: 120 },
  { title: '数量', dataIndex: 'quantity', width: 80 },
  { title: '小计', dataIndex: 'total', width: 120 },
]

async function fetchData() {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  try {
    const res = await getOrderDetail(id)
    const data = res.data?.data || res.data || {}
    Object.assign(detail, data)
  } catch {
    // silent
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.order-detail-page {
  padding: 16px;

  .detail-card {
    margin-bottom: 16px;
  }

  .font-mono {
    font-family: 'Courier New', Courier, monospace;
  }

  .text-red {
    color: #f5222d;
  }
}
</style>
