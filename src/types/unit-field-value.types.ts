// أنواع بيانات قيم الحقول للوحدات (Unit Field Values)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند
import type { UnitTypeFieldDto } from './unit-type.types';

/**
 * بيانات قيمة حقل للوحدة
 */
export interface UnitFieldValueDto {
  /** معرف القيمة */
  valueId: string;
  /** معرف الوحدة */
  unitId: string;
  /** معرف الحقل */
  fieldId: string;
  /** اسم الحقل */
  fieldName: string;
  /** الاسم المعروض للحقل */
  displayName: string;
  /** قيمة الحقل */
  fieldValue: string;
  /** معلومات الحقل الديناميكي */
  field: UnitTypeFieldDto;
  /** تاريخ الإنشاء */
  createdAt: string;
  /** تاريخ التحديث */
  updatedAt: string;
}

/**
 * أمر إنشاء قيمة حقل للوحدة
 */
export interface CreateUnitFieldValueCommand {
  unitId: string;
  fieldId: string;
  fieldValue?: string;
}

/**
 * أمر تحديث قيمة حقل للوحدة
 */
export interface UpdateUnitFieldValueCommand {
  valueId: string;
  newFieldValue?: string;
}

/**
 * أمر حذف قيمة حقل للوحدة
 */
export interface DeleteUnitFieldValueCommand {
  valueId: string;
}

/**
 * استعلام جلب قيمة حقل للوحدة حسب المعرف
 */
export interface GetUnitFieldValueByIdQuery {
  valueId: string;
}

/**
 * استعلام جلب جميع قيم الحقول لوحدة معينة
 */
export interface GetUnitFieldValuesQuery {
  unitId: string;
  isPublic?: boolean;
}

/**
 * واجهة لقيمة الحقل الأساسية
 */
export interface FieldValueDto {
  /** معرف الحقل */
  fieldId: string;
  /** قيمة الحقل */
  fieldValue: string;
}

/**
 * أمر تحديث متعدد لقيم الحقول
 */
export interface BulkUpdateUnitFieldValuesCommand {
  /** معرف الوحدة */
  unitId: string;
  /** قائمة قيم الحقول */
  fieldValues: FieldValueDto[];
}

/**
 * استعلام جلب قيم الحقول مجمعة حسب المجموعات
 */
export interface GetUnitFieldValuesGroupedQuery {
  /** معرف الوحدة */
  unitId: string;
  /** عام فقط (اختياري) */
  isPublic?: boolean;
}

/**
 * واجهة لحقل مع قيمته
 */
export interface FieldWithValueDto {
  /** معرف القيمة */
  valueId: string;
  /** معرف الحقل */
  fieldId: string;
  /** اسم الحقل */
  fieldName: string;
  /** الاسم المعروض للحقل */
  displayName: string;
  /** قيمة الحقل */
  value: string;
}

/**
 * مجموعة الحقول مع قيمها
 */
export interface FieldGroupWithValuesDto {
  /** معرف المجموعة */
  groupId: string;
  /** اسم المجموعة */
  groupName: string;
  /** الاسم المعروض للمجموعة */
  displayName: string;
  /** وصف المجموعة */
  description: string;
  /** قائمة قيم الحقول */
  fieldValues: FieldWithValueDto[];
}
