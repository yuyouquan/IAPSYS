import type { UserInfo } from '../../types/user';

export const mockUsers: UserInfo[] = [
  // R02 - 通道运营人员
  { userId: 'U001', name: '付宇', role: 'R02', roleName: '通道运营人员' },
  { userId: 'U002', name: '高明成', role: 'R02', roleName: '通道运营人员' },
  // R03 - 业务负责人
  { userId: 'U003', name: '陈睿', role: 'R03', roleName: '业务负责人' },
  { userId: 'U004', name: '朱锐', role: 'R03', roleName: '业务负责人' },
  // R01 - 应用创建申请人
  { userId: 'U005', name: '张三', role: 'R01', roleName: '应用创建申请人' },
  { userId: 'U006', name: '李四', role: 'R01', roleName: '应用创建申请人' },
  { userId: 'U007', name: '王五', role: 'R01', roleName: '应用创建申请人' },
  { userId: 'U008', name: '赵六', role: 'R01', roleName: '应用创建申请人' },
  // R08 - 管理员
  { userId: 'U009', name: '系统管理员', role: 'R08', roleName: '管理员' },
];

/** 班车创建权限：通道运营人员(R02) + 业务负责人(R03) */
export const SHUTTLE_APPLICANTS = ['U001', 'U002', 'U003', 'U004'];

/** 默认用户（首次加载时使用） */
export const DEFAULT_USER = mockUsers[0]; // 付宇 - 通道运营人员
