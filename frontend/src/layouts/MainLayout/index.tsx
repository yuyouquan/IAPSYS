import { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Avatar, Dropdown, Space, Spin, Select, Tag } from 'antd';
import { BellOutlined, SwapOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { mockUsers } from '../../mocks/data/users';

const { Header, Content } = Layout;

const ROLE_COLOR: Record<string, string> = {
  R01: '#10B981',
  R02: '#2563EB',
  R03: '#F59E0B',
  R08: '#8B5CF6',
};

const AVATAR_BG: Record<string, string> = {
  R01: '#10B981',
  R02: '#2563EB',
  R03: '#F59E0B',
  R08: '#8B5CF6',
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
      label: <span style={{ color: '#10B981', fontWeight: 500 }}>应用创建申请人 (R01)</span>,
      title: 'R01',
      options: mockUsers
        .filter((u) => u.role === 'R01')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#2563EB', fontWeight: 500 }}>通道运营人员 (R02)</span>,
      title: 'R02',
      options: mockUsers
        .filter((u) => u.role === 'R02')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#F59E0B', fontWeight: 500 }}>业务负责人 (R03)</span>,
      title: 'R03',
      options: mockUsers
        .filter((u) => u.role === 'R03')
        .map((u) => ({ label: u.name, value: u.userId })),
    },
    {
      label: <span style={{ color: '#8B5CF6', fontWeight: 500 }}>管理员 (R08)</span>,
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
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        className="glass-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          height: 60,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 40, gap: 10 }}>
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
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#0F172A',
                letterSpacing: '-0.2px',
              }}
            >
              独立应用发布系统
            </span>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[currentPath]}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderBottom: 'none', background: 'transparent' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Select
            value={currentUser.userId}
            onChange={handleSwitchUser}
            options={userOptions}
            style={{ width: 200 }}
            suffixIcon={<SwapOutlined style={{ color: '#64748B' }} />}
            optionRender={(option) => {
              const user = mockUsers.find((u) => u.userId === option.value);
              if (!user) return option.label;
              return (
                <Space>
                  <Avatar
                    size={20}
                    style={{ backgroundColor: AVATAR_BG[user.role], fontSize: 11, fontWeight: 600 }}
                  >
                    {user.name[0]}
                  </Avatar>
                  <span>{user.name}</span>
                  <Tag
                    color={ROLE_COLOR[user.role]}
                    style={{ marginInlineEnd: 0, fontSize: 11, lineHeight: '18px', padding: '0 5px' }}
                  >
                    {user.role}
                  </Tag>
                </Space>
              );
            }}
          />

          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#334155' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                size={28}
                style={{
                  backgroundColor: AVATAR_BG[currentUser.role],
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {currentUser.name[0]}
              </Avatar>
              <span style={{ fontWeight: 500, color: '#1E293B' }}>{currentUser.name}</span>
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
          padding: '20px 28px',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', paddingTop: 100 }}>
              <Spin size="large" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  );
};

export default MainLayout;
