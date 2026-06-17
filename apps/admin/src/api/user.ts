import request from '@/utils/request';

// User
export function getUserList(params?: Record<string, any>) {
  return request.get('/user/list', { params });
}

export function getUserDetail(uid: number) {
  return request.get(`/user/${uid}`);
}

export function updateUser(uid: number, data: Record<string, any>) {
  return request.put(`/user/${uid}`, data);
}

export function deleteUser(uid: number) {
  return request.delete(`/user/${uid}`);
}

export function setUserLevel(uid: number, data: { level_id: number }) {
  return request.put(`/user/${uid}/level`, data);
}

export function setUserGroup(uid: number, data: { group_id: number }) {
  return request.put(`/user/${uid}/group`, data);
}

// Level
export function getUserLevelList(params?: Record<string, any>) {
  return request.get('/user/level/list', { params });
}

export function getUserLevelAll() {
  return request.get('/user/level/all');
}

export function createUserLevel(data: Record<string, any>) {
  return request.post('/user/level', data);
}

export function updateUserLevel(id: number, data: Record<string, any>) {
  return request.put(`/user/level/${id}`, data);
}

export function deleteUserLevel(id: number) {
  return request.delete(`/user/level/${id}`);
}

// Group
export function getUserGroupList(params?: Record<string, any>) {
  return request.get('/user/group/list', { params });
}

export function getUserGroupAll() {
  return request.get('/user/group/all');
}

export function createUserGroup(data: Record<string, any>) {
  return request.post('/user/group', data);
}

export function updateUserGroup(id: number, data: Record<string, any>) {
  return request.put(`/user/group/${id}`, data);
}

export function deleteUserGroup(id: number) {
  return request.delete(`/user/group/${id}`);
}

// Label
export function getUserLabelList(params?: Record<string, any>) {
  return request.get('/user/label/list', { params });
}

export function getUserLabelAll() {
  return request.get('/user/label/all');
}

export function createUserLabel(data: Record<string, any>) {
  return request.post('/user/label', data);
}

export function updateUserLabel(id: number, data: Record<string, any>) {
  return request.put(`/user/label/${id}`, data);
}

export function deleteUserLabel(id: number) {
  return request.delete(`/user/label/${id}`);
}

// Address
export function getUserAddressList(params?: Record<string, any>) {
  return request.get('/user/address/list', { params });
}

export function getUserAddresses(uid: number) {
  return request.get(`/user/address/user/${uid}`);
}

// Detail
export function getUserLevelDetail(id: number) {
  return request.get(`/user/level/${id}`);
}

export function getUserGroupDetail(id: number) {
  return request.get(`/user/group/${id}`);
}

export function getUserLabelDetail(id: number) {
  return request.get(`/user/label/${id}`);
}
