# UI Refinement Design: Tech Glassmorphism Deep Enhancement

**Date:** 2026-04-03
**Scope:** All pages and components — layout, visual, micro-interaction improvements
**Approach:** Deepen existing glassmorphism style with refined details, better hierarchy, subtle micro-animations at key interaction points
**Constraint:** Keep animations restrained and professional

---

## 1. Design System Enhancements

### 1.1 New CSS Variables (index.css)

```css
:root {
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
}
```

### 1.2 Subtle Dot Grid Background

Add a faint CSS dot-grid pattern on body to create tech depth:

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

### 1.3 Refined Ant Design Overrides

- **Table header**: Add a 2px gradient bottom-border (`--gradient-accent-line`) under thead
- **Primary button hover**: Add `--glow-primary` box-shadow on hover
- **Modal top accent**: Add a 2px gradient top-line on `.ant-modal-content` using `::before` pseudo-element
- **Card hover**: Use `--gradient-card-hover` + `--shadow-md` on hover, `transform: translateY(-2px)`
- **Active pagination**: Add glow effect matching primary color

### 1.4 Theme Config Updates (themeConfig.ts)

- Header height: 60 → 64
- Header padding: `0 28px` → `0 32px`
- Card paddingLG: 20 → 24
- Modal borderRadiusLG: 14 → 16

---

## 2. MainLayout Header

### 2.1 Logo
- Add animated gradient shimmer: a slow-moving light sweep across the logo box (CSS `@keyframes shimmer`, 4s cycle, very subtle)
- Add thin `rgba(255,255,255,0.3)` inner border ring for tech feel

### 2.2 Header Bottom Accent
- Replace `border-bottom: 1px solid rgba(...)` with a `::after` pseudo-element
- Use `--gradient-accent-line` (primary → cyan → transparent), height 1.5px
- Creates a subtle glow separator effect

### 2.3 Navigation Items
- Active item: Add pill-shaped glass background (`rgba(37,99,235,0.06)`, borderRadius 8px, padding 6px 16px)
- Active item bottom: 2.5px gradient indicator line with soft glow
- Inactive hover: Subtle background tint transition

### 2.4 User Area
- Add a vertical glass divider (1px, 24px tall, `rgba(148,163,184,0.15)`) between notification bell and user info
- Bell icon: Wrap in a 32px glass circle background with hover tint
- Increase gap between elements from 14px to 16px

### 2.5 Layout
- Header height: 60px → 64px for more breathing room
- Content padding: `20px 28px` → `24px 32px`

---

## 3. Workbench Page

### 3.1 Page Header
Add a title section above the toolbar:
- "工作台" as h2 (18px, 600 weight)
- Subtitle: summary stats like "共 {total} 个班车" in secondary color
- Margin-bottom 20px

### 3.2 Toolbar
- Wrap search/filter controls in a separate glass container div
- Use slightly higher opacity glass (`rgba(255,255,255,0.45)`) than the main content area
- Bottom margin 20px, padding 16px, border-radius 12px
- "发起申请" button: Add a subtle glow shadow on rest state

### 3.3 Table
- Add alternating row tint: even rows get `rgba(37, 99, 235, 0.012)`
- Table header: slightly stronger background `rgba(37, 99, 235, 0.05)`
- Link text in first column: use `--color-primary` consistently with hover underline
- Row hover: `translateX(1px)` micro-shift for tech feel (via CSS)

### 3.4 Todo Sidebar
- Collapsed state: Add a pulsing dot (CSS animation, 2s cycle) next to badge when `todoTotal > 0`
- Section header "待办事项": Add gradient underline accent (primary → transparent)
- Collapse/expand: use CSS transition for smooth width animation
- Todo list scrollbar: Styled with glass theme (already partially done)

---

## 4. Dashboard Page

### 4.1 Overview Stats Row
Add a row of 3-4 stat cards above the tabs:
- Glass card style, small (height ~80px)
- Each shows: icon (gradient bg circle) + label + value (large monospace number)
- Stats: 班车总数, 进行中应用, 已完成应用, 完成率 (computed from existing `mockShuttleView` array, no new API calls)
- Values derived: total = sum of all shuttle productCounts, processing = sum of processing across shuttles, etc.

### 4.2 Shuttle View Cards
- Progress bar: Use gradient `strokeColor` (primary → accent cyan)
- Card top edge: 2px gradient border matching completion status (green if 100%, blue if in-progress, gray if 0%)
- Product names: Show as small glass pill tags instead of plain text
- Card hover: Lift with `--shadow-md` + subtle border glow

### 4.3 Product View Cards
- Icon placeholder: Replace gray `#F0F2F5` with a radial gradient (`rgba(37,99,235,0.08)` → `transparent`)
- Publish count: Larger font (18px), monospace, with primary color
- Card hover: Scale up 1.02x with glow

### 4.4 Status View Columns
- Each column card: Colored top border (3px) — blue for processing, green for completed, red for failed
- Replace `#f0f0f0` dividers with `rgba(148, 163, 184, 0.10)` to match glass theme
- Status icons: Use consistent colors matching the design system (`#2563EB`, `#10B981`, `#EF4444`)
- Item hover: Subtle background tint + slight left-border accent

---

## 5. FlowDetail Page

### 5.1 Breadcrumb
- Wrap in a glass pill container: `rgba(255,255,255,0.5)`, padding 8px 16px, border-radius 20px
- Separator arrows: Use `--color-primary` at 40% opacity
- Home icon: Primary color tint

