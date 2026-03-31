import { http, HttpResponse } from 'msw';
import { mockFlows } from '../data/flows';
import { mockApps } from '../data/apps';
import { getCurrentUser } from '../../stores/userStore';
import type { FlowRecord } from '../../types/flow';

/** 根据实际应用数据动态计算班车状态摘要 */
function computeStatusSummary(flowId: string) {
  const apps = mockApps.filter((a) => a.flowId === flowId);
  return {
    total: apps.length,
    success: apps.filter((a) => a.currentNodeStatus === 'completed' && a.currentNode === 'gray_monitor').length,
    processing: apps.filter((a) => a.currentNodeStatus === 'processing').length,
    rejected: apps.filter((a) => a.currentNodeStatus === 'rejected').length,
  };
}

export const flowHandlers = [
  http.get('/api/v1/flows', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const name = url.searchParams.get('name') || '';
    const status = url.searchParams.get('status') || '';

    // 动态计算每个班车的状态摘要
    let filtered = mockFlows.map((f) => ({
      ...f,
      statusSummary: computeStatusSummary(f.id),
    }));

    if (name) filtered = filtered.filter((f) => f.name.includes(name));
    if (status) {
      filtered = filtered.filter((f) => {
        if (status === 'processing') return f.statusSummary.processing > 0;
        if (status === 'completed') return f.statusSummary.success === f.statusSummary.total && f.statusSummary.total > 0;
        if (status === 'rejected') return f.statusSummary.rejected > 0;
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

  http.get('/api/v1/flows/:flowId', ({ params }) => {
    const flow = mockFlows.find((f) => f.id === params.flowId);
    if (!flow) return HttpResponse.json({ code: 404, message: '流程单不存在', data: null });
    return HttpResponse.json({
      code: 0, message: 'success',
      data: {
        ...flow,
        statusSummary: computeStatusSummary(flow.id),
      },
    });
  }),

  http.post('/api/v1/flows', async ({ request }) => {
    const body = await request.json() as { type: string; year: number; month: number; suffix?: string };
    const now = new Date();
    const year = body.year || now.getFullYear();
    const month = body.month || (now.getMonth() + 1);

    let name: string;
    if (body.type === 'monthly') {
      name = `${year}-${month}月班车`;
      const exists = mockFlows.some(f => f.name === name);
      if (exists) {
        return HttpResponse.json({ code: 1001, message: `${year}年${month}月班车已创建`, data: null });
      }
    } else {
      const suffix = body.suffix || '';
      name = `${year}-${month}月临时班车-${suffix}`;
    }

    // 检查名称唯一性
    const duplicate = mockFlows.some(f => f.name === name);
    if (duplicate) {
      return HttpResponse.json({ code: 1002, message: `班车名称「${name}」已存在，请更换名称`, data: null });
    }

    const newFlow: FlowRecord = {
      id: `FLOW-${Date.now()}`,
      name,
      shuttleType: body.type as FlowRecord['shuttleType'],
      applicantId: getCurrentUser().userId,
      applicant: getCurrentUser().name,
      createdAt: now.toISOString(),
      statusSummary: { total: 0, success: 0, processing: 0, rejected: 0 },
    };

    mockFlows.unshift(newFlow);
    return HttpResponse.json({ code: 0, message: 'success', data: newFlow });
  }),

  // 删除班车
  http.delete('/api/v1/flows/:flowId', ({ params }) => {
    const flowId = params.flowId as string;
    const idx = mockFlows.findIndex(f => f.id === flowId);
    if (idx === -1) {
      return HttpResponse.json({ code: 404, message: '班车不存在', data: null });
    }
    const flow = mockFlows[idx];
    if (flow.shuttleType !== 'temporary') {
      return HttpResponse.json({ code: 1003, message: '仅可删除临时班车', data: null });
    }
    mockFlows.splice(idx, 1);
    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),
];
