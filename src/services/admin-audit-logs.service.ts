import axios from 'axios';
import type { PaginatedResult } from '../types/common.types';
import type { AuditLogDto, GetAdminActivityLogsQuery, GetAuditLogsQuery, GetCustomerActivityLogsQuery, GetPropertyActivityLogsQuery } from '../types/audit-log.types';

// المسار الأساسي لنقاط نهاية سجلات التدقيق للإدارة
const API_BASE = '/api/admin/auditlogs';

/**
 * خدمات سجلات التدقيق للإدارة
 */
export const AdminAuditLogsService = {
  /** جلب سجلات التدقيق العامة */
  getAuditLogs: (query: GetAuditLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/audit-logs`, { params: query }).then(res => res.data),

  /** جلب سجلات نشاط مدراء النظام */
  getAdminActivityLogs: (query: GetAdminActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/activity-logs`, { params: query }).then(res => res.data),

  /** جلب سجلات نشاط العملاء */
  getCustomerActivityLogs: (query: GetCustomerActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/customer-activity-logs`, { params: query }).then(res => res.data),

  /** جلب سجلات نشاط العقارات */
  getPropertyActivityLogs: (query: GetPropertyActivityLogsQuery) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/property-activity-logs`, { params: query }).then(res => res.data),
}; 