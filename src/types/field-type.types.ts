// أنواع بيانات أنواع الحقول (Field Types)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات نوع الحقل الأساسية
 */
export interface FieldTypeDto {
  fieldTypeId: string;
  name: string;
  displayName: string;
  validationRules: Record<string, any>;
  isActive: boolean;
}

export interface CreateFieldTypeCommand {
  name: string;
  displayName: string;
  validationRules: Record<string, any>;
  isActive: boolean;
}

export interface UpdateFieldTypeCommand {
  fieldTypeId: string;
  name?: string;
  displayName?: string;
  validationRules?: Record<string, any>;
  isActive?: boolean;
}

export interface DeleteFieldTypeCommand {
  fieldTypeId: string;
}

export interface ToggleFieldTypeStatusCommand {
  fieldTypeId: string;
  isActive: boolean;
}

export interface GetFieldTypeByIdQuery {
  fieldTypeId: string;
}

export interface GetAllFieldTypesQuery {
  isActive?: boolean;
}

export interface SearchFieldTypesQuery {
  searchTerm: string;
  isActive?: boolean;
}
