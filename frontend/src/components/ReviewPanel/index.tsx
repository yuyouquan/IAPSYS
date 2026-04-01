import React, { useState } from 'react';
import { Form, Radio, Input, Button, List, Tag, Space, Divider, Avatar } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { ReviewRecord } from '../../types/node';
import dayjs from 'dayjs';

interface ReviewPanelProps {
  reviews?: ReviewRecord[];
  onSubmit: (action: 'approve' | 'reject', comment: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ reviews = [], onSubmit, loading, disabled }) => {
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(action, comment);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(241,245,249,0.40) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.30)',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        padding: 16,
      }}
    >
      {reviews.length > 0 && (
        <>
          <Divider>审核记录</Divider>
          <List
            dataSource={reviews}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} size="small" />}
                  title={
                    <Space>
                      <span>{item.reviewerName}</span>
                      {item.reviewResult === 'approved' ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>通过</Tag>
                      ) : (
                        <Tag color="error" icon={<CloseCircleOutlined />}>拒绝</Tag>
                      )}
                      <span style={{ fontSize: 12, color: '#6B7280' }}>
                        {item.reviewTime ? dayjs(item.reviewTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                      </span>
                    </Space>
                  }
                  description={item.reviewComment || '无备注'}
                />
              </List.Item>
            )}
          />
        </>
      )}

      {!disabled && (
        <>
          <Divider>审核操作</Divider>
          <Form layout="vertical">
            <Form.Item label="审核结果">
              <Radio.Group value={action} onChange={(e) => setAction(e.target.value)}>
                <Radio value="approve">
                  <Tag color="success">通过</Tag>
                </Radio>
                <Radio value="reject">
                  <Tag color="error">拒绝</Tag>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="审核意见">
              <Input.TextArea
                rows={3}
                placeholder={action === 'reject' ? '请填写拒绝原因（必填）' : '审核意见（选填）'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                danger={action === 'reject'}
                onClick={handleSubmit}
                loading={loading}
                disabled={action === 'reject' && !comment.trim()}
              >
                {action === 'approve' ? '确认通过' : '确认拒绝'}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ReviewPanel;
