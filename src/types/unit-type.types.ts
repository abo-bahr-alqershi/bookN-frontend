// أنواع بيانات أنواع الوحدات (Unit Types)
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

/**
 * بيانات نوع الوحدة الأساسية
 */
export interface UnitTypeDto {
  /** معرف نوع الوحدة */
  id: string;
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** اسم نوع الوحدة */
  name: string;
  /** وصف نوع الوحدة */
  description: string;
  /** قواعد التسعير الافتراضية (JSON) */
  defaultPricingRules: string;
  /** مجموعات الحقول الديناميكية */
  fieldGroups: FieldGroupDto[];
  /** فلاتر البحث الديناميكية */
  filters: SearchFilterDto[];
}

/**
 * أمر إنشاء نوع وحدة جديد
 */
export interface CreateUnitTypeCommand {
  propertyTypeId: string;
  name: string;
  maxCapacity: number;
}

/**
 * أمر تحديث نوع الوحدة
 */
export interface UpdateUnitTypeCommand {
  unitTypeId: string;
  name: string;
  maxCapacity: number;
}

/**
 * أمر حذف نوع وحدة
 */
export interface DeleteUnitTypeCommand {
  unitTypeId: string;
}

/**
 * استعلام جلب نوع وحدة بواسطة المعرف
 */
export interface GetUnitTypeByIdQuery {
  unitTypeId: string;
}

// أنواع فرعية مستخدمة
export interface FieldGroupDto {
  // ... أكمل حسب الحاجة
}
export interface SearchFilterDto {
  // ... أكمل حسب الحاجة
}
