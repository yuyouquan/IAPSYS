import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import { uploadFile } from '../../../services/nodeService';

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  minCount?: number;
  maxSizeMB?: number;
  aspectRatio?: string;
  exactWidth?: number;
  exactHeight?: number;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 5,
  minCount,
  maxSizeMB = 2,
  aspectRatio,
  exactWidth,
  exactHeight,
  disabled = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const fileList: UploadFile[] = value.map((url, i) => ({
    uid: `${i}`,
    name: `image-${i}`,
    status: 'done',
    url,
  }));

  const validateImage = (file: RcFile): Promise<boolean> => {
    return new Promise((resolve) => {
      if (maxSizeMB && file.size / 1024 / 1024 > maxSizeMB) {
        message.error(`图片大小不能超过 ${maxSizeMB}MB`);
        resolve(false);
        return;
      }
      if (!exactWidth && !exactHeight && !aspectRatio) {
        resolve(true);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (exactWidth && img.width < exactWidth) {
          message.error(`图片宽度不能小于 ${exactWidth}px`);
          resolve(false);
          return;
        }
        if (exactHeight && img.height < exactHeight) {
          message.error(`图片高度不能小于 ${exactHeight}px`);
          resolve(false);
          return;
        }
        if (aspectRatio) {
          const [w, h] = aspectRatio.split(':').map(Number);
          const ratio = img.width / img.height;
          const expected = w / h;
          if (Math.abs(ratio - expected) > 0.05) {
            message.error(`图片比例应为 ${aspectRatio}`);
            resolve(false);
            return;
          }
        }
        resolve(true);
      };
      img.onerror = () => resolve(true);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadFile(file);
      onSuccess({ url });
      const newUrls = [...value, url];
      onChange?.(newUrls);
    } catch (err) {
      onError(err);
      message.error('上传失败');
    }
  };

  const handleRemove = (file: UploadFile) => {
    const idx = fileList.findIndex((f) => f.uid === file.uid);
    if (idx >= 0) {
      const newUrls = value.filter((_, i) => i !== idx);
      onChange?.(newUrls);
    }
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || '');
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        customRequest={handleCustomRequest}
        onRemove={handleRemove}
        onPreview={handlePreview}
        beforeUpload={validateImage}
        accept="image/*"
        disabled={disabled}
        maxCount={maxCount}
      >
        {fileList.length < maxCount && !disabled && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>
      {minCount && (
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          至少上传 {minCount} 张，最多 {maxCount} 张
        </div>
      )}
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
