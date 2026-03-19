import React, { useEffect, useState } from 'react';
import { Modal, Button, Space, Radio, Input, Divider, Typography, message } from 'antd';
import type { ProcessNode, ExternalPlatformData } from '../../types/node';
import ExternalDataDisplay from './shared/ExternalDataDisplay';
import { getExternalData, rejectNode, advanceNode } from '../../services/nodeService';
import { sendFeishuNotification } from '../../services/notificationService';
import { currentUser, mockUsers } from '../../mocks/data/users';
import { NODE_CONFIG } from '../../constants/enums';

const { TextArea } = Input;
const { Text } = Typography;

interface BizTestModalProps {
  visible: boolean;
  nodeData: ProcessNode;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

type RejectTarget = 'channel_apply' | 'material_upload';

const BizTestModal: React.FC<BizTestModalProps> = ({
  visible,
  nodeData,
  onClose,
  onSubmit,
}) => {
  const hasPermission = NODE_CONFIG[nodeData.nodeType].editRoles.includes(currentUser.role);
  const isEditable = hasPermission && (nodeData.nodeStatus === 'processing' || nodeData.nodeStatus === 'rejected');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExternalPlatformData | null>(null);
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [passing, setPassing] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setRejectTarget(null);
    setRejectReason('');
    getExternalData(nodeData.nodeId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [visible, nodeData.nodeId]);

  const handleReject = async () => {
    if (!rejectTarget) {
      message.warning('请选择驳回类型');
      return;
    }
    if (!rejectReason.trim()) {
      message.warning('请填写驳回原因');
      return;
    }
    setRejecting(true);
    try {
      await rejectNode(nodeData.nodeId, rejectTarget, rejectReason);
      message.success('驳回成功');
      // 触发点10：通知应用创建申请人修改，抄送通道运营人员
      const r01Users = mockUsers.filter(u => u.role === 'R01').map(u => u.userId);
      const r02Users = mockUsers.filter(u => u.role === 'R02').map(u => u.userId);
      sendFeishuNotification({
        type: 'biz_test_failed',
        appName: data?.appName,
        recipients: r01Users,
        ccList: r02Users,
        extra: { reason: rejectReason, target: rejectTarget },
      }).catch(() => {});
      onSubmit({ action: 'reject', target: rejectTarget, reason: rejectReason });
    } catch {
      message.error('驳回失败');
    } finally {
      setRejecting(false);
    }
  };

  const handlePass = async () => {
    setPassing(true);
    try {
      await advanceNode(nodeData.nodeId);
      message.success('业务内测通过，已推进到灰度监控');
      // 触发点11：通知通道运营人员
      const r02Users = mockUsers.filter(u => u.role === 'R02').map(u => u.userId);
      sendFeishuNotification({
        type: 'biz_test_passed',
        appName: data?.appName,
        recipients: r02Users,
      }).catch(() => {});
      onSubmit({ action: 'pass' });
    } catch {
      message.error('操作失败');
    } finally {
      setPassing(false);
    }
  };

  return (
    <Modal
      title="业务内测"
      open={visible}
      onCancel={onClose}
      width={900}
      destroyOnHidden
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          {isEditable && (
            <Button type="primary" onClick={handlePass} loading={passing}>
              测试通过
            </Button>
          )}
          {isEditable && rejectTarget && (
            <Button type="primary" danger onClick={handleReject} loading={rejecting}>
              确认驳回
            </Button>
          )}
        </Space>
      }
    >
      <ExternalDataDisplay data={data} type="biz_test" loading={loading} />

      {isEditable && (
        <>
          <Divider>驳回路由</Divider>
          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ marginRight: 12 }}>问题类型：</Text>
            <Radio.Group value={rejectTarget} onChange={(e) => setRejectTarget(e.target.value)}>
              <Radio value="channel_apply">基础信息有误（回退至通道发布申请）</Radio>
              <Radio value="material_upload">物料有误（回退至物料上传）</Radio>
            </Radio.Group>
          </div>

          {rejectTarget && (
            <div>
              <Text strong>驳回原因：</Text>
              <TextArea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="请输入驳回原因（必填）"
                maxLength={500}
                showCount
                style={{ marginTop: 8 }}
              />
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default BizTestModal;
