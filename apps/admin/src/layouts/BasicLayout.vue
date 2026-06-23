<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <div class="layout-sidebar" :class="{ collapsed: appStore.collapsed }">
      <div class="layout-sidebar-logo">
        <span v-if="!appStore.collapsed">xiaoji</span>
        <span v-else>鸡</span>
      </div>
      <div class="layout-sidebar-menu">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          theme="dark"
          mode="inline"
          :inline-collapsed="appStore.collapsed"
          @click="handleMenuClick"
        >
          <template v-for="item in menuItems" :key="item.key">
            <a-sub-menu v-if="item.children?.length" :key="item.key">
              <template #icon>
                <component :is="item.icon" />
              </template>
              <template #title>{{ item.label }}</template>
              <a-menu-item v-for="child in item.children" :key="child.key">
                {{ child.label }}
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.key">
              <template #icon>
                <component :is="item.icon" />
              </template>
              {{ item.label }}
            </a-menu-item>
          </template>
        </a-menu>
      </div>
    </div>

    <!-- Main area -->
    <div class="layout-main">
      <!-- Header -->
      <div class="layout-header">
        <div class="layout-header-left">
          <span class="layout-collapse-btn" @click="appStore.toggleCollapsed">
            <MenuUnfoldOutlined v-if="appStore.collapsed" />
            <MenuFoldOutlined v-else />
          </span>
        </div>
        <div class="layout-header-right">
          <a-dropdown>
            <a-space style="cursor: pointer">
              <a-avatar :size="28" :src="userStore.userInfo?.head_pic">
                {{ userStore.userInfo?.real_name?.charAt(0) || 'A' }}
              </a-avatar>
              <span class="font-mono">{{ userStore.userInfo?.real_name || '管理员' }}</span>
            </a-space>
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <!-- Tags View -->
      <TagsView />

      <!-- Content -->
      <div class="layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import {
  HomeOutlined,
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
  AppstoreOutlined,
  DashboardOutlined,
} from '@ant-design/icons-vue';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import TagsView from '@/components/TagsView/index.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();

const iconMap: Record<string, any> = {
  HomeOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  GiftOutlined,
  MoneyCollectOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  AppstoreOutlined,
  DashboardOutlined,
};

interface MenuItem {
  key: string;
  label: string;
  icon?: any;
  children?: MenuItem[];
}

function buildMenu(routes: RouteRecordRaw[], parentPath = ''): MenuItem[] {
  const items: MenuItem[] = [];
  for (const routeItem of routes) {
    if (routeItem.meta?.hidden) continue;
    const fullPath = parentPath.endsWith('/')
      ? `${parentPath}${routeItem.path}`
      : `${parentPath}/${routeItem.path}`;
    const children = routeItem.children?.filter((c) => !c.meta?.hidden) || [];
    if (children.length > 0) {
      items.push({
        key: fullPath,
        label: (routeItem.meta?.title as string) || '',
        icon: iconMap[routeItem.meta?.icon as string],
        children: children.map((child) => ({
          key: `${fullPath}/${child.path}`,
          label: (child.meta?.title as string) || '',
        })),
      });
    } else {
      items.push({
        key: fullPath,
        label: (routeItem.meta?.title as string) || '',
        icon: iconMap[routeItem.meta?.icon as string],
      });
    }
  }
  return items;
}

const menuItems = computed(() => {
  const mainRoute = router.options.routes.find((r) => r.path === '/');
  if (!mainRoute?.children) return [];
  return buildMenu(mainRoute.children, '/');
});

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path];
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 1) {
      const parentPath = '/' + segments[0];
      if (!openKeys.value.includes(parentPath)) {
        openKeys.value = [...openKeys.value, parentPath];
      }
    }
  },
  { immediate: true },
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

<style scoped lang="scss">
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-sidebar {
  width: var(--xj-sidebar-width);
  height: 100vh;
  background: var(--xj-sidebar-bg);
  box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
  transition: width 0.3s cubic-bezier(0.2, 1, 0.3, 1);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;

  &.collapsed {
    width: var(--xj-sidebar-collapsed-width);
  }
}

.layout-sidebar-logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);

  span {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.layout-sidebar-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--xj-content-bg);
}

.layout-header {
  height: var(--xj-header-height);
  background: var(--xj-header-bg);
  box-shadow: var(--xj-header-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 99;
  flex-shrink: 0;
}

.layout-header-left {
  display: flex;
  align-items: center;
}

.layout-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-collapse-btn {
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: var(--xj-color-primary);
  }
}

.layout-content {
  flex: 1;
  padding: var(--xj-content-padding);
  overflow-y: auto;
}
</style>
