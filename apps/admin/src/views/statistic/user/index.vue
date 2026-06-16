<template>
  <div class="user-statistic-page">
    <PageHeader title="用户统计" />
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-title">总用户数</div>
        <div class="stat-card-value font-mono">{{ statsData.totalUsers }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">今日新增</div>
        <div class="stat-card-value font-mono">{{ statsData.todayNewUsers }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">活跃用户</div>
        <div class="stat-card-value font-mono">{{ statsData.activeUsers }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-title">付费用户</div>
        <div class="stat-card-value font-mono">{{ statsData.paidUsers }}</div>
      </div>
    </div>
    <a-row :gutter="16">
      <a-col :span="14">
        <a-card title="用户增长趋势">
          <ECharts :option="lineChartOption" :loading="loading" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card title="用户来源分布">
          <ECharts :option="pieChartOption" :loading="loading" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'
import ECharts from '@/components/ECharts/index.vue'
import { getUserStats } from '@/api/statistic'

const loading = ref(false)

const statsData = reactive({
  totalUsers: 0,
  todayNewUsers: 0,
  activeUsers: 0,
  paidUsers: 0,
})

const growthData = reactive({
  dates: [] as string[],
  counts: [] as number[],
})

const sourceData = reactive({
  names: [] as string[],
  counts: [] as number[],
})

const lineChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: growthData.dates,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      data: growthData.counts,
      smooth: true,
    },
  ],
}))

const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
  },
  series: [
    {
      name: '用户来源',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: sourceData.names.map((name, index) => ({
        name,
        value: sourceData.counts[index],
      })),
    },
  ],
}))

async function fetchData() {
  loading.value = true
  try {
    const res = await getUserStats()
    const data = res.data || {}
    statsData.totalUsers = data.totalUsers || 0
    statsData.todayNewUsers = data.todayNewUsers || 0
    statsData.activeUsers = data.activeUsers || 0
    statsData.paidUsers = data.paidUsers || 0
    growthData.dates = data.growthDates || []
    growthData.counts = data.growthCounts || []
    sourceData.names = data.sourceNames || []
    sourceData.counts = data.sourceCounts || []
  } catch {
    // silent
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.user-statistic-page {
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
