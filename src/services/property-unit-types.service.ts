import axios from 'axios';
import type {
  UnitTypeDto,
  CreateUnitTypeCommand,
  UpdateUnitTypeCommand,
  DeleteUnitTypeCommand,
  GetUnitTypeByIdQuery,
  GetUnitTypesByPropertyTypeQuery,
} from '../types/unit-type.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// المسار الأساسي لتعاملات أنواع الوحدات لأصحاب العقارات
const API_BASE = '/api/property/UnitTypes';

/**
 * جميع خدمات أنواع الوحدات لأصحاب العقارات
 */
export const PropertyUnitTypesService = {
  /** إنشاء نوع وحدة جديد */
  create: (data: CreateUnitTypeCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  /** تحديث نوع الوحدة */
  update: (unitTypeId: string, data: UpdateUnitTypeCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`, data).then(res => res.data),

  /** حذف نوع وحدة */
  delete: (unitTypeId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`).then(res => res.data),

  /** جلب نوع وحدة بواسطة المعرف */
  getById: (query: GetUnitTypeByIdQuery) =>
    axios.get<ResultDto<UnitTypeDto>>(`${API_BASE}/${query.unitTypeId}`).then(res => res.data),

  /** جلب أنواع الوحدات حسب نوع العقار */
  getByPropertyType: (query: GetUnitTypesByPropertyTypeQuery) =>
    axios
      .get<PaginatedResult<UnitTypeDto>>(`${API_BASE}/property-type/${query.propertyTypeId}`, {
        params: { pageNumber: query.pageNumber, pageSize: query.pageSize },
      })
      .then(res => res.data),
}; 