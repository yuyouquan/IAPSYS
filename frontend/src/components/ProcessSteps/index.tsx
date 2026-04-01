import React from 'react';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ProcessNode, NodeType, NodeStatus } from '../../types/node';
import { NODE_CONFIG } from '../../constants/enums';

interface ProcessStepsProps {
  nodes: ProcessNode[];
  activeNode?: NodeType;
  onNodeClick: (nodeType: NodeType) => void;
}

const STATUS_THEME: Record<NodeStatus, {
  color: string;
  bg: string;
  glassBg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
  lineColor: string;
}> = {
  completed: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(16, 185, 129, 0.22)',
    icon: <CheckCircleFilled style={{ fontSize: 18, color: '#10B981' }} />,
    label: '已完成',
    lineColor: '#10B981',
  },
  processing: {
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(37, 99, 235, 0.25)',
    icon: <SyncOutlined spin style={{ fontSize: 18, color: '#2563EB' }} />,
    label: '进行中',
    lineColor: '#2563EB',
  },
  rejected: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(239, 68, 68, 0.22)',
    icon: <CloseCircleFilled style={{ fontSize: 18, color: '#EF4444' }} />,
    label: '已驳回',
    lineColor: '#EF4444',
  },
  pending: {
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.05)',
    glassBg: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(248,250,252,0.40) 100%)',
    border: 'rgba(148, 163, 184, 0.15)',
    icon: <ClockCircleOutlined style={{ fontSize: 18, color: '#94A3B8' }} />,
    label: '未开始',
    lineColor: 'rgba(148, 163, 184, 0.20)',
  },
};

const ProcessSteps: React.FC<ProcessStepsProps> = ({ nodes, activeNode, onNodeClick }) => {
  const sortedNodes = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', padding: '4px 0' }}>
      {sortedNodes.map((node, idx) => {
        const theme = STATUS_THEME[node.nodeStatus];
        const clickable = node.nodeStatus !== 'pending';
        const isActive = activeNode === node.nodeType;
        const isPending = node.nodeStatus === 'pending';

        return (
          <React.Fragment key={node.nodeId}>
            <div
              onClick={clickable ? () => onNodeClick(node.nodeType) : undefined}
              style={{
                flex: '1 1 0',
                minWidth: 120,
                maxWidth: 180,
                padding: '12px 14px',
                borderRadius: 10,
                border: `1.5px solid ${isActive ? theme.color : theme.border}`,
                background: theme.glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: clickable ? 'pointer' : 'default',
                opacity: isPending ? 0.6 : 1,
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isActive
                  ? `0 4px 16px ${theme.color}18`
                  : clickable
                    ? '0 1px 6px rgba(15, 23, 42, 0.04)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = theme.color;
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.color}15`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = String(theme.border);
                  e.currentTarget.style.boxShadow = '0 1px 6px rgba(15, 23, 42, 0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                {theme.icon}
                <span
                  style={{
                    fontSize: 11,
                    color: theme.color,
                    background: theme.bg,
                    padding: '2px 7px',
                    borderRadius: 5,
                    fontWeight: 500,
                    lineHeight: '18px',
                  }}
                >
                  {theme.label}
                </span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isPending ? '#94A3B8' : '#0F172A',
                  marginBottom: 6,
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {NODE_CONFIG[node.nodeType]?.name || node.nodeName}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <UserOutlined style={{ fontSize: 11, color: isPending ? '#CBD5E1' : '#64748B' }} />
                <span style={{ fontSize: 12, color: isPending ? '#CBD5E1' : '#64748B', lineHeight: '16px' }}>
                  {node.ownerName}
                </span>
              </div>
            </div>

            {idx < sortedNodes.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', width: 32, minWidth: 32, justifyContent: 'center' }}>
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    background: node.nodeStatus === 'completed' ? '#10B981' : 'rgba(148, 163, 184, 0.20)',
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: `6px solid ${node.nodeStatus === 'completed' ? '#10B981' : 'rgba(148, 163, 184, 0.20)'}`,
                    flexShrink: 0,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessSteps;
