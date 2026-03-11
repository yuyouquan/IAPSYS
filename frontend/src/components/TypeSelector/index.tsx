import React, { useState } from 'react';
import { Radio, Select, Space } from 'antd';
import type { SelectOption } from '../../types/common';

type SelectorType = 'all' | 'include' | 'exclude';

interface TypeSelectorProps {
  value?: { type: SelectorType; values: string[] };
  onChange?: (val: { type: SelectorType; values: string[] }) => void;
  options: SelectOption[];
  placeholder?: string;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onChange, options, placeholder }) => {
  const [type, setType] = useState<SelectorType>(value?.type || 'all');
  const [selected, setSelected] = useState<string[]>(value?.values || []);

  const handleTypeChange = (newType: SelectorType) => {
    setType(newType);
    const newValues = newType === 'all' ? [] : selected;
    onChange?.({ type: newType, values: newValues });
  };

  const handleSelectChange = (vals: string[]) => {
    setSelected(vals);
    onChange?.({ type, values: vals });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={type} onChange={(e) => handleTypeChange(e.target.value)} size="small">
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="include">包含</Radio.Button>
        <Radio.Button value="exclude">不包含</Radio.Button>
      </Radio.Group>
      {type !== 'all' && (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={placeholder || '请选择'}
          value={selected}
          onChange={handleSelectChange}
          options={options}
          maxTagCount="responsive"
        />
      )}
    </Space>
  );
};

export default TypeSelector;
