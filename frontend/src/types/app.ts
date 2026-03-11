import type { PaginationParams } from './common';
import type { NodeType, NodeStatus, ProcessNode, OperationLog } from './node';

export type OverallStatus = 'processing' | 'completed' | 'failed';

export interface AppRecord {
  id: string;
  flowId: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  currentNode: NodeType;
  currentNodeStatus: NodeStatus;
  operator: string;
  rejectReason?: string;
  createdAt: string;
}

export interface AppDetail extends AppRecord {
  overallStatus: OverallStatus;
  processNodes: ProcessNode[];
  operationLogs: OperationLog[];
}

export interface AppListParams extends PaginationParams {
  keyword?: string;
  status?: string;
}

export interface AvailableApp {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
}

export interface AppVersion {
  versionCode: string;
  versionName: string;
  apkUrl: string;
  apkSize: number;
  buildTime: string;
  isUsedInCurrentFlow?: boolean;
}
