import axios from 'axios';
import type {
  PropertyDto,
  CreatePropertyCommand,
  UpdatePropertyCommand,
  DeletePropertyCommand,
  GetAllPropertiesQuery,
} from '../types/property.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

const API_BASE = '/api/admin/properties';

export const PropertiesService = {
  // إنشاء عقار جديد
  createProperty: (data: CreatePropertyCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث بيانات عقار
  updateProperty: (propertyId: string, data: UpdatePropertyCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${propertyId}`, data),

  // حذف عقار
  deleteProperty: (propertyId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${propertyId}`),

  // جلب جميع العقارات مع الفلاتر والصفحات
  getAllProperties: (params?: GetAllPropertiesQuery) =>
    axios.get<PaginatedResult<PropertyDto>>(`${API_BASE}`, { params }),

  // جلب بيانات عقار بواسطة المعرف
  getPropertyById: (propertyId: string) =>
    axios.get<ResultDto<PropertyDto>>(`${API_BASE}/${propertyId}`),
};
