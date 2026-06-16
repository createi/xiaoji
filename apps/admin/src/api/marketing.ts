import request from '@/utils/request';

// Coupon
export function getCouponList(params?: Record<string, any>) {
  return request.get('/marketing/coupon/list', { params });
}

export function getCouponDetail(id: number) {
  return request.get(`/marketing/coupon/${id}`);
}

export function createCoupon(data: Record<string, any>) {
  return request.post('/marketing/coupon', data);
}

export function updateCoupon(id: number, data: Record<string, any>) {
  return request.put(`/marketing/coupon/${id}`, data);
}

export function deleteCoupon(id: number) {
  return request.delete(`/marketing/coupon/${id}`);
}

// Seckill
export function getSeckillList(params?: Record<string, any>) {
  return request.get('/marketing/seckill/list', { params });
}

export function getSeckillDetail(id: number) {
  return request.get(`/marketing/seckill/${id}`);
}

export function createSeckill(data: Record<string, any>) {
  return request.post('/marketing/seckill', data);
}

export function updateSeckill(id: number, data: Record<string, any>) {
  return request.put(`/marketing/seckill/${id}`, data);
}

export function deleteSeckill(id: number) {
  return request.delete(`/marketing/seckill/${id}`);
}

// Combination
export function getCombinationList(params?: Record<string, any>) {
  return request.get('/marketing/combination/list', { params });
}

export function getCombinationDetail(id: number) {
  return request.get(`/marketing/combination/${id}`);
}

export function createCombination(data: Record<string, any>) {
  return request.post('/marketing/combination', data);
}

export function updateCombination(id: number, data: Record<string, any>) {
  return request.put(`/marketing/combination/${id}`, data);
}

export function deleteCombination(id: number) {
  return request.delete(`/marketing/combination/${id}`);
}

// Bargain
export function getBargainList(params?: Record<string, any>) {
  return request.get('/marketing/bargain/list', { params });
}

export function getBargainDetail(id: number) {
  return request.get(`/marketing/bargain/${id}`);
}

export function createBargain(data: Record<string, any>) {
  return request.post('/marketing/bargain', data);
}

export function updateBargain(id: number, data: Record<string, any>) {
  return request.put(`/marketing/bargain/${id}`, data);
}

export function deleteBargain(id: number) {
  return request.delete(`/marketing/bargain/${id}`);
}

// Integral
export function getIntegralList(params?: Record<string, any>) {
  return request.get('/marketing/integral/list', { params });
}

export function getIntegralDetail(id: number) {
  return request.get(`/marketing/integral/${id}`);
}

export function createIntegral(data: Record<string, any>) {
  return request.post('/marketing/integral', data);
}

export function updateIntegral(id: number, data: Record<string, any>) {
  return request.put(`/marketing/integral/${id}`, data);
}

export function deleteIntegral(id: number) {
  return request.delete(`/marketing/integral/${id}`);
}
