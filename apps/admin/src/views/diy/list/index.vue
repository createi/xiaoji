<template>
  <div class="mall-theme">
    <!-- Left sidebar -->
    <div class="theme-sidebar">
      <div class="sidebar-title">页面管理</div>
      <div class="sidebar-menu">
        <div
          class="sidebar-item"
          :class="{ active: activeCategory === item.key }"
          v-for="item in categories"
          :key="item.key"
          @click="activeCategory = item.key"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="theme-main">
      <!-- Theme header -->
      <div class="theme-header">
        <div class="theme-info">
          <span class="theme-name">{{ currentTheme.name }}</span>
          <a-tag color="blue" v-if="currentTheme.is_active">已启用</a-tag>
          <a-tag v-else>未启用</a-tag>
        </div>
      </div>

      <!-- Page tabs -->
      <div class="page-tabs">
        <div
          class="page-tab"
          :class="{ active: activeTab === tab.key }"
          v-for="tab in pageTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- Template grid -->
      <div class="template-grid">
        <div
          class="template-card"
          v-for="tpl in templates"
          :key="tpl.id"
          :class="{ active: tpl.is_active }"
        >
          <div class="template-phone">
            <div class="phone-frame">
              <div class="phone-status-bar">
                <span>9:41</span>
                <span>⚡ 100%</span>
              </div>
              <div class="phone-content" :style="{ background: tpl.bg }">
                <!-- Phone mockup content -->
                <div class="mock-header" :style="{ background: tpl.headerColor }">
                  <div class="mock-search"></div>
                </div>
                <div class="mock-banner" :style="{ background: tpl.bannerColor }"></div>
                <div class="mock-grid">
                  <div class="mock-grid-item" v-for="i in 4" :key="i"></div>
                </div>
                <div class="mock-section">
                  <div class="mock-section-title"></div>
                  <div class="mock-products">
                    <div class="mock-product" v-for="i in 4" :key="i">
                      <div class="mock-product-img"></div>
                      <div class="mock-product-text"></div>
                      <div class="mock-product-price"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="template-info">
            <span class="template-name">{{ tpl.name }}</span>
          </div>
          <div class="template-actions">
            <a-button
              size="small"
              :type="tpl.is_active ? 'default' : 'primary'"
              v-if="tpl.is_active"
              disabled
            >
              已选用
            </a-button>
            <a-button size="small" type="primary" @click="handleSelect(tpl)" v-else>
              选用
            </a-button>
            <a-button size="small" @click="handleEdit(tpl)">编辑</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeCategory = ref('home');
const activeTab = ref('index');

const categories = [
  { key: 'home', label: '商城主题' },
  { key: 'activity', label: '营销活动' },
  { key: 'integral', label: '积分商城' },
  { key: 'user', label: '个人中心' },
];

const pageTabs = computed(() => {
  const tabs: Record<string, { key: string; label: string }[]> = {
    home: [
      { key: 'index', label: '首页' },
      { key: 'seckill', label: '限时秒杀' },
      { key: 'presell', label: '限时预售' },
      { key: 'cate', label: '全部分类' },
      { key: 'coupon', label: '优惠券' },
    ],
    integral: [
      { key: 'index', label: '积分商城' },
      { key: 'detail', label: '积分详情' },
    ],
    user: [
      { key: 'index', label: '个人中心' },
    ],
    activity: [
      { key: 'seckill', label: '秒杀活动' },
      { key: 'combination', label: '拼团活动' },
      { key: 'bargain', label: '砍价活动' },
    ],
  };
  return tabs[activeCategory.value] || tabs.home;
});

const currentTheme = ref({ name: '商城主题(默认)', is_active: true });

const themeColors = [
  { bg: '#f5f5f5', headerColor: '#E93323', bannerColor: '#ffccc7' },
  { bg: '#f5f5f5', headerColor: '#1890ff', bannerColor: '#bae7ff' },
  { bg: '#f5f5f5', headerColor: '#52c41a', bannerColor: '#d9f7be' },
  { bg: '#f5f5f5', headerColor: '#722ed1', bannerColor: '#efdbff' },
];

const templates = ref([
  { id: 1, name: '模板一', is_active: true, ...themeColors[0] },
  { id: 2, name: '模板二', is_active: false, ...themeColors[1] },
  { id: 3, name: '模板三', is_active: false, ...themeColors[2] },
  { id: 4, name: '模板四', is_active: false, ...themeColors[3] },
]);

function handleSelect(tpl: any) {
  templates.value.forEach((t) => (t.is_active = false));
  tpl.is_active = true;
  message.success(`已选用 ${tpl.name}`);
}

function handleEdit(tpl: any) {
  router.push(`/diy/edit/${tpl.id}`);
}
</script>

<style scoped>
.mall-theme {
  display: flex;
  height: calc(100vh - 110px);
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

/* Left sidebar */
.theme-sidebar {
  width: 180px;
  border-right: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.sidebar-title {
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}
.sidebar-menu {
  padding: 8px 0;
}
.sidebar-item {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}
.sidebar-item:hover {
  color: #0256ff;
  background: #f5f7fa;
}
.sidebar-item.active {
  color: #0256ff;
  background: #e6f7ff;
  font-weight: 500;
}

/* Main content */
.theme-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.theme-header {
  margin-bottom: 16px;
}
.theme-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.theme-name {
  font-size: 16px;
  font-weight: 600;
}

/* Page tabs */
.page-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}
.page-tab {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.page-tab:hover {
  color: #0256ff;
}
.page-tab.active {
  color: #0256ff;
  border-bottom-color: #0256ff;
  font-weight: 500;
}

/* Template grid */
.template-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.template-card {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
  text-align: center;
}
.template-card:hover {
  border-color: #0256ff;
  box-shadow: 0 2px 8px rgba(2, 86, 255, 0.1);
}
.template-card.active {
  border-color: #0256ff;
  background: #f0f7ff;
}

/* Phone mockup */
.template-phone {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}
.phone-frame {
  width: 160px;
  height: 280px;
  border: 2px solid #333;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
}
.phone-status-bar {
  height: 20px;
  background: #333;
  color: #fff;
  font-size: 8px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  align-items: center;
}
.phone-content {
  height: 260px;
  overflow: hidden;
}
.mock-header {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}
.mock-search {
  width: 80%;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}
.mock-banner {
  height: 50px;
  margin: 4px;
  border-radius: 4px;
}
.mock-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px 8px;
}
.mock-grid-item {
  height: 28px;
  background: #e8e8e8;
  border-radius: 4px;
}
.mock-section {
  padding: 4px 8px;
}
.mock-section-title {
  width: 60%;
  height: 10px;
  background: #e8e8e8;
  border-radius: 2px;
  margin-bottom: 6px;
}
.mock-products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}
.mock-product {
  background: #fff;
  border-radius: 4px;
  padding: 4px;
}
.mock-product-img {
  height: 40px;
  background: #e8e8e8;
  border-radius: 2px;
}
.mock-product-text {
  height: 6px;
  background: #e8e8e8;
  border-radius: 2px;
  margin-top: 4px;
  width: 80%;
}
.mock-product-price {
  height: 8px;
  background: #E93323;
  border-radius: 2px;
  margin-top: 2px;
  width: 40%;
}

/* Template info */
.template-info {
  margin-bottom: 8px;
}
.template-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* Template actions */
.template-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
