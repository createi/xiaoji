<template>
  <a-layout class="basic-layout">
    <a-layout-sider
      v-model:collapsed="appStore.collapsed"
      :trigger="null"
      collapsible
      :width="220"
      theme="dark"
    >
      <div class="logo">
        <h1 v-if="!appStore.collapsed">xiaoji</h1>
        <h1 v-else>鸡</h1>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-sub-menu key="product">
          <template #icon><shopping-outlined /></template>
          <template #title>商品管理</template>
          <a-menu-item key="/product/list">商品列表</a-menu-item>
          <a-menu-item key="/product/category">商品分类</a-menu-item>
          <a-menu-item key="/product/attr">商品属性</a-menu-item>
          <a-menu-item key="/product/reply">商品评价</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="order">
          <template #icon><ordered-list-outlined /></template>
          <template #title>订单管理</template>
          <a-menu-item key="/order/list">订单列表</a-menu-item>
          <a-menu-item key="/order/refund">退款管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="user">
          <template #icon><user-outlined /></template>
          <template #title>用户管理</template>
          <a-menu-item key="/user/list">用户列表</a-menu-item>
          <a-menu-item key="/user/level">用户等级</a-menu-item>
          <a-menu-item key="/user/group">用户分组</a-menu-item>
          <a-menu-item key="/user/label">用户标签</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="marketing">
          <template #icon><gift-outlined /></template>
          <template #title>营销管理</template>
          <a-menu-item key="/marketing/coupon">优惠券管理</a-menu-item>
          <a-menu-item key="/marketing/seckill">秒杀活动</a-menu-item>
          <a-menu-item key="/marketing/combination">拼团活动</a-menu-item>
          <a-menu-item key="/marketing/bargain">砍价活动</a-menu-item>
          <a-menu-item key="/marketing/integral">积分商品</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="finance">
          <template #icon><money-collect-outlined /></template>
          <template #title>财务管理</template>
          <a-menu-item key="/finance/balance">余额记录</a-menu-item>
          <a-menu-item key="/finance/commission">佣金记录</a-menu-item>
          <a-menu-item key="/finance/extract">提现管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="agent">
          <template #icon><share-alt-outlined /></template>
          <template #title>分销管理</template>
          <a-menu-item key="/agent/list">分销商管理</a-menu-item>
          <a-menu-item key="/agent/apply">分销申请</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="cms">
          <template #icon><file-text-outlined /></template>
          <template #title>内容管理</template>
          <a-menu-item key="/cms/article">文章列表</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="statistic">
          <template #icon><bar-chart-outlined /></template>
          <template #title>数据统计</template>
          <a-menu-item key="/statistic/transaction">交易统计</a-menu-item>
          <a-menu-item key="/statistic/product">商品统计</a-menu-item>
          <a-menu-item key="/statistic/user">用户统计</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="setting">
          <template #icon><setting-outlined /></template>
          <template #title>系统设置</template>
          <a-menu-item key="/setting/system">系统设置</a-menu-item>
          <a-menu-item key="/setting/admin">管理员管理</a-menu-item>
          <a-menu-item key="/setting/role">角色管理</a-menu-item>
          <a-menu-item key="/setting/menus">菜单管理</a-menu-item>
          <a-menu-item key="/setting/store">门店管理</a-menu-item>
          <a-menu-item key="/setting/shipping">运费模板</a-menu-item>
          <a-menu-item key="/setting/express">快递公司</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="appStore.collapsed"
            class="trigger"
            @click="appStore.toggleCollapsed"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="appStore.toggleCollapsed"
          />
        </div>
        <div class="header-right">
          <a-dropdown>
            <a-space>
              <a-avatar :src="userStore.userInfo?.head_pic">
                {{ userStore.userInfo?.real_name?.charAt(0) }}
              </a-avatar>
              <span>{{ userStore.userInfo?.real_name || '管理员' }}</span>
            </a-space>
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="logout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  GiftOutlined,
  MoneyCollectOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();

const selectedKeys = ref<string[]>([route.path]);
const openKeys = ref<string[]>([]);

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path];
    const parentPath = '/' + path.split('/')[1];
    if (!openKeys.value.includes(parentPath)) {
      openKeys.value = [...openKeys.value, parentPath];
    }
  },
);

function handleMenuClick({ key }: { key: string }) {
  router.push(key);
}

function handleUserMenuClick({ key }: { key: string }) {
  if (key === 'logout') {
    userStore.logout();
    router.push('/login');
  }
}
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo h1 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>
