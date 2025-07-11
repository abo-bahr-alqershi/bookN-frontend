import type { UnitTypeFieldDto } from './unit-type.types';
// أنواع بيانات مجموعات الحقول (Field Group Types)

/**
 * بيانات مجموعة حقول
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
  /** ترتيب العرض */
  sortOrder: number;
  /** قابلية الطي للمجموعة */
  isCollapsible: boolean;
  /** حالة التوسع الافتراضي */
  isExpandedByDefault: boolean;
  /** حقول المجموعة (اختياري) */
  fields?: UnitTypeFieldDto[];
}

/**
 * أمر إنشاء مجموعة حقول
 */
export interface CreateFieldGroupCommand {
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** اسم المجموعة */
  groupName: string;
  /** الاسم المعروض للمجموعة */
  displayName?: string;
  /** وصف المجموعة */
  description?: string;
  /** ترتيب العرض */
  sortOrder: number;
  /** قابلية الطي للمجموعة */
  isCollapsible?: boolean;
  /** حالة التوسع الافتراضي */
  isExpandedByDefault?: boolean;
}

/**
 * أمر تحديث مجموعة حقول
 */
export interface UpdateFieldGroupCommand {
  /** معرف المجموعة */
  groupId: string;
  /** اسم المجموعة */
  groupName: string;
  /** الاسم المعروض للمجموعة */
  displayName?: string;
  /** وصف المجموعة */
  description?: string;
  /** ترتيب العرض */
  sortOrder: number;
  /** قابلية الطي للمجموعة */
  isCollapsible: boolean;
  /** حالة التوسع الافتراضي */
  isExpandedByDefault: boolean;
}

/**
 * أمر حذف مجموعة حقول
 */
export interface DeleteFieldGroupCommand {
  /** معرف المجموعة */
  groupId: string;
}

/**
 * طلب ترتيب المجموعة
 */
export interface GroupOrderDto {
  /** معرف المجموعة */
  groupId: string;
  /** ترتيب المجموعة */
  sortOrder: number;
}

/**
 * أمر إعادة ترتيب مجموعات الحقول
 */
export interface ReorderFieldGroupsCommand {
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** طلبات ترتيب المجموعات */
  groupOrders: GroupOrderDto[];
}

/**
 * استعلام جلب مجموعة حقول حسب المعرف
 */
export interface GetFieldGroupByIdQuery {
  /** معرف المجموعة */
  groupId: string;
}

/**
 * استعلام جلب مجموعات الحقول حسب نوع العقار
 */
export interface GetFieldGroupsByPropertyTypeQuery {
  /** معرف نوع العقار */
  propertyTypeId: string;
}

/**
 * أمر تخصيص حقل لمجموعة
 */
export interface AssignFieldToGroupCommand {
  /** معرف الحقل */
  fieldId: string;
  /** معرف المجموعة */
  groupId: string;
  /** ترتيب الحقل داخل المجموعة */
  sortOrder: number;
} 