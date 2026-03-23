import { http, HttpResponse } from 'msw';
import type { NodeType } from '../../types/node';
import {
  mockChannelApplyData,
  mockMaterialData,
  mockReviewRecords,
  mockExternalData,
  mockGrayMonitorData,
} from '../data/nodeData';
import { mockApps } from '../data/apps';

/** 节点类型顺序，用于推进/回退 */
const NODE_TYPES: { type: NodeType; ownerName: string }[] = [
  { type: 'channel_apply',   ownerName: '张三' },   // 应用创建申请人
  { type: 'channel_review',  ownerName: '付宇' },   // 通道运营人员
  { type: 'material_upload', ownerName: '张三' },   // 应用创建申请人
  { type: 'material_review', ownerName: '付宇' },   // 通道运营人员
  { type: 'app_publish',     ownerName: '付宇' },   // 通道运营人员
  { type: 'biz_test',        ownerName: '付宇' },   // 通道运营人员
  { type: 'gray_monitor',    ownerName: '付宇' },   // 通道运营人员
];

/**
 * 从 nodeId 中解析出 appId 和节点序号
 * nodeId 格式: "APP-001-N001" → appId="APP-001", nodeIndex=1
 */
function parseNodeId(nodeId: string): { appId: string; nodeIndex: number } | null {
  const match = nodeId.match(/^(APP-\d+)-N(\d+)$/);
  if (match) {
    return { appId: match[1], nodeIndex: parseInt(match[2], 10) };
  }
  // 兼容旧格式 N001 → 默认 APP-001
  const legacyMatch = nodeId.match(/^N(\d+)$/);
  if (legacyMatch) {
    return { appId: 'APP-001', nodeIndex: parseInt(legacyMatch[1], 10) };
  }
  return null;
}

