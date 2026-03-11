import { http, HttpResponse } from 'msw';
import {
  mockChannelApplyData,
  mockMaterialData,
  mockReviewRecords,
  mockExternalData,
  mockGrayMonitorData,
} from '../data/nodeData';

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
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: data || null,
    });
  }),

  // 提交通道发布申请
  http.post('/api/v1/nodes/:nodeId/channel-apply', async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] Submit channel apply:', body);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
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

  // 提交审核
  http.post('/api/v1/nodes/:nodeId/reviews', async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] Submit review:', body);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
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

  // 提交物料
  http.post('/api/v1/nodes/:nodeId/materials', async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] Submit materials:', body);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
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

  // 驳回节点
  http.post('/api/v1/nodes/:nodeId/reject', async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] Reject node:', body);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
  }),

  // 推进节点
  http.post('/api/v1/nodes/:nodeId/advance', () => {
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
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
