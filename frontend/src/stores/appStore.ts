import { create } from 'zustand';
import type { AppRecord, AppDetail, AppListParams } from '../types/app';
import type { NodeType } from '../types/node';
import * as appService from '../services/appService';

interface AppState {
  appList: AppRecord[];
  appTotal: number;
  appLoading: boolean;
  appParams: AppListParams;
  currentApp: AppDetail | null;
  detailLoading: boolean;
  activeNodeModal: NodeType | null;
  fetchAppList: (flowId: string, params?: Partial<AppListParams>) => Promise<void>;
  fetchAppDetail: (flowId: string, appId: string) => Promise<void>;
  addApps: (flowId: string, appIds: string[]) => Promise<void>;
  openNodeModal: (nodeType: NodeType) => void;
  closeNodeModal: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  appList: [],
  appTotal: 0,
  appLoading: false,
  appParams: { page: 1, pageSize: 8 },
  currentApp: null,
  detailLoading: false,
  activeNodeModal: null,
  fetchAppList: async (flowId, params) => {
    const mergedParams = { ...get().appParams, ...params };
    set({ appLoading: true, appParams: mergedParams });
    try {
      const result = await appService.getAppList(flowId, mergedParams);
      set({ appList: result.list, appTotal: result.total });
    } finally {
      set({ appLoading: false });
    }
  },
  fetchAppDetail: async (flowId, appId) => {
    set({ detailLoading: true });
    try {
      const app = await appService.getAppDetail(flowId, appId);
      set({ currentApp: app });
    } finally {
      set({ detailLoading: false });
    }
  },
  addApps: async (flowId, appIds) => {
    await appService.addApps(flowId, appIds);
    await get().fetchAppList(flowId);
  },
  openNodeModal: (nodeType) => set({ activeNodeModal: nodeType }),
  closeNodeModal: () => set({ activeNodeModal: null }),
}));
