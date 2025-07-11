import axios from 'axios';
import type { AuditLogDto, GetAdminActivityLogsQuery, GetAuditLogsQuery, GetCustomerActivityLogsQuery, GetPropertyActivityLogsQuery } from '../types/audit-log.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// خدمات سجلات التدقيق والأنشطة (Audit Logs Service)
export const AuditLogsService = {
  /** جلب سجلات نشاط الأدمن */
  getAdminActivityLogs: (query: GetAdminActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>('/api/admin/AuditLogs/activity-logs', { params: query }).then(res => res.data),

  /** جلب سجلات التدقيق */
  getAuditLogs: (query: GetAuditLogsQuery) =>
    axios.get<ResultDto<AuditLogDto[]>>('/api/admin/AuditLogs/audit-logs', { params: query }).then(res => res.data),

  /** جلب سجلات نشاط العميل */
  getCustomerActivityLogs: (query: GetCustomerActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>('/api/admin/AuditLogs/customer-activity-logs', { params: query }).then(res => res.data),

  /** جلب سجلات نشاط المالك والموظفين */
  getPropertyActivityLogs: (query: GetPropertyActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>('/api/admin/AuditLogs/property-activity-logs', { params: query }).then(res => res.data),
};
