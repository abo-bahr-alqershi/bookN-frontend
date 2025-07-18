import { apiClient } from './api.service';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type { AmenityDto, GetAllAmenitiesQuery, GetAmenitiesByPropertyQuery, GetAmenitiesByPropertyTypeQuery, AssignAmenityToPropertyCommand, UpdatePropertyAmenityCommand } from '../types/amenity.types';

// خدمات إدارة المرافق لأصحاب الكيانات (Property Amenities Service)
export const PropertyAmenitiesService = {
  /** جلب جميع المرافق مع صفحات */
  getAll: (query: GetAllAmenitiesQuery) =>
    apiClient.get<PaginatedResult<AmenityDto>>('/api/property/Amenities', { params: query }).then(res => res.data),

  /** جلب مرافق كيان معين */
  getByProperty: (query: GetAmenitiesByPropertyQuery) =>
    apiClient.get<ResultDto<AmenityDto[]>>(`/api/property/Amenities/property/${query.propertyId}`, { params: query }).then(res => res.data),

  /** جلب مرافق حسب نوع الكيان */
  getByPropertyType: (query: GetAmenitiesByPropertyTypeQuery) =>
    apiClient.get<ResultDto<AmenityDto[]>>(`/api/property/Amenities/type/${query.propertyTypeId}`, { params: query }).then(res => res.data),

  /** إسناد مرفق لكيان */
  assign: (data: AssignAmenityToPropertyCommand) =>
    apiClient.post<ResultDto<boolean>>(`/api/property/Amenities/${data.amenityId}/assign/${data.propertyId}`, data).then(res => res.data),

  /** تحديث حالة وتكلفة مرفق لكيان */
  updateProperty: (amenityId: string, propertyId: string, data: UpdatePropertyAmenityCommand) =>
    apiClient.put<ResultDto<boolean>>(`/api/property/Amenities/${amenityId}/update/property/${propertyId}`, data).then(res => res.data),
}; 