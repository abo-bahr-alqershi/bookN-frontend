import axios from 'axios';
import type {
  AmenityDto,
  CreateAmenityCommand,
  UpdateAmenityCommand,
  AssignAmenityToPropertyCommand,
  AssignAmenityToPropertyTypeCommand,
  UpdatePropertyAmenityCommand,
  ResultDto,
  PaginatedResult,
} from '../types/amenity.types';

const API_BASE = '/api/admin/amenities';

export const AmenitiesService = {
  // إنشاء مرفق جديد
  createAmenity: (data: CreateAmenityCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث مرفق
  updateAmenity: (amenityId: string, data: UpdateAmenityCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${amenityId}`, data),

  // حذف مرفق
  deleteAmenity: (amenityId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${amenityId}`),

  // جلب جميع المرافق مع صفحات
  getAllAmenities: (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }) =>
    axios.get<PaginatedResult<AmenityDto>>(`${API_BASE}`, { params }),

  // جلب مرافق بناءً على معرف العقار
  getAmenitiesByProperty: (propertyId: string) =>
    axios.get<ResultDto<AmenityDto[]>>(`${API_BASE}/property/${propertyId}`),

  // جلب مرافق بناءً على نوع العقار
  getAmenitiesByPropertyType: (propertyTypeId: string) =>
    axios.get<ResultDto<AmenityDto[]>>(`${API_BASE}/type/${propertyTypeId}`),

  // إسناد مرفق لعقار
  assignAmenityToProperty: (amenityId: string, propertyId: string, data: AssignAmenityToPropertyCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${amenityId}/assign/property/${propertyId}`, data),

  // تخصيص مرفق لنوع العقار
  assignAmenityToPropertyType: (amenityId: string, propertyTypeId: string, data: AssignAmenityToPropertyTypeCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${amenityId}/assign/property-type/${propertyTypeId}`, data),

  // تحديث حالة وتكلفة المرفق لعقار
  updatePropertyAmenity: (amenityId: string, propertyId: string, data: UpdatePropertyAmenityCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${amenityId}/update/property/${propertyId}`, data),
};
