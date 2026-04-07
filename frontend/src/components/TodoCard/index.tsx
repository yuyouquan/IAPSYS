import React from 'react';
import { Card, Tag, Button, Alert } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { NODE_STATUS_COLOR } from '../../constants/enums';

interface TodoInfo {
  id: string;
  flowId: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: string;
  currentNodeName: string;
  currentNodeStatus: string;
  handler: string;
  rejectReason?: string;
}

interface TodoCardProps {
  todoInfo: TodoInfo;
  onHandle: (todo: TodoInfo) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todoInfo, onHandle }) => {
  const statusColor = NODE_STATUS_COLOR[todoInfo.currentNodeStatus as keyof typeof NODE_STATUS_COLOR] || '#9CA3AF';

  return (
    <Card
      size="small"
      style={{
        marginBottom: 10,
        borderRadius: 12,
        borderLeft: `3px solid ${statusColor}`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.40) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.35)`,
        borderLeftWidth: 3,
        borderLeftColor: statusColor,
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
        e.currentTarget.style.boxShadow = `inset 3px 0 8px ${statusColor}20, 0 4px 16px rgba(15, 23, 42, 0.06)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.04)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400 }}>{todoInfo.shuttleName}</span>
        <Tag
          color={statusColor}
          style={{
            fontSize: 11,
            margin: 0,
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          {todoInfo.currentNodeName}
        </Tag>
      </div>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#0F172A', fontSize: 14, letterSpacing: '-0.2px' }}>{todoInfo.appName}</div>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
        处理人：{todoInfo.handler}
      </div>
      {todoInfo.rejectReason && (
        <Alert
          type="error"
          title={todoInfo.rejectReason}
          style={{ marginBottom: 8, fontSize: 12, borderRadius: 8 }}
          showIcon
          banner
        />
      )}
      <div style={{ textAlign: 'right' }}>
        <span
          onClick={() => onHandle(todoInfo)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 16px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
            color: '#2563EB',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.12)';
            const arrow = e.currentTarget.querySelector('.todo-arrow') as HTMLElement;
            if (arrow) arrow.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.06)';
            const arrow = e.currentTarget.querySelector('.todo-arrow') as HTMLElement;
            if (arrow) arrow.style.transform = 'translateX(0)';
          }}
        >
          去处理
          <RightOutlined className="todo-arrow" style={{ fontSize: 10, transition: 'transform 0.2s ease' }} />
        </span>
      </div>
    </Card>
  );
};

export default TodoCard;
