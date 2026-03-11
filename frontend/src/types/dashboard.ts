import type { OverallStatus } from './app';
import type { NodeStatus } from './node';

export interface ShuttleViewItem {
  shuttleId: string;
  shuttleName: string;
  month: string;
  products: string[];
  productCount: number;
  completionRate: number;
  statusSummary: {
    total: number;
    success: number;
    processing: number;
    rejected: number;
  };
}

export interface ProductViewItem {
  appId: string;
  appName: string;
  appIcon: string;
  publishCount: number;
  records: Array<{
    flowId: string;
    shuttleName: string;
    versionCode: string;
    status: OverallStatus;
    currentNode: string;
  }>;
}

export interface StatusViewItem {
  processing: StatusViewCard[];
  completed: StatusViewCard[];
  failed: StatusViewCard[];
}

export interface StatusViewCard {
  appId: string;
  appName: string;
  appIcon: string;
  flowId: string;
  shuttleName: string;
  currentNode: string;
  currentNodeStatus: NodeStatus;
  updatedAt: string;
}
