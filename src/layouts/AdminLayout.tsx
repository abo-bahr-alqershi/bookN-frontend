import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const AdminLayout = () => {
  const adminMenuItems = [
    {
      title: 'لوحة المعلومات',
      path: '/admin/dashboard',
      icon: '📊',
    },
    {
      title: 'إدارة المستخدمين',
      path: '/admin/users',
      icon: '👥',
    },
    {
      title: 'إدارة العقارات',
      path: '/admin/properties',
      icon: '🏢',
    },
    {
      title: 'أنواع العقارات',
      path: '/admin/property-types',
      icon: '🏗️',
    },
    {
      title: 'إدارة الوحدات',
      path: '/admin/units',
      icon: '🏠',
    },
    {
      title: 'إدارة الحجوزات',
      path: '/admin/bookings',
      icon: '📝',
    },
    {
      title: 'إدارة المدفوعات',
      path: '/admin/payments',
      icon: '💰',
    },
    {
      title: 'إدارة المرافق',
      path: '/admin/amenities',
      icon: '🏊‍♂️',
    },
    {
      title: 'إدارة التقييمات',
      path: '/admin/reviews',
      icon: '⭐',
    },
    {
      title: 'إدارة الإشعارات',
      path: '/admin/notifications',
      icon: '🔔',
    },
    {
      title: 'التقارير والتحليلات',
      path: '/admin/reports',
      icon: '📈',
    },
    {
      title: 'سجلات التدقيق',
      path: '/admin/audit-logs',
      icon: '📋',
    },
    {
      title: 'إعدادات النظام',
      path: '/admin/settings',
      icon: '⚙️',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar menuItems={adminMenuItems} userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole="admin" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;