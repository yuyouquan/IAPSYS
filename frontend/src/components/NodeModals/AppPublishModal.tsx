import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import type { ProcessNode, ExternalPlatformData } from '../../types/node';
import ExternalDataDisplay from './shared/ExternalDataDisplay';
import { getExternalData } from '../../services/nodeService';

interface AppPublishModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: ExternalPlatformData) => void;
}

const AppPublishModal: React.FC<AppPublishModalProps> = ({
  visible,
  nodeData,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExternalPlatformData | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getExternalData(nodeData.nodeId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [visible, nodeData.nodeId]);

  return (
    <Modal
      title="应用上架"
      open={visible}
      onCancel={onClose}
      width={900}
      destroyOnHidden
      footer={<Button onClick={onClose}>关闭</Button>}
    >
      <ExternalDataDisplay data={data} type="app_publish" loading={loading} />
    </Modal>
  );
};

export default AppPublishModal;
