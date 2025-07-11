// أنواع بيانات الوحدات (Units)
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

import type { FieldValueDto } from './unit-field-value.types';

/**
 * بيانات الوحدة الأساسية
 */
export interface UnitDto {
  /** معرف الوحدة */
  id: string;
  /** معرف العقار */
  propertyId: string;
  /** معرف نوع الوحدة */
  unitTypeId: string;
  /** اسم الوحدة */
  name: string;
  /** السعر الأساسي للوحدة */
  basePrice: MoneyDto;
  /** الميزات المخصصة (JSON) */
  customFeatures: string;
  /** حالة توفر الوحدة */
  isAvailable: boolean;
  /** اسم العقار */
  propertyName: string;
  /** اسم نوع الوحدة */
  unitTypeName: string;
  /** طريقة حساب السعر */
  pricingMethod: PricingMethod;
  /** قيم الحقول الديناميكية للوحدة */
  fieldValues: UnitFieldValueDto[];
  /** الحقول الديناميكية مجمعة */
  dynamicFields: FieldGroupWithValuesDto[];
  /** المسافة من الموقع الحالي بالكيلومترات */
  distanceKm?: number;
}

/**
 * تفاصيل الوحدة (تشمل الحقول الديناميكية)
 */
export interface UnitDetailsDto extends UnitDto {
  dynamicFields: FieldGroupWithValuesDto[];
}

/**
 * أمر إنشاء وحدة جديدة
 */
export interface CreateUnitCommand {
  propertyId: string;
  unitTypeId: string;
  name: string;
  basePrice: MoneyDto;
  customFeatures: string;
  pricingMethod: PricingMethod;
}

/**
 * أمر تحديث بيانات الوحدة
 */
export interface UpdateUnitCommand {
  unitId: string;
  name?: string;
  basePrice?: MoneyDto;
  customFeatures?: string;
  pricingMethod?: PricingMethod;
}

/**
 * أمر حذف وحدة
 */
export interface DeleteUnitCommand {
  unitId: string;
}

/**
 * استعلام جلب تفاصيل الوحدة
 */
export interface GetUnitByIdQuery {
  unitId: string;
}

/**
 * استعلام جلب الوحدات الخاصة بعقار معين
 */
export interface GetUnitsByPropertyQuery {
  /** معرف العقار */
  propertyId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب الوحدات حسب النوع
 */
export interface GetUnitsByTypeQuery {
  /** معرف نوع الوحدة */
  unitTypeId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب توفر الوحدة
 */
export interface GetUnitAvailabilityQuery {
  /** معرف الوحدة */
  unitId: string;
}

/**
 * استعلام جلب بيانات الوحدة للتعديل
 */
export interface GetUnitForEditQuery {
  /** معرف الوحدة */
  unitId: string;
}

/**
 * استعلام جلب صور الوحدة
 */
export interface GetUnitImagesQuery {
  /** معرف الوحدة */
  unitId: string;
}

/**
 * أمر إنشاء وحدة مع قيم الحقول الديناميكية
 */
export interface CreateUnitWithFieldValuesCommand {
  /** معرف العقار */
  propertyId: string;
  /** معرف نوع الوحدة */
  unitTypeId: string;
  /** اسم الوحدة */
  name: string;
  /** السعر الأساسي */
  basePrice: MoneyDto;
  /** ميزات مخصصة (JSON) */
  customFeatures: string;
  /** طريقة حساب السعر */
  pricingMethod: PricingMethod;
  /** قيم الحقول الديناميكية */
  fieldValues: FieldValueDto[];
}

/**
 * أمر تحديث توفر الوحدة
 */
export interface UpdateUnitAvailabilityCommand {
  /** معرف الوحدة */
  unitId: string;
  /** متاح أم لا */
  isAvailable: boolean;
}

/**
 * أمر تحديث متعدد لتوفر الوحدات
 */
export interface BulkUpdateUnitAvailabilityCommand {
  /** قائمة أوامر توفر الوحدات */
  commands: UpdateUnitAvailabilityCommand[];
}

/**
 * استعلام جلب الوحدات المتاحة
 */
export interface GetAvailableUnitsQuery {
  /** معرف العقار */
  propertyId: string;
  /** تاريخ البداية */
  startDate?: string;
  /** تاريخ النهاية */
  endDate?: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * طرق حساب السعر (مطابقة للباك اند)
 */
export const PricingMethod = {
  Hourly: 'Hourly',
  Daily: 'Daily',
  Weekly: 'Weekly',
  Monthly: 'Monthly',
} as const;
export type PricingMethod = keyof typeof PricingMethod;

// أنواع فرعية مستخدمة
export interface MoneyDto {
  amount: number;
  currency: string;
  formattedAmount?: string;
}

export interface UnitFieldValueDto {
  // ... أكمل حسب الحاجة
}

export interface FieldGroupWithValuesDto {
  // ... أكمل حسب الحاجة
}
