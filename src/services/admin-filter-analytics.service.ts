// خدمات احصائيات الفلاتر الديناميكية للوحدات للإدمن
import { apiClient } from './api.service';
import type { ResultDto } from '../types/common.types';
import type { FieldFilterAnalyticsDto, GetUnitDynamicFilterAnalyticsQuery } from '../types/filter-analytics.types';

const API_BASE = '/api/admin/search-analytics/unit-dynamic-filters';

export const AdminFilterAnalyticsService = {
  /**
   * جلب احصائيات الفلاتر الديناميكية للوحدات
   */
  getUnitDynamicFilterAnalytics: (query: GetUnitDynamicFilterAnalyticsQuery) =>
    apiClient.get<ResultDto<FieldFilterAnalyticsDto[]>>(API_BASE, { params: query }).then(res => res.data),
}; 