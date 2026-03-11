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
  const statusColor = NODE_STATUS_COLOR[todoInfo.currentNodeStatus as keyof typeof NODE_STATUS_COLOR] || '#D9D9D9';

  return (
    <Card
      size="small"
      style={{ marginBottom: 8, borderRadius: 6, borderLeft: `3px solid ${statusColor}` }}
      hoverable
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{todoInfo.shuttleName}</span>
        <Tag color={statusColor} style={{ fontSize: 11, margin: 0 }}>{todoInfo.currentNodeName}</Tag>
      </div>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{todoInfo.appName}</div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8 }}>
        处理人：{todoInfo.handler}
      </div>
      {todoInfo.rejectReason && (
        <Alert
          type="error"
          title={todoInfo.rejectReason}
          style={{ marginBottom: 8, fontSize: 12 }}
          showIcon
          banner
        />
      )}
      <div style={{ textAlign: 'right' }}>
        <Button type="link" size="small" onClick={() => onHandle(todoInfo)}>
          去处理 <RightOutlined />
        </Button>
      </div>
    </Card>
  );
};

export default TodoCard;
