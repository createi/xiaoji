import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SystemAdmin } from '@xiaoji/shared';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userInfo = ref<SystemAdmin | null>(null);
  const permissions = ref<string[]>([]);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function setUserInfo(info: SystemAdmin) {
    userInfo.value = info;
  }

  function setPermissions(perms: string[]) {
    permissions.value = perms;
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    permissions.value = [];
    localStorage.removeItem('token');
  }

  return {
    token,
    userInfo,
    permissions,
    setToken,
    setUserInfo,
    setPermissions,
    logout,
  };
});
