import { apiClient } from './api.service';
import type { ResultDto } from '../types/common.types';
import type { SearchAnalyticsDto, GetSearchAnalyticsQuery } from '../types/search-analytics.types';

/**
 * خدمات تحليلات البحث للإدمن
 */
const API_BASE = '/api/admin/search-analytics';

export const AdminSearchAnalyticsService = {
  /**
   * جلب تحليلات البحث
   */
  getSearchAnalytics: (query: GetSearchAnalyticsQuery) =>
    apiClient.get<ResultDto<SearchAnalyticsDto>>(API_BASE, { params: query }).then(res => res.data),
}; 