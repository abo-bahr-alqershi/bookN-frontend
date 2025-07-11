// أنواع بيانات سجلات التدقيق (Audit Logs)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات سجل التدقيق
 */
export interface AuditLogDto {
  /** المعرف الفريد للسجل */
  id: string;
  /** اسم الجدول أو الكيان */
  tableName: string;
  /** العملية (إنشاء، تحديث، حذف) */
  action: string;
  /** معرف السجل المتأثر */
  recordId: string;
  /** معرف المستخدم الذي قام بالتغيير */
  userId: string;
  /** وصف التغييرات */
  changes: string;
  /** تاريخ العملية */
  timestamp: string;
}

/**
 * استعلام لجلب سجلات نشاط الأدمن
 */
export interface GetAdminActivityLogsQuery {
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب سجلات التدقيق مع فلتر حسب المستخدم أو الفترة
 */
export interface GetAuditLogsQuery {
  /** معرف المستخدم (اختياري) */
  userId?: string;
  /** تاريخ بداية الفلترة (ISO) */
  from?: string;
  /** تاريخ نهاية الفلترة (ISO) */
  to?: string;
  /** مصطلح البحث النصي في السجلات (اختياري) */
  searchTerm?: string;
  /** نوع العملية للفلترة (اختياري) */
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
