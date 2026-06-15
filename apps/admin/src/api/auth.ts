import request from '@/utils/request';

export function adminLogin(data: { account: string; password: string; captcha: string; key: string }) {
  return request.post('/auth/admin/login', data);
}

export function adminLogout() {
  return request.post('/auth/admin/logout');
}

export function getAdminInfo() {
  return request.get('/auth/admin/info');
}

export function getCaptcha() {
  return request.get('/auth/captcha');
}
