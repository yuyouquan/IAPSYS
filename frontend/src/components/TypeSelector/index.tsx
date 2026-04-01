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
        background: 'linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(241,245,249,0.40) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 10,
        border: '1px solid rgba(148, 163, 184, 0.15)',
        minHeight: 40,
        transition: 'all 0.2s ease',
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
                borderRadius: 6,
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.20)',
                color: '#2563EB',
                fontSize: 12,
                lineHeight: '20px',
                fontWeight: 500,
              }}
            >
              {label}
            </Tag>
          )}
        />
      )}

      {type === 'all' && (
        <span style={{ color: '#6B7280', fontSize: 13, lineHeight: '28px' }}>
          不限制，适用于所有
        </span>
      )}
    </div>
  );
};

export default TypeSelector;
