import request from './request';
import type { ChannelApplyFormData, MaterialFormData, ReviewFormData, ReviewRecord, ExternalPlatformData, GrayMonitorData } from '../types/node';
import type { AppVersion } from '../types/app';

export function getChannelApplyData(nodeId: string): Promise<ChannelApplyFormData> {
  return request.get(`/nodes/${nodeId}/channel-apply`) as Promise<ChannelApplyFormData>;
}

export function submitChannelApply(nodeId: string, data: ChannelApplyFormData): Promise<void> {
  return request.post(`/nodes/${nodeId}/channel-apply`, data) as Promise<void>;
}

export function getReviewRecords(nodeId: string): Promise<ReviewRecord[]> {
  return request.get(`/nodes/${nodeId}/reviews`) as Promise<ReviewRecord[]>;
}

export function submitReview(nodeId: string, data: ReviewFormData): Promise<void> {
  return request.post(`/nodes/${nodeId}/reviews`, data) as Promise<void>;
}

export function getMaterialData(nodeId: string): Promise<MaterialFormData[]> {
  return request.get(`/nodes/${nodeId}/materials`) as Promise<MaterialFormData[]>;
}

export function submitMaterials(nodeId: string, data: MaterialFormData[]): Promise<void> {
  return request.post(`/nodes/${nodeId}/materials`, data) as Promise<void>;
}

export function getExternalData(nodeId: string): Promise<ExternalPlatformData> {
  return request.get(`/nodes/${nodeId}/external-data`) as Promise<ExternalPlatformData>;
}

export function getGrayMonitorData(nodeId: string): Promise<GrayMonitorData> {
  return request.get(`/nodes/${nodeId}/gray-monitor`) as Promise<GrayMonitorData>;
}

export function rejectNode(nodeId: string, targetNodeType: string, reason: string): Promise<void> {
  return request.post(`/nodes/${nodeId}/reject`, { targetNodeType, reason }) as Promise<void>;
}

export function advanceNode(nodeId: string): Promise<void> {
  return request.post(`/nodes/${nodeId}/advance`) as Promise<void>;
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const result = await request.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (result as { url: string }).url;
}

export function getAppVersions(appId: string): Promise<AppVersion[]> {
  return request.get(`/apps/${appId}/versions`) as Promise<AppVersion[]>;
}
