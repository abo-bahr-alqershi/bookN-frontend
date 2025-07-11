// أنواع بيانات فلاتر البحث للمدراء (Search Filters)

import type { UnitTypeFieldDto } from './unit-type.types';

/**
 * بيانات فلتر البحث
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

/**
 * أمر إنشاء فلتر بحث جديد
 */
export interface CreateSearchFilterCommand {
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
}

/**
 * أمر لتحديث فلتر بحث
 */
export interface UpdateSearchFilterCommand {
  /** معرف الفلتر */
  filterId: string;
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
}

/**
 * أمر حذف فلتر بحث
 */
export interface DeleteSearchFilterCommand {
  /** معرف الفلتر */
  filterId: string;
}

/**
 * أمر لتبديل حالة التفعيل لفلتر بحث
 */
export interface ToggleSearchFilterStatusCommand {
  /** معرف الفلتر */
  filterId: string;
  /** حالة التفعيل الجديدة */
  isActive: boolean;
}

/**
 * استعلام جلب جميع فلاتر البحث لنوع عقار معين
 */
export interface GetSearchFiltersQuery {
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** حالة التفعيل (اختياري) */
  isActive?: boolean;
}

/**
 * استعلام جلب فلتر بحث حسب المعرف
 */
export interface GetSearchFilterByIdQuery {
  /** معرف الفلتر */
  filterId: string;
}

/**
 * استعلام جلب الحقول القابلة للبحث لنوع عقار معين
 */
export interface GetSearchableFieldsQuery {
  /** معرف نوع العقار */
  propertyTypeId: string;
} 