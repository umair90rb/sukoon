import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { PrivateRoute } from 'components/PrivateRoute';
import { permissions } from 'constants/roleAndPermissions';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const UserDefault = Loadable(lazy(() => import('pages/user-management')));
const Reporting = Loadable(lazy(() => import('pages/reporting')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <PrivateRoute permission={permissions.viewAdminDashboard}>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'dashboard',
      element: (
        <PrivateRoute permission={permissions.viewAdminDashboard}>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'reporting',
      element: (
        <PrivateRoute permission={permissions.viewReporting}>
          <Reporting />
        </PrivateRoute>
      )
    },
    {
      path: 'users',
      element: (
        <PrivateRoute>
          <UserDefault />
        </PrivateRoute>
      )
    }
  ]
};

export default MainRoutes;
