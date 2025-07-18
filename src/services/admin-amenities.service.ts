import { apiClient } from './api.service';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type { GetAllAmenitiesQuery, GetAmenitiesByPropertyQuery, GetAmenitiesByPropertyTypeQuery, AmenityDto, CreateAmenityCommand, UpdateAmenityCommand, AssignAmenityToPropertyCommand, AssignAmenityToPropertyTypeCommand, UpdatePropertyAmenityCommand } from '../types/amenity.types';

const API_BASE = '/api/admin/amenities';

export const AdminAmenitiesService = {
  // إنشاء مرفق جديد
  createAmenity: (data: CreateAmenityCommand) =>
    apiClient.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث مرفق
  updateAmenity: (amenityId: string, data: UpdateAmenityCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/${amenityId}`, data),

  // حذف مرفق
  deleteAmenity: (amenityId: string) =>
    apiClient.delete<ResultDto<boolean>>(`${API_BASE}/${amenityId}`),

  // جلب جميع المرافق مع صفحات
  getAllAmenities: (query?: GetAllAmenitiesQuery) =>
    apiClient.get<PaginatedResult<AmenityDto>>(`${API_BASE}`, { params: query }),

  // جلب مرافق بناءً على معرف الكيان
  getAmenitiesByProperty: (query: GetAmenitiesByPropertyQuery) =>
    apiClient.get<ResultDto<AmenityDto[]>>(`${API_BASE}/property/${query.propertyId}`, { params: query }),

  // جلب مرافق بناءً على نوع الكيان
  getAmenitiesByPropertyType: (query: GetAmenitiesByPropertyTypeQuery) =>
    apiClient.get<ResultDto<AmenityDto[]>>(`${API_BASE}/type/${query.propertyTypeId}`, { params: query }),

  // إسناد مرفق لكيان
  assignAmenityToProperty: (amenityId: string, propertyId: string, data: AssignAmenityToPropertyCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/${amenityId}/assign/property/${propertyId}`, data),

  // تخصيص مرفق لنوع الكيان
  assignAmenityToPropertyType: (amenityId: string, propertyTypeId: string, data: AssignAmenityToPropertyTypeCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/${amenityId}/assign/property-type/${propertyTypeId}`, data),

  // تحديث حالة وتكلفة المرفق لكيان
  updatePropertyAmenity: (amenityId: string, propertyId: string, data: UpdatePropertyAmenityCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/${amenityId}/update/property/${propertyId}`, data),
};
