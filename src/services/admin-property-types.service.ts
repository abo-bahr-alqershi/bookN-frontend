import axios from 'axios';
import type {
  PropertyTypeDto,
  CreatePropertyTypeCommand,
  UpdatePropertyTypeCommand,
  DeletePropertyTypeCommand,
  GetAllPropertyTypesQuery,
  GetPropertyTypeByIdQuery,
} from '../types/property-type.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// المسار الأساسي لتعاملات أنواع العقارات للمدراء
const API_BASE = '/api/admin/propertytypes';

export const AdminPropertyTypesService = {
  // إنشاء نوع عقار جديد
  create: (data: CreatePropertyTypeCommand) =>
    axios.post<ResultDto<string>>(API_BASE, data).then(res => res.data),

  // تحديث بيانات نوع عقار
  update: (propertyTypeId: string, data: UpdatePropertyTypeCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${propertyTypeId}`, data).then(res => res.data),

  // حذف نوع عقار
  delete: (propertyTypeId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${propertyTypeId}`).then(res => res.data),

  // جلب جميع أنواع العقارات مع الفلاتر والصفحات
  getAll: (params?: GetAllPropertyTypesQuery) =>
    axios.get<PaginatedResult<PropertyTypeDto>>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب بيانات نوع عقار بواسطة المعرف
  getById: (propertyTypeId: string) =>
    axios.get<ResultDto<PropertyTypeDto>>(`${API_BASE}/${propertyTypeId}`).then(res => res.data),
};