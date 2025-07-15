import { apiClient } from './api.service';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type {
  ServiceDto,
  ServiceDetailsDto,
  GetPropertyServicesQuery,
  GetServiceByIdQuery,
  GetServicesByTypeQuery,
  CreatePropertyServiceCommand,
  UpdatePropertyServiceCommand,
  DeletePropertyServiceCommand,
} from '../types/service.types';

// المسار الأساسي لخدمة خدمات العقار للإدمن
const API_BASE = '/api/admin/propertyservices';

/**
 * خدمات إدارة خدمات العقارات للإدمن
 */
export const AdminPropertyServicesService = {
  /** إنشاء خدمة جديدة لعقار */
  create: (data: CreatePropertyServiceCommand) =>
    apiClient.post<ResultDto<string>>(API_BASE, data).then(res => res.data),

  /** تحديث خدمة عقار */
  update: (serviceId: string, data: UpdatePropertyServiceCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/${serviceId}`, data).then(res => res.data),

  /** حذف خدمة عقار */
  delete: (serviceId: string) =>
    apiClient.delete<ResultDto<boolean>>(`${API_BASE}/${serviceId}`).then(res => res.data),

  /** جلب خدمات عقار معين */
  getByProperty: (query: GetPropertyServicesQuery) =>
    apiClient.get<ResultDto<ServiceDto[]>>(
      `${API_BASE}/property/${query.propertyId}`
    ).then(res => res.data),

  /** جلب خدمة عقار بحسب المعرف */
  getById: (query: GetServiceByIdQuery) =>
    apiClient.get<ResultDto<ServiceDetailsDto>>(
      `${API_BASE}/${query.serviceId}`
    ).then(res => res.data),

  /** جلب الخدمات حسب النوع */
  getByType: (query: GetServicesByTypeQuery) =>
    apiClient.get<PaginatedResult<ServiceDto>>(
      `${API_BASE}/type/${query.serviceType}`,
      { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }
    ).then(res => res.data),
}; 