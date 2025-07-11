// أنواع بيانات الحجوزات (Bookings)
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

import type { PaymentMethod, PaymentStatus } from "./payment.types";

/**
 * بيانات الحجز الأساسية
 */
export interface BookingDto {
  /** معرف الحجز */
  id: string;
  /** معرف المستخدم */
  userId: string;
  /** معرف الوحدة */
  unitId: string;
  /** تاريخ الوصول */
  checkIn: string; // ISO date
  /** تاريخ المغادرة */
  checkOut: string; // ISO date
  /** عدد الضيوف */
  guestsCount: number;
  /** السعر الإجمالي */
  totalPrice: MoneyDto;
  /** حالة الحجز */
  status: BookingStatus;
  /** تاريخ الحجز */
  bookedAt: string; // ISO date
  /** اسم المستخدم */
  userName: string;
  /** اسم الوحدة */
  unitName: string;
}

/**
 * تفاصيل الحجز (تشمل المدفوعات والخدمات)
 */
export interface BookingDetailsDto extends BookingDto {
  payments: PaymentDto[];
  services: ServiceDto[];
}

/**
 * أمر إنشاء حجز جديد
 */
export interface CreateBookingCommand {
  userId: string;
  unitId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  services?: string[];
}

/**
 * أمر تحديث بيانات الحجز
 */
export interface UpdateBookingCommand {
  bookingId: string;
  checkIn?: string;
  checkOut?: string;
  guestsCount?: number;
}

/**
 * استعلام جلب تفاصيل الحجز
 */
export interface GetBookingByIdQuery {
  bookingId: string;
}

/**
 * استعلام جلب الحجوزات حسب الحالة
 */
