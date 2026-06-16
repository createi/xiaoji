<template>
  <div class="page-header">
    <div class="page-header-left">
      <h3 class="page-header-title">{{ title }}</h3>
      <p v-if="description" class="page-header-desc">{{ description }}</p>
    </div>
    <div class="page-header-right">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  background: var(--xj-bg-card);
  padding: 16px;
  border-radius: 6px;
}

.page-header-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--xj-text-primary);
  margin: 0;
  line-height: 1;
}

.page-header-desc {
  font-size: 12px;
  color: var(--xj-text-secondary);
  margin: 4px 0 0;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
