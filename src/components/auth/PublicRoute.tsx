import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const token = localStorage.getItem('accessToken');
  const userData = localStorage.getItem('user');

  // إذا كان المسار محدود (مثل صفحة تسجيل الدخول) والمستخدم مسجل دخول
  if (restricted && token) {
    try {
      const user = JSON.parse(userData || '{}');
      
      // إعادة التوجيه حسب دور المستخدم
      if (user.role === 'Admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user.role === 'PropertyOwner') {
        return <Navigate to="/owner/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('خطأ في تحليل بيانات المستخدم:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  return <>{children}</>;
};

export default PublicRoute;