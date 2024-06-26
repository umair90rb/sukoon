import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { PrivateRoute } from 'components/PrivateRoute';
import { PERMISSIONS } from 'constants/permissions-and-roles';

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
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD}>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'dashboard',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD}>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'reporting',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_REPORTING}>
          <Reporting />
        </PrivateRoute>
      )
    },
    {
      path: 'users',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_USERS}>
          <UserDefault />
        </PrivateRoute>
      )
    }
  ]
};

export default MainRoutes;
