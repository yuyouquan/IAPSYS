export interface MockTodoItem {
  id: string;
  flowId: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: string;
  currentNodeName: string;
  currentNodeStatus: string;
  handler: string;
  rejectReason?: string;
  createdAt: string;
}

export const mockTodos: MockTodoItem[] = [
  {
    id: 'TODO-001', flowId: 'FLOW-001', appId: 'APP-002',
    shuttleName: '3月班车', appName: 'HiOS Launcher',
    currentNode: 'channel_review', currentNodeName: '通道发布审核',
    currentNodeStatus: 'processing', handler: '李四',
    createdAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'TODO-002', flowId: 'FLOW-001', appId: 'APP-003',
    shuttleName: '3月班车', appName: 'Palm Store',
    currentNode: 'material_upload', currentNodeName: '物料上传',
    currentNodeStatus: 'rejected', handler: '张三',
    rejectReason: '物料审核不通过：应用截图尺寸不符合要求',
    createdAt: '2026-03-06T08:00:00Z',
  },
  {
    id: 'TODO-003', flowId: 'FLOW-001', appId: 'APP-004',
    shuttleName: '3月班车', appName: 'Smart Finance',
    currentNode: 'biz_test', currentNodeName: '业务内测',
    currentNodeStatus: 'processing', handler: '吴九',
    createdAt: '2026-03-07T10:00:00Z',
  },
  {
    id: 'TODO-004', flowId: 'FLOW-001', appId: 'APP-006',
    shuttleName: '3月班车', appName: 'Smart Health',
    currentNode: 'app_publish', currentNodeName: '应用上架',
    currentNodeStatus: 'processing', handler: '周八',
    createdAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'TODO-005', flowId: 'FLOW-002', appId: 'APP-007',
    shuttleName: '3月临时班车01', appName: 'Boomplay',
    currentNode: 'channel_apply', currentNodeName: '通道发布申请',
    currentNodeStatus: 'processing', handler: '张三',
    createdAt: '2026-03-05T10:30:00Z',
  },
];
