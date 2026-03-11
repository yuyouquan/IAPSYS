import type { PaginationParams } from './common';

export type ShuttleType = 'monthly' | 'temporary';

export interface FlowRecord {
  id: string;
  name: string;
  shuttleType: ShuttleType;
  applicantId: string;
  applicant: string;
  createdAt: string;
  statusSummary: {
    total: number;
    success: number;
    processing: number;
    rejected: number;
  };
}

export interface FlowListParams extends PaginationParams {
  name?: string;
  applicant?: string;
  status?: string;
  dateRange?: [string, string];
}
