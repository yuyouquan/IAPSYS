import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'antd';
import type { ProcessNode, GrayMonitorData } from '../../types/node';
import ExternalDataDisplay from './shared/ExternalDataDisplay';
import { getGrayMonitorData } from '../../services/nodeService';

interface GrayMonitorModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: GrayMonitorData) => void;
}

const GrayMonitorModal: React.FC<GrayMonitorModalProps> = ({
  visible,
  nodeData,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GrayMonitorData | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getGrayMonitorData(nodeData.nodeId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [visible, nodeData.nodeId]);

  return (
    <Modal
      title="灰度监控"
      open={visible}
      onCancel={onClose}
      width={800}
      destroyOnHidden
      footer={<Button onClick={onClose}>关闭</Button>}
    >
      {data?.status === '已停用' && (
        <Alert
          type="error"
          message="灰度已停用"
          description="该灰度任务已被停用，请联系相关负责人了解详情。"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <ExternalDataDisplay data={data} type="gray_monitor" loading={loading} />
    </Modal>
  );
};

export default GrayMonitorModal;
