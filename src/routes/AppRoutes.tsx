import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import PropertyOwnerLayout from '../layouts/PropertyOwnerLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/shared/LoginPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProperties from '../pages/admin/AdminProperties';
import AdminPropertyTypes from '../pages/admin/AdminPropertyTypes';
import AdminUnits from '../pages/admin/AdminUnits';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminAmenities from '../pages/admin/AdminAmenities';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminReports from '../pages/admin/AdminReports';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';
import AdminSettings from '../pages/admin/AdminSettings';

// Property Owner Pages
import PropertyOwnerDashboard from '../pages/property/PropertyOwnerDashboard';
import PropertyOwnerProperties from '../pages/property/PropertyOwnerProperties';
import PropertyOwnerUnits from '../pages/property/PropertyOwnerUnits';
import PropertyOwnerBookings from '../pages/property/PropertyOwnerBookings';
import PropertyOwnerStaff from '../pages/property/PropertyOwnerStaff';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="property-types" element={<AdminPropertyTypes />} />
        <Route path="units" element={<AdminUnits />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="amenities" element={<AdminAmenities />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Property Owner Routes */}
      <Route path="/property-owner" element={<PropertyOwnerLayout />}>
        <Route index element={<PropertyOwnerDashboard />} />
        <Route path="dashboard" element={<PropertyOwnerDashboard />} />
        <Route path="properties" element={<PropertyOwnerProperties />} />
        <Route path="units" element={<PropertyOwnerUnits />} />
        <Route path="bookings" element={<PropertyOwnerBookings />} />
        <Route path="staff" element={<PropertyOwnerStaff />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;