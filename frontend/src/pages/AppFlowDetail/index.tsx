import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card, Descriptions, Tag, Table, Spin, Breadcrumb, Space, message,
} from 'antd';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import ProcessSteps from '../../components/ProcessSteps';
import { useAppStore } from '../../stores/appStore';
import { NODE_STATUS_COLOR, NODE_CONFIG } from '../../constants/enums';
import type { NodeType } from '../../types/node';
import type { OperationLog } from '../../types/node';

// Node Modal imports
import ChannelApplyModal from '../../components/NodeModals/ChannelApplyModal';
import ChannelReviewModal from '../../components/NodeModals/ChannelReviewModal';
import MaterialUploadModal from '../../components/NodeModals/MaterialUploadModal';
import MaterialReviewModal from '../../components/NodeModals/MaterialReviewModal';
import AppPublishModal from '../../components/NodeModals/AppPublishModal';
import BizTestModal from '../../components/NodeModals/BizTestModal';
import GrayMonitorModal from '../../components/NodeModals/GrayMonitorModal';

const overallStatusMap = {
  processing: { color: '#1890FF', text: '进行中' },
  completed: { color: '#52C41A', text: '已完成' },
  failed: { color: '#FF4D4F', text: '失败' },
};

const NODE_MODAL_MAP: Record<string, React.FC<{ visible: boolean; nodeData: any; onClose: () => void; onSubmit: (data: any) => void }>> = {
  channel_apply: ChannelApplyModal,
  channel_review: ChannelReviewModal,
  material_upload: MaterialUploadModal,
  material_review: MaterialReviewModal,
  app_publish: AppPublishModal,
  biz_test: BizTestModal,
  gray_monitor: GrayMonitorModal,
};

const AppFlowDetail: React.FC = () => {
  const { flowId, appId } = useParams<{ flowId: string; appId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentApp, detailLoading, fetchAppDetail, activeNodeModal, openNodeModal, closeNodeModal } = useAppStore();

  useEffect(() => {
    if (flowId && appId) {
      fetchAppDetail(flowId, appId);
    }
  }, [flowId, appId]);

  // 自动打开指定节点 Modal
  useEffect(() => {
    const node = searchParams.get('node') as NodeType | null;
    const action = searchParams.get('action');
    if (node && action === 'open' && currentApp) {
      openNodeModal(node);
    }
  }, [searchParams, currentApp]);

  const handleNodeClick = (nodeType: NodeType) => {
    openNodeModal(nodeType);
  };

  const handleNodeSubmit = (data: any) => {
    message.success(`${NODE_CONFIG[activeNodeModal!]?.name} 操作提交成功`);
    closeNodeModal();
    if (flowId && appId) {
      fetchAppDetail(flowId, appId);
    }
  };

  // 操作记录列
  const logColumns: ColumnsType<OperationLog> = [
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 100 },
    { title: '操作动作', dataIndex: 'action', key: 'action', width: 150 },
    { title: '操作详情', dataIndex: 'detail', key: 'detail' },
  ];

  if (detailLoading || !currentApp) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  }

  const statusInfo = overallStatusMap[currentApp.overallStatus] || overallStatusMap.processing;

  // 获取当前激活节点的数据
  const activeNodeData = activeNodeModal
    ? currentApp.processNodes.find((n) => n.nodeType === activeNodeModal)
    : null;

  // 获取对应的 Modal 组件
  const ActiveModal = activeNodeModal ? NODE_MODAL_MAP[activeNodeModal] : null;

  return (
    <div>
      {/* 面包屑 */}
      <div style={{
        display: 'inline-flex',
        padding: '6px 16px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.4)',
        marginBottom: 16,
      }}>
        <Breadcrumb
          items={[
            { title: <span style={{ cursor: 'pointer', color: '#2563EB' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
            { title: <span style={{ cursor: 'pointer', color: '#2563EB' }} onClick={() => navigate(`/workbench/flow/${flowId}`)}>流程单详情</span> },
            { title: 'APK 发布详情' },
          ]}
        />
      </div>

      {/* 应用基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.02) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            boxShadow: `0 0 0 3px ${statusInfo.color}20`,
          }}>
            {currentApp.appIcon ? <img src={currentApp.appIcon} alt="" style={{ width: 64, height: 64, borderRadius: 12 }} /> : <AppstoreOutlined style={{ color: '#2563EB' }} />}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px', color: '#0F172A' }}>{currentApp.appName}</div>
            <div style={{ fontSize: 13, color: '#64748B', fontFamily: 'var(--font-mono)' }}>{currentApp.packageName}</div>
          </div>
          <Tag
            color={statusInfo.color}
            style={{
              marginLeft: 'auto', fontSize: 14, padding: '6px 16px',
              boxShadow: `0 0 12px ${statusInfo.color}25`,
              borderRadius: 8,
            }}
          >
            {statusInfo.text}
          </Tag>
        </div>
        <Descriptions column={4} size="small">
          <Descriptions.Item label="版本号">{currentApp.versionCode || '未指定'}</Descriptions.Item>
          <Descriptions.Item label="应用类型">{currentApp.appType}</Descriptions.Item>
          <Descriptions.Item label="当前节点">
            <Tag color={NODE_STATUS_COLOR[currentApp.currentNodeStatus]}>
              {NODE_CONFIG[currentApp.currentNode]?.name}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="操作人">{currentApp.operator}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 流程节点条 */}
      <Card title="应用发布流程" className="section-title-bar" style={{ marginBottom: 24 }}>
        <ProcessSteps
          nodes={currentApp.processNodes}
          activeNode={activeNodeModal || undefined}
          onNodeClick={handleNodeClick}
        />
      </Card>

      {/* 历史操作记录 */}
      <Card title="历史操作记录" className="section-title-bar">
        <Table
          columns={logColumns}
          dataSource={currentApp.operationLogs}
          rowKey="logId"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 节点 Modal 动态渲染 */}
      {ActiveModal && activeNodeData && (
        <ActiveModal
          visible={!!activeNodeModal}
          nodeData={activeNodeData}
          onClose={closeNodeModal}
          onSubmit={handleNodeSubmit}
        />
      )}
    </div>
  );
};

export default AppFlowDetail;
