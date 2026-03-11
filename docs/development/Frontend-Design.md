# IAPSYS 独立应用发布系统 — 前端开发设计文档

> 版本：v1.0.0
> 技术栈：React 18 + TypeScript + Ant Design 5.x + Vite + Zustand + React Router 6 + MSW
> 最后更新：2026-03-09
> 编写人：前端开发工程师

---

## 目录

1. [技术架构](#1-技术架构)
2. [项目结构](#2-项目结构)
3. [路由设计](#3-路由设计)
4. [状态管理](#4-状态管理)
5. [TypeScript 类型定义](#5-typescript-类型定义)
6. [组件架构](#6-组件架构)
7. [API 接口设计](#7-api-接口设计)
8. [Mock 数据方案](#8-mock-数据方案)
9. [开发规范](#9-开发规范)
10. [构建与部署](#10-构建与部署)

---

## 1. 技术架构

### 1.1 技术选型

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | React | 18.x | 函数式组件 + Hooks |
| 语言 | TypeScript | 5.x | 严格模式 |
| UI 框架 | Ant Design | 5.x | 企业级组件库 |
| 图标 | @ant-design/icons | 5.x | 与 Ant Design 一致 |
| 构建工具 | Vite | 5.x | 快速开发服务器 + ESBuild |
| 路由 | React Router | 6.x | 声明式路由 + 嵌套路由 |
| 状态管理 | Zustand | 4.x | 轻量级状态管理 |
| HTTP 客户端 | Axios | 1.x | 请求/响应拦截器 |
| Mock 服务 | MSW (Mock Service Worker) | 2.x | 拦截网络请求，无侵入式 Mock |
| 日期处理 | dayjs | 1.x | Ant Design 默认日期库 |
| 代码规范 | ESLint + Prettier | - | 统一代码风格 |
| CSS 方案 | CSS Modules + Ant Design Token | - | 局部样式隔离 + 主题变量 |

### 1.2 架构图

```
┌─────────────────────────────────────────────────────┐
│                     浏览器                            │
├─────────────────────────────────────────────────────┤
│  React 18 (SPA)                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  App Shell (ConfigProvider + Layout + Router)  │   │
│  ├───────────────────────────────────────────────┤   │
│  │  Pages                                         │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐   │   │
│  │  │Workbench│ │FlowDetail│ │AppFlowDetail │   │   │
│  │  └─────────┘ └──────────┘ └──────────────┘   │   │
│  │  ┌─────────┐                                   │   │
│  │  │Dashboard│                                   │   │
│  │  └─────────┘                                   │   │
│  ├───────────────────────────────────────────────┤   │
│  │  Components (共享组件)                          │   │
│  │  StatusTag | ProcessSteps | AppCard | ...      │   │
│  ├───────────────────────────────────────────────┤   │
│  │  Store (Zustand)   │  Services (Axios)         │   │
│  │  flowStore          │  flowService              │   │
│  │  todoStore          │  todoService              │   │
│  │  dashboardStore     │  dashboardService         │   │
│  │  userStore          │  userService              │   │
│  └───────────────────┼───────────────────────────┘   │
│                       │                               │
│  ┌────────────────────▼──────────────────────────┐   │
│  │  MSW (Mock Service Worker)                     │   │
│  │  拦截 API 请求 → 返回 Mock 数据                 │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 1.3 数据流

```
用户交互 → Component → Action (Store) → Service (API/Axios)
                                             ↓
                                        MSW 拦截
                                             ↓
                                        Mock Handler
                                             ↓
                                        返回 Mock 响应
                                             ↓
                                        Store 更新状态
                                             ↓
                                        Component 重新渲染
```

---

## 2. 项目结构

```
src/
├── main.tsx                    # 入口文件
├── App.tsx                     # 根组件 (ConfigProvider + Router)
├── vite-env.d.ts               # Vite 类型声明
│
├── assets/                     # 静态资源
│   ├── images/                 # 图片
│   └── styles/                 # 全局样式
│       └── global.css          # 全局重置样式
│
├── theme/                      # 主题配置
│   └── themeConfig.ts          # Ant Design 主题 Token
│
├── router/                     # 路由配置
│   ├── index.tsx               # 路由入口
│   └── routes.tsx              # 路由表定义
│
├── layouts/                    # 布局组件
│   └── MainLayout/
│       ├── index.tsx           # 主布局 (Header + Content)
│       └── index.module.css
│
├── pages/                      # 页面组件
│   ├── Workbench/              # 工作台
│   │   ├── index.tsx           # 工作台主页面（申请列表 + 待办）
│   │   ├── index.module.css
│   │   ├── components/
│   │   │   ├── FlowTable.tsx           # 申请列表 Table
│   │   │   ├── CreateShuttleModal.tsx  # 创建班车 Modal
│   │   │   └── TodoPanel.tsx           # 待办面板
│   │   └── hooks/
│   │       └── useWorkbench.ts         # 工作台业务 Hook
│   │
│   ├── FlowDetail/             # 流程单详情
│   │   ├── index.tsx
│   │   ├── index.module.css
│   │   ├── components/
│   │   │   ├── FlowBaseInfo.tsx        # 基础信息
│   │   │   ├── AppCardList.tsx         # 应用卡片列表
│   │   │   ├── AppCard.tsx             # 应用卡片
│   │   │   └── AddAppModal.tsx         # 添加应用 Modal
│   │   └── hooks/
│   │       └── useFlowDetail.ts
│   │
│   ├── AppFlowDetail/          # 单 APK 发布流程详情
│   │   ├── index.tsx
│   │   ├── index.module.css
│   │   ├── components/
│   │   │   ├── AppBaseInfo.tsx          # 应用基本信息
│   │   │   ├── ProcessStepsBar.tsx     # 流程节点条
│   │   │   ├── OperationHistory.tsx    # 历史操作记录
│   │   │   └── modals/                 # 7 个流程节点 Modal
│   │   │       ├── ChannelApplyModal.tsx      # 通道发布申请
│   │   │       ├── ChannelReviewModal.tsx     # 通道发布审核
│   │   │       ├── MaterialUploadModal.tsx    # 物料上传
│   │   │       ├── MaterialReviewModal.tsx    # 物料审核
│   │   │       ├── AppPublishModal.tsx        # 应用上架
│   │   │       ├── BizTestModal.tsx           # 业务内测
│   │   │       └── GrayMonitorModal.tsx       # 灰度监控
│   │   └── hooks/
│   │       ├── useAppFlowDetail.ts
│   │       └── useAutoSave.ts           # 自动保存 Hook
│   │
│   └── Dashboard/              # 看板
│       ├── index.tsx
│       ├── index.module.css
│       ├── components/
│       │   ├── ShuttleView.tsx          # 班车视角
│       │   ├── ProductView.tsx          # 产品视角
│       │   └── StatusView.tsx           # 状态视角（看板）
│       └── hooks/
│           └── useDashboard.ts
│
├── components/                 # 共享组件
│   ├── StatusTag/
│   │   └── index.tsx           # 状态标签（颜色编码）
│   ├── ProcessSteps/
│   │   └── index.tsx           # 流程步骤条（7 节点）
│   ├── TypeSelector/
│   │   └── index.tsx           # 类型选择器（全部/包含/不包含 + 多选）
│   ├── LanguageTabForm/
│   │   └── index.tsx           # 多语言 Tab 表单
│   ├── ImageUploader/
│   │   └── index.tsx           # 图片上传（带预览、尺寸校验）
│   ├── ReviewPanel/
│   │   └── index.tsx           # 审核面板（运营审核 + 老板会签）
│   ├── TodoCard/
│   │   └── index.tsx           # 待办卡片
│   └── KanbanBoard/
│       └── index.tsx           # 看板拖拽组件
│
├── services/                   # API 服务层
│   ├── request.ts              # Axios 实例 + 拦截器
│   ├── flowService.ts          # 流程单相关接口
│   ├── appService.ts           # 应用相关接口
│   ├── todoService.ts          # 待办相关接口
│   ├── reviewService.ts        # 审核相关接口
│   ├── dashboardService.ts     # 看板相关接口
│   └── userService.ts          # 用户相关接口
│
├── stores/                     # Zustand 状态管理
│   ├── flowStore.ts            # 流程单状态
│   ├── appStore.ts             # 应用状态
│   ├── todoStore.ts            # 待办状态
│   ├── dashboardStore.ts       # 看板状态
│   └── userStore.ts            # 用户/权限状态
│
├── types/                      # TypeScript 类型定义
│   ├── flow.ts                 # 流程单相关类型
│   ├── app.ts                  # 应用相关类型
│   ├── node.ts                 # 节点相关类型
│   ├── review.ts               # 审核相关类型
│   ├── dashboard.ts            # 看板相关类型
│   ├── user.ts                 # 用户相关类型
│   └── common.ts               # 通用类型
│
├── constants/                  # 常量定义
│   ├── enums.ts                # 枚举常量
│   ├── options.ts              # 下拉选项（国家、品牌、机型等）
│   └── nodeConfig.ts           # 节点配置映射
│
├── utils/                      # 工具函数
│   ├── format.ts               # 格式化工具
│   ├── validate.ts             # 表单校验规则
│   └── helpers.ts              # 通用辅助函数
│
└── mocks/                      # MSW Mock 数据
    ├── browser.ts              # MSW 浏览器 Worker 设置
    ├── handlers/               # Mock 请求处理器
    │   ├── index.ts            # 处理器汇总
    │   ├── flowHandlers.ts     # 流程单 Mock
    │   ├── appHandlers.ts      # 应用 Mock
    │   ├── todoHandlers.ts     # 待办 Mock
    │   ├── reviewHandlers.ts   # 审核 Mock
    │   ├── dashboardHandlers.ts # 看板 Mock
    │   └── userHandlers.ts     # 用户 Mock
    └── data/                   # Mock 数据源
        ├── flows.ts            # 班车/流程单数据
        ├── apps.ts             # 应用数据
        ├── nodes.ts            # 节点数据
        ├── todos.ts            # 待办数据
        ├── users.ts            # 用户数据
        ├── reviews.ts          # 审核记录数据
        ├── materials.ts        # 物料数据
        ├── dashboards.ts       # 看板数据
        └── options.ts          # 枚举选项数据（国家、品牌、机型等）
```

---

## 3. 路由设计

### 3.1 路由表

```typescript
// src/router/routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

const Workbench = lazy(() => import('@/pages/Workbench'));
const FlowDetail = lazy(() => import('@/pages/FlowDetail'));
const AppFlowDetail = lazy(() => import('@/pages/AppFlowDetail'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        // 默认重定向到工作台
        element: <Navigate to="/workbench" replace />,
      },
      {
        path: 'workbench',
        element: <Workbench />,
      },
      {
        path: 'workbench/flow/:flowId',
        element: <FlowDetail />,
      },
      {
        path: 'workbench/flow/:flowId/app/:appId',
        element: <AppFlowDetail />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
];
```

### 3.2 路由参数说明

| 路由 | 参数 | Query 参数 | 说明 |
|------|------|-----------|------|
| `/workbench` | 无 | 无 | 工作台主页 |
| `/workbench/flow/:flowId` | `flowId`: 流程单ID | `status`: 状态筛选（success/rejected/processing/all） | 流程单详情 |
| `/workbench/flow/:flowId/app/:appId` | `flowId`, `appId` | `node`: 定位节点, `action`: open（自动打开 Modal） | 单 APK 详情 |
| `/dashboard` | 无 | `tab`: 视角切换（shuttle/product/status） | 看板 |

### 3.3 面包屑导航

```typescript
// 面包屑层级映射
const breadcrumbMap: Record<string, string> = {
  '/workbench': '工作台',
  '/workbench/flow/:flowId': '流程单详情',
  '/workbench/flow/:flowId/app/:appId': 'APK 发布详情',
  '/dashboard': '看板',
};
```

---

## 4. 状态管理

### 4.1 Store 设计原则

- 使用 Zustand 进行轻量级状态管理
- 按业务领域拆分 Store
- 异步操作直接在 Store 中处理
- 使用 `immer` 中间件简化不可变更新

### 4.2 flowStore — 流程单状态

```typescript
// src/stores/flowStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { FlowRecord, FlowListParams, PaginatedResult } from '@/types/flow';
import * as flowService from '@/services/flowService';

interface FlowState {
  // 列表状态
  flowList: FlowRecord[];
  flowTotal: number;
  flowLoading: boolean;
  flowParams: FlowListParams;

  // 详情状态
  currentFlow: FlowRecord | null;
  detailLoading: boolean;

  // 操作
  fetchFlowList: (params?: Partial<FlowListParams>) => Promise<void>;
  fetchFlowDetail: (flowId: string) => Promise<void>;
  createShuttle: (type: 'monthly' | 'temporary') => Promise<FlowRecord>;
  updateFlowParams: (params: Partial<FlowListParams>) => void;
  reset: () => void;
}

const initialParams: FlowListParams = {
  page: 1,
  pageSize: 10,
  name: '',
  applicant: '',
  status: undefined,
  dateRange: undefined,
};

export const useFlowStore = create<FlowState>()(
  immer((set, get) => ({
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
      // 创建成功后刷新列表
      await get().fetchFlowList({ page: 1 });
      return result;
    },

    updateFlowParams: (params) => {
      set((state) => {
        Object.assign(state.flowParams, params);
      });
    },

    reset: () => {
      set({ flowList: [], flowTotal: 0, flowParams: { ...initialParams }, currentFlow: null });
    },
  }))
);
```

### 4.3 appStore — 应用状态

```typescript
// src/stores/appStore.ts
interface AppState {
  // 应用卡片列表
  appList: AppRecord[];
  appTotal: number;
  appLoading: boolean;
  appParams: AppListParams;

  // 单 APK 详情
  currentApp: AppDetail | null;
  processNodes: ProcessNode[];
  operationLogs: OperationLog[];

  // 节点 Modal 状态
  activeNodeModal: NodeType | null;

  // 操作
  fetchAppList: (flowId: string, params?: Partial<AppListParams>) => Promise<void>;
  fetchAppDetail: (flowId: string, appId: string) => Promise<void>;
  addApps: (flowId: string, appIds: string[]) => Promise<void>;
  openNodeModal: (nodeType: NodeType) => void;
  closeNodeModal: () => void;
  submitNode: (nodeType: NodeType, data: Record<string, unknown>) => Promise<void>;
  saveNodeDraft: (nodeType: NodeType, data: Record<string, unknown>) => Promise<void>;
}
```

### 4.4 todoStore — 待办状态

```typescript
// src/stores/todoStore.ts
interface TodoState {
  todoList: TodoItem[];
  todoTotal: number;
  todoLoading: boolean;
  todoParams: { page: number; pageSize: number; keyword: string };

  fetchTodoList: (params?: Partial<TodoState['todoParams']>) => Promise<void>;
}
```

### 4.5 dashboardStore — 看板状态

```typescript
// src/stores/dashboardStore.ts
interface DashboardState {
  activeTab: 'shuttle' | 'product' | 'status';
  shuttleViewData: ShuttleViewItem[];
  productViewData: ProductViewItem[];
  statusViewData: StatusViewItem;
  loading: boolean;

  setActiveTab: (tab: DashboardState['activeTab']) => void;
  fetchShuttleView: () => Promise<void>;
  fetchProductView: () => Promise<void>;
  fetchStatusView: () => Promise<void>;
}
```

### 4.6 userStore — 用户状态

```typescript
// src/stores/userStore.ts
interface UserState {
  currentUser: UserInfo | null;
  permissions: string[];
  isLoggedIn: boolean;

  login: () => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasNodePermission: (nodeType: NodeType, action: 'edit' | 'view') => boolean;
}
```

---

## 5. TypeScript 类型定义

### 5.1 通用类型 (common.ts)

```typescript
// src/types/common.ts

/** API 标准响应 */
export interface ApiResponse<T = unknown> {
  code: number;        // 0 成功，非 0 失败
  message: string;
  data: T;
}

/** 分页请求 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 类型选择器值（全部/包含/不包含） */
export interface TypeSelectorValue {
  type: 'all' | 'include' | 'exclude';
  values: string[];
}

/** 下拉选项 */
export interface SelectOption {
  label: string;
  value: string;
}
```

### 5.2 流程单类型 (flow.ts)

```typescript
// src/types/flow.ts
export type ShuttleType = 'monthly' | 'temporary';

export interface FlowRecord {
  id: string;
  name: string;              // 班车名称，如"3月班车 20260301120000"
  shuttleType: ShuttleType;
  applicantId: string;
  applicant: string;
  createdAt: string;         // ISO 日期字符串
  statusSummary: {
    total: number;
    success: number;
    processing: number;
    rejected: number;
  };
}

export interface FlowListParams extends PaginationParams {
  name?: string;
  applicant?: string;
  status?: string;
  dateRange?: [string, string];
}
```

### 5.3 应用类型 (app.ts)

```typescript
// src/types/app.ts
export type OverallStatus = 'processing' | 'completed' | 'failed';

export interface AppRecord {
  id: string;
  flowId: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  currentNode: NodeType;
  currentNodeStatus: NodeStatus;
  operator: string;
  rejectReason?: string;
  createdAt: string;
}

export interface AppDetail extends AppRecord {
  overallStatus: OverallStatus;
  processNodes: ProcessNode[];
  operationLogs: OperationLog[];
}

export interface AppListParams extends PaginationParams {
  keyword?: string;
  status?: string;
}

/** 可添加的应用（来自应用库） */
export interface AvailableApp {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
}
```

### 5.4 节点类型 (node.ts)

```typescript
// src/types/node.ts
export type NodeType =
  | 'channel_apply'
  | 'channel_review'
  | 'material_upload'
  | 'material_review'
  | 'app_publish'
  | 'biz_test'
  | 'gray_monitor';

export type NodeStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface ProcessNode {
  nodeId: string;
  recordId: string;
  nodeType: NodeType;
  nodeName: string;
  nodeStatus: NodeStatus;
  ownerId: string;
  ownerName: string;
  collaborators: Array<{ id: string; name: string }>;
  rejectReason?: string;
  startTime?: string;
  completeTime?: string;
  sortOrder: number;
}

/** 通道发布申请表单 */
export interface ChannelApplyFormData {
  publishPurpose: string;
  appName: string;           // 自动带出
  packageName: string;       // 自动带出
  appType: string;           // 自动带出
  versionCode: string;
  apkUrl: string;            // 自动带出
  testReport?: string;       // 附件 URL
  appCategory: string;
  isSystemApp: boolean;
  publishCountry: TypeSelectorValue;
  publishBrand: TypeSelectorValue;
  publishModel: TypeSelectorValue;
  testModel: TypeSelectorValue;
  androidVersion: TypeSelectorValue;
  tosVersion: TypeSelectorValue;
  filterIndia: boolean;
  isPaUpdate: boolean;
  grayScale?: number;        // 1-100000 /天
  effectiveTimeRange?: [string, string];
  materials: MaterialFormData[];
  isGpPublish: boolean;
  gpLink?: string;
}

/** 物料表单（单语言） */
export interface MaterialFormData {
  langCode: string;
  langName: string;
  appNameI18n: string;
  shortDesc: string;
  productDetail: string;
  updateNote: string;
  keywords: string[];
  iconUrl?: string;
  topImageUrl?: string;
  screenshotUrls: string[];
}

/** 审核表单 */
export interface ReviewFormData {
  result: 'approved' | 'rejected';
  comment?: string;
}

/** 审核记录（对应 PRD 7.6 审核记录表） */
export interface ReviewRecord {
  reviewId: string;
  nodeId: string;
  reviewType: 'ops_review' | 'boss_sign' | 'material_review';
  reviewerId: string;
  reviewerName: string;
  reviewResult: 'approved' | 'rejected' | null; // null 表示待审核
  reviewComment?: string;
  reviewTime: string | null;
}

/** 通道发布审核完整状态 */
export interface ChannelReviewStatus {
  opsReview: ReviewRecord | null;
  bossReviews: ReviewRecord[];  // 会签多人，全部 approved 才算通过
  applyFormData: ChannelApplyFormData; // 只读展示通道发布申请内容
}

/** 物料审核完整状态 */
export interface MaterialReviewStatus {
  review: ReviewRecord | null;
  materialFormData: ChannelApplyFormData; // 只读展示物料上传内容
}

/** 应用版本信息 */
export interface AppVersion {
  versionCode: string;
  versionName: string;
  apkUrl: string;
  apkSize: number;
  buildTime: string;
  isUsedInCurrentFlow?: boolean;  // 当前班车内是否已被使用
}

/** 业务内测回退表单 */
export interface BizTestRollbackData {
  targetNode: 'channel_apply' | 'material_upload';
  reason: string;
}

/** 灰度监控回退表单 */
export interface GrayMonitorRollbackData {
  targetNode: 'channel_apply' | 'material_upload' | 'app_publish' | 'biz_test';
  reason: string;
}

/** 应用上架/业务内测展示数据（来自外部平台） */
export interface ExternalPlatformData {
  status: '生效中' | '已停用';
  appName: string;
  taskName: string;
  packageName: string;
  publishCountry: string;
  brand: string;
  model: string;
  language: string;
  androidVersion: string;
  tosVersion: string;
  grayScale: number;
  category: string;
  effectiveTime: string; // yyyy/mm/dd-yyyy/mm/dd
}

/** 灰度监控展示数据 */
export interface GrayMonitorData {
  appName: string;
  packageName: string;
  taskName: string;
  effectiveTime: string;
  grayScale: string;       // "xx/xx 现状/总计"
  status: '已停用' | '进行中';
  createdAt: string;
}

/** 操作日志 */
export interface OperationLog {
  logId: string;
  recordId: string;
  operationTime: string;
  operatorId: string;
  operatorName: string;
  action: string;
  detail?: string;
}
```

### 5.5 枚举常量定义 (constants/enums.ts)

```typescript
// src/constants/enums.ts

/** 应用分类枚举 */
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

export type AppCategory = typeof APP_CATEGORIES[number]['value'];

/** 品牌枚举 */
export const BRANDS = [
  { label: 'Tecno', value: 'Tecno' },
  { label: 'Infinix', value: 'Infinix' },
  { label: 'itel', value: 'itel' },
] as const;

/** 安卓版本枚举 */
export const ANDROID_VERSIONS = [
  { label: 'Android 11', value: '11' },
  { label: 'Android 12', value: '12' },
  { label: 'Android 13', value: '13' },
  { label: 'Android 14', value: '14' },
  { label: 'Android 15', value: '15' },
  { label: 'Android 16', value: '16' },
] as const;

/** tOS 版本枚举（需按安卓版本动态筛选，此为全量列表） */
export const TOS_VERSIONS = [
  { label: 'tOS 16.1.0', value: 'tOS 16.1.0', androidVersion: ['16'] },
  { label: 'tOS 16.0.0', value: 'tOS 16.0.0', androidVersion: ['16'] },
  { label: 'tOS 15.2.0', value: 'tOS 15.2.0', androidVersion: ['15'] },
  { label: 'tOS 15.1.0', value: 'tOS 15.1.0', androidVersion: ['15'] },
  { label: 'tOS 14.1.0', value: 'tOS 14.1.0', androidVersion: ['14'] },
  { label: 'tOS 13.0.0', value: 'tOS 13.0.0', androidVersion: ['13'] },
  { label: 'tOS 12.0.0', value: 'tOS 12.0.0', androidVersion: ['12'] },
  { label: 'tOS 11.0.0', value: 'tOS 11.0.0', androidVersion: ['11'] },
] as const;

/** 国家枚举（Mock 用，实际从 API 获取） */
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

/** 机型枚举（Mock 用，实际按品牌联动从 API 获取） */
export const DEVICE_MODELS = [
  { label: 'X6841_H6941', value: 'X6841_H6941', brand: 'Tecno' },
  { label: 'X6858_H8917(Android 16)', value: 'X6858_H8917', brand: 'Tecno' },
  { label: 'KO5_H8925', value: 'KO5_H8925', brand: 'Tecno' },
  { label: 'X6838_H6939', value: 'X6838_H6939', brand: 'Infinix' },
  { label: 'X6876_H8921', value: 'X6876_H8921', brand: 'Infinix' },
  { label: 'P682L_H8935', value: 'P682L_H8935', brand: 'itel' },
] as const;

/** 节点类型常量数组 */
export const NODE_TYPES = [
  'channel_apply',
  'channel_review',
  'material_upload',
  'material_review',
  'app_publish',
  'biz_test',
  'gray_monitor',
] as const;

/** 节点配置映射 */
export const NODE_CONFIG: Record<NodeType, {
  name: string;
  order: number;
  defaultSection: 'basic' | 'material';
  editRoles: UserRole[];
}> = {
  channel_apply:    { name: '通道发布申请', order: 1, defaultSection: 'basic',    editRoles: ['R01', 'R08'] },
  channel_review:   { name: '通道发布审核', order: 2, defaultSection: 'basic',    editRoles: ['R02', 'R03', 'R08'] },
  material_upload:  { name: '物料上传',     order: 3, defaultSection: 'material', editRoles: ['R04', 'R08'] },
  material_review:  { name: '物料审核',     order: 4, defaultSection: 'material', editRoles: ['R02', 'R08'] },
  app_publish:      { name: '应用上架',     order: 5, defaultSection: 'basic',    editRoles: ['R05', 'R08'] },
  biz_test:         { name: '业务内测',     order: 6, defaultSection: 'basic',    editRoles: ['R06', 'R08'] },
  gray_monitor:     { name: '灰度监控',     order: 7, defaultSection: 'basic',    editRoles: ['R07', 'R08'] },
};

/** 操作动作枚举 */
export const ACTION_TYPES = {
  create_shuttle: '创建班车',
  add_app: '添加应用',
  submit_apply: '提交通道发布申请',
  ops_review_pass: '运营审核通过',
  ops_review_reject: '运营审核拒绝',
  boss_sign_pass: '老板会签通过',
  boss_sign_reject: '老板会签拒绝',
  upload_material: '上传物料',
  material_review_pass: '物料审核通过',
  material_review_reject: '物料审核拒绝',
  app_publish_confirm: '应用上架确认',
  app_publish_reject: '应用上架拒绝',
  biz_test_pass: '业务内测通过',
  biz_test_reject: '业务内测拒绝',
  gray_monitor_complete: '灰度监控完成',
  gray_monitor_reject: '灰度监控拒绝',
  add_collaborator: '添加协作人',
  remove_collaborator: '移除协作人',
} as const;

/** 多语言列表 */
export const LANGUAGES = [
  { code: 'en', name: 'English', removable: false },
  { code: 'ru', name: '俄语', removable: true },
  { code: 'pt', name: '葡萄牙语', removable: true },
  { code: 'es', name: '西班牙语', removable: true },
  { code: 'ar', name: '阿语', removable: true },
  { code: 'ko', name: '韩语', removable: true },
  { code: 'fr', name: '法语', removable: true },
  { code: 'de', name: '德语', removable: true },
  { code: 'ja', name: '日语', removable: true },
  { code: 'zh', name: '中文', removable: true },
] as const;
```

### 5.6 看板类型 (dashboard.ts)

```typescript
// src/types/dashboard.ts

/** 班车视角 */
export interface ShuttleViewItem {
  shuttleId: string;
  shuttleName: string;
  month: string;
  products: string[];
  productCount: number;
  completionRate: number;
  statusSummary: {
    total: number;
    success: number;
    processing: number;
    rejected: number;
  };
}

/** 产品视角 */
export interface ProductViewItem {
  appId: string;
  appName: string;
  appIcon: string;
  publishCount: number;
  records: Array<{
    flowId: string;
    shuttleName: string;
    versionCode: string;
    status: OverallStatus;
    currentNode: string;
  }>;
}

/** 状态视角 */
export interface StatusViewItem {
  processing: StatusViewCard[];
  completed: StatusViewCard[];
  failed: StatusViewCard[];
}

export interface StatusViewCard {
  appId: string;
  appName: string;
  appIcon: string;
  flowId: string;
  shuttleName: string;
  currentNode: string;
  currentNodeStatus: NodeStatus;
  updatedAt: string;
}
```

### 5.6 用户类型 (user.ts)

```typescript
// src/types/user.ts
export type UserRole = 'R01' | 'R02' | 'R03' | 'R04' | 'R05' | 'R06' | 'R07' | 'R08';

export interface UserInfo {
  userId: string;
  name: string;
  role: UserRole;
  roleName: string;
  avatar?: string;
}

export interface TodoItem {
  id: string;
  flowId: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: NodeType;
  currentNodeName: string;
  currentNodeStatus: NodeStatus;
  handler: string;
  rejectReason?: string;
  createdAt: string;
}
```

---

## 6. 组件架构

### 6.1 共享组件清单

| 组件名 | 路径 | Props | 说明 |
|--------|------|-------|------|
| StatusTag | `components/StatusTag` | `status`, `count`, `onClick?` | 状态标签（颜色编码，可点击跳转） |
| ProcessSteps | `components/ProcessSteps` | `nodes`, `activeNode?`, `onNodeClick` | 7 节点流程步骤条 |
| TypeSelector | `components/TypeSelector` | `value`, `onChange`, `options` | 全部/包含/不包含 + 多选下拉 |
| LanguageTabForm | `components/LanguageTabForm` | `value`, `onChange`, `readOnly?` | 多语言 Tab 表单 |
| ImageUploader | `components/ImageUploader` | `value`, `onChange`, `maxCount`, `accept`, `sizeLimit`, `dimensionLimit` | 图片上传（预览 + 校验） |
| ReviewPanel | `components/ReviewPanel` | `reviews`, `onSubmit`, `type` | 审核面板（运营审核/老板会签） |
| TodoCard | `components/TodoCard` | `todoInfo`, `onHandle` | 待办卡片 |
| KanbanBoard | `components/KanbanBoard` | `columns`, `cards` | 状态看板 |

### 6.2 StatusTag 组件

```typescript
// src/components/StatusTag/index.tsx
interface StatusTagProps {
  status: 'total' | 'success' | 'processing' | 'rejected';
  count: number;
  onClick?: () => void;
}

const colorMap = {
  total:      { text: '#000000', bg: 'transparent' },
  success:    { text: '#52C41A', bg: '#F6FFED' },
  processing: { text: '#1890FF', bg: '#E6F7FF' },
  rejected:   { text: '#FF4D4F', bg: '#FFF2F0' },
};

const labelMap = {
  total: '总数',
  success: '成功',
  processing: '进行中',
  rejected: '拒绝',
};
```

### 6.3 TypeSelector 组件

```typescript
// src/components/TypeSelector/index.tsx
/**
 * 左侧 Select（全部/包含/不包含）+ 右侧 Select（多选 + 模糊搜索）
 * - 选择"全部"时：右侧清空并禁用
 * - 选择"包含"或"不包含"时：右侧可用，支持下拉多选 + 模糊搜索
 */
interface TypeSelectorProps {
  value?: TypeSelectorValue;
  onChange?: (value: TypeSelectorValue) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}
```

布局：

```
+---------------+-------------------------------------------+
| [全部 ▼]      | [请选择...（多选）                    ▼]   |
+---------------+-------------------------------------------+
  左侧 120px      右侧 flex: 1
```

### 6.4 LanguageTabForm 组件

```typescript
// src/components/LanguageTabForm/index.tsx
/**
 * 多语言 Tab 表单：
 * - 默认显示 English (en)，不可删除
 * - 支持添加/删除其他语言
 * - 每个语言 Tab 下表单字段一致
 * - readOnly 模式下仅展示
 */
interface LanguageTabFormProps {
  value?: MaterialFormData[];
  onChange?: (value: MaterialFormData[]) => void;
  readOnly?: boolean;
}

// 可选语言列表
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: '俄语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ar', name: '阿语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'ja', name: '日语' },
  { code: 'zh', name: '中文' },
];
```

### 6.5 ImageUploader 组件

```typescript
// src/components/ImageUploader/index.tsx
/**
 * 图片上传组件，支持：
 * - 文件类型校验（jpg/png）
 * - 尺寸校验（精确/比例/最小值）
 * - 大小校验（MB 限制）
 * - 数量限制
 * - 图片预览
 */
interface ImageUploaderProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  maxCount?: number;
  minCount?: number;
  accept?: string;                          // 默认 '.jpg,.png'
  maxSizeMB?: number;
  dimensionRule?: {
    type: 'exact' | 'ratio' | 'min';
    width?: number;
    height?: number;
    ratio?: string;                          // 如 '1:1'
    minWidth?: number;
    minHeight?: number;
  };
  multiple?: boolean;
}
```

### 6.6 ReviewPanel 组件

```typescript
// src/components/ReviewPanel/index.tsx
/**
 * 审核面板：
 * - type='ops': 运营审核（单人）
 * - type='boss': 老板会签（多人，全部通过才算通过）
 * - type='material': 物料审核（单人）
 *
 * 固定在 Modal 顶部，不随内容滚动
 */
interface ReviewPanelProps {
  type: 'ops' | 'boss' | 'material';
  reviews: ReviewRecord[];
  currentUserId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  disabled?: boolean;  // 前置审核未完成时禁用
}
```

### 6.7 ProcessSteps 组件

```typescript
// src/components/ProcessSteps/index.tsx
/**
 * 7 节点流程步骤条：
 * - 使用 Ant Design Steps 组件
 * - 颜色编码：完成=绿色，进行中=蓝色，拒绝=红色，未开始=灰色
 * - 点击节点触发 onNodeClick
 */
interface ProcessStepsProps {
  nodes: ProcessNode[];
  activeNode?: NodeType;
  onNodeClick: (nodeType: NodeType) => void;
}

// 节点类型到中文名映射
const nodeNameMap: Record<NodeType, string> = {
  channel_apply: '通道发布申请',
  channel_review: '通道发布审核',
  material_upload: '物料上传',
  material_review: '物料审核',
  app_publish: '应用上架',
  biz_test: '业务内测',
  gray_monitor: '灰度监控',
};

// 节点状态到 Steps status 映射
const statusMap: Record<NodeStatus, 'wait' | 'process' | 'finish' | 'error'> = {
  pending: 'wait',
  processing: 'process',
  completed: 'finish',
  rejected: 'error',
};
```

### 6.8 自动保存 Hook

```typescript
// src/pages/AppFlowDetail/hooks/useAutoSave.ts
/**
 * 自动保存 Hook：
 * - 监听表单值变化
 * - 防抖 2 秒后自动保存
 * - 显示保存状态（保存中/已保存/保存失败）
 */
function useAutoSave(
  nodeType: NodeType,
  formData: Record<string, unknown>,
  saveFn: (data: Record<string, unknown>) => Promise<void>,
  options?: { debounceMs?: number; enabled?: boolean }
): {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: string | null;
  forceSave: () => Promise<void>;
}
```

---

## 7. API 接口设计

### 7.1 基础配置

```typescript
// src/services/request.ts
import axios from 'axios';
import type { ApiResponse } from '@/types/common';

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：附加 Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data as ApiResponse;
    if (code !== 0) {
      // 业务错误
      return Promise.reject(new Error(message));
    }
    return data;
  },
  (error) => {
    // 网络错误、超时等
    return Promise.reject(error);
  }
);

export default request;
```

### 7.2 接口清单

#### 流程单接口 (flowService.ts)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/flows` | 获取流程单列表（分页 + 筛选） |
| GET | `/flows/:flowId` | 获取流程单详情 |
| POST | `/flows` | 创建班车（type: monthly/temporary） |

#### 应用接口 (appService.ts)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/flows/:flowId/apps` | 获取流程单下的应用列表（分页） |
| POST | `/flows/:flowId/apps` | 批量添加应用到流程单 |
| GET | `/flows/:flowId/apps/:appId` | 获取单 APK 详情（含节点 + 日志） |
| GET | `/apps/available` | 获取可添加的应用列表 |
| GET | `/apps/:appId/versions` | 获取应用可选版本号 |

#### 节点操作接口

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/nodes/:nodeId/data` | 获取节点表单数据 |
| PUT | `/nodes/:nodeId/draft` | 保存节点草稿（自动保存） |
| POST | `/nodes/:nodeId/submit` | 提交节点（流转到下一步） |
| POST | `/nodes/:nodeId/review` | 提交审核结果 |
| POST | `/nodes/:nodeId/rollback` | 回退到指定节点 |
| POST | `/nodes/:nodeId/collaborators` | 添加协作人 |
| DELETE | `/nodes/:nodeId/collaborators/:userId` | 移除协作人 |

#### 待办接口 (todoService.ts)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/todos` | 获取当前用户待办列表 |
| GET | `/todos/count` | 获取待办数量（用于 Badge） |

#### 看板接口 (dashboardService.ts)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/dashboard/shuttle` | 班车视角数据 |
| GET | `/dashboard/product` | 产品视角数据 |
| GET | `/dashboard/status` | 状态视角数据 |

#### 外部平台数据接口 (externalService.ts)

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/external/app-publish/:nodeId` | 获取应用上架节点的外部平台数据 |
| POST | `/external/app-publish/:nodeId/confirm` | 确认应用上架完成 |
| POST | `/external/app-publish/:nodeId/reject` | 拒绝应用上架（回退到指定节点） |
| GET | `/external/biz-test/:nodeId` | 获取业务内测节点的外部平台数据 |
| POST | `/external/biz-test/:nodeId/confirm` | 确认业务内测通过 |
| POST | `/external/biz-test/:nodeId/reject` | 业务内测拒绝（选择回退节点） |
| GET | `/external/gray-monitor/:nodeId` | 获取灰度监控节点数据 |
| POST | `/external/gray-monitor/:nodeId/complete` | 确认灰度监控完成（全流程结束） |
| POST | `/external/gray-monitor/:nodeId/rollback` | 灰度监控回退到指定节点 |

> **说明**：应用上架、业务内测、灰度监控三个节点的数据来源于外部平台，前端通过上述接口获取展示数据。Mock 阶段使用 MSW 模拟外部平台响应。

#### 版本号接口详细设计

```typescript
// GET /apps/:appId/versions?flowId=xxx
// 返回该应用所有可用版本号，标注当前班车内已使用的版本
interface AppVersionResponse {
  versions: AppVersion[];
}

interface AppVersion {
  versionCode: string;       // 如 "v2.1.0"
  versionName: string;       // 如 "2.1.0 (Build 1234)"
  apkUrl: string;            // 制品地址
  apkSize: number;           // 文件大小（字节）
  buildTime: string;         // 构建时间
  isUsedInCurrentFlow: boolean; // 当前班车内是否已被使用（用于冲突校验）
}

// 校验逻辑：前端在选择版本号时，过滤掉 isUsedInCurrentFlow=true 的选项
// 或标记为禁用并显示 Tooltip "该版本已在当前班车中使用"
```

#### 通用接口

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/options/countries` | 获取国家列表 |
| GET | `/options/brands` | 获取品牌列表 |
| GET | `/options/models?brands=Tecno,Infinix` | 获取机型列表（支持按品牌逗号分隔筛选） |
| GET | `/options/android-versions` | 获取安卓版本列表 |
| GET | `/options/tos-versions?androidVersions=14,15,16` | 获取 tOS 版本列表（按安卓版本逗号分隔联动筛选，取并集） |
| GET | `/options/categories` | 获取应用分类列表 |
| GET | `/options/keywords/:langCode` | 获取指定语言关键词 |
| POST | `/upload` | 文件上传 |
| GET | `/users/current` | 获取当前用户信息 |

---

## 8. Mock 数据方案

### 8.1 MSW 初始化

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

```typescript
// src/main.tsx
async function bootstrap() {
  // 仅在开发环境启动 MSW
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // 放行未匹配的请求
    });
  }

  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<App />);
}

bootstrap();
```

### 8.2 Mock 数据设计

#### 8.2.1 用户数据

```typescript
// src/mocks/data/users.ts
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

// 默认当前登录用户
export const currentUser = mockUsers[0]; // 张三
```

#### 8.2.2 班车/流程单数据

```typescript
// src/mocks/data/flows.ts
export const mockFlows: FlowRecord[] = [
  {
    id: 'FLOW-001',
    name: '3月班车 20260301120000',
    shuttleType: 'monthly',
    applicantId: 'U001',
    applicant: '张三',
    createdAt: '2026-03-01T12:00:00Z',
    statusSummary: { total: 5, success: 2, processing: 2, rejected: 1 },
  },
  {
    id: 'FLOW-002',
    name: '3月临时班车01 20260305100000',
    shuttleType: 'temporary',
    applicantId: 'U001',
    applicant: '张三',
    createdAt: '2026-03-05T10:00:00Z',
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
  {
    id: 'FLOW-003',
    name: '2月班车 20260201080000',
    shuttleType: 'monthly',
    applicantId: 'U009',
    applicant: '钱十一',
    createdAt: '2026-02-01T08:00:00Z',
    statusSummary: { total: 8, success: 8, processing: 0, rejected: 0 },
  },
  // ... 更多数据覆盖分页场景
];
```

#### 8.2.3 应用卡片数据

覆盖 7 个节点 × 4 种状态的组合：

```typescript
// src/mocks/data/apps.ts
export const mockApps: AppRecord[] = [
  {
    id: 'APP-001',
    flowId: 'FLOW-001',
    appIcon: '/mock/icons/weather.png',
    appName: 'Weather Pro',
    packageName: 'com.transsion.weather',
    appType: 'Weather',
    versionCode: 'v2.1.0',
    currentNode: 'gray_monitor',
    currentNodeStatus: 'completed',
    operator: '郑十',
    createdAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'APP-002',
    flowId: 'FLOW-001',
    appName: 'HiOS Launcher',
    packageName: 'com.transsion.launcher',
    appType: 'Entertainment',
    versionCode: 'v5.0.1',
    currentNode: 'channel_review',
    currentNodeStatus: 'processing',
    operator: '李四',
    createdAt: '2026-03-02T09:00:00Z',
    appIcon: '/mock/icons/launcher.png',
  },
  {
    id: 'APP-003',
    flowId: 'FLOW-001',
    appName: 'Palm Store',
    packageName: 'com.transsion.store',
    appType: 'Shopping',
    versionCode: 'v3.2.0',
    currentNode: 'material_upload',
    currentNodeStatus: 'rejected',
    operator: '张三',
    rejectReason: '物料审核不通过：应用截图尺寸不符合要求，请修改后重新提交',
    createdAt: '2026-03-01T16:00:00Z',
    appIcon: '/mock/icons/store.png',
  },
  {
    id: 'APP-004',
    flowId: 'FLOW-001',
    appName: 'Smart Finance',
    packageName: 'com.transsion.finance',
    appType: 'Finance',
    versionCode: 'v1.5.0',
    currentNode: 'biz_test',
    currentNodeStatus: 'processing',
    operator: '吴九',
    createdAt: '2026-03-03T11:00:00Z',
    appIcon: '/mock/icons/finance.png',
  },
  {
    id: 'APP-005',
    flowId: 'FLOW-001',
    appName: 'EDU Learn',
    packageName: 'com.transsion.edu',
    appType: 'Education',
    versionCode: 'v4.0.0',
    currentNode: 'channel_apply',
    currentNodeStatus: 'rejected',
    operator: '张三',
    rejectReason: '通道发布审核不通过：版本号与已上架版本冲突，请更换版本',
    createdAt: '2026-03-04T10:00:00Z',
    appIcon: '/mock/icons/edu.png',
  },
  // ... 更多应用数据覆盖所有节点 × 状态组合
];
```

#### 8.2.4 7 节点 Mock 数据

每个节点都需要对应的表单数据和处理逻辑：

```typescript
// src/mocks/data/nodes.ts

/** 通道发布申请 — 完整填写的 Mock 数据 */
export const mockChannelApplyData: ChannelApplyFormData = {
  publishPurpose: '新增天气预警功能，覆盖全球主要市场',
  appName: 'Weather Pro',
  packageName: 'com.transsion.weather',
  appType: 'Weather',
  versionCode: 'v2.1.0',
  apkUrl: 'https://artifacts.internal/weather-pro-2.1.0.apk',
  testReport: 'https://docs.internal/test-report-weather-2.1.0.pdf',
  appCategory: 'weather',
  isSystemApp: false,
  publishCountry: { type: 'exclude', values: ['IN'] },
  publishBrand: { type: 'all', values: [] },
  publishModel: { type: 'include', values: ['X6841_H6941', 'X6858_H8917'] },
  testModel: { type: 'include', values: ['X6841_H6941'] },
  androidVersion: { type: 'include', values: ['14', '15', '16'] },
  tosVersion: { type: 'include', values: ['tOS 16.1.0', 'tOS 15.2.0'] },
  filterIndia: true,
  isPaUpdate: true,
  grayScale: 50000,
  effectiveTimeRange: ['2026-03-15', '2026-04-15'],
  materials: [
    {
      langCode: 'en',
      langName: 'English',
      appNameI18n: 'Weather Pro',
      shortDesc: 'Your smart weather companion',
      productDetail: 'Weather Pro provides accurate weather forecasts...',
      updateNote: 'Added severe weather alerts and new widgets',
      keywords: ['weather', 'forecast', 'alerts'],
      iconUrl: '/mock/materials/weather-icon.png',
      topImageUrl: '/mock/materials/weather-top.png',
      screenshotUrls: [
        '/mock/materials/weather-ss1.png',
        '/mock/materials/weather-ss2.png',
        '/mock/materials/weather-ss3.png',
      ],
    },
  ],
  isGpPublish: false,
};

/** 通道发布审核 — 运营通过，老板部分签批 */
export const mockChannelReviewData = {
  opsReview: {
    reviewerId: 'U002',
    reviewerName: '李四',
    result: 'approved' as const,
    comment: '',
    reviewTime: '2026-03-02T10:30:00Z',
  },
  bossReviews: [
    {
      reviewerId: 'U003',
      reviewerName: '王五',
      result: 'approved' as const,
      comment: '同意发布',
      reviewTime: '2026-03-02T14:00:00Z',
    },
    {
      reviewerId: 'U004',
      reviewerName: '赵六',
      result: null, // 待签批
      comment: '',
      reviewTime: null,
    },
  ],
};

/** 灰度监控 Mock 数据 */
export const mockGrayMonitorTableData: GrayMonitorData[] = [
  {
    appName: 'Weather Pro',
    packageName: 'com.transsion.weather',
    taskName: 'Weather Pro v2.1.0 灰度发布',
    effectiveTime: '2026/03/15-2026/04/15',
    grayScale: '25000/50000',
    status: '进行中',
    createdAt: '2026-03-15T00:00:00Z',
  },
];
```

#### 8.2.5 待办数据

```typescript
// src/mocks/data/todos.ts
export const mockTodos: TodoItem[] = [
  {
    id: 'TODO-001',
    flowId: 'FLOW-001',
    appId: 'APP-002',
    shuttleName: '3月班车',
    appName: 'HiOS Launcher',
    currentNode: 'channel_review',
    currentNodeName: '通道发布审核',
    currentNodeStatus: 'processing',
    handler: '李四',
    createdAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'TODO-002',
    flowId: 'FLOW-001',
    appId: 'APP-003',
    shuttleName: '3月班车',
    appName: 'Palm Store',
    currentNode: 'material_upload',
    currentNodeName: '物料上传',
    currentNodeStatus: 'rejected',
    handler: '张三',
    rejectReason: '物料审核不通过：应用截图尺寸不符合要求',
    createdAt: '2026-03-06T08:00:00Z',
  },
  {
    id: 'TODO-003',
    flowId: 'FLOW-001',
    appId: 'APP-004',
    shuttleName: '3月班车',
    appName: 'Smart Finance',
    currentNode: 'biz_test',
    currentNodeName: '业务内测',
    currentNodeStatus: 'processing',
    handler: '吴九',
    createdAt: '2026-03-07T10:00:00Z',
  },
];
```

#### 8.2.6 看板数据

```typescript
// src/mocks/data/dashboards.ts
export const mockShuttleView: ShuttleViewItem[] = [
  {
    shuttleId: 'FLOW-001',
    shuttleName: '3月班车',
    month: '2026-03',
    products: ['Weather Pro', 'HiOS Launcher', 'Palm Store', 'Smart Finance', 'EDU Learn'],
    productCount: 5,
    completionRate: 40,
    statusSummary: { total: 5, success: 2, processing: 2, rejected: 1 },
  },
  {
    shuttleId: 'FLOW-002',
    shuttleName: '3月临时班车01',
    month: '2026-03',
    products: ['Boomplay', 'Phoenix Browser', 'CarlCare'],
    productCount: 3,
    completionRate: 0,
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
];

export const mockStatusView: StatusViewItem = {
  processing: [
    {
      appId: 'APP-002', appName: 'HiOS Launcher', appIcon: '/mock/icons/launcher.png',
      flowId: 'FLOW-001', shuttleName: '3月班车',
      currentNode: '通道发布审核', currentNodeStatus: 'processing',
      updatedAt: '2026-03-02T09:00:00Z',
    },
    {
      appId: 'APP-004', appName: 'Smart Finance', appIcon: '/mock/icons/finance.png',
      flowId: 'FLOW-001', shuttleName: '3月班车',
      currentNode: '业务内测', currentNodeStatus: 'processing',
      updatedAt: '2026-03-07T10:00:00Z',
    },
  ],
  completed: [
    {
      appId: 'APP-001', appName: 'Weather Pro', appIcon: '/mock/icons/weather.png',
      flowId: 'FLOW-001', shuttleName: '3月班车',
      currentNode: '灰度监控', currentNodeStatus: 'completed',
      updatedAt: '2026-03-10T16:00:00Z',
    },
  ],
  failed: [
    {
      appId: 'APP-005', appName: 'EDU Learn', appIcon: '/mock/icons/edu.png',
      flowId: 'FLOW-001', shuttleName: '3月班车',
      currentNode: '通道发布申请', currentNodeStatus: 'rejected',
      updatedAt: '2026-03-04T10:00:00Z',
    },
  ],
};
```

### 8.3 MSW Handler 示例

```typescript
// src/mocks/handlers/flowHandlers.ts
import { http, HttpResponse } from 'msw';
import { mockFlows } from '../data/flows';

export const flowHandlers = [
  // 获取流程单列表
  http.get('/api/v1/flows', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const name = url.searchParams.get('name') || '';
    const status = url.searchParams.get('status') || '';

    let filtered = [...mockFlows];

    // 筛选
    if (name) {
      filtered = filtered.filter((f) => f.name.includes(name));
    }
    if (status) {
      filtered = filtered.filter((f) => {
        if (status === 'processing') return f.statusSummary.processing > 0;
        if (status === 'completed') return f.statusSummary.success === f.statusSummary.total;
        if (status === 'rejected') return f.statusSummary.rejected > 0;
        return true;
      });
    }

    // 分页
    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total: filtered.length,
        page,
        pageSize,
      },
    });
  }),

  // 创建班车
  http.post('/api/v1/flows', async ({ request }) => {
    const body = (await request.json()) as { type: string };

    // 校验当月班车是否已存在
    if (body.type === 'monthly') {
      const month = new Date().getMonth() + 1;
      const exists = mockFlows.some(
        (f) => f.shuttleType === 'monthly' && f.name.startsWith(`${month}月班车`)
      );
      if (exists) {
        return HttpResponse.json({
          code: 1001,
          message: '本月班车已创建',
          data: null,
        });
      }
    }

    const newFlow: FlowRecord = {
      id: `FLOW-${Date.now()}`,
      name: generateShuttleName(body.type as ShuttleType),
      shuttleType: body.type as ShuttleType,
      applicantId: 'U001',
      applicant: '张三',
      createdAt: new Date().toISOString(),
      statusSummary: { total: 0, success: 0, processing: 0, rejected: 0 },
    };

    mockFlows.unshift(newFlow);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: newFlow,
    });
  }),

  // 获取流程单详情
  http.get('/api/v1/flows/:flowId', ({ params }) => {
    const flow = mockFlows.find((f) => f.id === params.flowId);
    if (!flow) {
      return HttpResponse.json({ code: 404, message: '流程单不存在', data: null });
    }
    return HttpResponse.json({ code: 0, message: 'success', data: flow });
  }),
];
```

### 8.4 Mock 场景覆盖矩阵

| 场景编号 | 场景描述 | 涉及数据 |
|----------|----------|----------|
| M-SH-01 | 空列表 | 无流程单 |
| M-SH-02 | 当月班车已存在，创建被拒 | 校验逻辑 |
| M-SH-03 | 多条临时班车，序号递增 | 3月临时班车01、02 |
| M-SH-04 | 混合状态列表 | 包含全部完成、部分失败、全部进行中 |
| M-APP-01~07 | 应用卡片各场景 | 空/少量/标准分页/大量/同应用多版本/各节点状态/拒绝回退 |
| M-CA-01~07 | 通道发布申请表单场景 | 空表单/部分填写/完整填写/被拒绝/已完成只读/多语言/版本冲突 |
| M-RV-01~07 | 审核流程场景 | 运营通过/拒绝、老板部分签/全通过/拒绝、物料审核通过/拒绝 |
| M-PB-01~06 | 后续节点场景 | 上架进行中/内测通过/内测拒绝回退/灰度监控中/完成/异常 |
| M-TD-01~04 | 待办场景 | 无待办/多条待办/拒绝待处理/协作人待办 |
| M-KB-01~04 | 看板场景 | 班车视角空/正常、产品视角多应用、状态视角看板 |

---

## 9. 开发规范

### 9.1 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `StatusTag.tsx`, `FlowDetail/index.tsx` |
| Hook 文件 | camelCase，use 前缀 | `useWorkbench.ts`, `useAutoSave.ts` |
| 工具文件 | camelCase | `format.ts`, `validate.ts` |
| 样式文件 | CSS Modules, `.module.css` | `index.module.css` |
| 常量 | UPPER_SNAKE_CASE | `NODE_STATUS_MAP`, `MAX_SCREENSHOT_COUNT` |
| 接口/类型 | PascalCase, I 前缀可选 | `FlowRecord`, `ApiResponse<T>` |
| 枚举 | PascalCase | `NodeType`, `NodeStatus` |
| Store | camelCase，use 前缀 + Store 后缀 | `useFlowStore`, `useTodoStore` |
| Service | camelCase + Service 后缀 | `flowService`, `appService` |

### 9.2 组件开发规范

```typescript
// 组件结构模板
import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import styles from './index.module.css';

interface MyComponentProps {
  /** 属性说明 */
  title: string;
  onAction?: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  // 1. Hooks（状态、副作用）
  const [visible, setVisible] = useState(false);

  // 2. 事件处理
  const handleClick = useCallback(() => {
    setVisible(true);
    onAction?.();
  }, [onAction]);

  // 3. 渲染
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <button onClick={handleClick}>操作</button>
    </div>
  );
};

export default MyComponent;
```

### 9.3 Git 规范

#### 分支策略

| 分支 | 说明 |
|------|------|
| `main` | 稳定发布分支 |
| `develop` | 开发集成分支 |
| `feature/xxx` | 功能分支 |
| `fix/xxx` | 修复分支 |

#### Commit 规范

```
<type>(<scope>): <subject>

type: feat | fix | refactor | style | docs | test | chore
scope: workbench | flow-detail | app-flow | dashboard | component | mock | config
```

示例：
```
feat(workbench): 实现申请列表 Table 和筛选功能
feat(component): 新增 TypeSelector 组件
fix(mock): 修复班车创建重复校验逻辑
```

### 9.4 目录别名配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 9.5 代码质量

```json
// .eslintrc.json 关键规则
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 10. 构建与部署

### 10.1 脚本命令

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src"
  }
}
```

### 10.2 环境变量

```bash
# .env.development
VITE_API_BASE_URL=/api/v1
VITE_ENABLE_MOCK=true

# .env.production
VITE_API_BASE_URL=https://api.iapsys.internal/v1
VITE_ENABLE_MOCK=false
```

### 10.3 依赖清单

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.22.0",
    "antd": "^5.15.0",
    "@ant-design/icons": "^5.3.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.0",
    "axios": "^1.7.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "msw": "^2.2.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.0"
  }
}
```

### 10.4 开发里程碑

| 阶段 | 内容 | 预计页面/组件 |
|------|------|--------------|
| **P1 — 基础框架** | 项目初始化、路由、布局、主题配置、MSW 搭建 | MainLayout, 路由配置 |
| **P2 — 工作台** | 申请列表 + 筛选 + 分页 + 创建班车 + 待办面板 | Workbench, FlowTable, CreateShuttleModal, TodoPanel, TodoCard, StatusTag |
| **P3 — 流程单详情** | 基础信息 + 应用卡片列表 + 添加应用 | FlowDetail, FlowBaseInfo, AppCardList, AppCard, AddAppModal |
| **P4 — APK 发布详情** | 应用信息 + 流程步骤条 + 操作记录 | AppFlowDetail, AppBaseInfo, ProcessSteps, OperationHistory |
| **P5 — 流程节点 Modal (1)** | 通道发布申请 + 通道发布审核 | ChannelApplyModal, ChannelReviewModal, TypeSelector, LanguageTabForm, ImageUploader, ReviewPanel |
| **P6 — 流程节点 Modal (2)** | 物料上传 + 物料审核 + 应用上架 | MaterialUploadModal, MaterialReviewModal, AppPublishModal |
| **P7 — 流程节点 Modal (3)** | 业务内测 + 灰度监控 + 回退逻辑 | BizTestModal, GrayMonitorModal |
| **P8 — 看板** | 班车视角 + 产品视角 + 状态视角 | Dashboard, ShuttleView, ProductView, StatusView, KanbanBoard |
| **P9 — 联调与优化** | 全流程联调、响应式、自动保存、异常处理 | useAutoSave, 错误边界, 响应式适配 |

---

## 附录 A：流程节点 Modal 详细设计

### A.1 应用上架 Modal (AppPublishModal)

**触发条件**：节点5（app_publish）为 processing 状态时可操作

**数据来源**：GET `/external/app-publish/:nodeId`

**Modal 布局**：

```
+-----------------------------------------------------------+
| 应用上架                                            [×]    |
+-----------------------------------------------------------+
| [操作区域 — 固定顶部不随滚动]                              |
| [确认上架完成]  [拒绝（回退）]                              |
+-----------------------------------------------------------+
|                                                           |
| 📋 外部平台数据                                            |
| +-------------------------------------------------------+ |
| | Table                                                  | |
| | 状态 | 应用名称 | 升级任务名称 | 包名 | 发布国家 | ... | |
| | 生效中 | Weather Pro | ... | com.xx | NG,KE | ...     | |
| +-------------------------------------------------------+ |
|                                                           |
| 当被业务内测拒绝回退时显示：                                |
| ⚠ Alert: "业务内测拒绝回退，已刷新最新数据"                 |
|                                                           |
+-----------------------------------------------------------+
| [取消]  [确认上架完成]                                      |
+-----------------------------------------------------------+
```

**Table 列定义**：

| 列名 | 字段 | 宽度 |
|------|------|------|
| 状态 | status | 80px，Tag 展示（生效中=绿色，已停用=红色） |
| 应用名称 | appName | 120px |
| 升级任务名称 | taskName | 150px |
| 应用包名 | packageName | 180px |
| 发布国家 | publishCountry | 100px |
| 品牌 | brand | 80px |
| 机型 | model | 100px |
| 语言 | language | 80px |
| 安卓版本号 | androidVersion | 100px |
| tOS版本 | tosVersion | 100px |
| 灰度量级 | grayScale | 100px |
| 分类 | category | 100px |
| 生效时间 | effectiveTime | 200px |

**操作逻辑**：

```typescript
interface AppPublishModalProps {
  nodeId: string;
  nodeStatus: NodeStatus;
  onClose: () => void;
  onRefresh: () => void;
}

// 确认上架完成
const handleConfirm = async () => {
  await externalService.confirmAppPublish(nodeId);
  message.success('应用上架确认成功');
  onRefresh();
  onClose();
};

// 拒绝（回退）— 显示拒绝表单
const handleReject = async (data: { reason: string }) => {
  await externalService.rejectAppPublish(nodeId, {
    reason: data.reason,
  });
  message.success('已回退');
  onRefresh();
  onClose();
};
```

**只读模式**：当 nodeStatus 为 completed 时，隐藏操作按钮，仅展示数据。

---

### A.2 业务内测 Modal (BizTestModal)

**触发条件**：节点6（biz_test）为 processing 状态时可操作

**数据来源**：GET `/external/biz-test/:nodeId`

**Modal 布局**：

```
+-----------------------------------------------------------+
| 业务内测                                            [×]    |
+-----------------------------------------------------------+
| [操作区域 — 固定顶部不随滚动]                              |
| 内测结果：(○ 通过)  (○ 不通过)                              |
| --- 选择"不通过"时展开 ---                                  |
| 回退节点：(○ 通道发布申请)  (○ 物料上传) (○ 应用上架)       |
| 拒绝原因：[________________________]（必填）               |
| [提交审核结果]                                              |
+-----------------------------------------------------------+
|                                                           |
| 📋 外部平台内测数据                                        |
| +-------------------------------------------------------+ |
| | Table (同应用上架字段)                                  | |
| | 状态 | 应用名称 | 升级任务名称 | 包名 | ...            | |
| +-------------------------------------------------------+ |
|                                                           |
+-----------------------------------------------------------+
| [取消]  [提交]                                              |
+-----------------------------------------------------------+
```

**操作逻辑**：

```typescript
interface BizTestModalProps {
  nodeId: string;
  nodeStatus: NodeStatus;
  rejectReason?: string; // 若节点被后续节点拒绝
  onClose: () => void;
  onRefresh: () => void;
}

interface BizTestSubmitData {
  action: 'approve' | 'reject';
  rollbackTarget?: 'channel_apply' | 'material_upload' | 'app_publish';
  reason?: string;
}

// 提交内测结果
const handleSubmit = async (data: BizTestSubmitData) => {
  if (data.action === 'approve') {
    await externalService.confirmBizTest(nodeId);
    message.success('业务内测通过，流程已流转到灰度监控');
  } else {
    if (!data.rollbackTarget || !data.reason) {
      message.error('请选择回退节点并填写拒绝原因');
      return;
    }
    await externalService.rejectBizTest(nodeId, {
      targetNode: data.rollbackTarget,
      reason: data.reason,
    });
    message.success(`已回退到"${NODE_CONFIG[data.rollbackTarget].name}"`);
  }
  onRefresh();
  onClose();
};
```

**回退逻辑说明**：
- 选择"通道发布申请"：基础信息有误，需求方重新填写
- 选择"物料上传"：物料有误，物料上传者重新上传
- 选择"应用上架"：上架配置有误，上架操作员重新操作

**只读模式**：当 nodeStatus 为 completed 时，隐藏操作区域，仅展示数据。

---

### A.3 灰度监控 Modal (GrayMonitorModal)

**触发条件**：节点7（gray_monitor）为 processing 状态时可操作

**数据来源**：GET `/external/gray-monitor/:nodeId`

**Modal 布局**：

```
+-----------------------------------------------------------+
| 灰度监控                                            [×]    |
+-----------------------------------------------------------+
| [操作区域 — 固定顶部不随滚动]                              |
| [确认完成]  [回退]                                          |
+-----------------------------------------------------------+
|                                                           |
| 📋 灰度监控数据                                            |
| +-------------------------------------------------------+ |
| | Table                                                  | |
| | 应用名称 | 包名 | 任务名称 | 生效时间 | 灰度量级 | ... | |
| | Weather Pro | com.xx | ... | 03/15-04/15 | 25k/50k  | | |
| +-------------------------------------------------------+ |
|                                                           |
| --- 点击"回退"时展开回退表单 ---                            |
| 回退节点：                                                 |
| (○ 通道发布申请) (○ 物料上传) (○ 应用上架) (○ 业务内测)    |
| 回退原因：[________________________]（必填）               |
|                                                           |
| 异常状态时显示：                                            |
| ❌ Alert(error): "灰度监控异常：[异常原因]"                 |
|                                                           |
+-----------------------------------------------------------+
| [取消]  [确认完成] / [提交回退]                              |
+-----------------------------------------------------------+
```

**灰度监控 Table 列定义**：

| 列名 | 字段 | 宽度 | 说明 |
|------|------|------|------|
| 应用名称 | appName | 120px | |
| 应用包名 | packageName | 180px | |
| 任务名称 | taskName | 150px | |
| 生效时间 | effectiveTime | 200px | 格式 yyyy/mm/dd-yyyy/mm/dd |
| 灰度量级 | grayScale | 120px | 格式 "25000/50000 现状/总计" |
| 状态 | status | 80px | 进行中=蓝色Tag，已停用=红色Tag |
| 创建时间 | createdAt | 160px | |

**操作逻辑**：

```typescript
interface GrayMonitorModalProps {
  nodeId: string;
  nodeStatus: NodeStatus;
  onClose: () => void;
  onRefresh: () => void;
}

interface GrayMonitorRollbackSubmit {
  targetNode: 'channel_apply' | 'material_upload' | 'app_publish' | 'biz_test';
  reason: string;
}

// 确认灰度完成（全流程结束）
const handleComplete = async () => {
  Modal.confirm({
    title: '确认完成灰度监控',
    content: '确认后该应用发布流程将全部完成，是否继续？',
    onOk: async () => {
      await externalService.completeGrayMonitor(nodeId);
      message.success('灰度监控完成，应用发布流程已全部完成');
      onRefresh();
      onClose();
    },
  });
};

// 回退操作
const handleRollback = async (data: GrayMonitorRollbackSubmit) => {
  if (!data.targetNode || !data.reason) {
    message.error('请选择回退节点并填写原因');
    return;
  }
  await externalService.rollbackGrayMonitor(nodeId, data);
  message.success(`已回退到"${NODE_CONFIG[data.targetNode].name}"`);
  onRefresh();
  onClose();
};
```

**异常状态处理**：
- 灰度监控失败时，nodeStatus 变为 `rejected`
- 显示红色 Alert 展示失败原因
- 自动展开回退表单，引导用户选择回退节点

**只读模式**：当 nodeStatus 为 completed 时，仅展示灰度数据，隐藏所有操作按钮。

---

## 附录 B：版本号选择联动逻辑

### B.1 添加应用 Modal (AddAppModal)

添加应用时**不选择版本号**，仅选择应用本身：

```typescript
// AddAppModal 选择的数据结构
interface AddAppSelection {
  appId: string;       // 应用库中的应用ID
  appName: string;
  packageName: string;
  appType: string;
  appIcon: string;
}

// 一个应用可重复添加（后续在通道发布申请中选择不同版本号）
```

### B.2 通道发布申请中的版本号选择

```typescript
// ChannelApplyModal 中版本号选择逻辑
const VersionSelect: FC<{ appId: string; flowId: string }> = ({ appId, flowId }) => {
  // 1. 获取可选版本列表
  const { data: versions } = useQuery({
    queryKey: ['app-versions', appId, flowId],
    queryFn: () => appService.getAppVersions(appId, flowId),
  });

  // 2. 过滤已在当前班车使用的版本（标记为禁用）
  const options = versions?.map(v => ({
    label: `${v.versionCode} (${v.versionName})`,
    value: v.versionCode,
    disabled: v.isUsedInCurrentFlow,
    // 禁用项显示 Tooltip
    title: v.isUsedInCurrentFlow ? '该版本已在当前班车中使用' : undefined,
  }));

  // 3. 选择版本后自动带出 APK 地址
  const handleVersionChange = (versionCode: string) => {
    const selected = versions?.find(v => v.versionCode === versionCode);
    if (selected) {
      form.setFieldsValue({
        versionCode: selected.versionCode,
        apkUrl: selected.apkUrl,
      });
    }
  };

  return (
    <Select
      showSearch
      placeholder="请选择应用版本号"
      options={options}
      onChange={handleVersionChange}
      filterOption={(input, option) =>
        (option?.label as string).toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};
```

### B.3 版本号冲突校验规则

1. **同一班车内**，同一包名（packageName）不允许选择相同的版本号
2. 通过 API 参数 `flowId` 传递当前班车ID，后端返回 `isUsedInCurrentFlow` 标记
3. 前端在 Select 组件中将已使用的版本标记为 `disabled`
4. 提交时后端再次校验，防止并发冲突

---

*文档结束*
