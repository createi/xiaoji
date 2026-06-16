<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { computed } from 'vue';

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#0256ff',
    borderRadius: 4,
    fontSize: 12,
  },
}));
</script>
