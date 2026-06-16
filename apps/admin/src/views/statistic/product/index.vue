<template>
  <div class="product-statistic-page">
    <PageHeader title="商品统计" />
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-title">总商品数</div>
        <div class="stat-card-value font-mono">{{ statsData.totalProducts }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">上架商品</div>
        <div class="stat-card-value font-mono">{{ statsData.onSaleProducts }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">总销量</div>
        <div class="stat-card-value font-mono">{{ statsData.totalSales }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">总库存</div>
        <div class="stat-card-value font-mono">{{ statsData.totalStock }}</div>
      </div>
    </div>
    <a-card title="TOP10 热销商品">
      <ECharts :option="chartOption" :loading="loading" style="height: 400px" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'
import ECharts from '@/components/ECharts/index.vue'
import { getProductStats } from '@/api/statistic'

const loading = ref(false)

const statsData = reactive({
  totalProducts: 0,
  onSaleProducts: 0,
  totalSales: 0,
  totalStock: 0,
})

const topProducts = reactive({
  names: [] as string[],
  sales: [] as number[],
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: topProducts.names.slice().reverse(),
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: topProducts.sales.slice().reverse(),
      barMaxWidth: 30,
    },
  ],
}))

async function fetchData() {
  loading.value = true
  try {
    const res = await getProductStats()
    const data = res.data || {}
    statsData.totalProducts = data.totalProducts || 0
    statsData.onSaleProducts = data.onSaleProducts || 0
    statsData.totalSales = data.totalSales || 0
    statsData.totalStock = data.totalStock || 0
    topProducts.names = data.topProductNames || []
    topProducts.sales = data.topProductSales || []
  } catch {
    // silent
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.product-statistic-page {
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
}
</style>
