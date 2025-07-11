import axios from 'axios';
import type {
  UnitTypeDto,
  CreateUnitTypeCommand,
  UpdateUnitTypeCommand,
  DeleteUnitTypeCommand,
  GetUnitTypeByIdQuery,
} from '../types/unit-type.types';
import type { ResultDto } from '../types/amenity.types';

// مسار الـ API الخاص بأنواع الوحدات للإدارة
const API_BASE = '/api/admin/unit-types';

/**
 * جميع خدمات أنواع الوحدات للإدارة
 * موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند
 */
export const UnitTypesService = {
  // جلب جميع أنواع الوحدات
  getAllUnitTypes: (params?: Record<string, any>) =>
    axios.get<UnitTypeDto[]>(`${API_BASE}`, { params }),

  // جلب نوع وحدة بواسطة المعرف
  getUnitTypeById: (unitTypeId: string) =>
    axios.get<ResultDto<UnitTypeDto>>(`${API_BASE}/${unitTypeId}`),

  // إنشاء نوع وحدة جديد
  createUnitType: (data: CreateUnitTypeCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث نوع وحدة
  updateUnitType: (unitTypeId: string, data: UpdateUnitTypeCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`, data),

  // حذف نوع وحدة
  deleteUnitType: (unitTypeId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${unitTypeId}`),
};
