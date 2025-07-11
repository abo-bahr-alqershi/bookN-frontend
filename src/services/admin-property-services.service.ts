import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
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
    axios.post<ResultDto<string>>(API_BASE, data).then(res => res.data),

  /** تحديث خدمة عقار */
  update: (serviceId: string, data: UpdatePropertyServiceCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${serviceId}`, data).then(res => res.data),

  /** حذف خدمة عقار */
  delete: (serviceId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${serviceId}`).then(res => res.data),

  /** جلب خدمات عقار معين */
  getByProperty: (query: GetPropertyServicesQuery) =>
    axios.get<ResultDto<ServiceDto[]>>(
      `${API_BASE}/property/${query.propertyId}`
    ).then(res => res.data),

  /** جلب خدمة عقار بحسب المعرف */
  getById: (query: GetServiceByIdQuery) =>
    axios.get<ResultDto<ServiceDetailsDto>>(
      `${API_BASE}/${query.serviceId}`
    ).then(res => res.data),

  /** جلب الخدمات حسب النوع */
  getByType: (query: GetServicesByTypeQuery) =>
    axios.get<PaginatedResult<ServiceDto>>(
      `${API_BASE}/type/${query.serviceType}`,
      { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }
    ).then(res => res.data),
}; 