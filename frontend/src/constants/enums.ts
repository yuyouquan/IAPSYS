import type { NodeType } from '../types/node';
import type { UserRole } from '../types/user';

export const APP_CATEGORIES = [
  { label: 'Travel & Local', value: 'travel_local' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Finance', value: 'finance' },
  { label: 'Business', value: 'business' },
  { label: 'Weather', value: 'weather' },
  { label: 'Social', value: 'social' },
  { label: 'Education', value: 'education' },
  { label: 'Medical', value: 'medical' },
  { label: 'Auto & Vehicles', value: 'auto_vehicles' },
] as const;

export const BRANDS = [
  { label: 'Tecno', value: 'Tecno' },
  { label: 'Infinix', value: 'Infinix' },
  { label: 'itel', value: 'itel' },
] as const;

export const ANDROID_VERSIONS = [
  { label: 'Android 11', value: '11' },
  { label: 'Android 12', value: '12' },
  { label: 'Android 13', value: '13' },
  { label: 'Android 14', value: '14' },
  { label: 'Android 15', value: '15' },
  { label: 'Android 16', value: '16' },
] as const;

export const TOS_VERSIONS = [
  { label: 'tOS 16.1.0', value: 'tOS 16.1.0', androidVersions: ['16'] },
  { label: 'tOS 16.0.0', value: 'tOS 16.0.0', androidVersions: ['16'] },
  { label: 'tOS 15.2.0', value: 'tOS 15.2.0', androidVersions: ['15'] },
  { label: 'tOS 15.1.0', value: 'tOS 15.1.0', androidVersions: ['15'] },
  { label: 'tOS 14.1.0', value: 'tOS 14.1.0', androidVersions: ['14'] },
  { label: 'tOS 13.0.0', value: 'tOS 13.0.0', androidVersions: ['13'] },
  { label: 'tOS 12.0.0', value: 'tOS 12.0.0', androidVersions: ['12'] },
  { label: 'tOS 11.0.0', value: 'tOS 11.0.0', androidVersions: ['11'] },
] as const;

export const COUNTRIES = [
  { label: '中国', value: 'CN' },
  { label: '印度', value: 'IN' },
  { label: '尼日利亚', value: 'NG' },
  { label: '肯尼亚', value: 'KE' },
  { label: '坦桑尼亚', value: 'TZ' },
  { label: '加纳', value: 'GH' },
  { label: '埃及', value: 'EG' },
  { label: '印度尼西亚', value: 'ID' },
  { label: '巴基斯坦', value: 'PK' },
  { label: '孟加拉国', value: 'BD' },
  { label: '菲律宾', value: 'PH' },
  { label: '越南', value: 'VN' },
  { label: '巴西', value: 'BR' },
  { label: '墨西哥', value: 'MX' },
  { label: '俄罗斯', value: 'RU' },
] as const;

export const DEVICE_MODELS = [
  { label: 'X6841_H6941', value: 'X6841_H6941', brand: 'Tecno' },
  { label: 'X6858_H8917(Android 16)', value: 'X6858_H8917', brand: 'Tecno' },
  { label: 'KO5_H8925', value: 'KO5_H8925', brand: 'Tecno' },
  { label: 'X6838_H6939', value: 'X6838_H6939', brand: 'Infinix' },
  { label: 'X6876_H8921', value: 'X6876_H8921', brand: 'Infinix' },
  { label: 'P682L_H8935', value: 'P682L_H8935', brand: 'itel' },
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', removable: false },
  { code: 'ru', name: '俄语', removable: true },
  { code: 'pt', name: '葡萄牙语', removable: true },
  { code: 'es', name: '西班牙语', removable: true },
  { code: 'ar', name: '阿语', removable: true },
  { code: 'ko', name: '韩语', removable: true },
  { code: 'fr', name: '法语', removable: true },
  { code: 'de', name: '德语', removable: true },
  { code: 'ja', name: '日语', removable: true },
  { code: 'zh', name: '中文', removable: true },
] as const;

export const NODE_CONFIG: Record<NodeType, {
  name: string;
  order: number;
  defaultSection: 'basic' | 'material';
  editRoles: UserRole[];
}> = {
  channel_apply:    { name: '通道发布申请', order: 1, defaultSection: 'basic',    editRoles: ['R01', 'R08'] },
  channel_review:   { name: '通道发布审核', order: 2, defaultSection: 'basic',    editRoles: ['R02', 'R03', 'R08'] },
  material_upload:  { name: '物料上传',     order: 3, defaultSection: 'material', editRoles: ['R04', 'R08'] },
  material_review:  { name: '物料审核',     order: 4, defaultSection: 'material', editRoles: ['R02', 'R08'] },
  app_publish:      { name: '应用上架',     order: 5, defaultSection: 'basic',    editRoles: ['R05', 'R08'] },
  biz_test:         { name: '业务内测',     order: 6, defaultSection: 'basic',    editRoles: ['R06', 'R08'] },
  gray_monitor:     { name: '灰度监控',     order: 7, defaultSection: 'basic',    editRoles: ['R07', 'R08'] },
};

export const NODE_STATUS_COLOR = {
  pending: '#D9D9D9',
  processing: '#1890FF',
  completed: '#52C41A',
  rejected: '#FF4D4F',
} as const;

export const STATUS_TAG_CONFIG = {
  total:      { text: '#000000', bg: 'transparent', label: '总数' },
  success:    { text: '#52C41A', bg: '#F6FFED', label: '成功' },
  processing: { text: '#1890FF', bg: '#E6F7FF', label: '进行中' },
  rejected:   { text: '#FF4D4F', bg: '#FFF2F0', label: '拒绝' },
} as const;
