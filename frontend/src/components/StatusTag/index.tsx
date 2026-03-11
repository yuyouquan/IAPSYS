import React from 'react';
import { STATUS_TAG_CONFIG } from '../../constants/enums';

type StatusType = 'total' | 'success' | 'processing' | 'rejected';

interface StatusTagProps {
  status: StatusType;
  count: number;
  onClick?: () => void;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, count, onClick }) => {
  const config = STATUS_TAG_CONFIG[status];

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        color: config.text,
        backgroundColor: config.bg,
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 500,
      }}
    >
      <span>{config.label}</span>
      <span style={{ fontWeight: 600 }}>{count}</span>
    </span>
  );
};

export default StatusTag;
