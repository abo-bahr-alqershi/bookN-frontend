import axios from 'axios';
import type { SystemSettingsDto } from '../types/system-settings.types';
import type { ResultDto } from '../types/common.types';

const API_BASE = '/api/admin/system-settings';

/**
 * خدمات إعدادات النظام
 */
export const SystemSettingsService = {
  /** جلب إعدادات النظام */
  getSettings: () =>
    axios.get<ResultDto<SystemSettingsDto>>(API_BASE).then(res => res.data),

  /** حفظ أو تحديث إعدادات النظام */
  saveSettings: (settings: SystemSettingsDto) =>
    axios.put<ResultDto<boolean>>(API_BASE, settings).then(res => res.data),
}; 