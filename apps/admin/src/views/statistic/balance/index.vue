<template>
  <div>
    <PageHeader title="余额统计" />

    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="6">
        <StatCard label="今日充值" :value="'¥' + stats.todayRecharge" :prevValue="'¥' + 0" :rate="stats.rechargeTrend" />
      </a-col>
      <a-col :span="6">
        <StatCard label="今日提现" :value="'¥' + stats.todayExtract" :prevValue="'¥' + 0" />
      </a-col>
      <a-col :span="6">
        <StatCard label="余额总额" :value="'¥' + stats.totalBalance" :prevValue="'¥' + 0" />
      </a-col>
      <a-col :span="6">
        <StatCard label="待审提现" :value="'¥' + stats.pendingExtract" :prevValue="'¥' + 0" />
      </a-col>
    </a-row>

    <a-card title="余额变动趋势" style="margin-bottom: 16px">
      <div ref="chartRef" style="height: 350px"></div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import PageHeader from '@/components/PageHeader/index.vue';
import StatCard from '@/components/StatCard/index.vue';

const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts | null = null;

const stats = reactive({
  todayRecharge: 5680,
  todayExtract: 1200,
  totalBalance: 128650,
  pendingExtract: 8500,
  rechargeTrend: 15.2,
});

function initChart() {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    const days = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['充值金额', '提现金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: days },
      yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
      series: [
        { name: '充值金额', type: 'bar', data: days.map(() => Math.floor(Math.random() * 5000 + 2000)) },
        { name: '提现金额', type: 'bar', data: days.map(() => Math.floor(Math.random() * 2000 + 500)) },
      ],
    });
  }
}

function handleResize() {
  chart?.resize();
}

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
});
</script>
