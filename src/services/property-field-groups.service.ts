import { apiClient } from './api.service';
import type {
  FieldGroupDto,
  GetFieldGroupByIdQuery,
  GetFieldGroupsByUnitTypeQuery
} from '../types/field-group.types';

// المسار الأساسي لخدمة مجموعات الحقول للمالك
const API_BASE = '/api/property/fieldgroups';

/**
 * خدمات مجموعات الحقول للمالك
 */
export const PropertyFieldGroupsService = {
  /** جلب مجموعة حقول بواسطة المعرف */
  getById: (query: GetFieldGroupByIdQuery) =>
    apiClient.get<FieldGroupDto>(`${API_BASE}/${query.groupId}`).then(res => res.data),

  /** جلب مجموعات الحقول حسب نوع الوحدة */
  getByUnitType: (query: GetFieldGroupsByUnitTypeQuery) =>
    apiClient.get<FieldGroupDto[]>(`${API_BASE}/unit-type/${query.unitTypeId}`).then(res => res.data)
}; 