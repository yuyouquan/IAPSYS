import request from './request';
import type { FlowRecord, FlowListParams } from '../types/flow';
import type { PaginatedResult } from '../types/common';

export async function getFlowList(params: FlowListParams): Promise<PaginatedResult<FlowRecord>> {
  return request.get('/flows', { params });
}

export async function getFlowDetail(flowId: string): Promise<FlowRecord> {
  return request.get(`/flows/${flowId}`);
}

export async function createShuttle(type: 'monthly' | 'temporary', year: number, month: number, suffix?: string, expiresAt?: string): Promise<FlowRecord> {
  return request.post('/flows', { type, year, month, suffix, expiresAt });
}

export async function deleteShuttle(flowId: string): Promise<void> {
  return request.delete(`/flows/${flowId}`);
}
