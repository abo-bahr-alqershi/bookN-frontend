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
import type { UnitTypeFieldDto } from '../types/unit-type.types';
import type { ResultDto } from '../types/amenity.types';

// المسار الأساسي لتعاملات فلاتر البحث للمدراء
const API_BASE = '/api/admin/searchfilters';

export const AdminSearchFiltersService = {
  // إنشاء فلتر بحث جديد
  create: (data: CreateSearchFilterCommand) =>
    axios.post<ResultDto<string>>(API_BASE, data).then(res => res.data),

  // تحديث فلتر بحث
  update: (filterId: string, data: UpdateSearchFilterCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${filterId}`, data).then(res => res.data),

  // حذف فلتر بحث
  delete: (filterId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${filterId}`).then(res => res.data),

  // تبديل حالة تفعيل فلتر بحث
  toggleStatus: (filterId: string, data: ToggleSearchFilterStatusCommand) =>
    axios.patch<ResultDto<boolean>>(`${API_BASE}/${filterId}/toggle-status`, data).then(res => res.data),

  // جلب جميع فلاتر البحث لنوع عقار معين
  getAll: (params?: GetSearchFiltersQuery) =>
    axios.get<SearchFilterDto[]>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب فلتر بحث بواسطة المعرف
  getById: (filterId: string) =>
    axios.get<ResultDto<SearchFilterDto>>(`${API_BASE}/${filterId}`).then(res => res.data),

  // جلب الحقول القابلة للبحث لنوع عقار معين
  getSearchableFields: (params?: GetSearchableFieldsQuery) =>
    axios.get<UnitTypeFieldDto[]>(`${API_BASE}/searchable-fields`, { params }).then(res => res.data),
};