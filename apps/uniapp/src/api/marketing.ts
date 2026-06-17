import { get } from './request';

export function getSeckillList(params?: Record<string, any>) {
  return get('/marketing/seckill/list', params);
}

export function getSeckillDetail(id: number) {
  return get(`/marketing/seckill/${id}`);
}

export function getCombinationList(params?: Record<string, any>) {
  return get('/marketing/combination/list', params);
}

export function getCombinationDetail(id: number) {
  return get(`/marketing/combination/${id}`);
}

export function getBargainList(params?: Record<string, any>) {
  return get('/marketing/bargain/list', params);
}

export function getBargainDetail(id: number) {
  return get(`/marketing/bargain/${id}`);
}

export function getCouponList(params?: Record<string, any>) {
  return get('/marketing/coupon/list', params);
}
