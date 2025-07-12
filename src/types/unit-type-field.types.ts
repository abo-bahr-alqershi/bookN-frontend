// أنواع بيانات حقول نوع الوحدة (Unit Type Field Types)
// أنواع بيانات حقول نوع الوحدة (Unit Type Field Types)

/**
 * DTO for UnitTypeField entity
 */
export interface UnitTypeFieldDto {
  fieldId: string;
  propertyTypeId: string;
  fieldTypeId: string;
  fieldName: string;
  displayName: string;
  description: string;
  fieldOptions: Record<string, any>;
  validationRules: Record<string, any>;
  isRequired: boolean;
  isSearchable: boolean;
  isPublic: boolean;
  sortOrder: number;
  category: string;
  groupId: string;
  isForUnits: boolean;
}

/**
 * نموذج لترتيب الحقول
 */
export interface FieldOrderDto {
  fieldId: string;
  sortOrder: number;
}

/**
 * نموذج لعملية إسناد حقل لمجموعة
 */
export interface FieldGroupAssignmentDto {
  /** معرف الحقل */
  fieldId: string;
  /** معرف المجموعة */
  groupId: string;
  /** ترتيب الحقل داخل المجموعة */
  sortOrder: number;
}

/**
 * إنشاء حقل ديناميكي لنوع الوحدة
 */
export interface CreateUnitTypeFieldCommand {
  /** معرف نوع الوحدة */
  propertyTypeId: string;
  /** معرف نوع الحقل */
  fieldTypeId: string;
  /** اسم الحقل */
  fieldName: string;
  /** الاسم المعروض للحقل */
  displayName: string;
  /** وصف الحقل */
  description?: string;
  /** خيارات الحقل (JSON) */
  fieldOptions?: Record<string, any>;
  /** قواعد التحقق المخصصة (JSON) */
  validationRules?: Record<string, any>;
  /** هل الحقل إلزامي */
  isRequired: boolean;
  /** هل الحقل قابل للبحث */
  isSearchable: boolean;
  /** هل الحقل عام */
  isPublic: boolean;
  /** ترتيب الحقل */
  sortOrder: number;
  /** فئة الحقل */
  category?: string;
  /** يحدد ما إذا كان الحقل مخصص للوحدات */
  isForUnits: boolean;
  /** معرف المجموعة (اختياري) */
  groupId?: string;
}

/**
 * تحديث بيانات حقل نوع الوحدة
 */
export interface UpdateUnitTypeFieldCommand {
  /** معرف الحقل */
  fieldId: string;
  /** اسم الحقل */
  fieldName?: string;
  /** الاسم المعروض للحقل */
  displayName?: string;
  /** وصف الحقل */
  description?: string;
  /** خيارات الحقل (JSON) */
  fieldOptions?: Record<string, any>;
  /** قواعد التحقق المخصصة (JSON) */
  validationRules?: Record<string, any>;
  /** هل الحقل إلزامي */
  isRequired?: boolean;
  /** هل الحقل قابل للبحث */
  isSearchable?: boolean;
  /** هل الحقل عام */
  isPublic?: boolean;
  /** ترتيب الحقل */
  sortOrder?: number;
  /** فئة الحقل */
  category?: string;
  /** يحدد ما إذا كان الحقل مخصص للوحدات */
  isForUnits?: boolean;
}

/**
 * حذف حقل نوع الوحدة
 */
export interface DeleteUnitTypeFieldCommand {
  /** معرف الحقل */
  fieldId: string;
}

/**
 * تبديل حالة تفعيل حقل نوع الوحدة
 */
export interface ToggleUnitTypeFieldStatusCommand {
  /** معرف الحقل */
  fieldId: string;
  /** الحالة الجديدة */
  isActive: boolean;
}

/**
 * إعادة ترتيب الحقول الديناميكية لنوع الوحدة
 */
export interface ReorderUnitTypeFieldsCommand {
  /** معرف نوع الوحدة */
  unitTypeId: string;
  /** طلبات ترتيب الحقول */
  fieldOrders: FieldOrderDto[];
}

/**
 * استعلام جلب الحقول لنوع الوحدة
 */
export interface GetUnitTypeFieldsQuery {
  /** معرف نوع الوحدة */
  propertyTypeId: string;
  /** حالة التفعيل (اختياري) */
  isActive?: boolean;
  /** قابل للبحث فقط (اختياري) */
  isSearchable?: boolean;
  /** عام فقط (اختياري) */
  isPublic?: boolean;
  /** تصفية حسب احتواء الوحدة فقط (اختياري) */
  isForUnits?: boolean;
  /** فئة الحقل (اختياري) */
  category?: string;
}

/**
 * استعلام جلب حقل نوع الوحدة حسب المعرف
 */
export interface GetUnitTypeFieldByIdQuery {
  /** معرف الحقل */
  fieldId: string;
}

/**
 * استعلام جلب الحقول الديناميكية مجمعة حسب المجموعات
 */
export interface GetUnitTypeFieldsGroupedQuery {
  /** معرف نوع الوحدة */
  propertyTypeId: string;
  /** عام فقط (اختياري) */
  isPublic?: boolean;
}

/**
 * أمر إسناد عدة حقول إلى مجموعة
 */
export interface AssignFieldsToGroupCommand {
  /** معرف المجموعة */
  groupId: string;
  /** قائمة معرفات الحقول */
  fieldIds: string[];
}

/**
 * أمر تخصيص حقل لمجموعة واحدة
 */
export interface AssignFieldToGroupCommand {
  /** معرف الحقل */
  fieldId: string;
  /** معرف المجموعة */
  groupId: string;
  /** ترتيب الحقل داخل المجموعة */
  sortOrder: number;
}

/**
 * الأمر للإسناد الجماعي للحقول إلى مجموعات
 */
export interface BulkAssignFieldsToGroupsCommand {
  /** قائمة عمليات الإسناد */
  assignments: FieldGroupAssignmentDto[];
}

/**
 * الأمر لإزالة حقل من مجموعة
 */
export interface RemoveFieldFromGroupCommand {
  /** معرف الحقل */
  fieldId: string;
  /** معرف المجموعة */
  groupId: string;
}

/**
 * الأمر لإعادة ترتيب الحقول ضمن مجموعة
 */
export interface ReorderFieldsInGroupCommand {
  /** معرف المجموعة */
  groupId: string;
  /** قائمة معرفات الحقول بالترتيب الجديد */
  fieldIds: string[];
}

/**
 * مجموعة حقول مع الحقول المرتبطة
 */
export interface FieldGroupWithFieldsDto {
  groupId: string;
  groupName: string;
  displayName: string;
  description: string;
  sortOrder: number;
  isCollapsible: boolean;
  isExpandedByDefault: boolean;
  fields: UnitTypeFieldDto[];
}

/**
 * استعلام لجلب الحقول غير المجمعة ضمن أي مجموعة
 */
export interface GetUngroupedFieldsQuery {
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** قابل للبحث فقط (اختياري) */
  isSearchable?: boolean;
  /** عام فقط (اختياري) */
  isPublic?: boolean;
  /** مخصص للوحدات فقط (اختياري) */
  isForUnits?: boolean;
  /** فئة الحقل (اختياري) */
  category?: string;
  /** رقم الصفحة (اختياري) */
  pageNumber?: number;
  /** حجم الصفحة (اختياري) */
  pageSize?: number;
}

/**
 * أمر bulk assign للحقول لمجموعة واحدة
 */
export interface BulkAssignFieldToGroupCommand {
  /** قائمة معرفات الحقول */
  fieldIds: string[];
} 