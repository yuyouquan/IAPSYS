export type FeishuNotificationType =
  | 'shuttle_created'
  | 'channel_apply_submitted'
  | 'channel_review_ops_rejected'
  | 'channel_review_ops_approved'
  | 'channel_review_boss_rejected'
  | 'channel_review_all_approved'
  | 'material_upload_submitted'
  | 'material_review_rejected'
  | 'app_publish_result'
  | 'biz_test_failed'
  | 'biz_test_passed';

export interface FeishuNotificationPayload {
  type: FeishuNotificationType;
  shuttleName?: string;
  appName?: string;
  recipients: string[];
  ccList?: string[];
  extra?: Record<string, string>;
}
