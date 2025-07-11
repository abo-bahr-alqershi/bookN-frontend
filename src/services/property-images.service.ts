import axios from 'axios';
import type {
  PropertyImageDto,
  CreatePropertyImageCommand,
  UpdatePropertyImageCommand,
  DeletePropertyImageCommand,
  AssignPropertyImageToPropertyCommand,
  AssignPropertyImageToUnitCommand,
  GetPropertyImagesQuery,
  PropertyImageStatsDto,
} from '../types/property-image.types';
import type { ResultDto } from '../types/amenity.types';

// خدمات صور العقارات والوحدات لأصحاب العقارات
export const PropertyImagesService = {
  /** إنشاء صورة جديدة */
  create: (data: CreatePropertyImageCommand) =>
    axios.post<ResultDto<string>>('/api/property/PropertyImages', data).then(res => res.data),

  /** تحديث بيانات صورة */
  update: (imageId: string, data: UpdatePropertyImageCommand) =>
    axios.put<ResultDto<boolean>>(`/api/property/PropertyImages/${imageId}`, data).then(res => res.data),

  /** حذف صورة */
  delete: (imageId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/property/PropertyImages/${imageId}`).then(res => res.data),

  /** تعيين صورة لعقار */
  assignToProperty: (imageId: string, propertyId: string, data: AssignPropertyImageToPropertyCommand) =>
    axios.post<ResultDto<boolean>>(`/api/property/PropertyImages/${imageId}/assign/property/${propertyId}`, data).then(res => res.data),

  /** تعيين صورة لوحدة */
  assignToUnit: (imageId: string, unitId: string, data: AssignPropertyImageToUnitCommand) =>
    axios.post<ResultDto<boolean>>(`/api/property/PropertyImages/${imageId}/assign/unit/${unitId}`, data).then(res => res.data),

  /** جلب جميع الصور حسب استعلام */
  getAll: (query: GetPropertyImagesQuery) =>
    axios.get<ResultDto<PropertyImageDto[]>>('/api/property/PropertyImages', { params: query }).then(res => res.data),

  /** جلب إحصائيات صور عقار */
  getStats: (propertyId: string) =>
    axios.get<ResultDto<PropertyImageStatsDto>>(`/api/property/PropertyImages/${propertyId}/stats`).then(res => res.data),
}; 