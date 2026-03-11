import React, { useState, useCallback } from 'react';
import {
  Tabs, Form, Input, Select, Radio, Descriptions, Tag, Image, Space, Typography, Empty,
} from 'antd';
import ImageUpload from './ImageUpload';
import { LANGUAGES } from '../../../constants/enums';
import type { MaterialFormData } from '../../../types/node';

const { TextArea } = Input;
const { Text } = Typography;

interface MaterialFormProps {
  value?: MaterialFormData[];
  onChange?: (data: MaterialFormData[]) => void;
  readonly?: boolean;
  required?: boolean;
  /** 外部额外字段：是否GP上架 */
  isGpPublish?: boolean;
  onGpPublishChange?: (val: boolean) => void;
  gpLink?: string;
  onGpLinkChange?: (val: string) => void;
}

const defaultMaterial = (code: string, name: string): MaterialFormData => ({
  langCode: code,
  langName: name,
  appNameI18n: '',
  shortDesc: '',
  productDetail: '',
  updateNote: '',
  keywords: [],
  iconUrl: '',
  topImageUrl: '',
  screenshotUrls: [],
});

const MaterialForm: React.FC<MaterialFormProps> = ({
  value = [],
  onChange,
  readonly = false,
  required = false,
  isGpPublish = false,
  onGpPublishChange,
  gpLink = '',
  onGpLinkChange,
}) => {
  // 确保至少有 English tab
  const [materials, setMaterials] = useState<MaterialFormData[]>(() => {
    if (value.length > 0) return value;
    return [defaultMaterial('en', 'English')];
  });
  const [activeKey, setActiveKey] = useState(materials[0]?.langCode || 'en');

  const updateMaterials = useCallback((updated: MaterialFormData[]) => {
    setMaterials(updated);
    onChange?.(updated);
  }, [onChange]);

  const updateField = (langCode: string, field: keyof MaterialFormData, val: any) => {
    const updated = materials.map((m) =>
      m.langCode === langCode ? { ...m, [field]: val } : m,
    );
    updateMaterials(updated);
  };

  const handleAddTab = () => {
    const usedCodes = materials.map((m) => m.langCode);
    const available = LANGUAGES.filter((l) => !usedCodes.includes(l.code));
    if (available.length === 0) return;
    const lang = available[0];
    const updated = [...materials, defaultMaterial(lang.code, lang.name)];
    updateMaterials(updated);
    setActiveKey(lang.code);
  };

  const handleRemoveTab = (targetKey: string) => {
    if (targetKey === 'en') return; // English cannot be removed
    const updated = materials.filter((m) => m.langCode !== targetKey);
    updateMaterials(updated);
    if (activeKey === targetKey) {
      setActiveKey(updated[0]?.langCode || 'en');
    }
  };

  const handleTabEdit = (targetKey: any, action: 'add' | 'remove') => {
    if (action === 'add') handleAddTab();
    else handleRemoveTab(targetKey as string);
  };

  // Readonly mode
  if (readonly) {
    if (!value || value.length === 0) {
      return <Empty description="暂无物料信息" />;
    }
    return (
      <div>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={value.map((m) => ({
            key: m.langCode,
            label: m.langName || m.langCode,
            children: (
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="应用名称">{m.appNameI18n || '-'}</Descriptions.Item>
                <Descriptions.Item label="一句话描述">{m.shortDesc || '-'}</Descriptions.Item>
                <Descriptions.Item label="产品详情">
                  <div style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
                    {m.productDetail || '-'}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="更新说明">{m.updateNote || '-'}</Descriptions.Item>
                <Descriptions.Item label="关键词">
                  {m.keywords?.length ? (
                    <Space wrap>{m.keywords.map((k) => <Tag key={k}>{k}</Tag>)}</Space>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="应用图标">
                  {m.iconUrl ? <Image src={m.iconUrl} width={64} height={64} /> : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="置顶大图">
                  {m.topImageUrl ? <Image src={m.topImageUrl} width={200} /> : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="详情截图">
                  {m.screenshotUrls?.length ? (
                    <Image.PreviewGroup>
                      <Space wrap>
                        {m.screenshotUrls.map((url, i) => (
                          <Image key={i} src={url} width={100} height={178} style={{ objectFit: 'cover', borderRadius: 4 }} />
                        ))}
                      </Space>
                    </Image.PreviewGroup>
                  ) : '-'}
                </Descriptions.Item>
              </Descriptions>
            ),
          }))}
        />
        <div style={{ marginTop: 16 }}>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="是否 GP 上架">{isGpPublish ? '是' : '否'}</Descriptions.Item>
            {isGpPublish && (
              <Descriptions.Item label="GP 链接">{gpLink || '-'}</Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
    );
  }

  // Editable mode
  const usedCodes = materials.map((m) => m.langCode);
  const canAddMore = LANGUAGES.some((l) => !usedCodes.includes(l.code));

  return (
    <div>
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={handleTabEdit}
        hideAdd={!canAddMore}
        items={materials.map((m) => ({
          key: m.langCode,
          label: m.langName || m.langCode,
          closable: m.langCode !== 'en',
          children: (
            <Form layout="vertical">
              <Form.Item label="应用名称" required={required}>
                <Input
                  value={m.appNameI18n}
                  onChange={(e) => updateField(m.langCode, 'appNameI18n', e.target.value)}
                  placeholder="请输入应用名称"
                  maxLength={50}
                  showCount
                />
              </Form.Item>

              <Form.Item label="一句话描述" required={required}>
                <TextArea
                  value={m.shortDesc}
                  onChange={(e) => updateField(m.langCode, 'shortDesc', e.target.value)}
                  rows={2}
                  placeholder="请输入一句话描述"
                  maxLength={80}
                  showCount
                />
              </Form.Item>

              <Form.Item label="产品详情" required={required}>
                <TextArea
                  value={m.productDetail}
                  onChange={(e) => updateField(m.langCode, 'productDetail', e.target.value)}
                  rows={4}
                  placeholder="请输入产品详情"
                  maxLength={4000}
                  showCount
                />
              </Form.Item>

              <Form.Item label="更新说明" required={required}>
                <TextArea
                  value={m.updateNote}
                  onChange={(e) => updateField(m.langCode, 'updateNote', e.target.value)}
                  rows={2}
                  placeholder="请输入更新说明"
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label="关键词"
                extra={<Text type="secondary">1-5 个关键词，回车添加</Text>}
                required={required}
              >
                <Select
                  mode="tags"
                  value={m.keywords}
                  onChange={(vals) => {
                    const limited = vals.slice(0, 5);
                    updateField(m.langCode, 'keywords', limited);
                  }}
                  placeholder="输入关键词后回车"
                  maxTagCount={5}
                  open={false}
                />
              </Form.Item>

              <Form.Item
                label="应用图标"
                extra={<Text type="secondary">比例 1:1，最小 180x180px</Text>}
                required={required}
              >
                <ImageUpload
                  value={m.iconUrl ? [m.iconUrl] : []}
                  onChange={(urls) => updateField(m.langCode, 'iconUrl', urls[0] || '')}
                  maxCount={1}
                  aspectRatio="1:1"
                  exactWidth={180}
                  exactHeight={180}
                />
              </Form.Item>

              <Form.Item
                label="置顶大图"
                extra={<Text type="secondary">尺寸 1080x594，不超过 2MB</Text>}
              >
                <ImageUpload
                  value={m.topImageUrl ? [m.topImageUrl] : []}
                  onChange={(urls) => updateField(m.langCode, 'topImageUrl', urls[0] || '')}
                  maxCount={1}
                  maxSizeMB={2}
                  exactWidth={1080}
                  exactHeight={594}
                />
              </Form.Item>

              <Form.Item
                label="详情截图"
                extra={<Text type="secondary">3-5 张，每张不超过 2MB</Text>}
                required={required}
              >
                <ImageUpload
                  value={m.screenshotUrls || []}
                  onChange={(urls) => updateField(m.langCode, 'screenshotUrls', urls)}
                  maxCount={5}
                  minCount={3}
                  maxSizeMB={2}
                />
              </Form.Item>
            </Form>
          ),
        }))}
      />

      {/* GP 上架相关 - Tab 外字段 */}
      <div style={{ marginTop: 16, padding: '0 4px' }}>
        <Form layout="vertical">
          <Form.Item label="是否 GP 上架">
            <Radio.Group value={isGpPublish} onChange={(e) => onGpPublishChange?.(e.target.value)}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          {isGpPublish && (
            <Form.Item label="GP 链接" required>
              <Input
                value={gpLink}
                onChange={(e) => onGpLinkChange?.(e.target.value)}
                placeholder="请输入 Google Play 链接"
              />
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

export default MaterialForm;
