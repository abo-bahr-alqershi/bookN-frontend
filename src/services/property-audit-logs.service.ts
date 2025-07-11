import axios from 'axios';
import type { PaginatedResult } from '../types/common.types';
import type { AuditLogDto, AuditLogsQuery } from '../types/audit-log.types';

// المسار الأساسي لنقاط نهاية سجلات التدقيق لأصحاب العقارات
const API_BASE = '/api/property/auditlogs';

/**
 * خدمات سجلات التدقيق لأصحاب العقارات
 */
export const PropertyAuditLogsService = {
  /** جلب سجلات نشاط العملاء */
  getCustomerActivityLogs: (query: Pick<AuditLogsQuery, 'pageNumber' | 'pageSize'>) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/customer-activity-logs`, { params: query }).then(res => res.data),

  /** جلب سجلات نشاط العقارات */
  getPropertyActivityLogs: (query: Pick<AuditLogsQuery, 'pageNumber' | 'pageSize'>) =>
    axios.get<PaginatedResult<AuditLogDto>>(`${API_BASE}/property-activity-logs`, { params: query }).then(res => res.data),
}; 