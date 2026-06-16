import request from '@/utils/request';

export function getOrderList(params?: Record<string, any>) {
  return request.get('/order/list', { params });
}

export function getOrderDetail(id: number) {
  return request.get(`/order/${id}`);
}

export function updateOrder(id: number, data: Record<string, any>) {
  return request.put(`/order/${id}`, data);
}

export function shipOrder(id: number, data: { express_code: string; express_name: string; tracking_number: string }) {
  return request.put(`/order/${id}/ship`, data);
}

export function confirmOrder(id: number) {
  return request.put(`/order/${id}/confirm`);
}

export function cancelOrder(id: number) {
  return request.put(`/order/${id}/cancel`);
}

export function deleteOrder(id: number) {
  return request.delete(`/order/${id}`);
}
