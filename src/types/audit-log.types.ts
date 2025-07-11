import type { PaginatedResult } from './amenity.types';

/**
 * تمثيل سجل النشاط
 */
export interface AuditLogDto {
  id: string;
  tableName: string;
  action: string;
  recordId: string;
  userId: string;
  changes: string;
  timestamp: string;
}

/**
 * معلمات استعلام سجلات التدقيق
 */
export interface AuditLogsQuery {
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
  /** تصفية حسب معرف المستخدم */
  userId?: string;
  /** تاريخ البداية (ISO) */
  from?: string;
  /** تاريخ النهاية (ISO) */
  to?: string;
  /** مصطلح البحث */
  searchTerm?: string;
  /** نوع العملية */
  operationType?: string;
}

/**
 * استعلام جلب سجلات نشاط العميل
 */
export interface GetCustomerActivityLogsQuery {
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب سجلات نشاط المالك والموظفين
 */
export interface GetPropertyActivityLogsQuery {
  /** معرف العقار (اختياري) */
  propertyId?: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}
