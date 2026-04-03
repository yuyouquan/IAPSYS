# UI Refinement: Tech Glassmorphism Deep Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen the existing glassmorphism design system with refined visual hierarchy, better layout structure, and subtle micro-animations across all pages and components.

**Architecture:** Pure CSS + inline style changes across 11 existing files. No new files, no new dependencies. Changes are layered bottom-up: design tokens first, then global overrides, then layout, then pages, then components.

**Tech Stack:** React 19, TypeScript, Ant Design 6.3, CSS custom properties, CSS animations

**Spec:** `docs/superpowers/specs/2026-04-03-ui-refinement-design.md`

---

### Task 1: Design System — CSS Variables, Dot Grid, Animations

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add new CSS variables to `:root`**

In `frontend/src/index.css`, add the following variables inside the existing `:root` block, after the `--transition-normal` line (line 30):

```css
  /* Glow effects for elevation */
  --glow-primary: 0 0 20px rgba(37, 99, 235, 0.15);
  --glow-success: 0 0 20px rgba(16, 185, 129, 0.15);
  --glow-error: 0 0 20px rgba(239, 68, 68, 0.15);
  --glow-warning: 0 0 20px rgba(245, 158, 11, 0.15);

  /* Enhanced shadows - 3 level elevation */
  --shadow-sm: 0 1px 4px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 16px rgba(15, 23, 42, 0.07);
  --shadow-lg: 0 12px 40px rgba(15, 23, 42, 0.10);
  --shadow-elevated: 0 20px 60px rgba(15, 23, 42, 0.12);

  /* Card hover gradient */
  --gradient-card-hover: linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.65) 100%);

  /* Accent gradient for decorative lines */
  --gradient-accent-line: linear-gradient(90deg, #2563EB 0%, #06B6D4 50%, transparent 100%);

  /* Better easing */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
```

- [ ] **Step 2: Add dot grid background on body**

In `frontend/src/index.css`, add the following after the `body { ... }` block (after line 47):

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(circle, rgba(37, 99, 235, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}
```

- [ ] **Step 3: Add keyframe animations**

In `frontend/src/index.css`, add the following before the `@media (prefers-reduced-motion)` block (before the existing line 285):

```css
/* === Animations === */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 2px var(--pulse-color, rgba(37,99,235,0.15)); }
  50% { box-shadow: 0 0 0 5px var(--pulse-color, rgba(37,99,235,0.06)); }
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
```

- [ ] **Step 4: Verify the dev server compiles without errors**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds without CSS errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/index.css
git commit -m "style: add design system CSS variables, dot grid background, and animation keyframes"
```

---

### Task 2: Design System — Refined Ant Design Overrides

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Enhance card hover effect**

In `frontend/src/index.css`, replace the existing `.ant-card:hover` block (currently at approximately line 83-85):

Old:
```css
.ant-card:hover {
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.09) !important;
}
```

New:
```css
.ant-card:hover {
  background: var(--gradient-card-hover) !important;
  box-shadow: var(--shadow-md) !important;
  transform: translateY(-2px);
}
```

- [ ] **Step 2: Add modal top accent line**

In `frontend/src/index.css`, add the following after the `.ant-modal .ant-modal-content` block (after line 95):

```css
.ant-modal .ant-modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-accent-line);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
```

- [ ] **Step 3: Add table header gradient line**

In `frontend/src/index.css`, add the following after the existing `.ant-table-wrapper .ant-table-thead > tr > th` block (after line 117):

```css
.ant-table-wrapper .ant-table-thead > tr > th::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--gradient-accent-line);
  opacity: 0.5;
}

.ant-table-wrapper .ant-table-thead > tr > th {
  position: relative;
}
```

- [ ] **Step 4: Enhance primary button hover glow**

In `frontend/src/index.css`, replace the existing `.ant-btn-primary:hover` block:

Old:
```css
.ant-btn-primary:hover {
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35) !important;
  transform: translateY(-0.5px);
}
```

New:
```css
.ant-btn-primary:hover {
  box-shadow: var(--glow-primary), 0 4px 14px rgba(37, 99, 235, 0.35) !important;
  transform: translateY(-1px);
}
```

- [ ] **Step 5: Enhance active pagination glow**

In `frontend/src/index.css`, replace the existing `.ant-pagination .ant-pagination-item-active` block:

Old:
```css
.ant-pagination .ant-pagination-item-active {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
  border-color: #2563EB !important;
}
```

New:
```css
.ant-pagination .ant-pagination-item-active {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
  border-color: #2563EB !important;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.25) !important;
}
```

- [ ] **Step 6: Add alternating table row tint and row hover shift**

In `frontend/src/index.css`, add after the existing `.ant-table-wrapper .ant-table-tbody > tr:hover > td` block (after line 125):

```css
.ant-table-wrapper .ant-table-tbody > tr:nth-child(even) > td {
  background: rgba(37, 99, 235, 0.012) !important;
}

.ant-table-wrapper .ant-table-tbody > tr {
  transition: transform 0.15s ease !important;
}

.ant-table-wrapper .ant-table-tbody > tr:hover {
  transform: translateX(1px);
}
```

- [ ] **Step 7: Add glass-header accent line class**

In `frontend/src/index.css`, replace the existing `.glass-header` block:

Old:
```css
.glass-header {
  background: var(--gradient-header);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 1px 12px rgba(15, 23, 42, 0.06);
}
```

