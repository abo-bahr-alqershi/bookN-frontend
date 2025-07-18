import { apiClient } from './api.service';
import type {
  CreateNotificationCommand,
  GetSystemNotificationsQuery,
  GetUserNotificationsQuery,
  NotificationDto,
} from '../types/notification.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// خدمات الإشعارات لأصحاب الكيانات (Property Notifications Service)
export const PropertyNotificationsService = {
  /** إنشاء إشعار جديد */
  create: (data: CreateNotificationCommand) =>
    apiClient.post<ResultDto<string>>('/api/property/Notifications', data).then(res => res.data),

  /** جلب إشعارات النظام */
  getSystem: (query?: GetSystemNotificationsQuery) =>
    apiClient.get<PaginatedResult<NotificationDto>>('/api/property/Notifications', { params: query }).then(res => res.data),

  /** جلب إشعارات المستخدم */
  getUser: (query: GetUserNotificationsQuery) =>
    apiClient.get<PaginatedResult<NotificationDto>>(`/api/property/Notifications/user/${query.userId}`, { params: query }).then(res => res.data),
}; 