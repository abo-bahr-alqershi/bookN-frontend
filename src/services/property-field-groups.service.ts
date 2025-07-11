import axios from 'axios';
import type {
  FieldGroupDto,
  GetFieldGroupByIdQuery,
  GetFieldGroupsByPropertyTypeQuery
} from '../types/field-group.types';

// المسار الأساسي لخدمة مجموعات الحقول للمالك
const API_BASE = '/api/property/fieldgroups';

/**
 * خدمات مجموعات الحقول للمالك
 */
export const PropertyFieldGroupsService = {
  /** جلب مجموعة حقول بواسطة المعرف */
  getById: (query: GetFieldGroupByIdQuery) =>
    axios.get<FieldGroupDto>(`${API_BASE}/${query.groupId}`).then(res => res.data),

  /** جلب مجموعات الحقول حسب نوع العقار */
  getByPropertyType: (query: GetFieldGroupsByPropertyTypeQuery) =>
    axios.get<FieldGroupDto[]>(`${API_BASE}/property-type/${query.propertyTypeId}`).then(res => res.data)
}; 