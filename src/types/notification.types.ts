// أنواع بيانات الإشعارات (Notifications)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات الإشعار الأساسية
 */
export interface NotificationDto {
  /** معرف الإشعار */
  id: string;
  /** نوع الإشعار */
  type: string;
  /** عنوان الإشعار */
  title: string;
  /** محتوى الإشعار */
  message: string;
  /** أولوية الإشعار */
  priority: string;
  /** حالة الإشعار */
  status: string;
  /** معرف المستلم */
  recipientId: string;
  /** اسم المستلم */
  recipientName: string;
  /** معرف المرسل (اختياري) */
  senderId?: string;
  /** اسم المرسل (اختياري) */
  senderName?: string;
  /** هل تم قراءة الإشعار */
  isRead: boolean;
  /** تاريخ القراءة (اختياري) */
  readAt?: string;
  /** تاريخ الإنشاء */
  createdAt: string;
}

/**
 * أمر إنشاء إشعار جديد
 */
export interface CreateNotificationCommand {
  type: string;
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
}

/**
 * استعلام جلب إشعارات النظام مع التصفية والصفحات
 */
export interface GetSystemNotificationsQuery {
  notificationType?: string;
  pageNumber?: number;
  pageSize?: number;
  recipientId?: string;
  status?: string;
  sentAfter?: string;
  sentBefore?: string;
  sortBy?: string;
}

/**
 * استعلام جلب إشعارات مستخدم مع التصفية والصفحات
 */
export interface GetUserNotificationsQuery {
  userId: string;
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
  notificationType?: string;
  sentAfter?: string;
  sentBefore?: string;
  sortBy?: string;
}
