import request from '@/utils/request';

// Product
export function getProductList(params?: Record<string, any>) {
  return request.get('/product/list', { params });
}

export function getProductDetail(id: number) {
  return request.get(`/product/${id}`);
}

export function createProduct(data: Record<string, any>) {
  return request.post('/product', data);
}

export function updateProduct(id: number, data: Record<string, any>) {
  return request.put(`/product/${id}`, data);
}

export function deleteProduct(id: number) {
  return request.delete(`/product/${id}`);
}

export function updateProductStatus(id: number, data: { is_show: number }) {
  return request.put(`/product/${id}/status`, data);
}

// Category
export function getCategoryList(params?: Record<string, any>) {
  return request.get('/product/category/list', { params });
}

export function getCategoryAll() {
  return request.get('/product/category/all');
}

export function createCategory(data: Record<string, any>) {
  return request.post('/product/category', data);
}

export function updateCategory(id: number, data: Record<string, any>) {
  return request.put(`/product/category/${id}`, data);
}

export function deleteCategory(id: number) {
  return request.delete(`/product/category/${id}`);
}

// Reply
export function getReplyList(params?: Record<string, any>) {
  return request.get('/product/reply/list', { params });
}

export function replyToComment(id: number, data: { content: string }) {
  return request.post(`/product/reply/${id}/reply`, data);
}

export function deleteReply(id: number) {
  return request.delete(`/product/reply/${id}`);
}

// Label
export function getProductLabelList(params?: Record<string, any>) {
  return request.get('/product/label/list', { params });
}

export function getProductLabelAll() {
  return request.get('/product/label/all');
}

export function createProductLabel(data: Record<string, any>) {
  return request.post('/product/label', data);
}

export function updateProductLabel(id: number, data: Record<string, any>) {
  return request.put(`/product/label/${id}`, data);
}

export function deleteProductLabel(id: number) {
  return request.delete(`/product/label/${id}`);
}
