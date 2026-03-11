/** API 标准响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页请求 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 类型选择器值 */
export interface TypeSelectorValue {
  type: 'all' | 'include' | 'exclude';
  values: string[];
}

/** 下拉选项 */
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
