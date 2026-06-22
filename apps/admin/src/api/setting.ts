import request from '@/utils/request';

// Role
export function getRoleList(params?: Record<string, any>) {
  return request.get('/system/role/list', { params });
}

export function getRoleAll() {
  return request.get('/system/role/all');
}

export function getRoleDetail(id: number) {
  return request.get(`/system/role/${id}`);
}

export function createRole(data: Record<string, any>) {
  return request.post('/system/role', data);
}

export function updateRole(id: number, data: Record<string, any>) {
  return request.put(`/system/role/${id}`, data);
}

export function deleteRole(id: number) {
  return request.delete(`/system/role/${id}`);
}

// Menu
export function getMenuList(params?: Record<string, any>) {
  return request.get('/system/menu/list', { params });
}

export function getMenuAll() {
  return request.get('/system/menu/all');
}

export function createMenu(data: Record<string, any>) {
  return request.post('/system/menu', data);
}

export function updateMenu(id: number, data: Record<string, any>) {
  return request.put(`/system/menu/${id}`, data);
}

export function deleteMenu(id: number) {
  return request.delete(`/system/menu/${id}`);
}

// Shipping Template
export function getShippingTemplateList(params?: Record<string, any>) {
  return request.get('/shipping/template/list', { params });
}

export function getShippingTemplateDetail(id: number) {
  return request.get(`/shipping/template/${id}`);
}

export function createShippingTemplate(data: Record<string, any>) {
  return request.post('/shipping/template', data);
}

export function updateShippingTemplate(id: number, data: Record<string, any>) {
  return request.put(`/shipping/template/${id}`, data);
}

export function deleteShippingTemplate(id: number) {
  return request.delete(`/shipping/template/${id}`);
}

// Express
export function getExpressList(params?: Record<string, any>) {
  return request.get('/shipping/express/list', { params });
}

export function getExpressAll() {
  return request.get('/shipping/express/all');
}

export function getExpressDetail(id: number) {
  return request.get(`/shipping/express/${id}`);
}

export function createExpress(data: Record<string, any>) {
  return request.post('/shipping/express', data);
}

export function updateExpress(id: number, data: Record<string, any>) {
  return request.put(`/shipping/express/${id}`, data);
}

export function deleteExpress(id: number) {
  return request.delete(`/shipping/express/${id}`);
}

// System Config
export function getConfigTabs() {
  return request.get('/system/config/tabs');
}

export function getSystemConfig() {
  return request.get('/system/config');
}

export function getConfigByTabId(tabId: number) {
  return request.get(`/system/config/${tabId}`);
}

export function saveSystemConfig(data: Record<string, any>) {
  return request.post('/system/config', data);
}

// System Log
export function getSystemLogList(params?: Record<string, any>) {
  return request.get('/system/log', { params });
}

// Store
export function getStoreList(params?: Record<string, any>) {
  return request.get('/system/store/list', { params });
}

export function getStoreAll() {
  return request.get('/system/store/all');
}

export function getStoreDetail(id: number) {
  return request.get(`/system/store/${id}`);
}

export function createStore(data: Record<string, any>) {
  return request.post('/system/store', data);
}

export function updateStore(id: number, data: Record<string, any>) {
  return request.put(`/system/store/${id}`, data);
}

export function deleteStore(id: number) {
  return request.delete(`/system/store/${id}`);
}

// Staff
export function getStaffList(params?: Record<string, any>) {
  return request.get('/system/staff/list', { params });
}

export function createStaff(data: Record<string, any>) {
  return request.post('/system/staff', data);
}

export function updateStaff(id: number, data: Record<string, any>) {
  return request.put(`/system/staff/${id}`, data);
}

export function deleteStaff(id: number) {
  return request.delete(`/system/staff/${id}`);
}
