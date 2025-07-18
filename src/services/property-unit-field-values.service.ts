import { apiClient } from './api.service';
import type {
  UnitFieldValueDto,
  CreateUnitFieldValueCommand,
  UpdateUnitFieldValueCommand,
  DeleteUnitFieldValueCommand,
  GetUnitFieldValueByIdQuery,
  GetUnitFieldValuesQuery,
  GetUnitFieldValuesGroupedQuery,
  FieldGroupWithValuesDto,
  BulkCreateUnitFieldValueCommand,
  BulkDeleteUnitFieldValueCommand,
  BulkUpdateUnitFieldValueCommand,
} from '../types/unit-field-value.types';
import type { ResultDto } from '../types/common.types';

// خدمات قيم الحقول للوحدات (Property)
const API_BASE = '/api/property/unitfieldvalues';

export const PropertyUnitFieldValuesService = {
  /** إنشاء قيمة حقل لوحدة */
  create: (data: CreateUnitFieldValueCommand) =>
    apiClient.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  /** تحديث قيمة حقل لوحدة */
  update: (valueId: string, data: UpdateUnitFieldValueCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/${valueId}`, data).then(res => res.data),

  /** حذف قيمة حقل لوحدة */
  delete: (valueId: string) =>
    apiClient.delete<ResultDto<boolean>>(`${API_BASE}/${valueId}`).then(res => res.data),

  /** تحديث متعدد لقيم حقول الوحدات */
  bulkUpdate: (data: BulkUpdateUnitFieldValueCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/bulk-update`, data).then(res => res.data),

  /** إنشاء جماعي لقيم حقول الوحدات */
  bulkCreate: (data: BulkCreateUnitFieldValueCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/bulk-create`, data).then(res => res.data),

  /** حذف جماعي لقيم حقول الوحدات */
  bulkDelete: (data: BulkDeleteUnitFieldValueCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/bulk-delete`, data).then(res => res.data),

  /** تحديث جماعي لقيم حقول الوحدات */
  bulkUpdateValue: (data: BulkUpdateUnitFieldValueCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/bulk-update-value`, data).then(res => res.data),

  /** جلب جميع قيم الحقول لوحدة */
  getAll: (query: GetUnitFieldValuesQuery) =>
    apiClient.get<UnitFieldValueDto[]>(`${API_BASE}`, { params: query }).then(res => res.data),

  /** جلب قيم الحقول مجمعة حسب المجموعات */
  getGrouped: (query: GetUnitFieldValuesGroupedQuery) =>
    apiClient.get<FieldGroupWithValuesDto[]>(`${API_BASE}/grouped`, { params: query }).then(res => res.data),

  /** جلب قيمة حقل للوحدة حسب المعرف */
  getById: (valueId: string) =>
    apiClient.get<ResultDto<UnitFieldValueDto>>(`${API_BASE}/${valueId}`).then(res => res.data),
};