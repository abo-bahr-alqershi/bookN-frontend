import { apiClient } from './api.service';
import type {
  GetUnitTypeFieldsQuery,
  GetUnitTypeFieldByIdQuery,
  GetUnitTypeFieldsGroupedQuery,
  FieldGroupWithFieldsDto,
} from '../types/unit-type-field.types';
import type { UnitTypeFieldDto } from '../types/unit-type-field.types';
import type { ResultDto } from '../types/common.types';

/**
 * خدمات الحقول الديناميكية لنوع الوحدة (Property)
 */
export const PropertyUnitTypeFieldsService = {
  /** جلب الحقول لنوع وحدة معين لصاحب العقار */
  getByUnitTypeForProperty: (query: GetUnitTypeFieldsQuery) =>
    apiClient.get<UnitTypeFieldDto[]>(`/api/property/unit-type-fields/unit-type/${query.unitTypeId}`, { params: query }).then(res => res.data),

  /** جلب حقل نوع الوحدة حسب المعرف لصاحب العقار */
  getByIdForProperty: (query: GetUnitTypeFieldByIdQuery) =>
    apiClient.get<ResultDto<UnitTypeFieldDto>>(`/api/property/unit-type-fields/${query.fieldId}`, { params: query }).then(res => res.data),

  /** جلب الحقول المجمعة حسب المجموعات لصاحب العقار */
  getGroupedForProperty: (query: GetUnitTypeFieldsGroupedQuery) =>
    apiClient.get<FieldGroupWithFieldsDto[]>(`/api/property/unit-type-fields/grouped`, { params: query }).then(res => res.data),
};