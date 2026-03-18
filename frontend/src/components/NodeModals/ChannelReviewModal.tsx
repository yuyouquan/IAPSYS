import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, Divider, message } from 'antd';
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

interface ChannelReviewModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

const BOSS_REVIEWERS = [
  { id: 'BOSS-001', name: '老板A' },
  { id: 'BOSS-002', name: '老板B' },
];

const ChannelReviewModal: React.FC<ChannelReviewModalProps> = ({
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

  const isCompleted = nodeData.nodeStatus === 'completed';
  const opsReviews = reviews.filter((r) => r.reviewType === 'ops_review');
  const bossReviews = reviews.filter((r) => r.reviewType === 'boss_sign');
  const opsApproved = opsReviews.some((r) => r.reviewResult === 'approved');

  const handleOpsSubmit = async (data: ReviewFormData) => {
    try {
      await submitReview(nodeData.nodeId, { ...data, comment: `[运营审核] ${data.comment || ''}` });
      if (data.result === 'rejected') {
        await rejectNode(nodeData.nodeId, 'channel_apply', `运营审核不通过：${data.comment || ''}`);
        message.success('运营审核已驳回');
        onSubmit(data);
      } else {
        message.success('运营审核提交成功，请等待老板审核');
        const updated = await getReviewRecords(nodeData.nodeId);
        setReviews(updated || []);
      }
    } catch {
      message.error('提交失败');
    }
  };

  const handleBossSubmit = async (data: ReviewFormData) => {
    try {
      await submitReview(nodeData.nodeId, { ...data, comment: `[老板审核] ${data.comment || ''}` });
      if (data.result === 'rejected') {
        await rejectNode(nodeData.nodeId, 'channel_apply', `老板审核不通过：${data.comment || ''}`);
        message.success('老板审核已驳回');
        onSubmit(data);
      } else {
        // 刷新审核记录，检查是否所有老板都已通过
        const updated = await getReviewRecords(nodeData.nodeId);
        setReviews(updated || []);
        const updatedBossReviews = (updated || []).filter((r) => r.reviewType === 'boss_sign');
        const allBossApproved = BOSS_REVIEWERS.every((boss) =>
          updatedBossReviews.some((r) => r.reviewerId === boss.id && r.reviewResult === 'approved'),
        );
        if (allBossApproved) {
          await advanceNode(nodeData.nodeId);
          message.success('所有老板审核通过，已推进到物料上传');
          onSubmit(data);
        } else {
          message.success('老板审核提交成功，等待其他老板审核');
        }
      }
    } catch {
      message.error('提交失败');
    }
  };

  return (
    <Modal
      title="通道发布审核"
      open={visible}
      onCancel={onClose}
      width={1100}
      destroyOnHidden
      footer={<Button onClick={onClose}>关闭</Button>}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>
        ) : (
          <>
            {/* Sticky review panels at top */}
            <StickyReviewPanel
              title="运营审核"
              reviews={opsReviews}
              onSubmit={handleOpsSubmit}
              disabled={isCompleted || opsApproved}
              showCc
            />

            <StickyReviewPanel
              title="老板审核（会签）"
              reviews={bossReviews}
              onSubmit={handleBossSubmit}
              disabled={isCompleted || !opsApproved}
              counterSign
              counterSignReviewers={BOSS_REVIEWERS}
            />

            <Divider style={{ margin: '0 16px', width: 'auto' }} />

            {/* Scrollable detail content */}
            <div style={{ padding: 16 }}>
              <ChannelApplyReadonly
                channelApplyData={channelApplyData}
                materialData={materialData}
                defaultTab="basic"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ChannelReviewModal;
