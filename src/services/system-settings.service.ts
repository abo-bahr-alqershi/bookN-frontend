import { apiClient } from './api.service';
import type { SystemSettingsDto } from '../types/system-settings.types';
import type { ResultDto } from '../types/common.types';

const API_BASE = '/api/admin/system-settings';

/**
 * خدمات إعدادات النظام
 */
export const SystemSettingsService = {
  /** جلب إعدادات النظام */
  getSettings: () =>
    apiClient.get<ResultDto<SystemSettingsDto>>(API_BASE).then(res => res.data),

  /** حفظ أو تحديث إعدادات النظام */
  saveSettings: (settings: SystemSettingsDto) =>
    apiClient.put<ResultDto<boolean>>(API_BASE, settings).then(res => res.data),
}; 