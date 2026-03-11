import request from './request';
import type { PaginatedResult } from '../types/common';

export interface TodoItem {
  id: string;
  flowId: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: string;
  currentNodeName: string;
  currentNodeStatus: string;
  handler: string;
  rejectReason?: string;
  createdAt: string;
}

export async function getTodoList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}): Promise<PaginatedResult<TodoItem>> {
  return request.get('/todos', { params });
}

export async function getTodoCount(): Promise<number> {
  return request.get('/todos/count');
}
