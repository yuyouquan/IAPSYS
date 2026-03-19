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
  advanceNode,
} from '../../services/nodeService';
import { sendFeishuNotification } from '../../services/notificationService';
import { currentUser, mockUsers } from '../../mocks/data/users';
import { NODE_CONFIG } from '../../constants/enums';

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

  const hasPermission = NODE_CONFIG[nodeData.nodeType].editRoles.includes(currentUser.role);
  const isEditable = hasPermission && (nodeData.nodeStatus === 'processing' || nodeData.nodeStatus === 'rejected');

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

  const validateMaterials = (): boolean => {
    for (const m of materials) {
      if (!m.appNameI18n?.trim()) {
        message.warning(`请填写 ${m.langName || m.langCode} 的应用名称`);
        return false;
      }
      if (!m.shortDesc?.trim()) {
        message.warning(`请填写 ${m.langName || m.langCode} 的一句话描述`);
        return false;
      }
      if (!m.productDetail?.trim()) {
        message.warning(`请填写 ${m.langName || m.langCode} 的产品详情`);
        return false;
      }
      if (!m.updateNote?.trim()) {
        message.warning(`请填写 ${m.langName || m.langCode} 的更新说明`);
        return false;
      }
      if (!m.keywords || m.keywords.length === 0) {
        message.warning(`请填写 ${m.langName || m.langCode} 的关键词`);
        return false;
      }
      if (!m.screenshotUrls || m.screenshotUrls.length < 3) {
        message.warning(`${m.langName || m.langCode} 的详情截图至少需要3张`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isEditable) return;
    if (!validateMaterials()) return;
    try {
      setSubmitting(true);
      await submitMaterials(nodeData.nodeId, materials);
      await advanceNode(nodeData.nodeId);
      message.success('物料提交成功');
      // 触发点7：通知通道运营人员进行审核
      const r02Users = mockUsers.filter(u => u.role === 'R02').map(u => u.userId);
      sendFeishuNotification({
        type: 'material_upload_submitted',
        appName: channelApplyData?.appName,
        recipients: r02Users,
      }).catch(() => {});
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
