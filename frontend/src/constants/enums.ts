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

/** 所需物料语言列表（Mock，后期从翻译系统实时获取） */
export const LANGUAGES = [
  { code: 'en', name: 'English', removable: false },
  { code: 'ar', name: '阿拉伯语', removable: true },
  { code: 'fr', name: '法语', removable: true },
  { code: 'pt', name: '葡萄牙语', removable: true },
  { code: 'sw', name: '斯瓦西里语', removable: true },
  { code: 'am', name: '阿姆哈拉语', removable: true },
  { code: 'om', name: '奥罗莫语', removable: true },
  { code: 'ti', name: '提格雷语', removable: true },
  { code: 'he', name: '希伯来语', removable: true },
  { code: 'fa', name: '波斯语', removable: true },
  { code: 'tr', name: '土耳其语', removable: true },
  { code: 'ru', name: '俄罗斯语', removable: true },
  { code: 'zh-TW', name: '中文繁体', removable: true },
  { code: 'lo', name: '老挝语', removable: true },
  { code: 'kk', name: '哈萨克语', removable: true },
  { code: 'uk', name: '乌克兰语', removable: true },
  { code: 'si', name: '僧伽罗语(斯里兰卡)', removable: true },
  { code: 'my', name: '缅甸语（官方）', removable: true },
  { code: 'my-zawgyi', name: '缅甸语（民间）', removable: true },
  { code: 'id', name: '印尼语', removable: true },
  { code: 'th', name: '泰语', removable: true },
  { code: 'vi', name: '越南语', removable: true },
  { code: 'ne', name: '尼泊尔语', removable: true },
  { code: 'tl', name: '菲律宾他加禄语', removable: true },
  { code: 'km', name: '高棉语(柬埔寨)', removable: true },
  { code: 'ms', name: '马来语', removable: true },
  { code: 'es-419', name: '拉美西班牙语', removable: true },
  { code: 'pt-BR', name: '拉丁葡语', removable: true },
  { code: 'bn', name: '孟加拉语', removable: true },
  { code: 'ur', name: '乌尔都语', removable: true },
  { code: 'hi', name: '印地语', removable: true },
  { code: 'gu', name: '古吉拉特语', removable: true },
  { code: 'kn', name: '卡纳达语', removable: true },
  { code: 'mr', name: '马拉地语', removable: true },
  { code: 'pa', name: '旁遮普语', removable: true },
  { code: 'ta', name: '泰米尔语', removable: true },
  { code: 'te', name: '泰卢固语', removable: true },
  { code: 'ml', name: '玛拉雅拉姆语', removable: true },
  { code: 'as', name: '阿萨姆语', removable: true },
  { code: 'ks', name: '克什米尔语', removable: true },
  { code: 'or', name: '奥里亚语', removable: true },
  { code: 'ku', name: '库尔德语', removable: true },
  { code: 'ha', name: '豪萨文', removable: true },
  { code: 'so', name: '索马里语', removable: true },
  { code: 'cs', name: '捷克语', removable: true },
  { code: 'sr-Latn', name: '塞尔维亚语（拉丁语）', removable: true },
  { code: 'bs-Latn', name: '波斯尼亚语（拉丁语）', removable: true },
  { code: 'cnr-Latn', name: '黑山语（拉丁语）', removable: true },
  { code: 'sq', name: '阿尔巴尼亚语（拉丁语）', removable: true },
  { code: 'mk', name: '北马其顿语（西里尔文）', removable: true },
  { code: 'de', name: '德语', removable: true },
  { code: 'it', name: '意大利语', removable: true },
  { code: 'el', name: '希腊语', removable: true },
  { code: 'nl', name: '荷兰语', removable: true },
  { code: 'ro', name: '罗马尼亚语', removable: true },
  { code: 'sv', name: '瑞典语', removable: true },
  { code: 'sk', name: '斯洛伐克语', removable: true },
  { code: 'pl', name: '波兰语', removable: true },
  { code: 'es', name: '西班牙语（欧洲版）', removable: true },
  { code: 'hu', name: '匈牙利语', removable: true },
  { code: 'sl', name: '斯洛文尼亚语', removable: true },
  { code: 'bg', name: '保加利亚语', removable: true },
  { code: 'et', name: '爱沙尼亚语', removable: true },
  { code: 'lv', name: '拉脱维亚语', removable: true },
  { code: 'lt', name: '立陶宛语', removable: true },
  { code: 'hr', name: '克罗地亚语', removable: true },
  { code: 'da', name: '丹麦语', removable: true },
  { code: 'no', name: '挪威语', removable: true },
  { code: 'fi', name: '芬兰语', removable: true },
  { code: 'is', name: '冰岛语', removable: true },
  { code: 'lb', name: '卢森堡语', removable: true },
  { code: 'uz', name: '乌兹别克语', removable: true },
  { code: 'az', name: '阿塞拜疆语', removable: true },
  { code: 'tg', name: '塔吉克语', removable: true },
  { code: 'tk', name: '土库曼语', removable: true },
  { code: 'ky', name: '吉尔吉斯斯坦', removable: true },
  { code: 'mn', name: '蒙古语', removable: true },
  { code: 'yo', name: '约鲁巴语', removable: true },
  { code: 'ig', name: '伊博语', removable: true },
  { code: 'ibb', name: '伊比比奥语', removable: true },
  { code: 'efi', name: '埃菲克语', removable: true },
  { code: 'ki', name: '基库尤语', removable: true },
  { code: 'kam', name: '坎巴语', removable: true },
  { code: 'luo', name: '卢奥语', removable: true },
  { code: 'guz', name: '基西语', removable: true },
  { code: 'mer', name: '梅鲁语', removable: true },
  { code: 'pcm', name: '洋泾浜语', removable: true },
  { code: 'ko', name: '韩语', removable: true },
] as const;

