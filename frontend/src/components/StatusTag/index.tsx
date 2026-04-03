import React from 'react';
import {
  CheckOutlined,
  SyncOutlined,
  CloseOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { STATUS_TAG_CONFIG } from '../../constants/enums';

type StatusType = 'total' | 'success' | 'processing' | 'rejected';

interface StatusTagProps {
  status: StatusType;
  count: number;
  onClick?: () => void;
}

const STATUS_ICON: Record<StatusType, React.ReactNode> = {
  total: <MinusOutlined style={{ fontSize: 9 }} />,
  success: <CheckOutlined style={{ fontSize: 9 }} />,
  processing: <SyncOutlined style={{ fontSize: 9 }} />,
  rejected: <CloseOutlined style={{ fontSize: 9 }} />,
};

const StatusTag: React.FC<StatusTagProps> = ({ status, count, onClick }) => {
  const config = STATUS_TAG_CONFIG[status];

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 8,
        fontSize: 12,
        color: config.text,
        background: config.bg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${config.text}18`,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 500,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.text}20, inset 0 1px 2px rgba(0,0,0,0.04)`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
        }
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: `${config.text}15`,
          color: config.text,
        }}
      >
        {STATUS_ICON[status]}
      </span>
      <span>{config.label}</span>
      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{count}</span>
    </span>
  );
};

export default StatusTag;
