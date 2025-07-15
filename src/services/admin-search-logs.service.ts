import { apiClient } from './api.service';
import type { PaginatedResult } from '../types/common.types';
import type { SearchLogDto, GetSearchLogsQuery } from '../types/search-log.types';

/**
 * خدمات إدارة سجلات البحث للإدمن
 */
const API_BASE = '/api/admin/search-logs';

export const AdminSearchLogsService = {
  /**
   * جلب سجلات البحث مع الفلترة والصفحات
   */
  getSearchLogs: (query: GetSearchLogsQuery) =>
    apiClient.get<PaginatedResult<SearchLogDto>>(API_BASE, { params: query }).then(res => res.data),
}; 