### 5.2 App Cards
- Icon area: Add a soft radial gradient glow behind the icon (`rgba(37,99,235,0.06)` circle)
- Card hover: Border glow color matches current node status color
- Card hover: `transform: translateY(-3px)` + `--shadow-md`
- Reject reason bar: Add a small warning icon before text

### 5.3 Info Card (Descriptions)
- Section title "基础信息": Add a small colored dot (6px, primary) before the title text
- Description labels: Slightly bolder (500 weight), secondary color

---

## 6. AppFlowDetail Page

### 6.1 App Header Card
- App icon: Add a soft glow ring (box-shadow with status color, 0 0 0 3px rgba)
- App name: 22px font, -0.3px letter-spacing
- Package name: 13px, monospace font
- Status tag: Larger padding, add subtle glow matching status color

### 6.2 Section Card Titles
- All card titles ("应用发布流程", "历史操作记录"): Add a 3px wide, 16px tall colored bar before the text (primary color, border-radius 2px)
- This creates a consistent visual anchor across all section headers

### 6.3 Operation Log Table
- Same table enhancements as Workbench (alternating rows, gradient header line)

---

## 7. ProcessSteps Component

### 7.1 Connector Redesign
- Replace CSS triangle arrows with SVG chevron icons (12px, matching line color)
- Completed path: Solid line with gradient (green)
- Pending path: Dashed line (2px dash, 4px gap) in muted gray
- Processing path: Solid blue line

### 7.2 Active Node Enhancement
- Add a subtle animated glow ring: CSS `@keyframes` with box-shadow pulsing (2s cycle, very subtle)
- Shadow pulses between `0 0 0 2px ${color}20` and `0 0 0 4px ${color}10`
- Only on the currently active node

### 7.3 Step Numbers
- Add circular badge (18px) at top-left corner of each node card
- Shows step number (1-7)
- Completed: green bg + white text
- Processing: blue bg + white text
- Pending: gray bg + gray text
- Position: absolute, top -8px, left -8px

### 7.4 Completed Nodes
- Very subtle green background tint on the entire card

---

## 8. StatusTag Component

### 8.1 Icon Replacement
- Replace colored dot with small status icons (10px):
  - total: CircleOutlined (neutral)
  - success: CheckOutlined (green)
  - processing: SyncOutlined (blue, no spin)
  - rejected: CloseOutlined (red)

### 8.2 Depth
- Add subtle inner shadow: `inset 0 1px 2px rgba(0,0,0,0.04)`
- On hover (when clickable): Add outer glow matching status color

---

## 9. TodoCard Component

### 9.1 Action Button
- "去处理" button: Style as a small glass pill (bg `rgba(37,99,235,0.06)`, border-radius 16px, padding 4px 14px)
- Hover: Arrow icon slides right 3px (CSS transition)

### 9.2 Card Hover
- Left border glow: Add box-shadow `inset 3px 0 8px ${statusColor}20` on hover
- Slight scale: `transform: scale(1.01)` on hover

---

## 10. StickyReviewPanel Component

### 10.1 Counter-Sign Items
- Add avatar circles (24px) with user initial before name in reviewer tags
- Use the same `AVATAR_BG` colors from MainLayout by role

### 10.2 Submit Button
- Full width, with gradient background and `--glow-primary` on hover
- Disabled state: Muted gradient, no glow

### 10.3 Radio Buttons
- Style as glass pill toggle buttons:
  - "通过": Green tint background when selected, green border
  - "不通过": Red tint background when selected, red border
  - Unselected: Neutral glass style
  - Uses Ant Design Radio.Button with custom CSS override

---

## 11. CSS Animations (Minimal Set)

All animations are subtle and respect `prefers-reduced-motion`:

```css
/* Logo shimmer - 4s cycle */
@keyframes shimmer {
  0%, 100% { background-position: -100% 0; }
  50% { background-position: 100% 0; }
}

/* Active node glow pulse - 2s cycle */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 2px var(--pulse-color, rgba(37,99,235,0.15)); }
  50% { box-shadow: 0 0 0 5px var(--pulse-color, rgba(37,99,235,0.06)); }
}

/* Todo urgent pulse - 2s cycle */
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
```

---

## 12. Files to Modify

| File | Changes |
|------|---------|
| `index.css` | New variables, dot grid bg, animation keyframes, refined Ant overrides |
| `themeConfig.ts` | Updated spacing/sizing tokens |
| `MainLayout/index.tsx` | Header redesign (logo, nav, user area, accent line) |
| `Workbench/index.tsx` | Page header, toolbar container, table styling, todo sidebar |
| `Dashboard/index.tsx` | Stats row, card enhancements, status view columns |
| `FlowDetail/index.tsx` | Breadcrumb pill, app card hover glow, info card title dot |
| `AppFlowDetail/index.tsx` | App header glow, section title bars |
| `ProcessSteps/index.tsx` | Connector redesign, active glow, step numbers |
| `StatusTag/index.tsx` | Icon replacement, inner shadow |
| `TodoCard/index.tsx` | Pill button, hover glow |
| `StickyReviewPanel.tsx` | Avatar circles, full-width button, pill radio |

**No new files needed.** All changes are modifications to existing files.

---

## 13. Out of Scope

- No dark mode (not requested)
- No responsive breakpoint changes (existing breakpoints are adequate)
- No routing/logic changes
- No new dependencies (all CSS-based animations, SVG chevrons inline)
- No changes to Node Modal form content/logic (only StickyReviewPanel styling)
