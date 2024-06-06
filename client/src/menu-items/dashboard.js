import { DashboardOutlined, FileSearchOutlined } from '@ant-design/icons';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const dashboard = {
  id: 'group-dashboard',
  title: 'Reporting',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      permission: PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD,
      icon: DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'reporting',
      title: 'Reporting',
      type: 'item',
      url: '/reporting',
      permission: PERMISSIONS.PERMISSION_VIEW_REPORTING,
      icon: FileSearchOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
