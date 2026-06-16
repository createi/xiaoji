<template>
  <div class="dashboard-container">
    <!-- Stat Cards -->
    <div class="stat-cards">
      <div class="stat-card" v-for="(item, idx) in statCards" :key="idx">
        <div class="stat-card-icon" :class="item.color">
          <component :is="item.icon" />
        </div>
        <div class="stat-card-info">
          <div class="stat-card-label">{{ item.label }}</div>
          <div class="stat-card-value font-mono">{{ item.value }}</div>
          <div class="stat-card-extra">
            昨日 {{ item.prev }}
            <span class="stat-card-rate" :class="item.rate > 0 ? 'up' : 'down'" v-if="item.rate !== undefined">
              {{ item.rate > 0 ? '+' : '' }}{{ item.rate }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <div class="quick-link-item" v-for="link in quickLinks" :key="link.path" @click="router.push(link.path)">
        <div class="quick-link-icon">
          <component :is="link.icon" />
        </div>
        <span class="quick-link-label">{{ link.label }}</span>
      </div>
    </div>

    <!-- Order Trend Chart -->
    <div class="chart-row full">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">订单趋势</span>
          <a-radio-group v-model:value="orderTrendRange" size="small">
            <a-radio-button value="7d">近7天</a-radio-button>
            <a-radio-button value="30d">近30天</a-radio-button>
          </a-radio-group>
        </div>
        <div class="chart-card-body">
          <ECharts :option="orderTrendOption" :loading="loading" />
        </div>
      </div>
    </div>

    <!-- User Stats Row -->
    <div class="chart-row two-third">
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">用户增长</span>
        </div>
        <div class="chart-card-body">
          <ECharts :option="userGrowthOption" :loading="loading" />
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <span class="chart-card-title">买家统计</span>
        </div>
        <div class="chart-card-body">
          <ECharts :option="buyerPieOption" :loading="loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UndoOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  ShopOutlined,
  OrderedListOutlined,
  GiftOutlined,
  MoneyCollectOutlined,
  ShareAltOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue';
import ECharts from '@/components/ECharts/index.vue';
import { getDashboardData } from '@/api/statistic';

const router = useRouter();
const loading = ref(false);
const orderTrendRange = ref('7d');

const dashboardData = ref<any>({});

const statCards = computed(() => [
  { label: '今日销售额', value: dashboardData.value.todaySales || '0.00', prev: dashboardData.value.yesterdaySales || '0.00', rate: dashboardData.value.salesRate, color: 'blue', icon: DollarOutlined },
  { label: '今日订单数', value: dashboardData.value.todayOrders || 0, prev: dashboardData.value.yesterdayOrders || 0, rate: dashboardData.value.ordersRate, color: 'orange', icon: ShoppingCartOutlined },
  { label: '今日新增用户', value: dashboardData.value.todayUsers || 0, prev: dashboardData.value.yesterdayUsers || 0, rate: dashboardData.value.usersRate, color: 'green', icon: UserOutlined },
  { label: '待退款订单', value: dashboardData.value.pendingRefund || 0, prev: dashboardData.value.yesterdayRefund || 0, rate: undefined, color: 'pink', icon: UndoOutlined },
]);

const quickLinks = [
  { label: '用户管理', path: '/user/list', icon: UserSwitchOutlined },
  { label: '系统设置', path: '/setting/system', icon: SettingOutlined },
  { label: '商品管理', path: '/product/list', icon: ShopOutlined },
  { label: '订单管理', path: '/order/list', icon: OrderedListOutlined },
  { label: '营销管理', path: '/marketing/coupon', icon: GiftOutlined },
  { label: '财务管理', path: '/finance/balance', icon: MoneyCollectOutlined },
  { label: '分销管理', path: '/agent/list', icon: ShareAltOutlined },
  { label: '内容管理', path: '/cms/article', icon: FileTextOutlined },
];

const primaryColor = '#0256ff';

const orderTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['订单数', '销售额'], bottom: 0 },
  grid: { left: 50, right: 50, top: 20, bottom: 40 },
  xAxis: { type: 'category', data: dashboardData.value.orderTrend?.dates || [] },
  yAxis: [
    { type: 'value', name: '订单数', position: 'left' },
    { type: 'value', name: '销售额(元)', position: 'right' },
  ],
  series: [
    { name: '订单数', type: 'bar', data: dashboardData.value.orderTrend?.orders || [], itemStyle: { color: primaryColor } },
    { name: '销售额', type: 'line', yAxisIndex: 1, data: dashboardData.value.orderTrend?.sales || [], smooth: true, itemStyle: { color: '#ffab2b' } },
  ],
}));

const userGrowthOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category', data: dashboardData.value.userGrowth?.dates || [] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', data: dashboardData.value.userGrowth?.counts || [], smooth: true, areaStyle: { color: 'rgba(2,86,255,0.1)' }, itemStyle: { color: primaryColor } },
  ],
}));

const buyerPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      label: { show: false },
      data: dashboardData.value.buyerStats || [
        { name: '新用户', value: 30 },
        { name: '回头客', value: 50 },
        { name: 'VIP', value: 20 },
      ],
    },
  ],
}));

onMounted(async () => {
  loading.value = true;
  try {
    const res: any = await getDashboardData();
    dashboardData.value = res.data || {};
  } catch {
    // use default data
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 0;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: var(--xj-bg-card);
  border-radius: 6px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;

  &.blue { background: #4d7cfe; }
  &.orange { background: #ffab2b; }
  &.green { background: #6dd230; }
  &.pink { background: #ff85c0; }
}

.stat-card-info {
  flex: 1;
  min-width: 0;
}

.stat-card-label {
  font-size: 12px;
  color: #98a9bc;
  margin-bottom: 4px;
}

.stat-card-value {
  font-size: 24px;
  font-weight: 600;
  font-family: 'Roboto', 'Roboto Mono', monospace;
  color: var(--xj-text-primary);
  line-height: 1.2;
}

.stat-card-extra {
  font-size: 12px;
  color: var(--xj-text-secondary);
  margin-top: 4px;
}

.stat-card-rate {
  margin-left: 4px;
  font-family: 'Roboto', monospace;
  &.up { color: #f5222d; }
  &.down { color: #52c41a; }
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.quick-link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
}

.quick-link-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--xj-text-primary);
  transition: background 0.2s, color 0.2s;
  &:hover { background: var(--xj-color-primary); color: #fff; }
}

.quick-link-label {
  font-size: 14px;
  color: var(--xj-text-primary);
}

.chart-row {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
  &.full { grid-template-columns: 1fr; }
  &.two-third { grid-template-columns: 2fr 1fr; }
}

.chart-card {
  background: var(--xj-bg-card);
  border-radius: 6px;
  padding: 16px;
}

.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--xj-text-primary);
}

.chart-card-body {
  width: 100%;
  min-height: 300px;
}
</style>
