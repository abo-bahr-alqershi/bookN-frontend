import { apiClient } from './api.service';
import type {
  UnitTypeDto,
  CreateUnitTypeCommand,
  UpdateUnitTypeCommand,
  DeleteUnitTypeCommand,
  GetUnitTypeByIdQuery,
  GetUnitTypesByPropertyTypeQuery,
} from '../types/unit-type.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// المسار الأساسي لتعاملات أنواع الوحدات لأصحاب الكيانات
const API_BASE = '/api/property/UnitTypes';

/**
 * جميع خدمات أنواع الوحدات لأصحاب الكيانات
 */
export const PropertyUnitTypesService = {
  /** إنشاء نوع وحدة جديد */
  create: (data: CreateUnitTypeCommand) =>
    apiClient.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  /** تحديث نوع الوحدة */
  update: (unitTypeId: string, data: UpdateUnitTypeCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`, data).then(res => res.data),

  /** حذف نوع وحدة */
  delete: (unitTypeId: string) =>
    apiClient.delete<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`).then(res => res.data),

  /** جلب نوع وحدة بواسطة المعرف */
  getById: (query: GetUnitTypeByIdQuery) =>
    apiClient.get<ResultDto<UnitTypeDto>>(`${API_BASE}/${query.unitTypeId}`).then(res => res.data),

  /** جلب أنواع الوحدات حسب نوع الكيان */
  getByPropertyType: (query: GetUnitTypesByPropertyTypeQuery) =>
    apiClient
      .get<PaginatedResult<UnitTypeDto>>(`${API_BASE}/property-type/${query.propertyTypeId}`, {
        params: { pageNumber: query.pageNumber, pageSize: query.pageSize },
      })
      .then(res => res.data),
}; 