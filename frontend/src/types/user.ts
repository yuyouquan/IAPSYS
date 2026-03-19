/**
 * R01 - 应用创建申请人（添加应用到班车的人）
 * R02 - 通道运营人员（付宇、高明成）
 * R03 - 老板（陈睿、朱锐）
 * R08 - 管理员（预留，拥有所有权限）
 */
export type UserRole = 'R01' | 'R02' | 'R03' | 'R08';

export interface UserInfo {
  userId: string;
  name: string;
  role: UserRole;
  roleName: string;
  avatar?: string;
}
