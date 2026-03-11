import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Workbench = lazy(() => import('../pages/Workbench'));
const FlowDetail = lazy(() => import('../pages/FlowDetail'));
const AppFlowDetail = lazy(() => import('../pages/AppFlowDetail'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/workbench" replace /> },
      { path: 'workbench', element: <Workbench /> },
      { path: 'workbench/flow/:flowId', element: <FlowDetail /> },
      { path: 'workbench/flow/:flowId/app/:appId', element: <AppFlowDetail /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
];
