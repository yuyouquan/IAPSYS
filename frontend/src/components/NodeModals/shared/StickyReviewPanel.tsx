import React, { useState } from 'react';
import { Card, Radio, Input, Button, Tag, Space, Typography, Select, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ReviewFormData, ReviewRecord } from '../../../types/node';

const { TextArea } = Input;
const { Text } = Typography;

/** 可选的抄送人员列表 */
const CC_PERSON_OPTIONS = [
  { label: '付宇', value: 'U001' },
  { label: '高明成', value: 'U002' },
  { label: '陈睿', value: 'U003' },
  { label: '朱锐', value: 'U004' },
  { label: '张三', value: 'U005' },
  { label: '李四', value: 'U006' },
];

interface StickyReviewPanelProps {
  title: string;
  reviews?: ReviewRecord[];
  onSubmit?: (data: ReviewFormData) => void;
  disabled?: boolean;
  counterSign?: boolean;
  counterSignReviewers?: Array<{ id: string; name: string }>;
  showCc?: boolean;
}

const StickyReviewPanel: React.FC<StickyReviewPanelProps> = ({
  title,
  reviews = [],
  onSubmit,
  disabled = false,
  counterSign = false,
  counterSignReviewers = [],
  showCc = false,
}) => {
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);
  const [comment, setComment] = useState('');
  const [ccUserIds, setCcUserIds] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!result) {
      message.warning('请选择审核结果');
      return;
    }
    if (result === 'rejected' && !comment.trim()) {
      message.warning('驳回时审核意见为必填');
      return;
    }
    onSubmit?.({ result, comment: comment || undefined, ccUserIds: ccUserIds.length > 0 ? ccUserIds : undefined });
    setResult(null);
    setComment('');
    setCcUserIds([]);
  };

  const getReviewerStatus = (reviewerId: string) => {
    const record = reviews.find((r) => r.reviewerId === reviewerId);
    if (!record || record.reviewResult === null) return 'pending';
    return record.reviewResult;
  };

  return (
    <div
      style={{
        background: '#fff',
        marginBottom: 16,
        padding: 16,
      }}
    >
      <Card size="small" title={title}>
        {counterSign && counterSignReviewers.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">会签审核人：</Text>
            <div style={{ marginTop: 8 }}>
              {counterSignReviewers.map((r) => {
                const status = getReviewerStatus(r.id);
                const record = reviews.find((rv) => rv.reviewerId === r.id);
                return (
                  <div
                    key={r.id}
                    style={{
                      padding: '8px 12px',
                      marginBottom: 8,
                      background: status === 'approved' ? '#f6ffed' : status === 'rejected' ? '#fff2f0' : '#fafafa',
                      borderRadius: 6,
                      border: `1px solid ${status === 'approved' ? '#b7eb8f' : status === 'rejected' ? '#ffccc7' : '#f0f0f0'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Tag
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
                      {record?.reviewTime && (
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.reviewTime}</Text>
                      )}
                    </div>
                    {record?.reviewComment && (
                      <div style={{ marginTop: 6, paddingLeft: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>审核意见：</Text>
                        <Text style={{ fontSize: 13 }}>{record.reviewComment}</Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 12 }}>审核结果：</Text>
          <Radio.Group value={result} onChange={(e) => setResult(e.target.value)} disabled={disabled}>
            <Radio value="approved">通过</Radio>
            <Radio value="rejected">不通过</Radio>
          </Radio.Group>
        </div>

        {showCc && (
          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ marginRight: 12 }}>抄送人员：</Text>
            <Select
              mode="multiple"
              placeholder="搜索并选择抄送人员"
              value={ccUserIds}
              onChange={setCcUserIds}
              style={{ width: '100%', marginTop: 4 }}
              options={CC_PERSON_OPTIONS}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string || '').includes(input)
              }
              maxTagCount="responsive"
              disabled={disabled}
            />
          </div>
        )}

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
