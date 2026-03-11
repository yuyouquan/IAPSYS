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
} from '../../services/nodeService';

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

  const isCompleted = nodeData.nodeStatus === 'completed';
  const materialReviews = reviews.filter((r) => r.reviewType === 'material_review');

  const handleReviewSubmit = async (data: ReviewFormData) => {
    try {
      await submitReview(nodeData.nodeId, data);
      message.success('物料审核提交成功');
      const updated = await getReviewRecords(nodeData.nodeId);
      setReviews(updated || []);
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
            {/* Sticky review panel */}
            <StickyReviewPanel
              title="物料审核"
              reviews={materialReviews}
              onSubmit={handleReviewSubmit}
              disabled={isCompleted}
            />

            <Divider style={{ margin: '0 16px', width: 'auto' }} />

            {/* Detail content - default to material tab */}
            <div style={{ padding: 16 }}>
              <ChannelApplyReadonly
                channelApplyData={channelApplyData}
                materialData={materialData}
                defaultTab="material"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MaterialReviewModal;
