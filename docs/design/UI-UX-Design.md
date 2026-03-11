# IAPSYS 独立应用发布系统 — UI/UX 设计文档

> 版本：v1.0.0
> 技术栈：React 18 + Ant Design 5.x
> 最后更新：2026-03-09

---

## 目录

1. [设计概述](#1-设计概述)
2. [信息架构](#2-信息架构)
3. [页面设计详细规范](#3-页面设计详细规范)
4. [交互设计规范](#4-交互设计规范)
5. [自定义组件设计清单](#5-自定义组件设计清单)
6. [响应式设计](#6-响应式设计)

---

## 1. 设计概述

### 1.1 设计原则

| 原则 | 说明 | 落地策略 |
|------|------|----------|
| **高效** | 减少用户操作步骤，让发布流程一目了然 | 信息聚合展示、批量操作、快捷入口 |
| **清晰** | 状态可辨、层级分明、数据可读 | 颜色编码、面包屑导航、分步流程条 |
| **一致** | 全局统一的视觉语言与交互模式 | 基于 Ant Design 组件库统一封装 |
| **可控** | 用户对每一步操作拥有明确的预期与反馈 | 操作确认、状态反馈、错误恢复 |

### 1.2 设计风格定义

- **整体风格**：企业级后台管理风格，简洁专业，以信息密度与操作效率为核心
- **视觉调性**：冷色调为主（蓝灰体系），留白适中，卡片化信息承载
- **图标风格**：采用 Ant Design 内置 `@ant-design/icons` 线性图标，保持一致性
- **阴影层级**：使用 Ant Design 标准阴影 Token（`boxShadow`, `boxShadowSecondary`）

### 1.3 颜色规范

#### 系统语义色

| 语义 | 色值 | Ant Design Token | 使用场景 |
|------|------|-----------------|----------|
| 主色调 | `#1890FF` | `colorPrimary` | 主按钮、链接、选中态、进行中状态 |
| 成功/完成 | `#52C41A` | `colorSuccess` | 完成状态Tag、成功提示、通过标记 |
| 拒绝/失败 | `#FF4D4F` | `colorError` | 拒绝状态Tag、错误提示、必填标记 |
| 警告 | `#FAAD14` | `colorWarning` | 警告提示、注意事项 |
| 进行中 | `#1890FF` | `colorInfo` | 进行中状态Tag、信息提示 |
| 总数/默认 | `#000000` | `colorText` | 总数统计数字、正文文字 |
| 未开始 | `#D9D9D9` | `colorBorder` | 未开始状态Tag、禁用态 |

#### 中性色阶

| 用途 | 色值 | Token |
|------|------|-------|
| 标题文字 | `#000000` | `colorText` |
| 正文文字 | `rgba(0,0,0,0.85)` | `colorText` |
| 辅助文字 | `rgba(0,0,0,0.45)` | `colorTextSecondary` |
| 禁用文字 | `rgba(0,0,0,0.25)` | `colorTextDisabled` |
| 页面背景 | `#F0F2F5` | `colorBgLayout` |
| 组件背景 | `#FFFFFF` | `colorBgContainer` |
| 分割线 | `#F0F0F0` | `colorBorderSecondary` |

### 1.4 Ant Design 主题配置方案

```typescript
// src/theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    // 品牌色
    colorPrimary: '#1890FF',
    colorSuccess: '#52C41A',
    colorError: '#FF4D4F',
    colorWarning: '#FAAD14',
    colorInfo: '#1890FF',

    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // 字体
    fontSize: 14,
    fontSizeHeading1: 20,
    fontSizeHeading2: 18,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    fontSizeSM: 12,

    // 间距（8px 网格系统）
    margin: 16,
    marginSM: 8,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingSM: 8,
    paddingLG: 24,

    // 布局
    colorBgLayout: '#F0F2F5',
    colorBgContainer: '#FFFFFF',

    // 控件尺寸
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      headerHeight: 56,
      headerPadding: '0 24px',
    },
    Menu: {
      itemHeight: 56,
    },
    Table: {
      headerBg: '#FAFAFA',
      rowHoverBg: '#F5F5F5',
    },
    Card: {
      paddingLG: 16,
    },
    Modal: {
      paddingContentHorizontalLG: 24,
    },
  },
};

export default themeConfig;
```

### 1.5 字体规范

| 层级 | 字号 | 字重 | 行高 | 使用场景 |
|------|------|------|------|----------|
| H1 页面标题 | 20px | 600 (Semi-Bold) | 28px | 页面主标题 |
| H2 区域标题 | 18px | 600 | 26px | 卡片标题、区域标题 |
| H3 模块标题 | 16px | 500 (Medium) | 24px | Modal标题、Tab标题 |
| H4 小标题 | 14px | 500 | 22px | 表格列头、表单Label |
| 正文 | 14px | 400 (Regular) | 22px | 正文内容、输入框文字 |
| 辅助文字 | 12px | 400 | 20px | 说明文字、时间戳、包名 |

**字体族**：`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`

### 1.6 间距系统

基于 **8px 网格系统**：

| Token | 值 | 使用场景 |
|-------|-----|---------|
| `space-xs` | 4px | 图标与文字间距、紧凑元素内边距 |
| `space-sm` | 8px | 相关元素间距、小型组件内边距 |
| `space-md` | 16px | 标准组件间距、卡片内边距 |
| `space-lg` | 24px | 区域间距、页面内边距 |
| `space-xl` | 32px | 大区块间距 |
| `space-xxl` | 48px | 页面顶部/底部留白 |

---

## 2. 信息架构

### 2.1 页面层级关系

```
IAPSYS 独立应用发布系统
├── 全局导航（Header）
│   ├── Logo + 系统名称
│   ├── 一级导航菜单
│   │   ├── 工作台
│   │   └── 看板
│   └── 用户区域
│       ├── 通知铃铛（Badge）
│       └── 用户头像 + 下拉菜单
│
├── 工作台模块 (/workbench)
│   ├── 申请列表区域（主内容区）
│   │   ├── 搜索筛选工具栏
│   │   ├── 申请列表 Table
│   │   └── 创建班车 Modal
│   ├── 待办面板（右侧 Sider）
│   │   ├── 搜索框
│   │   └── 待办卡片列表
│   │
│   ├── 流程单详情页 (/workbench/flow/:id)
│   │   ├── 基础信息 Descriptions
│   │   ├── 应用卡片列表
│   │   └── 添加应用 Modal
│   │
│   └── 单 APK 发布流程详情页 (/workbench/flow/:id/app/:appId)
│       ├── 应用基本信息区
│       ├── 流程节点条 Steps（7 个节点）
│       │   ├── 通道发布申请 Modal
│       │   ├── 通道发布审核 Modal
│       │   ├── 物料上传 Modal
│       │   ├── 物料审核 Modal
│       │   ├── 应用上架 Modal
│       │   ├── 业务内测 Modal
│       │   └── 灰度监控 Modal
│       └── 历史操作记录 Table
│
└── 看板模块 (/dashboard)
    ├── 班车视角 Tab
    ├── 产品视角 Tab
    └── 状态视角 Tab（看板拖拽）
```

### 2.2 路由结构设计

```typescript
// src/router/routes.ts
const routes = [
  {
    path: '/',
    redirect: '/workbench',
  },
  {
    path: '/workbench',
    name: '工作台',
    component: '@/pages/Workbench',
    children: [
      {
        path: '/workbench/flow/:id',
        name: '流程单详情',
        component: '@/pages/FlowDetail',
      },
      {
        path: '/workbench/flow/:id/app/:appId',
        name: 'APK发布详情',
        component: '@/pages/AppFlowDetail',
      },
    ],
  },
  {
    path: '/dashboard',
    name: '看板',
    component: '@/pages/Dashboard',
  },
];
```

### 2.3 用户操作主路径

**路径一：创建发布申请**

```
工作台 → 点击"发起申请" → 选择班车类型 → 进入流程单详情
→ 添加应用 → 进入 APK 详情 → 填写通道发布申请表单 → 提交
```

**路径二：处理待办**

```
工作台 → 右侧待办面板 → 点击"去处理" → 跳转至 APK 详情页
→ 点击对应流程节点 → 打开操作 Modal → 执行操作 → 提交
```

**路径三：查看看板**

```
看板 → 选择视角Tab → 查看整体进度 → 点击卡片跳转到具体流程单
```

---

## 3. 页面设计详细规范

### 3.1 全局布局

#### 布局结构

```
+----------------------------------------------------------+
|  Header (56px)                                           |
|  [Logo IAPSYS]  [工作台] [看板]        [通知🔔] [用户▼]  |
+----------------------------------------------------------+
|                                                          |
|  Content (calc(100vh - 56px))                            |
|  padding: 24px                                           |
|  background: #F0F2F5                                     |
|                                                          |
+----------------------------------------------------------+
```

#### Ant Design 组件映射

```tsx
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
const { Header, Content } = Layout;

<Layout style={{ minHeight: '100vh' }}>
  {/* 顶部导航栏 */}
  <Header style={{
    background: '#fff',
    borderBottom: '1px solid #F0F0F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  }}>
    {/* 左侧：Logo + 系统名称 + 导航 */}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} style={{ height: 32, marginRight: 12 }} />
      <span style={{ fontSize: 18, fontWeight: 600, marginRight: 48 }}>
        IAPSYS
      </span>
      <Menu
        mode="horizontal"
        selectedKeys={[currentPath]}
        items={[
          { key: '/workbench', label: '工作台' },
          { key: '/dashboard', label: '看板' },
        ]}
      />
    </div>

    {/* 右侧：通知 + 用户信息 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge count={unreadCount} size="small">
        <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
      <Dropdown menu={{ items: userMenuItems }}>
        <Space>
          <Avatar size={28}>{userName[0]}</Avatar>
          <span>{userName}</span>
        </Space>
      </Dropdown>
    </div>
  </Header>

  {/* 内容区 */}
  <Content style={{
    padding: 24,
    background: '#F0F2F5',
    minHeight: 'calc(100vh - 56px)',
  }}>
    <Outlet />
  </Content>
</Layout>
```

### 3.2 工作台页面

#### 整体布局

```
+----------------------------------------------+-----------+
|  申请列表区域 (flex: 1)                       | 待办面板   |
|                                              | (280px)   |
|  +------------------------------------------+|           |
|  | 工具栏                                    || [搜索框]  |
|  | [班车名称] [申请人▼] [时间] [状态▼] [申请] ||           |
|  +------------------------------------------+| [待办卡片] |
|  | Table                                    || [待办卡片] |
|  | 班车名称 | 应用状态 | 申请人 | 时间 | 操作|| [待办卡片] |
|  | ---------|---------|--------|------|------||           |
|  | xxxxx   | 2 1 0 3 | 张三   | ...  | 查看 ||           |
|  | xxxxx   | 5 2 1 0 | 李四   | ...  | 查看 ||           |
|  |                                          ||           |
|  +------------------------------------------+| [分页 5条] |
|  | [< 1 2 3 ... 10条/页 >]                  ||           |
|  +------------------------------------------+|           |
+----------------------------------------------+-----------+
```

#### 布局实现

```tsx
<Layout style={{ background: '#fff', borderRadius: 8 }}>
  {/* 主内容区：申请列表 */}
  <Content style={{ padding: 24 }}>
    {/* 工具栏 */}
    {/* Table */}
    {/* 分页 */}
  </Content>

  {/* 右侧：待办面板 */}
  <Layout.Sider
    width={280}
    collapsible
    collapsedWidth={0}
    reverseArrow
    theme="light"
    style={{
      borderLeft: '1px solid #F0F0F0',
      background: '#FAFAFA',
    }}
  >
    {/* 待办内容 */}
  </Layout.Sider>
</Layout>
```

#### 工具栏

```tsx
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  flexWrap: 'wrap',
  gap: 12,
}}>
  <Space wrap size={12}>
    <Input
      placeholder="班车名称"
      prefix={<SearchOutlined />}
      style={{ width: 200 }}
      allowClear
    />
    <Select
      placeholder="申请人"
      style={{ width: 150 }}
      showSearch
      allowClear
      options={applicantOptions}
    />
    <RangePicker
      style={{ width: 260 }}
      placeholder={['开始日期', '结束日期']}
    />
    <Select
      placeholder="状态"
      style={{ width: 120 }}
      allowClear
      options={[
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已拒绝', value: 'rejected' },
      ]}
    />
  </Space>
  <Button type="primary" icon={<PlusOutlined />}>
    发起申请
  </Button>
</div>
```

#### 申请列表 Table 列定义

```tsx
const columns: ColumnsType<FlowRecord> = [
  {
    title: '班车名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (text, record) => (
      <a onClick={() => navigate(`/workbench/flow/${record.id}`)}>
        {text}
      </a>
    ),
  },
  {
    title: '应用状态',
    dataIndex: 'statusSummary',
    key: 'statusSummary',
    width: 220,
    render: (_, record) => (
      <Space size={8}>
        <StatusTag status="total" count={record.total} />
        <StatusTag status="success" count={record.success} />
        <StatusTag status="processing" count={record.processing} />
        <StatusTag status="rejected" count={record.rejected} />
      </Space>
    ),
  },
  {
    title: '申请人',
    dataIndex: 'applicant',
    key: 'applicant',
    width: 100,
  },
  {
    title: '申请时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sorter: true,
    render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => navigate(`/workbench/flow/${record.id}`)}
      >
        查看
      </Button>
    ),
  },
];

// Table 配置
<Table
  columns={columns}
  dataSource={dataSource}
  rowKey="id"
  pagination={{
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50'],
  }}
  loading={loading}
  scroll={{ x: 800 }}
/>
```

#### 应用状态 StatusTag 样式规则

| 状态 | 颜色 | 含义 |
|------|------|------|
| `total` | `#000000` 文字 + 无背景 | 总数 |
| `success` | `#52C41A` 文字 + `#F6FFED` 背景 | 已完成 |
| `processing` | `#1890FF` 文字 + `#E6F7FF` 背景 | 进行中 |
| `rejected` | `#FF4D4F` 文字 + `#FFF2F0` 背景 | 已拒绝 |

#### 待办面板

```tsx
<div style={{ padding: 16 }}>
  {/* 标题 */}
  <div style={{
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <span>待办事项</span>
    <Badge count={todoTotal} style={{ backgroundColor: '#1890FF' }} />
  </div>

  {/* 搜索 */}
  <Input
    placeholder="搜索待办"
    prefix={<SearchOutlined />}
    style={{ marginBottom: 12 }}
    allowClear
    onChange={handleTodoSearch}
  />

  {/* 待办卡片列表 */}
  <div style={{
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 250px)',
  }}>
    {todoList.map(todo => (
      <TodoCard key={todo.id} todoInfo={todo} onHandle={handleTodo} />
    ))}
  </div>

  {/* 分页 */}
  <Pagination
    size="small"
    current={todoCurrent}
    total={todoTotal}
    pageSize={5}
    showSizeChanger={false}
    style={{ marginTop: 12, textAlign: 'center' }}
  />
</div>
```

#### TodoCard 待办卡片结构

```
+-------------------------------------------+
| 📦 班车名称                    [Tag 节点]  |
| 应用名称                                   |
| 处理人：张三         [Badge 待处理]        |
| +---------------------------------------+ |
| | ⚠ 拒绝原因：XXX（红色Alert）           | |
| +---------------------------------------+ |
|                          [去处理 →]        |
+-------------------------------------------+
```

```tsx
<Card
  size="small"
  style={{
    marginBottom: 8,
    borderRadius: 6,
    borderLeft: `3px solid ${statusColor}`,
  }}
  bodyStyle={{ padding: 12 }}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
    <Typography.Text strong ellipsis style={{ maxWidth: 160 }}>
      {todoInfo.flowName}
    </Typography.Text>
    <Tag color={nodeColorMap[todoInfo.node]}>{todoInfo.nodeName}</Tag>
  </div>
  <Typography.Text style={{ fontSize: 13 }}>{todoInfo.appName}</Typography.Text>
  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: '4px 0' }}>
    处理人：{todoInfo.handler}
    <Badge status={badgeStatus} text={todoInfo.statusText} style={{ marginLeft: 8 }} />
  </div>
  {todoInfo.rejectReason && (
    <Alert
      message={todoInfo.rejectReason}
      type="error"
      showIcon
      style={{ fontSize: 12, padding: '4px 8px', marginBottom: 8 }}
      banner
    />
  )}
  <div style={{ textAlign: 'right' }}>
    <Button type="link" size="small" onClick={() => onHandle(todoInfo)}>
      去处理 <RightOutlined />
    </Button>
  </div>
</Card>
```

#### 创建班车 Modal

```
+-----------------------------------------------+
|  选择班车类型                            [X]   |
+-----------------------------------------------+
|                                               |
|  ○ 当月班车                                    |
|    说明：跟随当月发布计划，统一排期发布         |
|                                               |
|  ○ 临时班车                                    |
|    说明：紧急发布需求，独立审批流程             |
|                                               |
+-----------------------------------------------+
|                    [取消]  [确认创建]           |
+-----------------------------------------------+
```

```tsx
<Modal
  title="选择班车类型"
  open={createModalOpen}
  onCancel={() => setCreateModalOpen(false)}
  onOk={handleCreateFlow}
  okText="确认创建"
  cancelText="取消"
  width={480}
>
  <Radio.Group
    value={flowType}
    onChange={(e) => setFlowType(e.target.value)}
    style={{ width: '100%' }}
  >
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Radio value="monthly" style={{ width: '100%' }}>
        <div>
          <div style={{ fontWeight: 500 }}>当月班车</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            跟随当月发布计划，统一排期发布
          </div>
        </div>
      </Radio>
      <Radio value="temporary" style={{ width: '100%' }}>
        <div>
          <div style={{ fontWeight: 500 }}>临时班车</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            紧急发布需求，独立审批流程
          </div>
        </div>
      </Radio>
    </Space>
  </Radio.Group>
</Modal>
```

### 3.3 流程单详情页

#### 整体布局

```
+----------------------------------------------------------+
| 面包屑：工作台 > 2025年3月第一批班车                       |
+----------------------------------------------------------+
| Descriptions 基础信息                                     |
| 班车名称：xxx  |  APK状态：[2完成][1进行][0拒绝][3总数]    |
| 申请人：张三   |  申请时间：2025-03-01 10:00              |
+----------------------------------------------------------+
| 工具栏                                                    |
| [🔍搜索应用]                  [添加应用] [每页 ▼8条]      |
+----------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+       |
| | AppCard  | | AppCard  | | AppCard  | | AppCard  |       |
| | 图标+名称| | 图标+名称| | 图标+名称| | 图标+名称|       |
| | 包名     | | 包名     | | 包名     | | 包名     |       |
| | 类型Tag  | | 类型Tag  | | 类型Tag  | | 类型Tag  |       |
| | 版本号   | | 版本号   | | 版本号   | | 版本号   |       |
| | 流程节点 | | 流程节点 | | 流程节点 | | 流程节点 |       |
| | 操作人   | | 操作人   | | 操作人   | | 操作人   |       |
| | 创建时间 | | 创建时间 | | 创建时间 | | 创建时间 |       |
| +----------+ +----------+ +----------+ +----------+       |
+----------------------------------------------------------+
| [< 1 2 3 4 ... >]                                        |
+----------------------------------------------------------+
```

#### 面包屑导航

```tsx
<Breadcrumb
  items={[
    { title: <a onClick={() => navigate('/workbench')}>工作台</a> },
    { title: flowDetail.name },
  ]}
  style={{ marginBottom: 16 }}
/>
```

#### 基础信息 Descriptions

```tsx
<Descriptions
  bordered
  column={2}
  style={{
    background: '#fff',
    borderRadius: 8,
    marginBottom: 24,
    padding: 24,
  }}
>
  <Descriptions.Item label="班车名称">{flowDetail.name}</Descriptions.Item>
  <Descriptions.Item label="APK状态">
    <Space>
      <StatusTag status="success" count={flowDetail.successCount} />
      <StatusTag status="processing" count={flowDetail.processingCount} />
      <StatusTag status="rejected" count={flowDetail.rejectedCount} />
      <StatusTag status="total" count={flowDetail.totalCount} />
    </Space>
  </Descriptions.Item>
  <Descriptions.Item label="申请人">{flowDetail.applicant}</Descriptions.Item>
  <Descriptions.Item label="申请时间">
    {dayjs(flowDetail.createdAt).format('YYYY-MM-DD HH:mm')}
  </Descriptions.Item>
</Descriptions>
```

#### 工具栏

```tsx
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
}}>
  <Input.Search
    placeholder="搜索应用名称/包名"
    style={{ width: 300 }}
    allowClear
    onSearch={handleSearch}
  />
  <Space>
    <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
      添加应用
    </Button>
    <Select
      value={pageSize}
      onChange={setPageSize}
      options={[
        { label: '8条/页', value: 8 },
        { label: '16条/页', value: 16 },
        { label: '24条/页', value: 24 },
        { label: '32条/页', value: 32 },
        { label: '64条/页', value: 64 },
      ]}
      style={{ width: 110 }}
    />
  </Space>
</div>
```

#### 应用卡片网格

```tsx
<Row gutter={[16, 16]}>
  {appList.map(app => (
    <Col key={app.id} xs={24} sm={12} lg={8} xl={6}>
      <AppCard appInfo={app} onClick={() => handleAppClick(app)} />
    </Col>
  ))}
</Row>

<Pagination
  current={current}
  total={total}
  pageSize={pageSize}
  showTotal={(total) => `共 ${total} 个应用`}
  style={{ marginTop: 24, textAlign: 'right' }}
/>
```

#### AppCard 卡片详细结构

```
+-------------------------------------------+
| [Avatar 48px]  应用名称                    |
|                com.example.app (灰色12px)  |
|                [Tag 工具类]  v1.2.3        |
+-------------------------------------------+
| 流程节点：通道发布审核  [Badge ● 进行中]    |
| 操作人：李四                               |
| ⚠ 拒绝原因：XXX（红色文字，如有）          |
| 创建时间：2025-03-01 10:00                 |
+-------------------------------------------+
```

```tsx
// AppCard 组件
<Card
  hoverable
  style={{ borderRadius: 8, height: '100%' }}
  bodyStyle={{ padding: 16 }}
  onClick={onClick}
>
  {/* 头部：图标 + 基本信息 */}
  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
    <Avatar
      src={appInfo.icon}
      size={48}
      shape="square"
      style={{ borderRadius: 10, flexShrink: 0 }}
    />
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <Typography.Text strong ellipsis style={{ display: 'block' }}>
        {appInfo.name}
      </Typography.Text>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 12, display: 'block' }}
        ellipsis
      >
        {appInfo.packageName}
      </Typography.Text>
      <Space size={8} style={{ marginTop: 4 }}>
        <Tag>{appInfo.type}</Tag>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          v{appInfo.version}
        </span>
      </Space>
    </div>
  </div>

  {/* 流程信息 */}
  <div style={{ fontSize: 13 }}>
    <div style={{ marginBottom: 4 }}>
      <span style={{ color: 'rgba(0,0,0,0.45)' }}>流程节点：</span>
      {appInfo.currentNode}
      <Badge
        status={statusBadgeMap[appInfo.status]}
        text={appInfo.statusText}
        style={{ marginLeft: 8 }}
      />
    </div>
    <div style={{ marginBottom: 4, color: 'rgba(0,0,0,0.65)' }}>
      操作人：{appInfo.operator}
    </div>
    {appInfo.rejectReason && (
      <div style={{ color: '#FF4D4F', fontSize: 12, marginBottom: 4 }}>
        拒绝原因：{appInfo.rejectReason}
      </div>
    )}
    <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
      {dayjs(appInfo.createdAt).format('YYYY-MM-DD HH:mm')}
    </div>
  </div>
</Card>
```

**悬浮效果**：鼠标 hover 时 `box-shadow` 提升至 `0 4px 12px rgba(0,0,0,0.15)`，`transform: translateY(-2px)`，过渡动画 `transition: all 0.3s ease`。

#### 添加应用 Modal

```
+-----------------------------------------------+
|  添加应用                                [X]   |
+-----------------------------------------------+
| [🔍 搜索应用名称/包名]                        |
+-----------------------------------------------+
| ☑ | 图标 | 应用名称      | 包名          | 类型 |
|----|------|--------------|---------------|------|
| ☐ | 🟦  | 应用A        | com.a.app     | 工具 |
| ☑ | 🟩  | 应用B        | com.b.app     | 游戏 |
| ☐ | 🟨  | 应用C        | com.c.app     | 社交 |
+-----------------------------------------------+
| 已选择 2 个应用         [取消]  [确认添加]     |
+-----------------------------------------------+
```

```tsx
<Modal
  title="添加应用"
  open={addModalOpen}
  onCancel={() => setAddModalOpen(false)}
  onOk={handleAddApps}
  okText="确认添加"
  cancelText="取消"
  width={720}
  footer={[
    <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'rgba(0,0,0,0.45)' }}>
        已选择 <span style={{ color: '#1890FF', fontWeight: 500 }}>{selectedApps.length}</span> 个应用
      </span>
      <Space>
        <Button onClick={() => setAddModalOpen(false)}>取消</Button>
        <Button type="primary" onClick={handleAddApps}>确认添加</Button>
      </Space>
    </div>
  ]}
>
  <Input.Search
    placeholder="搜索应用名称/包名"
    style={{ marginBottom: 16 }}
    allowClear
  />
  <Table
    rowSelection={{
      type: 'checkbox',
      selectedRowKeys: selectedApps,
      onChange: setSelectedApps,
    }}
    columns={[
      {
        title: '图标',
        dataIndex: 'icon',
        width: 60,
        render: (url) => <Avatar src={url} shape="square" size={32} />,
      },
      { title: '应用名称', dataIndex: 'name', width: 200 },
      { title: '包名', dataIndex: 'packageName', ellipsis: true },
      {
        title: '类型',
        dataIndex: 'type',
        width: 80,
        render: (text) => <Tag>{text}</Tag>,
      },
    ]}
    dataSource={availableApps}
    rowKey="id"
    pagination={{ pageSize: 10 }}
    scroll={{ y: 400 }}
    size="small"
  />
</Modal>
```

### 3.4 单 APK 发布流程详情页

#### 整体布局

```
+----------------------------------------------------------+
| 面包屑：工作台 > 2025年3月第一批班车 > 应用名称           |
+----------------------------------------------------------+
| 应用基本信息区                                            |
| [图标64px]  应用名称                                      |
|             com.example.app                               |
|             v1.2.3    [Badge ● 进行中]                    |
+----------------------------------------------------------+
| 流程节点条 Steps                                          |
| [①通道发布申请] → [②通道发布审核] → [③物料上传] →        |
| [④物料审核] → [⑤应用上架] → [⑥业务内测] → [⑦灰度监控]   |
+----------------------------------------------------------+
| 历史操作记录                                              |
| 时间             | 操作人 | 动作         | 详情           |
| 2025-03-01 10:00 | 张三   | [Tag 提交]  | 提交发布申请    |
| 2025-03-01 14:00 | 李四   | [Tag 通过]  | 审核通过        |
+----------------------------------------------------------+
```

#### 面包屑导航

```tsx
<Breadcrumb
  items={[
    { title: <a onClick={() => navigate('/workbench')}>工作台</a> },
    { title: <a onClick={() => navigate(`/workbench/flow/${flowId}`)}>{flowName}</a> },
    { title: appName },
  ]}
  style={{ marginBottom: 16 }}
/>
```

#### 应用基本信息区

```tsx
<div style={{
  background: '#fff',
  borderRadius: 8,
  padding: 24,
  marginBottom: 24,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
}}>
  <Avatar
    src={appDetail.icon}
    size={64}
    shape="square"
    style={{ borderRadius: 12, flexShrink: 0 }}
  />
  <div>
    <Typography.Title level={4} style={{ marginBottom: 4 }}>
      {appDetail.name}
    </Typography.Title>
    <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
      {appDetail.packageName}
    </Typography.Text>
    <Space style={{ marginTop: 8 }}>
      <Tag>v{appDetail.version}</Tag>
      <Badge
        status={statusBadgeMap[appDetail.status]}
        text={appDetail.statusText}
      />
    </Space>
  </div>
</div>
```

#### 流程节点条 (ProcessSteps)

7 个流程节点的定义：

| 序号 | 节点名称 | 节点 Key | 图标 |
|------|---------|----------|------|
| 1 | 通道发布申请 | `channel_apply` | `FormOutlined` |
| 2 | 通道发布审核 | `channel_review` | `AuditOutlined` |
| 3 | 物料上传 | `material_upload` | `CloudUploadOutlined` |
| 4 | 物料审核 | `material_review` | `FileSearchOutlined` |
| 5 | 应用上架 | `app_publish` | `RocketOutlined` |
| 6 | 业务内测 | `beta_test` | `ExperimentOutlined` |
| 7 | 灰度监控 | `gray_monitor` | `MonitorOutlined` |

节点状态与颜色映射：

| 节点状态 | 颜色 | Steps status | 说明 |
|---------|------|-------------|------|
| 未开始 | `#D9D9D9` | `wait` | 灰色圆圈 |
| 进行中 | `#1890FF` | `process` | 蓝色圆圈 + 动画 |
| 已完成 | `#52C41A` | `finish` | 绿色对勾 |
| 已拒绝 | `#FF4D4F` | `error` | 红色叉号 |

```tsx
// ProcessSteps 组件
<div style={{
  background: '#fff',
  borderRadius: 8,
  padding: '24px 32px',
  marginBottom: 24,
}}>
  <Steps
    current={currentNodeIndex}
    items={nodes.map((node, index) => ({
      title: (
        <span
          style={{ cursor: 'pointer', fontSize: 13 }}
          onClick={() => onNodeClick(node)}
        >
          {node.name}
        </span>
      ),
      description: (
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          {node.handler || '待分配'}
        </div>
      ),
      status: node.status, // 'wait' | 'process' | 'finish' | 'error'
      icon: getNodeIcon(node),
    }))}
    style={{ marginBottom: 0 }}
  />
</div>
```

**自定义样式**：通过 CSS 覆盖 Steps 默认样式实现颜色区分。

```css
/* 已完成节点 */
.process-steps .ant-steps-item-finish .ant-steps-item-icon {
  background: #52C41A;
  border-color: #52C41A;
}
.process-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
  color: #fff;
}

/* 已拒绝节点 */
.process-steps .ant-steps-item-error .ant-steps-item-icon {
  background: #FF4D4F;
  border-color: #FF4D4F;
}

/* 进行中节点脉冲动画 */
.process-steps .ant-steps-item-process .ant-steps-item-icon {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(24,144,255,0.4); }
  70% { box-shadow: 0 0 0 8px rgba(24,144,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(24,144,255,0); }
}
```

#### 历史操作记录

```tsx
<div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
  <Typography.Title level={5} style={{ marginBottom: 16 }}>
    操作记录
  </Typography.Title>
  <Table
    columns={[
      {
        title: '时间',
        dataIndex: 'time',
        width: 180,
        render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        width: 100,
      },
      {
        title: '动作',
        dataIndex: 'action',
        width: 120,
        render: (action) => {
          const colorMap = {
            submit: 'blue', approve: 'green', reject: 'red',
            upload: 'cyan', publish: 'purple', complete: 'green',
          };
          return <Tag color={colorMap[action]}>{actionLabelMap[action]}</Tag>;
        },
      },
      {
        title: '详情',
        dataIndex: 'detail',
        ellipsis: true,
      },
    ]}
    dataSource={operationLogs}
    rowKey="id"
    pagination={false}
    size="small"
  />
</div>
```

### 3.5 流程节点 Modal 设计

#### 3.5.1 通道发布申请 Modal

**基本属性**：

| 属性 | 值 |
|------|-----|
| 宽度 | 900px |
| 高度 | 80vh（`styles.body.maxHeight: '80vh', overflow: 'auto'`） |
| 标题 | "通道发布申请" |
| 可关闭 | X 按钮 / 取消 / ESC |

**整体结构**：

```
+-------------------------------------------------------+
| 通道发布申请                                     [X]   |
+-------------------------------------------------------+
| [Alert type=error] 拒绝原因：XXX（仅拒绝状态显示）     |
+-------------------------------------------------------+
| [Tab 基础信息] [Tab 所需物料]                          |
+-------------------------------------------------------+
| （Tab 内容区 - 可滚动）                                |
|                                                       |
| 基础信息表单 / 所需物料表单                            |
|                                                       |
+-------------------------------------------------------+
| [固定底部]              [取消]  [保存草稿]  [提交]     |
+-------------------------------------------------------+
```

##### 基础信息 Tab

```tsx
<Form
  layout="horizontal"
  labelCol={{ span: 6 }}
  wrapperCol={{ span: 18 }}
  form={form}
>
  {/* 拒绝原因（条件显示） */}
  {rejectReason && (
    <Alert
      message="审核未通过"
      description={rejectReason}
      type="error"
      showIcon
      style={{ marginBottom: 24 }}
    />
  )}

  <Tabs defaultActiveKey="basic" items={[
    {
      key: 'basic',
      label: '基础信息',
      children: (
        <>
          <Form.Item
            label="上架目的说明"
            name="purpose"
            rules={[{ required: true, message: '请填写上架目的说明' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述本次上架的目的和背景" />
          </Form.Item>

          <Form.Item label="应用名称" name="appName">
            <Input disabled />
          </Form.Item>

          <Form.Item label="包名" name="packageName">
            <Input disabled />
          </Form.Item>

          <Form.Item label="应用类型" name="appType">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="应用版本号"
            name="version"
            rules={[{ required: true, message: '请选择版本号' }]}
          >
            <Select showSearch placeholder="请选择或搜索版本号" options={versionOptions} />
          </Form.Item>

          <Form.Item label="应用APK" name="apkFile">
            <Input disabled />
          </Form.Item>

          <Form.Item label="测试报告" name="testReport">
            <Upload maxCount={5} accept=".pdf,.doc,.docx,.xlsx">
              <Button icon={<UploadOutlined />}>上传测试报告</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="应用分类"
            name="category"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择应用分类" options={categoryOptions} />
          </Form.Item>

          <Form.Item label="系统应用" name="isSystemApp">
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {/* TypeSelector 组合选择器 - 发布国家 */}
          <Form.Item label="发布国家" name="countries">
            <TypeSelector
              typeOptions={[
                { label: '全部', value: 'all' },
                { label: '包含', value: 'include' },
                { label: '不包含', value: 'exclude' },
              ]}
              valueOptions={countryOptions}
              placeholder="请选择国家"
            />
          </Form.Item>

          {/* TypeSelector - 品牌 */}
          <Form.Item label="发布品牌" name="brands">
            <TypeSelector
              typeOptions={[
                { label: '全部', value: 'all' },
                { label: '包含', value: 'include' },
                { label: '不包含', value: 'exclude' },
              ]}
              valueOptions={brandOptions}
              placeholder="请选择品牌"
            />
          </Form.Item>

          {/* TypeSelector - 机型 */}
          <Form.Item label="发布机型" name="models">
            <TypeSelector
              typeOptions={typeSelectOptions}
              valueOptions={modelOptions}
              placeholder="请选择机型"
            />
          </Form.Item>

          {/* TypeSelector - 内测机型 */}
          <Form.Item label="内测机型" name="betaModels">
            <TypeSelector
              typeOptions={typeSelectOptions}
              valueOptions={modelOptions}
              placeholder="请选择内测机型"
            />
          </Form.Item>

          {/* TypeSelector - 安卓版本 */}
          <Form.Item label="安卓版本" name="androidVersions">
            <TypeSelector
              typeOptions={typeSelectOptions}
              valueOptions={androidVersionOptions}
              placeholder="请选择安卓版本"
            />
          </Form.Item>

          {/* TypeSelector - tOS版本 */}
          <Form.Item label="tOS版本" name="tosVersions">
            <TypeSelector
              typeOptions={typeSelectOptions}
              valueOptions={tosVersionOptions}
              placeholder="请选择tOS版本"
            />
          </Form.Item>

          <Form.Item label="过滤印度" name="filterIndia">
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="PA应用更新" name="paUpdate">
            <Radio.Group onChange={(e) => setPaUpdate(e.target.value)}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {/* PA应用更新=是时显示 */}
          {paUpdate && (
            <>
              <Form.Item
                label="灰度量级"
                name="grayScale"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={100000}
                  addonAfter="/天"
                  style={{ width: 200 }}
                  placeholder="请输入1-100000"
                />
              </Form.Item>
              <Form.Item
                label="生效时间"
                name="effectiveTime"
                rules={[{ required: true }]}
              >
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </>
          )}
        </>
      ),
    },
    {
      key: 'material',
      label: '所需物料',
      children: <MaterialForm />,  // 见下方
    },
  ]} />
</Form>
```

##### 所需物料 Tab

```
+-------------------------------------------------------+
| [中文(简体)] [English] [日本語] [+添加语言]            |
+-------------------------------------------------------+
| 应用名称    [___________________________]              |
| 描述        [___________________________]              |
|             [___________________________]              |
| 产品详情    [___________________________]              |
|             [___________________________]              |
| 更新说明    [___________________________]              |
|             [___________________________]              |
| 关键词      [tag1] [tag2] [tag3] (最多5个)             |
+-------------------------------------------------------+
| 应用图标    [上传图片区域 512x512]                      |
| 置顶大图    [上传图片区域 1024x500]                     |
| 截图        [拖拽上传区域 3-5张]                        |
+-------------------------------------------------------+
| ----- 独立区域 -----                                   |
| 是否GP上架   ○是 ○否                                   |
| GP链接       [___________________________]             |
+-------------------------------------------------------+
```

```tsx
// MaterialForm 组件
const MaterialForm = () => {
  const [languages, setLanguages] = useState([
    { key: 'zh-CN', label: '中文(简体)' },
  ]);

  return (
    <>
      <Tabs
        type="editable-card"
        onEdit={(targetKey, action) => {
          if (action === 'add') openLanguageSelector();
          if (action === 'remove') removeLanguage(targetKey);
        }}
        items={languages.map(lang => ({
          key: lang.key,
          label: lang.label,
          closable: languages.length > 1,
          children: (
            <div style={{ padding: '16px 0' }}>
              <Form.Item
                label="应用名称"
                name={['materials', lang.key, 'appName']}
                rules={[{ required: true, message: '请填写应用名称' }]}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input placeholder="请输入应用名称" maxLength={30} showCount />
              </Form.Item>

              <Form.Item
                label="描述"
                name={['materials', lang.key, 'description']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea rows={3} placeholder="请输入描述" maxLength={80} showCount />
              </Form.Item>

              <Form.Item
                label="产品详情"
                name={['materials', lang.key, 'detail']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea rows={4} placeholder="请输入产品详情" maxLength={4000} showCount />
              </Form.Item>

              <Form.Item
                label="更新说明"
                name={['materials', lang.key, 'updateNote']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea rows={3} placeholder="请输入更新说明" maxLength={500} showCount />
              </Form.Item>

              <Form.Item
                label="关键词"
                name={['materials', lang.key, 'keywords']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Select
                  mode="tags"
                  placeholder="输入关键词后按回车，最多5个"
                  maxCount={5}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="应用图标"
                name={['materials', lang.key, 'icon']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <ImageUploader
                  maxCount={1}
                  dimensions={{ width: 512, height: 512 }}
                  maxSize={1024}
                  accept=".png,.jpg,.jpeg"
                />
              </Form.Item>

              <Form.Item
                label="置顶大图"
                name={['materials', lang.key, 'banner']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <ImageUploader
                  maxCount={1}
                  dimensions={{ width: 1024, height: 500 }}
                  maxSize={1024}
                  accept=".png,.jpg,.jpeg"
                />
              </Form.Item>

              <Form.Item
                label="截图"
                name={['materials', lang.key, 'screenshots']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Upload.Dragger
                  multiple
                  maxCount={5}
                  accept=".png,.jpg,.jpeg"
                  listType="picture-card"
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">拖拽或点击上传截图</p>
                  <p className="ant-upload-hint">支持3-5张，PNG/JPG格式</p>
                </Upload.Dragger>
              </Form.Item>
            </div>
          ),
        }))}
      />

      {/* 独立区域：GP上架信息 */}
      <Divider />
      <Form.Item
        label="是否GP上架"
        name="isGPPublish"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>

      {isGPPublish && (
        <Form.Item
          label="GP链接"
          name="gpLink"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ type: 'url', message: '请输入有效的URL' }]}
        >
          <Input placeholder="请输入Google Play链接" />
        </Form.Item>
      )}
    </>
  );
};
```

**底部固定按钮区**：

```tsx
<Modal
  // ...
  footer={
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      borderTop: '1px solid #F0F0F0',
      paddingTop: 16,
    }}>
      <Button onClick={onCancel}>取消</Button>
      <Button onClick={handleSaveDraft}>保存草稿</Button>
      <Button type="primary" onClick={handleSubmit} loading={submitting}>
        提交
      </Button>
    </div>
  }
>
```

#### 3.5.2 通道发布审核 Modal

**基本属性**：宽度 900px

```
+-------------------------------------------------------+
| 通道发布审核                                     [X]   |
+-------------------------------------------------------+
| 【固定不滚动区域 - sticky】                            |
| ┌─ 运营审核 ──────────────────────────────────────┐   |
| │ 审核结果：○通过  ○不通过                         │   |
| │ 审核意见：[TextArea]（不通过时显示）              │   |
| │                                    [提交审核]    │   |
| └────────────────────────────────────────────────┘   |
| ┌─ 老板会签 ──────────────────────────────────────┐   |
| │ [头像]张三 [Tag已通过] [头像]李四 [Tag待审核][操作]│  |
| │ [头像]王五 [Tag待审核][操作]                      │   |
| └────────────────────────────────────────────────┘   |
+-------------------------------------------------------+
| 【下方滚动区域】                                       |
| [Tab 基础信息] [Tab 所需物料]                          |
| （只读展示内容，同通道发布申请但所有字段 disabled）     |
+-------------------------------------------------------+
```

```tsx
<Modal
  title="通道发布审核"
  open={reviewModalOpen}
  width={900}
  footer={null}
  styles={{ body: { padding: 0, maxHeight: '80vh', overflow: 'hidden' } }}
>
  {/* 固定顶部审核区 */}
  <div style={{
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    padding: 24,
    borderBottom: '1px solid #F0F0F0',
  }}>
    {/* 运营审核 */}
    <div style={{
      background: '#FAFAFA',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    }}>
      <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
        运营审核
      </Typography.Text>
      <Form layout="vertical">
        <Form.Item label="审核结果">
          <Radio.Group value={reviewResult} onChange={(e) => setReviewResult(e.target.value)}>
            <Radio value="approve">通过</Radio>
            <Radio value="reject">不通过</Radio>
          </Radio.Group>
        </Form.Item>
        {reviewResult === 'reject' && (
          <Form.Item label="审核意见" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请填写不通过原因" />
          </Form.Item>
        )}
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSubmitReview}>提交审核</Button>
        </Form.Item>
      </Form>
    </div>

    {/* 老板会签 */}
    <div style={{
      background: '#FAFAFA',
      borderRadius: 8,
      padding: 16,
    }}>
      <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
        老板会签
      </Typography.Text>
      <Space wrap size={16}>
        {cosigners.map(person => (
          <div key={person.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: '#fff',
            borderRadius: 6,
            border: '1px solid #F0F0F0',
          }}>
            <Avatar size={28}>{person.name[0]}</Avatar>
            <span>{person.name}</span>
            <Tag color={person.status === 'approved' ? 'green' : 'default'}>
              {person.status === 'approved' ? '已通过' : '待审核'}
            </Tag>
            {person.status === 'pending' && person.isCurrentUser && (
              <Space size={4}>
                <Button size="small" type="primary">通过</Button>
                <Button size="small" danger>拒绝</Button>
              </Space>
            )}
          </div>
        ))}
      </Space>
    </div>
  </div>

  {/* 可滚动内容区 */}
  <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(80vh - 300px)' }}>
    <Tabs items={[
      { key: 'basic', label: '基础信息', children: <ReadOnlyBasicInfo /> },
      { key: 'material', label: '所需物料', children: <ReadOnlyMaterialInfo /> },
    ]} />
  </div>
</Modal>
```

#### 3.5.3 物料上传 Modal

**与通道发布申请 Modal 结构一致**，区别如下：

| 区域 | 差异说明 |
|------|---------|
| 标题 | "物料上传" |
| 基础信息 Tab | 所有字段 `disabled`，仅展示信息 |
| 所需物料 Tab | 所有上传字段变为**必填**（标红星），用户需在此补充上传 |
| 底部按钮 | 取消 + 提交物料 |

```tsx
// 物料上传特殊处理：所需物料字段必填
const materialRules = {
  appName: [{ required: true, message: '请填写应用名称' }],
  description: [{ required: true, message: '请填写描述' }],
  detail: [{ required: true, message: '请填写产品详情' }],
  updateNote: [{ required: true, message: '请填写更新说明' }],
  icon: [{ required: true, message: '请上传应用图标' }],
  banner: [{ required: true, message: '请上传置顶大图' }],
  screenshots: [{ required: true, message: '请上传截图(3-5张)' }],
};
```

#### 3.5.4 物料审核 Modal

**基本属性**：宽度 900px

```
+-------------------------------------------------------+
| 物料审核                                         [X]   |
+-------------------------------------------------------+
| 【固定顶部审核区】                                     |
| 审核结果：○通过  ○不通过                               |
| 审核意见：[TextArea]（不通过时显示）                    |
|                                        [提交审核]      |
+-------------------------------------------------------+
| 【下方滚动区域】                                       |
| [Tab 基础信息] [Tab 所需物料]                          |
| （只读展示，同通道发布申请全部 disabled）               |
+-------------------------------------------------------+
```

结构与通道发布审核 Modal 类似，但去除"老板会签"区域，仅保留单人审核操作。

```tsx
<Modal title="物料审核" width={900} footer={null}>
  {/* 固定审核区 */}
  <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', padding: 24, borderBottom: '1px solid #F0F0F0' }}>
    <ReviewPanel
      reviewers={[currentUser]}
      showCosign={false}
      onSubmit={handleMaterialReview}
    />
  </div>

  {/* 物料详情只读展示 */}
  <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(80vh - 200px)' }}>
    <Tabs items={[
      { key: 'basic', label: '基础信息', children: <ReadOnlyBasicInfo /> },
      { key: 'material', label: '所需物料', children: <ReadOnlyMaterialInfo /> },
    ]} />
  </div>
</Modal>
```

#### 3.5.5 应用上架 Modal

**基本属性**：宽度 1000px

```
+------------------------------------------------------------+
| 应用上架                                              [X]   |
+------------------------------------------------------------+
| 外部平台数据                                                |
| +--------------------------------------------------------+ |
| | 状态 | 应用名 | 任务名 | 包名 | 国家 | 品牌 | 机型 |..| |
| |------|--------|--------|------|------|------|------|----| |
| | ● 上架中 | App1 | Task1 | com.a | CN | HUAWEI | ... | | |
| | ● 已上架 | App1 | Task2 | com.a | US | ALL    | ... | | |
| +--------------------------------------------------------+ |
+------------------------------------------------------------+
| 操作区                                                      |
| 审核结果：○确认上架完成  ○拒绝                               |
| （拒绝时显示）                                              |
| 拒绝原因：[TextArea]                                        |
+------------------------------------------------------------+
|                               [取消]  [提交]                |
+------------------------------------------------------------+
```

```tsx
<Modal
  title="应用上架"
  width={1000}
  onOk={handlePublishSubmit}
  okText="提交"
  footer={
    <Space>
      <Button onClick={onCancel}>取消</Button>
      <Button danger onClick={() => setShowReject(true)}>拒绝</Button>
      <Button type="primary" onClick={handleConfirmPublish}>确认上架完成</Button>
    </Space>
  }
>
  <Table
    columns={[
      { title: '状态', dataIndex: 'status', width: 100,
        render: (s) => <Badge status={s === 'published' ? 'success' : 'processing'} text={s === 'published' ? '已上架' : '上架中'} />
      },
      { title: '应用名称', dataIndex: 'appName', width: 120 },
      { title: '任务名称', dataIndex: 'taskName', width: 120 },
      { title: '包名', dataIndex: 'packageName', width: 160, ellipsis: true },
      { title: '国家', dataIndex: 'countries', width: 100, ellipsis: true },
      { title: '品牌', dataIndex: 'brands', width: 100 },
      { title: '机型', dataIndex: 'models', width: 100, ellipsis: true },
      { title: '语言', dataIndex: 'languages', width: 80 },
      { title: '安卓版本', dataIndex: 'androidVersion', width: 100 },
      { title: 'tOS版本', dataIndex: 'tosVersion', width: 100 },
      { title: '灰度量级', dataIndex: 'grayScale', width: 100,
        render: (v) => `${v}%`
      },
      { title: '分类', dataIndex: 'category', width: 80 },
      { title: '生效时间', dataIndex: 'effectiveTime', width: 180 },
    ]}
    dataSource={platformData}
    rowKey="id"
    scroll={{ x: 1400 }}
    pagination={false}
    size="small"
  />
</Modal>
```

#### 3.5.6 业务内测 Modal

**基本属性**：宽度 1000px

```
+------------------------------------------------------------+
| 业务内测                                              [X]   |
+------------------------------------------------------------+
| 内测数据                                                    |
| +--------------------------------------------------------+ |
| | （与应用上架相同字段的Table）                            | |
| +--------------------------------------------------------+ |
+------------------------------------------------------------+
| 操作区                                                      |
| 审核结果：○通过  ○拒绝                                      |
| （拒绝时显示）                                              |
| 回退节点：[Select 下拉选择回退到哪个节点]                   |
| 拒绝原因：[TextArea]                                        |
+------------------------------------------------------------+
|                               [取消]  [提交]                |
+------------------------------------------------------------+
```

```tsx
<Modal title="业务内测" width={1000} onOk={handleBetaSubmit} okText="提交">
  {/* 数据展示 Table - 同应用上架 */}
  <Table columns={publishColumns} dataSource={betaData} scroll={{ x: 1400 }} size="small" />

  <Divider />

  {/* 操作区 */}
  <Form form={betaForm} layout="vertical">
    <Form.Item label="审核结果" name="result" rules={[{ required: true }]}>
      <Radio.Group>
        <Radio value="approve">通过</Radio>
        <Radio value="reject">拒绝</Radio>
      </Radio.Group>
    </Form.Item>

    {betaResult === 'reject' && (
      <>
        <Form.Item
          label="回退节点"
          name="rollbackNode"
          rules={[{ required: true, message: '请选择回退节点' }]}
        >
          <Select placeholder="请选择回退到哪个节点" options={[
            { label: '通道发布申请（基础信息错误）', value: 'channel_apply' },
            { label: '物料上传（物料信息错误）', value: 'material_upload' },
            { label: '应用上架（上架配置错误）', value: 'app_publish' },
          ]} />
        </Form.Item>
        <Form.Item
          label="拒绝原因"
          name="rejectReason"
          rules={[{ required: true, message: '请填写拒绝原因' }]}
        >
          <Input.TextArea rows={3} placeholder="请填写拒绝原因" />
        </Form.Item>
      </>
    )}
  </Form>
</Modal>
```

#### 3.5.7 灰度监控 Modal

**基本属性**：宽度 1000px

```
+------------------------------------------------------------+
| 灰度监控                                              [X]   |
+------------------------------------------------------------+
| +--------------------------------------------------------+ |
| | 应用名称 | 包名 | 任务名 | 生效时间 | 灰度量级 | 状态 || |
| |----------|------|--------|---------|---------|--------| |
| | App1   |com.a | Task1  | 3/1-3/15| ████░ 80% | 进行中|| |
| | App1   |com.a | Task2  | 3/1-3/30| ██░░░ 40% | 进行中|| |
| +--------------------------------------------------------+ |
+------------------------------------------------------------+
| 操作区                                                      |
| 操作结果：○确认完成  ○标记异常（拒绝）                       |
| （异常时显示）                                              |
| 回退节点：[Select 下拉选择回退到哪个节点]                   |
| 异常原因：[TextArea]                                        |
+------------------------------------------------------------+
|                               [取消]  [提交]                |
+------------------------------------------------------------+
```

```tsx
<Modal
  title="灰度监控"
  width={1000}
  footer={
    <Space>
      <Button onClick={onCancel}>取消</Button>
      <Button danger onClick={handleMarkAbnormal}>标记异常</Button>
      <Button type="primary" onClick={handleConfirmComplete}>确认完成</Button>
    </Space>
  }
>
  <Table
    columns={[
      { title: '应用名称', dataIndex: 'appName', width: 120 },
      { title: '包名', dataIndex: 'packageName', width: 160, ellipsis: true },
      { title: '任务名称', dataIndex: 'taskName', width: 120 },
      { title: '生效时间', dataIndex: 'effectiveTime', width: 200,
        render: ([start, end]) => `${dayjs(start).format('MM/DD')} - ${dayjs(end).format('MM/DD')}`
      },
      { title: '灰度量级', dataIndex: 'grayScale', width: 180,
        render: (value) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress
              percent={value}
              size="small"
              style={{ flex: 1, marginBottom: 0 }}
              strokeColor={value >= 80 ? '#52C41A' : '#1890FF'}
            />
          </div>
        ),
      },
      { title: '状态', dataIndex: 'status', width: 100,
        render: (s) => <Badge status={statusMap[s]} text={statusLabelMap[s]} />
      },
      { title: '创建时间', dataIndex: 'createdAt', width: 160,
        render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm')
      },
    ]}
    dataSource={monitorData}
    rowKey="id"
    pagination={false}
    scroll={{ x: 1000 }}
    size="small"
  />

  {/* 异常/拒绝时的回退操作区 */}
  {showAbnormalForm && (
    <>
      <Divider />
      <Form form={grayForm} layout="vertical">
        <Form.Item label="回退节点" name="rollbackNode" rules={[{ required: true, message: '请选择回退节点' }]}>
          <Select placeholder="请选择回退到哪个节点" options={[
            { label: '通道发布申请', value: 'channel_apply' },
            { label: '物料上传', value: 'material_upload' },
            { label: '应用上架', value: 'app_publish' },
            { label: '业务内测', value: 'beta_test' },
          ]} />
        </Form.Item>
        <Form.Item label="异常/拒绝原因" name="rejectReason" rules={[{ required: true, message: '请填写原因' }]}>
          <Input.TextArea rows={3} placeholder="请填写异常或拒绝原因" />
        </Form.Item>
      </Form>
    </>
  )}
</Modal>
```

### 3.6 看板页面

#### 整体布局

```
+----------------------------------------------------------+
| [Tab 班车视角] [Tab 产品视角] [Tab 状态视角]              |
+----------------------------------------------------------+
| （Tab 内容区）                                            |
+----------------------------------------------------------+
```

```tsx
<div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
  <Tabs
    defaultActiveKey="flow"
    size="large"
    items={[
      { key: 'flow', label: '班车视角', children: <FlowView /> },
      { key: 'product', label: '产品视角', children: <ProductView /> },
      { key: 'status', label: '状态视角', children: <StatusView /> },
    ]}
  />
</div>
```

#### 班车视角

```
+----------+ +----------+ +----------+ +----------+
| 3月第1批  | | 3月第2批  | | 临时班车1 | | 2月第3批  |
| --------- | | --------- | | --------- | | --------- |
| 覆盖产品：12| 覆盖产品：8 | 覆盖产品：3 | 覆盖产品：15|
| [████████░] | [██████░░░] | [███░░░░░░] | [█████████] |
| 完成率 85%| | 完成率 60%| | 完成率 33%| | 完成率100%|
+----------+ +----------+ +----------+ +----------+
```

```tsx
const FlowView = () => (
  <Row gutter={[16, 16]}>
    {flowList.map(flow => (
      <Col key={flow.id} xs={24} sm={12} lg={8} xl={6}>
        <Card
          hoverable
          onClick={() => navigate(`/workbench/flow/${flow.id}`)}
          style={{ borderRadius: 8 }}
        >
          <Typography.Title level={5}>{flow.name}</Typography.Title>
          <div style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 12 }}>
            覆盖产品：{flow.appCount} 个
          </div>
          <Progress
            percent={flow.completionRate}
            strokeColor={flow.completionRate === 100 ? '#52C41A' : '#1890FF'}
            format={(p) => `${p}%`}
          />
        </Card>
      </Col>
    ))}
  </Row>
);
```

#### 产品视角

```tsx
const ProductView = () => (
  <Table
    columns={[
      { title: '应用名称', dataIndex: 'appName', width: 150 },
      { title: '包名', dataIndex: 'packageName', width: 200, ellipsis: true },
      { title: '当前节点', dataIndex: 'currentNode', width: 120,
        render: (node) => <Tag>{node}</Tag>
      },
      { title: '状态', dataIndex: 'status', width: 100,
        render: (s) => <Badge status={statusMap[s]} text={statusLabel[s]} />
      },
      { title: '所属班车', dataIndex: 'flowName', width: 150 },
      { title: '操作人', dataIndex: 'operator', width: 100 },
      { title: '更新时间', dataIndex: 'updatedAt', width: 180,
        render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm')
      },
    ]}
    dataSource={productData}
    rowKey="id"
    pagination={{ pageSize: 20, showSizeChanger: true }}
    scroll={{ x: 1000 }}
  />
);
```

#### 状态视角（Kanban 看板）

```
+----------+----------+----------+----------+----------+----------+----------+----------+----------+
| 通道发布  | 通道发布  | 物料上传  | 物料审核  | 应用上架  | 业务内测  | 灰度监控  | 已完成    | 已拒绝    |
| 申请(3)  | 审核(2)  | (4)      | (1)      | (2)      | (1)      | (3)      | (8)      | (1)      |
+----------+----------+----------+----------+----------+----------+----------+----------+----------+
| [Card]   | [Card]   | [Card]   | [Card]   | [Card]   | [Card]   | [Card]   | [Card]   | [Card]   |
| [Card]   | [Card]   | [Card]   |          | [Card]   |          | [Card]   | [Card]   |          |
| [Card]   |          | [Card]   |          |          |          | [Card]   | [Card]   |          |
|          |          | [Card]   |          |          |          |          | [Card]   |          |
+----------+----------+----------+----------+----------+----------+----------+----------+----------+
```

```tsx
const StatusView = () => {
  const kanbanColumns = [
    { key: 'channel_apply', title: '通道发布申请', color: '#1890FF' },
    { key: 'channel_review', title: '通道发布审核', color: '#1890FF' },
    { key: 'material_upload', title: '物料上传', color: '#1890FF' },
    { key: 'material_review', title: '物料审核', color: '#1890FF' },
    { key: 'app_publish', title: '应用上架', color: '#1890FF' },
    { key: 'beta_test', title: '业务内测', color: '#1890FF' },
    { key: 'gray_monitor', title: '灰度监控', color: '#1890FF' },
    { key: 'completed', title: '已完成', color: '#52C41A' },
    { key: 'rejected', title: '已拒绝', color: '#FF4D4F' },
  ];

  return (
    <KanbanBoard
      columns={kanbanColumns.map(col => ({
        ...col,
        cards: groupedData[col.key] || [],
      }))}
    />
  );
};

// KanbanBoard 布局
<div style={{
  display: 'flex',
  gap: 12,
  overflowX: 'auto',
  paddingBottom: 16,
}}>
  {columns.map(column => (
    <div key={column.key} style={{
      minWidth: 220,
      maxWidth: 260,
      flex: '0 0 auto',
      background: '#FAFAFA',
      borderRadius: 8,
      padding: 12,
      borderTop: `3px solid ${column.color}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 12,
        fontWeight: 500,
      }}>
        <span>{column.title}</span>
        <Badge count={column.cards.length} style={{ backgroundColor: column.color }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {column.cards.map(card => (
          <Card
            key={card.id}
            size="small"
            hoverable
            style={{ borderRadius: 6 }}
            bodyStyle={{ padding: 10 }}
            onClick={() => handleCardClick(card)}
          >
            <Typography.Text strong ellipsis style={{ display: 'block', marginBottom: 4 }}>
              {card.appName}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
              {card.packageName}
            </Typography.Text>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
              {card.operator} | {dayjs(card.updatedAt).fromNow()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  ))}
</div>
```

---

## 4. 交互设计规范

### 4.1 Modal 规范

| 规范项 | 定义 |
|--------|------|
| 关闭方式 | X 按钮 / 取消按钮 / ESC 键 / 点击遮罩层 |
| 打开动画 | `zoom` 缩放进入，持续时间 0.3s |
| 关闭动画 | `zoom` 缩放退出，持续时间 0.2s |
| `z-index` | 默认 1000，嵌套 Modal +100 |
| 遮罩层 | `rgba(0,0,0,0.45)` |
| 居中 | `centered` 垂直居中 |
| 宽度规范 | 小型 480px / 中型 720px / 大型 900-1000px |
| 未保存关闭 | 弹出确认框 "表单有未保存的内容，确定要关闭吗？" |

```tsx
// Modal 全局配置
<Modal
  centered
  maskClosable={true}
  keyboard={true}
  destroyOnClose
  afterClose={resetFormState}
/>
```

### 4.2 表单规范

#### 实时保存（防抖）

```tsx
// 表单变更自动保存草稿（防抖 2 秒）
const debouncedSave = useMemo(
  () => debounce((values) => {
    saveDraft(values);
    message.info('草稿已自动保存');
  }, 2000),
  []
);

<Form onValuesChange={(_, allValues) => debouncedSave(allValues)} />
```

#### 校验时机

| 时机 | 场景 | 实现 |
|------|------|------|
| `onBlur` | 用户离开输入框时校验当前字段 | `validateTrigger: 'onBlur'` |
| `onSubmit` | 点击提交按钮时全量校验 | `form.validateFields()` |
| 实时 | 特殊字段（如URL格式）边输入边校验 | `validateTrigger: 'onChange'` |

#### 错误提示

- 位置：字段下方，左对齐
- 颜色：`#FF4D4F`
- 字号：12px
- 图标：`ExclamationCircleOutlined`（可选）
- Ant Design 表单默认行为，无需额外配置

### 4.3 列表规范

#### 加载态

```tsx
// Table 加载
<Table loading={loading} />

// 卡片列表加载 - Skeleton 骨架屏
{loading ? (
  <Row gutter={[16, 16]}>
    {Array(pageSize).fill(null).map((_, i) => (
      <Col key={i} span={6}>
        <Card>
          <Skeleton active avatar={{ shape: 'square' }} paragraph={{ rows: 3 }} />
        </Card>
      </Col>
    ))}
  </Row>
) : (
  // 实际卡片内容
)}
```

#### 空状态

```tsx
// 表格空状态
<Table
  locale={{
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无数据"
      >
        <Button type="primary" onClick={handleCreate}>
          立即创建
        </Button>
      </Empty>
    ),
  }}
/>
```

#### 错误状态

```tsx
// 请求失败展示
{error && (
  <Result
    status="error"
    title="加载失败"
    subTitle={error.message}
    extra={[
      <Button type="primary" key="retry" onClick={handleRetry}>
        重新加载
      </Button>,
    ]}
  />
)}
```

### 4.4 通知反馈

| 场景 | 组件 | 配置 |
|------|------|------|
| 操作成功 | `message.success` | 持续 2s，顶部居中 |
| 操作失败 | `message.error` | 持续 3s，顶部居中 |
| 重要通知 | `notification.info` | 右上角弹出，含标题+描述+操作按钮 |
| 确认操作 | `Modal.confirm` | 居中弹窗，含标题+描述+确认/取消 |

```tsx
// 提交成功
message.success('提交成功');

// 提交失败
message.error('提交失败，请重试');

// 飞书通知提示（重要流程变更）
notification.info({
  message: '新待办通知',
  description: '您有一条新的审核待办，来自"3月第一批班车"',
  btn: (
    <Button type="primary" size="small" onClick={() => navigate(todoUrl)}>
      去处理
    </Button>
  ),
  placement: 'topRight',
  duration: 5,
});

// 危险操作确认
Modal.confirm({
  title: '确认提交审核？',
  content: '提交后将进入审核流程，请确认信息填写完整。',
  okText: '确认提交',
  cancelText: '再看看',
  okButtonProps: { danger: false },
  onOk: handleSubmit,
});
```

### 4.5 状态流转动画

```css
/* 流程节点状态变更时的颜色过渡 */
.process-node-icon {
  transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
}

/* 状态 Tag 切换动画 */
.status-tag {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 卡片状态变更高亮 */
.app-card--updated {
  animation: highlightPulse 1s ease;
}
@keyframes highlightPulse {
  0% { box-shadow: 0 0 0 0 rgba(24,144,255,0.4); }
  50% { box-shadow: 0 0 0 6px rgba(24,144,255,0.1); }
  100% { box-shadow: 0 0 0 0 rgba(24,144,255,0); }
}
```

---

## 5. 自定义组件设计清单

### 组件总览

| 组件名 | 用途 | 基于 antd 组件 | 关键 Props |
|--------|------|---------------|-----------|
| `StatusTag` | 状态标签（带数字） | `Tag` | `status: 'total'\|'success'\|'processing'\|'rejected'`, `count: number` |
| `ProcessSteps` | 流程节点条 | `Steps` | `nodes: NodeInfo[]`, `currentNode: string`, `onNodeClick: (node) => void` |
| `AppCard` | 应用卡片 | `Card` | `appInfo: AppInfo`, `onClick: () => void` |
| `TypeSelector` | 类型+多选组合选择器 | `Select` x 2 | `typeOptions: Option[]`, `valueOptions: Option[]`, `value: TypeSelectorValue`, `onChange: (val) => void` |
| `LanguageTabForm` | 多语言 Tab 表单 | `Tabs` + `Form` | `languages: LangInfo[]`, `fields: FieldConfig[]`, `value: Record<string, any>`, `onChange: (lang, field, val) => void` |
| `ImageUploader` | 图片上传+预览 | `Upload` | `maxCount: number`, `dimensions: {width, height}`, `maxSize: number (KB)`, `value`, `onChange` |
| `ReviewPanel` | 审核操作面板 | `Form` + `Radio` | `reviewers: Reviewer[]`, `showCosign: boolean`, `onSubmit: (result) => void` |
| `TodoCard` | 待办卡片 | `Card` | `todoInfo: TodoInfo`, `onHandle: (todo) => void` |
| `KanbanBoard` | 看板 | 自定义布局 | `columns: KanbanColumn[]`, `onCardClick: (card) => void` |

### 组件详细设计

#### 5.1 StatusTag

```tsx
interface StatusTagProps {
  status: 'total' | 'success' | 'processing' | 'rejected';
  count: number;
}

const colorConfig = {
  total:      { color: '#000000', bg: 'transparent', border: 'none' },
  success:    { color: '#52C41A', bg: '#F6FFED', border: '#B7EB8F' },
  processing: { color: '#1890FF', bg: '#E6F7FF', border: '#91D5FF' },
  rejected:   { color: '#FF4D4F', bg: '#FFF2F0', border: '#FFCCC7' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, count }) => {
  const config = colorConfig[status];
  return (
    <Tag
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.border,
        fontWeight: 500,
        minWidth: 32,
        textAlign: 'center',
      }}
    >
      {count}
    </Tag>
  );
};
```

#### 5.2 TypeSelector

```tsx
interface TypeSelectorValue {
  type: 'all' | 'include' | 'exclude';
  values: string[];
}

interface TypeSelectorProps {
  typeOptions: { label: string; value: string }[];
  valueOptions: { label: string; value: string }[];
  value?: TypeSelectorValue;
  onChange?: (value: TypeSelectorValue) => void;
  placeholder?: string;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  typeOptions, valueOptions, value, onChange, placeholder,
}) => {
  const isAll = value?.type === 'all';
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        value={value?.type}
        onChange={(type) => onChange?.({ type, values: type === 'all' ? [] : value?.values || [] })}
        options={typeOptions}
        style={{ width: 120, flexShrink: 0 }}
      />
      {!isAll && (
        <Select
          mode="multiple"
          showSearch
          value={value?.values}
          onChange={(values) => onChange?.({ ...value!, values })}
          options={valueOptions}
          placeholder={placeholder}
          style={{ flex: 1 }}
          maxTagCount="responsive"
        />
      )}
    </div>
  );
};
```

#### 5.3 ImageUploader

```tsx
interface ImageUploaderProps {
  maxCount: number;
  dimensions?: { width: number; height: number };
  maxSize?: number; // KB
  accept?: string;
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxCount, dimensions, maxSize = 1024, accept = '.png,.jpg,.jpeg', value, onChange,
}) => {
  const beforeUpload = (file: File) => {
    // 文件大小校验
    if (file.size / 1024 > maxSize) {
      message.error(`图片大小不能超过 ${maxSize}KB`);
      return Upload.LIST_IGNORE;
    }
    // 尺寸校验（异步）
    if (dimensions) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          if (img.width !== dimensions.width || img.height !== dimensions.height) {
            message.error(`图片尺寸应为 ${dimensions.width}x${dimensions.height}`);
            reject(Upload.LIST_IGNORE);
          } else {
            resolve(true);
          }
        };
        img.src = URL.createObjectURL(file);
      });
    }
    return true;
  };

  return (
    <Upload
      listType="picture-card"
      maxCount={maxCount}
      accept={accept}
      beforeUpload={beforeUpload}
      fileList={value}
      onChange={({ fileList }) => onChange?.(fileList)}
    >
      {(!value || value.length < maxCount) && (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8, fontSize: 12 }}>
            上传{dimensions ? ` (${dimensions.width}x${dimensions.height})` : ''}
          </div>
        </div>
      )}
    </Upload>
  );
};
```

#### 5.4 ReviewPanel

```tsx
interface Reviewer {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  isCurrentUser: boolean;
}

interface ReviewPanelProps {
  reviewers: Reviewer[];
  showCosign?: boolean;
  onSubmit: (result: { action: 'approve' | 'reject'; comment?: string }) => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ reviewers, showCosign = false, onSubmit }) => {
  const [action, setAction] = useState<'approve' | 'reject'>();
  const [comment, setComment] = useState('');

  return (
    <div>
      {/* 审核操作 */}
      <div style={{ background: '#FAFAFA', borderRadius: 8, padding: 16, marginBottom: showCosign ? 16 : 0 }}>
        <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>审核操作</Typography.Text>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group value={action} onChange={(e) => setAction(e.target.value)}>
            <Radio value="approve">通过</Radio>
            <Radio value="reject">不通过</Radio>
          </Radio.Group>
          {action === 'reject' && (
            <Input.TextArea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="请填写不通过原因（必填）"
            />
          )}
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              disabled={!action || (action === 'reject' && !comment.trim())}
              onClick={() => onSubmit({ action, comment })}
            >
              提交审核
            </Button>
          </div>
        </Space>
      </div>

      {/* 会签信息（可选） */}
      {showCosign && (
        <div style={{ background: '#FAFAFA', borderRadius: 8, padding: 16 }}>
          <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>老板会签</Typography.Text>
          <Space wrap size={12}>
            {reviewers.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', background: '#fff', borderRadius: 6, border: '1px solid #F0F0F0',
              }}>
                <Avatar size={24}>{r.name[0]}</Avatar>
                <span style={{ fontSize: 13 }}>{r.name}</span>
                <Tag color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'default'}>
                  {r.status === 'approved' ? '已通过' : r.status === 'rejected' ? '已拒绝' : '待审核'}
                </Tag>
              </div>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};
```

#### 5.5 ProcessSteps

```tsx
interface NodeInfo {
  key: string;
  name: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  handler?: string;
  icon: React.ReactNode;
}

interface ProcessStepsProps {
  nodes: NodeInfo[];
  currentNode: string;
  onNodeClick: (node: NodeInfo) => void;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ nodes, currentNode, onNodeClick }) => {
  const currentIndex = nodes.findIndex(n => n.key === currentNode);
  return (
    <div className="process-steps" style={{
      background: '#fff', borderRadius: 8, padding: '24px 32px',
    }}>
      <Steps
        current={currentIndex}
        items={nodes.map(node => ({
          title: (
            <span style={{ cursor: 'pointer', fontSize: 13 }} onClick={() => onNodeClick(node)}>
              {node.name}
            </span>
          ),
          description: <span style={{ fontSize: 12 }}>{node.handler || '待分配'}</span>,
          status: node.status,
          icon: node.icon,
        }))}
      />
    </div>
  );
};
```

#### 5.6 LanguageTabForm

```tsx
interface LangInfo {
  key: string;     // 如 'zh-CN'
  label: string;   // 如 '中文(简体)'
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'upload' | 'tags';
  rules?: Rule[];
  props?: Record<string, any>;
}

interface LanguageTabFormProps {
  languages: LangInfo[];
  fields: FieldConfig[];
  value?: Record<string, Record<string, any>>;
  onChange?: (lang: string, field: string, val: any) => void;
  onAddLanguage?: () => void;
  onRemoveLanguage?: (langKey: string) => void;
  readOnly?: boolean;
}
```

#### 5.7 KanbanBoard

```tsx
interface KanbanCard {
  id: string;
  appName: string;
  packageName: string;
  operator: string;
  updatedAt: string;
  flowName: string;
}

interface KanbanColumn {
  key: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard) => void;
}
```

---

## 6. 响应式设计

### 6.1 分辨率支持

| 分辨率 | 类型 | 支持级别 |
|--------|------|---------|
| 1280 x 720 | 最小支持 | 保证可用，内容不截断 |
| 1440 x 900 | 标准 | 良好体验 |
| 1920 x 1080 | 推荐 | 最佳体验 |
| 2560 x 1440 | 大屏 | 自适应，内容居中 |

### 6.2 断点定义

```typescript
const breakpoints = {
  sm: 1280,   // 小屏笔记本
  md: 1440,   // 标准笔记本
  lg: 1920,   // 标准桌面显示器
};
```

### 6.3 卡片响应式规则

| 屏幕宽度 | 一行卡片数 | Col span | 卡片最小宽度 |
|----------|-----------|----------|-------------|
| >= 1920px | 4-5 个 | `xl={6}` 或 `xl={4}` | 240px |
| 1440-1919px | 4 个 | `lg={6}` | 280px |
| 1280-1439px | 3 个 | `md={8}` | 300px |
| < 1280px | 2 个 | `sm={12}` | 不低于 280px |

```tsx
// 响应式 Col 配置
<Col xs={24} sm={12} md={8} lg={6} xl={6}>
  <AppCard />
</Col>
```

### 6.4 布局响应式适配

#### 工作台页面

| 屏幕宽度 | 待办面板 | 搜索栏 |
|----------|---------|--------|
| >= 1440px | 固定展开 280px | 单行排列 |
| 1280-1439px | 可收起/展开，默认收起 | 自动换行 |
| < 1280px | 隐藏，通过按钮触发 Drawer | 垂直堆叠 |

#### 流程节点条 Steps

| 屏幕宽度 | 展示方式 |
|----------|---------|
| >= 1440px | 横向展示，标签在下方 |
| 1280-1439px | 横向展示，标签在下方，文字缩略 |
| < 1280px | 横向展示，仅图标，hover 显示文字 |

#### 看板页面 Kanban

| 屏幕宽度 | 展示方式 |
|----------|---------|
| >= 1920px | 9 列完整展示 |
| 1440-1919px | 横向滚动，可见 6-7 列 |
| 1280-1439px | 横向滚动，可见 4-5 列 |

### 6.5 响应式全局配置

```tsx
// src/hooks/useResponsive.ts
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export const useResponsive = () => {
  const screens = useBreakpoint();

  return {
    isMobile: !screens.md,            // < 768
    isSmallScreen: !screens.lg,       // < 992
    isMediumScreen: screens.lg && !screens.xl,  // 992-1199
    isLargeScreen: screens.xl,        // >= 1200
    screens,
  };
};
```

### 6.6 最大宽度限制

当屏幕宽度超过 1920px 时，内容区域最大宽度 1920px，水平居中：

```css
.page-content {
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
}
```

---

## 附录

### A. 文件目录结构建议

```
src/
├── components/            # 自定义组件
│   ├── StatusTag/
│   ├── ProcessSteps/
│   ├── AppCard/
│   ├── TypeSelector/
│   ├── LanguageTabForm/
│   ├── ImageUploader/
│   ├── ReviewPanel/
│   ├── TodoCard/
│   └── KanbanBoard/
├── pages/
│   ├── Workbench/         # 工作台
│   ├── FlowDetail/        # 流程单详情
│   ├── AppFlowDetail/     # APK发布详情
│   │   └── modals/        # 7个流程节点Modal
│   │       ├── ChannelApplyModal.tsx
│   │       ├── ChannelReviewModal.tsx
│   │       ├── MaterialUploadModal.tsx
│   │       ├── MaterialReviewModal.tsx
│   │       ├── AppPublishModal.tsx
│   │       ├── BetaTestModal.tsx
│   │       └── GrayMonitorModal.tsx
│   └── Dashboard/         # 看板
│       ├── FlowView.tsx
│       ├── ProductView.tsx
│       └── StatusView.tsx
├── theme/
│   └── themeConfig.ts     # Ant Design 主题配置
├── hooks/
│   └── useResponsive.ts   # 响应式Hook
├── router/
│   └── routes.ts          # 路由配置
└── styles/
    └── process-steps.css  # 自定义样式覆盖
```

### B. 状态映射速查表

| 业务状态 | StatusTag status | Badge status | Tag color | 色值 |
|---------|-----------------|-------------|-----------|------|
| 总数 | `total` | - | `default` | `#000000` |
| 已完成 | `success` | `success` | `green` | `#52C41A` |
| 进行中 | `processing` | `processing` | `blue` | `#1890FF` |
| 已拒绝 | `rejected` | `error` | `red` | `#FF4D4F` |
| 未开始 | - | `default` | `default` | `#D9D9D9` |

### C. 操作动作 Tag 颜色映射

| 动作 | Tag color | 说明 |
|------|-----------|------|
| 提交 | `blue` | 提交申请、提交物料等 |
| 通过 | `green` | 审核通过 |
| 拒绝 | `red` | 审核拒绝 |
| 上传 | `cyan` | 物料上传 |
| 上架 | `purple` | 应用上架 |
| 完成 | `green` | 灰度监控完成 |
| 异常 | `orange` | 标记异常 |
| 回退 | `volcano` | 回退到指定节点 |
