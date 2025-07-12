import axios from 'axios';
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
    axios.get<ResultDto<SearchAnalyticsDto>>(API_BASE, { params: query }).then(res => res.data),
}; 