export type UserRole = 'R01' | 'R02' | 'R03' | 'R04' | 'R05' | 'R06' | 'R07' | 'R08';

export interface UserInfo {
  userId: string;
  name: string;
  role: UserRole;
  roleName: string;
  avatar?: string;
}
