import request from '@/utils/request';

export function getDashboardData() {
  return request.get('/statistic/dashboard');
}

export function getTransactionStats(params?: Record<string, any>) {
  return request.get('/statistic/transaction', { params });
}

export function getProductStats(params?: Record<string, any>) {
  return request.get('/statistic/product', { params });
}

export function getUserStats(params?: Record<string, any>) {
  return request.get('/statistic/user', { params });
}
