import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Descriptions, Card, Row, Col, Button, Input, Pagination, Modal,
  Checkbox, Spin, Tag, Empty, Space, Breadcrumb, message,
} from 'antd';
import { PlusOutlined, SearchOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import StatusTag from '../../components/StatusTag';
import { useFlowStore } from '../../stores/flowStore';
import { useAppStore } from '../../stores/appStore';
import * as appService from '../../services/appService';
import type { AppRecord } from '../../types/app';
import type { AvailableApp } from '../../types/app';
import { NODE_CONFIG, NODE_STATUS_COLOR } from '../../constants/enums';

const FlowDetail: React.FC = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get('status') || '';

  const { currentFlow, detailLoading, fetchFlowDetail } = useFlowStore();
  const { appList, appTotal, appLoading, fetchAppList } = useAppStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [availableApps, setAvailableApps] = useState<AvailableApp[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [addSearchKeyword, setAddSearchKeyword] = useState('');

  useEffect(() => {
    if (flowId) {
      fetchFlowDetail(flowId);
      fetchAppList(flowId, { page: 1, pageSize: 8, status: statusFilter });
    }
  }, [flowId, statusFilter]);

  const handleSearch = () => {
    if (flowId) {
      setCurrentPage(1);
      fetchAppList(flowId, { page: 1, pageSize, keyword: searchKeyword });
    }
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    if (flowId) fetchAppList(flowId, { page, pageSize: size, keyword: searchKeyword });
  };

  const handleOpenAddModal = async () => {
    setAddModalOpen(true);
    try {
      const apps = await appService.getAvailableApps();
      setAvailableApps(apps);
    } catch { /* ignore */ }
  };

  const handleAddApps = async () => {
    if (!flowId || selectedAppIds.length === 0) return;
    try {
      await appService.addApps(flowId, selectedAppIds);
      message.success(`成功添加 ${selectedAppIds.length} 个应用`);
      setAddModalOpen(false);
      setSelectedAppIds([]);
      fetchAppList(flowId);
      fetchFlowDetail(flowId);
    } catch { /* ignore */ }
  };

  if (detailLoading) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
          { title: '流程单详情' },
        ]}
      />

      {/* 基础信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="基础信息" column={4}>
          <Descriptions.Item label="班车名称">{currentFlow?.name}</Descriptions.Item>
          <Descriptions.Item label="APK 状态">
            {currentFlow && (
              <Space size={4}>
                <StatusTag status="total" count={currentFlow.statusSummary.total} />
                <StatusTag status="success" count={currentFlow.statusSummary.success} />
                <StatusTag status="processing" count={currentFlow.statusSummary.processing} />
                <StatusTag status="rejected" count={currentFlow.statusSummary.rejected} />
              </Space>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="申请人">{currentFlow?.applicant}</Descriptions.Item>
          <Descriptions.Item label="申请时间">
            {currentFlow ? dayjs(currentFlow.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 应用卡片列表 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索应用名称/包名"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button onClick={handleSearch}>搜索</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal}>
            添加应用
          </Button>
        </div>

        {appLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>
        ) : appList.length === 0 ? (
          <Empty description={'暂无应用，请点击"添加应用"按钮添加'} />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {appList.map((app: AppRecord) => {
                const statusColor = NODE_STATUS_COLOR[app.currentNodeStatus] || '#D9D9D9';
                return (
                  <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/workbench/flow/${flowId}/app/${app.id}`)}
                      styles={{ body: { padding: 16, height: '100%', display: 'flex', flexDirection: 'column' as const } }}
                      style={{
                        height: '100%',
                        borderRadius: 8,
                        border: '1px solid #F0F0F0',
                        borderLeft: `3px solid ${statusColor}`,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Header: icon + name */}
                      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                          {app.appIcon ? <img src={app.appIcon} alt="" style={{ width: 44, height: 44, borderRadius: 10 }} /> : <AppstoreOutlined style={{ color: '#8C8C8C' }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#262626' }}>{app.appName}</div>
                          <div style={{ fontSize: 12, color: '#8C8C8C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.packageName}</div>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div style={{ fontSize: 12, color: '#595959', marginBottom: 10, lineHeight: '20px' }}>
                        <span>{app.appType}</span>
                        <span style={{ margin: '0 6px', color: '#D9D9D9' }}>|</span>
                        <span>{app.versionCode || '未指定'}</span>
                      </div>

                      {/* Status tag + operator - pushed to bottom */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: app.rejectReason ? 8 : 0 }}>
                          <Tag
                            color={statusColor}
                            style={{ margin: 0, borderRadius: 4, fontSize: 12 }}
                          >
                            {NODE_CONFIG[app.currentNode]?.name || app.currentNode}
                          </Tag>
                          <span style={{ fontSize: 12, color: '#8C8C8C' }}>
                            {app.operator}
                          </span>
                        </div>

                        {/* Reject reason - single line truncated */}
                        {app.rejectReason && (
                          <div
                            title={app.rejectReason}
                            style={{
                              padding: '4px 8px',
                              background: '#FFF2F0',
                              borderRadius: 4,
                              fontSize: 12,
                              color: '#FF4D4F',
                              lineHeight: '18px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {app.rejectReason}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Pagination
                current={currentPage}
                total={appTotal}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 个应用`}
                pageSizeOptions={['8', '16', '24', '32', '64']}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </Card>

      {/* 添加应用 Modal */}
      <Modal
        title="添加应用"
        open={addModalOpen}
        onOk={handleAddApps}
        onCancel={() => { setAddModalOpen(false); setSelectedAppIds([]); }}
        okText={`确认添加 (${selectedAppIds.length})`}
        cancelText="取消"
        width={640}
        okButtonProps={{ disabled: selectedAppIds.length === 0 }}
      >
        <Input
          placeholder="搜索应用名称/包名"
          prefix={<SearchOutlined />}
          style={{ marginBottom: 12 }}
          allowClear
          value={addSearchKeyword}
          onChange={(e) => setAddSearchKeyword(e.target.value)}
        />
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <Checkbox.Group
            value={selectedAppIds}
            onChange={(vals) => setSelectedAppIds(vals as string[])}
            style={{ width: '100%' }}
          >
            {availableApps.filter(a =>
                !addSearchKeyword || a.appName.includes(addSearchKeyword) || a.packageName.includes(addSearchKeyword)
              ).map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderBottom: '1px solid #F5F5F5',
                    transition: 'background 0.15s',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Checkbox value={app.id} style={{ marginRight: 12 }} />
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginRight: 12 }}>
                    {app.appIcon ? <img src={app.appIcon} alt="" style={{ width: 36, height: 36, borderRadius: 8 }} /> : <AppstoreOutlined style={{ color: '#8C8C8C' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.appName}</div>
                    <div style={{ fontSize: 12, color: '#8C8C8C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.packageName}</div>
                  </div>
                  <Tag style={{ marginLeft: 12, flexShrink: 0, borderRadius: 4 }}>{app.appType}</Tag>
                </div>
              ))}
          </Checkbox.Group>
        </div>
      </Modal>
    </div>
  );
};

export default FlowDetail;
