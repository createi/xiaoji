import request from '@/utils/request';

// Article
export function getArticleList(params?: Record<string, any>) {
  return request.get('/cms/article/list', { params });
}

export function getArticleDetail(id: number) {
  return request.get(`/cms/article/${id}`);
}

export function createArticle(data: Record<string, any>) {
  return request.post('/cms/article', data);
}

export function updateArticle(id: number, data: Record<string, any>) {
  return request.put(`/cms/article/${id}`, data);
}

export function deleteArticle(id: number) {
  return request.delete(`/cms/article/${id}`);
}

// Category
export function getCmsCategoryList(params?: Record<string, any>) {
  return request.get('/cms/category/list', { params });
}

export function getCmsCategoryDetail(id: number) {
  return request.get(`/cms/category/${id}`);
}

export function createCmsCategory(data: Record<string, any>) {
  return request.post('/cms/category', data);
}

export function updateCmsCategory(id: number, data: Record<string, any>) {
  return request.put(`/cms/category/${id}`, data);
}

export function deleteCmsCategory(id: number) {
  return request.delete(`/cms/category/${id}`);
}
