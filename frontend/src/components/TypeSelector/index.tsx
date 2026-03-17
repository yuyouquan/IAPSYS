import React, { useState } from 'react';
import { Radio, Select, Tag } from 'antd';
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
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '8px 12px',
        background: '#FAFBFC',
        borderRadius: 8,
        border: '1px solid #F0F0F0',
        minHeight: 40,
      }}
    >
      <Radio.Group
        value={type}
        onChange={(e) => handleTypeChange(e.target.value)}
        size="small"
        optionType="button"
        buttonStyle="solid"
        style={{ flexShrink: 0, marginTop: 2 }}
      >
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="include">包含</Radio.Button>
        <Radio.Button value="exclude">不包含</Radio.Button>
      </Radio.Group>

      {type !== 'all' && (
        <Select
          mode="multiple"
          style={{ flex: 1, minWidth: 0 }}
          placeholder={placeholder || '请选择'}
          value={selected}
          onChange={handleSelectChange}
          options={options}
          maxTagCount="responsive"
          size="small"
          variant="borderless"
          tagRender={({ label, closable, onClose }) => (
            <Tag
              closable={closable}
              onClose={onClose}
              style={{
                margin: '2px 4px 2px 0',
                borderRadius: 4,
                background: '#E6F4FF',
                border: '1px solid #91CAFF',
                color: '#1677FF',
                fontSize: 12,
                lineHeight: '20px',
              }}
            >
              {label}
            </Tag>
          )}
        />
      )}

      {type === 'all' && (
        <span style={{ color: '#8C8C8C', fontSize: 13, lineHeight: '28px' }}>
          不限制，适用于所有
        </span>
      )}
    </div>
  );
};

export default TypeSelector;
