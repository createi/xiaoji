const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
  header?: Record<string, string>;
  showLoading?: boolean;
}

function getToken(): string {
  return uni.getStorageSync('token') || '';
}

export function request<T = any>(options: RequestOptions): Promise<{ status: number; message: string; data: T }> {
  const { url, method = 'GET', data, params, header = {}, showLoading = false } = options;

  if (showLoading) {
    uni.showLoading({ title: '加载中...' });
  }

  // Build query string
  let fullUrl = `${BASE_URL}${url}`;
  if (params && Object.keys(params).length) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    if (qs) fullUrl += `?${qs}`;
  }

  const token = getToken();
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res) => {
        if (showLoading) uni.hideLoading();

        const statusCode = res.statusCode;
        const body = res.data as any;

        if (statusCode === 401) {
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.reLaunch({ url: '/pages/users/login/index' });
          reject(new Error('未登录'));
          return;
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
        } else {
          const msg = body?.message || '请求失败';
          uni.showToast({ title: msg, icon: 'none' });
          reject(new Error(msg));
        }
      },
      fail: (err) => {
        if (showLoading) uni.hideLoading();
        uni.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      },
    });
  });
}

export const get = <T = any>(url: string, params?: Record<string, any>) =>
  request<T>({ url, method: 'GET', params });

export const post = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'POST', data });

export const put = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'PUT', data });

export const del = <T = any>(url: string) =>
  request<T>({ url, method: 'DELETE' });
