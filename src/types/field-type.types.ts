// أنواع بيانات أنواع الحقول (Field Types)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات نوع الحقل الأساسية
 */
export interface FieldTypeDto {
  /** معرف نوع الحقل */
  fieldTypeId: string;
  /** اسم نوع الحقل */
  name: string;
  /** الاسم المعروض لنوع الحقل */
  displayName: string;
  /** قواعد التحقق (JSON) */
  validationRules: Record<string, any>;
  /** حالة التفعيل */
  isActive: boolean;
}

/**
 * أمر إنشاء نوع حقل جديد
 */
export interface CreateFieldTypeCommand {
  name: string;
  displayName: string;
  validationRules: Record<string, any>;
  isActive: boolean;
}

/**
 * أمر تحديث نوع الحقل
 */
export interface UpdateFieldTypeCommand {
  fieldTypeId: string;
  name: string;
  displayName: string;
  validationRules: Record<string, any>;
  isActive: boolean;
}

/**
 * أمر حذف نوع حقل
 */
export interface DeleteFieldTypeCommand {
  fieldTypeId: string;
}

/**
 * أمر تبديل حالة نوع الحقل
 */
export interface ToggleFieldTypeStatusCommand {
  fieldTypeId: string;
  isActive: boolean;
}

/**
 * استعلام جلب نوع حقل بواسطة المعرف
 */
export interface GetFieldTypeByIdQuery {
  fieldTypeId: string;
}

/**
 * استعلام جلب جميع أنواع الحقول مع إمكانية التصفية
 */
export interface GetAllFieldTypesQuery {
  isActive?: boolean;
}

/**
 * استعلام بحث في أنواع الحقول
 */
export interface SearchFieldTypesQuery {
  searchTerm: string;
  isActive?: boolean;
}
