import { apiClient } from './api.service';
import type {
  PropertyTypeDto,
  GetAllPropertyTypesQuery,
  GetPropertyTypeByIdQuery,
} from '../types/property-type.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// المسار الأساسي لتعاملات أنواع الكيانات لأصحاب الكيانات
const API_BASE = '/api/property/propertytypes';

export const PropertyPropertyTypesService = {
  // جلب جميع أنواع الكيانات مع الفلاتر والصفحات
  getAll: (params?: GetAllPropertyTypesQuery) =>
    apiClient.get<PaginatedResult<PropertyTypeDto>>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب بيانات نوع كيان بواسطة المعرف
  getById: (propertyTypeId: string) =>
    apiClient.get<ResultDto<PropertyTypeDto>>(`${API_BASE}/${propertyTypeId}`).then(res => res.data),
};