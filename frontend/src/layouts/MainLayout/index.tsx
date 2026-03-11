import { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Avatar, Dropdown, Space, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.startsWith('/dashboard') ? '/dashboard' : '/workbench';

  const navItems: MenuProps['items'] = [
    { key: '/workbench', label: '工作台' },
    { key: '/dashboard', label: '看板' },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人信息' },
    { key: 'logout', label: '退出登录' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 600, marginRight: 48, color: '#1890FF' }}>
            IAPSYS
          </span>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPath]}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderBottom: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} style={{ backgroundColor: '#1890FF' }}>张</Avatar>
              <span>张三</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Content
        style={{
          padding: 24,
          background: '#F0F2F5',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        <Suspense fallback={<div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>}>
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  );
};

export default MainLayout;
