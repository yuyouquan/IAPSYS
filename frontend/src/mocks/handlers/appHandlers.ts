import { http, HttpResponse } from 'msw';
import { mockApps } from '../data/apps';
import { mockAppVersions } from '../data/nodeData';
import type { AppRecord } from '../../types/app';
import type { NodeType, NodeStatus } from '../../types/node';

const NODE_TYPES: { type: NodeType; name: string; ownerId: string; ownerName: string }[] = [
  { type: 'channel_apply',   name: '通道发布申请', ownerId: 'U001', ownerName: '张三' },
  { type: 'channel_review',  name: '通道发布审核', ownerId: 'U002', ownerName: '李四' },
  { type: 'material_upload', name: '物料上传',     ownerId: 'U005', ownerName: '孙七' },
  { type: 'material_review', name: '物料审核',     ownerId: 'U002', ownerName: '李四' },
  { type: 'app_publish',     name: '应用上架',     ownerId: 'U006', ownerName: '周八' },
  { type: 'biz_test',        name: '业务内测',     ownerId: 'U007', ownerName: '吴九' },
  { type: 'gray_monitor',    name: '灰度监控',     ownerId: 'U008', ownerName: '郑十' },
];

/** 根据应用的当前节点和状态，推导出7个节点各自应有的状态 */
function buildProcessNodes(app: AppRecord) {
  const currentIdx = NODE_TYPES.findIndex((n) => n.type === app.currentNode);
  return NODE_TYPES.map((node, idx) => {
    let nodeStatus: NodeStatus;
    if (idx < currentIdx) {
      nodeStatus = 'completed';
    } else if (idx === currentIdx) {
      nodeStatus = app.currentNodeStatus;
    } else {
      nodeStatus = 'pending';
    }
    const nodeNum = String(idx + 1).padStart(3, '0');
    return {
      nodeId: `${app.id}-N${nodeNum}`,
      recordId: app.id,
      nodeType: node.type,
      nodeName: node.name,
      nodeStatus,
      ownerId: node.ownerId,
      ownerName: node.ownerName,
      collaborators: [],
      rejectReason: idx === currentIdx && app.currentNodeStatus === 'rejected' ? app.rejectReason : undefined,
      sortOrder: idx + 1,
    };
  });
}

export const appHandlers = [
  http.get('/api/v1/flows/:flowId/apps', ({ params, request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 8;
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status') || '';

    let filtered = mockApps.filter(a => a.flowId === params.flowId);
    if (keyword) {
      filtered = filtered.filter(a => a.appName.includes(keyword) || a.packageName.includes(keyword));
    }
    if (status) {
      filtered = filtered.filter(a => {
        if (status === 'success') return a.currentNodeStatus === 'completed' && a.currentNode === 'gray_monitor';
        if (status === 'rejected') return a.currentNodeStatus === 'rejected';
        if (status === 'processing') return a.currentNodeStatus === 'processing';
        return true;
      });
    }

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 0, message: 'success',
      data: { list, total: filtered.length, page, pageSize },
    });
  }),

  http.get('/api/v1/flows/:flowId/apps/:appId', ({ params }) => {
    const app = mockApps.find(a => a.id === params.appId && a.flowId === params.flowId);
    if (!app) return HttpResponse.json({ code: 404, message: '应用不存在', data: null });

    const processNodes = buildProcessNodes(app);

    return HttpResponse.json({
      code: 0, message: 'success',
      data: {
        ...app,
        overallStatus: app.currentNodeStatus === 'completed' && app.currentNode === 'gray_monitor' ? 'completed' : app.currentNodeStatus === 'rejected' ? 'failed' : 'processing',
        processNodes,
        operationLogs: [
          { logId: `${app.id}-LOG-001`, recordId: app.id, operationTime: '2026-03-01T14:00:00Z', operatorId: 'U001', operatorName: '张三', action: '添加应用', detail: `添加应用 ${app.appName}` },
          { logId: `${app.id}-LOG-002`, recordId: app.id, operationTime: '2026-03-01T15:00:00Z', operatorId: 'U001', operatorName: '张三', action: '提交通道发布申请', detail: '提交通道发布申请表单' },
          { logId: `${app.id}-LOG-003`, recordId: app.id, operationTime: '2026-03-02T10:00:00Z', operatorId: 'U002', operatorName: '李四', action: '运营审核通过', detail: '' },
        ],
      },
    });
  }),

  http.get('/api/v1/apps/:appId/versions', ({ params }) => {
    const appId = params.appId as string;
    const versions = mockAppVersions[appId] || [];
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: versions,
    });
  }),

  http.get('/api/v1/apps/available', () => {
    return HttpResponse.json({
      code: 0, message: 'success',
      data: [
        { id: 'AV-001', appIcon: '', appName: 'Weather Pro', packageName: 'com.transsion.weather', appType: 'Weather' },
        { id: 'AV-002', appIcon: '', appName: 'HiOS Launcher', packageName: 'com.transsion.launcher', appType: 'Entertainment' },
        { id: 'AV-003', appIcon: '', appName: 'Palm Store', packageName: 'com.transsion.store', appType: 'Shopping' },
        { id: 'AV-004', appIcon: '', appName: 'Smart Finance', packageName: 'com.transsion.finance', appType: 'Finance' },
        { id: 'AV-005', appIcon: '', appName: 'EDU Learn', packageName: 'com.transsion.edu', appType: 'Education' },
        { id: 'AV-006', appIcon: '', appName: 'Boomplay', packageName: 'com.transsion.boomplay', appType: 'Entertainment' },
        { id: 'AV-007', appIcon: '', appName: 'Phoenix Browser', packageName: 'com.transsion.browser', appType: 'Travel & Local' },
        { id: 'AV-008', appIcon: '', appName: 'CarlCare', packageName: 'com.transsion.carlcare', appType: 'Business' },
        { id: 'AV-009', appIcon: '', appName: 'Smart Health', packageName: 'com.transsion.health', appType: 'Medical' },
        { id: 'AV-010', appIcon: '', appName: 'Auto Drive', packageName: 'com.transsion.autodrive', appType: 'Auto & Vehicles' },
      ],
    });
  }),
];
