import React from 'react';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
  ClockCircleOutlined,
  UserOutlined,
  RightOutlined,
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
  badgeBg: string;
  badgeText: string;
}> = {
  completed: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255,255,255,0.65) 50%, rgba(16, 185, 129, 0.03) 100%)',
    border: 'rgba(16, 185, 129, 0.22)',
    icon: <CheckCircleFilled style={{ fontSize: 18, color: '#10B981' }} />,
    label: '已完成',
    lineColor: '#10B981',
    badgeBg: '#10B981',
    badgeText: '#fff',
  },
  processing: {
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0.65) 50%, rgba(6, 182, 212, 0.04) 100%)',
    border: 'rgba(37, 99, 235, 0.25)',
    icon: <SyncOutlined spin style={{ fontSize: 18, color: '#2563EB' }} />,
    label: '进行中',
    lineColor: '#2563EB',
    badgeBg: '#2563EB',
    badgeText: '#fff',
  },
  rejected: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255,255,255,0.65) 50%, rgba(239, 68, 68, 0.03) 100%)',
    border: 'rgba(239, 68, 68, 0.22)',
    icon: <CloseCircleFilled style={{ fontSize: 18, color: '#EF4444' }} />,
    label: '已驳回',
    lineColor: '#EF4444',
    badgeBg: '#EF4444',
    badgeText: '#fff',
  },
  pending: {
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.05)',
    glassBg: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(248,250,252,0.40) 100%)',
    border: 'rgba(148, 163, 184, 0.15)',
    icon: <ClockCircleOutlined style={{ fontSize: 18, color: '#94A3B8' }} />,
    label: '未开始',
    lineColor: 'rgba(148, 163, 184, 0.20)',
    badgeBg: '#E2E8F0',
    badgeText: '#94A3B8',
  },
};

const ProcessSteps: React.FC<ProcessStepsProps> = ({ nodes, activeNode, onNodeClick }) => {
  const sortedNodes = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', padding: '12px 0 4px 10px' }}>
      {sortedNodes.map((node, idx) => {
        const theme = STATUS_THEME[node.nodeStatus];
        const clickable = node.nodeStatus !== 'pending';
        const isActive = activeNode === node.nodeType;
        const isPending = node.nodeStatus === 'pending';
        const stepNumber = idx + 1;

        const connectorSolid = node.nodeStatus === 'completed';
        const connectorColor = connectorSolid ? '#10B981' : node.nodeStatus === 'processing' ? '#2563EB' : 'rgba(148, 163, 184, 0.25)';

        return (
          <React.Fragment key={node.nodeId}>
            <div
              onClick={clickable ? () => onNodeClick(node.nodeType) : undefined}
              style={{
                flex: '1 1 0',
                minWidth: 120,
                maxWidth: 180,
                padding: '14px 14px 12px',
                borderRadius: 10,
                border: `1.5px solid ${isActive ? theme.color : theme.border}`,
                background: theme.glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: clickable ? 'pointer' : 'default',
                opacity: isPending ? 0.6 : 1,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                boxShadow: isActive
                  ? `0 4px 20px ${theme.color}22, 0 0 0 1px ${theme.color}15`
                  : clickable
                    ? 'var(--shadow-sm)'
                    : 'none',
                ...(isActive ? {
                  animation: 'glowPulse 2.5s ease-in-out infinite',
                } : {}),
              }}
              onMouseEnter={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = theme.color;
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.color}15`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = String(theme.border);
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: theme.badgeBg,
                  color: theme.badgeText,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 6px rgba(0,0,0,0.12), 0 0 0 2px ${theme.badgeBg}20`,
                  zIndex: 1,
                }}
              >
                {stepNumber}
              </div>

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

            {/* Connector */}
            {idx < sortedNodes.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', width: 36, minWidth: 36, justifyContent: 'center', padding: '0 2px' }}>
                <div
                  style={{
                    height: 2.5,
                    flex: 1,
                    background: connectorSolid
                      ? `linear-gradient(90deg, ${connectorColor}, #06B6D4)`
                      : connectorColor,
                    borderRadius: 1,
                    ...((!connectorSolid && isPending) ? {
                      backgroundImage: `repeating-linear-gradient(90deg, rgba(148,163,184,0.25) 0px, rgba(148,163,184,0.25) 4px, transparent 4px, transparent 8px)`,
                      backgroundColor: 'transparent',
                    } : {}),
                  }}
                />
                <RightOutlined
                  style={{
                    fontSize: 10,
                    color: connectorColor,
                    flexShrink: 0,
                    marginLeft: -2,
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
