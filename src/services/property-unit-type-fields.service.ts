import axios from 'axios';
import type {
  GetUnitTypeFieldsQuery,
  GetUnitTypeFieldByIdQuery,
  GetUnitTypeFieldsGroupedQuery,
  FieldGroupWithFieldsDto,
} from '../types/unit-type-field.types';
import type { UnitTypeFieldDto } from '../types/unit-type.types';
import type { ResultDto } from '../types/amenity.types';

/**
 * خدمات الحقول الديناميكية لنوع الوحدة (Property)
 */
export const PropertyUnitTypeFieldsService = {
  /** جلب الحقول لنوع وحدة معين لصاحب العقار */
  getByPropertyTypeForProperty: (query: GetUnitTypeFieldsQuery) =>
    axios.get<UnitTypeFieldDto[]>(`/api/property/property-type-fields/property-type/${query.propertyTypeId}`, { params: query }).then(res => res.data),

  /** جلب حقل نوع الوحدة حسب المعرف لصاحب العقار */
  getByIdForProperty: (query: GetUnitTypeFieldByIdQuery) =>
    axios.get<ResultDto<UnitTypeFieldDto>>(`/api/property/property-type-fields/${query.fieldId}`, { params: query }).then(res => res.data),

  /** جلب الحقول المجمعة حسب المجموعات لصاحب العقار */
  getGroupedForProperty: (query: GetUnitTypeFieldsGroupedQuery) =>
    axios.get<FieldGroupWithFieldsDto[]>(`/api/property/property-type-fields/grouped`, { params: query }).then(res => res.data),
};