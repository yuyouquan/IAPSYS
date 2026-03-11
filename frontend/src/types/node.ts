import type { TypeSelectorValue } from './common';

export type NodeType =
  | 'channel_apply'
  | 'channel_review'
  | 'material_upload'
  | 'material_review'
  | 'app_publish'
  | 'biz_test'
  | 'gray_monitor';

export type NodeStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface ProcessNode {
  nodeId: string;
  recordId: string;
  nodeType: NodeType;
  nodeName: string;
  nodeStatus: NodeStatus;
  ownerId: string;
  ownerName: string;
  collaborators: Array<{ id: string; name: string }>;
  rejectReason?: string;
  startTime?: string;
  completeTime?: string;
  sortOrder: number;
}

export interface MaterialFormData {
  langCode: string;
  langName: string;
  appNameI18n: string;
  shortDesc: string;
  productDetail: string;
  updateNote: string;
  keywords: string[];
  iconUrl?: string;
  topImageUrl?: string;
  screenshotUrls: string[];
}

export interface ChannelApplyFormData {
  publishPurpose: string;
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  apkUrl: string;
  testReport?: string;
  appCategory: string;
  isSystemApp: boolean;
  publishCountry: TypeSelectorValue;
  publishBrand: TypeSelectorValue;
  publishModel: TypeSelectorValue;
  testModel: TypeSelectorValue;
  androidVersion: TypeSelectorValue;
  tosVersion: TypeSelectorValue;
  filterIndia: boolean;
  isPaUpdate: boolean;
  grayScale?: number;
  effectiveTimeRange?: [string, string];
  materials: MaterialFormData[];
  isGpPublish: boolean;
  gpLink?: string;
}

export interface ReviewFormData {
  result: 'approved' | 'rejected';
  comment?: string;
}

export interface ReviewRecord {
  reviewId: string;
  nodeId: string;
  reviewType: 'ops_review' | 'boss_sign' | 'material_review';
  reviewerId: string;
  reviewerName: string;
  reviewResult: 'approved' | 'rejected' | null;
  reviewComment?: string;
  reviewTime: string | null;
}

export interface OperationLog {
  logId: string;
  recordId: string;
  operationTime: string;
  operatorId: string;
  operatorName: string;
  action: string;
  detail?: string;
}

export interface ExternalPlatformData {
  status: '生效中' | '已停用';
  appName: string;
  taskName: string;
  packageName: string;
  publishCountry: string;
  brand: string;
  model: string;
  language: string;
  androidVersion: string;
  tosVersion: string;
  grayScale: number;
  category: string;
  effectiveTime: string;
}

export interface GrayMonitorData {
  appName: string;
  packageName: string;
  taskName: string;
  effectiveTime: string;
  grayScale: string;
  status: '已停用' | '进行中';
  createdAt: string;
}
