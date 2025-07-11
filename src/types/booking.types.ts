// أنواع بيانات الحجوزات (Bookings)
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

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
  id: string;
  bookingId: string;
  amount: MoneyDto;
  transactionId: string;
  // ... أكمل بقية الحقول حسب الحاجة
}

export interface ServiceDto {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  // ... أكمل بقية الحقول حسب الحاجة
}
