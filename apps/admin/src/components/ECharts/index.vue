<template>
  <v-chart
    class="echarts-chart"
    :option="option"
    :autoresize="true"
    :loading="loading"
    :loading-options="loadingOptions"
  />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);

defineProps<{
  option: Record<string, any>;
  loading?: boolean;
}>();

const loadingOptions = {
  text: '加载中...',
  color: '#0256ff',
  textColor: '#909399',
  maskColor: 'rgba(255, 255, 255, 0.8)',
};
</script>

<style scoped lang="scss">
.echarts-chart {
  width: 100%;
  min-height: 300px;
}
</style>
