import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Table, Button, Input, Select, DatePicker, Space, Modal, Radio, message,
  Badge, Pagination,
} from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import StatusTag from '../../components/StatusTag';
import TodoCard from '../../components/TodoCard';
import { useFlowStore } from '../../stores/flowStore';
import * as todoService from '../../services/todoService';
import { sendFeishuNotification } from '../../services/notificationService';
import { SHUTTLE_APPLICANTS, mockUsers } from '../../mocks/data/users';
import { useUserStore } from '../../stores/userStore';
import type { FlowRecord } from '../../types/flow';

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const Workbench: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const canCreateShuttle = SHUTTLE_APPLICANTS.includes(currentUser.userId);
  const {
    flowList, flowTotal, flowLoading, flowParams,
    fetchFlowList, createShuttle, deleteShuttle, updateFlowParams,
  } = useFlowStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shuttleType, setShuttleType] = useState<'monthly' | 'temporary'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [tempSuffix, setTempSuffix] = useState('');
  const [creating, setCreating] = useState(false);

  // 待办状态
  const [todoList, setTodoList] = useState<todoService.TodoItem[]>([]);
  const [todoTotal, setTodoTotal] = useState(0);
  const [todoPage, setTodoPage] = useState(1);
  const [todoKeyword, setTodoKeyword] = useState('');
  const [todoCollapsed, setTodoCollapsed] = useState(false);

  // 初始化加载
  useEffect(() => {
    fetchFlowList();
    fetchTodos();
  }, []);

  const fetchTodos = useCallback(async (page = 1, keyword = '') => {
    try {
      const result = await todoService.getTodoList({ page, pageSize: 5, keyword });
      setTodoList(result.list);
      setTodoTotal(result.total);
    } catch { /* ignore */ }
  }, []);

  // 筛选搜索
  const [searchName, setSearchName] = useState('');
  const [searchApplicant, setSearchApplicant] = useState<string>();
  const [searchStatus, setSearchStatus] = useState<string>();

  const handleSearch = () => {
    fetchFlowList({ page: 1, name: searchName, applicant: searchApplicant, status: searchStatus });
  };

  // 创建班车
  const handleCreate = async () => {
    if (shuttleType === 'temporary' && !tempSuffix.trim()) {
      message.warning('请输入临时班车名称后缀');
      return;
    }
    setCreating(true);
    try {
      const result = await createShuttle(shuttleType, selectedYear, selectedMonth, shuttleType === 'temporary' ? tempSuffix.trim() : undefined);
      message.success('班车创建成功');
      // 触发点1：通知应用创建申请人添加应用
      const r01Users = mockUsers.filter(u => u.role === 'R01').map(u => u.userId);
      sendFeishuNotification({
        type: 'shuttle_created',
        shuttleName: result.name,
        recipients: r01Users,
      }).catch(() => { /* 通知失败不影响主流程 */ });
      setCreateModalOpen(false);
      setTempSuffix('');
      setSelectedYear(new Date().getFullYear());
      setSelectedMonth(new Date().getMonth() + 1);
    } catch (err: unknown) {
      if (err instanceof Error) message.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  // 删除临时班车
  const handleDelete = (record: FlowRecord) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除临时班车「${record.name}」吗？删除后不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteShuttle(record.id);
          message.success('删除成功');
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  // 待办处理
  const handleTodo = (todo: { flowId: string; appId: string; currentNode: string }) => {
    navigate(`/workbench/flow/${todo.flowId}/app/${todo.appId}?node=${todo.currentNode}&action=open`);
  };

  // 表格列定义
  const columns: ColumnsType<FlowRecord> = [
    {
      title: '班车名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <a onClick={() => navigate(`/workbench/flow/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '应用状态',
      key: 'statusSummary',
      width: 280,
      render: (_, record) => (
        <Space size={4}>
          <StatusTag status="total" count={record.statusSummary.total} onClick={() => navigate(`/workbench/flow/${record.id}?status=all`)} />
          <StatusTag status="success" count={record.statusSummary.success} onClick={() => navigate(`/workbench/flow/${record.id}?status=success`)} />
          <StatusTag status="processing" count={record.statusSummary.processing} onClick={() => navigate(`/workbench/flow/${record.id}?status=processing`)} />
          <StatusTag status="rejected" count={record.statusSummary.rejected} onClick={() => navigate(`/workbench/flow/${record.id}?status=rejected`)} />
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/workbench/flow/${record.id}`)}>
            查看详情
          </Button>
          {record.shuttleType === 'temporary' && record.applicantId === currentUser.userId && (
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 年份选项：前后各2年
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
    .map((y) => ({ label: `${y}年`, value: y }));

  // 计算已创建月度班车的年-月组合
  const existingMonthlyKeys = flowList
    .filter((f) => f.shuttleType === 'monthly')
    .map((f) => {
      const match = f.name.match(/^(\d+)-(\d+)月班车$/);
      return match ? `${match[1]}-${match[2]}` : null;
    })
    .filter((k): k is string => k !== null);

  // 当月班车可选月份：排除当前选中年份下已创建的月份
  const monthlyMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
    .filter((m) => !existingMonthlyKeys.includes(`${selectedYear}-${m}`))
    .map((m) => ({ label: `${m}月`, value: m }));

  // 临时班车可选月份：所有月份
  const tempMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
    .map((m) => ({ label: `${m}月`, value: m }));

  return (
    <Layout style={{ background: '#fff', borderRadius: 8, minHeight: 'calc(100vh - 104px)' }}>
      <Content style={{ padding: 24 }}>
        {/* 工具栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Space wrap size={12}>
            <Input
              placeholder="班车名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              allowClear
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="申请人"
              style={{ width: 150 }}
              showSearch
              allowClear
              value={searchApplicant}
              onChange={setSearchApplicant}
              options={[
                { label: '付宇', value: '付宇' },
                { label: '高明成', value: '高明成' },
                { label: '陈睿', value: '陈睿' },
                { label: '朱锐', value: '朱锐' },
              ]}
            />
            <RangePicker style={{ width: 260 }} placeholder={['开始日期', '结束日期']} />
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              allowClear
              value={searchStatus}
              onChange={setSearchStatus}
              options={[
                { label: '进行中', value: 'processing' },
                { label: '已完成', value: 'completed' },
                { label: '已拒绝', value: 'rejected' },
              ]}
            />
            <Button onClick={handleSearch}>搜索</Button>
          </Space>
          {canCreateShuttle && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                const defYear = new Date().getFullYear();
                const defMonth = new Date().getMonth() + 1;
                setShuttleType('monthly');
                setTempSuffix('');
                setSelectedYear(defYear);
                // 当月班车：若当前月份已创建，选第一个可用月份
                if (existingMonthlyKeys.includes(`${defYear}-${defMonth}`)) {
                  const available = Array.from({ length: 12 }, (_, i) => i + 1)
                    .filter((m) => !existingMonthlyKeys.includes(`${defYear}-${m}`));
                  setSelectedMonth(available[0] ?? defMonth);
                } else {
                  setSelectedMonth(defMonth);
                }
                setCreateModalOpen(true);
              }}
            >
              发起申请
            </Button>
          )}
        </div>

        {/* 申请列表 */}
        <Table
          columns={columns}
          dataSource={flowList}
          rowKey="id"
          loading={flowLoading}
          pagination={{
            current: flowParams.page,
            pageSize: flowParams.pageSize,
            total: flowTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => fetchFlowList({ page, pageSize }),
          }}
          scroll={{ x: 900 }}
        />

        {/* 创建班车 Modal */}
        <Modal
          title="创建发布班车"
          open={createModalOpen}
          onOk={handleCreate}
          onCancel={() => { setCreateModalOpen(false); setTempSuffix(''); setSelectedYear(new Date().getFullYear()); setSelectedMonth(new Date().getMonth() + 1); }}
          confirmLoading={creating}
          okText="确认"
          cancelText="取消"
        >
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>班车类型</div>
            <Radio.Group
              value={shuttleType}
              onChange={(e) => {
                const newType = e.target.value as 'monthly' | 'temporary';
                setShuttleType(newType);
                // 切换到当月班车时，若当前选中年月已创建，则自动选择第一个可用月份
                if (newType === 'monthly' && existingMonthlyKeys.includes(`${selectedYear}-${selectedMonth}`)) {
                  const firstAvailable = monthlyMonthOptions[0]?.value;
                  if (firstAvailable) setSelectedMonth(firstAvailable);
                }
              }}
            >
              <Radio.Button value="monthly">当月班车</Radio.Button>
              <Radio.Button value="temporary">临时班车</Radio.Button>
            </Radio.Group>

            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>选择年月</div>
              <Space size={8}>
                <Select
                  value={selectedYear}
                  onChange={(val) => {
                    setSelectedYear(val);
                    // 切换年份后，若当前月份在新年份下已创建月度班车，自动选第一个可用月份
                    if (shuttleType === 'monthly') {
                      const available = Array.from({ length: 12 }, (_, i) => i + 1)
                        .filter((m) => !existingMonthlyKeys.includes(`${val}-${m}`));
                      if (existingMonthlyKeys.includes(`${val}-${selectedMonth}`) && available.length > 0) {
                        setSelectedMonth(available[0]);
                      }
                    }
                  }}
                  style={{ width: 100 }}
                  options={yearOptions}
                />
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  style={{ width: 90 }}
                  options={shuttleType === 'monthly' ? monthlyMonthOptions : tempMonthOptions}
                />
              </Space>
            </div>

            {shuttleType === 'monthly' && (
              <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 8 }}>
                班车名称：{selectedYear}-{selectedMonth}月班车
              </div>
            )}

            {shuttleType === 'temporary' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>班车名称</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#8C8C8C', whiteSpace: 'nowrap' }}>{selectedYear}-{selectedMonth}月临时班车-</span>
                  <Input
                    placeholder="请输入自定义名称"
                    value={tempSuffix}
                    onChange={(e) => setTempSuffix(e.target.value)}
                    maxLength={30}
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>
                  完整名称：{selectedYear}-{selectedMonth}月临时班车-{tempSuffix || 'xxx'}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </Content>

      {/* 待办面板 */}
      <Sider
        width={300}
        collapsible
        collapsed={todoCollapsed}
        onCollapse={setTodoCollapsed}
        collapsedWidth={48}
        reverseArrow
        theme="light"
        trigger={null}
        style={{ borderLeft: '1px solid #F0F0F0', background: '#FAFAFA' }}
      >
        {todoCollapsed ? (
          /* 收起状态：竖排标题 + 数量 */
          <div
            onClick={() => setTodoCollapsed(false)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 16,
              cursor: 'pointer',
              height: '100%',
              userSelect: 'none',
            }}
          >
            <Badge count={todoTotal} style={{ backgroundColor: '#1890FF' }} />
            <div
              style={{
                writingMode: 'vertical-rl',
                fontSize: 14,
                fontWeight: 500,
                color: '#333',
                marginTop: 12,
                letterSpacing: 4,
              }}
            >
              待办事项
            </div>
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>待办事项</span>
              <Space size={8}>
                <Badge count={todoTotal} style={{ backgroundColor: '#1890FF' }} />
                <span
                  onClick={() => setTodoCollapsed(true)}
                  style={{ cursor: 'pointer', fontSize: 12, color: '#999' }}
                >▶</span>
              </Space>
            </div>

            <Input
              placeholder="搜索待办"
              prefix={<SearchOutlined />}
              style={{ marginBottom: 12 }}
              allowClear
              value={todoKeyword}
              onChange={(e) => {
                setTodoKeyword(e.target.value);
                fetchTodos(1, e.target.value);
              }}
            />

            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              {todoList.map((todo) => (
                <TodoCard key={todo.id} todoInfo={todo} onHandle={handleTodo} />
              ))}
            </div>

            <Pagination
              size="small"
              current={todoPage}
              total={todoTotal}
              pageSize={5}
              showSizeChanger={false}
              style={{ marginTop: 12, textAlign: 'center' }}
              onChange={(page) => {
                setTodoPage(page);
                fetchTodos(page, todoKeyword);
              }}
            />
          </div>
        )}
      </Sider>
    </Layout>
  );
};

export default Workbench;
