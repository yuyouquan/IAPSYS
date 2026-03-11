import React, { useState } from 'react';
import { Tabs } from 'antd';
import ChannelApplyForm from './ChannelApplyForm';
import MaterialForm from './MaterialForm';
import type { ChannelApplyFormData, MaterialFormData } from '../../../types/node';

interface ChannelApplyReadonlyProps {
  channelApplyData?: ChannelApplyFormData;
  materialData?: MaterialFormData[];
  defaultTab?: 'basic' | 'material';
}

const ChannelApplyReadonly: React.FC<ChannelApplyReadonlyProps> = ({
  channelApplyData,
  materialData,
  defaultTab = 'basic',
}) => {
  const [activeKey, setActiveKey] = useState(defaultTab);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
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
              readonly
              value={materialData || channelApplyData?.materials}
              isGpPublish={channelApplyData?.isGpPublish}
              gpLink={channelApplyData?.gpLink}
            />
          ),
        },
      ]}
    />
  );
};

export default ChannelApplyReadonly;
