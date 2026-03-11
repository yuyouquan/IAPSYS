import type { FlowRecord } from '../../types/flow';

export const mockFlows: FlowRecord[] = [
  {
    id: 'FLOW-001', name: '3月班车', shuttleType: 'monthly',
    applicantId: 'U001', applicant: '张三', createdAt: '2026-03-01T12:00:00Z',
    statusSummary: { total: 6, success: 1, processing: 3, rejected: 2 },
  },
  {
    id: 'FLOW-002', name: '3月临时班车01', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '张三', createdAt: '2026-03-05T10:00:00Z',
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
  {
    id: 'FLOW-003', name: '2月班车', shuttleType: 'monthly',
    applicantId: 'U009', applicant: '钱十一', createdAt: '2026-02-01T08:00:00Z',
    statusSummary: { total: 8, success: 8, processing: 0, rejected: 0 },
  },
  {
    id: 'FLOW-004', name: '2月临时班车01', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '张三', createdAt: '2026-02-10T09:00:00Z',
    statusSummary: { total: 2, success: 1, processing: 0, rejected: 1 },
  },
  {
    id: 'FLOW-005', name: '1月班车', shuttleType: 'monthly',
    applicantId: 'U009', applicant: '钱十一', createdAt: '2026-01-01T10:00:00Z',
    statusSummary: { total: 10, success: 10, processing: 0, rejected: 0 },
  },
  {
    id: 'FLOW-006', name: '1月临时班车01', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '张三', createdAt: '2026-01-15T11:00:00Z',
    statusSummary: { total: 4, success: 3, processing: 0, rejected: 1 },
  },
  {
    id: 'FLOW-007', name: '1月临时班车02', shuttleType: 'temporary',
    applicantId: 'U009', applicant: '钱十一', createdAt: '2026-01-20T14:00:00Z',
    statusSummary: { total: 1, success: 0, processing: 1, rejected: 0 },
  },
  {
    id: 'FLOW-008', name: '3月临时班车02', shuttleType: 'temporary',
    applicantId: 'U009', applicant: '钱十一', createdAt: '2026-03-08T16:00:00Z',
    statusSummary: { total: 6, success: 1, processing: 4, rejected: 1 },
  },
];
