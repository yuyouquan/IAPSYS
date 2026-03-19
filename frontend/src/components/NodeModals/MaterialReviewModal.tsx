import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, message } from 'antd';
import type { ProcessNode, ChannelApplyFormData, MaterialFormData, ReviewRecord, ReviewFormData } from '../../types/node';
import StickyReviewPanel from './shared/StickyReviewPanel';
import ChannelApplyReadonly from './shared/ChannelApplyReadonly';
import {
  getChannelApplyData,
  getMaterialData,
  getReviewRecords,
  submitReview,
  advanceNode,
  rejectNode,
} from '../../services/nodeService';
import { sendFeishuNotification } from '../../services/notificationService';
import { currentUser, mockUsers } from '../../mocks/data/users';
import { NODE_CONFIG } from '../../constants/enums';

interface MaterialReviewModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

const MaterialReviewModal: React.FC<MaterialReviewModalProps> = ({
  visible,
  nodeData,
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [channelApplyData, setChannelApplyData] = useState<ChannelApplyFormData | undefined>();
  const [materialData, setMaterialData] = useState<MaterialFormData[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    Promise.all([
      getChannelApplyData(nodeData.nodeId),
      getMaterialData(nodeData.nodeId),
      getReviewRecords(nodeData.nodeId),
    ])
      .then(([applyData, matData, reviewData]) => {
        setChannelApplyData(applyData);
        setMaterialData(matData || []);
        setReviews(reviewData || []);
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [visible, nodeData.nodeId]);

  const hasPermission = NODE_CONFIG[nodeData.nodeType].editRoles.includes(currentUser.role);
  const isCompleted = nodeData.nodeStatus === 'completed';
  const materialReviews = reviews.filter((r) => r.reviewType === 'material_review');

  const handleReviewSubmit = async (data: ReviewFormData) => {
    try {
      await submitReview(nodeData.nodeId, data);
      if (data.result === 'approved') {
        await advanceNode(nodeData.nodeId);
        message.success('物料审核通过，已推进到应用上架');
        // 触发点9：物料审核通过后应用上架结果通知通道运营人员
        const r02Users = mockUsers.filter(u => u.role === 'R02').map(u => u.userId);
        sendFeishuNotification({
          type: 'app_publish_result',
          appName: channelApplyData?.appName,
          recipients: r02Users,
          extra: { result: '已推进到应用上架' },
        }).catch(() => {});
      } else {
        await rejectNode(nodeData.nodeId, 'material_upload', `物料审核不通过：${data.comment || ''}`);
        message.success('物料审核已驳回');
        // 触发点8：通知应用创建申请人修改物料
        const r01Users = mockUsers.filter(u => u.role === 'R01').map(u => u.userId);
        sendFeishuNotification({
          type: 'material_review_rejected',
          appName: channelApplyData?.appName,
          recipients: r01Users,
          extra: { reason: data.comment || '' },
        }).catch(() => {});
      }
      onSubmit(data);
    } catch {
      message.error('提交失败');
    }
  };

  return (
    <Modal
      title="物料审核"
      open={visible}
      onCancel={onClose}
      width={1400}
      destroyOnHidden
      footer={<Button onClick={onClose}>关闭</Button>}
      styles={{ body: { padding: 0 } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>
      ) : (
        <div style={{ display: 'flex', maxHeight: '70vh' }}>
          {/* 左侧：详情 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <ChannelApplyReadonly
              channelApplyData={channelApplyData}
              materialData={materialData}
              defaultTab="material"
            />
          </div>
          {/* 右侧：审核面板 */}
          <div style={{ width: 420, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid #f0f0f0', padding: 16 }}>
            <StickyReviewPanel
              title="物料审核"
              reviews={materialReviews}
              onSubmit={handleReviewSubmit}
              disabled={!hasPermission || isCompleted}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MaterialReviewModal;
