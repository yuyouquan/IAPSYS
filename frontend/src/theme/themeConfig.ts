import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1890FF',
    colorSuccess: '#52C41A',
    colorError: '#FF4D4F',
    colorWarning: '#FAAD14',
    colorInfo: '#1890FF',
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    fontSize: 14,
    fontSizeHeading1: 20,
    fontSizeHeading2: 18,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    fontSizeSM: 12,
    margin: 16,
    marginSM: 8,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingSM: 8,
    paddingLG: 24,
    paddingXL: 32,
    colorBgLayout: '#F0F2F5',
    colorBgContainer: '#FFFFFF',
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
