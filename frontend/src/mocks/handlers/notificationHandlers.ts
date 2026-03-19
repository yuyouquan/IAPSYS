import { http, HttpResponse } from 'msw';
import type { FeishuNotificationPayload } from '../../types/notification';
import { mockUsers } from '../data/users';

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  shuttle_created: '班车创建通知',
  channel_apply_submitted: '通道发布申请提交通知',
  channel_review_ops_rejected: '运营审核驳回通知',
  channel_review_ops_approved: '运营审核通过通知',
  channel_review_boss_rejected: '老板审核驳回通知',
  channel_review_all_approved: '老板会签全部通过通知',
  material_upload_submitted: '物料上传提交通知',
  material_review_rejected: '物料审核驳回通知',
  app_publish_result: '应用上架结果通知',
  biz_test_failed: '业务内测失败通知',
  biz_test_passed: '业务内测通过通知',
};

function getUserNames(userIds: string[]): string[] {
  return userIds.map(id => {
    const user = mockUsers.find(u => u.userId === id);
    return user ? user.name : id;
  });
}

export const notificationHandlers = [
  http.post('/api/v1/notifications/feishu', async ({ request }) => {
    const body = await request.json() as FeishuNotificationPayload;
    const label = NOTIFICATION_TYPE_LABELS[body.type] || body.type;
    const recipientNames = getUserNames(body.recipients);
    const ccNames = body.ccList ? getUserNames(body.ccList) : [];

    console.log(
      `[飞书通知] ${label}`,
      `\n  班车: ${body.shuttleName || '-'}`,
      `\n  应用: ${body.appName || '-'}`,
      `\n  接收人: ${recipientNames.join(', ')}`,
      ccNames.length > 0 ? `\n  抄送: ${ccNames.join(', ')}` : '',
      body.extra ? `\n  附加信息: ${JSON.stringify(body.extra)}` : '',
    );

    return HttpResponse.json({ code: 0, message: 'success', data: null });
  }),
];
