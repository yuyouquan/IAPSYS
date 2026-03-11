import { create } from 'zustand';
import type { FlowRecord, FlowListParams } from '../types/flow';
import * as flowService from '../services/flowService';

interface FlowState {
  flowList: FlowRecord[];
  flowTotal: number;
  flowLoading: boolean;
  flowParams: FlowListParams;
  currentFlow: FlowRecord | null;
  detailLoading: boolean;
  fetchFlowList: (params?: Partial<FlowListParams>) => Promise<void>;
  fetchFlowDetail: (flowId: string) => Promise<void>;
  createShuttle: (type: 'monthly' | 'temporary') => Promise<FlowRecord>;
  updateFlowParams: (params: Partial<FlowListParams>) => void;
}

const initialParams: FlowListParams = { page: 1, pageSize: 10 };

export const useFlowStore = create<FlowState>()((set, get) => ({
  flowList: [],
  flowTotal: 0,
  flowLoading: false,
  flowParams: { ...initialParams },
  currentFlow: null,
  detailLoading: false,
  fetchFlowList: async (params) => {
    const mergedParams = { ...get().flowParams, ...params };
    set({ flowLoading: true, flowParams: mergedParams });
    try {
      const result = await flowService.getFlowList(mergedParams);
      set({ flowList: result.list, flowTotal: result.total });
    } finally {
      set({ flowLoading: false });
    }
  },
  fetchFlowDetail: async (flowId) => {
    set({ detailLoading: true });
    try {
      const flow = await flowService.getFlowDetail(flowId);
      set({ currentFlow: flow });
    } finally {
      set({ detailLoading: false });
    }
  },
  createShuttle: async (type) => {
    const result = await flowService.createShuttle(type);
    await get().fetchFlowList({ page: 1 });
    return result;
  },
  updateFlowParams: (params) => {
    set((state) => ({ flowParams: { ...state.flowParams, ...params } }));
  },
}));
