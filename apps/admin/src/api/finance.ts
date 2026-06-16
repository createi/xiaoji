import request from '@/utils/request';

// Bill (balance)
export function getBillList(params?: Record<string, any>) {
  return request.get('/finance/bill/list', { params });
}

export function getBillDetail(id: number) {
  return request.get(`/finance/bill/${id}`);
}

// Extract (withdrawal)
export function getExtractList(params?: Record<string, any>) {
  return request.get('/finance/extract/list', { params });
}

export function getExtractDetail(id: number) {
  return request.get(`/finance/extract/${id}`);
}

export function auditExtract(id: number, data: { status: number; reason?: string }) {
  return request.put(`/finance/extract/${id}/audit`, data);
}
