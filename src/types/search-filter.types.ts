// أنواع بيانات فلاتر البحث للمدراء (Search Filters)

import type { UnitTypeFieldDto } from "./unit-type-field.types";


/**
 * بيانات فلتر البحث
 */
export interface SearchFilterDto {
  filterId: string;
  fieldId: string;
  filterType: string;
  displayName: string;
  filterOptions: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  field: UnitTypeFieldDto;
}

export interface CreateSearchFilterCommand {
  fieldId: string;
  filterType: string;
  displayName: string;
  filterOptions: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdateSearchFilterCommand {
  filterId: string;
  fieldId?: string;
  filterType?: string;
  displayName?: string;
  filterOptions?: Record<string, any>;
  isActive?: boolean;
  sortOrder?: number;
}

export interface DeleteSearchFilterCommand {
  filterId: string;
}

export interface ToggleSearchFilterStatusCommand {
  filterId: string;
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