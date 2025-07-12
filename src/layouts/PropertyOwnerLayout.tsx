import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const PropertyOwnerLayout = () => {
  const ownerMenuItems = [
    {
      title: 'لوحة المعلومات',
      path: '/property-owner/dashboard',
      icon: '📊',
    },
    {
      title: 'عقاراتي',
      path: '/property-owner/properties',
      icon: '🏢',
    },
    {
      title: 'الوحدات',
      path: '/property-owner/units',
      icon: '🏠',
    },
    {
      title: 'الحجوزات',
      path: '/property-owner/bookings',
      icon: '📝',
    },
    {
      title: 'الموظفون',
      path: '/property-owner/staff',
      icon: '👨‍💼',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar menuItems={ownerMenuItems} userRole="property-owner" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole="property-owner" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PropertyOwnerLayout;