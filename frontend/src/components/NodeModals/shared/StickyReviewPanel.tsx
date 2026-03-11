import React, { useState } from 'react';
import { Card, Radio, Input, Button, Tag, Space, Typography, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ReviewFormData, ReviewRecord } from '../../../types/node';

const { TextArea } = Input;
const { Text } = Typography;

interface StickyReviewPanelProps {
  title: string;
  reviews?: ReviewRecord[];
  onSubmit?: (data: ReviewFormData) => void;
  disabled?: boolean;
  counterSign?: boolean;
  counterSignReviewers?: Array<{ id: string; name: string }>;
}

const StickyReviewPanel: React.FC<StickyReviewPanelProps> = ({
  title,
  reviews = [],
  onSubmit,
  disabled = false,
  counterSign = false,
  counterSignReviewers = [],
}) => {
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!result) {
      message.warning('请选择审核结果');
      return;
    }
    if (result === 'rejected' && !comment.trim()) {
      message.warning('驳回时审核意见为必填');
      return;
    }
    onSubmit?.({ result, comment: comment || undefined });
    setResult(null);
    setComment('');
  };

  const getReviewerStatus = (reviewerId: string) => {
    const record = reviews.find((r) => r.reviewerId === reviewerId);
    if (!record || record.reviewResult === null) return 'pending';
    return record.reviewResult;
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: 16,
      }}
    >
      <Card size="small" title={title}>
        {counterSign && counterSignReviewers.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">会签审核人：</Text>
            <Space wrap style={{ marginTop: 4 }}>
              {counterSignReviewers.map((r) => {
                const status = getReviewerStatus(r.id);
                return (
                  <Tag
                    key={r.id}
                    icon={
                      status === 'approved' ? <CheckCircleOutlined /> :
                      status === 'rejected' ? <CloseCircleOutlined /> :
                      <ClockCircleOutlined />
                    }
                    color={
                      status === 'approved' ? 'success' :
                      status === 'rejected' ? 'error' :
                      'default'
                    }
                  >
                    {r.name}
                    {status === 'approved' ? ' 已通过' : status === 'rejected' ? ' 已拒绝' : ' 待审核'}
                  </Tag>
                );
              })}
            </Space>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 12 }}>审核结果：</Text>
          <Radio.Group value={result} onChange={(e) => setResult(e.target.value)} disabled={disabled}>
            <Radio value="approved">通过</Radio>
            <Radio value="rejected">不通过</Radio>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 12 }}>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder={result === 'rejected' ? '请输入驳回原因（必填）' : '请输入审核意见（选填）'}
            maxLength={500}
            showCount
            disabled={disabled}
          />
        </div>

        <Button type="primary" onClick={handleSubmit} disabled={disabled || !result}>
          提交审核
        </Button>
      </Card>
    </div>
  );
};

export default StickyReviewPanel;
