import axios from 'axios';
import type {
  UnitDto,
  UnitDetailsDto,
  CreateUnitCommand,
  UpdateUnitCommand,
  DeleteUnitCommand,
  GetUnitByIdQuery,
} from '../types/unit.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// مسار الـ API الخاص بالوحدات للإدارة
const API_BASE = '/api/admin/units';

/**
 * جميع خدمات الوحدات للإدارة
 * موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند
 */
export const UnitsService = {
  // جلب جميع الوحدات مع صفحات وفلاتر
  getAllUnits: (params?: Record<string, any>) =>
    axios.get<PaginatedResult<UnitDto>>(`${API_BASE}`, { params }),

  // جلب تفاصيل وحدة بواسطة المعرف
  getUnitById: (unitId: string) =>
    axios.get<ResultDto<UnitDetailsDto>>(`${API_BASE}/${unitId}`),

  // إنشاء وحدة جديدة
  createUnit: (data: CreateUnitCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث بيانات وحدة
  updateUnit: (unitId: string, data: UpdateUnitCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${unitId}`, data),

  // حذف وحدة
  deleteUnit: (unitId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${unitId}`),
};
