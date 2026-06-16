<template>
  <div class="search-form-wrap">
    <div class="search-form-content" :class="{ collapsed: !expanded }">
      <slot />
    </div>
    <div class="search-form-actions" v-if="hasMore">
      <a-button type="link" size="small" @click="expanded = !expanded">
        {{ expanded ? '收起' : '展开' }}
        <template #icon>
          <UpOutlined v-if="expanded" />
          <DownOutlined v-else />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue';

defineProps<{
  hasMore?: boolean;
}>();

const expanded = ref(true);
</script>

<style scoped lang="scss">
.search-form-wrap {
  background: var(--xj-bg-card);
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.search-form-content {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
    margin-right: 16px;
  }

  :deep(.ant-form-item-label > label) {
    font-size: 12px;
    color: var(--xj-text-secondary);
  }

  &.collapsed {
    max-height: 40px;
    overflow: hidden;
  }
}

.search-form-actions {
  text-align: right;
}
</style>
