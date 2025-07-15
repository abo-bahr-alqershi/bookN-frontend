// أنواع بيانات المستخدمين (Users)

import type { PropertyImageDto } from './property-image.types';

export interface UserDto {
  id: string;
  name: string;
  /** دور المستخدم */
  role: string;
  email: string;
  phone: string;
  profileImage: string;
  createdAt: string;
  isActive: boolean;
  /** إعدادات المستخدم بصيغة JSON */
  settingsJson: string;
  /** قائمة المفضلة للمستخدم بصيغة JSON */
  favoritesJson: string;
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
  roleName: string;
  pageNumber?: number;
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
export interface UserLifetimeStatsDto {
  totalNightsStayed: number;
  totalMoneySpent: number;
  favoriteCity: string;
}

export interface GetUserRolesQuery {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * استعلام للحصول على بيانات المستخدم الحالي
 * Query to get current logged-in user data
 */
export interface GetCurrentUserQuery {}

export interface UpdateUserFavoritesCommand {
  favoritesJson: string;
}

export interface UpdateUserProfilePictureCommand {
  userId: string;
  profileImageUrl: string;
}

export interface UpdateUserSettingsCommand {
  settingsJson: string;
}

export interface LoyaltyProgressDto {
  currentTier: string;
  nextTier: string;
  amountNeededForNextTier: number;
}

export interface OwnerRegistrationResultDto {
  userId: string;
  propertyId: string;
}

/**
 * استعلام لجلب مستخدم بواسطة البريد الإلكتروني
 */
export interface GetUserByEmailQuery {
  email: string;
}

/**
 * أمر لتسجيل مالك عقار جديد مع بيانات العقار الكاملة والحقول الديناميكية
 */
export interface RegisterPropertyOwnerCommand {
  /** اسم المالك */
  name: string;
  /** بريد المالك الإلكتروني */
  email: string;
  /** كلمة مرور المالك */
  password: string;
  /** رقم هاتف المالك */
  phone: string;
  /** رابط صورة الملف الشخصي (اختياري) */
  profileImage?: string;
  /** معرف نوع العقار */
  propertyTypeId: string;
  /** اسم العقار */
  propertyName: string;
  /** وصف العقار (اختياري) */
  description?: string;
  /** عنوان العقار */
  address: string;
  /** المدينة */
  city: string;
  /** خط العرض (اختياري) */
  latitude?: number;
  /** خط الطول (اختياري) */
  longitude?: number;
  /** تقييم النجوم */
  starRating: number;
  /** الصور الأولية للعقار (اختياري) */
  initialImages?: PropertyImageDto[];
}