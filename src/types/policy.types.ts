// أنواع بيانات السياسات (Policies)
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

/**
 * بيانات سياسة العقار الأساسية
 */
export interface PolicyDto {
  /** معرف السياسة */
  id: string;
  /** معرف العقار */
  propertyId: string;
  /** نوع السياسة */
  policyType: string;
  /** وصف السياسة */
  description: string;
  /** قواعد السياسة (JSON) */
  rules: string;
}

/**
 * نوع بيانات تفاصيل السياسة
 */
export interface PolicyDetailsDto {
  /** معرف السياسة */
  id: string;
  /** معرف العقار */
  propertyId: string;
  /** نوع السياسة */
  policyType: string;
  /** وصف السياسة */
  description: string;
  /** قواعد السياسة (JSON) */
  rules: string;
}

/**
 * أمر إنشاء سياسة جديدة للعقار
 */
export interface CreatePropertyPolicyCommand {
  /** معرف العقار */
  propertyId: string;
  /** نوع السياسة */
  policyType: string;
  /** وصف السياسة */
  description: string;
  /** قواعد السياسة (JSON) */
  rules: string;
}

/**
 * أمر لتحديث سياسة العقار
 */
export interface UpdatePropertyPolicyCommand {
  /** معرف السياسة */
  policyId: string;
  /** نوع السياسة (اختياري) */
  policyType?: string;
  /** وصف السياسة (اختياري) */
  description?: string;
  /** قواعد السياسة (اختياري) */
  rules?: string;
}

/**
 * أمر حذف سياسة العقار
 */
export interface DeletePropertyPolicyCommand {
  /** معرف السياسة */
  policyId: string;
}

/**
 * استعلام الحصول على سياسة بواسطة المعرف
 */
export interface GetPolicyByIdQuery {
  /** معرف السياسة */
  policyId: string;
}

/**
 * استعلام جلب جميع سياسات لعقار معين
 */
export interface GetPropertyPoliciesQuery {
  /** معرف العقار */
  propertyId: string;
}

/**
 * استعلام جلب السياسات حسب النوع
 */
export interface GetPoliciesByTypeQuery {
  /** نوع السياسة */
  policyType: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}
