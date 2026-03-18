import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    // 非 JSON 响应直接返回
    if (typeof response.data !== 'object' || response.data === null) {
      return response.data;
    }
    const { code, message: msg, data } = response.data;
    if (code !== undefined && code !== 0) {
      message.error(msg || '操作失败');
      return Promise.reject(new Error(msg));
    }
    return data !== undefined ? data : response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
    } else if (error.response?.status === 403) {
      message.error('没有操作权限');
    } else {
      message.error('网络异常，请稍后重试');
    }
    return Promise.reject(error);
  }
);

export default request;
