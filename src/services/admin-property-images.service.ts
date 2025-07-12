import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type {
  PropertyImageDto,
  CreatePropertyImageCommand,
  UpdatePropertyImageCommand,
  DeletePropertyImageCommand,
  AssignPropertyImageToPropertyCommand,
  AssignPropertyImageToUnitCommand,
  GetPropertyImagesQuery,
  PropertyImageStatsDto,
  BulkAssignImageToPropertyCommand,
  BulkAssignImageToUnitCommand,
  ReorderPropertyImagesCommand,
} from '../types/property-image.types';

const API_BASE = '/api/admin/propertyimages';

// خدمات إدارة صور العقارات للمدراء (Admin Property Images Service)
export const AdminPropertyImagesService = {
  /** إنشاء صورة عقار جديدة */
  create: (data: CreatePropertyImageCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  /** تحديث بيانات صورة عقار */
  update: (imageId: string, data: UpdatePropertyImageCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${imageId}`, data).then(res => res.data),

  /** حذف صورة عقار */
  delete: (imageId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${imageId}`).then(res => res.data),

  /** إسناد الصورة لعقار */
  assignToProperty: (imageId: string, propertyId: string, data: AssignPropertyImageToPropertyCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${imageId}/assign/property/${propertyId}`, data).then(res => res.data),

  /** إسناد الصورة للوحدة */
  assignToUnit: (imageId: string, unitId: string, data: AssignPropertyImageToUnitCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${imageId}/assign/unit/${unitId}`, data).then(res => res.data),

  /**
   * تعيين صور متعددة لعقارات
   */
  bulkAssignToProperties: (data: BulkAssignImageToPropertyCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/bulk-assign/property`, data).then(res => res.data),

  /**
   * تعيين صور متعددة لوحدات
   */
  bulkAssignToUnits: (data: BulkAssignImageToUnitCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/bulk-assign/unit`, data).then(res => res.data),

  /** جلب جميع صور العقار */
  getAll: (query: GetPropertyImagesQuery) =>
    axios.get<ResultDto<PaginatedResult<PropertyImageDto>>>(`${API_BASE}`, { params: query }).then(res => res.data),

  /** جلب إحصائيات صور عقار */
  getStats: (propertyId: string) =>
    axios.get<ResultDto<PropertyImageStatsDto>>(`${API_BASE}/${propertyId}/stats`).then(res => res.data),

  /** إعادة ترتيب صور العقار */
  reorder: (data: ReorderPropertyImagesCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/order`, data).then(res => res.data),
}; 