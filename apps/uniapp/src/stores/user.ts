import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '');
  const userInfo = ref<any>(uni.getStorageSync('userInfo') || null);

  const isLogin = computed(() => !!token.value);
  const nickname = computed(() => userInfo.value?.nickname || '未登录');
  const avatar = computed(() => userInfo.value?.avatar || '');

  function setToken(val: string) {
    token.value = val;
    uni.setStorageSync('token', val);
  }

  function setUserInfo(val: any) {
    userInfo.value = val;
    uni.setStorageSync('userInfo', val);
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
  }

  return { token, userInfo, isLogin, nickname, avatar, setToken, setUserInfo, logout };
});
