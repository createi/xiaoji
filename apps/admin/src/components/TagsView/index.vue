<template>
  <div class="tags-view" ref="tagsViewRef">
    <div class="tags-view-list">
      <div
        v-for="tag in tagsViewList"
        :key="tag.path"
        class="tags-view-item"
        :class="{ active: route.path === tag.path }"
        @click="router.push(tag.path)"
        @contextmenu.prevent="openContextMenu($event, tag)"
      >
        {{ tag.title }}
        <CloseOutlined
          v-if="tag.path !== '/dashboard'"
          class="tags-view-close"
          @click.stop="closeTag(tag)"
        />
      </div>
    </div>

    <!-- Context menu -->
    <teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="tags-context-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      >
        <div class="context-menu-item" @click="closeCurrentTag">关闭</div>
        <div class="context-menu-item" @click="closeOtherTags">关闭其他</div>
        <div class="context-menu-item" @click="closeAllTags">关闭全部</div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const { tagsViewList } = storeToRefs(appStore);

const tagsViewRef = ref<HTMLElement>();
const contextMenu = ref({ visible: false, x: 0, y: 0, tag: null as any });

function addTag() {
  if (route.meta.hidden) return;
  appStore.addTag({
    path: route.path,
    title: (route.meta.title as string) || route.name as string,
  });
}

function closeTag(tag: any) {
  appStore.removeTag(tag.path);
  if (route.path === tag.path) {
    const lastTag = tagsViewList.value[tagsViewList.value.length - 1];
    if (lastTag) {
      router.push(lastTag.path);
    } else {
      router.push('/dashboard');
    }
  }
}

function openContextMenu(e: MouseEvent, tag: any) {
  contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, tag };
}

function closeCurrentTag() {
  if (contextMenu.value.tag) {
    closeTag(contextMenu.value.tag);
  }
  contextMenu.value.visible = false;
}

function closeOtherTags() {
  const tag = contextMenu.value.tag;
  if (tag) {
    appStore.setTagsViewList([tagsViewList.value.find((t) => t.path === '/dashboard')!, tag].filter(Boolean));
    if (route.path !== tag.path) {
      router.push(tag.path);
    }
  }
  contextMenu.value.visible = false;
}

function closeAllTags() {
  appStore.setTagsViewList([{ path: '/dashboard', title: '首页' }]);
  router.push('/dashboard');
  contextMenu.value.visible = false;
}

function handleClickOutside() {
  contextMenu.value.visible = false;
}

watch(() => route.path, addTag, { immediate: true });

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped lang="scss">
.tags-view {
  height: 34px;
  background: #fff;
  border-bottom: 1px solid var(--xj-border-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.tags-view-list {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  flex: 1;

  &::-webkit-scrollbar {
    height: 0;
  }
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--xj-text-secondary);
  background: #f4f4f5;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: var(--xj-color-primary);
  }

  &.active {
    color: #fff;
    background: var(--xj-color-primary);
  }
}

.tags-view-close {
  font-size: 10px;
  margin-left: 2px;

  &:hover {
    color: #fff;
  }
}
</style>

<style lang="scss">
.tags-context-menu {
  position: fixed;
  z-index: 2190;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 100px;

  .context-menu-item {
    padding: 6px 16px;
    font-size: 12px;
    color: var(--xj-text-primary);
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>
