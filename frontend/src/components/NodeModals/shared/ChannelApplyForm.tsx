import React, { useEffect, useMemo, useState } from 'react';
import {
  Form, Input, Select, Radio, InputNumber, DatePicker, Descriptions, Tag, Space, Row, Col,
  Upload, message,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import TypeSelector from '../../TypeSelector';
import type { ChannelApplyFormData } from '../../../types/node';
import type { TypeSelectorValue } from '../../../types/common';
import type { AppVersion } from '../../../types/app';
import {
  APP_CATEGORIES, BRANDS, ANDROID_VERSIONS, TOS_VERSIONS,
  COUNTRIES, DEVICE_MODELS,
} from '../../../constants/enums';
import { getAppVersions } from '../../../services/nodeService';

const { TextArea } = Input;

interface ChannelApplyFormProps {
  form?: FormInstance;
  data?: ChannelApplyFormData;
  readonly?: boolean;
  appData?: { appName: string; packageName: string; appType: string };
  flowId?: string;
  appId?: string;
}

const renderTsv = (val?: TypeSelectorValue) => {
  if (!val) return '-';
  if (val.type === 'all') return '全部';
  const prefix = val.type === 'include' ? '包含' : '不包含';
  return `${prefix}: ${val.values.join(', ')}`;
};

const ChannelApplyForm: React.FC<ChannelApplyFormProps> = ({
  form: externalForm,
  data,
  readonly = false,
  appData,
  appId,
}) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [versions, setVersions] = useState<AppVersion[]>([]);

  const watchAndroidVersion = Form.useWatch('androidVersion', form);
  const watchIsPaUpdate = Form.useWatch('isPaUpdate', form);

  useEffect(() => {
    if (appId) {
      getAppVersions(appId).then(setVersions).catch(() => setVersions([]));
    }
  }, [appId]);

  useEffect(() => {
    if (data && !readonly) {
      form.setFieldsValue({
        ...data,
        effectiveTimeRange: data.effectiveTimeRange
          ? [dayjs(data.effectiveTimeRange[0]), dayjs(data.effectiveTimeRange[1])]
          : undefined,
      });
    }
  }, [data, form, readonly]);

  const filteredTosVersions = useMemo(() => {
    const selectedAndroid = watchAndroidVersion as TypeSelectorValue | undefined;
    if (!selectedAndroid || selectedAndroid.type === 'all' || selectedAndroid.values.length === 0) {
      return TOS_VERSIONS.map((t) => ({ label: t.label, value: t.value }));
    }
    return TOS_VERSIONS
      .filter((t) => t.androidVersions.some((av) => selectedAndroid.values.includes(av)))
      .map((t) => ({ label: t.label, value: t.value }));
  }, [watchAndroidVersion]);

  const [apkFileList, setApkFileList] = useState<UploadFile[]>([]);

  /** 模拟从 APK 文件中解析版本号 */
  const parseApkVersion = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // 模拟解析延迟，实际项目中应调用后端接口解析 APK
      setTimeout(() => {
        const versionMatch = file.name.match(/v?([\d.]+)/i);
        const version = versionMatch ? `v${versionMatch[1]}` : `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
        resolve(version);
      }, 500);
    });
  };

  const typeSelectorRule = (label: string) => ({
    validator(_: unknown, value?: TypeSelectorValue) {
      // undefined means default "全部", which is valid
      if (!value || value.type === 'all') return Promise.resolve();
      if (value.values.length > 0) return Promise.resolve();
      return Promise.reject(new Error(`请选择${label}`));
    },
  });

  if (readonly && data) {
    return (
      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label="发布目的" span={2}>{data.publishPurpose}</Descriptions.Item>
        <Descriptions.Item label="应用名称">{data.appName}</Descriptions.Item>
        <Descriptions.Item label="包名">{data.packageName}</Descriptions.Item>
        <Descriptions.Item label="应用类型">{data.appType}</Descriptions.Item>
        <Descriptions.Item label="版本号">{data.versionCode}</Descriptions.Item>
        <Descriptions.Item label="APK 文件" span={2}>{data.apkFileName || '-'}</Descriptions.Item>
        <Descriptions.Item label="测试报告">{data.testReport || '-'}</Descriptions.Item>
        <Descriptions.Item label="应用分类">
          {APP_CATEGORIES.find((c) => c.value === data.appCategory)?.label || data.appCategory}
        </Descriptions.Item>
        <Descriptions.Item label="是否系统应用">{data.isSystemApp ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="目标国家">{renderTsv(data.publishCountry)}</Descriptions.Item>
        <Descriptions.Item label="目标品牌">{renderTsv(data.publishBrand)}</Descriptions.Item>
        <Descriptions.Item label="目标机型">{renderTsv(data.publishModel)}</Descriptions.Item>
        <Descriptions.Item label="测试机型">{renderTsv(data.testModel)}</Descriptions.Item>
        <Descriptions.Item label="Android 版本">{renderTsv(data.androidVersion)}</Descriptions.Item>
        <Descriptions.Item label="tOS 版本">{renderTsv(data.tosVersion)}</Descriptions.Item>
        <Descriptions.Item label="是否过滤印度">{data.filterIndia ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="是否 PA 更新">{data.isPaUpdate ? '是' : '否'}</Descriptions.Item>
        {data.isPaUpdate && (
          <>
            <Descriptions.Item label="灰度量级">{data.grayScale}万</Descriptions.Item>
            <Descriptions.Item label="生效时间">
              {data.effectiveTimeRange?.join(' ~ ') || '-'}
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item label="是否 GP 上架">{data.isGpPublish ? '是' : '否'}</Descriptions.Item>
        {data.isGpPublish && (
          <Descriptions.Item label="GP 链接">{data.gpLink || '-'}</Descriptions.Item>
        )}
      </Descriptions>
    );
  }

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="发布目的" name="publishPurpose" rules={[{ required: true, message: '请输入发布目的' }]}>
        <TextArea rows={2} placeholder="请输入发布目的" maxLength={200} showCount />
      </Form.Item>

      <Space size={16} style={{ display: 'flex' }}>
        <Form.Item label="应用名称" name="appName" rules={[{ required: true }]} initialValue={appData?.appName}>
          <Input disabled placeholder="自动带入" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item label="包名" name="packageName" rules={[{ required: true }]} initialValue={appData?.packageName}>
          <Input disabled placeholder="自动带入" style={{ width: 280 }} />
        </Form.Item>
        <Form.Item label="应用类型" name="appType" rules={[{ required: true }]} initialValue={appData?.appType}>
          <Input disabled placeholder="自动带入" style={{ width: 160 }} />
        </Form.Item>
      </Space>

      <Form.Item
        label="上传 APK"
        name="apkFile"
        rules={[{ required: true, message: '请上传 APK 文件' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Upload.Dragger
          accept=".apk"
          maxCount={1}
          fileList={apkFileList}
          beforeUpload={async (file) => {
            if (!file.name.endsWith('.apk')) {
              message.error('仅支持上传 .apk 文件');
              return Upload.LIST_IGNORE;
            }
            setApkFileList([{ uid: file.uid, name: file.name, status: 'uploading', originFileObj: file }]);
            try {
              const version = await parseApkVersion(file);
              form.setFieldValue('versionCode', version);
              form.setFieldValue('apkFileName', file.name);
              setApkFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }]);
            } catch {
              setApkFileList([{ uid: file.uid, name: file.name, status: 'error', originFileObj: file }]);
              message.error('APK 解析失败');
            }
            return false;
          }}
          onRemove={() => {
            setApkFileList([]);
            form.setFieldValue('versionCode', undefined);
            form.setFieldValue('apkFileName', undefined);
          }}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽 APK 文件到此区域上传</p>
          <p className="ant-upload-hint">仅支持 .apk 格式，上传后自动解析版本号</p>
        </Upload.Dragger>
      </Form.Item>

      <Space size={16} style={{ display: 'flex' }}>
        <Form.Item label="版本号" name="versionCode" rules={[{ required: true, message: '请先上传 APK 文件' }]}>
          <Input disabled placeholder="上传 APK 后自动解析" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item label="APK 文件名" name="apkFileName" hidden>
          <Input />
        </Form.Item>
      </Space>

      <Form.Item label="测试报告地址" name="testReport">
        <Input placeholder="请输入测试报告链接（可选）" />
      </Form.Item>

      <Space size={16} style={{ display: 'flex' }}>
        <Form.Item label="应用分类" name="appCategory" rules={[{ required: true, message: '请选择应用分类' }]}>
          <Select placeholder="请选择" options={[...APP_CATEGORIES]} style={{ width: 220 }} />
        </Form.Item>
        <Form.Item label="是否系统应用" name="isSystemApp" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Space>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="目标国家" name="publishCountry" rules={[typeSelectorRule('目标国家')]}>
            <TypeSelector options={[...COUNTRIES]} placeholder="请选择目标国家" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="目标品牌" name="publishBrand" rules={[typeSelectorRule('目标品牌')]}>
            <TypeSelector options={[...BRANDS]} placeholder="请选择目标品牌" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="目标机型" name="publishModel" rules={[typeSelectorRule('目标机型')]}>
            <TypeSelector options={[...DEVICE_MODELS]} placeholder="请选择目标机型" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="测试机型" name="testModel" rules={[typeSelectorRule('测试机型')]}>
            <TypeSelector options={[...DEVICE_MODELS]} placeholder="请选择测试机型" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="目标 Android 版本" name="androidVersion" rules={[typeSelectorRule('Android 版本')]}>
            <TypeSelector options={[...ANDROID_VERSIONS]} placeholder="请选择 Android 版本" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="tOS 版本" name="tosVersion" rules={[typeSelectorRule('tOS 版本')]}>
            <TypeSelector options={filteredTosVersions} placeholder="请选择 tOS 版本" />
          </Form.Item>
        </Col>
      </Row>

      <Space size={16} style={{ display: 'flex' }}>
        <Form.Item label="是否过滤印度" name="filterIndia" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否 PA 更新" name="isPaUpdate" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Space>

      {watchIsPaUpdate && (
        <Space size={16} style={{ display: 'flex' }}>
          <Form.Item label="灰度量级" name="grayScale" rules={[{ required: true, message: '请输入灰度量级' }]}>
            <InputNumber min={1} max={50000} addonAfter="万" style={{ width: 180 }} placeholder="请输入灰度量级" />
          </Form.Item>
          <Form.Item label="生效时间" name="effectiveTimeRange" rules={[{ required: true, message: '请选择生效时间' }]}>
            <DatePicker.RangePicker showTime style={{ width: 380 }} />
          </Form.Item>
        </Space>
      )}
    </Form>
  );
};

export default ChannelApplyForm;
