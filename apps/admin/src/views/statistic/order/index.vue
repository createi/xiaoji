<template>
  <div>
    <PageHeader title="订单统计" />

    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="6">
        <StatCard label="今日订单数" :value="stats.todayCount" :prevValue="stats.yesterdayCount" :rate="stats.todayTrend" />
      </a-col>
      <a-col :span="6">
        <StatCard label="昨日订单数" :value="stats.yesterdayCount" :prevValue="0" />
      </a-col>
      <a-col :span="6">
        <StatCard label="本月订单数" :value="stats.monthCount" :prevValue="0" :rate="stats.monthTrend" />
      </a-col>
      <a-col :span="6">
        <StatCard label="总订单数" :value="stats.totalCount" :prevValue="0" />
      </a-col>
    </a-row>

    <a-card title="订单趋势" style="margin-bottom: 16px">
      <div ref="trendChartRef" style="height: 350px"></div>
    </a-card>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="订单类型分布">
          <div ref="typeChartRef" style="height: 300px"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="支付方式分布">
          <div ref="payChartRef" style="height: 300px"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import PageHeader from '@/components/PageHeader/index.vue';
import StatCard from '@/components/StatCard/index.vue';

const trendChartRef = ref<HTMLElement>();
const typeChartRef = ref<HTMLElement>();
const payChartRef = ref<HTMLElement>();

let trendChart: echarts.ECharts | null = null;
let typeChart: echarts.ECharts | null = null;
let payChart: echarts.ECharts | null = null;

const stats = reactive({
  todayCount: 128,
  yesterdayCount: 115,
  monthCount: 3580,
  totalCount: 28650,
  todayTrend: 11.3,
  monthTrend: 8.5,
});

function initCharts() {
  // 订单趋势
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value);
    const days = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['普通订单', '秒杀订单', '拼团订单', '砍价订单'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: days },
      yAxis: { type: 'value' },
      series: [
        { name: '普通订单', type: 'line', data: days.map(() => Math.floor(Math.random() * 50 + 30)), smooth: true },
        { name: '秒杀订单', type: 'line', data: days.map(() => Math.floor(Math.random() * 20 + 5)), smooth: true },
        { name: '拼团订单', type: 'line', data: days.map(() => Math.floor(Math.random() * 15 + 3)), smooth: true },
        { name: '砍价订单', type: 'line', data: days.map(() => Math.floor(Math.random() * 10 + 2)), smooth: true },
      ],
    });
  }

  // 订单类型分布
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value);
    typeChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 65, name: '普通订单' },
          { value: 15, name: '秒杀订单' },
          { value: 12, name: '拼团订单' },
          { value: 8, name: '砍价订单' },
        ],
      }],
    });
  }

  // 支付方式分布
  if (payChartRef.value) {
    payChart = echarts.init(payChartRef.value);
    payChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 55, name: '微信支付' },
          { value: 25, name: '支付宝支付' },
          { value: 15, name: '余额支付' },
          { value: 5, name: '线下支付' },
        ],
      }],
    });
  }
}

function handleResize() {
  trendChart?.resize();
  typeChart?.resize();
  payChart?.resize();
}

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChart?.dispose();
  typeChart?.dispose();
  payChart?.dispose();
});
</script>
