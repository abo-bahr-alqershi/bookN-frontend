// خدمات الخدمات (Services Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
import type {
  ServiceDto,
  ServiceDetailsDto,
  CreateServiceCommand,
  UpdateServiceCommand,
  DeleteServiceCommand,
  GetPropertyServicesQuery,
  GetServiceByIdQuery,
  GetServicesByTypeQuery,
} from '../types/service.types';

// خدمات إدارة خدمات العقارات للمدراء
export const ServicesService = {
  /** جلب خدمات عقار معين */
  getByProperty: (query: GetPropertyServicesQuery) =>
    axios.get<ResultDto<ServiceDto[]>>(`/api/admin/PropertyServices/property/${query.propertyId}`)
      .then(res => res.data),

  /** جلب خدمة حسب المعرف */
  getById: (query: GetServiceByIdQuery) =>
    axios.get<ResultDto<ServiceDetailsDto>>(`/api/admin/PropertyServices/${query.serviceId}`)
      .then(res => res.data),

  /** إنشاء خدمة جديدة */
  create: (data: CreateServiceCommand) =>
    axios.post<ResultDto<string>>('/api/admin/PropertyServices', data)
      .then(res => res.data),

  /** تحديث خدمة */
  update: (serviceId: string, data: UpdateServiceCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/PropertyServices/${serviceId}`, data)
      .then(res => res.data),

  /** حذف خدمة */
  delete: (serviceId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/PropertyServices/${serviceId}`)
      .then(res => res.data),

  /** جلب الخدمات حسب النوع مع صفحات */
  getByType: (query: GetServicesByTypeQuery) =>
    axios.get<PaginatedResult<ServiceDto>>(
      `/api/admin/PropertyServices/type/${query.serviceType}`,
      { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }
    )
    .then(res => res.data),
};
