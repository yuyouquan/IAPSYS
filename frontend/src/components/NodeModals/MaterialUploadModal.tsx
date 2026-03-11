import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Button, Space, Alert, Spin, message } from 'antd';
import type { ProcessNode, ChannelApplyFormData, MaterialFormData } from '../../types/node';
import ChannelApplyForm from './shared/ChannelApplyForm';
import MaterialForm from './shared/MaterialForm';
import ChannelApplyReadonly from './shared/ChannelApplyReadonly';
import {
  getChannelApplyData,
  getMaterialData,
  submitMaterials,
} from '../../services/nodeService';

interface MaterialUploadModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: MaterialFormData[]) => void;
}

const MaterialUploadModal: React.FC<MaterialUploadModalProps> = ({
  visible,
  nodeData,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState('material');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [channelApplyData, setChannelApplyData] = useState<ChannelApplyFormData | undefined>();
  const [materials, setMaterials] = useState<MaterialFormData[]>([]);
  const [isGpPublish, setIsGpPublish] = useState(false);
  const [gpLink, setGpLink] = useState('');

  const isEditable = nodeData.nodeStatus === 'processing' || nodeData.nodeStatus === 'rejected';

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    Promise.all([
      getChannelApplyData(nodeData.nodeId),
      getMaterialData(nodeData.nodeId),
    ])
      .then(([applyData, matData]) => {
        setChannelApplyData(applyData);
        if (matData && matData.length > 0) {
          setMaterials(matData);
        } else if (applyData?.materials && applyData.materials.length > 0) {
          setMaterials(applyData.materials);
        }
        setIsGpPublish(applyData?.isGpPublish || false);
        setGpLink(applyData?.gpLink || '');
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [visible, nodeData.nodeId]);

  const handleSubmit = async () => {
    if (!isEditable) return;
    try {
      setSubmitting(true);
      await submitMaterials(nodeData.nodeId, materials);
      message.success('物料提交成功');
      onSubmit(materials);
    } catch {
      message.error('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="物料上传"
      open={visible}
      onCancel={onClose}
      width={1100}
      destroyOnHidden
      footer={
        isEditable ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              提交物料
            </Button>
          </Space>
        ) : (
          <Button onClick={onClose}>关闭</Button>
        )
      }
    >
      {nodeData.nodeStatus === 'rejected' && nodeData.rejectReason && (
        <Alert
          type="error"
          message="物料被驳回"
          description={nodeData.rejectReason}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>
      ) : !isEditable ? (
        <ChannelApplyReadonly
          channelApplyData={channelApplyData}
          materialData={materials}
          defaultTab="material"
        />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'basic',
              label: '基础信息',
              children: <ChannelApplyForm readonly data={channelApplyData} />,
            },
            {
              key: 'material',
              label: '所需物料',
              children: (
                <MaterialForm
                  value={materials}
                  onChange={setMaterials}
                  required
                  isGpPublish={isGpPublish}
                  onGpPublishChange={setIsGpPublish}
                  gpLink={gpLink}
                  onGpLinkChange={setGpLink}
                />
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default MaterialUploadModal;
