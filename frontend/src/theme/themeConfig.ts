import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    // Tech Blue Palette
    colorPrimary: '#2563EB',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorWarning: '#F59E0B',
    colorInfo: '#2563EB',
    colorLink: '#2563EB',

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyCode: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
    fontSize: 14,
    fontSizeHeading1: 24,
    fontSizeHeading2: 18,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    fontSizeSM: 12,

    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Spacing
    margin: 16,
    marginSM: 8,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingSM: 8,
    paddingLG: 24,
    paddingXL: 32,

    // Colors
    colorBgLayout: 'transparent',
    colorBgContainer: 'rgba(255, 255, 255, 0.68)',
    colorBgElevated: 'rgba(255, 255, 255, 0.92)',
    colorBorder: 'rgba(148, 163, 184, 0.18)',
    colorBorderSecondary: 'rgba(148, 163, 184, 0.10)',
    colorBgTextHover: 'rgba(37, 99, 235, 0.04)',
    colorBgTextActive: 'rgba(37, 99, 235, 0.08)',

    // Control
    controlHeight: 34,
    controlHeightLG: 40,
    controlHeightSM: 28,

    // Shadows
    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03)',
    boxShadowSecondary: '0 8px 32px rgba(15, 23, 42, 0.10), 0 2px 8px rgba(15, 23, 42, 0.04)',
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      headerHeight: 64,
      headerPadding: '0 32px',
      bodyBg: 'transparent',
    },
    Menu: {
      itemHeight: 60,
      itemBg: 'transparent',
      horizontalItemSelectedColor: '#2563EB',
      horizontalItemHoverColor: '#3B82F6',
      activeBarBorderWidth: 2,
    },
    Table: {
      headerBg: 'rgba(37, 99, 235, 0.03)',
      rowHoverBg: 'rgba(37, 99, 235, 0.02)',
      borderColor: 'rgba(148, 163, 184, 0.10)',
      headerColor: '#1E293B',
    },
    Card: {
      paddingLG: 24,
      borderRadiusLG: 12,
    },
    Modal: {
      paddingContentHorizontalLG: 28,
      borderRadiusLG: 18,
    },
    Input: {
      borderRadius: 8,
      activeBorderColor: '#2563EB',
      hoverBorderColor: '#60A5FA',
      activeShadow: '0 0 0 2px rgba(37, 99, 235, 0.10)',
    },
    Select: {
      borderRadius: 8,
    },
    Button: {
      borderRadius: 8,
      primaryShadow: '0 2px 10px rgba(37, 99, 235, 0.30), 0 0 0 1px rgba(37, 99, 235, 0.05)',
    },
    Tag: {
      borderRadiusSM: 5,
    },
    Divider: {
      colorSplit: 'rgba(148, 163, 184, 0.15)',
    },
    Tabs: {
      inkBarColor: '#2563EB',
      itemActiveColor: '#2563EB',
      itemSelectedColor: '#2563EB',
      itemHoverColor: '#3B82F6',
    },
  },
};

export default themeConfig;
