import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Tabs, Form, Button, Space, Alert, Spin, message } from 'antd';
import type { ProcessNode, ChannelApplyFormData, MaterialFormData } from '../../types/node';
import ChannelApplyForm from './shared/ChannelApplyForm';
import MaterialForm from './shared/MaterialForm';
import ChannelApplyReadonly from './shared/ChannelApplyReadonly';
import { getChannelApplyData, submitChannelApply } from '../../services/nodeService';

interface ChannelApplyModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: ChannelApplyFormData) => void;
}

const STORAGE_PREFIX = 'iapsys_channel_apply_';

const ChannelApplyModal: React.FC<ChannelApplyModalProps> = ({
  visible,
  nodeData,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverData, setServerData] = useState<ChannelApplyFormData | undefined>();
  const [materials, setMaterials] = useState<MaterialFormData[]>([]);
  const [isGpPublish, setIsGpPublish] = useState(false);
  const [gpLink, setGpLink] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isEditable = nodeData.nodeStatus === 'processing' || nodeData.nodeStatus === 'rejected';
  const storageKey = `${STORAGE_PREFIX}${nodeData.nodeId}`;

  // Fetch data on mount
  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getChannelApplyData(nodeData.nodeId)
      .then((data) => {
        setServerData(data);
        if (data) {
          setMaterials(data.materials || []);
          setIsGpPublish(data.isGpPublish || false);
          setGpLink(data.gpLink || '');
        }
        // Try restore from localStorage
        if (isEditable) {
          try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.materials) setMaterials(parsed.materials);
              if (parsed.isGpPublish !== undefined) setIsGpPublish(parsed.isGpPublish);
              if (parsed.gpLink) setGpLink(parsed.gpLink);
            }
          } catch { /* ignore */ }
        }
      })
      .catch(() => { /* use empty data */ })
      .finally(() => setLoading(false));

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [visible, nodeData.nodeId, isEditable, storageKey]);

  // Auto-save to localStorage (debounced)
  const handleAutoSave = useCallback(() => {
    if (!isEditable) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const formValues = form.getFieldsValue();
        const toSave = { ...formValues, materials, isGpPublish, gpLink };
        localStorage.setItem(storageKey, JSON.stringify(toSave));
      } catch { /* ignore */ }
    }, 500);
  }, [form, materials, isGpPublish, gpLink, isEditable, storageKey]);

  useEffect(() => {
    handleAutoSave();
  }, [materials, isGpPublish, gpLink, handleAutoSave]);

  const handleSubmit = async () => {
    if (!isEditable) return;
    try {
      const formValues = await form.validateFields();
      setSubmitting(true);
      const data: ChannelApplyFormData = {
        ...formValues,
        materials,
        isGpPublish,
        gpLink: isGpPublish ? gpLink : undefined,
        effectiveTimeRange: formValues.effectiveTimeRange
          ? [
              formValues.effectiveTimeRange[0].format('YYYY-MM-DD HH:mm:ss'),
              formValues.effectiveTimeRange[1].format('YYYY-MM-DD HH:mm:ss'),
            ]
          : undefined,
      };
      await submitChannelApply(nodeData.nodeId, data);
      localStorage.removeItem(storageKey);
      message.success('通道发布申请提交成功');
      onSubmit(data);
    } catch {
      // validation failed or API error
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>;
    }

    if (!isEditable) {
      return <ChannelApplyReadonly channelApplyData={serverData} materialData={serverData?.materials} />;
    }

    return (
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'basic',
            label: '基础信息',
            children: (
              <ChannelApplyForm
                form={form}
                data={serverData}
                appData={serverData ? { appName: serverData.appName, packageName: serverData.packageName, appType: serverData.appType } : undefined}
                appId={nodeData.recordId}
              />
            ),
          },
          {
            key: 'material',
            label: '所需物料',
            children: (
              <MaterialForm
                value={materials}
                onChange={setMaterials}
                isGpPublish={isGpPublish}
                onGpPublishChange={setIsGpPublish}
                gpLink={gpLink}
                onGpLinkChange={setGpLink}
              />
            ),
          },
        ]}
      />
    );
  };

  return (
    <Modal
      title="通道发布申请"
      open={visible}
      onCancel={onClose}
      width={1100}
      destroyOnHidden
      footer={
        isEditable ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              提交申请
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
          message="申请被驳回"
          description={nodeData.rejectReason}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {renderContent()}
    </Modal>
  );
};

export default ChannelApplyModal;
