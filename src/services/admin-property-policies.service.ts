import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
import type {
  PolicyDto,
  PolicyDetailsDto,
  CreatePropertyPolicyCommand,
  UpdatePropertyPolicyCommand,
  DeletePropertyPolicyCommand,
  GetPropertyPoliciesQuery,
  GetPolicyByIdQuery,
  GetPoliciesByTypeQuery,
} from '../types/policy.types';

// خدمات إدارة سياسات العقارات للمدراء (Policies Service)
export const AdminPropertyPoliciesService = {
  /** جلب جميع سياسات عقار معين */
  getByProperty: (query: GetPropertyPoliciesQuery) =>
    axios.get<ResultDto<PolicyDto[]>>('/api/admin/PropertyPolicies', { params: query }).then(res => res.data),

  /** جلب تفاصيل سياسة بواسطة المعرف */
  getById: (query: GetPolicyByIdQuery) =>
    axios.get<ResultDto<PolicyDetailsDto>>(`/api/admin/PropertyPolicies/${query.policyId}`).then(res => res.data),

  /** إنشاء سياسة جديدة للعقار */
  create: (data: CreatePropertyPolicyCommand) =>
    axios.post<ResultDto<string>>('/api/admin/PropertyPolicies', data).then(res => res.data),

  /** تحديث سياسة */
  update: (policyId: string, data: UpdatePropertyPolicyCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/PropertyPolicies/${policyId}`, data).then(res => res.data),

  /** حذف سياسة */
  delete: (policyId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/PropertyPolicies/${policyId}`).then(res => res.data),

  /** جلب السياسات حسب النوع مع صفحات */
  getByType: (query: GetPoliciesByTypeQuery) =>
    axios.get<PaginatedResult<PolicyDto>>('/api/admin/PropertyPolicies/by-type', { params: query }).then(res => res.data),
};
