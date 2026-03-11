import type { AppRecord } from '../../types/app';

export const mockApps: AppRecord[] = [
  {
    id: 'APP-001', flowId: 'FLOW-001', appIcon: '', appName: 'Weather Pro',
    packageName: 'com.transsion.weather', appType: 'Weather', versionCode: 'v2.1.0',
    currentNode: 'gray_monitor', currentNodeStatus: 'completed', operator: '郑十',
    createdAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'APP-002', flowId: 'FLOW-001', appIcon: '', appName: 'HiOS Launcher',
    packageName: 'com.transsion.launcher', appType: 'Entertainment', versionCode: 'v5.0.1',
    currentNode: 'channel_review', currentNodeStatus: 'processing', operator: '李四',
    createdAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'APP-003', flowId: 'FLOW-001', appIcon: '', appName: 'Palm Store',
    packageName: 'com.transsion.store', appType: 'Shopping', versionCode: 'v3.2.0',
    currentNode: 'material_upload', currentNodeStatus: 'rejected', operator: '张三',
    rejectReason: '物料审核不通过：应用截图尺寸不符合要求，请修改后重新提交',
    createdAt: '2026-03-01T16:00:00Z',
  },
  {
    id: 'APP-004', flowId: 'FLOW-001', appIcon: '', appName: 'Smart Finance',
    packageName: 'com.transsion.finance', appType: 'Finance', versionCode: 'v1.5.0',
    currentNode: 'biz_test', currentNodeStatus: 'processing', operator: '吴九',
    createdAt: '2026-03-03T11:00:00Z',
  },
  {
    id: 'APP-005', flowId: 'FLOW-001', appIcon: '', appName: 'EDU Learn',
    packageName: 'com.transsion.edu', appType: 'Education', versionCode: 'v4.0.0',
    currentNode: 'channel_apply', currentNodeStatus: 'rejected', operator: '张三',
    rejectReason: '通道发布审核不通过：版本号与已上架版本冲突',
    createdAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'APP-006', flowId: 'FLOW-001', appIcon: '', appName: 'Smart Health',
    packageName: 'com.transsion.health', appType: 'Medical', versionCode: 'v1.0.0',
    currentNode: 'app_publish', currentNodeStatus: 'processing', operator: '周八',
    createdAt: '2026-03-05T09:00:00Z',
  },
  {
    id: 'APP-007', flowId: 'FLOW-002', appIcon: '', appName: 'Boomplay',
    packageName: 'com.transsion.boomplay', appType: 'Entertainment', versionCode: 'v8.0.0',
    currentNode: 'channel_apply', currentNodeStatus: 'processing', operator: '张三',
    createdAt: '2026-03-05T10:30:00Z',
  },
  {
    id: 'APP-008', flowId: 'FLOW-002', appIcon: '', appName: 'Phoenix Browser',
    packageName: 'com.transsion.browser', appType: 'Travel & Local', versionCode: 'v6.2.0',
    currentNode: 'material_review', currentNodeStatus: 'processing', operator: '李四',
    createdAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 'APP-009', flowId: 'FLOW-002', appIcon: '', appName: 'CarlCare',
    packageName: 'com.transsion.carlcare', appType: 'Business', versionCode: 'v3.5.0',
    currentNode: 'channel_review', currentNodeStatus: 'processing', operator: '李四',
    createdAt: '2026-03-05T11:30:00Z',
  },
];
