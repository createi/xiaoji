import { post, get } from './request';

export function login(data: { account: string; password: string }) {
  return post('/auth/user/login', data);
}

export function getUserInfo() {
  return get('/auth/user/info');
}

export function getCaptcha() {
  return get('/auth/captcha');
}
