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
        gap: 6,
        padding: '4px 12px',
        borderRadius: 8,
        fontSize: 12,
        color: config.text,
        background: config.bg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${config.text}18`,
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 500,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(onClick ? {
          ':hover': {
            transform: 'translateY(-1px)',
          },
        } : {}),
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.text}20`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.text,
          opacity: 0.7,
        }}
      />
      <span>{config.label}</span>
      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{count}</span>
    </span>
  );
};

export default StatusTag;