New:
```css
.glass-header {
  background: var(--gradient-header);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: none;
  box-shadow: 0 1px 12px rgba(15, 23, 42, 0.06);
  position: relative;
}

.glass-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--gradient-accent-line);
}
```

- [ ] **Step 8: Add section title bar utility class**

In `frontend/src/index.css`, add before the scrollbar section:

```css
/* Section title bar accent */
.section-title-bar .ant-card-head-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 16px;
  background: linear-gradient(180deg, #2563EB 0%, #06B6D4 100%);
  border-radius: 2px;
  margin-right: 8px;
  vertical-align: middle;
}
```

- [ ] **Step 9: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 10: Commit**

```bash
git add frontend/src/index.css
git commit -m "style: refined Ant Design overrides — card hover, modal accent, table gradient, button glow"
```

---

### Task 3: Theme Config Updates

**Files:**
- Modify: `frontend/src/theme/themeConfig.ts`

- [ ] **Step 1: Update spacing and sizing tokens**

In `frontend/src/theme/themeConfig.ts`, update the `Layout` and `Card` and `Modal` component configs:

Replace the `Layout` component config:
```typescript
    Layout: {
      headerBg: 'transparent',
      headerHeight: 64,
      headerPadding: '0 32px',
      bodyBg: 'transparent',
    },
```

Replace the `Card` component config:
```typescript
    Card: {
      paddingLG: 24,
      borderRadiusLG: 12,
    },
```

Replace the `Modal` component config:
```typescript
    Modal: {
      paddingContentHorizontalLG: 28,
      borderRadiusLG: 16,
    },
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/theme/themeConfig.ts
git commit -m "style: update theme config — larger header, card padding, modal radius"
```

---

### Task 4: MainLayout Header Redesign

**Files:**
- Modify: `frontend/src/layouts/MainLayout/index.tsx`

- [ ] **Step 1: Update header height and content padding**

In `MainLayout/index.tsx`, update the Header style (around line 88):

Replace:
```tsx
          padding: '0 28px',
          height: 60,
```
With:
```tsx
          padding: '0 32px',
          height: 64,
```

Update Content padding (around line 190):
Replace:
```tsx
          padding: '20px 28px',
          minHeight: 'calc(100vh - 60px)',
```
With:
```tsx
          padding: '24px 32px',
          minHeight: 'calc(100vh - 64px)',
```

- [ ] **Step 2: Redesign the logo with shimmer effect**

Replace the logo div (lines 95-110):

Old:
```tsx
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            >
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                IA
              </span>
            </div>
```

New:
```tsx
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 4s ease-in-out infinite',
                }}
              />
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', position: 'relative', zIndex: 1 }}>
                IA
              </span>
            </div>
```

- [ ] **Step 3: Add user area divider and bell icon glass circle**

Replace the user area div (starting at approximately line 131):

Old:
```tsx
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
```

New:
```tsx
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
```

Replace the bell icon Badge section (around line 161-163):

Old:
```tsx
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#334155' }} />
          </Badge>
```

New:
```tsx
          <Badge count={5} size="small">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
            >
              <BellOutlined style={{ fontSize: 16, color: '#334155' }} />
            </div>
          </Badge>
          {/* Vertical divider */}
          <div style={{ width: 1, height: 24, background: 'rgba(148, 163, 184, 0.15)' }} />
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/layouts/MainLayout/index.tsx
git commit -m "style: MainLayout header — shimmer logo, accent line, glass bell icon, divider"
```

---

### Task 5: StatusTag Component Enhancement

**Files:**
- Modify: `frontend/src/components/StatusTag/index.tsx`

- [ ] **Step 1: Add icon imports and replace dot with status icons**

Replace the entire `frontend/src/components/StatusTag/index.tsx` file:

```tsx
import React from 'react';
import {
  CheckOutlined,
  SyncOutlined,
  CloseOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { STATUS_TAG_CONFIG } from '../../constants/enums';

type StatusType = 'total' | 'success' | 'processing' | 'rejected';

interface StatusTagProps {
  status: StatusType;
  count: number;
  onClick?: () => void;
}

const STATUS_ICON: Record<StatusType, React.ReactNode> = {
  total: <MinusOutlined style={{ fontSize: 9 }} />,
  success: <CheckOutlined style={{ fontSize: 9 }} />,
  processing: <SyncOutlined style={{ fontSize: 9 }} />,
  rejected: <CloseOutlined style={{ fontSize: 9 }} />,
};

const StatusTag: React.FC<StatusTagProps> = ({ status, count, onClick }) => {
  const config = STATUS_TAG_CONFIG[status];

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 8,
        fontSize: 12,
        color: config.text,
        background: config.bg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${config.text}18`,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 500,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.text}20, inset 0 1px 2px rgba(0,0,0,0.04)`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
        }
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: `${config.text}15`,
          color: config.text,
        }}
      >
        {STATUS_ICON[status]}
      </span>
      <span>{config.label}</span>
      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{count}</span>
    </span>
  );
};

export default StatusTag;
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/StatusTag/index.tsx
git commit -m "style: StatusTag — replace dot with status icons, add inner shadow and hover glow"
```

---

### Task 6: TodoCard Component Enhancement

**Files:**
- Modify: `frontend/src/components/TodoCard/index.tsx`

