import { get } from './request';

export function getProductList(params?: Record<string, any>) {
  return get('/product/list', params);
}

export function getProductDetail(id: number) {
  return get(`/product/${id}`);
}

export function getCategoryList() {
  return get('/product/category/all');
}

export function getReplyList(productId: number, params?: Record<string, any>) {
  return get(`/product/reply/list`, { product_id: productId, ...params });
}
