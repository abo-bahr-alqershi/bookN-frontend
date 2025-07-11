import axios from 'axios';
import type {
  CreateNotificationCommand,
  GetSystemNotificationsQuery,
  GetUserNotificationsQuery,
  NotificationDto,
} from '../types/notification.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// خدمات الإشعارات لأصحاب العقارات (Property Notifications Service)
export const PropertyNotificationsService = {
  /** إنشاء إشعار جديد */
  create: (data: CreateNotificationCommand) =>
    axios.post<ResultDto<string>>('/api/property/Notifications', data).then(res => res.data),

  /** جلب إشعارات النظام */
  getSystem: (query?: GetSystemNotificationsQuery) =>
    axios.get<PaginatedResult<NotificationDto>>('/api/property/Notifications', { params: query }).then(res => res.data),

  /** جلب إشعارات المستخدم */
  getUser: (query: GetUserNotificationsQuery) =>
    axios.get<PaginatedResult<NotificationDto>>(`/api/property/Notifications/user/${query.userId}`, { params: query }).then(res => res.data),
}; 