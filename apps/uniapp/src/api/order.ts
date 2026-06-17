import { get, post, put } from './request';

export function createOrder(data: Record<string, any>) {
  return post('/order', data);
}

export function getOrderList(params?: Record<string, any>) {
  return get('/order/list', params);
}

export function getOrderDetail(id: number) {
  return get(`/order/${id}`);
}

export function cancelOrder(id: number) {
  return put(`/order/${id}/cancel`);
}

export function confirmOrder(id: number) {
  return put(`/order/${id}/confirm`);
}

// Cart
export function getCartList() {
  return get('/order/cart/list');
}

export function addCart(data: { product_id: number; product_attr_unique: string; cart_num: number }) {
  return post('/order/cart', data);
}

export function updateCart(id: number, data: { cart_num: number }) {
  return put(`/order/cart/${id}`, data);
}

export function deleteCart(ids: number[]) {
  return post('/order/cart/delete', { ids });
}