export const NODE_CONFIG: Record<NodeType, {
  name: string;
  order: number;
  defaultSection: 'basic' | 'material';
  editRoles: UserRole[];
}> = {
  channel_apply:    { name: '通道发布申请', order: 1, defaultSection: 'basic',    editRoles: ['R01'] },          // 应用创建申请人
  channel_review:   { name: '通道发布审核', order: 2, defaultSection: 'basic',    editRoles: ['R02', 'R03'] },   // 通道运营人员 + 业务负责人
  material_upload:  { name: '物料上传',     order: 3, defaultSection: 'material', editRoles: ['R01'] },          // 应用创建申请人
  material_review:  { name: '物料审核',     order: 4, defaultSection: 'material', editRoles: ['R02'] },          // 通道运营人员
  app_publish:      { name: '应用上架',     order: 5, defaultSection: 'basic',    editRoles: ['R02'] },          // 通道运营人员
  biz_test:         { name: '业务内测',     order: 6, defaultSection: 'basic',    editRoles: ['R01', 'R02'] },   // 应用创建申请人 + 通道运营人员
  gray_monitor:     { name: '灰度监控',     order: 7, defaultSection: 'basic',    editRoles: ['R01', 'R02'] },   // 应用创建申请人 + 通道运营人员
};

export const NODE_STATUS_COLOR = {
  pending: '#94A3B8',
  processing: '#2563EB',
  completed: '#10B981',
  rejected: '#EF4444',
} as const;

export const STATUS_TAG_CONFIG = {
  total:      { text: '#334155', bg: 'rgba(51, 65, 85, 0.06)', label: '总数' },
  success:    { text: '#059669', bg: 'rgba(16, 185, 129, 0.08)', label: '成功' },
  processing: { text: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', label: '进行中' },
  rejected:   { text: '#DC2626', bg: 'rgba(239, 68, 68, 0.08)', label: '拒绝' },
} as const;
