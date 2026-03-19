import request from './request';
import type { FeishuNotificationPayload } from '../types/notification';

export function sendFeishuNotification(payload: FeishuNotificationPayload): Promise<void> {
  return request.post('/notifications/feishu', payload) as Promise<void>;
}