export interface GetBookingsByStatusQuery {
  /** حالة الحجز */
  status: BookingStatus;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * حالة الحجز (مطابقة للباك اند)
 */
export const BookingStatus = {
  Confirmed: 'Confirmed',
  Pending: 'Pending',
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  CheckedIn: 'CheckedIn',
} as const;
export type BookingStatus = keyof typeof BookingStatus;

// أنواع فرعية مستخدمة
export interface MoneyDto {
  amount: number;
  currency: string;
  formattedAmount?: string;
}

export interface PaymentDto {
  /** معرف الدفعة */
  id: string;
  /** معرف الحجز */
  bookingId: string;
  /** المبلغ المدفوع */
  amount: MoneyDto;
  /** رقم المعاملة */
  transactionId: string;
  /** طريقة الدفع */
  method: PaymentMethod;
  /** حالة الدفع */
  status: PaymentStatus;
  /** تاريخ الدفع */
  paymentDate: string; // ISO date
}

export interface ServiceDto {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  // ... أكمل بقية الحقول حسب الحاجة
}

export interface CancelBookingCommand {
  /** معرف الحجز */
  bookingId: string;
  /** سبب الإلغاء */
  cancellationReason: string;
}

/**
 * استعلام للحصول على حجوزات العقار
 */
export interface GetBookingsByPropertyQuery {
  /** معرف العقار */
  propertyId: string;
  /** تاريخ البداية (اختياري) */
  startDate?: string;
  /** تاريخ النهاية (اختياري) */
  endDate?: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
  /** معرف المستخدم للفلترة (اختياري) */
  userId?: string;
  /** معرف نوع العقار للفلترة (اختياري) */
  propertyTypeId?: string;
  /** قائمة IDs المرافق للفلترة (اختياري) */
  amenityIds?: string[];
  /** حالة الحجز للفلترة (اختياري) */
  status?: BookingStatus;
  /** حالة الدفع للفلترة (اختياري) */
  paymentStatus?: PaymentStatus;
  /** بحث باسم الضيف أو البريد الإلكتروني (اختياري) */
  guestNameOrEmail?: string;
  /** مصدر الحجز (اختياري) */
  bookingSource?: string;
  /** فلترة بالحجوزات المباشرة (اختياري) */
  isWalkIn?: boolean;
  /** السعر الأدنى (اختياري) */
  minTotalPrice?: number;
  /** عدد الضيوف الأدنى (اختياري) */
  minGuestsCount?: number;
  /** خيارات الترتيب (اختياري) */
  sortBy?: string;
}

/**
 * استعلام للحصول على حجوزات الوحدة
 */
export interface GetBookingsByUnitQuery {
  /** معرف الوحدة */
  unitId: string;
  /** تاريخ البداية (اختياري) */
  startDate?: string;
  /** تاريخ النهاية (اختياري) */
  endDate?: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام للحصول على حجوزات المستخدم
 */
export interface GetBookingsByUserQuery {
  /** معرف المستخدم */
  userId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
  /** حالة الحجز (اختياري) */
  status?: BookingStatus;
  /** بحث باسم الضيف أو البريد الإلكتروني (اختياري) */
  guestNameOrEmail?: string;
  /** فلترة بالوحدة (اختياري) */
  unitId?: string;
  /** مصدر الحجز (اختياري) */
  bookingSource?: string;
  /** فلترة بالحجوزات المباشرة (اختياري) */
  isWalkIn?: boolean;
  /** السعر الأدنى (اختياري) */
  minTotalPrice?: number;
  /** عدد الضيوف الأدنى (اختياري) */
  minGuestsCount?: number;
  /** خيارات الترتيب (اختياري) */
  sortBy?: string;
}

/**
 * استعلام للحصول على خدمات الحجز
 */
export interface GetBookingServicesQuery {
  /** معرف الحجز */
  bookingId: string;
}

/**
 * استعلام للحصول على الحجوزات في نطاق زمني
 */
export interface GetBookingsByDateRangeQuery {
  /** تاريخ البداية */
  startDate: string;
  /** تاريخ النهاية */
  endDate: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
  /** معرف المستخدم للفلترة (اختياري) */
  userId?: string;
  /** بحث باسم الضيف أو البريد الإلكتروني (اختياري) */
  guestNameOrEmail?: string;
  /** فلترة بالوحدة (اختياري) */
  unitId?: string;
  /** مصدر الحجز (اختياري) */
  bookingSource?: string;
  /** فلترة بالحجوزات المباشرة (اختياري) */
  isWalkIn?: boolean;
  /** السعر الأدنى (اختياري) */
  minTotalPrice?: number;
  /** عدد الضيوف الأدنى (اختياري) */
  minGuestsCount?: number;
  /** خيارات الترتيب (اختياري) */
  sortBy?: string;
}

/**
 * استعلام تقرير الحجوزات
 */
export interface GetBookingReportQuery {
  /** تاريخ البداية */
  startDate: string;
  /** تاريخ النهاية */
  endDate: string;
  /** معرف العقار (اختياري) */
  propertyId?: string;
}

/**
 * نطاق زمني للتقارير والاتجاهات
 */
export interface DateRangeDto {
  /** تاريخ البداية */
  startDate: string;
  /** تاريخ النهاية */
  endDate: string;
}

/**
 * استعلام لاتجاهات الحجوزات كسلسلة زمنية
 */
export interface GetBookingTrendsQuery {
  /** معرف العقار (اختياري) */
  propertyId?: string;
  /** النطاق الزمني للاتجاهات */
  range: DateRangeDto;
}

/**
 * استعلام لتحليل نافذة الحجوزات لعقار
 */
export interface GetBookingWindowAnalysisQuery {
  /** معرف العقار */
  propertyId: string;
}

/**
 * عنصر تقرير الحجوزات اليومية
 */
export interface BookingReportItemDto {
  /** التاريخ */
  date: string;
  /** عدد الحجوزات في ذلك اليوم */
  count: number;
}

/**
 * تقرير الحجوزات
 */
export interface BookingReportDto {
  items: BookingReportItemDto[];
}

/**
 * بيانات نقطية زمنية للرسوم البيانية
 */
export interface TimeSeriesDataDto {
  /** التاريخ */
  date: string;
  /** القيمة */
  value: number;
}

/**
 * بيانات تحليل نافذة الحجز
 */
export interface BookingWindowDto {
  /** متوسط فترة الحجز بالأيام */
  averageLeadTimeInDays: number;
  /** عدد الحجوزات في اللحظة الأخيرة */
  bookingsLastMinute: number;
}

