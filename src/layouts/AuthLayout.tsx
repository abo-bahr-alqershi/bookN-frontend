import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            نظام إدارة الحجوزات
          </h1>
          <p className="text-gray-600">
            منصة شاملة لإدارة العقارات والحجوزات
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;