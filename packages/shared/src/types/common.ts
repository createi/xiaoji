// 分页请求
export interface PaginationParams {
  page: number;
  limit: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// API 统一响应
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// 排序
export type SortOrder = 'asc' | 'desc';

// 时间范围筛选
export interface DateRange {
  startDate: string;
  endDate: string;
}
