import React from 'react';
import { Descriptions, Tag, Spin, Empty } from 'antd';
import type { ExternalPlatformData, GrayMonitorData } from '../../../types/node';

interface ExternalDataDisplayProps {
  data?: ExternalPlatformData | GrayMonitorData | null;
  type: 'app_publish' | 'biz_test' | 'gray_monitor';
  loading?: boolean;
}

const ExternalDataDisplay: React.FC<ExternalDataDisplayProps> = ({ data, type, loading = false }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="暂无数据" style={{ padding: 48 }} />;
  }

  if (type === 'gray_monitor') {
    const d = data as GrayMonitorData;
    return (
      <Descriptions bordered size="small" column={2} title="灰度监控数据">
        <Descriptions.Item label="应用名称">{d.appName}</Descriptions.Item>
        <Descriptions.Item label="包名">{d.packageName}</Descriptions.Item>
        <Descriptions.Item label="任务名称">{d.taskName}</Descriptions.Item>
        <Descriptions.Item label="灰度量级">{d.grayScale}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={d.status === '进行中' ? 'processing' : 'error'}>{d.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="生效时间">{d.effectiveTime}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{d.createdAt}</Descriptions.Item>
      </Descriptions>
    );
  }

  // app_publish / biz_test
  const d = data as ExternalPlatformData;
  const title = type === 'app_publish' ? '应用上架数据' : '业务内测数据';

  return (
    <Descriptions bordered size="small" column={2} title={title}>
      <Descriptions.Item label="状态">
        <Tag color={d.status === '生效中' ? 'success' : 'error'}>{d.status}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="应用名称">{d.appName}</Descriptions.Item>
      <Descriptions.Item label="任务名称">{d.taskName}</Descriptions.Item>
      <Descriptions.Item label="包名">{d.packageName}</Descriptions.Item>
      <Descriptions.Item label="目标国家">{d.publishCountry}</Descriptions.Item>
      <Descriptions.Item label="品牌">{d.brand}</Descriptions.Item>
      <Descriptions.Item label="机型">{d.model}</Descriptions.Item>
      <Descriptions.Item label="语言">{d.language}</Descriptions.Item>
      <Descriptions.Item label="Android 版本">{d.androidVersion}</Descriptions.Item>
      <Descriptions.Item label="tOS 版本">{d.tosVersion}</Descriptions.Item>
      <Descriptions.Item label="灰度量级">{d.grayScale}%</Descriptions.Item>
      <Descriptions.Item label="分类">{d.category}</Descriptions.Item>
      <Descriptions.Item label="生效时间" span={2}>{d.effectiveTime}</Descriptions.Item>
    </Descriptions>
  );
};

export default ExternalDataDisplay;
