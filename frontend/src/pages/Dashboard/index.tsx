import React, { useState } from 'react';
import { Tabs, Card, Row, Col, Progress, Tag, Empty, Space, Statistic, Flex } from 'antd';
import {
  RocketOutlined, AppstoreOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import StatusTag from '../../components/StatusTag';

// Mock 看板数据
const mockShuttleView = [
  {
    shuttleId: 'FLOW-001', shuttleName: '3月班车', month: '2026-03',
    products: ['Weather Pro', 'HiOS Launcher', 'Palm Store', 'Smart Finance', 'EDU Learn'],
    productCount: 5, completionRate: 40,
    statusSummary: { total: 5, success: 2, processing: 2, rejected: 1 },
  },
  {
    shuttleId: 'FLOW-002', shuttleName: '3月临时班车01', month: '2026-03',
    products: ['Boomplay', 'Phoenix Browser', 'CarlCare'],
    productCount: 3, completionRate: 0,
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
  {
    shuttleId: 'FLOW-003', shuttleName: '2月班车', month: '2026-02',
    products: ['App1', 'App2', 'App3', 'App4', 'App5', 'App6', 'App7', 'App8'],
    productCount: 8, completionRate: 100,
    statusSummary: { total: 8, success: 8, processing: 0, rejected: 0 },
  },
];

const mockProductView = [
  { appId: 'AV-001', appName: 'Weather Pro', appIcon: '', publishCount: 3 },
  { appId: 'AV-002', appName: 'HiOS Launcher', appIcon: '', publishCount: 2 },
  { appId: 'AV-003', appName: 'Palm Store', appIcon: '', publishCount: 5 },
  { appId: 'AV-004', appName: 'Smart Finance', appIcon: '', publishCount: 1 },
  { appId: 'AV-006', appName: 'Boomplay', appIcon: '', publishCount: 4 },
];

const mockStatusView = {
  processing: [
    { appName: 'HiOS Launcher', currentNode: '通道发布审核', shuttleName: '3月班车' },
    { appName: 'Smart Finance', currentNode: '业务内测', shuttleName: '3月班车' },
    { appName: 'Smart Health', currentNode: '应用上架', shuttleName: '3月班车' },
    { appName: 'Boomplay', currentNode: '通道发布申请', shuttleName: '3月临时班车01' },
    { appName: 'Phoenix Browser', currentNode: '物料审核', shuttleName: '3月临时班车01' },
  ],
  completed: [
    { appName: 'Weather Pro', currentNode: '灰度监控', shuttleName: '3月班车' },
    { appName: 'App1~App8', currentNode: '全部完成', shuttleName: '2月班车' },
  ],
  failed: [
    { appName: 'EDU Learn', currentNode: '通道发布申请', shuttleName: '3月班车' },
    { appName: 'Palm Store', currentNode: '物料上传', shuttleName: '3月班车' },
  ],
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shuttle');

  return (
    <div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'shuttle',
              label: <span><RocketOutlined /> 班车视角</span>,
              children: (
                <Row gutter={[16, 16]}>
                  {mockShuttleView.map((shuttle) => (
                    <Col key={shuttle.shuttleId} xs={24} md={12} lg={8}>
                      <Card hoverable>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{shuttle.shuttleName}</span>
                          <Tag>{shuttle.month}</Tag>
                        </div>
                        <Progress percent={shuttle.completionRate} size="small" style={{ marginBottom: 12 }} />
                        <Space size={4} wrap style={{ marginBottom: 8 }}>
                          <StatusTag status="total" count={shuttle.statusSummary.total} />
                          <StatusTag status="success" count={shuttle.statusSummary.success} />
                          <StatusTag status="processing" count={shuttle.statusSummary.processing} />
                          <StatusTag status="rejected" count={shuttle.statusSummary.rejected} />
                        </Space>
                        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                          覆盖 {shuttle.products.slice(0, 3).join('、')}{shuttle.productCount > 3 ? ` 等${shuttle.productCount}个产品` : ''}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'product',
              label: <span><AppstoreOutlined /> 产品视角</span>,
              children: (
                <Row gutter={[16, 16]}>
                  {mockProductView.map((product) => (
                    <Col key={product.appId} xs={24} sm={12} md={8} lg={6}>
                      <Card hoverable style={{ textAlign: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F0F2F5', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                          <AppstoreOutlined style={{ color: '#8C8C8C' }} />
                        </div>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{product.appName}</div>
                        <div style={{ color: '#1890FF', cursor: 'pointer' }}>
                          发布 {product.publishCount} 次
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'status',
              label: <span><CheckCircleOutlined /> 状态视角</span>,
              children: (
                <Row gutter={16}>
                  {/* 进行中 */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<Space><ClockCircleOutlined style={{ color: '#1890FF' }} /> 进行中</Space>}
                      extra={<Tag color="blue">{mockStatusView.processing.length}</Tag>}
                    >
                      <Flex vertical gap={8}>
                        {mockStatusView.processing.map((item, idx) => (
                          <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.appName}</div>
                            <div><Tag color="blue">{item.currentNode}</Tag> {item.shuttleName}</div>
                          </div>
                        ))}
                      </Flex>
                    </Card>
                  </Col>

                  {/* 已完成 */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<Space><CheckCircleOutlined style={{ color: '#52C41A' }} /> 已完成</Space>}
                      extra={<Tag color="green">{mockStatusView.completed.length}</Tag>}
                    >
                      <Flex vertical gap={8}>
                        {mockStatusView.completed.map((item, idx) => (
                          <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.appName}</div>
                            <div><Tag color="green">{item.currentNode}</Tag> {item.shuttleName}</div>
                          </div>
                        ))}
                      </Flex>
                    </Card>
                  </Col>

                  {/* 失败 */}
                  <Col xs={24} md={8}>
                    <Card
                      title={<Space><CloseCircleOutlined style={{ color: '#FF4D4F' }} /> 失败</Space>}
                      extra={<Tag color="red">{mockStatusView.failed.length}</Tag>}
                    >
                      <Flex vertical gap={8}>
                        {mockStatusView.failed.map((item, idx) => (
                          <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.appName}</div>
                            <div><Tag color="red">{item.currentNode}</Tag> {item.shuttleName}</div>
                          </div>
                        ))}
                      </Flex>
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
