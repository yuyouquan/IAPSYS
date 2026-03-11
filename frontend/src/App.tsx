import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import themeConfig from './theme/themeConfig';
import AppRouter from './router';

function App() {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
