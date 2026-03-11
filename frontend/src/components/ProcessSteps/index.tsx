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
  border: string;
  icon: React.ReactNode;
  label: string;
  lineColor: string;
}> = {
  completed: {
    color: '#52C41A',
    bg: '#F6FFED',
    border: '#B7EB8F',
    icon: <CheckCircleFilled style={{ fontSize: 18, color: '#52C41A' }} />,
    label: '已完成',
    lineColor: '#52C41A',
  },
  processing: {
    color: '#1890FF',
    bg: '#E6F7FF',
    border: '#91D5FF',
    icon: <SyncOutlined spin style={{ fontSize: 18, color: '#1890FF' }} />,
    label: '进行中',
    lineColor: '#1890FF',
  },
  rejected: {
    color: '#FF4D4F',
    bg: '#FFF2F0',
    border: '#FFA39E',
    icon: <CloseCircleFilled style={{ fontSize: 18, color: '#FF4D4F' }} />,
    label: '已驳回',
    lineColor: '#FF4D4F',
  },
  pending: {
    color: '#BFBFBF',
    bg: '#FAFAFA',
    border: '#E8E8E8',
    icon: <ClockCircleOutlined style={{ fontSize: 18, color: '#BFBFBF' }} />,
    label: '未开始',
    lineColor: '#E8E8E8',
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
            {/* Node card */}
            <div
              onClick={clickable ? () => onNodeClick(node.nodeType) : undefined}
              style={{
                flex: '1 1 0',
                minWidth: 120,
                maxWidth: 180,
                padding: '12px 14px',
                borderRadius: 8,
                border: `1.5px solid ${isActive ? theme.color : theme.border}`,
                background: isActive ? theme.bg : '#fff',
                cursor: clickable ? 'pointer' : 'default',
                opacity: isPending ? 0.6 : 1,
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isActive
                  ? `0 2px 8px ${theme.color}25`
                  : clickable
                    ? '0 1px 3px rgba(0,0,0,0.06)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = theme.color;
                  e.currentTarget.style.background = theme.bg;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${theme.color}20`;
                }
              }}
              onMouseLeave={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                }
              }}
            >
              {/* Header: icon + status label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                {theme.icon}
                <span
                  style={{
                    fontSize: 11,
                    color: theme.color,
                    background: theme.bg,
                    padding: '1px 6px',
                    borderRadius: 4,
                    fontWeight: 500,
                    lineHeight: '18px',
                  }}
                >
                  {theme.label}
                </span>
              </div>

              {/* Node name */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isPending ? '#BFBFBF' : '#262626',
                  marginBottom: 6,
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {NODE_CONFIG[node.nodeType]?.name || node.nodeName}
              </div>

              {/* Owner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <UserOutlined style={{ fontSize: 11, color: isPending ? '#D9D9D9' : '#8C8C8C' }} />
                <span
                  style={{
                    fontSize: 12,
                    color: isPending ? '#D9D9D9' : '#8C8C8C',
                    lineHeight: '16px',
                  }}
                >
                  {node.ownerName}
                </span>
              </div>
            </div>

            {/* Connecting arrow */}
            {idx < sortedNodes.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 32,
                  minWidth: 32,
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Line */}
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    background: node.nodeStatus === 'completed' ? '#52C41A' : '#E8E8E8',
                    borderRadius: 1,
                  }}
                />
                {/* Arrow head */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: `6px solid ${node.nodeStatus === 'completed' ? '#52C41A' : '#E8E8E8'}`,
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
