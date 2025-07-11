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

/**
 * استعلام جلب أنواع الوحدات لنوع عقار معين
 */
export interface GetUnitTypesByPropertyTypeQuery {
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * مجموعة حقول نوع الوحدة
 */
export interface FieldGroupDto {
  /** معرف المجموعة */
  groupId: string;
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** اسم المجموعة */
  groupName: string;
  /** الاسم المعروض للمجموعة */
  displayName: string;
  /** وصف المجموعة */
  description: string;
  /** ترتيب المجموعة */
  sortOrder: number;
  /** قابلية الطي للمجموعة */
  isCollapsible: boolean;
  /** حالة التوسع الافتراضي */
  isExpandedByDefault: boolean;
  /** حقول المجموعة */
  fields: UnitTypeFieldDto[];
}

/**
 * حقل ديناميكي لنوع الوحدة
 */
export interface UnitTypeFieldDto {
  /** معرف الحقل */
  fieldId: string;
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** معرف نوع الحقل */
  fieldTypeId: string;
  /** اسم الحقل */
  fieldName: string;
  /** الاسم المعروض للحقل */
  displayName: string;
  /** وصف الحقل */
  description: string;
  /** خيارات الحقل (JSON) */
  fieldOptions: Record<string, any>;
  /** قواعد التحقق (JSON) */
  validationRules: Record<string, any>;
  /** هل الحقل إلزامي */
  isRequired: boolean;
  /** هل الحقل قابل للفلترة */
  isSearchable: boolean;
  /** هل الحقل عام */
  isPublic: boolean;
  /** ترتيب الحقل */
  sortOrder: number;
  /** فئة الحقل */
  category: string;
  /** معرف المجموعة المرتبطة (إن وجدت) */
  groupId: string;
  /** يحدد ما إذا كان الحقل مخصص للوحدات */
  isForUnits: boolean;
}

/**
 * فلتر البحث الديناميكي
 */
export interface SearchFilterDto {
  /** معرف الفلتر */
  filterId: string;
  /** معرف الحقل */
  fieldId: string;
  /** نوع الفلتر */
  filterType: string;
  /** الاسم المعروض */
  displayName: string;
  /** خيارات الفلتر (JSON) */
  filterOptions: Record<string, any>;
  /** حالة التفعيل */
  isActive: boolean;
  /** ترتيب الفلتر */
  sortOrder: number;
  /** معلومات الحقل الديناميكي المرتبط */
  field: UnitTypeFieldDto;
}
