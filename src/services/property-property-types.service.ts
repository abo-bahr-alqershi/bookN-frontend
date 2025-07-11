import axios from 'axios';
import type {
  PropertyTypeDto,
  GetAllPropertyTypesQuery,
  GetPropertyTypeByIdQuery,
} from '../types/property-type.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// المسار الأساسي لتعاملات أنواع العقارات لأصحاب العقارات
const API_BASE = '/api/property/propertytypes';

export const PropertyPropertyTypesService = {
  // جلب جميع أنواع العقارات مع الفلاتر والصفحات
  getAll: (params?: GetAllPropertyTypesQuery) =>
    axios.get<PaginatedResult<PropertyTypeDto>>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب بيانات نوع عقار بواسطة المعرف
  getById: (propertyTypeId: string) =>
    axios.get<ResultDto<PropertyTypeDto>>(`${API_BASE}/${propertyTypeId}`).then(res => res.data),
};