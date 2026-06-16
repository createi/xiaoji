<template>
  <div class="stat-card">
    <div class="stat-card-icon" :style="{ background: color }">
      <component :is="icon" />
    </div>
    <div class="stat-card-info">
      <div class="stat-card-label">{{ label }}</div>
      <div class="stat-card-value font-mono">{{ value }}</div>
      <div class="stat-card-extra">
        <span>昨日 {{ prevValue }}</span>
        <span class="stat-card-rate" :class="rateClass" v-if="rate !== undefined">
          {{ rate > 0 ? '+' : '' }}{{ rate }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: number | string;
  prevValue?: number | string;
  rate?: number;
  color?: string;
  icon?: any;
}>();

const rateClass = computed(() => {
  if (!props.rate) return '';
  return props.rate > 0 ? 'up' : 'down';
});
</script>

<style scoped lang="scss">
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
  margin-left: 8px;
  font-family: 'Roboto', monospace;

  &.up {
    color: #f5222d;
  }

  &.down {
    color: #52c41a;
  }
}
</style>
