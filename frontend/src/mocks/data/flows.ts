import type { FlowRecord } from '../../types/flow';

export const mockFlows: FlowRecord[] = [
  {
    id: 'FLOW-001', name: '2026-3月班车', shuttleType: 'monthly',
    applicantId: 'U001', applicant: '付宇', createdAt: '2026-03-01T12:00:00Z', expiresAt: '2026-03-31',
    statusSummary: { total: 6, success: 1, processing: 3, rejected: 2 },
  },
  {
    id: 'FLOW-002', name: '2026-3月临时班车-紧急安全修复', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '付宇', createdAt: '2026-03-05T10:00:00Z', expiresAt: '2026-03-20',
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
  {
    id: 'FLOW-003', name: '2026-2月班车', shuttleType: 'monthly',
    applicantId: 'U002', applicant: '高明成', createdAt: '2026-02-01T08:00:00Z', expiresAt: '2026-02-28',
    statusSummary: { total: 8, success: 8, processing: 0, rejected: 0 },
  },
  {
    id: 'FLOW-004', name: '2026-2月临时班车-春节活动版本', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '付宇', createdAt: '2026-02-10T09:00:00Z', expiresAt: '2026-02-25',
    statusSummary: { total: 2, success: 1, processing: 0, rejected: 1 },
  },
  {
    id: 'FLOW-005', name: '2026-1月班车', shuttleType: 'monthly',
    applicantId: 'U002', applicant: '高明成', createdAt: '2026-01-01T10:00:00Z', expiresAt: '2026-01-31',
    statusSummary: { total: 10, success: 10, processing: 0, rejected: 0 },
  },
  {
    id: 'FLOW-006', name: '2026-1月临时班车-合规升级', shuttleType: 'temporary',
    applicantId: 'U001', applicant: '付宇', createdAt: '2026-01-15T11:00:00Z', expiresAt: '2026-01-30',
    statusSummary: { total: 4, success: 3, processing: 0, rejected: 1 },
  },
  {
    id: 'FLOW-007', name: '2026-1月临时班车-年度更新', shuttleType: 'temporary',
    applicantId: 'U002', applicant: '高明成', createdAt: '2026-01-20T14:00:00Z', expiresAt: '2026-01-31',
    statusSummary: { total: 1, success: 0, processing: 1, rejected: 0 },
  },
  {
    id: 'FLOW-008', name: '2026-3月临时班车-性能优化', shuttleType: 'temporary',
    applicantId: 'U002', applicant: '高明成', createdAt: '2026-03-08T16:00:00Z', expiresAt: '2026-04-15',
    statusSummary: { total: 6, success: 1, processing: 4, rejected: 1 },
  },
];
