import axios from 'axios';
import type {
  NotificationDto,
  CreateNotificationCommand,
  GetSystemNotificationsQuery,
  GetUserNotificationsQuery,
} from '../types/notification.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// خدمات الإشعارات (Notifications Service)
export const AdminNotificationsService = {
  /** إنشاء إشعار جديد */
  create: (data: CreateNotificationCommand) =>
    axios.post<ResultDto<string>>('/api/admin/Notifications', data).then(res => res.data),

  /** جلب إشعارات النظام مع التصفية والصفحات */
  getSystemNotifications: (query?: GetSystemNotificationsQuery) =>
    axios.get<PaginatedResult<NotificationDto>>('/api/admin/Notifications', { params: query }).then(res => res.data),

  /** جلب إشعارات مستخدم مع التصفية والصفحات */
  getUserNotifications: (query: GetUserNotificationsQuery) => {
    const { userId, ...params } = query;
    return axios
      .get<PaginatedResult<NotificationDto>>(`/api/admin/Notifications/user/${userId}`, { params })
      .then(res => res.data);
  },
};