export const nodeHandlers = [
  // 获取通道发布申请数据
  http.get('/api/v1/nodes/:nodeId/channel-apply', ({ params }) => {
    const parsed = parseNodeId(params.nodeId as string);
    const data = parsed ? mockChannelApplyData[parsed.appId] : undefined;
    // 新建应用没有 channel-apply 数据时，从 mockApps 带入基本信息
    if (!data && parsed) {
      const app = mockApps.find(a => a.id === parsed.appId);
      if (app) {
        return HttpResponse.json({
          code: 0,
          message: 'success',
          data: {
            appName: app.appName,
            packageName: app.packageName,
            appType: app.appType,
          },
        });
      }
    }
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: data || null,
    });
  }),

  // 提交通道发布申请 → 保存数据到 mockChannelApplyData
  http.post('/api/v1/nodes/:nodeId/channel-apply', async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const parsed = parseNodeId(params.nodeId as string);
    if (parsed) {
      // 保存表单数据
      mockChannelApplyData[parsed.appId] = body as any;
      // 同步 versionCode 到 app 记录
      const app = mockApps.find(a => a.id === parsed.appId);
      if (app && body.versionCode) {
        app.versionCode = body.versionCode;
      }
    }
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),

  // 获取审核记录
  http.get('/api/v1/nodes/:nodeId/reviews', ({ params }) => {
    const nodeId = params.nodeId as string;
    const data = mockReviewRecords[nodeId] || [];
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data,
    });
  }),

  // 提交审核 → 保存记录到 mockReviewRecords
  http.post('/api/v1/nodes/:nodeId/reviews', async ({ params, request }) => {
    const nodeId = params.nodeId as string;
    const body = await request.json() as { result: string; comment?: string; ccUserIds?: string[] };
    // 初始化审核记录数组
    if (!mockReviewRecords[nodeId]) {
      mockReviewRecords[nodeId] = [];
    }
    // 判断审核类型
    const parsed = parseNodeId(nodeId);
    let reviewType: 'ops_review' | 'boss_sign' | 'material_review' = 'ops_review';
    if (parsed) {
      // N002 = channel_review, N004 = material_review
      if (parsed.nodeIndex === 4) {
        reviewType = 'material_review';
      } else if (body.comment?.startsWith('[业务负责人审核]')) {
        reviewType = 'boss_sign';
      }
    }
    const newRecord = {
      reviewId: `REV-${Date.now()}`,
      nodeId,
      reviewType,
      reviewerId: reviewType === 'boss_sign' ? `BOSS-00${mockReviewRecords[nodeId].filter(r => r.reviewType === 'boss_sign').length + 1}` : 'U002',
      reviewerName: reviewType === 'boss_sign' ? `业务负责人${String.fromCharCode(65 + mockReviewRecords[nodeId].filter(r => r.reviewType === 'boss_sign').length)}` : '李四',
      reviewResult: body.result as 'approved' | 'rejected',
      reviewComment: body.comment,
      reviewTime: new Date().toISOString(),
    };
    mockReviewRecords[nodeId].push(newRecord);
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),

  // 获取物料数据
  http.get('/api/v1/nodes/:nodeId/materials', ({ params }) => {
    const parsed = parseNodeId(params.nodeId as string);
    const data = parsed ? mockMaterialData[parsed.appId] : undefined;
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: data || [],
    });
  }),

  // 提交物料 → 保存数据到 mockMaterialData
  http.post('/api/v1/nodes/:nodeId/materials', async ({ params, request }) => {
    const body = await request.json() as any[];
    const parsed = parseNodeId(params.nodeId as string);
    if (parsed) {
      mockMaterialData[parsed.appId] = body;
    }
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),

  // 获取外部平台数据
  http.get('/api/v1/nodes/:nodeId/external-data', ({ params }) => {
    const nodeId = params.nodeId as string;
    const data = mockExternalData[nodeId] || null;
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data,
    });
  }),

  // 获取灰度监控数据
  http.get('/api/v1/nodes/:nodeId/gray-monitor', ({ params }) => {
    const nodeId = params.nodeId as string;
    const data = mockGrayMonitorData[nodeId] || null;
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data,
    });
  }),

  // 驳回节点 → 更新 mockApps 中的 currentNode/currentNodeStatus
  http.post('/api/v1/nodes/:nodeId/reject', async ({ params, request }) => {
    const body = await request.json() as { targetNodeType: string; reason: string };
    const parsed = parseNodeId(params.nodeId as string);
    if (parsed) {
      const app = mockApps.find(a => a.id === parsed.appId);
      if (app) {
        app.currentNode = body.targetNodeType as NodeType;
        app.currentNodeStatus = 'rejected';
        app.rejectReason = body.reason;
        // 更新 operator 为目标节点的负责人
        const targetNode = NODE_TYPES.find(n => n.type === body.targetNodeType);
        if (targetNode) {
          app.operator = targetNode.ownerName;
        }
      }
    }
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),

  // 推进节点 → 更新 mockApps 中的 currentNode 到下一个节点
  http.post('/api/v1/nodes/:nodeId/advance', ({ params }) => {
    const parsed = parseNodeId(params.nodeId as string);
    if (parsed) {
      const app = mockApps.find(a => a.id === parsed.appId);
      if (app) {
        const currentIdx = NODE_TYPES.findIndex(n => n.type === app.currentNode);
        if (currentIdx >= 0 && currentIdx < NODE_TYPES.length - 1) {
          // 推进到下一节点
          const nextNode = NODE_TYPES[currentIdx + 1];
          app.currentNode = nextNode.type;
          app.currentNodeStatus = 'processing';
          app.operator = nextNode.ownerName;
          app.rejectReason = undefined;
        } else if (currentIdx === NODE_TYPES.length - 1) {
          // 最后一个节点完成
          app.currentNodeStatus = 'completed';
          app.rejectReason = undefined;
        }
      }
    }
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),

  // 文件上传
  http.post('/api/v1/upload', () => {
    const fakeUrl = `https://cdn.transsion.com/uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: { url: fakeUrl },
    });
  }),
];
