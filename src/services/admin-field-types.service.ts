import axios from 'axios';
import type {
  FieldTypeDto,
  CreateFieldTypeCommand,
  UpdateFieldTypeCommand,
  DeleteFieldTypeCommand,
  ToggleFieldTypeStatusCommand,
  GetFieldTypeByIdQuery,
  GetAllFieldTypesQuery,
  SearchFieldTypesQuery,
} from '../types/field-type.types';
import type { ResultDto } from '../types/common.types';

/**
 * خدمات أنواع الحقول للمشرف (Field Types Service)
 */
export const AdminFieldTypesService = {
  /**
   * إنشاء نوع حقل جديد
   */
  create: (data: CreateFieldTypeCommand) =>
    axios.post<ResultDto<string>>('/api/admin/FieldTypes', data).then(res => res.data),

  /**
   * تحديث نوع حقل موجود
   */
  update: (fieldTypeId: string, data: UpdateFieldTypeCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/FieldTypes/${fieldTypeId}`, data).then(res => res.data),

  /**
   * حذف نوع حقل
   */
  delete: (fieldTypeId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/FieldTypes/${fieldTypeId}`).then(res => res.data),

  /**
   * تبديل حالة نوع الحقل (مفعل/غير مفعل)
   */
  toggleStatus: (fieldTypeId: string, data: ToggleFieldTypeStatusCommand) =>
    axios.patch<ResultDto<boolean>>(`/api/admin/FieldTypes/${fieldTypeId}/toggle-status`, data).then(res => res.data),

  /**
   * جلب جميع أنواع الحقول مع إمكانية التصفية حسب الحالة
   */
  getAll: (query?: GetAllFieldTypesQuery) =>
    axios.get<ResultDto<FieldTypeDto[]>>('/api/admin/FieldTypes', { params: query }).then(res => res.data),

  /**
   * جلب نوع حقل حسب المعرف
   */
  getById: (query: GetFieldTypeByIdQuery) =>
    axios.get<ResultDto<FieldTypeDto>>(`/api/admin/FieldTypes/${query.fieldTypeId}`).then(res => res.data),

  /**
   * البحث في أنواع الحقول حسب مصطلح البحث وحالة التفعيل
   */
  search: (query: SearchFieldTypesQuery) =>
    axios.get<ResultDto<FieldTypeDto[]>>('/api/admin/FieldTypes/search', { params: query }).then(res => res.data),
};
