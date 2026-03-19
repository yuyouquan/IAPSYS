import type { UserInfo } from '../../types/user';

export const mockUsers: UserInfo[] = [
  { userId: 'U001', name: '付宇', role: 'R02', roleName: '通道运营人员' },
  { userId: 'U002', name: '高明成', role: 'R02', roleName: '通道运营人员' },
  { userId: 'U003', name: '陈睿', role: 'R03', roleName: '老板' },
  { userId: 'U004', name: '朱锐', role: 'R03', roleName: '老板' },
  { userId: 'U005', name: '张三', role: 'R01', roleName: '应用创建申请人' },
  { userId: 'U006', name: '李四', role: 'R01', roleName: '应用创建申请人' },
];

/** 班车创建权限：通道运营人员(R02) + 老板(R03) */
export const SHUTTLE_APPLICANTS = ['U001', 'U002', 'U003', 'U004'];

export const currentUser = mockUsers[0]; // 付宇 - 通道运营人员
