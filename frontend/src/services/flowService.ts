import request from './request';
import type { FlowRecord, FlowListParams } from '../types/flow';
import type { PaginatedResult } from '../types/common';

export async function getFlowList(params: FlowListParams): Promise<PaginatedResult<FlowRecord>> {
  return request.get('/flows', { params });
}

export async function getFlowDetail(flowId: string): Promise<FlowRecord> {
  return request.get(`/flows/${flowId}`);
}

export async function createShuttle(type: 'monthly' | 'temporary'): Promise<FlowRecord> {
  return request.post('/flows', { type });
}
