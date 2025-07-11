// أنواع بيانات المستخدمين (Users)

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  createdAt: string; // ISO date
  isActive: boolean;
}

export interface CreateUserCommand {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
}

export interface UpdateUserCommand {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ActivateUserCommand {
  userId: string;
}

export interface DeactivateUserCommand {
  userId: string;
}

export interface GetAllUsersQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  isAscending?: boolean;
  roleId?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  loyaltyTier?: string;
  minTotalSpent?: number;
}

export interface SearchUsersQuery {
  searchTerm: string;
  filterCriteria?: string;
  pageNumber?: number;
  pageSize?: number;
  roleId?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  loyaltyTier?: string;
  minTotalSpent?: number;
  sortBy?: string;
}

/**
 * استعلام جلب بيانات مستخدم بواسطة المعرف
 */
export interface GetUserByIdQuery {
  /** معرف المستخدم */
  userId: string;
}

/**
 * أمر تخصيص دور للمستخدم
 */
export interface AssignUserRoleCommand {
  /** معرف المستخدم */
  userId: string;
  /** معرف الدور */
  roleId: string;
}

/**
 * استعلام جلب المستخدمين حسب الدور
 */
export interface GetUsersByRoleQuery {
  /** اسم الدور */
  roleName: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام سجلات نشاط المستخدم
 */
export interface GetUserActivityLogQuery {
  /** معرف المستخدم */
  userId: string;
  /** تاريخ البداية (ISO) */
  from?: string;
  /** تاريخ النهاية (ISO) */
  to?: string;
}

/**
 * استعلام إحصائيات المستخدم مدى الحياة
 */
export interface GetUserLifetimeStatsQuery {
  /** معرف المستخدم */
  userId: string;
}

/**
 * استعلام إشعارات المستخدم
 */
export interface GetUserNotificationsQuery {
  /** معرف المستخدم */
  userId: string;
  /** حالة الإشعار (مقروء/غير مقروء) */
  isRead?: boolean;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
  /** فلترة بنوع الإشعار */
  notificationType?: string;
  /** فلترة بتاريخ الإرسال بعد */
  sentAfter?: string;
  /** فلترة بتاريخ الإرسال قبل */
  sentBefore?: string;
  /** خيارات الترتيب */
  sortBy?: string;
}

/**
 * استعلام إرجاع أدوار المستخدم
 */
export interface GetUserRolesQuery {
  /** معرف المستخدم */
  userId: string;
}
