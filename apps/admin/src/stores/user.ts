import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SystemAdmin } from '@xiaoji/shared';
import { getAdminInfo } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '');
  const userInfo = ref<SystemAdmin | null>(null);
  const permissions = ref<string[]>([]);
  const fetched = ref(false);

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

  async function fetchUserInfo() {
    if (fetched.value) return;
    try {
      const res = await getAdminInfo();
      const data = (res as any).data;
      if (data) {
        setUserInfo(data);
        fetched.value = true;
      }
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    permissions.value = [];
    fetched.value = false;
    localStorage.removeItem('token');
  }

  return {
    token,
    userInfo,
    permissions,
    fetched,
    setToken,
    setUserInfo,
    setPermissions,
    fetchUserInfo,
    logout,
  };
});
