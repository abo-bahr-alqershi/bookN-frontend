// خدمات إجراءات الإدارة (Admin Actions Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import type { AdminActionDto } from '../types/admin-action.types';

/**
 * دوال التعامل مع إجراءات الإدارة عبر API
 */
export class AdminActionsService {
  /** جلب جميع الإجراءات */
  static async getAll(): Promise<AdminActionDto[]> {
    return fetch('/api/admin-actions').then(res => res.json());
  }

  /** جلب إجراء حسب المعرف */
  static async getById(actionId: string): Promise<AdminActionDto> {
    return fetch(`/api/admin-actions/${actionId}`).then(res => res.json());
  }
}
