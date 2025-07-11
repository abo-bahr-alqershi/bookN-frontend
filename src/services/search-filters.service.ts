import axios from 'axios';
import type {
  SearchFilterDto,
  CreateSearchFilterCommand,
  UpdateSearchFilterCommand,
  DeleteSearchFilterCommand,
  ToggleSearchFilterStatusCommand,
  GetSearchFiltersQuery,
  GetSearchFilterByIdQuery,
  GetSearchableFieldsQuery,
} from '../types/search-filter.types';
import type { ResultDto } from '../types/amenity.types';
import type { UnitTypeFieldDto } from '../types/unit-type.types';

// خدمات إدارة فلاتر البحث للمدراء عبر API
export const SearchFiltersService = {
  /** إنشاء فلتر بحث */
  create: (data: CreateSearchFilterCommand) =>
    axios.post<ResultDto<string>>('/api/admin/SearchFilters', data).then(res => res.data),

  /** تحديث فلتر بحث */
  update: (filterId: string, data: UpdateSearchFilterCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/SearchFilters/${filterId}`, data).then(res => res.data),

  /** حذف فلتر بحث */
  delete: (filterId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/SearchFilters/${filterId}`).then(res => res.data),

  /** تبديل حالة التفعيل لفلتر بحث */
  toggleStatus: (filterId: string, data: ToggleSearchFilterStatusCommand) =>
    axios.patch<ResultDto<boolean>>(`/api/admin/SearchFilters/${filterId}/toggle-status`, data).then(res => res.data),

  /** جلب جميع فلاتر البحث لنوع عقار */
  getAll: (query: GetSearchFiltersQuery) =>
    axios.get<SearchFilterDto[]>('/api/admin/SearchFilters', { params: query }).then(res => res.data),

  /** جلب فلتر بحث حسب المعرف */
  getById: (query: GetSearchFilterByIdQuery) =>
    axios.get<ResultDto<SearchFilterDto>>(`/api/admin/SearchFilters/${query.filterId}`).then(res => res.data),

  /** جلب الحقول القابلة للبحث لنوع عقار */
  getSearchableFields: (query: GetSearchableFieldsQuery) =>
    axios.get<UnitTypeFieldDto[]>('/api/admin/SearchFilters/searchable-fields', { params: query }).then(res => res.data),
}; 