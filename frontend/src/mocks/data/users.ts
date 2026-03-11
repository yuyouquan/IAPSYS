import type { UserInfo } from '../../types/user';

export const mockUsers: UserInfo[] = [
  { userId: 'U001', name: '张三', role: 'R01', roleName: '需求方' },
  { userId: 'U002', name: '李四', role: 'R02', roleName: '运营人员' },
  { userId: 'U003', name: '王五', role: 'R03', roleName: '管理层' },
  { userId: 'U004', name: '赵六', role: 'R03', roleName: '管理层' },
  { userId: 'U005', name: '孙七', role: 'R04', roleName: '物料上传者' },
  { userId: 'U006', name: '周八', role: 'R05', roleName: '上架操作员' },
  { userId: 'U007', name: '吴九', role: 'R06', roleName: '测试人员' },
  { userId: 'U008', name: '郑十', role: 'R07', roleName: '灰度监控员' },
  { userId: 'U009', name: '钱十一', role: 'R01', roleName: '需求方' },
];

export const currentUser = mockUsers[0];
