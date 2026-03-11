import { create } from 'zustand';
import type { UserInfo } from '../types/user';

interface UserState {
  currentUser: UserInfo | null;
  setCurrentUser: (user: UserInfo) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
