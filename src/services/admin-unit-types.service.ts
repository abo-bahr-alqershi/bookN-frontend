import axios from 'axios';
import type {
  UnitTypeDto,
  CreateUnitTypeCommand,
  UpdateUnitTypeCommand,
  DeleteUnitTypeCommand,
  GetUnitTypeByIdQuery,
  GetUnitTypesByPropertyTypeQuery,
} from '../types/unit-type.types';
import type { PaginatedResult, ResultDto } from '../types/common.types';

// المسار الأساسي لتعاملات أنواع الوحدات للمدراء
const API_BASE = '/api/admin/UnitTypes';

/**
 * جميع خدمات أنواع الوحدات للإدارة
 * موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند
 */
export const AdminUnitTypesService = {
  /** جلب جميع أنواع الوحدات مع صفحات وفلاتر */
  getAll: (params?: Record<string, any>) =>
    axios.get<PaginatedResult<UnitTypeDto>>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب نوع وحدة بواسطة المعرف
  getById: (query: GetUnitTypeByIdQuery) =>
    axios.get<ResultDto<UnitTypeDto>>(`${API_BASE}/${query.unitTypeId}`).then(res => res.data),

  // إنشاء نوع وحدة جديد
  create: (data: CreateUnitTypeCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  // تحديث نوع وحدة
  update: (unitTypeId: string, data: UpdateUnitTypeCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`, data).then(res => res.data),

  // حذف نوع وحدة
  delete: (unitTypeId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`).then(res => res.data),
  /** جلب أنواع الوحدات حسب نوع العقار مع صفحات */
  getByPropertyType: (params: GetUnitTypesByPropertyTypeQuery) => {
    const { propertyTypeId, pageNumber, pageSize } = params;
    return axios
      .get<PaginatedResult<UnitTypeDto>>(
        `${API_BASE}/property-type/${propertyTypeId}`,
        { params: { pageNumber, pageSize } }
      )
      .then(res => res.data);
  },
};