- [ ] **Step 1: Enhance hover effects and action button styling**

Replace the entire `frontend/src/components/TodoCard/index.tsx` file:

```tsx
import React from 'react';
import { Card, Tag, Button, Alert } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { NODE_STATUS_COLOR } from '../../constants/enums';

interface TodoInfo {
  id: string;
  flowId: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: string;
  currentNodeName: string;
  currentNodeStatus: string;
  handler: string;
  rejectReason?: string;
}

interface TodoCardProps {
  todoInfo: TodoInfo;
  onHandle: (todo: TodoInfo) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todoInfo, onHandle }) => {
  const statusColor = NODE_STATUS_COLOR[todoInfo.currentNodeStatus as keyof typeof NODE_STATUS_COLOR] || '#9CA3AF';

  return (
    <Card
      size="small"
      style={{
        marginBottom: 10,
        borderRadius: 12,
        borderLeft: `3px solid ${statusColor}`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.40) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.35)`,
        borderLeftWidth: 3,
        borderLeftColor: statusColor,
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
        e.currentTarget.style.boxShadow = `inset 3px 0 8px ${statusColor}20, 0 4px 16px rgba(15, 23, 42, 0.06)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.04)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400 }}>{todoInfo.shuttleName}</span>
        <Tag
          color={statusColor}
          style={{
            fontSize: 11,
            margin: 0,
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          {todoInfo.currentNodeName}
        </Tag>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#0F172A' }}>{todoInfo.appName}</div>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
        处理人：{todoInfo.handler}
      </div>
      {todoInfo.rejectReason && (
        <Alert
          type="error"
          title={todoInfo.rejectReason}
          style={{ marginBottom: 8, fontSize: 12, borderRadius: 8 }}
          showIcon
          banner
        />
      )}
      <div style={{ textAlign: 'right' }}>
        <span
          onClick={() => onHandle(todoInfo)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 14px',
            borderRadius: 16,
            background: 'rgba(37, 99, 235, 0.06)',
            color: '#2563EB',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(37, 99, 235, 0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.12)';
            const arrow = e.currentTarget.querySelector('.todo-arrow') as HTMLElement;
            if (arrow) arrow.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.06)';
            const arrow = e.currentTarget.querySelector('.todo-arrow') as HTMLElement;
            if (arrow) arrow.style.transform = 'translateX(0)';
          }}
        >
          去处理
          <RightOutlined className="todo-arrow" style={{ fontSize: 10, transition: 'transform 0.2s ease' }} />
        </span>
      </div>
    </Card>
  );
};

export default TodoCard;
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/TodoCard/index.tsx
git commit -m "style: TodoCard — glass pill action button, hover glow and scale effects"
```

---

### Task 7: ProcessSteps Component Enhancement

**Files:**
- Modify: `frontend/src/components/ProcessSteps/index.tsx`

- [ ] **Step 1: Replace the entire ProcessSteps component with enhanced version**

Replace the entire `frontend/src/components/ProcessSteps/index.tsx` file:

