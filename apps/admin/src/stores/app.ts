import { defineStore } from 'pinia';
import { ref } from 'vue';

interface TagView {
  path: string;
  title: string;
}

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false);
  const theme = ref<'light' | 'dark'>('light');
  const tagsViewList = ref<TagView[]>([{ path: '/dashboard', title: '首页' }]);

  function toggleCollapsed() {
    collapsed.value = !collapsed.value;
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme;
  }

  function addTag(tag: TagView) {
    if (!tagsViewList.value.find((t) => t.path === tag.path)) {
      tagsViewList.value.push(tag);
    }
  }

  function removeTag(path: string) {
    tagsViewList.value = tagsViewList.value.filter((t) => t.path !== path);
  }

  function setTagsViewList(list: TagView[]) {
    tagsViewList.value = list;
  }

  return {
    collapsed,
    theme,
    tagsViewList,
    toggleCollapsed,
    setTheme,
    addTag,
    removeTag,
    setTagsViewList,
  };
});
