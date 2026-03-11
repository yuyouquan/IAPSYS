import request from './request';
import type { AppRecord, AppDetail, AppListParams, AvailableApp, AppVersion } from '../types/app';
import type { PaginatedResult } from '../types/common';

export async function getAppList(flowId: string, params: AppListParams): Promise<PaginatedResult<AppRecord>> {
  return request.get(`/flows/${flowId}/apps`, { params });
}

export async function getAppDetail(flowId: string, appId: string): Promise<AppDetail> {
  return request.get(`/flows/${flowId}/apps/${appId}`);
}

export async function addApps(flowId: string, appIds: string[]): Promise<void> {
  return request.post(`/flows/${flowId}/apps`, { appIds });
}

export async function getAvailableApps(keyword?: string): Promise<AvailableApp[]> {
  return request.get('/apps/available', { params: { keyword } });
}

export async function getAppVersions(appId: string, flowId?: string): Promise<AppVersion[]> {
  return request.get(`/apps/${appId}/versions`, { params: { flowId } });
}