```tsx
import React from 'react';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
  ClockCircleOutlined,
  UserOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { ProcessNode, NodeType, NodeStatus } from '../../types/node';
import { NODE_CONFIG } from '../../constants/enums';

interface ProcessStepsProps {
  nodes: ProcessNode[];
  activeNode?: NodeType;
  onNodeClick: (nodeType: NodeType) => void;
}

const STATUS_THEME: Record<NodeStatus, {
  color: string;
  bg: string;
  glassBg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
  lineColor: string;
  badgeBg: string;
  badgeText: string;
}> = {
  completed: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(16, 185, 129, 0.22)',
    icon: <CheckCircleFilled style={{ fontSize: 18, color: '#10B981' }} />,
    label: '已完成',
    lineColor: '#10B981',
    badgeBg: '#10B981',
    badgeText: '#fff',
  },
  processing: {
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(37, 99, 235, 0.25)',
    icon: <SyncOutlined spin style={{ fontSize: 18, color: '#2563EB' }} />,
    label: '进行中',
    lineColor: '#2563EB',
    badgeBg: '#2563EB',
    badgeText: '#fff',
  },
  rejected: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.07)',
    glassBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(255,255,255,0.60) 100%)',
    border: 'rgba(239, 68, 68, 0.22)',
    icon: <CloseCircleFilled style={{ fontSize: 18, color: '#EF4444' }} />,
    label: '已驳回',
    lineColor: '#EF4444',
    badgeBg: '#EF4444',
    badgeText: '#fff',
  },
  pending: {
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.05)',
    glassBg: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(248,250,252,0.40) 100%)',
    border: 'rgba(148, 163, 184, 0.15)',
    icon: <ClockCircleOutlined style={{ fontSize: 18, color: '#94A3B8' }} />,
    label: '未开始',
    lineColor: 'rgba(148, 163, 184, 0.20)',
    badgeBg: '#E2E8F0',
    badgeText: '#94A3B8',
  },
};

const ProcessSteps: React.FC<ProcessStepsProps> = ({ nodes, activeNode, onNodeClick }) => {
  const sortedNodes = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', padding: '12px 0 4px' }}>
      {sortedNodes.map((node, idx) => {
        const theme = STATUS_THEME[node.nodeStatus];
        const clickable = node.nodeStatus !== 'pending';
        const isActive = activeNode === node.nodeType;
        const isPending = node.nodeStatus === 'pending';
        const stepNumber = idx + 1;

        // Determine connector line style
        const connectorSolid = node.nodeStatus === 'completed';
        const connectorColor = connectorSolid ? '#10B981' : node.nodeStatus === 'processing' ? '#2563EB' : 'rgba(148, 163, 184, 0.25)';

        return (
          <React.Fragment key={node.nodeId}>
            <div
              onClick={clickable ? () => onNodeClick(node.nodeType) : undefined}
              style={{
                flex: '1 1 0',
                minWidth: 120,
                maxWidth: 180,
                padding: '14px 14px 12px',
                borderRadius: 10,
                border: `1.5px solid ${isActive ? theme.color : theme.border}`,
                background: theme.glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: clickable ? 'pointer' : 'default',
                opacity: isPending ? 0.6 : 1,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                boxShadow: isActive
                  ? `0 4px 16px ${theme.color}18`
                  : clickable
                    ? 'var(--shadow-sm)'
                    : 'none',
                ...(isActive ? {
                  animation: 'glowPulse 2.5s ease-in-out infinite',
                  // @ts-expect-error CSS custom property
                  '--pulse-color': `${theme.color}20`,
                } : {}),
              }}
              onMouseEnter={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = theme.color;
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.color}15`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (clickable && !isActive) {
                  e.currentTarget.style.borderColor = String(theme.border);
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: theme.badgeBg,
                  color: theme.badgeText,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  zIndex: 1,
                }}
              >
                {stepNumber}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                {theme.icon}
                <span
                  style={{
                    fontSize: 11,
                    color: theme.color,
                    background: theme.bg,
                    padding: '2px 7px',
                    borderRadius: 5,
                    fontWeight: 500,
                    lineHeight: '18px',
                  }}
                >
                  {theme.label}
                </span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isPending ? '#94A3B8' : '#0F172A',
                  marginBottom: 6,
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {NODE_CONFIG[node.nodeType]?.name || node.nodeName}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <UserOutlined style={{ fontSize: 11, color: isPending ? '#CBD5E1' : '#64748B' }} />
                <span style={{ fontSize: 12, color: isPending ? '#CBD5E1' : '#64748B', lineHeight: '16px' }}>
                  {node.ownerName}
                </span>
              </div>
            </div>

            {/* Connector */}
            {idx < sortedNodes.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', width: 36, minWidth: 36, justifyContent: 'center', padding: '0 2px' }}>
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    background: connectorSolid
                      ? `linear-gradient(90deg, ${connectorColor}, ${connectorColor})`
                      : connectorColor,
                    borderRadius: 1,
                    ...((!connectorSolid && isPending) ? {
                      backgroundImage: `repeating-linear-gradient(90deg, rgba(148,163,184,0.25) 0px, rgba(148,163,184,0.25) 4px, transparent 4px, transparent 8px)`,
                      backgroundColor: 'transparent',
                    } : {}),
                  }}
                />
                <RightOutlined
                  style={{
                    fontSize: 10,
                    color: connectorColor,
                    flexShrink: 0,
                    marginLeft: -2,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessSteps;
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ProcessSteps/index.tsx
git commit -m "style: ProcessSteps — step number badges, chevron connectors, active glow pulse, dashed pending lines"
```

---

### Task 8: Workbench Page Enhancement

**Files:**
- Modify: `frontend/src/pages/Workbench/index.tsx`

- [ ] **Step 1: Add page header with title and stats**

In `Workbench/index.tsx`, add a page header section. Insert the following right after the opening `<Content style={{ padding: 24 }} className="glass-card-static">` (line 225):

```tsx
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>工作台</h2>
          <span style={{ fontSize: 13, color: '#64748B', marginTop: 4, display: 'block' }}>
            共 {flowTotal} 个班车
          </span>
        </div>
```

- [ ] **Step 2: Wrap toolbar in a glass container**

Wrap the existing toolbar div (the `<div style={{ display: 'flex', justifyContent: 'space-between'...` section) in a glass container. Replace the outer div style:

Old:
```tsx
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
```

New:
```tsx
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12,
          padding: 16, borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
```

- [ ] **Step 3: Enhance todo sidebar header with gradient underline**

In the todo expanded section, replace the header div (line ~458):

Old:
```tsx
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>待办事项</span>
```

New:
```tsx
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>待办事项</span>
```

And close the new inner div after the `Space` component (adding `</div>` before adding the gradient line). Also add the gradient underline. Replace the full header block:

Old:
```tsx
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>待办事项</span>
              <Space size={8}>
                <Badge count={todoTotal} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }} />
                <span
                  onClick={() => setTodoCollapsed(true)}
                  style={{ cursor: 'pointer', fontSize: 12, color: '#999' }}
                >▶</span>
              </Space>
            </div>
```

New:
```tsx
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>待办事项</span>
                <Space size={8}>
                  <Badge count={todoTotal} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }} />
                  <span
                    onClick={() => setTodoCollapsed(true)}
                    style={{ cursor: 'pointer', fontSize: 12, color: '#999' }}
                  >▶</span>
                </Space>
              </div>
              <div style={{ height: 1.5, background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 40%, transparent 100%)', borderRadius: 1 }} />
            </div>
```

- [ ] **Step 4: Add pulsing dot to collapsed todo sidebar**

In the collapsed state section, add a pulsing dot after the Badge. Replace:

Old:
```tsx
            <Badge count={todoTotal} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }} />
            <div
              style={{
                writingMode: 'vertical-rl',
```

New:
```tsx
            <Badge count={todoTotal} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }} />
            {todoTotal > 0 && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#2563EB',
                  marginTop: 8,
                  animation: 'dotPulse 2s ease-in-out infinite',
                }}
              />
            )}
            <div
              style={{
                writingMode: 'vertical-rl',
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Workbench/index.tsx
git commit -m "style: Workbench — page header, glass toolbar, todo sidebar gradient accent and pulse dot"
```

---

### Task 9: Dashboard Page Enhancement

**Files:**
- Modify: `frontend/src/pages/Dashboard/index.tsx`

- [ ] **Step 1: Add overview stats row and enhance all views**

Replace the entire `frontend/src/pages/Dashboard/index.tsx` file:

```tsx
import React, { useState } from 'react';
import { Tabs, Card, Row, Col, Progress, Tag, Empty, Space, Flex } from 'antd';
import {
  RocketOutlined, AppstoreOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CloseCircleOutlined, BarChartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import StatusTag from '../../components/StatusTag';

// Mock 看板数据
const mockShuttleView = [
  {
    shuttleId: 'FLOW-001', shuttleName: '3月班车', month: '2026-03',
    products: ['Weather Pro', 'HiOS Launcher', 'Palm Store', 'Smart Finance', 'EDU Learn'],
    productCount: 5, completionRate: 40,
    statusSummary: { total: 5, success: 2, processing: 2, rejected: 1 },
  },
  {
    shuttleId: 'FLOW-002', shuttleName: '3月临时班车01', month: '2026-03',
    products: ['Boomplay', 'Phoenix Browser', 'CarlCare'],
    productCount: 3, completionRate: 0,
    statusSummary: { total: 3, success: 0, processing: 3, rejected: 0 },
  },
  {
    shuttleId: 'FLOW-003', shuttleName: '2月班车', month: '2026-02',
    products: ['App1', 'App2', 'App3', 'App4', 'App5', 'App6', 'App7', 'App8'],
    productCount: 8, completionRate: 100,
    statusSummary: { total: 8, success: 8, processing: 0, rejected: 0 },
  },
];

const mockProductView = [
  { appId: 'AV-001', appName: 'Weather Pro', appIcon: '', publishCount: 3 },
  { appId: 'AV-002', appName: 'HiOS Launcher', appIcon: '', publishCount: 2 },
  { appId: 'AV-003', appName: 'Palm Store', appIcon: '', publishCount: 5 },
  { appId: 'AV-004', appName: 'Smart Finance', appIcon: '', publishCount: 1 },
  { appId: 'AV-006', appName: 'Boomplay', appIcon: '', publishCount: 4 },
];

const mockStatusView = {
  processing: [
    { appName: 'HiOS Launcher', currentNode: '通道发布审核', shuttleName: '3月班车' },
    { appName: 'Smart Finance', currentNode: '业务内测', shuttleName: '3月班车' },
    { appName: 'Smart Health', currentNode: '应用上架', shuttleName: '3月班车' },
    { appName: 'Boomplay', currentNode: '通道发布申请', shuttleName: '3月临时班车01' },
    { appName: 'Phoenix Browser', currentNode: '物料审核', shuttleName: '3月临时班车01' },
  ],
  completed: [
    { appName: 'Weather Pro', currentNode: '灰度监控', shuttleName: '3月班车' },
    { appName: 'App1~App8', currentNode: '全部完成', shuttleName: '2月班车' },
  ],
  failed: [
    { appName: 'EDU Learn', currentNode: '通道发布申请', shuttleName: '3月班车' },
    { appName: 'Palm Store', currentNode: '物料上传', shuttleName: '3月班车' },
  ],
};

// Compute overview stats
const totalShuttles = mockShuttleView.length;
const totalProcessing = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.processing, 0);
const totalCompleted = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.success, 0);
const totalApps = mockShuttleView.reduce((sum, s) => sum + s.statusSummary.total, 0);
const completionRate = totalApps > 0 ? Math.round((totalCompleted / totalApps) * 100) : 0;

const STAT_CARDS = [
  { label: '班车总数', value: totalShuttles, icon: <RocketOutlined />, color: '#2563EB' },
  { label: '进行中', value: totalProcessing, icon: <ThunderboltOutlined />, color: '#06B6D4' },
  { label: '已完成', value: totalCompleted, icon: <CheckCircleOutlined />, color: '#10B981' },
  { label: '完成率', value: `${completionRate}%`, icon: <BarChartOutlined />, color: '#F59E0B' },
];

const STATUS_COLUMN_CONFIG = {
  processing: { color: '#2563EB', icon: <ClockCircleOutlined style={{ color: '#2563EB' }} />, label: '进行中', tagColor: 'blue' },
  completed: { color: '#10B981', icon: <CheckCircleOutlined style={{ color: '#10B981' }} />, label: '已完成', tagColor: 'green' },
  failed: { color: '#EF4444', icon: <CloseCircleOutlined style={{ color: '#EF4444' }} />, label: '失败', tagColor: 'red' },
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shuttle');

  return (
    <div>
      {/* Overview stats row */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {STAT_CARDS.map((stat) => (
          <Col key={stat.label} xs={12} md={6}>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(248,250,252,0.55) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `radial-gradient(circle, ${stat.color}15 0%, ${stat.color}08 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'shuttle',
              label: <span><RocketOutlined /> 班车视角</span>,
              children: (
                <Row gutter={[16, 16]}>
                  {mockShuttleView.map((shuttle) => {
                    const topBorderColor = shuttle.completionRate === 100 ? '#10B981' : shuttle.completionRate > 0 ? '#2563EB' : '#94A3B8';
                    return (
                      <Col key={shuttle.shuttleId} xs={24} md={12} lg={8}>
                        <Card
                          hoverable
                          style={{
                            borderTop: `2.5px solid ${topBorderColor}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{shuttle.shuttleName}</span>
                            <Tag style={{ borderRadius: 6 }}>{shuttle.month}</Tag>
                          </div>
                          <Progress
                            percent={shuttle.completionRate}
                            size="small"
                            strokeColor={{ from: '#2563EB', to: '#06B6D4' }}
                            style={{ marginBottom: 12 }}
                          />
                          <Space size={4} wrap style={{ marginBottom: 10 }}>
                            <StatusTag status="total" count={shuttle.statusSummary.total} />
                            <StatusTag status="success" count={shuttle.statusSummary.success} />
                            <StatusTag status="processing" count={shuttle.statusSummary.processing} />
                            <StatusTag status="rejected" count={shuttle.statusSummary.rejected} />
                          </Space>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {shuttle.products.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                style={{
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  background: 'rgba(37, 99, 235, 0.05)',
                                  color: '#64748B',
                                  border: '1px solid rgba(148, 163, 184, 0.12)',
                                }}
                              >
                                {p}
                              </span>
                            ))}
                            {shuttle.productCount > 3 && (
                              <span style={{ fontSize: 11, color: '#94A3B8', lineHeight: '22px' }}>
                                +{shuttle.productCount - 3}
                              </span>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ),
            },
            {
              key: 'product',
              label: <span><AppstoreOutlined /> 产品视角</span>,
              children: (
                <Row gutter={[16, 16]}>
                  {mockProductView.map((product) => (
                    <Col key={product.appId} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{ textAlign: 'center' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.02) 100%)',
                        }}>
                          <AppstoreOutlined style={{ color: '#2563EB' }} />
                        </div>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{product.appName}</div>
                        <div style={{ color: '#2563EB' }}>
                          发布 <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{product.publishCount}</span> 次
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'status',
              label: <span><CheckCircleOutlined /> 状态视角</span>,
              children: (
                <Row gutter={16}>
                  {(['processing', 'completed', 'failed'] as const).map((statusKey) => {
                    const config = STATUS_COLUMN_CONFIG[statusKey];
                    const items = mockStatusView[statusKey];
                    return (
                      <Col key={statusKey} xs={24} md={8}>
                        <Card
                          title={<Space>{config.icon} {config.label}</Space>}
                          extra={<Tag color={config.tagColor}>{items.length}</Tag>}
                          style={{ borderTop: `3px solid ${config.color}` }}
                        >
                          <Flex vertical gap={0}>
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '10px 8px',
                                  borderBottom: idx < items.length - 1 ? '1px solid rgba(148, 163, 184, 0.10)' : 'none',
                                  borderRadius: 6,
                                  transition: 'all 0.15s ease',
                                  cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${config.color}06`;
                                  e.currentTarget.style.borderLeft = `2px solid ${config.color}`;
                                  e.currentTarget.style.paddingLeft = '10px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.borderLeft = 'none';
                                  e.currentTarget.style.paddingLeft = '8px';
                                }}
                              >
                                <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.appName}</div>
                                <div><Tag color={config.tagColor} style={{ borderRadius: 6 }}>{item.currentNode}</Tag> <span style={{ fontSize: 12, color: '#64748B' }}>{item.shuttleName}</span></div>
                              </div>
                            ))}
                          </Flex>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Dashboard/index.tsx
git commit -m "style: Dashboard — overview stats row, gradient progress, glass pills, colored status columns"
```

---

### Task 10: FlowDetail Page Enhancement

**Files:**
- Modify: `frontend/src/pages/FlowDetail/index.tsx`

- [ ] **Step 1: Enhance breadcrumb with glass pill container**

In `FlowDetail/index.tsx`, replace the Breadcrumb section (around line 83-89):

Old:
```tsx
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
          { title: '流程单详情' },
        ]}
      />
```

New:
```tsx
      <div style={{
        display: 'inline-flex',
        padding: '6px 16px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.4)',
        marginBottom: 16,
      }}>
        <Breadcrumb
          items={[
            { title: <span style={{ cursor: 'pointer', color: '#2563EB' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
            { title: '流程单详情' },
          ]}
        />
      </div>
```

- [ ] **Step 2: Add section title dot to info card**

Replace the Descriptions title (around line 93):

Old:
```tsx
        <Descriptions title="基础信息" column={4}>
```

New:
```tsx
        <Descriptions title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />基础信息</span>} column={4}>
```

- [ ] **Step 3: Enhance app card icon area and hover effects**

In the app card rendering section, replace the icon container div (around line 167):

Old:
```tsx
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
```

New:
```tsx
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
```

Also update the Card component to add status-colored hover glow. Replace the Card style (around line 157-163):

Old:
```tsx
                    <Card
                      hoverable
                      onClick={() => navigate(`/workbench/flow/${flowId}/app/${app.id}`)}
                      styles={{ body: { padding: 16, height: '100%', display: 'flex', flexDirection: 'column' as const } }}
                      style={{
                        height: '100%',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        borderLeft: `3px solid ${statusColor}`,
                        overflow: 'hidden',
                      }}
                    >
```

New:
```tsx
                    <Card
                      hoverable
                      onClick={() => navigate(`/workbench/flow/${flowId}/app/${app.id}`)}
                      styles={{ body: { padding: 16, height: '100%', display: 'flex', flexDirection: 'column' as const } }}
                      style={{
                        height: '100%',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        borderLeft: `3px solid ${statusColor}`,
                        overflow: 'hidden',
                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 0 16px ${statusColor}20, var(--shadow-md)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
```

- [ ] **Step 4: Add warning icon to reject reason bar**

Replace the reject reason div (around line 199-212). Add `ExclamationCircleOutlined` to imports first (it's already imported from `@ant-design/icons` — but check: the current imports are `PlusOutlined, SearchOutlined, HomeOutlined, AppstoreOutlined`). Add the import:

Update the import line:
Old:
```tsx
import { PlusOutlined, SearchOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
```

New:
```tsx
import { PlusOutlined, SearchOutlined, HomeOutlined, AppstoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
```

Then replace the reject reason rendering:

Old:
```tsx
                        {app.rejectReason && (
                          <div
                            title={app.rejectReason}
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(239, 68, 68, 0.08)',
                              borderRadius: 6,
                              fontSize: 12,
                              color: '#EF4444',
                              lineHeight: '18px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {app.rejectReason}
                          </div>
                        )}
```

New:
```tsx
                        {app.rejectReason && (
                          <div
                            title={app.rejectReason}
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(239, 68, 68, 0.08)',
                              borderRadius: 6,
                              fontSize: 12,
                              color: '#EF4444',
                              lineHeight: '18px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <ExclamationCircleOutlined style={{ fontSize: 11, flexShrink: 0 }} />
                            {app.rejectReason}
                          </div>
                        )}
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/FlowDetail/index.tsx
git commit -m "style: FlowDetail — glass breadcrumb pill, title dot, card hover glow, icon gradient, reject warning icon"
```

---

### Task 11: AppFlowDetail Page Enhancement

**Files:**
- Modify: `frontend/src/pages/AppFlowDetail/index.tsx`

- [ ] **Step 1: Enhance breadcrumb with glass pill**

In `AppFlowDetail/index.tsx`, replace the Breadcrumb section (around line 105-112):

Old:
```tsx
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
          { title: <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/workbench/flow/${flowId}`)}>流程单详情</span> },
          { title: 'APK 发布详情' },
        ]}
      />
```

New:
```tsx
      <div style={{
        display: 'inline-flex',
        padding: '6px 16px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.4)',
        marginBottom: 16,
      }}>
        <Breadcrumb
          items={[
            { title: <span style={{ cursor: 'pointer', color: '#2563EB' }} onClick={() => navigate('/workbench')}><HomeOutlined /> 工作台</span> },
            { title: <span style={{ cursor: 'pointer', color: '#2563EB' }} onClick={() => navigate(`/workbench/flow/${flowId}`)}>流程单详情</span> },
            { title: 'APK 发布详情' },
          ]}
        />
      </div>
```

- [ ] **Step 2: Enhance app header card — icon glow ring, typography, status glow**

Replace the app info header section (around line 116-127):

Old:
```tsx
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            {currentApp.appIcon ? <img src={currentApp.appIcon} alt="" style={{ width: 64, height: 64, borderRadius: 12 }} /> : <AppstoreOutlined style={{ color: '#8C8C8C' }} />}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{currentApp.appName}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{currentApp.packageName}</div>
          </div>
          <Tag color={statusInfo.color} style={{ marginLeft: 'auto', fontSize: 14, padding: '4px 12px' }}>
            {statusInfo.text}
          </Tag>
        </div>
```

New:
```tsx
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.02) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            boxShadow: `0 0 0 3px ${statusInfo.color}20`,
          }}>
            {currentApp.appIcon ? <img src={currentApp.appIcon} alt="" style={{ width: 64, height: 64, borderRadius: 12 }} /> : <AppstoreOutlined style={{ color: '#2563EB' }} />}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px', color: '#0F172A' }}>{currentApp.appName}</div>
            <div style={{ fontSize: 13, color: '#64748B', fontFamily: 'var(--font-mono)' }}>{currentApp.packageName}</div>
          </div>
          <Tag
            color={statusInfo.color}
            style={{
              marginLeft: 'auto', fontSize: 14, padding: '6px 16px',
              boxShadow: `0 0 12px ${statusInfo.color}25`,
              borderRadius: 8,
            }}
          >
            {statusInfo.text}
          </Tag>
        </div>
```

- [ ] **Step 3: Add section title bars to process and log cards**

Replace the process card (around line 141):

Old:
```tsx
      <Card title="应用发布流程" style={{ marginBottom: 24 }}>
```

New:
```tsx
      <Card title="应用发布流程" style={{ marginBottom: 24 }} className="section-title-bar">
```

Replace the log card (around line 150):

Old:
```tsx
      <Card title="历史操作记录">
```

New:
```tsx
      <Card title="历史操作记录" className="section-title-bar">
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/AppFlowDetail/index.tsx
git commit -m "style: AppFlowDetail — glass breadcrumb, icon glow ring, enhanced typography, section title bars"
```

---

### Task 12: StickyReviewPanel Enhancement

**Files:**
- Modify: `frontend/src/components/NodeModals/shared/StickyReviewPanel.tsx`

- [ ] **Step 1: Enhance radio buttons, submit button, and counter-sign avatars**

In `StickyReviewPanel.tsx`, replace the radio group section (around line 129-134):

Old:
```tsx
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 12 }}>审核结果：</Text>
          <Radio.Group value={result} onChange={(e) => setResult(e.target.value)} disabled={disabled}>
            <Radio value="approved">通过</Radio>
            <Radio value="rejected">不通过</Radio>
          </Radio.Group>
        </div>
```

New:
```tsx
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ marginRight: 12 }}>审核结果：</Text>
          <Radio.Group value={result} onChange={(e) => setResult(e.target.value)} disabled={disabled}>
            <Radio.Button
              value="approved"
              style={{
                borderRadius: '16px 0 0 16px',
                ...(result === 'approved' ? {
                  background: 'rgba(16, 185, 129, 0.10)',
                  borderColor: '#10B981',
                  color: '#10B981',
                } : {}),
              }}
            >
              通过
            </Radio.Button>
            <Radio.Button
              value="rejected"
              style={{
                borderRadius: '0 16px 16px 0',
                ...(result === 'rejected' ? {
                  background: 'rgba(239, 68, 68, 0.10)',
                  borderColor: '#EF4444',
                  color: '#EF4444',
                } : {}),
              }}
            >
              不通过
            </Radio.Button>
          </Radio.Group>
        </div>
```

- [ ] **Step 2: Enhance submit button to full-width with glow**

Replace the submit button (around line 170):

Old:
```tsx
        <Button type="primary" onClick={handleSubmit} disabled={disabled || !result}>
          提交审核
        </Button>
```

New:
```tsx
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={disabled || !result}
          block
          style={{
            height: 40,
            borderRadius: 10,
            fontWeight: 500,
            fontSize: 14,
            ...((!disabled && result) ? {
              boxShadow: '0 0 16px rgba(37, 99, 235, 0.20), 0 2px 8px rgba(37, 99, 235, 0.25)',
            } : {}),
          }}
        >
          提交审核
        </Button>
```

- [ ] **Step 3: Add avatar circles to counter-sign reviewer items**

Add `Avatar` to imports. Update the import line:

Old:
```tsx
import { Card, Radio, Input, Button, Tag, Space, Typography, Select, message } from 'antd';
```

New:
```tsx
import { Card, Radio, Input, Button, Tag, Space, Typography, Select, message, Avatar } from 'antd';
```

Replace the counter-sign reviewer Tag rendering (around line 97-111):

Old:
```tsx
                      <Tag
                        icon={
                          status === 'approved' ? <CheckCircleOutlined /> :
                          status === 'rejected' ? <CloseCircleOutlined /> :
                          <ClockCircleOutlined />
                        }
                        color={
                          status === 'approved' ? 'success' :
                          status === 'rejected' ? 'error' :
                          'default'
                        }
                      >
                        {r.name}
                        {status === 'approved' ? ' 已通过' : status === 'rejected' ? ' 已拒绝' : ' 待审核'}
                      </Tag>
```

New:
```tsx
                      <Space size={8}>
                        <Avatar
                          size={24}
                          style={{
                            backgroundColor: status === 'approved' ? '#10B981' : status === 'rejected' ? '#EF4444' : '#94A3B8',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {r.name[0]}
                        </Avatar>
                        <Tag
                          icon={
                            status === 'approved' ? <CheckCircleOutlined /> :
                            status === 'rejected' ? <CloseCircleOutlined /> :
                            <ClockCircleOutlined />
                          }
                          color={
                            status === 'approved' ? 'success' :
                            status === 'rejected' ? 'error' :
                            'default'
                          }
                        >
                          {r.name}
                          {status === 'approved' ? ' 已通过' : status === 'rejected' ? ' 已拒绝' : ' 待审核'}
                        </Tag>
                      </Space>
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build --mode development 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/NodeModals/shared/StickyReviewPanel.tsx
git commit -m "style: StickyReviewPanel — pill radio buttons, full-width glow submit, reviewer avatars"
```

---

### Task 13: Final Visual Verification

- [ ] **Step 1: Run full build to ensure no errors**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite build 2>&1 | tail -10`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Start dev server and visually verify**

Run: `cd /Users/shswyuyouquan/Documents/work/IAPSYS/frontend && npx vite --host 2>&1 &`

Manually check each page:
1. `/workbench` — Page header visible, glass toolbar, table has alternating rows and gradient header line, todo sidebar has gradient accent and pulsing dot
2. `/dashboard` — Stats row at top, shuttle cards have gradient progress and colored top border, product cards have gradient icon bg, status columns have colored top borders
3. `/workbench/flow/:id` — Glass breadcrumb pill, title dot on info card, app cards have hover glow
4. `/workbench/flow/:id/app/:id` — Glass breadcrumb, icon glow ring, section title bars, process steps have step numbers and chevron connectors

- [ ] **Step 3: Kill dev server**

Run: `kill %1 2>/dev/null`
