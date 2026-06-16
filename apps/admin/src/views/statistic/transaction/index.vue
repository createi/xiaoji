<template>
  <div class="transaction-statistic-page">
    <PageHeader title="交易统计" />
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-title">总销售额</div>
        <div class="stat-card-value font-mono">{{ formatPrice(statsData.totalSales) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">总订单数</div>
        <div class="stat-card-value font-mono">{{ statsData.totalOrders }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">客单价</div>
        <div class="stat-card-value font-mono">{{ formatPrice(statsData.avgPrice) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">退款金额</div>
        <div class="stat-card-value font-mono text-red">{{ formatPrice(statsData.refundAmount) }}</div>
      </div>
    </div>
    <a-card title="交易趋势">
      <ECharts :option="chartOption" :loading="loading" style="height: 400px" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'
import ECharts from '@/components/ECharts/index.vue'
import { getTransactionStats } from '@/api/statistic'

const loading = ref(false)

const statsData = reactive({
  totalSales: 0,
  totalOrders: 0,
  avgPrice: 0,
  refundAmount: 0,
})

const trendData = reactive({
  dates: [] as string[],
  sales: [] as number[],
  orders: [] as number[],
})

function formatPrice(value: number) {
  return `¥${(value || 0).toFixed(2)}`
}

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
  },
  legend: {
    data: ['销售额', '订单数'],
  },
  xAxis: {
    type: 'category',
    data: trendData.dates,
  },
  yAxis: [
    { type: 'value', name: '销售额' },
    { type: 'value', name: '订单数' },
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      data: trendData.sales,
      smooth: true,
    },
    {
      name: '订单数',
      type: 'line',
      yAxisIndex: 1,
      data: trendData.orders,
      smooth: true,
    },
  ],
}))

async function fetchData() {
  loading.value = true
  try {
    const res = await getTransactionStats()
    const data = res.data || {}
    statsData.totalSales = data.totalSales || 0
    statsData.totalOrders = data.totalOrders || 0
    statsData.avgPrice = data.avgPrice || 0
    statsData.refundAmount = data.refundAmount || 0
    trendData.dates = data.trendDates || []
    trendData.sales = data.trendSales || []
    trendData.orders = data.trendOrders || []
  } catch {
    // silent
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.transaction-statistic-page {
  padding: 16px;

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

      .stat-card-title {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }

      .stat-card-value {
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
  }

  .font-mono {
    font-family: 'Courier New', Courier, monospace;
  }

  .text-red {
    color: #f5222d;
  }
}
</style>
