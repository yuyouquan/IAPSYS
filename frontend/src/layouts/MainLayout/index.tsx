import { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Avatar, Dropdown, Space, Spin, Select, Tag } from 'antd';
import { BellOutlined, SwapOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { mockUsers } from '../../mocks/data/users';

const { Header, Content } = Layout;

const ROLE_COLOR: Record<string, string> = {
  R01: '#52C41A',
  R02: '#1890FF',
  R03: '#FA8C16',
  R08: '#722ED1',
};

const AVATAR_COLOR: Record<string, string> = {
  R01: '#52C41A',
  R02: '#1890FF',
  R03: '#FA8C16',
  R08: '#722ED1',
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser } = useUserStore();

  const currentPath = location.pathname.startsWith('/dashboard') ? '/dashboard' : '/workbench';

  const navItems: MenuProps['items'] = [
    { key: '/workbench', label: '工作台' },
    { key: '/dashboard', label: '看板' },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人信息' },
    { key: 'logout', label: '退出登录' },
  ];

  const userOptions = [
    {
      label: <span style={{ color: '#52C41A', fontWeight: 500 }}>应用创建申请人 (R01)</span>,
      title: 'R01',
      options: mockUsers
        .filter((u) => u.role === 'R01')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#1890FF', fontWeight: 500 }}>通道运营人员 (R02)</span>,
      title: 'R02',
      options: mockUsers
        .filter((u) => u.role === 'R02')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#FA8C16', fontWeight: 500 }}>业务负责人 (R03)</span>,
      title: 'R03',
      options: mockUsers
        .filter((u) => u.role === 'R03')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#722ED1', fontWeight: 500 }}>管理员 (R08)</span>,
      title: 'R08',
      options: mockUsers
        .filter((u) => u.role === 'R08')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
  ];

  const handleSwitchUser = (userId: string) => {
    const user = mockUsers.find((u) => u.userId === userId);
    if (user) setCurrentUser(user);
  };

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
            独立应用发布系统
          </span>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPath]}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderBottom: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* 角色切换 */}
          <Select
            value={currentUser.userId}
            onChange={handleSwitchUser}
            options={userOptions}
            style={{ width: 200 }}
            suffixIcon={<SwapOutlined />}
            optionRender={(option) => {
              const user = mockUsers.find((u) => u.userId === option.value);
              if (!user) return option.label;
              return (
                <Space>
                  <Avatar size={20} style={{ backgroundColor: AVATAR_COLOR[user.role], fontSize: 12 }}>
                    {user.name[0]}
                  </Avatar>
                  <span>{user.name}</span>
                  <Tag
                    color={ROLE_COLOR[user.role]}
                    style={{ marginInlineEnd: 0, fontSize: 11, lineHeight: '18px', padding: '0 4px' }}
                  >
                    {user.role}
                  </Tag>
                </Space>
              );
            }}
          />

          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} style={{ backgroundColor: AVATAR_COLOR[currentUser.role] }}>
                {currentUser.name[0]}
              </Avatar>
              <span>{currentUser.name}</span>
              <Tag
                color={ROLE_COLOR[currentUser.role]}
                style={{ marginInlineEnd: 0, fontSize: 11, lineHeight: '20px' }}
              >
                {currentUser.roleName}
              </Tag>
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
