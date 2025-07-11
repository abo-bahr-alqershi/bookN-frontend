// أنواع بيانات التقارير (Reports)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات التقرير الأساسية
 */
export interface ReportDto {
  /** معرف البلاغ */
  id: string;
  /** معرف المستخدم المبلغ */
  reporterUserId: string;
  /** اسم المستخدم المبلغ */
  reporterUserName: string;
  /** معرف المستخدم المبلغ عنه (اختياري) */
  reportedUserId?: string;
  /** اسم المستخدم المبلغ عنه (اختياري) */
  reportedUserName?: string;
  /** معرف العقار المبلغ عنه (اختياري) */
  reportedPropertyId?: string;
  /** اسم العقار المبلغ عنه (اختياري) */
  reportedPropertyName?: string;
  /** سبب البلاغ */
  reason: string;
  /** تفاصيل البلاغ */
  description: string;
  /** تاريخ إنشاء البلاغ */
  createdAt: string;
}

/**
 * أمر إنشاء بلاغ جديد
 */
export interface CreateReportCommand {
  reporterUserId: string;
  reportedUserId?: string;
  reportedPropertyId?: string;
  reason: string;
  description: string;
}

/**
 * أمر تحديث بلاغ
 */
export interface UpdateReportCommand {
  id: string;
  reason?: string;
  description?: string;
}

/**
 * أمر حذف بلاغ
 */
export interface DeleteReportCommand {
  id: string;
  deletionReason?: string;
}

/**
 * استعلام جلب بلاغ بواسطة المعرف
 */
export interface GetReportByIdQuery {
  id: string;
}

/**
 * استعلام جلب جميع البلاغات مع إمكانية التصفية
 */
export interface GetAllReportsQuery {
  pageNumber?: number;
  pageSize?: number;
  reporterUserId?: string;
  reportedUserId?: string;
  reportedPropertyId?: string;
}

/**
 * استعلام جلب التقارير المبلّغ عنها لعقار
 */
export interface GetReportsByPropertyQuery {
  /** معرف العقار */
  propertyId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب التقارير المقدمة ضد مستخدم معين
 */
export interface GetReportsByReportedUserQuery {
  /** معرف المستخدم المبلغ عنه */
  reportedUserId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}
