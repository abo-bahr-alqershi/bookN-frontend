import axios from 'axios';
import type {
  UnitFieldValueDto,
  CreateUnitFieldValueCommand,
  UpdateUnitFieldValueCommand,
  DeleteUnitFieldValueCommand,
  GetUnitFieldValueByIdQuery,
  GetUnitFieldValuesQuery,
  BulkUpdateUnitFieldValuesCommand,
  GetUnitFieldValuesGroupedQuery,
  FieldGroupWithValuesDto,
} from '../types/unit-field-value.types';
import type { ResultDto } from '../types/amenity.types';

// خدمات قيم الحقول للوحدات (Unit Field Values Service) للمدراء
export const UnitFieldValuesService = {
  /** إنشاء قيمة حقل لوحدة */
  create: (data: CreateUnitFieldValueCommand) =>
    axios.post<ResultDto<string>>(`/api/admin/UnitFieldValues`, data).then(res => res.data),

  /** تحديث قيمة حقل لوحدة */
  update: (valueId: string, data: UpdateUnitFieldValueCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/UnitFieldValues/${valueId}`, data).then(res => res.data),

  /** حذف قيمة حقل لوحدة */
  delete: (valueId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/UnitFieldValues/${valueId}`).then(res => res.data),

  /** تحديث متعدد لقيم حقول الوحدات */
  bulkUpdate: (data: BulkUpdateUnitFieldValuesCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/UnitFieldValues/bulk-update`, data).then(res => res.data),

  /** جلب جميع قيم الحقول لوحدة */
  getAll: (query: GetUnitFieldValuesQuery) =>
    axios.get<UnitFieldValueDto[]>(`/api/admin/UnitFieldValues`, { params: query }).then(res => res.data),

  /** جلب قيم الحقول مجمعة حسب المجموعات */
  getGrouped: (query: GetUnitFieldValuesGroupedQuery) =>
    axios.get<FieldGroupWithValuesDto[]>(`/api/admin/UnitFieldValues/grouped`, { params: query }).then(res => res.data),

  /** جلب قيمة حقل للوحدة حسب المعرف */
  getById: (valueId: string) =>
    axios.get<ResultDto<UnitFieldValueDto>>(`/api/admin/UnitFieldValues/${valueId}`).then(res => res.data),
};
