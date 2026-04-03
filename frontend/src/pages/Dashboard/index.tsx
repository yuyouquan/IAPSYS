import React, { useState } from 'react';
import { Tabs, Card, Row, Col, Progress, Tag, Empty, Space, Flex } from 'antd';
import {
  RocketOutlined, AppstoreOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CloseCircleOutlined, BarChartOutlined,
  ThunderboltOutlined,
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

// Compute overview stats
const totalShuttles = mockShuttleView.length;
const totalProcessing = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.processing, 0);
const totalCompleted = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.success, 0);
const totalApps = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.total, 0);
const completionRate = totalApps > 0 ? Math.round((totalCompleted / totalApps) * 100) : 0;

const STAT_CARDS = [
  { label: '班车总数', value: totalShuttles, icon: <RocketOutlined />, color: '#2563EB' },
  { label: '进行中', value: totalProcessing, icon: <ThunderboltOutlined />, color: '#06B6D4' },
  { label: '已完成', value: totalCompleted, icon: <CheckCircleOutlined />, color: '#10B981' },
  { label: '完成率', value: `${completionRate}%`, icon: <BarChartOutlined />, color: '#F59E0B' },
];

const STATUS_COLUMN_CONFIG = {
  processing: { color: '#2563EB', icon: <ClockCircleOutlined style={{ color: '#2563EB' }} />, label: '进行中', tagColor: 'blue' },
  completed: { color: '#10B981', icon: <CheckCircleOutlined style={{ color: '#10B981' }} />, label: '已完成', tagColor: 'green' },
  failed: { color: '#EF4444', icon: <CloseCircleOutlined style={{ color: '#EF4444' }} />, label: '失败', tagColor: 'red' },
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shuttle');

  return (
    <div>
      {/* Overview stats row */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {STAT_CARDS.map((stat) => (
          <Col key={stat.label} xs={12} md={6}>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(248,250,252,0.55) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `radial-gradient(circle, ${stat.color}15 0%, ${stat.color}08 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

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
                  {mockShuttleView.map((shuttle) => {
                    const topBorderColor = shuttle.completionRate === 100 ? '#10B981' : shuttle.completionRate > 0 ? '#2563EB' : '#94A3B8';
                    return (
                      <Col key={shuttle.shuttleId} xs={24} md={12} lg={8}>
                        <Card
                          hoverable
                          style={{
                            borderTop: `2.5px solid ${topBorderColor}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{shuttle.shuttleName}</span>
                            <Tag style={{ borderRadius: 6 }}>{shuttle.month}</Tag>
                          </div>
                          <Progress
                            percent={shuttle.completionRate}
                            size="small"
                            strokeColor={{ from: '#2563EB', to: '#06B6D4' }}
                            style={{ marginBottom: 12 }}
                          />
                          <Space size={4} wrap style={{ marginBottom: 10 }}>
                            <StatusTag status="total" count={shuttle.statusSummary.total} />
                            <StatusTag status="success" count={shuttle.statusSummary.success} />
                            <StatusTag status="processing" count={shuttle.statusSummary.processing} />
                            <StatusTag status="rejected" count={shuttle.statusSummary.rejected} />
                          </Space>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {shuttle.products.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                style={{
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  background: 'rgba(37, 99, 235, 0.05)',
                                  color: '#64748B',
                                  border: '1px solid rgba(148, 163, 184, 0.12)',
                                }}
                              >
                                {p}
                              </span>
                            ))}
                            {shuttle.productCount > 3 && (
                              <span style={{ fontSize: 11, color: '#94A3B8', lineHeight: '22px' }}>
                                +{shuttle.productCount - 3}
                              </span>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
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
                      <Card
                        hoverable
                        style={{ textAlign: 'center' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.02) 100%)',
                        }}>
                          <AppstoreOutlined style={{ color: '#2563EB' }} />
                        </div>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{product.appName}</div>
                        <div style={{ color: '#2563EB' }}>
                          发布 <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{product.publishCount}</span> 次
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
                  {(['processing', 'completed', 'failed'] as const).map((statusKey) => {
                    const config = STATUS_COLUMN_CONFIG[statusKey];
                    const items = mockStatusView[statusKey];
                    return (
                      <Col key={statusKey} xs={24} md={8}>
                        <Card
                          title={<Space>{config.icon} {config.label}</Space>}
                          extra={<Tag color={config.tagColor}>{items.length}</Tag>}
                          style={{ borderTop: `3px solid ${config.color}` }}
                        >
                          <Flex vertical gap={0}>
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '10px 8px',
                                  borderBottom: idx < items.length - 1 ? '1px solid rgba(148, 163, 184, 0.10)' : 'none',
                                  borderRadius: 6,
                                  transition: 'all 0.15s ease',
                                  cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${config.color}06`;
                                  e.currentTarget.style.borderLeft = `2px solid ${config.color}`;
                                  e.currentTarget.style.paddingLeft = '10px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.borderLeft = 'none';
                                  e.currentTarget.style.paddingLeft = '8px';
                                }}
                              >
                                <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.appName}</div>
                                <div><Tag color={config.tagColor} style={{ borderRadius: 6 }}>{item.currentNode}</Tag> <span style={{ fontSize: 12, color: '#64748B' }}>{item.shuttleName}</span></div>
                              </div>
                            ))}
                          </Flex>
                        </Card>
                      </Col>
                    );
                  })}
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
