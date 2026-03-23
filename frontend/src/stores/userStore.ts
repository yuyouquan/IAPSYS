import { create } from 'zustand';
import type { UserInfo } from '../types/user';
import { DEFAULT_USER } from '../mocks/data/users';

interface UserState {
  currentUser: UserInfo;
  setCurrentUser: (user: UserInfo) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  currentUser: DEFAULT_USER,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

/** 非 React 环境（如 MSW handlers）获取当前用户 */
export const getCurrentUser = () => useUserStore.getState().currentUser;
