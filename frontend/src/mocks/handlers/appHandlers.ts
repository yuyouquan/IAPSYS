import { http, HttpResponse } from 'msw';
import { mockApps } from '../data/apps';
import { mockAppVersions } from '../data/nodeData';
import { currentUser } from '../data/users';
import type { AppRecord } from '../../types/app';
import type { NodeType, NodeStatus } from '../../types/node';

const NODE_TYPES: { type: NodeType; name: string; ownerId: string; ownerName: string }[] = [
  { type: 'channel_apply',   name: '通道发布申请', ownerId: 'U005', ownerName: '张三' },   // 应用创建申请人
  { type: 'channel_review',  name: '通道发布审核', ownerId: 'U001', ownerName: '付宇' },   // 通道运营人员
  { type: 'material_upload', name: '物料上传',     ownerId: 'U005', ownerName: '张三' },   // 应用创建申请人
  { type: 'material_review', name: '物料审核',     ownerId: 'U001', ownerName: '付宇' },   // 通道运营人员
  { type: 'app_publish',     name: '应用上架',     ownerId: 'U001', ownerName: '付宇' },   // 通道运营人员
  { type: 'biz_test',        name: '业务内测',     ownerId: 'U001', ownerName: '付宇' },   // 通道运营人员
  { type: 'gray_monitor',    name: '灰度监控',     ownerId: 'U001', ownerName: '付宇' },   // 通道运营人员
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

    // 按创建时间倒序，最新添加的排在最前面
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 0, message: 'success',
      data: { list, total: filtered.length, page, pageSize },
    });
  }),

  http.post('/api/v1/flows/:flowId/apps', async ({ params, request }) => {
    const body = await request.json() as { appIds: string[] };
    const flowId = params.flowId as string;
    const availableApps = [
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
    ];
    const appIds = body?.appIds || [];
    for (const appId of appIds) {
      const available = availableApps.find(a => a.id === appId);
      if (available) {
        const newId = `APP-${String(mockApps.length + 1).padStart(3, '0')}`;
        mockApps.push({
          id: newId,
          flowId,
          appIcon: available.appIcon,
          appName: available.appName,
          packageName: available.packageName,
          appType: available.appType,
          versionCode: '',
          currentNode: 'channel_apply',
          currentNodeStatus: 'processing',
          operator: currentUser.name,
          createdAt: new Date().toISOString(),
        });
      }
    }
    return HttpResponse.json({
      code: 0, message: 'success',
      data: null,
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
    let versions = mockAppVersions[appId];

    // 对新添加的应用自动生成 mock 版本数据
    if (!versions) {
      const app = mockApps.find(a => a.id === appId);
      if (app) {
        const pkg = app.packageName.split('.').pop() || 'app';
        versions = [
          { versionCode: 'v1.0.0', versionName: '1.0.0', apkUrl: `https://cdn.transsion.com/apk/${pkg}-1.0.0.apk`, apkSize: 30000000, buildTime: new Date().toISOString(), isUsedInCurrentFlow: false },
          { versionCode: 'v0.9.0', versionName: '0.9.0', apkUrl: `https://cdn.transsion.com/apk/${pkg}-0.9.0.apk`, apkSize: 28000000, buildTime: '2026-02-15T10:00:00Z', isUsedInCurrentFlow: false },
          { versionCode: 'v0.8.0', versionName: '0.8.0', apkUrl: `https://cdn.transsion.com/apk/${pkg}-0.8.0.apk`, apkSize: 26000000, buildTime: '2026-01-20T10:00:00Z', isUsedInCurrentFlow: false },
        ];
        mockAppVersions[appId] = versions;
      }
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: versions || [],
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
