import { get, put, post } from './request';

export function getUserDetail() {
  return get('/user/info');
}

export function updateUser(data: Record<string, any>) {
  return put('/user/info', data);
}

// Address
export function getAddressList() {
  return get('/user/address/list');
}

export function getAddressDetail(id: number) {
  return get(`/user/address/${id}`);
}

export function createAddress(data: Record<string, any>) {
  return post('/user/address', data);
}

export function updateAddress(id: number, data: Record<string, any>) {
  return put(`/user/address/${id}`, data);
}

export function deleteAddress(id: number) {
  return put(`/user/address/${id}`, { is_del: 1 });
}

// Sign
export function sign() {
  return post('/user/sign');
}

export function getSignList(params?: Record<string, any>) {
  return get('/user/sign/list', params);
}

// Integral
export function getIntegralList(params?: Record<string, any>) {
  return get('/user/bill/list', { type: 6, ...params });
}

// Bill
export function getBillList(params?: Record<string, any>) {
  return get('/user/bill/list', params);
}
