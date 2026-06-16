import request from '@/utils/request';

// Level
export function getAgentLevelList(params?: Record<string, any>) {
  return request.get('/agent/level/list', { params });
}

export function getAgentLevelAll() {
  return request.get('/agent/level/all');
}

export function getAgentLevelDetail(id: number) {
  return request.get(`/agent/level/${id}`);
}

export function createAgentLevel(data: Record<string, any>) {
  return request.post('/agent/level', data);
}

export function updateAgentLevel(id: number, data: Record<string, any>) {
  return request.put(`/agent/level/${id}`, data);
}

export function deleteAgentLevel(id: number) {
  return request.delete(`/agent/level/${id}`);
}

// Apply
export function getAgentApplyList(params?: Record<string, any>) {
  return request.get('/agent/apply/list', { params });
}

export function getAgentApplyDetail(id: number) {
  return request.get(`/agent/apply/${id}`);
}

export function approveAgentApply(id: number) {
  return request.put(`/agent/apply/${id}/approve`);
}

export function rejectAgentApply(id: number) {
  return request.put(`/agent/apply/${id}/reject`);
}
