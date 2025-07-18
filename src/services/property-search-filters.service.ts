import { apiClient } from './api.service';
import type { SearchFilterDto, GetSearchFiltersQuery, GetSearchFilterByIdQuery, GetSearchableFieldsQuery } from '../types/search-filter.types';
import type { UnitTypeFieldDto } from '../types/unit-type-field.types';

// خدمات فلاتر البحث لأصحاب الكيانات (Property Search Filters Service)
export const PropertySearchFiltersService = {
  /** جلب جميع فلاتر البحث */
  getAll: (query: GetSearchFiltersQuery) =>
    apiClient.get<SearchFilterDto[]>('/api/property/SearchFilters', { params: query }).then(res => res.data),

  /** جلب فلتر بحث حسب المعرف */
  getById: (query: GetSearchFilterByIdQuery) =>
    apiClient.get<SearchFilterDto>(`/api/property/SearchFilters/${query.filterId}`).then(res => res.data),

  /** جلب الحقول القابلة للبحث */
  getSearchableFields: (query: GetSearchableFieldsQuery) =>
    apiClient.get<UnitTypeFieldDto[]>('/api/property/SearchFilters/searchable-fields', { params: query }).then(res => res.data),
}; 